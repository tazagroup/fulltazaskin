import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { VttechdieutriService } from '../vttechdieutri.service';
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
import { findDuplicateOccurrences, mergeNoDup } from 'apps/frontend/src/app/shared/shared.utils';
@Component({
  selector: 'app-vttechdieutrilist',
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
  templateUrl: './vttechdieutrilist.component.html',
  styleUrls: ['./vttechdieutrilist.component.css']
})
export class VttechdieutrilistComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  Sitemap: any = { loc: '', priority: '' }
  isDelete:boolean = false
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  SearchParams: any = {
    CreatedBegin: moment().format('YYYY-MM-DD'),
    CreatedEnd: moment().format('YYYY-MM-DD'),
    pageSize:9999,
    pageNumber:0,
    Status:9999,
    BranchID:9999
  };
  displayedColumns: string[] = ['Code','Name', 'Phone','Treat','Chinhanh','Created'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ListChiNhanh: any[] = []
  constructor(
    private dialog: MatDialog,
    private _Notification: NotifierService,
    private _VttechdieutriService: VttechdieutriService,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this.ChangeSearchParams()
    this._ChinhanhService.getAllChinhanhs().subscribe(() => {
      this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
        this.ListChiNhanh = chinhanhs
        this._VttechdieutriService.vttechdieutris$.subscribe((data:any) => {
          data.forEach((v: any) => {
            v.Chinhanh = chinhanhs.find((c: any) => c.idVttech === v.BranchID)?.Title;
           })
         this.FilterLists = this.Lists = data.map((v: any) => ({ ...v, ...v.Dulieu }))
          this.dataSource = new MatTableDataSource(this.FilterLists);
          // this.dataSource.sortingDataAccessor = (item, property) => {
          //   switch (property) {
          //     case 'Diachi':
          //       return item.Giohangs.Khachhang.Diachi;
          //     case 'Hoten':
          //       return item.Giohangs.Khachhang.Hoten;
          //     case 'SDT':
          //       return item.Giohangs.Khachhang.SDT;
          //     case 'Hinhthuc':
          //       return item.Thanhtoan.Hinhthuc;
          //     default:
          //       return item[property];
          //   }
          // };
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      });
    });
  }


  ChangeSearchParams() {
    this.SearchParams.BranchID==9999?delete this.SearchParams.BranchID: this.SearchParams.BranchID
    this.SearchParams.Status==9999?delete this.SearchParams.Status: this.SearchParams.Status
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
   }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
  //   const dialogRef = this.dialog.open(teamplate, {
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.VttechdieutriService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
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
     this._VttechdieutriService.DeleteVttechdieutri(v.id).subscribe(()=>{ this.isDelete = false});
    });
  }
}
