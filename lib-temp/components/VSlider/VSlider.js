// Styles
import '../../stylus/components/_sliders.styl';
// Components
import { VScaleTransition } from '../transitions';
// Extensions
import VInput from '../VInput';
// Directives
import ClickOutside from '../../directives/click-outside';
// Utilities
import { addOnceEventListener, convertToUnit, createRange, keyCodes, deepEqual } from '../../util/helpers';
import { consoleWarn } from '../../util/console';
import Loadable from '../../mixins/loadable';
/* @vue/component */
export default VInput.extend({
    name: 'v-slider',
    directives: { ClickOutside },
    mixins: [Loadable],
    props: {
        alwaysDirty: Boolean,
        inverseLabel: Boolean,
        label: String,
        min: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: 100
        },
        step: {
            type: [Number, String],
            default: 1
        },
        ticks: {
            type: [Boolean, String],
            default: false,
            validator: v => typeof v === 'boolean' || v === 'always'
        },
        tickLabels: {
            type: Array,
            default: () => ([])
        },
        tickSize: {
            type: [Number, String],
            default: 1
        },
        thumbColor: {
            type: String,
            default: null
        },
        thumbLabel: {
            type: [Boolean, String],
            default: null,
            validator: v => typeof v === 'boolean' || v === 'always'
        },
        thumbSize: {
            type: [Number, String],
            default: 32
        },
        trackColor: {
            type: String,
            default: null
        },
        value: [Number, String]
    },
    data: vm => ({
        app: {},
        isActive: false,
        keyPressed: 0,
        lazyValue: typeof vm.value !== 'undefined' ? vm.value : Number(vm.min),
        oldValue: null
    }),
    computed: {
        classes() {
            return {
                'v-input--slider': true,
                'v-input--slider--ticks': this.showTicks,
                'v-input--slider--inverse-label': this.inverseLabel,
                'v-input--slider--ticks-labels': this.tickLabels.length > 0,
                'v-input--slider--thumb-label': this.thumbLabel ||
                    this.$scopedSlots.thumbLabel
            };
        },
        showTicks() {
            return this.tickLabels.length > 0 ||
                (!this.disabled && this.stepNumeric && !!this.ticks);
        },
        showThumbLabel() {
            return !this.disabled && (!!this.thumbLabel ||
                this.thumbLabel === '' ||
                this.$scopedSlots['thumb-label']);
        },
        computedColor() {
            if (this.disabled)
                return null;
            return this.validationState || this.color || 'primary';
        },
        computedTrackColor() {
            return this.disabled ? null : (this.trackColor || null);
        },
        computedThumbColor() {
            if (this.disabled || !this.isDirty)
                return null;
            return this.validationState || this.thumbColor || this.color || 'primary';
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                const { min, max } = this;
                // Round value to ensure the
                // entire slider range can
                // be selected with step
                const value = this.roundValue(Math.min(Math.max(val, min), max));
                if (value === this.lazyValue)
                    return;
                this.lazyValue = value;
                this.$emit('input', value);
                this.validate();
            }
        },
        stepNumeric() {
            return this.step > 0 ? parseFloat(this.step) : 0;
        },
        trackFillStyles() {
            const left = this.$vuetify.rtl ? 'auto' : 0;
            const right = this.$vuetify.rtl ? 0 : 'auto';
            let width = `${this.inputWidth}%`;
            if (this.disabled)
                width = `calc(${this.inputWidth}% - 8px)`;
            return {
                transition: this.trackTransition,
                left,
                right,
                width
            };
        },
        trackPadding() {
            return (this.isActive ||
                this.inputWidth > 0 ||
                this.disabled) ? 0 : 7;
        },
        trackStyles() {
            const trackPadding = this.disabled ? `calc(${this.inputWidth}% + 8px)` : `${this.trackPadding}px`;
            const left = this.$vuetify.rtl ? 'auto' : trackPadding;
            const right = this.$vuetify.rtl ? trackPadding : 'auto';
            const width = this.disabled
                ? `calc(${100 - this.inputWidth}% - 8px)`
                : '100%';
            return {
                transition: this.trackTransition,
                left,
                right,
                width
            };
        },
        tickStyles() {
            const size = Number(this.tickSize);
            return {
                'border-width': `${size}px`,
                'border-radius': size > 1 ? '50%' : null,
                transform: size > 1 ? `translateX(-${size}px) translateY(-${size - 1}px)` : null
            };
        },
        trackTransition() {
            return this.keyPressed >= 2 ? 'none' : '';
        },
        numTicks() {
            return Math.ceil((this.max - this.min) / this.stepNumeric);
        },
        inputWidth() {
            return (this.roundValue(this.internalValue) - this.min) / (this.max - this.min) * 100;
        },
        isDirty() {
            return this.internalValue > this.min ||
                this.alwaysDirty;
        }
    },
    watch: {
        min(val) {
            val > this.internalValue && this.$emit('input', parseFloat(val));
        },
        max(val) {
            val < this.internalValue && this.$emit('input', parseFloat(val));
        },
        value(val) {
            this.internalValue = val;
        }
    },
    mounted() {
        // Without a v-app, iOS does not work with body selectors
        this.app = document.querySelector('[data-app]') ||
            consoleWarn('Missing v-app or a non-body wrapping element with the [data-app] attribute', this);
    },
    methods: {
        genDefaultSlot() {
            const children = [this.genLabel()];
            const slider = this.genSlider();
            this.inverseLabel
                ? children.unshift(slider)
                : children.push(slider);
            children.push(this.genProgress());
            return children;
        },
        genListeners() {
            return {
                blur: this.onBlur,
                click: this.onSliderClick,
                focus: this.onFocus,
                keydown: this.onKeyDown,
                keyup: this.onKeyUp
            };
        },
        genInput() {
            return this.$createElement('input', {
                attrs: {
                    'aria-label': this.label,
                    name: this.name,
                    role: 'slider',
                    tabindex: this.disabled ? -1 : this.$attrs.tabindex,
                    value: this.internalValue,
                    readonly: true,
                    'aria-readonly': String(this.readonly),
                    'aria-valuemin': this.min,
                    'aria-valuemax': this.max,
                    'aria-valuenow': this.internalValue,
                    ...this.$attrs
                },
                on: this.genListeners(),
                ref: 'input'
            });
        },
        genSlider() {
            return this.$createElement('div', {
                staticClass: 'v-slider',
                'class': {
                    'v-slider--is-active': this.isActive
                },
                directives: [{
                        name: 'click-outside',
                        value: this.onBlur
                    }]
            }, this.genChildren());
        },
        genChildren() {
            return [
                this.genInput(),
                this.genTrackContainer(),
                this.genSteps(),
                this.genThumbContainer(this.internalValue, this.inputWidth, this.isFocused || this.isActive, this.onThumbMouseDown)
            ];
        },
        genSteps() {
            if (!this.step || !this.showTicks)
                return null;
            const ticks = createRange(this.numTicks + 1).map(i => {
                const children = [];
                if (this.tickLabels[i]) {
                    children.push(this.$createElement('span', this.tickLabels[i]));
                }
                return this.$createElement('span', {
                    key: i,
                    staticClass: 'v-slider__ticks',
                    class: {
                        'v-slider__ticks--always-show': this.ticks === 'always' ||
                            this.tickLabels.length > 0
                    },
                    style: {
                        ...this.tickStyles,
                        left: `${i * (100 / this.numTicks)}%`
                    }
                }, children);
            });
            return this.$createElement('div', {
                staticClass: 'v-slider__ticks-container'
            }, ticks);
        },
        genThumb() {
            return this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
                staticClass: 'v-slider__thumb'
            }));
        },
        genThumbContainer(value, valueWidth, isActive, onDrag) {
            const children = [this.genThumb()];
            const thumbLabelContent = this.getLabel(value);
            this.showThumbLabel && children.push(this.genThumbLabel(thumbLabelContent));
            return this.$createElement('div', this.setTextColor(this.computedThumbColor, {
                staticClass: 'v-slider__thumb-container',
                'class': {
                    'v-slider__thumb-container--is-active': isActive,
                    'v-slider__thumb-container--show-label': this.showThumbLabel
                },
                style: {
                    transition: this.trackTransition,
                    left: `${this.$vuetify.rtl ? 100 - valueWidth : valueWidth}%`
                },
                on: {
                    touchstart: onDrag,
                    mousedown: onDrag
                }
            }), children);
        },
        genThumbLabel(content) {
            const size = convertToUnit(this.thumbSize);
            return this.$createElement(VScaleTransition, {
                props: { origin: 'bottom center' }
            }, [
                this.$createElement('div', {
                    staticClass: 'v-slider__thumb-label__container',
                    directives: [
                        {
                            name: 'show',
                            value: this.isFocused || this.isActive || this.thumbLabel === 'always'
                        }
                    ]
                }, [
                    this.$createElement('div', this.setBackgroundColor(this.computedThumbColor, {
                        staticClass: 'v-slider__thumb-label',
                        style: {
                            height: size,
                            width: size
                        }
                    }), [content])
                ])
            ]);
        },
        genTrackContainer() {
            const children = [
                this.$createElement('div', this.setBackgroundColor(this.computedTrackColor, {
                    staticClass: 'v-slider__track',
                    style: this.trackStyles
                })),
                this.$createElement('div', this.setBackgroundColor(this.computedColor, {
                    staticClass: 'v-slider__track-fill',
                    style: this.trackFillStyles
                }))
            ];
            return this.$createElement('div', {
                staticClass: 'v-slider__track__container',
                ref: 'track'
            }, children);
        },
        getLabel(value) {
            return this.$scopedSlots['thumb-label']
                ? this.$scopedSlots['thumb-label']({ value })
                : this.$createElement('span', value);
        },
        onBlur(e) {
            if (this.keyPressed === 2)
                return;
            this.isActive = false;
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        onThumbMouseDown(e) {
            this.oldValue = this.internalValue;
            this.keyPressed = 2;
            const options = { passive: true };
            this.isActive = true;
            this.isFocused = false;
            if ('touches' in e) {
                this.app.addEventListener('touchmove', this.onMouseMove, options);
                addOnceEventListener(this.app, 'touchend', this.onSliderMouseUp);
            }
            else {
                this.app.addEventListener('mousemove', this.onMouseMove, options);
                addOnceEventListener(this.app, 'mouseup', this.onSliderMouseUp);
            }
            this.$emit('start', this.internalValue);
        },
        onSliderMouseUp() {
            this.keyPressed = 0;
            const options = { passive: true };
            this.isActive = false;
            this.isFocused = false;
            this.app.removeEventListener('touchmove', this.onMouseMove, options);
            this.app.removeEventListener('mousemove', this.onMouseMove, options);
            this.$emit('end', this.internalValue);
            if (!deepEqual(this.oldValue, this.internalValue)) {
                this.$emit('change', this.internalValue);
            }
        },
        onMouseMove(e) {
            const { value, isInsideTrack } = this.parseMouseMove(e);
            if (isInsideTrack) {
                this.setInternalValue(value);
            }
        },
        onKeyDown(e) {
            if (this.disabled || this.readonly)
                return;
            const value = this.parseKeyDown(e);
            if (value == null)
                return;
            this.setInternalValue(value);
            this.$emit('change', value);
        },
        onKeyUp() {
            this.keyPressed = 0;
        },
        onSliderClick(e) {
            this.isFocused = true;
            this.onMouseMove(e);
            this.$emit('change', this.internalValue);
        },
        parseMouseMove(e) {
            const { left: offsetLeft, width: trackWidth } = this.$refs.track.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            // It is possible for left to be NaN, force to number
            let left = Math.min(Math.max((clientX - offsetLeft) / trackWidth, 0), 1) || 0;
            if (this.$vuetify.rtl)
                left = 1 - left;
            const isInsideTrack = clientX >= offsetLeft - 8 && clientX <= offsetLeft + trackWidth + 8;
            const value = parseFloat(this.min) + left * (this.max - this.min);
            return { value, isInsideTrack };
        },
        parseKeyDown(e, value = this.internalValue) {
            if (this.disabled)
                return;
            const { pageup, pagedown, end, home, left, right, down, up } = keyCodes;
            if (![pageup, pagedown, end, home, left, right, down, up].includes(e.keyCode))
                return;
            e.preventDefault();
            const step = this.stepNumeric || 1;
            const steps = (this.max - this.min) / step;
            if ([left, right, down, up].includes(e.keyCode)) {
                this.keyPressed += 1;
                const increase = this.$vuetify.rtl ? [left, up] : [right, up];
                const direction = increase.includes(e.keyCode) ? 1 : -1;
                const multiplier = e.shiftKey ? 3 : (e.ctrlKey ? 2 : 1);
                value = value + (direction * step * multiplier);
            }
            else if (e.keyCode === home) {
                value = parseFloat(this.min);
            }
            else if (e.keyCode === end) {
                value = parseFloat(this.max);
            }
            else /* if (e.keyCode === keyCodes.pageup || e.keyCode === pagedown) */ {
                // Page up/down
                const direction = e.keyCode === pagedown ? 1 : -1;
                value = value - (direction * step * (steps > 100 ? steps / 10 : 10));
            }
            return value;
        },
        roundValue(value) {
            if (!this.stepNumeric)
                return value;
            // Format input value using the same number
            // of decimals places as in the step prop
            const trimmedStep = this.step.toString().trim();
            const decimals = trimmedStep.indexOf('.') > -1
                ? (trimmedStep.length - trimmedStep.indexOf('.') - 1)
                : 0;
            const offset = this.min % this.stepNumeric;
            const newValue = Math.round((value - offset) / this.stepNumeric) * this.stepNumeric + offset;
            return parseFloat(Math.min(newValue, this.max).toFixed(decimals));
        },
        setInternalValue(value) {
            this.internalValue = value;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNsaWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTbGlkZXIvVlNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx1Q0FBdUMsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFFakQsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUU5QixhQUFhO0FBQ2IsT0FBTyxZQUFZLE1BQU0sZ0NBQWdDLENBQUE7QUFFekQsWUFBWTtBQUNaLE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsYUFBYSxFQUNiLFdBQVcsRUFDWCxRQUFRLEVBQ1IsU0FBUyxFQUNWLE1BQU0sb0JBQW9CLENBQUE7QUFDM0IsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxFQUFFLFVBQVU7SUFFaEIsVUFBVSxFQUFFLEVBQUUsWUFBWSxFQUFFO0lBRTVCLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUVsQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsT0FBTztRQUNwQixZQUFZLEVBQUUsT0FBTztRQUNyQixLQUFLLEVBQUUsTUFBTTtRQUNiLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIs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QUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ0wsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO1lBRTFDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFBO1lBRTVGLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNuRSxDQUFDO1FBQ0QsZ0JBQWdCLENBQUUsS0FBSztZQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtRQUM1QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc2xpZGVycy5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgeyBWU2NhbGVUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXHJcblxyXG4vLyBFeHRlbnNpb25zXHJcbmltcG9ydCBWSW5wdXQgZnJvbSAnLi4vVklucHV0J1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQge1xyXG4gIGFkZE9uY2VFdmVudExpc3RlbmVyLFxyXG4gIGNvbnZlcnRUb1VuaXQsXHJcbiAgY3JlYXRlUmFuZ2UsXHJcbiAga2V5Q29kZXMsXHJcbiAgZGVlcEVxdWFsXHJcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuaW1wb3J0IExvYWRhYmxlIGZyb20gJy4uLy4uL21peGlucy9sb2FkYWJsZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZJbnB1dC5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXNsaWRlcicsXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHsgQ2xpY2tPdXRzaWRlIH0sXHJcblxyXG4gIG1peGluczogW0xvYWRhYmxlXSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsd2F5c0RpcnR5OiBCb29sZWFuLFxyXG4gICAgaW52ZXJzZUxhYmVsOiBCb29sZWFuLFxyXG4gICAgbGFiZWw6IFN0cmluZyxcclxuICAgIG1pbjoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgbWF4OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDEwMFxyXG4gICAgfSxcclxuICAgIHN0ZXA6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMVxyXG4gICAgfSxcclxuICAgIHRpY2tzOiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgICAgdmFsaWRhdG9yOiB2ID0+IHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHwgdiA9PT0gJ2Fsd2F5cydcclxuICAgIH0sXHJcbiAgICB0aWNrTGFiZWxzOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pXHJcbiAgICB9LFxyXG4gICAgdGlja1NpemU6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMVxyXG4gICAgfSxcclxuICAgIHRodW1iQ29sb3I6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgdGh1bWJMYWJlbDoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgICAgdmFsaWRhdG9yOiB2ID0+IHR5cGVvZiB2ID09PSAnYm9vbGVhbicgfHwgdiA9PT0gJ2Fsd2F5cydcclxuICAgIH0sXHJcbiAgICB0aHVtYlNpemU6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMzJcclxuICAgIH0sXHJcbiAgICB0cmFja0NvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIHZhbHVlOiBbTnVtYmVyLCBTdHJpbmddXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogdm0gPT4gKHtcclxuICAgIGFwcDoge30sXHJcbiAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICBrZXlQcmVzc2VkOiAwLFxyXG4gICAgbGF6eVZhbHVlOiB0eXBlb2Ygdm0udmFsdWUgIT09ICd1bmRlZmluZWQnID8gdm0udmFsdWUgOiBOdW1iZXIodm0ubWluKSxcclxuICAgIG9sZFZhbHVlOiBudWxsXHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1pbnB1dC0tc2xpZGVyJzogdHJ1ZSxcclxuICAgICAgICAndi1pbnB1dC0tc2xpZGVyLS10aWNrcyc6IHRoaXMuc2hvd1RpY2tzLFxyXG4gICAgICAgICd2LWlucHV0LS1zbGlkZXItLWludmVyc2UtbGFiZWwnOiB0aGlzLmludmVyc2VMYWJlbCxcclxuICAgICAgICAndi1pbnB1dC0tc2xpZGVyLS10aWNrcy1sYWJlbHMnOiB0aGlzLnRpY2tMYWJlbHMubGVuZ3RoID4gMCxcclxuICAgICAgICAndi1pbnB1dC0tc2xpZGVyLS10aHVtYi1sYWJlbCc6IHRoaXMudGh1bWJMYWJlbCB8fFxyXG4gICAgICAgICAgdGhpcy4kc2NvcGVkU2xvdHMudGh1bWJMYWJlbFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2hvd1RpY2tzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudGlja0xhYmVscy5sZW5ndGggPiAwIHx8XHJcbiAgICAgICAgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuc3RlcE51bWVyaWMgJiYgISF0aGlzLnRpY2tzKVxyXG4gICAgfSxcclxuICAgIHNob3dUaHVtYkxhYmVsICgpIHtcclxuICAgICAgcmV0dXJuICF0aGlzLmRpc2FibGVkICYmIChcclxuICAgICAgICAhIXRoaXMudGh1bWJMYWJlbCB8fFxyXG4gICAgICAgIHRoaXMudGh1bWJMYWJlbCA9PT0gJycgfHxcclxuICAgICAgICB0aGlzLiRzY29wZWRTbG90c1sndGh1bWItbGFiZWwnXVxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRDb2xvciAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm4gbnVsbFxyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0aW9uU3RhdGUgfHwgdGhpcy5jb2xvciB8fCAncHJpbWFyeSdcclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFRyYWNrQ29sb3IgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/IG51bGwgOiAodGhpcy50cmFja0NvbG9yIHx8IG51bGwpXHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRUaHVtYkNvbG9yICgpIHtcclxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaXNEaXJ0eSkgcmV0dXJuIG51bGxcclxuICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGlvblN0YXRlIHx8IHRoaXMudGh1bWJDb2xvciB8fCB0aGlzLmNvbG9yIHx8ICdwcmltYXJ5J1xyXG4gICAgfSxcclxuICAgIGludGVybmFsVmFsdWU6IHtcclxuICAgICAgZ2V0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sYXp5VmFsdWVcclxuICAgICAgfSxcclxuICAgICAgc2V0ICh2YWwpIHtcclxuICAgICAgICBjb25zdCB7IG1pbiwgbWF4IH0gPSB0aGlzXHJcblxyXG4gICAgICAgIC8vIFJvdW5kIHZhbHVlIHRvIGVuc3VyZSB0aGVcclxuICAgICAgICAvLyBlbnRpcmUgc2xpZGVyIHJhbmdlIGNhblxyXG4gICAgICAgIC8vIGJlIHNlbGVjdGVkIHdpdGggc3RlcFxyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yb3VuZFZhbHVlKE1hdGgubWluKE1hdGgubWF4KHZhbCwgbWluKSwgbWF4KSlcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLmxhenlWYWx1ZSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdmFsdWVcclxuXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSlcclxuICAgICAgICB0aGlzLnZhbGlkYXRlKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0ZXBOdW1lcmljICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3RlcCA+IDAgPyBwYXJzZUZsb2F0KHRoaXMuc3RlcCkgOiAwXHJcbiAgICB9LFxyXG4gICAgdHJhY2tGaWxsU3R5bGVzICgpIHtcclxuICAgICAgY29uc3QgbGVmdCA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gJ2F1dG8nIDogMFxyXG4gICAgICBjb25zdCByaWdodCA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gMCA6ICdhdXRvJ1xyXG4gICAgICBsZXQgd2lkdGggPSBgJHt0aGlzLmlucHV0V2lkdGh9JWBcclxuXHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB3aWR0aCA9IGBjYWxjKCR7dGhpcy5pbnB1dFdpZHRofSUgLSA4cHgpYFxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnRyYWNrVHJhbnNpdGlvbixcclxuICAgICAgICBsZWZ0LFxyXG4gICAgICAgIHJpZ2h0LFxyXG4gICAgICAgIHdpZHRoXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0cmFja1BhZGRpbmcgKCkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgfHxcclxuICAgICAgICB0aGlzLmlucHV0V2lkdGggPiAwIHx8XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZFxyXG4gICAgICApID8gMCA6IDdcclxuICAgIH0sXHJcbiAgICB0cmFja1N0eWxlcyAoKSB7XHJcbiAgICAgIGNvbnN0IHRyYWNrUGFkZGluZyA9IHRoaXMuZGlzYWJsZWQgPyBgY2FsYygke3RoaXMuaW5wdXRXaWR0aH0lICsgOHB4KWAgOiBgJHt0aGlzLnRyYWNrUGFkZGluZ31weGBcclxuICAgICAgY29uc3QgbGVmdCA9IHRoaXMuJHZ1ZXRpZnkucnRsID8gJ2F1dG8nIDogdHJhY2tQYWRkaW5nXHJcbiAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy4kdnVldGlmeS5ydGwgPyB0cmFja1BhZGRpbmcgOiAnYXV0bydcclxuICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmRpc2FibGVkXHJcbiAgICAgICAgPyBgY2FsYygkezEwMCAtIHRoaXMuaW5wdXRXaWR0aH0lIC0gOHB4KWBcclxuICAgICAgICA6ICcxMDAlJ1xyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0cmFuc2l0aW9uOiB0aGlzLnRyYWNrVHJhbnNpdGlvbixcclxuICAgICAgICBsZWZ0LFxyXG4gICAgICAgIHJpZ2h0LFxyXG4gICAgICAgIHdpZHRoXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0aWNrU3R5bGVzICgpIHtcclxuICAgICAgY29uc3Qgc2l6ZSA9IE51bWJlcih0aGlzLnRpY2tTaXplKVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAnYm9yZGVyLXdpZHRoJzogYCR7c2l6ZX1weGAsXHJcbiAgICAgICAgJ2JvcmRlci1yYWRpdXMnOiBzaXplID4gMSA/ICc1MCUnIDogbnVsbCxcclxuICAgICAgICB0cmFuc2Zvcm06IHNpemUgPiAxID8gYHRyYW5zbGF0ZVgoLSR7c2l6ZX1weCkgdHJhbnNsYXRlWSgtJHtzaXplIC0gMX1weClgIDogbnVsbFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdHJhY2tUcmFuc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMua2V5UHJlc3NlZCA+PSAyID8gJ25vbmUnIDogJydcclxuICAgIH0sXHJcbiAgICBudW1UaWNrcyAoKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLmNlaWwoKHRoaXMubWF4IC0gdGhpcy5taW4pIC8gdGhpcy5zdGVwTnVtZXJpYylcclxuICAgIH0sXHJcbiAgICBpbnB1dFdpZHRoICgpIHtcclxuICAgICAgcmV0dXJuICh0aGlzLnJvdW5kVmFsdWUodGhpcy5pbnRlcm5hbFZhbHVlKSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKSAqIDEwMFxyXG4gICAgfSxcclxuICAgIGlzRGlydHkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFZhbHVlID4gdGhpcy5taW4gfHxcclxuICAgICAgICB0aGlzLmFsd2F5c0RpcnR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIG1pbiAodmFsKSB7XHJcbiAgICAgIHZhbCA+IHRoaXMuaW50ZXJuYWxWYWx1ZSAmJiB0aGlzLiRlbWl0KCdpbnB1dCcsIHBhcnNlRmxvYXQodmFsKSlcclxuICAgIH0sXHJcbiAgICBtYXggKHZhbCkge1xyXG4gICAgICB2YWwgPCB0aGlzLmludGVybmFsVmFsdWUgJiYgdGhpcy4kZW1pdCgnaW5wdXQnLCBwYXJzZUZsb2F0KHZhbCkpXHJcbiAgICB9LFxyXG4gICAgdmFsdWUgKHZhbCkge1xyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIC8vIFdpdGhvdXQgYSB2LWFwcCwgaU9TIGRvZXMgbm90IHdvcmsgd2l0aCBib2R5IHNlbGVjdG9yc1xyXG4gICAgdGhpcy5hcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hcHBdJykgfHxcclxuICAgICAgY29uc29sZVdhcm4oJ01pc3Npbmcgdi1hcHAgb3IgYSBub24tYm9keSB3cmFwcGluZyBlbGVtZW50IHdpdGggdGhlIFtkYXRhLWFwcF0gYXR0cmlidXRlJywgdGhpcylcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuTGFiZWwoKV1cclxuICAgICAgY29uc3Qgc2xpZGVyID0gdGhpcy5nZW5TbGlkZXIoKVxyXG4gICAgICB0aGlzLmludmVyc2VMYWJlbFxyXG4gICAgICAgID8gY2hpbGRyZW4udW5zaGlmdChzbGlkZXIpXHJcbiAgICAgICAgOiBjaGlsZHJlbi5wdXNoKHNsaWRlcilcclxuXHJcbiAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5nZW5Qcm9ncmVzcygpKVxyXG5cclxuICAgICAgcmV0dXJuIGNoaWxkcmVuXHJcbiAgICB9LFxyXG4gICAgZ2VuTGlzdGVuZXJzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBibHVyOiB0aGlzLm9uQmx1cixcclxuICAgICAgICBjbGljazogdGhpcy5vblNsaWRlckNsaWNrLFxyXG4gICAgICAgIGZvY3VzOiB0aGlzLm9uRm9jdXMsXHJcbiAgICAgICAga2V5ZG93bjogdGhpcy5vbktleURvd24sXHJcbiAgICAgICAga2V5dXA6IHRoaXMub25LZXlVcFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2VuSW5wdXQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7XHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy5sYWJlbCxcclxuICAgICAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgICAgIHJvbGU6ICdzbGlkZXInLFxyXG4gICAgICAgICAgdGFiaW5kZXg6IHRoaXMuZGlzYWJsZWQgPyAtMSA6IHRoaXMuJGF0dHJzLnRhYmluZGV4LFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMuaW50ZXJuYWxWYWx1ZSxcclxuICAgICAgICAgIHJlYWRvbmx5OiB0cnVlLFxyXG4gICAgICAgICAgJ2FyaWEtcmVhZG9ubHknOiBTdHJpbmcodGhpcy5yZWFkb25seSksXHJcbiAgICAgICAgICAnYXJpYS12YWx1ZW1pbic6IHRoaXMubWluLFxyXG4gICAgICAgICAgJ2FyaWEtdmFsdWVtYXgnOiB0aGlzLm1heCxcclxuICAgICAgICAgICdhcmlhLXZhbHVlbm93JzogdGhpcy5pbnRlcm5hbFZhbHVlLFxyXG4gICAgICAgICAgLi4udGhpcy4kYXR0cnNcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB0aGlzLmdlbkxpc3RlbmVycygpLFxyXG4gICAgICAgIHJlZjogJ2lucHV0J1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblNsaWRlciAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNsaWRlcicsXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgJ3Ytc2xpZGVyLS1pcy1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMub25CbHVyXHJcbiAgICAgICAgfV1cclxuICAgICAgfSwgdGhpcy5nZW5DaGlsZHJlbigpKVxyXG4gICAgfSxcclxuICAgIGdlbkNoaWxkcmVuICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB0aGlzLmdlbklucHV0KCksXHJcbiAgICAgICAgdGhpcy5nZW5UcmFja0NvbnRhaW5lcigpLFxyXG4gICAgICAgIHRoaXMuZ2VuU3RlcHMoKSxcclxuICAgICAgICB0aGlzLmdlblRodW1iQ29udGFpbmVyKFxyXG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlLFxyXG4gICAgICAgICAgdGhpcy5pbnB1dFdpZHRoLFxyXG4gICAgICAgICAgdGhpcy5pc0ZvY3VzZWQgfHwgdGhpcy5pc0FjdGl2ZSxcclxuICAgICAgICAgIHRoaXMub25UaHVtYk1vdXNlRG93blxyXG4gICAgICAgIClcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGdlblN0ZXBzICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnN0ZXAgfHwgIXRoaXMuc2hvd1RpY2tzKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgY29uc3QgdGlja3MgPSBjcmVhdGVSYW5nZSh0aGlzLm51bVRpY2tzICsgMSkubWFwKGkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudGlja0xhYmVsc1tpXSkge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywgdGhpcy50aWNrTGFiZWxzW2ldKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywge1xyXG4gICAgICAgICAga2V5OiBpLFxyXG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNsaWRlcl9fdGlja3MnLFxyXG4gICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgJ3Ytc2xpZGVyX190aWNrcy0tYWx3YXlzLXNob3cnOiB0aGlzLnRpY2tzID09PSAnYWx3YXlzJyB8fFxyXG4gICAgICAgICAgICAgIHRoaXMudGlja0xhYmVscy5sZW5ndGggPiAwXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgICAgLi4udGhpcy50aWNrU3R5bGVzLFxyXG4gICAgICAgICAgICBsZWZ0OiBgJHtpICogKDEwMCAvIHRoaXMubnVtVGlja3MpfSVgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgY2hpbGRyZW4pXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RpY2tzLWNvbnRhaW5lcidcclxuICAgICAgfSwgdGlja3MpXHJcbiAgICB9LFxyXG4gICAgZ2VuVGh1bWIgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb21wdXRlZFRodW1iQ29sb3IsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190aHVtYidcclxuICAgICAgfSkpXHJcbiAgICB9LFxyXG4gICAgZ2VuVGh1bWJDb250YWluZXIgKHZhbHVlLCB2YWx1ZVdpZHRoLCBpc0FjdGl2ZSwgb25EcmFnKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuVGh1bWIoKV1cclxuXHJcbiAgICAgIGNvbnN0IHRodW1iTGFiZWxDb250ZW50ID0gdGhpcy5nZXRMYWJlbCh2YWx1ZSlcclxuICAgICAgdGhpcy5zaG93VGh1bWJMYWJlbCAmJiBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuVGh1bWJMYWJlbCh0aHVtYkxhYmVsQ29udGVudCkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb21wdXRlZFRodW1iQ29sb3IsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190aHVtYi1jb250YWluZXInLFxyXG4gICAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAgICd2LXNsaWRlcl9fdGh1bWItY29udGFpbmVyLS1pcy1hY3RpdmUnOiBpc0FjdGl2ZSxcclxuICAgICAgICAgICd2LXNsaWRlcl9fdGh1bWItY29udGFpbmVyLS1zaG93LWxhYmVsJzogdGhpcy5zaG93VGh1bWJMYWJlbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIHRyYW5zaXRpb246IHRoaXMudHJhY2tUcmFuc2l0aW9uLFxyXG4gICAgICAgICAgbGVmdDogYCR7dGhpcy4kdnVldGlmeS5ydGwgPyAxMDAgLSB2YWx1ZVdpZHRoIDogdmFsdWVXaWR0aH0lYFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIHRvdWNoc3RhcnQ6IG9uRHJhZyxcclxuICAgICAgICAgIG1vdXNlZG93bjogb25EcmFnXHJcbiAgICAgICAgfVxyXG4gICAgICB9KSwgY2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgZ2VuVGh1bWJMYWJlbCAoY29udGVudCkge1xyXG4gICAgICBjb25zdCBzaXplID0gY29udmVydFRvVW5pdCh0aGlzLnRodW1iU2l6ZSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZTY2FsZVRyYW5zaXRpb24sIHtcclxuICAgICAgICBwcm9wczogeyBvcmlnaW46ICdib3R0b20gY2VudGVyJyB9XHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190aHVtYi1sYWJlbF9fY29udGFpbmVyJyxcclxuICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6ICdzaG93JyxcclxuICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5pc0ZvY3VzZWQgfHwgdGhpcy5pc0FjdGl2ZSB8fCB0aGlzLnRodW1iTGFiZWwgPT09ICdhbHdheXMnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LCBbXHJcbiAgICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkVGh1bWJDb2xvciwge1xyXG4gICAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190aHVtYi1sYWJlbCcsXHJcbiAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaXplLFxyXG4gICAgICAgICAgICAgIHdpZHRoOiBzaXplXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pLCBbY29udGVudF0pXHJcbiAgICAgICAgXSlcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5UcmFja0NvbnRhaW5lciAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29tcHV0ZWRUcmFja0NvbG9yLCB7XHJcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2xpZGVyX190cmFjaycsXHJcbiAgICAgICAgICBzdHlsZTogdGhpcy50cmFja1N0eWxlc1xyXG4gICAgICAgIH0pKSxcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbGlkZXJfX3RyYWNrLWZpbGwnLFxyXG4gICAgICAgICAgc3R5bGU6IHRoaXMudHJhY2tGaWxsU3R5bGVzXHJcbiAgICAgICAgfSkpXHJcbiAgICAgIF1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNsaWRlcl9fdHJhY2tfX2NvbnRhaW5lcicsXHJcbiAgICAgICAgcmVmOiAndHJhY2snXHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIGdldExhYmVsICh2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kc2NvcGVkU2xvdHNbJ3RodW1iLWxhYmVsJ11cclxuICAgICAgICA/IHRoaXMuJHNjb3BlZFNsb3RzWyd0aHVtYi1sYWJlbCddKHsgdmFsdWUgfSlcclxuICAgICAgICA6IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB2YWx1ZSlcclxuICAgIH0sXHJcbiAgICBvbkJsdXIgKGUpIHtcclxuICAgICAgaWYgKHRoaXMua2V5UHJlc3NlZCA9PT0gMikgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxyXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZSlcclxuICAgIH0sXHJcbiAgICBvbkZvY3VzIChlKSB7XHJcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxyXG4gICAgICB0aGlzLiRlbWl0KCdmb2N1cycsIGUpXHJcbiAgICB9LFxyXG4gICAgb25UaHVtYk1vdXNlRG93biAoZSkge1xyXG4gICAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy5pbnRlcm5hbFZhbHVlXHJcbiAgICAgIHRoaXMua2V5UHJlc3NlZCA9IDJcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgcGFzc2l2ZTogdHJ1ZSB9XHJcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlXHJcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2VcclxuXHJcbiAgICAgIGlmICgndG91Y2hlcycgaW4gZSkge1xyXG4gICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG9wdGlvbnMpXHJcbiAgICAgICAgYWRkT25jZUV2ZW50TGlzdGVuZXIodGhpcy5hcHAsICd0b3VjaGVuZCcsIHRoaXMub25TbGlkZXJNb3VzZVVwKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG9wdGlvbnMpXHJcbiAgICAgICAgYWRkT25jZUV2ZW50TGlzdGVuZXIodGhpcy5hcHAsICdtb3VzZXVwJywgdGhpcy5vblNsaWRlck1vdXNlVXApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGVtaXQoJ3N0YXJ0JywgdGhpcy5pbnRlcm5hbFZhbHVlKVxyXG4gICAgfSxcclxuICAgIG9uU2xpZGVyTW91c2VVcCAoKSB7XHJcbiAgICAgIHRoaXMua2V5UHJlc3NlZCA9IDBcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgcGFzc2l2ZTogdHJ1ZSB9XHJcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlXHJcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG9wdGlvbnMpXHJcbiAgICAgIHRoaXMuYXBwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUsIG9wdGlvbnMpXHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdlbmQnLCB0aGlzLmludGVybmFsVmFsdWUpXHJcbiAgICAgIGlmICghZGVlcEVxdWFsKHRoaXMub2xkVmFsdWUsIHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB0aGlzLmludGVybmFsVmFsdWUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbk1vdXNlTW92ZSAoZSkge1xyXG4gICAgICBjb25zdCB7IHZhbHVlLCBpc0luc2lkZVRyYWNrIH0gPSB0aGlzLnBhcnNlTW91c2VNb3ZlKGUpXHJcblxyXG4gICAgICBpZiAoaXNJbnNpZGVUcmFjaykge1xyXG4gICAgICAgIHRoaXMuc2V0SW50ZXJuYWxWYWx1ZSh2YWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uS2V5RG93biAoZSkge1xyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCB0aGlzLnJlYWRvbmx5KSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5wYXJzZUtleURvd24oZSlcclxuXHJcbiAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuc2V0SW50ZXJuYWxWYWx1ZSh2YWx1ZSlcclxuICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdmFsdWUpXHJcbiAgICB9LFxyXG4gICAgb25LZXlVcCAoKSB7XHJcbiAgICAgIHRoaXMua2V5UHJlc3NlZCA9IDBcclxuICAgIH0sXHJcbiAgICBvblNsaWRlckNsaWNrIChlKSB7XHJcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxyXG4gICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHRoaXMuaW50ZXJuYWxWYWx1ZSlcclxuICAgIH0sXHJcbiAgICBwYXJzZU1vdXNlTW92ZSAoZSkge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgbGVmdDogb2Zmc2V0TGVmdCxcclxuICAgICAgICB3aWR0aDogdHJhY2tXaWR0aFxyXG4gICAgICB9ID0gdGhpcy4kcmVmcy50cmFjay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICBjb25zdCBjbGllbnRYID0gJ3RvdWNoZXMnIGluIGUgPyBlLnRvdWNoZXNbMF0uY2xpZW50WCA6IGUuY2xpZW50WFxyXG4gICAgICAvLyBJdCBpcyBwb3NzaWJsZSBmb3IgbGVmdCB0byBiZSBOYU4sIGZvcmNlIHRvIG51bWJlclxyXG4gICAgICBsZXQgbGVmdCA9IE1hdGgubWluKE1hdGgubWF4KChjbGllbnRYIC0gb2Zmc2V0TGVmdCkgLyB0cmFja1dpZHRoLCAwKSwgMSkgfHwgMFxyXG5cclxuICAgICAgaWYgKHRoaXMuJHZ1ZXRpZnkucnRsKSBsZWZ0ID0gMSAtIGxlZnRcclxuXHJcbiAgICAgIGNvbnN0IGlzSW5zaWRlVHJhY2sgPSBjbGllbnRYID49IG9mZnNldExlZnQgLSA4ICYmIGNsaWVudFggPD0gb2Zmc2V0TGVmdCArIHRyYWNrV2lkdGggKyA4XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdCh0aGlzLm1pbikgKyBsZWZ0ICogKHRoaXMubWF4IC0gdGhpcy5taW4pXHJcblxyXG4gICAgICByZXR1cm4geyB2YWx1ZSwgaXNJbnNpZGVUcmFjayB9XHJcbiAgICB9LFxyXG4gICAgcGFyc2VLZXlEb3duIChlLCB2YWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZSkge1xyXG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCB7IHBhZ2V1cCwgcGFnZWRvd24sIGVuZCwgaG9tZSwgbGVmdCwgcmlnaHQsIGRvd24sIHVwIH0gPSBrZXlDb2Rlc1xyXG5cclxuICAgICAgaWYgKCFbcGFnZXVwLCBwYWdlZG93biwgZW5kLCBob21lLCBsZWZ0LCByaWdodCwgZG93biwgdXBdLmluY2x1ZGVzKGUua2V5Q29kZSkpIHJldHVyblxyXG5cclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGNvbnN0IHN0ZXAgPSB0aGlzLnN0ZXBOdW1lcmljIHx8IDFcclxuICAgICAgY29uc3Qgc3RlcHMgPSAodGhpcy5tYXggLSB0aGlzLm1pbikgLyBzdGVwXHJcbiAgICAgIGlmIChbbGVmdCwgcmlnaHQsIGRvd24sIHVwXS5pbmNsdWRlcyhlLmtleUNvZGUpKSB7XHJcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkICs9IDFcclxuXHJcbiAgICAgICAgY29uc3QgaW5jcmVhc2UgPSB0aGlzLiR2dWV0aWZ5LnJ0bCA/IFtsZWZ0LCB1cF0gOiBbcmlnaHQsIHVwXVxyXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGluY3JlYXNlLmluY2x1ZGVzKGUua2V5Q29kZSkgPyAxIDogLTFcclxuICAgICAgICBjb25zdCBtdWx0aXBsaWVyID0gZS5zaGlmdEtleSA/IDMgOiAoZS5jdHJsS2V5ID8gMiA6IDEpXHJcblxyXG4gICAgICAgIHZhbHVlID0gdmFsdWUgKyAoZGlyZWN0aW9uICogc3RlcCAqIG11bHRpcGxpZXIpXHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSBob21lKSB7XHJcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMubWluKVxyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gZW5kKSB7XHJcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHRoaXMubWF4KVxyXG4gICAgICB9IGVsc2UgLyogaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMucGFnZXVwIHx8IGUua2V5Q29kZSA9PT0gcGFnZWRvd24pICovIHtcclxuICAgICAgICAvLyBQYWdlIHVwL2Rvd25cclxuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBlLmtleUNvZGUgPT09IHBhZ2Vkb3duID8gMSA6IC0xXHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSAtIChkaXJlY3Rpb24gKiBzdGVwICogKHN0ZXBzID4gMTAwID8gc3RlcHMgLyAxMCA6IDEwKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICB9LFxyXG4gICAgcm91bmRWYWx1ZSAodmFsdWUpIHtcclxuICAgICAgaWYgKCF0aGlzLnN0ZXBOdW1lcmljKSByZXR1cm4gdmFsdWVcclxuICAgICAgLy8gRm9ybWF0IGlucHV0IHZhbHVlIHVzaW5nIHRoZSBzYW1lIG51bWJlclxyXG4gICAgICAvLyBvZiBkZWNpbWFscyBwbGFjZXMgYXMgaW4gdGhlIHN0ZXAgcHJvcFxyXG4gICAgICBjb25zdCB0cmltbWVkU3RlcCA9IHRoaXMuc3RlcC50b1N0cmluZygpLnRyaW0oKVxyXG4gICAgICBjb25zdCBkZWNpbWFscyA9IHRyaW1tZWRTdGVwLmluZGV4T2YoJy4nKSA+IC0xXHJcbiAgICAgICAgPyAodHJpbW1lZFN0ZXAubGVuZ3RoIC0gdHJpbW1lZFN0ZXAuaW5kZXhPZignLicpIC0gMSlcclxuICAgICAgICA6IDBcclxuICAgICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5taW4gJSB0aGlzLnN0ZXBOdW1lcmljXHJcblxyXG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IE1hdGgucm91bmQoKHZhbHVlIC0gb2Zmc2V0KSAvIHRoaXMuc3RlcE51bWVyaWMpICogdGhpcy5zdGVwTnVtZXJpYyArIG9mZnNldFxyXG5cclxuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoTWF0aC5taW4obmV3VmFsdWUsIHRoaXMubWF4KS50b0ZpeGVkKGRlY2ltYWxzKSlcclxuICAgIH0sXHJcbiAgICBzZXRJbnRlcm5hbFZhbHVlICh2YWx1ZSkge1xyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWx1ZVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19