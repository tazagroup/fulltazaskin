import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { KhachhangService } from './khachhang.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
@Component({
  selector: 'app-khachhang',
  templateUrl: './khachhang.component.html',
  styleUrls: ['./khachhang.component.css']
})
export class KhachhangComponent implements OnInit {
  Khachhangs:any[]=[]
  Detail:any={}
  displayedColumns: string[] = ['TenKH','SDT', 'Doanhso', 'Dathu', 'Congno'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private _KhachhangService:KhachhangService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this._KhachhangService.getLazyloadKhachhangs(0,10).subscribe()
    this._KhachhangService.khachhangs$.subscribe((data:any)=>
      {
        if(data)
        {
        console.log(data.data);
        this.Khachhangs = data.data
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }
      })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result=='true') {
        this.Create()
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  openEditDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result=='true') {
        this._KhachhangService.updateKhachhang(this.Detail).subscribe((data)=>
        {
          console.log(data)
        } )
      }
    });
  }
  TinhCongno()
  {
    this.Detail.Congno = this.Detail.Doanhso - this.Detail.Doanhthu
  }
  Create()
  {
    this._KhachhangService.postKhachhang(this.Detail).subscribe((data)=>
      {
        console.log(data)
      }
      )
  }
}
