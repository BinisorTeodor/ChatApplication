import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../interfaces/group.interface';
import { ApiService } from '../../../services/api.service';
import { user } from '../../../interfaces/user.interface';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { GroupMessage } from '../../../interfaces/group_message.interface';
import { MessageCardComponent } from "../message-card/message-card.component";
import { WebSocketService } from '../../../services/web-socket.service';
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GroupDetailsDialogComponent } from '../group-details-dialog/group-details-dialog.component';

@Component({
  selector: 'app-group',
  imports: [AngularmaterialModule, CommonModule, FormsModule, MessageCardComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent {

  @ViewChild('bottom') bottom!: ElementRef;
  stompClient: any = null;

  searchGroup: string = '';

  searchGroup$ = new BehaviorSubject<string>('');

  clickedGroup!: Group | null;

  filteredGroups$ = new Observable<Group[]>;

  groupMessages: GroupMessage[] = [];

  newMessage = '';

  user: user = JSON.parse(localStorage.getItem('user') || "") as user;


  constructor(protected apiService: ApiService, private webSocketService: WebSocketService, private dialog: MatDialog) { }

  ngOnInit() {
    this.initialValues();
  }

  initialValues() {

    this.apiService.fetchGroupsById(this.user.id);
    this.webSocketService.groupMessages$.subscribe((msg) => {
      console.log(msg);
      setTimeout(() => this.scrollToBottom('smooth'), 50);
    })


    this.filteredGroups$ = combineLatest([
      this.apiService.groups$,
      this.searchGroup$.pipe(startWith(''))
    ]).pipe(
      map(([groups, search]) =>
        groups.filter(group =>
          group.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }

  sendPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log("Suntem aici");
    
  }

  filterGroup(value: string) {
    this.searchGroup = value;
    this.searchGroup$.next(value);

  }

  onRemoveSearch() {
    this.searchGroup = '';
    this.searchGroup$.next('');
  }


  onSendMessage(content: string) {

    const timestamp = Date.now();

    console.log("receiverId: " + this.clickedGroup!.id);

    let message: GroupMessage = {
      "senderId": this.user.id,
      "receiverId": this.clickedGroup!.id,
      "content": content,
      "timestamp": timestamp
    }

    this.webSocketService.sendMessageToGroup(message);
    this.newMessage = "";
    setTimeout(() => this.scrollToBottom('smooth'), 10);
  }

  onGroupClick(group: Group) {

    this.apiService.getSelectedGroup(group.id);

    this.webSocketService.connectToGroup(group);
    this.clickedGroup = group;
    setTimeout(() => this.scrollToBottom('instant'), 50);
  }

  scrollToBottom(behavior: string) {
    console.log("Elementul DE REFERINTA: " + this.bottom);
    if (this.bottom) {

      this.bottom.nativeElement.scrollIntoView({ behavior: `${behavior}` });
    }
  }


  onGroupDetails() {
    const dialogRef = this.dialog.open(GroupDetailsDialogComponent, {
      width: '500px',
      data: this.clickedGroup
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.fetchGroupsById(this.user.id);
        console.log("GRUPUL REZULTAT: " + JSON.stringify(result.group));
        this.clickedGroup = result.group as Group;

        console.log("NOUL GRUP ESTE: " + JSON.stringify(this.clickedGroup));
      }
    })

  }

  onGetOutOfGroup(groupId: number) {


    this.apiService.deleteGroupMember(groupId, this.apiService.connectedUser.id);

    this.clickedGroup = null;
  }


}
