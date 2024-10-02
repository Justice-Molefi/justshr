import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dismissable-alert',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dismissable-alert.component.html',
  styleUrl: './dismissable-alert.component.css'
})
export class DismissableAlertComponent {
  @Input() error?: boolean;
  @Input() success?: boolean;
  @Input() message?: string;
  @Output() dismissAlert = new EventEmitter<boolean>();
  

  showAlert: boolean = true;

  closeIcon = faCircleXmark;

  close(){
    this.dismissAlert.emit(true);
  }
}
