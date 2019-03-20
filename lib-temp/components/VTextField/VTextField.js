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
                if (this.mask && val !== this.lazyValue) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRleHRGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUZXh0RmllbGQvVlRleHRGaWVsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQUVsRCxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLGFBQWE7QUFDYixPQUFPLFFBQVEsTUFBTSxhQUFhLENBQUE7QUFDbEMsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsWUFBWTtBQUNaLE9BQU8sRUFDTCxRQUFRLEVBQ1QsTUFBTSxvQkFBb0IsQ0FBQTtBQUMzQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFOUMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBRXZGLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDM0IsSUFBSSxFQUFFLGNBQWM7SUFFcEIsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBRXRCLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7SUFFNUIsWUFBWSxFQUFFLEtBQUs7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsZUFBZSxFQUFFLE1BQU07UUFDdkIsa0JBQWtCO1FBQ2xCLGlCQUFpQixFQUFFLFFBQVE7UUFDM0IsU0FBUyxFQUFFLE9BQU87UUFDbEIsR0FBRyxFQUFFLE9BQU87UUFDWixtQkFBbUIsRUFBRSxNQUFNO1FBQzNC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LElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUNoRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fdGV4dC1maWVsZHMuc3R5bCdcclxuXHJcbi8vIEV4dGVuc2lvbnNcclxuaW1wb3J0IFZJbnB1dCBmcm9tICcuLi9WSW5wdXQnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWQ291bnRlciBmcm9tICcuLi9WQ291bnRlcidcclxuaW1wb3J0IFZMYWJlbCBmcm9tICcuLi9WTGFiZWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IE1hc2thYmxlIGZyb20gJy4uLy4uL21peGlucy9tYXNrYWJsZSdcclxuaW1wb3J0IExvYWRhYmxlIGZyb20gJy4uLy4uL21peGlucy9sb2FkYWJsZSdcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IFJpcHBsZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQge1xyXG4gIGtleUNvZGVzXHJcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBkZXByZWNhdGUgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcblxyXG5jb25zdCBkaXJ0eVR5cGVzID0gWydjb2xvcicsICdmaWxlJywgJ3RpbWUnLCAnZGF0ZScsICdkYXRldGltZS1sb2NhbCcsICd3ZWVrJywgJ21vbnRoJ11cclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZJbnB1dC5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXRleHQtZmllbGQnLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7IFJpcHBsZSB9LFxyXG5cclxuICBtaXhpbnM6IFtNYXNrYWJsZSwgTG9hZGFibGVdLFxyXG5cclxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYXBwZW5kT3V0ZXJJY29uOiBTdHJpbmcsXHJcbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgIGFwcGVuZE91dGVySWNvbkNiOiBGdW5jdGlvbixcclxuICAgIGF1dG9mb2N1czogQm9vbGVhbixcclxuICAgIGJveDogQm9vbGVhbixcclxuICAgIGJyb3dzZXJBdXRvY29tcGxldGU6IFN0cmluZyxcclxuICAgIGNsZWFyYWJsZTogQm9vbGVhbixcclxuICAgIGNsZWFySWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5jbGVhcidcclxuICAgIH0sXHJcbiAgICBjbGVhckljb25DYjogRnVuY3Rpb24sXHJcbiAgICBjb2xvcjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdwcmltYXJ5J1xyXG4gICAgfSxcclxuICAgIGNvdW50ZXI6IFtCb29sZWFuLCBOdW1iZXIsIFN0cmluZ10sXHJcbiAgICBmbGF0OiBCb29sZWFuLFxyXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxyXG4gICAgbGFiZWw6IFN0cmluZyxcclxuICAgIG91dGxpbmU6IEJvb2xlYW4sXHJcbiAgICBwbGFjZWhvbGRlcjogU3RyaW5nLFxyXG4gICAgcHJlZml4OiBTdHJpbmcsXHJcbiAgICBwcmVwZW5kSW5uZXJJY29uOiBTdHJpbmcsXHJcbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgIHByZXBlbmRJbm5lckljb25DYjogRnVuY3Rpb24sXHJcbiAgICByZXZlcnNlOiBCb29sZWFuLFxyXG4gICAgc2luZ2xlTGluZTogQm9vbGVhbixcclxuICAgIHNvbG86IEJvb2xlYW4sXHJcbiAgICBzb2xvSW52ZXJ0ZWQ6IEJvb2xlYW4sXHJcbiAgICBzdWZmaXg6IFN0cmluZyxcclxuICAgIHR5cGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndGV4dCdcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgYmFkSW5wdXQ6IGZhbHNlLFxyXG4gICAgaW5pdGlhbFZhbHVlOiBudWxsLFxyXG4gICAgaW50ZXJuYWxDaGFuZ2U6IGZhbHNlLFxyXG4gICAgaXNDbGVhcmluZzogZmFsc2VcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXRleHQtZmllbGQnOiB0cnVlLFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLWZ1bGwtd2lkdGgnOiB0aGlzLmZ1bGxXaWR0aCxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1wcmVmaXgnOiB0aGlzLnByZWZpeCxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zaW5nbGUtbGluZSc6IHRoaXMuaXNTaW5nbGUsXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tc29sbyc6IHRoaXMuaXNTb2xvLFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLXNvbG8taW52ZXJ0ZWQnOiB0aGlzLnNvbG9JbnZlcnRlZCxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1zb2xvLWZsYXQnOiB0aGlzLmZsYXQsXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tYm94JzogdGhpcy5ib3gsXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tZW5jbG9zZWQnOiB0aGlzLmlzRW5jbG9zZWQsXHJcbiAgICAgICAgJ3YtdGV4dC1maWVsZC0tcmV2ZXJzZSc6IHRoaXMucmV2ZXJzZSxcclxuICAgICAgICAndi10ZXh0LWZpZWxkLS1vdXRsaW5lJzogdGhpcy5oYXNPdXRsaW5lLFxyXG4gICAgICAgICd2LXRleHQtZmllbGQtLXBsYWNlaG9sZGVyJzogdGhpcy5wbGFjZWhvbGRlclxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY291bnRlclZhbHVlICgpIHtcclxuICAgICAgcmV0dXJuICh0aGlzLmludGVybmFsVmFsdWUgfHwgJycpLnRvU3RyaW5nKCkubGVuZ3RoXHJcbiAgICB9LFxyXG4gICAgZGlyZWN0aXZlc0lucHV0ICgpIHtcclxuICAgICAgcmV0dXJuIFtdXHJcbiAgICB9LFxyXG4gICAgLy8gVE9ETzogRGVwcmVjYXRlXHJcbiAgICBoYXNPdXRsaW5lICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMub3V0bGluZSB8fCB0aGlzLnRleHRhcmVhXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxWYWx1ZToge1xyXG4gICAgICBnZXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxyXG4gICAgICB9LFxyXG4gICAgICBzZXQgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1hc2sgJiYgdmFsICE9PSB0aGlzLmxhenlWYWx1ZSkge1xyXG4gICAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB0aGlzLnVubWFza1RleHQodGhpcy5tYXNrVGV4dCh0aGlzLnVubWFza1RleHQodmFsKSkpXHJcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcclxuICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5sYXp5VmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNEaXJ0eSAoKSB7XHJcbiAgICAgIHJldHVybiAodGhpcy5sYXp5VmFsdWUgIT0gbnVsbCAmJlxyXG4gICAgICAgIHRoaXMubGF6eVZhbHVlLnRvU3RyaW5nKCkubGVuZ3RoID4gMCkgfHxcclxuICAgICAgICB0aGlzLmJhZElucHV0XHJcbiAgICB9LFxyXG4gICAgaXNFbmNsb3NlZCAoKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5ib3ggfHxcclxuICAgICAgICB0aGlzLmlzU29sbyB8fFxyXG4gICAgICAgIHRoaXMuaGFzT3V0bGluZSB8fFxyXG4gICAgICAgIHRoaXMuZnVsbFdpZHRoXHJcbiAgICAgIClcclxuICAgIH0sXHJcbiAgICBpc0xhYmVsQWN0aXZlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNEaXJ0eSB8fCBkaXJ0eVR5cGVzLmluY2x1ZGVzKHRoaXMudHlwZSlcclxuICAgIH0sXHJcbiAgICBpc1NpbmdsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzU29sbyB8fCB0aGlzLnNpbmdsZUxpbmVcclxuICAgIH0sXHJcbiAgICBpc1NvbG8gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zb2xvIHx8IHRoaXMuc29sb0ludmVydGVkXHJcbiAgICB9LFxyXG4gICAgbGFiZWxQb3NpdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IG9mZnNldCA9ICh0aGlzLnByZWZpeCAmJiAhdGhpcy5sYWJlbFZhbHVlKSA/IHRoaXMucHJlZml4V2lkdGggOiAwXHJcblxyXG4gICAgICByZXR1cm4gKCF0aGlzLiR2dWV0aWZ5LnJ0bCAhPT0gIXRoaXMucmV2ZXJzZSkgPyB7XHJcbiAgICAgICAgbGVmdDogJ2F1dG8nLFxyXG4gICAgICAgIHJpZ2h0OiBvZmZzZXRcclxuICAgICAgfSA6IHtcclxuICAgICAgICBsZWZ0OiBvZmZzZXQsXHJcbiAgICAgICAgcmlnaHQ6ICdhdXRvJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2hvd0xhYmVsICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzTGFiZWwgJiYgKCF0aGlzLmlzU2luZ2xlIHx8ICghdGhpcy5pc0xhYmVsQWN0aXZlICYmICF0aGlzLnBsYWNlaG9sZGVyICYmICF0aGlzLnByZWZpeExhYmVsKSlcclxuICAgIH0sXHJcbiAgICBsYWJlbFZhbHVlICgpIHtcclxuICAgICAgcmV0dXJuICF0aGlzLmlzU2luZ2xlICYmXHJcbiAgICAgICAgQm9vbGVhbih0aGlzLmlzRm9jdXNlZCB8fCB0aGlzLmlzTGFiZWxBY3RpdmUgfHwgdGhpcy5wbGFjZWhvbGRlciB8fCB0aGlzLnByZWZpeExhYmVsKVxyXG4gICAgfSxcclxuICAgIHByZWZpeFdpZHRoICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnByZWZpeCAmJiAhdGhpcy4kcmVmcy5wcmVmaXgpIHJldHVyblxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJHJlZnMucHJlZml4Lm9mZnNldFdpZHRoXHJcbiAgICB9LFxyXG4gICAgcHJlZml4TGFiZWwgKCkge1xyXG4gICAgICByZXR1cm4gKHRoaXMucHJlZml4ICYmICF0aGlzLnZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0ZvY3VzZWQgKHZhbCkge1xyXG4gICAgICAvLyBTZXRzIHZhbGlkYXRpb25TdGF0ZSBmcm9tIHZhbGlkYXRhYmxlXHJcbiAgICAgIHRoaXMuaGFzQ29sb3IgPSB2YWxcclxuXHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IHRoaXMubGF6eVZhbHVlXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMubGF6eVZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdGhpcy5sYXp5VmFsdWUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2YWx1ZSAodmFsKSB7XHJcbiAgICAgIGlmICh0aGlzLm1hc2sgJiYgIXRoaXMuaW50ZXJuYWxDaGFuZ2UpIHtcclxuICAgICAgICBjb25zdCBtYXNrZWQgPSB0aGlzLm1hc2tUZXh0KHRoaXMudW5tYXNrVGV4dCh2YWwpKVxyXG4gICAgICAgIHRoaXMubGF6eVZhbHVlID0gdGhpcy51bm1hc2tUZXh0KG1hc2tlZClcclxuXHJcbiAgICAgICAgLy8gRW1pdCB3aGVuIHRoZSBleHRlcm5hbGx5IHNldCB2YWx1ZSB3YXMgbW9kaWZpZWQgaW50ZXJuYWxseVxyXG4gICAgICAgIFN0cmluZyh2YWwpICE9PSB0aGlzLmxhenlWYWx1ZSAmJiB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLiRyZWZzLmlucHV0LnZhbHVlID0gbWFza2VkXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMubGF6eVZhbHVlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB0aGlzLmxhenlWYWx1ZSA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy5hdXRvZm9jdXMgJiYgdGhpcy5vbkZvY3VzKClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgZm9jdXMgKCkge1xyXG4gICAgICB0aGlzLm9uRm9jdXMoKVxyXG4gICAgfSxcclxuICAgIC8qKiBAcHVibGljICovXHJcbiAgICBibHVyICgpIHtcclxuICAgICAgdGhpcy4kcmVmcy5pbnB1dCA/IHRoaXMuJHJlZnMuaW5wdXQuYmx1cigpIDogdGhpcy5vbkJsdXIoKVxyXG4gICAgfSxcclxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcclxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gbnVsbFxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKCkpXHJcbiAgICB9LFxyXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XHJcbiAgICAgIGNvbnN0IHNsb3QgPSBbXVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHNsb3RzWydhcHBlbmQtb3V0ZXInXSkge1xyXG4gICAgICAgIHNsb3QucHVzaCh0aGlzLiRzbG90c1snYXBwZW5kLW91dGVyJ10pXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hcHBlbmRPdXRlckljb24pIHtcclxuICAgICAgICBzbG90LnB1c2godGhpcy5nZW5JY29uKCdhcHBlbmRPdXRlcicpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnb3V0ZXInLCBzbG90KVxyXG4gICAgfSxcclxuICAgIGdlblByZXBlbmRJbm5lclNsb3QgKCkge1xyXG4gICAgICBjb25zdCBzbG90ID0gW11cclxuXHJcbiAgICAgIGlmICh0aGlzLiRzbG90c1sncHJlcGVuZC1pbm5lciddKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydwcmVwZW5kLWlubmVyJ10pXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVwZW5kSW5uZXJJY29uKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbigncHJlcGVuZElubmVyJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ3ByZXBlbmQnLCAnaW5uZXInLCBzbG90KVxyXG4gICAgfSxcclxuICAgIGdlbkljb25TbG90ICgpIHtcclxuICAgICAgY29uc3Qgc2xvdCA9IFtdXHJcblxyXG4gICAgICBpZiAodGhpcy4kc2xvdHNbJ2FwcGVuZCddKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzWydhcHBlbmQnXSlcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmFwcGVuZEljb24pIHtcclxuICAgICAgICBzbG90LnB1c2godGhpcy5nZW5JY29uKCdhcHBlbmQnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuU2xvdCgnYXBwZW5kJywgJ2lubmVyJywgc2xvdClcclxuICAgIH0sXHJcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IFZJbnB1dC5vcHRpb25zLm1ldGhvZHMuZ2VuSW5wdXRTbG90LmNhbGwodGhpcylcclxuXHJcbiAgICAgIGNvbnN0IHByZXBlbmQgPSB0aGlzLmdlblByZXBlbmRJbm5lclNsb3QoKVxyXG4gICAgICBwcmVwZW5kICYmIGlucHV0LmNoaWxkcmVuLnVuc2hpZnQocHJlcGVuZClcclxuXHJcbiAgICAgIHJldHVybiBpbnB1dFxyXG4gICAgfSxcclxuICAgIGdlbkNsZWFySWNvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5jbGVhcmFibGUpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBpY29uID0gIXRoaXMuaXNEaXJ0eVxyXG4gICAgICAgID8gZmFsc2VcclxuICAgICAgICA6ICdjbGVhcidcclxuXHJcbiAgICAgIGlmICh0aGlzLmNsZWFySWNvbkNiKSBkZXByZWNhdGUoJzpjbGVhci1pY29uLWNiJywgJ0BjbGljazpjbGVhcicsIHRoaXMpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZW5TbG90KCdhcHBlbmQnLCAnaW5uZXInLCBbXHJcbiAgICAgICAgdGhpcy5nZW5JY29uKFxyXG4gICAgICAgICAgaWNvbixcclxuICAgICAgICAgICghdGhpcy4kbGlzdGVuZXJzWydjbGljazpjbGVhciddICYmIHRoaXMuY2xlYXJJY29uQ2IpIHx8IHRoaXMuY2xlYXJhYmxlQ2FsbGJhY2ssXHJcbiAgICAgICAgICBmYWxzZVxyXG4gICAgICAgIClcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Db3VudGVyICgpIHtcclxuICAgICAgaWYgKHRoaXMuY291bnRlciA9PT0gZmFsc2UgfHwgdGhpcy5jb3VudGVyID09IG51bGwpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBtYXggPSB0aGlzLmNvdW50ZXIgPT09IHRydWUgPyB0aGlzLiRhdHRycy5tYXhsZW5ndGggOiB0aGlzLmNvdW50ZXJcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDb3VudGVyLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbWF4LFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMuY291bnRlclZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB0aGlzLmdlblRleHRGaWVsZFNsb3QoKSxcclxuICAgICAgICB0aGlzLmdlbkNsZWFySWNvbigpLFxyXG4gICAgICAgIHRoaXMuZ2VuSWNvblNsb3QoKSxcclxuICAgICAgICB0aGlzLmdlblByb2dyZXNzKClcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGdlbkxhYmVsICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnNob3dMYWJlbCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFic29sdXRlOiB0cnVlLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMudmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBmb2N1c2VkOiAhdGhpcy5pc1NpbmdsZSAmJiAodGhpcy5pc0ZvY3VzZWQgfHwgISF0aGlzLnZhbGlkYXRpb25TdGF0ZSksXHJcbiAgICAgICAgICBsZWZ0OiB0aGlzLmxhYmVsUG9zaXRpb24ubGVmdCxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgcmlnaHQ6IHRoaXMubGFiZWxQb3NpdGlvbi5yaWdodCxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmxhYmVsVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLiRhdHRycy5pZCkgZGF0YS5wcm9wcy5mb3IgPSB0aGlzLiRhdHRycy5pZFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkxhYmVsLCBkYXRhLCB0aGlzLiRzbG90cy5sYWJlbCB8fCB0aGlzLmxhYmVsKVxyXG4gICAgfSxcclxuICAgIGdlbklucHV0ICgpIHtcclxuICAgICAgY29uc3QgbGlzdGVuZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy4kbGlzdGVuZXJzKVxyXG4gICAgICBkZWxldGUgbGlzdGVuZXJzWydjaGFuZ2UnXSAvLyBDaGFuZ2Ugc2hvdWxkIG5vdCBiZSBib3VuZCBleHRlcm5hbGx5XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgIHN0eWxlOiB7fSxcclxuICAgICAgICBkb21Qcm9wczoge1xyXG4gICAgICAgICAgdmFsdWU6IHRoaXMubWFza1RleHQodGhpcy5sYXp5VmFsdWUpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiAoIXRoaXMuJGF0dHJzIHx8ICF0aGlzLiRhdHRycy5pZCkgJiYgdGhpcy5sYWJlbCwgLy8gTGFiZWwgYGZvcmAgd2lsbCBiZSBzZXQgaWYgd2UgaGF2ZSBhbiBpZFxyXG4gICAgICAgICAgLi4udGhpcy4kYXR0cnMsXHJcbiAgICAgICAgICBhdXRvZm9jdXM6IHRoaXMuYXV0b2ZvY3VzLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHR5cGU6IHRoaXMudHlwZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24obGlzdGVuZXJzLCB7XHJcbiAgICAgICAgICBibHVyOiB0aGlzLm9uQmx1cixcclxuICAgICAgICAgIGlucHV0OiB0aGlzLm9uSW5wdXQsXHJcbiAgICAgICAgICBmb2N1czogdGhpcy5vbkZvY3VzLFxyXG4gICAgICAgICAga2V5ZG93bjogdGhpcy5vbktleURvd25cclxuICAgICAgICB9KSxcclxuICAgICAgICByZWY6ICdpbnB1dCdcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIGRhdGEuYXR0cnMucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyXHJcbiAgICAgIGlmICh0aGlzLm1hc2spIGRhdGEuYXR0cnMubWF4bGVuZ3RoID0gdGhpcy5tYXNrZWQubGVuZ3RoXHJcbiAgICAgIGlmICh0aGlzLmJyb3dzZXJBdXRvY29tcGxldGUpIGRhdGEuYXR0cnMuYXV0b2NvbXBsZXRlID0gdGhpcy5icm93c2VyQXV0b2NvbXBsZXRlXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnaW5wdXQnLCBkYXRhKVxyXG4gICAgfSxcclxuICAgIGdlbk1lc3NhZ2VzICgpIHtcclxuICAgICAgaWYgKHRoaXMuaGlkZURldGFpbHMpIHJldHVybiBudWxsXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10ZXh0LWZpZWxkX19kZXRhaWxzJ1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgVklucHV0Lm9wdGlvbnMubWV0aG9kcy5nZW5NZXNzYWdlcy5jYWxsKHRoaXMpLFxyXG4gICAgICAgIHRoaXMuZ2VuQ291bnRlcigpXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuVGV4dEZpZWxkU2xvdCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRleHQtZmllbGRfX3Nsb3QnXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbkxhYmVsKCksXHJcbiAgICAgICAgdGhpcy5wcmVmaXggPyB0aGlzLmdlbkFmZml4KCdwcmVmaXgnKSA6IG51bGwsXHJcbiAgICAgICAgdGhpcy5nZW5JbnB1dCgpLFxyXG4gICAgICAgIHRoaXMuc3VmZml4ID8gdGhpcy5nZW5BZmZpeCgnc3VmZml4JykgOiBudWxsXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuQWZmaXggKHR5cGUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAnY2xhc3MnOiBgdi10ZXh0LWZpZWxkX18ke3R5cGV9YCxcclxuICAgICAgICByZWY6IHR5cGVcclxuICAgICAgfSwgdGhpc1t0eXBlXSlcclxuICAgIH0sXHJcbiAgICBvbkJsdXIgKGUpIHtcclxuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxyXG4gICAgICAvLyBSZXNldCBpbnRlcm5hbENoYW5nZSBzdGF0ZVxyXG4gICAgICAvLyB0byBhbGxvdyBleHRlcm5hbCBjaGFuZ2VcclxuICAgICAgLy8gdG8gcGVyc2lzdFxyXG4gICAgICB0aGlzLmludGVybmFsQ2hhbmdlID0gZmFsc2VcclxuXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2JsdXInLCBlKVxyXG4gICAgfSxcclxuICAgIG9uQ2xpY2sgKCkge1xyXG4gICAgICBpZiAodGhpcy5pc0ZvY3VzZWQgfHwgdGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKClcclxuICAgIH0sXHJcbiAgICBvbkZvY3VzIChlKSB7XHJcbiAgICAgIGlmICghdGhpcy4kcmVmcy5pbnB1dCkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy4kcmVmcy5pbnB1dCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKClcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmlzRm9jdXNlZCkge1xyXG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uSW5wdXQgKGUpIHtcclxuICAgICAgdGhpcy5pbnRlcm5hbENoYW5nZSA9IHRydWVcclxuICAgICAgdGhpcy5tYXNrICYmIHRoaXMucmVzZXRTZWxlY3Rpb25zKGUudGFyZ2V0KVxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBlLnRhcmdldC52YWx1ZVxyXG4gICAgICB0aGlzLmJhZElucHV0ID0gZS50YXJnZXQudmFsaWRpdHkgJiYgZS50YXJnZXQudmFsaWRpdHkuYmFkSW5wdXRcclxuICAgIH0sXHJcbiAgICBvbktleURvd24gKGUpIHtcclxuICAgICAgdGhpcy5pbnRlcm5hbENoYW5nZSA9IHRydWVcclxuXHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyKSB0aGlzLiRlbWl0KCdjaGFuZ2UnLCB0aGlzLmludGVybmFsVmFsdWUpXHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdrZXlkb3duJywgZSlcclxuICAgIH0sXHJcbiAgICBvbk1vdXNlRG93biAoZSkge1xyXG4gICAgICAvLyBQcmV2ZW50IGlucHV0IGZyb20gYmVpbmcgYmx1cnJlZFxyXG4gICAgICBpZiAoZS50YXJnZXQgIT09IHRoaXMuJHJlZnMuaW5wdXQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFZJbnB1dC5vcHRpb25zLm1ldGhvZHMub25Nb3VzZURvd24uY2FsbCh0aGlzLCBlKVxyXG4gICAgfSxcclxuICAgIG9uTW91c2VVcCAoZSkge1xyXG4gICAgICBpZiAodGhpcy5oYXNNb3VzZURvd24pIHRoaXMuZm9jdXMoKVxyXG5cclxuICAgICAgVklucHV0Lm9wdGlvbnMubWV0aG9kcy5vbk1vdXNlVXAuY2FsbCh0aGlzLCBlKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19