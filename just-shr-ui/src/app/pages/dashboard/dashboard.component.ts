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
  showDialog = false;
  sessions: SessionDTO[] = [];
  loggedInUser: string = "";
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

  fetchData(val: String){
    console.log('Fecthing data: ' + val);
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
