import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatTableExporterModule } from 'mat-table-exporter';

const material = [
  MatFormFieldModule,
  MatButtonModule,
  MatListModule,
  MatSliderModule,
  MatCheckboxModule,
  MatInputModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatStepperModule,
  MatIconModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatSortModule,
  MatTableExporterModule,
  MatDividerModule,
  MatCardModule,
  MatDialogModule,
  MatTabsModule,
  MatTooltipModule,
  MatBottomSheetModule,
  MatChipsModule,
  MatTreeModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatProgressBarModule,
  MatExpansionModule
]

@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
