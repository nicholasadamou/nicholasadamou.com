# Brand resources

Visit [/brand](https://nicholasadamou.com/brand) for the portrait identity, color
palette, typography, icon guidance, and downloadable social cards. The page is
linked from About and the command palette.

## Identity

Use the full name, Nicholas Adamou, with the monochrome portrait. Preserve the
portrait's proportions and keep space around it. Onebrief's logo identifies the
current employer alongside the role; it is not the personal brand mark.

The core palette is ink `#0c0a09`, paper `#fafaf9`, stone `#a8a29e`, and surface
`#1c1917`. Inter is the primary typeface. Use ink/paper for essential text; reserve
stone for supporting labels on dark surfaces.

## Social cards

Cards are generated at `/api/og` at 1200 × 630 pixels. Types include `homepage`,
`page`, `clients`, `brand`, `note`, and `notes`. Both `dark` and `light` themes are
supported. Main pages have their own card metadata; note images remain optional.
Long titles and descriptions are bounded to preserve the layout. The root card
uses the motto as its headline, an angled portrait panel, the current employer
logo beside the role, and a footer explicitly identifying previous employers.

The renderer embeds the portrait and employer logo and reads bundled Inter fonts,
so those assets do not depend on external requests. External article images are
optional and fall back to the text layout if unavailable.

Update `src/lib/brand.ts` and the downloadable `public/brand/tokens.json` together.
The social URL includes a version parameter; increment it in `src/lib/og.ts` when
changing the design to give sharing services a new image URL. Existing social
posts may retain their own platform caches.

## Asset sources

- Portrait and Onebrief logo: existing site identity assets.
- UI and GitHub icons: the site's Lucide icon package.
- Inter: [Google Fonts](https://github.com/google/fonts/tree/main/ofl/inter),
  bundled with its SIL Open Font License in `public/fonts/OFL.txt`.
