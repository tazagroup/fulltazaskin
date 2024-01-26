import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { LoggerService } from './logger.service';
import * as moment from 'moment';
import { LIST_CHI_NHANH } from '../../shared/shared.utils';
@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  pageSizeOptions: any[] = []
  LIST_CHI_NHANH = LIST_CHI_NHANH
  Total:any=0
  SearchParams: any = {Batdau:moment().startOf('day').toDate(),Ketthuc: moment().endOf('day').toDate()};
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _LoggerService: LoggerService,
  ) {
  }
  ngOnInit(): void {
    this._LoggerService.searchLogger(this.SearchParams).subscribe()
    this._LoggerService.loggers$.subscribe((data:any)=>{
      console.log(data);
      this.Total = data.totalCount
      this.pageSizeOptions = [10, 20, data.totalCount].filter(v => v <= data.totalCount);
      this.FilterLists = this.Lists = data.items
    })
  }
  ChoosenDate()
  {
    this._LoggerService.searchLogger(this.SearchParams).subscribe()
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.SearchParams.Title = value
      this._LoggerService.searchLogger(this.SearchParams).subscribe()
      // this.Lists = this.Lists.filter((v) => {
      //   return  v.Hoten.toLowerCase().includes(value)||v.SDT.toLowerCase().includes(value)
      //  }
      // )
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._LoggerService.CreateLogger(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._LoggerService.DeleteLogger(item.id).subscribe()
      }
    });
  }
  GetNameChinhanh(item: any) {
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == item)
    return Chinhanh?.Title
  }
  onPageChange(event: any) {
    console.log(event);
    this.SearchParams.pageSize = event.pageSize
    this.SearchParams.pageNumber = event.pageIndex
    this._LoggerService.searchLogger(this.SearchParams).subscribe()
  }
}
