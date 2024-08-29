import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { LoggerService } from './logger.service';
import * as moment from 'moment';
import { LIST_CHI_NHANH } from '../../shared/shared.utils';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  Total: any = 0
  SearchParams: any = { 
  Batdau: moment().startOf('day').toDate(), 
  Ketthuc: moment().endOf('day').toDate(),
  pageSize:9999 
};
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _LoggerService: LoggerService,
  ) {
  }
  displayedColumns: string[] = ['Title', 'Slug','Action', 'Mota', 'CreateAt'];
  
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this._LoggerService.searchLogger(this.SearchParams).subscribe()
    this._LoggerService.loggers$.subscribe((data: any) => {
      console.log(data);
      this.Total = data.totalCount
      this.pageSizeOptions = [10, 20, data.totalCount].filter(v => v <= data.totalCount);
      this.FilterLists = this.Lists = data.items

      this.dataSource = new MatTableDataSource(data.items);
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'Diachi': return item.Giohangs.Khachhang.Diachi;
          case 'Hoten': return item.Giohangs.Khachhang.Hoten;
          case 'SDT': return item.Giohangs.Khachhang.SDT;
          case 'Hinhthuc': return item.Thanhtoan.Hinhthuc;
          default: return item[property];
        }
      };
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  ChoosenDate() {
    this._LoggerService.searchLogger(this.SearchParams).subscribe()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._LoggerService.CreateLogger(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
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
