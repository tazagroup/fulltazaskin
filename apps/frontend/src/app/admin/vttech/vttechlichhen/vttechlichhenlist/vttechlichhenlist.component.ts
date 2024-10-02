import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { Delete } from '@nestjs/common';
import { NotifierService } from 'angular-notifier';
import * as XLSX from 'xlsx';
import { LIST_CHI_NHANH } from 'apps/frontend/src/app/shared/shared.utils';
import { VttechdieutriService } from '../../vttechdieutri/vttechdieutri.service';
import { VttechlichhenService } from '../vttechlichhen.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MaterialModule } from 'apps/frontend/src/app/shared/material.module';

@Component({
  selector: 'app-vttechlichhenlist',
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
  templateUrl: './vttechlichhenlist.component.html',
  styleUrls: ['./vttechlichhenlist.component.scss'],
})
export class VttechlichhenlistComponent implements OnInit {

  Detail: any = {};
  SearchParams: any = {
    Batdau:moment().startOf('day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    pageSize: 9999,
  };
  Lists: any[] = []
  FilterLists: any[] = []
  LIST_CHI_NHANH = LIST_CHI_NHANH
  ListStatus: any
  pageSizeOptions:any
  Status: any = { 0: 'Mới', 1: 'Đợi gửi', 2: 'Thành Công', 3: 'Chưa Có Temp OA', 4: 'Gửi SMS' }
  // Status:any={0:'Mới',2:'Thành Công',3:'Chưa Có Temp Zalo OA',4:'Gửi SMS'}
  Style: any = { 0: '!bg-blue-500', 1: '!bg-yellow-500', 2: '!bg-green-500', 3: '!bg-red-500', 4: '!bg-purple-500' }
  isReport: boolean = false
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  PagiLength: any = 0
  StatusActive: any
  Total: any = 0
  displayedColumns: string[] = ['CustName','Time','Content','status','branch', 'creationDate'];
  dataSource!: MatTableDataSource<any>;
  SendZns:any={}
  ListVipham=["giam gia","khuyen mai","uu dai","tang","chiet khau","co hoi nhan ngay","co hoi boc tham","giam *%","giamgia","sale off","sale","sale d","sale off","kmai","uu-dai","giam-gia","k.mai","ma km","hoc bong","co hoi nhan ngay","giamgia","mua * tang","rut tham","trung thuong","sale *%","sale * %","giam d","giamd","giam d","giam toi","giam den","giam gia","giam ngay","giam hoc phi","giam hphi","uu dai"]
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private _VttechdieutriService: VttechdieutriService,
    private _VttechlichhenService: VttechlichhenService,
    private _NotifierService: NotifierService,
  ) {
  }
  ngOnInit(): void {
    this._VttechlichhenService.searchVttechlichhen(this.SearchParams).subscribe()
    this._VttechlichhenService.vttechlichhens$.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.dataSource = new MatTableDataSource(data.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
    this._VttechdieutriService.vttechdieutris$.subscribe((data: any) => {
      if (data) {
      //  console.log(data);
        this.Total = data.totalCount
        this.ListStatus = data.ListStatus
        this.FilterLists = this.Lists = data.items
      }
    })
  }
  Reload() {
    delete this.SearchParams.Status
    this.SearchParams.pageSize = 20
    this.SearchParams.Batdau = moment().startOf('day').toDate(),
      this.SearchParams.Ketthuc = moment().endOf('day').toDate(),
      this.SearchParams.pageNumber = 0
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
  }
  Report(items: any, field: any) {
    if (items) {
      return items.filter((v: any) => v.Status == field)?.length
    }
    else return 0

  }
  // SendZNS(item: any) {
  //   console.log(item);

  //   this._VttechdieutriService.SendZns(item).subscribe()
  // }
  // async SendAllZNS(items: any) {
  //   await items.forEach((v: any,k:any) => {
  //     setTimeout(() => {
  //       this.SendZNS(v)
  //     }, Math.random()*1000 + k*100);
  //   });
  //   this._NotifierService.notify("success", `Đang gửi ${items.length} Tin Nhắn`)
  // }
  ChoosenDate() {
    console.log(this.SearchParams);
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
  }
  onChangeCN(event:MatSelectChange)
  {
    // this.SearchParams.BranchID=event.value
    // this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
    console.log(event.value);
    
    const filterValue = event.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ChangeStatus(event: MatSelectChange) {
    console.log(this.SearchParams);
    this.SearchParams.Status = event.value
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
  }
  PlusTime(item:Date)
  {
    const newDate=moment(item).add(30, 'minutes').toDate();
    return newDate
  }
  NameDate(item:Date)
  {
    return moment(new Date(item), 'DD-MM-YYYY').locale('vi').format('dddd')
  }
  ChangeStatusButton(item: any) {
    this.StatusActive = item
    this.SearchParams.Status = item
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
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result = "true") {
        this._VttechdieutriService.CreateVttechdieutri(this.Detail).subscribe()
      }
    });
  }
  openDialogSend(teamplate: TemplateRef<any>, item: any): void {
    // this.SendZns = "Quy Khach #CustName#  ( #CustCode# ) co lich hen vao ngay #AppDay# luc #AppHour# , tai #BranchAddress#. Hotline : #BranchHotline# . Cam on quy khach"
    console.log(item);
    this.SendZns.CustName = item?.CustName
    this.SendZns.CustCode = item?.CustCode
    this.SendZns.Ngayhen = moment(item?.DateFrom).format('DD-MM-YYYY')
    this.SendZns.Giohen = moment(item?.DateFrom).format('HH:mm')
    console.log(this.SendZns);

    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        console.log(item);
        
       // this._VttechdieutriService.SendZns(item).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._VttechdieutriService.DeleteVttechdieutri(item.id).subscribe()
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
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
  }
  readExcelFile(event: any) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = new Uint8Array((e.target as any).result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(jsonData);
      };
      fileReader.readAsArrayBuffer(file);
    }
    writeExcelFile(data:any) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        data.map((v:any,k:any)=>({
        'STT':k+1,
        'Số Điện Thoại':v.SDT,
        'Họ Tên':v.CustName,
        'Ngày Tạo':v.NgayVttech,
        'Thời Gian Gửi ZNS':v.SendZNSAt,
      })));
      const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `ZNZ_cam_on_${moment().format('DD_MM_YYYY')}`);
    }
    saveAsExcelFile(buffer: any, fileName: string) {
      const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url: string = window.URL.createObjectURL(data);
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    }
}
