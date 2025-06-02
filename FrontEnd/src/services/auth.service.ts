import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { user } from '../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) { }

  existAccount: boolean = false;

  checkIfAccountExist(email?: string, password?: string) {

    this.apiService.fetchUserByEmailAndPassword(email, password)
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.router.navigateByUrl("/home/firstwindow");
            this.apiService.updateOnlineStatus(resp, true);
            localStorage.setItem('user', JSON.stringify(resp))
            setTimeout(() => this.apiService.fetchMainUser(resp.id), 100);
          }
          else {
            this.snackBar.open('There is no existing user with that email or password', 'Close', {
              duration: 3000
            });
          }
        },
        error: () => {
          this.snackBar.open('There was an error on the request', 'Close', {
              duration: 3000
            });
        }
      }

      );
  }

  register(user: Omit<user, 'id,avatar'>) {
    this.apiService.postUser(user).subscribe({
      next: (resp) => {
        if (resp) {
          this.checkIfAccountExist(user.email, user.password);
        }
      },
      error: () => {
        alert("The email is already taken");
      }
    }
    )

  }
}
