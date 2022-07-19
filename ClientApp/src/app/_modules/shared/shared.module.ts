import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule} from 'ngx-timeago'

export class MyIntl extends TimeagoIntl {
  // do extra stuff here...
  }
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
     ToastrModule.forRoot({
       positionClass:'toast-bottom-right'
     }),
     TabsModule.forRoot(),
     NgxGalleryModule,
     FileUploadModule ,
     PaginationModule.forRoot(),
     BsDatepickerModule.forRoot(),
     ButtonsModule.forRoot(),
     TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl, useClass: MyIntl  },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    })
  ],
  exports:[
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxGalleryModule ,
    FileUploadModule ,
    PaginationModule,
    BsDatepickerModule,
    ButtonsModule,
    TimeagoModule
  ]
})
export class SharedModule { }
