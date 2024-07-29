import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map} from 'rxjs/operators';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { MePoStaDetails } from 'src/app/models/me-po-sta-details';

@Component({
  selector: 'app-me-po-sta-detail',
  templateUrl: './me-po-sta-detail.component.html',
  styleUrls: ['./me-po-sta-detail.component.css']
})
export class MePoStaDetailComponent implements OnInit {

  mePoStaDetail$: Observable<MePoStaDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.mePoStaDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.dash8id = params.get('dash8').trim(),
          this.menumberid = params.get('id').trim(),
          this.ecoService.getMePoStationDetails(params.get('id').trim(), params.get('station').trim())
        )
      )
    );
  }

}
