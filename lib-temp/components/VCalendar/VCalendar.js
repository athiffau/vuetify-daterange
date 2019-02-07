// Styles
// import '../../stylus/components/_calendar-daily.styl'
// Mixins
import CalendarBase from './mixins/calendar-base';
// Util
import props from './util/props';
import { DAYS_IN_MONTH_MAX, DAY_MIN, DAYS_IN_WEEK, parseTimestamp, relativeDays, nextDay, prevDay, copyTimestamp, updateFormatted, updateWeekday, updateRelative } from './util/timestamp';
// Calendars
import VCalendarMonthly from './VCalendarMonthly';
import VCalendarDaily from './VCalendarDaily';
import VCalendarWeekly from './VCalendarWeekly';
/* @vue/component */
export default CalendarBase.extend({
    name: 'v-calendar',
    props: {
        ...props.calendar,
        ...props.weeks,
        ...props.intervals
    },
    data: () => ({
        lastStart: null,
        lastEnd: null
    }),
    computed: {
        parsedValue() {
            return parseTimestamp(this.value) ||
                this.parsedStart ||
                this.times.today;
        },
        renderProps() {
            const around = this.parsedValue;
            let component = 'div';
            let maxDays = this.maxDays;
            let start = around;
            let end = around;
            switch (this.type) {
                case 'month':
                    component = VCalendarMonthly;
                    start = this.getStartOfMonth(around);
                    end = this.getEndOfMonth(around);
                    break;
                case 'week':
                    component = VCalendarDaily;
                    start = this.getStartOfWeek(around);
                    end = this.getEndOfWeek(around);
                    maxDays = 7;
                    break;
                case 'day':
                    component = VCalendarDaily;
                    maxDays = 1;
                    break;
                case '4day':
                    component = VCalendarDaily;
                    end = relativeDays(copyTimestamp(end), nextDay, 4);
                    updateFormatted(end);
                    maxDays = 4;
                    break;
                case 'custom-weekly':
                    component = VCalendarWeekly;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
                case 'custom-daily':
                    component = VCalendarDaily;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
            }
            return { component, start, end, maxDays };
        }
    },
    watch: {
        renderProps: 'checkChange'
    },
    methods: {
        checkChange() {
            const { start, end } = this.renderProps;
            if (start !== this.lastStart || end !== this.lastEnd) {
                this.lastStart = start;
                this.lastEnd = end;
                this.$emit('change', { start, end });
            }
        },
        move(amount = 1) {
            const moved = copyTimestamp(this.parsedValue);
            const forward = amount > 0;
            const mover = forward ? nextDay : prevDay;
            const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN;
            let times = forward ? amount : -amount;
            while (--times >= 0) {
                switch (this.type) {
                    case 'month':
                        moved.day = limit;
                        mover(moved);
                        break;
                    case 'week':
                        relativeDays(moved, mover, DAYS_IN_WEEK);
                        break;
                    case 'day':
                        mover(moved);
                        break;
                    case '4day':
                        relativeDays(moved, mover, 4);
                        break;
                }
            }
            updateWeekday(moved);
            updateFormatted(moved);
            updateRelative(moved, this.times.now);
            this.$emit('input', moved.date);
            this.$emit('moved', moved);
        },
        next(amount = 1) {
            this.move(amount);
        },
        prev(amount = 1) {
            this.move(-amount);
        },
        timeToY(time, clamp = true) {
            const c = this.$children[0];
            if (c && c.timeToY) {
                return c.timeToY(time, clamp);
            }
            else {
                return false;
            }
        },
        minutesToPixels(minutes) {
            const c = this.$children[0];
            if (c && c.minutesToPixels) {
                return c.minutesToPixels(minutes);
            }
            else {
                return -1;
            }
        },
        scrollToTime(time) {
            const c = this.$children[0];
            if (c && c.scrollToTime) {
                return c.scrollToTime(time);
            }
            else {
                return false;
            }
        }
    },
    render(h) {
        const { start, end, maxDays, component } = this.renderProps;
        return h(component, {
            staticClass: 'v-calendar',
            props: {
                ...this.$props,
                start: start.date,
                end: end.date,
                maxDays
            },
            on: {
                ...this.$listeners,
                'click:date': (day) => {
                    if (this.$listeners['input']) {
                        this.$emit('input', day);
                    }
                    if (this.$listeners['click:date']) {
                        this.$emit('click:date', day);
                    }
                }
            },
            scopedSlots: this.$scopedSlots
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhbGVuZGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhbGVuZGFyL1ZDYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1Qsd0RBQXdEO0FBS3hELFNBQVM7QUFDVCxPQUFPLFlBQVksTUFBTSx3QkFBd0IsQ0FBQTtBQUVqRCxPQUFPO0FBQ1AsT0FBTyxLQUFLLE1BQU0sY0FBYyxDQUFBO0FBQ2hDLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFlBQVksRUFHWixjQUFjLEVBQ2QsWUFBWSxFQUNaLE9BQU8sRUFDUCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNmLE1BQU0sa0JBQWtCLENBQUE7QUFFekIsWUFBWTtBQUNaLE9BQU8sZ0JBQWdCLE1BQU0sb0JBQW9CLENBQUE7QUFDakQsT0FBTyxjQUFjLE1BQU0sa0JBQWtCLENBQUE7QUFDN0MsT0FBTyxlQUFlLE1BQU0sbUJBQW1CLENBQUE7QUFVL0Msb0JBQW9CO0FBQ3BCLGVBQWUsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUNqQyxJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxHQUFHLEtBQUssQ0FBQyxRQUFRO1FBQ2pCLEdBQUcsS0FBSyxDQUFDLEtBQUs7UUFDZCxHQUFHLEtBQUssQ0FBQyxTQUFTO0tBQ25CO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxTQUFTLEVBQUUsSUFBeUI7UUFDcEMsT0FBTyxFQUFFLElBQXlCO0tBQ25DLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixXQUFXO1lBQ1QsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFdBQVc7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFBO1FBQ3BCLENBQUM7UUFDRCxXQUFXO1lBQ1Qs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QUFHLENBQUMsSUFBSTtnQkFDYixPQUFPO2FBQ1I7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsR0FBRyxJQUFJLENBQUMsVUFBVTtnQkFDbEIsWUFBWSxFQUFFLENBQUMsR0FBZSxFQUFFLEVBQUU7b0JBQ2hDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7cUJBQ3pCO29CQUNELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTt3QkFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUE7cUJBQzlCO2dCQUNILENBQUM7YUFDRjtZQUNELFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtTQUMvQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbi8vIGltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2NhbGVuZGFyLWRhaWx5LnN0eWwnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSwgQ29tcG9uZW50IH0gZnJvbSAndnVlJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDYWxlbmRhckJhc2UgZnJvbSAnLi9taXhpbnMvY2FsZW5kYXItYmFzZSdcclxuXHJcbi8vIFV0aWxcclxuaW1wb3J0IHByb3BzIGZyb20gJy4vdXRpbC9wcm9wcydcclxuaW1wb3J0IHtcclxuICBEQVlTX0lOX01PTlRIX01BWCxcclxuICBEQVlfTUlOLFxyXG4gIERBWVNfSU5fV0VFSyxcclxuICBWVGltZXN0YW1wLFxyXG4gIFZUaW1lLFxyXG4gIHBhcnNlVGltZXN0YW1wLFxyXG4gIHJlbGF0aXZlRGF5cyxcclxuICBuZXh0RGF5LFxyXG4gIHByZXZEYXksXHJcbiAgY29weVRpbWVzdGFtcCxcclxuICB1cGRhdGVGb3JtYXR0ZWQsXHJcbiAgdXBkYXRlV2Vla2RheSxcclxuICB1cGRhdGVSZWxhdGl2ZVxyXG59IGZyb20gJy4vdXRpbC90aW1lc3RhbXAnXHJcblxyXG4vLyBDYWxlbmRhcnNcclxuaW1wb3J0IFZDYWxlbmRhck1vbnRobHkgZnJvbSAnLi9WQ2FsZW5kYXJNb250aGx5J1xyXG5pbXBvcnQgVkNhbGVuZGFyRGFpbHkgZnJvbSAnLi9WQ2FsZW5kYXJEYWlseSdcclxuaW1wb3J0IFZDYWxlbmRhcldlZWtseSBmcm9tICcuL1ZDYWxlbmRhcldlZWtseSdcclxuXHJcbi8vIFR5cGVzXHJcbmludGVyZmFjZSBWQ2FsZW5kYXJSZW5kZXJQcm9wcyB7XHJcbiAgc3RhcnQ6IFZUaW1lc3RhbXBcclxuICBlbmQ6IFZUaW1lc3RhbXBcclxuICBjb21wb25lbnQ6IHN0cmluZyB8IENvbXBvbmVudFxyXG4gIG1heERheXM6IG51bWJlclxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBDYWxlbmRhckJhc2UuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1jYWxlbmRhcicsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICAuLi5wcm9wcy5jYWxlbmRhcixcclxuICAgIC4uLnByb3BzLndlZWtzLFxyXG4gICAgLi4ucHJvcHMuaW50ZXJ2YWxzXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGxhc3RTdGFydDogbnVsbCBhcyBWVGltZXN0YW1wIHwgbnVsbCxcclxuICAgIGxhc3RFbmQ6IG51bGwgYXMgVlRpbWVzdGFtcCB8IG51bGxcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIHBhcnNlZFZhbHVlICgpOiBWVGltZXN0YW1wIHtcclxuICAgICAgcmV0dXJuIHBhcnNlVGltZXN0YW1wKHRoaXMudmFsdWUpIHx8XHJcbiAgICAgICAgdGhpcy5wYXJzZWRTdGFydCB8fFxyXG4gICAgICAgIHRoaXMudGltZXMudG9kYXlcclxuICAgIH0sXHJcbiAgICByZW5kZXJQcm9wcyAoKTogVkNhbGVuZGFyUmVuZGVyUHJvcHMge1xyXG4gICAgICBjb25zdCBhcm91bmQgPSB0aGlzLnBhcnNlZFZhbHVlXHJcbiAgICAgIGxldCBjb21wb25lbnQ6IGFueSA9ICdkaXYnXHJcbiAgICAgIGxldCBtYXhEYXlzID0gdGhpcy5tYXhEYXlzXHJcbiAgICAgIGxldCBzdGFydCA9IGFyb3VuZFxyXG4gICAgICBsZXQgZW5kID0gYXJvdW5kXHJcbiAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyTW9udGhseVxyXG4gICAgICAgICAgc3RhcnQgPSB0aGlzLmdldFN0YXJ0T2ZNb250aChhcm91bmQpXHJcbiAgICAgICAgICBlbmQgPSB0aGlzLmdldEVuZE9mTW9udGgoYXJvdW5kKVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICd3ZWVrJzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckRhaWx5XHJcbiAgICAgICAgICBzdGFydCA9IHRoaXMuZ2V0U3RhcnRPZldlZWsoYXJvdW5kKVxyXG4gICAgICAgICAgZW5kID0gdGhpcy5nZXRFbmRPZldlZWsoYXJvdW5kKVxyXG4gICAgICAgICAgbWF4RGF5cyA9IDdcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnZGF5JzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckRhaWx5XHJcbiAgICAgICAgICBtYXhEYXlzID0gMVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICc0ZGF5JzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckRhaWx5XHJcbiAgICAgICAgICBlbmQgPSByZWxhdGl2ZURheXMoY29weVRpbWVzdGFtcChlbmQpLCBuZXh0RGF5LCA0KVxyXG4gICAgICAgICAgdXBkYXRlRm9ybWF0dGVkKGVuZClcclxuICAgICAgICAgIG1heERheXMgPSA0XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2N1c3RvbS13ZWVrbHknOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyV2Vla2x5XHJcbiAgICAgICAgICBzdGFydCA9IHRoaXMucGFyc2VkU3RhcnQgfHwgYXJvdW5kXHJcbiAgICAgICAgICBlbmQgPSB0aGlzLnBhcnNlZEVuZFxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICdjdXN0b20tZGFpbHknOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyRGFpbHlcclxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5wYXJzZWRTdGFydCB8fCBhcm91bmRcclxuICAgICAgICAgIGVuZCA9IHRoaXMucGFyc2VkRW5kXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4geyBjb21wb25lbnQsIHN0YXJ0LCBlbmQsIG1heERheXMgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICByZW5kZXJQcm9wczogJ2NoZWNrQ2hhbmdlJ1xyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNoZWNrQ2hhbmdlICgpOiB2b2lkIHtcclxuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSB0aGlzLnJlbmRlclByb3BzXHJcbiAgICAgIGlmIChzdGFydCAhPT0gdGhpcy5sYXN0U3RhcnQgfHwgZW5kICE9PSB0aGlzLmxhc3RFbmQpIHtcclxuICAgICAgICB0aGlzLmxhc3RTdGFydCA9IHN0YXJ0XHJcbiAgICAgICAgdGhpcy5sYXN0RW5kID0gZW5kXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgeyBzdGFydCwgZW5kIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlIChhbW91bnQgPSAxKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IG1vdmVkID0gY29weVRpbWVzdGFtcCh0aGlzLnBhcnNlZFZhbHVlKVxyXG4gICAgICBjb25zdCBmb3J3YXJkID0gYW1vdW50ID4gMFxyXG4gICAgICBjb25zdCBtb3ZlciA9IGZvcndhcmQgPyBuZXh0RGF5IDogcHJldkRheVxyXG4gICAgICBjb25zdCBsaW1pdCA9IGZvcndhcmQgPyBEQVlTX0lOX01PTlRIX01BWCA6IERBWV9NSU5cclxuICAgICAgbGV0IHRpbWVzID0gZm9yd2FyZCA/IGFtb3VudCA6IC1hbW91bnRcclxuXHJcbiAgICAgIHdoaWxlICgtLXRpbWVzID49IDApIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgICAgICBtb3ZlZC5kYXkgPSBsaW1pdFxyXG4gICAgICAgICAgICBtb3Zlcihtb3ZlZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgJ3dlZWsnOlxyXG4gICAgICAgICAgICByZWxhdGl2ZURheXMobW92ZWQsIG1vdmVyLCBEQVlTX0lOX1dFRUspXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlICdkYXknOlxyXG4gICAgICAgICAgICBtb3Zlcihtb3ZlZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgJzRkYXknOlxyXG4gICAgICAgICAgICByZWxhdGl2ZURheXMobW92ZWQsIG1vdmVyLCA0KVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdXBkYXRlV2Vla2RheShtb3ZlZClcclxuICAgICAgdXBkYXRlRm9ybWF0dGVkKG1vdmVkKVxyXG4gICAgICB1cGRhdGVSZWxhdGl2ZShtb3ZlZCwgdGhpcy50aW1lcy5ub3cpXHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG1vdmVkLmRhdGUpXHJcbiAgICAgIHRoaXMuJGVtaXQoJ21vdmVkJywgbW92ZWQpXHJcbiAgICB9LFxyXG4gICAgbmV4dCAoYW1vdW50ID0gMSk6IHZvaWQge1xyXG4gICAgICB0aGlzLm1vdmUoYW1vdW50KVxyXG4gICAgfSxcclxuICAgIHByZXYgKGFtb3VudCA9IDEpOiB2b2lkIHtcclxuICAgICAgdGhpcy5tb3ZlKC1hbW91bnQpXHJcbiAgICB9LFxyXG4gICAgdGltZVRvWSAodGltZTogVlRpbWUsIGNsYW1wID0gdHJ1ZSk6IG51bWJlciB8IGZhbHNlIHtcclxuICAgICAgY29uc3QgYyA9IHRoaXMuJGNoaWxkcmVuWzBdIGFzIGFueVxyXG4gICAgICBpZiAoYyAmJiBjLnRpbWVUb1kpIHtcclxuICAgICAgICByZXR1cm4gYy50aW1lVG9ZKHRpbWUsIGNsYW1wKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbWludXRlc1RvUGl4ZWxzIChtaW51dGVzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICBjb25zdCBjID0gdGhpcy4kY2hpbGRyZW5bMF0gYXMgYW55XHJcbiAgICAgIGlmIChjICYmIGMubWludXRlc1RvUGl4ZWxzKSB7XHJcbiAgICAgICAgcmV0dXJuIGMubWludXRlc1RvUGl4ZWxzKG1pbnV0ZXMpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzY3JvbGxUb1RpbWUgKHRpbWU6IFZUaW1lKTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IGMgPSB0aGlzLiRjaGlsZHJlblswXSBhcyBhbnlcclxuICAgICAgaWYgKGMgJiYgYy5zY3JvbGxUb1RpbWUpIHtcclxuICAgICAgICByZXR1cm4gYy5zY3JvbGxUb1RpbWUodGltZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgbWF4RGF5cywgY29tcG9uZW50IH0gPSB0aGlzLnJlbmRlclByb3BzXHJcblxyXG4gICAgcmV0dXJuIGgoY29tcG9uZW50LCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhcicsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgLi4udGhpcy4kcHJvcHMsXHJcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LmRhdGUsXHJcbiAgICAgICAgZW5kOiBlbmQuZGF0ZSxcclxuICAgICAgICBtYXhEYXlzXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiB7XHJcbiAgICAgICAgLi4udGhpcy4kbGlzdGVuZXJzLFxyXG4gICAgICAgICdjbGljazpkYXRlJzogKGRheTogVlRpbWVzdGFtcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snaW5wdXQnXSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIGRheSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh0aGlzLiRsaXN0ZW5lcnNbJ2NsaWNrOmRhdGUnXSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdjbGljazpkYXRlJywgZGF5KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgc2NvcGVkU2xvdHM6IHRoaXMuJHNjb3BlZFNsb3RzXHJcbiAgICB9KVxyXG4gIH1cclxufSlcclxuIl19