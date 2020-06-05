import { Component } from '@angular/core';
import io from 'socket.io-client';

interface Message {
  username: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private socket;

  username;
  usernameInput: string; 
  userName: string;

  gloabalMessages : string[] = [];
  messages : Message[] = [];
  curMessage: string;
  togglechat: boolean = false;

  public ngOnInit(): void {
    this.socket = io('http://localhost:5000');
    window.onbeforeunload = () => this.ngOnDestroy();
  }
  
  public ngAfterViewInit() {

    this.socket.on("message" , (data) => {
      console.log('in on in');
      let nmessage: Message = {
        username: data.username,
        message: data.message
      }
      this.messages.push(nmessage);
    });
    this.socket.on("logged-in" , (data) => {
      this.gloabalMessages.push(data +" logged in..");
    });
    this.socket.on("users" , (data) => {
      this.addParticipantsMessage(data);
    });
    this.socket.on("left" , (data) => {
      this.gloabalMessages.push(data +" left...");
    });
     
    
  }


  onEnter(){
    this.togglechat = true;
    this.addUser(this.usernameInput);
  }
  
  sendMessage(){
    this.socket.emit("send", this.curMessage);
    this.curMessage = '';
  }

  addUser(name) {
    this.userName = name;
    this.socket.emit("login", name);
  }

  addParticipantsMessage(data){
    if(data == 1){
      this.gloabalMessages.push('there is 1 participant');
    }
    else{
      this.gloabalMessages.push( "there are " + data + " participants");
    }
  }


  ngOnDestroy() {
    this.socket.emit("lefted", this.userName);
    this.socket.disconnect();
  }
}
