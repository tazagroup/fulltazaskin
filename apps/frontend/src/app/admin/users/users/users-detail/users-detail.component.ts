import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'apps/frontend/src/environments/environment';
import { UsersComponent } from '../users.component';
import { UsersService } from '../users.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { Role } from '../../user';
import { UsergroupService } from '../../usergroup/usergroup.service';
@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css']
})
export class UsersDetailComponent implements OnInit {
  Detail: any={}
  List:any[] =[]
  Groups:any[] =[]
  APITINYMCE= environment.APITINYMCE;
  Role:any = Role
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _UsersComponent: UsersComponent,
    private _UsersService: UsersService,
    private _UsergroupService: UsergroupService,
    
  ) {}
  ngOnInit(): void {
    this._UsergroupService.getAllUsergroups().subscribe()
    this._UsergroupService.usergroups$.subscribe((data:any)=>{
      this.Groups  = data
    })
    this._UsersService.getAllUserss().subscribe(data=> this.List= data)
    this.route.params.subscribe((paramsId) => {
      const id = paramsId['id'];
      if (id) {
        this._UsersComponent.drawer.open();
        this._UsersService.getUsersById(id).subscribe();
        this._UsersService.users$.subscribe((res:any) => {
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
    this._UsersComponent.drawer.close();
  }
  Update(data:any)
  {
    this._UsersService.UpdateUsers(data).subscribe();
  }
}