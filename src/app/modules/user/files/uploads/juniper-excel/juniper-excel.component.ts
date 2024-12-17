import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { FileService } from '../../../../../core/services/api/file.service';
import { FileListDTO } from '../../../../../core/models/file/file-list/FileListDTO';
import { AccordionModule } from 'primeng/accordion';

export interface FileList {
  name: string,
  uploadedDate: string
}

export interface FileStatus {
  file: File;
  status: 'Pending' | 'Completed';
}

@Component({
  selector: 'app-juniper-excel',
  standalone: true,
  imports: [AccordionModule,FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule, HttpClientModule, CommonModule, FormsModule, TableModule, TagModule,ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './juniper-excel.component.html',
  styleUrl: './juniper-excel.component.scss'
})
export class JuniperExcelComponent {
  loading: boolean = false;
  fileList: FileListDTO[] = [];
  files: FileStatus[] = [];
  uploadProgress: number = 0;

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.loadUploadedFiles();
  }

  loadUploadedFiles(): void {
    this.fileService.getAllFiles().subscribe({
      next: (response) => {
        this.fileList = response.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  choose(event: any, callback: Function): void {
    callback();
  }

  onSelectedFiles(event: any): void {
    this.files = event.currentFiles.map((file: File) => ({
      file,
      status: 'Pending',
    }));
  }

  onTemplatedUpload(): void {
    if (!this.files || this.files.length === 0) {
      alert('No files selected.');
      return;
    }
  
    const formData = new FormData();
    this.files.forEach(({ file }) => {
      formData.append('files', file);
    });
  
    this.loading = true; // Spinner başlat
    this.fileService.uploadJuniperFile(formData).subscribe({
      next: (response) => {
        this.files.forEach((fileStatus) => (fileStatus.status = 'Completed'));
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          life:4000,
          detail: response.message,
        });
        this.loadUploadedFiles(); // Dosyaları yenile
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
      complete: () => {
        this.loading = false; // Spinner durdur
      },
    });
  }
  

  formatSize(bytes: number): string {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onRemoveTemplatingFile(event: any, file: FileStatus, removeFileCallback: any, index: number): void {
    removeFileCallback(event, index);
    this.files.splice(index, 1);
  }
}
