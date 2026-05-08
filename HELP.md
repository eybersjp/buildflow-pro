# BuildFlow Pro Help Documentation

Welcome to BuildFlow Pro! This document provides help and guidance on using the framework effectively.

## Installation

You can install and use BuildFlow Pro in any new or existing project by running:

```bash
npx buildflow-pro init
```

This will copy the `.antigravity/` folder and setup your project structure.

## Getting Started

Once installed, open your project in your AI Agent (e.g., Google Antigravity) and type:

```
/start-production-app
```

The AI will act as a Product Manager and guide you through a series of questions to generate your initial Product Requirements Document (PRD), Architecture, Database Spec, and Design System.

## Core Commands

You can trigger specific workflows at any time by typing these commands in the chat:

- `/plan` - Review or update your current task plan.
- `/plan:status` - Get a read-only snapshot of your project's current phase and status.
- `/context-mode` - Manage your context window to prevent memory exhaustion during long sessions.
- `/visualize-architecture` - Generate architecture diagrams (Mermaid format).
- `/build-feature [feature]` - Build a specific feature safely using Test-Driven Development (TDD) and the established component patterns.
- `/security-audit` - Run a comprehensive check against all 9 governance gates.
- `/deploy-preview` - Deploy a staging/preview version of your app.
- `/production-release` - Finalize the release and deploy to production.

## Troubleshooting

- **AI forgets context:** Use `/context-mode` to snapshot and reload essential context.
- **Lost track of tasks:** Use `/plan:status` to see exactly where you are in the BuildFlow roadmap.
- **CLI issues:** Ensure you have Node.js >= 18 installed if you are using the `npx` command.

For further assistance, check the `README.md` or the `WALKTHROUGH.md` guide provided in the repository.
