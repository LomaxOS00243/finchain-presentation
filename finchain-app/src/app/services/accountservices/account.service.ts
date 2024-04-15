import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility } from '../../Utils/utility';
import { environment } from '../../environment/environment';
import { SessionStorage } from '../data/session.storage';
import { Router } from '@angular/router';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'

})
export class AccountService {
    private password = '';
    private recoveryPhrase = '';
    private loggedIn = new BehaviorSubject<boolean>(false);
    private authzUsername = new BehaviorSubject<string>('');

    constructor(private http: HttpClient, private util: Utility, private sS: SessionStorage, private router: Router) { }

    //registration of employee
    register(employeeId: string, name: string): Observable<any> {

        //generate password and phrase
        this.password = this.util.generatePassword();
        this.recoveryPhrase = this.util.generatePhrase();

        return this.http.post(environment.URL_API + 'register', {
            employeeId,
            name,
            password: this.password,
            recoveryPhrase: this.recoveryPhrase

        }, httpOptions);
    }

    //login of employee
    login(employeeId: string, password: string): Observable<any> {

        return this.http.post(environment.URL_API + 'login', {
            employeeId,
            password
        }, httpOptions);
    }

    setLoginStatus(isLoggedIn: boolean, sessionId?: string, authzName: string = ''): void {

        this.loggedIn.next(isLoggedIn);
        this.authzUsername.next(authzName);

        if (isLoggedIn && sessionId) {
            this.sS.saveToken(sessionId);
        }
    }

    isLoggedIn(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    getAuthzUsername(): Observable<string> {
        return this.authzUsername.asObservable();
    }

    logout(): void {
        this.loggedIn.next(false);
        this.router.navigate(['/api/login']);
        //return this.http.post(environment.URL_API + 'logout', {}, httpOptions);
    }

    //testing purposes
    getRecoveryPhrase(): String {
        return this.recoveryPhrase + " -- " + this.password;
    }


}