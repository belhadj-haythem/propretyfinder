import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FinderService {

  urlLoadResponse = '/assets/response.json';
  constructor(private http: Http) { }

  getProprety() {
    return this.http.get(this.urlLoadResponse);
   }
}
