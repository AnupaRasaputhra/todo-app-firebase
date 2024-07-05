import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2wvbYM44kX-Lg4bkHfTCLAiDSWJEjB4I",
  authDomain: "info-6132-labs-26e88.firebaseapp.com",
  projectId: "info-6132-labs-26e88",
  storageBucket: "info-6132-labs-26e88.appspot.com",
  messagingSenderId: "550075977772",
  appId: "1:550075977772:web:93e14652df56226bff8189"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function save(data) {
  try {
    const dbCollection = collection(db, 'tasks');
    const docRef = await addDoc(dbCollection, data);
    return docRef.id;
  } catch (e) {
    return null;
  }
}

export async function load() {
  const data = [];

  const querySnapshot = await getDocs(collection(db, 'tasks'));
  querySnapshot.forEach((doc) => {
    data.push({
      ...doc.data(),
      id: doc.id
    });
  });

  return data;
}

export async function update(id, data) {
  try {
    const docRef = doc(db, 'tasks', id);
    await updateDoc(docRef, data);
    return true;
  }
  catch (e) {
    return false;
  }
}

export async function remove(id) {
  try {
    const docRef = doc(db, 'tasks', id);
    await deleteDoc(docRef);
    return true;
  }
  catch (e) {
    return false;
  }
}