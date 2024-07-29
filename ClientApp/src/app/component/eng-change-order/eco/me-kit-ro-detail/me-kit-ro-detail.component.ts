import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MeRoDetails } from 'src/app/models/me-ro-details';
import { EcoService } from 'src/app/service/eco.service';

@Component({
  selector: 'app-me-kit-ro-detail',
  templateUrl: './me-kit-ro-detail.component.html',
  styleUrls: ['./me-kit-ro-detail.component.css']
})
export class MeKitRoDetailComponent implements OnInit {
  meRoKitDetail$: Observable<MeRoDetails[]>;
  dash8id: string;
  menumberid: string;

  constructor(
    private ecoService: EcoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.meRoKitDetail$ = this.route.paramMap.pipe(
      switchMap(
        (params: ParamMap) => (
          this.menumberid = params.get('id').trim(),
          this.ecoService.getMeRoDetails(params.get('id').trim())
        )
        )
    );
  }

}
