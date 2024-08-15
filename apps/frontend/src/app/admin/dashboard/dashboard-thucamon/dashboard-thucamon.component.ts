import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDateRangePicker, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexResponsive, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { VttechdieutriService } from '../../vttech/vttechdieutri/vttechdieutri.service';
import { ZnsdieutriService } from '../../../znsdieutri/znsdieutri.service';
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
  selector: 'app-dashboard-thucamon',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './dashboard-thucamon.component.html',
  styleUrls: ['./dashboard-thucamon.component.css']
})
export class DashboardThucamonComponent implements OnInit {
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
  // _VttechdieutriService: VttechdieutriService = inject(VttechdieutriService)
  _ZnsdieutriService: ZnsdieutriService = inject(ZnsdieutriService)
  isLoading:boolean = true
  ngOnInit() {
    setTimeout(() => {
      this.ChanggeData()
      // this._ZnsdieutriService.searchZnsdieutri(this.SearchParams).subscribe()
      this._ZnsdieutriService.znsdieutris$.subscribe((data:any) => {
        if (data) {
          this.isLoading = false
          this.List = data.map((v:any)=>({Status:v.Status,Created:moment(v.Created).format("DD/MM/YYYY")}))
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
    const Status = Array.from({ length: Object.entries(this.Status).length}, (_, k) => (k));
    series = Status.map((v: any) => ({
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
    this._ZnsdieutriService.searchZnsdieutri(this.SearchParams).subscribe()
  }
}
