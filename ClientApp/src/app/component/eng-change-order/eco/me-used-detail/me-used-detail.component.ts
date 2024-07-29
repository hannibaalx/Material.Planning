import { MeUsedDetail } from './../../../../models/me-used-detail';
import { Component, OnInit } from '@angular/core';
import { EcoService } from 'src/app/service/eco.service';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';

@Component({
  selector: 'app-me-used-detail',
  templateUrl: './me-used-detail.component.html',
  styleUrls: ['./me-used-detail.component.css']
})
export class MeUsedDetailComponent implements OnInit {

  meUsedDetail$: Observable<MeUsedDetail[]>;
  private subscription: Subscription;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.meUsedDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.ecoService.getMeUsedDetailById(params.get('id').trim())
          ) 
        )
    );
  }

}
