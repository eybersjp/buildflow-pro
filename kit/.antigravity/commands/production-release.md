# Command: /production-release

When this command is run:

1. Run the Deployment workflow: `.antigravity/workflows/10-deployment.md`
2. Set deployment target to: Production
3. Run the full pre-deployment checklist
4. Activate security-engineer skill for security gate
5. Activate release-manager skill for GO / NO-GO decision
6. **REQUIRE explicit user approval** before production deploy
7. Guide user through production deployment
8. Monitor post-deployment for 30 minutes
9. Produce deployment report

## MANDATORY GATES

- [ ] Tests pass
- [ ] Security audit: GO
- [ ] Release review: GO
- [ ] User typed: "I APPROVE PRODUCTION DEPLOYMENT"

If any gate fails → STOP. Do not deploy.
