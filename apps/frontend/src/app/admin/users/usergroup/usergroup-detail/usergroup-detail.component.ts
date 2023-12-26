import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { UsergroupComponent } from '../usergroup.component';
import { UsergroupService } from '../usergroup.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { MenuService } from '../../../cauhinh/menu/menu.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotifierService } from 'angular-notifier';
import { flattenData, nest } from 'apps/frontend/src/app/shared/shared.utils';
@Component({
  selector: 'app-usergroup-detail',
  templateUrl: './usergroup-detail.component.html',
  styleUrls: ['./usergroup-detail.component.css']
})
export class UsergroupDetailComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  ListMenu:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _UsergroupComponent: UsergroupComponent,
    private _UsergroupService: UsergroupService,
    private _MenuService: MenuService,
    private _NotifierService: NotifierService,
    
  ) {}
  ngOnInit(): void {
    this._MenuService.getAllMenus().subscribe()   
    this._UsergroupService.getAllUsergroups().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._UsergroupComponent.drawer.open();
        this._UsergroupService.getUsergroupById(id).subscribe();
        this._UsergroupService.usergroup$.subscribe((res:any) => {
          if (res) {   
            this._MenuService.menus$.subscribe((data:any)=>{
              this.ListMenu = data.map((v:any)=>({Title:v.Title,Slug:v.Slug,id:v.id,pid:v.pid,Checked:false}))
              this.ListMenu.forEach(v => {
                if (!res.ListMenu.find((v1:any)=> v1.id === v.id)) {
                  res.ListMenu.push(v);
                }
              });
            })             
            res.ListMenu = nest(res.ListMenu)
            this.Detail = res; 
            console.log(res);
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
    this._UsergroupComponent.drawer.close();
  }
  Update(data:any)
  {
    data.ListMenu =flattenData(data.ListMenu);
    this._UsergroupService.UpdateUsergroup(data).subscribe(()=>
    {
      this._NotifierService.notify("success","Cập Nhật Thành Công")
      window.location.href = window.location.pathname
    });
  }
  onChange(event: MatSlideToggleChange,index:any) {
    this.Detail.ListMenu[index].Checked =event.checked    
  }
  onChangeChidren(event: MatSlideToggleChange,index:any,indexChildren:any) {
    this.Detail.ListMenu[index].children[indexChildren].Checked =event.checked    
  }
  ResetGroup() {
    this.Detail.ListMenu = []
    this._UsergroupService.UpdateUsergroup(this.Detail).subscribe(()=>
    {
      this._NotifierService.notify("success","Reset Thành Công")
      window.location.href = window.location.pathname
    });
  }
}