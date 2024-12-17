import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FileSingleRESPONSE } from '../../models/file/FileSingleRESPONSE';
import { Observable } from 'rxjs';
import { FileListRESPONSE } from '../../models/file/file-list/FileListRESPONSE';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private  baseUrl = environment.apiUrl;
  private apiUrlGetLastFile = `${this.baseUrl}/files/getLastFile`; 
  private apiUrlAllFiles = `${this.baseUrl}/files/get-all-files`; 
  private apiUrlUploadJuniperFile = `${this.baseUrl}/Uploads/upload-excel`; 

  constructor(private http:HttpClient) { }


  getLastFile(): Observable<FileSingleRESPONSE>{
    return this.http.get<FileSingleRESPONSE>(this.apiUrlGetLastFile);
  }

  getAllFiles():Observable<FileListRESPONSE>{
    return this.http.get<FileListRESPONSE>(this.apiUrlAllFiles);
  }


  uploadJuniperFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrlUploadJuniperFile}`, formData);
  }
  uploadSejourFile(){

  }
}
