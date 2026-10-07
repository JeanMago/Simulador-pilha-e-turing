/**
 * Exemplos pré-configurados e Bateria de Testes Didáticos
 * Simulador de Modelos de Computação - Teoria da Computação e Complexidade
 * Prof. Adão E. de Souza Filho - 2026/2
 */

const EXAMPLES = {
    // =========================================================================
    // 1. MÁQUINA DE TURING (MT) - MODELOS E BATERIAS DE TESTES
    // =========================================================================
    turing: [
        {
            id: 'tm_an_bn_cn',
            name: 'Linguagem { aⁿ bⁿ cⁿ | n ≥ 1 } (Sensível ao Contexto)',
            formalDefinition: 'L = { aⁿ bⁿ cⁿ | n ≥ 1 }',
            chomskyLevel: 'Chomsky Tipo 1 — Sensível ao Contexto',
            category: 'Reconhecimento de Linguagens',
            goal: 'Verificar se a palavra é formada por exatamente n letras "a", seguidas por n letras "b" e n letras "c" em ordem rígida e contagens estritamente idênticas (ex: abc, aabbcc, aaabbbccc), rejeitando qualquer desbalanceamento ou permutação.',
            acceptanceRule: 'Cada "a" possui correspondente exato "b" e "c" (marcação X, Y, Z), e a fita atinge o fim limpa.',
            rejectionRule: 'Desbalanceamento entre as quantidades de símbolos ou caracteres fora da ordem rígida a-b-c.',
            description: 'Algoritmo clássico de marcação sequencial de âncoras (X, Y, Z). Demonstra a superação do limite dos autômatos com pilha única.',
            whyImportant: 'Esta linguagem NÃO é livre de contexto (o Lema do Bombeamento falha para 1 pilha). A Máquina de Turing consegue reconhecê-la porque pode transitar livremente para a esquerda e para a direita na fita, marcando os símbolos correspondentes.',
            strategy: [
                '1. Fase de Busca e Marcação do "a": No estado q0, lê o primeiro "a" livre, marca com "X" e move o cabeçote para a direita.',
                '2. Fase de Busca do "b": No estado q1, ignora outros "a"s e símbolos "Y" já marcados até achar o primeiro "b" livre. Marca com "Y" e continua.',
                '3. Fase de Busca do "c": No estado q2, ignora outros "b"s e símbolos "Z" já marcados até achar o primeiro "c" livre. Marca com "Z".',
                '4. Fase de Retorno (Loop): No estado q3, o trio (X, Y, Z) está formado. O cabeçote retorna para a esquerda até encontrar a âncora "X". Avança 1 célula para a direita e reinicia em q0.',
                '5. Fase de Validação Final: Quando q0 não encontra mais "a"s, entra em q4 para certificar que nenhum "b" ou "c" sobrou sem par na fita. Se chegar ao branco "_", ACEITA!'
            ],
            symbolsGuide: [
                { symbol: 'a, b, c', meaning: 'Símbolos de entrada originais ainda não processados.' },
                { symbol: 'X, Y, Z', meaning: 'Marcadores de emparelhamento (X substitui a, Y substitui b, Z substitui c).' },
                { symbol: '_', meaning: 'Célula em branco (delimita o fim da palavra na fita infinita).' }
            ],
            defaultInput: 'aabbcc',
            validTests: ['abc', 'aabbcc', 'aaabbbccc', 'aaaabbbbcccc'],
            invalidTests: ['aabbc', 'abcc', 'aabbcccd', 'baacc', 'a', 'ab', 'cba', 'abcabc'],
            stateDescriptions: {
                'q0': 'Procurando o próximo "a" livre para iniciar nova rodada de emparelhamento.',
                'q1': 'Buscando o "b" correspondente para formar o par (X, Y).',
                'q2': 'Buscando o "c" correspondente para completar o trio (X, Y, Z).',
                'q3': 'Retornando o cabeçote para a esquerda até a última âncora "X".',
                'q4': 'Conferindo se restou algum "b" ou "c" não marcado antes do fim da fita.',
                'q_accept': 'Computação concluída: todos os símbolos foram balanceados!',
                'q_reject': 'Computação rejeitada: estrutura da linguagem violada.'
            },
            verdictExplainer: {
                accept: (input, tapeStr, steps) => {
                    const n = input.length / 3;
                    return `A palavra "${input}" PERTENCE à linguagem { aⁿ bⁿ cⁿ }! A máquina formou com perfeição ${n} trios de símbolos (cada 'a' teve exatamente um 'b' e um 'c' correspondente). Todos os símbolos foram marcados como X, Y e Z sem sobras na fita.`;
                },
                reject: (input, tapeStr, steps, reason) => {
                    return `A palavra "${input}" NÃO PERTENCE à linguagem { aⁿ bⁿ cⁿ }! Houve desbalanceamento nas quantidades ou os caracteres estão fora de ordem. A máquina interrompeu a execução pois não encontrou o símbolo necessário para completar a correspondência de aⁿ bⁿ cⁿ.`;
                }
            },
            machine: {
                name: 'MT para aⁿ bⁿ cⁿ',
                states: ['q0', 'q1', 'q2', 'q3', 'q4', 'q_accept'],
                initialState: 'q0',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                blankSymbol: '_',
                transitions: [
                    { fromState: 'q0', readSymbol: 'a', toState: 'q1', writeSymbol: 'X', move: 'R', description: 'Marca "a" com X', human: 'Leu "a" livre. Marcou com "X" e avança para a DIREITA procurando o "b" correspondente.' },
                    { fromState: 'q0', readSymbol: 'Y', toState: 'q4', writeSymbol: 'Y', move: 'R', description: 'Sem mais "a"s, valida fita', human: 'Não há mais "a"s livres! Avança conferindo se todos os "b"s e "c"s também foram marcados.' },
                    { fromState: 'q1', readSymbol: 'a', toState: 'q1', writeSymbol: 'a', move: 'R', description: 'Pula "a"', human: 'Pula outro "a" ainda não marcado para alcançar a região de "b"s à direita.' },
                    { fromState: 'q1', readSymbol: 'Y', toState: 'q1', writeSymbol: 'Y', move: 'R', description: 'Pula "Y"', human: 'Pula "Y" já marcado anteriormente, continuando a busca pelo primeiro "b" livre.' },
                    { fromState: 'q1', readSymbol: 'b', toState: 'q2', writeSymbol: 'Y', move: 'R', description: 'Marca "b" com Y', human: 'Encontrou o "b" correspondente! Marcou com "Y" e avança para a DIREITA procurando o "c".' },
                    { fromState: 'q2', readSymbol: 'b', toState: 'q2', writeSymbol: 'b', move: 'R', description: 'Pula "b"', human: 'Pula outro "b" ainda não marcado para alcançar a região de "c"s à direita.' },
                    { fromState: 'q2', readSymbol: 'Z', toState: 'q2', writeSymbol: 'Z', move: 'R', description: 'Pula "Z"', human: 'Pula "Z" já marcado anteriormente, continuando a busca pelo primeiro "c" livre.' },
                    { fromState: 'q2', readSymbol: 'c', toState: 'q3', writeSymbol: 'Z', move: 'L', description: 'Marca "c" com Z', human: 'Encontrou o "c" correspondente! Marcou com "Z". Trio (X, Y, Z) formado! Agora retorna para a ESQUERDA.' },
                    { fromState: 'q3', readSymbol: 'Z', toState: 'q3', writeSymbol: 'Z', move: 'L', description: 'Volta sobre Z', human: 'Retornando para a esquerda sobre símbolos "Z".' },
                    { fromState: 'q3', readSymbol: 'b', toState: 'q3', writeSymbol: 'b', move: 'L', description: 'Volta sobre b', human: 'Retornando para a esquerda sobre símbolos "b".' },
                    { fromState: 'q3', readSymbol: 'Y', toState: 'q3', writeSymbol: 'Y', move: 'L', description: 'Volta sobre Y', human: 'Retornando para a esquerda sobre símbolos "Y".' },
                    { fromState: 'q3', readSymbol: 'a', toState: 'q3', writeSymbol: 'a', move: 'L', description: 'Volta sobre a', human: 'Retornando para a esquerda sobre símbolos "a".' },
                    { fromState: 'q3', readSymbol: 'X', toState: 'q0', writeSymbol: 'X', move: 'R', description: 'Encontra X, reinicia ciclo', human: 'Encontrou a âncora "X"! Move 1 posição para a DIREITA e reinicia o ciclo para o próximo "a".' },
                    { fromState: 'q4', readSymbol: 'Y', toState: 'q4', writeSymbol: 'Y', move: 'R', description: 'Verifica Y', human: 'Validando: símbolo "Y" devidamente emparelhado.' },
                    { fromState: 'q4', readSymbol: 'Z', toState: 'q4', writeSymbol: 'Z', move: 'R', description: 'Verifica Z', human: 'Validando: símbolo "Z" devidamente emparelhado.' },
                    { fromState: 'q4', readSymbol: '_', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Fim da fita -> ACEITA', human: 'Alcançou o final da palavra sem sobras nem símbolos estranhos! Palavra ACEITA!' }
                ]
            }
        },
        {
            id: 'tm_palindrome',
            name: 'Palíndromos Binários { w ∈ {0, 1}* | w = wᴿ }',
            formalDefinition: 'L = { w ∈ {0, 1}* | w = wᴿ }',
            chomskyLevel: 'Chomsky Tipo 0/1 — Padrão Espelhado Bidirecional',
            category: 'Reconhecimento de Simetria Espelhada',
            goal: 'Determinar se uma palavra binária possui simetria espelhada exata — isto é, se sua leitura da esquerda para a direita é idêntica à leitura da direita para a esquerda (ex: 10101, 11011, 0110, 00, 11).',
            acceptanceRule: 'Todos os bits das pontas opostas casam perfeitamente de fora para dentro até esgotar a palavra.',
            rejectionRule: 'Divergência entre o bit da ponta esquerda e o bit da ponta direita correspondente (ex: 10, 1100, 1010).',
            description: 'Compara os símbolos das extremidades opostas (início e fim) de fora para dentro, apagando-os progressivamente.',
            whyImportant: 'Demonstra a capacidade de navegação bidirecional da Máquina de Turing: ela viaja repetidamente de uma ponta a outra da palavra, usando os estados para memorizar temporariamente o símbolo lido na ponta esquerda.',
            strategy: [
                '1. Leitura Inicial: No estado q0, lê o primeiro símbolo (0 ou 1), memoriza-o no próprio estado e apaga a célula (gravando "_").',
                '2. Viagem à Direita: Nos estados q_have0 ou q_have1, corre toda a palavra para a direita até atingir o fim da fita ("_").',
                '3. Conferência da Ponta Oposta: Volta 1 célula para a esquerda e confere se o último símbolo coincide com o que foi memorizado. Se sim, apaga-o.',
                '4. Viagem de Retorno: No estado q_back, retorna para a esquerda até encontrar a célula em branco e avança 1 para reiniciar o ciclo.',
                '5. Término: Se a palavra esvaziar totalmente ou restar apenas 1 caractere no centro, ACEITA!'
            ],
            symbolsGuide: [
                { symbol: '0, 1', meaning: 'Bits da palavra a ser verificada.' },
                { symbol: '_', meaning: 'Espaço em branco (substitui os bits já verificados e casados).' }
            ],
            defaultInput: '10101',
            validTests: ['10101', '11011', '0110', '1', '0', '00', '11', '1001', '1011101'],
            invalidTests: ['10', '01', '1100', '1010', '1101', '1000', '0111'],
            stateDescriptions: {
                'q0': 'Lendo o primeiro caractere da palavra para memorizá-lo e apagá-lo.',
                'q_have0': 'Memorizou o bit 0. Navegando até a ponta direita da palavra.',
                'q_have1': 'Memorizou o bit 1. Navegando até a ponta direita da palavra.',
                'q_match0': 'Verificando se o bit da extremidade direita também é 0.',
                'q_match1': 'Verificando se o bit da extremidade direita também é 1.',
                'q_back': 'Par de extremidades casou com sucesso! Retornando ao início da palavra.',
                'q_accept': 'Palíndromo confirmado com sucesso!',
                'q_reject': 'Divergência encontrada nas extremidades: não é palíndromo.'
            },
            verdictExplainer: {
                accept: (input, tapeStr, steps) => {
                    return `A palavra "${input}" É UM PALÍNDROMO! A máquina comparou cada caractere da esquerda com seu par espelhado na direita e todos eram idênticos (0 com 0 e 1 com 1).`;
                },
                reject: (input, tapeStr, steps, reason) => {
                    return `A palavra "${input}" NÃO É UM PALÍNDROMO! Ao inspecionar os extremos, a máquina detectou caracteres diferentes (um lado tinha 0 e o outro tinha 1).`;
                }
            },
            machine: {
                name: 'MT Reconhecedora de Palíndromos Binários',
                states: ['q0', 'q_have0', 'q_have1', 'q_match0', 'q_match1', 'q_back', 'q_accept'],
                initialState: 'q0',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                blankSymbol: '_',
                transitions: [
                    { fromState: 'q0', readSymbol: '0', toState: 'q_have0', writeSymbol: '_', move: 'R', description: 'Memoriza 0', human: 'Leu "0" no início. Apagou (gravou "_") e viaja para a DIREITA para conferir o final.' },
                    { fromState: 'q0', readSymbol: '1', toState: 'q_have1', writeSymbol: '_', move: 'R', description: 'Memoriza 1', human: 'Leu "1" no início. Apagou (gravou "_") e viaja para a DIREITA para conferir o final.' },
                    { fromState: 'q0', readSymbol: '_', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Fita vazia -> ACEITA', human: 'Fita vazia ou todos os pares casados! A palavra é um palíndromo ACEITO!' },
                    { fromState: 'q_have0', readSymbol: '0', toState: 'q_have0', writeSymbol: '0', move: 'R', description: 'Pula 0', human: 'Pula "0" caminhando em direção ao final da palavra.' },
                    { fromState: 'q_have0', readSymbol: '1', toState: 'q_have0', writeSymbol: '1', move: 'R', description: 'Pula 1', human: 'Pula "1" caminhando em direção ao final da palavra.' },
                    { fromState: 'q_have0', readSymbol: '_', toState: 'q_match0', writeSymbol: '_', move: 'L', description: 'Fim atingido, volta 1', human: 'Atingiu o final da palavra! Volta 1 casa para conferir o último caractere.' },
                    { fromState: 'q_match0', readSymbol: '0', toState: 'q_back', writeSymbol: '_', move: 'L', description: 'Casou 0 com 0!', human: 'Excelente! O último símbolo é "0", casando com o primeiro! Apaga e volta ao início.' },
                    { fromState: 'q_match0', readSymbol: '_', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Centro de tamanho ímpar', human: 'Palavra de comprimento ímpar finalizada no centro! ACEITA!' },
                    { fromState: 'q_have1', readSymbol: '0', toState: 'q_have1', writeSymbol: '0', move: 'R', description: 'Pula 0', human: 'Pula "0" caminhando em direção ao final da palavra.' },
                    { fromState: 'q_have1', readSymbol: '1', toState: 'q_have1', writeSymbol: '1', move: 'R', description: 'Pula 1', human: 'Pula "1" caminhando em direção ao final da palavra.' },
                    { fromState: 'q_have1', readSymbol: '_', toState: 'q_match1', writeSymbol: '_', move: 'L', description: 'Fim atingido, volta 1', human: 'Atingiu o final da palavra! Volta 1 casa para conferir o último caractere.' },
                    { fromState: 'q_match1', readSymbol: '1', toState: 'q_back', writeSymbol: '_', move: 'L', description: 'Casou 1 com 1!', human: 'Excelente! O último símbolo é "1", casando com o primeiro! Apaga e volta ao início.' },
                    { fromState: 'q_match1', readSymbol: '_', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Centro de tamanho ímpar', human: 'Palavra de comprimento ímpar finalizada no centro! ACEITA!' },
                    { fromState: 'q_back', readSymbol: '0', toState: 'q_back', writeSymbol: '0', move: 'L', description: 'Volta sobre 0', human: 'Retornando para a esquerda sobre "0".' },
                    { fromState: 'q_back', readSymbol: '1', toState: 'q_back', writeSymbol: '1', move: 'L', description: 'Retornando para a esquerda sobre "1".' },
                    { fromState: 'q_back', readSymbol: '_', toState: 'q0', writeSymbol: '_', move: 'R', description: 'Início atingido', human: 'Início da fita alcançado! Avança 1 posição e inicia a próxima rodada.' }
                ]
            }
        },
        {
            id: 'tm_binary_inc',
            name: 'Incrementador Binário (Computação de Função x + 1)',
            formalDefinition: 'f(x) = x + 1, onde x ∈ {0, 1}⁺',
            chomskyLevel: 'Função Aritmética / Máquina Transdutora',
            category: 'Cálculo Aritmético com Carry',
            goal: 'Computar o sucessor aritmético de um número binário fornecido na fita (f(x) = x + 1), aplicando adição binária com propagação de transporte (carry) e reescrevendo a fita com o valor final.',
            acceptanceRule: 'O transporte é totalmente absorvido (ao achar bit 0) ou expande a fita à esquerda em caso de overflow.',
            rejectionRule: 'Presença de caracteres não-binários ou interrupção prematura da computação.',
            description: 'Demonstra a Máquina de Turing operando como computadora de funções aritméticas com carry digital.',
            whyImportant: 'A Máquina de Turing não serve apenas para decidir linguagens ("Sim" ou "Não"), mas também para calcular funções transformando a fita de entrada no resultado da computação.',
            strategy: [
                '1. Navegação ao LSB: No estado q_seek_end, corre para a direita até o bit menos significativo (fim do número).',
                '2. Soma com Transporte: No estado q_add, soma 1 da direita para esquerda: 1 + 1 = 0 com transporte (vai 1 para esquerda).',
                '3. Término: Ao encontrar o primeiro "0" (0 + 1 = 1) ou alcançar o início da palavra no branco "_" (overflow), grava 1 e conclui!'
            ],
            symbolsGuide: [
                { symbol: '0, 1', meaning: 'Dígitos binários da entrada e do resultado.' },
                { symbol: '_', meaning: 'Célula em branco delimitando o início e fim da representação numérica.' }
            ],
            defaultInput: '1011',
            validTests: ['1011', '111', '0', '1', '100', '1111', '1010', '110'],
            invalidTests: ['10a', 'abc', '102', '10b'],
            stateDescriptions: {
                'q_seek_end': 'Navegando até o bit menos significativo (LSB) no fim do número.',
                'q_add': 'Realizando a adição de 1 da direita para esquerda com propagação de transporte.',
                'q_accept': 'Cálculo concluído com sucesso: resultado gravado na fita!'
            },
            verdictExplainer: {
                accept: (input, tapeStr, steps) => {
                    const clean = tapeStr.replace(/_/g, '');
                    const decIn = parseInt(input, 2);
                    const decOut = parseInt(clean, 2);
                    return `Cálculo aritmético concluído com sucesso! Entrada: ${input}₂ (${decIn} em decimal) ➔ Saída na fita: ${clean}₂ (${decOut} em decimal). A Máquina de Turing funcionou como um somador digital!`;
                },
                reject: (input, tapeStr, steps, reason) => {
                    return `A computação foi interrompida antes do término do cálculo.`;
                }
            },
            machine: {
                name: 'MT Incrementadora Binária',
                states: ['q_seek_end', 'q_add', 'q_accept'],
                initialState: 'q_seek_end',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                blankSymbol: '_',
                transitions: [
                    { fromState: 'q_seek_end', readSymbol: '0', toState: 'q_seek_end', writeSymbol: '0', move: 'R', description: 'Pula 0', human: 'Navega para a direita sobre o bit "0".' },
                    { fromState: 'q_seek_end', readSymbol: '1', toState: 'q_seek_end', writeSymbol: '1', move: 'R', description: 'Pula 1', human: 'Navega para a direita sobre o bit "1".' },
                    { fromState: 'q_seek_end', readSymbol: '_', toState: 'q_add', writeSymbol: '_', move: 'L', description: 'Fim alcançado, volta ao LSB', human: 'Fim do número atingido! Volta 1 casa sobre o bit menos significativo para somar 1.' },
                    { fromState: 'q_add', readSymbol: '1', toState: 'q_add', writeSymbol: '0', move: 'L', description: '1 + 1 = 0 com transporte', human: 'Soma de bits: 1 + 1 = 0 com transporte! Escreve "0" e move para a ESQUERDA (vai 1).' },
                    { fromState: 'q_add', readSymbol: '0', toState: 'q_accept', writeSymbol: '1', move: 'S', description: '0 + 1 = 1 (sem transporte)', human: 'Soma de bits: 0 + 1 = 1 sem transporte! Escreve "1" e CONCLUI A CONTA!' },
                    { fromState: 'q_add', readSymbol: '_', toState: 'q_accept', writeSymbol: '1', move: 'S', description: 'Overflow inicial -> escreve 1', human: 'Transporte atingiu o início do número (overflow)! Escreve "1" e CONCLUI A CONTA!' }
                ]
            }
        },
        {
            id: 'tm_unary_add',
            name: 'Soma Unária { 0ⁿ 1 0ᵐ ➔ 0ⁿ⁺ᵐ | n, m ≥ 1 }',
            formalDefinition: 'f(0ⁿ 1 0ᵐ) = 0ⁿ⁺ᵐ, onde n, m ≥ 1',
            chomskyLevel: 'Manipulação Espacial de Memória',
            category: 'Transformação de Blocos na Fita',
            goal: 'Somar n + m em notação unária: converte dois blocos de zeros separados pelo dígito 1 (ex: 000100 representando 3 + 2) em um único bloco contínuo de n + m zeros (00000 = 5).',
            acceptanceRule: 'Dois blocos válidos de zeros separados por um único 1, resultando na soma compactada exata.',
            rejectionRule: 'Ausência do dígito separador 1, múltiplos separadores ou qualquer operando sem zeros (ex: 000, 100, 001).',
            description: 'Computação clássica da soma de dois números naturais representados em notação unária separados pelo dígito 1.',
            whyImportant: 'Exemplo fundamental presente em livros-texto de Teoria da Computação (Hopcroft, Sipser) que ilustra a manipulação e concatenação de blocos de símbolos na fita.',
            strategy: [
                '1. Navega sobre o primeiro bloco de zeros (n) até encontrar o separador "1".',
                '2. Substitui o separador "1" por um "0", unificando os dois blocos em um só.',
                '3. Exige pelo menos um zero no segundo bloco e navega até o fim da fita.',
                '4. Apaga o último zero (substitui por branco "_") para compensar o "1" que foi convertido em zero, restabelecendo a soma exata n + m!'
            ],
            symbolsGuide: [
                { symbol: '0', meaning: 'Contador unário (três zeros = número 3).' },
                { symbol: '1', meaning: 'Símbolo separador de adição entre os dois operandos.' },
                { symbol: '_', meaning: 'Branco delimitador de fim de fita.' }
            ],
            defaultInput: '000100',
            validTests: ['000100', '00100', '010', '00010', '00001000', '01000'],
            invalidTests: ['000', '100', '001', '00110', '110'],
            stateDescriptions: {
                'q0': 'Lendo o primeiro operando de zeros até encontrar o separador 1.',
                'q_seek_sep': 'Navegando sobre os zeros do primeiro bloco.',
                'q_check_m': 'Validando que o segundo operando possui pelo menos um zero.',
                'q1': 'Unificou os blocos! Navegando até o fim do segundo operando.',
                'q2': 'Fim atingido! Apagando o zero excedente para compensar a conversão.',
                'q_accept': 'Soma unária concluída com sucesso!'
            },
            verdictExplainer: {
                accept: (input, tapeStr, steps) => {
                    const parts = input.split('1');
                    const n = parts[0].length;
                    const m = parts[1].length;
                    const resultZeros = tapeStr.replace(/_/g, '').length;
                    return `Soma aritmética concluída com sucesso! Operação: ${n} + ${m} = ${resultZeros}. A máquina unificou os blocos e ajustou o comprimento da fita com precisão.`;
                },
                reject: (input, tapeStr, steps, reason) => {
                    return `Entrada inválida para soma unária. Formato esperado: zeros seguidos por um único 1 e mais zeros (ex: 000100).`;
                }
            },
            machine: {
                name: 'MT Somadora Unária',
                states: ['q0', 'q_seek_sep', 'q_check_m', 'q1', 'q2', 'q_accept'],
                initialState: 'q0',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                blankSymbol: '_',
                transitions: [
                    { fromState: 'q0', readSymbol: '0', toState: 'q_seek_sep', writeSymbol: '0', move: 'R', description: 'Lê primeiro 0', human: 'Confirmou primeiro operando. Avança procurando o separador "1".' },
                    { fromState: 'q_seek_sep', readSymbol: '0', toState: 'q_seek_sep', writeSymbol: '0', move: 'R', description: 'Pula 0s', human: 'Pula zeros do primeiro operando.' },
                    { fromState: 'q_seek_sep', readSymbol: '1', toState: 'q_check_m', writeSymbol: '0', move: 'R', description: 'Transforma 1 em 0', human: 'Encontrou o separador "1"! Converteu em "0" para unir os blocos e exige pelo menos um "0" à direita.' },
                    { fromState: 'q_check_m', readSymbol: '0', toState: 'q1', writeSymbol: '0', move: 'R', description: 'Confirma zero do 2º bloco', human: 'Confirmou que o segundo operando é válido (m ≥ 1). Avança até o fim da fita.' },
                    { fromState: 'q1', readSymbol: '0', toState: 'q1', writeSymbol: '0', move: 'R', description: 'Pula 0s do 2º bloco', human: 'Percorre os zeros do segundo operando até o final.' },
                    { fromState: 'q1', readSymbol: '_', toState: 'q2', writeSymbol: '_', move: 'L', description: 'Fim da fita, volta 1', human: 'Alcançou o fim do número! Volta 1 célula para remover o zero excedente.' },
                    { fromState: 'q2', readSymbol: '0', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Apaga zero extra -> SOMA PRONTA', human: 'Apagou o zero excedente! A soma unária está perfeitamente ajustada e ACEITA!' }
                ]
            }
        },
        {
            id: 'tm_parity',
            name: 'Verificador de Paridade (Número Par de 1s)',
            formalDefinition: 'L = { w ∈ {0, 1}* | |w|₁ mod 2 = 0 }',
            chomskyLevel: 'Chomsky Tipo 3 — Linguagem Regular (AFD)',
            category: 'Decisão Regular e Simulação de AFD',
            goal: 'Determinar se a contagem total de dígitos "1" na palavra binária é PAR (incluindo palavras com zero "1"s, como 000).',
            acceptanceRule: 'Fim da palavra alcançado estando no estado q_even (quantidade par de 1s lidos).',
            rejectionRule: 'Fim da palavra alcançado no estado q_odd (quantidade ímpar de 1s lidos).',
            description: 'Reconhece palavras binárias que possuem um número par de dígitos 1.',
            whyImportant: 'Mostra a Máquina de Turing simulando o comportamento de um autômato finito determinístico em um único sentido, alternando entre dois estados de controle.',
            strategy: [
                '1. Estado q_even: Representa paridade par. Ao ler 1, passa para q_odd. Ao ler 0, permanece em q_even.',
                '2. Estado q_odd: Representa paridade ímpar. Ao ler 1, passa para q_even. Ao ler 0, permanece em q_odd.',
                '3. Fim da Fita: Se encontrar "_" estando no estado q_even, a cadeia é ACEITA! Se estiver em q_odd, é REJEITADA.'
            ],
            symbolsGuide: [
                { symbol: '0', meaning: 'Bit neutro que não altera a contagem de paridade.' },
                { symbol: '1', meaning: 'Bit que inverte o estado de paridade (par <-> ímpar).' },
                { symbol: '_', meaning: 'Fim da fita.' }
            ],
            defaultInput: '1010',
            validTests: ['1010', '11', '101', '1100', '101011', '000', '1111', '01010'],
            invalidTests: ['1', '10', '111', '100', '01110', '1101', '1000'],
            stateDescriptions: {
                'q_even': 'Paridade atual: PAR de 1s (estado aceitador).',
                'q_odd': 'Paridade atual: ÍMPAR de 1s (estado não-aceitador).',
                'q_accept': 'Palavra com paridade par confirmada!'
            },
            verdictExplainer: {
                accept: (input, tapeStr, steps) => {
                    const ones = (input.match(/1/g) || []).length;
                    return `A palavra "${input}" possui exatamente ${ones} bits "1", que é um número PAR. Palavra ACEITA!`;
                },
                reject: (input, tapeStr, steps, reason) => {
                    const ones = (input.match(/1/g) || []).length;
                    return `A palavra "${input}" possui ${ones} bits "1", que é um número ÍMPAR. Palavra REJEITADA!`;
                }
            },
            machine: {
                name: 'MT Verificadora de Paridade',
                states: ['q_even', 'q_odd', 'q_accept'],
                initialState: 'q_even',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                blankSymbol: '_',
                transitions: [
                    { fromState: 'q_even', readSymbol: '0', toState: 'q_even', writeSymbol: '0', move: 'R', description: 'Pula 0 (par)', human: 'Leu "0": paridade permanece PAR.' },
                    { fromState: 'q_even', readSymbol: '1', toState: 'q_odd', writeSymbol: '1', move: 'R', description: 'Leu 1 -> vira ímpar', human: 'Leu "1": paridade mudou para ÍMPAR.' },
                    { fromState: 'q_even', readSymbol: '_', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Fim em par -> ACEITA', human: 'Fim da palavra alcançado em estado PAR! Palavra ACEITA!' },
                    { fromState: 'q_odd', readSymbol: '0', toState: 'q_odd', writeSymbol: '0', move: 'R', description: 'Pula 0 (ímpar)', human: 'Leu "0": paridade permanece ÍMPAR.' },
                    { fromState: 'q_odd', readSymbol: '1', toState: 'q_even', writeSymbol: '1', move: 'R', description: 'Leu 1 -> vira par', human: 'Leu "1": paridade mudou de volta para PAR!' }
                ]
            }
        },
        {
            id: 'tm_0n_1n',
            name: 'Linguagem { 0ⁿ 1ⁿ | n ≥ 1 } (Balanceamento)',
            formalDefinition: 'L = { 0ⁿ 1ⁿ | n ≥ 1 }',
            chomskyLevel: 'Chomsky Tipo 2 — Livre de Contexto Determinística',
            category: 'Reconhecimento de Balanceamento',
            goal: 'Garantir que para cada zero lido no início exista exatamente um dígito 1 correspondente no final, preservando n zeros seguidos estritamente por n uns (ex: 01, 0011, 000111).',
            acceptanceRule: 'Cada 0 foi emparelhado e convertido com exatamente um 1 (marcação XX...YY) sem sobras.',
            rejectionRule: 'Desbalanceamento entre zeros e uns (ex: 001, 011) ou ordem invertida dos símbolos (ex: 10, 0101).',
            description: 'Marca o primeiro 0 com X, busca e marca o primeiro 1 correspondente com Y, repetindo até esgotar a entrada.',
            whyImportant: 'O exemplo de balanceamento mais fundamental da computação teórica, demonstrando o vai-e-vem simples na fita.',
            strategy: [
                '1. Estado q0: Marca o primeiro "0" com "X" e avança procurando o "1".',
                '2. Estado q1: Pula "0"s e "Y"s até achar o primeiro "1" livre. Marca com "Y" e inicia retorno.',
                '3. Estado q2: Retorna para a esquerda até encontrar o último "X" marcado e repete.',
                '4. Estado q3: Quando acabarem os "0"s, confere se não sobrou nenhum "1" na fita.'
            ],
            symbolsGuide: [
                { symbol: '0, 1', meaning: 'Bits originais de entrada.' },
                { symbol: 'X, Y', meaning: 'Símbolos marcadores de balanceamento.' },
                { symbol: '_', meaning: 'Fim da fita.' }
            ],
            defaultInput: '000111',
            validTests: ['01', '0011', '000111', '00001111'],
            invalidTests: ['001', '011', '10', '0101', '0', '1', '00011'],
            stateDescriptions: {
                'q0': 'Procurando o próximo "0" livre para iniciar a rodada.',
                'q1': 'Buscando o "1" correspondente para formar o par (X, Y).',
                'q2': 'Retornando à esquerda até a âncora "X".',
                'q3': 'Validando se todos os "1"s foram devidamente marcados.',
                'q_accept': 'Cadeia balanceada com sucesso!'
            },
            verdictExplainer: {
                accept: (input, tapeStr, steps) => {
                    const n = input.length / 2;
                    return `A palavra "${input}" é válida! Possui exatamente ${n} zeros seguidos por ${n} uns, perfeitamente balanceados.`;
                },
                reject: (input, tapeStr, steps, reason) => {
                    return `A palavra "${input}" foi REJEITADA! A quantidade de zeros e uns é desigual ou os símbolos estão invertidos.`;
                }
            },
            machine: {
                name: 'MT Reconhecedora de 0ⁿ 1ⁿ',
                states: ['q0', 'q1', 'q2', 'q3', 'q_accept'],
                initialState: 'q0',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                blankSymbol: '_',
                transitions: [
                    { fromState: 'q0', readSymbol: '0', toState: 'q1', writeSymbol: 'X', move: 'R', description: 'Marca 0 com X', human: 'Leu "0" livre. Marcou com "X" e avança para a DIREITA procurando o "1" correspondente.' },
                    { fromState: 'q0', readSymbol: 'Y', toState: 'q3', writeSymbol: 'Y', move: 'R', description: 'Valida Ys', human: 'Sem mais "0"s! Avança conferindo se todos os "1"s também foram marcados.' },
                    { fromState: 'q1', readSymbol: '0', toState: 'q1', writeSymbol: '0', move: 'R', description: 'Pula 0', human: 'Pula "0" ainda não marcado caminhando para a região de "1"s.' },
                    { fromState: 'q1', readSymbol: 'Y', toState: 'q1', writeSymbol: 'Y', move: 'R', description: 'Pula Y', human: 'Pula "Y" já marcado caminhando em direção ao primeiro "1" livre.' },
                    { fromState: 'q1', readSymbol: '1', toState: 'q2', writeSymbol: 'Y', move: 'L', description: 'Marca 1 com Y', human: 'Encontrou o "1" correspondente! Marcou com "Y". Par (X, Y) formado! Retorna para a ESQUERDA.' },
                    { fromState: 'q2', readSymbol: '0', toState: 'q2', writeSymbol: '0', move: 'L', description: 'Volta sobre 0', human: 'Retornando para a esquerda sobre símbolos "0".' },
                    { fromState: 'q2', readSymbol: 'Y', toState: 'q2', writeSymbol: 'Y', move: 'L', description: 'Volta sobre Y', human: 'Retornando para a esquerda sobre símbolos "Y".' },
                    { fromState: 'q2', readSymbol: 'X', toState: 'q0', writeSymbol: 'X', move: 'R', description: 'Encontra X, reinicia', human: 'Encontrou a âncora "X"! Move 1 posição para a DIREITA e reinicia para o próximo "0".' },
                    { fromState: 'q3', readSymbol: 'Y', toState: 'q3', writeSymbol: 'Y', move: 'R', description: 'Verifica Y', human: 'Validando: símbolo "Y" devidamente emparelhado.' },
                    { fromState: 'q3', readSymbol: '_', toState: 'q_accept', writeSymbol: '_', move: 'S', description: 'Fim da fita -> ACEITA', human: 'Fim da fita alcançado sem sobras! Cadeia 0ⁿ 1ⁿ ACEITA!' }
                ]
            }
        }
    ],

    // =========================================================================
    // 2. MÁQUINA DE DUAS PILHAS (2-PDA) - MODELOS E BATERIAS DE TESTES
    // =========================================================================
    twoStack: [
        {
            id: 'an_bn_cn',
            name: 'Linguagem { aⁿ bⁿ cⁿ | n ≥ 1 } (Sensível ao Contexto)',
            formalDefinition: 'L = { aⁿ bⁿ cⁿ | n ≥ 1 }',
            chomskyLevel: 'Chomsky Tipo 1 — Sensível ao Contexto',
            category: 'Sincronização de Três Contagens',
            goal: 'Verificar se a palavra contém n letras "a", seguidas por exatamente n letras "b" e n letras "c" em ordem rígida e com contagens rigorosamente iguais (ex: abc, aabbcc, aaabbbccc), usando a Pilha 1 para contar "a"s, a Pilha 2 para transferir a contagem nos "b"s e depois validar os "c"s.',
            acceptanceRule: 'Cadeia esgotada na ordem a-b-c com contagens exatamente iguais, retornando ambas as pilhas à base ($).',
            rejectionRule: 'Desbalanceamento numérico em qualquer um dos três blocos ou símbolos fora da ordem estrita a-b-c.',
            description: 'Usa a Pilha 1 para contar os "a"s, transfere a contagem para a Pilha 2 conferindo os "b"s, e desempilha a Pilha 2 conferindo os "c"s.',
            whyImportant: 'Uma única pilha só consegue comparar 2 blocos (ex: aⁿ bⁿ). Com 2 pilhas, a máquina descarrega P1 em P2 enquanto lê "b", permitindo conferir o terceiro bloco "c" em seguida!',
            strategy: [
                '1. Estado q0 e q_a: Lê cada "a" da entrada e empilha "A" na Pilha 1.',
                '2. Estado q_b: Ao ler "b", desempilha "A" da Pilha 1 e empilha "B" na Pilha 2 (garante quantidade de a = b).',
                '3. Estado q_c: Ao ler "c", P1 já deve estar vazia ($); desempilha "B" da Pilha 2 (garante quantidade de b = c).',
                '4. Ao final da entrada, se ambas as pilhas voltarem ao fundo ($), a palavra é ACEITA!'
            ],
            symbolsGuide: [
                { symbol: 'Pilha 1 (P1)', meaning: 'Contador de "a"s (armazena símbolos A).' },
                { symbol: 'Pilha 2 (P2)', meaning: 'Contador de "b"s (armazena símbolos B).' },
                { symbol: '$', meaning: 'Marcador de fundo de pilha vazio.' }
            ],
            defaultInput: 'aabbcc',
            validTests: ['abc', 'aabbcc', 'aaabbbccc', 'aaaabbbbcccc'],
            invalidTests: ['aabbc', 'abcc', 'aabbcccd', 'baacc', 'a', 'ab', 'cba'],
            verdictExplainer: {
                accept: (input, config) => `A palavra "${input}" foi ACEITA! A quantidade de "a"s, "b"s e "c"s foi exatamente igual a ${input.length / 3}, e ambas as pilhas esvaziaram simultaneamente no final da leitura.`,
                reject: (input, config) => `A palavra "${input}" foi REJEITADA! Não atende à restrição de igualdade ou ordem rígida de aⁿ bⁿ cⁿ.`
            },
            machine: {
                name: 'Reconhecedor de aⁿ bⁿ cⁿ',
                states: ['q0', 'q_a', 'q_b', 'q_c', 'q_accept'],
                initialState: 'q0',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                bottomSymbol: '$',
                transitions: [
                    { fromState: 'q0', readInput: 'a', top1: '$', top2: '$', toState: 'q_a', write1: 'A $', write2: '$', description: 'Primeiro a: empilha A em P1', human: 'Lê o primeiro "a" da entrada e empilha "A" na Pilha 1.' },
                    { fromState: 'q_a', readInput: 'a', top1: 'A', top2: '$', toState: 'q_a', write1: 'A A', write2: '$', description: 'Empilha outro A em P1', human: 'Lê outro "a" e empilha mais um "A" na Pilha 1 (contando os a\'s).' },
                    { fromState: 'q_a', readInput: 'b', top1: 'A', top2: '$', toState: 'q_b', write1: 'ε', write2: 'B $', description: 'Primeiro b: pop A de P1 e push B em P2', human: 'Lê o primeiro "b": desempilha "A" de P1 e empilha "B" em P2.' },
                    { fromState: 'q_b', readInput: 'b', top1: 'A', top2: 'B', toState: 'q_b', write1: 'ε', write2: 'B B', description: 'Outro b: pop A de P1 e push B em P2', human: 'Lê outro "b": remove "A" de P1 e insere "B" em P2 (conferindo a com b).' },
                    { fromState: 'q_b', readInput: 'c', top1: '$', top2: 'B', toState: 'q_c', write1: '$', write2: 'ε', description: 'Primeiro c: P1 vazia, pop B de P2', human: 'P1 esvaziou! Lê primeiro "c" e desempilha "B" de P2.' },
                    { fromState: 'q_c', readInput: 'c', top1: '$', top2: 'B', toState: 'q_c', write1: '$', write2: 'ε', description: 'Outro c: pop B de P2', human: 'Lê outro "c" e desempilha "B" de P2 (conferindo b com c).' },
                    { fromState: 'q_c', readInput: 'ε', top1: '$', top2: '$', toState: 'q_accept', write1: '$', write2: '$', description: 'Fim da entrada e pilhas balanceadas -> ACEITA', human: 'Entrada terminou e ambas as pilhas estão na base ($)! Palavra ACEITA!' }
                ]
            }
        },
        {
            id: 'palindrome_wcwR',
            name: 'Palíndromos com Centro { w c wᴿ | w ∈ {a, b}* }',
            formalDefinition: 'L = { w c wᴿ | w ∈ {a, b}*, wᴿ é o reverso de w }',
            chomskyLevel: 'Chomsky Tipo 2 — Livre de Contexto Determinística',
            category: 'Simetria com Centro Marcado',
            goal: 'Reconhecer palíndromos com marcador de centro explícito "c" (ex: abacaba, abcba, abbcbba), onde a sequência w antes do centro coincide rigorosamente com o reflexo invertido wᴿ após o centro.',
            acceptanceRule: 'Marcador central "c" divide perfeitamente os lados e cada símbolo à direita casa com o desempilhamento de P1 até a base ($).',
            rejectionRule: 'Divergência entre caracteres espelhados, ausência do marcador central "c" ou metades de comprimentos desiguais.',
            description: 'Armazena a primeira metade w na Pilha 1 até o separador "c". Após o separador, desempilha e compara com wᴿ.',
            whyImportant: 'Ilustra a natureza LIFO da pilha: ao empilhar a primeira metade e depois desempilhar, os símbolos saem na ordem inversa (wᴿ), conferindo naturalmente a simetria.',
            strategy: [
                '1. Conforme lê símbolos antes de "c", empilha na Pilha 1.',
                '2. Ao encontrar "c", transita para a fase de conferência.',
                '3. Após "c", para cada símbolo lido da entrada, confere e desempilha o topo de P1.',
                '4. Se a entrada terminar e P1 estiver na base ($), a palavra é ACEITA!'
            ],
            symbolsGuide: [
                { symbol: 'Pilha 1', meaning: 'Armazena os caracteres da primeira metade w na ordem inversa.' },
                { symbol: 'c', meaning: 'Marcador explícito do meio da palavra.' }
            ],
            defaultInput: 'abacaba',
            validTests: ['abacaba', 'abcba', 'abbcbba', 'aacaa', 'c', 'bacab', 'baacaab'],
            invalidTests: ['acba', 'abaca', 'abca', 'abcb', 'aacc', 'cba'],
            verdictExplainer: {
                accept: (input, config) => `A palavra "${input}" é um palíndromo espelhado válido ao redor do centro "c"!`,
                reject: (input, config) => `A palavra "${input}" NÃO é um palíndromo centrado válido.`
            },
            machine: {
                name: 'Reconhecedor de Palíndromos w c wᴿ',
                states: ['q_read_w', 'q_match_wR', 'q_accept'],
                initialState: 'q_read_w',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                bottomSymbol: '$',
                transitions: [
                    { fromState: 'q_read_w', readInput: 'a', top1: '$', top2: '$', toState: 'q_read_w', write1: 'a $', write2: '$', description: 'Push a em P1', human: 'Empilha "a" na Pilha 1.' },
                    { fromState: 'q_read_w', readInput: 'b', top1: '$', top2: '$', toState: 'q_read_w', write1: 'b $', write2: '$', description: 'Push b em P1', human: 'Empilha "b" na Pilha 1.' },
                    { fromState: 'q_read_w', readInput: 'a', top1: 'a', top2: '$', toState: 'q_read_w', write1: 'a a', write2: '$', description: 'Push a sobre a em P1', human: 'Empilha "a" sobre "a" em P1.' },
                    { fromState: 'q_read_w', readInput: 'a', top1: 'b', top2: '$', toState: 'q_read_w', write1: 'a b', write2: '$', description: 'Push a sobre b em P1', human: 'Empilha "a" sobre "b" em P1.' },
                    { fromState: 'q_read_w', readInput: 'b', top1: 'a', top2: '$', toState: 'q_read_w', write1: 'b a', write2: '$', description: 'Push b sobre a em P1', human: 'Empilha "b" sobre "a" em P1.' },
                    { fromState: 'q_read_w', readInput: 'b', top1: 'b', top2: '$', toState: 'q_read_w', write1: 'b b', write2: '$', description: 'Push b sobre b em P1', human: 'Empilha "b" sobre "b" em P1.' },
                    { fromState: 'q_read_w', readInput: 'c', top1: '*', top2: '$', toState: 'q_match_wR', write1: '*', write2: '$', description: 'Centro c encontrado', human: 'Centro "c" encontrado! Inicia comparação da segunda metade com o topo de P1.' },
                    { fromState: 'q_match_wR', readInput: 'a', top1: 'a', top2: '$', toState: 'q_match_wR', write1: 'ε', write2: '$', description: 'Casa a com topo a -> pop P1', human: 'Caractere "a" coincide com o topo de P1! Desempilha e continua.' },
                    { fromState: 'q_match_wR', readInput: 'b', top1: 'b', top2: '$', toState: 'q_match_wR', write1: 'ε', write2: '$', description: 'Casa b com topo b -> pop P1', human: 'Caractere "b" coincide com o topo de P1! Desempilha e continua.' },
                    { fromState: 'q_match_wR', readInput: 'ε', top1: '$', top2: '$', toState: 'q_accept', write1: '$', write2: '$', description: 'Palíndromo confirmado -> ACEITA', human: 'Entrada finalizada e Pilha 1 na base ($)! Palíndromo perfeito ACEITO!' }
                ]
            }
        },
        {
            id: 'copy_w_sharp_w',
            name: 'Cópia Não-Invertida { w # w | w ∈ {a, b}* }',
            formalDefinition: 'L = { w # w | w ∈ {a, b}* }',
            chomskyLevel: 'Chomsky Tipo 1 — Sensível ao Contexto (Dupla Reversão)',
            category: 'Poder Exclusivo de Duas Pilhas',
            goal: 'Verificar se a segunda metade da palavra é uma cópia IDÊNTICA e direta (não-invertida) da primeira metade separada por "#" (ex: ab#ab, aba#aba, bba#bba, bab#bab), usando a transferência P1 ➔ P2 para cancelar o efeito de reversão LIFO.',
            acceptanceRule: 'Transferência de P1 para P2 desinverte a palavra; cada símbolo após "#" coincide exatamente com o desempilhamento de P2 até a base ($).',
            rejectionRule: 'Divergência entre qualquer símbolo das duas metades (ex: ab#ba), separador "#" ausente ou metades de tamanhos desiguais.',
            description: 'Demonstra o poder de 2 pilhas ao desvirar a ordem ao transferir de P1 para P2 para comparar w com w.',
            whyImportant: 'Impossível com 1 pilha! Uma única pilha sempre inverte a palavra (wᴿ). Transferindo de P1 para P2, a inversão da inversão recupera a ordem original ( (wᴿ)ᴿ = w ), permitindo comparar cópias idênticas.',
            strategy: [
                '1. Lê w da primeira parte e empilha na Pilha 1 (ficando invertido: wᴿ).',
                '2. Ao ler "#", descarrega elemento por elemento de P1 para P2 (desvirando de volta: w original no topo de P2).',
                '3. Compara a segunda metade diretamente com o topo de P2.',
                '4. Se casar até o final, a palavra é ACEITA!'
            ],
            symbolsGuide: [
                { symbol: 'Pilha 1', meaning: 'Recebe os símbolos da primeira metade.' },
                { symbol: 'Pilha 2', meaning: 'Recebe a transferência invertida de P1, restaurando a ordem original.' },
                { symbol: '#', meaning: 'Separador central.' }
            ],
            defaultInput: 'ab#ab',
            validTests: ['ab#ab', 'aba#aba', 'bba#bba', 'a#a', 'b#b', 'bab#bab', 'abba#abba'],
            invalidTests: ['ab#ba', 'aba#abb', 'a#b', 'ab#a', 'aba#ba', 'bba#aba'],
            verdictExplainer: {
                accept: (input, config) => `As duas metades da palavra "${input}" são cópias idênticas! Duas pilhas permitiram desfazer a inversão da estrutura LIFO.`,
                reject: (input, config) => `A palavra "${input}" NÃO possui cópias idênticas separadas por #.`
            },
            machine: {
                name: 'Reconhecedor de w # w',
                states: ['q_read1', 'q_transfer', 'q_compare', 'q_accept'],
                initialState: 'q_read1',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                bottomSymbol: '$',
                transitions: [
                    { fromState: 'q_read1', readInput: 'a', top1: '*', top2: '$', toState: 'q_read1', write1: 'a *', write2: '$', description: 'Empilha a em P1', human: 'Lê "a" da primeira parte e empilha em P1.' },
                    { fromState: 'q_read1', readInput: 'b', top1: '*', top2: '$', toState: 'q_read1', write1: 'b *', write2: '$', description: 'Empilha b em P1', human: 'Lê "b" da primeira parte e empilha em P1.' },
                    { fromState: 'q_read1', readInput: '#', top1: '*', top2: '$', toState: 'q_transfer', write1: '*', write2: '$', description: 'Lê #: inicia reversão para P2', human: 'Separador "#" encontrado! Inicia transferência de P1 para P2 para desvirar a ordem.' },
                    { fromState: 'q_transfer', readInput: 'ε', top1: 'a', top2: '*', toState: 'q_transfer', write1: 'ε', write2: 'a *', description: 'Transfere a: pop P1, push P2', human: 'Transfere "a": remove de P1 e empilha em P2.' },
                    { fromState: 'q_transfer', readInput: 'ε', top1: 'b', top2: '*', toState: 'q_transfer', write1: 'ε', write2: 'b *', description: 'Transfere b: pop P1, push P2', human: 'Transfere "b": remove de P1 e empilha em P2.' },
                    { fromState: 'q_transfer', readInput: 'ε', top1: '$', top2: '*', toState: 'q_compare', write1: '$', write2: '*', description: 'Transferência concluída', human: 'P1 esvaziou! A palavra original "w" está agora pronta no topo de P2.' },
                    { fromState: 'q_compare', readInput: 'a', top1: '$', top2: 'a', toState: 'q_compare', write1: '$', write2: 'ε', description: 'Casa a com topo de P2', human: 'Caractere "a" casa com topo de P2! Remove de P2 e continua.' },
                    { fromState: 'q_compare', readInput: 'b', top1: '$', top2: 'b', toState: 'q_compare', write1: '$', write2: 'ε', description: 'Casa b com topo de P2', human: 'Caractere "b" casa com topo de P2! Remove de P2 e continua.' },
                    { fromState: 'q_compare', readInput: 'ε', top1: '$', top2: '$', toState: 'q_accept', write1: '$', write2: '$', description: 'Cópias confirmadas -> ACEITA', human: 'Toda a segunda metade coincidiu com a primeira! Palavra ACEITA!' }
                ]
            }
        },
        {
            id: 'an_b2n',
            name: 'Proporção Dobrada { aⁿ b²ⁿ | n ≥ 1 }',
            formalDefinition: 'L = { aⁿ b²ⁿ | n ≥ 1 }',
            chomskyLevel: 'Chomsky Tipo 2 — Livre de Contexto Determinística',
            category: 'Contagem em Razão Proporcional 1:2',
            goal: 'Garantir que a quantidade de letras "b" seja exatamente o DOBRO da quantidade de letras "a" em ordem rígida a-b (ex: abb, aabbbb, aaabbbbbb), empilhando 2 marcadores "A" para cada "a" lido na entrada.',
            acceptanceRule: 'Cada "a" empilha dois símbolos "A" na Pilha 1, e cada "b" consome exatamente um "A" até esvaziar na base ($).',
            rejectionRule: 'Proporção diferente de 2 para 1 entre b e a (ex: ab, aabb, aabbbbb), ou símbolos fora da ordem estrita.',
            description: 'Para cada símbolo "a" lido, empilha exatamente dois marcadores "A" na Pilha 1, exigindo o dobro de "b"s.',
            whyImportant: 'Demonstra a capacidade da operação de pilha empilhar múltiplos elementos em uma única transição (push de múltiplos símbolos).',
            strategy: [
                '1. Para o primeiro "a", empilha dois "A"s na Pilha 1 (write1 = A A $).',
                '2. Para os próximos "a"s, empilha mais dois "A"s para cada um lido.',
                '3. Ao ler "b", desempilha um único "A" de cada vez da Pilha 1.',
                '4. Se a entrada terminar e a pilha voltar à base ($), a proporção 1:2 foi satisfeita!'
            ],
            symbolsGuide: [
                { symbol: 'Pilha 1', meaning: 'Armazena 2 símbolos "A" para cada caractere "a" lido da entrada.' }
            ],
            defaultInput: 'aabbbb',
            validTests: ['abb', 'aabbbb', 'aaabbbbbb', 'aaaabbbbbbbb'],
            invalidTests: ['ab', 'abbb', 'aab', 'aabb', 'aabbbbb', 'aabbbbbbb'],
            verdictExplainer: {
                accept: (input, config) => {
                    const countA = (input.match(/a/g) || []).length;
                    const countB = (input.match(/b/g) || []).length;
                    return `A palavra "${input}" é válida! Possui ${countA} 'a's e exatamente o dobro (${countB}) de 'b's.`;
                },
                reject: (input, config) => `A palavra "${input}" foi rejeitada. A proporção de 'b's não é exatamente o dobro de 'a's.`
            },
            machine: {
                name: 'Reconhecedor de aⁿ b²ⁿ',
                states: ['q0', 'q_a', 'q_b', 'q_accept'],
                initialState: 'q0',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                bottomSymbol: '$',
                transitions: [
                    { fromState: 'q0', readInput: 'a', top1: '$', top2: '$', toState: 'q_a', write1: 'A A $', write2: '$', description: 'Empilha 2 As para 1º a', human: 'Leu primeiro "a": empilhou 2 "A"s na Pilha 1 (proporção dobrada).' },
                    { fromState: 'q_a', readInput: 'a', top1: 'A', top2: '$', toState: 'q_a', write1: 'A A A', write2: '$', description: 'Empilha +2 As', human: 'Leu outro "a": empilha mais 2 "A"s na Pilha 1.' },
                    { fromState: 'q_a', readInput: 'b', top1: 'A', top2: '$', toState: 'q_b', write1: 'ε', write2: '$', description: 'Primeiro b: pop 1 A', human: 'Leu primeiro "b": desempilha 1 "A" da Pilha 1.' },
                    { fromState: 'q_b', readInput: 'b', top1: 'A', top2: '$', toState: 'q_b', write1: 'ε', write2: '$', description: 'Outro b: pop 1 A', human: 'Leu outro "b": desempilha 1 "A" da Pilha 1.' },
                    { fromState: 'q_b', readInput: 'ε', top1: '$', top2: '$', toState: 'q_accept', write1: '$', write2: '$', description: 'Fim com pilha vazia -> ACEITA', human: 'Entrada finalizada e Pilha 1 vazia ($)! Proporção dobrada ACEITA!' }
                ]
            }
        },
        {
            id: 'an_bm_cn_dm',
            name: 'Contagens Cruzadas { aⁿ bᵐ cⁿ dᵐ | n, m ≥ 1 }',
            formalDefinition: 'L = { aⁿ bᵐ cⁿ dᵐ | n, m ≥ 1 }',
            chomskyLevel: 'Chomsky Tipo 1 — Sensível ao Contexto (Contagens Cruzadas)',
            category: 'Paralelismo de Duas Pilhas Independentes',
            goal: 'Validar contagens simultâneas e entrelaçadas onde o número de "a"s deve ser rigorosamente igual ao de "c"s (n) e o número de "b"s deve ser rigorosamente igual ao de "d"s (m), demonstrando duas pilhas operando de forma independente.',
            acceptanceRule: 'P1 valida a contagem a = c enquanto P2 preserva e depois valida b = d, ambas esvaziando no final ($).',
            rejectionRule: 'Desbalanceamento entre a e c ou entre b e d, ou violação da sequência ordenada a-b-c-d.',
            description: 'Usa P1 para guardar e comparar os "a"s com os "c"s, e P2 para guardar e comparar os "b"s com os "d"s.',
            whyImportant: 'Como os blocos estão entrelaçados (a casa com c e b casa com d), um autômato de 1 pilha não conseguiria desempilhar a sem perder b. Com 2 pilhas independentes, cada uma cuida de um par.',
            strategy: [
                '1. Empilha os "a"s na Pilha 1.',
                '2. Empilha os "b"s na Pilha 2 mantendo P1 intacta.',
                '3. Para cada "c", desempilha de P1 (conferindo n) mantendo P2.',
                '4. Para cada "d", desempilha de P2 (conferindo m).',
                '5. Se ambas esvaziarem, a cadeia é ACEITA!'
            ],
            symbolsGuide: [
                { symbol: 'Pilha 1', meaning: 'Armazena contagem de "a"s para comparar com os "c"s.' },
                { symbol: 'Pilha 2', meaning: 'Armazena contagem de "b"s para comparar com os "d"s.' }
            ],
            defaultInput: 'aabbccdd',
            validTests: ['abcd', 'aabbccdd', 'aaabbcccdd', 'abbcdd', 'aabbbccddd', 'aaabbbcccddd'],
            invalidTests: ['aabccdd', 'aabbccd', 'abc', 'aaabbccdd', 'abcdb', 'aabbccddd'],
            verdictExplainer: {
                accept: (input, config) => `A palavra "${input}" atende à proporção aⁿ bᵐ cⁿ dᵐ! As contagens cruzadas foram validadas com sucesso.`,
                reject: (input, config) => `A palavra "${input}" viola a contagem balanceada de aⁿ bᵐ cⁿ dᵐ.`
            },
            machine: {
                name: 'Reconhecedor de aⁿ bᵐ cⁿ dᵐ',
                states: ['q_read_a', 'q_read_b', 'q_read_c', 'q_read_d', 'q_accept'],
                initialState: 'q_read_a',
                acceptStates: ['q_accept'],
                rejectStates: ['q_reject'],
                bottomSymbol: '$',
                transitions: [
                    { fromState: 'q_read_a', readInput: 'a', top1: '*', top2: '$', toState: 'q_read_a', write1: 'A *', write2: '$', description: 'Empilha A em P1', human: 'Lê "a" e empilha "A" em P1.' },
                    { fromState: 'q_read_a', readInput: 'b', top1: 'A', top2: '$', toState: 'q_read_b', write1: 'A', write2: 'B $', description: 'Primeiro b: empilha B em P2', human: 'Lê primeiro "b": empilha "B" em P2 mantendo P1 intacta.' },
                    { fromState: 'q_read_b', readInput: 'b', top1: 'A', top2: '*', toState: 'q_read_b', write1: 'A', write2: 'B *', description: 'Empilha B em P2', human: 'Lê outro "b": empilha "B" em P2 mantendo P1 intacta.' },
                    { fromState: 'q_read_b', readInput: 'c', top1: 'A', top2: 'B', toState: 'q_read_c', write1: 'ε', write2: 'B', description: 'Primeiro c: desempilha A de P1', human: 'Lê primeiro "c": desempilha "A" de P1 (conferindo com "a").' },
                    { fromState: 'q_read_c', readInput: 'c', top1: 'A', top2: 'B', toState: 'q_read_c', write1: 'ε', write2: 'B', description: 'Outro c: desempilha A de P1', human: 'Lê outro "c": desempilha "A" de P1.' },
                    { fromState: 'q_read_c', readInput: 'd', top1: '$', top2: 'B', toState: 'q_read_d', write1: '$', write2: 'ε', description: 'Primeiro d: desempilha B de P2', human: 'P1 esvaziou! Lê primeiro "d" e desempilha "B" de P2 (conferindo com "b").' },
                    { fromState: 'q_read_d', readInput: 'd', top1: '$', top2: 'B', toState: 'q_read_d', write1: '$', write2: 'ε', description: 'Outro d: desempilha B de P2', human: 'Lê outro "d": desempilha "B" de P2.' },
                    { fromState: 'q_read_d', readInput: 'ε', top1: '$', top2: '$', toState: 'q_accept', write1: '$', write2: '$', description: 'Contagens confirmadas -> ACEITA', human: 'Entrada finalizada e ambas as pilhas na base ($)! Palavra ACEITA!' }
                ]
            }
        }
    ]
};

if (typeof window !== 'undefined') {
    window.EXAMPLES = EXAMPLES;
}
if (typeof global !== 'undefined') {
    global.EXAMPLES = EXAMPLES;
}
