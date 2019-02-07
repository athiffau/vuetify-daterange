import '../../stylus/components/_pickers.styl';
import '../../stylus/components/_cards.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
// Helpers
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Themeable).extend({
    name: 'v-picker',
    props: {
        fullWidth: Boolean,
        landscape: Boolean,
        transition: {
            type: String,
            default: 'fade-transition'
        },
        width: {
            type: [Number, String],
            default: 290
        }
    },
    computed: {
        computedTitleColor() {
            const defaultTitleColor = this.isDark ? false : (this.color || 'primary');
            return this.color || defaultTitleColor;
        }
    },
    methods: {
        genTitle() {
            return this.$createElement('div', this.setBackgroundColor(this.computedTitleColor, {
                staticClass: 'v-picker__title',
                'class': {
                    'v-picker__title--landscape': this.landscape
                }
            }), this.$slots.title);
        },
        genBodyTransition() {
            return this.$createElement('transition', {
                props: {
                    name: this.transition
                }
            }, this.$slots.default);
        },
        genBody() {
            return this.$createElement('div', {
                staticClass: 'v-picker__body',
                'class': this.themeClasses,
                style: this.fullWidth ? undefined : {
                    width: convertToUnit(this.width)
                }
            }, [
                this.genBodyTransition()
            ]);
        },
        genActions() {
            return this.$createElement('div', {
                staticClass: 'v-picker__actions v-card__actions'
            }, this.$slots.actions);
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'v-picker v-card',
            'class': {
                'v-picker--landscape': this.landscape,
                'v-picker--full-width': this.fullWidth,
                ...this.themeClasses
            }
        }, [
            this.$slots.title ? this.genTitle() : null,
            this.genBody(),
            this.$slots.actions ? this.genActions() : null
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZQaWNrZXIvVlBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHVDQUF1QyxDQUFBO0FBQzlDLE9BQU8scUNBQXFDLENBQUE7QUFFNUMsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFVBQVU7QUFDVixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFJbEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLE9BQU87UUFDbEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsaUJBQWlCO1NBQzNCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsR0FBRztTQUNiO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixrQkFBa0I7WUFDaEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQTtZQUN6RSxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksaUJBQWlCLENBQUE7UUFDeEMsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDakYsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsT0FBTyxFQUFFO29CQUNQLDRCQUE0QixFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUM3QzthQUNGLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLENBQUM7UUFDRCxpQkFBaUI7WUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO2dCQUN2QyxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUN0QjthQUNGLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxnQkFBZ0I7Z0JBQzdCLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEtBQUssRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztpQkFDakM7YUFDRixFQUFFO2dCQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRTthQUN6QixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxtQ0FBbUM7YUFDakQsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3pCLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixPQUFPLEVBQUU7Z0JBQ1AscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3JDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUN0QyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCO1NBQ0YsRUFBRTtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDMUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDL0MsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3BpY2tlcnMuc3R5bCdcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fY2FyZHMuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlL3R5cGVzJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKENvbG9yYWJsZSwgVGhlbWVhYmxlKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXBpY2tlcicsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBmdWxsV2lkdGg6IEJvb2xlYW4sXHJcbiAgICBsYW5kc2NhcGU6IEJvb2xlYW4sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2ZhZGUtdHJhbnNpdGlvbidcclxuICAgIH0sXHJcbiAgICB3aWR0aDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAyOTBcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY29tcHV0ZWRUaXRsZUNvbG9yICgpOiBzdHJpbmcgfCBmYWxzZSB7XHJcbiAgICAgIGNvbnN0IGRlZmF1bHRUaXRsZUNvbG9yID0gdGhpcy5pc0RhcmsgPyBmYWxzZSA6ICh0aGlzLmNvbG9yIHx8ICdwcmltYXJ5JylcclxuICAgICAgcmV0dXJuIHRoaXMuY29sb3IgfHwgZGVmYXVsdFRpdGxlQ29sb3JcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5UaXRsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbXB1dGVkVGl0bGVDb2xvciwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1waWNrZXJfX3RpdGxlJyxcclxuICAgICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgICAndi1waWNrZXJfX3RpdGxlLS1sYW5kc2NhcGUnOiB0aGlzLmxhbmRzY2FwZVxyXG4gICAgICAgIH1cclxuICAgICAgfSksIHRoaXMuJHNsb3RzLnRpdGxlKVxyXG4gICAgfSxcclxuICAgIGdlbkJvZHlUcmFuc2l0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24nLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvblxyXG4gICAgICAgIH1cclxuICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICAgIH0sXHJcbiAgICBnZW5Cb2R5ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcGlja2VyX19ib2R5JyxcclxuICAgICAgICAnY2xhc3MnOiB0aGlzLnRoZW1lQ2xhc3NlcyxcclxuICAgICAgICBzdHlsZTogdGhpcy5mdWxsV2lkdGggPyB1bmRlZmluZWQgOiB7XHJcbiAgICAgICAgICB3aWR0aDogY29udmVydFRvVW5pdCh0aGlzLndpZHRoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuQm9keVRyYW5zaXRpb24oKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGlvbnMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1waWNrZXJfX2FjdGlvbnMgdi1jYXJkX19hY3Rpb25zJ1xyXG4gICAgICB9LCB0aGlzLiRzbG90cy5hY3Rpb25zKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1waWNrZXIgdi1jYXJkJyxcclxuICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICd2LXBpY2tlci0tbGFuZHNjYXBlJzogdGhpcy5sYW5kc2NhcGUsXHJcbiAgICAgICAgJ3YtcGlja2VyLS1mdWxsLXdpZHRoJzogdGhpcy5mdWxsV2lkdGgsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfSwgW1xyXG4gICAgICB0aGlzLiRzbG90cy50aXRsZSA/IHRoaXMuZ2VuVGl0bGUoKSA6IG51bGwsXHJcbiAgICAgIHRoaXMuZ2VuQm9keSgpLFxyXG4gICAgICB0aGlzLiRzbG90cy5hY3Rpb25zID8gdGhpcy5nZW5BY3Rpb25zKCkgOiBudWxsXHJcbiAgICBdKVxyXG4gIH1cclxufSlcclxuIl19