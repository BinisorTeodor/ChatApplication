import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../interfaces/message.interface';
import { ApiService } from '../../../services/api.service';
import { user } from '../../../interfaces/user.interface';
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
import { MessageCardComponent } from '../message-card/message-card.component';
import { WebSocketService } from '../../../services/web-socket.service';
import { friendNotification } from '../../../interfaces/friendNotification.interface';
import { notification } from '../../../interfaces/notification.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { FriendDetailsDialogComponent } from '../friend-details-dialog/friend-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-friennds',
  imports: [AngularmaterialModule, CommonModule, FormsModule, AsyncPipe, MessageCardComponent],
  templateUrl: './friennds.component.html',
  styleUrl: './friennds.component.scss'
})
export class FrienndsComponent {

  @ViewChild('bottom') bottom!: ElementRef;


  selectedFriend!: user;
  selectedFriendNotification!: friendNotification;

  selectedFriendId: number = -1;


  clickedFriend: boolean = false;

  searchFriend: string = '';

  searchFriend$ = new BehaviorSubject<string>('');
  filteredFriends$!: Observable<user[]>;

  filteredFriendsNotification$!: Observable<friendNotification[]>;

  friends: user[] = [];
  messages: Message[] = [];

  copyOfFriends: user[] = this.friends;

  newMessage = '';

  user = JSON.parse(localStorage.getItem('user') || "") as user;
  stompClient: any = null;

  constructor(protected apiService: ApiService, protected webSocketService: WebSocketService, private dialog: MatDialog) { }

  ngOnInit() {
    this.intitialValues();

    this.webSocketService.userMessages$.subscribe((msg) => {
      console.log(msg);
      setTimeout(() => this.scrollToBottom('smooth'), 50);
    })






  }


  intitialValues() {
    this.apiService.fetchFriends(this.user.id);

    this.filteredFriends$ = combineLatest([
      this.apiService.friends$,
      this.searchFriend$.pipe(startWith(''))
    ]).pipe(
      map(([friends, search]) =>
        friends.filter(friend =>
          friend.fullName.toLowerCase().includes(search.toLowerCase())
        )
      )
    );


    this.filteredFriendsNotification$ = combineLatest([
      this.filteredFriends$,
      this.apiService.notifications$])
      .pipe(
        map(([friends, notifications]) =>
          friends.map((friend, i) => ({
            friend,
            notification: notifications[i]
          }))
        )
      );
  }


  onSendMessage(content: string) {

    const selectedFriend = JSON.parse(sessionStorage.getItem('selectedFriend') || "") as user;
    const timestamp = Date.now();

    let message: Message = {
      "sender": this.user,
      "receiver": selectedFriend,
      "content": content,
      "timestamp": timestamp
    }


    const notification: notification = this.apiService.notifications[this.apiService.friends.indexOf(this.selectedFriend)];

    console.log("UPDATING THE ID: " + notification.id);

    this.apiService.updateMessageCounter(notification.id!, notification);

    this.webSocketService.sendMessageToUser(message);

    this.newMessage = "";
    setTimeout(() => this.scrollToBottom('smooth'), 0);

  }

  sendPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // You can display or send the photo here
      alert(`Selected image: ${file.name}`);
    }
  }

  filterFriend(value: string) {
    this.searchFriend = value;
    this.searchFriend$.next(value);
  }

  onRemoveSearch() {
    this.searchFriend = '';
    this.searchFriend$.next('');
  }

  onFriendClick(friend: friendNotification) {

    //for realtime use
    this.apiService.selectedNotificationSubject.next(friend);
    this.apiService.selectedFriendSubject.next(friend.friend);
    //

    this.selectedFriendNotification = friend;
    this.selectedFriend = friend.friend;
    this.selectedFriendId = friend.friend.id;

    this.webSocketService.connectToUser(friend.friend);

    sessionStorage.setItem('selectedFriend', JSON.stringify(friend.friend));
    this.clickedFriend = true;
    setTimeout(() => this.scrollToBottom('instant'), 50);


    friend.notification.has_new_messages = -1;

    this.apiService.updateMessageCounter(friend.notification.id!, friend.notification);
  }

  scrollToBottom(behavior: string) {
    console.log("Elementul DE REFERINTA: " + this.bottom);
    if (this.bottom) {

      this.bottom.nativeElement.scrollIntoView({ behavior: `${behavior}` });
    }
  }

  onMessageClick(msg: Message) {
    console.log(msg.id);
  }


  onFriendProfile(friend: user) {
    this.dialog.open(FriendDetailsDialogComponent, {
      data: friend,
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms'
    });
  }
}

