// import { Component, OnInit, ViewChild, inject } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDateRangePicker, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
// import { MatInputModule } from '@angular/material/input';
// import * as moment from 'moment';
// import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexResponsive, ApexXAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
// import { VttechthanhtoanService } from '../../vttech/vttechthanhtoan/vttechthanhtoan.service';
// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   plotOptions: ApexPlotOptions;
//   responsive: ApexResponsive[];
//   xaxis: ApexXAxis;
//   legend: ApexLegend;
//   fill: ApexFill;
// };
// @Component({
//   selector: 'app-dashboard-xacnhanthanhtoan',
//   standalone: true,
//   imports: [
//     NgApexchartsModule,
//     MatDatepickerModule,
//     MatInputModule,
//     ReactiveFormsModule,
//     FormsModule,
//     MatButtonModule
//   ],
//   templateUrl: './dashboard-xacnhanthanhtoan.component.html',
//   styleUrls: ['./dashboard-xacnhanthanhtoan.component.css']
// })
// export class DashboardXacnhanthanhtoanComponent implements OnInit {
//   SearchParams: any = {
//     Batdau: moment().startOf('day').add(-7, "days").toDate(),
//     Ketthuc: moment().endOf('day').toDate(),
//     pageSize: 9999,
//     pageNumber: 0
//   };
//   Status:any={0:'Mới',1:'Đợi gửi',2:'Thành Công',3:'Chưa Có Temp OA',4:'Gửi SMS'}
//   Style:any={0:'!bg-blue-500',1:'!bg-yellow-500',2:'!bg-green-500',3:'!bg-red-500',4:'!bg-purple-500'}
//   List:any[]=[]
//   ngOnInit() {
//     this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
//     this._VttechthanhtoanService.vttechthanhtoans$.subscribe((data:any) => {
//       if (data) {
//         this.List = data.items.map((v:any)=>({Status:v.Status,Created:moment(v.Created).format("DD/MM/YYYY")}))
//       }
//     })
//     this.LoadData()
//   }
//   ChoosenDate() { }
//   _VttechthanhtoanService: VttechthanhtoanService = inject(VttechthanhtoanService)
//   @ViewChild("chart") chart!: ChartComponent;
//   public chartOptions: any;
//   constructor() {
//     this.chartOptions = {
//       series: [
//         {
//           name: "PRODUCT A",
//           data: [44, 55, 41, 67, 22, 43, 21, 49]
//         },
//         {
//           name: "PRODUCT B",
//           data: [13, 23, 20, 8, 13, 27, 33, 12]
//         },
//         {
//           name: "PRODUCT C",
//           data: [11, 17, 15, 15, 21, 14, 15, 13]
//         }
//       ],
//       chart: {
//         type: "bar",
//         height: 350,
//         stacked: true,
//         stackType: "100%"
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             legend: {
//               position: "bottom",
//               offsetX: -10,
//               offsetY: 0
//             }
//           }
//         }
//       ],
//       xaxis: {
//         categories: [
//           // "2011 Q1",
//           // "2011 Q2",
//           // "2011 Q3",
//           // "2011 Q4",
//           // "2012 Q1",
//           // "2012 Q2",
//           // "2012 Q3",
//           // "2012 Q4"
//         ]
//       },
//       fill: {
//         opacity: 1
//       },
//       legend: {
//         position: "right",
//         offsetX: 0,
//         offsetY: 50
//       }
//     };
//   }
//   LoadData() {
//     this._VttechthanhtoanService.searchVttechthanhtoan(this.SearchParams).subscribe()
//     const daysBetween = moment(this.SearchParams.Ketthuc).diff(moment(this.SearchParams.Batdau), "days");
//     const Days = Array.from({ length: daysBetween + 1 }, (_, k) => (k));
//     const categories: any = []
//     Days.forEach((v) => {
//       categories.push(moment(this.SearchParams.Batdau).add(v, 'days').format("DD/MM/YYYY"))
//     })
//     let series:any=[]
//     const Status = Array.from({ length: Object.entries(this.Status).length + 1 }, (_, k) => (k));
    
//     // Status.forEach((v:any)=>
//     // {
//     //   //run1
//     //   const item:any = {name:v,data:[]}
//     //  //run2
//     //   categories.forEach((v1:any) => {
//     //    const count = this.List.filter((v2:any)=>{v2.Created==v1&&v2.Status==v}).length
//     //    item.data.push(count)
//     //    });      
//     //   //run3
//     //    series.push(item)
//     // })
//     series = Status.map((v: any) => ({
//       // run1
//       name: v,
//       // run2
//       data: categories.map((v1: any) =>
//         this.List.filter((v2: any) => v2.Created === v1 && v2.Status === v).length
//       ),
//     }));
//     console.log(series);
//     console.log(categories)
//     console.log(this.List)
//     this.chartOptions.xaxis.categories = categories
//     this.chartOptions.series = series
//   }

// }
