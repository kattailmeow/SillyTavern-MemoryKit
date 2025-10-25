/**
 * STBridge - SillyTavern Integration Layer
 * 
 * Minimal wrapper around SillyTavern's getContext() API
 * Only includes functions we actually need for Phase 0.2
 */

class STBridge {
    constructor() {
        this.context = null;
        this.initialized = false;
    }

    /**
     * Initialize the bridge with SillyTavern context
     * @param {Object} context - SillyTavern getContext() result
     */
    init(context) {
        this.context = context;
        this.initialized = true;
        console.log('STBridge: Initialized with SillyTavern context');
    }

    /**
     * Get current chat information
     * @returns {Object} Chat data
     */
    chat() {
        this._ensureInitialized();
        return {
            current: this.context.chat,
            id: this.context.getCurrentChatId ? this.context.getCurrentChatId() : null
        };
    }

    /**
     * Get token count for text using ST's tokenizer
     * @param {string} text - Text to tokenize
     * @returns {Promise<number>} Token count
     */
    async tokenCount(text) {
        this._ensureInitialized();
        if (this.context.getTokenCountAsync) {
            return await this.context.getTokenCountAsync(text);
        }
        // Fallback: rough estimate if tokenizer not available
        return Math.ceil(text.length / 4);
    }

    /**
     * Send a request using ST's request system
     * @param {Object} request - Request object
     * @returns {Promise<any>} Response
     */
    async send(request) {
        this._ensureInitialized();
        if (this.context.sendGenerationRequest) {
            return await this.context.sendGenerationRequest(request);
        }
        throw new Error('sendGenerationRequest not available in SillyTavern context');
    }

    /**
     * Get characters information
     * @returns {Object} Characters data
     */
    characters() {
        this._ensureInitialized();
        return {
            list: this.context.characters || [],
            currentId: this.context.this_chid || null
        };
    }

    /**
     * Get extension settings
     * @returns {Object} Settings data
     */
    settings() {
        this._ensureInitialized();
        return {
            extensionSettings: this.context.extensionSettings || {},
            saveSettingsDebounced: this.context.saveSettingsDebounced || (() => {})
        };
    }

    /**
     * Get utilities
     * @returns {Object} Utility functions
     */
    utils() {
        this._ensureInitialized();
        return {
            uuidv4: this.context.uuidv4 || (() => 'mock-uuid'),
            translate: this.context.t || ((key) => key)
        };
    }

    /**
     * Ensure bridge is initialized
     * @private
     */
    _ensureInitialized() {
        if (!this.initialized || !this.context) {
            throw new Error('STBridge not initialized. Call init() first.');
        }
    }
}

// Export singleton instance
const stBridge = new STBridge();

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { stBridge, STBridge };
} else {
    window.STBridge = { stBridge, STBridge };
}
