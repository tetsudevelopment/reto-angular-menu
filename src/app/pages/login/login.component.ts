import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, NgClass],
})
export default class LoginComponent {
  loginForm = signal(new FormGroup({
    email: new FormBuilder().control('', [Validators.required, Validators.email]),
    password: new FormBuilder().control('', [Validators.required]),
  }));

  email = computed(() => this.loginForm().get('email'));
  password = computed(() => this.loginForm().get('password'));

  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}


  async onSubmit() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    if (this.loginForm()?.valid) {
      const email = this.loginForm()?.get('email')?.value || '';
      const password = this.loginForm()?.get('password')?.value || '';
      try {
        const result = await this.authService.login(email, password);
        if (result) {
          this.router.navigate(['/']);
        } else {
          this.showLoginError();
        }
      } catch (error) {
        console.error(error);
        this.showError();
      }
    }
    this.isLoading.set(false);
  }

  showLoginError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Email y/o contraseña incorrectos.',
      confirmButtonColor: '#D64541',
    });
  }

  showError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al iniciar sesión.',
      confirmButtonColor: '#D64541',
    });
  }
}
