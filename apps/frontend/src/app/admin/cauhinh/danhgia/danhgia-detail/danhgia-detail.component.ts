import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { DanhgiaComponent } from '../danhgia.component';
import { DanhgiaService } from '../danhgia.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { DanhmucService } from '../../../danhmuc/danhmuc.service';
@Component({
  selector: 'app-danhgia-detail',
  templateUrl: './danhgia-detail.component.html',
  styleUrls: ['./danhgia-detail.component.css']
})
export class DanhgiaDetailComponent implements OnInit {
  Detail: any = {}
  List: any[] = []
  Danhmucs: any[] = []
  APITINYMCE = environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _DanhgiaComponent: DanhgiaComponent,
    private _DanhmucService: DanhmucService,
    private _DanhgiaService: DanhgiaService

  ) { }
  ngOnInit(): void {
    this._DanhmucService.getAllDanhmucs().subscribe()
    this._DanhmucService.danhmucs$.subscribe((data: any) => {
      if (data) {
        this.Danhmucs = data.filter((v: any) => v.Type == 'danhgia')
      }
    })
    this._DanhgiaService.getAllDanhgias().subscribe()
    this._DanhgiaService.danhgias$.subscribe((data: any) => {
      if (data) {
        this.List = data
      }
    })
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._DanhgiaComponent.drawer.open();
        this._DanhgiaService.getDanhgiaById(id).subscribe();
        this._DanhgiaService.danhgia$.subscribe((res: any) => {
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
    resize: true,
    toolbar_mode: 'sliding',
    statusbar: false,
    branding: false,
    image_advtab: true,
    autoresize_bottom_margin: 20,
    autoresize_min_height: 50,
    height: "400",
    deprecation_warnings: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
      'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help'
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
  CloseDrawer() {
    this.router.navigate(['../'], { relativeTo: this.route });
    this._DanhgiaComponent.drawer.close();
  }
  Update(data: any) {
    this._DanhgiaService.UpdateDanhgia(data).subscribe();
  }
}