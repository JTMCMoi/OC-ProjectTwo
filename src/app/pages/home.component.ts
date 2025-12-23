import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { DataService } from '../services/data.service';
import { MedalChartComponent } from '../components/medal-chart.component';
import { Country } from '../models/country';
import { Participation } from '../models/participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public totalCountries: number = 0
  public totalJOs: number = 0
  public error!:string
  titlePage: string = "Medals per Country";
  public countriesNameList!: string[];
  public countriesMedalCount!: number[];

  constructor(private router: Router, private DataService: DataService) { }

  ngOnInit() {
    this.DataService.getCountries().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: Country) => i.participations.map((f: Participation) => f.year)).flat())).length;
          this.countriesNameList = data.map((i: Country) => i.country);
          this.totalCountries = this.countriesNameList.length;
          const medals = data.map((i: Country) => i.participations.map((i: Participation) => (i.medalsCount)));
          this.countriesMedalCount = medals.map((i) => i.reduce((acc: number, i: number) => acc + i, 0));
        }
      },
      (error) => {
        console.log(error.message);
      }
    )
  }
}

