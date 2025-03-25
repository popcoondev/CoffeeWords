// Firebase Authのモック
export const getAuth = jest.fn().mockReturnValue({
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  }),
});

export const onAuthStateChanged = jest.fn((auth, callback) => {
  callback(null);
  return jest.fn();
});
export const signInWithEmailAndPassword = jest.fn().mockResolvedValue({
  user: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
  },
});
export const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({
  user: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: '',
  },
});
export const signOut = jest.fn().mockResolvedValue(undefined);
export const updateProfile = jest.fn().mockResolvedValue(undefined);
export const sendPasswordResetEmail = jest.fn().mockResolvedValue(undefined);
export const sendEmailVerification = jest.fn().mockResolvedValue(undefined);
export const EmailAuthProvider = {
  credential: jest.fn().mockReturnValue({}),
};
export const reauthenticateWithCredential = jest.fn().mockResolvedValue(undefined);
export const updateEmail = jest.fn().mockResolvedValue(undefined);
export const updatePassword = jest.fn().mockResolvedValue(undefined);
export const deleteUser = jest.fn().mockResolvedValue(undefined);