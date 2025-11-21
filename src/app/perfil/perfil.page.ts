import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton,
  IonButtons, IonBackButton, IonTabBar, IonTabButton, IonIcon
} from '@ionic/angular/standalone';

import { RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    IonTabBar,
    IonTabButton,
    IonIcon,
    RouterModule
  ],
})
export class PerfilPage {

  showRegister = false;

  errorMessage = '';
  userData: any = null;

  // LOGIN
  email = '';
  password = '';

  // REGISTRO
  regName = '';       // <-- NOVO
  regEmail = '';
  regPassword = '';
  regConfirmPassword = '';

  constructor(private auth: AuthService, private fs: FirestoreService) {

    // Quando usuário muda (login/logout), buscamos os dados no Firestore
    this.auth.user$.subscribe(async user => {
      if (user) {
        const dados = await this.fs.getUserData(user.uid);
        this.userData = { uid: user.uid, email: user.email, ...dados };
      } else {
        this.userData = null;
      }
    });
  }

  toggleMode(register: boolean) {
    this.showRegister = register;
    this.errorMessage = '';
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha e-mail e senha.';
      return;
    }

    this.auth.login(this.email, this.password)
      .then(() => this.errorMessage = '')
      .catch(err => {
        console.log("ERRO FIREBASE LOGIN:", err);
        this.errorMessage = this.getError(err);
      });
  }

  async createAccount() {
    if (!this.regName.trim()) {
      this.errorMessage = 'Digite seu nome.';
      return;
    }

    if (this.regPassword !== this.regConfirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    try {
      const cred = await this.auth.register(this.regEmail, this.regPassword);

      // Salvar dados no Firestore
      await this.fs.createUserData(cred.user.uid, {
        nome: this.regName,
        email: this.regEmail,
        criadoEm: new Date()
      });

      this.errorMessage = '';

    } catch (err: any) {
      console.log("ERRO FIREBASE REGISTER:", err);
      this.errorMessage = this.getError(err);
    }
  }

  logout() {
    this.auth.logout();
  }

  // Tradução de erros do Firebase
  getError(err: any): string {
    const code = err?.code || '';

    switch (code) {
      case 'auth/invalid-email':
        return 'E-mail inválido.';

      case 'auth/email-already-in-use':
        return 'E-mail já está cadastrado.';

      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';

      case 'auth/missing-password':
        return 'Digite uma senha.';

      case 'auth/missing-email':
        return 'Digite um e-mail.';

      case 'auth/user-not-found':
        return 'Usuário não encontrado.';

      case 'auth/wrong-password':
        return 'Senha incorreta.';

      default:
        return 'Erro inesperado (' + code + ')';
    }
  }
}
