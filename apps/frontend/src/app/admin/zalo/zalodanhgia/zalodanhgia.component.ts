import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZalodanhgiaService } from './zalodanhgia.service';
import * as moment from 'moment';
import { ZaloznsService } from '../zalozns/zalozns.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-zalodanhgia',
  templateUrl: './zalodanhgia.component.html',
  styleUrls: ['./zalodanhgia.component.css']
})
export class ZalodanhgiaComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  SearchParams: any = {
    Batdau: moment().startOf('day').toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    star: 5,
    pageSize: 10,
    pageNumber: 0
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
  constructor(
    private dialog: MatDialog,
    private _ZalodanhgiaService: ZalodanhgiaService,
    private _ZaloznsService: ZaloznsService,
  ) {
  }
  ngOnInit(): void {
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
    this._ZaloznsService.zaloznss$.subscribe((data: any) => {
      if (data) {
        this.Total = data.totalCount
        this.pageSizeOptions = [10, 20, data.totalCount].filter(v => v <= data.totalCount);
        data.items.sort((a: any, b: any) => b.star - a.star)
        data.items.forEach((v: any) => {
          v.Ngaygui = moment(Number(v.submitDate)).format('HH:mm:ss DD/MM/YYYY');
        }); ((a: any, b: any) => b.star - a.star)
        this.FilterLists = this.Lists = data.items
      }

    })
  }
  onStarClick(index: number) {
    this.SearchParams.star = index + 1
    this.SearchParams.pageNumber = 0
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }
  Reload() { }
  Allstar() {
    delete this.SearchParams.star
    this._ZaloznsService.searchZalozns(this.SearchParams).subscribe()
  }

  CreateStart(item: any) {
    const result = Array.from({ length: item }, (_, i) => i + 1);
    return result
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
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.FilterLists = this.Lists.filter((v) => {
        return v.SDT.toLowerCase().includes(value)
      }
      )
    }
    else {
      this.FilterLists = this.Lists
    }
  }
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
        'Ngày Đánh Giá': v.Ngaygui,
        'Chi Nhánh': v.Chinhanh,
        'Số Điện Thoại': v.SDT,
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
