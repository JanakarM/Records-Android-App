import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { setItem, getItem, clear, getAll } from 'react-native-shared-preferences';

const getLoginId = () => auth().currentUser.uid;
const getLoginEmail = () => auth().currentUser.email;

const getUserId = async () => {
    return await new Promise((resolve, reject) => getItem(getLoginId(), (val) => {
        resolve(val);
    }));
}

const setUserId = (uid) => {
    console.log('setUserId -> ' + uid);
    setItem(getLoginId(), uid);
}

const log = async () => {
    var orgId = await getUserId();
    console.log('log userId -> ' + orgId);
}
const insertData = async (collection, data, callback) => {
    data.userId = await getUserId();
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
    log();
    const coln = firestore()
    .collection(collection);
    coln.where('userId', '==', id).count().get().then(({_data : {count}}) => {
        if(count == 1){
           return; 
        }
        coln.add(data);
    });
}

const deleteData = (collection, id, callback) => {
    log();
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

const deleteMulipleData = async (collection, conditions, callback) => {
    log();
    conditions?.push([
        'userId', '==', await getUserId()
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

const getSnapShot = async (collection, callback, conditions = []) => {
    conditions?.push([
        'userId', '==', await getUserId()
    ]);
    return getSnapShotAll(collection, callback, conditions);
}

const getSnapShotAll = (collection, callback, conditions = []) => {
    log();
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
    log();
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

const isSharedOrg = async () => await getUserId() != auth().currentUser.uid

export {insertData, deleteData, deleteMulipleData, getSnapShot, updateData, getUserId, insertOrUpdate, getSnapShotAll, setUserId, isSharedOrg, getLoginId, getLoginEmail};