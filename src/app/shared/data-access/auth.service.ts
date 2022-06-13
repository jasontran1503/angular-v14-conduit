import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, ReplaySubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserResponse } from './app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private _user$ = new BehaviorSubject<User | null>(null);
  private _isAuthenticated$ = new ReplaySubject<boolean>(1);

  getCurrentUser() {
    return this.http.get<UserResponse>(this.apiUrl + 'user').pipe(
      map((res) => res.user),
      tap((user) => {
        this.setUser(user);
        this.setIsAuthenticated(true);
      })
    );
  }

  setUser(user: User | null) {
    if (user && !user.image) {
      user.image = 'https://api.realworld.io/images/smiley-cyrus.jpeg';
      this._user$.next(user);
    }
  }

  setIsAuthenticated(isAuthenticated: boolean) {
    this._isAuthenticated$.next(isAuthenticated);
  }

  get isAuthenticated$() {
    return this._isAuthenticated$.asObservable();
  }

  get isAuthenticated() {
    let result = false;
    this.isAuthenticated$.subscribe((res) => (result = res));

    return result;
  }

  get currentUser$() {
    return this._user$.asObservable();
  }

  get currentUser() {
    return this._user$.getValue();
  }
}
