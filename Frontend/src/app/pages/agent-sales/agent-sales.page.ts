import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { ReservationState } from '../../interfaces/reservation.interface';
import {
  ReservationDetail,
  ReservationFilters,
  SalesSummary,
} from '../../interfaces/sales.interface';
import { SalesService } from '../../services/sales/sales.service';

const STATUS_BADGES: Record<ReservationState, string> = {
  'Reservada': 'text-bg-warning',
  'Confirmada': 'text-bg-success',
  'Cancelada': 'text-bg-danger',
};

@Component({
  selector: 'app-agent-sales.page',
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './agent-sales.page.html',
  styleUrl: './agent-sales.page.scss',
})
export class AgentSalesPage implements OnInit {

  private readonly salesService = inject(SalesService);

  readonly statuses: ReservationState[] = ['Reservada', 'Confirmada', 'Cancelada'];

  // Resumen (KPIs + gráfica)
  readonly summary = signal<SalesSummary | null>(null);
  readonly summaryLoading = signal(true);
  readonly summaryError = signal<string | null>(null);

  // Tabla de reservaciones
  readonly reservations = signal<ReservationDetail[]>([]);
  readonly filters = signal<ReservationFilters>({});
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Mayor ingreso (confirmado + pendiente) entre eventos; es el 100% de la gráfica. */
  readonly maxRevenue = computed(() => {
    const events = this.summary()?.por_evento ?? [];
    return Math.max(1, ...events.map((e) => e.ingresos_confirmados + e.ingresos_pendientes));
  });

  constructor() {
    // Cada cambio de filtros consulta la API; switchMap cancela la petición anterior.
    toObservable(this.filters).pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap((filters) =>
        this.salesService.getReservations(filters).pipe(
          catchError(() => {
            this.error.set('No fue posible cargar las reservaciones. Verifica que el servidor esté en ejecución.');
            return of([] as ReservationDetail[]);
          }),
        ),
      ),
      takeUntilDestroyed(),
    ).subscribe((reservations) => {
      this.reservations.set(reservations);
      this.loading.set(false);
    });
  }

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.summaryLoading.set(true);
    this.summaryError.set(null);

    this.salesService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.summaryLoading.set(false);
      },
      error: () => {
        this.summaryError.set('No fue posible cargar el resumen de ventas.');
        this.summaryLoading.set(false);
      },
    });
  }

  reloadReservations(): void {
    this.filters.update((filters) => ({ ...filters }));
  }

  setStatus(estado: ReservationState | null): void {
    this.filters.update(({ evento }) => ({
      ...(estado ? { estado } : {}),
      ...(evento !== undefined ? { evento } : {}),
    }));
  }

  onEventChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.update(({ estado }) => ({
      ...(estado ? { estado } : {}),
      ...(value ? { evento: Number(value) } : {}),
    }));
  }

  /** Ancho (%) de una barra respecto al evento con mayor ingreso. */
  barWidth(amount: number): number {
    return (amount / this.maxRevenue()) * 100;
  }

  statusClass(estado: ReservationState): string {
    return STATUS_BADGES[estado] ?? 'text-bg-light';
  }
}
