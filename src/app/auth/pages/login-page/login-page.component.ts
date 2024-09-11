import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public login(): void {

    const { email, password } = this.loginForm.value;
    if (email == null || password == null) return

    this.authService.login(email, password).subscribe({
      next: res => {
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
