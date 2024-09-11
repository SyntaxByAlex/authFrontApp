import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { publishFacade } from '@angular/compiler';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {

  private authService = inject(AuthService)

  public user = computed(() => this.authService.currentUser())

  public logout() {
    this.authService.logout()
  }


}
