import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '../interfaces/user.interface';
import { Message } from '../interfaces/message.interface';
import { Group } from '../interfaces/group.interface';
import { friend_request } from '../interfaces/friend_requests.interface';
import { group_members } from '../interfaces/group_members.interface';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { friend_requestDTO } from '../interfaces/friend_requestsDTO.interface';
import { UpdateFriendRequestDTO } from '../interfaces/updateFriendRequestDTO.interface';
import { GroupMessage } from '../interfaces/group_message.interface';
import { notification } from '../interfaces/notification.interface';
import { friendNotification } from '../interfaces/friendNotification.interface';




@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_URL: string = 'http://localhost:8080/';

  connectedUser!: user;

  public connectedUserSubject = new BehaviorSubject<user | null>(null);
  connectedUser$ = this.connectedUserSubject.asObservable();

  users: user[] = [];
  groups: Group[] = [];
  friends: user[] = [];
  message: Message[] = [];
  groupMessages: GroupMessage[] = [];
  friend_requests: friend_request[] = [];
  group_members: group_members[] = [];
  notifications: notification[] = [];

  public sentRequestsSubject = new BehaviorSubject<friend_request[]>([]);
  sentRequests$ = this.sentRequestsSubject.asObservable();

  public receivedRequestsSubject = new BehaviorSubject<friend_request[]>([]);
  receivedRequests$ = this.receivedRequestsSubject.asObservable();

  public friendsSubject = new BehaviorSubject<user[]>([]);
  friends$ = this.friendsSubject.asObservable();

  public notificationSubject = new BehaviorSubject<notification[]>([]);
  public notifications$ = this.notificationSubject.asObservable();

  public messageSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messageSubject.asObservable();

  public groupMessageSubject = new BehaviorSubject<GroupMessage[]>([]);
  public groupMessages$ = this.groupMessageSubject.asObservable();


  public groupsSubject = new BehaviorSubject<Group[]>([]);
  groups$ = this.groupsSubject.asObservable();


  public groupMembersSubject = new BehaviorSubject<user[]>([]);
  public groupMembers$ = this.groupMembersSubject.asObservable();

  public selectedNotificationSubject = new BehaviorSubject<friendNotification | null>(null);
  selectedNotification$ = this.selectedNotificationSubject.asObservable();

  public selectedFriendSubject = new BehaviorSubject<user | null>(null);
  selectedFriend$ = this.selectedFriendSubject.asObservable();

  public selectedGroupSubject = new BehaviorSubject<Group | null>(null);
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  selectedGroup!:Group;

  constructor(private http: HttpClient) { }

  public fetchMainUser(userId: number) {
    this.http.get<user>(`${this.API_URL}user/by-id/${userId}`).subscribe({
      next: (user) => {
        console.log("MAIN USER:" + JSON.stringify(user));
        this.connectedUser = user;
        this.connectedUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }
    })
  }


  fetchUsers() {
    return this.http.get<user[]>(this.API_URL + "users").pipe(
      catchError((error) => {
        console.log(error);
        throw new Error(error);
      }
      )
    );
  }

  fetchUserById(id: number) {
    return this.http.get<user>(this.API_URL + `user/${id}`).pipe(
      catchError((error) => {
        console.log(error);
        throw new Error(error);
      }
      )
    );;
  }

  fetchUserByFullName(name: string) {
    return this.http.get<user>(this.API_URL + `user/by-username/${name}`).pipe(
      catchError((error) => {
        console.log(error);
        throw new Error(error);
      }
      )
    );;
  }

  fetchUserByFullNameAndPassword(name: string, password: string) {
    return this.http.get<user>(this.API_URL + `user/by-username/${name}/${password}`).pipe(
      catchError((error) => {
        console.log(error);
        throw new Error(error);
      }
      )
    );
  }

  fetchUserByEmail(email: string) {
    return this.http.get<user>(this.API_URL + `user/by-email/${email}`).pipe(
      catchError((error) => {
        console.log(error);
        throw new Error(error);
      }
      )
    );
  }

  fetchUserByEmailAndPassword(email?: string, password?: string) {
    return this.http.get<user>(this.API_URL + `user/by-email/${email}/${password}`).pipe(
      catchError((error) => {
        console.log(error);
        throw new Error(error);
      }
      )
    );
  }

  fetchBySenderIdAndReceiverId(senderId: number, receiverId: number) {
    return this.http.get<friend_request>(this.API_URL + `requests/${senderId}/${receiverId}`).pipe(
      catchError((error) => {
        throw new Error(error);
      })
    );
  }

  fetchSentFriendRequests(userId: number) {
    return this.http.get<friend_request[]>(`${this.API_URL}requests/sent/${userId}`).subscribe({
      next: (requests) => {
        this.sentRequestsSubject.next([...requests]);
      }
    });
  }

  fetchReceivedFriendRequests(userId: number) {
    return this.http.get<friend_request[]>(`${this.API_URL}requests/received/${userId}`).subscribe({
      next: (requests) => {
        this.receivedRequestsSubject.next([...requests]);
      }
    });
  }

  postFriendRequest(friendRequestDTO: friend_requestDTO): Observable<friend_request> {
    return this.http.post<friend_request>(this.API_URL + `request`, friendRequestDTO).pipe(
      tap((newRequest) => {
        const current = this.sentRequestsSubject.getValue();
        this.sentRequestsSubject.next([...current, newRequest]);
      })
    );
  }

  updateStatusInstant(idOfFriendRequest: number, updateFriendRequestDTO: UpdateFriendRequestDTO): Observable<friend_request> {
    return this.http.patch<friend_request>(this.API_URL + `update/${idOfFriendRequest}`, updateFriendRequestDTO).pipe(
      tap((newPatch) => {
        const sentList = this.sentRequestsSubject.getValue();
        const receivedList = this.receivedRequestsSubject.getValue();

        const isPending = newPatch.status === 'PENDING';

        const updatedSent = sentList.filter(req =>
          req.id === newPatch.id ? isPending : true
        );

        const updatedReceived = receivedList.filter(req =>
          req.id === newPatch.id ? isPending : true
        );

        this.sentRequestsSubject.next(updatedSent);
        this.receivedRequestsSubject.next(updatedReceived);
      }),
      catchError((error) => {
        console.error("Status update failed " + error);
        throw new Error(error);
      })
    )
  }

  fetchFriends(userId: number) {
    return this.http.get<user[]>(`${this.API_URL}friends/${userId}`).subscribe({
      next: (response) => {
        console.log(response);
        this.friends = response;
        this.friendsSubject.next([...response]);
      }
    });
  }


  fetchMessagesByUserId(senderId: number, receiverId: number) {
    return this.http.get<Message[]>(`${this.API_URL}messages/${senderId}/${receiverId}`).subscribe({
      next: (messages) => {
        this.message = messages;
        this.messageSubject.next([...this.message]);
        console.log(this.message);
      }
    });
  }


  postUser(user: Omit<user, 'id,avatar'>) {
    return this.http.post(this.API_URL + "user", user).pipe(
      catchError((error) => {
        throw new Error(error);
      })
    );;
  }


  fetchGroupsById(userId: number) {
    this.http.get<Group[]>(`${this.API_URL}groups/${userId}`).subscribe({
      next: (response) => {
        console.log(response);
        this.groups = response;
        this.groupsSubject.next([...this.groups]);
      }
    })
  }

  postGroup(group: Group) {
    this.http.post<Group>(`${this.API_URL}group`, group).subscribe({
      next: (response) => {
        console.log(response);
        this.groups.push(response)
        this.groupsSubject.next([...this.groups]);
      }
    });
  }

  fetchMessagesFromGroupById(groupId: number) {
    this.http.get<GroupMessage[]>(`${this.API_URL}group/messages/${groupId}`).subscribe({
      next: (messages) => {
        console.log(messages);
        this.groupMessages = messages;
        this.groupMessageSubject.next([...this.groupMessages]);
      }
    })
  }

  fetchMembersFromGroupById(groudId: number) {
    this.http.get<user[]>(`${this.API_URL}members/${groudId}`).subscribe({
      next: (members) => {
        console.log(members);
        this.groupMembersSubject.next([...members]);
      }
    })
  }

  updateGroupName(groupId: number, newName: string) {
    this.http.patch<Group>(`${this.API_URL}group/updateName/${groupId}`, newName).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })
  }

  updateGroupDescription(groupId: number, newDescription: string) {
    this.http.patch<Group>(`${this.API_URL}group/updateDescription/${groupId}`, newDescription).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })
  }

  uploadImage(avatar: FormData, userId: number) {
    this.http.post(`${this.API_URL}upload`, avatar,
      {
        responseType: 'text'
      }).subscribe({
        next: (resp) => {
          console.log("UPDATED: " + resp);
          this.updateImage(userId, resp);
        }
      });
  }

  updateImage(userId: number, avatar: string) {
    this.http.patch<user>(`${this.API_URL}update/avatar/${userId}`, avatar).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })
  }

  uploadGroupImage(groupId: number, avatar:FormData) {
    this.http.post(`${this.API_URL}upload/group/avatar`, avatar, {
      responseType: 'text'
    }).subscribe({
      next: (resp)=> {
        console.log("updated group avatar!!!");
        this.updateGroupImage(groupId,resp);

      }
    })
  }

  updateGroupImage(groupId : number, avatar:string) {
    this.http.patch<Group>(`${this.API_URL}update/group/avatar/${groupId}`,avatar).subscribe({
      next:(resp) => {
        console.log(resp);
      }
    })
  }

  updateUsername(userId: number, newUsername: string) {
    this.http.patch<user>(`${this.API_URL}update/username/${userId}`, newUsername).subscribe({
      next: (resp) => {
        console.log(resp)
      }
    })
  }

  updateEmail(userId: number, newEmail: string) {
    this.http.patch<user>(`${this.API_URL}update/email/${userId}`, newEmail).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })
  }



  deleteMessageById(id: number) {
    this.http.delete(`${this.API_URL}message/${id}`).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    });
  }

  updateOnlineStatus(user: user, isOnline: boolean) {
    this.http.patch<user>(`${this.API_URL}user/${isOnline}`, user).subscribe({
      next: (resp) => {
        console.log(resp);
      }
    })

  }


  getNotifications(userId: number) {
    this.http.get<notification[]>(`${this.API_URL}notifications/${userId}`).subscribe({
      next: (notifications) => {
        console.log("NOTIFICATIONS: " + JSON.stringify(notifications));
        this.notifications = notifications;
        this.notificationSubject.next([...this.notifications]);
      }
    })
  }

  postNotification(notification: notification) {
    let user: user = JSON.parse(localStorage.getItem('user') || "") as user;
    this.http.post<notification>(`${this.API_URL}notification`, notification).subscribe({
      next: (notification) => {
        if (notification.user.id === user.id) {
          this.notifications.push(notification);
          this.notificationSubject.next([...this.notifications]);
        }
      }
    })
  }

  updateMessageCounter(idOfNotification: number, notification: notification) {
    let user: user = JSON.parse(localStorage.getItem('user') || "") as user;
    this.http.patch<notification>(`${this.API_URL}update/notification/${idOfNotification}`, notification).subscribe({
      next: (response) => {

        console.log("AM MODIFICAT ACEASTA NOTIFICARE: " + JSON.stringify(response));

        if (response.user.id === user.id) {
          this.getNotifications(user.id);
        } else {
          this.getNotifications(response.receiver.id);
        }

      }
    })

  }


  public onImageFail(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/images.png';
  }

  public onGroupImageFail(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/group-basic.jpg';
  }

  getSelectedUser(userId:number) {
    this.http.get<user>(`${this.API_URL}user/by-id/${userId}`).subscribe({
      next: (selectedUser) => {
        this.selectedFriendSubject.next(selectedUser);
      }
    })
  }

  getSelectedGroup(grouId:number) {
    this.http.get<Group>(`${this.API_URL}group/${grouId}`).subscribe({
      next:(group)=> {
        this.selectedGroupSubject.next(group);
      }
    })
  }


  deleteGroupMember(groupId: number, userId: number) {
    this.http.patch<Group>(`${this.API_URL}group/delete/${groupId}`, userId).subscribe({
      next: (group)=> {
        console.log("Deleted group: " + group);
      }
    })
  }

  addGroupMember(groudId: number, userId: number) {
    this.http.patch<Group>(`${this.API_URL}group/add/${groudId}`,userId).subscribe({
      next: (group)=> {
        console.log("Added member to group: "  + group);
      }
    })
  }
}
