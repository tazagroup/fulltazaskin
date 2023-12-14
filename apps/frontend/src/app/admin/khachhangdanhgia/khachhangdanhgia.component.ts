import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { KhachhangdanhgiaService } from './khachhangdanhgia.service';
@Component({
  selector: 'app-khachhangdanhgia',
  templateUrl: './khachhangdanhgia.component.html',
  styleUrls: ['./khachhangdanhgia.component.css']
})
export class KhachhangdanhgiaComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _KhachhangdanhgiaService: KhachhangdanhgiaService,
  ) {
  }
  ngOnInit(): void {
    this._KhachhangdanhgiaService.getAllKhachhangdanhgias().subscribe()
    this._KhachhangdanhgiaService.khachhangdanhgias$.subscribe((data:any)=>{
      this.FilterLists = this.Lists = data
    })
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.Lists = this.Lists.filter((v) => {
     return  v.Hoten.toLowerCase().includes(value)||v.SDT.toLowerCase().includes(value)
       }
      )
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result="true") {
        this._KhachhangdanhgiaService.CreateKhachhangdanhgia(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._KhachhangdanhgiaService.DeleteKhachhangdanhgia(item.id).subscribe()
      }
    });
  }
}
