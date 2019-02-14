import '../../../stylus/components/_date-picker-table.styl';
// Directives
import Touch from '../../../directives/touch';
// Mixins
import Colorable from '../../../mixins/colorable';
import Themeable from '../../../mixins/themeable';
// Utils
import isDateAllowed from '../util/isDateAllowed';
import isDateInRange, { isHoverAfterStartDate } from '../util/isDateInRange';
import mixins from '../../../util/mixins';
export default mixins(Colorable, Themeable
/* @vue/component */
).extend({
    directives: { Touch },
    props: {
        allowedDates: Function,
        current: String,
        disabled: Boolean,
        format: Function,
        events: {
            type: [Array, Function, Object],
            default: () => null
        },
        eventColor: {
            type: [Array, Function, Object, String],
            default: () => 'warning'
        },
        hover: {
            type: String,
            default: ''
        },
        hoverLink: {
            type: String,
            default: ''
        },
        locale: {
            type: String,
            default: 'en-us'
        },
        min: String,
        max: String,
        range: Boolean,
        readonly: Boolean,
        scrollable: Boolean,
        tableDate: {
            type: String,
            required: true
        },
        value: [String, Array]
    },
    data: () => ({
        isReversing: false,
        hovering: ''
    }),
    computed: {
        computedTransition() {
            return (this.isReversing === !this.$vuetify.rtl) ? 'tab-reverse-transition' : 'tab-transition';
        },
        displayedMonth() {
            return Number(this.tableDate.split('-')[1]) - 1;
        },
        displayedYear() {
            return Number(this.tableDate.split('-')[0]);
        }
    },
    watch: {
        tableDate(newVal, oldVal) {
            this.isReversing = newVal < oldVal;
        },
        hovering(value) {
            this.$emit('hover', value);
        }
    },
    methods: {
        genButtonClasses(isAllowed, isFloating, isSelected, isCurrent, isRange, isHover, isRangeStart, isRangeEnd) {
            return {
                'v-btn--range': isRange,
                'v-btn--range-hover': isRange && isHover,
                'v-btn--range-start': isRange && isRangeStart,
                'v-btn--range-end': isRange && isRangeEnd,
                'v-btn--active': isSelected,
                'v-btn--flat': !isSelected,
                'v-btn--icon': isSelected && isAllowed && isFloating,
                'v-btn--floating': isFloating,
                'v-btn--depressed': !isFloating && isSelected,
                'v-btn--disabled': !isAllowed || (this.disabled && isSelected),
                'v-btn--outline': isCurrent && !isSelected,
                ...this.themeClasses
            };
        },
        genButtonEvents(value, isAllowed, mouseEventType) {
            if (this.disabled)
                return undefined;
            return {
                click: () => {
                    isAllowed && !this.readonly && this.$emit('input', value);
                    this.$emit(`click:${mouseEventType}`, value);
                },
                dblclick: () => this.$emit(`dblclick:${mouseEventType}`, value),
                mouseover: () => {
                    this.hovering = value;
                },
                mouseleave: () => {
                    this.hovering = '';
                }
            };
        },
        genButton(value, isFloating, mouseEventType, formatter) {
            const isAllowed = isDateAllowed(value, this.min, this.max, this.allowedDates);
            const isSelected = value === this.value || (Array.isArray(this.value) && this.value.indexOf(value) !== -1);
            const isCurrent = value === this.current;
            const isHover = value === this.hovering;
            const isRange = this.range;
            const isRangeStart = isRange && value === this.value[0];
            const isRangeEnd = isRange && value === this.value[1];
            const setColor = isSelected || isRange ? this.setBackgroundColor : this.setTextColor;
            //  AT -> Added support for date-range
            //  const color = (isSelected || isCurrent) && (this.color || 'accent')
            const color = this.getFinalColor(value, (isSelected || isCurrent) && (this.color || 'accent'));
            return this.$createElement('button', setColor(color, {
                staticClass: 'v-btn',
                'class': this.genButtonClasses(isAllowed, isFloating, isSelected, isCurrent, isRange, isHover, isRangeStart, isRangeEnd),
                attrs: {
                    type: 'button'
                },
                props: {
                    isHovering: false
                },
                domProps: {
                    disabled: this.disabled || !isAllowed
                },
                on: this.genButtonEvents(value, isAllowed, mouseEventType)
            }), [
                this.$createElement('div', {
                    staticClass: 'v-btn__content'
                }, [formatter(value)]),
                this.genEvents(value)
            ]);
        },
        getFinalColor(date, color) {
            const colorInRange = Array.isArray(this.value) && isDateInRange(date, this.value);
            const colorInRangeHover = Array.isArray(this.value) && (this.value.length === 1) && (typeof this.value[0] === 'string') && isHoverAfterStartDate(date, this.value[0], this.hover ? this.hover : this.hoverLink);
            const colorRangeNode = Array.isArray(this.value) && (this.value.indexOf(date) === 0 || date === this.value[this.value.length - 1]);
            return colorRangeNode ? 'accent darken-4' : colorInRange ? 'accent darken-2' : colorInRangeHover ? 'accent darken-3' : color;
        },
        getEventColors(date) {
            const arrayize = (v) => Array.isArray(v) ? v : [v];
            let eventData;
            let eventColors = [];
            if (Array.isArray(this.events)) {
                eventData = this.events.includes(date);
            }
            else if (this.events instanceof Function) {
                eventData = this.events(date) || false;
            }
            else if (this.events) {
                eventData = this.events[date] || false;
            }
            else {
                eventData = false;
            }
            if (!eventData) {
                return [];
            }
            else if (eventData !== true) {
                eventColors = arrayize(eventData);
            }
            else if (typeof this.eventColor === 'string') {
                eventColors = [this.eventColor];
            }
            else if (typeof this.eventColor === 'function') {
                eventColors = arrayize(this.eventColor(date));
            }
            else if (Array.isArray(this.eventColor)) {
                eventColors = this.eventColor;
            }
            else {
                eventColors = arrayize(this.eventColor[date]);
            }
            return eventColors.filter(v => v);
        },
        genEvents(date) {
            const eventColors = this.getEventColors(date);
            return eventColors.length ? this.$createElement('div', {
                staticClass: 'v-date-picker-table__events'
            }, eventColors.map(color => this.$createElement('div', this.setBackgroundColor(color)))) : null;
        },
        wheel(e, calculateTableDate) {
            e.preventDefault();
            this.$emit('tableDate', calculateTableDate(e.deltaY));
        },
        touch(value, calculateTableDate) {
            this.$emit('tableDate', calculateTableDate(value));
        },
        genTable(staticClass, children, calculateTableDate) {
            const transition = this.$createElement('transition', {
                props: { name: this.computedTransition }
            }, [this.$createElement('table', { key: this.tableDate }, children)]);
            const touchDirective = {
                name: 'touch',
                value: {
                    left: (e) => (e.offsetX < -15) && this.touch(1, calculateTableDate),
                    right: (e) => (e.offsetX > 15) && this.touch(-1, calculateTableDate)
                }
            };
            return this.$createElement('div', {
                staticClass,
                class: {
                    'v-date-picker-table--disabled': this.disabled,
                    ...this.themeClasses
                },
                on: (!this.disabled && this.scrollable) ? {
                    wheel: (e) => this.wheel(e, calculateTableDate)
                } : undefined,
                directives: [touchDirective]
            }, [transition]);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXItdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9taXhpbnMvZGF0ZS1waWNrZXItdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxvREFBb0QsQ0FBQTtBQUUzRCxhQUFhO0FBQ2IsT0FBTyxLQUF1QixNQUFNLDJCQUEyQixDQUFBO0FBRS9ELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSwyQkFBMkIsQ0FBQTtBQUNqRCxPQUFPLFNBQVMsTUFBTSwyQkFBMkIsQ0FBQTtBQUVqRCxRQUFRO0FBQ1IsT0FBTyxhQUFzQyxNQUFNLHVCQUF1QixDQUFBO0FBQzFFLE9BQU8sYUFBYSxFQUFFLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1RSxPQUFPLE1BQU0sTUFBTSxzQkFBc0IsQ0FBQTtBQVd6QyxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUU7SUFFckIsS0FBSyxFQUFFO1FBQ0wsWUFBWSxFQUFFLFFBQTBEO1FBQ3hFLE9BQU8sRUFBRSxNQUFNO1FBQ2YsUUFBUSxFQUFFLE9BQU87UUFDakIsTUFBTSxFQUFFLFFBQTBEO1FBQ2xFLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO1lBQy9CLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO1NBQ2dCO1FBQ3JDLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN2QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsU0FBUztTQUNnQjtRQUMxQyxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZ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S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2RhdGUtcGlja2VyLXRhYmxlLnN0eWwnXHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbmltcG9ydCBUb3VjaCwgeyBUb3VjaFdyYXBwZXIgfSBmcm9tICcuLi8uLi8uLi9kaXJlY3RpdmVzL3RvdWNoJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IGlzRGF0ZUFsbG93ZWQsIHsgQWxsb3dlZERhdGVGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNEYXRlQWxsb3dlZCdcclxuaW1wb3J0IGlzRGF0ZUluUmFuZ2UsIHsgaXNIb3ZlckFmdGVyU3RhcnREYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGVJblJhbmdlJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGVDaGlsZHJlbiB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xyXG5pbXBvcnQgeyBEYXRlUGlja2VyRm9ybWF0dGVyIH0gZnJvbSAnLi4vdXRpbC9jcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXInXHJcbmltcG9ydCB7IERhdGVFdmVudHMsIERhdGVFdmVudENvbG9ycywgRGF0ZUV2ZW50Q29sb3JWYWx1ZSB9IGZyb20gJy4uL1ZEYXRlUGlja2VyJ1xyXG4vLyBpbXBvcnQgeyBlbWl0IH0gZnJvbSAnY2x1c3Rlcic7XHJcblxyXG50eXBlIENhbGN1bGF0ZVRhYmxlRGF0ZUZ1bmN0aW9uID0gKHY6IG51bWJlcikgPT4gc3RyaW5nXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFRoZW1lYWJsZVxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgZGlyZWN0aXZlczogeyBUb3VjaCB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPEFsbG93ZWREYXRlRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxyXG4gICAgY3VycmVudDogU3RyaW5nLFxyXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgICBmb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0XSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gbnVsbFxyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlRXZlbnRzPixcclxuICAgIGV2ZW50Q29sb3I6IHtcclxuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0LCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiAnd2FybmluZydcclxuICAgIH0gYXMgYW55IGFzIFByb3BWYWxpZGF0b3I8RGF0ZUV2ZW50Q29sb3JzPixcclxuICAgIGhvdmVyOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJydcclxuICAgIH0sXHJcbiAgICBob3Zlckxpbms6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJ1xyXG4gICAgfSxcclxuICAgIGxvY2FsZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdlbi11cydcclxuICAgIH0sXHJcbiAgICBtaW46IFN0cmluZyxcclxuICAgIG1heDogU3RyaW5nLFxyXG4gICAgcmFuZ2U6IEJvb2xlYW4sXHJcbiAgICByZWFkb25seTogQm9vbGVhbixcclxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXHJcbiAgICB0YWJsZURhdGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHZhbHVlOiBbU3RyaW5nLCBBcnJheV1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgaXNSZXZlcnNpbmc6IGZhbHNlLFxyXG4gICAgaG92ZXJpbmc6ICcnXHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZFRyYW5zaXRpb24gKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiAodGhpcy5pc1JldmVyc2luZyA9PT0gIXRoaXMuJHZ1ZXRpZnkucnRsKSA/ICd0YWItcmV2ZXJzZS10cmFuc2l0aW9uJyA6ICd0YWItdHJhbnNpdGlvbidcclxuICAgIH0sXHJcbiAgICBkaXNwbGF5ZWRNb250aCAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLnRhYmxlRGF0ZS5zcGxpdCgnLScpWzFdKSAtIDFcclxuICAgIH0sXHJcbiAgICBkaXNwbGF5ZWRZZWFyICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMudGFibGVEYXRlLnNwbGl0KCctJylbMF0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIHRhYmxlRGF0ZSAobmV3VmFsOiBzdHJpbmcsIG9sZFZhbDogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuaXNSZXZlcnNpbmcgPSBuZXdWYWwgPCBvbGRWYWxcclxuICAgIH0sXHJcbiAgICBob3ZlcmluZyAodmFsdWUpIHtcclxuICAgICAgdGhpcy4kZW1pdCgnaG92ZXInLCB2YWx1ZSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5CdXR0b25DbGFzc2VzIChcclxuICAgICAgaXNBbGxvd2VkOiBib29sZWFuLFxyXG4gICAgICBpc0Zsb2F0aW5nOiBib29sZWFuLFxyXG4gICAgICBpc1NlbGVjdGVkOiBib29sZWFuLFxyXG4gICAgICBpc0N1cnJlbnQ6IGJvb2xlYW4sXHJcbiAgICAgIGlzUmFuZ2U6IGJvb2xlYW4sXHJcbiAgICAgIGlzSG92ZXI6IGJvb2xlYW4sXHJcbiAgICAgIGlzUmFuZ2VTdGFydDogYm9vbGVhbixcclxuICAgICAgaXNSYW5nZUVuZDogYm9vbGVhblxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtYnRuLS1yYW5nZSc6IGlzUmFuZ2UsXHJcbiAgICAgICAgJ3YtYnRuLS1yYW5nZS1ob3Zlcic6IGlzUmFuZ2UgJiYgaXNIb3ZlcixcclxuICAgICAgICAndi1idG4tLXJhbmdlLXN0YXJ0JzogaXNSYW5nZSAmJiBpc1JhbmdlU3RhcnQsXHJcbiAgICAgICAgJ3YtYnRuLS1yYW5nZS1lbmQnOiBpc1JhbmdlICYmIGlzUmFuZ2VFbmQsXHJcbiAgICAgICAgJ3YtYnRuLS1hY3RpdmUnOiBpc1NlbGVjdGVkLFxyXG4gICAgICAgICd2LWJ0bi0tZmxhdCc6ICFpc1NlbGVjdGVkLFxyXG4gICAgICAgICd2LWJ0bi0taWNvbic6IGlzU2VsZWN0ZWQgJiYgaXNBbGxvd2VkICYmIGlzRmxvYXRpbmcsXHJcbiAgICAgICAgJ3YtYnRuLS1mbG9hdGluZyc6IGlzRmxvYXRpbmcsXHJcbiAgICAgICAgJ3YtYnRuLS1kZXByZXNzZWQnOiAhaXNGbG9hdGluZyAmJiBpc1NlbGVjdGVkLFxyXG4gICAgICAgICd2LWJ0bi0tZGlzYWJsZWQnOiAhaXNBbGxvd2VkIHx8ICh0aGlzLmRpc2FibGVkICYmIGlzU2VsZWN0ZWQpLFxyXG4gICAgICAgICd2LWJ0bi0tb3V0bGluZSc6IGlzQ3VycmVudCAmJiAhaXNTZWxlY3RlZCxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2VuQnV0dG9uRXZlbnRzICh2YWx1ZTogc3RyaW5nLCBpc0FsbG93ZWQ6IGJvb2xlYW4sIG1vdXNlRXZlbnRUeXBlOiBzdHJpbmcpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybiB1bmRlZmluZWRcclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgIGlzQWxsb3dlZCAmJiAhdGhpcy5yZWFkb25seSAmJiB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbHVlKVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChgY2xpY2s6JHttb3VzZUV2ZW50VHlwZX1gLCB2YWx1ZSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRibGNsaWNrOiAoKSA9PiB0aGlzLiRlbWl0KGBkYmxjbGljazoke21vdXNlRXZlbnRUeXBlfWAsIHZhbHVlKSxcclxuICAgICAgICBtb3VzZW92ZXI6ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuaG92ZXJpbmcgPSB2YWx1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91c2VsZWF2ZTogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ob3ZlcmluZyA9ICcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2VuQnV0dG9uICh2YWx1ZTogc3RyaW5nLCBpc0Zsb2F0aW5nOiBib29sZWFuLCBtb3VzZUV2ZW50VHlwZTogc3RyaW5nLCBmb3JtYXR0ZXI6IERhdGVQaWNrZXJGb3JtYXR0ZXIpIHtcclxuICAgICAgY29uc3QgaXNBbGxvd2VkID0gaXNEYXRlQWxsb3dlZCh2YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCB0aGlzLmFsbG93ZWREYXRlcylcclxuICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHZhbHVlID09PSB0aGlzLnZhbHVlIHx8IChBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpICYmIHRoaXMudmFsdWUuaW5kZXhPZih2YWx1ZSkgIT09IC0xKVxyXG4gICAgICBjb25zdCBpc0N1cnJlbnQgPSB2YWx1ZSA9PT0gdGhpcy5jdXJyZW50XHJcbiAgICAgIGNvbnN0IGlzSG92ZXIgPSB2YWx1ZSA9PT0gdGhpcy5ob3ZlcmluZ1xyXG4gICAgICBjb25zdCBpc1JhbmdlID0gdGhpcy5yYW5nZVxyXG4gICAgICBjb25zdCBpc1JhbmdlU3RhcnQgPSBpc1JhbmdlICYmIHZhbHVlID09PSB0aGlzLnZhbHVlWzBdXHJcbiAgICAgIGNvbnN0IGlzUmFuZ2VFbmQgPSBpc1JhbmdlICYmIHZhbHVlID09PSB0aGlzLnZhbHVlWzFdXHJcbiAgICAgIGNvbnN0IHNldENvbG9yID0gaXNTZWxlY3RlZCB8fCBpc1JhbmdlID8gdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IgOiB0aGlzLnNldFRleHRDb2xvclxyXG5cclxuICAgICAgLy8gIEFUIC0+IEFkZGVkIHN1cHBvcnQgZm9yIGRhdGUtcmFuZ2VcclxuICAgICAgLy8gIGNvbnN0IGNvbG9yID0gKGlzU2VsZWN0ZWQgfHwgaXNDdXJyZW50KSAmJiAodGhpcy5jb2xvciB8fCAnYWNjZW50JylcclxuICAgICAgY29uc3QgY29sb3IgPSB0aGlzLmdldEZpbmFsQ29sb3IodmFsdWUsIChpc1NlbGVjdGVkIHx8IGlzQ3VycmVudCkgJiYgKHRoaXMuY29sb3IgfHwgJ2FjY2VudCcpKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicsIHNldENvbG9yKGNvbG9yLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWJ0bicsXHJcbiAgICAgICAgJ2NsYXNzJzogdGhpcy5nZW5CdXR0b25DbGFzc2VzKGlzQWxsb3dlZCwgaXNGbG9hdGluZywgaXNTZWxlY3RlZCwgaXNDdXJyZW50LCBpc1JhbmdlLCBpc0hvdmVyLCBpc1JhbmdlU3RhcnQsIGlzUmFuZ2VFbmQpLFxyXG4gICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICB0eXBlOiAnYnV0dG9uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGlzSG92ZXJpbmc6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkb21Qcm9wczoge1xyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQgfHwgIWlzQWxsb3dlZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHRoaXMuZ2VuQnV0dG9uRXZlbnRzKHZhbHVlLCBpc0FsbG93ZWQsIG1vdXNlRXZlbnRUeXBlKVxyXG4gICAgICB9KSwgW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1idG5fX2NvbnRlbnQnXHJcbiAgICAgICAgfSwgW2Zvcm1hdHRlcih2YWx1ZSldKSxcclxuICAgICAgICB0aGlzLmdlbkV2ZW50cyh2YWx1ZSlcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZXRGaW5hbENvbG9yIChkYXRlOiBzdHJpbmcsIGNvbG9yOiBzdHJpbmcgfCBmYWxzZSkge1xyXG4gICAgICBjb25zdCBjb2xvckluUmFuZ2UgPSBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpICYmIGlzRGF0ZUluUmFuZ2UoZGF0ZSwgdGhpcy52YWx1ZSlcclxuICAgICAgY29uc3QgY29sb3JJblJhbmdlSG92ZXIgPSBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpICYmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gMSkgJiYgKHR5cGVvZiB0aGlzLnZhbHVlWzBdID09PSAnc3RyaW5nJykgJiYgaXNIb3ZlckFmdGVyU3RhcnREYXRlKGRhdGUsIHRoaXMudmFsdWVbMF0sIHRoaXMuaG92ZXIgPyB0aGlzLmhvdmVyIDogdGhpcy5ob3ZlckxpbmspXHJcbiAgICAgIGNvbnN0IGNvbG9yUmFuZ2VOb2RlID0gQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSAmJiAodGhpcy52YWx1ZS5pbmRleE9mKGRhdGUpID09PSAwIHx8IGRhdGUgPT09IHRoaXMudmFsdWVbdGhpcy52YWx1ZS5sZW5ndGggLSAxXSlcclxuICAgICAgcmV0dXJuIGNvbG9yUmFuZ2VOb2RlID8gJ2FjY2VudCBkYXJrZW4tNCcgOiBjb2xvckluUmFuZ2UgPyAnYWNjZW50IGRhcmtlbi0yJyA6IGNvbG9ySW5SYW5nZUhvdmVyID8gJ2FjY2VudCBkYXJrZW4tMycgOiBjb2xvclxyXG4gICAgfSxcclxuICAgIGdldEV2ZW50Q29sb3JzIChkYXRlOiBzdHJpbmcpIHtcclxuICAgICAgY29uc3QgYXJyYXlpemUgPSAodjogc3RyaW5nIHwgc3RyaW5nW10pID0+IEFycmF5LmlzQXJyYXkodikgPyB2IDogW3ZdXHJcbiAgICAgIGxldCBldmVudERhdGE6IGJvb2xlYW4gfCBEYXRlRXZlbnRDb2xvclZhbHVlXHJcbiAgICAgIGxldCBldmVudENvbG9yczogc3RyaW5nW10gPSBbXVxyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5ldmVudHMpKSB7XHJcbiAgICAgICAgZXZlbnREYXRhID0gdGhpcy5ldmVudHMuaW5jbHVkZXMoZGF0ZSlcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cyBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgZXZlbnREYXRhID0gdGhpcy5ldmVudHMoZGF0ZSkgfHwgZmFsc2VcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cykge1xyXG4gICAgICAgIGV2ZW50RGF0YSA9IHRoaXMuZXZlbnRzW2RhdGVdIHx8IGZhbHNlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnREYXRhID0gZmFsc2VcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFldmVudERhdGEpIHtcclxuICAgICAgICByZXR1cm4gW11cclxuICAgICAgfSBlbHNlIGlmIChldmVudERhdGEgIT09IHRydWUpIHtcclxuICAgICAgICBldmVudENvbG9ycyA9IGFycmF5aXplKGV2ZW50RGF0YSlcclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5ldmVudENvbG9yID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIGV2ZW50Q29sb3JzID0gW3RoaXMuZXZlbnRDb2xvcl1cclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5ldmVudENvbG9yID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZXZlbnRDb2xvcnMgPSBhcnJheWl6ZSh0aGlzLmV2ZW50Q29sb3IoZGF0ZSkpXHJcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmV2ZW50Q29sb3IpKSB7XHJcbiAgICAgICAgZXZlbnRDb2xvcnMgPSB0aGlzLmV2ZW50Q29sb3JcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudENvbG9ycyA9IGFycmF5aXplKHRoaXMuZXZlbnRDb2xvcltkYXRlXSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGV2ZW50Q29sb3JzLmZpbHRlcih2ID0+IHYpXHJcbiAgICB9LFxyXG4gICAgZ2VuRXZlbnRzIChkYXRlOiBzdHJpbmcpIHtcclxuICAgICAgY29uc3QgZXZlbnRDb2xvcnMgPSB0aGlzLmdldEV2ZW50Q29sb3JzKGRhdGUpXHJcblxyXG4gICAgICByZXR1cm4gZXZlbnRDb2xvcnMubGVuZ3RoID8gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRlLXBpY2tlci10YWJsZV9fZXZlbnRzJ1xyXG4gICAgICB9LCBldmVudENvbG9ycy5tYXAoY29sb3IgPT4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IoY29sb3IpKSkpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIHdoZWVsIChlOiBXaGVlbEV2ZW50LCBjYWxjdWxhdGVUYWJsZURhdGU6IENhbGN1bGF0ZVRhYmxlRGF0ZUZ1bmN0aW9uKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICB0aGlzLiRlbWl0KCd0YWJsZURhdGUnLCBjYWxjdWxhdGVUYWJsZURhdGUoZS5kZWx0YVkpKVxyXG4gICAgfSxcclxuICAgIHRvdWNoICh2YWx1ZTogbnVtYmVyLCBjYWxjdWxhdGVUYWJsZURhdGU6IENhbGN1bGF0ZVRhYmxlRGF0ZUZ1bmN0aW9uKSB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ3RhYmxlRGF0ZScsIGNhbGN1bGF0ZVRhYmxlRGF0ZSh2YWx1ZSkpXHJcbiAgICB9LFxyXG4gICAgZ2VuVGFibGUgKHN0YXRpY0NsYXNzOiBzdHJpbmcsIGNoaWxkcmVuOiBWTm9kZUNoaWxkcmVuLCBjYWxjdWxhdGVUYWJsZURhdGU6IENhbGN1bGF0ZVRhYmxlRGF0ZUZ1bmN0aW9uKSB7XHJcbiAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7IG5hbWU6IHRoaXMuY29tcHV0ZWRUcmFuc2l0aW9uIH1cclxuICAgICAgfSwgW3RoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBrZXk6IHRoaXMudGFibGVEYXRlIH0sIGNoaWxkcmVuKV0pXHJcblxyXG4gICAgICBjb25zdCB0b3VjaERpcmVjdGl2ZSA9IHtcclxuICAgICAgICBuYW1lOiAndG91Y2gnLFxyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICBsZWZ0OiAoZTogVG91Y2hXcmFwcGVyKSA9PiAoZS5vZmZzZXRYIDwgLTE1KSAmJiB0aGlzLnRvdWNoKDEsIGNhbGN1bGF0ZVRhYmxlRGF0ZSksXHJcbiAgICAgICAgICByaWdodDogKGU6IFRvdWNoV3JhcHBlcikgPT4gKGUub2Zmc2V0WCA+IDE1KSAmJiB0aGlzLnRvdWNoKC0xLCBjYWxjdWxhdGVUYWJsZURhdGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzLFxyXG4gICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAndi1kYXRlLXBpY2tlci10YWJsZS0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5zY3JvbGxhYmxlKSA/IHtcclxuICAgICAgICAgIHdoZWVsOiAoZTogV2hlZWxFdmVudCkgPT4gdGhpcy53aGVlbChlLCBjYWxjdWxhdGVUYWJsZURhdGUpXHJcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcclxuICAgICAgICBkaXJlY3RpdmVzOiBbdG91Y2hEaXJlY3RpdmVdXHJcbiAgICAgIH0sIFt0cmFuc2l0aW9uXSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==