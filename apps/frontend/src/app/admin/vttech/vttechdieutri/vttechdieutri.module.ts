import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VttechdieutriComponent } from './vttechdieutri.component';
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
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
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
    MatPaginatorModule,
    MatDatepickerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatChipsModule,
    MatSelectModule,
    RouterModule.forChild([
      {
        path: '', component: VttechdieutriComponent,    
      }
    ])
  ],
  declarations: [VttechdieutriComponent]
})
export class VttechdieutriModule { }


