#!/usr/bin/env node
// BuildFlow Pro CLI — init command
// Usage: npx buildflow-pro init
// Or: node cli/index.js init

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

if (command !== 'init') {
  console.log('');
  console.log('BuildFlow Pro — Production App Builder for Antigravity');
  console.log('');
  console.log('Usage:');
  console.log('  npx buildflow-pro init     Install into current project');
  console.log('');
  process.exit(0);
}

const cwd = process.cwd();
const kitDir = path.join(__dirname, '..', 'kit');
const kitAntigravity = path.join(kitDir, '.antigravity');

console.log('');
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║          BuildFlow Pro — Production App Builder       ║');
console.log('║          Antigravity AI Development System            ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('');
console.log(`Installing into: ${cwd}`);
console.log('');

// Create folders
const folders = [
  '.antigravity/rules',
  '.antigravity/workflows',
  '.antigravity/commands',
  '.antigravity/templates',
  '.antigravity/memory',
  '.antigravity/skills/product-manager/templates',
  '.antigravity/skills/software-architect/templates',
  '.antigravity/skills/database-engineer/templates',
  '.antigravity/skills/frontend-engineer/templates',
  '.antigravity/skills/backend-engineer/templates',
  '.antigravity/skills/qa-engineer/templates',
  '.antigravity/skills/security-engineer/templates',
  '.antigravity/skills/devops-engineer/templates',
  '.antigravity/skills/documentation-writer/templates',
  '.antigravity/skills/release-manager/templates',
  'docs/ADR',
  'database/migrations',
  'database/rollback',
  'database/seeds',
];

folders.forEach((folder) => {
  const fullPath = path.join(cwd, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('✓ Folders created');

// Copy kit files
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(kitAntigravity)) {
  copyDir(kitAntigravity, path.join(cwd, '.antigravity'));
  console.log('✓ Kit files installed');
} else {
  console.log('⚠ Kit not found at expected path — creating minimal state files');
}

// Create BUILD_ROADMAP.md if it doesn't exist
const roadmapPath = path.join(cwd, 'docs', 'BUILD_ROADMAP.md');
if (!fs.existsSync(roadmapPath)) {
  fs.writeFileSync(roadmapPath, `# Build Roadmap

This file is managed by BuildFlow Pro.

| Phase | Name | Status |
|---|---|---|
| 0 | Discovery | ⏳ Not Started |
| 1 | PRD | ⏳ Not Started |
| 2 | Architecture | ⏳ Not Started |
| 3 | Database | ⏳ Not Started |
| 4 | UI/UX Plan | ⏳ Not Started |
| 5 | Scaffold | ⏳ Not Started |
| 6 | Auth | ⏳ Not Started |
| 7 | Core Features | ⏳ Not Started |
| 8 | Testing | ⏳ Not Started |
| 9 | Security | ⏳ Not Started |
| 10 | Deploy | ⏳ Not Started |
| 11 | Monitoring | ⏳ Not Started |
`);
}

console.log('✓ Project structure created');

// Configure context-mode hooks (Gemini CLI)
console.log('');
console.log('Configuring context-mode hooks for Gemini CLI...');

const geminiDir = path.join(cwd, '.gemini');
const geminiSettings = path.join(geminiDir, 'settings.json');

if (!fs.existsSync(geminiSettings)) {
  if (!fs.existsSync(geminiDir)) {
    fs.mkdirSync(geminiDir, { recursive: true });
  }

  const hooksConfig = {
    "mcpServers": {},
    "hooks": {
      "SessionStart": [
        {
          "matcher": ".*",
          "hooks": [
            {
              "type": "command",
              "command": "cmd /c echo [BuildFlow Pro] Session started. && if exist .antigravity\\\\memory\\\\task-plan.md (echo Task plan found. Run /plan:status to orient.) else (echo No task plan found. Run /plan to create one.) && if exist .antigravity\\\\memory\\\\learned-patterns.md (echo Learned patterns available - scan before starting.) else (echo)"
            }
          ]
        }
      ],
      "PreToolUse": [
        {
          "matcher": "write_file|replace_file_content|multi_replace_file_content",
          "hooks": [
            {
              "type": "command",
              "command": "cmd /c echo [BuildFlow Pro] File write detected. Confirming scope alignment with task-plan.md..."
            }
          ]
        }
      ],
      "PostToolUse": [
        {
          "matcher": "write_file|replace_file_content|multi_replace_file_content",
          "hooks": [
            {
              "type": "command",
              "command": "cmd /c echo [BuildFlow Pro] File written. Update changelog.md. If a new pattern was learned, add it to learned-patterns.md."
            }
          ]
        }
      ]
    }
  };

  fs.writeFileSync(geminiSettings, JSON.stringify(hooksConfig, null, 2), 'utf8');
  console.log('✓ Gemini CLI hooks configured at .gemini/settings.json');
} else {
  console.log('✓ Gemini CLI hooks already configured');
}

// Done
console.log('');
console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║         BuildFlow Pro Installed Successfully!         ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('');
console.log('Next step:');
console.log('  Open this project in Antigravity and run:');
console.log('');
console.log('  /start-production-app');
console.log('');
console.log('  The system will guide you from idea to production.');
console.log('');
