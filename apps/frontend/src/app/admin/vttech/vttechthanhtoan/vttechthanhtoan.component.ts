import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-vttechthanhtoan',
  templateUrl: './vttechthanhtoan.component.html',
  styleUrls: ['./vttechthanhtoan.component.css']
})
export class VttechthanhtoanComponent implements OnInit {
  Detail: any = {};
  SearchParams: any = {
    Batdau:moment().startOf('day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    pageSize:10,
    pageNumber:0
  };
  Lists: any[] = []
  FilterLists: any[] = []
  LIST_CHI_NHANH = LIST_CHI_NHANH
  ListStatus:any
  Status:any={0:'Mới',1:'Đợi gửi',2:'Thành Công',3:'Chưa Có Temp Zalo OA',4:'Gửi SMS'}
  // Status:any={0:'Mới',2:'Thành Công',3:'Chưa Có Temp Zalo OA',4:'Gửi SMS'}
  Style:any={0:'bg-blue-500',1:'bg-yellow-500',2:'bg-green-500',3:'bg-red-500',4:'bg-purple-500'}
  isReport:boolean=false
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  PagiLength:any=0
  StatusActive:any
  Total:any=0
  constructor(
    private dialog: MatDialog,
    private _VttechthanhtoanService: VttechthanhtoanService,
  ) {
  }
  ngOnInit(): void {
    this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
    this._VttechthanhtoanService.vttechthanhtoans$.subscribe((data:any)=>{
      if(data)
      {     
        this.Total = data.totalCount   
        this.ListStatus = data.ListStatus   
        // data.items.forEach((v:any) => {
        //   if (typeof v.Dulieu !== 'object')
        //   {
        //     v.Dulieu = JSON.parse(v.Dulieu)
        //   }
        // });
        this.PagiLength = (Number(data.totalCount)/Number(this.SearchParams.pageSize)).toFixed()
        this.FilterLists = this.Lists = data.items
      }
    })
  }
  LoadServer()
  {
      const data = {begin:this.SearchParams.Batdau,end:this.SearchParams.Ketthuc}
      this._VttechthanhtoanService.LoadServer(data).subscribe()
  }
  Reload()
  {
      delete this.SearchParams.Status
      this.SearchParams.pageSize = 10
      this.SearchParams.Batdau=moment().startOf('day').toDate(),
      this.SearchParams.Ketthuc= moment().endOf('day').toDate(),
      this.SearchParams.pageNumber=0
      this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
  }
  Report(items:any,field:any)
  {
    if(items)
    {
      return items.filter((v:any)=>v.Status == field)?.length
    }
    else return 0

  }
  SendZNS(item:any)
  {
    console.log(item);
    item.DukienZNS = moment().add(+1,'minutes').toDate()
    this._VttechthanhtoanService.SendZns(item).subscribe()  
  }
  ChoosenDate()
  {
    console.log(this.SearchParams);
    this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
  }
  ChangeStatus(event:MatSelectChange)
  {
    console.log(this.SearchParams);
    this.SearchParams.Status = event.value
    this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
  }
  ChangeStatusButton(item:any)
  {
    console.log(item);
    console.log(this.SearchParams);
    
    this.StatusActive = item
    this.SearchParams.Status = item
    this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
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
      if (result="true") {
        this._VttechthanhtoanService.CreateVttechthanhtoan(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._VttechthanhtoanService.DeleteVttechthanhtoan(item.id).subscribe()
      }
    });
  }
  GetNameChinhanh(item:any)
  {
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == item) 
    return Chinhanh?.Title
  }
  onPageChange(event:any)
  {
    console.log(event);
    
    this.SearchParams.pageSize=event.pageSize
     this.SearchParams.pageNumber=event.pageIndex
     this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
  }
}
