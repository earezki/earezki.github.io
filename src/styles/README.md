# CSS Architecture

The styles for this project are organized into modular CSS files for better maintainability and easier debugging.

## File Structure

### `global.css` (Entry Point)
Main stylesheet that imports all CSS modules. This is the file referenced in the HTML.

### Module Files

#### `_variables.css` - Design Tokens
- CSS Custom Properties (CSS variables)
- Color palette (light & dark themes)
- Typography settings
- Spacing and border radius
- Shadows and transitions
- Gradients

#### `_base.css` - Base Styles
- CSS reset
- Base element styling (body, links)
- Font smoothing

#### `_layout.css` - Layout Components
- Container
- Site header
- Logo and animations
- Navigation
- Theme toggle button
- Content area
- Posts grid

#### `_post-card.css` - Post Components
- Post card styling
- Hover effects
- Read indicators
- Meta information
- Tags
- Article page styles
- Table of contents
- Search page

#### `_code.css` - Code Blocks
- Syntax highlighting (Shiki)
- Code block containers
- Dual theme support (light/dark)
- Copy button styling
- Copy button interactions

#### `_ainews.css` - AI News Styles
- Gradient border effects
- AI News navigation link
- AI News tag styling
- Gradient animations

#### `_cv.css` - CV/Resume Page
- Profile banner and gradient
- Profile card and avatar
- Profile links
- Company and location badges
- Tech stack badges
- Projects grid
- Skills section
- Functional skills cards
- Languages section
- CV actions (language switch, download)
- Toast notifications
- Responsive adjustments
- Print styles

#### `_utilities.css` - Utility Classes
- GitHub stats container
- Screen reader only classes
- Mobile responsive adjustments

## Making Changes

### To modify a specific component:
1. Locate the relevant module file based on the component type
2. Make your changes in that file
3. The dev server will automatically reload

### To add new styles:
1. Add them to the appropriate module file
2. If creating a new category, consider creating a new module file
3. Import the new module in `global.css`

## Benefits

- **Better Organization**: Styles are grouped by function
- **Easier Debugging**: Quickly locate component-specific styles
- **Improved Maintainability**: Smaller files are easier to understand
- **Team Collaboration**: Multiple people can work on different modules
- **Performance**: CSS modules are combined during build

## Theme Support

The site supports light and dark themes. Theme-specific styles use:
- `html[data-theme="dark"]` selector for dark mode overrides
- CSS variables that automatically switch with theme
- Shiki syntax highlighting with dual themes
