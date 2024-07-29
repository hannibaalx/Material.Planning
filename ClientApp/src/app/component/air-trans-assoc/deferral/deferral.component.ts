import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, toArray } from 'rxjs/operators';
import { PartService } from '../../../service/part.service';
import { Deferral } from '../../../models/deferral';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-deferral',
  templateUrl: './deferral.component.html',
  styleUrls: ['./deferral.component.css']
})
export class DeferralComponent implements OnInit, OnDestroy {
  private searchTerms = new Subject<string>();
  public deferral$: Observable<Deferral[]>;
  public hideDeferral: boolean = true;
  public menumber: string;
  public subscription: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private partService: PartService
  ) { }

  ngOnInit(): void {
    
    this.deferral$ = this.searchTerms.pipe(
      //debounceTime(300), // wait 300ms after each keystroke before considering the term
      distinctUntilChanged(), // ignore new term if same as previous term
      switchMap((term: string) => this.partService.getDeferral(term)
      ) // switch to new search observable each time the term changes
    );
    
    const meInput = document.getElementById('part-search-input') as HTMLFormElement;
    let btnSearch = document.getElementById("btnSearch") as HTMLButtonElement;

    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          const sub = fromEvent(window, 'load')
            .subscribe((e: Event) => {
              if (meInput.value.length == 14) {
                this.searchTerms.next(meInput.value);
                this.hideDeferral = false;
                this.menumber = meInput.value;
              }
              else {
                this.hideDeferral = true;
              }
            });
        }
        else {
          const sub = fromEvent(btnSearch, 'click')
            .subscribe((e: Event) => {
              if (meInput.value.length == 14) {
                this.searchTerms.next(meInput.value);
                this.hideDeferral = false;
                this.menumber = meInput.value;
              }
              else {
                this.hideDeferral = true;
              }
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.searchTerms.unsubscribe();
    //this.subscription?.unsubscribe();
  }

}
