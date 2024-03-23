import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { UsersService } from '../../shared/auth/users.service';
import { nest } from '../../shared/shared.utils';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  FilterLists: any[] = []
  Cuser: any = {}
  Menus: any[] = []
  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      Title: node.Title,
      pid: node.pid,
      Slug: node.Slug,
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
  isOpen: boolean = true
  DrawerMode: any = 'side'
  @ViewChild('drawer', { static: true }) drawer!: MatDrawer;
  constructor(private breakpointObserver: BreakpointObserver,
    private _UsersService: UsersService,
  ) { }
  ngOnInit() {
    this._UsersService.getProfile().subscribe()
    this._UsersService.profile$.subscribe((data) => {
      this.Cuser = data
      this.Menus = nest(data?.Groups)      
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.dataSource.data = this.Menus;
      this.treeControl.expandAll()
      console.log(this.Menus);
      
    }
    )
    this.breakpointObserver.observe([Breakpoints.XSmall])
      .subscribe((breakpoints: any) => {
        if (breakpoints.matches) {
          this.isOpen = false;
          this.DrawerMode = 'over'
        } else {
          this.DrawerMode = 'side'
          this.isOpen = true;
        }
      });
  }
  applyFilter(query: any) {

  }
  ChoosenMenu()
  {
    this.breakpointObserver.observe([Breakpoints.XSmall])
    .subscribe((breakpoints: any) => {
      if (breakpoints.matches) {
        this.drawer.close()
      }
    });
  }

}
