# Open Graph Image Generation Route

A modern, modular Open Graph image generation system for creating dynamic social media preview images.

## 🏗️ Architecture

This OG route follows a clean, modular architecture with separated concerns:

```
src/app/api/og/
├── README.md              # This documentation
├── route.tsx             # Main route handler (orchestration)
├── types.ts              # TypeScript type definitions
├── constants.ts          # Configuration and constants
├── components/           # UI components
│   ├── OGLayout.tsx     # Main layout component
│   ├── ImageElement.tsx # Image component with fallbacks
│   └── TextElement.tsx  # Text component
└── utils/               # Utility functions
    ├── image.ts         # Image loading and processing
    ├── logger.ts        # Logging and debugging
    └── params.ts        # Parameter processing
```

## 🎨 Features

### Design & Styling

- **Monochromatic design**: Sophisticated black/white/grey color scheme aligned with your site
- **Dual themes**: Both dark and light theme support with `theme` parameter
- **Professional typography**: Responsive font sizing with elegant text shadows
- **Gradient backgrounds**: Subtle monochromatic gradients for visual depth
- **Brand consistency**: Matches your site's minimal aesthetic perfectly

### Image Support

- **Local images**: Loads from `public/` directory with base64 conversion
- **External images**: Fetches and processes remote images
- **Multiple formats**: Support for JPG, PNG, GIF, WebP, SVG
- **Graceful fallbacks**: Camera emoji when images fail to load

### Page Types

- `homepage` - Larger text, brand accent, special styling
- `project` - Featured project display
- `note` - Blog post/article styling
- `notes` - Notes collection page
- `projects` - Project portfolio page
- `contact` - Contact page styling
- `gallery` - Photo gallery page styling

## 📖 Usage

### Query Parameters

| Parameter     | Type   | Required | Description                                      |
| ------------- | ------ | -------- | ------------------------------------------------ |
| `title`       | string | No       | Main title text (default: "Nicholas Adamou")     |
| `description` | string | No       | Optional description text                        |
| `type`        | string | No       | Page type (default: "note")                      |
| `theme`       | string | No       | Color theme: "dark" or "light" (default: "dark") |
| `image`       | string | No       | Image path or URL                                |

### Example URLs

```bash
# Homepage with dark theme (default)
/api/og?title=Nicholas%20Adamou&type=homepage&description=Full-stack%20developer

# Homepage with light theme
/api/og?title=Nicholas%20Adamou&type=homepage&theme=light&description=Full-stack%20developer

# Project with local image and dark theme
/api/og?title=My%20Project&type=project&image=/images/project.jpg&theme=dark

# Note with light theme
/api/og?title=React%20Best%20Practices&type=note&theme=light&description=Modern%20React%20patterns

# External image with theme
/api/og?title=Article&type=note&image=https://example.com/image.jpg&theme=light

# Gallery page
/api/og?title=Photo%20Gallery&type=gallery&description=Capturing%20life's%20moments&image=/images/gallery.jpg
```

## 🔧 Configuration

### Customizing Colors

Edit `constants.ts` to modify the color scheme:

```typescript
export const COLORS = {
  gradient: {
    primary: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)",
    // ... other gradients
  },
  // ... other color definitions
};
```

### Adjusting Typography

Update typography styles in `constants.ts`:

```typescript
export const TYPOGRAPHY = {
  titleHomepage: {
    fontSize: "72px",
    fontWeight: "800",
    // ... other styles
  },
  // ... other typography definitions
};
```

### Layout Dimensions

Modify layout settings:

```typescript
export const LAYOUT = {
  container: { width: 1920, height: 1080 },
  image: { width: 480, height: 640 },
};
```

## 🛠️ Development

### Adding New Page Types

1. **Add type to `types.ts`:**

```typescript
export type OGType = "homepage" | "project" | "note" | "newtype";
```

2. **Add header text in `constants.ts`:**

```typescript
export const HEADER_TEXT: Record<OGType, string> = {
  // ... existing types
  newtype: "New Type Header",
};
```

3. **Optional: Add custom styling logic in `OGLayout.tsx`**

### Adding New Image Sources

Extend the `loadImageAsBase64` function in `utils/image.ts` to support new image sources or processing logic.

### Custom Logging

Add new logging functions in `utils/logger.ts` for specific debugging needs.

## 🔍 Debugging

The route includes comprehensive logging:

- **Request parameters**: Logged on each request
- **Image loading**: Success/failure status
- **Processing steps**: Parameter validation and processing
- **Generation success**: Final image generation confirmation
- **Errors**: Detailed error context and stack traces

## 🚀 Performance

### Optimizations

- **Base64 conversion**: Eliminates external image loading issues
- **Modular loading**: Only loads required utilities
- **Error boundaries**: Graceful fallbacks prevent route failures
- **Efficient caching**: Leverages Next.js caching mechanisms

### Best Practices

- Images are resized/optimized during base64 conversion
- Fallback content is lightweight and fast to generate
- TypeScript ensures type safety and prevents runtime errors
