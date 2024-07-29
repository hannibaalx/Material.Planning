import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map} from 'rxjs/operators';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { MeRoDetails } from 'src/app/models/me-ro-details';

@Component({
  selector: 'app-me-ro-detail',
  templateUrl: './me-ro-detail.component.html',
  styleUrls: ['./me-ro-detail.component.css']
})
export class MeRoDetailComponent implements OnInit {
  meRoDetail$: Observable<MeRoDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.meRoDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          //this.dash8id = params.get('dash8').trim(),
          this.menumberid = params.get('id').trim(),
          this.ecoService.getMeRoDetails(params.get('id').trim())
        )
        )
    );
  }
}
