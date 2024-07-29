import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map} from 'rxjs/operators';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { MeRoStaDetails } from 'src/app/models/me-ro-sta-details';

@Component({
  selector: 'app-me-ro-sta-detail',
  templateUrl: './me-ro-sta-detail.component.html',
  styleUrls: ['./me-ro-sta-detail.component.css']
})
export class MeRoStaDetailComponent implements OnInit {

  meRoStaDetail$: Observable<MeRoStaDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.meRoStaDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.dash8id = params.get('dash8').trim(),
          this.menumberid = params.get('id').trim(),
          this.ecoService.getMeRoStationDetails(params.get('id').trim(), params.get('station').trim())
        )
      )
    );
  }

}
