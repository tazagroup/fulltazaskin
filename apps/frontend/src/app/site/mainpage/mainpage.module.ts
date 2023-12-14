import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTreeModule} from '@angular/material/tree';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {     path: '', component: MainpageComponent,
      children: [
        { path: 'khach-hang', loadChildren: () => import('../../admin/khachhang/khachhang.module').then(m => m.KhachhangModule)},
        { path: 'khachhangdanhgia', loadChildren: () => import('../../admin/khachhangdanhgia/khachhangdanhgia.module').then(m => m.KhachhangdanhgiaModule)},
        { path: 'lichhen', loadChildren: () => import('../../admin/lichhen/lichhen.module').then(m => m.LichhenModule)},
        { path: 'zalozns', loadChildren: () => import('../../admin/zalo/zalozns/zalozns.module').then(m => m.ZaloznsModule)},
    ]

    //   children: [
    //     { path: 'khach-hang', loadChildren: () => import('../khachhang/khachhang.module').then(m => m.KhachhangModule)},
    //     { path: 'khachhangdanhgia', loadChildren: () => import('../khachhangdanhgia/khachhangdanhgia.module').then(m => m.KhachhangdanhgiaModule)},
    //     { path: 'lichhen', loadChildren: () => import('../lichhen/lichhen.module').then(m => m.LichhenModule)},
    //     { path: 'zalozns', loadChildren: () => import('../zalo/zalozns/zalozns.module').then(m => m.ZaloznsModule)},
    // ]
  }
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
