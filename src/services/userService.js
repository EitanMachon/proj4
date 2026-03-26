const USERS_KEY = 'visual_editor_users';

export const userService = {
  // הרשמה של משתמש חדש
  register: (username, password) => {
    const users = userService.getAllUsers();
    if (users.find(u => u.username === username)) return { success: false, msg: 'משתמש כבר קיים' };
    
    const newUser = { username, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  },

  // התחברות
  login: (username, password) => {
    const users = userService.getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) return { success: true, user };
    return { success: false, msg: 'שם משתמש או סיסמה שגויים' };
  },

  getAllUsers: () => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }
};