import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { ChinhanhComponent } from '../chinhanh.component';
import { ChinhanhService } from '../chinhanh.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { GenId } from 'apps/frontend/src/app/shared/shared.utils';
@Component({
  selector: 'app-chinhanh-chitiet',
  templateUrl: './chinhanh-chitiet.component.html',
  styleUrls: ['./chinhanh-chitiet.component.css']
})
export class ChinhanhChitietComponent implements OnInit {
  Detail: any={ListSocial:[]}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _ChinhanhComponent: ChinhanhComponent,
    private _ChinhanhService: ChinhanhService
    
  ) {}
  ngOnInit(): void {
    this._ChinhanhService.getAllChinhanhs().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._ChinhanhComponent.drawer.open();
        this._ChinhanhService.getChinhanhById(id).subscribe();
        this._ChinhanhService.chinhanh$.subscribe((res:any) => {
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
    this._ChinhanhComponent.drawer.close();
  }
  Update(data:any)
  {
    this._ChinhanhService.UpdateChinhanh(data).subscribe();
  }
  AddSocial()
  {
    const item = {id:'',Title:'',Value:'',LinkUrl:''}
    item.id= GenId(5,true)
    this.Detail.ListSocial.push(item)
  }
}