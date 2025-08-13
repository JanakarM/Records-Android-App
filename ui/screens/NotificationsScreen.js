import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getScheduledNotifications, cancelNotification as cancelNotificationUtil, cancelAllNotifications as cancelAllNotificationsUtil, NOTIFICATION_TYPE_RENT, NOTIFICATION_TYPE_MEMORY } from '../utils/notificationUtil';
import { formatDate } from '../utils/dateUtil';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Notification object structure:
// - id
// - title
// - message
// - date

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    getScheduledNotifications((scheduledNotifications) => {
      const formattedNotifications = scheduledNotifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        date: new Date(notification.date)
      }));
      setNotifications(formattedNotifications);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCancelNotification = (id) => {
    // Extract notification type from the ID format (type_id)
    let notificationType = null;
    if (id.startsWith(`${NOTIFICATION_TYPE_RENT}_`)) {
      notificationType = NOTIFICATION_TYPE_RENT;
    } else if (id.startsWith(`${NOTIFICATION_TYPE_MEMORY}_`)) {
      notificationType = NOTIFICATION_TYPE_MEMORY;
    }
    
    // Get the actual ID without the type prefix
    const actualId = notificationType ? id.substring(notificationType.length + 1) : id;
    
    Alert.alert(
      "Cancel Notification",
      "Are you sure you want to cancel this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes", 
          onPress: () => {
            cancelNotificationUtil(actualId, notificationType);
            fetchNotifications();
          }
        }
      ]
    );
  };

  const handleCancelAllNotifications = () => {
    Alert.alert(
      "Cancel All Notifications",
      "Are you sure you want to cancel all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes", 
          onPress: () => {
            cancelAllNotificationsUtil();
            fetchNotifications();
          }
        }
      ]
    );
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationDate}>Scheduled for: {formatDate(item.date)}</Text>
      </View>
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => handleCancelNotification(item.id)}
      >
        <Icon name="cancel" size={24} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scheduled Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity 
            style={styles.cancelAllButton} 
            onPress={handleCancelAllNotifications}
          >
            <Text style={styles.cancelAllText}>Cancel All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No scheduled notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelAllButton: {
    padding: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
  },
  cancelAllText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
  },
  cancelButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationsScreen;
