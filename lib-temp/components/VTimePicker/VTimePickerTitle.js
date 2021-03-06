import '../../stylus/components/_time-picker-title.styl';
// Mixins
import PickerButton from '../../mixins/picker-button';
// Utils
import { pad } from '../VDatePicker/util';
import mixins from '../../util/mixins';
import { selectingTimes } from './VTimePicker';
export default mixins(PickerButton
/* @vue/component */
).extend({
    name: 'v-time-picker-title',
    props: {
        ampm: Boolean,
        disabled: Boolean,
        hour: Number,
        minute: Number,
        second: Number,
        period: {
            type: String,
            validator: period => period === 'am' || period === 'pm'
        },
        readonly: Boolean,
        useSeconds: Boolean,
        selecting: Number
    },
    methods: {
        genTime() {
            let hour = this.hour;
            if (this.ampm) {
                hour = hour ? ((hour - 1) % 12 + 1) : 12;
            }
            const displayedHour = this.hour == null ? '--' : this.ampm ? String(hour) : pad(hour);
            const displayedMinute = this.minute == null ? '--' : pad(this.minute);
            const titleContent = [
                this.genPickerButton('selecting', selectingTimes.hour, displayedHour, this.disabled),
                this.$createElement('span', ':'),
                this.genPickerButton('selecting', selectingTimes.minute, displayedMinute, this.disabled)
            ];
            if (this.useSeconds) {
                const displayedSecond = this.second == null ? '--' : pad(this.second);
                titleContent.push(this.$createElement('span', ':'));
                titleContent.push(this.genPickerButton('selecting', selectingTimes.second, displayedSecond, this.disabled));
            }
            return this.$createElement('div', {
                'class': 'v-time-picker-title__time'
            }, titleContent);
        },
        genAmPm() {
            return this.$createElement('div', {
                staticClass: 'v-time-picker-title__ampm'
            }, [
                this.genPickerButton('period', 'am', 'am', this.disabled || this.readonly),
                this.genPickerButton('period', 'pm', 'pm', this.disabled || this.readonly)
            ]);
        }
    },
    render(h) {
        const children = [this.genTime()];
        this.ampm && children.push(this.genAmPm());
        return h('div', {
            staticClass: 'v-time-picker-title'
        }, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVQaWNrZXJUaXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUaW1lUGlja2VyL1ZUaW1lUGlja2VyVGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxpREFBaUQsQ0FBQTtBQUV4RCxTQUFTO0FBQ1QsT0FBTyxZQUFZLE1BQU0sNEJBQTRCLENBQUE7QUFFckQsUUFBUTtBQUNSLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQTtBQUN6QyxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFBO0FBSTlDLGVBQWUsTUFBTSxDQUNuQixZQUFZO0FBQ2Qsb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLHFCQUFxQjtJQUUzQixLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLE1BQU07UUFDZCxNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLEtBQUssSUFBSTtTQUMxQjtRQUMvQixRQUFRLEVBQUUsT0FBTztRQUNqQixVQUFVLEVBQUUsT0FBTztRQUNuQixTQUFTLEVBQUUsTUFBTTtLQUNsQjtJQUVELE9BQU8sRUFBRTtRQUNQLE9BQU87WUFDTCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO1lBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO2FBQ3pDO1lBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDckYsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNyRSxNQUFNLFlBQVksR0FBRztnQkFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDcEYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQ3pGLENBQUE7WUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQ3JFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtnQkFDbkQsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTthQUM1RztZQUNELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLE9BQU8sRUFBRSwyQkFBMkI7YUFDckMsRUFBRSxZQUFZLENBQUMsQ0FBQTtRQUNsQixDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSwyQkFBMkI7YUFDekMsRUFBRTtnQkFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDMUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDM0UsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBRWpDLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUUxQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUscUJBQXFCO1NBQ25DLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fdGltZS1waWNrZXItdGl0bGUuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgUGlja2VyQnV0dG9uIGZyb20gJy4uLy4uL21peGlucy9waWNrZXItYnV0dG9uJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsgcGFkIH0gZnJvbSAnLi4vVkRhdGVQaWNrZXIvdXRpbCdcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbmltcG9ydCB7IHNlbGVjdGluZ1RpbWVzIH0gZnJvbSAnLi9WVGltZVBpY2tlcidcclxuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBQaWNrZXJCdXR0b25cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXRpbWUtcGlja2VyLXRpdGxlJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFtcG06IEJvb2xlYW4sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGhvdXI6IE51bWJlcixcclxuICAgIG1pbnV0ZTogTnVtYmVyLFxyXG4gICAgc2Vjb25kOiBOdW1iZXIsXHJcbiAgICBwZXJpb2Q6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB2YWxpZGF0b3I6IHBlcmlvZCA9PiBwZXJpb2QgPT09ICdhbScgfHwgcGVyaW9kID09PSAncG0nXHJcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8J2FtJyB8ICdwbSc+LFxyXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXHJcbiAgICB1c2VTZWNvbmRzOiBCb29sZWFuLFxyXG4gICAgc2VsZWN0aW5nOiBOdW1iZXJcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5UaW1lICgpIHtcclxuICAgICAgbGV0IGhvdXIgPSB0aGlzLmhvdXJcclxuICAgICAgaWYgKHRoaXMuYW1wbSkge1xyXG4gICAgICAgIGhvdXIgPSBob3VyID8gKChob3VyIC0gMSkgJSAxMiArIDEpIDogMTJcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGlzcGxheWVkSG91ciA9IHRoaXMuaG91ciA9PSBudWxsID8gJy0tJyA6IHRoaXMuYW1wbSA/IFN0cmluZyhob3VyKSA6IHBhZChob3VyKVxyXG4gICAgICBjb25zdCBkaXNwbGF5ZWRNaW51dGUgPSB0aGlzLm1pbnV0ZSA9PSBudWxsID8gJy0tJyA6IHBhZCh0aGlzLm1pbnV0ZSlcclxuICAgICAgY29uc3QgdGl0bGVDb250ZW50ID0gW1xyXG4gICAgICAgIHRoaXMuZ2VuUGlja2VyQnV0dG9uKCdzZWxlY3RpbmcnLCBzZWxlY3RpbmdUaW1lcy5ob3VyLCBkaXNwbGF5ZWRIb3VyLCB0aGlzLmRpc2FibGVkKSxcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywgJzonKSxcclxuICAgICAgICB0aGlzLmdlblBpY2tlckJ1dHRvbignc2VsZWN0aW5nJywgc2VsZWN0aW5nVGltZXMubWludXRlLCBkaXNwbGF5ZWRNaW51dGUsIHRoaXMuZGlzYWJsZWQpXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIGlmICh0aGlzLnVzZVNlY29uZHMpIHtcclxuICAgICAgICBjb25zdCBkaXNwbGF5ZWRTZWNvbmQgPSB0aGlzLnNlY29uZCA9PSBudWxsID8gJy0tJyA6IHBhZCh0aGlzLnNlY29uZClcclxuICAgICAgICB0aXRsZUNvbnRlbnQucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywgJzonKSlcclxuICAgICAgICB0aXRsZUNvbnRlbnQucHVzaCh0aGlzLmdlblBpY2tlckJ1dHRvbignc2VsZWN0aW5nJywgc2VsZWN0aW5nVGltZXMuc2Vjb25kLCBkaXNwbGF5ZWRTZWNvbmQsIHRoaXMuZGlzYWJsZWQpKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogJ3YtdGltZS1waWNrZXItdGl0bGVfX3RpbWUnXHJcbiAgICAgIH0sIHRpdGxlQ29udGVudClcclxuICAgIH0sXHJcbiAgICBnZW5BbVBtICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZS1waWNrZXItdGl0bGVfX2FtcG0nXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlblBpY2tlckJ1dHRvbigncGVyaW9kJywgJ2FtJywgJ2FtJywgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnJlYWRvbmx5KSxcclxuICAgICAgICB0aGlzLmdlblBpY2tlckJ1dHRvbigncGVyaW9kJywgJ3BtJywgJ3BtJywgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnJlYWRvbmx5KVxyXG4gICAgICBdKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuVGltZSgpXVxyXG5cclxuICAgIHRoaXMuYW1wbSAmJiBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQW1QbSgpKVxyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lLXBpY2tlci10aXRsZSdcclxuICAgIH0sIGNoaWxkcmVuKVxyXG4gIH1cclxufSlcclxuIl19