# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.2.x (latest) | ✅ Yes |
| < 1.2.0 | ❌ No — upgrade to latest |

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

To report a security vulnerability in BuildFlow Pro:

1. **Email:** Use the contact on the [npm package page](https://www.npmjs.com/package/buildflow-pro)
2. **Subject:** `[SECURITY] BuildFlow Pro — [brief description]`
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Affected version(s)
   - Potential impact assessment

### Response Timeline

| Milestone | Target |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Patch release (if confirmed) | Within 14 days for critical/high |

## Scope

BuildFlow Pro is a **framework that installs kit files** into user projects. It does not:

- Run a server or expose network ports
- Store user data or secrets
- Make network requests (except during `npm install`)

Security concerns most relevant to this project:

- **Malicious kit files** — files installed into user projects that could contain dangerous instructions
- **CLI injection** — shell injection via the CLI installer
- **Supply chain** — npm package integrity

## Out of Scope

- Security of apps **built using** BuildFlow Pro (those are the user's responsibility)
- Vulnerabilities in downstream dependencies (report to those projects directly)

## Disclosure Policy

We follow [Responsible Disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html).
Confirmed vulnerabilities will be credited in the CHANGELOG unless the reporter requests anonymity.
