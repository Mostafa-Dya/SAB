import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CoreService } from 'src/app/services/core.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedVariableService } from 'src/app/services/shared-variable.service';

export interface Years {
  value: string;
}

export interface ReportType {
  value: string;
  name: string;
}

@Component({
  selector: 'app-upload-reports',
  templateUrl: './upload-reports.component.html',
  styleUrls: ['./upload-reports.component.css']
})
export class UploadReportsComponent implements OnInit {
  isRtl: any;
  @ViewChild('userFile') userFile: ElementRef;
  selectedFile: File;
  isLoading: boolean = true;
  years: Years[] = [];
  
  reportType: ReportType[] = [
    // { value: 'Select Report Type', name: 'Select Report Type' },
    { value: 'SAB Initial Report', name: 'التقرير الأولى لديوان المحاسبة Initial Report' },
    // { value: 'SAB Final Report', name: 'التقرير  النهائي لديوان المحاسبة Final Rpt' },
    { value: 'SAB Commentary Report', name: "تقرير التبليغ SAB Commentary Report" },
    { value: 'KNPC Response Report', name: 'الرد على التقرير الأولى لديوان المحاسبة Initial Response Report' },
    { value: 'SAB Quarterly Report Q1', name: 'التقرير الربع سنوى الأول  Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'التقرير الربع سنوى الثاني Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'التقرير الربع سنوى الثالت Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'التقرير الربع سنوى الرابع Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'التقرير النصف سنوى الأول SA1' },
    { value: 'SAB Semi-annual Report 2', name: 'التقرير النصف سنوى الثاني SA2' },
    { value: 'KNPC Final Report', name: 'ا التقرير النهائي KNPC Final Report' },
    { value: 'Annual Report', name: 'التقرير السنوي' },
    { value: 'Seriousness of notes taken', name: 'جدية تسوية الملاحظات' }
  ];
  selectedYear: string;
  selectedReport: string;
  isFileSelected: boolean = true;

  constructor(
    private coreService: CoreService,
    private sharedVariableService: SharedVariableService,
    private _loading: LoadingService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.sharedVariableService.getRtlValue().subscribe((value) => {
      this.isRtl = value;
    });
    this.selectedReport = this.reportType[0].value;
    this.getReportYear();
  }

  getReportYear() {
    this.isLoading = true;
    let url = 'uploadReportController/getReportYears';
    this._loading.setLoading(true, url);
    this.coreService.get(url).subscribe(response => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      response.map((data: any) => {
        this.years.push({ value: data })
      })
      this.years.reverse();
      this.selectedYear = this.years[0].value;
    }, error => {
      this.isLoading = false;
      this._loading.setLoading(false, url);
      console.log('error :' , error);
    });
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.isFileSelected = true;
      let file: File = fileList[0];
      this.selectedFile = file;
    }
  }

  clearSelectedFile() {
    this.userFile.nativeElement.value = null;
    this.selectedFile = this.userFile.nativeElement.value;
  }

  onUploadReport() {
    if (!this.selectedFile) {
      this.isFileSelected = false;
    } else {
      this.isLoading = true;
      this.isFileSelected = true;
      let url = 'uploadReportController/uploadReports';
      this._loading.setLoading(true, url);
      let formData: FormData = new FormData();
      formData.append('year', this.selectedYear);
      formData.append('reportType', this.selectedReport);
      formData.append('attach', this.selectedFile);
      this.coreService.post(url, formData).subscribe((response: any) => {
        this.clearSelectedFile();
        this.notification.create('success', 'Success', response.message);
        this.isLoading = false;
        this._loading.setLoading(false, url);
      }, error => {
        this.notification.create('error', 'Error', error.message);
        this.isLoading = false;
        this._loading.setLoading(false, url);
        console.log('error :' , error);
      });
    }
  }
}
