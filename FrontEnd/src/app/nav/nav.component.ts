import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { AngularmaterialModule } from '../angularmaterial/angularmaterial.module';
import { MatDialog } from '@angular/material/dialog';
import { AddgroupComponent } from '../components/addgroup/addgroup.component';
import { GroupComponent } from '../components/group/group.component';
import { FrienndsComponent } from '../components/friennds/friennds.component';
import { Friend } from '../../interfaces/friend.interface';
import { user } from '../../interfaces/user.interface';
import { ApiService } from '../../services/api.service';
import { Group } from '../../interfaces/group.interface';
import { UserDetailDialogComponent } from '../components/user-detail-dialog/user-detail-dialog.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    AngularmaterialModule,
  ]
})
export class NavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  username: user  = JSON.parse(localStorage.getItem('user') || "") as user;
  

  friendsList: user[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private dialog: MatDialog, private router: Router, protected apiService: ApiService) { }

  ngOnInit() {
    this.apiService.fetchFriends(this.username.id);
    

    this.apiService.connectedUser$.subscribe(user=> {
      this.username=user!;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddgroupComponent, {
      width: '400px',
      data: { friends: this.apiService.friends$ },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Group created:', result);
        this.apiService.postGroup(result as Group);
      }
    });
  }

  openUserDetails() {
    this.dialog.open(UserDetailDialogComponent, {
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '300ms',
      width: '500px',
      data: { user: this.username }
    });
  }

  onLogout() {
    this.router.navigateByUrl('/auth');
    localStorage.removeItem('user');
  }



}
