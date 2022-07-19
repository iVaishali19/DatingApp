import { Component, Directive, Input, OnInit } from '@angular/core';
import { FileSelectDirective, FileDropDirective, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
  
})
export class PhotoEditorComponent implements OnInit {
  @Input() member:Member;
  @Input() user:User;
  @Directive({ selector: '[ng2FileSelect]' })
  @Directive({ selector: '[ng2FileDrop]' })
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean =false;
  hasAnotherDropZoneOver:boolean =false;
  baseUrl= environment.apiUrl;
  
  response:string;


  constructor(private accountService:AccountService, private memberService:MembersService) { }

  ngOnInit(): void {
    console.log(this.user.token);
    this.intializeUploader();
  }
 public fileOverBase(e:any){
    this.hasBaseDropZoneOver=e;
  }

  setMainPhoto(photo:Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(()=>{
      this.user.photoUrl=photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photUrl=photo.url;
      this.member.photos.forEach(p=>{
        if(p.isMain) p.isMain=false;
        if(p.id===photo.id) p.isMain=true;
      })
    })
  }

  deletePhoto(photoId:number){
    this.memberService.deletePhoto(photoId).subscribe(()=>{
      this.member.photos=this.member.photos.filter(x=>x.id!==photoId);
     
      })
    }
  

  intializeUploader(){
    const uploaderOptions: FileUploaderOptions = {
    
      url:this.baseUrl+'users/add-photo',
      authToken:'Bearer' +this.user.token,
      isHTML5:true,
      allowedFileType:['image'],
      removeAfterUpload:true,
      autoUpload:false,
      maxFileSize:10 *1024*1024,
      
    };
    this.uploader=new FileUploader(uploaderOptions);
    this.uploader.onAfterAddingFile =(file)=>{
      file.withCredentials=false;
    }

    this.uploader.onSuccessItem = (item, response, status,headers)=>{
      if(response){
        const photo=JSON.parse(response);
        this.member.photos.push(photo);
        if(photo.isMain){
          this.user.photoUrl=photo.url;
          this.member.photUrl=photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  }
}
