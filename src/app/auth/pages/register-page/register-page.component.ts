import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', [Validators.required, Validators.maxLength(100)]]
  });

  public register(): void {
    const { email, password, name } = this.registerForm.value;

    if (email == null || password == null || name == null) {
      return;
    }
    
    this.authService.register(name, email, password).subscribe();
  }

}
