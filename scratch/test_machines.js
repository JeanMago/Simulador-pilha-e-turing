const fs = require('fs');
const path = require('path');

const twoStackCode = fs.readFileSync(path.join(__dirname, '../js/two_stack_machine.js'), 'utf8');
const turingCode = fs.readFileSync(path.join(__dirname, '../js/turing_machine.js'), 'utf8');
const examplesCode = fs.readFileSync(path.join(__dirname, '../js/examples.js'), 'utf8');

eval(twoStackCode);
eval(turingCode);
eval(examplesCode);

console.log('=== TESTANDO MÁQUINA DE TURING ===');
EXAMPLES.turing.forEach(preset => {
    console.log(`\nPreset MT: ${preset.name}`);
    const mDef = preset.machine;

    preset.validTests.forEach(input => {
        const m = new TuringMachine(mDef);
        m.reset(input);
        let s = 0;
        while (m.status !== 'ACCEPTED' && m.status !== 'REJECTED' && s < 500) {
            m.step();
            s++;
        }
        const ok = m.status === 'ACCEPTED' ? '✓ OK' : 'FAIL';
        console.log(`  [VALID]   "${input.padEnd(10)}" -> ${m.status.padEnd(8)} em ${s} passos. Fita: "${m.getTapeString()}" (${ok})`);
    });

    preset.invalidTests.forEach(input => {
        const m = new TuringMachine(mDef);
        m.reset(input);
        let s = 0;
        while (m.status !== 'ACCEPTED' && m.status !== 'REJECTED' && s < 500) {
            m.step();
            s++;
        }
        const ok = m.status === 'REJECTED' ? '✓ OK' : 'FAIL';
        console.log(`  [INVALID] "${input.padEnd(10)}" -> ${m.status.padEnd(8)} em ${s} passos. (${ok})`);
    });
});

console.log('\n=== TESTANDO MÁQUINA DE DUAS PILHAS ===');
EXAMPLES.twoStack.forEach(preset => {
    console.log(`\nPreset 2P: ${preset.name}`);
    const mDef = preset.machine;

    preset.validTests.forEach(input => {
        const m = new TwoStackMachine(mDef);
        m.reset(input);
        let s = 0;
        while (m.status !== 'ACCEPTED' && m.status !== 'REJECTED' && s < 200) {
            m.step();
            s++;
        }
        const ok = m.status === 'ACCEPTED' ? '✓ OK' : 'FAIL';
        console.log(`  [VALID]   "${input.padEnd(10)}" -> ${m.status.padEnd(8)} em ${s} passos. (${ok})`);
    });

    preset.invalidTests.forEach(input => {
        const m = new TwoStackMachine(mDef);
        m.reset(input);
        let s = 0;
        while (m.status !== 'ACCEPTED' && m.status !== 'REJECTED' && s < 200) {
            m.step();
            s++;
        }
        const ok = m.status === 'REJECTED' ? '✓ OK' : 'FAIL';
        console.log(`  [INVALID] "${input.padEnd(10)}" -> ${m.status.padEnd(8)} em ${s} passos. (${ok})`);
    });
});
