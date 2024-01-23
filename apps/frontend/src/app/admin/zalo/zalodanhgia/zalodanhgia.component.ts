import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalodanhgiaService } from './zalodanhgia.service';
import * as moment from 'moment';
import { ZaloznsService } from '../zalozns/zalozns.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { range } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
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
        data.items.sort((a:any,b:any)=>b.star-a.star)   
        data.items.forEach((v:any) => {
         v.Ngaygui = moment(Number(v.submitDate)).format('HH:mm:ss DD/MM/YYYY');
        });((a:any,b:any)=>b.star-a.star)   
        this.FilterLists = this.Lists = data.items
      }

    })
  }
  onStarClick(index: number) {
    this.SearchParams.star = index + 1
    this.SearchParams.pageNumber = 0
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
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
    this.SearchParams.pageNumber = 0
    this.SearchParams.Batdau=moment(this.SearchParams.Batdau).startOf('day').toDate(),
    this.SearchParams.Ketthuc= moment(this.SearchParams.Ketthuc).endOf('day').toDate(),
    console.log(this.SearchParams);
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
    if (value.length > 2) {
      this.FilterLists = this.Lists.filter((v) => {
     return v.SDT.toLowerCase().includes(value)
       }
      )
    }
    else {
      this.FilterLists = this.Lists
    }
  }
  onChangeCN(event:MatSelectChange)
  {
    this.SearchParams.BranchID=event.value
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  onPageChange(event:any)
  {
    console.log(event);
    this.SearchParams.pageSize=event.pageSize
    this.SearchParams.pageNumber=event.pageIndex
     console.log(this.SearchParams);
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  Capnhatdanhgia()
  {
    
  }
}
