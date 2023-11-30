import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: () => import('./site/mainpage/mainpage.module').then(m => m.MainpageModule)},
      { path: 'admin', loadChildren: () => import('./admin/mainpage/mainpage.module').then(m => m.MainpageModule)},
      // { path: 'cauhinh', loadChildren: () => import('./site/cauhinh/cauhinh.module').then(m => m.CauhinhModule)},
      // { path: '', component: cauhin },
      // { path: 'path', component: FeatureComponent },
      // { path: '**', component: PageNotFoundComponent },
    ]),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

