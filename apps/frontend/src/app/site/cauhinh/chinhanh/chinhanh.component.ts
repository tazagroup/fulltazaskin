import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ChinhanhService } from './chinhanh.service';
@Component({
  selector: 'app-chinhanh',
  templateUrl: './chinhanh.component.html',
  styleUrls: ['./chinhanh.component.css']
})
export class ChinhanhComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _ChinhanhService: ChinhanhService,
  ) {
  }
  ngOnInit(): void {
    this._ChinhanhService.getAllChinhanhs().subscribe()
    this._ChinhanhService.chinhanhs$.subscribe((data:any)=>{
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
        this._ChinhanhService.CreateChinhanh(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._ChinhanhService.DeleteChinhanh(item.id).subscribe()
      }
    });
  }
}
