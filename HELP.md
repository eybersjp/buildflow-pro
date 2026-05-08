# BuildFlow Pro Help Documentation

Welcome to BuildFlow Pro — a production-focused AI development framework designed to help users build complete, well-structured, production-grade applications with the support of AI agents such as Google Antigravity.

BuildFlow Pro helps guide the development process from idea to deployment using structured workflows, governance gates, planning tools, architecture generation, security checks, and controlled feature-building commands.

## 1. What BuildFlow Pro Does

BuildFlow Pro gives your AI Agent a structured operating system for building software properly.

Instead of randomly prompting an AI to “build an app,” BuildFlow Pro guides the agent through a professional product development process:

*   Product discovery
*   PRD generation
*   Technical architecture planning
*   Database design
*   Design system creation
*   Feature planning
*   TDD-based implementation
*   Security and governance checks
*   Preview deployment
*   Production release

The goal is to reduce chaotic AI coding and replace it with a repeatable, safe, structured development workflow.

## 2. Installation

You can install BuildFlow Pro in a new or existing project by running:

```bash
npx buildflow-pro init
```

This command will initialize BuildFlow Pro inside your project.

It will copy the required `.antigravity/` folder and set up the project structure needed for your AI Agent to understand and follow the BuildFlow workflow.

## 3. Requirements

Before installing BuildFlow Pro, make sure you have the following installed:

```bash
node -v
```

BuildFlow Pro requires:
*   **Node.js >= 18**

You can also verify that npx is available:
```bash
npx -v
```

**Recommended tools:**
*   `git --version`

**A typical recommended setup is:**
*   Node.js 18+
*   Git
*   VS Code or Cursor
*   Google Antigravity
*   A package manager such as npm, pnpm, or yarn

## 4. Getting Started

After installing BuildFlow Pro, open your project in your preferred AI Agent, such as Google Antigravity.

Then type:
```
/start-production-app
```

The AI Agent will begin acting as a Product Manager and guide you through a structured discovery process.

It will ask questions about:
*   App name
*   Target users
*   Business purpose
*   Core features
*   User roles
*   Required integrations
*   Data requirements
*   Security needs
*   Deployment goals
*   Visual design preferences

After the discovery process, BuildFlow Pro will generate the initial foundation documents for your application.

## 5. Generated Project Documents

BuildFlow Pro is designed to generate and maintain key development documents, including:

*   `PRD.md`
*   `ARCHITECTURE.md`
*   `DATABASE_SPEC.md`
*   `DESIGN_SYSTEM.md`
*   `ROADMAP.md`
*   `SECURITY_GATES.md`
*   `DEPLOYMENT_PLAN.md`

These documents help the AI Agent stay aligned during the full build process.

## 6. Core Commands

You can trigger BuildFlow Pro workflows at any time by typing the following commands into your AI Agent chat.

### `/start-production-app`
Starts the full product discovery and app planning workflow. Use this when beginning a new application.
**Example:** `/start-production-app`
The AI will guide you through the complete setup process and generate the first version of your app documentation.

### `/plan`
Reviews or updates the current task plan. Use this when you want the AI to reason through the next steps before building.
**Example:** `/plan`
Recommended before starting any major feature.

### `/plan:status`
Shows a read-only snapshot of the current project phase, roadmap progress, and active task status.
**Example:** `/plan:status`
Use this when you feel lost or want to see exactly where the project currently stands.

### `/context-mode`
Manages the AI Agent’s context window to prevent memory exhaustion during long build sessions.
**Example:** `/context-mode`
Use this when:
*   The AI starts forgetting earlier decisions
*   The conversation becomes very long
*   Major architecture decisions need to be preserved
*   You are moving between development phases

### `/visualize-architecture`
Generates architecture diagrams using Mermaid format.
**Example:** `/visualize-architecture`
This can generate diagrams such as:
*   System architecture
*   Database relationships
*   User flow diagrams
*   API flow diagrams
*   Deployment architecture

### `/build-feature [feature]`
Builds a specific feature using safe implementation rules and Test-Driven Development.
**Example:** `/build-feature customer onboarding flow`

The AI should then:
1.  Review the current PRD
2.  Check the architecture
3.  Confirm the data model
4.  Create a feature plan
5.  Write tests first
6.  Implement the feature
7.  Run checks
8.  Update documentation

**Recommended examples:**
*   `/build-feature user authentication`
*   `/build-feature project dashboard`
*   `/build-feature customer CRM pipeline`
*   `/build-feature invoice generation`
*   `/build-feature admin settings page`

### `/security-audit`
Runs a comprehensive security and governance check against the BuildFlow Pro gates.
**Example:** `/security-audit`

This should review:
*   Authentication & Authorization
*   Role-based access control
*   Data validation
*   API protection
*   Environment variables & Secrets handling
*   Database access rules
*   Deployment safety
*   Audit logging

### `/deploy-preview`
Creates a staging or preview deployment.
**Example:** `/deploy-preview`
Use this before production release. The AI should verify: build succeeds, tests pass, env vars are configured, and core user flows are functional.

### `/production-release`
Finalizes the application and deploys it to production.
**Example:** `/production-release`
This command should only be used after all tests pass, security audit is complete, and preview deployment has been checked.

## 7. Recommended BuildFlow Development Process

1.  Install BuildFlow Pro
2.  Start the production app workflow
3.  Complete product discovery
4.  Generate the PRD, Architecture, and Database specs
5.  Create the design system
6.  Review the implementation roadmap
7.  Build one feature at a time
8.  Run security checks
9.  Deploy preview version
10. Test and fix issues
11. Release to production

## 8. Example First Session

After installing BuildFlow Pro, your first AI Agent session may look like this:

`> /start-production-app`

The AI should respond by asking product discovery questions:
*   What is the name of the application?
*   Who is the target user?
*   What problem does the app solve?
*   What are the main user roles?
*   What are the most important features for version 1?
*   Does the app need authentication? Payments? File uploads?
*   What type of dashboard should users see?
*   Where do you want to deploy the app?

After answering, the AI generates your foundation documents.

## 9. Testing Instructions

Before deploying, run your project’s test commands.

**Common examples:**
*   `npm test` or `npm run test`
*   `npm run lint` (For linting)
*   `npm run typecheck` (For type checking)
*   `npm run build` (For a production build)

A feature is not complete unless: tests pass, build passes, no critical lint errors remain, it matches the PRD, and docs are updated.

## 10. Troubleshooting

*   **AI forgets context:** Use `/context-mode`.
*   **Lost track of tasks:** Use `/plan:status`.
*   **AI builds without planning:** Use `/plan` first.
*   **CLI command does not work:** Check Node.js version (`node -v` >= 18).
*   **Folder not created:** Run `npx buildflow-pro init` again and confirm with `ls -la` or `dir`.
*   **Project feels unstructured:** Run `/plan:status` and `/visualize-architecture`.

## 11. Best Practices

*   **Use BuildFlow Pro one phase at a time.** Do not ask to build the entire app in one message.
*   **Use controlled feature commands:** `/build-feature user login`, etc.
*   **For every feature:** Plan first, Write tests, Build, Run checks, Update docs, Commit.

## 12. Suggested Git Workflow

1.  `git init`
2.  `git add . && git commit -m "Initial BuildFlow Pro setup"`
3.  For every new feature: `git checkout -b feature/name`
4.  After completion: `git add . && git commit -m "Add feature name"`

## 13. Recommended Project Folder Structure

```
project-root/
│
├── .antigravity/
│   ├── commands/
│   ├── workflows/
│   ├── skills/
│   ├── context/
│   └── governance/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SPEC.md
│   ├── DESIGN_SYSTEM.md
│   ├── ROADMAP.md
│   └── DEPLOYMENT_PLAN.md
│
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   └── tests/
│
├── package.json
├── README.md
└── .env.example
```

## 14. Governance Gates

1.  Product clarity gate
2.  Architecture gate
3.  Database safety gate
4.  Authentication gate
5.  Authorization gate
6.  Testing gate
7.  Security gate
8.  Deployment gate
9.  Production release gate

## 15. Quick Command Reference

| Command | Purpose |
| :--- | :--- |
| `/start-production-app` | Start full app discovery and documentation |
| `/plan` | Create or review the current implementation plan |
| `/plan:status` | View current project status |
| `/context-mode` | Manage long-session context |
| `/visualize-architecture` | Generate Mermaid architecture diagrams |
| `/build-feature [feature]` | Build a specific feature using TDD |
| `/security-audit` | Run governance and security checks |
| `/deploy-preview` | Deploy a staging or preview version |
| `/production-release` | Finalize and deploy to production |

## 16. Recommended First Commands

**For a new project:**
1.  `npx buildflow-pro init`
2.  Inside AI Agent: `/start-production-app`

**For an existing project:**
1.  `npx buildflow-pro init`
2.  Inside AI Agent: `/plan:status`, then `/visualize-architecture`, then `/build-feature name`

## 17. Support Files

For more detailed guidance, check: `README.md`, `WALKTHROUGH.md`, `PRD.md`, `ARCHITECTURE.md`, `DATABASE_SPEC.md`, `SECURITY_GATES.md`, `DEPLOYMENT_PLAN.md`.

---

**Final Note:** BuildFlow Pro is designed to turn AI-assisted development into a structured production workflow. Use it to keep your AI Agent focused, disciplined, and aligned with professional software development standards.
