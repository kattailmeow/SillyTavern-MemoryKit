/**
 * Dual Timestamp Manager - Real Time + Story Time
 * 
 * Manages both real-world timestamps and story/plot timestamps
 * Always records real time as reference, with optional story time
 */

const { configManager } = require('./config-manager.js');

class DualTimestampManager {
    constructor() {
        this.configManager = null;
    }

    /**
     * Initialize with config manager
     * @param {ConfigurationManager} config - Config manager instance
     */
    init(config) {
        this.configManager = config;
    }

    /**
     * Create timestamp object with both real and story time
     * @param {string|Date} storyTime - Story time (optional)
     * @param {Date} realTime - Real time (defaults to now)
     * @returns {Promise<Object>} Timestamp object
     */
    async createTimestamp(storyTime = null, realTime = null) {
        const now = realTime || new Date();
        const timeSettings = await this.configManager.getTimeModeSettings();
        
        return {
            realTime: {
                timestamp: now.toISOString(),
                unix: now.getTime(),
                formatted: this.formatRealTime(now, timeSettings.realFormat)
            },
            storyTime: storyTime ? {
                timestamp: storyTime,
                parsed: this.parseStoryTime(storyTime),
                formatted: this.formatStoryTime(storyTime, timeSettings.storyFormat)
            } : null,
            mode: timeSettings.mode,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };
    }

    /**
     * Update timestamp (preserves creation time, updates real time)
     * @param {Object} existingTimestamp - Existing timestamp object
     * @param {string|Date} newStoryTime - New story time (optional)
     * @param {Date} newRealTime - New real time (defaults to now)
     * @returns {Promise<Object>} Updated timestamp object
     */
    async updateTimestamp(existingTimestamp, newStoryTime = null, newRealTime = null) {
        const now = newRealTime || new Date();
        const timeSettings = await this.configManager.getTimeModeSettings();
        
        return {
            ...existingTimestamp,
            realTime: {
                timestamp: now.toISOString(),
                unix: now.getTime(),
                formatted: this.formatRealTime(now, timeSettings.realFormat)
            },
            storyTime: newStoryTime ? {
                timestamp: newStoryTime,
                parsed: this.parseStoryTime(newStoryTime),
                formatted: this.formatStoryTime(newStoryTime, timeSettings.storyFormat)
            } : existingTimestamp.storyTime,
            updatedAt: now.toISOString()
        };
    }

    /**
     * Parse story time from various formats
     * @param {string} storyTime - Story time string
     * @returns {Object|null} Parsed time object
     */
    parseStoryTime(storyTime) {
        if (!storyTime) return null;

        // Common formats: "YYYY-MM-DD", "YYYY-MM-DD, HH:mm", "YYYY-MM-DD HH:mm"
        const patterns = [
            /^(\d{4})-(\d{2})-(\d{2}),?\s*(\d{2}):(\d{2})$/, // YYYY-MM-DD, HH:mm
            /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/,   // YYYY-MM-DD HH:mm
            /^(\d{4})-(\d{2})-(\d{2})$/,                     // YYYY-MM-DD
            /^(\d{4})\/(\d{2})\/(\d{2}),?\s*(\d{2}):(\d{2})$/, // YYYY/MM/DD, HH:mm
            /^(\d{4})\/(\d{2})\/(\d{2})$/,                   // YYYY/MM/DD
        ];

        for (const pattern of patterns) {
            const match = storyTime.match(pattern);
            if (match) {
                const [, year, month, day, hour = '00', minute = '00'] = match;
                return {
                    year: parseInt(year),
                    month: parseInt(month),
                    day: parseInt(day),
                    hour: parseInt(hour),
                    minute: parseInt(minute),
                    isValid: true
                };
            }
        }

        return {
            isValid: false,
            original: storyTime
        };
    }

    /**
     * Format real time
     * @param {Date} date - Date object
     * @param {string} format - Format type
     * @returns {string} Formatted time
     */
    formatRealTime(date, format = 'ISO') {
        switch (format) {
            case 'ISO':
                return date.toISOString();
            case 'LOCALE':
                return date.toLocaleString();
            case 'DATE':
                return date.toLocaleDateString();
            case 'TIME':
                return date.toLocaleTimeString();
            default:
                return date.toISOString();
        }
    }

    /**
     * Format story time
     * @param {string} storyTime - Story time string
     * @param {string} format - Format type
     * @returns {string} Formatted time
     */
    formatStoryTime(storyTime, format = 'YYYY-MM-DD, HH:mm') {
        const parsed = this.parseStoryTime(storyTime);
        if (!parsed || !parsed.isValid) {
            return storyTime; // Return original if can't parse
        }

        const { year, month, day, hour, minute } = parsed;
        
        switch (format) {
            case 'YYYY-MM-DD, HH:mm':
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}, ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            case 'YYYY-MM-DD':
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            case 'MM/DD/YYYY':
                return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
            default:
                return storyTime;
        }
    }

    /**
     * Get primary time for ordering (based on user preference)
     * @param {Object} timestamp - Timestamp object
     * @returns {Promise<Object>} Primary time for ordering
     */
    async getPrimaryTime(timestamp) {
        const timeSettings = await this.configManager.getTimeModeSettings();
        
        switch (timeSettings.mode) {
            case 'story':
                return timestamp.storyTime || timestamp.realTime;
            case 'real':
                return timestamp.realTime;
            case 'hybrid':
                // Use story time if available, fallback to real time
                return timestamp.storyTime || timestamp.realTime;
            default:
                return timestamp.realTime;
        }
    }

    /**
     * Compare two timestamps for ordering
     * @param {Object} timestamp1 - First timestamp
     * @param {Object} timestamp2 - Second timestamp
     * @returns {Promise<number>} Comparison result (-1, 0, 1)
     */
    async compareTimestamps(timestamp1, timestamp2) {
        const primary1 = await this.getPrimaryTime(timestamp1);
        const primary2 = await this.getPrimaryTime(timestamp2);
        
        // If both have story time, compare story time
        if (timestamp1.storyTime && timestamp2.storyTime) {
            const parsed1 = this.parseStoryTime(timestamp1.storyTime.timestamp);
            const parsed2 = this.parseStoryTime(timestamp2.storyTime.timestamp);
            
            if (parsed1.isValid && parsed2.isValid) {
                const time1 = new Date(parsed1.year, parsed1.month - 1, parsed1.day, parsed1.hour, parsed1.minute);
                const time2 = new Date(parsed2.year, parsed2.month - 1, parsed2.day, parsed2.hour, parsed2.minute);
                return time1.getTime() - time2.getTime();
            }
        }
        
        // Fallback to real time comparison
        return new Date(primary1.timestamp).getTime() - new Date(primary2.timestamp).getTime();
    }

    /**
     * Extract story time from message text
     * @param {string} text - Message text
     * @returns {string|null} Extracted story time
     */
    extractStoryTimeFromText(text) {
        if (!text) return null;

        // Look for time patterns at the beginning of the text
        const timePatterns = [
            /^(\d{4}-\d{2}-\d{2},?\s*\d{2}:\d{2})/,
            /^(\d{4}-\d{2}-\d{2})/,
            /^(\d{4}\/\d{2}\/\d{2},?\s*\d{2}:\d{2})/,
            /^(\d{4}\/\d{2}\/\d{2})/
        ];

        for (const pattern of timePatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Create timestamp for new data entry
     * @param {string} messageText - Source message text (for story time extraction)
     * @param {Date} realTime - Real time (defaults to now)
     * @returns {Promise<Object>} Timestamp object
     */
    async createDataTimestamp(messageText = null, realTime = null) {
        const storyTime = messageText ? this.extractStoryTimeFromText(messageText) : null;
        return this.createTimestamp(storyTime, realTime);
    }
}

// Export singleton instance
const timestampManager = new DualTimestampManager();

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { timestampManager, DualTimestampManager };
} else {
    window.DualTimestampManager = { timestampManager, DualTimestampManager };
}
