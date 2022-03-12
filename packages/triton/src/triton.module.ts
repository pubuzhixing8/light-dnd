import { NgModule } from '@angular/core';
import { TriDraggableDirective } from './draggable.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { TriSnapshotComponent } from './snapshot.component';


@NgModule({
  declarations: [
    TriDraggableDirective,
    TriSnapshotComponent
  ],
  entryComponents: [TriSnapshotComponent],
  imports: [
    OverlayModule
  ],
  exports: [
    TriDraggableDirective,
    TriSnapshotComponent
  ]
})
export class TritonModule { }
