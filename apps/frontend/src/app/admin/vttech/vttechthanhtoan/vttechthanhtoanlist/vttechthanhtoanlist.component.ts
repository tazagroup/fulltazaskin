import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NotifierService } from 'angular-notifier';
import { VttechthanhtoanService } from '../vttechthanhtoan.service';
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
@Component({
  selector: 'app-vttechthanhtoanlist',
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
  templateUrl: './vttechthanhtoanlist.component.html',
  styleUrls: ['./vttechthanhtoanlist.component.css']
})
export class VttechthanhtoanlistComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  Sitemap: any = { loc: '', priority: '' }
  SearchParams: any = {
    pageSize:9999,
    pageNumber:0
  };
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  displayedColumns: string[] = ['CustName', 'CustPhone','Code','TypeName','Paid', 'DiscountAmount','DepositAmountUsing','TotalPaid','Chinhanh','Created'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private _Notification: NotifierService,
    private _VttechthanhtoanService: VttechthanhtoanService,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this._ChinhanhService.getAllChinhanhs().subscribe()
    this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
    this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
      if (chinhanhs && chinhanhs.length > 0) {
        this._VttechthanhtoanService.vttechthanhtoans$.subscribe((data: any) => {
          if (data) {
            data.forEach((v: any) => {
              v.Chinhanh = chinhanhs.find((c: any) => c.idVttech === v.BranchID)?.Title;
            })
            this.FilterLists = this.Lists = data
            this.dataSource = new MatTableDataSource(this.FilterLists);
            // this.dataSource.sortingDataAccessor = (item, property) => {
            //   switch (property) {
            //     case 'Diachi': return item.Giohangs.Khachhang.Diachi;
            //     case 'Hoten': return item.Giohangs.Khachhang.Hoten;
            //     case 'SDT': return item.Giohangs.Khachhang.SDT;
            //     case 'Hinhthuc': return item.Dieutri.Hinhthuc;
            //     default: return item[property];
            //   }
            // };
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        })
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log(this.dataSource.filteredData);
    
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