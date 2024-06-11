import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const userId = () => auth().currentUser.uid;

const insertData = (collection, data, callback) => {
    data.userId = userId();
    firestore()
    .collection(collection)
    .add(data)
    .then((a) => {
        callback?.();
    }).catch((err) => {
        console.log('Insert data failed!');
        console.log(err);
    });;
}

const deleteData = (collection, id, callback) => {
    data.userId = userId();
    firestore()
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
        callback?.();
    }).catch((err) => {
        console.log('Delete data failed!');
        console.log(err);
    });
}

const deleteMulipleData = (collection, conditions, callback) => {
    conditions?.push([
        'userId', '==', userId()
    ]);
    var firestoreObj = firestore()
    .collection(collection);
    conditions?.forEach(condition => firestoreObj = firestoreObj.where(condition[0], condition[1], condition[2]));
    firestoreObj.get()
    .then((querySnapshot) => {
        const batch = firestore().batch();
        querySnapshot.forEach(documentSnapshot => {
            batch.delete(documentSnapshot.ref);
        });
        batch.commit().then(callback?.());
    }).catch((err) => {
        console.log(err);
    });
}

const getSnapShot = (collection, callback, conditions = []) => {
    conditions?.push([
        'userId', '==', userId()
    ]);
    var firestoreObj = firestore()
    .collection(collection);
    conditions?.forEach(condition => firestoreObj = firestoreObj.where(condition[0], condition[1], condition[2]));
    return firestoreObj.orderBy('time', 'desc')
    .onSnapshot(callback, (err) => console.log(err));
}

const updateData = (collection, id, data, callback) => {
    data.userId = userId();
    firestore()
    .collection(collection)
    .doc(id)
    .update(data)
    .then(() => {
        callback?.();
    }).catch((err) => {
        console.log(err);
    });
}

export {insertData, deleteData, deleteMulipleData, getSnapShot, updateData};