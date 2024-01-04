import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalodanhgiaService } from './zalodanhgia.service';
import * as moment from 'moment';
import { ZaloznsService } from '../zalozns/zalozns.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { range } from 'rxjs';
import { ViewportScroller } from '@angular/common';
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
    pageSize:10,
    pageNumber:0
  };
  LIST_CHI_NHANH:any=LIST_CHI_NHANH
  PagiLength:any
  Total:any
  SelectStar:any=5
  stars = 5; // Number of stars
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('myDiv') myDivRef!: ElementRef;
  constructor(
    private dialog: MatDialog,
    private _ZalodanhgiaService: ZalodanhgiaService,
    private _ZaloznsService: ZaloznsService,
    private viewportScroller: ViewportScroller
  ) {
  }
  ngOnInit(): void {
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
    this._ZaloznsService.zaloznss$.subscribe((data:any)=>{
      if(data)
      {
        console.log(data);
        this.Total = data.totalCount
        this.PagiLength = (Number(data.totalCount)/Number(this.SearchParams.pageSize)).toFixed()        
        this.FilterLists = this.Lists = data.items
        console.log(this.Lists);
      }

    })
  }
  ngAfterViewInit() {
    // Ensure element is rendered before scrolling
    setTimeout(() => {
      this.viewportScroller.scrollToAnchor(this.myDivRef.nativeElement);
    });
  }
  onStarClick(index: number) {
    this.myDivRef.nativeElement.scrollTo({ top: 0 });
    this.SelectStar = index + 1;
    console.log(index, this.SelectStar);
    this.FilterLists = this.Lists.filter((v)=>v.ResponWebHook.message.rate<=this.SelectStar)
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
     this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
}
