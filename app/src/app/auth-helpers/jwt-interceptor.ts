import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class JwtIncerceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.url === 'http://localhost:3000') {
            return next.handle(request);
        }
    }

}