import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhachhangComponent } from './khachhang.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KhachhangChitietComponent } from './khachhang-chitiet/khachhang-chitiet.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from '../../shared/material.module';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { KhachhangdichvuComponent } from './khachhang-chitiet/khachhangdichvu/khachhangdichvu.component';
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return date.toLocaleDateString('vi-VI', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: KhachhangComponent,
        children: [{
          path: ':SDT', component: KhachhangChitietComponent,
          children: [
           { path: 'dichvu', loadChildren: () => import('./khachhang-chitiet/khachhangdichvu/khachhangdichvu.module').then(m => m.KhachhangdichvuModule) }, 
          ]
        }]
    
      }
    ])
  ],
  declarations: [KhachhangComponent,KhachhangChitietComponent],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
})
export class KhachhangModule { }
