import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrl: './medal-chart.component.scss'
})
export class MedalChartComponent implements OnChanges {
  @Input() countries!:string[];
  @Input() medals!:number[];
  public chart!: Chart<"pie", number[], string>;

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ( !this.chart) {
      if ( this.countries && this.medals ) {
        this.buildChart(this.countries,this.medals)
      }
    }
  }

  private buildChart(countries:string[], medals:number[]): void {
    const chart = new Chart("homechart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: medals,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = chart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = chart.data.labels ? chart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.chart = chart;
  }
}
