# Public Repository Settings Checklist

Use this checklist right before switching repository visibility to public.

## General Settings

- [ ] Repository name and description are final
- [ ] Topics/tags are added for discoverability
- [ ] Homepage URL points to live portfolio (`https://namias.tech`)
- [ ] License is visible and correct

## Access & Collaboration

- [ ] Branch protection ruleset for `main` is active
- [ ] CODEOWNERS file is present and correct
- [ ] Pull request template is enabled automatically
- [ ] Issue templates are visible and usable

## Security & Quality

- [ ] Dependabot is enabled and configured
- [ ] Code scanning (CodeQL) is enabled and running
- [ ] Security policy file (`SECURITY.md`) is present
- [ ] Secret scanning alerts are enabled (repo/org level)

## Documentation Quality

- [ ] `README.md` reflects current architecture and scripts
- [ ] `CONTRIBUTING.md`, `SUPPORT.md`, and docs index are present
- [ ] Internal-only notes are removed or clearly separated

## Final Validation

- [ ] CI checks pass on latest `main`
- [ ] Local `lint`, `build`, and `test` all pass
- [ ] Branch rules verified with a test PR
- [ ] Repository visibility changed to **Public**
