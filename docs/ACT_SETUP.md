# ACT Setup Guide

This guide will help you set up and use [ACT](https://github.com/nektos/act) to run your GitHub Actions workflows locally. ACT allows you to test your workflows without pushing commits to GitHub.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Workflow-Specific Commands](#workflow-specific-commands)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Installation

### macOS

#### Using Homebrew (Recommended)

```bash
brew install act
```

#### Using GitHub CLI

```bash
gh extension install https://github.com/nektos/gh-act
```

### Linux

#### Using Homebrew

```bash
brew install act
```

#### Using curl

```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Windows

#### Using Chocolatey

```bash
choco install act-cli
```

#### Using Scoop

```bash
scoop install act
```

## Basic Usage

### List Available Workflows

```bash
act --list
```

### Run All Workflows

```bash
act
```

### Run a Specific Event

```bash
# Run push event workflows
act push

# Run pull_request event workflows
act pull_request
```

## Workflow-Specific Commands

Our project has several workflows. Here are the specific commands to run each:

### 1. Continuous Integration (ci.yml)

```bash
# Run the entire CI pipeline
act -W .github/workflows/ci.yml

# Run specific jobs
act -W .github/workflows/ci.yml -j lint-and-format
act -W .github/workflows/ci.yml -j type-check
act -W .github/workflows/ci.yml -j test
act -W .github/workflows/ci.yml -j build
act -W .github/workflows/ci.yml -j security
act -W .github/workflows/ci.yml -j shellcheck
```

### 2. Test Coverage (coverage.yml)

```bash
# Run coverage workflow
act -W .github/workflows/coverage.yml

# Run specific coverage jobs
act -W .github/workflows/coverage.yml -j coverage
act -W .github/workflows/coverage.yml -j coverage-comparison
```

### 3. Shell Script Validation (shellcheck.yml)

```bash
# Run shell script validation
act -W .github/workflows/shellcheck.yml

# Run specific shellcheck jobs
act -W .github/workflows/shellcheck.yml -j shellcheck
act -W .github/workflows/shellcheck.yml -j shellcheck-detailed
act -W .github/workflows/shellcheck.yml -j validate-executable
act -W .github/workflows/shellcheck.yml -j syntax-check
act -W .github/workflows/shellcheck.yml -j security-scan
act -W .github/workflows/shellcheck.yml -j best-practices
```

### 4. Unit Tests (test.yml)

```bash
# Run unit tests workflow
act -W .github/workflows/test.yml

# Run the test job specifically
act -W .github/workflows/test.yml -j test
```

## Configuration

### Create .actrc File

Create a `.actrc` file in your project root to set default configuration:

```bash
# .actrc
--platform ubuntu-latest=catthehacker/ubuntu:act-latest
--platform ubuntu-20.04=catthehacker/ubuntu:act-20.04
--platform ubuntu-18.04=catthehacker/ubuntu:act-18.04
--artifact-server-path /tmp/artifacts
--env-file .env
```

### Environment Variables

Create a `.secrets` file for sensitive environment variables:

```bash
# .secrets (don't commit this file)
GITHUB_TOKEN=your_github_token_here
NPM_TOKEN=your_npm_token_here
```

Use it with:

```bash
act --secret-file .secrets
```

### Using Environment Files

```bash
# Use specific environment file
act --env-file .env.local

# Use multiple environment files
act --env-file .env --env-file .env.local
```

## Common Use Cases

### 1. Test Before Push

```bash
# Run CI pipeline to test changes before pushing
act -W .github/workflows/ci.yml
```

### 2. Debug Failing Workflow

```bash
# Run with verbose output
act -W .github/workflows/ci.yml --verbose

# Run with shell access for debugging
act -W .github/workflows/ci.yml -j test --shell
```

### 3. Test Specific Scenarios

```bash
# Test push event
act push

# Test pull request event
act pull_request

# Test with specific branch
act push -e push_event.json
```

Create `push_event.json`:

```json
{
  "ref": "refs/heads/feature-branch",
  "repository": {
    "name": "nicholasadamou.com",
    "full_name": "nicholasadamou/nicholasadamou.com"
  }
}
```

### 4. Run Tests with Coverage

```bash
# Run coverage workflow locally
act -W .github/workflows/coverage.yml

# Skip coverage upload steps (they won't work locally)
act -W .github/workflows/coverage.yml --skip-upload
```

## Platform Selection

ACT supports different Docker images for different platforms:

### Default Platforms

```bash
# Use micro image (fastest, limited tools)
act --platform ubuntu-latest=node:16-buster-slim

# Use medium image (good balance)
act --platform ubuntu-latest=catthehacker/ubuntu:act-latest

# Use full image (all tools, slowest)
act --platform ubuntu-latest=catthehacker/ubuntu:full-latest
```

### For Our Node.js Project

```bash
# Recommended for our project (includes Node.js, pnpm, etc.)
act --platform ubuntu-latest=catthehacker/ubuntu:act-latest
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Docker Permission Issues

```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER

# Restart docker service
sudo systemctl restart docker
```

#### 2. pnpm Not Found

```bash
# Use full Ubuntu image or install pnpm in workflow
act --platform ubuntu-latest=catthehacker/ubuntu:full-latest
```

#### 3. Network Issues

```bash
# Run with network access
act --network host
```

#### 4. File Permission Issues

```bash
# Run with current user
act --userns keep-id
```

#### 5. Insufficient Resources

```bash
# Allocate more memory to Docker
# Docker Desktop -> Settings -> Resources -> Memory (increase to 4GB+)
```

### Verbose Debugging

```bash
# Enable verbose logging
act --verbose

# Enable debug logging
act --debug
```

### Skip Problematic Steps

Create `.github/workflows/act_skip.yml` to skip steps that don't work locally:

```yaml
# Example: Skip upload steps
- name: Upload coverage to Codecov
  if: github.event_name != 'act'
  uses: codecov/codecov-action@v3
```

## Best Practices

### 1. Use .gitignore

Add to your `.gitignore`:

```gitignore
# ACT
.secrets
.env.local
.actrc.local
```

### 2. Create Development Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "act:ci": "act -W .github/workflows/ci.yml",
    "act:test": "act -W .github/workflows/test.yml",
    "act:coverage": "act -W .github/workflows/coverage.yml",
    "act:shellcheck": "act -W .github/workflows/shellcheck.yml",
    "act:list": "act --list"
  }
}
```

Then run with:

```bash
pnpm act:ci
pnpm act:test
```

### 3. Conditional Logic for Local Testing

Use environment variables to skip certain steps locally:

```yaml
- name: Deploy to production
  if: github.event_name != 'act' # Skip when running locally
  run: npm run deploy
```

### 4. Mock External Services

For tests that depend on external services:

```yaml
- name: Setup mock services
  if: github.event_name == 'act'
  run: |
    # Start mock services for local testing
    docker run -d --name mock-api -p 3001:3001 mock-api:latest
```

### 5. Resource Management

```bash
# Clean up containers after runs
act --rm

# Use specific container names
act --container-name act-test
```

## Useful Commands

### Quick Reference

```bash
# List all available jobs
act --list

# Dry run (show what would be executed)
act --dryrun

# Run specific job
act -j job-name

# Run with custom event
act -e event.json

# Run with secrets
act --secret-file .secrets

# Run with environment variables
act --env VAR=value

# Clean up after run
act --rm

# Show help
act --help
```

### Performance Tips

```bash
# Use smaller images for faster startup
act --platform ubuntu-latest=node:18-alpine

# Skip checkout action (if not needed)
act --no-checkout

# Bind mount workspace (faster than copy)
act --bind
```

## Additional Resources

- [ACT Official Documentation](https://github.com/nektos/act)
- [ACT Runner Images](https://github.com/catthehacker/docker_images)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

If you encounter issues:

1. Check the [ACT GitHub Issues](https://github.com/nektos/act/issues)
2. Review the [Troubleshooting](#troubleshooting) section above
3. Check Docker logs: `docker logs $(docker ps -q)`
4. Use verbose mode: `act --verbose`

---

Happy local testing! 🚀
