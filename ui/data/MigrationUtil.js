/**
 * MigrationUtil - Utility to migrate data from Firestore to SQLite
 * 
 * This is a one-time migration tool to copy existing Firestore data
 * to the local SQLite database.
 */

import { fetchAllFromCollection, fetchAllFromCollectionUnfiltered, getUserId, getLoginId } from './adapters/FirestoreAdapter';
import SQLiteAdapter from './adapters/SQLiteAdapter';

// Collections to migrate (user-specific data)
const USER_COLLECTIONS = [
  'Memories',
  'Rent',
  'RentTransaction',
  'Bills',
  'ChitFunds',
  'ChitFundTransactions',
  'WaterCanEntries',
];

/**
 * Migrate all data from Firestore to SQLite
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Object} - Migration results
 */
export const migrateFirestoreToSQLite = async (onProgress = () => {}) => {
  const results = {
    success: true,
    collections: {},
    totalRecords: 0,
    errors: [],
  };

  try {
    // Initialize SQLite
    await SQLiteAdapter.init();
    onProgress('SQLite initialized');

    // Migrate each user collection
    for (const collection of USER_COLLECTIONS) {
      try {
        onProgress(`Migrating ${collection}...`);
        
        // Fetch from Firestore
        const firestoreData = await fetchAllFromCollection(collection);
        
        let migratedCount = 0;
        
        // Insert into SQLite
        for (const record of firestoreData) {
          try {
            const { id, ...data } = record;
            
            // Insert with the original data (preserving time, userId, etc.)
            await insertDirectToSQLite(collection, id, data);
            migratedCount++;
          } catch (err) {
            console.log(`Error migrating record in ${collection}:`, err);
            results.errors.push(`${collection}/${record.id}: ${err.message}`);
          }
        }
        
        results.collections[collection] = {
          found: firestoreData.length,
          migrated: migratedCount,
        };
        results.totalRecords += migratedCount;
        
        onProgress(`${collection}: ${migratedCount}/${firestoreData.length} migrated`);
        
      } catch (err) {
        console.log(`Error fetching ${collection}:`, err);
        results.errors.push(`${collection}: ${err.message}`);
        results.collections[collection] = { found: 0, migrated: 0, error: err.message };
      }
    }

    // Migrate Users collection (special - not filtered by userId)
    try {
      onProgress('Migrating Users...');
      const loginId = getLoginId();
      const usersData = await fetchAllFromCollectionUnfiltered('Users', [['userId', '==', loginId]]);
      
      let migratedCount = 0;
      for (const record of usersData) {
        try {
          const { id, ...data } = record;
          await insertDirectToSQLite('Users', id, data);
          migratedCount++;
        } catch (err) {
          results.errors.push(`Users/${record.id}: ${err.message}`);
        }
      }
      
      results.collections['Users'] = { found: usersData.length, migrated: migratedCount };
      results.totalRecords += migratedCount;
      onProgress(`Users: ${migratedCount}/${usersData.length} migrated`);
    } catch (err) {
      results.errors.push(`Users: ${err.message}`);
    }

    // Migrate Share collection
    try {
      onProgress('Migrating Share...');
      const userId = await getUserId();
      const shareData = await fetchAllFromCollectionUnfiltered('Share', [['userId', '==', userId]]);
      
      let migratedCount = 0;
      for (const record of shareData) {
        try {
          const { id, ...data } = record;
          await insertDirectToSQLite('Share', id, data);
          migratedCount++;
        } catch (err) {
          results.errors.push(`Share/${record.id}: ${err.message}`);
        }
      }
      
      results.collections['Share'] = { found: shareData.length, migrated: migratedCount };
      results.totalRecords += migratedCount;
      onProgress(`Share: ${migratedCount}/${shareData.length} migrated`);
    } catch (err) {
      results.errors.push(`Share: ${err.message}`);
    }

    onProgress(`Migration complete! Total: ${results.totalRecords} records`);
    
  } catch (err) {
    results.success = false;
    results.errors.push(`Migration failed: ${err.message}`);
    onProgress(`Migration failed: ${err.message}`);
  }

  return results;
};

/**
 * Direct insert to SQLite with specific ID (for migration)
 */
const insertDirectToSQLite = async (collection, id, data) => {
  const db = await SQLiteAdapter.init();
  const time = data.time || Date.now();
  const userId = data.userId;
  
  // Check if record already exists
  const [existing] = await db.executeSql(
    `SELECT id FROM ${collection} WHERE id = ?`,
    [id]
  );
  
  if (existing.rows.length > 0) {
    // Update existing record
    await db.executeSql(
      `UPDATE ${collection} SET data = ?, time = ?, userId = ? WHERE id = ?`,
      [JSON.stringify(data), time, userId, id]
    );
  } else {
    // Insert new record
    await db.executeSql(
      `INSERT INTO ${collection} (id, userId, time, data) VALUES (?, ?, ?, ?)`,
      [id, userId, time, JSON.stringify(data)]
    );
  }
};

export default migrateFirestoreToSQLite;
