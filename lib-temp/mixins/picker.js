// Components
import VPicker from '../components/VPicker';
// Mixins
import Colorable from './colorable';
import Themeable from './themeable';
// Utils
import mixins from '../util/mixins';
export default mixins(Colorable, Themeable
/* @vue/component */
).extend({
    name: 'picker',
    props: {
        fullWidth: Boolean,
        headerColor: String,
        landscape: Boolean,
        noTitle: Boolean,
        width: {
            type: [Number, String],
            default: 290
        }
    },
    methods: {
        genPickerTitle() {
            return null;
        },
        genPickerBody() {
            return null;
        },
        genPickerActionsSlot() {
            return this.$scopedSlots.default ? this.$scopedSlots.default({
                save: this.save,
                cancel: this.cancel
            }) : this.$slots.default;
        },
        genPicker(staticClass) {
            const children = [];
            if (!this.noTitle) {
                const title = this.genPickerTitle();
                title && children.push(title);
            }
            const body = this.genPickerBody();
            body && children.push(body);
            children.push(this.$createElement('template', { slot: 'actions' }, [this.genPickerActionsSlot()]));
            return this.$createElement(VPicker, {
                staticClass,
                props: {
                    color: this.headerColor || this.color,
                    dark: this.dark,
                    fullWidth: this.fullWidth,
                    landscape: this.landscape,
                    light: this.light,
                    width: this.width
                }
            }, children);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9waWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sT0FBTyxNQUFNLHVCQUF1QixDQUFBO0FBRTNDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFDbkMsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBRW5DLFFBQVE7QUFDUixPQUFPLE1BQU0sTUFBTSxnQkFBZ0IsQ0FBQTtBQUtuQyxlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsUUFBUTtJQUVkLEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFdBQVcsRUFBRSxNQUFNO1FBQ25CLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUNELGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFDRCxvQkFBb0I7WUFDbEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7Z0JBQzNELElBQUksRUFBRyxJQUFZLENBQUMsSUFBSTtnQkFDeEIsTUFBTSxFQUFHLElBQVksQ0FBQyxNQUFNO2FBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUE7UUFDMUIsQ0FBQztRQUNELFNBQVMsQ0FBRSxXQUFtQjtZQUM1QixNQUFNLFFBQVEsR0FBWSxFQUFFLENBQUE7WUFFNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtnQkFDbkMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDOUI7WUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7WUFDakMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFM0IsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRWxHLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xDLFdBQVc7Z0JBQ1gsS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLO29CQUNyQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUN6QixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2lCQUNsQjthQUNGLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDZCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXHJcbmltcG9ydCBWUGlja2VyIGZyb20gJy4uL2NvbXBvbmVudHMvVlBpY2tlcidcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4vY29sb3JhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4vdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIENvbG9yYWJsZSxcclxuICBUaGVtZWFibGVcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICdwaWNrZXInLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZnVsbFdpZHRoOiBCb29sZWFuLFxyXG4gICAgaGVhZGVyQ29sb3I6IFN0cmluZyxcclxuICAgIGxhbmRzY2FwZTogQm9vbGVhbixcclxuICAgIG5vVGl0bGU6IEJvb2xlYW4sXHJcbiAgICB3aWR0aDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAyOTBcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5QaWNrZXJUaXRsZSAoKTogVk5vZGUgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH0sXHJcbiAgICBnZW5QaWNrZXJCb2R5ICgpOiBWTm9kZSB8IG51bGwge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfSxcclxuICAgIGdlblBpY2tlckFjdGlvbnNTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJHNjb3BlZFNsb3RzLmRlZmF1bHQgPyB0aGlzLiRzY29wZWRTbG90cy5kZWZhdWx0KHtcclxuICAgICAgICBzYXZlOiAodGhpcyBhcyBhbnkpLnNhdmUsXHJcbiAgICAgICAgY2FuY2VsOiAodGhpcyBhcyBhbnkpLmNhbmNlbFxyXG4gICAgICB9KSA6IHRoaXMuJHNsb3RzLmRlZmF1bHRcclxuICAgIH0sXHJcbiAgICBnZW5QaWNrZXIgKHN0YXRpY0NsYXNzOiBzdHJpbmcpIHtcclxuICAgICAgY29uc3QgY2hpbGRyZW46IFZOb2RlW10gPSBbXVxyXG5cclxuICAgICAgaWYgKCF0aGlzLm5vVGl0bGUpIHtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2VuUGlja2VyVGl0bGUoKVxyXG4gICAgICAgIHRpdGxlICYmIGNoaWxkcmVuLnB1c2godGl0bGUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLmdlblBpY2tlckJvZHkoKVxyXG4gICAgICBib2R5ICYmIGNoaWxkcmVuLnB1c2goYm9keSlcclxuXHJcbiAgICAgIGNoaWxkcmVuLnB1c2godGhpcy4kY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnLCB7IHNsb3Q6ICdhY3Rpb25zJyB9LCBbdGhpcy5nZW5QaWNrZXJBY3Rpb25zU2xvdCgpXSkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWUGlja2VyLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3MsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmhlYWRlckNvbG9yIHx8IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICBmdWxsV2lkdGg6IHRoaXMuZnVsbFdpZHRoLFxyXG4gICAgICAgICAgbGFuZHNjYXBlOiB0aGlzLmxhbmRzY2FwZSxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGhcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19