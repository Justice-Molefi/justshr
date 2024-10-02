import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: String = "http://localhost:8080/api/v1/auth";

  constructor(private http: HttpClient){}

  register(user: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/login`, user, {withCredentials: true})
  }

  verifyToken(): Observable<any>{
    return this.http.get(`${this.baseUrl}/verify-token`, {withCredentials: true});
  }
  getLoggedInUser(): Observable<any>{
    return this.http.get(`${this.baseUrl}/loggedInUser`, {responseType: 'text'});
  }

}
