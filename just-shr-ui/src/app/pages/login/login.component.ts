import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { DismissableAlertComponent } from '../../shared/dismissable-alert/dismissable-alert.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, DismissableAlertComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hideAlert:boolean = true;
  message: string = "";
  success = false;


  constructor(private userService: UserService, private router: Router){}

  setDialogParams(message: string, success: boolean){
    this.hideAlert = false;
    this.message = message;
    this.success = success;
  }
  
  onSubmit(form: NgForm){
    if(form.valid){
      this.userService.login(form.value).subscribe({
        next: (val)=>{
          this.router.navigate(['/dashboard'])
        },
        error: (error)=> {
          if(error.status == '404')
            this.setDialogParams("Wrong username or password", false);
          else
            this.setDialogParams("Something went wrong, Please try again later", false);

          setTimeout(() => {
            this.hideAlert = true;
          }, 3500)
            
        }
      })
    }
  }
  recieveDismissEvent(hideAlert: boolean){
    this.hideAlert = !hideAlert;
  }
}
