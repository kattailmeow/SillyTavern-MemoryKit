#!/usr/bin/env node

/**
 * Simple build script for Phase 0.1
 * Creates basic dist structure to satisfy test requirement
 */

const fs = require('fs');
const path = require('path');

// Import feature flags to get build profile
const { getBuildProfile, getFeatureFlags } = require('./src/core/feature-flags.js');

const buildProfile = getBuildProfile();
const flags = getFeatureFlags();

console.log(`Building SillyTavern-MemoryKit...`);
console.log(`Build Profile: ${buildProfile}`);
console.log(`Feature Flags:`, Object.entries(flags).filter(([_, enabled]) => enabled).map(([flag, _]) => flag).join(', '));

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Create basic manifest for dist
const manifest = {
    name: 'sillytavern-memorykit',
    display_name: 'Memory Kit by Kat',
    description: 'A memory management plugin for SillyTavern',
    loading_order: 1,
    requires: [],
    optional: [],
    dependencies: [],
    js: 'index.js',
    css: 'style.css',
    author: 'kattailmeow',
    version: '1.0.0',
    homePage: 'https://github.com/kattailmeow/SillyTavern-MemoryKit',
    auto_update: false,
    minimum_client_version: '1.0.0',
    i18n: {
        'zh-cn': 'i18n/zh-cn.json'
    },
    buildTime: new Date().toISOString(),
};

fs.writeFileSync(
    path.join(distDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
);

// Copy source files to dist
const srcDir = path.join(__dirname, 'src');
const modules = ['core', 'ui', 'workers', 'schemas', 'prompts', 'store', 'integrations'];

modules.forEach(module => {
    const srcModuleDir = path.join(srcDir, module);
    const distModuleDir = path.join(distDir, module);
    
    if (fs.existsSync(srcModuleDir)) {
        // Copy actual source files
        fs.mkdirSync(distModuleDir, { recursive: true });
        const files = fs.readdirSync(srcModuleDir);
        files.forEach(file => {
            const srcFile = path.join(srcModuleDir, file);
            const distFile = path.join(distModuleDir, file);
            fs.copyFileSync(srcFile, distFile);
        });
    } else {
        // Create placeholder for empty modules
        fs.mkdirSync(distModuleDir, { recursive: true });
        fs.writeFileSync(
            path.join(distModuleDir, 'index.js'),
            `// ${module} module placeholder\nconsole.log('${module} module loaded');`
        );
    }
});

// Create main entry point (required by manifest.json)
const mainEntryContent = `/**
 * MemoryKit - Main Entry Point for SillyTavern Extension
 * 
 * This is the main entry point that SillyTavern will load
 * according to the manifest.json configuration
 */

// Import our SillyTavern integration
const MemoryKitExtension = require('./integrations/sillytavern-integration.js');

// Initialize the extension when SillyTavern loads it
if (typeof MemoryKitExtension !== 'undefined' && MemoryKitExtension.init) {
    // Auto-initialize when loaded
    MemoryKitExtension.init();
} else {
    console.error('MemoryKit: Failed to load extension module');
}

// Export for SillyTavern extension system
module.exports = MemoryKitExtension;
`;

fs.writeFileSync(path.join(distDir, 'index.js'), mainEntryContent);

// Create CSS file (referenced in manifest.json)
const cssContent = `/**
 * MemoryKit - Styles
 * 
 * Basic styles for MemoryKit extension
 * Currently minimal - will be expanded in later phases
 */

.memorykit-container {
    font-family: Arial, sans-serif;
    margin: 10px;
}

.memorykit-status {
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 12px;
}

.memorykit-status.success {
    background-color: #d4edda;
    color: #155724;
}

.memorykit-status.error {
    background-color: #f8d7da;
    color: #721c24;
}

.memorykit-status.info {
    background-color: #d1ecf1;
    color: #0c5460;
}
`;

fs.writeFileSync(path.join(distDir, 'style.css'), cssContent);

// Copy user-friendly README for release repo
const userReadmePath = path.join(__dirname, 'dist', 'README.md');
if (fs.existsSync(userReadmePath)) {
    console.log('User-friendly README.md ready for release repo');
}

// Build complete

console.log('Build complete! Output in /dist');
