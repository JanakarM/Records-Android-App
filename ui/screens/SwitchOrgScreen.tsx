import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setUserId as setOrgId, getSnapShotAll, getLoginId, getUserId, getLoginEmail} from '../data/DataBrokerProvider';
import DropDown from '../components/DropDown';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
  border: '#eceff1',
};

const userCollection = 'Users';
const shareCollection = 'Share';

interface User {
  id: string;
  userId: string;
  email: string;
  displayName?: string;
}

interface Share {
  id: string;
  userId: string;
  sharedWith: string;
}

export default function SwitchOrgScreen({navigation}: {navigation: any}) {
  const [users, setUsers] = useState<User[]>([]);
  const [shared, setShared] = useState<Share[]>([]);
  const [sharedOrg, setSharedOrg] = useState<User[]>([]);
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');

  const updateShared = () => {
    const sharedIds = shared.map((s: Share) => s.userId);
    const shareData = users.filter((u: User) => sharedIds.includes(u.userId) || u.userId === getLoginId());
    setSharedOrg(shareData);
  };

  useEffect(() => {
    let mounted = true;
    getUserId().then((id: string) => {
      if (mounted) setUserId(id);
    });
    return () => { mounted = false; };
  }, []);

  const onUserSnapshot = (docs: any) => {
    const userList: User[] = [];
    docs.forEach((doc: any) => {
      userList.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setUsers(userList);
  };

  const onShareSnapshot = (docs: any) => {
    const sharedList: Share[] = [];
    docs.forEach((doc: any) => {
      sharedList.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setShared(sharedList);
  };

  const switchOrg = () => {
    if (!user) return;
    setOrgId(user);
    navigation.navigate('Home');
  };

  useEffect(() => {
    let unsubscribe = () => {};
    getSnapShotAll(userCollection, onUserSnapshot).then((unsub: () => void) => {
      unsubscribe = unsub;
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    getSnapShotAll(shareCollection, onShareSnapshot, [['sharedWith', '==', getLoginEmail()]]).then((unsub: () => void) => {
      unsubscribe = unsub;
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => updateShared(), [users, shared]);

  const hasOrgs = sharedOrg.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrap}>
            <Icon name="building-o" size={40} color={COLORS.accent} />
          </View>
        </View>

        <Text style={styles.title}>Switch Organization</Text>
        <Text style={styles.subtitle}>
          {hasOrgs 
            ? 'Select an organization to view their data'
            : 'No shared organizations available'}
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Current Organization</Text>
          <DropDown 
            data={sharedOrg}
            setValue={(a: string) => setUser(a)}
            labelFd='email'
            valueFd='userId'
            value={userId}
          />
        </View>

        {!hasOrgs && (
          <View style={styles.emptyState}>
            <Icon name="users" size={24} color={COLORS.textLight} />
            <Text style={styles.emptyText}>
              Ask someone to share their data with you to see it here
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !user && styles.buttonDisabled]}
          activeOpacity={0.8}
          onPress={switchOrg}
          disabled={!user}
        >
          <Icon name="exchange" size={18} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Switch Organization</Text>
        </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 16,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
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
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 32,
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});