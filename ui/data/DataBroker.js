/**
 * DataBroker - Abstract data layer interface
 * 
 * This module defines the contract for data operations.
 * All database implementations must follow this interface.
 * 
 * To add a new database implementation:
 * 1. Create a new file (e.g., MongoBroker.js) implementing all methods
 * 2. Update DataBrokerProvider.js to include the new implementation
 * 3. Change the active broker in DataBrokerProvider.js
 */

/**
 * @typedef {Object} DataBrokerInterface
 * 
 * @property {Function} init - Initialize the database connection
 * @property {Function} insertData - Insert a new record
 * @property {Function} updateData - Update an existing record
 * @property {Function} deleteData - Delete a record by ID
 * @property {Function} deleteMulipleData - Delete multiple records matching conditions
 * @property {Function} getSnapShot - Subscribe to data changes (with userId filter)
 * @property {Function} getSnapShotAll - Subscribe to data changes (without userId filter)
 * @property {Function} insertOrUpdate - Insert or update based on existence
 * @property {Function} getUserId - Get current user ID
 * @property {Function} setUserId - Set current user ID
 * @property {Function} getLoginId - Get login ID from auth provider
 * @property {Function} getLoginEmail - Get login email from auth provider
 * @property {Function} isSharedOrg - Check if using shared organization
 */

// Collection names used in the app
export const COLLECTIONS = {
  MEMORIES: 'Memories',
  RENT: 'Rent',
  RENT_TRANSACTION: 'RentTransaction',
  BILLS: 'Bills',
  CHIT_FUNDS: 'ChitFunds',
  CHIT_FUND_TRANSACTION: 'ChitFundTransactions',
  WATER_CAN: 'WaterCanEntries',
  USERS: 'Users',
  SHARED_USERS: 'SharedUsers',
  SHARE: 'Share',
};

/**
 * Validates that a broker implementation has all required methods
 * @param {Object} broker - The broker implementation to validate
 * @returns {boolean} - True if valid
 * @throws {Error} - If any required method is missing
 */
export const validateBrokerImplementation = (broker) => {
  const requiredMethods = [
    'init',
    'insertData',
    'updateData',
    'deleteData',
    'deleteMulipleData',
    'getSnapShot',
    'getSnapShotAll',
    'insertOrUpdate',
    'getUserId',
    'setUserId',
    'getLoginId',
    'getLoginEmail',
    'isSharedOrg',
  ];

  const missingMethods = requiredMethods.filter(
    (method) => typeof broker[method] !== 'function'
  );

  if (missingMethods.length > 0) {
    throw new Error(
      `DataBroker implementation is missing required methods: ${missingMethods.join(', ')}`
    );
  }

  return true;
};
