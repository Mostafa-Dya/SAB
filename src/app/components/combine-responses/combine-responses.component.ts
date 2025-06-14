import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor from '../../../assets/js/ck-editor-plugin/ckeditor';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedVariableService } from 'src/app/services/shared-variable.service';
// import '@ckeditor/ckeditor5-build-classic/build/translations/ar';
import '../../../assets/js/ck-editor-plugin/translations/ar';
import { LoadingService } from 'src/app/services/loading.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { E, SEVEN } from '@angular/cdk/keycodes';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PreviousEntityTypeComponent } from '../previous-entity-type/previous-entity-type.component';
import { MatDialog } from '@angular/material/dialog';
import { ObservationContentComponent } from '../observation-content/observation-content.component';
import { ContactPersonDetailsComponent } from '../contact-person-details/contact-person-details.component';
import { OverviewComponent } from '../overview/overview.component';
import { SendBackReasonsComponent } from '../sendback-reasons/sendback-reasons.component';
interface DateStrings {
  date: string;
}
export interface Entities {
  name: string;
}

@Component({
  selector: 'app-combine-responses',
  templateUrl: './combine-responses.component.html',
  styleUrls: ['./combine-responses.component.css']
})
export class CombineResponsesComponent implements OnInit {
  isLoading: boolean = true;
  public Editor = ClassicEditor;
  mergeData: any = [];
  sabContent:any = {}
  combineDataLTR = '';
  combineDataRTL = '';
  previousCombineDataRTL = '';
  selectedResponse: any;
  stepIds: string[] = [];
  customerId: any;
  userId: string;
  isSecretary:string ='No';
  isRtl: any;
  config = {
    fontFamily: {
      options: [
        'Times New Roman, Times, serif'
      ],
      supportAllValues: false // Allow any font-family value.
    },
    fontSize: {
      options: [
        12
      ],
      supportAllValues: false // Allow any font-size value.
    },
    // toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
    toolbar: ['undo', 'redo'],
    language: 'ar'
  };
  date:string;
  fiscaalYear:any[] = [];
  isDateFieldSelected = true;
  dateStrings: DateStrings[] = [
    { date: 'متباين الرأى بشأنها' },
    { date: 'تتعلق بجهات حكومية/اخرى' },
    { date: 'تم الانتهاء من إجراءاتها'}
  ];
  selectedDateString: string;
  userInformation: any;
  isAdmin: any;
  userJobTitle: any;
  reportCycle: any;
  reportName: any;
  obsSeq: any;
  obsId: any;
  title: any;
  obsCategory:any;
  deptCode:any;
  obsType: string;
  classification: string;
  selectedDelegateUserInfo: any;
  govtEntity: string = '';
  loginId: string;
  id: string;
  isPreviouseDataPresent:boolean = false;
  entities: any = [];
  constructor(
    private coreService: CoreService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    public dialog: MatDialog,
    private notification: NzNotificationService
  ) { }

  async ngOnInit(){
    let sabDelegateUser: any = localStorage.getItem('sabDelegateUser');
    if (sabDelegateUser) {
      this.selectedDelegateUserInfo = JSON.parse(sabDelegateUser);
    }
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.route.params.subscribe(params => {
      this.customerId = params['stepCustomId'];
    })
    this.route.queryParams.subscribe(params => {
      this.isSecretary = params['isSecretary'];
  });
    this.userId = localStorage.getItem('loginId') || '';

    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isAdmin = this.userInformation.admin;
    this.userJobTitle = this.userInformation.sabMember.userJobTitle;
    let reportYear = this.userInformation.reportYear;
    reportYear = reportYear.split('-')[0];
    reportYear = Number(reportYear);    
    this.fiscaalYear = await this.sharedVariableService.getYears(reportYear)   
    this.fiscaalYear = [...this.dateStrings , ...this.fiscaalYear]
    this.getCombineResponse();
   
  }

  addChip(entity: any) {
    if ((entity || '').trim()) {
      this.entities.push(entity.trim());
    }

    if (entity !== '') {
      this.govtEntity = '';
    }


  }

  remove(entities: Entities): void {
    const index = this.entities.indexOf(entities);

    if (index >= 0) {
      this.entities.splice(index, 1);
    }
  }

  openGPASenBackHistoryModel() {
    
      let url = 'InProgController/getRejectedReasons?obsId=' + this.obsId + '&reportCycle=' + this.reportCycle;
      this._loading.setLoading(true, url);
      this.coreService.get(url).subscribe(response => {
        this._loading.setLoading(false, url);
        const dialogRef = this.dialog.open(SendBackReasonsComponent, {
          width: '800px',
          data: response
        });
      }, error => {
        // this.isDialogLoading = false;
        this._loading.setLoading(false, url);
        console.log('error  :', error);
      })
    }
  getCombineResponse() {
    let url = 'workItemController/getResponseToMerge?stepCustomId=' + this.customerId;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe((response:any) => {
      //  response = [{"obsResponse":"<p>الخليج التأمين بتحديد شروط جديدة على التمديد شملت جميع وحدات المشروع وذلك لعدم تغطيتها بعض العمليات الحيوية للوحدات كبدء التشغيل وعمل اختبار الأداء للوحدات والتشغيل التجاري والذي يعد من أهم العمليات الحيوية خلال فترة تشغيل المشروع وكذلك عدم وجود غطاء تأميني للأمطار والفيضانات المستقبلية ويرجع ذلك إلى ارتفاع قيمة المطالبات التأمينية الضخمة التي قدمها مقاولي المشروع والخاصة بأمطار نوفمبر 2018، وبالإضافة إلى ذلك وضعت مجموعة الخليج للتأمين شروط واستثناءات لبعض الوحدات وصلت إلى عدد (15) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وتنص \"بأن يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغطية التأمينية أو عمل التسوية بين الطرفين\" وصل إجماليها إلى عدد (60) وحدة منها (21) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وعدد (39) وحدة في حزمة مصفاة الأحمدي</p>","obsType":"REPEATED","prevCompletionYear":"تتعلق بجهات حكومية/اخرى","prevGovtEntity":"KOC, KGOC","completionYear":"2023-2024","stepId":"3aaa89b9-f0a1-43d7-96ba-d49b959a67a1","displayName":"ECMTest User2","title":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","reportCycle":"SAB Semi-annual Report 1","obsSeq":1},{"obsResponse":"<p>عدد (15) وحدة في كل من حزمتي مصفاة ميناء عبدالله (1) و(2) وتنص \"بأن يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغطية التأمينية أو عمل التسوية بين الطرفين\" وصل إجماليها إلى عدد (60) وحدة منها (21) وحدة في</p>","obsType":"REPEATED","prevCompletionYear":"تتعلق بجهات حكومية/اخرى","prevGovtEntity":"KOC, KGOC","govtEntity":"KNPC","completionYear":"تتعلق بجهات حكومية/اخرى","stepId":"d698acca-3c05-44ef-b34c-a5b47157b05e","displayName":"Team Lead Plans Coordination","title":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","reportCycle":"SAB Semi-annual Report 1","obsSeq":1}]
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.sabContent = response;
      this.obsId = this.sabContent.obsId;
      this.mergeData = response.data;
      this.mergeData.map((data: any) => {
        if (data.obsType == 'NEW') {
          this.obsType = 'NEW';
        } else {
          this.obsType = 'REPEATED';
        }
        this.obsCategory=data.obsCategory;
        this.deptCode=data.departmentCode;
        if (data.completionYear == 'متباين الرأى بشأنها' || data.completionYear == 'تتعلق بجهات حكومية/اخرى' || data.completionYear == 'تم الانتهاء من إجراءاتها') {
          data.isDateFieldSelected = false;
        } else {
          data.isDateFieldSelected = true;
        }
      })
      if (this.obsType == 'NEW') {
        this.classification = 'B';
      } else {
        this.classification = 'BD';
      }
    // this.mergeData = [{"obsResponse":"<p>تبلغ التكلفة التقديرية لمشروع الوقود البيئي ما قيمته 4.680 مليار دينار كويتي ويهدف المشروع إلى تطوير وتوسيع كل من مصفاتي ميناء الأحمدي وميناء عبدالله وبلغ المنصر</p>","obsType":"REPEATED","completionYear":"2021-2022","previousCompletionYear":"2021-2022","prevGovEnttity":"BD","stepId":"1a68eb37-0f45-4c7b-866b-c6d90e322545","displayName":"Corporate Planning","title":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","reportCycle":"KNPC Response Report"},{"obsResponse":"<p>يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغط</p>","obsType":"REPEATED","completionYear":"Completed","previousCompletionYear":"2021-2022","prevGovEnttity":"BD","stepId":"1b9200a7-57f7-4766-95dc-4f2a227ad430","displayName":"Information Technology","title":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","reportCycle":"KNPC Response Report"}];
      // this.mergeData = [{"obsResponse":"<p>تبلغ التكلفة التقديرية لمشروع الوقود البيئي ما قيمته 4.680 مليار دينار كويتي ويهدف المشروع إلى تطوير وتوسيع كل من مصفاتي ميناء الأحمدي وميناء عبدالله وبلغ المنصر</p>","obsType":"REPEATED","completionYear":"2021-2022","previousCompletionYear":"2021-2022","prevGovEnttity":"BD","stepId":"1a68eb37-0f45-4c7b-866b-c6d90e322545","displayName":"Corporate Planning","title":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","reportCycle":"KNPC Response Report"},{"obsResponse":"<p>يتم استبعاد هبوط التربة التي تتضمن إصلاح الأساس الخاطئ بعد أضرار الفيضانات والأمطار لعام 2018 حتى أن يتم إصدار تقرير الاستشاري الجيوتقني الذي تم تعيينه من قبل مجموعة الخليج للتأمين، وكذلك وضع استثناءات تنص بأن \"يتم استبعاد أي خسائر أو أضرار بشكل مباشر أو غير مباشر بسبب الفراغات تحت الأرض أو الهبوط أو الغرق من التغط</p>","obsType":"REPEATED","completionYear":"Completed","previousCompletionYear":"2021-2022","prevGovEnttity":"BD","stepId":"1b9200a7-57f7-4766-95dc-4f2a227ad430","displayName":"Information Technology","title":"أولاً: \tالملاحظات المتعلقة بمشروع الوقود البيئي:","reportCycle":"KNPC Response Report"}];     
      if (this.mergeData.length > 0) {
        this.selectedResponse = this.mergeData[0];
        if(this.selectedResponse.hasOwnProperty('prevCompletionYear') && this.selectedResponse.prevCompletionYear != ''){
          this.isPreviouseDataPresent = true; 
        }
      }
      this.mergeData.forEach((element: any) => {
        this.stepIds.push(element.stepId);
        this.title = element.title;
        this.reportCycle = element.reportCycle;
        this.reportName = element.reportName;
        this.obsSeq = element.obsSeq;
      });
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  selectionChange(event: any) {
    this.selectedResponse = this.mergeData[event.index];
    if(this.selectedResponse.hasOwnProperty('prevCompletionYear') && this.selectedResponse.prevCompletionYear != ''){
      this.isPreviouseDataPresent = true; 
    }
  }

  addCombinedata() {
    this.combineDataRTL = this.combineDataRTL + this.selectedResponse.obsResponse;
    // if(this.isRtl) {
    //   this.combineDataRTL = this.combineDataRTL + this.selectedResponse.obsResponse;
    // } else {
    //   this.combineDataLTR = this.combineDataLTR + this.selectedResponse.obsResponse;
    // }
  }

  onShowOverview(data: any) {
    let url = 'InProgController/getOverViewDetailsInfo?stepCustomId=' + this.customerId + '&userId=' + this.userId  + '&r=' + (Math.floor(Math.random() * 100) + 100);
   // let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.workItem.obsCategory+'&deptName='+this.workItem.departmentName+'&deptCode='+this.workItem.departmentCode;
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
    this._loading.setLoading(false, url);

    const dialogRef = this.dialog.open(OverviewComponent, {
      data: response
    });
   
  }, error => {
    //   // this.isDialogLoading = false;
    //   this._loading.setLoading(false, url);
    //   console.log('error :', error);
    })

  }

  onComplete() {
    if(this.entities){
      this.entities = this.entities.filter((item: any) => {
        return item.trim();
      })
    }
    let combineData;
    combineData = this.combineDataRTL;
    let completionYear;
    // if (this.isDateFieldSelected) {
      completionYear = this.date;
    // } else {
    //   completionYear = this.selectedDateString;
    // }
    let _onBehalf = this.userInformation.sabMember.loginId;
    let isDelegatedUser = "false";
    if (this.selectedDelegateUserInfo) {
      _onBehalf = this.selectedDelegateUserInfo.loginId;
      isDelegatedUser = "true";
    }else if (this.userJobTitle == 'SEC') {
      _onBehalf = this.userInformation.supervisorDetails.loginId;
    }
    // if(this.isRtl) {
    //   combineData = this.combineDataRTL;
    // } else {
    //   combineData = this.combineDataLTR;
    // }'
    let correctCompletionYear = completionYear
    completionYear = correctCompletionYear
    var result;
    if (this.reportCycle != 'KNPC Response Report') {
      if (completionYear == 'تتعلق بجهات حكومية/اخرى') {
        if (this.isAdmin || this.userJobTitle == 'MGR') {
          if (this.isAdmin) {
            result = {
              userJobTitle : this.userJobTitle,
              combinedResponse: combineData,
              stepIds: this.stepIds,
              combinedByUserId: this.userId,
              completionYear: completionYear,
              classification: this.classification,
              govtEntity: this.entities.join(','),
              onBhalfOf: _onBehalf,
              delegatedUser: isDelegatedUser
            }
          } else {
            result = {
              userJobTitle : this.userJobTitle,
              combinedResponse: combineData,
              stepIds: this.stepIds,
              combinedByUserId: this.userId,
              completionYear: completionYear,
              classification: this.classification,
              govtEntity: this.entities.join(','),
              onBhalfOf: _onBehalf,
              delegatedUser: isDelegatedUser
            }
          }
        } else {
          result = {
            userJobTitle : this.userJobTitle,
            combinedResponse: combineData,
            stepIds: this.stepIds,
            combinedByUserId: this.userId,
            completionYear: completionYear,
            classification: this.classification,
            govtEntity: this.entities.join(','),
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
        }
      } else {
        if (this.isAdmin || this.userJobTitle == 'MGR') {
          if (this.isAdmin) {
            result = {
              userJobTitle : this.userJobTitle,
              combinedResponse: combineData,
              stepIds: this.stepIds,
              combinedByUserId: this.userId,
              completionYear: completionYear,
              classification: this.classification,
              onBhalfOf: _onBehalf,
              delegatedUser: isDelegatedUser
            }
          } else {
            result = {
              userJobTitle : this.userJobTitle,
              combinedResponse: combineData,
              stepIds: this.stepIds,
              combinedByUserId: this.userId,
              completionYear: completionYear,
              classification: this.classification,
              onBhalfOf: _onBehalf,
              delegatedUser: isDelegatedUser
            }
          }
        } else {
          result = {
            userJobTitle : this.userJobTitle,
            combinedResponse: combineData,
            stepIds: this.stepIds,
            combinedByUserId: this.userId,
            completionYear: completionYear,
            classification: this.classification,
            onBhalfOf: _onBehalf,
            delegatedUser: isDelegatedUser
          }
        }
      }
    } else {
      result = {
        userJobTitle : this.userJobTitle,
        combinedResponse: combineData,
        stepIds: this.stepIds,
        combinedByUserId: this.userId,
        onBhalfOf: _onBehalf,
        delegatedUser: isDelegatedUser
      }
    }
    // this.workItemService.combineResponses(result).subscribe(function (response) {
    //   _this.router.navigate(['/inbox']);
    // }, function (err) {
    // });
    this.isLoading = true;
    let url = 'workItemController/combineResponses';
    this._loading.setLoading(true, url);
    this.coreService.post(url, result).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      this.clearFilter();
      this.router.navigate(['/inbox']);
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error  :', error);
    })
  }

  goToInbox() {
    this.clearFilter();
    this.router.navigate(['/inbox']);
  }

  clearFilter() {
    localStorage.removeItem('sabFilterType');
    localStorage.removeItem('sabFilterSequence');
    localStorage.removeItem('sabFilterDepartment');
    localStorage.removeItem('sabFilterStatus');
    localStorage.removeItem('sabSentItemsFilterType');
    localStorage.removeItem('sabSentItemsFilterSequence');
    localStorage.removeItem('sabSentItemsFilterDepartment');
    localStorage.removeItem('sabSentItemsFilterStatus');
    localStorage.removeItem('sabSentItemsFilterDirectorate');
    localStorage.removeItem('sabSentItemsFilterBehalf');
    localStorage.removeItem('sabSentItemsFilterMultipleDept');
    localStorage.removeItem('sabResponseProgressFilterType');
    localStorage.removeItem('sabResponseProgressFilterSequence');
    localStorage.removeItem('sabResponseProgressFilterDepartment');
    localStorage.removeItem('sabResponseProgressFilterStatus');
    localStorage.removeItem('sabResponseProgressFilterDirectorate');
    localStorage.removeItem('sabResponseProgressFilterBehalf');
    localStorage.removeItem('sabResponseProgressFilterMultipleDept');
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  dateChange(value:any) {
    if (value != 'متباين الرأى بشأنها' && value != 'تتعلق بجهات حكومية/اخرى' && value != 'تم الانتهاء من إجراءاتها')
 {
      if (this.obsType == 'NEW') {
        this.classification = 'B';
      } else {
        this.classification = 'BD';
      }
    }else{
      if (this.obsType == 'NEW') {
        if (value == 'متباين الرأى بشأنها') {
          this.classification = 'C';
        } else if (value == 'تتعلق بجهات حكومية/اخرى') {
          this.classification = 'E';
        } 
        // else if (value == 'Completed') 
        else if (value == 'تم الانتهاء من إجراءاتها')
        {
          this.classification = 'A';
        }
      } else {
        if (value == 'متباين الرأى بشأنها') {
          this.classification = 'CD';
        } else if (value == 'تتعلق بجهات حكومية/اخرى') {
          this.classification = 'ED';
        } 
        // else if (value == 'Completed') 
        else if (value == 'تم الانتهاء من إجراءاتها')
        {
          this.classification = 'A';
        }
      }
    }
  }

  checkSelected(value :string){
    this.selectedDateString =  value;

    if(value == 'متباين الرأى بشأنها'){
      this.isDateFieldSelected = false;
    }else{
      if(value == 'تتعلق بجهات حكومية/اخرى'){
        this.isDateFieldSelected = false;
      }else{
        if(value == 'تم الانتهاء من إجراءاتها')
        {
          this.isDateFieldSelected = false;
        }else{
          this.isDateFieldSelected = true;
        }
      } 
    }
    
  }

  // onPaste(e: any) {
  //   e.preventDefault();
  //   return false;
  // };

  // onReady(editor: any) {
  //   const documentView = editor.editing.view.document;
  //   documentView.on("paste", (event: any, data: any) => {
  //     event.stop();
  //     return false;
  //   });
  // }
  
  change(editorData:string){
    if(editorData.includes("<table>")){
      setTimeout(()=>{
        this.combineDataRTL =  this.previousCombineDataRTL;
        this.notification.create('info', 'Info', "Table is not allowed to add or paste here");
      },)     
    }else{
      if(editorData.includes("<img")){
        setTimeout(()=>{
          this.combineDataRTL=  this.previousCombineDataRTL;
          this.notification.create('info', 'Info', "Image is not allowed to add or paste here");
        },)     
      }else if(editorData.includes("<ul>") || editorData.includes("<ol>")){
        setTimeout(()=>{
          this.combineDataRTL=  this.previousCombineDataRTL;
          this.notification.create('info', 'Info', "Bullet points are not allowed to add or paste here");
        },)     
      }else if(editorData.includes("<u>") || editorData.includes("<b>") || editorData.includes("<strong>")){
        setTimeout(()=>{
          this.combineDataRTL=  this.previousCombineDataRTL;
          this.notification.create('info', 'Info', "Underline and bold text are not allowed to add or paste here");
        },)     
      }else{
        this.previousCombineDataRTL =  this.combineDataRTL 
      }
    }
  }
  
  previousEntityDialog(selectedResponse:any): void {
      const dialogRef = this.dialog.open(PreviousEntityTypeComponent, {
        width: '450px',
        data :selectedResponse
      });
      dialogRef.afterClosed().subscribe(result => {
       
      });
    
  }
  onShowContactPerson(){
    let _stepUniqueName='';
    
    if(this.sabContent.stepUnqName==='G&PACOombineResponse'){
      _stepUniqueName = 'GPACombineResponse'
    }else{
      _stepUniqueName = this.sabContent.stepUnqName;
    }
     
     let url = 'settingsController/getDepartmentContactPersionDetails?obsCategory='+this.obsCategory+'&deptCode='+this.deptCode+'&stepUnqName='+_stepUniqueName+'&obsId='+this.sabContent.obsId+'&reportYear='+this.sabContent.reportYear+'&reportCycle='+this.sabContent.reportCycle;
   this._loading.setLoading(true, url);
   this.coreService.get(url).subscribe(response => {
     this._loading.setLoading(false, url);
    
     const dialogRef = this.dialog.open(ContactPersonDetailsComponent, {
       width: '800px',
       data: {
         dialogHeader: 'OBSERVATION_CONTACT',
         dialogData: response 
       }
     });
      dialogRef.afterClosed().subscribe((result:any) => {
        if (result.event == 'Send') {
     //     // this.updateGPAMemberDetails(result);
        }
      });
   }, error => {
   //   // this.isDialogLoading = false;
   //   this._loading.setLoading(false, url);
   //   console.log('error :', error);
   })
   
 }
  resoponseContent(){
    const dialogRef = this.dialog.open(ObservationContentComponent, {
      width: '800px',
      data : {
        sabRequest : this.sabContent.sabRequest,
        sabCommentary : this.sabContent.sabCommentary
      }
    });
    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
  
}
