import { Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  /* Here messageService must be public, so we can bind to it 
  in the template */
  constructor(public messageService: MessageService){}
}
