import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map} from 'rxjs/operators';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { MeSoStaDetails } from 'src/app/models/me-so-sta-details';

@Component({
  selector: 'app-me-so-sta-detail',
  templateUrl: './me-so-sta-detail.component.html',
  styleUrls: ['./me-so-sta-detail.component.css']
})
export class MeSoStaDetailComponent implements OnInit {

  meSoStaDetail$: Observable<MeSoStaDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.meSoStaDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.dash8id = params.get('dash8'),
          this.menumberid = params.get('id'),
          this.ecoService.getMeSoStationDetails(params.get('id'), params.get('station'))
        )
      )
    );
  }
}


