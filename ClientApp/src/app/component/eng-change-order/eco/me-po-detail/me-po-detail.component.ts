
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map} from 'rxjs/operators';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { MePoDetails } from 'src/app/models/me-po-details';

@Component({
  selector: 'app-me-po-detail',
  templateUrl: './me-po-detail.component.html',
  styleUrls: ['./me-po-detail.component.css']
})
export class MePoDetailComponent implements OnInit {
  mePoDetail$: Observable<MePoDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.mePoDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.dash8id = params.get('id').trim(),
          this.menumberid = params.get('id').trim(),
          //this.ecoService.getMePoDetails(params.get('id').trim())
          this.ecoService.getMePoDetails(params.get('id'))
        )
        )
    );
  }

}
