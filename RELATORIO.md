# Relatório Teórico e Prático - Modelos de Computação
**Disciplina:** Teoria da Computação e Complexidade  
**Professor:** Adão E. de Souza Filho  
**Período Letivo:** 2026/2 — Aulas 8 e 9  
**Atividade:** Simuladores de Modelos de Computação  
**Tema:** Máquina de Duas Pilhas e Máquina de Turing  

---

## 1. Etapa 1 — Estudo Aprofundado dos Modelos

### 1.1. Máquina de Duas Pilhas (2-Stack Automaton / 2-PDA)

A **Máquina de Duas Pilhas** é uma extensão do autômato com pilha convencional (Pushdown Automaton - PDA), no qual a unidade de controle tem acesso simultâneo a **duas pilhas independentes**. Enquanto o autômato de uma pilha reconhece apenas linguagens livres de contexto (CFLs), a introdução de uma segunda pilha eleva seu poder computacional de forma drástica, tornando-o equivalente à Máquina de Turing.

1. **Como a memória é organizada?**
   - A memória auxiliar é composta por **duas estruturas de dados LIFO (Last-In, First-Out)** independentes: Pilha 1 ($P_1$) e Pilha 2 ($P_2$).
   - Cada pilha possui seu próprio topo visível e acessível para leitura e modificação.
   - Ambas as pilhas tipicamente iniciam com um símbolo especial de fundo de pilha (marcador de base, convencionalmente denotado por $Z_0$ ou $\$$) para detectar quando a pilha está vazia.
   - O acesso é estritamente restrito ao topo de cada pilha: não é possível acessar ou pesquisar elementos intermediários ou da base sem antes desempilhar os elementos acima.

2. **Quais operações são permitidas?**
   - **Leitura do topo:** Consultar o símbolo presente no topo de $P_1$ e de $P_2$.
   - **Desempilhamento (`pop`):** Remover o símbolo do topo de uma ou de ambas as pilhas (substituindo por cadeia vazia $\epsilon$).
   - **Empilhamento (`push`):** Inserir um ou mais símbolos no topo de uma ou de ambas as pilhas.
   - **Manutenção (`keep`):** Manter o símbolo atual no topo inalterado.
   - **Leitura da entrada:** Ler o próximo símbolo da fita de entrada ou realizar uma transição espontânea ($\epsilon$-transição).
   - **Mudança de estado:** Transitar entre estados discretos de um conjunto finito de estados $Q$.

3. **Como uma computação acontece?**
   - A máquina parte de uma configuração inicial: estado inicial $q_0$, fita de entrada contendo a palavra $w$ a ser processada (com a cabeça de leitura no primeiro caractere), e as duas pilhas inicializadas com o marcador de base ($Z_0$).
   - A cada passo, a máquina avalia:
     1. O estado de controle atual $q \in Q$;
     2. O símbolo de entrada atual $a \in \Sigma \cup \{\epsilon\}$;
     3. O topo da Pilha 1 ($X_1 \in \Gamma$) e o topo da Pilha 2 ($X_2 \in \Gamma$).
   - Com base na função de transição:
     $$\delta(q, a, X_1, X_2) = (p, \gamma_1, \gamma_2)$$
     a máquina transita para o estado $p$, consome a entrada $a$ (se $a \neq \epsilon$), remove $X_1$ e $X_2$ dos respectivos topos e empilha as cadeias $\gamma_1$ e $\gamma_2$ em seus lugares.

4. **Qual condição determina seu término?**
   - **Término com Aceitação:** Ocorre quando toda a palavra de entrada foi consumida e a máquina atinge um estado pertencente ao conjunto de estados finais de aceitação ($q \in F$) — ou, em modelos por pilha vazia, quando ambas as pilhas são esvaziadas simultaneamente ao fim da entrada.
   - **Término com Rejeição:** Ocorre quando:
     - Toda a entrada foi consumida, mas a máquina parou em um estado não-final; ou
     - Em qualquer momento da execução, não existe nenhuma transição definida $\delta$ para a combinação atual de $(estado, entrada, topo_1, topo_2)$ (parada anormal); ou
     - A máquina transita explicitamente para um estado de rejeição pré-definido ($q_{reject}$).

---

### 1.2. Máquina de Turing (Turing Machine - MT)

A **Máquina de Turing**, introduzida por Alan Turing em 1936, é o modelo formal canônico de computação universal. Ela generaliza o conceito de autômato substituindo a fita de entrada somente de leitura e a pilha de acesso restrito por uma fita de memória ilimitada com leitura e escrita em qualquer posição através de movimentação bidirecional do cabeçote.

1. **Como a memória é organizada?**
   - A memória consiste em uma **fita linear potencialmente infinita**, dividida em células discretas.
   - Cada célula é capaz de armazenar exatamente um símbolo pertencente a um alfabeto de fita $\Gamma$.
   - Inicialmente, a palavra de entrada $w$ ocupa as primeiras células da fita; todas as demais células à direita (e potencialmente à esquerda) contêm o símbolo especial em branco ($\sqcup$ ou $B$).
   - Um **cabeçote de leitura e escrita** (*tape head*) aponta para exatamente uma célula da fita a cada instante e pode se mover livremente célula a célula para a esquerda ($L$) ou para a direita ($R$).

2. **Quais operações são permitidas?**
   - **Leitura:** Ler o símbolo da célula de fita atualmente apontada pelo cabeçote.
   - **Escrita:** Sobrescrever a célula atualmente apontada com um novo símbolo do alfabeto de fita $\Gamma$.
   - **Movimento:** Deslocar o cabeçote uma célula para a esquerda ($L$), para a direita ($R$) ou permanecer na mesma posição ($S$ - *stay*).
   - **Mudança de estado:** Transitar para um novo estado interno $p \in Q$.

3. **Como uma computação acontece?**
   - A máquina inicia no estado $q_0$ com a palavra de entrada na fita e o cabeçote posicionado na primeira célula da entrada.
   - A cada passo discreto de computação, a função de transição determina o comportamento da máquina:
     $$\delta(q, X) = (p, Y, D)$$
     onde $q$ é o estado atual, $X \in \Gamma$ é o símbolo sob o cabeçote, $p \in Q$ é o novo estado, $Y \in \Gamma$ é o símbolo a ser gravado na célula e $D \in \{L, R, S\}$ é a direção de deslocamento do cabeçote.
   - O processo se repete sequencialmente, transformando a fita e navegando por suas posições conforme ditado pelas regras de transição.

4. **Qual condição determina seu término?**
   - **Aceitação:** A máquina atinge o estado especial de aceitação $q_{accept}$ (ou qualquer $q \in F$). Nesse momento, a computação cessa imediatamente e a palavra é declarada aceita (ou o conteúdo da fita é o resultado da função computada).
   - **Rejeição:** A máquina atinge o estado explícito de rejeição $q_{reject}$, ou atinge uma configuração $(q, X)$ para a qual não há nenhuma transição definida em $\delta$ (parada por indefinição).
   - **Não-término (Loop Infinito):** A máquina pode entrar em um ciclo infinito de transições sem jamais alcançar um estado de parada. Por ser Turing-completa, a detecção geral de parada é indecidível (*Problema da Parada*).

---

## 2. Etapa 2 — Tabela Comparativa de Preenchimento

Abaixo está o preenchimento consolidado da tabela solicitada na atividade:

| Modelo | Como representa a memória? | Operações básicas | Como executa? | Quando termina? |
| :--- | :--- | :--- | :--- | :--- |
| **Duas Pilhas** *(2-Stack Machine)* | Duas estruturas independentes LIFO (Pilha 1 e Pilha 2), cada uma com acesso restrito apenas ao seu topo, ambas inicializadas com marcadores de fundo de pilha ($Z_0$). Juntas, simulam uma fita bidirecional. | • Leitura dos topos de $P_1$ e $P_2$<br>• `push` (inserir no topo)<br>• `pop` (remover do topo)<br>• Leitura da entrada atual ($\Sigma \cup \{\epsilon\}$)<br>• Troca de estado interno | Consulta $(q, a, \text{topo}_1, \text{topo}_2)$ e aplica $\delta(q, a, X_1, X_2) = (p, \gamma_1, \gamma_2)$. Avança a entrada (se $a \neq \epsilon$), atualiza os topos substituindo $X_1, X_2$ por $\gamma_1, \gamma_2$ e muda para o estado $p$. | **Aceita:** Entrada totalmente lida e estado atual $\in F$.<br>**Rejeita:** Entrada lida em estado não-final, transição inexistente para a configuração atual, ou estado $q_{reject}$.<br>*(Pode entrar em loop por $\epsilon$-transições)*. |
| **Máquina de Turing** *(Turing Machine)* | Uma fita linear potencialmente infinita particionada em células discretas indexadas, contendo símbolos de $\Gamma$ e infinito número de símbolos em branco ($\sqcup$). Possui um cabeçote de leitura/escrita móvel. | • Leitura da célula atual<br>• Escrita/sobrescrita na célula atual<br>• Movimentação do cabeçote ($L, R, S$)<br>• Troca de estado interno | Consulta $(q, X)$ onde $X$ está sob o cabeçote e aplica $\delta(q, X) = (p, Y, D)$. Grava $Y$ na célula atual, move o cabeçote na direção $D \in \{L, R, S\}$ e muda para o estado $p$. | **Aceita:** Atinge $q_{accept}$ (parada com sucesso).<br>**Rejeita:** Atinge $q_{reject}$ ou para por transição indefinida.<br>**Loop infinito:** Pode nunca parar (problema da parada). |

---

## 3. Demonstração Teórica da Equivalência de Poder Computacional

Um dos teoremas centrais da Teoria da Computação afirma que:
$$\text{Autômato com 2 Pilhas} \equiv \text{Máquina de Turing}$$

### Como 2 Pilhas Simulam Perfeitamente a Fita de Turing:
Considere a fita de uma Máquina de Turing dividida na posição exata do cabeçote:
- **Pilha 1 ($P_1$):** Armazena todas as células situadas **à esquerda** do cabeçote, de modo que a célula imediatamente adjacente à esquerda do cabeçote fique no topo de $P_1$.
- **Pilha 2 ($P_2$):** Armazena a célula **sob o cabeçote** e todas as células situadas **à direita**, de modo que o símbolo sob o cabeçote fique exatamente no topo de $P_2$.

Dessa forma, cada operação da Máquina de Turing é simulada em tempo constante por operações de pilha:
1. **Ler o símbolo sob o cabeçote:** Ler o topo de $P_2$.
2. **Escrever um símbolo $Y$:** Fazer `pop` em $P_2$ e fazer `push(Y)` em $P_2$.
3. **Mover o cabeçote para a Direita ($R$):**
   - Fazer `pop` do símbolo atual de $P_2$ e fazer `push` desse símbolo em $P_1$.
   - O novo topo de $P_2$ passa a ser a célula à direita! Se $P_2$ estiver vazia, interpreta-se como símbolo em branco $\sqcup$.
4. **Mover o cabeçote para a Esquerda ($L$):**
   - Fazer `pop` de $P_1$ e fazer `push` do símbolo desempilhado em $P_2$.
   - Se $P_1$ estiver vazia, corresponde a atingir o início da fita.

Essa equivalência direta demonstra por que duas pilhas são estritamente mais poderosas que uma única pilha (capaz de reconhecer apenas linguagens livres de contexto como $a^n b^n$), conseguindo reconhecer linguagens sensíveis ao contexto como $a^n b^n c^n$, cadeias duplicadas $w w$ e computar qualquer função recursivamente enumerável.

---

## 4. O Simulador Desenvolvido (Etapa 3)

O simulador construído em conformidade com as diretrizes do Professor Adão E. de Souza Filho inclui recursos projetados especificamente para a **compreensão transparente dos resultados e do funcionamento**:

1. **Aba Principal com Foco na Máquina de Turing:**
   - A interface inicializa imediatamente na Máquina de Turing, com visualização da fita, cabeçote móvel e painéis explicativos.

2. **Guia Didático do Algoritmo ("Como a Máquina Resolve Este Problema"):**
   - **Objetivo Formal:** O que o autômato está decidindo ou computando.
   - **Por Que Este Problema é Importante:** Enquadramento na hierarquia de Chomsky e relevância conceitual.
   - **Estratégia Lógica Passo a Passo:** Explicação textual de como a máquina opera em alto nível.
   - **Guia dos Símbolos na Memória:** Legenda detalhada de cada símbolo da fita ou pilha.

3. **Narração da Execução em Tempo Real (Live Step Narration):**
   - Cada instrução formal (como $\delta(q_1, 'b') \to (q_2, 'Y', R)$) é traduzida instantaneamente para uma explicação em linguagem natural clara e intuitiva em português, indicando a ação recém-executada e o objetivo atual da unidade de controle.

4. **Banner de Veredito Final Didático:**
   - Ao término da computação, um card de alta visibilidade apresenta:
     - Título categórico: `CADEIA ACEITA` ou `CADEIA REJEITADA`.
     - Justificativa conceitual profunda gerada dinamicamente para o caso de teste.
     - Tabela comparativa com: Cadeia de Entrada Original, Conteúdo Final da Fita, Passos Totais e Estado de Término.

5. **Baterias de Teste Categorizadas (Válidos vs Inválidos):**
   - Cada exemplo disponibiliza chips clicáveis divididos explicitamente entre:
     - 🟢 **Casos Válidos (Devem Aceitar):** casos mínimos, médios, pares/ímpares e casos de borda.
     - 🔴 **Casos Inválidos (Devem Rejeitar):** desbalanceamentos, ordens invertidas e caracteres estranhos.

6. **Cockpit Unificado de Execução e Resultados (Ergonomia Passo a Passo):**
   - A interface unifica a configuração, os botões de ação e os resultados em um único bloco contíguo de alta visibilidade:
     - Botão `Executar Próximo Passo` ampliado e destacado para inspeção detalhada.
     - Barra de ações com comportamento fixo/sticky ao rolar a página.
     - Status atual, narração passo a passo e fita/pilhas visíveis no mesmo campo visual, eliminando a necessidade de rolar a tela entre cliques.
     - Card didático colapsável para manter o foco total na dinâmica da computação.

7. **Modelos Implementados e Validados:**
   - **Máquina de Turing:**
     1. $L = \{a^n b^n c^n \mid n \ge 1\}$ *(Linguagem Sensível ao Contexto)*
     2. Palíndromos Binários $\{w \in \{0, 1\}^* \mid w = w^R\}$ *(Reconhecimento Espelhado)*
     3. Incrementador Binário ($x + 1$) *(Computação de Função Aritmética com Carry)*
     4. Soma Unária $\{0^n 1 0^m \to 0^{n+m} \mid n, m \ge 1\}$ *(Manipulação de Blocos na Fita)*
     5. Verificador de Paridade *(Número Par de 1s)*
     6. $L = \{0^n 1^n \mid n \ge 1\}$ *(Balanceamento Fundamental)*
   - **Máquina de Duas Pilhas:**
     1. $L = \{a^n b^n c^n \mid n \ge 1\}$ *(Contadores Sincronizados)*
     2. Palíndromos com Centro $\{w c w^R\}$ *(Simetria LIFO)*
     3. Cópia não-invertida $\{w \# w\}$ *(Inversão da Inversão via 2 Pilhas)*
     4. Proporção Dobrada $\{a^n b^{2n} \mid n \ge 1\}$ *(Empilhamento Múltiplo)*
     5. Contagens Cruzadas $\{a^n b^m c^n d^m \mid n, m \ge 1\}$ *(Independência de P1 e P2)*
