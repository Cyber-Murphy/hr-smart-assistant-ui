import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService, Source } from './services/chat';
import { DocumentService } from './services/document';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  selectedFile: File | null = null;

  question = '';
  answer = '';
  sources: Source[] = [];

  uploading = false;
  asking = false;
  uploadMessage = '';

  constructor(
    private documentService: DocumentService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {}

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadMessage = '';
    }
  }

  uploadFile() {

    if (!this.selectedFile) {
      return;
    }

    this.uploading = true;

    this.documentService.upload(this.selectedFile)
      .subscribe({
        next: (response) => {
          this.uploadMessage = response;
          this.uploading = false;
        },
        error: () => {
          this.uploadMessage = 'Failed to upload document.';
          this.uploading = false;
        }
      });
  }

  askQuestion() {

  if (!this.question.trim()) {
    return;
  }

  this.asking = true;
  this.answer = '';
  this.sources = [];

  this.chatService.askQuestion(this.question)
    .subscribe({
      next: (response) => {

          console.log('CHAT RESPONSE:', response);
  console.log('ANSWER:', response.answer);
  console.log('SOURCES:', response.sources);

        this.answer = response.answer;
        this.sources = response.sources;

        this.asking = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('CHAT ERROR:', error);

        this.answer = 'Something went wrong while getting the answer.';
        this.asking = false;
      }
    });
}
}