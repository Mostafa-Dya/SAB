import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObsResponse } from 'src/app/models/response.model';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

interface Reason {
  value: string;
  isRequired: any;
}

@Component({
  selector: 'app-send-back',
  templateUrl: './send-back.component.html',
  styleUrls: ['./send-back.component.css']
})
export class SendBackComponent implements OnInit {
  isRtl: any;
  comment: string = '';
  isReasonFirst: any = true;
  /**  commented by venkat
  reasons: Reason[] = [
    { value: '', isRequired: true },
    { value: 'يرجى تغطية الرد على فقرة "ويطلب الديوان" بالكامل', isRequired: true },
    { value: 'يرجى تغطية الرد على فقرة "ويعقب الديوان" بالكامل', isRequired: true },
     { value: 'الرد مكرر – يرجى إضافة تحديث على الرد', isRequired: false },
     { value: 'يرجى الرد باللغة العربية', isRequired: false },
     { value: 'يرجى إعادة صياغة الرد', isRequired: false },
    { value: 'الرد يخالف بروتوكول التعاون مع ديوان المحاسبة', isRequired: false },
    { value: 'الرد يحتوي على نقاط - يرجى إعادة الصياغة كفقرة', isRequired: false },
     { value: 'الرد يحتاج شرح إضافي لبعض النقاط', isRequired: false },
     { value: 'طلب الدائرة باسترجاع الملاحظة لإعادة مراجعة الرد', isRequired: false },
     { value: 'يرجى التنسيق وإعداد الرد من جهتكم', isRequired: true },
     { value: 'التصنيف يتعارض مع الرد - يرجى المطابقة', isRequired: false },
    { value: 'التصنيف يتعارض مع سابقه – يرجى إيضاح الأسباب/ المستجدات', isRequired: false },
    { value: 'يرجى تزويد الديوان بالمستندات المطلوبة مع ذكر التاريخ بالرد', isRequired: true },
    { value: 'يرجى ذكر مبلغ الغرامات', isRequired: true },
    { value: 'يرجى ذكر تاريخ تزويد الديوان بالمستندات المذكورة', isRequired: false },
     { value: 'Other', isRequired: true }
  ];
  **/
/** reasons are updated by g&pa

 reasons: any[] = [ 'All',
   'يرجى تغطية الرد على فقرة "ويطلب الديوان" بالكامل',
    'يرجى تغطية الرد على فقرة "ويعقب الديوان" بالكامل',
    'الرد مكرر – يرجى إضافة تحديث على الرد',
    'يرجى الرد باللغة العربية',
    'يرجى إعادة صياغة الرد',
   'الرد يخالف بروتوكول التعاون مع ديوان المحاسبة',
    'الرد يحتوي على نقاط - يرجى إعادة الصياغة كفقرة',
  'الرد يحتاج شرح إضافي لبعض النقاط',
    'طلب الدائرة باسترجاع الملاحظة لإعادة مراجعة الرد',
    'يرجى التنسيق وإعداد الرد من جهتكم',
    'التصنيف يتعارض مع الرد - يرجى المطابقة',
    'التصنيف يتعارض مع سابقه – يرجى إيضاح الأسباب/ المستجدات',
    'يرجى تزويد الديوان بالمستندات المطلوبة',
    'يرجى ذكر مبلغ الغرامات',
    'يرجى ذكر تاريخ تطبيق الغرامات',
    'يرجى ذكر تاريخ تزويد الديوان بالمستندات المذكورة',
   'يرجى الرد بما يخص السنة المالية المذكورة بالملاحظة',
     'الرد يتعارض مع رد الدائرة المشتركة بالملاحظة، يرجى التنسيق وإعادة إعداد الرد',
    'يرجى إضافة ما تم الاتفاق عليه خلال الاجتماعات الدورية مع الديوان',
   'يرجى إضافة ما تم الاتفاق عليه خلال الاجتماعات المنعقدة مع الإدارة العليا',
    'في حال تم/سيتم موافاة الديوان بالمستندات المطلوبة، يرجى ذكر ذلك في الرد',
    'Other'
  ];

  */

  
 reasons: any[] = [ 'All',
 'لم تتم تغطية الرد على فقرة "ويطلب الديوان" بالكامل',
 'لم تتم تغطية الرد على فقرة "ويعقب الديوان" بالكامل',
 'الرد مكرر، يرجى إضافة تحديث على الرد',
 'لم يتم تقديم الرد باللغة العربية',
 'مطلوب إعادة صياغة الرد',
 'الرد يخالف بروتوكول التعاون مع ديوان المحاسبة',
 'الرد يحتوي على نقاط، يرجى إعادة الصياغة كفقرة',
 'الرد يحتاج شرح إضافي لبعض النقاط',
 'طلب الدائرة باسترجاع الملاحظة لإعادة مراجعة الرد',
 'يرجى التنسيق وإعداد الرد من جهتكم',
 'يرجى التنسيق مع الدائرة المشتركة بالملاحظة لتوحيد صيغة الرد وتجنب التعارض',
 'التصنيف يتعارض مع الرد، يرجى المطابقة',
 'التصنيف يتعارض مع سابقه، يرجى إيضاح المستجدات بالرد',
 'يرجى تزويد الديوان بالمستندات الدالة',
 'لم يتم ذكر مبلغ الغرامات',
 'لم يتم ذكر تاريخ تطبيق الغرامات',
 'يرجى ذكر تاريخ تزويد الديوان بالمستندات المذكورة',
 'لم يتم الرد بما يخص السنة المالية المذكورة بالملاحظة',
 'لم تتم إضافة ما تم الاتفاق عليه خلال الاجتماعات الدورية مع الديوان',
 'لم تتم إضافة ما تم الاتفاق عليه خلال الاجتماعات المنعقدة مع الإدارة العليا',
 'في حال تم أو سيتم موافاة الديوان بالمستندات المطلوبة، يرجى ذكر ذلك بالرد',
 'النظر في إمكانية استخدام معيار قياسي مع شركات عالمية وإيضاح وضع الشركة',
 'بعد التنسيق مع الدائرة التي تم اقتراحها من قبلكم تبين بأن الرد لازال من طرفكم',
 'برجاء إضافة ما تم الاتفاق عليه عن طريق البريد الإلكتروني',
 'Other'
];

  //selectedReason: Reason;
 selectedReason = new FormControl();
  showError: boolean;
  userInformation: any;

  constructor(
    public dialogRef: MatDialogRef<SendBackComponent>,
    @Inject(MAT_DIALOG_DATA) public responseData: ObsResponse,
    private sharedVariableService: SharedVariableService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
   // this.selectedReason = this.reasons[0];
    let data: any = localStorage.getItem('sabUserInformation');
    this.userInformation = JSON.parse(data);
    this.isReasonFirst = false;

   // this.userInformation.admin = !this.userInformation.admin;
  }

  onSend(): void {
    var _result;
    if (this.userInformation.admin) {
      // if (this.selectedReason.isRequired && (this.comment == undefined || this.comment == '')) {
      //   this.showError = true;
      //   return;
      // }
      let selectedValues =  [...this.selectedReason.value];
      const allIndex = selectedValues.indexOf('All');
      if (allIndex !== -1) {
        selectedValues.splice(allIndex, 1);
      }
      _result = {
        reason: selectedValues.join(' ; '),
        comment: this.comment.trim()
      };
      this.dialogRef.close({ event: 'Send', data: _result });
    } else {
      // if (this.comment == undefined) {
      //   this.comment = '';
      // }
      _result = {
        comment: this.comment.trim()
      };
      this.dialogRef.close({ event: 'Send', data: _result });
    }
  }

  reasonChange(event:any){
    if (!this.isReasonFirst) {
      if (event.source.value == 'All') {
        this.isReasonFirst = true;
        if (event.source._selected) {
          this.selectedReason.setValue(this.reasons);
        } else {
          this.selectedReason.setValue([]);
        }
        this.isReasonFirst = false;
      } else {
        this.isReasonFirst = true;
        if (!event.source._selected) {
          setTimeout(() => {
            this.isReasonFirst = true;
            if (this.selectedReason.value[0] == 'All') {
              let data = [...this.selectedReason.value];
              data.splice(0, 1);
              this.selectedReason.setValue(data);
            }
            this.isReasonFirst = false;
          }, 300)
        } else {
          setTimeout(() => {
          this.isReasonFirst = true;
          // console.log(this.selectedReason.value);
          // console.log(this.reasons.length);
          if ((this.selectedReason.value?.length + 1) == this.reasons.length) {
            this.isReasonFirst = true;
            this.selectedReason.setValue(this.reasons);
            this.isReasonFirst = false;
          }
          this.isReasonFirst = false;
        }, 300)
        }
      }
    }
  }
}
