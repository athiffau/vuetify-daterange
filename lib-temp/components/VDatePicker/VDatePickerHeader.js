import '../../stylus/components/_date-picker-header.styl';
// Components
import VBtn from '../VBtn';
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Utils
import { createNativeLocaleFormatter, monthChange } from './util';
import mixins from '../../util/mixins';
export default mixins(Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-date-picker-header',
    props: {
        allowDateChange: Boolean,
        disabled: Boolean,
        format: Function,
        hideDisabled: Boolean,
        locale: {
            type: String,
            default: 'en-us'
        },
        min: String,
        max: String,
        nextIcon: {
            type: String,
            default: '$vuetify.icons.next'
        },
        prevIcon: {
            type: String,
            default: '$vuetify.icons.prev'
        },
        readonly: Boolean,
        value: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            isReversing: false
        };
    },
    computed: {
        formatter() {
            if (this.format) {
                return this.format;
            }
            else if (String(this.value).split('-')[1]) {
                return createNativeLocaleFormatter(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }, { length: 7 });
            }
            else {
                return createNativeLocaleFormatter(this.locale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 });
            }
        }
    },
    watch: {
        value(newVal, oldVal) {
            this.isReversing = newVal < oldVal;
        }
    },
    methods: {
        genBtn(change) {
            const disabled = this.disabled ||
                !this.allowDateChange ||
                (change < 0 && this.min && this.calculateChange(change) < this.min) ||
                (change > 0 && this.max && this.calculateChange(change) > this.max);
            return this.hideDisabled &&
                disabled
                ? null
                : this.$createElement(VBtn, {
                    props: {
                        dark: this.dark,
                        disabled,
                        icon: true,
                        light: this.light
                    },
                    nativeOn: {
                        click: (e) => {
                            e.stopPropagation();
                            this.$emit('input', this.calculateChange(change));
                        }
                    }
                }, [
                    this.$createElement(VIcon, ((change < 0) === !this.$vuetify.rtl) ? this.prevIcon : this.nextIcon)
                ]);
        },
        calculateChange(sign) {
            const [year, month] = String(this.value).split('-').map(Number);
            if (month == null) {
                return `${year + sign}`;
            }
            else {
                return monthChange(String(this.value), sign);
            }
        },
        genHeader() {
            const color = !this.disabled && this.allowDateChange && (this.color || 'accent');
            const header = this.$createElement('div', this.setTextColor(color, {
                key: String(this.value)
            }), [this.$createElement('button', {
                    attrs: {
                        type: 'button'
                    },
                    on: {
                        click: () => this.$emit('toggle')
                    }
                }, [this.$slots.default || this.formatter(String(this.value))])]);
            const transition = this.$createElement('transition', {
                props: {
                    name: (this.isReversing === !this.$vuetify.rtl) ? 'tab-reverse-transition' : 'tab-transition'
                }
            }, [header]);
            return this.$createElement('div', {
                staticClass: 'v-date-picker-header__value',
                class: {
                    'v-date-picker-header__value--disabled': this.disabled || !this.allowDateChange
                }
            }, [transition]);
        }
    },
    render() {
        return this.$createElement('div', {
            staticClass: 'v-date-picker-header',
            class: {
                'v-date-picker-header--disabled': this.disabled || !this.allowDateChange,
                ...this.themeClasses
            }
        }, [
            this.genBtn(-1),
            this.genHeader(),
            this.genBtn(+1)
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXJIZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlckhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGtEQUFrRCxDQUFBO0FBRXpELGFBQWE7QUFDYixPQUFPLElBQUksTUFBTSxTQUFTLENBQUE7QUFDMUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUNqRSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQU90QyxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsc0JBQXNCO0lBRTVCLEtBQUssRUFBRTtRQUNMLGVBQWUsRUFBRSxPQUFPO1FBQ3hCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLE1BQU0sRUFBRSxRQUEwRDtRQUNsRSxZQUFZLEVBQUUsT0FBTztRQUNyQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxPQUFPO1NBQ2pCO1FBQ0QsR0FBRyxFQUFFLE1BQU07UUFDWCxHQUFHLEVBQUUsTUFBTTtRQUNYLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHFCQUFxQjtTQUMvQjtRQUNELFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHFCQUFxQjtTQUMvQjtRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE1BQU0s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LENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUVaLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSw2QkFBNkI7Z0JBQzFDLEtBQUssRUFBRTtvQkFDTCx1Q0FBdUMsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWU7aUJBQ2hGO2FBQ0YsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDbEIsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7WUFDaEMsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxLQUFLLEVBQUU7Z0JBQ0wsZ0NBQWdDLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUN4RSxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCO1NBQ0YsRUFBRTtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2RhdGUtcGlja2VyLWhlYWRlci5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkJ0biBmcm9tICcuLi9WQnRuJ1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIsIG1vbnRoQ2hhbmdlIH0gZnJvbSAnLi91dGlsJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IERhdGVQaWNrZXJGb3JtYXR0ZXIgfSBmcm9tICcuL3V0aWwvY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFRoZW1lYWJsZVxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtZGF0ZS1waWNrZXItaGVhZGVyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsbG93RGF0ZUNoYW5nZTogQm9vbGVhbixcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgZm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgaGlkZURpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgbG9jYWxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2VuLXVzJ1xyXG4gICAgfSxcclxuICAgIG1pbjogU3RyaW5nLFxyXG4gICAgbWF4OiBTdHJpbmcsXHJcbiAgICBuZXh0SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5uZXh0J1xyXG4gICAgfSxcclxuICAgIHByZXZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnByZXYnXHJcbiAgICB9LFxyXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNSZXZlcnNpbmc6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGZvcm1hdHRlciAoKTogRGF0ZVBpY2tlckZvcm1hdHRlciB7XHJcbiAgICAgIGlmICh0aGlzLmZvcm1hdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFxyXG4gICAgICB9IGVsc2UgaWYgKFN0cmluZyh0aGlzLnZhbHVlKS5zcGxpdCgnLScpWzFdKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcih0aGlzLmxvY2FsZSwgeyBtb250aDogJ2xvbmcnLCB5ZWFyOiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LCB7IGxlbmd0aDogNyB9KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSwgeyBsZW5ndGg6IDQgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICB2YWx1ZSAobmV3VmFsLCBvbGRWYWwpIHtcclxuICAgICAgdGhpcy5pc1JldmVyc2luZyA9IG5ld1ZhbCA8IG9sZFZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlbkJ0biAoY2hhbmdlOiBudW1iZXIpIHtcclxuICAgICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLmRpc2FibGVkIHx8XHJcbiAgICAgICAgIXRoaXMuYWxsb3dEYXRlQ2hhbmdlIHx8XHJcbiAgICAgICAgKGNoYW5nZSA8IDAgJiYgdGhpcy5taW4gJiYgdGhpcy5jYWxjdWxhdGVDaGFuZ2UoY2hhbmdlKSA8IHRoaXMubWluKSB8fFxyXG4gICAgICAgIChjaGFuZ2UgPiAwICYmIHRoaXMubWF4ICYmIHRoaXMuY2FsY3VsYXRlQ2hhbmdlKGNoYW5nZSkgPiB0aGlzLm1heClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmhpZGVEaXNhYmxlZCAmJlxyXG4gICAgICBkaXNhYmxlZFxyXG4gICAgICAgID8gbnVsbCBcclxuICAgICAgICA6IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJ0biwge1xyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgICBkaXNhYmxlZCxcclxuICAgICAgICAgICAgaWNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHRcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBuYXRpdmVPbjoge1xyXG4gICAgICAgICAgICBjbGljazogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5jYWxjdWxhdGVDaGFuZ2UoY2hhbmdlKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIFtcclxuICAgICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sICgoY2hhbmdlIDwgMCkgPT09ICF0aGlzLiR2dWV0aWZ5LnJ0bCkgPyB0aGlzLnByZXZJY29uIDogdGhpcy5uZXh0SWNvbilcclxuICAgICAgICBdKVxyXG4gICAgfSxcclxuICAgIGNhbGN1bGF0ZUNoYW5nZSAoc2lnbjogbnVtYmVyKSB7XHJcbiAgICAgIGNvbnN0IFt5ZWFyLCBtb250aF0gPSBTdHJpbmcodGhpcy52YWx1ZSkuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG5cclxuICAgICAgaWYgKG1vbnRoID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gYCR7eWVhciArIHNpZ259YFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBtb250aENoYW5nZShTdHJpbmcodGhpcy52YWx1ZSksIHNpZ24pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZW5IZWFkZXIgKCkge1xyXG4gICAgICBjb25zdCBjb2xvciA9ICF0aGlzLmRpc2FibGVkICYmIHRoaXMuYWxsb3dEYXRlQ2hhbmdlICYmICh0aGlzLmNvbG9yIHx8ICdhY2NlbnQnKVxyXG4gICAgICBjb25zdCBoZWFkZXIgPSB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcihjb2xvciwge1xyXG4gICAgICAgIGtleTogU3RyaW5nKHRoaXMudmFsdWUpXHJcbiAgICAgIH0pLCBbdGhpcy4kY3JlYXRlRWxlbWVudCgnYnV0dG9uJywge1xyXG4gICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICB0eXBlOiAnYnV0dG9uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLiRlbWl0KCd0b2dnbGUnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuJHNsb3RzLmRlZmF1bHQgfHwgdGhpcy5mb3JtYXR0ZXIoU3RyaW5nKHRoaXMudmFsdWUpKV0pXSlcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBuYW1lOiAodGhpcy5pc1JldmVyc2luZyA9PT0gIXRoaXMuJHZ1ZXRpZnkucnRsKSA/ICd0YWItcmV2ZXJzZS10cmFuc2l0aW9uJyA6ICd0YWItdHJhbnNpdGlvbidcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtoZWFkZXJdKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZGF0ZS1waWNrZXItaGVhZGVyX192YWx1ZScsXHJcbiAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICd2LWRhdGUtcGlja2VyLWhlYWRlcl9fdmFsdWUtLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5hbGxvd0RhdGVDaGFuZ2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFt0cmFuc2l0aW9uXSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKCk6IFZOb2RlIHtcclxuICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1kYXRlLXBpY2tlci1oZWFkZXInLFxyXG4gICAgICBjbGFzczoge1xyXG4gICAgICAgICd2LWRhdGUtcGlja2VyLWhlYWRlci0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmFsbG93RGF0ZUNoYW5nZSxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LCBbXHJcbiAgICAgIHRoaXMuZ2VuQnRuKC0xKSxcclxuICAgICAgdGhpcy5nZW5IZWFkZXIoKSxcclxuICAgICAgdGhpcy5nZW5CdG4oKzEpXHJcbiAgICBdKVxyXG4gIH1cclxufSlcclxuIl19