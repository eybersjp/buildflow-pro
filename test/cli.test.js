const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

test('BuildFlow Pro CLI Initialization', async (t) => {
  // 1. Create a temporary directory for the test
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'buildflow-test-'));
  const cliPath = path.resolve(__dirname, '../cli/index.js');
  
  // 2. Execute the CLI command in the temporary directory
  try {
    const output = execSync(`node ${cliPath} init`, { cwd: tempDir, encoding: 'utf8' });
    
    // Assert output contains success message
    assert.match(output, /BuildFlow Pro Installed Successfully!/);
    
    // 3. Verify directory structures were created correctly
    const rulesDir = path.join(tempDir, '.antigravity', 'rules');
    assert.ok(fs.existsSync(rulesDir), 'Rules directory should exist');
    
    // Assert the new Token Diet appendix folder exists
    assert.ok(fs.existsSync(path.join(rulesDir, 'appendix')), 'Appendix directory should exist');
    
    // Verify Roadmap file
    const roadmapPath = path.join(tempDir, 'docs', 'BUILD_ROADMAP.md');
    assert.ok(fs.existsSync(roadmapPath), 'BUILD_ROADMAP.md should be created');
    
    // Verify Gemini settings hooks
    const geminiSettingsPath = path.join(tempDir, '.gemini', 'settings.json');
    assert.ok(fs.existsSync(geminiSettingsPath), '.gemini/settings.json should be created');
    
    const settingsContent = JSON.parse(fs.readFileSync(geminiSettingsPath, 'utf8'));
    assert.ok(settingsContent.hooks.SessionStart, 'SessionStart hook should exist');
    assert.ok(settingsContent.hooks.PreToolUse, 'PreToolUse hook should exist');
    
  } finally {
    // 4. Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('BuildFlow Pro CLI Output without "init"', async (t) => {
  const cliPath = path.resolve(__dirname, '../cli/index.js');
  try {
    const output = execSync(`node ${cliPath}`, { encoding: 'utf8' });
    assert.fail('Should have exited with non-zero or specific output, wait, it exits 0 but prints usage');
  } catch (err) {
    // wait, `process.exit(0)` is used for usage, so it won't throw
  }
  
  const output = execSync(`node ${cliPath}`, { encoding: 'utf8' });
  assert.match(output, /Usage:/);
});
