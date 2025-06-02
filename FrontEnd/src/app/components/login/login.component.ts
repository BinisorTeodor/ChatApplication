import { Component } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [AngularmaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router, private authService: AuthService) {}

  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  onLogin() {

    this.authService.checkIfAccountExist(
      this.loginForm.value.email?.toString(), 
      this.loginForm.value.password?.toString()
    );

  }
}
