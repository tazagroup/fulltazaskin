import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { KhachhangdichvuService } from './khachhangdichvu.service';
@Component({
  selector: 'app-khachhangdichvu',
  templateUrl: './khachhangdichvu.component.html',
  styleUrls: ['./khachhangdichvu.component.css']
})
export class KhachhangdichvuComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _KhachhangdichvuService: KhachhangdichvuService,
  ) {
  }
  ngOnInit(): void {
    this._KhachhangdichvuService.getAllKhachhangdichvus().subscribe()
    this._KhachhangdichvuService.khachhangdichvus$.subscribe((data:any)=>{
      this.FilterLists = this.Lists = data
    })
    this._KhachhangdichvuService.getVttech().subscribe((data)=>console.log(data))
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
      if (result=="true") {
        this._KhachhangdichvuService.CreateKhachhangdichvu(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._KhachhangdichvuService.DeleteKhachhangdichvu(item.id).subscribe()
      }
    });
  }
}
