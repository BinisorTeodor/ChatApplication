import { Injectable } from '@angular/core';

import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { ApiService } from './api.service';
import { GroupMessage } from '../interfaces/group_message.interface';
import { Group } from '../interfaces/group.interface';
import { user } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';
import { BehaviorSubject, concatMap, last, map, tap } from 'rxjs';
import { notification } from '../interfaces/notification.interface';
import { messageDTO } from '../interfaces/messageDTO.interface';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  stompClient: any;

  user!: user;

  group!: Group;

  selectedFriend!: user;

  private userMessagesSubject = new BehaviorSubject<string>("");
  public userMessages$ = this.userMessagesSubject.asObservable();

  private userDeletedMessagesSubject = new BehaviorSubject<string>("");
  public userDeletedMessages$ = this.userDeletedMessagesSubject.asObservable();

  private groupMessagesSubject = new BehaviorSubject<string>("");
  public groupMessages$ = this.groupMessagesSubject.asObservable();

  private groupDeletedMessagesSubject = new BehaviorSubject<string>("");
  public groupDeletedMessages$ = this.groupDeletedMessagesSubject.asObservable();

  constructor(private apiService: ApiService) { }


  public connect(user: user) {


    //real-time changes in case them happen when you selected a group
    this.apiService.groups$.subscribe(groups => {

      if (this.group) {
        const selectedGroup = groups.find(group => group.id === this.group.id);
        if (!selectedGroup) {
          this.apiService.selectedGroupSubject.next(null);
        } else {
          this.apiService.getSelectedGroup(selectedGroup.id);
        }
      }
    }
    )

    //realtime changes in case them happen when you selected a friend

    this.apiService.friends$.subscribe(friends => {

      if (this.selectedFriend) {
        const selectedFriend = friends.find(friend => friend.id === this.selectedFriend.id);
        if (selectedFriend) {
          console.log("AM READUS MOFICARILE")
          this.apiService.getSelectedUser(selectedFriend.id);
        }
      }

    }
    )


    this.user = user;
    const ws = new SockJS("http://localhost:8080/ws?userId=" + user.id);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe(`/user/${user.id}/notificationOfFriendRequest`,
        () => {
          console.log("S_A MOFICAT CEVA!!!!!!!!!!!!!!!!!!!!")
          this.apiService.fetchFriends(user.id);
          this.apiService.fetchSentFriendRequests(user.id);
          this.apiService.fetchReceivedFriendRequests(user.id);
          this.apiService.fetchGroupsById(user.id);
          this.apiService.getNotifications(user.id);
        }
      )

      this.stompClient.subscribe(`/usersOnlineStatus`,
        () => {
          console.log("CINEVA S-A CONECTAT");
          this.apiService.fetchFriends(user.id);

        }
      )

      this.stompClient.subscribe(`/users/groupsStatus`,
        () => {
          console.log("CINEVA A MOFICAT UN GRUP");
          this.apiService.fetchGroupsById(user.id);
        }
      )

      this.stompClient.subscribe(`/user/${user.id}/notificationOfMessages`,
        () => {
          console.log("WEB SOCKET DE NOTIFICARI: ")
          this.apiService.getNotifications(user.id);
        }
      )

    })
  }

  public connectToUser(selectedFriend: user) {

    //loading the messages before
    this.apiService.fetchMessagesByUserId(this.user.id, selectedFriend.id);


    this.selectedFriend = selectedFriend;
    this.stompClient.subscribe(`/user/${this.user.id}/queue/messages`,
      (msg: any) => {
        const message: messageDTO = JSON.parse(msg.body);
        console.log(message);

        if (message.content === "(DELETEMESSAGE@)") {
          console.log("MESAJUL A FOST STERS");

          setTimeout(() => this.apiService.fetchMessagesByUserId(this.user.id, this.selectedFriend.id), 50);
          setTimeout(() => this.groupMessagesSubject.next("Sent message"), 100);
        }
        if (message.senderId === this.selectedFriend.id) {

          //in case of talking to selected user not to receive notifications
          this.apiService.selectedNotification$.subscribe(
            notification => {
              notification!.notification.has_new_messages = -1;

              this.apiService.updateMessageCounter(
                notification!.notification.id!,
                notification!.notification);
            }
          )

          this.apiService.fetchMessagesByUserId(this.user.id, this.selectedFriend.id);
          this.userMessagesSubject.next("Sent message");
        }
      }

    )


    //listening in case of delete message
    this.stompClient.subscribe(`/user/${this.selectedFriend.id}/queue/messages`,
      (msg: any) => {
        const message: Message = JSON.parse(msg.body);
        console.log(message);
        if (message.content === "(DELETEMESSAGE@)") {
          console.log("MESAJUL A FOST STERS");

          setTimeout(() => this.apiService.fetchMessagesByUserId(this.user.id, this.selectedFriend.id), 50);
          setTimeout(() => this.groupMessagesSubject.next("Sent message"), 100);
        }
      }
    )
  }

  public sendMessageToUser(message: Message) {
    if (this.stompClient && this.stompClient.connected) {


      const lastMessage = this.apiService.message[this.apiService.message.length - 1];

      const now = new Date();

      const dateMessage = {
        "sender": this.user,
        "receiver": this.selectedFriend,
        "content": "imadateseparator@" + now.toLocaleDateString('en-GB'),
        "timestamp": Date.now() - 1
      }

      let prev: any = null;
      let current: any = null;
      if (lastMessage) {
        prev = new Date(lastMessage.timestamp);
        current = new Date(message.timestamp);
      }


      if (prev && current && message.content !== "(DELETEMESSAGE@)") {
        if (prev.getFullYear() !== current.getFullYear() ||
          prev.getMonth() !== current.getMonth() ||
          prev.getDate() !== current.getDate()) {
          this.sendUserMessage(dateMessage);
        }
      }

      if (!lastMessage) {
        this.sendUserMessage(dateMessage);
      }

      this.sendUserMessage(message);
    } else {
      console.log("WebSocket not connected properly");
    }
  }

  private sendUserMessage(message: Message) {
    this.stompClient.send('/app/chat', {}, JSON.stringify(message));
    if (message.content !== "(DELETEMESSAGE@)") {
      this.apiService.message.push(message);
      this.apiService.messageSubject.next([...this.apiService.message]);
    }
  }

  public connectToGroup(selectedGroup: Group) {
    this.group = selectedGroup;
    this.apiService.fetchMessagesFromGroupById(selectedGroup.id);
    this.stompClient.subscribe(`/users/group/${selectedGroup.id}`,
      (msg: any) => {


        const message: GroupMessage = JSON.parse(msg.body);
        console.log(message);


        //added now as test
        //this.apiService.fetchGroupsById(this.user.id);

        if (message.content !== "(DELETEMESSAGE@)") {
          console.log("NU ESTE UN MESAJ DE STERS");
          this.apiService.fetchMessagesFromGroupById(this.group.id);
          this.groupMessagesSubject.next("Sent message");

        } else {

          //deleting a message
          console.log("MESAJUL A FOST STERS");

          setTimeout(() => this.apiService.fetchMessagesFromGroupById(this.group.id), 50);
          setTimeout(() => this.groupMessagesSubject.next("Sent message"), 100);
        }
      }
    )
  }

  public sendMessageToGroup(message: GroupMessage) {
    if (this.stompClient && this.stompClient.connected) {

      const lastMessage = this.apiService.groupMessages[this.apiService.groupMessages.length - 1];

      const now = new Date();

      const dateMessage: GroupMessage = {
        "senderName": this.user.fullName,
        "senderId": this.user.id,
        "receiverId": this.group.id,
        "content": "imadateseparator@" + now.toLocaleDateString('en-GB'),
        "timestamp": Date.now() - 1
      }

      let prev: any = null;
      let current: any = null;
      if (lastMessage) {
        prev = new Date(lastMessage.timestamp);
        current = new Date(message.timestamp);
      }
      if (prev && current && message.content !== "(DELETEMESSAGE@)") {
        if (prev.getFullYear() !== current.getFullYear() ||
          prev.getMonth() !== current.getMonth() ||
          prev.getDate() !== current.getDate()) {
          this.stompClient.send('/app/group', {}, JSON.stringify(dateMessage));
        }
      }
      if (!lastMessage) {
        this.stompClient.send('/app/group', {}, JSON.stringify(dateMessage));
      }
      setTimeout(() => {
        this.stompClient.send('/app/group', {}, JSON.stringify(message));
      }, 60);

    } else {
      console.log("WebSocket not connected properly");
    }
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
      this.apiService.updateOnlineStatus(this.user, false);
      console.log('🔌 Disconnected manually');
    }
  }
}
