import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { UsersService } from '../../auth/users.service';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _UsersService: UsersService,
    private _AuthService: AuthService,
  ) {
  }
  ngOnInit(): void {
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
  Dangxuat()
  {
    this._AuthService.Dangxuat().subscribe(()=>location.reload())
  }
  // openDialog(teamplate: TemplateRef<any>): void {
  //   const dialogRef = this.dialog.open(teamplate, {
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result=="true") {
  //       this._ProfileService.CreateProfile(this.Detail).subscribe()
  //     }
  //   });
  // }
  // openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
  //   const dialogRef = this.dialog.open(teamplate, {});
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result=="true") {
  //       this._ProfileService.DeleteProfile(item.id).subscribe()
  //     }
  //   });
  // }
}
