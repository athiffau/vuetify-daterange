// Styles
import '../../stylus/components/_steppers.styl';
// Mixins
import { provide as RegistrableProvide } from '../../mixins/registrable';
import Themeable from '../../mixins/themeable';
// Util
import mixins from '../../util/mixins';
export default mixins(RegistrableProvide('stepper'), Themeable
/* @vue/component */
).extend({
    name: 'v-stepper',
    provide() {
        return {
            stepClick: this.stepClick,
            isVertical: this.vertical
        };
    },
    props: {
        nonLinear: Boolean,
        altLabels: Boolean,
        vertical: Boolean,
        value: [Number, String]
    },
    data() {
        return {
            inputValue: null,
            isBooted: false,
            steps: [],
            content: [],
            isReverse: false
        };
    },
    computed: {
        classes() {
            return {
                'v-stepper': true,
                'v-stepper--is-booted': this.isBooted,
                'v-stepper--vertical': this.vertical,
                'v-stepper--alt-labels': this.altLabels,
                'v-stepper--non-linear': this.nonLinear,
                ...this.themeClasses
            };
        }
    },
    watch: {
        inputValue(val, prev) {
            this.isReverse = Number(val) < Number(prev);
            for (let index = this.steps.length; --index >= 0;) {
                this.steps[index].toggle(this.inputValue);
            }
            for (let index = this.content.length; --index >= 0;) {
                this.content[index].toggle(this.inputValue, this.isReverse);
            }
            this.$emit('input', this.inputValue);
            prev && (this.isBooted = true);
        },
        value() {
            this.$nextTick(() => (this.inputValue = this.value));
        }
    },
    mounted() {
        this.inputValue = this.value || this.steps[0].step || 1;
    },
    methods: {
        register(item) {
            if (item.$options.name === 'v-stepper-step') {
                this.steps.push(item);
            }
            else if (item.$options.name === 'v-stepper-content') {
                item.isVertical = this.vertical;
                this.content.push(item);
            }
        },
        unregister(item) {
            if (item.$options.name === 'v-stepper-step') {
                this.steps = this.steps.filter((i) => i !== item);
            }
            else if (item.$options.name === 'v-stepper-content') {
                item.isVertical = this.vertical;
                this.content = this.content.filter((i) => i !== item);
            }
        },
        stepClick(step) {
            this.$nextTick(() => (this.inputValue = step));
        }
    },
    render(h) {
        return h('div', {
            'class': this.classes
        }, this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN0ZXBwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WU3RlcHBlci9WU3RlcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQU0vQyxTQUFTO0FBQ1QsT0FBTyxFQUFFLE9BQU8sSUFBSSxrQkFBa0IsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBQ3hFLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLE9BQU87QUFDUCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQVF0QyxlQUFlLE1BQU0sQ0FDbkIsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEVBQzdCLFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsV0FBVztJQUVqQixPQUFPO1FBQ0wsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDMUIsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLEVBQUU7UUFDTCxTQUFTLEVBQUUsT0FBTztRQUNsQixTQUFTLEVBQUUsT0FBTztRQUNsQixRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0tBQ3hCO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCxVQUFVLEVBQUUsSUFBVztZQUN2QixRQUFRLEVBQUUsS0FBSztZQUNmLEtBQUssRUFBRSxFQUE0QjtZQUNuQyxPQUFPLEVBQUUsRUFBK0I7WUFDeEMsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxXQUFXLEVBQUUsSUFBSTtnQkFDakIsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3JDLHFCQUFxQixFQUFFLElBQUks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LENBQUE7UUFDaEQsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3pCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc3RlcHBlcnMuc3R5bCdcclxuXHJcbi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZTdGVwcGVyU3RlcCBmcm9tICcuL1ZTdGVwcGVyU3RlcCdcclxuaW1wb3J0IFZTdGVwcGVyQ29udGVudCBmcm9tICcuL1ZTdGVwcGVyQ29udGVudCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgeyBwcm92aWRlIGFzIFJlZ2lzdHJhYmxlUHJvdmlkZSB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbFxyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG50eXBlIFZTdGVwcGVyU3RlcEluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWU3RlcHBlclN0ZXA+XHJcbnR5cGUgVlN0ZXBwZXJDb250ZW50SW5zdGFuY2UgPSBJbnN0YW5jZVR5cGU8dHlwZW9mIFZTdGVwcGVyQ29udGVudD5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBSZWdpc3RyYWJsZVByb3ZpZGUoJ3N0ZXBwZXInKSxcclxuICBUaGVtZWFibGVcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXN0ZXBwZXInLFxyXG5cclxuICBwcm92aWRlICgpOiBvYmplY3Qge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RlcENsaWNrOiB0aGlzLnN0ZXBDbGljayxcclxuICAgICAgaXNWZXJ0aWNhbDogdGhpcy52ZXJ0aWNhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBub25MaW5lYXI6IEJvb2xlYW4sXHJcbiAgICBhbHRMYWJlbHM6IEJvb2xlYW4sXHJcbiAgICB2ZXJ0aWNhbDogQm9vbGVhbixcclxuICAgIHZhbHVlOiBbTnVtYmVyLCBTdHJpbmddXHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbnB1dFZhbHVlOiBudWxsIGFzIGFueSxcclxuICAgICAgaXNCb290ZWQ6IGZhbHNlLFxyXG4gICAgICBzdGVwczogW10gYXMgVlN0ZXBwZXJTdGVwSW5zdGFuY2VbXSxcclxuICAgICAgY29udGVudDogW10gYXMgVlN0ZXBwZXJDb250ZW50SW5zdGFuY2VbXSxcclxuICAgICAgaXNSZXZlcnNlOiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXN0ZXBwZXInOiB0cnVlLFxyXG4gICAgICAgICd2LXN0ZXBwZXItLWlzLWJvb3RlZCc6IHRoaXMuaXNCb290ZWQsXHJcbiAgICAgICAgJ3Ytc3RlcHBlci0tdmVydGljYWwnOiB0aGlzLnZlcnRpY2FsLFxyXG4gICAgICAgICd2LXN0ZXBwZXItLWFsdC1sYWJlbHMnOiB0aGlzLmFsdExhYmVscyxcclxuICAgICAgICAndi1zdGVwcGVyLS1ub24tbGluZWFyJzogdGhpcy5ub25MaW5lYXIsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbnB1dFZhbHVlICh2YWwsIHByZXYpIHtcclxuICAgICAgdGhpcy5pc1JldmVyc2UgPSBOdW1iZXIodmFsKSA8IE51bWJlcihwcmV2KVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IHRoaXMuc3RlcHMubGVuZ3RoOyAtLWluZGV4ID49IDA7KSB7XHJcbiAgICAgICAgdGhpcy5zdGVwc1tpbmRleF0udG9nZ2xlKHRoaXMuaW5wdXRWYWx1ZSlcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IHRoaXMuY29udGVudC5sZW5ndGg7IC0taW5kZXggPj0gMDspIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnRbaW5kZXhdLnRvZ2dsZSh0aGlzLmlucHV0VmFsdWUsIHRoaXMuaXNSZXZlcnNlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaW5wdXRWYWx1ZSlcclxuICAgICAgcHJldiAmJiAodGhpcy5pc0Jvb3RlZCA9IHRydWUpXHJcbiAgICB9LFxyXG4gICAgdmFsdWUgKCkge1xyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiAodGhpcy5pbnB1dFZhbHVlID0gdGhpcy52YWx1ZSkpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLmlucHV0VmFsdWUgPSB0aGlzLnZhbHVlIHx8IHRoaXMuc3RlcHNbMF0uc3RlcCB8fCAxXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVnaXN0ZXIgKGl0ZW06IFZTdGVwcGVyU3RlcEluc3RhbmNlIHwgVlN0ZXBwZXJDb250ZW50SW5zdGFuY2UpIHtcclxuICAgICAgaWYgKGl0ZW0uJG9wdGlvbnMubmFtZSA9PT0gJ3Ytc3RlcHBlci1zdGVwJykge1xyXG4gICAgICAgIHRoaXMuc3RlcHMucHVzaChpdGVtIGFzIFZTdGVwcGVyU3RlcEluc3RhbmNlKVxyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uJG9wdGlvbnMubmFtZSA9PT0gJ3Ytc3RlcHBlci1jb250ZW50Jykge1xyXG4gICAgICAgIChpdGVtIGFzIFZTdGVwcGVyQ29udGVudEluc3RhbmNlKS5pc1ZlcnRpY2FsID0gdGhpcy52ZXJ0aWNhbFxyXG4gICAgICAgIHRoaXMuY29udGVudC5wdXNoKGl0ZW0gYXMgVlN0ZXBwZXJDb250ZW50SW5zdGFuY2UpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1bnJlZ2lzdGVyIChpdGVtOiBWU3RlcHBlclN0ZXBJbnN0YW5jZSB8IFZTdGVwcGVyQ29udGVudEluc3RhbmNlKSB7XHJcbiAgICAgIGlmIChpdGVtLiRvcHRpb25zLm5hbWUgPT09ICd2LXN0ZXBwZXItc3RlcCcpIHtcclxuICAgICAgICB0aGlzLnN0ZXBzID0gdGhpcy5zdGVwcy5maWx0ZXIoKGk6IFZTdGVwcGVyU3RlcEluc3RhbmNlKSA9PiBpICE9PSBpdGVtKVxyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0uJG9wdGlvbnMubmFtZSA9PT0gJ3Ytc3RlcHBlci1jb250ZW50Jykge1xyXG4gICAgICAgIChpdGVtIGFzIFZTdGVwcGVyQ29udGVudEluc3RhbmNlKS5pc1ZlcnRpY2FsID0gdGhpcy52ZXJ0aWNhbFxyXG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuY29udGVudC5maWx0ZXIoKGk6IFZTdGVwcGVyQ29udGVudEluc3RhbmNlKSA9PiBpICE9PSBpdGVtKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3RlcENsaWNrIChzdGVwOiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gKHRoaXMuaW5wdXRWYWx1ZSA9IHN0ZXApKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3Nlc1xyXG4gICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICB9XHJcbn0pXHJcbiJdfQ==