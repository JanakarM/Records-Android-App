/**
 * DataBrokerProvider - Factory/Provider for data layer
 * 
 * This module provides the active database implementation.
 * Change the ACTIVE_ADAPTER to switch between different databases.
 * 
 * Supported adapters:
 * - 'sqlite'   : Local SQLite database
 * - 'supabase' : Supabase cloud database with real-time sync
 * 
 * To add a new adapter:
 * 1. Create adapter in ./adapters/ or ./supabase/ folder
 * 2. Import it here
 * 3. Add to ADAPTERS object
 */

import SQLiteAdapter from './adapters/SQLiteAdapter';
import SupabaseAdapter from './supabase/SupabaseAdapter';
import { validateBrokerImplementation } from './DataBroker';

// Available adapters
const ADAPTERS = {
  sqlite: SQLiteAdapter,
  supabase: SupabaseAdapter,
};

// Active adapter configuration
// Change this to switch database implementations
const ACTIVE_ADAPTER = 'supabase';

// Get the active adapter
const getAdapter = () => {
  const adapter = ADAPTERS[ACTIVE_ADAPTER];
  
  if (!adapter) {
    throw new Error(`Unknown adapter: ${ACTIVE_ADAPTER}. Available: ${Object.keys(ADAPTERS).join(', ')}`);
  }
  
  // Validate the adapter has all required methods
  validateBrokerImplementation(adapter);
  
  return adapter;
};

// Export active adapter instance
const DataBroker = getAdapter();

// Named exports for convenience
export const init = DataBroker.init;
export const insertData = DataBroker.insertData;
export const updateData = DataBroker.updateData;
export const deleteData = DataBroker.deleteData;
export const deleteMulipleData = DataBroker.deleteMulipleData;
export const getSnapShot = DataBroker.getSnapShot;
export const getSnapShotAll = DataBroker.getSnapShotAll;
export const insertOrUpdate = DataBroker.insertOrUpdate;
export const getUserId = DataBroker.getUserId;
export const setUserId = DataBroker.setUserId;
export const getLoginId = DataBroker.getLoginId;
export const getLoginEmail = DataBroker.getLoginEmail;
export const isSharedOrg = DataBroker.isSharedOrg;

// Alias for backward compatibility
export const initDatabase = DataBroker.init;

// Default export
export default DataBroker;
