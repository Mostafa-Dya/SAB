import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  mainUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.mainUrl = configService.baseUrl;
  }

  get(url: string) {
    return this.http.get<any>(this.mainUrl + url);
  }

  post(url: string, object: any) {
    return this.http.post(this.mainUrl + url, object);
  }

  put(url: string, object: any) {
    return this.http.put(this.mainUrl + url, object);
  }  

  patch(url: string, object: any) {
    return this.http.patch(this.mainUrl + url, object);
  }

  delete(url: string, object: any) {
    return this.http.delete(this.mainUrl + url, object);
  }
}
