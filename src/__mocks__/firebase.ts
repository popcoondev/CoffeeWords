// Firebaseのモック
import { jest } from '@jest/globals';

// Firebaseのインスタンスをモック
export const initializeApp = jest.fn().mockReturnValue({
  app: jest.fn(),
});

// Authのモック
export const getAuth = jest.fn().mockReturnValue({
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
});

export const onAuthStateChanged = jest.fn(() => jest.fn());
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const updateProfile = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const sendEmailVerification = jest.fn();
export const EmailAuthProvider = {
  credential: jest.fn().mockReturnValue({})
};
export const reauthenticateWithCredential = jest.fn();
export const updateEmail = jest.fn();
export const updatePassword = jest.fn();
export const deleteUser = jest.fn();

// Firestoreのモック
export const getFirestore = jest.fn().mockReturnValue({
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: jest.fn().mockReturnValue({}),
      }),
      set: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    }),
    add: jest.fn().mockResolvedValue({
      id: 'mock-doc-id',
    }),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      docs: [],
      empty: true,
    }),
  }),
});

export const collection = jest.fn().mockReturnValue({});
export const doc = jest.fn().mockReturnValue({});
export const getDoc = jest.fn().mockResolvedValue({
  exists: jest.fn().mockReturnValue(true),
  data: jest.fn().mockReturnValue({}),
});
export const setDoc = jest.fn().mockResolvedValue({});
export const updateDoc = jest.fn().mockResolvedValue({});
export const deleteDoc = jest.fn().mockResolvedValue({});
export const addDoc = jest.fn().mockResolvedValue({ id: 'mock-doc-id' });
export const query = jest.fn().mockReturnValue({});
export const where = jest.fn().mockReturnValue({});
export const orderBy = jest.fn().mockReturnValue({});
export const limit = jest.fn().mockReturnValue({});
export const getDocs = jest.fn().mockResolvedValue({
  docs: [],
  empty: true,
});
export const onSnapshot = jest.fn(() => jest.fn());

// Storageのモック
export const getStorage = jest.fn().mockReturnValue({
  ref: jest.fn().mockReturnValue({
    put: jest.fn().mockResolvedValue({
      ref: {
        getDownloadURL: jest.fn().mockResolvedValue('https://example.com/image.jpg'),
      },
    }),
    delete: jest.fn().mockResolvedValue({}),
  }),
});

export const ref = jest.fn().mockReturnValue({});
export const uploadBytes = jest.fn().mockResolvedValue({
  ref: {},
});
export const getDownloadURL = jest.fn().mockResolvedValue('https://example.com/image.jpg');
export const deleteObject = jest.fn().mockResolvedValue({});