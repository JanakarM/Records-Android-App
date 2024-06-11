import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View } from 'react-native';
import Styles from '../StyleSheet';
import auth from '@react-native-firebase/auth';

export default function(){
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const user = () => {
      return auth().currentUser;
    };
    useEffect(() => {
        Image.getSize(user()?.photoURL, (width, height) => {
            setWidth(width);
            setHeight(height);
        });
    }, );
    const styles = StyleSheet.create({
        imageContainer: {
          marginBottom: 30
        },
        profileIcon: {
            width: width,
            height: height,
            borderRadius: 20
        },
        container: {
            padding: 50,
            flexDirection: 'column',
            gap: 40
        },
        textContainer: {
            flexDirection: 'row',
            gap: 50
        },
      });
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                style={styles.profileIcon}
                src={user()?.photoURL}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={{fontWeight: 800}}>Name</Text>
                <Text>{user()?.displayName}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={{fontWeight: 800}}>Email</Text>
                <Text>{user()?.email}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={{fontWeight: 800}}>User id</Text>
                <Text>{user()?.uid}</Text>
            </View>
        </SafeAreaView>
    )
}