import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, FlatList, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {deleteData, getSnapShot, insertData, getSnapShotAll, getLoginId} from '../data/DataBrokerProvider';
import DropDown from '../components/DropDown';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
  border: '#eceff1',
  danger: '#e57373',
};

const userCollection = 'Users';
const shareCollection = 'Share';

interface User {
  id: string;
  userId: string;
  email: string;
  displayName?: string;
}

interface ShareItem {
  id: string;
  sharedWith: string;
  time: number;
}

interface ListItemProps {
  share: ShareItem;
  deleteItem: (id: string) => void;
}

const SharedUserItem = ({share: {id, sharedWith}, deleteItem}: ListItemProps) => (
  <View style={styles.sharedItem}>
    <View style={styles.sharedItemLeft}>
      <View style={styles.avatarPlaceholder}>
        <Icon name="user" size={16} color={COLORS.accent} />
      </View>
      <Text style={styles.sharedEmail}>{sharedWith}</Text>
    </View>
    <TouchableOpacity 
      onPress={() => deleteItem(id)}
      style={styles.deleteButton}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
    >
      <Icon name="trash-o" size={18} color={COLORS.danger} />
    </TouchableOpacity>
  </View>
);

const EmptySharedState = () => (
  <View style={styles.emptyState}>
    <Icon name="users" size={32} color={COLORS.textLight} />
    <Text style={styles.emptyTitle}>No one yet</Text>
    <Text style={styles.emptyText}>
      Select a user above and tap "Share" to give them access to your data
    </Text>
  </View>
);

export default function ShareScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [canShareWith, setCanShareWith] = useState<User[]>([]);
  const [sharedWith, setSharedWith] = useState<ShareItem[]>([]);
  const [user, setUser] = useState('');

  const updateCanShareWith = () => {
    const emails = sharedWith.map((share: ShareItem) => share.sharedWith);
    const available = users.filter((u: User) => !emails.includes(u.email));
    setCanShareWith(available);
  };

  const onUserSnapshot = async (docs: any) => {
    const userList: User[] = [];
    docs.forEach((doc: any) => {
      userList.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setUsers(userList);
  };

  const onShareSnapshot = async (docs: any) => {
    const shareList: ShareItem[] = [];
    docs.forEach((doc: any) => {
      shareList.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setSharedWith(shareList);
  };

  const shareData = () => {
    if (!user) {
      Alert.alert('Select User', 'Please select a user to share your data with.');
      return;
    }
    insertData('Share', {
      time: Date.now(),
      sharedWith: user
    }, () => setUser(''));
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      'Remove Access',
      'This user will no longer have access to your data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteData(shareCollection, id),
        },
      ]
    );
  };

  useEffect(() => {
    let unsubscribe = () => {};
    getSnapShotAll(userCollection, onUserSnapshot, [['userId', 'not-in', [getLoginId()]]]).then((unsub: () => void) => {
      unsubscribe = unsub;
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    getSnapShot(shareCollection, onShareSnapshot).then((unsub: () => void) => {
      unsubscribe = unsub;
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    updateCanShareWith();
  }, [users, sharedWith]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrap}>
            <Icon name="share-alt" size={36} color={COLORS.accent} />
          </View>
        </View>

        <Text style={styles.title}>Share Your Data</Text>
        <Text style={styles.subtitle}>
          Give others read access to your records
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Share with</Text>
          <DropDown 
            data={canShareWith}
            labelFd='email'
            valueFd='email'
            value={user}
            setValue={(a: string) => setUser(a)}
          />
          <TouchableOpacity
            style={[styles.shareButton, !user && styles.shareButtonDisabled]}
            activeOpacity={0.8}
            onPress={shareData}
            disabled={!user}
          >
            <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.shareButtonText}>Share Access</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>
            People with access ({sharedWith.length})
          </Text>
          <FlatList
            data={sharedWith}
            keyExtractor={(item: ShareItem) => item.id}
            ListEmptyComponent={EmptySharedState}
            renderItem={({item}: {item: ShareItem}) => (
              <SharedUserItem share={item} deleteItem={deleteItem} />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  sharedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  sharedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sharedEmail: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});