import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../service/employee.service';
import { AttendanceService } from '../../service/attendance.service';
import { AuthService } from '../../service/auth.service';
import {FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.css'
})
export class EmployeeManagementComponent implements OnInit{
  employees: any[] = [];
  searchForm!: FormGroup;
  filteredEmployees: any[] = [];
  employeeForm!: FormGroup;
  showModal: boolean = false;
  wannaAdd: boolean= false;
  wannaUpdate: boolean = false;
  updatingEmployee: any;
  wannaDelete: boolean = false;
  deletingEmployee: any;
  attendanceRecord: any[] = [];
  employeeId: number = 0;
  employee: any = {};
  selectedDate: string = '';
  showEmployeeAttendance: boolean = false;

  constructor(private employeeService: EmployeeService, private fb: FormBuilder, private attendanceService: AttendanceService, private authService: AuthService, private route: Router){}

  ngOnInit(): void{
    this.iniatializeForm();
    this.fetchAllEmployees();
  }

  iniatializeForm(): void{
    this.employeeForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      emailAddress: [''],
      position: ['']
    })
    this.searchForm = this.fb.group({
      searchValue: ['']
    })
  }

  closeModal(): void{
    this.showModal = false;
    this.wannaAdd = false;
    this.wannaUpdate = false;
    this.wannaDelete = false;
    this.employeeForm.reset();
  }

  fetchAllEmployees(): void{
    this.employeeService.findAllEmployees().subscribe({
      next: response => {
        this.employees = response;
        this.filteredEmployees = this.employees;
      },
      error: error => {
        console.error('Error fetching employees:', error)
      }
    })
  }

  filterEmployees(): void{
    const searchValue = this.searchForm.value.searchValue;
    this.filteredEmployees = this.employees.filter(employee => employee.emailAddress.includes(searchValue));
  }

  initiateAddEmployee(): void{
    this.wannaAdd = true;
    this.showModal = true;
  }

  decideAddOrUpdate(){
    if(this.wannaAdd){
      this.addEmployee();
    }
    else{
      this.updateEmployee();
    }
  }

  addEmployee(): void{
    if(this.employeeForm.valid){
      const payload = this.employeeForm.value;
      this.employeeService.addEmployee(payload).subscribe({
        next: response => {
          alert('Employee added successfully!')
          this.fetchAllEmployees();
          this.closeModal();
        },
        error: error => {
          console.error('Error adding employee:', error)
          alert('Failed to add employee, try again!')
        }
      })
    }
  }

  initiateUpdate(employee: any): void{
    this.updatingEmployee = employee;
    this.prefillFormForUpdate(employee);
    this.wannaUpdate = true;
    this.showModal = true;
  }

  prefillFormForUpdate(employee: any): void{
    this.employeeForm = this.fb.group({
      firstName: [employee?.firstName],
      middleName: [employee?.middleName || ''],
      lastName: [employee?.lastName],
      emailAddress: [employee?.emailAddress],
      position: [employee?.position]
    });
  }

  updateEmployee(): void{
    const payload = this.employeeForm.value;
    this.employeeService.updateEmployee(this.updatingEmployee.id, payload).subscribe({
      next: response => {
        alert('Employee information updated successfully!');
        this.fetchAllEmployees();
        this.closeModal();
      },
      error: error => {
        console.error('Error udating employee:', error);
        alert('Error updating employee information!')
      }
    })
  }

  initiateDelete(employee: any): void{
    this.wannaDelete = true;
    this.showModal = true;
    this.deletingEmployee = employee;
  }

  deleteEmployee(): void{
    this.employeeService.deleteEmployee(this.deletingEmployee.id).subscribe({
      next: next => {
        alert('Employee deleted successfully!');
        this.fetchAllEmployees();
        this.closeModal();
      },
      error: error => {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee, try again!');
      }
    })
  }


  fetchAttendance(employee: any): void {
    this.employeeId = employee?.mainId;
    this.employee = employee;
    this.attendanceService.getAttendanceByEmployeeId(this.employeeId).subscribe({
      next: response => {
        this.attendanceRecord = response;
        console.log('Attendance data:', this.attendanceRecord);
        this.showEmployeeAttendance = true;
      },
      error: error => {
        console.error('Error fetching attendance:', error);
        alert('Failed to fetch attendance data, try again!');
      }
    });
  }

  getAttendanceByDate(): void {
    this.attendanceService.getAttendanceByEmployeeIdAndDate(this.employeeId, this.selectedDate).subscribe({
      next: response => {
        this.attendanceRecord = response;
        console.log('Attendance data for specific date:', this.attendanceRecord);
      },
      error: error => {
        console.error('Error fetching attendance for specific date:', error);
        alert('Failed to fetch attendance data for the specified date, try again!');
      }
    });
  }

  setShowAttendanceFalse(): void {
    this.showEmployeeAttendance = false;
    this.selectedDate = '';
    this.attendanceRecord = [];
  }

  logout(): void{
    this.authService.clearToken();
    this.route.navigate(['/login']);
  }
}
