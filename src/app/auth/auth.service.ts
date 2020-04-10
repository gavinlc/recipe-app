import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;	// A Firebase Auth ID token for the newly created user.
  email: string;	// The email for the newly created user.
  refreshToken:	string;	// A Firebase Auth refresh token for the newly created user.
  expiresIn:	string;	// The number of seconds in which the ID token expires.
  localId:	string;	// The uid of the newly created user.
  registered?:	boolean;	// Whether the email is for an existing account.
}

const ErrorMessages = {
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
  EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
  USER_DISABLED: 'The user account has been disabled by an administrator.',
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  autoLogoutTimer: number;

  urlPrefix = 'https://identitytoolkit.googleapis.com/v1/accounts';
  apiKey = 'AIzaSyAXZSI6Bux7O-fY2T0x1_Z6ANJzfVSivH8';
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${this.urlPrefix}:signUp?key=${this.apiKey}`, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
  }

  logIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${this.urlPrefix}:signInWithPassword?key=${this.apiKey}`, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      }));
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpiryDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User( userData.email, userData.id, userData._token, new Date(userData._tokenExpiryDate) );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expDuration = new Date(userData._tokenExpiryDate).getTime() - new Date().getTime();
      this.autoLogout(expDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.autoLogoutTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    console.log('AuthService: signUp: catch errorRes: ', errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = ErrorMessages[errorRes.error.error.message];
    return throwError(errorMessage);
  }

  private handleAuth(email: string, localId: string, idToken: string, expiresIn: number) {
    const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, localId, idToken, expiryDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

}
