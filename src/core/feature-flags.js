/**
 * Feature Flags - MemoryKit Configuration
 * 
 * Controls which features are enabled based on build profile
 * DEV vs RELEASE build configurations
 */

// Build profile detection
const BUILD_PROFILE = process.env.BUILD_PROFILE || 'DEV';

/**
 * Feature flags configuration
 */
const FEATURE_FLAGS = {
    // Core features
    EMBEDDING: BUILD_PROFILE === 'DEV',
    BG_QUEUE: BUILD_PROFILE === 'DEV', 
    WORLDINFO_MERGE_STRICT: BUILD_PROFILE === 'DEV',
    AUDIT_BULK: BUILD_PROFILE === 'DEV',
    
    // Development features
    DEBUG_LOGGING: BUILD_PROFILE === 'DEV',
    CONSOLE_AUDIT: BUILD_PROFILE === 'DEV',
    PERFORMANCE_MONITORING: BUILD_PROFILE === 'DEV',
    
    // Release features (always enabled)
    MEMORY_EXTRACTION: true,
    TOKEN_COUNTING: true,
    BASIC_RETRIEVAL: true
};

/**
 * Analysis profiles configuration
 */
const ANALYSIS_PROFILES = {
    FACT_ONLY: {
        name: 'FACT_ONLY',
        description: 'Extract only factual information without moods or attitudes',
        includeAttitude: false,
        includeStoryTime: false,
        temperature: 0.1,
        systemPrompt: 'Extract only factual information. Do not include emotions, moods, or attitudes.'
    },
    
    FACT_PLUS_ATTITUDE: {
        name: 'FACT_PLUS_ATTITUDE', 
        description: 'Extract facts plus attitude snapshots for events',
        includeAttitude: true,
        includeStoryTime: false,
        temperature: 0.3,
        systemPrompt: 'Extract factual information. For events, also capture attitude snapshots.'
    },
    
    EVENT_TIMELINE: {
        name: 'EVENT_TIMELINE',
        description: 'Extract events with timeline information',
        includeAttitude: false,
        includeStoryTime: true,
        temperature: 0.2,
        systemPrompt: 'Extract events with timeline information. Include story time when available.'
    },
    
    KNOWLEDGE_DEF: {
        name: 'KNOWLEDGE_DEF',
        description: 'Extract knowledge definitions without emotions',
        includeAttitude: false,
        includeStoryTime: false,
        temperature: 0.1,
        systemPrompt: 'Extract knowledge definitions and factual information. Exclude emotions and attitudes.'
    }
};

/**
 * Default profile selection
 */
const DEFAULT_PROFILE = 'FACT_ONLY';

/**
 * Get current build profile
 */
function getBuildProfile() {
    return BUILD_PROFILE;
}

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature name
 * @returns {boolean} Whether feature is enabled
 */
function isFeatureEnabled(feature) {
    return FEATURE_FLAGS[feature] === true;
}

/**
 * Get analysis profile by name
 * @param {string} profileName - Profile name
 * @returns {Object} Profile configuration
 */
function getAnalysisProfile(profileName = DEFAULT_PROFILE) {
    return ANALYSIS_PROFILES[profileName] || ANALYSIS_PROFILES[DEFAULT_PROFILE];
}

/**
 * Get all available analysis profiles
 * @returns {Object} All profiles
 */
function getAllAnalysisProfiles() {
    return ANALYSIS_PROFILES;
}

/**
 * Get current feature flags (for debugging)
 * @returns {Object} Current feature flags
 */
function getFeatureFlags() {
    return { ...FEATURE_FLAGS };
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getBuildProfile,
        isFeatureEnabled,
        getAnalysisProfile,
        getAllAnalysisProfiles,
        getFeatureFlags,
        DEFAULT_PROFILE,
        FEATURE_FLAGS,
        ANALYSIS_PROFILES
    };
} else {
    window.MemoryKitFlags = {
        getBuildProfile,
        isFeatureEnabled,
        getAnalysisProfile,
        getAllAnalysisProfiles,
        getFeatureFlags,
        DEFAULT_PROFILE,
        FEATURE_FLAGS,
        ANALYSIS_PROFILES
    };
}
