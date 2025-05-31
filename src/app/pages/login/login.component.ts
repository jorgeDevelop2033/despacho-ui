import { Component, OnInit, NgZone } from '@angular/core';  // Import NgZone
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  mensaje: string | null = null;
  cargando = false;

  // 🔥 AÑADE NgZone AL CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone   // <-- Aquí es donde debes añadirlo
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.cargando = true;
      this.mensaje = null;

      const credenciales = {
        email: this.loginForm.value.email,
        passwordHash: this.loginForm.value.passwordHash
      };

      this.authService.login(credenciales).subscribe({
        next: (res) => {
          console.log('Token recibido:', res.token);
          localStorage.setItem('token', res.token);
          this.ngZone.run(() => {
            this.router.navigate(['/buscardespacho']);
          });
          this.cargando = false;
        },
        error: (err) => {
          if (err.error?.code) {
            this.mensaje = `${err.error.message} (Código: ${err.error.code})`;
          } else {
            this.mensaje = 'Error desconocido: ' + (err.error?.error ?? err.message);
          }
        }
      });
    } else {
      this.mensaje = 'Por favor completa todos los campos correctamente.';
    }
  }
}
