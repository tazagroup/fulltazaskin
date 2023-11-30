import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { HangthanhvienService } from './hangthanhvien.service';
@Component({
  selector: 'app-hangthanhvien',
  templateUrl: './hangthanhvien.component.html',
  styleUrls: ['./hangthanhvien.component.css']
})
export class HangthanhvienComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = [
    {id:1,Title:"1"},
    {id:2,Title:"2"},
  ]
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _HangthanhvienService: HangthanhvienService,
  ) {
  }
  ngOnInit(): void {
    this._HangthanhvienService.getAllHangthanhviens().subscribe()
    this._HangthanhvienService.hangthanhviens$.subscribe((data:any)=>{
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
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result=="true") {
        this._HangthanhvienService.CreateHangthanhvien(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._HangthanhvienService.DeleteHangthanhvien(item.id).subscribe()
      }
    });
  }
}