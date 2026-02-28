# Changelog

All notable changes to this project will be documented in this file.

## [2.2.0] - 2026-02-28

### Added
- Added release-oriented metadata in `src/index.html` and `src/dashboard.html` (description, OpenGraph, Twitter, canonical, theme color).
- Added `src/manifest.webmanifest` for installability metadata and consistent app identity.
- Added offline network status banners to both main app and dashboard pages.
- Added user-visible empty-state rows and dashboard status messaging when analytics data is unavailable.

### Changed
- Bumped app version to `2.2.0` in `src/js/utils/constants.js`.
- Updated in-app release badges and privacy policy version/date messaging in `src/index.html`.
- Replaced bare nomodule warning with a user-facing unsupported-browser fallback screen.

### Fixed
- Hardened dashboard local storage parsing against malformed JSON values to avoid runtime crashes.
- Added fallback sample-data load path when analytics initialization fails.

### Known Issues
- The app still includes legacy verbose debug logging in some JavaScript modules and should be trimmed in a dedicated cleanup pass.
- Local-only hosting paths may still trigger browser-specific favicon fallback requests for `/favicon.ico` depending on client behavior.
