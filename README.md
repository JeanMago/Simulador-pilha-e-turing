# Simulador de Modelos de Computação
## Máquina de Duas Pilhas e Máquina de Turing

**Disciplina:** Teoria da Computação e Complexidade  
**Professor:** Adão E. de Souza Filho  
**Semestre/Ano:** 2026/2 — Aulas 8 e 9  
**Atividade:** Simuladores de Modelos de Computação  

---

## 🎯 Objetivo da Atividade
Compreender o funcionamento de diferentes modelos abstratos de computação por meio da construção e validação de um simulador interativo, utilizando IA generativa como ferramenta de apoio ao desenvolvimento, fundamentando teoricamente cada decisão de projeto.

---

## 📋 Etapa 1 — Estudo dos Modelos

### 1. Máquina com Duas Pilhas (2-Stack Machine / 2-PDA)
- **Como a memória é organizada:** Possui duas pilhas independentes ($P_1$ e $P_2$) que operam sob a disciplina LIFO (*Last-In, First-Out*). Cada pilha possui apenas o elemento do topo visível e acessível a cada instante. Ambas são inicializadas com um marcador de base (convencionalmente `$`).
- **Operações básicas permitidas:**
  - Leitura dos topos de $P_1$ e $P_2$;
  - `push` (empilhamento de um ou mais símbolos em $P_1$ e/ou $P_2$);
  - `pop` (desempilhamento do topo de $P_1$ e/ou $P_2$);
  - Leitura de símbolo da cadeia de entrada ou transição espontânea ($\epsilon$);
  - Mudança do estado de controle interno.
- **Como a computação acontece:** Estando no estado $q$, a máquina lê o próximo símbolo de entrada $a$ (ou $\epsilon$) e os topos $X_1$ e $X_2$ de cada pilha. A função de transição $\delta(q, a, X_1, X_2) = (p, \gamma_1, \gamma_2)$ determina a mudança para o novo estado $p$, atualiza os topos substituindo $X_1$ por $\gamma_1$ e $X_2$ por $\gamma_2$, e avança a leitura da entrada caso $a \neq \epsilon$.
- **Quando termina:**
  - **Aceitação:** A cadeia de entrada é totalmente processada e a máquina finaliza em um estado de aceitação ($q \in F$).
  - **Rejeição:** A cadeia termina em um estado não-final; ou a máquina não encontra nenhuma transição válida para a configuração atual de $(estado, entrada, topo_1, topo_2)$ (parada anormal); ou transita para um estado explícito de rejeição.

---

### 2. Máquina de Turing (Turing Machine - MT)
- **Como a memória é organizada:** Uma fita linear potencialmente infinita em ambas as direções, particionada em células discretas. Cada célula armazena exatamente um caractere do alfabeto de fita $\Gamma$. Inicialmente, a palavra de entrada ocupa células contíguas e as demais contêm o símbolo em branco (`_`). Um cabeçote aponta para exatamente uma célula de fita a cada instante.
- **Operações básicas permitidas:**
  - Leitura do caractere sob o cabeçote;
  - Escrita (sobrescrita) na célula apontada;
  - Movimentação do cabeçote: Esquerda ($L$), Direita ($R$) ou Neutro ($S$);
  - Transição de estado de controle.
- **Como a computação acontece:** No estado $q$ e com o símbolo $X$ sob o cabeçote, a função de transição $\delta(q, X) = (p, Y, D)$ dita a gravação do símbolo $Y$, o deslocamento do cabeçote na direção $D \in \{L, R, S\}$ e a mudança para o estado $p$.
- **Quando termina:**
  - **Aceitação:** Atinge o estado $q_{accept}$ (ou $q \in F$).
  - **Rejeição:** Atinge o estado $q_{reject}$ ou para por ausência de transição definida.
  - **Loop Infinito:** Pode executar indefinidamente (indecidibilidade do Problema da Parada).

---

## 📊 Etapa 2 — Tabela Comparativa Preenchida

| Modelo | Como representa a memória? | Operações básicas | Como executa? | Quando termina? |
| :--- | :--- | :--- | :--- | :--- |
| **Duas Pilhas** *(2-PDA)* | Duas estruturas LIFO independentes ($P_1$ e $P_2$) com acesso restrito apenas aos topos e marcadores de base (`$`). Juntas, simulam uma fita bidirecional de acesso irrestrito. | • Leitura dos topos de $P_1$ e $P_2$<br>• `push` e `pop` em ambas as pilhas<br>• Leitura da entrada atual ($\Sigma \cup \{\epsilon\}$)<br>• Mudança de estado interno | Consulta $(q, a, \text{topo}_1, \text{topo}_2)$ e aplica $\delta(q, a, X_1, X_2) = (p, \gamma_1, \gamma_2)$. Avança a entrada, atualiza os topos das pilhas e muda para o estado $p$. | **Aceita:** Entrada consumida e estado atual $\in F$.<br>**Rejeita:** Entrada lida em estado não-final, transição indefinida ou estado de rejeição. |
| **Máquina de Turing** *(MT)* | Fita linear potencialmente infinita em células discretas com alfabeto $\Gamma$ e infinito número de brancos (`_`). Cabeçote móvel com leitura e escrita bidirecional. | • Leitura da célula atual<br>• Escrita na célula atual<br>• Movimento do cabeçote ($L, R, S$)<br>• Mudança de estado interno | Consulta $(q, X)$ sob o cabeçote e aplica $\delta(q, X) = (p, Y, D)$. Grava $Y$, move o cabeçote na direção $D$ e muda para o estado $p$. | **Aceita:** Atinge $q_{accept}$.<br>**Rejeita:** Atinge $q_{reject}$ ou parada por indefinição.<br>*(Pode não terminar em caso de loop infinito)*. |

### Equivalência Teórica (Por que 2 Pilhas = Turing?)
Uma máquina com uma única pilha reconhece apenas linguagens livres de contexto (ex: $\{a^n b^n\}$). Com **duas pilhas**, a máquina atinge a **Turing-Completude**:
1. A **Pilha 1** armazena o conteúdo da fita à **esquerda** do cabeçote.
2. A **Pilha 2** armazena a posição sob o cabeçote e o conteúdo à **direita**.
3. Mover para a Direita ($R$): desempilha de $P_2$ e empilha em $P_1$.
4. Mover para a Esquerda ($L$): desempilha de $P_1$ e empilha em $P_2$.
5. Escrever: desempilha de $P_2$ e empilha o novo caractere em $P_2$.

---

## 💻 Etapa 3 — O Simulador Desenvolvido

### Recursos Didáticos Especiais (Foco em Compreensão dos Resultados):
- [x] **Aba da Máquina de Turing como Ponto de Partida:** Abre diretamente na Máquina de Turing por padrão.
- [x] **Guia Didático do Algoritmo ("Como a Máquina Resolve Este Problema"):** Card contextual em cada exemplo explicando o objetivo e a estratégia lógica passo a passo.
- [x] **Narração ao Vivo em Linguagem Natural ("O Que a Máquina Fez Neste Passo"):** Tradução humana em tempo real de cada instrução disparada e do objetivo do estado atual.
- [x] **Banner de Resultado Final Didático:** Painel destacado que surge ao término da execução, explicando exatamente por que a cadeia foi aceita ou rejeitada, com comparativo entre Entrada Original vs Conteúdo Final da Fita e total de passos.
- [x] **Legenda e Cores Semânticas na Fita:** Diferenciação visual imediata entre Cabeçote (âmbar), Símbolos Marcados (roxo), Símbolos Originais (azul) e Células Vazias (cinza).
- [x] **Cockpit Unificado (Controle + Resultados):** O painel de configuração, botões de ação (com destaque para o passo a passo e barra sticky) e os resultados em tempo real (status, narração e fita/pilhas) foram reunidos no mesmo bloco visual, permitindo simulação contínua sem rolagem de tela.

### Requisitos Mínimos Atendidos:
- [x] **Entrada utilizada pela máquina:** Campo de texto dinâmico para digitação livre, com seleção de exemplos clássicos pré-carregados e botões de atalho de cadeias de teste.
- [x] **Estado/configuração atual:** Display destacado em tempo real do estado atual (ex: $q_0$), número do passo e posições de leitura.
- [x] **Memória visualmente:**
  - *Máquina de Turing:* Fita horizontal infinita com índices numéricos, células com símbolos e cabeçote com ponteiro animado que se desloca e centraliza automaticamente na célula ativa.
  - *Máquina de Duas Pilhas:* Dois tubos verticais translúcidos exibindo os blocos de $P_1$ e $P_2$, topo destacado com indicador `▲ Topo`, fundo de pilha `$` e fluxo de leitura de entrada com células consumidas e ativas.
- [x] **Instrução/transição atual:** Card com a fórmula da transição aplicada no passo atual e destaque luminoso na linha correspondente da tabela de regras.
- [x] **Botão "Executar próximo passo":** Avanço manual passo a passo (*Step*).
- [x] **Botão "Executar automaticamente":** Execução contínua com controle deslizante de velocidade (100ms a 1500ms) e alternância para *Pausar*.
- [x] **Botão "Reiniciar":** Restaura a máquina para o estado inicial com a palavra atual.
- [x] **Histórico das configurações:** Tabela cronológica completa contendo número do passo, estado, memória (topos/posição do cabeçote) e ação executada.
- [x] **Indicação clara de término:** Badges semânticos de alta visibilidade e painel explicativo.

---

## 🚀 Como Executar o Simulador

### Método 1 — Direto no Navegador (Sem Instalação)
Basta abrir o arquivo `index.html` em qualquer navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Método 2 — Servidor Local (Opcional)
Você também pode rodar um servidor HTTP local simples:

Via **Python 3**:
```bash
python -m http.server 8000
```
Depois, acesse no navegador: `http://localhost:8000`

Via **Node.js**:
```bash
npx serve .
```

---

## 📁 Estrutura de Arquivos

```
at8/
├── index.html                  # Interface gráfica web com abas para ambos os modelos e relatório
├── style.css                   # Estilização moderna, responsiva e animações visuais
├── js/
│   ├── two_stack_machine.js    # Motor e lógica formal da Máquina de Duas Pilhas
│   ├── turing_machine.js       # Motor e lógica formal da Máquina de Turing
│   ├── examples.js             # Exemplos pré-configurados e cadeias de teste
│   └── app.js                  # Controlador geral da UI, animações, histórico e eventos
├── RELATORIO.md                # Relatório acadêmico completo para entrega formal
├── README.md                   # Documentação do projeto e instruções de uso
└── scratch/
    └── test_machines.js        # Script de testes automatizados com Node.js
```

---

## 🧪 Modelos e Baterias de Testes Disponíveis

### Máquina de Turing:
1. **Linguagem $\{a^n b^n c^n \mid n \ge 1\}$** *(Sensível ao Contexto)*
   - 🟢 Válidos: `abc`, `aabbcc`, `aaabbbccc`, `aaaabbbbcccc`
   - 🔴 Inválidos: `aabbc`, `abcc`, `aabbcccd`, `baacc`, `a`, `ab`, `cba`
2. **Palíndromos Binários $\{w \in \{0, 1\}^* \mid w = w^R\}$** *(Reconhecimento Espelhado)*
   - 🟢 Válidos: `10101`, `11011`, `0110`, `1`, `0`, `00`, `11`, `1001`, `1011101`
   - 🔴 Inválidos: `10`, `01`, `1100`, `1010`, `1101`, `1000`
3. **Incrementador Binário ($x + 1$)** *(Função Aritmética com Carry)*
   - 🟢 Válidos: `1011` (11 $\to$ 12), `111` (7 $\to$ 8), `0` $\to$ `1`, `1` $\to$ `10`, `100` $\to$ `101`, `1111` $\to$ `10000`
   - 🔴 Inválidos: `10a`, `abc`, `102`
4. **Soma Unária $\{0^n 1 0^m \to 0^{n+m} \mid n, m \ge 1\}$** *(Concatenação e Ajuste de Blocos)*
   - 🟢 Válidos: `000100` (3+2=5), `00100` (2+2=4), `010` (1+1=2), `00010` (3+1=4), `00001000` (4+3=7)
   - 🔴 Inválidos: `000`, `100`, `001`, `00110`
5. **Verificador de Paridade** *(Número Par de 1s)*
   - 🟢 Válidos: `1010`, `11`, `101`, `1100`, `101011`, `000`, `1111`, `01010`
   - 🔴 Inválidos: `1`, `10`, `111`, `100`, `01110`, `1101`
6. **Linguagem $\{0^n 1^n \mid n \ge 1\}$** *(Balanceamento Fundamental)*
   - 🟢 Válidos: `01`, `0011`, `000111`, `00001111`
   - 🔴 Inválidos: `001`, `011`, `10`, `0101`, `0`, `1`, `00011`

### Máquina de Duas Pilhas:
1. **Linguagem $\{a^n b^n c^n \mid n \ge 1\}$** *(Sensível ao Contexto)*
   - 🟢 Válidos: `abc`, `aabbcc`, `aaabbbccc`, `aaaabbbbcccc`
   - 🔴 Inválidos: `aabbc`, `abcc`, `aabbcccd`, `baacc`, `a`, `ab`
2. **Palíndromos com Centro $\{w c w^R \mid w \in \{a, b\}^*\}$** *(Simetria LIFO)*
   - 🟢 Válidos: `abacaba`, `abcba`, `abbcbba`, `aacaa`, `c`, `bacab`, `baacaab`
   - 🔴 Inválidos: `acba`, `abaca`, `abca`, `abcb`, `aacc`
3. **Cópia não-invertida $\{w \# w \mid w \in \{a, b\}^*\}$** *(Inversão Dupla via P1 e P2)*
   - 🟢 Válidos: `ab#ab`, `aba#aba`, `bba#bba`, `a#a`, `b#b`, `bab#bab`, `abba#abba`
   - 🔴 Inválidos: `ab#ba`, `aba#abb`, `a#b`, `ab#a`, `aba#ba`
4. **Proporção Dobrada $\{a^n b^{2n} \mid n \ge 1\}$** *(Push Múltiplo)*
   - 🟢 Válidos: `abb` (1:2), `aabbbb` (2:4), `aaabbbbbb` (3:6), `aaaabbbbbbbb` (4:8)
   - 🔴 Inválidos: `ab`, `abbb`, `aab`, `aabb`, `aabbbbb`
5. **Contagens Cruzadas $\{a^n b^m c^n d^m \mid n, m \ge 1\}$** *(Autonomia de Pilhas)*
   - 🟢 Válidos: `abcd`, `aabbccdd`, `aaabbcccdd`, `abbcdd`, `aabbbccddd`, `aaabbbcccddd`
   - 🔴 Inválidos: `aabccdd`, `aabbccd`, `abc`, `aaabbccdd`, `abcdb`
