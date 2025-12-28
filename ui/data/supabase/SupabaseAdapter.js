/**
 * SupabaseAdapter - Supabase implementation of DataBroker interface
 * 
 * Uses Supabase for cloud database with real-time sync.
 * Maintains same interface as SQLiteAdapter for easy switching.
 */

import { createClient } from '@supabase/supabase-js';
import auth from '@react-native-firebase/auth';
import { setItem, getItem } from 'react-native-shared-preferences';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listeners = new Map();

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
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

/**
 * Initialize - no-op for Supabase (connection is automatic)
 */
const init = async () => {
  console.log('Supabase adapter initialized');
  return true;
};

/**
 * Transform Supabase rows to match Firestore-like snapshot format
 */
const transformToSnapshot = (rows) => {
  const docs = rows.map(row => ({
    id: row.id,
    data: () => ({
      ...row.data,
      time: row.time,
    }),
  }));
  
  docs.forEach = (fn) => {
    docs.map((doc, index) => fn(doc, index));
  };
  
  return docs;
};

/**
 * Notify listeners for a collection
 */
const notifyListeners = async (collection) => {
  const collectionListeners = listeners.get(collection);
  if (collectionListeners) {
    for (const [listenerId, { callback, conditions }] of collectionListeners) {
      await fetchAndNotify(collection, callback, conditions);
    }
  }
};

/**
 * Fetch data and call callback
 */
const fetchAndNotify = async (collection, callback, conditions = []) => {
  let query = supabase.from(collection).select('*');
  
  // Apply conditions
  for (const [field, operator, value] of conditions) {
    if (operator === '==') {
      if (field === 'userId') {
        query = query.eq('user_id', value);
      } else {
        // For JSON data fields, use containedBy or filter client-side
        query = query.filter(`data->>${field}`, 'eq', value);
      }
    }
  }
  
  query = query.order('time', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching ${collection}:`, error);
    callback([]);
    return;
  }
  
  callback(transformToSnapshot(data || []));
};

/**
 * Insert data into collection
 */
const insertData = async (collection, data, callback) => {
  const userId = await getUserId();
  const id = generateId();
  const time = data.time || Date.now();
  
  data.userId = userId;
  
  const { error } = await supabase.from(collection).insert({
    id,
    user_id: userId,
    time,
    data,
  });
  
  if (error) {
    console.error(`Error inserting into ${collection}:`, error);
    callback?.({ error });
    return;
  }
  
  console.log(`Inserted into ${collection}: ${id}`);
  
  await notifyListeners(collection);
  callback?.({ id });
};

/**
 * Insert or update (for Users collection)
 */
const insertOrUpdate = async (collection, data, id) => {
  const { data: existing } = await supabase
    .from(collection)
    .select('id')
    .eq('user_id', id)
    .single();
  
  if (!existing) {
    const newId = generateId();
    const time = data.time || Date.now();
    
    await supabase.from(collection).insert({
      id: newId,
      user_id: id,
      time,
      data,
    });
  }
  
  await notifyListeners(collection);
};

/**
 * Delete data by ID
 */
const deleteData = async (collection, id, callback) => {
  const { error } = await supabase.from(collection).delete().eq('id', id);
  
  if (error) {
    console.error(`Error deleting from ${collection}:`, error);
    callback?.({ error });
    return;
  }
  
  console.log(`Deleted from ${collection}: ${id}`);
  
  await notifyListeners(collection);
  callback?.();
};

/**
 * Delete multiple records with conditions
 */
const deleteMulipleData = async (collection, conditions = [], callback) => {
  const userId = await getUserId();
  conditions.push(['userId', '==', userId]);
  
  // Fetch matching records first
  let query = supabase.from(collection).select('id, data').eq('user_id', userId);
  const { data: rows } = await query;
  
  if (!rows) {
    callback?.();
    return;
  }
  
  const idsToDelete = [];
  for (const row of rows) {
    let matches = true;
    for (const [field, operator, value] of conditions) {
      if (field !== 'userId') {
        if (operator === '==' && row.data[field] !== value) {
          matches = false;
          break;
        }
      }
    }
    if (matches) {
      idsToDelete.push(row.id);
    }
  }
  
  if (idsToDelete.length > 0) {
    await supabase.from(collection).delete().in('id', idsToDelete);
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
 * Subscribe to data changes with real-time updates
 */
const getSnapShotAll = async (collection, callback, conditions = []) => {
  const listenerId = generateId();
  const userId = await getUserId();
  
  // Store listener
  if (!listeners.has(collection)) {
    listeners.set(collection, new Map());
  }
  listeners.get(collection).set(listenerId, { callback, conditions });
  
  // Initial fetch
  await fetchAndNotify(collection, callback, conditions);
  
  // Set up real-time subscription
  const channel = supabase
    .channel(`${collection}_${listenerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: collection,
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        console.log(`Real-time update in ${collection}:`, payload.eventType);
        await fetchAndNotify(collection, callback, conditions);
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    const collectionListeners = listeners.get(collection);
    if (collectionListeners) {
      collectionListeners.delete(listenerId);
    }
    supabase.removeChannel(channel);
  };
};

/**
 * Update data by ID
 */
const updateData = async (collection, id, data, callback) => {
  // Fetch existing data
  const { data: existing } = await supabase
    .from(collection)
    .select('data, time')
    .eq('id', id)
    .single();
  
  if (existing) {
    const updatedData = { ...existing.data, ...data };
    const time = data.time || existing.time;
    
    const { error } = await supabase
      .from(collection)
      .update({ data: updatedData, time })
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating ${collection}:`, error);
      callback?.({ error });
      return;
    }
    
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
 * Get Supabase client (for backup operations)
 */
const getDb = async () => {
  return supabase;
};

// Export Supabase adapter implementation
const SupabaseAdapter = {
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

export default SupabaseAdapter;
