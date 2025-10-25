/**
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
