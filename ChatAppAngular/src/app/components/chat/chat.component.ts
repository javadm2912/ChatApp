import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { MessagesComponent } from '../messages/messages.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [ChatInputComponent, MessagesComponent, ContactsComponent],
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(
    public chatService: ChatService,
    private modalService: NgbModal
  ) {}
  @ViewChild('messageBox') private messageBox!: MessagesComponent;
  toUser: string | null = null;

  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }
  ngOnInit(): void {
    this.chatService.createChatConnection();
  }
  @Output() closeChatEmmitter = new EventEmitter();

  backToHome() {
    this.closeChatEmmitter.emit();
  }

  sendMessage(message: string) {
    this.chatService.sendPrivateMessage(this.toUser!, message);
    setTimeout(() => {
      this.messageBox.scrollToBottom();
    },150)
  }

  openContacts() {
    const modalRef = this.modalService.open(ContactsComponent);
  }

  openUserChat(user: User | null) {
    console.log(user);
    
    if(user){
      this.toUser = user.id;
      this.chatService.getPrivateChats(this.toUser).subscribe((messages) => {
        this.chatService.privateMessages = messages;
      })
    }
  }
}
