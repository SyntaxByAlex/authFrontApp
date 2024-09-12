import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthStatus, LoginResponse, User } from '../interfaces';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { CheckTokenResponse } from '../interfaces/check-token-response.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl
  private http = inject(HttpClient);
  constructor() {
    this.verifyToken().subscribe();
  }

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //Exponemos a solo los de lectura
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  private setAuthentication(user: User, token: string): boolean {
    localStorage.setItem('token', token);
    this._authStatus.set(AuthStatus.authenticated);
    this._currentUser.set(user);

    return true;
  }


  public login(email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };



    return this.http.post<LoginResponse>(url, body).pipe(
      tap(
        ({ user, token }) => this.setAuthentication(user, token)),
      map(() => true),
      catchError(err => {
        return throwError(() => err.error.message);
      })
    );
  }

  public verifyToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/checktoken`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout()
    };

    const headders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CheckTokenResponse>(url, { headers: headders }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)
      ),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        this._currentUser.set(null);
        return of(false)
      })
    );
  }


  public register(name: string, email: string, password: string): Observable<boolean> {

    const url = `${this.baseUrl}/auth/register`;
    const body = { name, email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(err => {
        return throwError(() => err.error.message);
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._currentUser.set(null);
  }


}
