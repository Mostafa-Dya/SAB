import {
  Directive,
  ElementRef,
  HostBinding,
  NgZone,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { fromEvent, merge, Subject, of } from 'rxjs';
import { map, switchMap, takeUntil, filter, tap } from 'rxjs/operators';

@Directive({
  selector: '[appDraggableDialog]',
})
export class DraggableDialogDirective implements AfterViewInit, OnDestroy {
  @HostBinding('style.cursor') cursor = 'pointer';

  /** Drag handle element (the header) */
  private handle!: HTMLElement;

  /** The dialog container (the element that resizes) */
  private container!: HTMLElement;

  /** The outer dialog element to be translated */
  private target!: HTMLElement;

  /** running delta during drag */
  private delta = { x: 0, y: 0 };

  /** cumulative offset after drag end */
  private offset = { x: 0, y: 0 };

  /** true while clicking in resize zone */
  private isResizing = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // assume structure: handle → mat-dialog-heading → mat-dialog-container
    this.handle = this.el.nativeElement;
    this.container = this.handle.closest(
      '.mat-dialog-container'
    ) as HTMLElement;
    this.target = this.container.parentElement as HTMLElement;

    // enable CSS resize on the container itself
    this.container.style.resize = 'both';
    this.container.style.overflow = 'hidden';

    this.registerEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private registerEvents(): void {
    this.zone.runOutsideAngular(() => {
      const mousedown$ = fromEvent<MouseEvent>(this.handle, 'mousedown');
      const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
      const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

      const drag$ = mousedown$.pipe(
        switchMap((startEvt) => {
          const startX = startEvt.clientX;
          const startY = startEvt.clientY;
          this.isResizing = this.isInResizeZone(startX, startY);

          if (this.isResizing) {
            // bail out—let native CSS resize happen
            return of(null);
          }

          return mousemove$.pipe(
            tap((moveEvt) => moveEvt.preventDefault()),
            map((moveEvt) => ({
              dx: moveEvt.clientX - startX,
              dy: moveEvt.clientY - startY,
            })),
            takeUntil(mouseup$)
          );
        }),
        takeUntil(this.destroy$)
      );

      drag$.subscribe((delta) => {
        if (delta && (delta.dx || delta.dy)) {
          this.delta = { x: delta.dx, y: delta.dy };
          this.applyTransform();
        }
      });

      mouseup$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (!this.isResizing) {
          this.offset.x += this.delta.x;
          this.offset.y += this.delta.y;
        }
        this.delta = { x: 0, y: 0 };
        this.isResizing = false;
        // re-enter Angular zone to update any bound UI
        this.zone.run(() => this.cdr.markForCheck());
      });
    });
  }

  /** true if the given point falls within the bottom-right 15×15px “resize zone” */
  private isInResizeZone(x: number, y: number): boolean {
    const rect = this.container.getBoundingClientRect();
    return (
      x >= rect.right - 15 &&
      x <= rect.right &&
      y >= rect.bottom - 15 &&
      y <= rect.bottom
    );
  }

  /** apply CSS translate based on offset+delta */
  private applyTransform(): void {
    requestAnimationFrame(() => {
      const tx = this.offset.x + this.delta.x;
      const ty = this.offset.y + this.delta.y;
      this.target.style.transform = `translate(${tx}px, ${ty}px)`;
      this.target.style.position = 'relative';
    });
  }
}
