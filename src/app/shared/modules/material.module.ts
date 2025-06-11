import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

const MaterialComponents = [
  MatDatepickerModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatCheckboxModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatBadgeModule,
  MatDialogModule,
  MatCardModule,
  MatTabsModule,
  MatGridListModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatMenuModule,
];
@NgModule({
  declarations: [],
  imports: [
    MaterialComponents
  ],
  exports: [
    MaterialComponents
  ]

})
export class MaterialModule { }
