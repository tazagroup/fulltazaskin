import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MaterialModule } from '../../shared/material.module';
import { NotificationsModule } from '../../shared/common/notifications/notifications.module';
import { ProfileModule } from '../../shared/common/profile/profile.module';
import { ChatrealtimeModule } from '../../shared/common/chatrealtime/chatrealtime.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NotificationsModule,
    ProfileModule,
    ChatrealtimeModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'khach-hang', pathMatch: 'full' },
      {
        path: '', component: MainpageComponent,
        children: [
          { path: 'khach-hang', loadChildren: () => import('../../admin/khachhang/khachhang.module').then(m => m.KhachhangModule) },
          { path: 'khachhangdanhgia', loadChildren: () => import('../../admin/khachhangdanhgia/khachhangdanhgia.module').then(m => m.KhachhangdanhgiaModule) },
          { path: 'lichhen', loadChildren: () => import('../../admin/lichhen/lichhen.module').then(m => m.LichhenModule) },
          { path: 'zalozns', loadChildren: () => import('../../admin/zalo/zalozns/zalozns.module').then(m => m.ZaloznsModule) },
    
        ]
      }
    ])
  ],
  declarations: [MainpageComponent]
})
export class MainpageModule { }
