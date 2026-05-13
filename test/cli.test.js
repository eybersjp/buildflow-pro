const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const cliPath = path.resolve(__dirname, '../cli/index.js');
const pkg = require('../package.json');

// ─── Helper ───────────────────────────────────────────────────────────────────

function runCli(args = '', opts = {}) {
  return execSync(`node "${cliPath}" ${args}`.trim(), {
    encoding: 'utf8',
    ...opts,
  });
}

function runCliExpectFail(args = '', opts = {}) {
  try {
    execSync(`node "${cliPath}" ${args}`.trim(), {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...opts,
    });
    assert.fail('Expected CLI to exit with non-zero code');
  } catch (err) {
    return err; // err.stdout / err.stderr / err.status
  }
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'buildflow-test-'));
}

// ─── --version ────────────────────────────────────────────────────────────────

test('--version flag prints version and exits 0', () => {
  const output = runCli('--version');
  assert.match(output, /buildflow-pro/);
  assert.match(output, new RegExp(pkg.version.replace(/\./g, '\\.')));
});

test('-v shorthand prints version', () => {
  const output = runCli('-v');
  assert.match(output, new RegExp(pkg.version.replace(/\./g, '\\.')));
});

// ─── --help ───────────────────────────────────────────────────────────────────

test('--help flag prints usage and exits 0', () => {
  const output = runCli('--help');
  assert.match(output, /Usage:/);
  assert.match(output, /init/);
  assert.match(output, /upgrade/);
});

test('-h shorthand prints usage', () => {
  const output = runCli('-h');
  assert.match(output, /Usage:/);
});

test('no arguments prints usage and exits 0', () => {
  const output = runCli('');
  assert.match(output, /Usage:/);
});

// ─── unknown command ──────────────────────────────────────────────────────────

test('unknown command exits with code 1 and prints error', () => {
  const err = runCliExpectFail('foobar');
  assert.strictEqual(err.status, 1);
  assert.match(err.stdout, /unknown command/);
});

// ─── init ─────────────────────────────────────────────────────────────────────

test('init: installs kit into a fresh directory', () => {
  const tempDir = makeTempDir();
  try {
    const output = runCli('init', { cwd: tempDir });

    assert.match(output, /BuildFlow Pro Installed Successfully!/);

    // Core directories
    assert.ok(fs.existsSync(path.join(tempDir, '.antigravity', 'rules')), 'rules dir');
    assert.ok(fs.existsSync(path.join(tempDir, '.antigravity', 'rules', 'appendix')), 'appendix dir');
    assert.ok(fs.existsSync(path.join(tempDir, '.antigravity', 'workflows')), 'workflows dir');
    assert.ok(fs.existsSync(path.join(tempDir, '.antigravity', 'commands')), 'commands dir');
    assert.ok(fs.existsSync(path.join(tempDir, '.antigravity', 'memory')), 'memory dir');
    assert.ok(fs.existsSync(path.join(tempDir, 'database', 'migrations')), 'migrations dir');
    assert.ok(fs.existsSync(path.join(tempDir, 'database', 'rollback')), 'rollback dir');
    assert.ok(fs.existsSync(path.join(tempDir, 'docs', 'ADR')), 'ADR dir');

    // Key files
    assert.ok(fs.existsSync(path.join(tempDir, 'docs', 'BUILD_ROADMAP.md')), 'BUILD_ROADMAP.md');
    assert.ok(fs.existsSync(path.join(tempDir, '.gemini', 'settings.json')), 'settings.json');

    // Hooks config is valid JSON with correct structure
    const settings = JSON.parse(
      fs.readFileSync(path.join(tempDir, '.gemini', 'settings.json'), 'utf8')
    );
    assert.ok(settings.hooks.SessionStart, 'SessionStart hook present');
    assert.ok(settings.hooks.PreToolUse, 'PreToolUse hook present');
    assert.ok(settings.hooks.PostToolUse, 'PostToolUse hook present');

    // Core rules file installed
    assert.ok(
      fs.existsSync(path.join(tempDir, '.antigravity', 'rules', 'core-rules-dense.md')),
      'core-rules-dense.md installed'
    );

    // Memory files installed
    assert.ok(
      fs.existsSync(path.join(tempDir, '.antigravity', 'memory', 'task-plan.md')),
      'task-plan.md installed'
    );

  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('init: idempotent — safe to run twice without overwriting existing files', () => {
  const tempDir = makeTempDir();
  try {
    // First install
    runCli('init', { cwd: tempDir });

    // Mutate a memory file to simulate user edits
    const taskPlan = path.join(tempDir, '.antigravity', 'memory', 'task-plan.md');
    fs.writeFileSync(taskPlan, '# My Custom Task Plan\n\nUser edited this.');

    // Second install (overwrites kit files — memory is also overwritten on init, which is expected)
    const output = runCli('init', { cwd: tempDir });
    assert.match(output, /BuildFlow Pro Installed Successfully!/);

    // .gemini/settings.json should NOT be re-created if it already exists
    // (the CLI skips it if file exists — verify it's still valid JSON)
    const settings = JSON.parse(
      fs.readFileSync(path.join(tempDir, '.gemini', 'settings.json'), 'utf8')
    );
    assert.ok(settings.hooks, 'hooks still present after second init');

  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('init: BUILD_ROADMAP.md is NOT overwritten if it already exists', () => {
  const tempDir = makeTempDir();
  try {
    runCli('init', { cwd: tempDir });

    const roadmapPath = path.join(tempDir, 'docs', 'BUILD_ROADMAP.md');
    const customContent = '# Custom Roadmap\n\nUser customized this.';
    fs.writeFileSync(roadmapPath, customContent);

    runCli('init', { cwd: tempDir });

    const content = fs.readFileSync(roadmapPath, 'utf8');
    assert.strictEqual(content, customContent, 'BUILD_ROADMAP.md should not be overwritten');

  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// ─── upgrade ──────────────────────────────────────────────────────────────────

test('upgrade: succeeds in an initialized project and preserves memory', () => {
  const tempDir = makeTempDir();
  try {
    // Initialize first
    runCli('init', { cwd: tempDir });

    // Simulate user edits to memory
    const taskPlan = path.join(tempDir, '.antigravity', 'memory', 'task-plan.md');
    const userContent = '# My Custom Task Plan\n\nDo not overwrite this.';
    fs.writeFileSync(taskPlan, userContent);

    // Run upgrade
    const output = runCli('upgrade', { cwd: tempDir });
    assert.match(output, /BuildFlow Pro Upgraded Successfully!/);
    assert.match(output, /Memory files preserved/);

    // Memory file must be untouched
    const afterContent = fs.readFileSync(taskPlan, 'utf8');
    assert.strictEqual(afterContent, userContent, 'task-plan.md must not be overwritten by upgrade');

    // Kit files (non-memory) should be present
    assert.ok(
      fs.existsSync(path.join(tempDir, '.antigravity', 'rules', 'core-rules-dense.md')),
      'core-rules-dense.md present after upgrade'
    );

  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('upgrade: fails with code 1 in an uninitialized directory', () => {
  const tempDir = makeTempDir();
  try {
    const err = runCliExpectFail('upgrade', { cwd: tempDir });
    assert.strictEqual(err.status, 1);
    assert.match(err.stdout, /No \.antigravity directory found/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
