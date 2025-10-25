# SillyTavern-MemoryKit-Dev - 记忆工具喜加一

Hi hi! Welcome welcome 🥰

Here is Kat's **dev repo** for the ST-MemoryKit-Plugin extension, but:

> ⚠️ **It is not yet downloadable since Kat is still working on it TAT**

<!-- For stable releases and easy installation, see the [Release Repository](https://github.com/kattailmeow/SillyTavern-MemoryKit).

注意这里不是下载地址哦亲亲，要下载的话请[这边](https://github.com/kattailmeow/SillyTavern-MemoryKit)走捏 (当然你拒绝直接复制粘贴式下载非要配置这玩意我也不会拦着你啦... -->

## To Contribute / 来写码的

### English Ver.
Not downloading but wanting to contribute some lovely code? You are at the right place!

Please feel free to fork, create your feature branch, make PRs, etc.

### 中文版?
啊不是下载是嫌Kat的码不行想要自己手搓啦？那好像倒确实也没走错哈...

欢迎fork，欢迎...呃...dbq好像上文那坨英语用中文说一遍关键词也都还是英文啊...呃呃呃反正都是码农了肯定看得懂不需要翻译的啦诶嘿QwQ

## Development Status

**Current Phase**: 1.3 (Message Range Fetcher)  
**Next**: Regex Preprocessor, Story-time Parser, Staged Batch Objects

### 🧪 Experimental Features
- Feature flags system with DEV/RELEASE profiles
- Dual timestamp support (real + story time)
- Unlimited length attribute support
- Token-based message batching with carryover

### 🐛 Known Issues
- IndexedDB mocking in tests needs improvement
- Some edge cases in timestamp parsing
- Build script could be more robust

### 📝 Development Notes
- All core modules are in `src/` directory
- Tests are temporary and cleaned up after each phase
- Feature flags control experimental functionality
- Configuration is user-customizable via settings

## Development Setup

### Prerequisites

- SillyTavern running locally or in Docker
- Node.js 18+ and pnpm
- Git (for development)

### Quick Start

1. **Clone the dev repository**:
   ```bash
   git clone https://github.com/kattailmeow/SillyTavern-MemoryKit-Dev.git
   cd SillyTavern-MemoryKit-Dev
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build and test**:
   ```bash
   # Development build (with debug features)
   pnpm build:dev
   
   # Test specific phase
   node test-phase-1.1.1-1.1.2.js  # (if exists)
   ```

4. **Development workflow**:
   ```bash
   # Make changes to src/ files
   # Build to test
   pnpm build:dev
   # Copy dist/ to SillyTavern or mount in Docker
   ```

### Docker Development

Mount the entire project for live development:

```yaml
volumes:
  - "/path/to/SillyTavern-MemoryKit-Dev:/home/node/app/public/scripts/extensions/third-party/memory-dev:ro"
```

## Project Structure

```
src/
├── core/           # Core functionality
│   ├── config-manager.js      # User settings
│   ├── feature-flags.js       # Build profiles
│   ├── message-range-fetcher.js # Token batching
│   └── timestamp-manager.js   # Dual timestamps
├── store/          # Storage layer
│   └── memory-store.js        # IndexedDB operations
├── schemas/        # Data models
│   └── default-schema.js      # Object type definitions
├── integrations/   # SillyTavern bridge
│   ├── st-bridge.js           # API wrapper
│   └── sillytavern-integration.js # Extension entry
├── ui/            # User interface (planned)
├── workers/       # Web Workers (planned)
└── prompts/       # LLM templates (planned)
```

## Build Profiles

- **DEV**: Includes debug features, embeddings, performance monitoring
- **RELEASE**: Minimal build with only core functionality

### Scripts

```bash
pnpm dev              # Development build
pnpm build            # Production build
pnpm build:dev        # Development build (explicit)
pnpm build:release    # Production build (explicit)
```

## Questions / 要问问题

You can reach me on **discord** with this username: **@ruri9820** ( Might be late reply though. Still, please directly say what you are contacting about 🥹

有问题可以**Discord**里找 **@ruri9820** 联系我哈 (求注明来意以及可能会轮回先致歉了嘤 🥹

## License

[Apache 2.0](https://github.com/kattailmeow/SillyTavern-MemoryKit-Dev/blob/main/LICENSE)