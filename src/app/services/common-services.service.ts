import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError, timeout, TimeoutError } from 'rxjs';
import { environment } from '../../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {
  public apiUrl = environment.apiUrl; 
  headers: any = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: '*/*',
    device_type: '0',
  });
  headersObj: any = new HttpHeaders({}); // this header for Upload API
  public timeoutError: boolean = false;

  constructor(
    private toaster: ToastrService,
    private router: Router,
    public http: HttpClient,

  ) {
    console.log('>>>>>>>>>>>>>');
    
  }


  //API function Service
  api(_data: any, url: any, flag: any, method?: string): Observable<any> {
    if (
      _data &&
      ((_data.note && _data.note.length && _data.note.length > 10000) ||
        (_data.notes && _data.notes.length && _data.notes.length > 10000))
    ) {
      this.customPopups('Note cannot exceed more than 10000 characters', 2);
      return of(false);
    }
    let api_url = localStorage.getItem('apiUrl');
    if (!api_url) {
      api_url = environment.apiUrl;
    }
    let output;
    let hitting_url = api_url + url;
    if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
      hitting_url = url;
    }
    if (method === 'get') {
      output = this.http.get<any>(hitting_url, { headers: this.headers });
    } else if (method === 'put') {
      output = this.http.put<any>(hitting_url, _data, {
        headers: this.headers,
      });
    } else if (method === 'object') {
      output = this.http.post<any>(hitting_url, _data, {
        headers: this.headers,
      });
    } else {
      output = this.http.post<any>(hitting_url, _data, {
        headers: this.headers,
      });
    }

    return output.pipe(
      timeout(60000),
      // retry(3),
      map((data: any) => {
        if (data.flag === 377 || data.flag === 801) {
          this.loginRedirect();
          localStorage.clear();
          return false;
        }

        if (data && data.data && data.data.showFeedbackPopup == true) {
          let initialState = {};
          if (data && data.data && data.data.micro_loan_id) {
            initialState = {
              microloan_id: data.data.micro_loan_id,
              url: '/accept_offers_request_v2',
            };
          } else {
            initialState = {
              url: '/created_offers',
            };
          }
         
        }
        if (data && flag) {
          if (data.err) {
            if (data.override_text) {
              this.customPopups(data.override_text, 1);
            } else {
              this.customPopups(data.err, 1);
            }
          } else {
            this.router.navigate(['login']);
          }
        }
        return data;
      }),
      catchError((error: any) => {
        if (error instanceof TimeoutError) {
          if (!this.timeoutError) {
            this.timeoutError = true;
            this.customPopups('Request Timeout', 1);
          }
          return throwError({ error: 'Timeout Exception' });
        }
        if (error.status === 0) {
          if (!this.timeoutError) {
            this.customPopups('Unable to fetch data from server', 1);
          }
        }
        if (error.status === 404) {
          if (!this.timeoutError) {
            this.customPopups('Invalid Request - URL not found', 1);
          }
        }
        return throwError(error);
      })
    );
  }

  //Upload File Function
  uploadApi(_data: any, url: any, flag: any, method?: string): Observable<any> {
    let api_url = localStorage.getItem('apiUrl');
    if (!api_url) {
      api_url = environment.apiUrl;
    }
    return this.http
      .post<any>(`${api_url}${url}`, _data, { headers: this.headersObj })
      .pipe(
        timeout(60000),
        map((data: any) => {
          if (data.flag === 377) {
            this.loginRedirect();
            return false;
          }
          if (data.flag === 4) {
            this.loginRedirect();
            if (data && data.override_text) {
              this.toaster.error(data.override_text);
            }
            return false;
          }
          if (data && flag) {
            if (data.err) {
              if (data.override_text) {
                this.customPopups(data.override_text, 1);
              } else {
                this.customPopups(data.err, 1);
              }
            } else {
              this.router.navigate(['login']);
            }
          }
          return data;
        }),
        catchError((error: any) => {
          if (error instanceof TimeoutError) {
            if (!this.timeoutError) {
              this.timeoutError = true;
              this.customPopups('Request Timeout', 1);
            }
            return throwError({ error: 'Timeout Exception' });
          }
          if (error.status === 0) {
            if (!this.timeoutError) {
              this.customPopups('Unable to fetch data from server', 1);
            }
          }
          return throwError(error);
        })
      );
  }

  customPopups(data: any, error: any) {
    if (error === 1) {
      this.toaster.error(data);
    } else if (error === 0) {
      this.toaster.success(data);
    } else if (error === 2) {
      this.toaster.warning(data);
    }
  }

  loginRedirect() {
    let currentUrl = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        currentUrl = event.url;
      }
    });
    setTimeout(() => {
      this.router.navigate(['login']); 
    }, 100);
  }


  // getMessage(): Observable<{ message: string }> {
  //   return this.http.get<{ message: string }>(`${this.apiUrl}/index.php`);
  // }


  // signup(formData: { name: string; email: string; password: string; password_confirmation: string }): Observable<any> {
  //   console.log("form data", formData)
  //   return this.http.post(`${this.apiUrl}/register`, formData);
  // }

  // login(data: { email: string; password: string }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, data);
  // }

}
