import { Injectable } from '@angular/core';
import { ReportType } from '../models/report-type.model';

@Injectable({ providedIn: 'root' })
export class ReportTypeService {
  /** Report types available when searching reports. */
  readonly searchTypes: ReadonlyArray<ReportType> = [
    { value: 'SAB Initial Report', name: 'التقرير الأولى لديوان المحاسبة Initial Report' },
    { value: 'SAB Commentary Report', name: 'تقرير التبليغ SAB Commentary Report' },
    { value: 'KNPC Response Report', name: 'الرد على التقرير الأولى لديوان المحاسبة Initial Response Report' },
    { value: 'SAB Quarterly Report Q1', name: 'التقرير الربع سنوى الأول  Q1' },
    { value: 'SAB Quarterly Report Q2', name: 'التقرير الربع سنوى الثاني Q2' },
    { value: 'SAB Quarterly Report Q3', name: 'التقرير الربع سنوى الثالت Q3' },
    { value: 'SAB Quarterly Report Q4', name: 'التقرير الربع سنوى الرابع Q4' },
    { value: 'SAB Semi-annual Report 1', name: 'التقرير النصف سنوى الأول SA1' },
    { value: 'SAB Semi-annual Report 2', name: 'التقرير النصف سنوى الثاني SA2' },
    { value: 'KNPC Final Report', name: 'ا التقرير النهائي KNPC Final Report' },
    { value: 'Annual Report', name: 'التقرير السنوي' },
    { value: 'Seriousness of notes taken', name: 'جدية تسوية الملاحظات' },
  ];
}
