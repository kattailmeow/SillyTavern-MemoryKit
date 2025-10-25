/**
 * IndexedDB Store Skeleton - MemoryKit Storage Layer
 * 
 * Provides CRUD operations for MemoryKit data structures
 * Uses versioned schema with migration support
 */

const SCHEMA_VERSION = 1;

class MemoryStore {
    constructor() {
        this.db = null;
        this.dbName = 'MemoryKitDB';
        this.version = SCHEMA_VERSION;
    }

    /**
     * Initialize IndexedDB connection
     * @returns {Promise<void>}
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => {
                console.error('MemoryStore: Failed to open IndexedDB');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                console.log('MemoryStore: IndexedDB initialized successfully');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createStores(db);
                console.log('MemoryStore: Database schema upgraded');
            };
        });
    }

    /**
     * Create all required stores
     * @param {IDBDatabase} db - Database instance
     */
    createStores(db) {
        // ObjectTypes store
        if (!db.objectStoreNames.contains('objectTypes')) {
            const objectTypesStore = db.createObjectStore('objectTypes', { keyPath: 'id' });
            objectTypesStore.createIndex('key', 'key', { unique: true });
        }

        // Instances store
        if (!db.objectStoreNames.contains('instances')) {
            const instancesStore = db.createObjectStore('instances', { keyPath: 'id' });
            instancesStore.createIndex('type', 'type.id');
            instancesStore.createIndex('key', 'key', { unique: true });
            instancesStore.createIndex('scope', 'scope.type');
        }

        // Values store
        if (!db.objectStoreNames.contains('values')) {
            const valuesStore = db.createObjectStore('values', { keyPath: 'id' });
            valuesStore.createIndex('instance', 'instanceId');
            valuesStore.createIndex('template', 'template.id');
            valuesStore.createIndex('status', 'status');
        }

        // Diffs store
        if (!db.objectStoreNames.contains('diffs')) {
            const diffsStore = db.createObjectStore('diffs', { keyPath: 'id' });
            diffsStore.createIndex('instance', 'instanceId');
            diffsStore.createIndex('status', 'status');
            diffsStore.createIndex('createdAt', 'createdAt');
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Meta store
        if (!db.objectStoreNames.contains('meta')) {
            const metaStore = db.createObjectStore('meta', { keyPath: 'key' });
            metaStore.createIndex('type', 'type');
        }
    }

    /**
     * Generic CRUD operations
     */
    
    async add(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.add(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async update(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName, key) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Query operations
     */
    
    async queryByIndex(storeName, indexName, value) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        return new Promise((resolve, reject) => {
            const request = index.getAll(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Store-specific operations
     */
    
    // ObjectTypes operations
    async addObjectType(objectType) {
        return this.add('objectTypes', objectType);
    }

    async getObjectType(id) {
        return this.get('objectTypes', id);
    }

    async getAllObjectTypes() {
        return this.getAll('objectTypes');
    }

    // Instances operations
    async addInstance(instance) {
        return this.add('instances', instance);
    }

    async getInstance(id) {
        return this.get('instances', id);
    }

    async getInstancesByType(typeId) {
        return this.queryByIndex('instances', 'type', typeId);
    }

    // Values operations
    async addValue(value) {
        return this.add('values', value);
    }

    async getValuesByInstance(instanceId) {
        return this.queryByIndex('values', 'instance', instanceId);
    }

    async getValuesByStatus(status) {
        return this.queryByIndex('values', 'status', status);
    }

    // Diffs operations
    async addDiff(diff) {
        return this.add('diffs', diff);
    }

    async getDiffsByStatus(status) {
        return this.queryByIndex('diffs', 'status', status);
    }

    // Settings operations
    async setSetting(key, value) {
        return this.update('settings', { key, value });
    }

    async getSetting(key) {
        const result = await this.get('settings', key);
        return result ? result.value : null;
    }

    // Meta operations
    async setMeta(key, value, type = 'general') {
        return this.update('meta', { key, value, type });
    }

    async getMeta(key) {
        const result = await this.get('meta', key);
        return result ? result.value : null;
    }

    /**
     * Migration support
     */
    async migrate() {
        // Future migration logic will go here
        console.log('MemoryStore: No migrations needed for current version');
    }

    /**
     * Close database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

// Export singleton instance
const memoryStore = new MemoryStore();

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { memoryStore, MemoryStore, SCHEMA_VERSION };
} else {
    window.MemoryStore = { memoryStore, MemoryStore, SCHEMA_VERSION };
}
