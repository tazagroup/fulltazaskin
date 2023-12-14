import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { DichvuComponent } from '../dichvu.component';
import { DichvuService } from '../dichvu.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { DanhmucService } from '../../danhmuc/danhmuc.service';
@Component({
  selector: 'app-dichvu-danhmuc',
  templateUrl: './dichvu-danhmuc.component.html',
  styleUrls: ['./dichvu-danhmuc.component.css']
})
export class DichvuDanhmucComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _DichvuComponent: DichvuComponent,
    private _DanhmucService: DanhmucService
    
  ) {}
  ngOnInit(): void {
    this._DanhmucService.getAllDanhmucs().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._DichvuComponent.drawer.open();
        this._DanhmucService.getDanhmucById(id).subscribe();
        this._DanhmucService.danhmuc$.subscribe((res:any) => {
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
    this.router.navigate(['../../'], { relativeTo: this.route });
    this._DichvuComponent.drawer.close();
  }
  Update(data:any)
  {
    this._DanhmucService.UpdateDanhmuc(data).subscribe();
  }
  GetUpload(e:any)
  {
    this.Detail.Image = e
    this._DanhmucService.UpdateDanhmuc(this.Detail).subscribe();
  }
}