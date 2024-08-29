import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UsersService } from '../../auth/users.service';
@Component({
  selector: 'taza-base-sendercode',
  templateUrl: './sendercode.component.html',
  styleUrls: ['./sendercode.component.scss'],
})
export class SendercodeComponent implements OnInit {
  User: any = {ref_id:0};
  ListForm: any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
  signInForm!: any;
  signUpForm!: any;
  isDangky = false
  countDown = 5;
  interval: any;
  constructor(
    private _usersService: UsersService,
    private _formBuilder: FormBuilder,
    private _notifierService: NotifierService,
    private _router: Router,
    public _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}
  Xacthuc(user: any) {
    if (!user.SDT) {
      this._notifierService.show({
        message: 'Vui Lòng Nhập Số Điện Thoại',
        type: 'error',
      });
    }
    else if(!this.phoneRegex.test(user.SDT))
    {
      this._notifierService.notify('error', `Số Điện Thoại Không Hợp Lệ`);
    }
    else if (user.password==null ||user.password =='') {
      this._notifierService.show({
        message: 'Vui Lòng Nhập Mật Khẩu',
        type: 'error',
      });
    }
    else {
      user.Role = 'customer'
      this._usersService
      .Dangky(user)
      .subscribe((data: any) => {
        console.log(data);
            if(data[0])
            {
              this._notifierService.show({
                message: data[1],
                type: 'success',
              });
              this._router.navigate(['dangnhap']);
              // const dialogRef = this._dialog.open(templateRef);
              // this.interval = setInterval(() => {
              //   this.countDown--;
              //   if (this.countDown === 0) {
              //     clearInterval(this.interval);
              //     dialogRef.close();
              //     this._router.navigate(['dangnhap']);
              //   }
              // }, 0);
            }
            else {
          this._notifierService.show({
          message: data[1],
          type: 'error',
        });
            }
      });
    }
  }
}
