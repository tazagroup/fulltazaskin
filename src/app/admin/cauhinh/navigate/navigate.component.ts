import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigateService } from './navigate.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _NavigateService: NavigateService,
    private _NotifierService: NotifierService,
  ) {
  }
  ngOnInit(): void {
    this._NavigateService.getAllNavigates().subscribe()
    this._NavigateService.navigates$.subscribe((data:any)=>{
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
        this._NavigateService.CreateNavigate(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._NavigateService.DeleteNavigate(item.id).subscribe()
      }
    });
  }
  ChangeStatus(item: any, type: any) {
      item[type] = item[type] == 0 ? 1 : 0
      this._NavigateService.UpdateNavigate(item).subscribe(()=>{
      this._NotifierService.notify("success","Cập Nhật Thành Công")
    })
  }
}
