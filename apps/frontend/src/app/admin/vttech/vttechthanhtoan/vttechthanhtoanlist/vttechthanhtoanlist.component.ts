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
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  displayedColumns: string[] = ['ID','CustName', 'CustPhone','Code','TypeName','Paid', 'DiscountAmount','DepositAmountUsing','TotalPaid','BranchID','Created'];
  
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private _Notification: NotifierService,
    private _VttechthanhtoanService: VttechthanhtoanService,
  ) {
  }
  ngOnInit(): void {
    this._VttechthanhtoanService.getAllthanhtoans().subscribe((data)=>{
      console.log(data.map((v:any)=>(v.Dulieu)));
      this.FilterLists = this.Lists = data
      this.dataSource = new MatTableDataSource(data.map((v:any)=>(v.Dulieu)));
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
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