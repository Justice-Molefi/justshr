import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { UserService } from './user.service';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private baseUrl: string = "http://localhost:8080/api/v1/editor";
  private wsUrl: string = "ws://localhost:8080/session-content";
  private sessionId = "";

  content: string = "";

  constructor(private userService: UserService, private router: Router){}

  client = new Client({
    brokerURL: this.wsUrl,
    onConnect: ()=>{
      if(this.sessionId != ""){
        this.client.subscribe('/topic/editor-content/' + this.sessionId , content => {
          this.content = content.body;
        });
      }
    },
    onStompError(frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
    onWebSocketError: error=>{
      console.error('Error with websocket', error);
    }
  });

  connect(){
    this.userService.verifyToken().subscribe({
      next: () => this.client.activate(),
      error: () => this.router.navigate(['/login'])

    })
  }

  disconnect() {
    this.client.deactivate();
    console.log("Disconnected");
  }

  publishChanges(){
    const sessionId = this.sessionId;
    const content = this.content;
    const message = JSON.stringify({content, sessionId});
    this.client.publish({destination: '/app/editor-content', body: message});
  }

  setSessionId(id: string){
    this.sessionId = id;
  }

}
