import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordStrengthDirective } from '../../validations/password-strength.directive';
import { PasswordMatchDirective } from '../../validations/password-match.directive';
import { DismissableAlertComponent } from "../../shared/dismissable-alert/dismissable-alert.component";
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, PasswordStrengthDirective, PasswordMatchDirective, DismissableAlertComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  hideAlert:boolean = true;
  message: string = "";
  success = false;

  constructor(private userService: UserService, private router: Router){}

  recieveDismissEvent(hideAlert: boolean){
    this.hideAlert = !hideAlert;
  }

  setDialogParams(message: string, success: boolean){
    this.hideAlert = false;
    this.message = message;
    this.success = success;
  }

  onSubmit(form: NgForm){
    if(form.valid){
      this.userService.register(form.value).subscribe({
        next: (val) =>{
          form.reset();
          this.setDialogParams(val.message + ", Redirecting to login Page...", true);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3500)
        },
        error: (error) =>{
          if(error.status = '409'){
            this.setDialogParams("You are already registered, Redirecting to login page...", false);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3500)
          }else{
            this.setDialogParams("Something went wrong, please try Again Later...", false);
            setTimeout(() => {
              this.hideAlert = true;
            }, 3500)
          }
        }
      })
    }
  }
}
