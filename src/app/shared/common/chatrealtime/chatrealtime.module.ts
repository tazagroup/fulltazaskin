import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatrealtimeComponent } from './chatrealtime.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [ChatrealtimeComponent],
  exports: [ChatrealtimeComponent]
})
export class ChatrealtimeModule { }
