# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure with src/ directory organization
- IndexedDB storage layer with versioned schema support
- SillyTavern integration bridge (STBridge) for API access
- Feature flags system with DEV/RELEASE build profiles
- Configuration manager for user-customizable settings
- Dual timestamp support (real time + story time)
- Message range fetcher with token-based batching
- Default schema seeds for person, location, and event types
- Character length limits with unlimited length support
- Build system with profile-based compilation

### Changed
- Project structure reorganized to use src/ directory
- Build script updated to copy source files to dist/
- All import paths updated for new structure

### Removed
- Temporary test files and development artifacts