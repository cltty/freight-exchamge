import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtIncerceptor implements HttpInterceptor {
    constructor(private router: Router, private authService: AuthService) {}

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        console.log(">> handleAuthError >> err -> ", err);
        if (err.status === 401 || err.status === 403) {
            // don't redirect user if he is already on login page
            if (this.areCredentialsWrongError(err.error)) {
                this.authService.wrongLoginCredentials$.next();
                return throwError(err);
            }
            // JWT expired, redirect user to login page
            this.router.navigateByUrl(`/login`);
            return throwError(err);
        }
        return throwError(err);
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
          withCredentials: true
        });
        return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
    }

    private areCredentialsWrongError(errorMessage: string) {
        return errorMessage === 'Bad email address or password';
    }
}