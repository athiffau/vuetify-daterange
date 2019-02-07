// Styles
import '../../stylus/components/_calendar-daily.styl';
// Directives
import Resize from '../../directives/resize';
// Mixins
import CalendarWithIntervals from './mixins/calendar-with-intervals';
// Util
import { convertToUnit } from '../../util/helpers';
/* @vue/component */
export default CalendarWithIntervals.extend({
    name: 'v-calendar-daily',
    directives: { Resize },
    data: () => ({
        scrollPush: 0
    }),
    computed: {
        classes() {
            return {
                'v-calendar-daily': true,
                ...this.themeClasses
            };
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$nextTick(this.onResize);
        },
        onResize() {
            this.scrollPush = this.getScrollPush();
        },
        getScrollPush() {
            const area = this.$refs.scrollArea;
            const pane = this.$refs.pane;
            return area && pane ? (area.offsetWidth - pane.offsetWidth) : 0;
        },
        genHead() {
            return this.$createElement('div', {
                staticClass: 'v-calendar-daily__head',
                style: {
                    marginRight: this.scrollPush + 'px'
                }
            }, [
                this.genHeadIntervals(),
                ...this.genHeadDays()
            ]);
        },
        genHeadIntervals() {
            return this.$createElement('div', {
                staticClass: 'v-calendar-daily__intervals-head'
            });
        },
        genHeadDays() {
            return this.days.map(this.genHeadDay);
        },
        genHeadDay(day) {
            const slot = this.$scopedSlots.dayHeader;
            return this.$createElement('div', {
                key: day.date,
                staticClass: 'v-calendar-daily_head-day',
                class: this.getRelativeClasses(day),
                on: this.getDefaultMouseEventHandlers(':day', _e => {
                    return this.getSlotScope(day);
                })
            }, [
                this.genHeadWeekday(day),
                this.genHeadDayLabel(day),
                slot ? slot(day) : ''
            ]);
        },
        genHeadWeekday(day) {
            const color = day.present ? this.color : undefined;
            return this.$createElement('div', this.setTextColor(color, {
                staticClass: 'v-calendar-daily_head-weekday'
            }), this.weekdayFormatter(day, this.shortWeekdays));
        },
        genHeadDayLabel(day) {
            const color = day.present ? this.color : undefined;
            return this.$createElement('div', this.setTextColor(color, {
                staticClass: 'v-calendar-daily_head-day-label',
                on: this.getMouseEventHandlers({
                    'click:date': { event: 'click', stop: true },
                    'contextmenu:date': { event: 'contextmenu', stop: true, prevent: true, result: false }
                }, _e => {
                    return day;
                })
            }), this.dayFormatter(day, false));
        },
        genBody() {
            return this.$createElement('div', {
                staticClass: 'v-calendar-daily__body'
            }, [
                this.genScrollArea()
            ]);
        },
        genScrollArea() {
            return this.$createElement('div', {
                ref: 'scrollArea',
                staticClass: 'v-calendar-daily__scroll-area'
            }, [
                this.genPane()
            ]);
        },
        genPane() {
            return this.$createElement('div', {
                ref: 'pane',
                staticClass: 'v-calendar-daily__pane',
                style: {
                    height: convertToUnit(this.bodyHeight)
                }
            }, [
                this.genDayContainer()
            ]);
        },
        genDayContainer() {
            return this.$createElement('div', {
                staticClass: 'v-calendar-daily__day-container'
            }, [
                this.genBodyIntervals(),
                ...this.genDays()
            ]);
        },
        genDays() {
            return this.days.map(this.genDay);
        },
        genDay(day, index) {
            const slot = this.$scopedSlots.dayBody;
            const scope = this.getSlotScope(day);
            return this.$createElement('div', {
                key: day.date,
                staticClass: 'v-calendar-daily__day',
                class: this.getRelativeClasses(day),
                on: this.getDefaultMouseEventHandlers(':time', e => {
                    return this.getSlotScope(this.getTimestampAtEvent(e, day));
                })
            }, [
                ...this.genDayIntervals(index),
                slot ? slot(scope) : ''
            ]);
        },
        genDayIntervals(index) {
            return this.intervals[index].map(this.genDayInterval);
        },
        genDayInterval(interval) {
            const height = convertToUnit(this.intervalHeight);
            const styler = this.intervalStyle || this.intervalStyleDefault;
            const slot = this.$scopedSlots.interval;
            const scope = this.getSlotScope(interval);
            const data = {
                key: interval.time,
                staticClass: 'v-calendar-daily__day-interval',
                style: {
                    height,
                    ...styler(interval)
                }
            };
            const children = slot ? slot(scope) : undefined;
            return this.$createElement('div', data, children);
        },
        genBodyIntervals() {
            const data = {
                staticClass: 'v-calendar-daily__intervals-body',
                on: this.getDefaultMouseEventHandlers(':interval', e => {
                    return this.getTimestampAtEvent(e, this.parsedStart);
                })
            };
            return this.$createElement('div', data, this.genIntervalLabels());
        },
        genIntervalLabels() {
            return this.intervals[0].map(this.genIntervalLabel);
        },
        genIntervalLabel(interval) {
            const height = convertToUnit(this.intervalHeight);
            const short = this.shortIntervals;
            const shower = this.showIntervalLabel || this.showIntervalLabelDefault;
            const show = shower(interval);
            const label = show ? this.intervalFormatter(interval, short) : undefined;
            return this.$createElement('div', {
                key: interval.time,
                staticClass: 'v-calendar-daily__interval',
                style: {
                    height
                }
            }, [
                this.$createElement('div', {
                    staticClass: 'v-calendar-daily__interval-text'
                }, label)
            ]);
        }
    },
    render(h) {
        return h('div', {
            class: this.classes,
            nativeOn: {
                dragstart: (e) => {
                    e.preventDefault();
                }
            },
            directives: [{
                    modifiers: { quiet: true },
                    name: 'resize',
                    value: this.onResize
                }]
        }, [
            !this.hideHeader ? this.genHead() : '',
            this.genBody()
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhbGVuZGFyRGFpbHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FsZW5kYXIvVkNhbGVuZGFyRGFpbHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUztBQUNULE9BQU8sOENBQThDLENBQUE7QUFLckQsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBRTVDLFNBQVM7QUFDVCxPQUFPLHFCQUFxQixNQUFNLGtDQUFrQyxDQUFBO0FBRXBFLE9BQU87QUFDUCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFHbEQsb0JBQW9CO0FBQ3BCLGVBQWUscUJBQXFCLENBQUMsTUFBTSxDQUFDO0lBQzFDLElBQUksRUFBRSxrQkFBa0I7SUFFeEIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBRXRCLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsVUFBVSxFQUFFLENBQUM7S0FDZCxDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxJQUFJO1lBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDL0IsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN4QyxDQUFDO1FBQ0QsYUFBYTtZQUNYLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBeUIsQ0FBQTtZQUNqRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQW1CLENBQUE7WUFFM0MsT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakUsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsd0JBQXdCO2dCQUNyQyxLQUFLLEVBQUU7b0JBQ0wsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSTtpQkFDcEM7YUFDRixFQUFFO2dCQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDdkIsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFO2FBQ3RCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxnQkFBZ0I7WUFDZCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsa0NBQWtDO2FBQ2hELENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDdkMsQ0FBQztRQUNELFVBQVUsQ0FBRSxHQUFlO1lBQ3pCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFBO1lBRXhDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDYixXQUFXLEVBQUUsMkJBQTJCO2dCQUN4QyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQztnQkFDbkMsRUFBRSxFQUFFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQ2pELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDL0IsQ0FBQyxDQUFDO2FBQ0gsRUFBRTtnQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2FBQ3RCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxjQUFjLENBQUUsR0FBZTtZQUM3QixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUE7WUFFbEQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtnQkFDekQsV0FBVyxFQUFFLCtCQUErQjthQUM3QyxDQUFDLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtRQUNyRCxDQUFDO1FBQ0QsZUFBZSxDQUFFLEdBQWU7WUFDOUIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO1lBRWxELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3pELFdBQVcsRUFBRSxpQ0FBaUM7Z0JBQzlDLEVBQUUsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUM7b0JBQzdCLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtvQkFDNUMsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2lCQUN2RixFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUNOLE9BQU8sR0FBRyxDQUFBO2dCQUNaLENBQUMsQ0FBQzthQUNILENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLHdCQUF3QjthQUN0QyxFQUFFO2dCQUNELElBQUksQ0FBQyxhQUFhLEVBQUU7YUFDckIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxHQUFHLEVBQUUsWUFBWTtnQkFDakIsV0FBVyxFQUFFLCtCQUErQjthQUM3QyxFQUFFO2dCQUNELElBQUksQ0FBQyxPQUFPLEVBQUU7YUFDZixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEdBQUcsRUFBRSxNQUFNO2dCQUNYLFdBQVcsRUFBRSx3QkFBd0I7Z0JBQ3JDLEtBQUssRUFBRTtvQkFDTCxNQUFNLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7aUJBQ3ZDO2FBQ0YsRUFBRTtnQkFDRCxJQUFJLENBQUMsZUFBZSxFQUFFO2FBQ3ZCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxlQUFlO1lBQ2IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLGlDQUFpQzthQUMvQyxFQUFFO2dCQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDdkIsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO2FBQ2xCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkMsQ0FBQztRQUNELE1BQU0sQ0FBRSxHQUFlLEVBQUUsS0FBYTtZQUNwQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQTtZQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXBDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEdBQUcsRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDYixXQUFXLEVBQUUsdUJBQXVCO2dCQUNwQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQztnQkFDbkMsRUFBRSxFQUFFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUU7b0JBQ2pELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7Z0JBQzVELENBQUMsQ0FBQzthQUNILEVBQUU7Z0JBQ0QsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztnQkFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDeEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELGVBQWUsQ0FBRSxLQUFhO1lBQzVCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ3ZELENBQUM7UUFDRCxjQUFjLENBQUUsUUFBb0I7WUFDbEMsTUFBTSxNQUFNLEdBQXVCLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDckUsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUE7WUFDOUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUE7WUFDdkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUV6QyxNQUFNLElBQUksR0FBRztnQkFDWCxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ2xCLFdBQVcsRUFBRSxnQ0FBZ0M7Z0JBQzdDLEtBQUssRUFBRTtvQkFDTCxNQUFNO29CQUNOLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztpQkFDcEI7YUFDRixDQUFBO1lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFrQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUE7WUFFaEUsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDbkQsQ0FBQztRQUNELGdCQUFnQjtZQUNkLE1BQU0sSUFBSSxHQUFHO2dCQUNYLFdBQVcsRUFBRSxrQ0FBa0M7Z0JBQy9DLEVBQUUsRUFBRSxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFO29CQUNyRCxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUN0RCxDQUFDLENBQUM7YUFDSCxDQUFBO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQTtRQUNuRSxDQUFDO1FBQ0QsaUJBQWlCO1lBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUNyRCxDQUFDO1FBQ0QsZ0JBQWdCLENBQUUsUUFBb0I7WUFDcEMsTUFBTSxNQUFNLEdBQXVCLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7WUFDckUsTUFBTSxLQUFLLEdBQVksSUFBSSxDQUFDLGNBQWMsQ0FBQTtZQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLHdCQUF3QixDQUFBO1lBQ3RFLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtZQUV4RSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ2xCLFdBQVcsRUFBRSw0QkFBNEI7Z0JBQ3pDLEtBQUssRUFBRTtvQkFDTCxNQUFNO2lCQUNQO2FBQ0YsRUFBRTtnQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtvQkFDekIsV0FBVyxFQUFFLGlDQUFpQztpQkFDL0MsRUFBRSxLQUFLLENBQUM7YUFDVixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixRQUFRLEVBQUU7Z0JBQ1IsU0FBUyxFQUFFLENBQUMsQ0FBYSxFQUFFLEVBQUU7b0JBQzNCLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtnQkFDcEIsQ0FBQzthQUNGO1lBQ0QsVUFBVSxFQUFFLENBQUM7b0JBQ1gsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtvQkFDMUIsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUNyQixDQUFDO1NBQ0gsRUFBRTtZQUNELENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUU7U0FDZixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2NhbGVuZGFyLWRhaWx5LnN0eWwnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSwgVk5vZGVDaGlsZHJlbiB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IFJlc2l6ZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3Jlc2l6ZSdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ2FsZW5kYXJXaXRoSW50ZXJ2YWxzIGZyb20gJy4vbWl4aW5zL2NhbGVuZGFyLXdpdGgtaW50ZXJ2YWxzJ1xyXG5cclxuLy8gVXRpbFxyXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBWVGltZXN0YW1wIH0gZnJvbSAnLi91dGlsL3RpbWVzdGFtcCdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IENhbGVuZGFyV2l0aEludGVydmFscy5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWNhbGVuZGFyLWRhaWx5JyxcclxuXHJcbiAgZGlyZWN0aXZlczogeyBSZXNpemUgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIHNjcm9sbFB1c2g6IDBcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtY2FsZW5kYXItZGFpbHknOiB0cnVlLFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuaW5pdCgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgaW5pdCAoKSB7XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMub25SZXNpemUpXHJcbiAgICB9LFxyXG4gICAgb25SZXNpemUgKCkge1xyXG4gICAgICB0aGlzLnNjcm9sbFB1c2ggPSB0aGlzLmdldFNjcm9sbFB1c2goKVxyXG4gICAgfSxcclxuICAgIGdldFNjcm9sbFB1c2ggKCk6IG51bWJlciB7XHJcbiAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLiRyZWZzLnNjcm9sbEFyZWEgYXMgSFRNTEVsZW1lbnRcclxuICAgICAgY29uc3QgcGFuZSA9IHRoaXMuJHJlZnMucGFuZSBhcyBIVE1MRWxlbWVudFxyXG5cclxuICAgICAgcmV0dXJuIGFyZWEgJiYgcGFuZSA/IChhcmVhLm9mZnNldFdpZHRoIC0gcGFuZS5vZmZzZXRXaWR0aCkgOiAwXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZCAoKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9faGVhZCcsXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIG1hcmdpblJpZ2h0OiB0aGlzLnNjcm9sbFB1c2ggKyAncHgnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5IZWFkSW50ZXJ2YWxzKCksXHJcbiAgICAgICAgLi4udGhpcy5nZW5IZWFkRGF5cygpXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZEludGVydmFscyAoKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9faW50ZXJ2YWxzLWhlYWQnXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZERheXMgKCk6IFZOb2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kYXlzLm1hcCh0aGlzLmdlbkhlYWREYXkpXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZERheSAoZGF5OiBWVGltZXN0YW1wKTogVk5vZGUge1xyXG4gICAgICBjb25zdCBzbG90ID0gdGhpcy4kc2NvcGVkU2xvdHMuZGF5SGVhZGVyXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIGtleTogZGF5LmRhdGUsXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhbGVuZGFyLWRhaWx5X2hlYWQtZGF5JyxcclxuICAgICAgICBjbGFzczogdGhpcy5nZXRSZWxhdGl2ZUNsYXNzZXMoZGF5KSxcclxuICAgICAgICBvbjogdGhpcy5nZXREZWZhdWx0TW91c2VFdmVudEhhbmRsZXJzKCc6ZGF5JywgX2UgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2xvdFNjb3BlKGRheSlcclxuICAgICAgICB9KVxyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5IZWFkV2Vla2RheShkYXkpLFxyXG4gICAgICAgIHRoaXMuZ2VuSGVhZERheUxhYmVsKGRheSksXHJcbiAgICAgICAgc2xvdCA/IHNsb3QoZGF5KSA6ICcnXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZFdlZWtkYXkgKGRheTogVlRpbWVzdGFtcCk6IFZOb2RlIHtcclxuICAgICAgY29uc3QgY29sb3IgPSBkYXkucHJlc2VudCA/IHRoaXMuY29sb3IgOiB1bmRlZmluZWRcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcihjb2xvciwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9oZWFkLXdlZWtkYXknXHJcbiAgICAgIH0pLCB0aGlzLndlZWtkYXlGb3JtYXR0ZXIoZGF5LCB0aGlzLnNob3J0V2Vla2RheXMpKVxyXG4gICAgfSxcclxuICAgIGdlbkhlYWREYXlMYWJlbCAoZGF5OiBWVGltZXN0YW1wKTogVk5vZGUge1xyXG4gICAgICBjb25zdCBjb2xvciA9IGRheS5wcmVzZW50ID8gdGhpcy5jb2xvciA6IHVuZGVmaW5lZFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKGNvbG9yLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhbGVuZGFyLWRhaWx5X2hlYWQtZGF5LWxhYmVsJyxcclxuICAgICAgICBvbjogdGhpcy5nZXRNb3VzZUV2ZW50SGFuZGxlcnMoe1xyXG4gICAgICAgICAgJ2NsaWNrOmRhdGUnOiB7IGV2ZW50OiAnY2xpY2snLCBzdG9wOiB0cnVlIH0sXHJcbiAgICAgICAgICAnY29udGV4dG1lbnU6ZGF0ZSc6IHsgZXZlbnQ6ICdjb250ZXh0bWVudScsIHN0b3A6IHRydWUsIHByZXZlbnQ6IHRydWUsIHJlc3VsdDogZmFsc2UgfVxyXG4gICAgICAgIH0sIF9lID0+IHtcclxuICAgICAgICAgIHJldHVybiBkYXlcclxuICAgICAgICB9KVxyXG4gICAgICB9KSwgdGhpcy5kYXlGb3JtYXR0ZXIoZGF5LCBmYWxzZSkpXHJcbiAgICB9LFxyXG4gICAgZ2VuQm9keSAoKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9fYm9keSdcclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuU2Nyb2xsQXJlYSgpXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuU2Nyb2xsQXJlYSAoKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHJlZjogJ3Njcm9sbEFyZWEnLFxyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9fc2Nyb2xsLWFyZWEnXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlblBhbmUoKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlblBhbmUgKCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICByZWY6ICdwYW5lJyxcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2FsZW5kYXItZGFpbHlfX3BhbmUnLFxyXG4gICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICBoZWlnaHQ6IGNvbnZlcnRUb1VuaXQodGhpcy5ib2R5SGVpZ2h0KVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuRGF5Q29udGFpbmVyKClcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5EYXlDb250YWluZXIgKCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2FsZW5kYXItZGFpbHlfX2RheS1jb250YWluZXInXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbkJvZHlJbnRlcnZhbHMoKSxcclxuICAgICAgICAuLi50aGlzLmdlbkRheXMoKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkRheXMgKCk6IFZOb2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5kYXlzLm1hcCh0aGlzLmdlbkRheSlcclxuICAgIH0sXHJcbiAgICBnZW5EYXkgKGRheTogVlRpbWVzdGFtcCwgaW5kZXg6IG51bWJlcik6IFZOb2RlIHtcclxuICAgICAgY29uc3Qgc2xvdCA9IHRoaXMuJHNjb3BlZFNsb3RzLmRheUJvZHlcclxuICAgICAgY29uc3Qgc2NvcGUgPSB0aGlzLmdldFNsb3RTY29wZShkYXkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIGtleTogZGF5LmRhdGUsXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhbGVuZGFyLWRhaWx5X19kYXknLFxyXG4gICAgICAgIGNsYXNzOiB0aGlzLmdldFJlbGF0aXZlQ2xhc3NlcyhkYXkpLFxyXG4gICAgICAgIG9uOiB0aGlzLmdldERlZmF1bHRNb3VzZUV2ZW50SGFuZGxlcnMoJzp0aW1lJywgZSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTbG90U2NvcGUodGhpcy5nZXRUaW1lc3RhbXBBdEV2ZW50KGUsIGRheSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgfSwgW1xyXG4gICAgICAgIC4uLnRoaXMuZ2VuRGF5SW50ZXJ2YWxzKGluZGV4KSxcclxuICAgICAgICBzbG90ID8gc2xvdChzY29wZSkgOiAnJ1xyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkRheUludGVydmFscyAoaW5kZXg6IG51bWJlcik6IFZOb2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbHNbaW5kZXhdLm1hcCh0aGlzLmdlbkRheUludGVydmFsKVxyXG4gICAgfSxcclxuICAgIGdlbkRheUludGVydmFsIChpbnRlcnZhbDogVlRpbWVzdGFtcCk6IFZOb2RlIHtcclxuICAgICAgY29uc3QgaGVpZ2h0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBjb252ZXJ0VG9Vbml0KHRoaXMuaW50ZXJ2YWxIZWlnaHQpXHJcbiAgICAgIGNvbnN0IHN0eWxlciA9IHRoaXMuaW50ZXJ2YWxTdHlsZSB8fCB0aGlzLmludGVydmFsU3R5bGVEZWZhdWx0XHJcbiAgICAgIGNvbnN0IHNsb3QgPSB0aGlzLiRzY29wZWRTbG90cy5pbnRlcnZhbFxyXG4gICAgICBjb25zdCBzY29wZSA9IHRoaXMuZ2V0U2xvdFNjb3BlKGludGVydmFsKVxyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICBrZXk6IGludGVydmFsLnRpbWUsXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhbGVuZGFyLWRhaWx5X19kYXktaW50ZXJ2YWwnLFxyXG4gICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAuLi5zdHlsZXIoaW50ZXJ2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHNsb3QgPyBzbG90KHNjb3BlKSBhcyBWTm9kZUNoaWxkcmVuIDogdW5kZWZpbmVkXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgZGF0YSwgY2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgZ2VuQm9keUludGVydmFscyAoKTogVk5vZGUge1xyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9faW50ZXJ2YWxzLWJvZHknLFxyXG4gICAgICAgIG9uOiB0aGlzLmdldERlZmF1bHRNb3VzZUV2ZW50SGFuZGxlcnMoJzppbnRlcnZhbCcsIGUgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGltZXN0YW1wQXRFdmVudChlLCB0aGlzLnBhcnNlZFN0YXJ0KVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCBkYXRhLCB0aGlzLmdlbkludGVydmFsTGFiZWxzKCkpXHJcbiAgICB9LFxyXG4gICAgZ2VuSW50ZXJ2YWxMYWJlbHMgKCk6IFZOb2RlW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbHNbMF0ubWFwKHRoaXMuZ2VuSW50ZXJ2YWxMYWJlbClcclxuICAgIH0sXHJcbiAgICBnZW5JbnRlcnZhbExhYmVsIChpbnRlcnZhbDogVlRpbWVzdGFtcCk6IFZOb2RlIHtcclxuICAgICAgY29uc3QgaGVpZ2h0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBjb252ZXJ0VG9Vbml0KHRoaXMuaW50ZXJ2YWxIZWlnaHQpXHJcbiAgICAgIGNvbnN0IHNob3J0OiBib29sZWFuID0gdGhpcy5zaG9ydEludGVydmFsc1xyXG4gICAgICBjb25zdCBzaG93ZXIgPSB0aGlzLnNob3dJbnRlcnZhbExhYmVsIHx8IHRoaXMuc2hvd0ludGVydmFsTGFiZWxEZWZhdWx0XHJcbiAgICAgIGNvbnN0IHNob3cgPSBzaG93ZXIoaW50ZXJ2YWwpXHJcbiAgICAgIGNvbnN0IGxhYmVsID0gc2hvdyA/IHRoaXMuaW50ZXJ2YWxGb3JtYXR0ZXIoaW50ZXJ2YWwsIHNob3J0KSA6IHVuZGVmaW5lZFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBrZXk6IGludGVydmFsLnRpbWUsXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhbGVuZGFyLWRhaWx5X19pbnRlcnZhbCcsXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIGhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhci1kYWlseV9faW50ZXJ2YWwtdGV4dCdcclxuICAgICAgICB9LCBsYWJlbClcclxuICAgICAgXSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxyXG4gICAgICBuYXRpdmVPbjoge1xyXG4gICAgICAgIGRyYWdzdGFydDogKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZGlyZWN0aXZlczogW3tcclxuICAgICAgICBtb2RpZmllcnM6IHsgcXVpZXQ6IHRydWUgfSxcclxuICAgICAgICBuYW1lOiAncmVzaXplJyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZVxyXG4gICAgICB9XVxyXG4gICAgfSwgW1xyXG4gICAgICAhdGhpcy5oaWRlSGVhZGVyID8gdGhpcy5nZW5IZWFkKCkgOiAnJyxcclxuICAgICAgdGhpcy5nZW5Cb2R5KClcclxuICAgIF0pXHJcbiAgfVxyXG59KVxyXG4iXX0=