import { Component, OnInit, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedVariableService } from '../../services/shared-variable.service';
import { ObservationCard } from '../../models/observation-card.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../shared/modules/shared.module';

@Component({
  selector: 'app-archived-response-content',
  templateUrl: './archived-response-content.component.html',
  styleUrls: ['./archived-response-content.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class ArchivedResponseContentComponent implements OnInit {
  private readonly shared = inject(SharedVariableService);

  readonly isRtl = toSignal(this.shared.isRtl$, { initialValue: false });

  constructor(
    public dialogRef: MatDialogRef<ArchivedResponseContentComponent>,
    @Inject(MAT_DIALOG_DATA) public observation: ObservationCard
  ) {}

  ngOnInit(): void {}
}
