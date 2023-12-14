import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { VttechthanhtoanComponent } from '../vttechthanhtoan.component';
import { VttechthanhtoanService } from '../vttechthanhtoan.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
@Component({
  selector: 'app-vttechthanhtoan-detail',
  templateUrl: './vttechthanhtoan-detail.component.html',
  styleUrls: ['./vttechthanhtoan-detail.component.css']
})
export class VttechthanhtoanDetailComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _VttechthanhtoanComponent: VttechthanhtoanComponent,
    private _VttechthanhtoanService: VttechthanhtoanService
    
  ) {}
  ngOnInit(): void {
    this._VttechthanhtoanService.getAllVttechthanhtoans().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._VttechthanhtoanComponent.drawer.open();
        this._VttechthanhtoanService.getVttechthanhtoanById(id).subscribe();
        this._VttechthanhtoanService.vttechthanhtoan$.subscribe((res:any) => {
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
    this._VttechthanhtoanComponent.drawer.close();
  }
  Update(data:any)
  {
    this._VttechthanhtoanService.UpdateVttechthanhtoan(data).subscribe();
  }
}