# Command: /security-audit

When this command is run:

1. Read `.antigravity/rules/security-rules.md`
2. Activate `security-engineer` skill
3. Run `.antigravity/workflows/09-security-audit.md`
4. Produce a security report at `docs/SECURITY_AUDIT.md`
5. Return a clear GO / NO-GO decision

This command must be run before every production deployment.
