import { Component, OnInit, TemplateRef } from '@angular/core';
import { CauhinhService } from './cauhinh.service';
import {MatDialog} from '@angular/material/dialog';
import { convertToSlug } from '../../shared/shared.utils';

@Component({
  selector: 'app-cauhinh',
  templateUrl: './cauhinh.component.html',
  styleUrls: ['./cauhinh.component.css'],
})
export class CauhinhComponent implements OnInit {
  Menus:any[] = []
  Detail:any={}
  constructor(
    private _CauhinhService:CauhinhService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this._CauhinhService.getCauhinhs().subscribe((data)=>
      {
        if(data)
        {
          console.log(data)
          this.Menus = data
        }

      }

    )
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result=='true') {
        this.Create()
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  DialogRemove(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result=='true') {
        this.Create()
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    // if (value.length > 2) {
    //   this.Lists = this.Lists.filter((v) => {
    //    return  v.Hoten.toLowerCase().includes(value)||v.SDT.toLowerCase().includes(value)
    //    }
    //   )
    // }
  }
  convertToSlug(data:any)
  {
    this.Detail.Slug = convertToSlug(data)
  }
  Create()
  {
    this._CauhinhService.postCauhinh(this.Detail).subscribe(data=>console.log(data))
  }
}


