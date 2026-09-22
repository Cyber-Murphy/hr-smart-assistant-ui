import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private apiUrl = 'http://localhost:8080/api/documents/upload';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<string> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(
      this.apiUrl,
      formData,
      { responseType: 'text' }
    );
  }
}