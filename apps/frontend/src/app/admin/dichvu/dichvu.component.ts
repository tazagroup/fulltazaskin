import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { convertToSlug } from '../../shared/shared.utils';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { DichvuService } from './dichvu.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DanhmucService } from '../danhmuc/danhmuc.service';
@Component({
  selector: 'app-dichvu',
  templateUrl: './dichvu.component.html',
  styleUrls: ['./dichvu.component.css']
})
export class DichvuComponent implements OnInit {
  Lists: any[] = []
  Detail: any = {}
  Dichvu: any = {}
  Danhmuc: any = {}
  pageSize = 5
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.Dichvu && node.Dichvu.length > 0,
      Title: node.Title,
      id: node.id,
      isDM: node.isDM,
      Noibat: node.Noibat,
      level: level,
      Data: node
    };
  };
  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable,
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.Dichvu,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: any) => node.expandable;

  constructor(
    private _DichvuService: DichvuService,
    private _DanhmucService: DanhmucService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this._DanhmucService.getAllDanhmucs().subscribe()
    this._DanhmucService.danhmucs$.subscribe((danhmucs: any) => {
      if (danhmucs) {
        this._DichvuService.getAllDichvus().subscribe()
        this._DichvuService.dichvus$.subscribe((dichvus: any) => {
          if (dichvus) {
            danhmucs.forEach((v: any) => {
              v.isDM =true
              v.Dichvu = dichvus.filter((v2: any) => v2.idDM == v.id)
            });
            this.dataSource.data = danhmucs;
            this.treeControl.expandAll();
          }
        })
      }
    })

  }
  PageChange(event: any) {
    this.dataSource.data = this.Lists.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }
  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this.Create()
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  openCreateDichvu(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this._DichvuService.CreateDichvu(this.Dichvu).subscribe(() => {
          this._DanhmucService.getAllDanhmucs().subscribe()
          this.dataSource.data = this.Lists
          this.treeControl.expandAll();
          this.Dichvu = {}
        })
      }
    });
  }
  openDeleteDichvu(teamplate: TemplateRef<any>, item: any): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this._DichvuService.DeleteDichvu(item).subscribe(() => {
          this._DanhmucService.getAllDanhmucs().subscribe()
          this.dataSource.data = this.Lists
          this.treeControl.expandAll();
          this.Dichvu = {}
        })
      }
    });
  }
  openDeleteCat(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  openEditDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'true') {
        this._DichvuService.UpdateDichvu(this.Detail).subscribe((data) => {
        })
      }
    });
  }
  UpdateNoibat(item: any) {   
    item.Data.Noibat = !item.Data.Noibat
    this._DichvuService.UpdateDichvu(item.Data).subscribe()
  }
  TinhCongno() {
    this.Detail.Congno = this.Detail.Doanhso - this.Detail.Doanhthu
  }
  Create() {
    this._DichvuService.CreateDichvu(this.Detail).subscribe(() => {
      this.dataSource.data = this.Lists
    })
  }
  convertToSlug(data: any) {
    this.Detail.Slug = convertToSlug(data)
  }
  convertToSlugDichvu(data: any) {
    this.Dichvu.Slug = convertToSlug(data)
  }
}
