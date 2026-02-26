# Update App Theme — Color Palette v2

Update the app's theme/design system to use the following color palette. This is a dark-theme, deals/commerce app. Apply these tokens globally across all components, screens, and styles.

## Color Tokens

### Core Colors
| Token              | Hex       | Usage                                        |
|--------------------|-----------|----------------------------------------------|
| `forest`           | `#2D6A4F` | Primary — button fills, active states, icons  |
| `forest-light`     | `#3A8A66` | Primary text/links on dark bg (WCAG AA 5.8:1) |
| `forest-muted`     | `rgba(45,106,79,0.15)` | Tinted backgrounds for primary badges/chips |
| `orange`           | `#E8772E` | Accent — deal highlights, CTAs, promo badges  |
| `orange-muted`     | `rgba(232,119,46,0.12)` | Tinted backgrounds for deal badges         |
| `red`              | `#D63B2F` | Alerts, hot deals, destructive/error states   |
| `red-muted`        | `rgba(214,59,47,0.10)` | Alert backgrounds, error container          |

### Neutral Scale
| Token              | Hex       | Usage                                        |
|--------------------|-----------|----------------------------------------------|
| `dark`             | `#0a0a0a` | Main app background                          |
| `surface`          | `#141414` | Cards, panels, bottom sheets, modals          |
| `surface-raised`   | `#1e1e1e` | Nested cards, input fields, hover states      |
| `border`           | `#2a2a2a` | Dividers, outlines, separators                |
| `disabled`         | `#3a3a3a` | Disabled buttons, inactive toggle tracks      |

### Text Colors
| Token              | Hex       | Contrast  | Usage                            |
|--------------------|-----------|-----------|----------------------------------|
| `text-primary`     | `#f0f0eb` | 17.3:1 AAA | Headings, body, high emphasis   |
| `text-secondary`   | `#8a8a82` | 5.5:1 AA   | Descriptions, metadata, timestamps |
| `text-muted`       | `#5c5c56` | 3.4:1      | Placeholders, hints (large text only) |

## Implementation Rules

1. **Never use raw `#2D6A4F` for text on dark backgrounds** — use `forest-light` (`#3A8A66`) instead. The base forest green only passes WCAG AA at large text sizes (18px+ bold).
2. **Buttons** use `forest` fill with white text. Hover/press state = `forest-light`.
3. **Links** and interactive text use `forest-light`.
4. **Orange vs Red separation**: Orange = commercial/promotional (deals, discounts, CTAs). Red = system urgency (alerts, errors, expiration warnings, destructive actions). Never place orange and red badges adjacent to each other.
5. **Card elevation**: `dark` → `surface` → `surface-raised`. No more than 2 levels of nesting.
6. **Borders**: Use `border` (`#2a2a2a`) for all dividers and outlines. No white/gray borders.
7. **Disabled states**: `disabled` (`#3a3a3a`) fill + `text-muted` text. No opacity hacks.
8. **Badge pattern**: Use muted alpha variants as backgrounds with their solid color as text (e.g., `orange-muted` bg + `orange` text).
9. **Input fields**: `surface-raised` background, `border` outline, `text-muted` placeholder. Focus border = `forest`.

## Files to Update

Search the codebase for any existing theme definitions, color constants, CSS variables, Tailwind config, or design tokens and replace them with the values above. Common locations:
- CSS: `:root` variables, theme files, `tailwind.config.*`
- React: theme provider, styled-components theme, context
- Android: `colors.xml`, `themes.xml`, Material theme
- iOS: `Assets.xcassets`, Color extensions, UIColor definitions

Remove any unused legacy color values. Ensure all hardcoded hex values throughout the codebase are replaced with token references.
