import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDateRangePicker, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import * as moment from 'moment';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexResponsive, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { VttechdieutriService } from '../../vttech/vttechdieutri/vttechdieutri.service';
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
    MatButtonModule
  ],
  templateUrl: './dashboard-thucamon.component.html',
  styleUrls: ['./dashboard-thucamon.component.css']
})
export class DashboardThucamonComponent implements OnInit {
  SearchParams: any = {
    Batdau: moment().startOf('day').add(-7, "days").toDate(),
    Ketthuc: moment().endOf('day').toDate(),
    pageSize: 9999,
    pageNumber: 0
  };
  Status:any={0:'Mới',1:'Đợi gửi',2:'Thành Công',3:'Chưa Có Temp OA',4:'Gửi SMS'}
  Style:any={0:'!bg-blue-500',1:'!bg-yellow-500',2:'!bg-green-500',3:'!bg-red-500',4:'!bg-purple-500'}
  List:any[]=[]
  ngOnInit() {
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
    this._VttechdieutriService.vttechdieutris$.subscribe((data:any) => {
      if (data) {
        this.List = data.items.map((v:any)=>({Status:v.Status,Created:moment(v.CreateAt).format("DD/MM/YYYY")}))
      }
    })
    this.LoadData()
  }
  ChoosenDate() { }
  _VttechdieutriService: VttechdieutriService = inject(VttechdieutriService)
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
    this._VttechdieutriService.searchVttechdieutri(this.SearchParams).subscribe()
    const daysBetween = moment(this.SearchParams.Ketthuc).diff(moment(this.SearchParams.Batdau), "days");
    const Days = Array.from({ length: daysBetween + 1 }, (_, k) => (k));
    const categories: any = []
    Days.forEach((v) => {
      categories.push(moment(this.SearchParams.Batdau).add(v, 'days').format("DD/MM/YYYY"))
    })
    let series:any=[]
    const Status = Array.from({ length: Object.entries(this.Status).length + 1 }, (_, k) => (k));
    series = Status.map((v: any) => ({
      name: v,
      data: categories.map((v1: any) =>
        this.List.filter((v2: any) => v2.Created === v1 && v2.Status === v).length
      ),
    }));
    console.log(series);
    
    this.chartOptions.xaxis.categories = categories
    this.chartOptions.series = series
  }
}