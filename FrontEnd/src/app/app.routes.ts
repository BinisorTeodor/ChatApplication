import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { GroupComponent } from './components/group/group.component';
import { FrienndsComponent } from './components/friennds/friennds.component';
import { AddgroupComponent } from './components/addgroup/addgroup.component';
import { AuthComponent } from './components/auth/auth.component';
import { FirstWindowComponent } from './components/first-window/first-window.component';
import { AddFriendComponent } from './components/add-friend/add-friend.component';
import { AuthGuard } from '../services/auth.guard';

export const routes: Routes = [
    {path:'', redirectTo: 'auth', pathMatch: 'full'},
    {path:'auth', component: AuthComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},

    {
        path:'home',
        component: HomeComponent, canActivate: [AuthGuard],
        children: [
            {path: 'group', component: GroupComponent},
            {path: 'friends', component: FrienndsComponent},
            {path: 'addgroup', component: AddgroupComponent},
            {path: 'firstwindow', component: FirstWindowComponent},
            {path: 'addfriend', component: AddFriendComponent}
        ]
    },

    {path:'**', redirectTo:'/auth'}
];
