
import { User, TrainingGoal } from '../types';
import { INITIAL_USER } from '../constants';

const USERS_KEY = 'fitdex_users';
const SESSION_KEY = 'fitdex_session';

// Interface interna para armazenar senha (apenas simulação local)
interface StoredUser extends User {
  password?: string;
}

export const authService = {
  // Carregar usuário da sessão atual
  getCurrentUser: (): User | null => {
    const sessionData = localStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  },

  // Login
  login: (email: string, password: string): { success: boolean; user?: User; message?: string } => {
    const usersJSON = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersJSON ? JSON.parse(usersJSON) : [];

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Remove a senha antes de salvar na sessão
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'E-mail ou senha inválidos.' };
  },

  // Registro
  register: (name: string, email: string, password: string): { success: boolean; user?: User; message?: string } => {
    const usersJSON = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersJSON ? JSON.parse(usersJSON) : [];

    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Este e-mail já está cadastrado.' };
    }

    // Cria novo usuário com base no template inicial
    const newUser: StoredUser = {
      ...INITIAL_USER,
      id: `u_${Date.now()}`,
      name,
      email,
      password,
      points: 0,
      level: 1,
      bio: 'Novo membro do FITDEX!',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, // Avatar gerado dinamicamente
      achievements: INITIAL_USER.achievements.map(a => ({ ...a, unlocked: false, progress: 0 })), // Reseta conquistas
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto-login após registro
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Atualizar dados do usuário atual no "banco de dados"
  updateUser: (updatedUser: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    const usersJSON = localStorage.getItem(USERS_KEY);
    if (usersJSON) {
      const users: StoredUser[] = JSON.parse(usersJSON);
      const index = users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        // Mantém a senha original
        users[index] = { ...users[index], ...updatedUser };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }
  }
};
