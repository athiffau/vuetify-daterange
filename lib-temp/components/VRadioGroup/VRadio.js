// Styles
import '../../stylus/components/_radios.styl';
// Components
import VIcon from '../VIcon';
import VLabel from '../VLabel';
// Mixins
import Colorable from '../../mixins/colorable';
import Rippleable from '../../mixins/rippleable';
import Themeable from '../../mixins/themeable';
import Selectable from '../../mixins/selectable';
import { inject as RegistrableInject } from '../../mixins/registrable';
/* @vue/component */
export default {
    name: 'v-radio',
    mixins: [
        Colorable,
        Rippleable,
        RegistrableInject('radio', 'v-radio', 'v-radio-group'),
        Themeable
    ],
    inheritAttrs: false,
    props: {
        color: {
            type: String,
            default: 'accent'
        },
        disabled: Boolean,
        label: String,
        onIcon: {
            type: String,
            default: '$vuetify.icons.radioOn'
        },
        offIcon: {
            type: String,
            default: '$vuetify.icons.radioOff'
        },
        readonly: Boolean,
        value: null
    },
    data: () => ({
        isActive: false,
        isFocused: false,
        parentError: false
    }),
    computed: {
        computedData() {
            return this.setTextColor(!this.parentError && this.isActive && this.color, {
                staticClass: 'v-radio',
                'class': {
                    'v-radio--is-disabled': this.isDisabled,
                    'v-radio--is-focused': this.isFocused,
                    ...this.themeClasses
                }
            });
        },
        computedColor() {
            return this.isActive ? this.color : this.radio.validationState || false;
        },
        computedIcon() {
            return this.isActive
                ? this.onIcon
                : this.offIcon;
        },
        hasState() {
            return this.isActive || !!this.radio.validationState;
        },
        isDisabled() {
            return this.disabled || !!this.radio.disabled;
        },
        isReadonly() {
            return this.readonly || !!this.radio.readonly;
        }
    },
    mounted() {
        this.radio.register(this);
    },
    beforeDestroy() {
        this.radio.unregister(this);
    },
    methods: {
        genInput(...args) {
            // We can't actually use the mixin directly because
            // it's made for standalone components, but its
            // genInput method is exactly what we need
            return Selectable.options.methods.genInput.call(this, ...args);
        },
        genLabel() {
            return this.$createElement(VLabel, {
                on: { click: this.onChange },
                attrs: {
                    for: this.id
                },
                props: {
                    color: this.radio.validationState || false,
                    dark: this.dark,
                    focused: this.hasState,
                    light: this.light
                }
            }, this.$slots.label || this.label);
        },
        genRadio() {
            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input'
            }, [
                this.genInput('radio', {
                    name: this.radio.name || (this.radio._uid ? 'v-radio-' + this.radio._uid : false),
                    value: this.value,
                    ...this.$attrs
                }),
                this.genRipple(this.setTextColor(this.computedColor)),
                this.$createElement(VIcon, this.setTextColor(this.computedColor, {
                    props: {
                        dark: this.dark,
                        light: this.light
                    }
                }), this.computedIcon)
            ]);
        },
        onFocus(e) {
            this.isFocused = true;
            this.$emit('focus', e);
        },
        onBlur(e) {
            this.isFocused = false;
            this.$emit('blur', e);
        },
        onChange() {
            if (this.isDisabled || this.isReadonly)
                return;
            if (!this.isDisabled && (!this.isActive || !this.radio.mandatory)) {
                this.$emit('change', this.value);
            }
        },
        onKeydown() { }
    },
    render(h) {
        return h('div', this.computedData, [
            this.genRadio(),
            this.genLabel()
        ]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlJhZGlvR3JvdXAvVlJhZGlvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLHNDQUFzQyxDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLEVBQ0wsTUFBTSxJQUFJLGlCQUFpQixFQUM1QixNQUFNLDBCQUEwQixDQUFBO0FBRWpDLG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFFZixNQUFNLEVBQUU7UUFDTixTQUFTO1FBQ1QsVUFBVTtRQUNWLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDO1FBQ3RELFNBQVM7S0FDVjtJQUVELFlBQVksRUFBRSxLQUFLO0lBRW5CLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFFBQVE7U0FDbEI7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUUsTUFBTTtRQUNiLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHdCQUF3QjtTQUNsQztRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHlCQUF5QjtTQUNuQztRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFFRCxJQUFJLEVBQUUs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RUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDakM7UUFDSCxDQUFDO1FBQ0QsU0FBUyxLQUFLLENBQUM7S0FDaEI7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxFQUFFO1NBQ2hCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3JhZGlvcy5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXHJcbmltcG9ydCBWTGFiZWwgZnJvbSAnLi4vVkxhYmVsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFJpcHBsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JpcHBsZWFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuaW1wb3J0IFNlbGVjdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3NlbGVjdGFibGUnXHJcbmltcG9ydCB7XHJcbiAgaW5qZWN0IGFzIFJlZ2lzdHJhYmxlSW5qZWN0XHJcbn0gZnJvbSAnLi4vLi4vbWl4aW5zL3JlZ2lzdHJhYmxlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LXJhZGlvJyxcclxuXHJcbiAgbWl4aW5zOiBbXHJcbiAgICBDb2xvcmFibGUsXHJcbiAgICBSaXBwbGVhYmxlLFxyXG4gICAgUmVnaXN0cmFibGVJbmplY3QoJ3JhZGlvJywgJ3YtcmFkaW8nLCAndi1yYWRpby1ncm91cCcpLFxyXG4gICAgVGhlbWVhYmxlXHJcbiAgXSxcclxuXHJcbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGNvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2FjY2VudCdcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGxhYmVsOiBTdHJpbmcsXHJcbiAgICBvbkljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMucmFkaW9PbidcclxuICAgIH0sXHJcbiAgICBvZmZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnJhZGlvT2ZmJ1xyXG4gICAgfSxcclxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxyXG4gICAgdmFsdWU6IG51bGxcclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgaXNGb2N1c2VkOiBmYWxzZSxcclxuICAgIHBhcmVudEVycm9yOiBmYWxzZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY29tcHV0ZWREYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2V0VGV4dENvbG9yKCF0aGlzLnBhcmVudEVycm9yICYmIHRoaXMuaXNBY3RpdmUgJiYgdGhpcy5jb2xvciwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1yYWRpbycsXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgJ3YtcmFkaW8tLWlzLWRpc2FibGVkJzogdGhpcy5pc0Rpc2FibGVkLFxyXG4gICAgICAgICAgJ3YtcmFkaW8tLWlzLWZvY3VzZWQnOiB0aGlzLmlzRm9jdXNlZCxcclxuICAgICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkQ29sb3IgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSA/IHRoaXMuY29sb3IgOiB0aGlzLnJhZGlvLnZhbGlkYXRpb25TdGF0ZSB8fCBmYWxzZVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkSWNvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgPyB0aGlzLm9uSWNvblxyXG4gICAgICAgIDogdGhpcy5vZmZJY29uXHJcbiAgICB9LFxyXG4gICAgaGFzU3RhdGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0FjdGl2ZSB8fCAhIXRoaXMucmFkaW8udmFsaWRhdGlvblN0YXRlXHJcbiAgICB9LFxyXG4gICAgaXNEaXNhYmxlZCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICEhdGhpcy5yYWRpby5kaXNhYmxlZFxyXG4gICAgfSxcclxuICAgIGlzUmVhZG9ubHkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZWFkb25seSB8fCAhIXRoaXMucmFkaW8ucmVhZG9ubHlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMucmFkaW8ucmVnaXN0ZXIodGhpcylcclxuICB9LFxyXG5cclxuICBiZWZvcmVEZXN0cm95ICgpIHtcclxuICAgIHRoaXMucmFkaW8udW5yZWdpc3Rlcih0aGlzKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlbklucHV0ICguLi5hcmdzKSB7XHJcbiAgICAgIC8vIFdlIGNhbid0IGFjdHVhbGx5IHVzZSB0aGUgbWl4aW4gZGlyZWN0bHkgYmVjYXVzZVxyXG4gICAgICAvLyBpdCdzIG1hZGUgZm9yIHN0YW5kYWxvbmUgY29tcG9uZW50cywgYnV0IGl0c1xyXG4gICAgICAvLyBnZW5JbnB1dCBtZXRob2QgaXMgZXhhY3RseSB3aGF0IHdlIG5lZWRcclxuICAgICAgcmV0dXJuIFNlbGVjdGFibGUub3B0aW9ucy5tZXRob2RzLmdlbklucHV0LmNhbGwodGhpcywgLi4uYXJncylcclxuICAgIH0sXHJcbiAgICBnZW5MYWJlbCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZMYWJlbCwge1xyXG4gICAgICAgIG9uOiB7IGNsaWNrOiB0aGlzLm9uQ2hhbmdlIH0sXHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIGZvcjogdGhpcy5pZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLnJhZGlvLnZhbGlkYXRpb25TdGF0ZSB8fCBmYWxzZSxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGZvY3VzZWQ6IHRoaXMuaGFzU3RhdGUsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfSwgdGhpcy4kc2xvdHMubGFiZWwgfHwgdGhpcy5sYWJlbClcclxuICAgIH0sXHJcbiAgICBnZW5SYWRpbyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWlucHV0LS1zZWxlY3Rpb24tY29udHJvbHNfX2lucHV0J1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5JbnB1dCgncmFkaW8nLCB7XHJcbiAgICAgICAgICBuYW1lOiB0aGlzLnJhZGlvLm5hbWUgfHwgKHRoaXMucmFkaW8uX3VpZCA/ICd2LXJhZGlvLScgKyB0aGlzLnJhZGlvLl91aWQgOiBmYWxzZSksXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgICAgIC4uLnRoaXMuJGF0dHJzXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgdGhpcy5nZW5SaXBwbGUodGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb21wdXRlZENvbG9yKSksXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5jb21wdXRlZENvbG9yLCB7XHJcbiAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSksIHRoaXMuY29tcHV0ZWRJY29uKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIG9uRm9jdXMgKGUpIHtcclxuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJywgZSlcclxuICAgIH0sXHJcbiAgICBvbkJsdXIgKGUpIHtcclxuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxyXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZSlcclxuICAgIH0sXHJcbiAgICBvbkNoYW5nZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQgfHwgdGhpcy5pc1JlYWRvbmx5KSByZXR1cm5cclxuXHJcbiAgICAgIGlmICghdGhpcy5pc0Rpc2FibGVkICYmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy5yYWRpby5tYW5kYXRvcnkpKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdGhpcy52YWx1ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uS2V5ZG93biAoKSB7fVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuY29tcHV0ZWREYXRhLCBbXHJcbiAgICAgIHRoaXMuZ2VuUmFkaW8oKSxcclxuICAgICAgdGhpcy5nZW5MYWJlbCgpXHJcbiAgICBdKVxyXG4gIH1cclxufVxyXG4iXX0=