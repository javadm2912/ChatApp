import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent {
  @Input() messages: Message[] = [];
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  scrollToBottom(): void {
    try {
      if(this.chatContainer)
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

}
