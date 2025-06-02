import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { user } from '../../../interfaces/user.interface';
import { ApiService } from '../../../services/api.service';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-addgroup',
  imports: [AngularmaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './addgroup.component.html',
  styleUrl: './addgroup.component.scss'
})
export class AddgroupComponent {
  groupName: string = '';
  selectedFriends: user[] = [];
  friends= new Observable<user[]>;
  user: user = JSON.parse(localStorage.getItem('user') || "") as user;

  constructor(
    protected apiSerivce:ApiService ,public dialogRef: MatDialogRef<AddgroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.friends = data.friends;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {

    if (this.groupName != '' && this.selectedFriends.length > 0) {
      this.dialogRef.close(
        {
          name: this.groupName,
          description: '',
          created_by: this.user.id,
          created_at: Date.now(),
          members: this.selectedFriends.map(friend => friend.id)
        });
        //this.apiSerivce.fetchGroupsById(this.user.id);
    } else {
      alert("Please choose a name for the group and select at least 1 member")
    }
  }

}
