/**
 * Message Range Fetcher - Token-based Batching
 * 
 * Fetches message ranges based on token count with carryover context
 * Uses SillyTavern's tokenizer via STBridge
 */

const { stBridge } = require('../integrations/st-bridge.js');

class MessageRangeFetcher {
    constructor() {
        this.stBridge = null;
    }

    /**
     * Initialize with STBridge
     * @param {Object} stBridgeInstance - STBridge instance
     */
    init(stBridgeInstance) {
        this.stBridge = stBridgeInstance;
    }

    /**
     * Get batch by token count with carryover
     * @param {string} chatId - Chat ID
     * @param {number} minTokens - Minimum token threshold
     * @param {number} carryoverK - Number of floors to carry as untouched context
     * @returns {Promise<Object>} Batch information
     */
    async getBatchByTokens(chatId, minTokens = 1000, carryoverK = 5) {
        if (!this.stBridge) {
            throw new Error('MessageRangeFetcher not initialized');
        }

        try {
            // Get chat data from SillyTavern
            const chat = this.stBridge.chat();
            if (!chat.current || chat.id !== chatId) {
                throw new Error(`Chat ${chatId} not found or not current`);
            }

            // Get messages from chat
            const messages = chat.current.messages || [];
            if (messages.length === 0) {
                return {
                    chatId,
                    from: 0,
                    to: 0,
                    carryover: 0,
                    messages: [],
                    tokenCount: 0,
                    isEmpty: true
                };
            }

            // Find the analysis boundary
            const analysisBoundary = await this.findAnalysisBoundary(messages, minTokens, carryoverK);
            
            // Extract batch messages
            const batchMessages = messages.slice(analysisBoundary.from, analysisBoundary.to);
            const carryoverMessages = messages.slice(Math.max(0, analysisBoundary.to - carryoverK), analysisBoundary.to);

            // Calculate token count for the batch
            const batchText = this.extractTextFromMessages(batchMessages);
            const tokenCount = await this.stBridge.tokenCount(batchText);

            return {
                chatId,
                from: analysisBoundary.from,
                to: analysisBoundary.to,
                carryover: carryoverMessages.length,
                messages: batchMessages,
                carryoverMessages,
                tokenCount,
                isEmpty: batchMessages.length === 0,
                analysisBoundary
            };

        } catch (error) {
            console.error('MessageRangeFetcher: Error getting batch:', error);
            throw error;
        }
    }

    /**
     * Find the analysis boundary based on token count
     * @param {Array} messages - All messages
     * @param {number} minTokens - Minimum token threshold
     * @param {number} carryoverK - Carryover floors
     * @returns {Promise<Object>} Boundary information
     */
    async findAnalysisBoundary(messages, minTokens, carryoverK) {
        let currentTokens = 0;
        let boundaryIndex = 0;

        // Start from the end and work backwards to find the boundary
        for (let i = messages.length - 1; i >= carryoverK; i--) {
            const message = messages[i];
            const messageText = this.extractTextFromMessage(message);
            const messageTokens = await this.stBridge.tokenCount(messageText);
            
            currentTokens += messageTokens;
            
            if (currentTokens >= minTokens) {
                boundaryIndex = i;
                break;
            }
        }

        // Ensure we don't go below carryover boundary
        const from = Math.max(0, boundaryIndex);
        const to = Math.min(messages.length, from + (messages.length - carryoverK));

        return {
            from,
            to,
            totalTokens: currentTokens,
            messageCount: to - from
        };
    }

    /**
     * Extract text from a single message
     * @param {Object} message - Message object
     * @returns {string} Extracted text
     */
    extractTextFromMessage(message) {
        if (!message) return '';
        
        // Handle different message formats
        if (typeof message === 'string') {
            return message;
        }
        
        if (message.text) {
            return message.text;
        }
        
        if (message.content) {
            return message.content;
        }
        
        if (message.message) {
            return message.message;
        }
        
        return '';
    }

    /**
     * Extract text from multiple messages
     * @param {Array} messages - Array of messages
     * @returns {string} Combined text
     */
    extractTextFromMessages(messages) {
        return messages
            .map(msg => this.extractTextFromMessage(msg))
            .filter(text => text.length > 0)
            .join('\n');
    }

    /**
     * Get message range by floor indices
     * @param {string} chatId - Chat ID
     * @param {number} fromFloor - Start floor (inclusive)
     * @param {number} toFloor - End floor (exclusive)
     * @returns {Promise<Object>} Range information
     */
    async getBatchByFloors(chatId, fromFloor, toFloor) {
        if (!this.stBridge) {
            throw new Error('MessageRangeFetcher not initialized');
        }

        try {
            const chat = this.stBridge.chat();
            if (!chat.current || chat.id !== chatId) {
                throw new Error(`Chat ${chatId} not found or not current`);
            }

            const messages = chat.current.messages || [];
            const batchMessages = messages.slice(fromFloor, toFloor);
            const batchText = this.extractTextFromMessages(batchMessages);
            const tokenCount = await this.stBridge.tokenCount(batchText);

            return {
                chatId,
                from: fromFloor,
                to: toFloor,
                messages: batchMessages,
                tokenCount,
                isEmpty: batchMessages.length === 0
            };

        } catch (error) {
            console.error('MessageRangeFetcher: Error getting batch by floors:', error);
            throw error;
        }
    }

    /**
     * Get carryover context for a batch
     * @param {string} chatId - Chat ID
     * @param {number} batchEnd - End of current batch
     * @param {number} carryoverK - Number of floors to carry
     * @returns {Promise<Object>} Carryover information
     */
    async getCarryoverContext(chatId, batchEnd, carryoverK = 5) {
        if (!this.stBridge) {
            throw new Error('MessageRangeFetcher not initialized');
        }

        try {
            const chat = this.stBridge.chat();
            if (!chat.current || chat.id !== chatId) {
                throw new Error(`Chat ${chatId} not found or not current`);
            }

            const messages = chat.current.messages || [];
            const carryoverStart = Math.max(0, batchEnd - carryoverK);
            const carryoverMessages = messages.slice(carryoverStart, batchEnd);
            const carryoverText = this.extractTextFromMessages(carryoverMessages);
            const tokenCount = await this.stBridge.tokenCount(carryoverText);

            return {
                chatId,
                from: carryoverStart,
                to: batchEnd,
                messages: carryoverMessages,
                tokenCount,
                isEmpty: carryoverMessages.length === 0
            };

        } catch (error) {
            console.error('MessageRangeFetcher: Error getting carryover context:', error);
            throw error;
        }
    }
}

// Export singleton instance
const messageRangeFetcher = new MessageRangeFetcher();

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { messageRangeFetcher, MessageRangeFetcher };
} else {
    window.MessageRangeFetcher = { messageRangeFetcher, MessageRangeFetcher };
}
