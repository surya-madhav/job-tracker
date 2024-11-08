# Theme Customization Guide

## Overview
The theme system uses CSS variables for colors, defined in `app/globals.css`. The theme supports both light and dark modes.

## How to Modify Colors

1. Open `app/globals.css` and locate the `:root` selector for light mode colors:

```css
:root {
  /* Base colors */
  --background: 0 0% 100%;     /* Background color */
  --foreground: 207 96% 23%;   /* Primary text color */
  --text-secondary: 0 0% 20%;  /* Secondary text color */

  /* Card colors */
  --card: 0 0% 100%;
  --card-foreground: 207 96% 23%;

  /* Primary colors */
  --primary: 201 96% 33%;      /* Primary brand color */
  --primary-hover: 201 96% 26%;/* Hover state */
  --primary-foreground: 0 0% 100%;

  /* Secondary colors */
  --secondary: 174 35% 61%;    /* Secondary brand color */
  --secondary-foreground: 207 96% 23%;

  /* Accent colors */
  --accent: 29 88% 57%;        /* Accent color for CTAs */
  --accent-foreground: 0 0% 100%;

  /* Destructive colors */
  --destructive: 0 57% 48%;    /* Error/warning color */
  --destructive-foreground: 0 0% 100%;

  /* Muted/Neutral colors */
  --muted: 0 0% 96%;          /* Background for muted elements */
  --muted-foreground: 0 0% 45%;

  /* Border colors */
  --border: 0 0% 88%;         /* Border color */
  --input: 0 0% 88%;          /* Input border color */
  --ring: 201 96% 33%;        /* Focus ring color */
}
```

2. For dark mode, modify the `.dark` selector:

```css
.dark {
  --background: 0 0% 9%;       /* Dark background */
  --foreground: 0 0% 100%;     /* Dark mode text */
  
  /* Adjust other colors for dark mode */
  --primary: 201 96% 33%;
  --primary-hover: 201 96% 40%;
  /* etc... */
}
```

## Color Format
Colors use HSL format: `H S% L%` (Hue, Saturation, Lightness)

Example converting HEX to HSL:
- `#0378A6` → `201 96% 33%`
- `#FFFFFF` → `0 0% 100%`

## Usage in Components

1. Using theme colors in Tailwind classes:
```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground hover:bg-primary-hover">
    Click me
  </button>
</div>
```

2. Using in CSS:
```css
.custom-element {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## Theme Toggle
The theme toggle is implemented in `components/theme-toggle.tsx`:

```tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

## Example Theme Variations

### Corporate Theme
```css
:root {
  --primary: 210 100% 35%;    /* #0055CC */
  --secondary: 200 85% 45%;   /* #0099FF */
  --accent: 280 85% 55%;      /* #8833FF */
}
```

### Nature Theme
```css
:root {
  --primary: 150 60% 40%;     /* #339966 */
  --secondary: 120 40% 50%;   /* #66AA66 */
  --accent: 35 90% 55%;       /* #FFAA33 */
}
```

### Ocean Theme
```css
:root {
  --primary: 200 85% 45%;     /* #0099FF */
  --secondary: 180 60% 50%;   /* #33AAAA */
  --accent: 220 70% 55%;      /* #5566FF */
}
```

## Best Practices

1. **Maintain Contrast**: Ensure text remains readable by maintaining sufficient contrast ratios:
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum

2. **Color Harmony**: Use complementary or analogous colors for your theme:
   - Primary: Main brand color
   - Secondary: Supporting color
   - Accent: Call-to-action highlights

3. **Dark Mode Considerations**:
   - Don't just invert colors
   - Reduce brightness and saturation
   - Increase contrast for better readability

4. **Testing**:
   - Test in both light and dark modes
   - Verify accessibility with tools like WAVE or Lighthouse
   - Check color contrast ratios