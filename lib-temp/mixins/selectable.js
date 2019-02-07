// Components
import VInput from '../components/VInput';
// Mixins
import Rippleable from './rippleable';
import Comparable from './comparable';
/* @vue/component */
export default VInput.extend({
    name: 'selectable',
    mixins: [Rippleable, Comparable],
    model: {
        prop: 'inputValue',
        event: 'change'
    },
    props: {
        color: {
            type: String,
            default: 'accent'
        },
        id: String,
        inputValue: null,
        falseValue: null,
        trueValue: null,
        multiple: {
            type: Boolean,
            default: null
        },
        label: String
    },
    data: vm => ({
        lazyValue: vm.inputValue
    }),
    computed: {
        computedColor() {
            return this.isActive ? this.color : this.validationState;
        },
        isMultiple() {
            return this.multiple === true || (this.multiple === null && Array.isArray(this.internalValue));
        },
        isActive() {
            const value = this.value;
            const input = this.internalValue;
            if (this.isMultiple) {
                if (!Array.isArray(input))
                    return false;
                return input.some(item => this.valueComparator(item, value));
            }
            if (this.trueValue === undefined || this.falseValue === undefined) {
                return value
                    ? this.valueComparator(value, input)
                    : Boolean(input);
            }
            return this.valueComparator(input, this.trueValue);
        },
        isDirty() {
            return this.isActive;
        }
    },
    watch: {
        inputValue(val) {
            this.lazyValue = val;
        }
    },
    methods: {
        genLabel() {
            if (!this.hasLabel)
                return null;
            const label = VInput.options.methods.genLabel.call(this);
            label.data.on = { click: this.onChange };
            return label;
        },
        genInput(type, attrs) {
            return this.$createElement('input', {
                attrs: Object.assign({
                    'aria-label': this.label,
                    'aria-checked': this.isActive.toString(),
                    disabled: this.isDisabled,
                    id: this.id,
                    role: type,
                    type
                }, attrs),
                domProps: {
                    value: this.value,
                    checked: this.isActive
                },
                on: {
                    blur: this.onBlur,
                    change: this.onChange,
                    focus: this.onFocus,
                    keydown: this.onKeydown
                },
                ref: 'input'
            });
        },
        onBlur() {
            this.isFocused = false;
        },
        onChange() {
            if (this.isDisabled)
                return;
            const value = this.value;
            let input = this.internalValue;
            if (this.isMultiple) {
                if (!Array.isArray(input)) {
                    input = [];
                }
                const length = input.length;
                input = input.filter(item => !this.valueComparator(item, value));
                if (input.length === length) {
                    input.push(value);
                }
            }
            else if (this.trueValue !== undefined && this.falseValue !== undefined) {
                input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue;
            }
            else if (value) {
                input = this.valueComparator(input, value) ? null : value;
            }
            else {
                input = !input;
            }
            this.validate(true, input);
            this.internalValue = input;
        },
        onFocus() {
            this.isFocused = true;
        },
        /** @abstract */
        onKeydown(e) { }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvc2VsZWN0YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sc0JBQXNCLENBQUE7QUFFekMsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLGNBQWMsQ0FBQTtBQUNyQyxPQUFPLFVBQVUsTUFBTSxjQUFjLENBQUE7QUFFckMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMzQixJQUFJLEVBQUUsWUFBWTtJQUVsQixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO0lBRWhDLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxZQUFZO1FBQ2xCLEtBQUssRUFBRSxRQUFRO0tBQ2hCO0lBRUQsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsUUFBUTtTQUNsQjtRQUNELEVBQUUsRUFBRSxNQUFNO1FBQ1YsVUFBVSxFQUFFLElBQUk7UUFDaEIsVUFBVSxFQUFFLElBQUk7UUFDaEIsU0FBUyxFQUFFLElBQUk7UUFDZixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxLQUFLLEVBQUUsTUFBTTtLQUNkO0lBRUQsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNYLFNBQVMsRUFBRSxFQUFFLENBQUMsVUFBVTtLQUN6QixDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsYUFBYTtZQUNYLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQTtRQUMxRCxDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLElB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TCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtRQUN2QixDQUFDO1FBQ0QsZ0JBQWdCO1FBQ2hCLFNBQVMsQ0FBRSxDQUFDLElBQUcsQ0FBQztLQUNqQjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9jb21wb25lbnRzL1ZJbnB1dCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgUmlwcGxlYWJsZSBmcm9tICcuL3JpcHBsZWFibGUnXHJcbmltcG9ydCBDb21wYXJhYmxlIGZyb20gJy4vY29tcGFyYWJsZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZJbnB1dC5leHRlbmQoe1xyXG4gIG5hbWU6ICdzZWxlY3RhYmxlJyxcclxuXHJcbiAgbWl4aW5zOiBbUmlwcGxlYWJsZSwgQ29tcGFyYWJsZV0sXHJcblxyXG4gIG1vZGVsOiB7XHJcbiAgICBwcm9wOiAnaW5wdXRWYWx1ZScsXHJcbiAgICBldmVudDogJ2NoYW5nZSdcclxuICB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY29sb3I6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnYWNjZW50J1xyXG4gICAgfSxcclxuICAgIGlkOiBTdHJpbmcsXHJcbiAgICBpbnB1dFZhbHVlOiBudWxsLFxyXG4gICAgZmFsc2VWYWx1ZTogbnVsbCxcclxuICAgIHRydWVWYWx1ZTogbnVsbCxcclxuICAgIG11bHRpcGxlOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICBsYWJlbDogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogdm0gPT4gKHtcclxuICAgIGxhenlWYWx1ZTogdm0uaW5wdXRWYWx1ZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY29tcHV0ZWRDb2xvciAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzQWN0aXZlID8gdGhpcy5jb2xvciA6IHRoaXMudmFsaWRhdGlvblN0YXRlXHJcbiAgICB9LFxyXG4gICAgaXNNdWx0aXBsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlID09PSB0cnVlIHx8ICh0aGlzLm11bHRpcGxlID09PSBudWxsICYmIEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKSlcclxuICAgIH0sXHJcbiAgICBpc0FjdGl2ZSAoKSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy52YWx1ZVxyXG4gICAgICBjb25zdCBpbnB1dCA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxyXG5cclxuICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZSkge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgICByZXR1cm4gaW5wdXQuc29tZShpdGVtID0+IHRoaXMudmFsdWVDb21wYXJhdG9yKGl0ZW0sIHZhbHVlKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMudHJ1ZVZhbHVlID09PSB1bmRlZmluZWQgfHwgdGhpcy5mYWxzZVZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gdmFsdWVcclxuICAgICAgICAgID8gdGhpcy52YWx1ZUNvbXBhcmF0b3IodmFsdWUsIGlucHV0KVxyXG4gICAgICAgICAgOiBCb29sZWFuKGlucHV0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZUNvbXBhcmF0b3IoaW5wdXQsIHRoaXMudHJ1ZVZhbHVlKVxyXG4gICAgfSxcclxuICAgIGlzRGlydHkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbnB1dFZhbHVlICh2YWwpIHtcclxuICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5MYWJlbCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5oYXNMYWJlbCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IGxhYmVsID0gVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5MYWJlbC5jYWxsKHRoaXMpXHJcblxyXG4gICAgICBsYWJlbC5kYXRhLm9uID0geyBjbGljazogdGhpcy5vbkNoYW5nZSB9XHJcblxyXG4gICAgICByZXR1cm4gbGFiZWxcclxuICAgIH0sXHJcbiAgICBnZW5JbnB1dCAodHlwZSwgYXR0cnMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2lucHV0Jywge1xyXG4gICAgICAgIGF0dHJzOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy5sYWJlbCxcclxuICAgICAgICAgICdhcmlhLWNoZWNrZWQnOiB0aGlzLmlzQWN0aXZlLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5pc0Rpc2FibGVkLFxyXG4gICAgICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgICAgICByb2xlOiB0eXBlLFxyXG4gICAgICAgICAgdHlwZVxyXG4gICAgICAgIH0sIGF0dHJzKSxcclxuICAgICAgICBkb21Qcm9wczoge1xyXG4gICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgICAgICBjaGVja2VkOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgYmx1cjogdGhpcy5vbkJsdXIsXHJcbiAgICAgICAgICBjaGFuZ2U6IHRoaXMub25DaGFuZ2UsXHJcbiAgICAgICAgICBmb2N1czogdGhpcy5vbkZvY3VzLFxyXG4gICAgICAgICAga2V5ZG93bjogdGhpcy5vbktleWRvd25cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZjogJ2lucHV0J1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uQmx1ciAoKSB7XHJcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2VcclxuICAgIH0sXHJcbiAgICBvbkNoYW5nZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlXHJcbiAgICAgIGxldCBpbnB1dCA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxyXG5cclxuICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZSkge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcclxuICAgICAgICAgIGlucHV0ID0gW11cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aFxyXG5cclxuICAgICAgICBpbnB1dCA9IGlucHV0LmZpbHRlcihpdGVtID0+ICF0aGlzLnZhbHVlQ29tcGFyYXRvcihpdGVtLCB2YWx1ZSkpXHJcblxyXG4gICAgICAgIGlmIChpbnB1dC5sZW5ndGggPT09IGxlbmd0aCkge1xyXG4gICAgICAgICAgaW5wdXQucHVzaCh2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy50cnVlVmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLmZhbHNlVmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlucHV0ID0gdGhpcy52YWx1ZUNvbXBhcmF0b3IoaW5wdXQsIHRoaXMudHJ1ZVZhbHVlKSA/IHRoaXMuZmFsc2VWYWx1ZSA6IHRoaXMudHJ1ZVZhbHVlXHJcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcclxuICAgICAgICBpbnB1dCA9IHRoaXMudmFsdWVDb21wYXJhdG9yKGlucHV0LCB2YWx1ZSkgPyBudWxsIDogdmFsdWVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbnB1dCA9ICFpbnB1dFxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnZhbGlkYXRlKHRydWUsIGlucHV0KVxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBpbnB1dFxyXG4gICAgfSxcclxuICAgIG9uRm9jdXMgKCkge1xyXG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWVcclxuICAgIH0sXHJcbiAgICAvKiogQGFic3RyYWN0ICovXHJcbiAgICBvbktleWRvd24gKGUpIHt9XHJcbiAgfVxyXG59KVxyXG4iXX0=