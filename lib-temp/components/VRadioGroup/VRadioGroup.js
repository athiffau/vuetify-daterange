// Styles
import '../../stylus/components/_selection-controls.styl';
import '../../stylus/components/_radio-group.styl';
// Components
import VInput from '../VInput';
// Mixins
import Comparable from '../../mixins/comparable';
import { provide as RegistrableProvide } from '../../mixins/registrable';
/* @vue/component */
export default VInput.extend({
    name: 'v-radio-group',
    mixins: [
        Comparable,
        RegistrableProvide('radio')
    ],
    model: {
        prop: 'value',
        event: 'change'
    },
    provide() {
        return {
            radio: this
        };
    },
    props: {
        column: {
            type: Boolean,
            default: true
        },
        height: {
            type: [Number, String],
            default: 'auto'
        },
        mandatory: {
            type: Boolean,
            default: true
        },
        name: String,
        row: Boolean,
        // If no value set on VRadio
        // will match valueComparator
        // force default to null
        value: {
            default: null
        }
    },
    data: () => ({
        internalTabIndex: -1,
        radios: []
    }),
    computed: {
        classes() {
            return {
                'v-input--selection-controls v-input--radio-group': true,
                'v-input--radio-group--column': this.column && !this.row,
                'v-input--radio-group--row': this.row
            };
        }
    },
    watch: {
        hasError: 'setErrorState',
        internalValue: 'setActiveRadio'
    },
    mounted() {
        this.setErrorState(this.hasError);
        this.setActiveRadio();
    },
    methods: {
        genDefaultSlot() {
            return this.$createElement('div', {
                staticClass: 'v-input--radio-group__input',
                attrs: {
                    role: 'radiogroup'
                }
            }, VInput.options.methods.genDefaultSlot.call(this));
        },
        onRadioChange(value) {
            if (this.disabled)
                return;
            this.hasInput = true;
            this.internalValue = value;
            this.setActiveRadio();
            this.$nextTick(this.validate);
        },
        onRadioBlur(e) {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains('v-radio')) {
                this.hasInput = true;
                this.$emit('blur', e);
            }
        },
        register(radio) {
            radio.isActive = this.valueComparator(this.internalValue, radio.value);
            radio.$on('change', this.onRadioChange);
            radio.$on('blur', this.onRadioBlur);
            this.radios.push(radio);
        },
        setErrorState(val) {
            for (let index = this.radios.length; --index >= 0;) {
                this.radios[index].parentError = val;
            }
        },
        setActiveRadio() {
            for (let index = this.radios.length; --index >= 0;) {
                const radio = this.radios[index];
                radio.isActive = this.valueComparator(this.internalValue, radio.value);
            }
        },
        unregister(radio) {
            radio.$off('change', this.onRadioChange);
            radio.$off('blur', this.onRadioBlur);
            const index = this.radios.findIndex(r => r === radio);
            /* istanbul ignore else */
            if (index > -1)
                this.radios.splice(index, 1);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhZGlvR3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUmFkaW9Hcm91cC9WUmFkaW9Hcm91cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrREFBa0QsQ0FBQTtBQUN6RCxPQUFPLDJDQUEyQyxDQUFBO0FBRWxELGFBQWE7QUFDYixPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUE7QUFFOUIsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sRUFDTCxPQUFPLElBQUksa0JBQWtCLEVBQzlCLE1BQU0sMEJBQTBCLENBQUE7QUFFakMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLEVBQUUsZUFBZTtJQUVyQixNQUFNLEVBQUU7UUFDTixVQUFVO1FBQ1Ysa0JBQWtCLENBQUMsT0FBTyxDQUFDO0tBQzVCO0lBRUQsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsUUFBUTtLQUNoQjtJQUVELE9BQU87UUFDTCxPQUFPO1lBQ0wsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxJQUFJLEVBQUUsTUFBTTtRQUNaLEdBQUcsRUFBRSxPQUFPO1FBQ1osNEJBQTRCO1FBQzVCLDZCQUE2QjtRQUM3Qix3QkFBd0I7UUFDeEIsS0FBSyxFQUFFO1lBQ0wsT0FB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QyxhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ3ZFO1FBQ0gsQ0FBQztRQUNELFVBQVUsQ0FBRSxLQUFLO1lBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQ3hDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUVwQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQTtZQUVyRCwwQkFBMEI7WUFDMUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUM5QyxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc2VsZWN0aW9uLWNvbnRyb2xzLnN0eWwnXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3JhZGlvLWdyb3VwLnN0eWwnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWSW5wdXQgZnJvbSAnLi4vVklucHV0J1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb21wYXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb21wYXJhYmxlJ1xyXG5pbXBvcnQge1xyXG4gIHByb3ZpZGUgYXMgUmVnaXN0cmFibGVQcm92aWRlXHJcbn0gZnJvbSAnLi4vLi4vbWl4aW5zL3JlZ2lzdHJhYmxlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVklucHV0LmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtcmFkaW8tZ3JvdXAnLFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIENvbXBhcmFibGUsXHJcbiAgICBSZWdpc3RyYWJsZVByb3ZpZGUoJ3JhZGlvJylcclxuICBdLFxyXG5cclxuICBtb2RlbDoge1xyXG4gICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgIGV2ZW50OiAnY2hhbmdlJ1xyXG4gIH0sXHJcblxyXG4gIHByb3ZpZGUgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmFkaW86IHRoaXNcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY29sdW1uOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogJ2F1dG8nXHJcbiAgICB9LFxyXG4gICAgbWFuZGF0b3J5OiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICByb3c6IEJvb2xlYW4sXHJcbiAgICAvLyBJZiBubyB2YWx1ZSBzZXQgb24gVlJhZGlvXHJcbiAgICAvLyB3aWxsIG1hdGNoIHZhbHVlQ29tcGFyYXRvclxyXG4gICAgLy8gZm9yY2UgZGVmYXVsdCB0byBudWxsXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGludGVybmFsVGFiSW5kZXg6IC0xLFxyXG4gICAgcmFkaW9zOiBbXVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9scyB2LWlucHV0LS1yYWRpby1ncm91cCc6IHRydWUsXHJcbiAgICAgICAgJ3YtaW5wdXQtLXJhZGlvLWdyb3VwLS1jb2x1bW4nOiB0aGlzLmNvbHVtbiAmJiAhdGhpcy5yb3csXHJcbiAgICAgICAgJ3YtaW5wdXQtLXJhZGlvLWdyb3VwLS1yb3cnOiB0aGlzLnJvd1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGhhc0Vycm9yOiAnc2V0RXJyb3JTdGF0ZScsXHJcbiAgICBpbnRlcm5hbFZhbHVlOiAnc2V0QWN0aXZlUmFkaW8nXHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLnNldEVycm9yU3RhdGUodGhpcy5oYXNFcnJvcilcclxuICAgIHRoaXMuc2V0QWN0aXZlUmFkaW8oKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXQtLXJhZGlvLWdyb3VwX19pbnB1dCcsXHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIHJvbGU6ICdyYWRpb2dyb3VwJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5EZWZhdWx0U2xvdC5jYWxsKHRoaXMpKVxyXG4gICAgfSxcclxuICAgIG9uUmFkaW9DaGFuZ2UgKHZhbHVlKSB7XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuaGFzSW5wdXQgPSB0cnVlXHJcbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHZhbHVlXHJcbiAgICAgIHRoaXMuc2V0QWN0aXZlUmFkaW8oKVxyXG4gICAgICB0aGlzLiRuZXh0VGljayh0aGlzLnZhbGlkYXRlKVxyXG4gICAgfSxcclxuICAgIG9uUmFkaW9CbHVyIChlKSB7XHJcbiAgICAgIGlmICghZS5yZWxhdGVkVGFyZ2V0IHx8ICFlLnJlbGF0ZWRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd2LXJhZGlvJykpIHtcclxuICAgICAgICB0aGlzLmhhc0lucHV0ID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2JsdXInLCBlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVnaXN0ZXIgKHJhZGlvKSB7XHJcbiAgICAgIHJhZGlvLmlzQWN0aXZlID0gdGhpcy52YWx1ZUNvbXBhcmF0b3IodGhpcy5pbnRlcm5hbFZhbHVlLCByYWRpby52YWx1ZSlcclxuICAgICAgcmFkaW8uJG9uKCdjaGFuZ2UnLCB0aGlzLm9uUmFkaW9DaGFuZ2UpXHJcbiAgICAgIHJhZGlvLiRvbignYmx1cicsIHRoaXMub25SYWRpb0JsdXIpXHJcbiAgICAgIHRoaXMucmFkaW9zLnB1c2gocmFkaW8pXHJcbiAgICB9LFxyXG4gICAgc2V0RXJyb3JTdGF0ZSAodmFsKSB7XHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gdGhpcy5yYWRpb3MubGVuZ3RoOyAtLWluZGV4ID49IDA7KSB7XHJcbiAgICAgICAgdGhpcy5yYWRpb3NbaW5kZXhdLnBhcmVudEVycm9yID0gdmFsXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRBY3RpdmVSYWRpbyAoKSB7XHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gdGhpcy5yYWRpb3MubGVuZ3RoOyAtLWluZGV4ID49IDA7KSB7XHJcbiAgICAgICAgY29uc3QgcmFkaW8gPSB0aGlzLnJhZGlvc1tpbmRleF1cclxuICAgICAgICByYWRpby5pc0FjdGl2ZSA9IHRoaXMudmFsdWVDb21wYXJhdG9yKHRoaXMuaW50ZXJuYWxWYWx1ZSwgcmFkaW8udmFsdWUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1bnJlZ2lzdGVyIChyYWRpbykge1xyXG4gICAgICByYWRpby4kb2ZmKCdjaGFuZ2UnLCB0aGlzLm9uUmFkaW9DaGFuZ2UpXHJcbiAgICAgIHJhZGlvLiRvZmYoJ2JsdXInLCB0aGlzLm9uUmFkaW9CbHVyKVxyXG5cclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJhZGlvcy5maW5kSW5kZXgociA9PiByID09PSByYWRpbylcclxuXHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIGlmIChpbmRleCA+IC0xKSB0aGlzLnJhZGlvcy5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=