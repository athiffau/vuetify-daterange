// Styles
import '../../stylus/components/_text-fields.styl';
// Extensions
import VInput from '../VInput';
// Components
import VCounter from '../VCounter';
import VLabel from '../VLabel';
// Mixins
import Maskable from '../../mixins/maskable';
import Loadable from '../../mixins/loadable';
// Directives
import Ripple from '../../directives/ripple';
// Utilities
import { keyCodes } from '../../util/helpers';
import { deprecate } from '../../util/console';
const dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];
/* @vue/component */
export default VInput.extend({
    name: 'v-text-field',
    directives: { Ripple },
    mixins: [Maskable, Loadable],
    inheritAttrs: false,
    props: {
        appendOuterIcon: String,
        /** @deprecated */
        appendOuterIconCb: Function,
        autofocus: Boolean,
        box: Boolean,
        browserAutocomplete: String,
        clearable: Boolean,
        clearIcon: {
            type: String,
            default: '$vuetify.icons.clear'
        },
        clearIconCb: Function,
        color: {
            type: String,
            default: 'primary'
        },
        counter: [Boolean, Number, String],
        flat: Boolean,
        fullWidth: Boolean,
        label: String,
        outline: Boolean,
        placeholder: String,
        prefix: String,
        prependInnerIcon: String,
        /** @deprecated */
        prependInnerIconCb: Function,
        reverse: Boolean,
        singleLine: Boolean,
        solo: Boolean,
        soloInverted: Boolean,
        suffix: String,
        type: {
            type: String,
            default: 'text'
        }
    },
    data: () => ({
        badInput: false,
        initialValue: null,
        internalChange: false,
        isClearing: false
    }),
    computed: {
        classes() {
            return {
                'v-text-field': true,
                'v-text-field--full-width': this.fullWidth,
                'v-text-field--prefix': this.prefix,
                'v-text-field--single-line': this.isSingle,
                'v-text-field--solo': this.isSolo,
                'v-text-field--solo-inverted': this.soloInverted,
                'v-text-field--solo-flat': this.flat,
                'v-text-field--box': this.box,
                'v-text-field--enclosed': this.isEnclosed,
                'v-text-field--reverse': this.reverse,
                'v-text-field--outline': this.hasOutline,
                'v-text-field--placeholder': this.placeholder
            };
        },
        counterValue() {
            return (this.internalValue || '').toString().length;
        },
        directivesInput() {
            return [];
        },
        // TODO: Deprecate
        hasOutline() {
            return this.outline || this.textarea;
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                if (this.mask) {
                    this.lazyValue = this.unmaskText(this.maskText(this.unmaskText(val)));
                    this.setSelectionRange();
                }
                else {
                    this.lazyValue = val;
                    this.$emit('input', this.lazyValue);
                }
            }
        },
        isDirty() {
            return (this.lazyValue != null &&
                this.lazyValue.toString().length > 0) ||
                this.badInput;
        },
        isEnclosed() {
            return (this.box ||
                this.isSolo ||
                this.hasOutline ||
                this.fullWidth);
        },
        isLabelActive() {
            return this.isDirty || dirtyTypes.includes(this.type);
        },
        isSingle() {
            return this.isSolo || this.singleLine;
        },
        isSolo() {
            return this.solo || this.soloInverted;
        },
        labelPosition() {
            const offset = (this.prefix && !this.labelValue) ? this.prefixWidth : 0;
            return (!this.$vuetify.rtl !== !this.reverse) ? {
                left: 'auto',
                right: offset
            } : {
                left: offset,
                right: 'auto'
            };
        },
        showLabel() {
            return this.hasLabel && (!this.isSingle || (!this.isLabelActive && !this.placeholder && !this.prefixLabel));
        },
        labelValue() {
            return !this.isSingle &&
                Boolean(this.isFocused || this.isLabelActive || this.placeholder || this.prefixLabel);
        },
        prefixWidth() {
            if (!this.prefix && !this.$refs.prefix)
                return;
            return this.$refs.prefix.offsetWidth;
        },
        prefixLabel() {
            return (this.prefix && !this.value);
        }
    },
    watch: {
        isFocused(val) {
            // Sets validationState from validatable
            this.hasColor = val;
            if (val) {
                this.initialValue = this.lazyValue;
            }
            else if (this.initialValue !== this.lazyValue) {
                this.$emit('change', this.lazyValue);
            }
        },
        value(val) {
            if (this.mask && !this.internalChange) {
                const masked = this.maskText(this.unmaskText(val));
                this.lazyValue = this.unmaskText(masked);
                // Emit when the externally set value was modified internally
                String(val) !== this.lazyValue && this.$nextTick(() => {
                    this.$refs.input.value = masked;
                    this.$emit('input', this.lazyValue);
                });
            }
            else
                this.lazyValue = val;
        }
    },
    mounted() {
        this.autofocus && this.onFocus();
    },
    methods: {
        /** @public */
        focus() {
            this.onFocus();
        },
        /** @public */
        blur() {
            this.$refs.input ? this.$refs.input.blur() : this.onBlur();
        },
        clearableCallback() {
            this.internalValue = null;
            this.$nextTick(() => this.$refs.input.focus());
        },
        genAppendSlot() {
            const slot = [];
            if (this.$slots['append-outer']) {
                slot.push(this.$slots['append-outer']);
            }
            else if (this.appendOuterIcon) {
                slot.push(this.genIcon('appendOuter'));
            }
            return this.genSlot('append', 'outer', slot);
        },
        genPrependInnerSlot() {
            const slot = [];
            if (this.$slots['prepend-inner']) {
                slot.push(this.$slots['prepend-inner']);
            }
            else if (this.prependInnerIcon) {
                slot.push(this.genIcon('prependInner'));
            }
            return this.genSlot('prepend', 'inner', slot);
        },
        genIconSlot() {
            const slot = [];
            if (this.$slots['append']) {
                slot.push(this.$slots['append']);
            }
            else if (this.appendIcon) {
                slot.push(this.genIcon('append'));
            }
            return this.genSlot('append', 'inner', slot);
        },
        genInputSlot() {
            const input = VInput.options.methods.genInputSlot.call(this);
            const prepend = this.genPrependInnerSlot();
            prepend && input.children.unshift(prepend);
            return input;
        },
        genClearIcon() {
            if (!this.clearable)
                return null;
            const icon = !this.isDirty
                ? false
                : 'clear';
            if (this.clearIconCb)
                deprecate(':clear-icon-cb', '@click:clear', this);
            return this.genSlot('append', 'inner', [
                this.genIcon(icon, (!this.$listeners['click:clear'] && this.clearIconCb) || this.clearableCallback, false)
            ]);
        },
        genCounter() {
            if (this.counter === false || this.counter == null)
                return null;
            const max = this.counter === true ? this.$attrs.maxlength : this.counter;
            return this.$createElement(VCounter, {
                props: {
                    dark: this.dark,
                    light: this.light,
                    max,
                    value: this.counterValue
                }
            });
        },
        genDefaultSlot() {
            return [
                this.genTextFieldSlot(),
                this.genClearIcon(),
                this.genIconSlot(),
                this.genProgress()
            ];
        },
        genLabel() {
            if (!this.showLabel)
                return null;
            const data = {
                props: {
                    absolute: true,
                    color: this.validationState,
                    dark: this.dark,
                    disabled: this.disabled,
                    focused: !this.isSingle && (this.isFocused || !!this.validationState),
                    left: this.labelPosition.left,
                    light: this.light,
                    right: this.labelPosition.right,
                    value: this.labelValue
                }
            };
            if (this.$attrs.id)
                data.props.for = this.$attrs.id;
            return this.$createElement(VLabel, data, this.$slots.label || this.label);
        },
        genInput() {
            const listeners = Object.assign({}, this.$listeners);
            delete listeners['change']; // Change should not be bound externally
            const data = {
                style: {},
                domProps: {
                    value: this.maskText(this.lazyValue)
                },
                attrs: {
                    'aria-label': (!this.$attrs || !this.$attrs.id) && this.label,
                    ...this.$attrs,
                    autofocus: this.autofocus,
                    disabled: this.disabled,
                    readonly: this.readonly,
                    type: this.type
                },
                on: Object.assign(listeners, {
                    blur: this.onBlur,
                    input: this.onInput,
                    focus: this.onFocus,
                    keydown: this.onKeyDown
                }),
                ref: 'input'
            };
            if (this.placeholder)
                data.attrs.placeholder = this.placeholder;
            if (this.mask)
                data.attrs.maxlength = this.masked.length;
            if (this.browserAutocomplete)
                data.attrs.autocomplete = this.browserAutocomplete;
            return this.$createElement('input', data);
        },
        genMessages() {
            if (this.hideDetails)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-text-field__details'
            }, [
                VInput.options.methods.genMessages.call(this),
                this.genCounter()
            ]);
        },
        genTextFieldSlot() {
            return this.$createElement('div', {
                staticClass: 'v-text-field__slot'
            }, [
                this.genLabel(),
                this.prefix ? this.genAffix('prefix') : null,
                this.genInput(),
                this.suffix ? this.genAffix('suffix') : null
            ]);
        },
        genAffix(type) {
            return this.$createElement('div', {
                'class': `v-text-field__${type}`,
                ref: type
            }, this[type]);
        },
        onBlur(e) {
            this.isFocused = false;
            // Reset internalChange state
            // to allow external change
            // to persist
            this.internalChange = false;
            this.$emit('blur', e);
        },
        onClick() {
            if (this.isFocused || this.disabled)
                return;
            this.$refs.input.focus();
        },
        onFocus(e) {
            if (!this.$refs.input)
                return;
            if (document.activeElement !== this.$refs.input) {
                return this.$refs.input.focus();
            }
            if (!this.isFocused) {
                this.isFocused = true;
                this.$emit('focus', e);
            }
        },
        onInput(e) {
            this.internalChange = true;
            this.mask && this.resetSelections(e.target);
            this.internalValue = e.target.value;
            this.badInput = e.target.validity && e.target.validity.badInput;
        },
        onKeyDown(e) {
            this.internalChange = true;
            if (e.keyCode === keyCodes.enter)
                this.$emit('change', this.internalValue);
            this.$emit('keydown', e);
        },
        onMouseDown(e) {
            // Prevent input from being blurred
            if (e.target !== this.$refs.input) {
                e.preventDefault();
                e.stopPropagation();
            }
            VInput.options.methods.onMouseDown.call(this, e);
        },
        onMouseUp(e) {
            if (this.hasMouseDown)
                this.focus();
            VInput.options.methods.onMouseUp.call(this, e);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRleHRGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUZXh0RmllbGQvVlRleHRGaWVsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQUVsRCxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLGFBQWE7QUFDYixPQUFPLFFBQVEsTUFBTSxhQUFhLENBQUE7QUFDbEMsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sRUFDTCxRQUFRLEVBQ1QsTUFBTSxvQkFBb0IsQ0FBQTtBQUMzQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFOUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBRXZGLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxFQUFFLGNBQWM7SUFFcEIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBRXRCLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7SUFFNUIsWUFBWSxFQUFFLEtBQUs7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsZUFBZSxFQUFFLE1BQU07UUFDdkIsa0JBQWtCO1FBQ2xCLGlCQUFpQixFQUFFLFFBQVE7UUFDM0IsU0FBUyxFQUFFLE9BQU87UUFDbEIsR0FBRyxFQUFFLE9BQU87UUFDWixtQkFBbUIsRUFBRSxNQUFNO1FBQzNC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LENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL190ZXh0LWZpZWxkcy5zdHlsJ1xyXG5cclxuLy8gRXh0ZW5zaW9uc1xyXG5pbXBvcnQgVklucHV0IGZyb20gJy4uL1ZJbnB1dCdcclxuXHJcbi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZDb3VudGVyIGZyb20gJy4uL1ZDb3VudGVyJ1xyXG5pbXBvcnQgVkxhYmVsIGZyb20gJy4uL1ZMYWJlbCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgTWFza2FibGUgZnJvbSAnLi4vLi4vbWl4aW5zL21hc2thYmxlJ1xyXG5pbXBvcnQgTG9hZGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2xvYWRhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgUmlwcGxlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xyXG5cclxuLy8gVXRpbGl0aWVzXHJcbmltcG9ydCB7XHJcbiAga2V5Q29kZXNcclxufSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcbmltcG9ydCB7IGRlcHJlY2F0ZSB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbmNvbnN0IGRpcnR5VHlwZXMgPSBbJ2NvbG9yJywgJ2ZpbGUnLCAndGltZScsICdkYXRlJywgJ2RhdGV0aW1lLWxvY2FsJywgJ3dlZWsnLCAnbW9udGgnXVxyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVklucHV0LmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtdGV4dC1maWVsZCcsXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHsgUmlwcGxlIH0sXHJcblxyXG4gIG1peGluczogW01hc2thYmxlLCBMb2FkYWJsZV0sXHJcblxyXG4gIGluaGVyaXRBdHRyczogZmFsc2UsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhcHBlbmRPdXRlckljb246IFN0cmluZyxcclxuICAgIC8qKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgYXBwZW5kT3V0ZXJJY29uQ2I6IEZ1bmN0aW9uLFxyXG4gICAgYXV0b2ZvY3VzOiBCb29sZWFuLFxyXG4gICAgYm94OiBCb29sZWFuLFxyXG4gICAgYnJvd3NlckF1dG9jb21wbGV0ZTogU3RyaW5nLFxyXG4gICAgY2xlYXJhYmxlOiBCb29sZWFuLFxyXG4gICAgY2xlYXJJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmNsZWFyJ1xyXG4gICAgfSxcclxuICAgIGNsZWFySWNvbkNiOiBGdW5jdGlvbixcclxuICAgIGNvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnknXHJcbiAgICB9LFxyXG4gICAgY291bnRlcjogW0Jvb2xlYW4sIE51bWJlciwgU3RyaW5nXSxcclxuICAgIGZsYXQ6IEJvb2xlYW4sXHJcbiAgICBmdWxsV2lkdGg6IEJvb2xlYW4sXHJcbiAgICBsYWJlbDogU3RyaW5nLFxyXG4gICAgb3V0bGluZTogQm9vbGVhbixcclxuICAgIHBsYWNlaG9sZGVyOiBTdHJpbmcsXHJcbiAgICBwcmVmaXg6IFN0cmluZyxcclxuICAgIHByZXBlbmRJbm5lckljb246IFN0cmluZyxcclxuICAgIC8qKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgcHJlcGVuZElubmVySWNvbkNiOiBGdW5jdGlvbixcclxuICAgIHJldmVyc2U6IEJvb2xlYW4sXHJcbiAgICBzaW5nbGVMaW5lOiBCb29sZWFuLFxyXG4gICAgc29sbzogQm9vbGVhbixcclxuICAgIHNvbG9JbnZlcnRlZDogQm9vbGVhbixcclxuICAgIHN1ZmZpeDogU3RyaW5nLFxyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBiYWRJbnB1dDogZmFsc2UsXHJcbiAgICBpbml0aWFsVmFsdWU6IG51bGwsXHJcbiAgICBpbnRlcm5hbENoYW5nZTogZmFsc2UsXHJcbiAgICBpc0NsZWFyaW5nOiBmYWxzZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZCc6IHRydWUsXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tZnVsbC13aWR0aCc6IHRoaXMuZnVsbFdpZHRoLFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLXByZWZpeCc6IHRoaXMucHJlZml4LFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLXNpbmdsZS1saW5lJzogdGhpcy5pc1NpbmdsZSxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zb2xvJzogdGhpcy5pc1NvbG8sXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tc29sby1pbnZlcnRlZCc6IHRoaXMuc29sb0ludmVydGVkLFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLXNvbG8tZmxhdCc6IHRoaXMuZmxhdCxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1ib3gnOiB0aGlzLmJveCxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1lbmNsb3NlZCc6IHRoaXMuaXNFbmNsb3NlZCxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1yZXZlcnNlJzogdGhpcy5yZXZlcnNlLFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLW91dGxpbmUnOiB0aGlzLmhhc091dGxpbmUsXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tcGxhY2Vob2xkZXInOiB0aGlzLnBsYWNlaG9sZGVyXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb3VudGVyVmFsdWUgKCkge1xyXG4gICAgICByZXR1cm4gKHRoaXMuaW50ZXJuYWxWYWx1ZSB8fCAnJykudG9TdHJpbmcoKS5sZW5ndGhcclxuICAgIH0sXHJcbiAgICBkaXJlY3RpdmVzSW5wdXQgKCkge1xyXG4gICAgICByZXR1cm4gW11cclxuICAgIH0sXHJcbiAgICAvLyBUT0RPOiBEZXByZWNhdGVcclxuICAgIGhhc091dGxpbmUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5vdXRsaW5lIHx8IHRoaXMudGV4dGFyZWFcclxuICAgIH0sXHJcbiAgICBpbnRlcm5hbFZhbHVlOiB7XHJcbiAgICAgIGdldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGF6eVZhbHVlXHJcbiAgICAgIH0sXHJcbiAgICAgIHNldCAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubWFzaykge1xyXG4gICAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB0aGlzLnVubWFza1RleHQodGhpcy5tYXNrVGV4dCh0aGlzLnVubWFza1RleHQodmFsKSkpXHJcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcclxuICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5sYXp5VmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNEaXJ0eSAoKSB7XHJcbiAgICAgIHJldHVybiAodGhpcy5sYXp5VmFsdWUgIT0gbnVsbCAmJlxyXG4gICAgICAgIHRoaXMubGF6eVZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID4gMCkgfHxcclxuICAgICAgICB0aGlzLmJhZElucHV0XHJcbiAgICB9LFxyXG4gICAgaXNFbmNsb3NlZCAoKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5ib3ggfHxcclxuICAgICAgICB0aGlzLmlzU29sbyB8fFxyXG4gICAgICAgIHRoaXMuaGFzT3V0bGluZSB8fFxyXG4gICAgICAgIHRoaXMuZnVsbFdpZHRoXHJcbiAgICAgIClcclxuICAgIH0sXHJcbiAgICBpc0xhYmVsQWN0aXZlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJ0eSB8fCBkaXJ0eVR5cGVzLmluY2x1ZGVzKHRoaXMudHlwZSlcclxuICAgIH0sXHJcbiAgICBpc1NpbmdsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzU29sbyB8fCB0aGlzLnNpbmdsZUxpbmVcclxuICAgIH0sXHJcbiAgICBpc1NvbG8gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zb2xvIHx8IHRoaXMuc29sb0ludmVydGVkXHJcbiAgICB9LFxyXG4gICAgbGFiZWxQb3NpdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IG9mZnNldCA9ICh0aGlzLnByZWZpeCAmJiAhdGhpcy5sYWJlbFZhbHVlKSA/IHRoaXMucHJlZml4V2lkdGggOiAwXHJcblxyXG4gICAgICByZXR1cm4gKCF0aGlzLiR2dWV0aWZ5LnJ0bCAhPT0gIXRoaXMucmV2ZXJzZSkgPyB7XHJcbiAgICAgICAgbGVmdDogJ2F1dG8nLFxyXG4gICAgICAgIHJpZ2h0OiBvZmZzZXRcclxuICAgICAgfSA6IHtcclxuICAgICAgICBsZWZ0OiBvZmZzZXQsXHJcbiAgICAgICAgcmlnaHQ6ICdhdXRvJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2hvd0xhYmVsICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzTGFiZWwgJiYgKCF0aGlzLmlzU2luZ2xlIHx8ICghdGhpcy5pc0xhYmVsQWN0aXZlICYmICF0aGlzLnBsYWNlaG9sZGVyICYmICF0aGlzLnByZWZpeExhYmVsKSlcclxuICAgIH0sXHJcbiAgICBsYWJlbFZhbHVlICgpIHtcclxuICAgICAgcmV0dXJuICF0aGlzLmlzU2luZ2xlICYmXHJcbiAgICAgICAgQm9vbGVhbih0aGlzLmlzRm9jdXNlZCB8fCB0aGlzLmlzTGFiZWxBY3RpdmUgfHwgdGhpcy5wbGFjZWhvbGRlciB8fCB0aGlzLnByZWZpeExhYmVsKVxyXG4gICAgfSxcclxuICAgIHByZWZpeFdpZHRoICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnByZWZpeCAmJiAhdGhpcy4kcmVmcy5wcmVmaXgpIHJldHVyblxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJHJlZnMucHJlZml4Lm9mZnNldFdpZHRoXHJcbiAgICB9LFxyXG4gICAgcHJlZml4TGFiZWwgKCkge1xyXG4gICAgICByZXR1cm4gKHRoaXMucHJlZml4ICYmICF0aGlzLnZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0ZvY3VzZWQgKHZhbCkge1xyXG4gICAgICAvLyBTZXRzIHZhbGlkYXRpb25TdGF0ZSBmcm9tIHZhbGlkYXRhYmxlXHJcbiAgICAgIHRoaXMuaGFzQ29sb3IgPSB2YWxcclxuXHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IHRoaXMubGF6eVZhbHVlXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMubGF6eVZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdGhpcy5sYXp5VmFsdWUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2YWx1ZSAodmFsKSB7XHJcbiAgICAgIGlmICh0aGlzLm1hc2sgJiYgIXRoaXMuaW50ZXJuYWxDaGFuZ2UpIHtcclxuICAgICAgICBjb25zdCBtYXNrZWQgPSB0aGlzLm1hc2tUZXh0KHRoaXMudW5tYXNrVGV4dCh2YWwpKVxyXG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdGhpcy51bm1hc2tUZXh0KG1hc2tlZClcclxuXHJcbiAgICAgICAgLy8gRW1pdCB3aGVuIHRoZSBleHRlcm5hbGx5IHNldCB2YWx1ZSB3YXMgbW9kaWZpZWQgaW50ZXJuYWxseVxyXG4gICAgICAgIFN0cmluZyh2YWwpICE9PSB0aGlzLmxhenlWYWx1ZSAmJiB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLiRyZWZzLmlucHV0LnZhbHVlID0gbWFza2VkXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMubGF6eVZhbHVlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB0aGlzLmxhenlWYWx1ZSA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy5hdXRvZm9jdXMgJiYgdGhpcy5vbkZvY3VzKClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgZm9jdXMgKCkge1xyXG4gICAgICB0aGlzLm9uRm9jdXMoKVxyXG4gICAgfSxcclxuICAgIC8qKiBAcHVibGljICovXHJcbiAgICBibHVyICgpIHtcclxuICAgICAgdGhpcy4kcmVmcy5pbnB1dCA/IHRoaXMuJHJlZnMuaW5wdXQuYmx1cigpIDogdGhpcy5vbkJsdXIoKVxyXG4gICAgfSxcclxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcclxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gbnVsbFxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKCkpXHJcbiAgICB9LFxyXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XHJcbiAgICAgIGNvbnN0IHNsb3QgPSBbXVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHNsb3RzWydhcHBlbmQtb3V0ZXInXSkge1xyXG4gICAgICAgIHNsb3QucHVzaCh0aGlzLiRzbG90c1snYXBwZW5kLW91dGVyJ10pXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hcHBlbmRPdXRlckljb24pIHtcclxuICAgICAgICBzbG90LnB1c2godGhpcy5nZW5JY29uKCdhcHBlbmRPdXRlcicpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnb3V0ZXInLCBzbG90KVxyXG4gICAgfSxcclxuICAgIGdlblByZXBlbmRJbm5lclNsb3QgKCkge1xyXG4gICAgICBjb25zdCBzbG90ID0gW11cclxuXHJcbiAgICAgIGlmICh0aGlzLiRzbG90c1sncHJlcGVuZC1pbm5lciddKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydwcmVwZW5kLWlubmVyJ10pXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVwZW5kSW5uZXJJY29uKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbigncHJlcGVuZElubmVyJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ3ByZXBlbmQnLCAnaW5uZXInLCBzbG90KVxyXG4gICAgfSxcclxuICAgIGdlbkljb25TbG90ICgpIHtcclxuICAgICAgY29uc3Qgc2xvdCA9IFtdXHJcblxyXG4gICAgICBpZiAodGhpcy4kc2xvdHNbJ2FwcGVuZCddKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydhcHBlbmQnXSlcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcGVuZEljb24pIHtcclxuICAgICAgICBzbG90LnB1c2godGhpcy5nZW5JY29uKCdhcHBlbmQnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuU2xvdCgnYXBwZW5kJywgJ2lubmVyJywgc2xvdClcclxuICAgIH0sXHJcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IFZJbnB1dC5vcHRpb25zLm1ldGhvZHMuZ2VuSW5wdXRTbG90LmNhbGwodGhpcylcclxuXHJcbiAgICAgIGNvbnN0IHByZXBlbmQgPSB0aGlzLmdlblByZXBlbmRJbm5lclNsb3QoKVxyXG4gICAgICBwcmVwZW5kICYmIGlucHV0LmNoaWxkcmVuLnVuc2hpZnQocHJlcGVuZClcclxuXHJcbiAgICAgIHJldHVybiBpbnB1dFxyXG4gICAgfSxcclxuICAgIGdlbkNsZWFySWNvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5jbGVhcmFibGUpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBpY29uID0gIXRoaXMuaXNEaXJ0eVxyXG4gICAgICAgID8gZmFsc2VcclxuICAgICAgICA6ICdjbGVhcidcclxuXHJcbiAgICAgIGlmICh0aGlzLmNsZWFySWNvbkNiKSBkZXByZWNhdGUoJzpjbGVhci1pY29uLWNiJywgJ0BjbGljazpjbGVhcicsIHRoaXMpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnaW5uZXInLCBbXHJcbiAgICAgICAgdGhpcy5nZW5JY29uKFxyXG4gICAgICAgICAgaWNvbixcclxuICAgICAgICAgICghdGhpcy4kbGlzdGVuZXJzWydjbGljazpjbGVhciddICYmIHRoaXMuY2xlYXJJY29uQ2IpIHx8IHRoaXMuY2xlYXJhYmxlQ2FsbGJhY2ssXHJcbiAgICAgICAgICBmYWxzZVxyXG4gICAgICAgIClcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Db3VudGVyICgpIHtcclxuICAgICAgaWYgKHRoaXMuY291bnRlciA9PT0gZmFsc2UgfHwgdGhpcy5jb3VudGVyID09IG51bGwpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBtYXggPSB0aGlzLmNvdW50ZXIgPT09IHRydWUgPyB0aGlzLiRhdHRycy5tYXhsZW5ndGggOiB0aGlzLmNvdW50ZXJcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDb3VudGVyLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbWF4LFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMuY291bnRlclZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB0aGlzLmdlblRleHRGaWVsZFNsb3QoKSxcclxuICAgICAgICB0aGlzLmdlbkNsZWFySWNvbigpLFxyXG4gICAgICAgIHRoaXMuZ2VuSWNvblNsb3QoKSxcclxuICAgICAgICB0aGlzLmdlblByb2dyZXNzKClcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGdlbkxhYmVsICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnNob3dMYWJlbCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFic29sdXRlOiB0cnVlLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMudmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBmb2N1c2VkOiAhdGhpcy5pc1NpbmdsZSAmJiAodGhpcy5pc0ZvY3VzZWQgfHwgISF0aGlzLnZhbGlkYXRpb25TdGF0ZSksXHJcbiAgICAgICAgICBsZWZ0OiB0aGlzLmxhYmVsUG9zaXRpb24ubGVmdCxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgcmlnaHQ6IHRoaXMubGFiZWxQb3NpdGlvbi5yaWdodCxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmxhYmVsVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLiRhdHRycy5pZCkgZGF0YS5wcm9wcy5mb3IgPSB0aGlzLiRhdHRycy5pZFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkxhYmVsLCBkYXRhLCB0aGlzLiRzbG90cy5sYWJlbCB8fCB0aGlzLmxhYmVsKVxyXG4gICAgfSxcclxuICAgIGdlbklucHV0ICgpIHtcclxuICAgICAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy4kbGlzdGVuZXJzKVxyXG4gICAgICBkZWxldGUgbGlzdGVuZXJzWydjaGFuZ2UnXSAvLyBDaGFuZ2Ugc2hvdWxkIG5vdCBiZSBib3VuZCBleHRlcm5hbGx5XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIHN0eWxlOiB7fSxcclxuICAgICAgICBkb21Qcm9wczoge1xyXG4gICAgICAgICAgdmFsdWU6IHRoaXMubWFza1RleHQodGhpcy5sYXp5VmFsdWUpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiAoIXRoaXMuJGF0dHJzIHx8ICF0aGlzLiRhdHRycy5pZCkgJiYgdGhpcy5sYWJlbCwgLy8gTGFiZWwgYGZvcmAgd2lsbCBiZSBzZXQgaWYgd2UgaGF2ZSBhbiBpZFxyXG4gICAgICAgICAgLi4udGhpcy4kYXR0cnMsXHJcbiAgICAgICAgICBhdXRvZm9jdXM6IHRoaXMuYXV0b2ZvY3VzLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24obGlzdGVuZXJzLCB7XHJcbiAgICAgICAgICBibHVyOiB0aGlzLm9uQmx1cixcclxuICAgICAgICAgIGlucHV0OiB0aGlzLm9uSW5wdXQsXHJcbiAgICAgICAgICBmb2N1czogdGhpcy5vbkZvY3VzLFxyXG4gICAgICAgICAga2V5ZG93bjogdGhpcy5vbktleURvd25cclxuICAgICAgICB9KSxcclxuICAgICAgICByZWY6ICdpbnB1dCdcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIGRhdGEuYXR0cnMucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyXHJcbiAgICAgIGlmICh0aGlzLm1hc2spIGRhdGEuYXR0cnMubWF4bGVuZ3RoID0gdGhpcy5tYXNrZWQubGVuZ3RoXHJcbiAgICAgIGlmICh0aGlzLmJyb3dzZXJBdXRvY29tcGxldGUpIGRhdGEuYXR0cnMuYXV0b2NvbXBsZXRlID0gdGhpcy5icm93c2VyQXV0b2NvbXBsZXRlXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnaW5wdXQnLCBkYXRhKVxyXG4gICAgfSxcclxuICAgIGdlbk1lc3NhZ2VzICgpIHtcclxuICAgICAgaWYgKHRoaXMuaGlkZURldGFpbHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10ZXh0LWZpZWxkX19kZXRhaWxzJ1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5NZXNzYWdlcy5jYWxsKHRoaXMpLFxyXG4gICAgICAgIHRoaXMuZ2VuQ291bnRlcigpXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuVGV4dEZpZWxkU2xvdCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRleHQtZmllbGRfX3Nsb3QnXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbkxhYmVsKCksXHJcbiAgICAgICAgdGhpcy5wcmVmaXggPyB0aGlzLmdlbkFmZml4KCdwcmVmaXgnKSA6IG51bGwsXHJcbiAgICAgICAgdGhpcy5nZW5JbnB1dCgpLFxyXG4gICAgICAgIHRoaXMuc3VmZml4ID8gdGhpcy5nZW5BZmZpeCgnc3VmZml4JykgOiBudWxsXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuQWZmaXggKHR5cGUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAnY2xhc3MnOiBgdi10ZXh0LWZpZWxkX18ke3R5cGV9YCxcclxuICAgICAgICByZWY6IHR5cGVcclxuICAgICAgfSwgdGhpc1t0eXBlXSlcclxuICAgIH0sXHJcbiAgICBvbkJsdXIgKGUpIHtcclxuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxyXG4gICAgICAvLyBSZXNldCBpbnRlcm5hbENoYW5nZSBzdGF0ZVxyXG4gICAgICAvLyB0byBhbGxvdyBleHRlcm5hbCBjaGFuZ2VcclxuICAgICAgLy8gdG8gcGVyc2lzdFxyXG4gICAgICB0aGlzLmludGVybmFsQ2hhbmdlID0gZmFsc2VcclxuXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2JsdXInLCBlKVxyXG4gICAgfSxcclxuICAgIG9uQ2xpY2sgKCkge1xyXG4gICAgICBpZiAodGhpcy5pc0ZvY3VzZWQgfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKClcclxuICAgIH0sXHJcbiAgICBvbkZvY3VzIChlKSB7XHJcbiAgICAgIGlmICghdGhpcy4kcmVmcy5pbnB1dCkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy4kcmVmcy5pbnB1dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmlzRm9jdXNlZCkge1xyXG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uSW5wdXQgKGUpIHtcclxuICAgICAgdGhpcy5pbnRlcm5hbENoYW5nZSA9IHRydWVcclxuICAgICAgdGhpcy5tYXNrICYmIHRoaXMucmVzZXRTZWxlY3Rpb25zKGUudGFyZ2V0KVxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICB0aGlzLmJhZElucHV0ID0gZS50YXJnZXQudmFsaWRpdHkgJiYgZS50YXJnZXQudmFsaWRpdHkuYmFkSW5wdXRcclxuICAgIH0sXHJcbiAgICBvbktleURvd24gKGUpIHtcclxuICAgICAgdGhpcy5pbnRlcm5hbENoYW5nZSA9IHRydWVcclxuXHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyKSB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB0aGlzLmludGVybmFsVmFsdWUpXHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdrZXlkb3duJywgZSlcclxuICAgIH0sXHJcbiAgICBvbk1vdXNlRG93biAoZSkge1xyXG4gICAgICAvLyBQcmV2ZW50IGlucHV0IGZyb20gYmVpbmcgYmx1cnJlZFxyXG4gICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMuJHJlZnMuaW5wdXQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFZJbnB1dC5vcHRpb25zLm1ldGhvZHMub25Nb3VzZURvd24uY2FsbCh0aGlzLCBlKVxyXG4gICAgfSxcclxuICAgIG9uTW91c2VVcCAoZSkge1xyXG4gICAgICBpZiAodGhpcy5oYXNNb3VzZURvd24pIHRoaXMuZm9jdXMoKVxyXG5cclxuICAgICAgVklucHV0Lm9wdGlvbnMubWV0aG9kcy5vbk1vdXNlVXAuY2FsbCh0aGlzLCBlKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19