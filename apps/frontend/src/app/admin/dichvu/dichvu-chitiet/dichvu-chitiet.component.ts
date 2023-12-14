import { Component, OnInit } from '@angular/core';
import { DichvuComponent } from '../dichvu.component';
import { ActivatedRoute } from '@angular/router';
import { DichvuService } from '../dichvu.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { environment } from 'apps/frontend/src/environments/environment';

@Component({
  selector: 'app-dichvu-chitiet',
  templateUrl: './dichvu-chitiet.component.html',
  styleUrls: ['./dichvu-chitiet.component.css']
})
export class DichvuChitietComponent implements OnInit {
  Detail:any={}
  APITINYMCE = environment.APITINYMCE;
  constructor(
    private _DichvuComponent:DichvuComponent,
    private _DichvuService:DichvuService,
    private route: ActivatedRoute,
  ) { }
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
  ngOnInit() {
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._DichvuComponent.drawer.open();
        this._DichvuService.getDichvuById(id).subscribe();
        this._DichvuService.dichvu$.subscribe((res:any) => {
          if (res) {
            console.log(res);    
            this.Detail = res;
          }
        });
      }
    });
  }
  GetUpload(e:any)
  {
    this.Detail.Image = e
    this._DichvuService.UpdateDichvu(this.Detail).subscribe();
  }
  GetUploadList(e:any,i:any)
  {   
    this.Detail.ListImage[i] = e
    console.log(this.Detail);
    this._DichvuService.UpdateDichvu(this.Detail).subscribe();
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
    this._DichvuService.UpdateDichvu(this.Detail).subscribe();
  }
  Update(item:any)
  {
    this._DichvuService.UpdateDichvu(item).subscribe();
  }
  CloseDrawer()
  {
    this._DichvuComponent.drawer.close();
  }
}
