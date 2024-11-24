// ProfileMenu.js
import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import {isSharedOrg} from '../utils/firestoreBroker';

const ProfileMenu = ({photoUrl, nav, signOut}) => {
  const [canShare, setCanShare] = useState(true); // Set loading to true on component mount
  isSharedOrg().then(res => setCanShare(!res));
  return (
        <View style={styles.container}>
          <Menu>
            <MenuTrigger>
            <Image
              style={styles.profileIcon}
              src={photoUrl}
            />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => {nav.navigate('ViewProfile')}} text="View Profile" />
              {
                canShare ?
                <MenuOption onSelect={() => {nav.navigate('ShareData')}} text="Share Data" />
                :
                ''
              }
              <MenuOption onSelect={() => {nav.navigate('SwitchOrg')}} text="Switch Org" />
              <MenuOption onSelect={() => {signOut(); alert('Logged out')}} text="Logout" />
            </MenuOptions>
          </Menu>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end'
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default ProfileMenu;
