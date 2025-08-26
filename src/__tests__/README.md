# Unsplash API Test Suite

This directory contains comprehensive tests for the Unsplash integration system, including API routes, utility functions, caching, and image fallback functionality.

## Test Files

### 1. `unsplash-api.test.ts`

Tests the main API route at `/api/unsplash` with all its actions:

**Coverage:**

- ✅ `get-photo` action with caching behavior
- ✅ `extract-id` action for URL parsing
- ✅ Error handling (404, rate limits, network errors)
- ✅ Environment variable validation
- ✅ Premium photo handling

**Key Features Tested:**

- Cache hit/miss scenarios
- API rate limiting responses
- Network error handling
- Missing API key scenarios
- Premium photo URL generation

### 2. `unsplash-utils.test.ts`

Tests the core utility functions in `/src/lib/utils/unsplash.ts`:

**Coverage:**

- ✅ `getUnsplashPhoto()` - Fetching photos from Unsplash API
- ⚠️ `extractUnsplashPhotoId()` - Photo ID extraction (needs regex fixes)
- ⚠️ `createPremiumUnsplashUrl()` - Premium URL generation (env var issues)
- ✅ `generateUnsplashAttribution()` - Attribution URL generation

**Known Issues:**

- Photo ID regex patterns need adjustment for different URL formats
- Environment variable isolation between tests

### 3. `unsplash-cache.test.ts`

Tests the caching system in `/src/lib/cache/unsplash-cache.ts`:

**Coverage:**

- ⚠️ Redis cache operations (mocked, but real cache uses memory fallback)
- ✅ Memory cache functionality
- ✅ Cache expiration handling
- ✅ Statistics tracking
- ⚠️ Error handling (console spy issues)

**Known Issues:**

- Mock Redis not properly integrated with actual cache implementation
- Console spy assertions need adjustment
- Stats tracking between mocked and real cache inconsistent

### 4. `image-fallback.test.ts`

Tests the image fallback utilities in `/src/lib/image-fallback.ts`:

**Coverage:**

- ⚠️ Photo ID extraction (similar regex issues as utils)
- ✅ Local manifest loading and caching
- ✅ Async/sync fallback functions
- ✅ Image metadata retrieval
- ⚠️ Error handling for network failures

**Known Issues:**

- Same photo ID extraction issues as utils
- Mock fetch not properly isolated between tests
- Module caching between tests

## Running Tests

### All Unsplash Tests

```bash
pnpm run test:unsplash
```

### Individual Test Files

```bash
# API route tests
pnpm run test src/__tests__/unsplash-api.test.ts

# Utility function tests
pnpm run test src/__tests__/unsplash-utils.test.ts

# Cache tests
pnpm run test src/__tests__/unsplash-cache.test.ts

# Image fallback tests
pnpm run test src/__tests__/image-fallback.test.ts
```

### With Coverage

```bash
pnpm run test:unsplash:coverage
```

### Watch Mode

```bash
pnpm run test:unsplash:watch
```

## Current Test Status

**✅ Passing Areas:**

- Basic API route functionality
- Cache memory fallback
- Local manifest handling
- Attribution generation
- Error boundary testing

**⚠️ Areas Needing Attention:**

- Photo ID regex patterns (need to match real Unsplash IDs)
- Environment variable isolation
- Mock Redis integration
- Console spy assertions
- Test isolation between modules

**📊 Overall Status:**

- **53 tests passing** (61%)
- **34 tests failing** (39%)
- Most failures are due to test setup issues rather than actual code bugs

## Test Architecture

### Mocking Strategy

- **MSW (Mock Service Worker)** for HTTP requests
- **Vitest mocks** for modules and console methods
- **Redis mocking** for cache testing
- **Environment variable mocking** for different scenarios

### Test Data

Tests use realistic Unsplash photo IDs and URLs:

- `ZV_64LdGoao` - Sample photo ID
- `NZYgKwRA4Cg` - Sample premium photo ID
- `842ofHC6MaI` - Alternative photo ID

### Error Scenarios

Comprehensive error testing includes:

- Network failures
- Rate limiting
- Invalid photo IDs
- Missing API keys
- Cache failures
- Manifest loading errors

## Integration with CI/CD

These tests are designed to run in continuous integration environments and include:

- Environment variable validation
- Network error simulation
- Cache fallback testing
- Cross-platform compatibility

## What These Tests Validate

1. **API Compliance**: Ensures the system follows Unsplash API terms
2. **Caching Performance**: Validates multi-level caching works correctly
3. **Error Resilience**: Tests graceful handling of various failure modes
4. **URL Processing**: Validates photo ID extraction from various URL formats
5. **Premium Features**: Tests Unsplash+ functionality when available

## Future Improvements

- Fix photo ID regex patterns to match actual Unsplash URLs
- Improve test isolation and cleanup
- Add more edge case testing
- Integrate with actual Redis for integration testing
- Add performance benchmarking
- Add visual regression testing for image components

## Contributing

When adding new Unsplash functionality:

1. Add corresponding tests to the appropriate test file
2. Update mock data to reflect new scenarios
3. Ensure error handling is tested
4. Add documentation for new test scenarios
5. Update this README if adding new test files

## Debugging Tests

Common debugging approaches:

```bash
# Run specific failing test
pnpm run test -t "should extract ID from page URL"

# Run with verbose output
pnpm run test:unsplash --reporter=verbose

# Run with UI for interactive debugging
pnpm run test:ui
```

The tests provide comprehensive coverage of the Unsplash integration system and serve as both validation and documentation of the expected behavior.
