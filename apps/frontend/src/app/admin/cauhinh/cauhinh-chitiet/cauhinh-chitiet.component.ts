import { Component, OnInit } from '@angular/core';
import { CauhinhService } from '../cauhinh.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cauhinh-chitiet',
  templateUrl: './cauhinh-chitiet.component.html',
  styleUrls: ['./cauhinh-chitiet.component.css']
})
export class CauhinhChitietComponent implements OnInit {
  Detail:any={Data:[]}
  Data:any={
    Title: "",
    FromAmount: "",
    ToAmount: ""
  }
  Datas:any=[]
  isUpdate:boolean = false
  SelectData:any=0
  constructor(
    private _CauhinhService:CauhinhService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }
  ngOnInit() {
    this.route.params.subscribe((paramsId) => {
      const slug = paramsId['slug'];
      if (slug) {
        this._CauhinhService.getCauhinhBySlug(slug).subscribe();
        this._CauhinhService.cauhinh$.subscribe((res) => {
          if (res) {
            this.Detail = res;
            console.log(res);
          }
        });
      }
    });
  }
  AddDetail(data:any)
  {
    this.Detail.Data.push(data)
    this._CauhinhService.updateCauhinh(this.Detail).subscribe(()=>
    {
      this.isUpdate=true
      this.Data = {}
    })
  }
  UpdateDetail(data:any)
  {
    this.Detail.Data[this.SelectData]=data
    this._CauhinhService.updateCauhinh(this.Detail).subscribe(()=>this.isUpdate=false)
  }

}
