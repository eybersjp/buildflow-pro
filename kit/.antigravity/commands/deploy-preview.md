# Command: /deploy-preview

When this command is run:

1. Run the Deployment workflow: `.antigravity/workflows/10-deployment.md`
2. Set deployment target to: Preview / Staging
3. Run through the pre-deployment checklist
4. Run the security gate
5. Guide the user to deploy to preview
6. Verify the preview deployment

Do NOT auto-run any deployment commands.
Guide the user step by step.
