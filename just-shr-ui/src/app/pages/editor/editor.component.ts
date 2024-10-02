import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import hljs from 'highlight.js';
import { QuillEditorComponent } from 'ngx-quill';
import { SessionService } from '../../service/session.service';
import { SessionDTO } from '../../dto/session-dto';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, QuillEditorComponent, NgFor, NgIf, NgClass],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit{

  sessionId: string = "";
  session: SessionDTO | undefined;
  message: string = "";
  messageSuccess = false;
  showMessage: boolean = false;

  constructor(private route: ActivatedRoute, private sessionService: SessionService){}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id') || "";
    })

    this.loadSession();
  }

  addMember(email: string){
    if(email.length != 0){
      this.sessionService.addMember(email, this.sessionId).subscribe({
        next: (val)=>{
          this.message = "User Added Successfully"
          this.messageSuccess = true;
          this.showMessage = true;
          this.loadSession();
          this.hideMessage();

        },
        error: err=>{
          if(err.status == '409')
            this.message = "User is already a member";
          else if(err.status == '401')
            this.message = "User with specified email not found";
          else
            this.message = "Something went wrong, try again later";
          this.messageSuccess = false;
          this.showMessage = true;
          this.hideMessage();
        }
      })
    }
  }

  loadSession(){
    this.sessionService.getSession(this.sessionId).subscribe({
      next: value => this.session = value,
      error: err => console.log("ERROR: " + err.message)
    })
  }
  hideMessage(){
    setTimeout(() =>{
      this.showMessage = false
    }, 3000)
  }

  modules = {
    syntax: {hljs}
  };


}
