import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { AuthService } from '../../service/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AttendanceService } from '../../service/attendance.service';
import { CommonModule, getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent implements OnInit{
  employee: any;
  attendance: any = null;
  showModal: boolean = false;

  constructor(private employeeService: EmployeeService, private authService: AuthService, private router: Router, private attendanceService: AttendanceService){}

  ngOnInit(): void{
    this.fetchEmployee();
  }

  fetchEmployee(): void{
    const token = this.authService.getToken();
    const decodedToken = jwtDecode(token || '') as any;
    console.log('The decoded token is:',decodedToken);
    this.employeeService.findEmployeeByEmail(decodedToken.emailAddress).subscribe({
      next: response => {
        console.log(response)
        this.employee = response;
        this.fetchAttendanceForClockOut();
        console.log('Employee fetched:', response);
      },
      error : error => {
        console.error('Error fetching employee by email:', error);
      }
    })
  }

  iniateResignation(): void{
    this.showModal = true;
  }

  closeModal(): void{
    this.showModal = false;
  }

  resign(): void{
    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: next => {
        alert('Resignation submitted successfully, we are saddened to part with, wishing you all the best!');
        this.router.navigate(['/login'])
      }
    })
  }

  clockIn(employeeId: number): void{
    this.attendanceService.clockIn(employeeId).subscribe({
      next: response => {
        alert('Clocked in successfully!');
        console.log(response)
      },
      error: error => {
        alert(error.error.message)
        console.log('Error clocking in: ', error.error.message);
      }
    })
  }

  fetchAttendanceForClockOut(){
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
    this.attendanceService.getAttendanceByEmployeeIdAndDate(this.employee.mainId, dateString).subscribe({
      next: response => {
      this.attendance = response;
      console.log('Attendance has been fetched and the attendance is: ', this.attendance);
      },
      error: error => {
      console.error('Error fetching attendance:', error);
      }
    })
  }

  clockOut(): void{
    console.log('Trying to clock out with the attendace:', this.attendance);
    this.attendanceService.clockOut(this.attendance.mainId).subscribe({
      next: response => {
        alert("You've successfully clocked out!")
      },
      error: error => {
        console.log('Clocking out attendance with ID: ', this.attendance.mainId);
        console.log('Error clocking out', error);
        alert(error.error.message)
      }
    })
  }

  logout(): void{
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }

}
