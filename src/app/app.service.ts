import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })


// {
//   "/api/*": {
//     "target": "http://10.10.2.120/",
//     "pathRewrite": {
//       "^/api": ""
//     },
//     "changeOrigin": true,
//     "secure": false,
//     "logLevel": "debug"
//   }
// }


export class Service {

  constructor() {}



}




