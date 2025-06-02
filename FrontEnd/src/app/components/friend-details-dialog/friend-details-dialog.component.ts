import { Component, Inject } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from '../../../interfaces/user.interface';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-friend-details-dialog',
  imports: [AngularmaterialModule],
  templateUrl: './friend-details-dialog.component.html',
  styleUrl: './friend-details-dialog.component.scss'
})
export class FriendDetailsDialogComponent {

  isOnline: string | undefined = 'Offline';

  constructor(@Inject(MAT_DIALOG_DATA) public data: user, protected apiService: ApiService) { }

  ngOnInit() {
    this.apiService.selectedFriend$.subscribe(selectedFriend => {
      if (selectedFriend?.online) {
        this.isOnline = 'Online';
      }
    });
  }

}
