import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const registerWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth,email,password);
  localStorage.setItem('user', JSON.stringify(result.user));
    return result.user;};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  localStorage.setItem('user', JSON.stringify(result.user));
  return result.user;
};
export const logout = async () => {
  localStorage.removeItem('user');
  await signOut(auth);
};