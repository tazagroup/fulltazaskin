import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { BannerComponent } from '../banner.component';
import { BannerService } from '../banner.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
@Component({
  selector: 'app-banner-chitiet',
  templateUrl: './banner-chitiet.component.html',
  styleUrls: ['./banner-chitiet.component.css']
})
export class BannerChitietComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _BannerComponent: BannerComponent,
    private _BannerService: BannerService
    
  ) {}
  ngOnInit(): void {
    this._BannerService.getAllBanners().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._BannerComponent.drawer.open();
        this._BannerService.getBannerById(id).subscribe();
        this._BannerService.banner$.subscribe((res:any) => {
          if (res) {
            console.log(res);    
            this.Detail = res;
          }
        });
      }
    });
  }
  configTiny: EditorComponent['init'] = {
    menubar: false,
    resize:true,
    toolbar_mode: 'sliding',
    statusbar:false,
    branding: false,
    image_advtab: true,
    autoresize_bottom_margin: 20,
    autoresize_min_height: 50,
    height:"400",
    deprecation_warnings: false,
    plugins: [
      'advlist','autolink','lists','link','image','charmap','preview','anchor',
      'searchreplace','visualblocks','code','fullscreen',
      'insertdatetime','media','table','code','help'
    ],
    toolbar: 'undo redo |fontfamily fontsize blocks | bold italic underline | alignleft aligncenter alignright alignjustify | fullscreen preview code | link image media',
    default_link_target: '_blank',
    block_unsupported_drop: true,
    entity_encoding: 'raw',
        images_upload_handler: (blobInfo: any) => {
          const file = blobInfo.blob();
          const formData = new FormData();
          formData.append('file', file);
          const filePath = `${Date.now()}-${blobInfo.filename()}`;
          const promise = new Promise<string>((resolve, reject) => {
            // this._KhoahocService.uploadDriver(formData).subscribe((res) => {
            //   if (res) {   
            //     resolve(GetImage(res.spath));
            //   }
            // });
          });
          return promise;
        }, 
  };
  CloseDrawer()
  {
    this.router.navigate(['../'], { relativeTo: this.route });
    this._BannerComponent.drawer.close();
  }
  Update(data:any)
  {
    this._BannerService.UpdateBanner(data).subscribe();
  }
  GetUpload(e:any)
  {
    this.Detail.Image = e
    this._BannerService.UpdateBanner(this.Detail).subscribe();
  }
  GetUploadList(e:any,i:any)
  {   
    this.Detail.ListImage[i] = e
    console.log(this.Detail);
    this._BannerService.UpdateBanner(this.Detail).subscribe();
  }
  CheckImage(item:any)
  {
    if (Object.keys(item).length === 0) {
      return true
    }
    else return false
  }
  DeleteImage(i:any)
  {
    this.Detail.ListImage.splice(i, 1);
    this._BannerService.UpdateBanner(this.Detail).subscribe();
  }
}