import { Component } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { ApiService } from '../../../services/api.service';
import { collapseTextChangeRangesAcrossMultipleVersions, forEachChild } from 'typescript';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-window',
  imports: [AngularmaterialModule],
  templateUrl: './first-window.component.html',
  styleUrl: './first-window.component.scss',
  animations: [
    trigger('fadeInStagger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class FirstWindowComponent {
  constructor(private apiService: ApiService, private router:Router) { }

  floatingCards = [
    {
      title: '💬 Real-Time Chat',
      text: 'Send and receive messages instantly with WebSockets!',
      style: { top: '10%', left: '5%' }
    },
    {
      title: '👥 Group Chats',
      text: 'Create groups and collaborate with friends easily.',
      style: { top: '10%', right: '5%' }
    },
    {
      title: '📨 Friend Requests',
      text: 'Manage your friend list with request and approval system.',
      style: { bottom: '10%', left: '5%' }
    },
    {
      title: '🔔 Notifications',
      text: 'Stay up to date with smart alerts.',
      style: { bottom: '10%', right: '5%' }
    },
    {
      title: '🔐 Secure Backend',
      text: 'Built with Spring Boot for safety and performance.',
      style: { bottom: '10%', left: '42%' }
    }
  ];


  onGetStarted() {
    this.router.navigateByUrl('/home/friends');
    
    this.apiService.fetchUsers().subscribe({
      next: (response) => {
        console.log(response.map(user => user.password));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
