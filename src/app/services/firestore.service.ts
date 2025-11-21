import { Injectable } from '@angular/core';
import { 
  getFirestore, collection, addDoc, getDocs, 
  doc, getDoc, updateDoc, deleteDoc, setDoc 
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private db = getFirestore();

  // ---------- CRUD genérico ----------
  add(path: string, data: any) {
    return addDoc(collection(this.db, path), data);
  }

  async getAll(path: string) {
    const snap = await getDocs(collection(this.db, path));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  getById(path: string, id: string) {
    return getDoc(doc(this.db, path, id));
  }

  update(path: string, id: string, data: any) {
    return updateDoc(doc(this.db, path, id), data);
  }

  delete(path: string, id: string) {
    return deleteDoc(doc(this.db, path, id));
  }

  // ---------- 🔥 ESPECÍFICO PARA USUÁRIOS LOGIN/CADASTRO ----------

  /** Cria os dados do usuário em "users/{uid}" */
  createUserData(uid: string, data: any) {
    return setDoc(doc(this.db, 'users', uid), data);
  }

  /** Lê os dados do usuário em "users/{uid}" */
  async getUserData(uid: string) {
    const ref = doc(this.db, 'users', uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data();
  }
}
