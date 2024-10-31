import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionRequest } from '../dto/session-request';
import { SessionDTO } from '../dto/session-dto';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private baseUrl: string = "http://localhost:8080/api/v1/session";

  constructor(private http: HttpClient){}

  getSessions(): Observable<SessionDTO[]>{
    return this.http.get<SessionDTO[]>(this.baseUrl);
  }

  getSession(id: String): Observable<SessionDTO>{
    return this.http.get<SessionDTO>(`${this.baseUrl}/${id}`);
  }

  save(session: SessionRequest): Observable<any>{
    return this.http.post(this.baseUrl, session);
  }
  addMember(email: String, sessionId: string): Observable<any>{
    return this.http.post(`${this.baseUrl}/addMember`, {email, sessionId})
  }

  fetchUsers(searchQuery: string): Observable<any>{
    const params = new HttpParams().set('searchQuery', searchQuery)
    return this.http.get(`${this.baseUrl}/search`, {params});
  }

  updateDescription(sessionId: string, description: string): Observable<any>{
    return this.http.put(`${this.baseUrl}/updateDescription/${sessionId}`, description)
  }

  deleteSession(id: string): Observable<any>{
    return this.http.delete(`${this.baseUrl}/${id}`)
  }

}
