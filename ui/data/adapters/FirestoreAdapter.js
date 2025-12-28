/**
 * FirestoreAdapter - Firebase Firestore implementation of DataBroker interface
 * 
 * Uses @react-native-firebase/firestore for cloud database operations.
 * Provides real-time sync via Firestore snapshots.
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { setItem, getItem } from 'react-native-shared-preferences';

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

/**
 * Initialize - no-op for Firestore (connection is automatic)
 */
const init = async () => {
  console.log('Firestore adapter initialized');
  return true;
};

/**
 * Insert data into collection
 */
const insertData = async (collection, data, callback) => {
  const userId = await getUserId();
  data.userId = userId;
  data.time = data.time || Date.now();
  
  const docRef = await firestore().collection(collection).add(data);
  console.log(`Inserted into ${collection}: ${docRef.id}`);
  
  callback?.({ id: docRef.id });
};

/**
 * Update data by ID
 */
const updateData = async (collection, id, data, callback) => {
  await firestore().collection(collection).doc(id).update(data);
  console.log(`Updated in ${collection}: ${id}`);
  
  callback?.();
};

/**
 * Delete data by ID
 */
const deleteData = async (collection, id, callback) => {
  await firestore().collection(collection).doc(id).delete();
  console.log(`Deleted from ${collection}: ${id}`);
  
  callback?.();
};

/**
 * Delete multiple records with conditions
 */
const deleteMulipleData = async (collection, conditions = [], callback) => {
  const userId = await getUserId();
  
  let query = firestore().collection(collection).where('userId', '==', userId);
  
  conditions.forEach(([field, operator, value]) => {
    if (field !== 'userId') {
      query = query.where(field, operator, value);
    }
  });
  
  const snapshot = await query.get();
  
  const batch = firestore().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Deleted ${snapshot.size} records from ${collection}`);
  
  callback?.();
};

/**
 * Subscribe to data changes (with userId filter)
 */
const getSnapShot = async (collection, callback, conditions = []) => {
  const userId = await getUserId();
  
  let query = firestore().collection(collection).where('userId', '==', userId);
  
  conditions.forEach(([field, operator, value]) => {
    if (field !== 'userId') {
      query = query.where(field, operator, value);
    }
  });
  
  query = query.orderBy('time', 'desc');
  
  const unsubscribe = query.onSnapshot(
    (snapshot) => {
      callback(snapshot);
    },
    (error) => {
      console.log(`Snapshot error for ${collection}:`, error);
    }
  );
  
  return unsubscribe;
};

/**
 * Subscribe to data changes (without userId filter)
 */
const getSnapShotAll = async (collection, callback, conditions = []) => {
  let query = firestore().collection(collection);
  
  conditions.forEach(([field, operator, value]) => {
    query = query.where(field, operator, value);
  });
  
  const unsubscribe = query.onSnapshot(
    (snapshot) => {
      callback(snapshot);
    },
    (error) => {
      console.log(`Snapshot error for ${collection}:`, error);
    }
  );
  
  return unsubscribe;
};

/**
 * Insert or update (for Users collection)
 */
const insertOrUpdate = async (collection, data, id) => {
  const docRef = firestore().collection(collection).doc(id);
  const doc = await docRef.get();
  
  if (!doc.exists) {
    data.time = data.time || Date.now();
    await docRef.set(data);
    console.log(`Inserted into ${collection}: ${id}`);
  } else {
    await docRef.update(data);
    console.log(`Updated in ${collection}: ${id}`);
  }
};

/**
 * Check if using shared organization
 */
const isSharedOrg = async () => {
  const userId = await getUserId();
  return userId !== auth().currentUser?.uid;
};

/**
 * Get Firestore instance (for advanced operations)
 */
const getDb = () => firestore();

// Export Firestore adapter implementation
const FirestoreAdapter = {
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

export default FirestoreAdapter;

// Named exports for migration utilities
export {
  getUserId,
  getLoginId,
};
