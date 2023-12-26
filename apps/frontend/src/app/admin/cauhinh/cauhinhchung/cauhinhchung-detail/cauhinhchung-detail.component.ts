import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { CauhinhchungComponent } from '../cauhinhchung.component';
import { CauhinhchungService } from '../cauhinhchung.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
@Component({
  selector: 'app-cauhinhchung-detail',
  templateUrl: './cauhinhchung-detail.component.html',
  styleUrls: ['./cauhinhchung-detail.component.css']
})
export class CauhinhchungDetailComponent implements OnInit {
  Detail: any={Content:{Cookie:'',XsrfToken:''}}
  List:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  TestToken:any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _CauhinhchungComponent: CauhinhchungComponent,
    private _CauhinhchungService: CauhinhchungService
    
  ) {}
  ngOnInit(): void {
    this._CauhinhchungService.getAllCauhinhchungs().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._CauhinhchungComponent.drawer.open();
        this._CauhinhchungService.getCauhinhchungById(id).subscribe();
        this._CauhinhchungService.cauhinhchung$.subscribe((res:any) => {
          if (res) {    
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
    this._CauhinhchungComponent.drawer.close();
  }
  Update(data:any)
  {

    this._CauhinhchungService.UpdateCauhinhchung(data).subscribe();
  }
  TestTokenVttech()
  {
    this._CauhinhchungService.TestTokenVttech().subscribe((data)=>this.TestToken = data)
  }
}