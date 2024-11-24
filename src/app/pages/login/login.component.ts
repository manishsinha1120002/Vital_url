import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field'; // MatFormField
import { MatInputModule } from '@angular/material/input'; // MatInput
import { MatButtonModule } from '@angular/material/button'; // MatButton
import { CommonServicesService } from '../../services/common-services.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
  
})
export class LoginComponent {
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  constructor( private fb: FormBuilder,
    //  public _commonService: CommonServicesService
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const body  = {
        emai: this.loginForm.controls['email'].value,
        pass: this.loginForm.controls["password"].value
      }
      // this._commonService
      //   .api(body, `/login`, 200, 'post')
      //   .subscribe((res) => {
      //     if (res.is_error == 0) {
      //       this._commonService.customPopups('Login successful!',0);
      //       localStorage.setItem('token', res.token);
      //     } else if (res.is_error == 1) {
      //       this._commonService.customPopups('Login failed. Please try again.',1);
      //     }
      //   });


      
    }
  }

}
