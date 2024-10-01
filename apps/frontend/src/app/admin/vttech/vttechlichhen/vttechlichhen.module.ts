import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VttechlichhenComponent } from './vttechlichhen.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ZnsdieutriadminComponent } from '../../../znsdieutri/znsdieutriadmin/znsdieutriadmin.component';
import { VttechlichhenlistComponent } from './vttechlichhenlist/vttechlichhenlist.component';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MatSidenavModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    RouterModule.forChild([
      { path: 'vttech', component: VttechlichhenlistComponent },
      { path: 'zns', component: ZnsdieutriadminComponent },
      // {
      //   path: '', component: VttechlichhenlistComponent,
      // }
      // {
      //   path: '', component: VttechlichhenComponent,
      // }
    ]),
  ],
  declarations: [VttechlichhenComponent],
})
export class VttechlichhenModule {}
