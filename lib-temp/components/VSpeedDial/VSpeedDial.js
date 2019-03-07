import '../../stylus/components/_speed-dial.styl';
import Toggleable from '../../mixins/toggleable';
import Positionable from '../../mixins/positionable';
import Transitionable from '../../mixins/transitionable';
import ClickOutside from '../../directives/click-outside';
/* @vue/component */
export default {
    name: 'v-speed-dial',
    directives: { ClickOutside },
    mixins: [Positionable, Toggleable, Transitionable],
    props: {
        direction: {
            type: String,
            default: 'top',
            validator: val => {
                return ['top', 'right', 'bottom', 'left'].includes(val);
            }
        },
        openOnHover: Boolean,
        transition: {
            type: String,
            default: 'scale-transition'
        }
    },
    computed: {
        classes() {
            return {
                'v-speed-dial': true,
                'v-speed-dial--top': this.top,
                'v-speed-dial--right': this.right,
                'v-speed-dial--bottom': this.bottom,
                'v-speed-dial--left': this.left,
                'v-speed-dial--absolute': this.absolute,
                'v-speed-dial--fixed': this.fixed,
                [`v-speed-dial--direction-${this.direction}`]: true
            };
        }
    },
    render(h) {
        let children = [];
        const data = {
            'class': this.classes,
            directives: [{
                    name: 'click-outside',
                    value: () => (this.isActive = false)
                }],
            on: {
                click: () => (this.isActive = !this.isActive)
            }
        };
        if (this.openOnHover) {
            data.on.mouseenter = () => (this.isActive = true);
            data.on.mouseleave = () => (this.isActive = false);
        }
        if (this.isActive) {
            let btnCount = 0;
            children = (this.$slots.default || []).map((b, i) => {
                if (b.tag && b.componentOptions.Ctor.options.name === 'v-btn') {
                    btnCount++;
                    return h('div', {
                        style: {
                            transitionDelay: btnCount * 0.05 + 's'
                        },
                        key: i
                    }, [b]);
                }
                else {
                    b.key = i;
                    return b;
                }
            });
        }
        const list = h('transition-group', {
            'class': 'v-speed-dial__list',
            props: {
                name: this.transition,
                mode: this.mode,
                origin: this.origin,
                tag: 'div'
            }
        }, children);
        return h('div', data, [this.$slots.activator, list]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNwZWVkRGlhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTcGVlZERpYWwvVlNwZWVkRGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDBDQUEwQyxDQUFBO0FBRWpELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sWUFBWSxNQUFNLDJCQUEyQixDQUFBO0FBQ3BELE9BQU8sY0FBYyxNQUFNLDZCQUE2QixDQUFBO0FBRXhELE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBRXpELG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLGNBQWM7SUFFcEIsVUFBVSxFQUFFLEVBQUUsWUFBWSxFQUFFO0lBRTVCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDO0lBRWxELEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7WUFDZCxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6RCxDQUFDO1NBQ0Y7UUFDRCxXQUFXLEVBQUUsT0FBTztRQUNwQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxrQkFBa0I7U0FDNUI7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixtQkFBbUIsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDN0IscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDL0Isd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQyxDQUFDLDJCQUEyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJO2FBQ3BELENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNqQixNQUFNLElBQUksR0FBRztZQUNYLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixVQUFVLEVBQUUsQ0FBQztvQkFDWCxJQUFJLEVBQUUsZUFBZTtvQkFDckIsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7aUJBQ3JDLENBQUM7WUFDRixFQUFFLEVBQUU7Z0JBQ0YsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDOUM7U0FDRixDQUFBO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQTtZQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUE7U0FDbkQ7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7b0JBQzdELFFBQVEsRUFBRSxDQUFBO29CQUNWLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTt3QkFDZCxLQUFLLEVBQUU7NEJBQ0wsZUFBZSxFQUFFLFFBQVEsR0FBRyxJQUFJLEdBQUcsR0FBRzt5QkFDdkM7d0JBQ0QsR0FBRyxFQUFFLENBQUM7cUJBQ1AsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ1I7cUJBQU07b0JBQ0wsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7b0JBQ1QsT0FBTyxDQUFDLENBQUE7aUJBQ1Q7WUFDSCxDQUFDLENBQUMsQ0FBQTtTQUNIO1FBRUQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFO1lBQ2pDLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsS0FBSyxFQUFFO2dCQUNMLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsR0FBRyxFQUFFLEtBQUs7YUFDWDtTQUNGLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFFWixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3NwZWVkLWRpYWwuc3R5bCdcclxuXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5pbXBvcnQgUG9zaXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy9wb3NpdGlvbmFibGUnXHJcbmltcG9ydCBUcmFuc2l0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdHJhbnNpdGlvbmFibGUnXHJcblxyXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAndi1zcGVlZC1kaWFsJyxcclxuXHJcbiAgZGlyZWN0aXZlczogeyBDbGlja091dHNpZGUgfSxcclxuXHJcbiAgbWl4aW5zOiBbUG9zaXRpb25hYmxlLCBUb2dnbGVhYmxlLCBUcmFuc2l0aW9uYWJsZV0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBkaXJlY3Rpb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndG9wJyxcclxuICAgICAgdmFsaWRhdG9yOiB2YWwgPT4ge1xyXG4gICAgICAgIHJldHVybiBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddLmluY2x1ZGVzKHZhbClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9wZW5PbkhvdmVyOiBCb29sZWFuLFxyXG4gICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdzY2FsZS10cmFuc2l0aW9uJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1zcGVlZC1kaWFsJzogdHJ1ZSxcclxuICAgICAgICAndi1zcGVlZC1kaWFsLS10b3AnOiB0aGlzLnRvcCxcclxuICAgICAgICAndi1zcGVlZC1kaWFsLS1yaWdodCc6IHRoaXMucmlnaHQsXHJcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tYm90dG9tJzogdGhpcy5ib3R0b20sXHJcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tbGVmdCc6IHRoaXMubGVmdCxcclxuICAgICAgICAndi1zcGVlZC1kaWFsLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXHJcbiAgICAgICAgJ3Ytc3BlZWQtZGlhbC0tZml4ZWQnOiB0aGlzLmZpeGVkLFxyXG4gICAgICAgIFtgdi1zcGVlZC1kaWFsLS1kaXJlY3Rpb24tJHt0aGlzLmRpcmVjdGlvbn1gXTogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKSB7XHJcbiAgICBsZXQgY2hpbGRyZW4gPSBbXVxyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzc2VzLFxyXG4gICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcclxuICAgICAgICB2YWx1ZTogKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSlcclxuICAgICAgfV0sXHJcbiAgICAgIG9uOiB7XHJcbiAgICAgICAgY2xpY2s6ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmUpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcGVuT25Ib3Zlcikge1xyXG4gICAgICBkYXRhLm9uLm1vdXNlZW50ZXIgPSAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IHRydWUpXHJcbiAgICAgIGRhdGEub24ubW91c2VsZWF2ZSA9ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gZmFsc2UpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcclxuICAgICAgbGV0IGJ0bkNvdW50ID0gMFxyXG4gICAgICBjaGlsZHJlbiA9ICh0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdKS5tYXAoKGIsIGkpID0+IHtcclxuICAgICAgICBpZiAoYi50YWcgJiYgYi5jb21wb25lbnRPcHRpb25zLkN0b3Iub3B0aW9ucy5uYW1lID09PSAndi1idG4nKSB7XHJcbiAgICAgICAgICBidG5Db3VudCsrXHJcbiAgICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICAgICAgICBzdHlsZToge1xyXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25EZWxheTogYnRuQ291bnQgKiAwLjA1ICsgJ3MnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGtleTogaVxyXG4gICAgICAgICAgfSwgW2JdKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBiLmtleSA9IGlcclxuICAgICAgICAgIHJldHVybiBiXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxpc3QgPSBoKCd0cmFuc2l0aW9uLWdyb3VwJywge1xyXG4gICAgICAnY2xhc3MnOiAndi1zcGVlZC1kaWFsX19saXN0JyxcclxuICAgICAgcHJvcHM6IHtcclxuICAgICAgICBuYW1lOiB0aGlzLnRyYW5zaXRpb24sXHJcbiAgICAgICAgbW9kZTogdGhpcy5tb2RlLFxyXG4gICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgdGFnOiAnZGl2J1xyXG4gICAgICB9XHJcbiAgICB9LCBjaGlsZHJlbilcclxuXHJcbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW3RoaXMuJHNsb3RzLmFjdGl2YXRvciwgbGlzdF0pXHJcbiAgfVxyXG59XHJcbiJdfQ==