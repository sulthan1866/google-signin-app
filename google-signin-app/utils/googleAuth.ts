import {  GoogleAuthProvider, signOut, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider) ;
    localStorage.setItem('user', JSON.stringify(result.user));
    return result.user;
  
};

export const signOutGoogle = async () => {
  localStorage.removeItem('user');
  await signOut(auth);
}