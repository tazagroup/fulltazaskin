import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { UsersService } from '../../shared/auth/users.service';
import { nest } from '../../shared/shared.utils';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {
  FilterLists: any[] = []
  Cuser: any = {}
  Menus: any[] = []
  // Menus: any[] = [
  //   { id: 1, Title: 'Khách Hàng', URL: 'khach-hang' },
  //   { id: 11, Title: 'Lịch Hẹn', URL: 'lichhen' },
  //   { id: 3, Title: 'Dịch Vụ', URL: 'dich-vu' },
  //   { id: 31, Title: 'Danh Mục', URL: 'danh-muc' },
  //   {
  //     id: 4, Title: 'Zalo', URL: 'zalo', children: [
  //       { id: 5, Title: 'ZNS', URL: 'zalozns' },
  //       { id: 5, Title: 'Token', URL: 'zalotoken' },
  //     ]
  //   },
  //   {
  //     id: 4, Title: 'Users', URL: 'zalo', children: [
  //       { id: 5, Title: 'Users', URL: 'users' },
  //       { id: 5, Title: 'User Group', URL: 'usergroup' },
  //     ]
  //   },
  //   {
  //     id: 4, Title: 'Cấu Hình', URL: 'cau-hinh', children: [
  //       { id: 5, Title: 'Menu', URL: 'cau-hinh/menu' },
  //       { id: 5, Title: 'Cấu Hình Chung', URL: 'cau-hinh/cauhinhchung' },
  //       { id: 5, Title: 'Hạng Thành Viên', URL: 'cau-hinh/hang-thanh-vien' },
  //       { id: 6, Title: 'Chi Nhánh', URL: 'cau-hinh/chi-nhanh' },
  //       { id: 7, Title: 'Banner', URL: 'cau-hinh/banner' },
  //       { id: 8, Title: 'Navigate', URL: 'cau-hinh/navigate' },
  //       { id: 9, Title: 'Khuyến Mãi', URL: 'cau-hinh/khuyenmai' },
  //       { id: 10, Title: 'Đánh Giá', URL: 'cau-hinh/danh-gia' },
  //     ]
  //   },
  //   { id: 10, Title: 'Khách Hàng Đánh Giá', URL: 'khachhangdanhgia' },
  // ]
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
  constructor(private breakpointObserver: BreakpointObserver,
    private _UsersService: UsersService,
  ) { }
  ngOnInit() {
    this._UsersService.getProfile().subscribe()
    this._UsersService.profile$.subscribe((data) => {
      this.Cuser = data
      this.Menus =  nest(data.Groups)
      console.log(this.Menus);
      
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.dataSource.data = this.Menus;
      this.treeControl.expandAll()
      
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

}
