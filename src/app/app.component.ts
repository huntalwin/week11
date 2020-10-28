import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'week11lab';
  socket:SocketIOClient.Socket; //Socket object
  pollObject:any;//Poll object 
  selOption:number //Select favorite selection
  voteData:number[] = [];


  constructor(){
    //Set up connection between backend and frontend 
    this.socket = io.connect(); 
  }

  
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Angular', 'MongoDB', 'Express.js', 'Golang', 'Python', 'C#', 'PhP',"C++"];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: this.voteData, label: 'Code tingz' },
  ];


  ngOnInit(){
    this.listen2Event();
  }

  listen2Event(){
    //Get pollObject from server
    this.socket.on('newpoll',(data)=>{
      this.pollObject = data; //Set the current poll object to the new poll (from server)
      //adding new data to bar chart
      this.countVotes();
    });
  }

  //Function for button that use for submit the vote
  submitVote(){
    console.log('New vote submit' + this.selOption)
    this.socket.emit('votesubmit',this.selOption);//Emit an event call newpoll (sending a selected option to the server)
    location.reload();
  }

  //Counts vote:
  countVotes(){
    for(let i=0;i<this.pollObject.options.length;i++){
      this.voteData.push(this.pollObject.options[i].count);
    }
  }

}


