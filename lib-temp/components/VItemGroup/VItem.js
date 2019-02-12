// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable';
// Utilities
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export default mixins(GroupableFactory('itemGroup', 'v-item', 'v-item-group')
/* @vue/component */
).extend({
    name: 'v-item',
    props: {
        value: {
            required: false
        }
    },
    render() {
        if (!this.$scopedSlots.default) {
            consoleWarn('v-item is missing a default scopedSlot', this);
            return null;
        }
        let element;
        /* istanbul ignore else */
        if (this.$scopedSlots.default) {
            element = this.$scopedSlots.default({
                active: this.isActive,
                toggle: this.toggle
            });
        }
        if (Array.isArray(element) && element.length === 1) {
            element = element[0];
        }
        if (!element || Array.isArray(element) || !element.tag) {
            consoleWarn('v-item should only contain a single element', this);
            return element;
        }
        element.data = this._b(element.data || {}, element.tag, {
            class: { [this.activeClass]: this.isActive }
        });
        return element;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WSXRlbUdyb3VwL1ZJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLEVBQUUsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUE7QUFFcEUsWUFBWTtBQUNaLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBQ3RDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUtoRCxlQUFlLE1BQU0sQ0FDbkIsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUM7QUFDdkQsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFFBQVE7SUFFZCxLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUU7WUFDTCxRQUFRLEVBQUUsS0FBSztTQUNoQjtLQUNGO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUM5QixXQUFXLENBQUMsd0NBQXdDLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFM0QsT0FBTyxJQUFXLENBQUE7U0FDbkI7UUFFRCxJQUFJLE9BQW1DLENBQUE7UUFFdkMsMEJBQTBCO1FBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO2dCQUNsQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUNwQixDQUFDLENBQUE7U0FDSDtRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsRCxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3JCO1FBRUQsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUN0RCxXQUFXLENBQUMsNkNBQTZDLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFFaEUsT0FBTyxPQUFjLENBQUE7U0FDdEI7UUFFRCxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUksRUFBRTtZQUN2RCxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO1NBQzdDLENBQUMsQ0FBQTtRQUVGLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcclxuaW1wb3J0IHsgZmFjdG9yeSBhcyBHcm91cGFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL2dyb3VwYWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlLCBTY29wZWRTbG90Q2hpbGRyZW4gfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgR3JvdXBhYmxlRmFjdG9yeSgnaXRlbUdyb3VwJywgJ3YtaXRlbScsICd2LWl0ZW0tZ3JvdXAnKVxyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1pdGVtJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHZhbHVlOiB7XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoKTogVk5vZGUge1xyXG4gICAgaWYgKCF0aGlzLiRzY29wZWRTbG90cy5kZWZhdWx0KSB7XHJcbiAgICAgIGNvbnNvbGVXYXJuKCd2LWl0ZW0gaXMgbWlzc2luZyBhIGRlZmF1bHQgc2NvcGVkU2xvdCcsIHRoaXMpXHJcblxyXG4gICAgICByZXR1cm4gbnVsbCBhcyBhbnlcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZWxlbWVudDogVk5vZGUgfCBTY29wZWRTbG90Q2hpbGRyZW5cclxuXHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzLmRlZmF1bHQpIHtcclxuICAgICAgZWxlbWVudCA9IHRoaXMuJHNjb3BlZFNsb3RzLmRlZmF1bHQoe1xyXG4gICAgICAgIGFjdGl2ZTogdGhpcy5pc0FjdGl2ZSxcclxuICAgICAgICB0b2dnbGU6IHRoaXMudG9nZ2xlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudCkgJiYgZWxlbWVudC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgZWxlbWVudCA9IGVsZW1lbnRbMF1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWVsZW1lbnQgfHwgQXJyYXkuaXNBcnJheShlbGVtZW50KSB8fCAhZWxlbWVudC50YWcpIHtcclxuICAgICAgY29uc29sZVdhcm4oJ3YtaXRlbSBzaG91bGQgb25seSBjb250YWluIGEgc2luZ2xlIGVsZW1lbnQnLCB0aGlzKVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnQgYXMgYW55XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudC5kYXRhID0gdGhpcy5fYihlbGVtZW50LmRhdGEgfHwge30sIGVsZW1lbnQudGFnISwge1xyXG4gICAgICBjbGFzczogeyBbdGhpcy5hY3RpdmVDbGFzc106IHRoaXMuaXNBY3RpdmUgfVxyXG4gICAgfSlcclxuXHJcbiAgICByZXR1cm4gZWxlbWVudFxyXG4gIH1cclxufSlcclxuIl19