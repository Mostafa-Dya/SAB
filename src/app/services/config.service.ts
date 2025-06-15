import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  mode: string = "d";
//  baseUrl : string = "http://localhost:9080/SABV2Services/Rest/";
 //  baseUrl: string = "http://10.0.1.120:9080/SABV2Services/Rest/ "; //me
//baseUrl: string = "http://10.0.1.120:9080/SABV2BackEndServices/Rest/"; //meh working
   baseUrl: string = "https://vmsrefecmts1198.main.knpcdom.net:9443/SABV2Services/Rest/";  //build
// baseUrl: string = "http://vmsrefecmpr1191:9080/SABV2Services/Rest/"; //me

//1190 server
 //baseUrl: string = "https://cknpc.knpc.net:9443/SABV2Services/Rest/"; //me
 //external portal
 //  baseUrl: string = "https://ecm.knpc.net:9443/SABV2Services/Rest/"; //me

//baseUrl: string = "https://cknpc.knpc.net:9443/SABV2Services/Rest/"; //me
//baseUrl: string = "https://vmsrefecmts1198.main.knpcdom.net:9443/SABV2Services/Rest/"; //me
// baseUrl: string = "https://vms02decmd6123.main.knpcdom.net:9443/SABV2Services/Rest/"; //me

//https://vmsrefecmpr1929:9080/SAB/
  //http://vmsrefecmpr1191:9080/SAB/
 //  baseUrl: string = "https://vmsrefecmdv1141.main.knpcdom.net:9443/SABV2Services/Rest/"; //--- Users
//  baseUrl: string = "http://vmsrefecmts1198:9080/SABV2Services/Rest/";  //--- Testing
  userURL: string = '';
  inboxUrl: string = '';
  workItemController: string = '';
  launchUrl: string = '';
  searchontroller: string = '';
  assignmentControllerUrl: string = '';
  //subjectSymbolicName: string = "EmailSubject";

  constructor() {
    //  this.baseUrl = (this.mode == 'd'? this.baseUrl : "http://vmsrefecmts1198:9080/memo/");  
    // this.restURL = (this.mode == 'd'? this.restURL : "http://vmsrefecmts1198:9080/MemoService/Rest/");
    this.userURL = this.baseUrl + "UserController/";
    this.inboxUrl = this.baseUrl + "inboxController/";
    this.workItemController = this.baseUrl + "workItemController/";
    this.launchUrl = this.baseUrl + "launchObservations/";
    this.searchontroller = this.baseUrl + "SearchController/";
    this.assignmentControllerUrl = this.baseUrl + "AssigmentsController/";
  }
}
