/**
 * Simulador de Modelos de Computação
 * Teoria da Computação e Complexidade - Prof. Adão E. de Souza Filho
 * 
 * Controlador Geral da Aplicação com Foco Pedagógico na Máquina de Turing
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // CONTROLE DE NAVEGAÇÃO DE ABAS
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');

            // Pausa execuções automáticas ao trocar de aba para evitar conflitos
            stopTuringAuto();
            stopTwoStackAuto();
        });
    });

    // ==============================================================
    // 1. CONTROLADOR DA MÁQUINA DE TURING (DESTAQUE PRINCIPAL)
    // ==============================================================
    let tmCurrentPreset = EXAMPLES.turing[0];
    let tmMachine = new TuringMachine(tmCurrentPreset.machine);
    let tmAutoInterval = null;
    let tmSpeed = 500;

    // Elementos DOM - Turing
    const tmPresetSelect = document.getElementById('tm-preset-select');
    const tmInputString = document.getElementById('tm-input-string');
    const tmBtnLoad = document.getElementById('tm-btn-load');
    const tmQuickTests = document.getElementById('tm-quick-tests');
    const tmBtnStep = document.getElementById('tm-btn-step');
    const tmBtnAuto = document.getElementById('tm-btn-auto');
    const tmBtnAutoText = document.getElementById('tm-btn-auto-text');
    const tmBtnReset = document.getElementById('tm-btn-reset');
    const tmSpeedInput = document.getElementById('tm-speed');
    const tmSpeedVal = document.getElementById('tm-speed-val');

    // Guia Didático e Narração
    const tmDidacticGoal = document.getElementById('tm-didactic-goal');
    const tmDidacticSteps = document.getElementById('tm-didactic-steps');
    const tmNarrationText = document.getElementById('tm-narration-text');
    const tmNarrationGoalText = document.getElementById('tm-narration-goal-text');

    // Banner de Veredito Final Didático
    const tmVerdictBanner = document.getElementById('tm-verdict-banner');
    const tmVerdictTitle = document.getElementById('tm-verdict-title');
    const tmVerdictDesc = document.getElementById('tm-verdict-desc');
    const tmMetricInput = document.getElementById('tm-metric-input');
    const tmMetricTape = document.getElementById('tm-metric-tape');
    const tmMetricSteps = document.getElementById('tm-metric-steps');
    const tmMetricState = document.getElementById('tm-metric-state');

    // Status Banner e Fita
    const tmStateDisplay = document.getElementById('tm-state-display');
    const tmStepDisplay = document.getElementById('tm-step-display');
    const tmHeadPosDisplay = document.getElementById('tm-head-pos-display');
    const tmSymbolReadDisplay = document.getElementById('tm-symbol-read-display');
    const tmOutcomeBadge = document.getElementById('tm-outcome-badge');
    const tmReasonBox = document.getElementById('tm-reason-box');

    const tmTapeTrack = document.getElementById('tm-tape-track');
    const tmTapeViewport = document.getElementById('tm-tape-viewport');
    const tmActiveTransFormula = document.getElementById('tm-active-trans-formula');
    const tmActiveTransDesc = document.getElementById('tm-active-trans-desc');
    const tmRulesTableBody = document.getElementById('tm-rules-table-body');
    const tmHistoryTableBody = document.getElementById('tm-history-table-body');

    // Inicialização dos Presets de Turing
    function initTuringPresets() {
        tmPresetSelect.innerHTML = '';
        EXAMPLES.turing.forEach((preset, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = preset.name;
            tmPresetSelect.appendChild(opt);
        });

        loadTuringPreset(0);
    }

    function loadTuringPreset(index) {
        stopTuringAuto();
        tmCurrentPreset = EXAMPLES.turing[index];
        tmMachine = new TuringMachine(tmCurrentPreset.machine);
        tmInputString.value = tmCurrentPreset.defaultInput;

        // Atualiza Card Didático do Algoritmo
        renderTuringDidacticGuide();

        // Renderiza botões rápidos de teste com separação entre válidos e inválidos
        renderQuickTests(tmQuickTests, tmCurrentPreset, (inputVal) => {
            tmInputString.value = inputVal;
            resetTuringMachine();
        });

        // Monta tabela de regras
        renderTuringRulesTable();

        resetTuringMachine();
    }

    const tmDidacticWhy = document.getElementById('tm-didactic-why');
    const tmDidacticSymbols = document.getElementById('tm-didactic-symbols');

    function renderTuringDidacticGuide() {
        if (!tmDidacticGoal || !tmDidacticSteps) return;
        tmDidacticGoal.textContent = tmCurrentPreset.goal || tmCurrentPreset.description;

        // Por que este problema é importante
        if (tmDidacticWhy) {
            if (tmCurrentPreset.whyImportant) {
                tmDidacticWhy.style.display = 'block';
                tmDidacticWhy.innerHTML = `<strong>💡 Por Que Este Problema é Importante:</strong> ${tmCurrentPreset.whyImportant}`;
            } else {
                tmDidacticWhy.style.display = 'none';
            }
        }

        // Estratégia passo a passo
        tmDidacticSteps.innerHTML = '';
        if (tmCurrentPreset.strategy && Array.isArray(tmCurrentPreset.strategy)) {
            tmCurrentPreset.strategy.forEach((stepText) => {
                const item = document.createElement('div');
                item.className = 'didactic-step-item';
                item.innerHTML = `<span>&bull;</span> <span>${stepText}</span>`;
                tmDidacticSteps.appendChild(item);
            });
        }

        // Guia de símbolos
        if (tmDidacticSymbols) {
            tmDidacticSymbols.innerHTML = '';
            if (tmCurrentPreset.symbolsGuide && Array.isArray(tmCurrentPreset.symbolsGuide)) {
                tmCurrentPreset.symbolsGuide.forEach((sg) => {
                    const item = document.createElement('div');
                    item.className = 'didactic-symbol-item';
                    item.innerHTML = `<span class="sym-badge">${sg.symbol}</span> <span>${sg.meaning}</span>`;
                    tmDidacticSymbols.appendChild(item);
                });
            }
        }
    }

    function resetTuringMachine() {
        stopTuringAuto();
        const inputVal = tmInputString.value.trim();
        tmMachine.reset(inputVal);

        // Oculta banner de veredito no reinício
        if (tmVerdictBanner) tmVerdictBanner.style.display = 'none';

        // Reseta narração
        if (tmNarrationText) {
            tmNarrationText.textContent = `A fita foi inicializada com a palavra "${inputVal || 'ε'}". Clique em "Executar Próximo Passo" para iniciar a leitura.`;
        }
        if (tmNarrationGoalText) {
            const initialGoal = tmCurrentPreset.stateDescriptions ? tmCurrentPreset.stateDescriptions[tmMachine.initialState] : 'Pronto para iniciar.';
            tmNarrationGoalText.textContent = initialGoal || 'Pronto para iniciar.';
        }

        updateTuringUI();
        renderTuringHistory();
    }

    function stepTuringMachine() {
        if (tmMachine.status === 'ACCEPTED' || tmMachine.status === 'REJECTED' || tmMachine.status === 'HALTED') {
            stopTuringAuto();
            return;
        }

        tmMachine.step();
        updateTuringUI();
        renderTuringHistory();

        if (tmMachine.status === 'ACCEPTED' || tmMachine.status === 'REJECTED' || tmMachine.status === 'HALTED') {
            stopTuringAuto();
            showTuringFinalVerdict();
        }
    }

    function toggleTuringAuto() {
        if (tmAutoInterval) {
            stopTuringAuto();
        } else {
            if (tmMachine.status === 'ACCEPTED' || tmMachine.status === 'REJECTED') {
                resetTuringMachine();
            }
            tmBtnAutoText.textContent = 'Pausar Execução';
            tmBtnAuto.classList.replace('btn-success', 'btn-secondary');
            tmAutoInterval = setInterval(() => {
                stepTuringMachine();
            }, tmSpeed);
        }
    }

    function stopTuringAuto() {
        if (tmAutoInterval) {
            clearInterval(tmAutoInterval);
            tmAutoInterval = null;
        }
        if (tmBtnAutoText) tmBtnAutoText.textContent = 'Executar Automaticamente';
        if (tmBtnAuto) tmBtnAuto.classList.replace('btn-secondary', 'btn-success');
    }

    function updateTuringUI() {
        const config = tmMachine.getConfiguration();

        // 1. Textos e Estado
        tmStateDisplay.textContent = config.currentState;
        tmStepDisplay.textContent = config.stepCount;
        tmHeadPosDisplay.textContent = config.headIndex;
        tmSymbolReadDisplay.textContent = `'${config.currentSymbol}'`;

        // 2. Badge de Status
        updateOutcomeBadge(tmOutcomeBadge, tmReasonBox, config.status, config.haltReason);

        // 3. Renderização da Fita com cores semânticas
        renderTuringTape(config.tapeRange);

        // 4. Narração em Tempo Real e Transição Ativa
        if (config.lastTransition) {
            const t = config.lastTransition;
            const moveDir = t.move === 'R' ? 'Direita (R)' : (t.move === 'L' ? 'Esquerda (L)' : 'Neutro (S)');
            tmActiveTransFormula.textContent = `δ( ${t.fromState}, '${t.oldSymbol}' ) → ( ${t.toState}, '${t.actualWrite}', ${t.move} )`;
            tmActiveTransDesc.textContent = `${t.description || ''} [Escreveu '${t.actualWrite}', moveu para ${moveDir}]`;

            // Narração em Linguagem Natural
            if (tmNarrationText) {
                const narration = t.human || `Leu '${t.oldSymbol}', gravou '${t.actualWrite}' e deslocou o cabeçote para ${moveDir}, mudando para o estado ${t.toState}.`;
                tmNarrationText.innerHTML = `<strong>Passo #${config.stepCount}:</strong> ${narration}`;
            }

            // Próximo Objetivo do Estado Atual
            if (tmNarrationGoalText && tmCurrentPreset.stateDescriptions) {
                const stateGoal = tmCurrentPreset.stateDescriptions[config.currentState] || `Operando no estado ${config.currentState}.`;
                tmNarrationGoalText.textContent = stateGoal;
            }

            highlightActiveRule(tmRulesTableBody, (row) => {
                return row.getAttribute('data-from') === t.fromState &&
                       (row.getAttribute('data-read') === '*' || row.getAttribute('data-read') === t.oldSymbol);
            });
        } else {
            tmActiveTransFormula.textContent = 'Nenhuma transição executada ainda.';
            tmActiveTransDesc.textContent = 'Aguardando o início da computação na fita.';
            highlightActiveRule(tmRulesTableBody, () => false);
        }

        // Se terminou, atualiza veredito
        if (config.isAccepted || config.isRejected || config.status === 'HALTED') {
            showTuringFinalVerdict();
        }
    }

    function renderTuringTape(tapeRange) {
        tmTapeTrack.innerHTML = '';

        tapeRange.cells.forEach((cell) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'tape-cell';
            if (cell.isHead) cellDiv.classList.add('active-head');

            // Determina a classe de cor semântica do símbolo
            let symbolClass = 'symbol-original';
            if (cell.symbol === '_' || cell.symbol === '') {
                symbolClass = 'symbol-blank';
            } else if (['X', 'Y', 'Z', 'A', 'B'].includes(cell.symbol)) {
                symbolClass = 'symbol-marked';
            }

            cellDiv.innerHTML = `
                <div class="tape-cell-head-pointer">
                    <span>Cabeçote</span>
                    <span>▼</span>
                </div>
                <div class="cell-box ${symbolClass}">${cell.symbol}</div>
                <div class="cell-index">${cell.index}</div>
            `;
            tmTapeTrack.appendChild(cellDiv);
        });

        // Centraliza a visão no cabeçote com scroll suave
        const activeHeadEl = tmTapeTrack.querySelector('.tape-cell.active-head');
        if (activeHeadEl && tmTapeViewport) {
            const headOffset = activeHeadEl.offsetLeft;
            const viewportHalf = tmTapeViewport.clientWidth / 2;
            tmTapeViewport.scrollTo({
                left: headOffset - viewportHalf + (activeHeadEl.clientWidth / 2),
                behavior: 'smooth'
            });
        }
    }

    function showTuringFinalVerdict() {
        if (!tmVerdictBanner) return;
        const config = tmMachine.getConfiguration();
        const input = tmMachine.originalInput;
        const tapeClean = tmMachine.getTapeString();

        tmVerdictBanner.className = 'verdict-banner';

        if (config.isAccepted) {
            tmVerdictBanner.classList.add('accepted');
            tmVerdictBanner.style.display = 'block';
            tmVerdictTitle.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>RESULTADO FINAL: CADEIA ACEITA COM SUCESSO!</span>
            `;

            if (tmCurrentPreset.verdictExplainer && tmCurrentPreset.verdictExplainer.accept) {
                tmVerdictDesc.textContent = tmCurrentPreset.verdictExplainer.accept(input, tapeClean, config.stepCount);
            } else {
                tmVerdictDesc.textContent = `A palavra "${input}" foi aceita pela Máquina de Turing ao alcançar o estado de aceitação (${config.currentState}).`;
            }
        } else if (config.isRejected) {
            tmVerdictBanner.classList.add('rejected');
            tmVerdictBanner.style.display = 'block';
            tmVerdictTitle.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>RESULTADO FINAL: CADEIA REJEITADA!</span>
            `;

            if (tmCurrentPreset.verdictExplainer && tmCurrentPreset.verdictExplainer.reject) {
                tmVerdictDesc.textContent = tmCurrentPreset.verdictExplainer.reject(input, tapeClean, config.stepCount, config.haltReason);
            } else {
                tmVerdictDesc.textContent = `A palavra "${input}" foi rejeitada. Motivo: ${config.haltReason}`;
            }
        } else {
            tmVerdictBanner.classList.add('halted');
            tmVerdictBanner.style.display = 'block';
            tmVerdictTitle.innerHTML = `<span>RESULTADO: COMPUTAÇÃO FINALIZADA</span>`;
            tmVerdictDesc.textContent = config.haltReason;
        }

        // Métricas didáticas
        if (tmMetricInput) tmMetricInput.textContent = `"${input}"`;
        if (tmMetricTape) tmMetricTape.textContent = `"${tapeClean}"`;
        if (tmMetricSteps) tmMetricSteps.textContent = config.stepCount;
        if (tmMetricState) tmMetricState.textContent = config.currentState;
    }

    function renderTuringRulesTable() {
        tmRulesTableBody.innerHTML = '';
        tmCurrentPreset.machine.transitions.forEach((t) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-from', t.fromState);
            tr.setAttribute('data-read', t.readSymbol);

            const moveLabel = t.move === 'R' ? 'Direita (R)' : (t.move === 'L' ? 'Esquerda (L)' : 'Parado (S)');

            tr.innerHTML = `
                <td><code>${t.fromState}</code></td>
                <td><strong>'${t.readSymbol}'</strong></td>
                <td><code>${t.toState}</code></td>
                <td><strong>'${t.writeSymbol}'</strong></td>
                <td>${moveLabel}</td>
            `;
            tmRulesTableBody.appendChild(tr);
        });
    }

    function renderTuringHistory() {
        tmHistoryTableBody.innerHTML = '';
        tmMachine.history.forEach((h) => {
            const tr = document.createElement('tr');
            const actionText = h.transition ? 
                (h.transition.human || `Escreveu '${h.transition.actualWrite}', moveu ${h.transition.move}`) : 
                (h.step === 0 ? 'Fita inicializada' : h.status);

            tr.innerHTML = `
                <td><strong>#${h.step}</strong></td>
                <td><code>${h.state}</code></td>
                <td>Pos ${h.headIndex}</td>
                <td>'${h.currentSymbol}'</td>
                <td><small>${actionText}</small></td>
            `;
            tmHistoryTableBody.appendChild(tr);
        });

        const historyContainer = tmHistoryTableBody.closest('.history-container');
        if (historyContainer) historyContainer.scrollTop = historyContainer.scrollHeight;
    }

    // Eventos Turing
    tmPresetSelect.addEventListener('change', (e) => loadTuringPreset(parseInt(e.target.value)));
    tmBtnLoad.addEventListener('click', resetTuringMachine);
    tmBtnStep.addEventListener('click', stepTuringMachine);
    tmBtnAuto.addEventListener('click', toggleTuringAuto);
    tmBtnReset.addEventListener('click', resetTuringMachine);
    tmSpeedInput.addEventListener('input', (e) => {
        tmSpeed = parseInt(e.target.value);
        tmSpeedVal.textContent = `${tmSpeed}ms`;
        if (tmAutoInterval) {
            clearInterval(tmAutoInterval);
            tmAutoInterval = setInterval(stepTuringMachine, tmSpeed);
        }
    });

    // ==============================================================
    // 2. CONTROLADOR DA MÁQUINA DE DUAS PILHAS (2-PDA)
    // ==============================================================
    let tsCurrentPreset = EXAMPLES.twoStack[0];
    let tsMachine = new TwoStackMachine(tsCurrentPreset.machine);
    let tsAutoInterval = null;
    let tsSpeed = 500;

    // Elementos DOM - 2 Pilhas
    const tsPresetSelect = document.getElementById('ts-preset-select');
    const tsInputString = document.getElementById('ts-input-string');
    const tsBtnLoad = document.getElementById('ts-btn-load');
    const tsQuickTests = document.getElementById('ts-quick-tests');
    const tsBtnStep = document.getElementById('ts-btn-step');
    const tsBtnAuto = document.getElementById('ts-btn-auto');
    const tsBtnAutoText = document.getElementById('ts-btn-auto-text');
    const tsBtnReset = document.getElementById('ts-btn-reset');
    const tsSpeedInput = document.getElementById('ts-speed');
    const tsSpeedVal = document.getElementById('ts-speed-val');

    const tsDidacticGoal = document.getElementById('ts-didactic-goal');
    const tsDidacticSteps = document.getElementById('ts-didactic-steps');
    const tsNarrationText = document.getElementById('ts-narration-text');

    const tsVerdictBanner = document.getElementById('ts-verdict-banner');
    const tsVerdictTitle = document.getElementById('ts-verdict-title');
    const tsVerdictDesc = document.getElementById('ts-verdict-desc');
    const tsMetricInput = document.getElementById('ts-metric-input');
    const tsMetricSteps = document.getElementById('ts-metric-steps');
    const tsMetricTop1 = document.getElementById('ts-metric-top1');
    const tsMetricTop2 = document.getElementById('ts-metric-top2');

    const tsStateDisplay = document.getElementById('ts-state-display');
    const tsStepDisplay = document.getElementById('ts-step-display');
    const tsRemainingDisplay = document.getElementById('ts-remaining-display');
    const tsOutcomeBadge = document.getElementById('ts-outcome-badge');
    const tsReasonBox = document.getElementById('ts-reason-box');

    const tsInputStream = document.getElementById('ts-input-stream');
    const tsStreamPointer = document.getElementById('ts-stream-pointer');
    const tsStack1Tube = document.getElementById('ts-stack-1-tube');
    const tsStack2Tube = document.getElementById('ts-stack-2-tube');
    const tsP1TopInfo = document.getElementById('ts-p1-top-info');
    const tsP2TopInfo = document.getElementById('ts-p2-top-info');

    const tsActiveTransFormula = document.getElementById('ts-active-trans-formula');
    const tsActiveTransDesc = document.getElementById('ts-active-trans-desc');
    const tsRulesTableBody = document.getElementById('ts-rules-table-body');
    const tsHistoryTableBody = document.getElementById('ts-history-table-body');

    function initTwoStackPresets() {
        tsPresetSelect.innerHTML = '';
        EXAMPLES.twoStack.forEach((preset, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = preset.name;
            tsPresetSelect.appendChild(opt);
        });

        loadTwoStackPreset(0);
    }

    function loadTwoStackPreset(index) {
        stopTwoStackAuto();
        tsCurrentPreset = EXAMPLES.twoStack[index];
        tsMachine = new TwoStackMachine(tsCurrentPreset.machine);
        tsInputString.value = tsCurrentPreset.defaultInput;

        renderTwoStackDidacticGuide();

        // Renderiza botões rápidos de teste com separação entre válidos e inválidos
        renderQuickTests(tsQuickTests, tsCurrentPreset, (inputVal) => {
            tsInputString.value = inputVal;
            resetTwoStackMachine();
        });

        renderTwoStackRulesTable();
        resetTwoStackMachine();
    }

    const tsDidacticWhy = document.getElementById('ts-didactic-why');
    const tsDidacticSymbols = document.getElementById('ts-didactic-symbols');

    function renderTwoStackDidacticGuide() {
        if (!tsDidacticGoal || !tsDidacticSteps) return;
        tsDidacticGoal.textContent = tsCurrentPreset.goal || tsCurrentPreset.description;

        // Por que este problema é importante
        if (tsDidacticWhy) {
            if (tsCurrentPreset.whyImportant) {
                tsDidacticWhy.style.display = 'block';
                tsDidacticWhy.innerHTML = `<strong>💡 Por Que Este Problema é Importante:</strong> ${tsCurrentPreset.whyImportant}`;
            } else {
                tsDidacticWhy.style.display = 'none';
            }
        }

        // Estratégia passo a passo
        tsDidacticSteps.innerHTML = '';
        if (tsCurrentPreset.strategy && Array.isArray(tsCurrentPreset.strategy)) {
            tsCurrentPreset.strategy.forEach((stepText) => {
                const item = document.createElement('div');
                item.className = 'didactic-step-item';
                item.innerHTML = `<span>&bull;</span> <span>${stepText}</span>`;
                tsDidacticSteps.appendChild(item);
            });
        }

        // Guia de símbolos/pilhas
        if (tsDidacticSymbols) {
            tsDidacticSymbols.innerHTML = '';
            if (tsCurrentPreset.symbolsGuide && Array.isArray(tsCurrentPreset.symbolsGuide)) {
                tsCurrentPreset.symbolsGuide.forEach((sg) => {
                    const item = document.createElement('div');
                    item.className = 'didactic-symbol-item';
                    item.innerHTML = `<span class="sym-badge">${sg.symbol}</span> <span>${sg.meaning}</span>`;
                    tsDidacticSymbols.appendChild(item);
                });
            }
        }
    }

    function resetTwoStackMachine() {
        stopTwoStackAuto();
        const inputVal = tsInputString.value.trim();
        tsMachine.reset(inputVal);

        if (tsVerdictBanner) tsVerdictBanner.style.display = 'none';
        if (tsNarrationText) {
            tsNarrationText.textContent = `A máquina foi carregada com a palavra "${inputVal || 'ε'}". Clique em "Executar Próximo Passo" para iniciar.`;
        }

        updateTwoStackUI();
        renderTwoStackHistory();
    }

    function stepTwoStackMachine() {
        if (tsMachine.status === 'ACCEPTED' || tsMachine.status === 'REJECTED' || tsMachine.status === 'HALTED') {
            stopTwoStackAuto();
            return;
        }

        tsMachine.step();
        updateTwoStackUI();
        renderTwoStackHistory();

        if (tsMachine.status === 'ACCEPTED' || tsMachine.status === 'REJECTED' || tsMachine.status === 'HALTED') {
            stopTwoStackAuto();
            showTwoStackFinalVerdict();
        }
    }

    function toggleTwoStackAuto() {
        if (tsAutoInterval) {
            stopTwoStackAuto();
        } else {
            if (tsMachine.status === 'ACCEPTED' || tsMachine.status === 'REJECTED') {
                resetTwoStackMachine();
            }
            tsBtnAutoText.textContent = 'Pausar Execução';
            tsBtnAuto.classList.replace('btn-success', 'btn-secondary');
            tsAutoInterval = setInterval(() => {
                stepTwoStackMachine();
            }, tsSpeed);
        }
    }

    function stopTwoStackAuto() {
        if (tsAutoInterval) {
            clearInterval(tsAutoInterval);
            tsAutoInterval = null;
        }
        if (tsBtnAutoText) tsBtnAutoText.textContent = 'Executar Automaticamente';
        if (tsBtnAuto) tsBtnAuto.classList.replace('btn-secondary', 'btn-success');
    }

    function updateTwoStackUI() {
        const config = tsMachine.getConfiguration();

        tsStateDisplay.textContent = config.currentState;
        tsStepDisplay.textContent = config.stepCount;
        const remaining = config.input.slice(config.inputIndex);
        tsRemainingDisplay.textContent = remaining.length > 0 ? `"${remaining}"` : '∅ (concluída)';

        updateOutcomeBadge(tsOutcomeBadge, tsReasonBox, config.status, config.haltReason);

        renderTwoStackInputStream(config.input, config.inputIndex);

        renderStackTube(tsStack1Tube, config.stack1, tsP1TopInfo, 'P₁');
        renderStackTube(tsStack2Tube, config.stack2, tsP2TopInfo, 'P₂');

        if (config.lastTransition) {
            const t = config.lastTransition;
            const inChar = t.consumedChar === 'ε' ? 'ε' : `'${t.consumedChar}'`;
            tsActiveTransFormula.textContent = `δ( ${t.fromState}, ${inChar}, '${t.top1}', '${t.top2}' ) → ( ${t.toState}, '${t.write1}', '${t.write2}' )`;
            tsActiveTransDesc.textContent = t.description || 'Transição executada com sucesso.';

            if (tsNarrationText) {
                tsNarrationText.innerHTML = `<strong>Passo #${config.stepCount}:</strong> ${t.human || t.description}`;
            }

            highlightActiveRule(tsRulesTableBody, (row) => {
                return row.getAttribute('data-from') === t.fromState &&
                       row.getAttribute('data-in') === t.readInput &&
                       (row.getAttribute('data-top1') === '*' || row.getAttribute('data-top1') === t.top1) &&
                       (row.getAttribute('data-top2') === '*' || row.getAttribute('data-top2') === t.top2);
            });
        } else {
            tsActiveTransFormula.textContent = 'Nenhuma transição executada ainda.';
            tsActiveTransDesc.textContent = 'Aguardando o início da computação.';
            highlightActiveRule(tsRulesTableBody, () => false);
        }

        if (config.isAccepted || config.isRejected || config.status === 'HALTED') {
            showTwoStackFinalVerdict();
        }
    }

    function showTwoStackFinalVerdict() {
        if (!tsVerdictBanner) return;
        const config = tsMachine.getConfiguration();
        const input = tsMachine.input;

        tsVerdictBanner.className = 'verdict-banner';

        if (config.isAccepted) {
            tsVerdictBanner.classList.add('accepted');
            tsVerdictBanner.style.display = 'block';
            tsVerdictTitle.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>RESULTADO FINAL: CADEIA ACEITA COM SUCESSO!</span>
            `;

            if (tsCurrentPreset.verdictExplainer && tsCurrentPreset.verdictExplainer.accept) {
                tsVerdictDesc.textContent = tsCurrentPreset.verdictExplainer.accept(input, config);
            } else {
                tsVerdictDesc.textContent = `A palavra "${input}" foi aceita pela Máquina de Duas Pilhas.`;
            }
        } else if (config.isRejected) {
            tsVerdictBanner.classList.add('rejected');
            tsVerdictBanner.style.display = 'block';
            tsVerdictTitle.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span>RESULTADO FINAL: CADEIA REJEITADA!</span>
            `;

            if (tsCurrentPreset.verdictExplainer && tsCurrentPreset.verdictExplainer.reject) {
                tsVerdictDesc.textContent = tsCurrentPreset.verdictExplainer.reject(input, config);
            } else {
                tsVerdictDesc.textContent = `A palavra "${input}" foi rejeitada. Motivo: ${config.haltReason}`;
            }
        }

        if (tsMetricInput) tsMetricInput.textContent = `"${input}"`;
        if (tsMetricSteps) tsMetricSteps.textContent = config.stepCount;
        if (tsMetricTop1) tsMetricTop1.textContent = `[ ${config.top1} ]`;
        if (tsMetricTop2) tsMetricTop2.textContent = `[ ${config.top2} ]`;
    }

    function renderTwoStackInputStream(input, currentIndex) {
        tsInputStream.innerHTML = '';
        tsStreamPointer.textContent = `Índice de leitura: ${currentIndex} / ${input.length}`;

        if (!input || input.length === 0) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'stream-cell';
            emptyCell.textContent = 'ε';
            tsInputStream.appendChild(emptyCell);
            return;
        }

        for (let i = 0; i < input.length; i++) {
            const cell = document.createElement('div');
            cell.className = 'stream-cell';
            cell.textContent = input[i];

            if (i < currentIndex) {
                cell.classList.add('consumed');
            } else if (i === currentIndex) {
                cell.classList.add('current');
            }
            tsInputStream.appendChild(cell);
        }
    }

    function renderStackTube(tubeElement, stackArray, topInfoElement, stackName) {
        tubeElement.innerHTML = '';
        const top = stackArray.length > 0 ? stackArray[stackArray.length - 1] : 'vazia';
        topInfoElement.textContent = `Topo de ${stackName}: [ ${top} ] (Total: ${stackArray.length})`;

        stackArray.forEach((symbol, index) => {
            const isTop = index === stackArray.length - 1;
            const item = document.createElement('div');
            item.className = 'stack-item';
            if (isTop) item.classList.add('top-item');
            if (symbol === '$' || symbol === 'Z0') item.classList.add('bottom-symbol');
            item.textContent = symbol;
            tubeElement.appendChild(item);
        });
    }

    function renderTwoStackRulesTable() {
        tsRulesTableBody.innerHTML = '';
        tsCurrentPreset.machine.transitions.forEach((t) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-from', t.fromState);
            tr.setAttribute('data-in', t.readInput);
            tr.setAttribute('data-top1', t.top1);
            tr.setAttribute('data-top2', t.top2);

            const readInputDisplay = t.readInput === '' || t.readInput === 'ε' ? 'ε (vazio)' : `'${t.readInput}'`;
            const write1Display = t.write1 === '' || t.write1 === 'ε' ? 'pop (ε)' : t.write1;
            const write2Display = t.write2 === '' || t.write2 === 'ε' ? 'pop (ε)' : t.write2;

            tr.innerHTML = `
                <td><code>${t.fromState}</code></td>
                <td><strong>${readInputDisplay}</strong></td>
                <td>${t.top1}</td>
                <td>${t.top2}</td>
                <td><code>${t.toState}</code></td>
                <td>${write1Display}</td>
                <td>${write2Display}</td>
            `;
            tsRulesTableBody.appendChild(tr);
        });
    }

    function renderTwoStackHistory() {
        tsHistoryTableBody.innerHTML = '';
        tsMachine.history.forEach((h) => {
            const tr = document.createElement('tr');
            const top1 = h.stack1.length > 0 ? h.stack1[h.stack1.length - 1] : '-';
            const top2 = h.stack2.length > 0 ? h.stack2[h.stack2.length - 1] : '-';
            const actionText = h.transition ? (h.transition.human || h.transition.description) : (h.step === 0 ? 'Início' : h.status);

            tr.innerHTML = `
                <td><strong>#${h.step}</strong></td>
                <td><code>${h.state}</code></td>
                <td>"${h.remainingInput}"</td>
                <td>[ ${top1} ]</td>
                <td>[ ${top2} ]</td>
                <td><small>${actionText}</small></td>
            `;
            tsHistoryTableBody.appendChild(tr);
        });

        const historyContainer = tsHistoryTableBody.closest('.history-container');
        if (historyContainer) historyContainer.scrollTop = historyContainer.scrollHeight;
    }

    // Eventos 2 Pilhas
    tsPresetSelect.addEventListener('change', (e) => loadTwoStackPreset(parseInt(e.target.value)));
    tsBtnLoad.addEventListener('click', resetTwoStackMachine);
    tsBtnStep.addEventListener('click', stepTwoStackMachine);
    tsBtnAuto.addEventListener('click', toggleTwoStackAuto);
    tsBtnReset.addEventListener('click', resetTwoStackMachine);
    tsSpeedInput.addEventListener('input', (e) => {
        tsSpeed = parseInt(e.target.value);
        tsSpeedVal.textContent = `${tsSpeed}ms`;
        if (tsAutoInterval) {
            clearInterval(tsAutoInterval);
            tsAutoInterval = setInterval(stepTwoStackMachine, tsSpeed);
        }
    });

    // ==========================================
    // FUNÇÕES AUXILIARES COMPARTILHADAS
    // ==========================================
    function renderQuickTests(container, preset, onClickCallback) {
        container.innerHTML = '';

        const validList = preset.validTests || [];
        const invalidList = preset.invalidTests || [];

        // Linha 1: Casos Válidos (Devem ser aceitos)
        if (validList.length > 0) {
            const rowValid = document.createElement('div');
            rowValid.className = 'quick-tests-row';

            const labelValid = document.createElement('span');
            labelValid.className = 'quick-tests-label label-valid';
            labelValid.innerHTML = '🟢 Casos Válidos (Aceita):';
            rowValid.appendChild(labelValid);

            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'quick-chips-wrapper';

            validList.forEach(val => {
                const chip = document.createElement('button');
                chip.className = 'quick-chip chip-valid';
                chip.textContent = val === '' ? 'ε (vazio)' : val;
                chip.title = `Testar cadeia válida: "${val}"`;
                chip.addEventListener('click', () => onClickCallback(val));
                chipsWrap.appendChild(chip);
            });
            rowValid.appendChild(chipsWrap);
            container.appendChild(rowValid);
        }

        // Linha 2: Casos Inválidos (Devem ser rejeitados)
        if (invalidList.length > 0) {
            const rowInvalid = document.createElement('div');
            rowInvalid.className = 'quick-tests-row';

            const labelInvalid = document.createElement('span');
            labelInvalid.className = 'quick-tests-label label-invalid';
            labelInvalid.innerHTML = '🔴 Casos Inválidos (Rejeita):';
            rowInvalid.appendChild(labelInvalid);

            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'quick-chips-wrapper';

            invalidList.forEach(val => {
                const chip = document.createElement('button');
                chip.className = 'quick-chip chip-invalid';
                chip.textContent = val === '' ? 'ε (vazio)' : val;
                chip.title = `Testar cadeia inválida: "${val}"`;
                chip.addEventListener('click', () => onClickCallback(val));
                chipsWrap.appendChild(chip);
            });
            rowInvalid.appendChild(chipsWrap);
            container.appendChild(rowInvalid);
        }
    }

    function updateOutcomeBadge(badgeEl, reasonEl, status, reason) {
        badgeEl.className = 'outcome-pill';

        if (status === 'READY') {
            badgeEl.classList.add('ready');
            badgeEl.innerHTML = '<span>Pronto</span>';
            reasonEl.style.display = 'none';
        } else if (status === 'RUNNING') {
            badgeEl.classList.add('running');
            badgeEl.innerHTML = '<span>Em Execução</span>';
            reasonEl.style.display = 'none';
        } else if (status === 'ACCEPTED') {
            badgeEl.classList.add('accepted');
            badgeEl.innerHTML = '<span>✓ Cadeia Aceita</span>';
            reasonEl.style.display = 'block';
            reasonEl.textContent = `Motivo: ${reason}`;
        } else if (status === 'REJECTED') {
            badgeEl.classList.add('rejected');
            badgeEl.innerHTML = '<span>✗ Cadeia Rejeitada</span>';
            reasonEl.style.display = 'block';
            reasonEl.textContent = `Motivo: ${reason}`;
        } else {
            badgeEl.classList.add('halted');
            badgeEl.innerHTML = '<span>Parada (Halt)</span>';
            reasonEl.style.display = 'block';
            reasonEl.textContent = `Motivo: ${reason}`;
        }
    }

    function highlightActiveRule(tbodyElement, matcherFunc) {
        const rows = tbodyElement.querySelectorAll('tr');
        rows.forEach(r => {
            if (matcherFunc(r)) {
                r.classList.add('active-rule');
                r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                r.classList.remove('active-rule');
            }
        });
    }

    // Inicializa a aplicação com foco prioritário na Máquina de Turing
    initTuringPresets();
    initTwoStackPresets();
});
