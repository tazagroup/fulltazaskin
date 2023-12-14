import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { CauhinhchungService } from './cauhinhchung.service';
@Component({
  selector: 'app-cauhinhchung',
  templateUrl: './cauhinhchung.component.html',
  styleUrls: ['./cauhinhchung.component.css']
})
export class CauhinhchungComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _CauhinhchungService: CauhinhchungService,
  ) {
  }
  ngOnInit(): void {
    this._CauhinhchungService.getAllCauhinhchungs().subscribe()
    this._CauhinhchungService.cauhinhchungs$.subscribe((data:any)=>{
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
        this._CauhinhchungService.CreateCauhinhchung(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._CauhinhchungService.DeleteCauhinhchung(item.id).subscribe()
      }
    });
  }
}
