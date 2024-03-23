import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MenuService } from './menu.service';
import { convertToSlug, nest } from '../../../shared/shared.utils';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  Detail: any = {};
  Lists: any[] = []
  FilterLists: any[] = []
  Menus: any[] = []
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      Title: node.Title,
      Ordering: node.Ordering,
      URL: node.URL,
      id:node.id,
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
    node => node.children,
  );
  hasChild = (_: number, node: any) => node.expandable;
  dataSource: any
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(
    private dialog: MatDialog,
    private _MenuService: MenuService,
  ) {
  }
  ngOnInit(): void {
    this._MenuService.getAllMenus().subscribe()
    this._MenuService.menus$.subscribe((data:any)=>{
      this.FilterLists = this.Lists = data
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.dataSource.data = nest(data)
      this.treeControl.expandAll()
      console.log(data);
      const data1 = data.filter((v:any)=>v.pid=='')
      console.log(data1);
      
    })    
   
  }
  FillSlug() {
    this.Detail.Slug = convertToSlug(this.Detail.Title)
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
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.Lists, event.previousIndex, event.currentIndex);
  }
  openDialog(teamplate: TemplateRef<any>): void {
    const dialogRef = this.dialog.open(teamplate, {
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._MenuService.CreateMenu(this.Detail).subscribe()
      }
    });
  }
  openDeleteDialog(teamplate: TemplateRef<any>,item:any): void {
    const dialogRef = this.dialog.open(teamplate, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result=="true") {
        this._MenuService.DeleteMenu(item.id).subscribe()
      }
    });
  }

  async LoadDrive()
  {

  }
  async SyncDrive()
  {

  }
  async UpdateSyncDrive()
  {

  }
  async writeExcelFile()
  {

  }
  async readExcelFile(e:any)
  {

  }
}
