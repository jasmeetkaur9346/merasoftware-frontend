class DatabaseService {
    constructor(dbName = 'WebsiteDB', version = 2) {
      this.dbName = dbName;
      this.version = version;
      this.stores = {
        products: 'id, category, lastUpdated',
        pages: 'path, lastUpdated',
        user: 'id',
        cart: 'id, userId',
        orders: 'id, userId, lastUpdated' 
      };
    }
  
    async initDatabase() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
  
          // Create stores for different types of data
          Object.entries(this.stores).forEach(([storeName, keyPath]) => {
            if (!db.objectStoreNames.contains(storeName)) {
              const store = db.createObjectStore(storeName, { 
                keyPath: keyPath.split(',')[0].trim() 
              });
  
              // Create indexes for each store
              keyPath.split(',').slice(1).forEach(key => {
                store.createIndex(key.trim(), key.trim(), { unique: false });
              });
            }
          });
        };
      });
    }
  
    async set(storeName, data) {
      const db = await this.initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
  
        const item = {
          ...data,
          lastUpdated: new Date().toISOString()
        };
  
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async get(storeName, key) {
      const db = await this.initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async getAll(storeName) {
      const db = await this.initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async delete(storeName, key) {
      const db = await this.initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async clearStore(storeName) {
      const db = await this.initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async queryByIndex(storeName, indexName, value) {
      const db = await this.initDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const dbService = new DatabaseService();