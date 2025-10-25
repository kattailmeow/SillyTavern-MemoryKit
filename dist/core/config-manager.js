/**
 * Configuration Manager - User Settings
 * 
 * Manages user-configurable settings including attribute limits and time modes
 */

const { memoryStore } = require('../store/memory-store.js');

class ConfigurationManager {
    constructor() {
        this.store = null;
        this.defaultSettings = {
            // Attribute limits (0 = unlimited)
            maxAttributeLength: 500,
            maxNameLength: 100,
            maxDescriptionLength: 300,
            maxListItems: 10,
            allowUnlimitedLength: true,
            
            // Time mode settings
            timeMode: 'story', // 'real', 'story', 'hybrid'
            storyTimeFormat: 'YYYY-MM-DD, HH:mm',
            realTimeFormat: 'ISO',
            
            // Analysis settings
            defaultAnalysisProfile: 'FACT_ONLY',
            autoTruncateLongAttributes: false, // Disabled by default, prefer LLM rephrasing
            warnOnLongAttributes: true,
            enableLLMRephrasing: false, // Future feature
            
            // UI settings
            showCharacterCount: true,
            showTimeMode: true,
            compactMode: false
        };
    }

    /**
     * Initialize with memory store
     * @param {MemoryStore} store - Memory store instance
     */
    init(store) {
        this.store = store;
    }

    /**
     * Get a setting value
     * @param {string} key - Setting key
     * @param {any} defaultValue - Default value if not found
     * @returns {Promise<any>} Setting value
     */
    async getSetting(key, defaultValue = null) {
        if (!this.store) {
            return defaultValue || this.defaultSettings[key];
        }

        try {
            const value = await this.store.getSetting(key);
            return value !== null ? value : (defaultValue || this.defaultSettings[key]);
        } catch (error) {
            console.warn(`ConfigurationManager: Failed to get setting ${key}:`, error);
            return defaultValue || this.defaultSettings[key];
        }
    }

    /**
     * Set a setting value
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     * @returns {Promise<void>}
     */
    async setSetting(key, value) {
        if (!this.store) {
            console.warn('ConfigurationManager: Store not initialized');
            return;
        }

        try {
            await this.store.setSetting(key, value);
        } catch (error) {
            console.error(`ConfigurationManager: Failed to set setting ${key}:`, error);
            throw error;
        }
    }

    /**
     * Get all settings
     * @returns {Promise<Object>} All settings
     */
    async getAllSettings() {
        const settings = {};
        
        for (const key of Object.keys(this.defaultSettings)) {
            settings[key] = await this.getSetting(key);
        }
        
        return settings;
    }

    /**
     * Reset settings to defaults
     * @returns {Promise<void>}
     */
    async resetToDefaults() {
        for (const [key, value] of Object.entries(this.defaultSettings)) {
            await this.setSetting(key, value);
        }
    }

    /**
     * Validate attribute length
     * @param {string} attributeType - Type of attribute (name, description, etc.)
     * @param {string} value - Value to validate
     * @returns {Promise<Object>} Validation result
     */
    async validateAttributeLength(attributeType, value) {
        const maxLength = await this.getMaxLengthForAttribute(attributeType);
        const allowUnlimited = await this.getSetting('allowUnlimitedLength');
        const currentLength = value ? value.length : 0;
        
        // If unlimited is allowed and maxLength is 0, always valid
        const isUnlimited = allowUnlimited && maxLength === 0;
        
        return {
            isValid: isUnlimited || currentLength <= maxLength,
            currentLength,
            maxLength,
            isUnlimited,
            isOverLimit: !isUnlimited && currentLength > maxLength,
            remainingChars: isUnlimited ? Infinity : Math.max(0, maxLength - currentLength)
        };
    }

    /**
     * Get max length for specific attribute type
     * @param {string} attributeType - Attribute type
     * @returns {Promise<number>} Max length
     */
    async getMaxLengthForAttribute(attributeType) {
        switch (attributeType) {
            case 'name':
                return await this.getSetting('maxNameLength');
            case 'description':
                return await this.getSetting('maxDescriptionLength');
            case 'list':
                return await this.getSetting('maxListItems');
            default:
                return await this.getSetting('maxAttributeLength');
        }
    }

    /**
     * Truncate attribute value if needed
     * @param {string} attributeType - Attribute type
     * @param {string} value - Value to truncate
     * @param {boolean} addEllipsis - Whether to add ellipsis
     * @returns {Promise<string>} Truncated value
     */
    async truncateAttribute(attributeType, value, addEllipsis = true) {
        const maxLength = await this.getMaxLengthForAttribute(attributeType);
        const allowUnlimited = await this.getSetting('allowUnlimitedLength');
        
        // Don't truncate if unlimited is allowed and maxLength is 0
        if (allowUnlimited && maxLength === 0) {
            return value;
        }
        
        if (!value || value.length <= maxLength) {
            return value;
        }

        const truncated = value.substring(0, maxLength);
        return addEllipsis ? truncated + '...' : truncated;
    }

    /**
     * Set unlimited length for specific attribute type
     * @param {string} attributeType - Attribute type
     * @returns {Promise<void>}
     */
    async setUnlimitedLength(attributeType) {
        const settingKey = this.getMaxLengthSettingKey(attributeType);
        await this.setSetting(settingKey, 0);
    }

    /**
     * Get max length setting key for attribute type
     * @param {string} attributeType - Attribute type
     * @returns {string} Setting key
     */
    getMaxLengthSettingKey(attributeType) {
        switch (attributeType) {
            case 'name':
                return 'maxNameLength';
            case 'description':
                return 'maxDescriptionLength';
            case 'list':
                return 'maxListItems';
            default:
                return 'maxAttributeLength';
        }
    }

    /**
     * Get time mode settings
     * @returns {Promise<Object>} Time mode configuration
     */
    async getTimeModeSettings() {
        return {
            mode: await this.getSetting('timeMode'),
            storyFormat: await this.getSetting('storyTimeFormat'),
            realFormat: await this.getSetting('realTimeFormat')
        };
    }

    /**
     * Set time mode
     * @param {string} mode - Time mode ('real', 'story', 'hybrid')
     * @returns {Promise<void>}
     */
    async setTimeMode(mode) {
        if (!['real', 'story', 'hybrid'].includes(mode)) {
            throw new Error(`Invalid time mode: ${mode}`);
        }
        await this.setSetting('timeMode', mode);
    }

    /**
     * Get analysis profile settings
     * @returns {Promise<Object>} Analysis profile configuration
     */
    async getAnalysisSettings() {
        return {
            defaultProfile: await this.getSetting('defaultAnalysisProfile'),
            autoTruncate: await this.getSetting('autoTruncateLongAttributes'),
            warnOnLong: await this.getSetting('warnOnLongAttributes')
        };
    }

    /**
     * Export settings for backup
     * @returns {Promise<Object>} Settings export
     */
    async exportSettings() {
        const settings = await this.getAllSettings();
        return {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            settings
        };
    }

    /**
     * Import settings from backup
     * @param {Object} exportData - Settings export data
     * @returns {Promise<void>}
     */
    async importSettings(exportData) {
        if (!exportData.settings) {
            throw new Error('Invalid settings export format');
        }

        for (const [key, value] of Object.entries(exportData.settings)) {
            if (this.defaultSettings.hasOwnProperty(key)) {
                await this.setSetting(key, value);
            }
        }
    }
}

// Export singleton instance
const configManager = new ConfigurationManager();

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { configManager, ConfigurationManager };
} else {
    window.ConfigurationManager = { configManager, ConfigurationManager };
}
