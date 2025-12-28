import React from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
};

const InfoRow = ({icon, label, value}) => (
  <View style={styles.infoRow}>
    <View style={styles.iconWrap}>
      <Icon name={icon} size={16} color={COLORS.accent} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value || '—'}</Text>
    </View>
  </View>
);

export default function(){
    const user = auth().currentUser;
    // Request higher resolution photo from Google (s400 = 400px)
    const photoURL = user?.photoURL?.replace('s96-c', 's400-c') || user?.photoURL;

    return (
        <SafeAreaView style={styles.container}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image style={styles.avatar} src={photoURL} />
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <InfoRow icon="user" label="Display Name" value={user?.displayName} />
              <InfoRow icon="envelope" label="Email" value={user?.email} />
            </View>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  avatarWrap: {
    padding: 5,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: COLORS.accent + '30',
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    aspectRatio: 1,
    maxWidth: 400,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  cardContainer: {
    padding: 12,
    paddingTop: 0,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bg,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.accent + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
});