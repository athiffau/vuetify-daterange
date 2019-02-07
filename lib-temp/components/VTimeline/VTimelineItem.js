// Types
import mixins from '../../util/mixins';
// Components
import VIcon from '../VIcon';
// Mixins
import Themeable from '../../mixins/themeable';
import Colorable from '../../mixins/colorable';
export default mixins(Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-timeline-item',
    props: {
        color: {
            type: String,
            default: 'primary'
        },
        fillDot: Boolean,
        hideDot: Boolean,
        icon: String,
        iconColor: String,
        large: Boolean,
        left: Boolean,
        right: Boolean,
        small: Boolean
    },
    computed: {
        hasIcon() {
            return !!this.icon || !!this.$slots.icon;
        }
    },
    methods: {
        genBody() {
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__body'
            }, this.$slots.default);
        },
        genIcon() {
            if (this.$slots.icon) {
                return this.$slots.icon;
            }
            return this.$createElement(VIcon, {
                props: {
                    color: this.iconColor,
                    dark: !this.theme.isDark,
                    small: this.small
                }
            }, this.icon);
        },
        genInnerDot() {
            const data = this.setBackgroundColor(this.color);
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__inner-dot',
                ...data
            }, [this.hasIcon && this.genIcon()]);
        },
        genDot() {
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__dot',
                class: {
                    'v-timeline-item__dot--small': this.small,
                    'v-timeline-item__dot--large': this.large
                }
            }, [this.genInnerDot()]);
        },
        genOpposite() {
            return this.$createElement('div', {
                staticClass: 'v-timeline-item__opposite'
            }, this.$slots.opposite);
        }
    },
    render(h) {
        const children = [this.genBody()];
        if (!this.hideDot)
            children.unshift(this.genDot());
        if (this.$slots.opposite)
            children.push(this.genOpposite());
        return h('div', {
            staticClass: 'v-timeline-item',
            class: {
                'v-timeline-item--fill-dot': this.fillDot,
                'v-timeline-item--left': this.left,
                'v-timeline-item--right': this.right,
                ...this.themeClasses
            }
        }, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVsaW5lSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUaW1lbGluZS9WVGltZWxpbmVJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVE7QUFDUixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUd0QyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsaUJBQWlCO0lBRXZCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxPQUFPLEVBQUUsT0FBTztRQUNoQixPQUFPLEVBQUUsT0FBTztRQUNoQixJQUFJLEVBQUUsTUFBTTtRQUNaLFNBQVMsRUFBRSxNQUFNO1FBQ2pCLEtBQUssRUFBRSxPQUFPO1FBQ2QsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsT0FBTztRQUNkLEtBQUssRUFBRSxPQUFPO0tBQ2Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDMUMsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSx1QkFBdUI7YUFDckMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3pCLENBQUM7UUFDRCxPQUFPO1lBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDcEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTthQUN4QjtZQUVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3JCLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtvQkFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2lCQUNsQjthQUNGLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2YsQ0FBQztRQUNELFdBQVc7WUFDVCxNQUFNLElBQUksR0FBYyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRTNELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSw0QkFBNEI7Z0JBQ3pDLEdBQUcsSUFBSTthQUNSLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDdEMsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsc0JBQXNCO2dCQUNuQyxLQUFLLEVBQUU7b0JBQ0wsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ3pDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxLQUFLO2lCQUMxQzthQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLDJCQUEyQjthQUN6QyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDMUIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7UUFDbEQsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFBO1FBRTNELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsS0FBSyxFQUFFO2dCQUNMLDJCQUEyQixFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUN6Qyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDbEMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ3BDLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckI7U0FDRixFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ2QsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFR5cGVzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURhdGEgfSBmcm9tICd2dWUnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBDb2xvcmFibGUsXHJcbiAgVGhlbWVhYmxlXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi10aW1lbGluZS1pdGVtJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGNvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnknXHJcbiAgICB9LFxyXG4gICAgZmlsbERvdDogQm9vbGVhbixcclxuICAgIGhpZGVEb3Q6IEJvb2xlYW4sXHJcbiAgICBpY29uOiBTdHJpbmcsXHJcbiAgICBpY29uQ29sb3I6IFN0cmluZyxcclxuICAgIGxhcmdlOiBCb29sZWFuLFxyXG4gICAgbGVmdDogQm9vbGVhbixcclxuICAgIHJpZ2h0OiBCb29sZWFuLFxyXG4gICAgc21hbGw6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgaGFzSWNvbiAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAhIXRoaXMuaWNvbiB8fCAhIXRoaXMuJHNsb3RzLmljb25cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5Cb2R5ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZWxpbmUtaXRlbV9fYm9keSdcclxuICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICAgIH0sXHJcbiAgICBnZW5JY29uICgpOiBWTm9kZSB8IFZOb2RlW10ge1xyXG4gICAgICBpZiAodGhpcy4kc2xvdHMuaWNvbikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzbG90cy5pY29uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmljb25Db2xvcixcclxuICAgICAgICAgIGRhcms6ICF0aGlzLnRoZW1lLmlzRGFyayxcclxuICAgICAgICAgIHNtYWxsOiB0aGlzLnNtYWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCB0aGlzLmljb24pXHJcbiAgICB9LFxyXG4gICAgZ2VuSW5uZXJEb3QgKCkge1xyXG4gICAgICBjb25zdCBkYXRhOiBWTm9kZURhdGEgPSB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZWxpbmUtaXRlbV9faW5uZXItZG90JyxcclxuICAgICAgICAuLi5kYXRhXHJcbiAgICAgIH0sIFt0aGlzLmhhc0ljb24gJiYgdGhpcy5nZW5JY29uKCldKVxyXG4gICAgfSxcclxuICAgIGdlbkRvdCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRpbWVsaW5lLWl0ZW1fX2RvdCcsXHJcbiAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICd2LXRpbWVsaW5lLWl0ZW1fX2RvdC0tc21hbGwnOiB0aGlzLnNtYWxsLFxyXG4gICAgICAgICAgJ3YtdGltZWxpbmUtaXRlbV9fZG90LS1sYXJnZSc6IHRoaXMubGFyZ2VcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFt0aGlzLmdlbklubmVyRG90KCldKVxyXG4gICAgfSxcclxuICAgIGdlbk9wcG9zaXRlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtdGltZWxpbmUtaXRlbV9fb3Bwb3NpdGUnXHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLm9wcG9zaXRlKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gW3RoaXMuZ2VuQm9keSgpXVxyXG5cclxuICAgIGlmICghdGhpcy5oaWRlRG90KSBjaGlsZHJlbi51bnNoaWZ0KHRoaXMuZ2VuRG90KCkpXHJcbiAgICBpZiAodGhpcy4kc2xvdHMub3Bwb3NpdGUpIGNoaWxkcmVuLnB1c2godGhpcy5nZW5PcHBvc2l0ZSgpKVxyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10aW1lbGluZS1pdGVtJyxcclxuICAgICAgY2xhc3M6IHtcclxuICAgICAgICAndi10aW1lbGluZS1pdGVtLS1maWxsLWRvdCc6IHRoaXMuZmlsbERvdCxcclxuICAgICAgICAndi10aW1lbGluZS1pdGVtLS1sZWZ0JzogdGhpcy5sZWZ0LFxyXG4gICAgICAgICd2LXRpbWVsaW5lLWl0ZW0tLXJpZ2h0JzogdGhpcy5yaWdodCxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LCBjaGlsZHJlbilcclxuICB9XHJcbn0pXHJcbiJdfQ==