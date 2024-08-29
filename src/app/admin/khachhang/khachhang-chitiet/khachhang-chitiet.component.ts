import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KhachhangComponent } from '../khachhang.component';
import { KhachhangchitietService } from './khachhang-chitiet.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { reduce } from 'rxjs';
import { KhachhangService } from '../khachhang.service';
@Component({
  selector: 'app-khachhang-chitiet',
  templateUrl: './khachhang-chitiet.component.html',
  styleUrls: ['./khachhang-chitiet.component.css']
})
export class KhachhangChitietComponent implements OnInit {
  Detail: any={}
  Khachhang: any={}
  displayedColumns: string[] = ['Dichvu', 'Doanhso','Tonglieutrinh','Dathu', 'Congno'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private route: ActivatedRoute,
    private router: Router,    
    private _KhachhangComponent: KhachhangComponent,    
    private _KhachhangchitietService: KhachhangchitietService,    
    private _KhachhangService: KhachhangService,    
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((paramsId) => {
      const SDT = paramsId['SDT'];      
      if (SDT) {
        this._KhachhangComponent.drawer.open();
        this._KhachhangService.getKhachhangBySDT(SDT).subscribe()
        this._KhachhangService.khachhang$.subscribe((data)=>
        {
          if(data)
          {
            this.Khachhang = data
          }
        })
        this._KhachhangchitietService.getKhachhangchitietBySDT(SDT).subscribe();
        this._KhachhangchitietService.khachhangchitiet$.subscribe((res:any) => {
          if (res) {
            console.log(res);    
            this.Detail = res;
            this.dataSource = new MatTableDataSource(res);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  Subtotal(items:any[],field:any)
  {
    if(items.length>0)
    {
    const totalSum = items.reduce((total:any, item:any) => total + item[field], 0);
    return totalSum
    }
    else return 0
  }
  CloseDrawer()
  {
    this._KhachhangComponent.drawer.close();
  }
  // Update(data:any)
  // {
  //   this._HocvienService.updateHocvien(data).subscribe((res) => {
  //     if (res) {
  //       this._NotifierService.notify("success","Cập nhật thành công")
  //     }
  //   });
  // }

  public ngAfterViewInit() {
   // this.activeTabIndex = this.tabGroup.selectedIndex;
  }
}









