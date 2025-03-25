import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { db, storage, functions } from './firebase';
import { User, CoffeeRecord, DictionaryEntry, AILanguageResponse } from '../types';

// ユーザー関連API
export const userAPI = {
  createUser: async (uid: string, userData: Partial<User>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
    });
  },
  
  getUser: async (uid: string): Promise<User | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    
    return null;
  },
  
  updateUser: async (uid: string, userData: Partial<User>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, userData);
  },
};

// コーヒー記録関連API
export const coffeeRecordAPI = {
  createRecord: async (userId: string, recordData: Omit<CoffeeRecord, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
    const recordRef = collection(db, 'coffeeRecords');
    const docRef = await addDoc(recordRef, {
      ...recordData,
      userId,
      createdAt: Timestamp.now(),
    });
    
    return docRef.id;
  },
  
  getRecord: async (recordId: string): Promise<CoffeeRecord | null> => {
    const recordRef = doc(db, 'coffeeRecords', recordId);
    const recordSnap = await getDoc(recordRef);
    
    if (recordSnap.exists()) {
      return recordSnap.data() as CoffeeRecord;
    }
    
    return null;
  },
  
  getUserRecords: async (userId: string, limitCount = 10): Promise<CoffeeRecord[]> => {
    const recordsRef = collection(db, 'coffeeRecords');
    const q = query(
      recordsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CoffeeRecord[];
  },
  
  uploadImage: async (userId: string, uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `coffeeImages/${userId}/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    
    return await getDownloadURL(storageRef);
  },
};

// コーヒー辞典関連API
export const dictionaryAPI = {
  getEntries: async (userId: string): Promise<DictionaryEntry[]> => {
    const entriesRef = collection(db, 'dictionaryEntries');
    const q = query(
      entriesRef,
      where('userId', '==', userId),
      orderBy('masteryLevel', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DictionaryEntry[];
  },
  
  updateEntry: async (entryId: string, data: Partial<DictionaryEntry>): Promise<void> => {
    const entryRef = doc(db, 'dictionaryEntries', entryId);
    await updateDoc(entryRef, data);
  },
};

// AI言語化関連API
export const aiAPI = {
  generateLanguage: async (
    responses: {
      body?: 'light' | 'medium' | 'heavy';
      flavor?: string[];
      aftertaste?: 'short' | 'medium' | 'long';
    }
  ): Promise<AILanguageResponse> => {
    const generateLanguageFn = httpsCallable<
      { responses: typeof responses },
      AILanguageResponse
    >(functions, 'generateCoffeeLanguage');
    
    const result = await generateLanguageFn({ responses });
    return result.data;
  },
};