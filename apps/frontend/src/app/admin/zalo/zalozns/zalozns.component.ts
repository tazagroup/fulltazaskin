import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZaloznsService } from './zalozns.service';
import { GenId, TYPE_TEMPLATE, TYPE_ZNS, ZALO_OA, convertPhoneNum } from '../../../shared/shared.utils';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { ZalotokenService } from '../zalotoken/zalotoken.service';
import * as moment from 'moment';
@Component({
  selector: 'app-zalozns',
  templateUrl: './zalozns.component.html',
  styleUrls: ['./zalozns.component.css']
})
export class ZaloznsComponent implements OnInit {
  Detail: any = {};
  SelectChinhanh:any={}
  ZNS: any = {Data:{}};
  Lists: any[] = []
  FilterLists: any[] = []
  ZaloTokens: any[] = []
  ZaloToken: any
  Teamplates: any[] = []
  Teamplate: any = {}
  TypeTeamplates:any = TYPE_TEMPLATE
  TypeTeamplate:any ={}
  isShowDemo:boolean = false
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _ZaloznsService: ZaloznsService,
    private _ZalotokenService: ZalotokenService,
    private sanitizer: DomSanitizer
  ) {
  }
  ngOnInit(): void {
    this.TypeTeamplate = "user_received_message",
    this._ZalotokenService.getAllZalotokens().subscribe()
    this._ZalotokenService.zalotokens$.subscribe((data)=>{if(data){
      this.ZaloTokens=data
      console.log(data);  
    }})
    this._ZaloznsService.getPaginaZaloznss(1,10).subscribe()
    this._ZaloznsService.zaloznss$.subscribe((data: any) => {
      if(data)
      {
        console.log(data.data);
        this.Lists = data.data
        this.FilterLists  = this.Lists.filter((v:any)=>v.event_name==this.TypeTeamplate)
      }

    })
  }
  onTemplateChange(event: MatSelectChange) {
    this._ZaloznsService.getteamplatedetail(event.value,this.ZaloToken).subscribe()
    this._ZaloznsService.teamplate$.subscribe((data: any) => {
      if (data) {
        if(data)
        {
          console.log(this.ZNS);
          
          console.log(data);
         this.ZNS.tracking_id = `${this.ZNS.template_id}${(new Date()).getTime()}`
          this.Teamplate = data.data
        }
      }
    })

  }
  onChinhanhChange(event: MatSelectChange) {
    console.log(event.value);
    
    this._ZaloznsService.getallteamplate(event.value).subscribe()
    this._ZaloznsService.teamplates$.subscribe((data: any) => {
      if (data) {
        console.log(data);
        
        this.Teamplates = data.data  
        this.ZaloToken = data.token      
      }
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
  ChangeTemp(event:MatSelectChange) {
    console.log(event);
    console.log(this.Lists);
    
    this.FilterLists = this.Lists.filter((v)=>v.event_name==event.value)
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result = "true") {
        this._ZaloznsService.CreateZalozns(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._ZaloznsService.DeleteZalozns(item.id).subscribe()
      }
    });
  }
  GetTypeZns(item: any) {
    return TYPE_ZNS(item)
  }
  GetZaloOa(item: any) {
    return ZALO_OA(item)
  }
  SendZns(item: any) {
    console.log(item);
    console.log(this.ZaloToken);
    
    const data =
    {
      "token":this.ZaloToken,
      "mode": "development",
      "phone": convertPhoneNum(item.SDT),
      "template_id": item.template_id,
      "template_data": item.Data,
      "tracking_id": item.tracking_id
    }
    console.log(data);
    this._ZaloznsService.sendZns(data).subscribe((result) => console.log(result))
  }
  iframe(item: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(item)
  }
}
