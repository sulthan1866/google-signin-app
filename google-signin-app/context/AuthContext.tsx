import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser:React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(()=>{
    setCurrentUser(JSON.parse(localStorage.getItem('user')!))
  },[])

    useEffect(() => {

        const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => unsub();
  }, []);
  

  return (
    <AuthContext.Provider value={{ currentUser,setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};