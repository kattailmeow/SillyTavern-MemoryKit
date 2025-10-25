/**
 * Default Schema Seeds - MemoryKit Object Types
 * 
 * Seeds the database with default object types and attribute templates
 * Based on the GraphQL schema from architecture.md
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Default object types with minimal attribute templates
 */
const DEFAULT_OBJECT_TYPES = [
    {
        id: uuidv4(),
        key: 'person',
        label: 'Person',
        description: 'Individual characters or people',
        attributes: [
            {
                id: uuidv4(),
                key: 'name',
                label: 'Name',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: false,
                required: true,
                maxLength: 100,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store the full name as it appears in the story'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'description',
                label: 'Description',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: false,
                required: false,
                maxLength: 300,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store physical appearance and basic characteristics'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'relationships',
                label: 'Relationships',
                valueKind: 'LIST',
                includeAttitude: false,
                includeStoryTime: false,
                required: false,
                maxItems: 10,
                maxItemLength: 100,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store relationships with other characters'
                    }
                ]
            }
        ],
        defaultSharing: {
            type: 'PER_CHARACTER',
            characters: []
        }
    },
    {
        id: uuidv4(),
        key: 'location',
        label: 'Location',
        description: 'Places, buildings, or geographical areas',
        attributes: [
            {
                id: uuidv4(),
                key: 'name',
                label: 'Name',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: false,
                required: true,
                maxLength: 100,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store the canonical name of the location'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'description',
                label: 'Description',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: false,
                required: false,
                maxLength: 300,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store physical description and notable features'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'type',
                label: 'Type',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: false,
                required: false,
                maxLength: 50,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store the type of location (city, building, room, etc.)'
                    }
                ]
            }
        ],
        defaultSharing: {
            type: 'PER_CHARACTER',
            characters: []
        }
    },
    {
        id: uuidv4(),
        key: 'event',
        label: 'Event',
        description: 'Significant events or occurrences',
        attributes: [
            {
                id: uuidv4(),
                key: 'title',
                label: 'Title',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: true,
                required: true,
                maxLength: 150,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store a brief title describing the event'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'description',
                label: 'Description',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: true,
                required: false,
                maxLength: 500,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store what happened in the event'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'participants',
                label: 'Participants',
                valueKind: 'LIST',
                includeAttitude: false,
                includeStoryTime: false,
                required: false,
                maxItems: 10,
                maxItemLength: 100,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store who was involved in the event'
                    }
                ]
            },
            {
                id: uuidv4(),
                key: 'location',
                label: 'Location',
                valueKind: 'SCALAR',
                includeAttitude: false,
                includeStoryTime: false,
                required: false,
                maxLength: 100,
                rules: [
                    {
                        id: uuidv4(),
                        text: 'Store where the event took place'
                    }
                ]
            }
        ],
        defaultSharing: {
            type: 'PER_CHARACTER',
            characters: []
        }
    }
];

/**
 * Seed the database with default object types
 * @param {MemoryStore} store - MemoryStore instance
 * @returns {Promise<void>}
 */
async function seedDefaultSchema(store) {
    console.log('Seeding default schema...');
    
    try {
        // Check if schema is already seeded
        const existingTypes = await store.getAllObjectTypes();
        if (existingTypes.length > 0) {
            console.log('Schema already seeded, skipping...');
            return;
        }

        // Add each object type
        for (const objectType of DEFAULT_OBJECT_TYPES) {
            await store.addObjectType(objectType);
            console.log(`Added object type: ${objectType.label}`);
        }

        // Set meta information
        await store.setMeta('schema_seeded', true, 'system');
        await store.setMeta('schema_version', 1, 'system');
        await store.setMeta('last_seeded', new Date().toISOString(), 'system');

        console.log('Default schema seeded successfully');
        
    } catch (error) {
        console.error('Failed to seed default schema:', error);
        throw error;
    }
}

/**
 * Get default object types (for reference)
 * @returns {Array} Default object types
 */
function getDefaultObjectTypes() {
    return DEFAULT_OBJECT_TYPES;
}

/**
 * Get object type by key
 * @param {string} key - Object type key
 * @returns {Object|null} Object type or null
 */
function getObjectTypeByKey(key) {
    return DEFAULT_OBJECT_TYPES.find(type => type.key === key) || null;
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        seedDefaultSchema,
        getDefaultObjectTypes,
        getObjectTypeByKey,
        DEFAULT_OBJECT_TYPES
    };
} else {
    window.MemoryKitSchema = {
        seedDefaultSchema,
        getDefaultObjectTypes,
        getObjectTypeByKey,
        DEFAULT_OBJECT_TYPES
    };
}
