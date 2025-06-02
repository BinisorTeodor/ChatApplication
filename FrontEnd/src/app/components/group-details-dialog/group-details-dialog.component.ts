import { Component, Inject } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';
import { user } from '../../../interfaces/user.interface';
import { Group } from '../../../interfaces/group.interface';
import { combineLatest, map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-details-dialog',
  imports: [AngularmaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './group-details-dialog.component.html',
  styleUrl: './group-details-dialog.component.scss'
})
export class GroupDetailsDialogComponent {
  //  groupForm: FormGroup;

  addFriend: string = "";

  selectedGroup!: Group;

  filteredFriends$ = new Observable<user[]>;

  groupForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  })

  newMemberName: string = '';

  photoPreview: string | ArrayBuffer | null = null;
  constructor(
    protected apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<GroupDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group
  ) {

    this.selectedGroup = data;

    this.groupForm.setValue({
      name: this.data.name,
      description: this.data.description || ""
    });

    this.apiService.fetchMembersFromGroupById(data.id);

    this.filteredFriends$ = combineLatest([
      this.apiService.groupMembers$,
      this.apiService.friends$
    ]).pipe(
      map(([groupMembers, friends]) =>
        friends.filter(friend =>
          !groupMembers.some(member => member.id === friend.id)
        )
      )
    );


  }

  addMember(userId: number) {

    this.apiService.addGroupMember(this.selectedGroup.id!, userId);

    this.snackBar.open('You added a new group member', 'Close', {
      duration: 3000
    });

    this.dialogRef.close();

  }

  removeMember(userId: number) {

    this.apiService.deleteGroupMember(this.selectedGroup.id, userId);

    this.snackBar.open('You deleted a group member', 'Close', {
      duration: 3000
    });

    this.dialogRef.close();

  }

  onSaveName(newName: string) {

    this.apiService.updateGroupName(this.selectedGroup.id, newName);

    this.selectedGroup.name = newName;

    this.dialogRef.close({
      group: this.selectedGroup
    })
  }

  onSaveDescription(newDescription: string) {

    this.apiService.updateGroupDescription(this.selectedGroup.id, newDescription);

    this.selectedGroup.description = newDescription;

    this.dialogRef.close({
      group: this.selectedGroup
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);


      if (file) {
        const formData = new FormData();
        formData.append('file', file!);
        this.apiService.uploadGroupImage(this.selectedGroup.id, formData);
      }
    }
  }
}
