import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalodanhgiaService } from './zalodanhgia.service';
import * as moment from 'moment';
import { ZaloznsService } from '../zalozns/zalozns.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { range } from 'rxjs';
@Component({
  selector: 'app-zalodanhgia',
  templateUrl: './zalodanhgia.component.html',
  styleUrls: ['./zalodanhgia.component.css']
})
export class ZalodanhgiaComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  SearchParams: any = {
    Batdau:moment().startOf('day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    event_name:'user_feedback',
    star:5,
    pageSize:10,
    pageNumber:0
  };
  LIST_CHI_NHANH:any=LIST_CHI_NHANH
  PagiLength:any
  pageSizeOptions:any[]=[5]
  Total:any
  SelectStar:any=5
  stars = 5; // Number of stars
  totalDanhgia = 0;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('myDiv') myDivRef!: ElementRef;
  constructor(
    private dialog: MatDialog,
    private _ZalodanhgiaService: ZalodanhgiaService,
    private _ZaloznsService: ZaloznsService,
  ) {
  }
  ngOnInit(): void {
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
    this._ZaloznsService.zaloznss$.subscribe((data:any)=>{
      if(data)
      {
        console.log(data);
        this.Total = data.totalCount  
        data.items.forEach((v:any) => {
          v.star = v.ResponWebHook.message.rate
        });
        data.items.sort((a:any,b:any)=>b.star-a.star)   
        this.FilterLists = this.Lists = data.items
      }

    })
  }
  onStarClick(index: number) {
   // this.SelectStar = index + 1;
    this.SearchParams.star = index + 1
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
   // this.FilterLists = this.Lists.filter((v)=>v.ResponWebHook.message.rate<=this.SearchParams.star)
  }
  Reload(){}
  
  CreateStart(item:any)
  {
    const result = Array.from({ length: item }, (_, i) => i + 1);
    return result
  }
  GetNameChinhanh(item:any,field:any)
  {
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v[field] == item) 
    return Chinhanh?.Title
  }
  ChoosenDate()
  {
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
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
    // const dialogRef = this.dialog.open(teamplate, {
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result=="true") {
    //     this._ZaloznsService.CreateZalodanhgia(this.Detail).subscribe()
    //   }
    // });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
  //   const dialogRef = this.dialog.open(teamplate, {});
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result=="true") {
  //       this._ZaloznsService.DeleteZalodanhgia(item.id).subscribe()
  //     }
  //   });
   }
  onPageChange(event:any)
  {
    console.log(event);
    this.SearchParams.pageSize=event.pageSize
    this.SearchParams.pageNumber=event.pageIndex
     console.log(this.SearchParams);
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
}
