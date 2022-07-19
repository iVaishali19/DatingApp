import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs:TabsetComponent;
  activeTabs:TabDirective;
  messages : Message[]=[];
  member: Member | undefined;
  userName: string | undefined;
  galleryOptions: NgxGalleryOptions[] | undefined;
  galleryImages: NgxGalleryImage[] | undefined;
  
  

  constructor(private memberService: MembersService, 
    private route: ActivatedRoute, private messageService:MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data:any)=>{
      this.member=data.member;
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  this.galleryImages=this.getImages(); 

  }

  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for (const photo of this.member?.photos ?? []) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadMessages(){
    this.messageService.getMessageThread(this.member?.userName!).subscribe(
      (response:any)=>{
        this.messages = response;        
      }
    )
  }

  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active= true;
  }

  onTabActived(data:TabDirective){
    this.activeTabs=data;
    if(this.activeTabs.heading=='Messages'&& this.messages.length===0){
      this.loadMessages();
    }
  }
}
