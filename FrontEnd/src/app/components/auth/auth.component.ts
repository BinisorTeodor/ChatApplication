import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';

@Component({
  selector: 'app-auth',
  imports: [RegisterComponent, LoginComponent, AngularmaterialModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
