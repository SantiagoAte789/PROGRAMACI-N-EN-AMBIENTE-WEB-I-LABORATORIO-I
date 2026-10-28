import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import {
  CatalogEvent,
  CatalogFilterOptions,
  CatalogFilters,
} from '../../interfaces/catalog-event.interface';
import { EventState } from '../../interfaces/event.interface';
import { CatalogService } from '../../services/catalog/catalog.service';

type SelectFilter = 'estado' | 'ciudad' | 'categoria';

/** Ícono y degradado de portada por categoría (no depende de imágenes externas). */
const CATEGORY_STYLES: Record<string, { icon: string; gradient: string }> = {
  'Música': { icon: 'music-note-beamed', gradient: 'linear-gradient(135deg, #0d6efd, #6610f2)' },
  'Teatro': { icon: 'ticket-perforated', gradient: 'linear-gradient(135deg, #d63384, #6f42c1)' },
  'Comedia': { icon: 'mic', gradient: 'linear-gradient(135deg, #fd7e14, #dc3545)' },
  'Danza': { icon: 'person-arms-up', gradient: 'linear-gradient(135deg, #20c997, #0d6efd)' },
  'Gastronomía': { icon: 'cup-hot', gradient: 'linear-gradient(135deg, #ffc107, #fd7e14)' },
  'Ópera': { icon: 'music-note-list', gradient: 'linear-gradient(135deg, #343a40, #6f42c1)' },
};
const DEFAULT_STYLE = { icon: 'calendar-event', gradient: 'linear-gradient(135deg, #6c757d, #343a40)' };

const STATUS_BADGES: Record<EventState, string> = {
  'Programado': 'text-bg-info',
  'En Boleteria': 'text-bg-primary',
  'En Vivo': 'text-bg-danger',
  'Finalizado': 'text-bg-secondary',
  'Cancelado': 'text-bg-dark',
};

@Component({
  selector: 'app-client-catalog.page',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './client-catalog.page.html',
  styleUrl: './client-catalog.page.scss',
})
export class ClientCatalogPage implements OnInit {

  private readonly catalogService = inject(CatalogService);
  private readonly modalService = inject(NgbModal);

  private readonly detailModal = viewChild.required<TemplateRef<unknown>>('detailModal');

  readonly events = signal<CatalogEvent[]>([]);
  readonly options = signal<CatalogFilterOptions>({ estados: [], ciudades: [], categorias: [] });
  readonly filters = signal<CatalogFilters>({});
  readonly searchText = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly selected = signal<CatalogEvent | null>(null);
  readonly loadingDetail = signal<number | null>(null);
  readonly detailError = signal<string | null>(null);

  private readonly searchInput$ = new Subject<string>();

  constructor() {
    // Cada cambio de filtros consulta la API; switchMap cancela la petición anterior.
    toObservable(this.filters).pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap((filters) =>
        this.catalogService.getEvents(filters).pipe(
          catchError(() => {
            this.error.set('No fue posible cargar los eventos. Verifica que el servidor esté en ejecución.');
            return of([] as CatalogEvent[]);
          }),
        ),
      ),
      takeUntilDestroyed(),
    ).subscribe((events) => {
      this.events.set(events);
      this.loading.set(false);
    });

    // El texto de búsqueda espera a que el usuario deje de escribir.
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((search) => this.patchFilters({ search }));
  }

  ngOnInit(): void {
    this.catalogService.getFilterOptions().subscribe({
      next: (options) => this.options.set(options),
      error: (error) => console.error('No se pudieron cargar las opciones de filtro', error),
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.searchInput$.next(value.trim());
  }

  onSelect(key: SelectFilter, event: Event): void {
    this.patchFilters({ [key]: (event.target as HTMLSelectElement).value });
  }

  clearFilters(): void {
    this.searchText.set('');
    this.filters.set({});
  }

  reload(): void {
    this.filters.update((filters) => ({ ...filters }));
  }

  hasFilters(): boolean {
    return Object.values(this.filters()).some((value) => !!value);
  }

  /** Abre el detalle consultando `GET /api/events/:codigo`. */
  openDetail(codigo: number): void {
    this.loadingDetail.set(codigo);
    this.detailError.set(null);

    this.catalogService.getEventByCode(codigo).subscribe({
      next: (event) => {
        this.selected.set(event);
        this.loadingDetail.set(null);
        this.modalService.open(this.detailModal(), { size: 'lg', centered: true, scrollable: true });
      },
      error: () => {
        this.loadingDetail.set(null);
        this.detailError.set('No fue posible cargar el detalle del evento.');
      },
    });
  }

  isOnSale(event: CatalogEvent): boolean {
    return event.estado !== 'Finalizado' && event.estado !== 'Cancelado';
  }

  occupancy(event: CatalogEvent): number {
    return event.capacidad ? Math.round((event.entradas_reservadas / event.capacidad) * 100) : 0;
  }

  statusClass(estado: EventState): string {
    return STATUS_BADGES[estado] ?? 'text-bg-light';
  }

  icon(categoria: string): string {
    return (CATEGORY_STYLES[categoria] ?? DEFAULT_STYLE).icon;
  }

  gradient(categoria: string): string {
    return (CATEGORY_STYLES[categoria] ?? DEFAULT_STYLE).gradient;
  }

  private patchFilters(patch: Partial<CatalogFilters>): void {
    this.filters.update((filters) => ({ ...filters, ...patch }));
  }
}
