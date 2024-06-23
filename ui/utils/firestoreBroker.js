import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

var userId = null;

const getLoginId = () => auth().currentUser.uid;
const getLoginEmail = () => auth().currentUser.email;

const getUserId = () => userId;

const setUserId = (uid) => userId = uid;

const insertData = (collection, data, callback) => {
    data.userId = getUserId();
    // console.log('insertData start');
    // console.log(data);
    // console.log('insertData end');
    firestore()
    .collection(collection)
    .add(data)
    .then((a) => {
        callback?.();
    }).catch((err) => {
        console.log('Insert data failed!');
        console.log(err);
    });
}

const insertOrUpdate = (collection, data, id) => {
    // console.log('inserOrUpdate start');
    // console.log(collection);
    // console.log(data);
    // console.log(id);
    // console.log('inserOrUpdate end');
    const coln = firestore()
    .collection(collection);
    coln.where('userId', '==', id).count().get().then(({_data : {count}}) => {
        // console.log(count);
        if(count == 1){
           return; 
        }
        coln.add(data);
    });
}

const deleteData = (collection, id, callback) => {
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
        'userId', '==', getUserId()
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
        'userId', '==', getUserId()
    ]);
    return getSnapShotAll(collection, callback, conditions);
}

const getSnapShotAll = (collection, callback, conditions = []) => {
    var firestoreObj = firestore()
    .collection(collection);
    conditions?.forEach(condition => {
        firestoreObj = firestoreObj.where(condition[0], condition[1], condition[2]);
    });
    return firestoreObj
    .orderBy('time', 'desc')
    .onSnapshot(callback, (err) => console.log(err));
}

const updateData = (collection, id, data, callback) => {
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

const isSharedOrg = () => getUserId() != auth().currentUser.uid

export {insertData, deleteData, deleteMulipleData, getSnapShot, updateData, getUserId, userId, insertOrUpdate, getSnapShotAll, setUserId, isSharedOrg, getLoginId, getLoginEmail};