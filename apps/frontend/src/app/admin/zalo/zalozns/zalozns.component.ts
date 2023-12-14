import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ZaloznsService } from './zalozns.service';
import { TYPE_ZNS, ZALO_OA, convertPhoneNum } from '../../../shared/shared.utils';
@Component({
  selector: 'app-zalozns',
  templateUrl: './zalozns.component.html',
  styleUrls: ['./zalozns.component.css']
})
export class ZaloznsComponent implements OnInit {
  Detail: any = {};
  ZNS: any = { template_id: "272889" };
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _ZaloznsService: ZaloznsService,
  ) {
  }
  ngOnInit(): void {
    this._ZaloznsService.getAllZaloznss().subscribe()
    this._ZaloznsService.zaloznss$.subscribe((data: any) => {
      this.FilterLists = this.Lists = data
    })
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value.length > 2) {
      this.Lists = this.Lists.filter((v) => {
        return v.Hoten.toLowerCase().includes(value) || v.SDT.toLowerCase().includes(value)
      }
      )
    }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result = "true") {
        this._ZaloznsService.CreateZalozns(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this._ZaloznsService.DeleteZalozns(item.id).subscribe()
      }
    });
  }
  GetTypeZns(item: any) {
    return TYPE_ZNS(item)
  }
  GetZaloOa(item: any) {
    return ZALO_OA(item)
  }
  SendZns(item: any) {
    const now = new Date();
    const data =
    {
      "phone": convertPhoneNum(item.SDT),
      "template_id": item.template_id,
      "template_data": {
        "customer_name": item.Hoten,
        "schedule_date": "09/12/2023",
      },
      "tracking_id": item.tracking_id
    }
    this._ZaloznsService.sendZns(data).subscribe((result) => console.log(result))
  }
}
