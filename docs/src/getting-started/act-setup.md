# ACT Setup

Run GitHub Actions workflows locally using [ACT](https://github.com/nektos/act).

## Installation

### macOS

```bash
brew install act
```

### Linux

```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

## Usage

### List Available Workflows

```bash
act --list
```

### Run Specific Workflows

```bash
# Run CI pipeline
act -W .github/workflows/ci.yml

# Run specific jobs
act -W .github/workflows/ci.yml -j lint-and-format
act -W .github/workflows/ci.yml -j test
act -W .github/workflows/ci.yml -j build
```

### Test Coverage

```bash
act -W .github/workflows/coverage.yml
```

## Configuration

Create `.actrc` file in project root with platform settings and environment configuration.

### Environment Variables

Create `.secrets` file (don't commit) for sensitive data.

## Troubleshooting

### pnpm Not Found

Use full Ubuntu image with pnpm pre-installed.

### Network Issues

```bash
act --network host
```

### Verbose Debugging

```bash
act --verbose
act --debug
```

## Package.json Scripts

Add convenience scripts to `package.json` for common ACT commands.

For comprehensive documentation, see the original ACT_SETUP.md file.
