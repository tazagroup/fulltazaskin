import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { ZalotokenComponent } from '../zalotoken.component';
import { ZalotokenService } from '../zalotoken.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
@Component({
  selector: 'app-zalotoken-detail',
  templateUrl: './zalotoken-detail.component.html',
  styleUrls: ['./zalotoken-detail.component.css']
})
export class ZalotokenDetailComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _ZalotokenComponent: ZalotokenComponent,
    private _ZalotokenService: ZalotokenService
    
  ) {}
  ngOnInit(): void {
    this._ZalotokenService.getAllZalotokens().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._ZalotokenComponent.drawer.open();
        this._ZalotokenService.getZalotokenById(id).subscribe();
        this._ZalotokenService.zalotoken$.subscribe((res:any) => {
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
    this._ZalotokenComponent.drawer.close();
  }
  Update(data:any)
  {
    this._ZalotokenService.UpdateZalotoken(data).subscribe();
  }
}