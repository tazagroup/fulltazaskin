import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DanhmucService } from '../danhmuc/danhmuc.service';
import { convertToSlug } from '../../shared/shared.utils';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
@Component({
  selector: 'app-dichvu',
  templateUrl: './dichvu.component.html',
  styleUrls: ['./dichvu.component.css']
})
export class DichvuComponent implements OnInit {
  Danhmucs: any[] = []
  Detail: any = {}
  pageSize = 5
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.Children && node.Children.length > 0,
      Title: node.Title,
      id: node.id,
      level: level,
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
    node => node.Children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: any) => node.expandable;

  constructor(
    private _DanhmucService: DanhmucService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this._DanhmucService.getDanhmucs().subscribe()
    this._DanhmucService.danhmucs$.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.Danhmucs = data
        this.dataSource.data = data;
        this.treeControl.expandAll();
      }
    })

  }
  PageChange(event: any) {
    this.dataSource.data = this.Danhmucs.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
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
      console.log(result);
      if (result == 'true') {
        this.Create()
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  openDeleteCat(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'true') {
        //this._RedirectService.createRedirect(this.Detail).subscribe((data)=>this._Notification.notify('success','Thêm mới thành công'))
      }
    });
  }
  openEditDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'true') {
        this._DanhmucService.updateDanhmuc(this.Detail).subscribe((data) => {
          console.log(data)
        })
      }
    });
  }
  TinhCongno() {
    this.Detail.Congno = this.Detail.Doanhso - this.Detail.Doanhthu
  }
  Create() {
    this._DanhmucService.postDanhmuc(this.Detail).subscribe(() => {
      this.dataSource.data = this.Danhmucs
    })
  }
  convertToSlug(data: any) {
    this.Detail.Slug = convertToSlug(data)
  }
}
