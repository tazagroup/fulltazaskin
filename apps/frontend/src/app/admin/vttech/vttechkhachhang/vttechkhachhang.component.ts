import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { VttechkhachhangService } from './vttechkhachhang.service';
import * as moment from 'moment';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-vttechkhachhang',
  templateUrl: './vttechkhachhang.component.html',
  styleUrls: ['./vttechkhachhang.component.css']
})
export class VttechkhachhangComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  ListChiNhanh:any = LIST_CHI_NHANH
  PagiLength:any=0
  SearchParams: any = {
    Batdau:moment().startOf('day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    pageSize:10,
    pageNumber:0
  };
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _VttechkhachhangService: VttechkhachhangService,
  ) {
  }
  ngOnInit(): void {
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
    this._VttechkhachhangService.vttechkhachhangs$.subscribe((data:any)=>{    
      if(data)
      {
        console.log(data);
        data.items.forEach((v:any) => {
          if (typeof v.Dulieu !== 'object')
          {
            v.Dulieu = JSON.parse(v.Dulieu)
          }
        });
        this.PagiLength = (Number(data.totalCount)/Number(this.SearchParams.pageSize)).toFixed()
        this.FilterLists = this.Lists = data.items
      }  

    })
  }
  ChoosenDate()
  {
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
  }
  applyFilter(event: Event,field:any) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.SearchParams[field] = value
      this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
    }
  }
  onSelectChange(event: MatSelectChange) {
    this.SearchParams.idCN = event.value
    console.log(this.SearchParams);
    
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._VttechkhachhangService.CreateVttechkhachhang(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._VttechkhachhangService.DeleteVttechkhachhang(item.id).subscribe()
      }
    });
  }
  onPageChange(event:any)
  {
    this.SearchParams.pageSize=event.pageSize
     this.SearchParams.pageNumber=event.pageIndex
     this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
  }
}
