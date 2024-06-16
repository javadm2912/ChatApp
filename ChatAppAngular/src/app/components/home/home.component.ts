import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatComponent } from "../chat/chat.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [ReactiveFormsModule, ChatComponent]
})
export class HomeComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  submitted = false;
  openChat = false;
  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService
  ) {}
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.userForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.minLength(3),
          Validators.required,
          Validators.maxLength(15),
        ],
      ],
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.userForm.valid) {
      this.chatService
        .registerUser(this.userForm.value).subscribe((response : any) => {
          if(response){
              debugger
              this.chatService.currentUserId = response;
              this.openChat = true;
              this.userForm.reset();
              this.submitted = false;
          }
        });
        
    }
  }

  closeChat(){
    this.openChat = false;
  }
}
