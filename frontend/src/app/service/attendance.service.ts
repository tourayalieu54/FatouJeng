import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AttendanceService {
    private url = 'http://localhost:8080/api/attendance';

    constructor(private http: HttpClient) {}

    getAttendanceByEmployeeId(employeeId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}/employee/${employeeId}`);
    }

    clockIn(employeeId: number): Observable<any> {
        return this.http.post<any>(`${this.url}/clock-in`,{ employeeId });
    }
    clockOut(attendanceId: number): Observable<any> {
        console.log(`Clocking out attendance with ID: ${attendanceId}`);
        return this.http.put<any>(`${this.url}/clock-out/${attendanceId}`, {attendanceId });
    }
    getAttendanceByEmployeeIdAndDate(employeeId: number, date: string): Observable<any> {
        return this.http.get<any>(`${this.url}/employee?employeeId=${employeeId}&date=${date}`);
    }

}