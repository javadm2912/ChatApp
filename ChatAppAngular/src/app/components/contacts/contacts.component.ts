import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatComponent } from '../private-chat/private-chat.component';
import { User } from '../../models/user';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {

  constructor(
    private modalService: NgbModal,
    public chatService: ChatService
  ) {}
  @Input() users : User[] = [];
  @Output() selectedUserEmitter = new EventEmitter<User>();

  openPrivateChat(user: User) {
    const modalRef = this.modalService.open(PrivateChatComponent);
    modalRef.componentInstance.toUser = user.name;
  }

  selectUser(user: User) {
    this.selectedUserEmitter.emit(user)
  }
}
