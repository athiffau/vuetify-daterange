// Styles
import '../../stylus/components/_bottom-navs.styl';
// Mixins
import Applicationable from '../../mixins/applicationable';
import ButtonGroup from '../../mixins/button-group';
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Util
import mixins from '../../util/mixins';
export default mixins(Applicationable('bottom', [
    'height',
    'value'
]), Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-bottom-nav',
    props: {
        active: [Number, String],
        mandatory: Boolean,
        height: {
            default: 56,
            type: [Number, String],
            validator: (v) => !isNaN(parseInt(v))
        },
        shift: Boolean,
        value: null
    },
    computed: {
        classes() {
            return {
                'v-bottom-nav--absolute': this.absolute,
                'v-bottom-nav--fixed': !this.absolute && (this.app || this.fixed),
                'v-bottom-nav--shift': this.shift,
                'v-bottom-nav--active': this.value
            };
        },
        computedHeight() {
            return parseInt(this.height);
        }
    },
    methods: {
        updateApplication() {
            return !this.value
                ? 0
                : this.computedHeight;
        },
        updateValue(val) {
            this.$emit('update:active', val);
        }
    },
    render(h) {
        return h(ButtonGroup, this.setBackgroundColor(this.color, {
            staticClass: 'v-bottom-nav',
            class: this.classes,
            style: {
                height: `${parseInt(this.computedHeight)}px`
            },
            props: {
                mandatory: Boolean(this.mandatory || this.active !== undefined),
                value: this.active
            },
            on: { change: this.updateValue }
        }), this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJvdHRvbU5hdi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCb3R0b21OYXYvVkJvdHRvbU5hdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQUVsRCxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsT0FBTztBQUNQLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBTXRDLGVBQWUsTUFBTSxDQUNuQixlQUFlLENBQUMsUUFBUSxFQUFFO0lBQ3hCLFFBQVE7SUFDUixPQUFPO0NBQ1IsQ0FBQyxFQUNGLFNBQVMsRUFDVCxTQUFTO0FBQ1Qsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGNBQWM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztRQUN4QixTQUFTLEVBQUUsT0FBTztRQUNsQixNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsU0FBUyxFQUFFLENBQUMsQ0FBa0IsRUFBVyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hFO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxLQUFLLEVBQUUsSUFBaUM7S0FDekM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCx3QkFBd0IsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNqRSxxQkFBcUIsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDbkMsQ0FBQTtRQUNILENBQUM7UUFDRCxjQUFjO1lBQ1osT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzlCLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLGlCQUFpQjtZQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUE7UUFDekIsQ0FBQztRQUNELFdBQVcsQ0FBRSxHQUFRO1lBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3hELFdBQVcsRUFBRSxjQUFjO1lBQzNCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSTthQUM3QztZQUNELEtBQUssRUFBRTtnQkFDTCxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLENBQUM7Z0JBQy9ELEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTthQUNuQjtZQUNELEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO1NBQ2pDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzFCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fYm90dG9tLW5hdnMuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQXBwbGljYXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy9hcHBsaWNhdGlvbmFibGUnXHJcbmltcG9ydCBCdXR0b25Hcm91cCBmcm9tICcuLi8uLi9taXhpbnMvYnV0dG9uLWdyb3VwJ1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIFV0aWxcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgQXBwbGljYXRpb25hYmxlKCdib3R0b20nLCBbXHJcbiAgICAnaGVpZ2h0JyxcclxuICAgICd2YWx1ZSdcclxuICBdKSxcclxuICBDb2xvcmFibGUsXHJcbiAgVGhlbWVhYmxlXHJcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWJvdHRvbS1uYXYnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWN0aXZlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgbWFuZGF0b3J5OiBCb29sZWFuLFxyXG4gICAgaGVpZ2h0OiB7XHJcbiAgICAgIGRlZmF1bHQ6IDU2LFxyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICB2YWxpZGF0b3I6ICh2OiBzdHJpbmcgfCBudW1iZXIpOiBib29sZWFuID0+ICFpc05hTihwYXJzZUludCh2KSlcclxuICAgIH0sXHJcbiAgICBzaGlmdDogQm9vbGVhbixcclxuICAgIHZhbHVlOiBudWxsIGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPGFueT5cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1ib3R0b20tbmF2LS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXHJcbiAgICAgICAgJ3YtYm90dG9tLW5hdi0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXHJcbiAgICAgICAgJ3YtYm90dG9tLW5hdi0tc2hpZnQnOiB0aGlzLnNoaWZ0LFxyXG4gICAgICAgICd2LWJvdHRvbS1uYXYtLWFjdGl2ZSc6IHRoaXMudmFsdWVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkSGVpZ2h0ICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5oZWlnaHQpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgdXBkYXRlQXBwbGljYXRpb24gKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiAhdGhpcy52YWx1ZVxyXG4gICAgICAgID8gMFxyXG4gICAgICAgIDogdGhpcy5jb21wdXRlZEhlaWdodFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVZhbHVlICh2YWw6IGFueSkge1xyXG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6YWN0aXZlJywgdmFsKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKEJ1dHRvbkdyb3VwLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1ib3R0b20tbmF2JyxcclxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgc3R5bGU6IHtcclxuICAgICAgICBoZWlnaHQ6IGAke3BhcnNlSW50KHRoaXMuY29tcHV0ZWRIZWlnaHQpfXB4YFxyXG4gICAgICB9LFxyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIG1hbmRhdG9yeTogQm9vbGVhbih0aGlzLm1hbmRhdG9yeSB8fCB0aGlzLmFjdGl2ZSAhPT0gdW5kZWZpbmVkKSxcclxuICAgICAgICB2YWx1ZTogdGhpcy5hY3RpdmVcclxuICAgICAgfSxcclxuICAgICAgb246IHsgY2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlIH1cclxuICAgIH0pLCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gIH1cclxufSlcclxuIl19