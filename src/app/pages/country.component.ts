import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import { DataService } from '../services/data.service';
import Chart from 'chart.js/auto';
import { Country } from '../models/country';
import { Participation } from '../models/participation';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart<"line", string[], number>;
  public titlePage?: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public error!: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private DataService: DataService) {
  }

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.DataService.getCountries().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((i: Country) => i.country === countryName);
          this.titlePage = selectedCountry?.country;
          const participations = selectedCountry?.participations.map((i: Participation) => i);
          this.totalEntries = participations?.length ?? 0;
          const years = selectedCountry?.participations.map((i: Participation) => i.year) ?? [];
          const medals = selectedCountry?.participations.map((i: Participation) => i.medalsCount.toString()) ?? [];
          this.totalMedals = medals.reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
          const nbAthletes = selectedCountry?.participations.map((i: Participation) => i.athleteCount.toString()) ?? []
          this.totalAthletes = nbAthletes.reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
          this.buildChart(years, medals);
        }
      },
      (error) => {
        this.error = error.message
        console.log(error.message)
      }
    );
  }

  buildChart(years: number[], medals: string[]) {
    const lineChart = new Chart("countryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }
}
