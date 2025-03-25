// Firebase Firestoreのモック
export const getFirestore = jest.fn().mockReturnValue({});

export const collection = jest.fn().mockReturnValue({});
export const doc = jest.fn().mockReturnValue({});
export const getDoc = jest.fn().mockResolvedValue({
  exists: () => true,
  data: () => ({}),
  id: 'mock-doc-id',
});
export const setDoc = jest.fn().mockResolvedValue(undefined);
export const updateDoc = jest.fn().mockResolvedValue(undefined);
export const deleteDoc = jest.fn().mockResolvedValue(undefined);
export const addDoc = jest.fn().mockResolvedValue({ id: 'mock-doc-id' });
export const query = jest.fn().mockReturnValue({});
export const where = jest.fn().mockReturnValue({});
export const orderBy = jest.fn().mockReturnValue({});
export const limit = jest.fn().mockReturnValue({});
export const getDocs = jest.fn().mockResolvedValue({
  docs: [
    {
      id: 'mock-doc-id',
      data: () => ({}),
      exists: () => true,
    },
  ],
  empty: false,
});
export const onSnapshot = jest.fn((query, callback) => {
  callback({
    docs: [
      {
        id: 'mock-doc-id',
        data: () => ({}),
        exists: () => true,
      },
    ],
    empty: false,
  });
  return jest.fn();
});