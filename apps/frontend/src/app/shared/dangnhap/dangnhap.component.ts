import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'taza-base-dangnhap',
  templateUrl: './dangnhap.component.html',
  styleUrls: ['./dangnhap.component.scss'],
})
export class DangnhapComponent implements OnInit {
  User: any = {};
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
  signInForm!: any;
  signUpForm!: any;
  isDangky = false
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notifierService: NotifierService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      SDT: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
      password: ['', Validators.required],
      rememberMe: [''],
    });
    this.signUpForm = this._formBuilder.group({
      Hoten: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
      SDT: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
      confirmPassword: ['', Validators.required],
    });
  }
  Dangnhap(user: any) {
    if (user.SDT == undefined || user.SDT == '') {
      this._notifierService.show({
        message: 'Vui lòng nhập số điện thoại',
        type: 'error',
      });
    } else if (user.password == undefined || user.password == '') {
      this._notifierService.show({
        message: 'Vui lòng nhập Mật Khẩu',
        type: 'error',
      });
    } else {
      this._authService.Dangnhap(user).subscribe(data => {
        if (!data[0]) {
          this._notifierService.show({
            message: data[1],
            type: 'error',
          });
        }
        else
        {const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL');
          if(redirectURL)
          {
          this._router.navigateByUrl(redirectURL);
          }
          else {window.location.href="/"}
        }
      });
    }
  }
}
