/**
 * FirestoreAdapter - Firestore implementation for data migration
 * 
 * This adapter is used to read data from Firestore for migration purposes.
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { setItem, getItem } from 'react-native-shared-preferences';

// Get login ID from Firebase Auth
const getLoginId = () => auth().currentUser?.uid;
const getLoginEmail = () => auth().currentUser?.email;

// User ID management
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
 * Fetch all data from a Firestore collection for the current user
 */
const fetchAllFromCollection = async (collection) => {
  const userId = await getUserId();
  
  const snapshot = await firestore()
    .collection(collection)
    .where('userId', '==', userId)
    .get();
  
  const data = [];
  snapshot.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  
  return data;
};

/**
 * Fetch all data from a collection without userId filter (for Users, Share tables)
 */
const fetchAllFromCollectionUnfiltered = async (collection, conditions = []) => {
  let query = firestore().collection(collection);
  
  conditions.forEach(([field, operator, value]) => {
    query = query.where(field, operator, value);
  });
  
  const snapshot = await query.get();
  
  const data = [];
  snapshot.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  
  return data;
};

// Export functions needed for migration
export {
  fetchAllFromCollection,
  fetchAllFromCollectionUnfiltered,
  getUserId,
  getLoginId,
};
