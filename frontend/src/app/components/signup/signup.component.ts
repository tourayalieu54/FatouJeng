import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  signupForm!: FormGroup;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router){}

  ngOnInit(): void{
    this.initializeForm();
  }

  initializeForm(): void{
    this.signupForm = this.fb.group({
      emailAddress: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required]]
    });
  }

  passwordMatchValidator(): void{
    const password = this.signupForm.get('password')?.value;
    const rePassword = this.signupForm.get('repeatPassword')?.value;
  if(password!=='' && rePassword!=='' && password!==rePassword){
    this.passwordMismatch = true;
  }
  }

  onSubmit(): void{
    const payload = this.signupForm.value;
    this.authService.signup(payload).subscribe({
      next: response => {
        alert('Sign up successful');
        this.signupForm.reset();
        this.router.navigate(['/login'])
      },
      error: error => {
        console.error('Error signing up:', error);
        alert('Error signing up, be sure to use your eployee email address as your email address here too.');
      }
    })
  }
}
