import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTreeModule} from '@angular/material/tree';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatTreeModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {     path: '', component: MainpageComponent}
      // {path:'',redirectTo:'khach-hang',pathMatch:'full'},
      // {
      //   path: '', component: MainpageComponent,
      //   children: [
      //     { path: 'khach-hang', loadChildren: () => import('../khachhang/khachhang.module').then(m => m.KhachhangModule)},
      //     { path: 'dich-vu', loadChildren: () => import('../dichvu/dichvu.module').then(m => m.DanhmucModule)},
      //     { path: 'cau-hinh', loadChildren: () => import('../cauhinh/cauhinh.module').then(m => m.CauhinhModule)},
      // ]
      // }
    ])
  ],
  declarations: [MainpageComponent]
})
export class MainpageModule { }
