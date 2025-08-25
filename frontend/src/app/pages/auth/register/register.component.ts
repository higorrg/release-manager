import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  template: `<div class="register-container" style="min-height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="register-card" style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 450px; max-width: 90vw;">
      <div class="register-header" style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px; font-size: 28px;">🚀 Release Manager</h1>
        <p style="color: #666; font-size: 16px;">Criar nova conta no sistema</p>
      </div>

      <div *ngIf="errorMessage" style="margin-bottom: 20px; padding: 12px; background: #ffe6e6; color: #d63031; border-radius: 6px; font-size: 14px;">
        ⚠️ {{ errorMessage }}
      </div>

      <div *ngIf="successMessage" style="margin-bottom: 20px; padding: 12px; background: #e6ffe6; color: #00b894; border-radius: 6px; font-size: 14px;">
        ✅ {{ successMessage }}
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
        <div class="form-group" style="margin-bottom: 20px;">
          <label for="name" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">👤 Nome Completo:</label>
          <input 
            id="name" 
            type="text" 
            formControlName="name" 
            placeholder="João Silva"
            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
            [style.border-color]="isFieldInvalid('name') ? '#ff4757' : '#ddd'">
          <div *ngIf="isFieldInvalid('name')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
            {{ getFieldError('name') }}
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label for="email" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">📧 Email (@empresa.com.br):</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email" 
            placeholder="joao.silva@empresa.com.br"
            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
            [style.border-color]="isFieldInvalid('email') ? '#ff4757' : '#ddd'">
          <div *ngIf="isFieldInvalid('email')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
            {{ getFieldError('email') }}
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 20px;">
          <label for="password" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">🔑 Senha (mín. 16 caracteres):</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password" 
            placeholder="Digite uma senha segura..."
            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
            [style.border-color]="isFieldInvalid('password') ? '#ff4757' : '#ddd'">
          <div *ngIf="isFieldInvalid('password')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
            {{ getFieldError('password') }}
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 30px;">
          <label for="confirmPassword" style="display: block; margin-bottom: 8px; font-weight: 500; color: #555;">🔐 Confirmar Senha:</label>
          <input 
            id="confirmPassword" 
            type="password" 
            formControlName="confirmPassword" 
            placeholder="Digite a senha novamente..."
            style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
            [style.border-color]="isFieldInvalid('confirmPassword') ? '#ff4757' : '#ddd'">
          <div *ngIf="isFieldInvalid('confirmPassword')" style="color: #ff4757; font-size: 12px; margin-top: 4px;">
            {{ getFieldError('confirmPassword') }}
          </div>
        </div>

        <button type="submit" 
                [disabled]="registerForm.invalid || isLoading"
                style="width: 100%; padding: 16px; background: #52c41a; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.3s; margin-bottom: 20px;"
                [style.background]="registerForm.invalid || isLoading ? '#ccc' : '#52c41a'"
                [style.cursor]="registerForm.invalid || isLoading ? 'not-allowed' : 'pointer'">
          <span *ngIf="!isLoading">👤 Criar Conta</span>
          <span *ngIf="isLoading">⏳ Criando conta...</span>
        </button>
      </form>

      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #666; font-size: 14px;">Já tem uma conta?</p>
        <a routerLink="/login" style="color: #667eea; text-decoration: none; font-weight: 500;">
          🔑 Fazer Login
        </a>
      </div>

      <div class="info-section" style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
        <h4 style="color: #666; font-size: 14px; margin-bottom: 15px;">📋 Requisitos da Senha</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; font-size: 12px; color: #666; text-align: left;">
          <p style="margin: 2px 0;">• Mínimo de 16 caracteres</p>
          <p style="margin: 2px 0;">• Email deve terminar com @empresa.com.br</p>
          <p style="margin: 2px 0;">• Senha e confirmação devem ser iguais</p>
        </div>
      </div>
    </div>
  </div>`
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, this.empresaEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(16)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private empresaEmailValidator(control: any) {
    const email = control.value;
    if (email && !email.endsWith('@empresa.com.br')) {
      return { empresaEmail: true };
    }
    return null;
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const userData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Conta criada com sucesso! Redirecionando para login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} é obrigatório`;
      }
      if (field.errors['email']) {
        return 'Digite um email válido';
      }
      if (field.errors['empresaEmail']) {
        return 'Email deve terminar com @empresa.com.br';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${minLength} caracteres`;
      }
      if (field.errors['passwordMismatch']) {
        return 'As senhas não coincidem';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      email: 'Email',
      password: 'Senha',
      confirmPassword: 'Confirmação de senha'
    };
    return labels[fieldName] || fieldName;
  }
}