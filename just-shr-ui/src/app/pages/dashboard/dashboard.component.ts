import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../model/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SessionService } from '../../service/session.service';
import { DismissableAlertComponent } from "../../shared/dismissable-alert/dismissable-alert.component";
import { SessionRequest } from '../../dto/session-request';
import { SessionDTO } from '../../dto/session-dto';
import { UserService } from '../../service/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FontAwesomeModule, NgIf, NgFor, FormsModule, NgClass, DismissableAlertComponent, NgFor, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  //icons
  edit = faPenToSquare;
  delete = faTrashCan;
  

  //error Dialog
  hideAlert:boolean = true;
  message: string = "TEST MESSAGE";
  success = false;

  private searchSubject = new Subject<string>();
  searchQuery: string = "";
  users: User[] = [];
  sessionUsers: User[] = [];
  showDialog : boolean = false;
  hideUpdateDialog : boolean = true;
  hideDeleteDialog: boolean = true;
  sessions: SessionDTO[] = [];
  loggedInUser: string = "";
  index: number | undefined;
  sessionId: string = "";
  session: SessionRequest = {
    description: "",
    members: []
  }

  constructor(private sessionService: SessionService, private userService: UserService){
    userService.getLoggedInUser().subscribe({
      next: value => {this.loggedInUser = value; console.log("LoggedInuser: " + value)},
      error: (err) => console.log("GET LOGGED IN USER: " + err)
    })

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if(value.trim() != ''){
        this.sessionService.fetchUsers(value).subscribe({
          next: val => this.users = val,
          error: err => this.users = []//I'm doing this very tired.. don't judge me, PLEASE!!!!!!
        })
      }else{
        this.users = [];
      }
    })
  }

  ngOnInit(){
    this.loadUserSessions();
  }

  addUser(newUser:User){
    const userExists = this.sessionUsers.some(user => user.email === newUser.email);
    if(!userExists){
      this.sessionUsers.push(newUser);
    }
   
  }

  removeUser(sessionUser: User){
    this.sessionUsers = this.sessionUsers.filter( user => user.email !== sessionUser.email);
  }

  onUserInputChange(value: string){
    this.searchSubject.next(value);
  }

  showUpdateDescription(session: SessionDTO, index: number, form: NgForm){
   this.hideUpdateDialog = false;
   form.controls['description'].setValue(session.description);
   this.index = index;
   this.sessionId = session.sessionId;
  }

  showDeleteDialog(sessionId: string, index: number){
    this.hideDeleteDialog = false;
    this.sessionId = sessionId;
    this.index = index;
  }

  deleteSession(){
    this.sessionService.deleteSession(this.sessionId).subscribe({
      next: () => { 
        this.hideDeleteDialog = true
        this.sessions.filter(session => session.sessionId != this.sessionId);
      },
      error: (err) => console.log("ERR DELETE: " + err)
    })
  }

  updateDescription(form: NgForm){
    const newDescr = form.controls['description'].value;
    const oldDescr = this.sessions[this.index!].description;

    if(newDescr != oldDescr){
      
      this.sessionService.updateDescription(this.sessionId, newDescr).subscribe({
        next: () => {
          this.hideUpdateDialog = true
          this.sessions[this.index!].description = newDescr;
        },
        error: (err) => console.log("Update: " + err)
      })
    }else{
      this.hideUpdateDialog = true;
    }
  }

  createSession(form: NgForm){
    if(form.valid){
      this.session.description = form.controls['description'].value;
      this.session.members = this.sessionUsers.map(user => user.email);
      
      this.sessionService.save(this.session).subscribe({
        next: () => {
          form.reset();
          this.sessionUsers = [],
          this.users = []
          this.showDialog= false;
          this.loadUserSessions();
        },
        error: (err)=>{
          this.setDialogParams("Something went wrong please try again later...", false)
          setTimeout(() => {
            this.hideAlert = true;
          }, 3500)
          console.log("EYES HERE!: " + err.message)
        }
      });
     
    }
  }

  loadUserSessions(){
    this.sessionService.getSessions().subscribe({
      next: val => {
        this.sessions = val;
      },
      error: (err) => {
        console.log("REMEMBER TO IMPLEMENT SOMETHING ON THE UI FOR THIS ERR")
      }
    })
  }

  setDialogParams(message: string, success: boolean){
    this.hideAlert = false;
    this.message = message;
    this.success = success;
  }

  recieveDismissEvent(hideAlert: boolean){
    this.hideAlert = !hideAlert;
    console.log("WHATTTTTYA")
  }
}
