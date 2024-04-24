import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { VttechkhachhangService } from './vttechkhachhang.service';
import * as moment from 'moment';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
@Component({
  selector: 'app-vttechkhachhang',
  templateUrl: './vttechkhachhang.component.html',
  styleUrls: ['./vttechkhachhang.component.css']
})
export class VttechkhachhangComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  ListChiNhanh: any = LIST_CHI_NHANH
  PagiLength: any = 0
  SearchParams: any = {
    Batdau: moment().startOf('day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    pageSize: 9999,
    pageNumber: 0
  };
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  displayedColumns: string[] = ['Code', 'Name', 'SDT', 'SDT2', 'Chinhanh'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private _VttechkhachhangService: VttechkhachhangService,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this._ChinhanhService.getAllChinhanhs().subscribe()
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
    this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
      this.ListChiNhanh = chinhanhs
      if (chinhanhs && chinhanhs.length > 0) {
        this._VttechkhachhangService.vttechkhachhangs$.subscribe((data: any) => {
          if (data) {
            data.items.forEach((v: any) => {
              v.Chinhanh = chinhanhs.find((c: any) => c.idVttech === v.BranchID)?.Title;
            })
            this.FilterLists = this.Lists = data.items
            this.dataSource = new MatTableDataSource(data.items);
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'Diachi': return item.Giohangs.Khachhang.Diachi;
                case 'Hoten': return item.Giohangs.Khachhang.Hoten;
                case 'SDT': return item.Giohangs.Khachhang.SDT;
                case 'Hinhthuc': return item.Dieutri.Hinhthuc;
                default: return item[property];
              }
            };
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

        })
      }

    })
  }
  ChoosenDate() {
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
      if (result == "true") {
        this._VttechkhachhangService.CreateVttechkhachhang(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._VttechkhachhangService.DeleteVttechkhachhang(item.id).subscribe()
      }
    });
  }
  onPageChange(event: any) {
    this.SearchParams.pageSize = event.pageSize
    this.SearchParams.pageNumber = event.pageIndex
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
  }
}
