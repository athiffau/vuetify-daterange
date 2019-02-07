// Mixins
import mixins from '../../../util/mixins';
import Themeable from '../../../mixins/themeable';
import Colorable from '../../../mixins/colorable';
import Times from './times';
import Mouse from './mouse';
// Util
import props from '../util/props';
import { parseTimestamp, copyTimestamp, getWeekdaySkips, findWeekday, prevDay, updateWeekday, updateFormatted, updateRelative, daysInMonth, createDayList, createNativeLocaleFormatter, DAY_MIN } from '../util/timestamp';
/* @vue/component */
export default mixins(Colorable, Themeable, Times, Mouse).extend({
    name: 'calendar-base',
    props: props.base,
    computed: {
        weekdaySkips() {
            return getWeekdaySkips(this.weekdays);
        },
        parsedStart() {
            return parseTimestamp(this.start);
        },
        parsedEnd() {
            return parseTimestamp(this.end);
        },
        days() {
            return createDayList(this.parsedStart, this.parsedEnd, this.times.today, this.weekdaySkips);
        },
        dayFormatter() {
            if (this.dayFormat) {
                return this.dayFormat;
            }
            const options = { timeZone: 'UTC', day: 'numeric' };
            return createNativeLocaleFormatter(this.locale, (_tms, _short) => options);
        },
        weekdayFormatter() {
            if (this.weekdayFormat) {
                return this.weekdayFormat;
            }
            const longOptions = { timeZone: 'UTC', weekday: 'long' };
            const shortOptions = { timeZone: 'UTC', weekday: 'short' };
            return createNativeLocaleFormatter(this.locale, (_tms, short) => short ? shortOptions : longOptions);
        }
    },
    methods: {
        getRelativeClasses(timestamp, outside = false) {
            return {
                'v-present': timestamp.present,
                'v-past': timestamp.past,
                'v-future': timestamp.future,
                'v-outside': outside
            };
        },
        getStartOfWeek(timestamp) {
            const start = copyTimestamp(timestamp);
            findWeekday(start, this.weekdays[0], prevDay);
            updateFormatted(start);
            updateRelative(start, this.times.today, start.hasTime);
            return start;
        },
        getEndOfWeek(timestamp) {
            const end = copyTimestamp(timestamp);
            findWeekday(end, this.weekdays[this.weekdays.length - 1]);
            updateFormatted(end);
            updateRelative(end, this.times.today, end.hasTime);
            return end;
        },
        getStartOfMonth(timestamp) {
            const start = copyTimestamp(timestamp);
            start.day = DAY_MIN;
            updateWeekday(start);
            updateFormatted(start);
            return start;
        },
        getEndOfMonth(timestamp) {
            const end = copyTimestamp(timestamp);
            end.day = daysInMonth(end.year, end.month);
            updateWeekday(end);
            updateFormatted(end);
            return end;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDYWxlbmRhci9taXhpbnMvY2FsZW5kYXItYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxTQUFTO0FBQ1QsT0FBTyxNQUFNLE1BQU0sc0JBQXNCLENBQUE7QUFDekMsT0FBTyxTQUFTLE1BQU0sMkJBQTJCLENBQUE7QUFDakQsT0FBTyxTQUFTLE1BQU0sMkJBQTJCLENBQUE7QUFDakQsT0FBTyxLQUFLLE1BQU0sU0FBUyxDQUFBO0FBQzNCLE9BQU8sS0FBSyxNQUFNLFNBQVMsQ0FBQTtBQUUzQixPQUFPO0FBQ1AsT0FBTyxLQUFLLE1BQU0sZUFBZSxDQUFBO0FBQ2pDLE9BQU8sRUFHTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGVBQWUsRUFDZixXQUFXLEVBQ1gsT0FBTyxFQUNQLGFBQWEsRUFDYixlQUFlLEVBQ2YsY0FBYyxFQUNkLFdBQVcsRUFDWCxhQUFhLEVBQ2IsMkJBQTJCLEVBQzNCLE9BQU8sRUFDUixNQUFNLG1CQUFtQixDQUFBO0FBRTFCLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDL0QsSUFBSSxFQUFFLGVBQWU7SUFFckIsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJO0lBRWpCLFFBQVEsRUFBRTtRQUNSLFlBQVk7WUFDVixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDdkMsQ0FBQztRQUNELFdBQVc7WUFDVCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFlLENBQUE7UUFDakQsQ0FBQztRQUNELFNBQVM7WUFDUCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFlLENBQUE7UUFDL0MsQ0FBQztRQUNELElBQUk7WUFDRixPQUFPLGFBQWEs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QTtZQUNwQyxHQUFHLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMxQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbEIsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3BCLE9BQU8sR0FBRyxDQUFBO1FBQ1osQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFRpbWVzIGZyb20gJy4vdGltZXMnXHJcbmltcG9ydCBNb3VzZSBmcm9tICcuL21vdXNlJ1xyXG5cclxuLy8gVXRpbFxyXG5pbXBvcnQgcHJvcHMgZnJvbSAnLi4vdXRpbC9wcm9wcydcclxuaW1wb3J0IHtcclxuICBWVGltZXN0YW1wLFxyXG4gIFZUaW1lc3RhbXBGb3JtYXR0ZXIsXHJcbiAgcGFyc2VUaW1lc3RhbXAsXHJcbiAgY29weVRpbWVzdGFtcCxcclxuICBnZXRXZWVrZGF5U2tpcHMsXHJcbiAgZmluZFdlZWtkYXksXHJcbiAgcHJldkRheSxcclxuICB1cGRhdGVXZWVrZGF5LFxyXG4gIHVwZGF0ZUZvcm1hdHRlZCxcclxuICB1cGRhdGVSZWxhdGl2ZSxcclxuICBkYXlzSW5Nb250aCxcclxuICBjcmVhdGVEYXlMaXN0LFxyXG4gIGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcixcclxuICBEQVlfTUlOXHJcbn0gZnJvbSAnLi4vdXRpbC90aW1lc3RhbXAnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoQ29sb3JhYmxlLCBUaGVtZWFibGUsIFRpbWVzLCBNb3VzZSkuZXh0ZW5kKHtcclxuICBuYW1lOiAnY2FsZW5kYXItYmFzZScsXHJcblxyXG4gIHByb3BzOiBwcm9wcy5iYXNlLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgd2Vla2RheVNraXBzICgpOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBnZXRXZWVrZGF5U2tpcHModGhpcy53ZWVrZGF5cylcclxuICAgIH0sXHJcbiAgICBwYXJzZWRTdGFydCAoKTogVlRpbWVzdGFtcCB7XHJcbiAgICAgIHJldHVybiBwYXJzZVRpbWVzdGFtcCh0aGlzLnN0YXJ0KSBhcyBWVGltZXN0YW1wXHJcbiAgICB9LFxyXG4gICAgcGFyc2VkRW5kICgpOiBWVGltZXN0YW1wIHtcclxuICAgICAgcmV0dXJuIHBhcnNlVGltZXN0YW1wKHRoaXMuZW5kKSBhcyBWVGltZXN0YW1wXHJcbiAgICB9LFxyXG4gICAgZGF5cyAoKTogVlRpbWVzdGFtcFtdIHtcclxuICAgICAgcmV0dXJuIGNyZWF0ZURheUxpc3QoXHJcbiAgICAgICAgdGhpcy5wYXJzZWRTdGFydCxcclxuICAgICAgICB0aGlzLnBhcnNlZEVuZCxcclxuICAgICAgICB0aGlzLnRpbWVzLnRvZGF5LFxyXG4gICAgICAgIHRoaXMud2Vla2RheVNraXBzXHJcbiAgICAgIClcclxuICAgIH0sXHJcbiAgICBkYXlGb3JtYXR0ZXIgKCk6IFZUaW1lc3RhbXBGb3JtYXR0ZXIge1xyXG4gICAgICBpZiAodGhpcy5kYXlGb3JtYXQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXlGb3JtYXQgYXMgVlRpbWVzdGFtcEZvcm1hdHRlclxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBvcHRpb25zID0geyB0aW1lWm9uZTogJ1VUQycsIGRheTogJ251bWVyaWMnIH1cclxuXHJcbiAgICAgIHJldHVybiBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIoXHJcbiAgICAgICAgdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgKF90bXMsIF9zaG9ydCkgPT4gb3B0aW9uc1xyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgd2Vla2RheUZvcm1hdHRlciAoKTogVlRpbWVzdGFtcEZvcm1hdHRlciB7XHJcbiAgICAgIGlmICh0aGlzLndlZWtkYXlGb3JtYXQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53ZWVrZGF5Rm9ybWF0IGFzIFZUaW1lc3RhbXBGb3JtYXR0ZXJcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbG9uZ09wdGlvbnMgPSB7IHRpbWVab25lOiAnVVRDJywgd2Vla2RheTogJ2xvbmcnIH1cclxuICAgICAgY29uc3Qgc2hvcnRPcHRpb25zID0geyB0aW1lWm9uZTogJ1VUQycsIHdlZWtkYXk6ICdzaG9ydCcgfVxyXG5cclxuICAgICAgcmV0dXJuIGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcihcclxuICAgICAgICB0aGlzLmxvY2FsZSxcclxuICAgICAgICAoX3Rtcywgc2hvcnQpID0+IHNob3J0ID8gc2hvcnRPcHRpb25zIDogbG9uZ09wdGlvbnNcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldFJlbGF0aXZlQ2xhc3NlcyAodGltZXN0YW1wOiBWVGltZXN0YW1wLCBvdXRzaWRlID0gZmFsc2UpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXByZXNlbnQnOiB0aW1lc3RhbXAucHJlc2VudCxcclxuICAgICAgICAndi1wYXN0JzogdGltZXN0YW1wLnBhc3QsXHJcbiAgICAgICAgJ3YtZnV0dXJlJzogdGltZXN0YW1wLmZ1dHVyZSxcclxuICAgICAgICAndi1vdXRzaWRlJzogb3V0c2lkZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0U3RhcnRPZldlZWsgKHRpbWVzdGFtcDogVlRpbWVzdGFtcCk6IFZUaW1lc3RhbXAge1xyXG4gICAgICBjb25zdCBzdGFydCA9IGNvcHlUaW1lc3RhbXAodGltZXN0YW1wKVxyXG4gICAgICBmaW5kV2Vla2RheShzdGFydCwgdGhpcy53ZWVrZGF5c1swXSwgcHJldkRheSlcclxuICAgICAgdXBkYXRlRm9ybWF0dGVkKHN0YXJ0KVxyXG4gICAgICB1cGRhdGVSZWxhdGl2ZShzdGFydCwgdGhpcy50aW1lcy50b2RheSwgc3RhcnQuaGFzVGltZSlcclxuICAgICAgcmV0dXJuIHN0YXJ0XHJcbiAgICB9LFxyXG4gICAgZ2V0RW5kT2ZXZWVrICh0aW1lc3RhbXA6IFZUaW1lc3RhbXApOiBWVGltZXN0YW1wIHtcclxuICAgICAgY29uc3QgZW5kID0gY29weVRpbWVzdGFtcCh0aW1lc3RhbXApXHJcbiAgICAgIGZpbmRXZWVrZGF5KGVuZCwgdGhpcy53ZWVrZGF5c1t0aGlzLndlZWtkYXlzLmxlbmd0aCAtIDFdKVxyXG4gICAgICB1cGRhdGVGb3JtYXR0ZWQoZW5kKVxyXG4gICAgICB1cGRhdGVSZWxhdGl2ZShlbmQsIHRoaXMudGltZXMudG9kYXksIGVuZC5oYXNUaW1lKVxyXG4gICAgICByZXR1cm4gZW5kXHJcbiAgICB9LFxyXG4gICAgZ2V0U3RhcnRPZk1vbnRoICh0aW1lc3RhbXA6IFZUaW1lc3RhbXApOiBWVGltZXN0YW1wIHtcclxuICAgICAgY29uc3Qgc3RhcnQgPSBjb3B5VGltZXN0YW1wKHRpbWVzdGFtcClcclxuICAgICAgc3RhcnQuZGF5ID0gREFZX01JTlxyXG4gICAgICB1cGRhdGVXZWVrZGF5KHN0YXJ0KVxyXG4gICAgICB1cGRhdGVGb3JtYXR0ZWQoc3RhcnQpXHJcbiAgICAgIHJldHVybiBzdGFydFxyXG4gICAgfSxcclxuICAgIGdldEVuZE9mTW9udGggKHRpbWVzdGFtcDogVlRpbWVzdGFtcCk6IFZUaW1lc3RhbXAge1xyXG4gICAgICBjb25zdCBlbmQgPSBjb3B5VGltZXN0YW1wKHRpbWVzdGFtcClcclxuICAgICAgZW5kLmRheSA9IGRheXNJbk1vbnRoKGVuZC55ZWFyLCBlbmQubW9udGgpXHJcbiAgICAgIHVwZGF0ZVdlZWtkYXkoZW5kKVxyXG4gICAgICB1cGRhdGVGb3JtYXR0ZWQoZW5kKVxyXG4gICAgICByZXR1cm4gZW5kXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=