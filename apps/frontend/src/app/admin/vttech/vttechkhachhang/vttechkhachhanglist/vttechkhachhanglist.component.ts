import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { VttechkhachhangService } from '../vttechkhachhang.service';
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
import { ChinhanhService } from '../../../cauhinh/chinhanh/chinhanh.service';
import * as moment from 'moment';
import { findDuplicateOccurrences, mergeNoDup, Status } from 'apps/frontend/src/app/shared/shared.utils';
@Component({
  selector: 'app-vttechkhachhanglist',
  standalone: true,
  imports:[
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
    RouterOutlet
  ],
  templateUrl: './vttechkhachhanglist.component.html',
  styleUrls: ['./vttechkhachhanglist.component.css']
})
export class VttechkhachhanglistComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  Sitemap: any = { loc: '', priority: '' }
  SearchParams: any = {
    CreatedBegin: moment('2019-01-01').format('YYYY-MM-DD'),
    CreatedEnd: moment().format('YYYY-MM-DD'),
    pageSize:9999,
    pageNumber:0,
    Status:9999,
    BranchID:9999
  };
  isDelete:boolean =false
  ListStatus: any = Status
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  displayedColumns: string[] = ['Code','Name', 'Phone','Phone2','Birthday','Gender','Address', 'CustomerSource','CustomerGroup','CreatedDate'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ListChiNhanh: any[] = []
  constructor(
    private dialog: MatDialog,
    private _Notification: NotifierService,
    private _VttechkhachhangService: VttechkhachhangService,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this.ChangeSearchParams()
    this._ChinhanhService.getAllChinhanhs().subscribe()
   // this._VttechkhachhangService.searchVttechkhachhang(this.SearchParams).subscribe()
    this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
      if (chinhanhs?.length > 0) {
        this.ListChiNhanh = chinhanhs
        this._VttechkhachhangService.vttechkhachhangs$.subscribe((data: any) => {
          if (data) {
            data.forEach((v: any) => {
              v.Chinhanh = chinhanhs.find((c: any) => c.idVttech == v.BranchID)?.Title;
              v.Checkdup =`${v.CustPhone}_${v.TabCode}_${v.Code}_${v.CustCode}`;
            })
            this.FilterLists = this.Lists = data
            this.dataSource = new MatTableDataSource(this.FilterLists);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        })
      }
    })
  }
  ChangeSearchParams() {
    this.SearchParams.BranchID==9999?delete this.SearchParams.BranchID: this.SearchParams.BranchID
    this.SearchParams.Status==9999?delete this.SearchParams.Status: this.SearchParams.Status
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
   }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  SearchServer(input:any) {
    if(input.value.length>1)
    {
      delete this.SearchParams.CreatedBegin
      delete this.SearchParams.CreatedEnd
      this.SearchParams.query=input.value,
      this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
      console.log(input.value);
    }
    else
    {
      this.ngOnInit()
    }

  }
  openDialog(teamplate: TemplateRef<any>): void {
  //   const dialogRef = this.dialog.open(teamplate, {
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.VttechkhachhangService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
  //     }
  //   });
  }
  FillDup() {
    this.isDelete = !this.isDelete
    if(this.isDelete)
    {
      this.FilterLists = findDuplicateOccurrences(this.Lists,'Phone');
    } else {
      this.FilterLists = this.Lists
    }
    console.log(this.FilterLists);
    this.dataSource = new MatTableDataSource(this.FilterLists);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.FilterLists);

  }
  FillDupKhach() {
    this.FilterLists = findDuplicateOccurrences(this.Lists,'Phone2');
    this.dataSource = new MatTableDataSource(this.FilterLists);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  RemoveDup() {
    console.log("remove");

    this.FilterLists = mergeNoDup(this.FilterLists,this.FilterLists,'Checkdup')
    console.log(this.FilterLists);

    this.FilterLists.forEach((v:any) => {
     this._VttechkhachhangService.DeleteVttechkhachhang(v.id).subscribe(()=>{ this.isDelete = false});
    });
  }
  SumToTal(items:any[],field:any)
  {
   return items.reduce((acc, obj) => acc + obj[field], 0)||0;
  }
}
