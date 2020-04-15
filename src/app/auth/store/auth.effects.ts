import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from '../store/auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';


export interface AuthResponseData {
  idToken: string;	// A Firebase Auth ID token for the newly created user.
  email: string;	// The email for the newly created user.
  refreshToken:	string;	// A Firebase Auth refresh token for the newly created user.
  expiresIn:	string;	// The number of seconds in which the ID token expires.
  localId:	string;	// The uid of the newly created user.
  registered?:	boolean;	// Whether the email is for an existing account.
}

const errorMessages = {
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
  EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
  USER_DISABLED: 'The user account has been disabled by an administrator.',
};

const handleAuthentication = (
  resData: AuthResponseData
) => {
  console.log('AuthEffects: handleAuthentication: resData: ', resData);
  const { email, localId, idToken, expiresIn} = resData;
  const expiryDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, localId, idToken, expiryDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthSuccess({
    email,
    localId,
    idToken,
    expiryDate
  });
};
const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  console.log('AuthService: signUp: catch errorRes: ', errorRes);
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthFail(errorMessage));
  }
  if (errorMessages[errorRes.error.error.message]) {
    errorMessage = errorMessages[errorRes.error.error.message];
  }
  return of(new AuthActions.AuthFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  urlPrefix = 'https://identitytoolkit.googleapis.com/v1/accounts';
  apiKey = environment.firebaseAPIKey;

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(`${this.urlPrefix}:signUp?key=${this.apiKey}`, {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(`${this.urlPrefix}:signInWithPassword?key=${this.apiKey}`, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
         tap(resData => {
           this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    }),

  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpiryDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpiryDate));
      if (loadedUser.token) {
        const expDuration = new Date(userData._tokenExpiryDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expDuration);
        return new AuthActions.AuthSuccess({
          email: loadedUser.email,
          localId: loadedUser.id,
          idToken: loadedUser.token,
          expiryDate: new Date(userData._tokenExpiryDate)
        });
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {}
}
