import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private baseUrl: string = "http://localhost:8080/api/v1/editor";
}
