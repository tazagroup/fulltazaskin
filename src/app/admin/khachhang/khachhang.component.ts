import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { KhachhangService } from './khachhang.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { CHI_NHANH, SearchParams } from '../../shared/shared.utils';
import { UsersService } from '../../shared/auth/users.service';
export interface Khachangs {
  rows: [];
  count:number
}
@Component({
  selector: 'app-khachhang',
  templateUrl: './khachhang.component.html',
  styleUrls: ['./khachhang.component.css']
})
export class KhachhangComponent implements OnInit {
  itemsPerPageLabel = 'Item';
  Khachhangs:Khachangs ={rows:[],count:0}
  Detail:any={}
  CUser:any={}
  searchParams: SearchParams = {};
  ShowMore:boolean=false
  dateRange:any={
    Batdau:new Date(new Date().setDate(new Date().getDate() - 7)),
    Ketthuc: new Date()
  }
  displayedColumns: string[] = ['TenKH','SDT',  'Dathu','Chinhanh'];
  // displayedColumns: string[] = ['TenKH','SDT', 'Doanhso', 'Dathu', 'Congno','Chinhanh'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private _KhachhangService:KhachhangService,
    private _UsersService:UsersService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
    this._UsersService.getProfile().subscribe()
    this._UsersService.profile$.subscribe((data)=>
    {
      if(data)
      {
        data.EditChinhanhs = data.EditChinhanhs.filter((v:any)=>v.Checked==true)  
        this.searchParams.idChinhanh = data.EditChinhanhs[0].id     
        this.CUser = data
        this.TimKiem(10,0)
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
        this._KhachhangService.updateKhachhang(this.Detail).subscribe()
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
  onDateChange(event: any) {
    console.log(event); 
  }
  GetChinhanh(item:any)
  {
    return CHI_NHANH(item)
  }
  TimKiem(take:any=10,skip:any=0)
  {
    this.searchParams.Dateranger = this.dateRange
    // this.searchParams.take = take
    // this.searchParams.take = skip    
    this._KhachhangService.searchKhachhang(this.searchParams).subscribe((data)=>
    {      
      this.Khachhangs = data
      this.dataSource = new MatTableDataSource(data.rows);
      this.paginator.length = data.count
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  onPageChange(event:any)
  {
    this.TimKiem(event.pageSize,event.pageIndex)
  }
}
