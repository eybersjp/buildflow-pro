# Support

## Getting Help

### Documentation

The best starting point for any question:

| Document | Contents |
|---|---|
| [`README.md`](README.md) | Overview, quick-start, full feature list |
| [`WALKTHROUGH.md`](WALKTHROUGH.md) | End-to-end build walkthrough with TaskFlow example |
| [`HELP.md`](HELP.md) | Troubleshooting, FAQ, and common issues |
| [`docs/CLIENT_ONBOARDING.md`](docs/CLIENT_ONBOARDING.md) | First-session setup checklist |
| [`examples/todo-saas/`](examples/todo-saas/) | Full demo project showing all planning artifacts |

---

### GitHub Issues

For **bugs, unexpected behavior, and feature requests:**

→ [Open an issue on GitHub](https://github.com/buildflow-pro/buildflow-pro/issues)

**Before opening an issue, please:**

1. Check the [existing issues](https://github.com/buildflow-pro/buildflow-pro/issues) (someone may have reported it)
2. Check [`HELP.md`](HELP.md) for known workarounds
3. Include your Node.js version (`node --version`) and OS
4. Include the exact command and error output

**Issue labels:**

| Label | Use for |
|---|---|
| `bug` | Something is broken |
| `feature-request` | New capability you'd like to see |
| `documentation` | Missing or unclear docs |
| `question` | General usage questions |

---

### GitHub Discussions

For **questions, ideas, and general discussion:**

→ [GitHub Discussions](https://github.com/buildflow-pro/buildflow-pro/discussions)

Good for:
- "Is there a pattern for X?"
- "How do I customize the governance gates?"
- "Sharing what you built with BuildFlow Pro"

---

### npm Package Page

The npm page contains install instructions, version history, and package stats:

→ [npmjs.com/package/buildflow-pro](https://www.npmjs.com/package/buildflow-pro)

---

## Known Limitations

| Limitation | Workaround | Planned Fix |
|---|---|---|
| Hooks configured only for Gemini CLI (Antigravity) | Manual session start prompt | v2.0 — multi-agent support |
| `upgrade` command preserves all of `memory/` | Manually merge new template fields if needed | v1.4 — smart merge |
| No GUI — pure CLI and markdown | By design — agent-native | — |
| Windows: CRLF warnings on git commit | Add `.gitattributes` with `* text=auto` | v1.4 |

---

## Security Issues

**Do not open public GitHub issues for security vulnerabilities.**

See [`SECURITY.md`](SECURITY.md) for the responsible disclosure process.

---

## Contributing

We welcome contributions! See [`CONTRIBUTING.md`](CONTRIBUTING.md) for:

- Development setup
- How to add a new skill
- How to add a new workflow
- PR checklist

---

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for full version history.

Current version: check with `npx buildflow-pro --version`
