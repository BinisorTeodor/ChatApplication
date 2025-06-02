import { Component, Inject } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { user } from '../../../interfaces/user.interface';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-detail-dialog',
  imports: [AngularmaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.scss'
})
export class UserDetailDialogComponent {
  // userForm: FormGroup;

  userForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  })

  sendedUser!: user;

  photoPreview: string | ArrayBuffer | null = null;
  defaultPhoto = 'assets/default-user.png'; // replace with your fallback

  constructor(
    protected apiService: ApiService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.userForm.setValue({
      name: data.user.fullName,
      email: data.user.email
    })

    this.sendedUser = data.user;

    this.photoPreview = data.avatar || null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file!);

      this.apiService.uploadImage(formData, this.sendedUser.id);

      this.dialogRef.close();

      setTimeout(()=> this.apiService.fetchMainUser(this.sendedUser.id),100);
    }


  }

  onSave() {
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSaveName(newName:string) {

    this.apiService.updateUsername(this.sendedUser.id,newName);
    
    this.dialogRef.close();

    setTimeout(()=> this.apiService.fetchMainUser(this.sendedUser.id),100);
  }

  onSaveEmail(newEmail: string) {

    
    this.apiService.updateEmail(this.sendedUser.id,newEmail);

    this.dialogRef.close();

    setTimeout(()=> this.apiService.fetchMainUser(this.sendedUser.id),100);
  }
}
