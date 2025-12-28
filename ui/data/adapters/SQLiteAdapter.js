/**
 * SQLiteAdapter - SQLite implementation of DataBroker interface
 * 
 * Uses react-native-sqlite-storage for local database operations.
 * Data is stored as JSON in a generic schema for flexibility.
 */

import SQLite from 'react-native-sqlite-storage';
import auth from '@react-native-firebase/auth';
import { setItem, getItem } from 'react-native-shared-preferences';

// Enable promises for SQLite
SQLite.enablePromise(true);

let db = null;
const listeners = new Map(); // Store listeners for "snapshot" functionality

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Initialize database and create tables
 */
const init = async () => {
  if (db) return db;
  
  db = await SQLite.openDatabase({
    name: 'RecordsApp.db',
    location: 'default',
  });
  
  // Create tables for each collection
  const tables = [
    'Memories',
    'Rent',
    'RentTransaction',
    'ChitFunds',
    'ChitFundTransactions',
    'WaterCanEntries',
    'Bills',
    'Users',
    'SharedUsers',
    'Share',
  ];

  for (const table of tables) {
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id TEXT PRIMARY KEY,
        userId TEXT,
        time INTEGER,
        data TEXT
      )
    `);
  }
  
  // Create indexes for better query performance
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_memories_userId ON Memories(userId)');
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_rent_userId ON Rent(userId)');
  await db.executeSql('CREATE INDEX IF NOT EXISTS idx_bills_userId ON Bills(userId)');
  
  console.log('SQLite database initialized');
  return db;
};

// Get login ID from Firebase Auth
const getLoginId = () => auth().currentUser?.uid;
const getLoginEmail = () => auth().currentUser?.email;

// User ID management (for multi-org support)
const getUserId = async () => {
  return await new Promise((resolve) => getItem(getLoginId(), (val) => {
    resolve(val || getLoginId());
  }));
};

const setUserId = (uid) => {
  console.log('setUserId -> ' + uid);
  setItem(getLoginId(), uid);
};

const log = async () => {
  const orgId = await getUserId();
  console.log('log userId -> ' + orgId);
};

// Notify listeners for a collection
const notifyListeners = async (collection) => {
  const collectionListeners = listeners.get(collection);
  if (collectionListeners) {
    for (const [listenerId, { callback, conditions }] of collectionListeners) {
      await fetchAndNotify(collection, callback, conditions);
    }
  }
};

// Fetch data and call callback (simulates Firestore snapshot)
const fetchAndNotify = async (collection, callback, conditions = []) => {
  await init();
  
  let query = `SELECT * FROM ${collection} WHERE 1=1`;
  const params = [];
  
  conditions.forEach(([field, operator, value]) => {
    if (field === 'userId') {
      query += ` AND userId ${operator} ?`;
      params.push(value);
    }
  });
  
  query += ' ORDER BY time DESC';
  
  const [results] = await db.executeSql(query, params);
  
  // Transform results to match Firestore snapshot format
  const docs = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    const data = JSON.parse(row.data);
    
    // Apply non-userId conditions (filter in JS)
    let matches = true;
    for (const [field, operator, value] of conditions) {
      if (field !== 'userId') {
        if (operator === '==' && data[field] !== value) {
          matches = false;
          break;
        }
      }
    }
    
    if (matches) {
      docs.push({
        id: row.id,
        data: () => ({ ...data, time: row.time }),
      });
    }
  }
  
  // Create a forEach method to match Firestore API
  docs.forEach = (fn) => {
    docs.map((doc, index) => fn(doc, index));
  };
  
  callback(docs);
};

/**
 * Insert data into collection
 */
const insertData = async (collection, data, callback) => {
  await init();
  const userId = await getUserId();
  const id = generateId();
  const time = data.time || Date.now();
  
  data.userId = userId;
  
  await db.executeSql(
    `INSERT INTO ${collection} (id, userId, time, data) VALUES (?, ?, ?, ?)`,
    [id, userId, time, JSON.stringify(data)]
  );
  
  console.log(`Inserted into ${collection}: ${id}`);
  
  await notifyListeners(collection);
  callback?.({ id });
};

/**
 * Insert or update (for Users collection)
 */
const insertOrUpdate = async (collection, data, id) => {
  await init();
  
  const [results] = await db.executeSql(
    `SELECT COUNT(*) as count FROM ${collection} WHERE userId = ?`,
    [id]
  );
  
  const count = results.rows.item(0).count;
  
  if (count === 0) {
    const newId = generateId();
    const time = data.time || Date.now();
    await db.executeSql(
      `INSERT INTO ${collection} (id, userId, time, data) VALUES (?, ?, ?, ?)`,
      [newId, id, time, JSON.stringify(data)]
    );
  }
  
  await notifyListeners(collection);
};

/**
 * Delete data by ID
 */
const deleteData = async (collection, id, callback) => {
  await init();
  
  await db.executeSql(`DELETE FROM ${collection} WHERE id = ?`, [id]);
  
  console.log(`Deleted from ${collection}: ${id}`);
  
  await notifyListeners(collection);
  callback?.();
};

/**
 * Delete multiple records with conditions
 */
const deleteMulipleData = async (collection, conditions = [], callback) => {
  await init();
  const userId = await getUserId();
  
  conditions.push(['userId', '==', userId]);
  
  let query = `SELECT id, data FROM ${collection} WHERE userId = ?`;
  const params = [userId];
  
  const [results] = await db.executeSql(query, params);
  
  const idsToDelete = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    const data = JSON.parse(row.data);
    
    let matches = true;
    for (const [field, operator, value] of conditions) {
      if (field !== 'userId') {
        if (operator === '==' && data[field] !== value) {
          matches = false;
          break;
        }
      }
    }
    
    if (matches) {
      idsToDelete.push(row.id);
    }
  }
  
  for (const id of idsToDelete) {
    await db.executeSql(`DELETE FROM ${collection} WHERE id = ?`, [id]);
  }
  
  await notifyListeners(collection);
  callback?.();
};

/**
 * Subscribe to data changes (with userId filter)
 */
const getSnapShot = async (collection, callback, conditions = []) => {
  const userId = await getUserId();
  conditions.push(['userId', '==', userId]);
  return getSnapShotAll(collection, callback, conditions);
};

/**
 * Subscribe to data changes (without userId filter)
 */
const getSnapShotAll = async (collection, callback, conditions = []) => {
  await init();
  
  const listenerId = generateId();
  
  // Store listener
  if (!listeners.has(collection)) {
    listeners.set(collection, new Map());
  }
  listeners.get(collection).set(listenerId, { callback, conditions });
  
  // Initial fetch
  await fetchAndNotify(collection, callback, conditions);
  
  // Return unsubscribe function
  return () => {
    const collectionListeners = listeners.get(collection);
    if (collectionListeners) {
      collectionListeners.delete(listenerId);
    }
  };
};

/**
 * Update data by ID
 */
const updateData = async (collection, id, data, callback) => {
  await init();
  
  const [results] = await db.executeSql(
    `SELECT data, time FROM ${collection} WHERE id = ?`,
    [id]
  );
  
  if (results.rows.length > 0) {
    const existingData = JSON.parse(results.rows.item(0).data);
    const updatedData = { ...existingData, ...data };
    const time = data.time || results.rows.item(0).time;
    
    await db.executeSql(
      `UPDATE ${collection} SET data = ?, time = ? WHERE id = ?`,
      [JSON.stringify(updatedData), time, id]
    );
    
    console.log(`Updated in ${collection}: ${id}`);
    
    await notifyListeners(collection);
  }
  
  callback?.();
};

/**
 * Check if using shared organization
 */
const isSharedOrg = async () => {
  const userId = await getUserId();
  return userId !== auth().currentUser?.uid;
};

/**
 * Get the database instance (for backup operations)
 */
const getDb = async () => {
  await init();
  return db;
};

// Export SQLite adapter implementation
const SQLiteAdapter = {
  init,
  insertData,
  updateData,
  deleteData,
  deleteMulipleData,
  getSnapShot,
  getSnapShotAll,
  insertOrUpdate,
  getUserId,
  setUserId,
  getLoginId,
  getLoginEmail,
  isSharedOrg,
  getDb,
};

export default SQLiteAdapter;

// Named export for direct import
export { getDb };
