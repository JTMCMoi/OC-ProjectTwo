import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { CountryService } from '../services/data.service';
import { MedalChartComponent } from '../components/medal-chart.component';
import { Country } from '../models/country';
import { Participation } from '../models/participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries: number = 0
  public totalJOs: number = 0
  public error!:string
  titlePage: string = "Medals per Country";
  public countriesNameList!: string[];
  public countriesMedalCount!: number[];

  constructor(private router: Router, private CountryService: CountryService) { }

  ngOnInit() {
    this.CountryService.getCountries().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
          this.countriesNameList = data.map((i: any) => i.country);
          this.totalCountries = this.countriesNameList.length;
          const medals = data.map((i: Country) => i.participations.map((i: Participation) => (i.medalsCount)));
          this.countriesMedalCount = medals.map((i) => i.reduce((acc: number, i: number) => acc + i, 0));
          this.buildPieChart(this.countriesNameList, this.countriesMedalCount);
          console.log(`PaysHome: ${this.countriesNameList}`)
        }
      },
      (error) => {
        console.log(error.message);
      }
    )
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.pieChart = pieChart;
  }
}

