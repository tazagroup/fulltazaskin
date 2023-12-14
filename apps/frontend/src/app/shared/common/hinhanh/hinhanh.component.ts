import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadService } from '../../upload.service';

@Component({
  selector: 'app-hinhanh',
  templateUrl: './hinhanh.component.html',
  styleUrls: ['./hinhanh.component.css']
})
export class HinhanhComponent implements OnInit {
  @Input() Image!:any;
  @Output() UploadEmit = new EventEmitter();
  constructor(
    private _UploadService:UploadService
  ) { }
  ngOnInit() {
  }
  onSelect(event: any) {
    this._UploadService.uploadDriver(event.addedFiles[0]).subscribe((data) => {
      this.Image = data
      this.UploadEmit.emit(this.Image);
      }
    )
  }
  onRemove(data: any) {
    this._UploadService.DeleteuploadDriver(data).subscribe(() => {
      this.Image = {}
      this.UploadEmit.emit(this.Image);
    })
  }
}
