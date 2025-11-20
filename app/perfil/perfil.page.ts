import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
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
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
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
  ],
})
export class PerfilPage {
  email = '';
  password = '';
  // register fields
  showRegister = false;
  nome = '';
  cpf = '';
  anoNascimento: number | null = null;
  regEmail = '';
  regPassword = '';
  regConfirmPassword = '';
  errorMessage = '';

  constructor(private router: Router) {}

  login() {
    // Aqui você pode integrar com um serviço de autenticação.
    console.log('Tentativa de login', { email: this.email, password: this.password });
    // validação básica
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha e-mail e senha.';
      return;
    }
    this.errorMessage = '';
    // Para exemplo, redireciona para a página inicial após "login".
    this.router.navigate(['/index']);
  }

  toggleMode(register: boolean) {
    this.showRegister = register;
    this.errorMessage = '';
  }

  createAccount() {
    // validações simples
    if (!this.nome || !this.cpf || !this.anoNascimento || !this.regEmail || !this.regPassword || !this.regConfirmPassword) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.regPassword !== this.regConfirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    // validação básica do CPF (apenas tamanho) - você pode melhorar
    const cpfDigits = this.cpf.replace(/\D/g, '');
    if (cpfDigits.length < 11) {
      this.errorMessage = 'CPF inválido.';
      return;
    }

    // Simula criação de conta (substituir por chamada ao backend)
    console.log('Criando conta', {
      nome: this.nome,
      cpf: this.cpf,
      anoNascimento: this.anoNascimento,
      email: this.regEmail,
    });

    this.errorMessage = '';
    // após criar, redireciona para index (ou fazer login automático)
    this.router.navigate(['/index']);
  }
}
