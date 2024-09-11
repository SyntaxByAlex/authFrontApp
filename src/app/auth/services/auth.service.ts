import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl
  private http = inject(HttpClient);
  constructor() { }

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //Exponemos a solo los de lectura
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());


  public login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(
        ({ user, token }) => {
          localStorage.setItem('token', token);
          this._currentUser.set(user);
          this._authStatus.set(AuthStatus.authenticated);
        }),
      map(() => true),
      catchError(err => {
        return throwError(() => err.error.message);
      })
    );
  }
}
