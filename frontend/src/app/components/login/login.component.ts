import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  constructor(private authServive: AuthService, private fb: FormBuilder, private router: Router){}

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void{
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login(): void{
    const payload = this.loginForm.value;
    this.authServive.signin(payload).subscribe({
      next: token => {
        console.log('Here is the token:', token)
        this.authServive.saveToken(token.token);
        const decodedToken = jwtDecode(token.token || '') as any;
        if(decodedToken?.role==='ADMIN'){
          
          
          this.router.navigateByUrl('/employee-management')
          console.log('Admin logged in');
        }else{
          this.router.navigate(['/employee-account'])
        }
      },
      error: error => {
        console.error('Error logging in:', error)
        alert('Wrong credentials!')
      }
    })
  }

}
