import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './shared/auth/guards/auth.guard';
import { NotifierModule } from 'angular-notifier';
import { AuthService } from './shared/auth/auth.service';
import { UsersInterceptor } from './shared/auth/users.interceptor';
import { GuestGuard } from './shared/auth/guards/guest.guard';
import { DangkyComponent } from './shared/dangky/dangky.component';
import { DangnhapComponent } from './shared/dangnhap/dangnhap.component';
import { SendercodeComponent } from './shared/dangky/sendercode/sendercode.component';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminGuard } from './shared/auth/guards/admin.guard';
import { AuthModule } from './shared/auth/auth.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    DangnhapComponent,
    SendercodeComponent,
    DangkyComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NotifierModule,
    AuthModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12,
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10,
        },
      },
      theme: 'material',
      behaviour: {
        autoHide: 5000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4,
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease',
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50,
        },
        shift: {
          speed: 300,
          easing: 'ease',
        },
        overlap: 150,
      },
    }),
    RouterModule.forRoot([
      // {path:'',redirectTo:'admin',pathMatch:"full"},
      { path: '', 
      canActivate: [AuthGuard],
      loadChildren: () => import('./site/mainpage/mainpage.module').then(m => m.MainpageModule)},
      { path: 'admin',       
      canActivate: [AdminGuard],
       loadChildren: () => import('./admin/mainpage/mainpage.module').then(m => m.MainpageModule)},
       {
        path: 'dangnhap',
        canActivate: [GuestGuard],
        canActivateChild: [GuestGuard],
        component: DangnhapComponent,
      },
      {
        path: 'dangky',
        canActivate: [GuestGuard],
        canActivateChild: [GuestGuard],
        component: DangkyComponent,
      },
      {
        path: 'sendercode',
        canActivate: [GuestGuard],
        canActivateChild: [GuestGuard],
        component: SendercodeComponent,
      },
      // { path: 'cauhinh', loadChildren: () => import('./site/cauhinh/cauhinh.module').then(m => m.CauhinhModule)},
      // { path: '', component: cauhin },
      // { path: 'path', component: FeatureComponent },
      // { path: '**', component: PageNotFoundComponent },
    ]),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: UsersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

