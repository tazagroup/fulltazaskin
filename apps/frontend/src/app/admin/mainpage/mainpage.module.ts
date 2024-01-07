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
      {path:'',redirectTo:'vttechthanhtoan',pathMatch:'full'},
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
          { path: 'zalodanhgia', loadChildren: () => import('../zalo/zalodanhgia/zalodanhgia.module').then(m => m.ZalodanhgiaModule) },
          { path: 'usergroup', loadChildren: () => import('../users/usergroup/usergroup.module').then(m => m.UsergroupModule)},
          { path: 'users', loadChildren: () => import('../users/users/users.module').then(m => m.UsersModule)},
          { path: 'vttechthanhtoan', loadChildren: () => import('../vttech/vttechthanhtoan/vttechthanhtoan.module').then(m => m.VttechthanhtoanModule)},
          { path: 'vttechkhachhang', loadChildren: () => import('../vttech/vttechkhachhang/vttechkhachhang.module').then(m => m.VttechkhachhangModule)},
          { path: 'vttechdieutri', loadChildren: () => import('../vttech/vttechdieutri/vttechdieutri.module').then(m => m.VttechdieutriModule)},
          { path: 'sms', loadChildren: () => import('../baocao/sms/sms.module').then(m => m.SmsModule)},
          { path: 'logger', loadChildren: () => import('../logger/logger.module').then(m => m.LoggerModule)},
      ]
      }
    ])
  ],
  declarations: [MainpageComponent]
})
export class MainpageModule { }
