import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { VttechthanhtoanService } from './vttechthanhtoan.service';
@Component({
  selector: 'app-vttechthanhtoan',
  templateUrl: './vttechthanhtoan.component.html',
  styleUrls: ['./vttechthanhtoan.component.css']
})
export class VttechthanhtoanComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _VttechthanhtoanService: VttechthanhtoanService,
  ) {
  }
  ngOnInit(): void {
    this._VttechthanhtoanService.getAllAPIVttech().subscribe((data)=>
    {
      console.log(data); 
    })
    this._VttechthanhtoanService.getAllVttechthanhtoans().subscribe()
    this._VttechthanhtoanService.vttechthanhtoans$.subscribe((data:any)=>{
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
}
