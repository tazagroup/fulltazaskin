import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTreeModule} from '@angular/material/tree';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import { NotificationsModule } from '../../shared/common/notifications/notifications.module';
import { ChatrealtimeModule } from '../../shared/common/chatrealtime/chatrealtime.module';
import { ProfileModule } from '../../shared/common/profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatTreeModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    NotificationsModule,
    ChatrealtimeModule,
    ProfileModule,
    RouterModule.forChild([
      {path:'',redirectTo:'lichhen',pathMatch:'full'},
      {
        path: '', component: MainpageComponent,
        children: [
          { path: 'khach-hang', loadChildren: () => import('../khachhang/khachhang.module').then(m => m.KhachhangModule)},
          { path: 'dich-vu', loadChildren: () => import('../dichvu/dichvu.module').then(m => m.DanhmucModule)},
          { path: 'cau-hinh', loadChildren: () => import('../cauhinh/cauhinh.module').then(m => m.CauhinhModule)},
          { path: 'danh-muc', loadChildren: () => import('../danhmuc/danhmuc.module').then(m => m.DanhmucModule)},
          { path: 'khachhangdanhgia', loadChildren: () => import('../khachhangdanhgia/khachhangdanhgia.module').then(m => m.KhachhangdanhgiaModule)},
          { path: 'lichhen', loadChildren: () => import('../lichhen/lichhen.module').then(m => m.LichhenModule)},
          { path: 'zalozns', loadChildren: () => import('../zalo/zalozns/zalozns.module').then(m => m.ZaloznsModule)},
          { path: 'zalotoken', loadChildren: () => import('../zalo/zalotoken/zalotoken.module').then(m => m.ZalotokenModule)},
          { path: 'usergroup', loadChildren: () => import('../users/usergroup/usergroup.module').then(m => m.UsergroupModule)},
          { path: 'users', loadChildren: () => import('../users/users/users.module').then(m => m.UsersModule)},
      ]
      }
    ])
  ],
  declarations: [MainpageComponent]
})
export class MainpageModule { }
