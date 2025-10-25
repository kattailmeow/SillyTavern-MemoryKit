# SillyTavern-MemoryKit / 记忆工具喜加一

A token-efficient memory extraction and retrieval plugin for SillyTavern that injects minimal, precise information into your prompts.

一个为 SillyTavern 设计的 token 高效记忆提取和检索插件，将最小、精确的信息注入到你的提示中。

## What is MemoryKit? / 什么是 MemoryKit？

### English
MemoryKit helps you manage character memories efficiently by:
- **Extracting key information** from your chat conversations
- **Storing memories** in a structured, searchable format
- **Injecting only relevant memories** into prompts (saving tokens!)
- **Tracking story timelines** alongside real-world time

### 中文
MemoryKit 通过以下方式帮助你高效管理角色记忆：
- **从聊天对话中提取关键信息**
- **以结构化、可搜索的格式存储记忆**
- **只将相关记忆注入提示中**（节省 token！）
- **同时追踪故事时间线和现实时间**

## Quick Installation / 快速安装

### Option 1: SillyTavern Built-in Installer (Easiest) / SillyTavern 内置安装器（最简单）

1. Open SillyTavern
2. Go to **Extensions** → **Download Extensions & Assets**
3. Click **Load Asset List**
4. Find "MemoryKit" in the list and click **Download**
5. Done! The extension is automatically installed

### Option 2: Direct Download / 直接下载
1. Download the latest release from [GitHub Releases](https://github.com/kattailmeow/SillyTavern-MemoryKit/releases)
2. Extract the `dist` folder
3. Copy it to your SillyTavern extensions directory

### Option 3: Docker (If you know what this is doing) / Docker（如果你知道这是在干嘛的话）

Add this to your SillyTavern docker-compose.yml:

```yaml
volumes:
  - "/path/to/SillyTavern-MemoryKit/dist:/home/node/app/public/scripts/extensions/third-party/memory-dev:ro"
```

**Note**: Docker version still requires manual download and configuration of model files. The container only runs the application, not the models.

**注意**: Docker 版本仍需要手动下载和配置模型文件。容器只运行应用程序，不包含模型。

### Option 4: Git Clone (For Updates with Specific Version) / Git 克隆（用于自主控制更新的版本）
```bash
git clone https://github.com/kattailmeow/SillyTavern-MemoryKit.git
cd SillyTavern-MemoryKit
# Copy dist/ folder to your SillyTavern extensions
```

## How to Use / 如何使用

### English
1. **Install** the extension in SillyTavern
2. **Start chatting** - MemoryKit automatically analyzes your conversations
3. **Configure settings** (optional) - Adjust character limits and time modes
4. **Enjoy efficient prompts** - Only relevant memories are injected

### 中文
1. **在 SillyTavern 中安装**扩展
2. **开始聊天** - MemoryKit 自动分析你的对话
3. **配置设置**（可选）- 调整字符限制和时间模式
4. **享受高效提示** - 只注入相关记忆

## Configuration / 配置

### Basic Settings / 基本设置

In SillyTavern's extension settings, you can configure:

在 SillyTavern 的扩展设置中，你可以配置：

- **Character Limits**: Set maximum lengths for names, descriptions, etc. / **字符限制**：设置名称、描述等的最大长度
- **Time Mode**: Choose between story time, real time, or hybrid / **时间模式**：在故事时间、现实时间或混合模式之间选择
- **Analysis Profile**: Select how memories are extracted / **分析配置文件**：选择记忆提取方式

## Features / 功能

### ✅ Current Features / 当前功能
- **Smart Memory Extraction**: Automatically identifies important information / **智能记忆提取**：自动识别重要信息
- **Token Efficiency**: Only injects relevant memories to save tokens / **Token 效率**：只注入相关记忆以节省 token
- **Dual Timestamps**: Tracks both story time and real time / **双重时间戳**：同时追踪故事时间和现实时间
- **Character Limits**: Prevents overly long descriptions / **字符限制**：防止描述过长
- **Flexible Configuration**: Customize behavior to your needs / **灵活配置**：根据需要自定义行为

### 🔄 Coming Soon / 即将推出
- **UI Dashboard**: Visual memory management / **UI 仪表板**：可视化记忆管理
- **Import/Export**: Backup and share memories / **导入/导出**：备份和分享记忆
- **Advanced Filtering**: More precise memory selection / **高级过滤**：更精确的记忆选择
- **Bulk Operations**: Process multiple chats at once / **批量操作**：一次处理多个聊天

## Troubleshooting / 故障排除

### Common Issues / 常见问题

**Q: Extension not loading? / 扩展无法加载？**
A: Make sure you copied the entire `dist` folder, not just individual files. / 确保你复制了整个 `dist` 文件夹，而不是单个文件。

**Q: Memories not being extracted? / 记忆没有被提取？**
A: Check that you have messages in your chat and the extension is enabled. / 检查你的聊天中是否有消息以及扩展是否已启用。

**Q: Too many tokens being used? / 使用了太多 token？**
A: Adjust the character limits in settings to make memories more concise. / 在设置中调整字符限制以使记忆更简洁。

### Getting Help / 获取帮助

- **Issues**: Report bugs on [GitHub Issues](https://github.com/kattailmeow/SillyTavern-MemoryKit/issues)
- **Discussions**: Join the conversation on [GitHub Discussions](https://github.com/kattailmeow/SillyTavern-MemoryKit/discussions)
- **SillyTavern Community**: Ask in the SillyTavern Discord

## License / 许可证

[Apache 2.0](https://github.com/kattailmeow/SillyTavern-MemoryKit/blob/main/LICENSE)

## Acknowledgments / 致谢

Built for the SillyTavern community by [kattailmeow](https://github.com/kattailmeow).  
Thanks to all contributors and testers!

由 [kattailmeow](https://github.com/kattailmeow) 为 SillyTavern 社区构建。  
感谢所有贡献者和测试者！

---

**Need the latest version?** Check the [Releases](https://github.com/kattailmeow/SillyTavern-MemoryKit/releases) page for updates.

**需要最新版本？** 查看 [Releases](https://github.com/kattailmeow/SillyTavern-MemoryKit/releases) 页面获取更新。
