import { Component, Input } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { user } from '../../../interfaces/user.interface';
import { ApiService } from '../../../services/api.service';
import { Message } from '../../../interfaces/message.interface';
import { concatMap } from 'rxjs';
import { WebSocketService } from '../../../services/web-socket.service';
import { Group } from '../../../interfaces/group.interface';
import { GroupMessage } from '../../../interfaces/group_message.interface';

@Component({
  selector: 'app-message-card',
  imports: [AngularmaterialModule],
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.scss'
})
export class MessageCardComponent {

  user: user = JSON.parse(localStorage.getItem('user') || "") as user;

  userMessages: Message[] = [];

  @Input() senderName?: string;
  @Input() content!: string;
  @Input() timestamp!: number;
  @Input() myMessage!: boolean;
  @Input() idOfMessage!: number;
  @Input() sender!: user;
  @Input() receiver?: user;
  @Input() group?: Group

  showMenu: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private apiService: ApiService, private webSocketService: WebSocketService) { }

  onDeleteButton() {
    console.log("Id of deleted mesage: " + this.idOfMessage);

    if (this.group) {

      let message: GroupMessage = {
        "senderId": this.user.id,
        "receiverId": this.group.id,
        "content": "(DELETEMESSAGE@)",
        "timestamp": Date.now()
      }

      const lastMessage: GroupMessage = this.apiService.groupMessages[this.apiService.groupMessages.length - 2];
      console.log(lastMessage);

      if (lastMessage && lastMessage.content.startsWith('imadateseparator@')) {
        this.apiService.deleteMessageById(lastMessage.id!);
        console.log("DELETED DATE SEPARATOR MESSAGE");
      }

      this.apiService.deleteMessageById(this.idOfMessage);
      this.webSocketService.sendMessageToGroup(message);
    }

    if (this.receiver) {

      let message: Message = {
        "sender": this.user,
        "receiver": this.receiver,
        "content": "(DELETEMESSAGE@)",
        "timestamp": Date.now()
      }


      const lastMessage: Message = this.apiService.message[this.apiService.message.length - 2];
      console.log(lastMessage);

      if (lastMessage && lastMessage.content.startsWith('imadateseparator@')) {
        this.apiService.deleteMessageById(lastMessage.id!);
        console.log("DELETED DATE SEPARATOR MESSAGE");
      }

      this.apiService.deleteMessageById(this.idOfMessage);
      this.webSocketService.sendMessageToUser(message);
    }


  }

  onMouseLeave() {
    if (!this.isMenuOpen) {
      this.showMenu = false;
    }
  }

}
