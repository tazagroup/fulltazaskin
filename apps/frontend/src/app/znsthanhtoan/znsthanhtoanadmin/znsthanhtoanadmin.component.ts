import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MaterialModule } from 'apps/frontend/src/app/shared/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ZnsthanhtoanService } from '../znsthanhtoan.service';
import * as moment from 'moment';
import { ChinhanhService } from '../../admin/cauhinh/chinhanh/chinhanh.service';
import { Status, Style, Style1, findDuplicateOccurrences, mergeNoDup } from '../../shared/shared.utils';
@Component({
  selector: 'app-znsthanhtoanadmin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MatSidenavModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MaterialModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './znsthanhtoanadmin.component.html',
  styleUrls: ['./znsthanhtoanadmin.component.css'],
})
export class ZnsthanhtoanadminComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = [];
  FilterLists: any[] = [];
  ListChiNhanh: any[] = [];
  Sitemap: any = { loc: '', priority: '' };
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  displayedColumns: string[] = [
    'CustName',
    'CustPhone',
    'Code',
    'Paid',
    'Chinhanh',
    'Created',
    'Status',
    'ZNS',
    'SMS',
  ];
  dataSource!: MatTableDataSource<any>;
  SearchParams: any = {
    CreatedBegin: moment().format('YYYY-MM-DD'),
    CreatedEnd: moment().format('YYYY-MM-DD'),
    pageSize:9999,
    pageNumber:0,
    Status:9999,
    BranchID:9999
  };
  ListStatus: any = Status;
  Style: any = Style1;
  isDelete:boolean =false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private _Notification: NotifierService,
    private _ZnsthanhtoanService: ZnsthanhtoanService,
    private _ChinhanhService: ChinhanhService
  ) {}
  ngOnInit(): void {
    this.ChangeSearchParams()
    //this._ZnsthanhtoanService.searchZnsthanhtoan(this.SearchParams).subscribe()
    this._ChinhanhService.getAllChinhanhs().subscribe()
    this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
      this.ListChiNhanh = chinhanhs;
      if (chinhanhs && chinhanhs.length > 0) {
        this._ZnsthanhtoanService.znsthanhtoans$.subscribe((data: any) => {
          if (data) {
            console.log(data);
            data.forEach((v: any) => {
              v.Chinhanh = chinhanhs.find(
                (c: any) => c.idVttech === v.BranchID
              )?.Title;
            });
            this.FilterLists = this.Lists = data;
            this.dataSource = new MatTableDataSource(this.FilterLists);
            console.log(this.FilterLists);
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch(property) {
                case 'ZNS': return item.ZNSData.status;
                case 'SMS': return item.SMSData.status;
                default: return item[property];
              }
            };
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
      }
    });
  }

  FillDup() {
    this.isDelete = !this.isDelete
    if(this.isDelete)
    {
      this.FilterLists = findDuplicateOccurrences(this.Lists,'Code');
    } else {
      this.FilterLists = this.Lists
    }
    this.dataSource = new MatTableDataSource(this.FilterLists);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  FillDupPhone() {
    this.FilterLists = findDuplicateOccurrences(this.Lists,'CustPhone');
    this.dataSource = new MatTableDataSource(this.FilterLists);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  RemoveDup() {
    this.FilterLists = mergeNoDup(this.FilterLists,this.FilterLists,'Code')
    this.FilterLists.forEach((v:any) => {
      this._ZnsthanhtoanService.DeleteZnsthanhtoan(v.id).subscribe(()=>{ this.isDelete = false});
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log(this.dataSource.filteredData);
  }
  ChangeSearchParams() {
    this.SearchParams.BranchID==9999?delete this.SearchParams.BranchID: this.SearchParams.BranchID
    this.SearchParams.Status==9999?delete this.SearchParams.Status: this.SearchParams.Status
    this._ZnsthanhtoanService.searchZnsthanhtoan(this.SearchParams).subscribe()
  }
  GetStype(item: any) {
    return this.Style[item];
  }
  CountStatus(item: any) {
    const result = this.FilterLists.filter((v: any) => v.Status == item);
    return result.length;
  }
  openDialog(teamplate: TemplateRef<any>): void {
    //   const dialogRef = this.dialog.open(teamplate, {
    //   });
    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       this.VttechthanhtoanService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
    //     }
    //   });
  }
}
