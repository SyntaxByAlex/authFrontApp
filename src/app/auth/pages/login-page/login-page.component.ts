import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public loginForm = this.fb.group({
    email: ['admin@admin.com', [Validators.required, Validators.email]],
    password: ['12345678', [Validators.required, Validators.minLength(6)]]
  });

  public login(): void {

    const { email, password } = this.loginForm.value;
    if (email == null || password == null) return

    this.authService.login(email, password).subscribe({
      next: res => {
        this.router.navigateByUrl('/dashboard');
        console.log(res);
      },
      error: err => {
        Swal.fire({
          position: "top-end",
          icon: 'error',
          title: err,
          showConfirmButton: false,
          timer: 1500
        });

      }
    });
  }

}
