import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import hljs from 'highlight.js';
import { QuillEditorComponent } from 'ngx-quill';
import { SessionService } from '../../service/session.service';
import { SessionDTO } from '../../dto/session-dto';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { EditorService } from '../../service/editor.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, QuillEditorComponent, NgFor, NgIf, NgClass, RouterLink],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit{

  sessionId: string = "";
  newMember: String = '';
  session: SessionDTO | undefined;
  message: string = "";
  messageSuccess = false;
  showMessage: boolean = false;
  loggedInUser: string | undefined;

  constructor(private route: ActivatedRoute, private sessionService: SessionService, public editorService: EditorService, private userService: UserService){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('id') || "";
    })

    this.loadSession();
    this.userService.getLoggedInUser().subscribe({
      next: (value) => this.loggedInUser = value,
      error: (err)=> console.log("ERROR LOGIN: " +err
      )
    })
    this.editorService.setSessionId(this.sessionId);
    this.editorService.connect();
  }

  ngOnDestroy(){
    this.editorService.disconnect();
    this.editorService.content = "";
  }

  onEditorCreated(quill: any) {
    quill.on('text-change', () => {
      this.editorService.publishChanges(); 
    });
  }

  addMember(){
    if(this.newMember.length != 0){
      this.sessionService.addMember(this.newMember, this.sessionId).subscribe({
        next: (val)=>{
          this.message = "User Added Successfully"
          this.messageSuccess = true;
          this.showMessage = true;
          this.loadSession();
          this.hideMessage();
          this.newMember = '';
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
      next: value => {
        this.editorService.content = value.content;
        this.session = value;
      },
      error: err => console.log("ERROR: " + err.message)
    })
  }

  hideMessage(){
    setTimeout(() =>{
      this.showMessage = false
    }, 3000)
  }

  disconnect(){ this.editorService.disconnect()}

  modules = {
    syntax: {hljs}
  };


}


