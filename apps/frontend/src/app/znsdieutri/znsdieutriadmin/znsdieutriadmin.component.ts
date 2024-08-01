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
import { ZnsdieutriService } from '../znsdieutri.service';
import { Status, Style1, ZALO_ERROR, findDuplicateOccurrences, mergeNoDup } from '../../shared/shared.utils';
import * as moment from 'moment';
import { ChinhanhService } from '../../admin/cauhinh/chinhanh/chinhanh.service';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-znsdieutriadmin',
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
    RouterOutlet,
    MatTooltipModule
  ],
  templateUrl: './znsdieutriadmin.component.html',
  styleUrls: ['./znsdieutriadmin.component.css']
})
export class ZnsdieutriadminComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  ListChiNhanh: any[] = []
  Sitemap: any = { loc: '', priority: '' }
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  displayedColumns: string[] = ['CustName', 'CustPhone','Chinhanh','Created','Status'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ListStatus: any = Status
  Style: any = Style1
  ZALO_ERROR: any = ZALO_ERROR
  SearchParams: any = {
    CreatedBegin: moment().format('YYYY-MM-DD'),
    CreatedEnd: moment().format('YYYY-MM-DD'),
    pageSize:9999,
    pageNumber:0,
    Status:9999,
    BranchID:9999
  };
  isDelete:boolean =false
  constructor(
    private dialog: MatDialog,
    private _Notification: NotifierService,
    private _ZnsdieutriService: ZnsdieutriService,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this.ChangeSearchParams()
    //this._ZnsdieutriService.searchZnsdieutri(this.SearchParams).subscribe()
      this._ChinhanhService.getAllChinhanhs().subscribe()
      this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
        this.ListChiNhanh = chinhanhs
        if (chinhanhs && chinhanhs.length > 0) {
          this._ZnsdieutriService.znsdieutris$.subscribe((data: any) => {
            if (data) {
              console.log(data);
              data.forEach((v: any) => {
                v.Chinhanh = chinhanhs.find((c: any) => c.idVttech === v.BranchID)?.Title;
              })
              this.FilterLists = this.Lists = data.map((v: any) => ({ ...v, ...v.Dulieu}))
              this.dataSource = new MatTableDataSource(this.FilterLists);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }

          })
        }

      })

    // this._ZnsdieutriService.getAllZnsdieutris().subscribe((data)=>{
    //   console.log(data);
    //   this.FilterLists = this.Lists = data
    //   this.dataSource = new MatTableDataSource(data);
    //   this.dataSource.sortingDataAccessor = (item, property) => {
    //     switch(property) {
    //       case 'Diachi': return item.Giohangs.Khachhang.Diachi;
    //       case 'Hoten': return item.Giohangs.Khachhang.Hoten;
    //       case 'SDT': return item.Giohangs.Khachhang.SDT;
    //       case 'Hinhthuc': return item.Dieutri.Hinhthuc;
    //       default: return item[property];
    //     }
    //   };
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log(this.dataSource.filteredData);

  }
  FillDup() {
    this.isDelete = true
    this.FilterLists = findDuplicateOccurrences(this.Lists,'CustPhone');
    this.dataSource = new MatTableDataSource(this.FilterLists);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  RemoveDup() {
    this.FilterLists = mergeNoDup(this.FilterLists,this.FilterLists,'CustPhone')
    this.FilterLists.forEach((v:any) => {
     this._ZnsdieutriService.DeleteZnsdieutri(v.id).subscribe(()=>{ this.isDelete = false});
    });
  }
  ChangeSearchParams() {
   this.SearchParams.BranchID==9999?delete this.SearchParams.BranchID: this.SearchParams.BranchID
   this.SearchParams.Status==9999?delete this.SearchParams.Status: this.SearchParams.Status
   this._ZnsdieutriService.searchZnsdieutri(this.SearchParams).subscribe()
  }
  GetStype(item:any)
  {
    return this.Style[item]
  }
  GetDetailcode(item:any)
  {
    return this.ZALO_ERROR.find((v:any)=>v.errorcode == item)?.desc
  }
  CountStatus(item: any) {
    const result = this.FilterLists.filter((v: any) => v.Status == item)
    return result.length
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

}
