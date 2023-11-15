import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path:'',redirectTo:'khach-hang',pathMatch:'full'},
      {
        path: '', component: MainpageComponent,
        children: [
          { path: 'khach-hang', loadChildren: () => import('../khachhang/khachhang.module').then(m => m.KhachhangModule)},
          { path: 'danh-muc', loadChildren: () => import('../danhmuc/danhmuc.module').then(m => m.DanhmucModule)},
          { path: 'cau-hinh', loadChildren: () => import('../cauhinh/cauhinh.module').then(m => m.CauhinhModule)},
      ]
      }
    ])
  ],
  declarations: [MainpageComponent]
})
export class MainpageModule { }
