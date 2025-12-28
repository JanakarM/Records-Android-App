/**
 * BackupUtil - Export/Import data for backup and restore
 * 
 * Exports all SQLite data to JSON and imports from JSON file.
 * Uses the app's external storage directory for backup files.
 */

import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { getDb } from './adapters/SQLiteAdapter';

const BACKUP_FILENAME = 'RecordsApp_backup.json';

/**
 * Request storage permissions for Android
 */
const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  
  try {
    // For Android 13+ (API 33+), we don't need these permissions for app-specific directories
    if (Platform.Version >= 33) {
      return true;
    }
    
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    
    return (
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (err) {
    console.error('Permission error:', err);
    return false;
  }
};

/**
 * Get the backup directory path
 */
const getBackupDir = () => {
  // Use Download folder for easy access
  if (Platform.OS === 'android') {
    return RNFS.DownloadDirectoryPath;
  }
  return RNFS.DocumentDirectoryPath;
};

/**
 * Get full backup file path
 */
const getBackupPath = () => {
  return `${getBackupDir()}/${BACKUP_FILENAME}`;
};

/**
 * Export all data to a JSON file
 * @param {function} onProgress - Progress callback
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
export const exportData = async (onProgress = () => {}) => {
  try {
    onProgress('Requesting permissions...');
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      return { success: false, error: 'Storage permission denied' };
    }

    onProgress('Initializing database...');
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database not initialized' };
    }

    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {},
    };

    const collections = [
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

    let totalRecords = 0;

    for (const collection of collections) {
      onProgress(`Exporting ${collection}...`);
      
      try {
        const [results] = await db.executeSql(`SELECT * FROM ${collection}`);
        const records = [];
        
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          records.push({
            id: row.id,
            userId: row.userId,
            time: row.time,
            data: JSON.parse(row.data || '{}'),
          });
        }
        
        backup.data[collection] = records;
        totalRecords += records.length;
      } catch (err) {
        console.log(`No data in ${collection} or table doesn't exist`);
        backup.data[collection] = [];
      }
    }

    onProgress('Writing backup file...');
    const backupPath = getBackupPath();
    await RNFS.writeFile(backupPath, JSON.stringify(backup, null, 2), 'utf8');

    onProgress('Export complete!');
    return { 
      success: true, 
      path: backupPath, 
      totalRecords,
    };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Pick a backup file using document picker
 * @returns {Promise<{success: boolean, uri?: string, name?: string, error?: string}>}
 */
export const pickBackupFile = async () => {
  try {
    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.json, DocumentPicker.types.allFiles],
      copyTo: 'cachesDirectory',
    });
    
    if (result && result.length > 0) {
      const file = result[0];
      return {
        success: true,
        uri: file.fileCopyUri || file.uri,
        name: file.name,
      };
    }
    return { success: false, error: 'No file selected' };
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      return { success: false, cancelled: true };
    }
    return { success: false, error: err.message };
  }
};

/**
 * Import data from a JSON backup file
 * @param {string} filePath - Path to the backup file (from picker or default)
 * @param {function} onProgress - Progress callback
 * @returns {Promise<{success: boolean, totalRecords?: number, error?: string}>}
 */
export const importData = async (filePath = null, onProgress = () => {}) => {
  try {
    let backupPath = filePath;
    
    // If no file path provided, use file picker
    if (!backupPath) {
      onProgress('Select backup file...');
      const pickResult = await pickBackupFile();
      
      if (pickResult.cancelled) {
        return { success: false, cancelled: true };
      }
      if (!pickResult.success) {
        return { success: false, error: pickResult.error };
      }
      backupPath = pickResult.uri;
    }

    onProgress('Reading backup file...');
    const content = await RNFS.readFile(backupPath, 'utf8');
    const backup = JSON.parse(content);

    if (!backup.version || !backup.data) {
      return { success: false, error: 'Invalid backup file format' };
    }

    onProgress('Initializing database...');
    const db = await getDb();
    if (!db) {
      return { success: false, error: 'Database not initialized' };
    }

    let totalRecords = 0;
    const collections = Object.keys(backup.data);

    for (const collection of collections) {
      const records = backup.data[collection];
      if (!records || records.length === 0) continue;

      onProgress(`Importing ${collection} (${records.length} records)...`);

      for (const record of records) {
        try {
          // Check if record already exists
          const [existing] = await db.executeSql(
            `SELECT id FROM ${collection} WHERE id = ?`,
            [record.id]
          );

          if (existing.rows.length > 0) {
            // Update existing record
            await db.executeSql(
              `UPDATE ${collection} SET userId = ?, time = ?, data = ? WHERE id = ?`,
              [record.userId, record.time, JSON.stringify(record.data), record.id]
            );
          } else {
            // Insert new record
            await db.executeSql(
              `INSERT INTO ${collection} (id, userId, time, data) VALUES (?, ?, ?, ?)`,
              [record.id, record.userId, record.time, JSON.stringify(record.data)]
            );
          }
          totalRecords++;
        } catch (err) {
          console.error(`Error importing record in ${collection}:`, err);
        }
      }
    }

    onProgress('Import complete!');
    return { success: true, totalRecords };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if a backup file exists
 */
export const checkBackupExists = async () => {
  try {
    const backupPath = getBackupPath();
    const exists = await RNFS.exists(backupPath);
    if (exists) {
      const stat = await RNFS.stat(backupPath);
      return {
        exists: true,
        path: backupPath,
        size: stat.size,
        modified: stat.mtime,
      };
    }
    return { exists: false, path: backupPath };
  } catch (error) {
    return { exists: false, error: error.message };
  }
};

/**
 * Get backup file path for display
 */
export const getBackupFilePath = () => getBackupPath();
