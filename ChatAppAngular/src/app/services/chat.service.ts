import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverAddresses } from '../../../environments/environment';
import { User } from '../models/user';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from './toast/toast.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from '../models/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private httpClient: HttpClient, private toastService : ToastService, private modalService: NgbModal) {}

  currentUserId : string = '';
  contacts : User[] = []
  messages : Message[] = []
  privateMessages : Message[] = []
  privateMessageToUser : string = '';
  private chatConnection?: HubConnection
  registerUser(user: User): Observable<any> {
    return this.httpClient
      .post(`${serverAddresses.apiUrl}${serverAddresses.apiVersion}${serverAddresses.registerUser}`, user, {
        responseType: 'text',
      }).pipe(catchError(this.handleError.bind(this)));
  }

  getPrivateChats(to: string): Observable<any> {
    return this.httpClient
      .get(`${serverAddresses.apiUrl}${serverAddresses.apiVersion}${serverAddresses.getPrivateChats}/${this.currentUserId}/${to}`).pipe(catchError(this.handleError.bind(this)));
  }


  createChatConnection(){
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${serverAddresses.apiUrl}${serverAddresses.hubConnection}`).build();
    
    this.chatConnection.start().catch(error => this.handleError(error));
    
    this.chatConnection.on('UserConnected', () =>{
      debugger
      this.addChatConnectionId();
    });
    
    this.chatConnection.on('OnlineUsers', (contacts : User[]) =>{
      this.contacts = [...contacts]
    });
    
    this.chatConnection.on('NewMessage', (newMessage : Message) =>{
      this.messages = [...this.messages, newMessage]
    });

    this.chatConnection.on('NewPrivateMessage', (newMessage : Message) =>{
      debugger
      if(newMessage.from == this.privateMessageToUser || newMessage.from == this.currentUserId){
        this.privateMessages = [...this.privateMessages, newMessage]
      }
      else{
        this.toastService.showSuccess(`پیام جدید از طرف ${newMessage.senderName}`)
      }
      // const modalRef = this.modalService.open(PrivateChatComponent);
      // modalRef.componentInstance.toUser = newMessage.from;
    });

    // this.chatConnection.on('NewPrivateMessage', (newMessage : Message) =>{
    //   this.handleNewMessage(newMessage)
    //   // this.privateMessages = [...this.privateMessages, newMessage]
    // });

    this.chatConnection.on('ClosePrivateChat', () =>{
      // this.privateMessages = [];
      this.privateMessageToUser = '';
      // this.modalService.dismissAll();
    });
  }

  handleNewMessage(newMessage : Message){
    if(newMessage.from != this.privateMessageToUser){
      this.privateMessages = [...this.privateMessages, newMessage]
    }else{
      this.toastService.showSuccess(`New Message From ${newMessage.from}`);
    }
  }

  stopChatConnection(){
    this.chatConnection?.stop().catch(error => this.handleError(error));
  }

  async addChatConnectionId(){
    debugger
    return this.chatConnection?.invoke('AddUserConnectionId', this.currentUserId).catch(error => this.handleError(error));
  }

  async sendMessage(message : string){
    const sendingMessage : Message = {
      from: this.currentUserId,
      message: message
    }

    return this.chatConnection?.invoke('ReceiveMessage', sendingMessage).catch(error => this.handleError(error));
  }

  async sendPrivateMessage(to: string, message: string){
    const sendingMessage : Message = {
      from: this.currentUserId,
      message: message,
      to: to
    }
    if(to != this.privateMessageToUser){
      this.closePrivateChatMessage(this.privateMessageToUser);
      this.privateMessageToUser = to;
      return this.chatConnection?.invoke('SendPrivateMessage', sendingMessage)
      .then(() => {this.privateMessages = [...this.privateMessages, sendingMessage]})
      .catch(error => this.handleError(error));
    }else{
      return this.chatConnection?.invoke('ReceivePrivateMessage', sendingMessage)
      .catch(error => this.handleError(error));
    }
  }

  async closePrivateChatMessage(otherUser : string){
    if(otherUser != '')
      return this.chatConnection?.invoke('RemovePrivateChat', this.currentUserId, otherUser).catch(error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error) {
      this.toastService.showDanger(error.error);
    }
    return throwError(() => new Error(error.message));
  }
}
