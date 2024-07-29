import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, fromEvent, Subscription } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PartService } from '../../../service/part.service';
import { SparesAnalysis } from '../../../models/spares-analysis';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-spares-analysis',
  templateUrl: './spares-analysis.component.html',
  styleUrls: ['./spares-analysis.component.css']
})
export class SparesAnalysisComponent implements OnInit, OnDestroy {
  private searchTerms = new Subject<string>();
  public subscription: Subscription;
  public sparesanalysis$: Observable<SparesAnalysis[]>;
  public hideSA: boolean = true;
  public menumber: string;
  
  constructor(
    private route: ActivatedRoute,
    private partService: PartService
  ) { }

  ngOnInit() : void {
    this.sparesanalysis$ = this.searchTerms.pipe(
      //debounceTime(300), // wait 300ms after each keystroke before considering the term
      distinctUntilChanged(), // ignore new term if same as previous term
      switchMap((term: string) => this.partService.getSparesAnalysis(term)
      ) // switch to new search observable each time the term changes
    );
    //this.hideSA = false;
    const meInput = document.getElementById('part-search-input') as HTMLFormElement;
    //const meInput = document.getElementById('currentMeNumber-input') as HTMLFormElement;
    let btnSearch = document.getElementById("btnSearch") as HTMLButtonElement;

    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          const subscription = fromEvent(window, 'load')
            .subscribe((e: Event) => {
              if (meInput.value.length == 14 && !meInput.value.includes('-0-') && !meInput.value.includes('-3-') && !meInput.value.includes('-4-')) {
                this.searchTerms.next(meInput.value);
                this.hideSA = false;
                this.menumber = meInput.value;
              }
              else {
                this.hideSA = true;
              }
            })
        }
        else { 
         const subscription = fromEvent(btnSearch, 'click')
           .subscribe((e: Event) => {
            let _currentMeNumber = this.partService.getCurrentMeNumber();
            _currentMeNumber.subscribe(val => { 
             if (val.length == 14 && !val.includes('-0-') && !val.includes('-3-') && !val.includes('-4-')) {
               this.searchTerms.next(val);
               this.hideSA = false;
               this.menumber = val;
             }
             else {
               this.hideSA = true;
             }
            });

            if (meInput.value.length == 14 && !meInput.value.includes('-0-') && !meInput.value.includes('-3-') && !meInput.value.includes('-4-')) {
              this.searchTerms.next(meInput.value);
              this.hideSA = false;
              this.menumber = meInput.value;
            }
            else {
              this.hideSA = true;
              //this.partService.setCurrentMeNumber('');
            }
        }) 
        }
      });
  }

  ngOnDestroy() {
    this.searchTerms.unsubscribe(); // unsubscribe to ensure no memory leaks
    //this.subscription?.unsubscribe();
  }

}
