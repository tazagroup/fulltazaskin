import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { ZaloznsComponent } from '../zalozns.component';
import { ZaloznsService } from '../zalozns.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { TYPE_ZNS, ZALO_OA } from 'apps/frontend/src/app/shared/shared.utils';
@Component({
  selector: 'app-zalozns-detail',
  templateUrl: './zalozns-detail.component.html',
  styleUrls: ['./zalozns-detail.component.css']
})
export class ZaloznsDetailComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _ZaloznsComponent: ZaloznsComponent,
    private _ZaloznsService: ZaloznsService
    
  ) {}
  ngOnInit(): void {
    this._ZaloznsService.getAllZaloznss().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._ZaloznsComponent.drawer.open();
        this._ZaloznsService.getZaloznsById(id).subscribe();
        this._ZaloznsService.zalozns$.subscribe((res:any) => {
          if (res) {
            console.log(res);    
            this.Detail = res;
            this._ZaloznsService.getRatingbyMsgID(res.ResponWebHook.message.msg_id).subscribe((data)=>
            {
              this.Detail.Danhgia = data
            });
            
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
    this._ZaloznsComponent.drawer.close();
  }
  Update(data:any)
  {
    this._ZaloznsService.UpdateZalozns(data).subscribe();
  }
  GetTypeZns(item:any)
  {
      return TYPE_ZNS(item)
  }
  GetZalooa(item:any)
  {
      return ZALO_OA(item)
  }
}