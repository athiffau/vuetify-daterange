import '../../stylus/components/_snackbars.styl';
import Colorable from '../../mixins/colorable';
import Toggleable from '../../mixins/toggleable';
import { factory as PositionableFactory } from '../../mixins/positionable';
import mixins from '../../util/mixins';
export default mixins(Colorable, Toggleable, PositionableFactory(['absolute', 'top', 'bottom', 'left', 'right'])
/* @vue/component */
).extend({
    name: 'v-snackbar',
    props: {
        autoHeight: Boolean,
        multiLine: Boolean,
        // TODO: change this to closeDelay to match other API in delayable.js
        timeout: {
            type: Number,
            default: 6000
        },
        vertical: Boolean
    },
    data() {
        return {
            activeTimeout: -1
        };
    },
    computed: {
        classes() {
            return {
                'v-snack--active': this.isActive,
                'v-snack--absolute': this.absolute,
                'v-snack--auto-height': this.autoHeight,
                'v-snack--bottom': this.bottom || !this.top,
                'v-snack--left': this.left,
                'v-snack--multi-line': this.multiLine && !this.vertical,
                'v-snack--right': this.right,
                'v-snack--top': this.top,
                'v-snack--vertical': this.vertical
            };
        }
    },
    watch: {
        isActive() {
            this.setTimeout();
        }
    },
    mounted() {
        this.setTimeout();
    },
    methods: {
        setTimeout() {
            window.clearTimeout(this.activeTimeout);
            if (this.isActive && this.timeout) {
                this.activeTimeout = window.setTimeout(() => {
                    this.isActive = false;
                }, this.timeout);
            }
        }
    },
    render(h) {
        return h('transition', {
            attrs: { name: 'v-snack-transition' }
        }, this.isActive && [
            h('div', {
                staticClass: 'v-snack',
                class: this.classes,
                on: this.$listeners
            }, [
                h('div', this.setBackgroundColor(this.color, {
                    staticClass: 'v-snack__wrapper'
                }), [
                    h('div', {
                        staticClass: 'v-snack__content'
                    }, this.$slots.default)
                ])
            ])
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNuYWNrYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNuYWNrYmFyL1ZTbmFja2Jhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHlDQUF5QyxDQUFBO0FBRWhELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sRUFBRSxPQUFPLElBQUksbUJBQW1CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQTtBQUUxRSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUd0QyxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFVBQVUsRUFDVixtQkFBbUIsQ0FBQyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyRSxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxVQUFVLEVBQUUsT0FBTztRQUNuQixTQUFTLEVBQUUsT0FBTztRQUNsQixxRUFBcUU7UUFDckUsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsUUFBUSxFQUFFLE9BQU87S0FDbEI7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLGFBQWEsRUFBRSxDQUFDLENBQUM7U0FDbEIsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxpQkFBaUIsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDaEMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ2xDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUN2QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQzNDLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDMUIscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUN2RCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDNUIsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUN4QixtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUTthQUNuQyxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUTtZQUNOLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNuQixDQUFDO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQ25CLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFdkMsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQzFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO2dCQUN2QixDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ2pCO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDckIsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1NBQ3RDLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSTtZQUNsQixDQUFDLENBQUMsS0FBSyxFQUFFO2dCQUNQLFdBQVcsRUFBRSxTQUFTO2dCQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ25CLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTthQUNwQixFQUFFO2dCQUNELENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQzNDLFdBQVcsRUFBRSxrQkFBa0I7aUJBQ2hDLENBQUMsRUFBRTtvQkFDRixDQUFDLENBQUMsS0FBSyxFQUFFO3dCQUNQLFdBQVcsRUFBRSxrQkFBa0I7cUJBQ2hDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7aUJBQ3hCLENBQUM7YUFDSCxDQUFDO1NBQ0gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3NuYWNrYmFycy5zdHlsJ1xyXG5cclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcclxuaW1wb3J0IHsgZmFjdG9yeSBhcyBQb3NpdGlvbmFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3Bvc2l0aW9uYWJsZSdcclxuXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIENvbG9yYWJsZSxcclxuICBUb2dnbGVhYmxlLFxyXG4gIFBvc2l0aW9uYWJsZUZhY3RvcnkoWydhYnNvbHV0ZScsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXSlcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXNuYWNrYmFyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGF1dG9IZWlnaHQ6IEJvb2xlYW4sXHJcbiAgICBtdWx0aUxpbmU6IEJvb2xlYW4sXHJcbiAgICAvLyBUT0RPOiBjaGFuZ2UgdGhpcyB0byBjbG9zZURlbGF5IHRvIG1hdGNoIG90aGVyIEFQSSBpbiBkZWxheWFibGUuanNcclxuICAgIHRpbWVvdXQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiA2MDAwXHJcbiAgICB9LFxyXG4gICAgdmVydGljYWw6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGFjdGl2ZVRpbWVvdXQ6IC0xXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3Ytc25hY2stLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgJ3Ytc25hY2stLWFic29sdXRlJzogdGhpcy5hYnNvbHV0ZSxcclxuICAgICAgICAndi1zbmFjay0tYXV0by1oZWlnaHQnOiB0aGlzLmF1dG9IZWlnaHQsXHJcbiAgICAgICAgJ3Ytc25hY2stLWJvdHRvbSc6IHRoaXMuYm90dG9tIHx8ICF0aGlzLnRvcCxcclxuICAgICAgICAndi1zbmFjay0tbGVmdCc6IHRoaXMubGVmdCxcclxuICAgICAgICAndi1zbmFjay0tbXVsdGktbGluZSc6IHRoaXMubXVsdGlMaW5lICYmICF0aGlzLnZlcnRpY2FsLFxyXG4gICAgICAgICd2LXNuYWNrLS1yaWdodCc6IHRoaXMucmlnaHQsXHJcbiAgICAgICAgJ3Ytc25hY2stLXRvcCc6IHRoaXMudG9wLFxyXG4gICAgICAgICd2LXNuYWNrLS12ZXJ0aWNhbCc6IHRoaXMudmVydGljYWxcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0FjdGl2ZSAoKSB7XHJcbiAgICAgIHRoaXMuc2V0VGltZW91dCgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLnNldFRpbWVvdXQoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHNldFRpbWVvdXQgKCkge1xyXG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuYWN0aXZlVGltZW91dClcclxuXHJcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlICYmIHRoaXMudGltZW91dCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgIH0sIHRoaXMudGltZW91dClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCd0cmFuc2l0aW9uJywge1xyXG4gICAgICBhdHRyczogeyBuYW1lOiAndi1zbmFjay10cmFuc2l0aW9uJyB9XHJcbiAgICB9LCB0aGlzLmlzQWN0aXZlICYmIFtcclxuICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zbmFjaycsXHJcbiAgICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgICBvbjogdGhpcy4kbGlzdGVuZXJzXHJcbiAgICAgIH0sIFtcclxuICAgICAgICBoKCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XHJcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc25hY2tfX3dyYXBwZXInXHJcbiAgICAgICAgfSksIFtcclxuICAgICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNuYWNrX19jb250ZW50J1xyXG4gICAgICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICAgICAgICBdKVxyXG4gICAgICBdKVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==