# Contributing to Digistar JavaScript Project

This is an internal project for MSU Space Science Center. This guide provides guidelines for maintaining and contributing to the codebase.

## Development Workflow

1. Test all scripts in Digistar 7 before committing
2. Update documentation when adding new features
3. Follow existing code style and conventions
4. Use descriptive commit messages

## Code Style

### JavaScript
- Use the `duration` parameter for smooth color transitions
- All timing uses **seconds** (not milliseconds)
- Use `Ds.SendStringCommand` (PascalCase, not camelCase)
- RGB values are **0-100** (not 0-255)
- Total segments: **128**

### Example
```javascript
// Good
Ds.SendStringCommand("coveLights segment 0 100 0 0 duration 3");
Ds.Wait(2);

// Avoid
Ds.sendStringCommand("coveLights segment 0 255 0 0");
Ds.Wait(2000);
```

## File Organization

- **docs/** - All documentation, start with `docs/00_START_HERE.md`
- **01_learn/** - Self-contained example scripts, numbered in learning order
- **02_library/** - Main libraries
- **03_templates/** - Starting templates for new shows
- **04_utilities/** - Diagnostic and helper scripts

## Documentation

When adding new scripts or features:
- Add inline comments for complex logic
- Update relevant README files
- Include usage examples
- Document any non-obvious parameters

## Testing

Before committing:
1. Test script in Digistar 7
2. Verify all segments respond correctly (0-127)
3. Check timing is accurate
4. Ensure no console errors

## Commit Messages

Use clear, descriptive commit messages:
- `Add fade effect to show template`
- `Fix segment 127 not responding in diagnostic tool`
- `Update documentation for fade effects`
- `Refactor lighting control to use PascalCase API`