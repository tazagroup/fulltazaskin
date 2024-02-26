import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { NavigateComponent } from '../navigate.component';
import { NavigateService } from '../navigate.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
@Component({
  selector: 'app-navigate-detail',
  templateUrl: './navigate-detail.component.html',
  styleUrls: ['./navigate-detail.component.css']
})
export class NavigateDetailComponent implements OnInit {
  Detail: any = {}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _NavigateComponent: NavigateComponent,
    private _NavigateService: NavigateService
    
  ) {}
  ngOnInit(): void {
    this._NavigateService.getAllNavigates().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._NavigateComponent.drawer.open();
        this._NavigateService.getNavigateById(id).subscribe();
        this._NavigateService.navigate$.subscribe((res:any) => {
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
    this._NavigateComponent.drawer.close();
  }
  Update(data:any)
  {
    this._NavigateService.UpdateNavigate(data).subscribe();
  }
  ChangeStatus(item: any, type: any) {
    item[type] = item[type] == 0 ? 1 : 0
  }
  GetUpload(e:any)
  {
    this.Detail.Image = e
    this._NavigateService.UpdateNavigate(this.Detail).subscribe();
  }
  GetUploadList(e:any,i:any)
  {   
    this.Detail.ListImage[i] = e
    console.log(this.Detail);
    this._NavigateService.UpdateNavigate(this.Detail).subscribe();
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
    this._NavigateService.UpdateNavigate(this.Detail).subscribe();
  }
}