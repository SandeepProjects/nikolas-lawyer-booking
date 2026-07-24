import { Component, EventEmitter, Input, Output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { TimeSlot } from '../../models/booking.model';

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Date selection -->
      <div>
        <h3 class="text-sm font-semibold text-slate-700 mb-3">Select a date</h3>
        <div class="flex gap-2 overflow-x-auto pb-2 calendar-scroll">
          @for (date of availableDates; track date) {
            <button
              type="button"
              (click)="selectDate(date)"
              [class]="selectedDate() === date 
                ? 'bg-primary-700 text-white border-primary-700 shadow-md' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300 hover:bg-primary-50'"
              class="flex-shrink-0 w-20 py-3 rounded-xl border text-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <div class="text-xs font-medium opacity-80">{{ getDayName(date) }}</div>
              <div class="text-lg font-bold mt-0.5">{{ getDayNumber(date) }}</div>
              <div class="text-[10px] mt-0.5 opacity-70">{{ getMonthName(date) }}</div>
            </button>
          }
        </div>
      </div>

      <!-- Time slots -->
      @if (selectedDate()) {
        <div class="fade-in">
          <h3 class="text-sm font-semibold text-slate-700 mb-3">
            Available times · {{ formatSelectedDate() }}
          </h3>
          
          @if (timeSlots().length === 0) {
            <p class="text-slate-500 text-sm py-6 text-center">No available slots on this day.</p>
          } @else {
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              @for (slot of timeSlots(); track slot.id) {
                <button
                  type="button"
                  [disabled]="!slot.available"
                  (click)="selectTime(slot)"
                  [class]="getSlotClasses(slot)"
                  class="py-2.5 px-2 rounded-lg border text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed">
                  {{ slot.time }}
                </button>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class BookingCalendarComponent implements OnInit {
  @Input() preselectedDate: string | null = null;
  @Output() dateTimeSelected = new EventEmitter<{ date: string; time: string }>();

  private bookingService = inject(BookingService);

  availableDates: string[] = [];
  selectedDate = signal<string | null>(null);
  timeSlots = signal<TimeSlot[]>([]);
  selectedTime = signal<string | null>(null);

  ngOnInit() {
    this.availableDates = this.bookingService.getAvailableDates(18);
    if (this.preselectedDate && this.availableDates.includes(this.preselectedDate)) {
      this.selectDate(this.preselectedDate);
    } else if (this.availableDates.length > 0) {
      this.selectDate(this.availableDates[0]);
    }
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
    this.selectedTime.set(null);
    this.timeSlots.set(this.bookingService.getTimeSlotsForDate(date));
  }

  selectTime(slot: TimeSlot) {
    if (!slot.available) return;
    this.selectedTime.set(slot.time);
    this.dateTimeSelected.emit({ date: slot.date, time: slot.time });
  }

  getSlotClasses(slot: TimeSlot): string {
    if (!slot.available) return 'slot-booked';
    if (this.selectedTime() === slot.time) return 'slot-selected';
    return 'slot-available';
  }

  getDayName(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' });
  }

  getDayNumber(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').getDate().toString();
  }

  getMonthName(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' });
  }

  formatSelectedDate(): string {
    const d = this.selectedDate();
    return d ? this.bookingService.formatDate(d) : '';
  }
}
