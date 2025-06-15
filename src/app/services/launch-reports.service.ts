import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LaunchReportsService {
  launchUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.launchUrl = configService.launchUrl;
  }

  launchreport(headers: Headers, formData: FormData) {
    var self = this;
    return this.http.post(this.launchUrl + "launchIntialReport", formData)
      .toPromise()
      .then(res => res)
      .catch(function (error) {
      });
  }

  getObsListForLaunch() { }
}
