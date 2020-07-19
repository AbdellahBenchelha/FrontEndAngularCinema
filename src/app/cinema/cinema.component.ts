import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';
import {tick} from '@angular/core/testing';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public currentVille;
  public currentCinema;
  public currentProjection : any;
  public salles : any;
  public selectedTickets;

  constructor(public cinemaService: CinemaService) {}

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, err => {
        console.log(err);
      })
  }

  onGetCinemas(v) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;
      }, err => {
        console.log(err);
      })

  }

  onGetSalles(c) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle=>{
          this.cinemaService.getProjection(salle)
            .subscribe(data => {
              salle.projections = data;
            }, err => {
              console.log(err);
            })
        })
      }, err => {
        console.log(err);
      })

  }

  onGetTicketsPlaces(p) {

    this.currentProjection= p;
    this.selectedTickets=[];
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=> {
        this.currentProjection.tickets=data;
      },err=>{
        console.log(err);

      })

  }

  onSelectTicket(t) {
    if(!t.selected){
      t.selected=true
      this.selectedTickets.push(t);
    }
    else{
      t.selected=false
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t)
  {
    let str="btn ticket ";
    if(t.reservee==true){

      str+="btn-danger";
    }
    else if(t.selected){
      str+="btn-warning";

    }
    else {
      str+="btn-success";
    }
    return str
  }

  onPayTickets(dataForm) {
    let tickets=[];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data=> {
        alert("Ticket(s) réservé(s) avec succès")
        this.onGetTicketsPlaces(this.currentProjection)
      },err=>{
        console.log(err);
      })
  }
}
