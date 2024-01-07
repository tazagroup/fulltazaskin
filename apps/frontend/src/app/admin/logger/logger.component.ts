import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { LoggerService } from './logger.service';
import * as moment from 'moment';
@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  SearchParams: any = {Batdau:moment().startOf('day').toDate(),Ketthuc: moment().endOf('day').toDate()};
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _LoggerService: LoggerService,
  ) {
  }
  ngOnInit(): void {
    this._LoggerService.searchVttechthanhtoan(this.SearchParams).subscribe()
    this._LoggerService.loggers$.subscribe((data:any)=>{
      this.FilterLists = this.Lists = data.items
    })
  }
  ChoosenDate()
  {
    this._LoggerService.searchVttechthanhtoan(this.SearchParams).subscribe()
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
}
