import '../../stylus/components/_time-picker-clock.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
export default mixins(Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-time-picker-clock',
    props: {
        allowedValues: Function,
        disabled: Boolean,
        double: Boolean,
        format: {
            type: Function,
            default: (val) => val
        },
        max: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            required: true
        },
        scrollable: Boolean,
        readonly: Boolean,
        rotate: {
            type: Number,
            default: 0
        },
        step: {
            type: Number,
            default: 1
        },
        value: Number
    },
    data() {
        return {
            inputValue: this.value,
            isDragging: false,
            valueOnMouseDown: null,
            valueOnMouseUp: null
        };
    },
    computed: {
        count() {
            return this.max - this.min + 1;
        },
        degreesPerUnit() {
            return 360 / this.roundCount;
        },
        degrees() {
            return this.degreesPerUnit * Math.PI / 180;
        },
        displayedValue() {
            return this.value == null ? this.min : this.value;
        },
        innerRadiusScale() {
            return 0.62;
        },
        roundCount() {
            return this.double ? (this.count / 2) : this.count;
        }
    },
    watch: {
        value(value) {
            this.inputValue = value;
        }
    },
    methods: {
        wheel(e) {
            e.preventDefault();
            const delta = Math.sign(-e.deltaY || 1);
            let value = this.displayedValue;
            do {
                value = value + delta;
                value = (value - this.min + this.count) % this.count + this.min;
            } while (!this.isAllowed(value) && value !== this.displayedValue);
            if (value !== this.displayedValue) {
                this.update(value);
            }
        },
        isInner(value) {
            return this.double && (value - this.min >= this.roundCount);
        },
        handScale(value) {
            return this.isInner(value) ? this.innerRadiusScale : 1;
        },
        isAllowed(value) {
            return !this.allowedValues || this.allowedValues(value);
        },
        genValues() {
            const children = [];
            for (let value = this.min; value <= this.max; value = value + this.step) {
                const color = value === this.value && (this.color || 'accent');
                children.push(this.$createElement('span', this.setBackgroundColor(color, {
                    staticClass: 'v-time-picker-clock__item',
                    'class': {
                        'v-time-picker-clock__item--active': value === this.displayedValue,
                        'v-time-picker-clock__item--disabled': this.disabled || !this.isAllowed(value)
                    },
                    style: this.getTransform(value),
                    domProps: { innerHTML: `<span>${this.format(value)}</span>` }
                })));
            }
            return children;
        },
        genHand() {
            const scale = `scaleY(${this.handScale(this.displayedValue)})`;
            const angle = this.rotate + this.degreesPerUnit * (this.displayedValue - this.min);
            const color = (this.value != null) && (this.color || 'accent');
            return this.$createElement('div', this.setBackgroundColor(color, {
                staticClass: 'v-time-picker-clock__hand',
                'class': {
                    'v-time-picker-clock__hand--inner': this.isInner(this.value)
                },
                style: {
                    transform: `rotate(${angle}deg) ${scale}`
                }
            }));
        },
        getTransform(i) {
            const { x, y } = this.getPosition(i);
            return {
                left: `${50 + x * 50}%`,
                top: `${50 + y * 50}%`
            };
        },
        getPosition(value) {
            const rotateRadians = this.rotate * Math.PI / 180;
            return {
                x: Math.sin((value - this.min) * this.degrees + rotateRadians) * this.handScale(value),
                y: -Math.cos((value - this.min) * this.degrees + rotateRadians) * this.handScale(value)
            };
        },
        onMouseDown(e) {
            e.preventDefault();
            this.valueOnMouseDown = null;
            this.valueOnMouseUp = null;
            this.isDragging = true;
            this.onDragMove(e);
        },
        onMouseUp() {
            this.isDragging = false;
            if (this.valueOnMouseUp !== null && this.isAllowed(this.valueOnMouseUp)) {
                this.$emit('change', this.valueOnMouseUp);
            }
        },
        onDragMove(e) {
            e.preventDefault();
            if (!this.isDragging && e.type !== 'click')
                return;
            const { width, top, left } = this.$refs.clock.getBoundingClientRect();
            const { width: innerWidth } = this.$refs.innerClock.getBoundingClientRect();
            const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
            const center = { x: width / 2, y: -width / 2 };
            const coords = { x: clientX - left, y: top - clientY };
            const handAngle = Math.round(this.angle(center, coords) - this.rotate + 360) % 360;
            const insideClick = this.double && this.euclidean(center, coords) < (innerWidth + innerWidth * this.innerRadiusScale) / 4;
            const value = (Math.round(handAngle / this.degreesPerUnit) +
                (insideClick ? this.roundCount : 0)) % this.count + this.min;
            // Necessary to fix edge case when selecting left part of the value(s) at 12 o'clock
            let newValue;
            if (handAngle >= (360 - this.degreesPerUnit / 2)) {
                newValue = insideClick ? this.max - this.roundCount + 1 : this.min;
            }
            else {
                newValue = value;
            }
            if (this.isAllowed(value)) {
                if (this.valueOnMouseDown === null) {
                    this.valueOnMouseDown = newValue;
                }
                this.valueOnMouseUp = newValue;
                this.update(newValue);
            }
        },
        update(value) {
            if (this.inputValue !== value) {
                this.inputValue = value;
                this.$emit('input', value);
            }
        },
        euclidean(p0, p1) {
            const dx = p1.x - p0.x;
            const dy = p1.y - p0.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
        angle(center, p1) {
            const value = 2 * Math.atan2(p1.y - center.y - this.euclidean(center, p1), p1.x - center.x);
            return Math.abs(value * 180 / Math.PI);
        }
    },
    render(h) {
        const data = {
            staticClass: 'v-time-picker-clock',
            class: {
                'v-time-picker-clock--indeterminate': this.value == null,
                ...this.themeClasses
            },
            on: (this.readonly || this.disabled) ? undefined : Object.assign({
                mousedown: this.onMouseDown,
                mouseup: this.onMouseUp,
                mouseleave: () => (this.isDragging && this.onMouseUp()),
                touchstart: this.onMouseDown,
                touchend: this.onMouseUp,
                mousemove: this.onDragMove,
                touchmove: this.onDragMove
            }, this.scrollable ? {
                wheel: this.wheel
            } : {}),
            ref: 'clock'
        };
        return h('div', data, [
            h('div', {
                staticClass: 'v-time-picker-clock__inner',
                ref: 'innerClock'
            }, [
                this.genHand(),
                this.genValues()
            ])
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVQaWNrZXJDbG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUaW1lUGlja2VyL1ZUaW1lUGlja2VyQ2xvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxpREFBaUQsQ0FBQTtBQUV4RCxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBZXRELGVBQWUsTUFBTSxDQVFuQixTQUFTLEVBQ1QsU0FBUztBQUNYLG9CQUFvQjtDQUNuQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxxQkFBcUI7SUFFM0IsS0FBSyxFQUFFO1FBQ0wsYUFBYSxFQUFFLFFBQVE7UUFDdkIsUUFBUSxFQUFFLE9BQU87UUFDakIsTUFBTSxFQUFFLE9BQU87UUFDZixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU8sRUFBRSxDQUFDLEdBQW9CLEVBQUUsRUFBRSxDQUFDLEdBQUc7U0FDdkM7UUFDRCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7UUFDRCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2Y7UUFDRCxVQUFVLEVBQUUsT0FBTztRQUNuQixRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxLQUFLLEVBQUUsTUFBTTtLQUNkO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFD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QkFDTCxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUk7Z0JBQ3hELEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckI7WUFDRCxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUMvRCxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVc7Z0JBQzNCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDdkIsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3ZELFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDNUIsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN4QixTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzFCLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVTthQUMzQixFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDbEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ1AsR0FBRyxFQUFFLE9BQU87U0FDYixDQUFBO1FBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtZQUNwQixDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNQLFdBQVcsRUFBRSw0QkFBNEI7Z0JBQ3pDLEdBQUcsRUFBRSxZQUFZO2FBQ2xCLEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDZCxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQ2pCLENBQUM7U0FDSCxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fdGltZS1waWNrZXItY2xvY2suc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCBWdWUsIHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG5pbnRlcmZhY2UgUG9pbnQge1xyXG4gIHg6IG51bWJlclxyXG4gIHk6IG51bWJlclxyXG59XHJcblxyXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIFZ1ZSB7XHJcbiAgJHJlZnM6IHtcclxuICAgIGNsb2NrOiBIVE1MRWxlbWVudFxyXG4gICAgaW5uZXJDbG9jazogSFRNTEVsZW1lbnRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcclxuLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXHJcbiAgRXh0cmFjdFZ1ZTxbXHJcbiAgICB0eXBlb2YgQ29sb3JhYmxlLFxyXG4gICAgdHlwZW9mIFRoZW1lYWJsZVxyXG4gIF0+XHJcbi8qIGVzbGludC1lbmFibGUgaW5kZW50ICovXHJcbj4oXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFRoZW1lYWJsZVxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtdGltZS1waWNrZXItY2xvY2snLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWxsb3dlZFZhbHVlczogRnVuY3Rpb24sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGRvdWJsZTogQm9vbGVhbixcclxuICAgIGZvcm1hdDoge1xyXG4gICAgICB0eXBlOiBGdW5jdGlvbixcclxuICAgICAgZGVmYXVsdDogKHZhbDogc3RyaW5nIHwgbnVtYmVyKSA9PiB2YWxcclxuICAgIH0sXHJcbiAgICBtYXg6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIG1pbjoge1xyXG4gICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgc2Nyb2xsYWJsZTogQm9vbGVhbixcclxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxyXG4gICAgcm90YXRlOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIHN0ZXA6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAxXHJcbiAgICB9LFxyXG4gICAgdmFsdWU6IE51bWJlclxyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaW5wdXRWYWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgIHZhbHVlT25Nb3VzZURvd246IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcclxuICAgICAgdmFsdWVPbk1vdXNlVXA6IG51bGwgYXMgbnVtYmVyIHwgbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb3VudCAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4IC0gdGhpcy5taW4gKyAxXHJcbiAgICB9LFxyXG4gICAgZGVncmVlc1BlclVuaXQgKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiAzNjAgLyB0aGlzLnJvdW5kQ291bnRcclxuICAgIH0sXHJcbiAgICBkZWdyZWVzICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5kZWdyZWVzUGVyVW5pdCAqIE1hdGguUEkgLyAxODBcclxuICAgIH0sXHJcbiAgICBkaXNwbGF5ZWRWYWx1ZSAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT0gbnVsbCA/IHRoaXMubWluIDogdGhpcy52YWx1ZVxyXG4gICAgfSxcclxuICAgIGlubmVyUmFkaXVzU2NhbGUgKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiAwLjYyXHJcbiAgICB9LFxyXG4gICAgcm91bmRDb3VudCAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZG91YmxlID8gKHRoaXMuY291bnQgLyAyKSA6IHRoaXMuY291bnRcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgdmFsdWUgKHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgd2hlZWwgKGU6IFdoZWVsRXZlbnQpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgICBjb25zdCBkZWx0YSA9IE1hdGguc2lnbigtZS5kZWx0YVkgfHwgMSlcclxuICAgICAgbGV0IHZhbHVlID0gdGhpcy5kaXNwbGF5ZWRWYWx1ZVxyXG4gICAgICBkbyB7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSArIGRlbHRhXHJcbiAgICAgICAgdmFsdWUgPSAodmFsdWUgLSB0aGlzLm1pbiArIHRoaXMuY291bnQpICUgdGhpcy5jb3VudCArIHRoaXMubWluXHJcbiAgICAgIH0gd2hpbGUgKCF0aGlzLmlzQWxsb3dlZCh2YWx1ZSkgJiYgdmFsdWUgIT09IHRoaXMuZGlzcGxheWVkVmFsdWUpXHJcblxyXG4gICAgICBpZiAodmFsdWUgIT09IHRoaXMuZGlzcGxheWVkVmFsdWUpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZSh2YWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzSW5uZXIgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZG91YmxlICYmICh2YWx1ZSAtIHRoaXMubWluID49IHRoaXMucm91bmRDb3VudClcclxuICAgIH0sXHJcbiAgICBoYW5kU2NhbGUgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNJbm5lcih2YWx1ZSkgPyB0aGlzLmlubmVyUmFkaXVzU2NhbGUgOiAxXHJcbiAgICB9LFxyXG4gICAgaXNBbGxvd2VkICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5hbGxvd2VkVmFsdWVzIHx8IHRoaXMuYWxsb3dlZFZhbHVlcyh2YWx1ZSlcclxuICAgIH0sXHJcbiAgICBnZW5WYWx1ZXMgKCkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbjogVk5vZGVbXSA9IFtdXHJcblxyXG4gICAgICBmb3IgKGxldCB2YWx1ZSA9IHRoaXMubWluOyB2YWx1ZSA8PSB0aGlzLm1heDsgdmFsdWUgPSB2YWx1ZSArIHRoaXMuc3RlcCkge1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gdmFsdWUgPT09IHRoaXMudmFsdWUgJiYgKHRoaXMuY29sb3IgfHwgJ2FjY2VudCcpXHJcbiAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IoY29sb3IsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lLXBpY2tlci1jbG9ja19faXRlbScsXHJcbiAgICAgICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgICAgICd2LXRpbWUtcGlja2VyLWNsb2NrX19pdGVtLS1hY3RpdmUnOiB2YWx1ZSA9PT0gdGhpcy5kaXNwbGF5ZWRWYWx1ZSxcclxuICAgICAgICAgICAgJ3YtdGltZS1waWNrZXItY2xvY2tfX2l0ZW0tLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5pc0FsbG93ZWQodmFsdWUpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc3R5bGU6IHRoaXMuZ2V0VHJhbnNmb3JtKHZhbHVlKSxcclxuICAgICAgICAgIGRvbVByb3BzOiB7IGlubmVySFRNTDogYDxzcGFuPiR7dGhpcy5mb3JtYXQodmFsdWUpfTwvc3Bhbj5gIH1cclxuICAgICAgICB9KSkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjaGlsZHJlblxyXG4gICAgfSxcclxuICAgIGdlbkhhbmQgKCkge1xyXG4gICAgICBjb25zdCBzY2FsZSA9IGBzY2FsZVkoJHt0aGlzLmhhbmRTY2FsZSh0aGlzLmRpc3BsYXllZFZhbHVlKX0pYFxyXG4gICAgICBjb25zdCBhbmdsZSA9IHRoaXMucm90YXRlICsgdGhpcy5kZWdyZWVzUGVyVW5pdCAqICh0aGlzLmRpc3BsYXllZFZhbHVlIC0gdGhpcy5taW4pXHJcbiAgICAgIGNvbnN0IGNvbG9yID0gKHRoaXMudmFsdWUgIT0gbnVsbCkgJiYgKHRoaXMuY29sb3IgfHwgJ2FjY2VudCcpXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcihjb2xvciwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lLXBpY2tlci1jbG9ja19faGFuZCcsXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgJ3YtdGltZS1waWNrZXItY2xvY2tfX2hhbmQtLWlubmVyJzogdGhpcy5pc0lubmVyKHRoaXMudmFsdWUpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKCR7YW5nbGV9ZGVnKSAke3NjYWxlfWBcclxuICAgICAgICB9XHJcbiAgICAgIH0pKVxyXG4gICAgfSxcclxuICAgIGdldFRyYW5zZm9ybSAoaTogbnVtYmVyKSB7XHJcbiAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5nZXRQb3NpdGlvbihpKVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxlZnQ6IGAkezUwICsgeCAqIDUwfSVgLFxyXG4gICAgICAgIHRvcDogYCR7NTAgKyB5ICogNTB9JWBcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldFBvc2l0aW9uICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgIGNvbnN0IHJvdGF0ZVJhZGlhbnMgPSB0aGlzLnJvdGF0ZSAqIE1hdGguUEkgLyAxODBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBNYXRoLnNpbigodmFsdWUgLSB0aGlzLm1pbikgKiB0aGlzLmRlZ3JlZXMgKyByb3RhdGVSYWRpYW5zKSAqIHRoaXMuaGFuZFNjYWxlKHZhbHVlKSxcclxuICAgICAgICB5OiAtTWF0aC5jb3MoKHZhbHVlIC0gdGhpcy5taW4pICogdGhpcy5kZWdyZWVzICsgcm90YXRlUmFkaWFucykgKiB0aGlzLmhhbmRTY2FsZSh2YWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uTW91c2VEb3duIChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgIHRoaXMudmFsdWVPbk1vdXNlRG93biA9IG51bGxcclxuICAgICAgdGhpcy52YWx1ZU9uTW91c2VVcCA9IG51bGxcclxuICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICB0aGlzLm9uRHJhZ01vdmUoZSlcclxuICAgIH0sXHJcbiAgICBvbk1vdXNlVXAgKCkge1xyXG4gICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgICBpZiAodGhpcy52YWx1ZU9uTW91c2VVcCAhPT0gbnVsbCAmJiB0aGlzLmlzQWxsb3dlZCh0aGlzLnZhbHVlT25Nb3VzZVVwKSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHRoaXMudmFsdWVPbk1vdXNlVXApXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkRyYWdNb3ZlIChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcgJiYgZS50eXBlICE9PSAnY2xpY2snKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHsgd2lkdGgsIHRvcCwgbGVmdCB9ID0gdGhpcy4kcmVmcy5jbG9jay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICBjb25zdCB7IHdpZHRoOiBpbm5lcldpZHRoIH0gPSB0aGlzLiRyZWZzLmlubmVyQ2xvY2suZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgY29uc3QgeyBjbGllbnRYLCBjbGllbnRZIH0gPSAndG91Y2hlcycgaW4gZSA/IGUudG91Y2hlc1swXSA6IGVcclxuICAgICAgY29uc3QgY2VudGVyID0geyB4OiB3aWR0aCAvIDIsIHk6IC13aWR0aCAvIDIgfVxyXG4gICAgICBjb25zdCBjb29yZHMgPSB7IHg6IGNsaWVudFggLSBsZWZ0LCB5OiB0b3AgLSBjbGllbnRZIH1cclxuICAgICAgY29uc3QgaGFuZEFuZ2xlID0gTWF0aC5yb3VuZCh0aGlzLmFuZ2xlKGNlbnRlciwgY29vcmRzKSAtIHRoaXMucm90YXRlICsgMzYwKSAlIDM2MFxyXG4gICAgICBjb25zdCBpbnNpZGVDbGljayA9IHRoaXMuZG91YmxlICYmIHRoaXMuZXVjbGlkZWFuKGNlbnRlciwgY29vcmRzKSA8IChpbm5lcldpZHRoICsgaW5uZXJXaWR0aCAqIHRoaXMuaW5uZXJSYWRpdXNTY2FsZSkgLyA0XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gKFxyXG4gICAgICAgIE1hdGgucm91bmQoaGFuZEFuZ2xlIC8gdGhpcy5kZWdyZWVzUGVyVW5pdCkgK1xyXG4gICAgICAgIChpbnNpZGVDbGljayA/IHRoaXMucm91bmRDb3VudCA6IDApXHJcbiAgICAgICkgJSB0aGlzLmNvdW50ICsgdGhpcy5taW5cclxuXHJcbiAgICAgIC8vIE5lY2Vzc2FyeSB0byBmaXggZWRnZSBjYXNlIHdoZW4gc2VsZWN0aW5nIGxlZnQgcGFydCBvZiB0aGUgdmFsdWUocykgYXQgMTIgbydjbG9ja1xyXG4gICAgICBsZXQgbmV3VmFsdWU6IG51bWJlclxyXG4gICAgICBpZiAoaGFuZEFuZ2xlID49ICgzNjAgLSB0aGlzLmRlZ3JlZXNQZXJVbml0IC8gMikpIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IGluc2lkZUNsaWNrID8gdGhpcy5tYXggLSB0aGlzLnJvdW5kQ291bnQgKyAxIDogdGhpcy5taW5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmlzQWxsb3dlZCh2YWx1ZSkpIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZU9uTW91c2VEb3duID09PSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlT25Nb3VzZURvd24gPSBuZXdWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZhbHVlT25Nb3VzZVVwID0gbmV3VmFsdWVcclxuICAgICAgICB0aGlzLnVwZGF0ZShuZXdWYWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZSAodmFsdWU6IG51bWJlcikge1xyXG4gICAgICBpZiAodGhpcy5pbnB1dFZhbHVlICE9PSB2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGV1Y2xpZGVhbiAocDA6IFBvaW50LCBwMTogUG9pbnQpIHtcclxuICAgICAgY29uc3QgZHggPSBwMS54IC0gcDAueFxyXG4gICAgICBjb25zdCBkeSA9IHAxLnkgLSBwMC55XHJcblxyXG4gICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxyXG4gICAgfSxcclxuICAgIGFuZ2xlIChjZW50ZXI6IFBvaW50LCBwMTogUG9pbnQpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSAyICogTWF0aC5hdGFuMihwMS55IC0gY2VudGVyLnkgLSB0aGlzLmV1Y2xpZGVhbihjZW50ZXIsIHAxKSwgcDEueCAtIGNlbnRlci54KVxyXG4gICAgICByZXR1cm4gTWF0aC5hYnModmFsdWUgKiAxODAgLyBNYXRoLlBJKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lLXBpY2tlci1jbG9jaycsXHJcbiAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgJ3YtdGltZS1waWNrZXItY2xvY2stLWluZGV0ZXJtaW5hdGUnOiB0aGlzLnZhbHVlID09IG51bGwsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfSxcclxuICAgICAgb246ICh0aGlzLnJlYWRvbmx5IHx8IHRoaXMuZGlzYWJsZWQpID8gdW5kZWZpbmVkIDogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgbW91c2Vkb3duOiB0aGlzLm9uTW91c2VEb3duLFxyXG4gICAgICAgIG1vdXNldXA6IHRoaXMub25Nb3VzZVVwLFxyXG4gICAgICAgIG1vdXNlbGVhdmU6ICgpID0+ICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5vbk1vdXNlVXAoKSksXHJcbiAgICAgICAgdG91Y2hzdGFydDogdGhpcy5vbk1vdXNlRG93bixcclxuICAgICAgICB0b3VjaGVuZDogdGhpcy5vbk1vdXNlVXAsXHJcbiAgICAgICAgbW91c2Vtb3ZlOiB0aGlzLm9uRHJhZ01vdmUsXHJcbiAgICAgICAgdG91Y2htb3ZlOiB0aGlzLm9uRHJhZ01vdmVcclxuICAgICAgfSwgdGhpcy5zY3JvbGxhYmxlID8ge1xyXG4gICAgICAgIHdoZWVsOiB0aGlzLndoZWVsXHJcbiAgICAgIH0gOiB7fSksXHJcbiAgICAgIHJlZjogJ2Nsb2NrJ1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCBkYXRhLCBbXHJcbiAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZS1waWNrZXItY2xvY2tfX2lubmVyJyxcclxuICAgICAgICByZWY6ICdpbm5lckNsb2NrJ1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5IYW5kKCksXHJcbiAgICAgICAgdGhpcy5nZW5WYWx1ZXMoKVxyXG4gICAgICBdKVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==