import { Component } from '@angular/core';
import { AngularmaterialModule } from '../../angularmaterial/angularmaterial.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { user } from '../../../interfaces/user.interface';


@Component({
  selector: 'app-register',
  imports: [AngularmaterialModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router:Router) {}

  registerFrom = new FormGroup({
    fullName: new FormControl('',[Validators.required, Validators.minLength(1)]),
    email: new FormControl('', [Validators.required, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  onRegister() {

    this.authService.register(this.registerFrom.value as Omit<user,'id,avatar'>);
  }
   
}
