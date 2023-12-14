import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalotokenService } from './zalotoken.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-zalotoken',
  templateUrl: './zalotoken.component.html',
  styleUrls: ['./zalotoken.component.css']
})
export class ZalotokenComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  Today:any = new Date()
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _ZalotokenService: ZalotokenService,
    private activatedRoute: ActivatedRoute,
    private _NotifierService: NotifierService
  ) {
  }
  ngOnInit(): void {
    moment.locale('vi');
    this.activatedRoute.queryParams.subscribe((params:any) => {
      if(params.oa_id)
      {
        const data={
          oa_id:params.oa_id,
          code:params.code,
          app_id:environment.app_id,
          secret_key:environment.secret_key
        }
        this._ZalotokenService.get_accesstoken(data).subscribe((res:any)=>
        {
          console.log(res)
          if(res.status==200)
          {
            this._NotifierService.notify("success",res.note)
          }
          else
          {
            this._NotifierService.notify("error",res.note)
          }
          setTimeout(() => {
              window.location.href=window.location.pathname
          }, 1000);
        }
      )
      }
    });
    this._ZalotokenService.getAllZalotokens().subscribe()
    this._ZalotokenService.zalotokens$.subscribe((data:any)=>{
      this.FilterLists = this.Lists = data
    })
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.Lists = this.Lists.filter((v) => {
     return  v.Hoten.toLowerCase().includes(value)||v.SDT.toLowerCase().includes(value)
       }
      )
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._ZalotokenService.CreateZalotoken(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._ZalotokenService.DeleteZalotoken(item.id).subscribe()
      }
    });
  }
  Xacthuc()
  {
    window.location.href = "https://oauth.zaloapp.com/v4/oa/permission?app_id=1416835846626859002&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fadmin%2Fzalotoken"
  }
  Checktime(timein:Date,timeout:Date)
  {
    let result={message:'Chưa Xác Thực',status:false,text:'text-red-500'}
    if(timein&&timeout)
    {
      const milliseconds  = timein.getTime() - (new Date(timeout)).getTime()
      const seconds = Math.round(milliseconds / 1000);
      if(seconds>90000)
        result = {message:'Hết Hạn',status:true,text:'text-red-500'}
      else
        {
          result = {message:`Còn Hạn Đến ${moment(timeout).format("hh:mm:ss DD/MM/YYYY")}`,status:true,text:'text-blue-500'}
        }
      return result
    }
    else return result 
  }
  getrefreshToken(item:any)
  {
    console.log(item);
    const data={
      oa_id:item.oa_id,
      app_id:environment.app_id,
      secret_key:environment.secret_key,
      refresh_token:item.Token.refresh_token
    }
    this._ZalotokenService.get_refreshToken(data).subscribe((res:any)=>
    {
      if(res.status==200)
      {
        this._NotifierService.notify("success",res.note)
        setTimeout(() => {
          window.location.href=window.location.pathname
      }, 1000);
      }
      else
      {
        this._NotifierService.notify("error",res.note)
        
      }
    })
  }
}
