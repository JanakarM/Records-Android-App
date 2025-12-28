// ProfileMenu.js
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, Alert } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import {isSharedOrg} from '../data/DataBrokerProvider';

const COLORS = {
  bg: '#fafafa',
  card: '#fff',
  accent: '#5c6bc0',
  text: '#37474f',
  textLight: '#78909c',
  danger: '#e57373',
};

const MenuItem = ({icon, label, onSelect, danger = false}) => (
  <MenuOption onSelect={onSelect} style={styles.menuItem}>
    <Icon name={icon} size={16} color={danger ? COLORS.danger : COLORS.accent} style={styles.menuIcon} />
    <Text style={[styles.menuText, danger && styles.menuTextDanger]}>{label}</Text>
  </MenuOption>
);

const ProfileMenu = ({photoUrl, nav, signOut}) => {
  const [canShare, setCanShare] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    isSharedOrg().then(res => {
      if (mounted) setCanShare(!res);
    });
    return () => { mounted = false; };
  }, []);
  
  return (
    <View style={styles.container}>
      <Menu>
        <MenuTrigger>
          <View style={styles.avatarWrap}>
            <Image style={styles.profileIcon} src={photoUrl} />
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={menuOptionsStyles}>
          <MenuItem icon="user" label="View Profile" onSelect={() => nav.navigate('ViewProfile')} />
          <MenuItem icon="bell" label="Notifications" onSelect={() => nav.navigate('Notifications')} />
          {canShare && (
            <MenuItem icon="share-alt" label="Share Data" onSelect={() => nav.navigate('ShareData')} />
          )}
          <MenuItem icon="exchange" label="Switch Org" onSelect={() => nav.navigate('SwitchOrg')} />
          <View style={styles.divider} />
          <MenuItem 
            icon="sign-out" 
            label="Logout" 
            onSelect={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => signOut()
                  },
                ],
                { cancelable: true }
              );
            }} 
            danger 
          />
        </MenuOptions>
      </Menu>
    </View>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
    minWidth: 180,
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  avatarWrap: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.accent + '40',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  menuIcon: {
    width: 24,
  },
  menuText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  menuTextDanger: {
    color: COLORS.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.textLight + '40',
    marginVertical: 8,
    marginHorizontal: 12,
  },
});

export default ProfileMenu;
