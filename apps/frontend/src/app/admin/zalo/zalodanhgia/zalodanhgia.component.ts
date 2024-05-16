import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalodanhgiaService } from './zalodanhgia.service';
import * as moment from 'moment';
import { ZaloznsService } from '../zalozns/zalozns.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChinhanhService } from '../../cauhinh/chinhanh/chinhanh.service';
@Component({
  selector: 'app-zalodanhgia',
  templateUrl: './zalodanhgia.component.html',
  styleUrls: ['./zalodanhgia.component.css']
})
export class ZalodanhgiaComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  ListChiNhanh: any[] = []
  SearchParams: any = {
    CreatedBegin: moment().format('YYYY-MM-DD'),
    CreatedEnd: moment().format('YYYY-MM-DD'),
    pageSize:9999,
    pageNumber:0,
    Status:9999,
    BranchID:9999
  };
  LIST_CHI_NHANH: any = LIST_CHI_NHANH
  PagiLength: any
  pageSizeOptions: any[] = [5]
  Total: any
  SelectStar: any = 5
  stars = 5; // Number of stars
  totalDanhgia = 0;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  @ViewChild('myDiv') myDivRef!: ElementRef;
  displayedColumns: string[] = ['CustPhone','CustName','Code','Feedbacks','Note','Chinhanh','TimeSend','Tinhtrang'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private _ZalodanhgiaService: ZalodanhgiaService,
    private _ZaloznsService: ZaloznsService,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this.ChangeSearchParams()
   // this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
    this._ChinhanhService.getAllChinhanhs().subscribe()
    this._ChinhanhService.chinhanhs$.subscribe((chinhanhs: any) => {
      this.ListChiNhanh = chinhanhs
      if (chinhanhs && chinhanhs.length > 0) {
        this._ZaloznsService.zaloznss$.subscribe((data: any) => {
          console.log(data);      
          if (data) {
            data.forEach((v: any) => {
              v.Chinhanh = chinhanhs.find((c: any) => c.idVttech == v.BranchID)?.Title;
              v.TimeSend = moment(Number(v.submitDate)).toISOString();
            })
            this.FilterLists = this.Lists = data
            console.log(data);
            
            this.dataSource = new MatTableDataSource(this.FilterLists);
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
  ChangeSearchParams() {
    this.SearchParams.BranchID==9999?delete this.SearchParams.BranchID: this.SearchParams.BranchID
    this.SearchParams.Status==9999?delete this.SearchParams.Status: this.SearchParams.Status
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  StarToggle(item:any)
  {
    this.SearchParams.star==item?delete this.SearchParams.star:this.SearchParams.star=item
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  onStarClick(index: number) {
    this.SearchParams.star = index + 1
    this.SearchParams.pageNumber = 0
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  Allstar() {
    delete this.SearchParams.star
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }

  CreateStart(item: any) {
    const result = Array.from({ length: item }, (_, i) => i + 1);
    return result
  }
  GetSoluongSao(item:any){
    return this.FilterLists.filter((v)=>v.rate==item)?.length
  }
  GetNameChinhanh(item: any, field: any) {
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v[field] == item)
    return Chinhanh?.Title
  }
  ChoosenDate() {
    this.SearchParams.pageNumber = 0
    this.SearchParams.Batdau = moment(this.SearchParams.Batdau).startOf('day').toDate(),
      this.SearchParams.Ketthuc = moment(this.SearchParams.Ketthuc).endOf('day').toDate(),
      this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  // applyFilter(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   if (value.length > 2) {
  //     this.FilterLists = this.Lists.filter((v) => {
  //       return v.SDT.toLowerCase().includes(value)
  //     }
  //     )
  //   }
  //   else {
  //     this.FilterLists = this.Lists
  //   }
  // }
  onChangeCN(event: MatSelectChange) {
    if(this.SearchParams.idCN!=''){
      this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
    }
  }
  onPageChange(event: any) {
    this.SearchParams.pageSize = event.pageSize
    this.SearchParams.pageNumber = event.pageIndex
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  // Capnhatdanhgia() {
  //   this.SearchParams.pageSize =999999
  //   this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  //   this.FilterLists.forEach((item:any)=>
  //   {
  //     if(item.idCN=='')
  //     {
  //     console.log(item);
  //     item.idCN = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==item.template_id||v.iddanhgiatimona==item.template_id)?.id||''
  //     item.BranchID = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==item.template_id||v.iddanhgiatimona==item.template_id)?.idVttech||''
  //     item.Chinhanh = LIST_CHI_NHANH.find((v)=>v.idtempdanhgia==item.template_id||v.iddanhgiatimona==item.template_id)?.Title||''
  //     this._ZaloznsService.UpdateZalozns(item).subscribe()
  //     }
  //   })      
  // }
  writeExcelFile(data: any) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      data.map((v: any, k: any) => ({
        'STT': k + 1,
        'Họ Tên': v.CustName,
        'Số Điện Thoại': v.CustPhone,
        'Ngày Đánh Giá': v.TimeSend,
        'Chi Nhánh': v.Chinhanh,
        'Số Sao': v.rate,
        'Đánh Giá': v.feedbacks?.join(","),
        'Ghi Chú': v.note
      })));
    const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, `ZNZ_Danh_Gia_${moment().format('DD_MM_YYYY')}`);
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
