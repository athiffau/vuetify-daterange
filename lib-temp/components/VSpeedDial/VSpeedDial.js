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
            children = (this.$slots.default || []).map((b, i) => {
                b.key = i;
                return b;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNwZWVkRGlhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTcGVlZERpYWwvVlNwZWVkRGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDBDQUEwQyxDQUFBO0FBRWpELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sWUFBWSxNQUFNLDJCQUEyQixDQUFBO0FBQ3BELE9BQU8sY0FBYyxNQUFNLDZCQUE2QixDQUFBO0FBRXhELE9BQU8sWUFBWSxNQUFNLGdDQUFnQyxDQUFBO0FBRXpELG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLGNBQWM7SUFFcEIsVUFBVSxFQUFFLEVBQUUsWUFBWSxFQUFFO0lBRTVCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDO0lBRWxELEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRTtZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEtBQUs7WUFDZCxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2YsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6RCxDQUFDO1NBQ0Y7UUFDRCxXQUFXLEVBQUUsT0FBTztRQUNwQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxrQkFBa0I7U0FDNUI7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixtQkFBbUIsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDN0IscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDL0Isd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQyxDQUFDLDJCQUEyQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJO2FBQ3BELENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQTtRQUNqQixNQUFNLElBQUksR0FBRztZQUNYLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixVQUFVLEVBQUUsQ0FBQztvQkFDWCxJQUFJLEVBQUUsZUFBZTtvQkFDckIsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7aUJBQ3JDLENBQUM7WUFDRixFQUFFLEVBQUU7Z0JBQ0YsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7YUFDOUM7U0FDRixDQUFBO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQTtZQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUE7U0FDbkQ7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtnQkFFVCxPQUFPLENBQUMsQ0FBQTtZQUNWLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsa0JBQWtCLEVBQUU7WUFDakMsT0FBTyxFQUFFLG9CQUFvQjtZQUM3QixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixHQUFHLEVBQUUsS0FBSzthQUNYO1NBQ0YsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUVaLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3RELENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc3BlZWQtZGlhbC5zdHlsJ1xyXG5cclxuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXHJcbmltcG9ydCBQb3NpdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Bvc2l0aW9uYWJsZSdcclxuaW1wb3J0IFRyYW5zaXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy90cmFuc2l0aW9uYWJsZSdcclxuXHJcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LXNwZWVkLWRpYWwnLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7IENsaWNrT3V0c2lkZSB9LFxyXG5cclxuICBtaXhpbnM6IFtQb3NpdGlvbmFibGUsIFRvZ2dsZWFibGUsIFRyYW5zaXRpb25hYmxlXSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGRpcmVjdGlvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICd0b3AnLFxyXG4gICAgICB2YWxpZGF0b3I6IHZhbCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIFsndG9wJywgJ3JpZ2h0JywgJ2JvdHRvbScsICdsZWZ0J10uaW5jbHVkZXModmFsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb3Blbk9uSG92ZXI6IEJvb2xlYW4sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3NjYWxlLXRyYW5zaXRpb24nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXNwZWVkLWRpYWwnOiB0cnVlLFxyXG4gICAgICAgICd2LXNwZWVkLWRpYWwtLXRvcCc6IHRoaXMudG9wLFxyXG4gICAgICAgICd2LXNwZWVkLWRpYWwtLXJpZ2h0JzogdGhpcy5yaWdodCxcclxuICAgICAgICAndi1zcGVlZC1kaWFsLS1ib3R0b20nOiB0aGlzLmJvdHRvbSxcclxuICAgICAgICAndi1zcGVlZC1kaWFsLS1sZWZ0JzogdGhpcy5sZWZ0LFxyXG4gICAgICAgICd2LXNwZWVkLWRpYWwtLWFic29sdXRlJzogdGhpcy5hYnNvbHV0ZSxcclxuICAgICAgICAndi1zcGVlZC1kaWFsLS1maXhlZCc6IHRoaXMuZml4ZWQsXHJcbiAgICAgICAgW2B2LXNwZWVkLWRpYWwtLWRpcmVjdGlvbi0ke3RoaXMuZGlyZWN0aW9ufWBdOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGxldCBjaGlsZHJlbiA9IFtdXHJcbiAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXMsXHJcbiAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxyXG4gICAgICAgIHZhbHVlOiAoKSA9PiAodGhpcy5pc0FjdGl2ZSA9IGZhbHNlKVxyXG4gICAgICB9XSxcclxuICAgICAgb246IHtcclxuICAgICAgICBjbGljazogKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wZW5PbkhvdmVyKSB7XHJcbiAgICAgIGRhdGEub24ubW91c2VlbnRlciA9ICgpID0+ICh0aGlzLmlzQWN0aXZlID0gdHJ1ZSlcclxuICAgICAgZGF0YS5vbi5tb3VzZWxlYXZlID0gKCkgPT4gKHRoaXMuaXNBY3RpdmUgPSBmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICBjaGlsZHJlbiA9ICh0aGlzLiRzbG90cy5kZWZhdWx0IHx8IFtdKS5tYXAoKGIsIGkpID0+IHtcclxuICAgICAgICBiLmtleSA9IGlcclxuXHJcbiAgICAgICAgcmV0dXJuIGJcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsaXN0ID0gaCgndHJhbnNpdGlvbi1ncm91cCcsIHtcclxuICAgICAgJ2NsYXNzJzogJ3Ytc3BlZWQtZGlhbF9fbGlzdCcsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxyXG4gICAgICAgIG1vZGU6IHRoaXMubW9kZSxcclxuICAgICAgICBvcmlnaW46IHRoaXMub3JpZ2luLFxyXG4gICAgICAgIHRhZzogJ2RpdidcclxuICAgICAgfVxyXG4gICAgfSwgY2hpbGRyZW4pXHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIGRhdGEsIFt0aGlzLiRzbG90cy5hY3RpdmF0b3IsIGxpc3RdKVxyXG4gIH1cclxufVxyXG4iXX0=