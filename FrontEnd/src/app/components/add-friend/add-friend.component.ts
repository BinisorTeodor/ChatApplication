import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { MatChip } from '@angular/material/chips';
import { friend_request } from '../../../interfaces/friend_requests.interface';
import { ApiService } from '../../../services/api.service';
import { user } from '../../../interfaces/user.interface';
import { friend_requestDTO } from '../../../interfaces/friend_requestsDTO.interface';
import { UpdateFriendRequestDTO } from '../../../interfaces/updateFriendRequestDTO.interface';
import { Status } from '../../../enums/status';
import { AsyncPipe, CommonModule } from '@angular/common';
import { notification } from '../../../interfaces/notification.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-friend',
  imports: [AngularmaterialModule, ReactiveFormsModule, MatChip, AsyncPipe, CommonModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss'
})
export class AddFriendComponent {

  addFriendForm!: FormGroup;

  sentRequestsTest: friend_request[] = [];
  receivedRequestsTest: friend_request[] = [];

  user: user = JSON.parse(localStorage.getItem('user') || "") as user;

  constructor(protected apiService: ApiService, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.initialValues();
  }

  initialValues() {
    this.addFriendForm = new FormGroup({
      nickname: new FormControl('', [Validators.required, Validators.minLength(3)])
    });

    this.apiService.fetchSentFriendRequests(this.user.id);
    this.apiService.fetchReceivedFriendRequests(this.user.id);
  }

  addFriend() {
    if (this.addFriendForm.valid) {
      const nickname = this.addFriendForm.value.nickname.trim();

      //GETTING THE USER BY THE NICKNAME INTRODUCED INTO THE FORM
      this.apiService.fetchUserByFullName(nickname).subscribe({
        next: (user) => {
          if (user) {
            let friendRequestDTO: friend_requestDTO = ({ receiver_id: -1, sender_id: -1 });
            friendRequestDTO.receiver_id = user.id;
            friendRequestDTO.sender_id = this.user.id;

            //BASED ON THE USER RECEIVED WE MAKE A POST TO THE BACKEND WITH THE FRIEND REQUEST
            this.apiService.postFriendRequest(friendRequestDTO).subscribe({
              next: (resp) => {
                console.log(resp);
                if (resp) {

                  this.snackBar.open("You added " + user.fullName + " to you requests list", 'Close', {
                    duration: 3000
                  });

                }
                else {
                  this.snackBar.open("The pending already exists or is another problem at your request", 'Close', {
                    duration: 3000
                  });
                }

              },
              error: (error) => {
                this.snackBar.open("There was something wrong with the request: ", 'Close', {
                  duration: 3000
                });
              }
            });
          } else {
            this.snackBar.open("The user was not found", 'Close', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          this.snackBar.open("There was something wrong with the request: " + error.message, 'Close', {
            duration: 3000
          });

        }
      })
      this.addFriendForm.reset();
    }
  }

  acceptRequest(friend_request: friend_request, index: number) {
    const senderId = friend_request.sender.id;
    const receiverId = friend_request.receiver.id;
    const updateFriendRequestDTO: UpdateFriendRequestDTO = { status: Status.ACCEPTED };
    let idOfFriendRequest: number;
    this.apiService.fetchBySenderIdAndReceiverId(senderId, receiverId).subscribe({
      next: (resp) => {
        idOfFriendRequest = resp.id;
        this.apiService.updateStatusInstant(idOfFriendRequest, updateFriendRequestDTO).subscribe({
          next: (response) => {
            //creating the notification
            let notification: notification = {
              user: friend_request.sender,
              receiver: friend_request.receiver,
            }

            //creating the first notification (sender:1 receiver:2)
            this.apiService.postNotification(notification);

            notification.user = friend_request.receiver;
            notification.receiver = friend_request.sender;

            //creating the second notification but in reverse (sender:2 receiver:1)
            this.apiService.postNotification(notification);

            this.snackBar.open('Accepted: ' + friend_request.sender.fullName, 'Close', {
              duration: 3000
            });
          }
        })
      }
    })

  }

  declinePendingRequest(friend_request: friend_request, index: number) {
    const senderId = friend_request.sender.id;
    const receiverId = friend_request.receiver.id;
    const updateFriendRequestDTO: UpdateFriendRequestDTO = { status: Status.DECLINED };
    let idOfFriendRequest: number;
    this.apiService.fetchBySenderIdAndReceiverId(senderId, receiverId).subscribe({
      next: (resp) => {
        idOfFriendRequest = resp.id;
        this.apiService.updateStatusInstant(idOfFriendRequest, updateFriendRequestDTO).subscribe({
          next: (response) => {
             this.snackBar.open('Declined: ' + friend_request.sender.fullName, 'Close', {
              duration: 3000
            });
          }
        })
      }
    })
  }

  declineSentRequest(friend_request: friend_request, index: number) {
    const senderId = friend_request.sender.id;
    const receiverId = friend_request.receiver.id;
    const updateFriendRequestDTO: UpdateFriendRequestDTO = { status: Status.DECLINED };
    let idOfFriendRequest: number;
    this.apiService.fetchBySenderIdAndReceiverId(senderId, receiverId).subscribe({
      next: (resp) => {
        idOfFriendRequest = resp.id;
        this.apiService.updateStatusInstant(idOfFriendRequest, updateFriendRequestDTO).subscribe({
          next: (response) => {
            this.snackBar.open('Declined: ' + friend_request.receiver.fullName, 'Close', {
              duration: 3000
            });
          }
        })
      }
    })
  }
}
