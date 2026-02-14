
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as firebaseAuth from 'firebase/auth';
import * as firestoreMod from 'firebase/firestore';
const { onAuthStateChanged } = firebaseAuth as any;
const { doc, getDoc } = firestoreMod as any;
import { auth, db } from '../firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  fbUser: any | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fbUser, setFbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user: any) => {
      setFbUser(user);
      setError(null);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
          } else {
            // Document doesn't exist but user is authenticated
            console.warn("Usuário autenticado mas sem perfil no Firestore.");
          }
        } catch (err: any) {
          console.error("Erro ao buscar perfil:", err);
          if (err.code === 'permission-denied') {
            setError("Acesso negado ou API do Firestore desativada no console do Firebase.");
          } else {
            setError("Erro de conexão com o banco de dados. Verifique seu console Firebase.");
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
  }, []);

  const logout = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ currentUser, fbUser, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
