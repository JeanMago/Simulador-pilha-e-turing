/**
 * Simulador de Modelos de Computação - Teoria da Computação e Complexidade
 * Prof. Adão E. de Souza Filho
 * 
 * Implementação formal da Máquina de Turing padrão (Turing Machine)
 */

class TuringMachine {
    constructor(definition = {}) {
        this.states = definition.states || ['q0', 'q_accept', 'q_reject'];
        this.initialState = definition.initialState || 'q0';
        this.acceptStates = definition.acceptStates || ['q_accept'];
        this.rejectStates = definition.rejectStates || ['q_reject'];
        this.blankSymbol = definition.blankSymbol || '_';
        this.transitions = definition.transitions || [];
        this.name = definition.name || 'Máquina de Turing';
        this.description = definition.description || '';

        // Estado dinâmico da computação
        this.currentState = this.initialState;
        this.tape = new Map(); // Mapa de índice inteiro -> símbolo para permitir fita infinita bidirecional
        this.headIndex = 0;
        this.stepCount = 0;
        this.status = 'READY'; // READY, RUNNING, ACCEPTED, REJECTED, HALTED
        this.haltReason = '';
        this.lastTransition = null;
        this.history = [];
        this.originalInput = '';
    }

    /**
     * Inicializa a fita com uma cadeia de entrada
     */
    reset(inputString = '') {
        this.originalInput = String(inputString);
        this.tape.clear();
        this.headIndex = 0;
        this.currentState = this.initialState;
        this.stepCount = 0;
        this.lastTransition = null;
        this.haltReason = '';

        // Preenche a fita a partir da posição 0
        if (this.originalInput.length === 0) {
            this.tape.set(0, this.blankSymbol);
        } else {
            for (let i = 0; i < this.originalInput.length; i++) {
                this.tape.set(i, this.originalInput[i]);
            }
        }

        if (this.acceptStates.includes(this.currentState)) {
            this.status = 'ACCEPTED';
            this.haltReason = 'Máquina iniciou imediatamente em estado de aceitação.';
        } else {
            this.status = 'READY';
        }

        this.history = [{
            step: 0,
            state: this.currentState,
            headIndex: this.headIndex,
            currentSymbol: this.readTape(this.headIndex),
            tapeSnapshot: this.getTapeRange(),
            transition: null,
            status: this.status,
            reason: this.haltReason
        }];

        return this.getConfiguration();
    }

    /**
     * Lê o símbolo na posição dada da fita (retorna símbolo em branco se não inicializado)
     */
    readTape(index) {
        if (!this.tape.has(index)) {
            return this.blankSymbol;
        }
        return this.tape.get(index);
    }

    /**
     * Escreve um símbolo na fita
     */
    writeTape(index, symbol) {
        this.tape.set(index, symbol);
    }

    /**
     * Retorna a faixa com células ocupadas e margem para exibição visual
     */
    getTapeRange(margin = 4) {
        let min = this.headIndex;
        let max = this.headIndex;

        for (const idx of this.tape.keys()) {
            if (idx < min) min = idx;
            if (idx > max) max = idx;
        }

        // Adiciona margem visual para fita parecer infinita
        const start = Math.min(min - margin, -margin);
        const end = Math.max(max + margin, Math.max(this.originalInput.length, 1) + margin);

        const cells = [];
        for (let i = start; i <= end; i++) {
            cells.push({
                index: i,
                symbol: this.readTape(i),
                isHead: i === this.headIndex
            });
        }

        return {
            cells,
            start,
            end,
            headIndex: this.headIndex
        };
    }

    /**
     * Procura por transição aplicável para (currentState, readSymbol)
     */
    findTransition() {
        const currentSymbol = this.readTape(this.headIndex);

        for (const t of this.transitions) {
            if (t.fromState === this.currentState) {
                // Compara símbolo exato ou coringa '*'
                if (t.readSymbol === '*' || t.readSymbol === currentSymbol) {
                    return t;
                }
            }
        }

        return null;
    }

    /**
     * Executa exatamente um passo de computação
     */
    step() {
        if (this.status === 'ACCEPTED' || this.status === 'REJECTED' || this.status === 'HALTED') {
            return {
                done: true,
                status: this.status,
                configuration: this.getConfiguration(),
                reason: this.haltReason
            };
        }

        this.status = 'RUNNING';
        const currentSymbol = this.readTape(this.headIndex);
        const transition = this.findTransition();

        if (!transition) {
            // Nenhuma transição definida para a configuração atual
            if (this.acceptStates.includes(this.currentState)) {
                this.status = 'ACCEPTED';
                this.haltReason = `Parada no estado de aceitação (${this.currentState}). Computação concluída com sucesso.`;
            } else if (this.rejectStates.includes(this.currentState)) {
                this.status = 'REJECTED';
                this.haltReason = `Parada no estado explícito de rejeição (${this.currentState}).`;
            } else {
                this.status = 'REJECTED';
                this.haltReason = `Parada por indefinição: nenhuma transição definida para o estado (${this.currentState}) com símbolo '${currentSymbol}'.`;
            }

            this.lastTransition = null;
            this.recordHistory();
            return {
                done: true,
                status: this.status,
                configuration: this.getConfiguration(),
                reason: this.haltReason
            };
        }

        // Executa a transição:
        // 1. Escreve novo símbolo
        const newSymbol = transition.writeSymbol === '*' ? currentSymbol : transition.writeSymbol;
        this.writeTape(this.headIndex, newSymbol);

        // 2. Movimenta cabeçote
        const move = String(transition.move).toUpperCase();
        if (move === 'R' || move === 'DIREITA') {
            this.headIndex++;
        } else if (move === 'L' || move === 'ESQUERDA') {
            this.headIndex--;
        }
        // Se 'S' (Stay / Neutro), permanece no mesmo índice

        // 3. Muda estado
        this.currentState = transition.toState;
        this.stepCount++;
        this.lastTransition = {
            ...transition,
            oldSymbol: currentSymbol,
            actualWrite: newSymbol
        };

        // 4. Verifica novos estados de aceitação / rejeição
        if (this.acceptStates.includes(this.currentState)) {
            this.status = 'ACCEPTED';
            this.haltReason = `A máquina atingiu o estado de aceitação (${this.currentState}).`;
        } else if (this.rejectStates.includes(this.currentState)) {
            this.status = 'REJECTED';
            this.haltReason = `A máquina atingiu o estado de rejeição (${this.currentState}).`;
        }

        this.recordHistory();

        return {
            done: this.status === 'ACCEPTED' || this.status === 'REJECTED',
            status: this.status,
            configuration: this.getConfiguration(),
            reason: this.haltReason
        };
    }

    recordHistory() {
        this.history.push({
            step: this.stepCount,
            state: this.currentState,
            headIndex: this.headIndex,
            currentSymbol: this.readTape(this.headIndex),
            tapeSnapshot: this.getTapeRange(),
            transition: this.lastTransition,
            status: this.status,
            reason: this.haltReason
        });
    }

    /**
     * Retorna a configuração instantânea da máquina
     */
    getConfiguration() {
        return {
            name: this.name,
            currentState: this.currentState,
            headIndex: this.headIndex,
            currentSymbol: this.readTape(this.headIndex),
            tapeRange: this.getTapeRange(),
            stepCount: this.stepCount,
            status: this.status,
            haltReason: this.haltReason,
            lastTransition: this.lastTransition,
            isAccepted: this.status === 'ACCEPTED',
            isRejected: this.status === 'REJECTED'
        };
    }

    /**
     * Retorna uma representação limpa em string do conteúdo ativo da fita
     */
    getTapeString() {
        let min = 0;
        let max = 0;
        for (const idx of this.tape.keys()) {
            if (idx < min) min = idx;
            if (idx > max) max = idx;
        }
        let str = '';
        for (let i = min; i <= max; i++) {
            str += this.readTape(i);
        }
        return str;
    }
}

// Disponibiliza globalmente no browser e no Node.js
if (typeof window !== 'undefined') {
    window.TuringMachine = TuringMachine;
}
if (typeof global !== 'undefined') {
    global.TuringMachine = TuringMachine;
}
