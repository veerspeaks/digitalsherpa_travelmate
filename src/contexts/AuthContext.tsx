import React, {createContext, useContext, useState, useEffect} from 'react';
import {User} from '@types';
import {storageService} from '@services/storageService';
import {STORAGE_KEYS} from '@utils/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const sessionUser = await storageService.getItem<User>(STORAGE_KEYS.USER);
      if (sessionUser) {
        setUser(sessionUser);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await storageService.getItem<User[]>(STORAGE_KEYS.SESSION) || [];
      const foundUser = users.find(
        u => u.email === email && u.password === password,
      );

      if (foundUser) {
        const {password: _, ...userWithoutPassword} = foundUser;
        setUser(userWithoutPassword);
        await storageService.setItem(STORAGE_KEYS.USER, userWithoutPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<boolean> => {
    try {
      const users = await storageService.getItem<User[]>(STORAGE_KEYS.SESSION) || [];
      
      if (users.some(u => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        password,
      };

      users.push(newUser);
      await storageService.setItem(STORAGE_KEYS.SESSION, users);

      const {password: _, ...userWithoutPassword} = newUser;
      setUser(userWithoutPassword);
      await storageService.setItem(STORAGE_KEYS.USER, userWithoutPassword);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const users = await storageService.getItem<User[]>(STORAGE_KEYS.SESSION) || [];
      const userIndex = users.findIndex(u => u.id === user.id);

      if (userIndex === -1) return false;

      const updatedUser = {...users[userIndex], ...profileData};
      users[userIndex] = updatedUser;
      await storageService.setItem(STORAGE_KEYS.SESSION, users);

      const {password: _, ...userWithoutPassword} = updatedUser;
      setUser(userWithoutPassword);
      await storageService.setItem(STORAGE_KEYS.USER, userWithoutPassword);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await storageService.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

