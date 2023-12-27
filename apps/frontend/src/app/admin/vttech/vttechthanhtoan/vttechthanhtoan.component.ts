import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
@Component({
  selector: 'app-vttechthanhtoan',
  templateUrl: './vttechthanhtoan.component.html',
  styleUrls: ['./vttechthanhtoan.component.css']
})
export class VttechthanhtoanComponent implements OnInit {
  Detail: any = {};
  SearchParams: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  LIST_CHI_NHANH = LIST_CHI_NHANH
  Ngay:any={Batdau:new Date(),Ketthuc: new Date()}
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _VttechthanhtoanService: VttechthanhtoanService,
  ) {
  }
  ngOnInit(): void {
    this._VttechthanhtoanService.getPaginaVttechthanhtoans(1,100).subscribe()
    this._VttechthanhtoanService.getPaginaVttechthanhtoans(1,100).subscribe()
    this._VttechthanhtoanService.vttechthanhtoans$.subscribe((data:any)=>{
      if(data)
      {
        data.data.forEach((v:any) => {
          if (typeof v.Dulieu !== 'object')
          {
            v.Dulieu = JSON.parse(v.Dulieu)
          }
        });
        this.FilterLists = this.Lists = data.data
        console.log(this.FilterLists) 
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
        this._VttechthanhtoanService.CreateVttechthanhtoan(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._VttechthanhtoanService.DeleteVttechthanhtoan(item.id).subscribe()
      }
    });
  }
  GetNameChinhanh(item:any)
  {
    const Chinhanh = LIST_CHI_NHANH.find((v: any) => v.idVttech == item) 
    return Chinhanh?.Title
  }
}
