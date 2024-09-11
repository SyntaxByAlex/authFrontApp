import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthChecking = computed<boolean>(() => {
    if (this.authService.authStatus() === 'checking') {
      return false
    }
    return true;
  })


  public authStatusChanged = effect(() => {
    switch (this.authService.authStatus()) {
      case 'checking':
        return
      case 'authenticated':
        this.router.navigateByUrl(localStorage.getItem('lastUrl') || '/dashboard');
        return
      case 'notAuthenticated':
        this.router.navigateByUrl('/auth/login');
        return
    }
  })

}
