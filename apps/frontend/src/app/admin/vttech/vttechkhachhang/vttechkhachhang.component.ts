import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { VttechkhachhangService } from './vttechkhachhang.service';
import * as moment from 'moment';
@Component({
  selector: 'app-vttechkhachhang',
  templateUrl: './vttechkhachhang.component.html',
  styleUrls: ['./vttechkhachhang.component.css']
})
export class VttechkhachhangComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  SearchParams: any = {Batdau:moment().startOf('day').toDate(),Ketthuc: moment().endOf('day').toDate()};
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _VttechkhachhangService: VttechkhachhangService,
  ) {
  }
  ngOnInit(): void {
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
    this._VttechkhachhangService.vttechkhachhangs$.subscribe((data:any)=>{    
      if(data)
      {
        this.FilterLists = this.Lists = data.items
      }  

    })
  }
  ChoosenDate()
  {
    this._VttechkhachhangService.searchVttechkhachhangs(this.SearchParams).subscribe()
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
        this._VttechkhachhangService.CreateVttechkhachhang(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._VttechkhachhangService.DeleteVttechkhachhang(item.id).subscribe()
      }
    });
  }
}
