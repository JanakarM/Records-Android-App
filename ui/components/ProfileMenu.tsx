// ProfileMenu.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ProfileMenu = ({photoUrl, nav, signOut}) => {
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
