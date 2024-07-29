import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { PartNumber } from '../../../models/partnumber';
import { PartService } from '../../../service/part.service';

@Component({
  selector: 'app-part-search',
  templateUrl: './part-search.component.html',
  styleUrls: ['./part-search.component.css']
})
export class PartSearchComponent implements OnInit {
 @Output() parts$: Observable<PartNumber[]>;
 @Output() _parts$ = new EventEmitter(); 

  private searchTerms = new Subject<string>();

  constructor(private partService: PartService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
   // this.searchTerms.next(term);
    //this._parts$.emit(this.parts$);
  }

  ngOnInit(): void {
    // this.parts$ = this.searchTerms.pipe(
    //   // wait 300ms after each keystroke before considering the term
    //   debounceTime(300),
    //   // ignore new term if same as previous term
    //   distinctUntilChanged(),
    //   // switch to new search observable each time the term changes
    //   switchMap((term: string) => this.partService.searchParts(term))
    // );
  }
}
