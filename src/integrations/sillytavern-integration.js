/**
 * MemoryKit - SillyTavern Extension Integration
 * 
 * Main entry point for SillyTavern extension system
 * Uses SillyTavern's standard extension API
 */

// SillyTavern extension entry point
(function() {
    'use strict';
    
    // Extension metadata
    const extensionInfo = {
        name: 'MemoryKit',
        version: '1.0.0',
        author: 'kattailmeow',
        description: 'Token-efficient memory extraction and retrieval for SillyTavern'
    };
    
    // Initialize extension when SillyTavern loads
    function initializeExtension() {
        console.log(`MemoryKit v${extensionInfo.version}: Initializing...`);
        
        try {
            // Get SillyTavern context
            const context = getContext();
            
            if (!context) {
                console.error('MemoryKit: Failed to get SillyTavern context');
                return false;
            }
            
            // Initialize STBridge with real context
            const { stBridge } = require('./integrations/st-bridge.js');
            stBridge.init(context);
            
            console.log('MemoryKit: ✅ STBridge initialized successfully');
            
            // Register extension hooks (to be implemented in later phases)
            registerHooks(context);
            
            return true;
            
        } catch (error) {
            console.error('MemoryKit: ❌ Initialization failed:', error.message);
            return false;
        }
    }
    
    // Register SillyTavern hooks
    function registerHooks(context) {
        // Hook implementations will be added in later phases
        console.log('MemoryKit: Hooks registered (placeholder)');
    }
    
    // Export for SillyTavern extension system
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            name: extensionInfo.name,
            version: extensionInfo.version,
            init: initializeExtension
        };
    } else {
        // Browser environment
        window.MemoryKit = {
            name: extensionInfo.name,
            version: extensionInfo.version,
            init: initializeExtension
        };
    }
    
})();
