import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalotokenService } from './zalotoken.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';
import { ZalodanhgiaService } from '../zalodanhgia/zalodanhgia.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
@Component({
  selector: 'app-zalotoken',
  templateUrl: './zalotoken.component.html',
  styleUrls: ['./zalotoken.component.css']
})
export class ZalotokenComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  Today: any = new Date()
  ListChiNhanh:any=LIST_CHI_NHANH
  SearchParams: any = {
    Batdau:moment().startOf('day').add(-1,'day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
  };
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _ZalotokenService: ZalotokenService,
    private activatedRoute: ActivatedRoute,
    private _NotifierService: NotifierService,
    private _ZalodanhgiaService: ZalodanhgiaService
  ) {
  }
  ngOnInit(): void {
    console.log();
    
    // moment.locale('vi');
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.oa_id) {
        const data:any = {
          oa_id: params.oa_id,
          code: params.code,
          app_id: this.ListChiNhanh.find((v:any)=>v.oa_id==params.oa_id)?.app_id,
          secret_key: this.ListChiNhanh.find((v:any)=>v.oa_id==params.oa_id)?.secret_key
        }
        this._ZalotokenService.get_accesstoken(data).subscribe((res: any) => {
          console.log(res)
          if (res.status == 200) {
            this._NotifierService.notify("success", res.note)
          }
          else {
            this._NotifierService.notify("error", res.note)
          }
          setTimeout(() => {
            window.location.href = window.location.pathname
          }, 1000);
        }
        )
      }
    });
    this._ZalotokenService.getAllZalotokens().subscribe()
    this._ZalotokenService.zalotokens$.subscribe((data: any) => {      
      this.FilterLists = this.Lists = data
      console.log(data);
      
    })
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.Lists = this.Lists.filter((v) => {
        return v.Hoten.toLowerCase().includes(value) || v.SDT.toLowerCase().includes(value)
      }
      )
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._ZalotokenService.CreateZalotoken(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._ZalotokenService.DeleteZalotoken(item.id).subscribe()
      }
    });
  }
  Xacthuc(data:any) {
    const app_id =  this.ListChiNhanh.find((v:any)=>v.oa_id==data.oa_id)?.app_id
    window.location.href = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${app_id}&redirect_uri=https://zalo.tazaskinclinic.com/admin/zalotoken`
  }
  Checktime(timein: Date, timeout: Date) {
    let result = { message: 'Chưa Xác Thực', status: false, text: 'text-red-500' }
    if (timein && timeout) {
      const milliseconds = timein.getTime() - (new Date(timeout)).getTime()
      if (milliseconds > 0)
        result = { message: 'Hết Hạn', status: true, text: 'text-red-500' }
      else {
        result = { message: `Còn Hạn Đến ${moment(timeout).format("hh:mm:ss DD/MM/YYYY")}`, status: true, text: 'text-blue-500' }
      }
      return result
    }
    else return result
  }
  getrefreshToken(item: any) {
    console.log(item);
    const data = {
      oa_id: item.oa_id,
      // app_id: environment.app_id,
      // secret_key: environment.secret_key,
      app_id: this.ListChiNhanh.find((v:any)=>v.oa_id==item.oa_id)?.app_id,
      secret_key: this.ListChiNhanh.find((v:any)=>v.oa_id==item.oa_id)?.secret_key,
      refresh_token: item.Token.refresh_token
    }
    this._ZalotokenService.get_refreshToken(data).subscribe((res: any) => {
      if (res.status == 200) {
        this._NotifierService.notify("success", res.note)
        setTimeout(() => {
          window.location.href = window.location.pathname
        }, 1000);
      }
      else {
        this._NotifierService.notify("error", res.note)

      }
    })
  }
  async RefreshAllToken() {
  const promises  =  this.FilterLists.map((item:any)=>
    {
      const data = {
        oa_id: item.oa_id,
        // app_id: environment.app_id,
        // secret_key: environment.secret_key,
        app_id: this.ListChiNhanh.find((v:any)=>v.oa_id==item.oa_id)?.app_id,
        secret_key: this.ListChiNhanh.find((v:any)=>v.oa_id==item.oa_id)?.secret_key,
        refresh_token: item.Token.refresh_token
      }
      this._ZalotokenService.get_refreshToken(data).subscribe((res: any) => {
        if (res.status == 200) {
        }
        else {
          this._NotifierService.notify("error", res.note)
        }
      })
    })
    await Promise.all(promises);
    this._NotifierService.notify("success", "Cập Nhật Thành Công")
    setTimeout(() => {
      window.location.href = window.location.pathname
    }, 1000);
  }
  async GetAllFromZalo()
  {
    const promises  =  this.FilterLists.map((data:any,k:any)=>
    {
      console.log(data);
      const Chinhanh = LIST_CHI_NHANH.find((v)=>v.idtoken==data.id)
      let template_id=''
      const TAZA_BRANCH_IDS = [1, 2, 3, 4, 6, 7];
      const TIMONA_BRANCH_IDS = [7,14, 15, 16, 17, 18, 21];  
      const isTazaBranch = TAZA_BRANCH_IDS.includes(Number(Chinhanh.idVttech));
      const isTimonaBranch = TIMONA_BRANCH_IDS.includes(Number(Chinhanh.idVttech));
      if (isTazaBranch) {
        template_id = Chinhanh.idtempdanhgia    
      } else if (isTimonaBranch) {
        template_id = Chinhanh.iddanhgiatimona    
      }      
      const item:any =
      {
        "access_token":data.Token.access_token,
        "template_id":template_id,
        "begin":moment(this.SearchParams.Batdau).add().format('YYYY-MM-DD'),
        "end":moment(this.SearchParams.Ketthuc).format('YYYY-MM-DD')
       }
      this._ZalodanhgiaService.GetFromZalo(item).subscribe((result)=>
      {
       setTimeout(() => {
        this._NotifierService.notify("success",`Cập Nhật Thành Công ${data.Title} - ${result.data.total}`)
        }, Math.random()*(k+10)*1000); 
       
      })
    })
    // await Promise.all(promises);
    // this._NotifierService.notify("success", "Cập Nhật Thành Công")
    // setTimeout(() => {
    //   window.location.href = window.location.pathname
    // }, 1000); 
  }

  GetFromZalo(data:any)
  {
    console.log(data);
    const Chinhanh = LIST_CHI_NHANH.find((v)=>v.idtoken==data.id)
    let template_id=''
    const TAZA_BRANCH_IDS = [1, 2, 3, 4, 6, 7];
    const TIMONA_BRANCH_IDS = [7,14, 15, 16, 17, 18, 21];  
    const isTazaBranch = TAZA_BRANCH_IDS.includes(Number(Chinhanh.idVttech));
    const isTimonaBranch = TIMONA_BRANCH_IDS.includes(Number(Chinhanh.idVttech));
    if (isTazaBranch) {
      template_id = Chinhanh.idtempdanhgia    
    } else if (isTimonaBranch) {
      template_id = Chinhanh.iddanhgiatimona    
    }      
    const item:any =
    {
      "access_token":data.Token.access_token,
      "template_id":template_id,
      "begin":moment(this.SearchParams.Batdau).add().format('YYYY-MM-DD'),
      "end":moment(this.SearchParams.Ketthuc).format('YYYY-MM-DD')
     }
    this._ZalodanhgiaService.GetFromZalo(item).subscribe((data)=>
    {
      console.log(data);
      
      this._NotifierService.notify("success","Cập Nhật Thành Công "+data.data.total)
    })
  }
}
