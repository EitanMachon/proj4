export const storageService = {
  // שמירת מסמכים לפי משתמש ספציפי
  saveDocuments: (username, documents) => {
    localStorage.setItem(`docs_${username}`, JSON.stringify(documents));
  },

  getDocuments: (username) => {
    const data = localStorage.getItem(`docs_${username}`);
    return data ? JSON.parse(data) : [];
  },

  // שמירת "מצב אחרון" (איפה הוא עצר, צבע סמן וכו')
  saveUserState: (username, state) => {
    localStorage.setItem(`state_${username}`, JSON.stringify(state));
  },

  getUserState: (username) => {
    const data = localStorage.getItem(`state_${username}`);
    return data ? JSON.parse(data) : null;
  }
};