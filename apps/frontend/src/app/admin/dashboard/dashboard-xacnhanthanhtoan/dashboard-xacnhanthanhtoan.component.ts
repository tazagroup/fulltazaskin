import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDateRangePicker, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexResponsive, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
import { LIST_CHI_NHANH } from '../../../shared/shared.utils';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ZnsthanhtoanService } from '../../../znsthanhtoan/znsthanhtoan.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
@Component({
  selector: 'app-dashboard-xacnhanthanhtoan',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard-xacnhanthanhtoan.component.html',
  styleUrls: ['./dashboard-xacnhanthanhtoan.component.css']
})
export class DashboardXacnhanthanhtoanComponent implements OnInit {
  @Input() Delay:any=0
  SearchParams: any = {
    CreatedBegin: moment().startOf('day').add(-7, "days").format('YYYY-MM-DD'),
    CreatedEnd: moment().format('YYYY-MM-DD'),
    pageSize:9999,
    pageNumber:0,
    Status:9999,
    BranchID:9999,
    Dashboard:true
  };
  Status:any={0:'Mới',1:'Thành Công',2:'Gửi SMS'}
  Style:any={0:'!bg-blue-500',1:'!bg-green-500',2:'!bg-purple-500'}
  List:any[]=[]
  ListChiNhanh = LIST_CHI_NHANH
  isLoading:boolean=true
  _ZnsthanhtoanService: ZnsthanhtoanService = inject(ZnsthanhtoanService)
  ngOnInit() {
    setTimeout(() => {
      this.ChanggeData()
      this._ZnsthanhtoanService.znsthanhtoans$.subscribe((data:any) => {
        if (data) {
         this.isLoading=false
          this.List = data.map((v:any)=>({Status:v.Status,Created:moment(v.Created).format("DD/MM/YYYY")}));
          this.LoadData()
        }
      })
    }, this.Delay);
  }
  ChoosenDate() { }
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  constructor() {
    this.chartOptions = {
      series: [],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        categories: [
        ]
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      }
    };
  }
  LoadData() {
    const daysBetween = moment(this.SearchParams.CreatedEnd).diff(moment(this.SearchParams.CreatedBegin), "days");
    const Days = Array.from({ length: daysBetween + 1 }, (_, k) => (k));
    const categories: any = []
    Days.forEach((v) => {
      categories.push(moment(this.SearchParams.CreatedBegin).add(v, 'days').format("DD/MM/YYYY"))
    })
    let series:any=[]
    const Initseries = Array.from({ length: Object.entries(this.Status).length}, (_, k) => (k));
    console.log(categories);

    series = Initseries.map((v: any) => ({
      name: this.Status[v],
      data: categories.map((v1: any) =>
        this.List.filter((v2: any) => v2.Created === v1 && v2.Status === v).length
      ),
    }));
    // this.chartOptions.xaxis.categories = categories
    // this.chartOptions.series = series
    this.chartOptions = {
      series: series,
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        categories: categories
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      }
    };
  }
  ChanggeData() {
    this.SearchParams.BranchID==9999?delete this.SearchParams.BranchID: this.SearchParams.BranchID
    this.SearchParams.Status==9999?delete this.SearchParams.Status: this.SearchParams.Status
    this._ZnsthanhtoanService.searchZnsthanhtoan(this.SearchParams).subscribe()
  }
}
