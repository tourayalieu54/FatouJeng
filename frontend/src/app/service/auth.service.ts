import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {jwtDecode} from 'jwt-decode'
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService{

    private url = 'http://localhost:8080'
    private jwtKey = 'rohey';

    constructor(private http: HttpClient){}

    getToken(): string{
        return sessionStorage.getItem(this.jwtKey) || '';
    }

    saveToken(token: string): void{
        sessionStorage.setItem(this.jwtKey, token);
    }

    clearToken(): void{
        sessionStorage.removeItem(this.jwtKey)
    }

    isAuthenticated(): boolean{
        if(!this.getToken()){
            return false;
        }

        try {
            const decodedToken = jwtDecode(this.getToken() || '') as any;
            return decodedToken.exp > Date.now() / 1000;
        } catch (error) {
           console.error('Error decoding token:', error) 
           return false;
        }
    }

    signin(payload: any): Observable<any>{
        return this.http.post<any>(`${this.url}/login`, payload);
    }

    signup(payload: any): Observable<any>{
        return this.http.post<any>(`${this.url}/signup`, payload)
    }
    
}