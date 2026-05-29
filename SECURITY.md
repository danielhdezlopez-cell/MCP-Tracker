# Security Policy

## Reporting a Vulnerability

Please do not report security vulnerabilities publicly in GitHub Issues.

If you discover a vulnerability, contact the repository owner privately via GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
feature, or reach out directly through the account profile.

## Sensitive Data

This project must not contain hardcoded secrets, API keys, tokens, passwords, or
private credentials of any kind.

Use **GitHub Secrets** (Settings → Secrets and variables → Actions) for any sensitive
values required during CI/CD, such as deployment tokens.

Never commit:
- `.env` files or any variant (`.env.local`, `.env.production`, etc.)
- Personal access tokens or API keys
- Private SSH keys

## Account Security

Repository maintainers should use:
- Two-factor authentication (2FA) or passkeys on their GitHub account
- Fine-grained personal access tokens with minimal required permissions
- Regular review and revocation of unused tokens and OAuth app authorizations

## Branch Protection

The `main` branch should be protected:
- Require pull requests before merging
- Disable direct force-pushes to `main`
- Disable branch deletion for `main`

## Dependency Security

Dependencies are reviewed regularly. Dependabot is configured to open weekly
pull requests for outdated or vulnerable packages. Review and merge these promptly.

Enable **Dependabot alerts** and **Dependabot security updates** in:
Settings → Security → Code security and analysis
