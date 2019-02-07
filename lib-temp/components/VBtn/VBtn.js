// Styles
import '../../stylus/components/_buttons.styl';
import mixins from '../../util/mixins';
// Components
import VProgressCircular from '../VProgressCircular';
// Mixins
import Colorable from '../../mixins/colorable';
import { factory as GroupableFactory } from '../../mixins/groupable';
import Positionable from '../../mixins/positionable';
import Routable from '../../mixins/routable';
import Themeable from '../../mixins/themeable';
import { factory as ToggleableFactory } from '../../mixins/toggleable';
// Utilities
import { getObjectValueByPath } from '../../util/helpers';
const baseMixins = mixins(Colorable, Routable, Positionable, Themeable, GroupableFactory('btnToggle'), ToggleableFactory('inputValue')
/* @vue/component */
);
export default baseMixins.extend().extend({
    name: 'v-btn',
    props: {
        activeClass: {
            type: String,
            default: 'v-btn--active'
        },
        block: Boolean,
        depressed: Boolean,
        fab: Boolean,
        flat: Boolean,
        icon: Boolean,
        large: Boolean,
        loading: Boolean,
        outline: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: null
        },
        round: Boolean,
        small: Boolean,
        tag: {
            type: String,
            default: 'button'
        },
        type: {
            type: String,
            default: 'button'
        },
        value: null
    },
    computed: {
        classes() {
            return {
                'v-btn': true,
                [this.activeClass]: this.isActive,
                'v-btn--absolute': this.absolute,
                'v-btn--block': this.block,
                'v-btn--bottom': this.bottom,
                'v-btn--disabled': this.disabled,
                'v-btn--flat': this.flat,
                'v-btn--floating': this.fab,
                'v-btn--fixed': this.fixed,
                'v-btn--icon': this.icon,
                'v-btn--large': this.large,
                'v-btn--left': this.left,
                'v-btn--loader': this.loading,
                'v-btn--outline': this.outline,
                'v-btn--depressed': (this.depressed && !this.flat) || this.outline,
                'v-btn--right': this.right,
                'v-btn--round': this.round,
                'v-btn--router': this.to,
                'v-btn--small': this.small,
                'v-btn--top': this.top,
                ...this.themeClasses
            };
        },
        computedRipple() {
            const defaultRipple = this.icon || this.fab ? { circle: true } : true;
            if (this.disabled)
                return false;
            else
                return this.ripple !== null ? this.ripple : defaultRipple;
        }
    },
    watch: {
        '$route': 'onRouteChange'
    },
    methods: {
        // Prevent focus to match md spec
        click(e) {
            !this.fab &&
                e.detail &&
                this.$el.blur();
            this.$emit('click', e);
            this.btnToggle && this.toggle();
        },
        genContent() {
            return this.$createElement('div', { 'class': 'v-btn__content' }, this.$slots.default);
        },
        genLoader() {
            return this.$createElement('span', {
                class: 'v-btn__loading'
            }, this.$slots.loader || [this.$createElement(VProgressCircular, {
                    props: {
                        indeterminate: true,
                        size: 23,
                        width: 2
                    }
                })]);
        },
        onRouteChange() {
            if (!this.to || !this.$refs.link)
                return;
            const path = `_vnode.data.class.${this.activeClass}`;
            this.$nextTick(() => {
                if (getObjectValueByPath(this.$refs.link, path)) {
                    this.toggle();
                }
            });
        }
    },
    render(h) {
        const setColor = (!this.outline && !this.flat && !this.disabled) ? this.setBackgroundColor : this.setTextColor;
        const { tag, data } = this.generateRouteLink(this.classes);
        const children = [
            this.genContent(),
            this.loading && this.genLoader()
        ];
        if (tag === 'button')
            data.attrs.type = this.type;
        data.attrs.value = ['string', 'number'].includes(typeof this.value)
            ? this.value
            : JSON.stringify(this.value);
        if (this.btnToggle) {
            data.ref = 'link';
        }
        return h(tag, setColor(this.color, data), children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJ0bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCdG4vVkJ0bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx1Q0FBdUMsQ0FBQTtBQUs5QyxPQUFPLE1BQXNCLE1BQU0sbUJBQW1CLENBQUE7QUFHdEQsYUFBYTtBQUNiLE9BQU8saUJBQWlCLE1BQU0sc0JBQXNCLENBQUE7QUFFcEQsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLElBQUksZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNwRSxPQUFPLFlBQVksTUFBTSwyQkFBMkIsQ0FBQTtBQUNwRCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUE7QUFFdEUsWUFBWTtBQUNaLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRXpELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FDdkIsU0FBUyxFQUNULFFBQVEsRUFDUixZQUFZLEVBQ1osU0FBUyxFQUNULGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUM3QixpQkFBaUIsQ0FBQyxZQUFZLENBQUM7QUFDL0Isb0JBQW9CO0NBQ3JCLENBQUE7QUFLRCxlQUFlLFVBQVUsQ0FBQyxNQUFNLEVBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLE9BQU87SUFFYixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxlQUFlO1NBQ3pCO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxTQUFTLEVBQUUsT0FBTztRQUNsQixHQUFHLEVBQUUsT0FBTztRQUNaLElBQUksRUFB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QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUQsTUFBTSxRQUFRLEdBQUc7WUFDZixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtTQUNqQyxDQUFBO1FBRUQsSUFBSSxHQUFHLEtBQUssUUFBUTtZQUFFLElBQUksQ0FBQyxLQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7UUFFbEQsSUFBSSxDQUFDLEtBQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNsRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFOUIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFBO1NBQ2xCO1FBRUQsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3JELENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fYnV0dG9ucy5zdHlsJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IFJpcHBsZU9wdGlvbnMgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3JpcHBsZSdcclxuXHJcbi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZQcm9ncmVzc0NpcmN1bGFyIGZyb20gJy4uL1ZQcm9ncmVzc0NpcmN1bGFyJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcclxuaW1wb3J0IFBvc2l0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcG9zaXRpb25hYmxlJ1xyXG5pbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcbmltcG9ydCB7IGZhY3RvcnkgYXMgVG9nZ2xlYWJsZUZhY3RvcnkgfSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgeyBnZXRPYmplY3RWYWx1ZUJ5UGF0aCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbmNvbnN0IGJhc2VNaXhpbnMgPSBtaXhpbnMoXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFJvdXRhYmxlLFxyXG4gIFBvc2l0aW9uYWJsZSxcclxuICBUaGVtZWFibGUsXHJcbiAgR3JvdXBhYmxlRmFjdG9yeSgnYnRuVG9nZ2xlJyksXHJcbiAgVG9nZ2xlYWJsZUZhY3RvcnkoJ2lucHV0VmFsdWUnKVxyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbilcclxuaW50ZXJmYWNlIG9wdGlvbnMgZXh0ZW5kcyBFeHRyYWN0VnVlPHR5cGVvZiBiYXNlTWl4aW5zPiB7XHJcbiAgJGVsOiBIVE1MRWxlbWVudFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBiYXNlTWl4aW5zLmV4dGVuZDxvcHRpb25zPigpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtYnRuJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFjdGl2ZUNsYXNzOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3YtYnRuLS1hY3RpdmUnXHJcbiAgICB9LFxyXG4gICAgYmxvY2s6IEJvb2xlYW4sXHJcbiAgICBkZXByZXNzZWQ6IEJvb2xlYW4sXHJcbiAgICBmYWI6IEJvb2xlYW4sXHJcbiAgICBmbGF0OiBCb29sZWFuLFxyXG4gICAgaWNvbjogQm9vbGVhbixcclxuICAgIGxhcmdlOiBCb29sZWFuLFxyXG4gICAgbG9hZGluZzogQm9vbGVhbixcclxuICAgIG91dGxpbmU6IEJvb2xlYW4sXHJcbiAgICByaXBwbGU6IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIE9iamVjdF0sXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICByb3VuZDogQm9vbGVhbixcclxuICAgIHNtYWxsOiBCb29sZWFuLFxyXG4gICAgdGFnOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2J1dHRvbidcclxuICAgIH0sXHJcbiAgICB0eXBlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2J1dHRvbidcclxuICAgIH0sXHJcbiAgICB2YWx1ZTogbnVsbCBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxhbnk+XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IGFueSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtYnRuJzogdHJ1ZSxcclxuICAgICAgICBbdGhpcy5hY3RpdmVDbGFzc106IHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgJ3YtYnRuLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXHJcbiAgICAgICAgJ3YtYnRuLS1ibG9jayc6IHRoaXMuYmxvY2ssXHJcbiAgICAgICAgJ3YtYnRuLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcclxuICAgICAgICAndi1idG4tLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAndi1idG4tLWZsYXQnOiB0aGlzLmZsYXQsXHJcbiAgICAgICAgJ3YtYnRuLS1mbG9hdGluZyc6IHRoaXMuZmFiLFxyXG4gICAgICAgICd2LWJ0bi0tZml4ZWQnOiB0aGlzLmZpeGVkLFxyXG4gICAgICAgICd2LWJ0bi0taWNvbic6IHRoaXMuaWNvbixcclxuICAgICAgICAndi1idG4tLWxhcmdlJzogdGhpcy5sYXJnZSxcclxuICAgICAgICAndi1idG4tLWxlZnQnOiB0aGlzLmxlZnQsXHJcbiAgICAgICAgJ3YtYnRuLS1sb2FkZXInOiB0aGlzLmxvYWRpbmcsXHJcbiAgICAgICAgJ3YtYnRuLS1vdXRsaW5lJzogdGhpcy5vdXRsaW5lLFxyXG4gICAgICAgICd2LWJ0bi0tZGVwcmVzc2VkJzogKHRoaXMuZGVwcmVzc2VkICYmICF0aGlzLmZsYXQpIHx8IHRoaXMub3V0bGluZSxcclxuICAgICAgICAndi1idG4tLXJpZ2h0JzogdGhpcy5yaWdodCxcclxuICAgICAgICAndi1idG4tLXJvdW5kJzogdGhpcy5yb3VuZCxcclxuICAgICAgICAndi1idG4tLXJvdXRlcic6IHRoaXMudG8sXHJcbiAgICAgICAgJ3YtYnRuLS1zbWFsbCc6IHRoaXMuc21hbGwsXHJcbiAgICAgICAgJ3YtYnRuLS10b3AnOiB0aGlzLnRvcCxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRSaXBwbGUgKCk6IFJpcHBsZU9wdGlvbnMgfCBib29sZWFuIHtcclxuICAgICAgY29uc3QgZGVmYXVsdFJpcHBsZSA9IHRoaXMuaWNvbiB8fCB0aGlzLmZhYiA/IHsgY2lyY2xlOiB0cnVlIH0gOiB0cnVlXHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm4gZmFsc2VcclxuICAgICAgZWxzZSByZXR1cm4gdGhpcy5yaXBwbGUgIT09IG51bGwgPyB0aGlzLnJpcHBsZSA6IGRlZmF1bHRSaXBwbGVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgJyRyb3V0ZSc6ICdvblJvdXRlQ2hhbmdlJ1xyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIC8vIFByZXZlbnQgZm9jdXMgdG8gbWF0Y2ggbWQgc3BlY1xyXG4gICAgY2xpY2sgKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgICAgIXRoaXMuZmFiICYmXHJcbiAgICAgIGUuZGV0YWlsICYmXHJcbiAgICAgIHRoaXMuJGVsLmJsdXIoKVxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxyXG5cclxuICAgICAgdGhpcy5idG5Ub2dnbGUgJiYgdGhpcy50b2dnbGUoKVxyXG4gICAgfSxcclxuICAgIGdlbkNvbnRlbnQgKCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgJ2RpdicsXHJcbiAgICAgICAgeyAnY2xhc3MnOiAndi1idG5fX2NvbnRlbnQnIH0sXHJcbiAgICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdFxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgZ2VuTG9hZGVyICgpOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzcGFuJywge1xyXG4gICAgICAgIGNsYXNzOiAndi1idG5fX2xvYWRpbmcnXHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmxvYWRlciB8fCBbdGhpcy4kY3JlYXRlRWxlbWVudChWUHJvZ3Jlc3NDaXJjdWxhciwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBpbmRldGVybWluYXRlOiB0cnVlLFxyXG4gICAgICAgICAgc2l6ZTogMjMsXHJcbiAgICAgICAgICB3aWR0aDogMlxyXG4gICAgICAgIH1cclxuICAgICAgfSldKVxyXG4gICAgfSxcclxuICAgIG9uUm91dGVDaGFuZ2UgKCkge1xyXG4gICAgICBpZiAoIXRoaXMudG8gfHwgIXRoaXMuJHJlZnMubGluaykgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBwYXRoID0gYF92bm9kZS5kYXRhLmNsYXNzLiR7dGhpcy5hY3RpdmVDbGFzc31gXHJcblxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgaWYgKGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuJHJlZnMubGluaywgcGF0aCkpIHtcclxuICAgICAgICAgIHRoaXMudG9nZ2xlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3Qgc2V0Q29sb3IgPSAoIXRoaXMub3V0bGluZSAmJiAhdGhpcy5mbGF0ICYmICF0aGlzLmRpc2FibGVkKSA/IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yIDogdGhpcy5zZXRUZXh0Q29sb3JcclxuICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKHRoaXMuY2xhc3NlcylcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gW1xyXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcclxuICAgICAgdGhpcy5sb2FkaW5nICYmIHRoaXMuZ2VuTG9hZGVyKClcclxuICAgIF1cclxuXHJcbiAgICBpZiAodGFnID09PSAnYnV0dG9uJykgZGF0YS5hdHRycyEudHlwZSA9IHRoaXMudHlwZVxyXG5cclxuICAgIGRhdGEuYXR0cnMhLnZhbHVlID0gWydzdHJpbmcnLCAnbnVtYmVyJ10uaW5jbHVkZXModHlwZW9mIHRoaXMudmFsdWUpXHJcbiAgICAgID8gdGhpcy52YWx1ZVxyXG4gICAgICA6IEpTT04uc3RyaW5naWZ5KHRoaXMudmFsdWUpXHJcblxyXG4gICAgaWYgKHRoaXMuYnRuVG9nZ2xlKSB7XHJcbiAgICAgIGRhdGEucmVmID0gJ2xpbmsnXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgodGFnLCBzZXRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSwgY2hpbGRyZW4pXHJcbiAgfVxyXG59KVxyXG4iXX0=