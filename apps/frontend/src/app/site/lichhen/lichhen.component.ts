import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { LichhenService } from './lichhen.service';
import { KhachhangService } from '../khachhang/khachhang.service';
@Component({
  selector: 'app-lichhen',
  templateUrl: './lichhen.component.html',
  styleUrls: ['./lichhen.component.css']
})
export class LichhenComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _LichhenService: LichhenService,
    private _KhachhangService: KhachhangService,
  ) {
  }
  ngOnInit(): void {
    this._KhachhangService.getKhachhangs().subscribe();
    this._LichhenService.getAllLichhens().subscribe()
    this._LichhenService.lichhens$.subscribe((lichhens:any)=>{
      console.log(lichhens);
      
      if(lichhens)
      {
      this._KhachhangService.getKhachhangs().subscribe();
      this._KhachhangService.khachhangs$.subscribe((khachhangs)=>{
        lichhens.forEach((v:any)=> {
          v.Khachhang = khachhangs?.find((v1)=>v1.id == v.idKH)
        });
        this.FilterLists = this.Lists = lichhens
      });
    } 
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
        this._LichhenService.CreateLichhen(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._LichhenService.DeleteLichhen(item.id).subscribe()
      }
    });
  }
}
