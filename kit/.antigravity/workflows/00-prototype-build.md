# Workflow: Start Prototype Build

BuildFlow Pro — Workflow 00-PROTOTYPE

## Purpose

Rapidly build a working prototype or MVP with minimal friction, bypassing heavy documentation and strict governance gates in favor of speed.

## Trigger

Run this workflow when the user says:

- "/mode prototype" (during discovery)
- "I want to build a prototype"
- "hackathon mode"
- "skip planning, let's just build"

---

## Step 1: Rapid Intake

**Activate:** `product-manager` skill

Ask the user:

```text
🚀 PROTOTYPE MODE ACTIVATED

In Prototype Mode, I will skip most documentation (PRD, Architecture Specs, Design Systems) and go straight to building.

Please answer:
1. What are we building?
2. What are the 1-2 core features to prove the concept?
3. What is the tech stack? (Defaults to Next.js + Tailwind + Supabase)
```

---

## Step 2: Generate Prototype Spec

Create: `docs/PROTOTYPE_SPEC.md`

This is a single, concise file that combines:

- Minimal Requirements
- Basic Data Model (Mermaid ERD)
- Core User Flow

---

## Step 3: Scaffold & Build

Skip Phases 1-4. Jump directly to:

1. **Scaffold:** `06-project-scaffold.md`
2. **Build:** Start implementing the core features immediately using `/build-feature`.

---

## Step 4: Relaxed Rules

During Prototype Mode:

- **TDD is optional.**
- **Security Audit is optional.**
- **Multi-state UI (5 states) is recommended but not enforced.**
- **File size limits are relaxed.**

---

## ✋ WARNING

**Prototype Mode is NOT for production.** If this app ever needs to scale or handle real user data securely, you should switch back to `/mode production` and run the missing governance workflows.
