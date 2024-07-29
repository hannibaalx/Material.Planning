import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { EcoService } from 'src/app/service/eco.service';
import { ActivatedRoute, Router, ParamMap, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MePoDetails } from 'src/app/models/me-po-details';

@Component({
  selector: 'app-me-kit-po-detail',
  templateUrl: './me-kit-po-detail.component.html',
  styleUrls: ['./me-kit-po-detail.component.css']
})
export class MeKitPoDetailComponent implements OnInit {
  mePoKitDetail$: Observable<MePoDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.mePoKitDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.dash8id = params.get('dash8').trim(),
          this.menumberid = params.get('id').trim(),
          this.ecoService.getMePoDetails(params.get('id').trim())
        )
        )
    );
  }
}
