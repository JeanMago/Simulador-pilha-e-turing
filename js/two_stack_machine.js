/**
 * Simulador de Modelos de Computação - Teoria da Computação e Complexidade
 * Prof. Adão E. de Souza Filho
 * 
 * Implementação formal da Máquina de Duas Pilhas (2-Stack Machine / 2-PDA)
 */

class TwoStackMachine {
    constructor(definition = {}) {
        this.states = definition.states || ['q0', 'q_accept', 'q_reject'];
        this.initialState = definition.initialState || 'q0';
        this.acceptStates = definition.acceptStates || ['q_accept'];
        this.rejectStates = definition.rejectStates || ['q_reject'];
        this.bottomSymbol = definition.bottomSymbol || '$';
        this.transitions = definition.transitions || [];
        this.name = definition.name || 'Máquina de Duas Pilhas';
        this.description = definition.description || '';

        // Estado dinâmico da computação
        this.currentState = this.initialState;
        this.input = '';
        this.inputIndex = 0;
        this.stack1 = [this.bottomSymbol];
        this.stack2 = [this.bottomSymbol];
        this.stepCount = 0;
        this.status = 'READY'; // READY, RUNNING, ACCEPTED, REJECTED, HALTED
        this.haltReason = '';
        this.lastTransition = null;
        this.history = [];
    }

    /**
     * Inicializa a máquina com uma cadeia de entrada
     */
    reset(inputString = '') {
        this.input = String(inputString);
        this.inputIndex = 0;
        this.currentState = this.initialState;
        this.stack1 = [this.bottomSymbol];
        this.stack2 = [this.bottomSymbol];
        this.stepCount = 0;
        this.lastTransition = null;
        this.haltReason = '';

        // Avalia se o estado inicial já é de aceitação (para palavra vazia, por exemplo)
        if (this.input.length === 0 && this.acceptStates.includes(this.currentState)) {
            this.status = 'ACCEPTED';
            this.haltReason = 'Cadeia vazia aceita no estado inicial.';
        } else {
            this.status = 'READY';
        }

        this.history = [{
            step: 0,
            state: this.currentState,
            inputIndex: this.inputIndex,
            remainingInput: this.input.slice(this.inputIndex),
            stack1: [...this.stack1],
            stack2: [...this.stack2],
            transition: null,
            status: this.status,
            reason: this.haltReason
        }];

        return this.getConfiguration();
    }

    /**
     * Retorna os topos atuais de cada pilha
     */
    getTop1() {
        return this.stack1.length > 0 ? this.stack1[this.stack1.length - 1] : '';
    }

    getTop2() {
        return this.stack2.length > 0 ? this.stack2[this.stack2.length - 1] : '';
    }

    /**
     * Busca a transição aplicável para a configuração atual
     */
    findTransition() {
        const currentSymbol = this.inputIndex < this.input.length ? this.input[this.inputIndex] : '';
        const top1 = this.getTop1();
        const top2 = this.getTop2();

        // 1. Procura primeiro por transição que consome o símbolo de entrada atual
        for (const t of this.transitions) {
            if (t.fromState === this.currentState) {
                // Checa entrada: coincide com currentSymbol (e currentSymbol existe)
                const matchInput = t.readInput === currentSymbol && currentSymbol !== '';
                // Checa topos
                const matchTop1 = t.top1 === '*' || t.top1 === top1;
                const matchTop2 = t.top2 === '*' || t.top2 === top2;

                if (matchInput && matchTop1 && matchTop2) {
                    return { transition: t, consumesInput: true };
                }
            }
        }

        // 2. Procura por transição espontânea epsilon (readInput === '' ou 'ε')
        for (const t of this.transitions) {
            if (t.fromState === this.currentState) {
                const isEpsilon = t.readInput === '' || t.readInput === 'ε' || t.readInput === 'epsilon';
                const matchTop1 = t.top1 === '*' || t.top1 === top1;
                const matchTop2 = t.top2 === '*' || t.top2 === top2;

                if (isEpsilon && matchTop1 && matchTop2) {
                    return { transition: t, consumesInput: false };
                }
            }
        }

        return null;
    }

    /**
     * Aplica uma nova cadeia no topo da pilha
     * Se writeSpec for '' ou 'ε', faz pop.
     * Se for um símbolo igual ao topo, mantém.
     * Se for múltiplos símbolos (ex: 'A B'), empilha da direita para esquerda para que o primeiro seja o novo topo.
     */
    applyStackOperation(stack, currentTop, writeSpec) {
        // Se a especificação for manter o topo ('*' ou igual ao topo atual)
        if (writeSpec === '*' || writeSpec === currentTop) {
            return;
        }

        // Primeiro remove o topo atual (se houver) para substituição
        if (stack.length > 0) {
            stack.pop();
        }

        if (!writeSpec || writeSpec === '' || writeSpec === 'ε' || writeSpec === 'epsilon') {
            // Operação de pop concluída
            return;
        }

        // Divide a especificação em símbolos
        const rawSymbols = writeSpec.trim().split(/\s+/).filter(Boolean);
        // Substitui qualquer '*' pelo topo original (currentTop)
        const symbols = rawSymbols.map(s => s === '*' ? currentTop : s);

        // Para que o primeiro símbolo de symbols fique no topo, empilhamos na ordem inversa
        for (let i = symbols.length - 1; i >= 0; i--) {
            stack.push(symbols[i]);
        }
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
        const match = this.findTransition();

        if (!match) {
            // Nenhuma transição encontrada para a configuração atual
            const isInputEnded = this.inputIndex >= this.input.length;
            const isAcceptState = this.acceptStates.includes(this.currentState);

            if (isInputEnded && isAcceptState) {
                this.status = 'ACCEPTED';
                this.haltReason = `Entrada totalmente processada e máquina parou no estado de aceitação (${this.currentState}).`;
            } else if (isInputEnded) {
                this.status = 'REJECTED';
                this.haltReason = `Fim da entrada alcançado no estado (${this.currentState}), que NÃO é de aceitação, e não há mais transições.`;
            } else {
                this.status = 'REJECTED';
                this.haltReason = `Transição indefinida: estado ${this.currentState}, entrada '${this.input[this.inputIndex]}', topos [${this.getTop1()}, ${this.getTop2()}].`;
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

        const { transition, consumesInput } = match;
        const currentTop1 = this.getTop1();
        const currentTop2 = this.getTop2();

        // 1. Atualiza entrada
        const consumedChar = consumesInput ? this.input[this.inputIndex] : 'ε';
        if (consumesInput) {
            this.inputIndex++;
        }

        // 2. Modifica pilhas
        this.applyStackOperation(this.stack1, currentTop1, transition.write1);
        this.applyStackOperation(this.stack2, currentTop2, transition.write2);

        // 3. Atualiza estado
        this.currentState = transition.toState;
        this.stepCount++;
        this.lastTransition = {
            ...transition,
            consumedChar
        };

        // 4. Verifica critérios de aceitação ou rejeição imediata
        if (this.rejectStates.includes(this.currentState)) {
            this.status = 'REJECTED';
            this.haltReason = `A máquina alcançou explicitamente o estado de rejeição (${this.currentState}).`;
        } else if (this.acceptStates.includes(this.currentState) && this.inputIndex >= this.input.length) {
            this.status = 'ACCEPTED';
            this.haltReason = `Cadeia aceita com sucesso no estado de aceitação (${this.currentState}).`;
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
            inputIndex: this.inputIndex,
            remainingInput: this.input.slice(this.inputIndex),
            stack1: [...this.stack1],
            stack2: [...this.stack2],
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
            input: this.input,
            inputIndex: this.inputIndex,
            currentInputSymbol: this.inputIndex < this.input.length ? this.input[this.inputIndex] : '∅ (fim)',
            stack1: [...this.stack1],
            stack2: [...this.stack2],
            top1: this.getTop1(),
            top2: this.getTop2(),
            stepCount: this.stepCount,
            status: this.status,
            haltReason: this.haltReason,
            lastTransition: this.lastTransition,
            isAccepted: this.status === 'ACCEPTED',
            isRejected: this.status === 'REJECTED'
        };
    }
}

// Disponibiliza globalmente no browser e no Node.js
if (typeof window !== 'undefined') {
    window.TwoStackMachine = TwoStackMachine;
}
if (typeof global !== 'undefined') {
    global.TwoStackMachine = TwoStackMachine;
}
