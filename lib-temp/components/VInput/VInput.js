// Styles
import '../../stylus/components/_inputs.styl';
// Components
import VIcon from '../VIcon';
import VLabel from '../VLabel';
import VMessages from '../VMessages';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Validatable from '../../mixins/validatable';
// Utilities
import { convertToUnit, kebabCase } from '../../util/helpers';
import { deprecate } from '../../util/console';
import mixins from '../../util/mixins';
export default mixins(Colorable, Themeable, Validatable
/* @vue/component */
).extend({
    name: 'v-input',
    props: {
        appendIcon: String,
        /** @deprecated */
        appendIconCb: Function,
        backgroundColor: {
            type: String,
            default: ''
        },
        height: [Number, String],
        hideDetails: Boolean,
        hint: String,
        label: String,
        loading: Boolean,
        persistentHint: Boolean,
        prependIcon: String,
        /** @deprecated */
        prependIconCb: Function,
        value: { required: false }
    },
    data() {
        return {
            attrsInput: {},
            lazyValue: this.value,
            hasMouseDown: false
        };
    },
    computed: {
        classes: () => ({}),
        classesInput() {
            return {
                ...this.classes,
                'v-input--has-state': this.hasState,
                'v-input--hide-details': this.hideDetails,
                'v-input--is-label-active': this.isLabelActive,
                'v-input--is-dirty': this.isDirty,
                'v-input--is-disabled': this.disabled,
                'v-input--is-focused': this.isFocused,
                'v-input--is-loading': this.loading !== false && this.loading !== undefined,
                'v-input--is-readonly': this.readonly,
                ...this.themeClasses
            };
        },
        directivesInput() {
            return [];
        },
        hasHint() {
            return !this.hasMessages &&
                this.hint &&
                (this.persistentHint || this.isFocused);
        },
        hasLabel() {
            return Boolean(this.$slots.label || this.label);
        },
        // Proxy for `lazyValue`
        // This allows an input
        // to function without
        // a provided model
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit(this.$_modelEvent, val);
            }
        },
        isDirty() {
            return !!this.lazyValue;
        },
        isDisabled() {
            return Boolean(this.disabled || this.readonly);
        },
        isLabelActive() {
            return this.isDirty;
        }
    },
    watch: {
        value(val) {
            this.lazyValue = val;
        }
    },
    beforeCreate() {
        // v-radio-group needs to emit a different event
        // https://github.com/vuetifyjs/vuetify/issues/4752
        this.$_modelEvent = (this.$options.model && this.$options.model.event) || 'input';
    },
    methods: {
        genContent() {
            return [
                this.genPrependSlot(),
                this.genControl(),
                this.genAppendSlot()
            ];
        },
        genControl() {
            return this.$createElement('div', {
                staticClass: 'v-input__control'
            }, [
                this.genInputSlot(),
                this.genMessages()
            ]);
        },
        genDefaultSlot() {
            return [
                this.genLabel(),
                this.$slots.default
            ];
        },
        // TODO: remove shouldDeprecate (2.0), used for clearIcon
        genIcon(type, cb, shouldDeprecate = true) {
            const icon = this[`${type}Icon`];
            const eventName = `click:${kebabCase(type)}`;
            cb = cb || this[`${type}IconCb`];
            if (shouldDeprecate && type && cb) {
                deprecate(`:${type}-icon-cb`, `@${eventName}`, this);
            }
            const data = {
                props: {
                    color: this.validationState,
                    dark: this.dark,
                    disabled: this.disabled,
                    light: this.light
                },
                on: !(this.$listeners[eventName] || cb)
                    ? undefined
                    : {
                        click: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.$emit(eventName, e);
                            cb && cb(e);
                        },
                        // Container has mouseup event that will
                        // trigger menu open if enclosed
                        mouseup: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
            };
            return this.$createElement('div', {
                staticClass: `v-input__icon v-input__icon--${kebabCase(type)}`,
                key: `${type}${icon}`
            }, [
                this.$createElement(VIcon, data, icon)
            ]);
        },
        genInputSlot() {
            return this.$createElement('div', this.setBackgroundColor(this.backgroundColor, {
                staticClass: 'v-input__slot',
                style: { height: convertToUnit(this.height) },
                directives: this.directivesInput,
                on: {
                    click: this.onClick,
                    mousedown: this.onMouseDown,
                    mouseup: this.onMouseUp
                },
                ref: 'input-slot'
            }), [this.genDefaultSlot()]);
        },
        genLabel() {
            if (!this.hasLabel)
                return null;
            return this.$createElement(VLabel, {
                props: {
                    color: this.validationState,
                    dark: this.dark,
                    focused: this.hasState,
                    for: this.$attrs.id,
                    light: this.light
                }
            }, this.$slots.label || this.label);
        },
        genMessages() {
            if (this.hideDetails)
                return null;
            const messages = this.hasHint
                ? [this.hint]
                : this.validations;
            return this.$createElement(VMessages, {
                props: {
                    color: this.hasHint ? '' : this.validationState,
                    dark: this.dark,
                    light: this.light,
                    value: (this.hasMessages || this.hasHint) ? messages : []
                }
            });
        },
        genSlot(type, location, slot) {
            if (!slot.length)
                return null;
            const ref = `${type}-${location}`;
            return this.$createElement('div', {
                staticClass: `v-input__${ref}`,
                ref
            }, slot);
        },
        genPrependSlot() {
            const slot = [];
            if (this.$slots.prepend) {
                slot.push(this.$slots.prepend);
            }
            else if (this.prependIcon) {
                slot.push(this.genIcon('prepend'));
            }
            return this.genSlot('prepend', 'outer', slot);
        },
        genAppendSlot() {
            const slot = [];
            // Append icon for text field was really
            // an appended inner icon, v-text-field
            // will overwrite this method in order to obtain
            // backwards compat
            if (this.$slots.append) {
                slot.push(this.$slots.append);
            }
            else if (this.appendIcon) {
                slot.push(this.genIcon('append'));
            }
            return this.genSlot('append', 'outer', slot);
        },
        onClick(e) {
            this.$emit('click', e);
        },
        onMouseDown(e) {
            this.hasMouseDown = true;
            this.$emit('mousedown', e);
        },
        onMouseUp(e) {
            this.hasMouseDown = false;
            this.$emit('mouseup', e);
        }
    },
    render(h) {
        return h('div', this.setTextColor(this.validationState, {
            staticClass: 'v-input',
            attrs: this.attrsInput,
            'class': this.classesInput
        }), this.genContent());
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVklucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVklucHV0L1ZJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtBQUU3QyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQTtBQUM5QixPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFFcEMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sV0FBVyxNQUFNLDBCQUEwQixDQUFBO0FBRWxELFlBQVk7QUFDWixPQUFPLEVBQ0wsYUFBYSxFQUNiLFNBQVMsRUFDVixNQUFNLG9CQUFvQixDQUFBO0FBQzNCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM5QyxPQUFPLE1BQXNCLE1BQU0sbUJBQW1CLENBQUE7QUFTdEQsZUFBZSxNQUFNLENBU25CLFNBQVMsRUFDVCxTQUFTLEVBQ1QsV0FBVztBQUNYLG9CQUFvQjtDQUNyQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxTQUFTO0lBRWYsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFLE1BQU07UUFDbEIsa0JBQWtCO1FBQ2xCLFlBQVksRUFBRSxRQUFRO1FBQ3RCLGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDeEIsV0FBVyxFQUFFLE9BQU87UUFDcEIsSUFBSSxFQUFFLE1BQU07UUFDWixLQUFLLEVBQUUsTUFBTTtRQUNiLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLGNBQWMsRUFBRSxPQUFPO1FBQ3ZCLFdBQVcsRUFBRSxN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QUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7YUFDbEM7WUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM5QyxDQUFDO1FBQ0QsT0FBTyxDQUFFLENBQVE7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN4QixDQUFDO1FBQ0QsV0FBVyxDQUFFLENBQVE7WUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDNUIsQ0FBQztRQUNELFNBQVMsQ0FBRSxDQUFRO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzFCLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0RCxXQUFXLEVBQUUsU0FBUztZQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQzNCLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUN4QixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2lucHV0cy5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXHJcbmltcG9ydCBWTGFiZWwgZnJvbSAnLi4vVkxhYmVsJ1xyXG5pbXBvcnQgVk1lc3NhZ2VzIGZyb20gJy4uL1ZNZXNzYWdlcydcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuaW1wb3J0IFZhbGlkYXRhYmxlIGZyb20gJy4uLy4uL21peGlucy92YWxpZGF0YWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQge1xyXG4gIGNvbnZlcnRUb1VuaXQsXHJcbiAga2ViYWJDYXNlXHJcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBkZXByZWNhdGUgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IFZ1ZSwgeyBWTm9kZSwgVk5vZGVEYXRhIH0gZnJvbSAndnVlJ1xyXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIFZ1ZSB7XHJcbiAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZSAqL1xyXG4gICRfbW9kZWxFdmVudDogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcclxuLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXHJcbiAgRXh0cmFjdFZ1ZTxbXHJcbiAgICB0eXBlb2YgQ29sb3JhYmxlLFxyXG4gICAgdHlwZW9mIFRoZW1lYWJsZSxcclxuICAgIHR5cGVvZiBWYWxpZGF0YWJsZVxyXG4gIF0+XHJcbi8qIGVzbGludC1lbmFibGUgaW5kZW50ICovXHJcbj4oXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFRoZW1lYWJsZSxcclxuICBWYWxpZGF0YWJsZVxyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1pbnB1dCcsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhcHBlbmRJY29uOiBTdHJpbmcsXHJcbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgIGFwcGVuZEljb25DYjogRnVuY3Rpb24sXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJ1xyXG4gICAgfSxcclxuICAgIGhlaWdodDogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGhpZGVEZXRhaWxzOiBCb29sZWFuLFxyXG4gICAgaGludDogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFN0cmluZyxcclxuICAgIGxvYWRpbmc6IEJvb2xlYW4sXHJcbiAgICBwZXJzaXN0ZW50SGludDogQm9vbGVhbixcclxuICAgIHByZXBlbmRJY29uOiBTdHJpbmcsXHJcbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgIHByZXBlbmRJY29uQ2I6IEZ1bmN0aW9uLFxyXG4gICAgdmFsdWU6IHsgcmVxdWlyZWQ6IGZhbHNlIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF0dHJzSW5wdXQ6IHt9LFxyXG4gICAgICBsYXp5VmFsdWU6IHRoaXMudmFsdWUgYXMgYW55LFxyXG4gICAgICBoYXNNb3VzZURvd246IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXM6ICgpID0+ICh7fSksXHJcbiAgICBjbGFzc2VzSW5wdXQgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4udGhpcy5jbGFzc2VzLFxyXG4gICAgICAgICd2LWlucHV0LS1oYXMtc3RhdGUnOiB0aGlzLmhhc1N0YXRlLFxyXG4gICAgICAgICd2LWlucHV0LS1oaWRlLWRldGFpbHMnOiB0aGlzLmhpZGVEZXRhaWxzLFxyXG4gICAgICAgICd2LWlucHV0LS1pcy1sYWJlbC1hY3RpdmUnOiB0aGlzLmlzTGFiZWxBY3RpdmUsXHJcbiAgICAgICAgJ3YtaW5wdXQtLWlzLWRpcnR5JzogdGhpcy5pc0RpcnR5LFxyXG4gICAgICAgICd2LWlucHV0LS1pcy1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgJ3YtaW5wdXQtLWlzLWZvY3VzZWQnOiB0aGlzLmlzRm9jdXNlZCxcclxuICAgICAgICAndi1pbnB1dC0taXMtbG9hZGluZyc6IHRoaXMubG9hZGluZyAhPT0gZmFsc2UgJiYgdGhpcy5sb2FkaW5nICE9PSB1bmRlZmluZWQsXHJcbiAgICAgICAgJ3YtaW5wdXQtLWlzLXJlYWRvbmx5JzogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGlyZWN0aXZlc0lucHV0ICgpIHtcclxuICAgICAgcmV0dXJuIFtdXHJcbiAgICB9LFxyXG4gICAgaGFzSGludCAoKSB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5oYXNNZXNzYWdlcyAmJlxyXG4gICAgICAgIHRoaXMuaGludCAmJlxyXG4gICAgICAgICh0aGlzLnBlcnNpc3RlbnRIaW50IHx8IHRoaXMuaXNGb2N1c2VkKVxyXG4gICAgfSxcclxuICAgIGhhc0xhYmVsICgpIHtcclxuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy4kc2xvdHMubGFiZWwgfHwgdGhpcy5sYWJlbClcclxuICAgIH0sXHJcbiAgICAvLyBQcm94eSBmb3IgYGxhenlWYWx1ZWBcclxuICAgIC8vIFRoaXMgYWxsb3dzIGFuIGlucHV0XHJcbiAgICAvLyB0byBmdW5jdGlvbiB3aXRob3V0XHJcbiAgICAvLyBhIHByb3ZpZGVkIG1vZGVsXHJcbiAgICBpbnRlcm5hbFZhbHVlOiB7XHJcbiAgICAgIGdldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGF6eVZhbHVlXHJcbiAgICAgIH0sXHJcbiAgICAgIHNldCAodmFsOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmxhenlWYWx1ZSA9IHZhbFxyXG4gICAgICAgIHRoaXMuJGVtaXQodGhpcy4kX21vZGVsRXZlbnQsIHZhbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzRGlydHkgKCkge1xyXG4gICAgICByZXR1cm4gISF0aGlzLmxhenlWYWx1ZVxyXG4gICAgfSxcclxuICAgIGlzRGlzYWJsZWQgKCkge1xyXG4gICAgICByZXR1cm4gQm9vbGVhbih0aGlzLmRpc2FibGVkIHx8IHRoaXMucmVhZG9ubHkpXHJcbiAgICB9LFxyXG4gICAgaXNMYWJlbEFjdGl2ZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzRGlydHlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgdmFsdWUgKHZhbCkge1xyXG4gICAgICB0aGlzLmxhenlWYWx1ZSA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZUNyZWF0ZSAoKSB7XHJcbiAgICAvLyB2LXJhZGlvLWdyb3VwIG5lZWRzIHRvIGVtaXQgYSBkaWZmZXJlbnQgZXZlbnRcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS92dWV0aWZ5anMvdnVldGlmeS9pc3N1ZXMvNDc1MlxyXG4gICAgdGhpcy4kX21vZGVsRXZlbnQgPSAodGhpcy4kb3B0aW9ucy5tb2RlbCAmJiB0aGlzLiRvcHRpb25zLm1vZGVsLmV2ZW50KSB8fCAnaW5wdXQnXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQ29udGVudCAoKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgdGhpcy5nZW5QcmVwZW5kU2xvdCgpLFxyXG4gICAgICAgIHRoaXMuZ2VuQ29udHJvbCgpLFxyXG4gICAgICAgIHRoaXMuZ2VuQXBwZW5kU2xvdCgpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBnZW5Db250cm9sICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXRfX2NvbnRyb2wnXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbklucHV0U2xvdCgpLFxyXG4gICAgICAgIHRoaXMuZ2VuTWVzc2FnZXMoKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB0aGlzLmdlbkxhYmVsKCksXHJcbiAgICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgLy8gVE9ETzogcmVtb3ZlIHNob3VsZERlcHJlY2F0ZSAoMi4wKSwgdXNlZCBmb3IgY2xlYXJJY29uXHJcbiAgICBnZW5JY29uIChcclxuICAgICAgdHlwZTogc3RyaW5nLFxyXG4gICAgICBjYj86IChlOiBFdmVudCkgPT4gdm9pZCxcclxuICAgICAgc2hvdWxkRGVwcmVjYXRlID0gdHJ1ZVxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IGljb24gPSAodGhpcyBhcyBhbnkpW2Ake3R5cGV9SWNvbmBdXHJcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGBjbGljazoke2tlYmFiQ2FzZSh0eXBlKX1gXHJcbiAgICAgIGNiID0gY2IgfHwgKHRoaXMgYXMgYW55KVtgJHt0eXBlfUljb25DYmBdXHJcblxyXG4gICAgICBpZiAoc2hvdWxkRGVwcmVjYXRlICYmIHR5cGUgJiYgY2IpIHtcclxuICAgICAgICBkZXByZWNhdGUoYDoke3R5cGV9LWljb24tY2JgLCBgQCR7ZXZlbnROYW1lfWAsIHRoaXMpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRhdGE6IFZOb2RlRGF0YSA9IHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMudmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246ICEodGhpcy4kbGlzdGVuZXJzW2V2ZW50TmFtZV0gfHwgY2IpXHJcbiAgICAgICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgIGNsaWNrOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnROYW1lLCBlKVxyXG4gICAgICAgICAgICAgIGNiICYmIGNiKGUpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIENvbnRhaW5lciBoYXMgbW91c2V1cCBldmVudCB0aGF0IHdpbGxcclxuICAgICAgICAgICAgLy8gdHJpZ2dlciBtZW51IG9wZW4gaWYgZW5jbG9zZWRcclxuICAgICAgICAgICAgbW91c2V1cDogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6IGB2LWlucHV0X19pY29uIHYtaW5wdXRfX2ljb24tLSR7a2ViYWJDYXNlKHR5cGUpfWAsXHJcbiAgICAgICAga2V5OiBgJHt0eXBlfSR7aWNvbn1gXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgVkljb24sXHJcbiAgICAgICAgICBkYXRhLFxyXG4gICAgICAgICAgaWNvblxyXG4gICAgICAgIClcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5JbnB1dFNsb3QgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5iYWNrZ3JvdW5kQ29sb3IsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXRfX3Nsb3QnLFxyXG4gICAgICAgIHN0eWxlOiB7IGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodCkgfSxcclxuICAgICAgICBkaXJlY3RpdmVzOiB0aGlzLmRpcmVjdGl2ZXNJbnB1dCxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2s6IHRoaXMub25DbGljayxcclxuICAgICAgICAgIG1vdXNlZG93bjogdGhpcy5vbk1vdXNlRG93bixcclxuICAgICAgICAgIG1vdXNldXA6IHRoaXMub25Nb3VzZVVwXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICdpbnB1dC1zbG90J1xyXG4gICAgICB9KSwgW3RoaXMuZ2VuRGVmYXVsdFNsb3QoKV0pXHJcbiAgICB9LFxyXG4gICAgZ2VuTGFiZWwgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzTGFiZWwpIHJldHVybiBudWxsXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWTGFiZWwsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMudmFsaWRhdGlvblN0YXRlLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZm9jdXNlZDogdGhpcy5oYXNTdGF0ZSxcclxuICAgICAgICAgIGZvcjogdGhpcy4kYXR0cnMuaWQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfSwgdGhpcy4kc2xvdHMubGFiZWwgfHwgdGhpcy5sYWJlbClcclxuICAgIH0sXHJcbiAgICBnZW5NZXNzYWdlcyAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmhpZGVEZXRhaWxzKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLmhhc0hpbnRcclxuICAgICAgICA/IFt0aGlzLmhpbnRdXHJcbiAgICAgICAgOiB0aGlzLnZhbGlkYXRpb25zXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWTWVzc2FnZXMsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuaGFzSGludCA/ICcnIDogdGhpcy52YWxpZGF0aW9uU3RhdGUsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIHZhbHVlOiAodGhpcy5oYXNNZXNzYWdlcyB8fCB0aGlzLmhhc0hpbnQpID8gbWVzc2FnZXMgOiBbXVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5TbG90IChcclxuICAgICAgdHlwZTogc3RyaW5nLFxyXG4gICAgICBsb2NhdGlvbjogc3RyaW5nLFxyXG4gICAgICBzbG90OiAoVk5vZGUgfCBWTm9kZVtdKVtdXHJcbiAgICApIHtcclxuICAgICAgaWYgKCFzbG90Lmxlbmd0aCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIGNvbnN0IHJlZiA9IGAke3R5cGV9LSR7bG9jYXRpb259YFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogYHYtaW5wdXRfXyR7cmVmfWAsXHJcbiAgICAgICAgcmVmXHJcbiAgICAgIH0sIHNsb3QpXHJcbiAgICB9LFxyXG4gICAgZ2VuUHJlcGVuZFNsb3QgKCkge1xyXG4gICAgICBjb25zdCBzbG90ID0gW11cclxuXHJcbiAgICAgIGlmICh0aGlzLiRzbG90cy5wcmVwZW5kKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuJHNsb3RzLnByZXBlbmQpXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVwZW5kSWNvbikge1xyXG4gICAgICAgIHNsb3QucHVzaCh0aGlzLmdlbkljb24oJ3ByZXBlbmQnKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuU2xvdCgncHJlcGVuZCcsICdvdXRlcicsIHNsb3QpXHJcbiAgICB9LFxyXG4gICAgZ2VuQXBwZW5kU2xvdCAoKSB7XHJcbiAgICAgIGNvbnN0IHNsb3QgPSBbXVxyXG5cclxuICAgICAgLy8gQXBwZW5kIGljb24gZm9yIHRleHQgZmllbGQgd2FzIHJlYWxseVxyXG4gICAgICAvLyBhbiBhcHBlbmRlZCBpbm5lciBpY29uLCB2LXRleHQtZmllbGRcclxuICAgICAgLy8gd2lsbCBvdmVyd3JpdGUgdGhpcyBtZXRob2QgaW4gb3JkZXIgdG8gb2J0YWluXHJcbiAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXRcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzLmFwcGVuZCkge1xyXG4gICAgICAgIHNsb3QucHVzaCh0aGlzLiRzbG90cy5hcHBlbmQpXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hcHBlbmRJY29uKSB7XHJcbiAgICAgICAgc2xvdC5wdXNoKHRoaXMuZ2VuSWNvbignYXBwZW5kJykpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdlblNsb3QoJ2FwcGVuZCcsICdvdXRlcicsIHNsb3QpXHJcbiAgICB9LFxyXG4gICAgb25DbGljayAoZTogRXZlbnQpIHtcclxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxyXG4gICAgfSxcclxuICAgIG9uTW91c2VEb3duIChlOiBFdmVudCkge1xyXG4gICAgICB0aGlzLmhhc01vdXNlRG93biA9IHRydWVcclxuICAgICAgdGhpcy4kZW1pdCgnbW91c2Vkb3duJywgZSlcclxuICAgIH0sXHJcbiAgICBvbk1vdXNlVXAgKGU6IEV2ZW50KSB7XHJcbiAgICAgIHRoaXMuaGFzTW91c2VEb3duID0gZmFsc2VcclxuICAgICAgdGhpcy4kZW1pdCgnbW91c2V1cCcsIGUpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMudmFsaWRhdGlvblN0YXRlLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1pbnB1dCcsXHJcbiAgICAgIGF0dHJzOiB0aGlzLmF0dHJzSW5wdXQsXHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3Nlc0lucHV0XHJcbiAgICB9KSwgdGhpcy5nZW5Db250ZW50KCkpXHJcbiAgfVxyXG59KVxyXG4iXX0=