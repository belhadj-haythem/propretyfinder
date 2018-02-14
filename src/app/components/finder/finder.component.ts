import { FinderService } from '../../Services/finder.service';
import { Http } from '@angular/http';
import { selector } from 'rxjs/operator/publish';
import { Component, OnInit } from '@angular/core';
import { Dijkstra } from '../../Models/Dijkstra';
import { VertexObject } from '../../Models/VertexObject';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.css']
})
export class FinderComponent implements OnInit {
  showResult = false;
  currency: string;
  totalCost = 0;
  totalDuration = '';
  selectedArrival = '';
  selectedDeparture = '';
  selectedValue = '0';
  deals = [];
  finalDeals = [];
  departureList = [];
  finalArrayResult = [];
  arrivalList = [];
  arrayWeight = [];
  vertexList: VertexObject[];
  constructor(
    private finderService: FinderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // initialisate arrays to use
    this.vertexList = [];
    this.finalArrayResult = [];
    this.finalDeals = [];
    // Getting the response file and parse it into deals object
    this.finderService.getProprety().subscribe(result => {
      this.currency = JSON.parse(result.text()).currency;
      this.deals = JSON.parse(result.text()).deals;
      console.log(this.deals);
      this.deals.forEach(deal => {
        // Filling the List of departure
        if (!this.departureList.includes(deal.departure)) {
          this.departureList.push(deal.departure);
        }

        // Filling the list of arrival
        if (!this.arrivalList.includes(deal.arrival)) {
          this.arrivalList.push(deal.arrival);
        }
      });
    });
  }

  search() {
    if (this.selectedArrival === '' || this.selectedDeparture === '' || this.selectedValue === '0') {
      this.snackBar.open('All fields are required ! Please verify', 'OK');
    } else if (this.selectedDeparture === this.selectedArrival) {
      this.snackBar.open('Departure and arrival should not be the same !', 'OK');
    } else {
      this.searchForShortestPath(this.selectedDeparture, this.selectedArrival, this.selectedValue);
    }
  }

  reset() {
    location.reload();
    /*this.selectedArrival = '';
    this.selectedDeparture = '';
    this.selectedValue = '0';
    this.showResult = false;*/
  }
  /**
   * Button click, start applying our algorithm
   */
  searchForShortestPath(dep: string, arr: string, value: string) {
    this.finalArrayResult = [];
    this.totalCost = 0;
    this.totalDuration = '';
    this.departureList.forEach(element => {
      const ob = new VertexObject();
      ob.name = element;
      this.vertexList.push(ob);
    });

    // Building vertex array , with fastest or cheapest search (minimum duration or cost)
    this.vertexList.forEach(res => {
      let edgeString = '{';
      this.deals.forEach((deal, i) => {
        if (deal.departure === res.name) {
          if (value === '1') {
            const cost = deal.cost - ((deal.cost * deal.discount) / 100);
            edgeString += '"' + deal.arrival + '" :' + cost;
          } else {
            const duration =
            parseInt(deal.duration['h'], 10) * 60 +
            parseInt(deal.duration['m'], 10);
          edgeString += '"' + deal.arrival + '" :' + duration;
          }
          if (i + 1 < this.deals.length) {
            if (this.deals[i + 1].departure !== deal.departure) {
              edgeString += ' }';
              return;
            } else {
              edgeString += ', ';
            }
          } else {
            edgeString += ' }';
          }
        }
      });
      res.edge = edgeString;
    });

    // start drawing our virtual graph for dijkstra
    const graph = new Dijkstra();
    this.vertexList.forEach(obb => {
      graph.addVertex(obb.name, JSON.parse(obb.edge));
    });

    // Getting the result of the algorithm
    const result = graph.shortestPath(dep, arr);

    // Start searching for weights and getting the final deals (Duration)
    this.getWeightOfPaths(result, value);
    result.forEach(res => {
      const that = this;
      const obj = this.finalDeals.find(function(deal, i) {
        if (value === '1') {
          const cost = deal.cost - ((deal.cost * deal.discount) / 100);
          if (that.arrayWeight.includes(cost)) {
            return deal.departure === res;
          }
        } else {
          const duration = parseInt(deal.duration['h'], 10) * 60 + parseInt(deal.duration['m'], 10);
          if (that.arrayWeight.includes(duration)) {
            return deal.departure === res;
          }
        }
      });
      this.finalArrayResult.push(obj);
    });
    this.finalArrayResult = this.finalArrayResult.filter(
      item => item !== undefined
    );
    // Final array result contains all informations
    console.log(this.finalArrayResult);

    // calculate total hour and price:
    let min, hour, dur = 0;
    this.finalArrayResult.forEach(res => {
      this.totalCost += res.cost - ((res.cost * res.discount) / 100);
      dur += parseInt(res.duration['h'], 10) * 60 + parseInt(res.duration['m'], 10);
    });
    min = dur % 60;
    hour = Math.floor(dur / 60);
    this.totalDuration = hour + 'h' + min;
    this.showResult = true;
  }

  /**
   * Searching for deals with results, to find the weights of result paths
   * Function searching when user searchs the fastest or cheapest path
   * Depending on value passed in parameters
   * @param result
   */
  public getWeightOfPaths(result: any, value: string): number[] {
    let weight = 0;
    let weightArray = [];
    let test = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < this.deals.length; j++) {
        if (this.deals[j].departure === result[i]) {
          test = true;
          if (i + 1 < result.length) {
            if (
              this.deals[j].departure === result[i] &&
              this.deals[j].arrival === result[i + 1]
            ) {
              if (value === '1') {
                const cost =
                this.deals[j].cost -
                ((this.deals[j].cost * this.deals[j].discount) / 100);
              weightArray.push(cost);
              this.finalDeals.push(this.deals[j]);
              weight += cost;
              } else {
                const duration =
                parseInt(this.deals[j].duration['h'], 10) * 60 +
                parseInt(this.deals[j].duration['m'], 10);
              weightArray.push(duration);
              this.finalDeals.push(this.deals[j]);
              weight += duration;
              }
            }
          }
        } else {
          if (test) {
            const minValue = Math.min.apply(null, weightArray);
            this.arrayWeight.push(minValue);
            weightArray = [];
          }
          test = false;
        }
      }
    }
    return this.arrayWeight.filter(item => item !== Infinity);
  }

}

