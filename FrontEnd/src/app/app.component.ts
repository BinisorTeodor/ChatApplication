import { Component, HostListener } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';

import { user } from '../interfaces/user.interface';
import { WebSocketService } from '../services/web-socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  stompClient: any = null;

  user!: user

  constructor(private router: Router, private apiService: ApiService, private webSocketService: WebSocketService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/auth') {
          localStorage.removeItem('user');
          if (this.apiService.connectedUser) {
            this.apiService.updateOnlineStatus(this.apiService.connectedUser, false);
          }
        }
      }
    });
  }

  ngOnInit() {
    try {
      this.user = JSON.parse(localStorage.getItem('user') || "") as user;
      setTimeout(() => this.apiService.fetchMainUser(this.user.id), 100);
      //getting the connected user as observable for changes like username and photo.
      this.webSocketService.connect(this.user);
      this.apiService.getNotifications(this.user.id);
    } catch (error) {
      console.log("User not ready");
    }
  }
}
