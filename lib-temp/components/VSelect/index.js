import VSelect from './VSelect';
import VOverflowBtn from '../VOverflowBtn';
import VAutocomplete from '../VAutocomplete';
import VCombobox from '../VCombobox';
import rebuildSlots from '../../util/rebuildFunctionalSlots';
import dedupeModelListeners from '../../util/dedupeModelListeners';
import { deprecate } from '../../util/console';
/* @vue/component */
const wrapper = {
    functional: true,
    $_wrapperFor: VSelect,
    props: {
        // VAutoComplete
        /** @deprecated */
        autocomplete: Boolean,
        /** @deprecated */
        combobox: Boolean,
        multiple: Boolean,
        /** @deprecated */
        tags: Boolean,
        // VOverflowBtn
        /** @deprecated */
        editable: Boolean,
        /** @deprecated */
        overflow: Boolean,
        /** @deprecated */
        segmented: Boolean
    },
    render(h, { props, data, slots, parent }) {
        dedupeModelListeners(data);
        const children = rebuildSlots(slots(), h);
        if (props.autocomplete) {
            deprecate('<v-select autocomplete>', '<v-autocomplete>', wrapper, parent);
        }
        if (props.combobox) {
            deprecate('<v-select combobox>', '<v-combobox>', wrapper, parent);
        }
        if (props.tags) {
            deprecate('<v-select tags>', '<v-combobox multiple>', wrapper, parent);
        }
        if (props.overflow) {
            deprecate('<v-select overflow>', '<v-overflow-btn>', wrapper, parent);
        }
        if (props.segmented) {
            deprecate('<v-select segmented>', '<v-overflow-btn segmented>', wrapper, parent);
        }
        if (props.editable) {
            deprecate('<v-select editable>', '<v-overflow-btn editable>', wrapper, parent);
        }
        data.attrs = data.attrs || {};
        if (props.combobox || props.tags) {
            data.attrs.multiple = props.tags;
            return h(VCombobox, data, children);
        }
        else if (props.autocomplete) {
            data.attrs.multiple = props.multiple;
            return h(VAutocomplete, data, children);
        }
        else if (props.overflow || props.segmented || props.editable) {
            data.attrs.segmented = props.segmented;
            data.attrs.editable = props.editable;
            return h(VOverflowBtn, data, children);
        }
        else {
            data.attrs.multiple = props.multiple;
            return h(VSelect, data, children);
        }
    }
};
export { wrapper as VSelect };
export default wrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WU2VsZWN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLFdBQVcsQ0FBQTtBQUMvQixPQUFPLFlBQVksTUFBTSxpQkFBaUIsQ0FBQTtBQUMxQyxPQUFPLGFBQWEsTUFBTSxrQkFBa0IsQ0FBQTtBQUM1QyxPQUFPLFNBQVMsTUFBTSxjQUFjLENBQUE7QUFDcEMsT0FBTyxZQUFZLE1BQU0sbUNBQW1DLENBQUE7QUFDNUQsT0FBTyxvQkFBb0IsTUFBTSxpQ0FBaUMsQ0FBQTtBQUNsRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFOUMsb0JBQW9CO0FBQ3BCLE1BQU0sT0FBTyxHQUFHO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFFaEIsWUFBWSxFQUFFLE9BQU87SUFFckIsS0FBSyxFQUFFO1FBQ0wsZ0JBQWdCO1FBQ2hCLGtCQUFrQjtRQUNsQixZQUFZLEVBQUUsT0FBTztRQUNyQixrQkFBa0I7UUFDbEIsUUFBUSxFQUFFLE9BQU87UUFDakIsUUFBUSxFQUFFLE9BQU87UUFDakIsa0JBQWtCO1FBQ2xCLElBQUksRUFBRSxPQUFPO1FBQ2IsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixRQUFRLEVBQUUsT0FBTztRQUNqQixrQkFBa0I7UUFDbEIsUUFBUSxFQUFFLE9BQU87UUFDakIsa0JBQWtCO1FBQ2xCLFNBQVMsRUFBRSxPQUFPO0tBQ25CO0lBRUQsTUFBTSxDQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUN2QyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQixNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFekMsSUFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQ3RCLFNBQVMsQ0FBQyx5QkFBeUIsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDMUU7UUFDRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsU0FBUyxDQUFDLHFCQUFxQixFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDbEU7UUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDZCxTQUFTLENBQUMsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQ3ZFO1FBRUQsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ2xCLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDdEU7UUFDRCxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDbkIsU0FBUyxDQUFDLHNCQUFzQixFQUFFLDRCQUE0QixFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUNqRjtRQUNELElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNsQixTQUFTLENBQUMscUJBQXFCLEVBQUUsMkJBQTJCLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQy9FO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQTtRQUU3QixJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtZQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFBO1lBQ2hDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7U0FDcEM7YUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQTtZQUNwQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ3hDO2FBQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUM5RCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFBO1lBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUE7WUFDcEMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUN2QzthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQTtZQUNwQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1NBQ2xDO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCxPQUFPLEVBQUUsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFBO0FBRTdCLGVBQWUsT0FBTyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZTZWxlY3QgZnJvbSAnLi9WU2VsZWN0J1xyXG5pbXBvcnQgVk92ZXJmbG93QnRuIGZyb20gJy4uL1ZPdmVyZmxvd0J0bidcclxuaW1wb3J0IFZBdXRvY29tcGxldGUgZnJvbSAnLi4vVkF1dG9jb21wbGV0ZSdcclxuaW1wb3J0IFZDb21ib2JveCBmcm9tICcuLi9WQ29tYm9ib3gnXHJcbmltcG9ydCByZWJ1aWxkU2xvdHMgZnJvbSAnLi4vLi4vdXRpbC9yZWJ1aWxkRnVuY3Rpb25hbFNsb3RzJ1xyXG5pbXBvcnQgZGVkdXBlTW9kZWxMaXN0ZW5lcnMgZnJvbSAnLi4vLi4vdXRpbC9kZWR1cGVNb2RlbExpc3RlbmVycydcclxuaW1wb3J0IHsgZGVwcmVjYXRlIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuY29uc3Qgd3JhcHBlciA9IHtcclxuICBmdW5jdGlvbmFsOiB0cnVlLFxyXG5cclxuICAkX3dyYXBwZXJGb3I6IFZTZWxlY3QsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICAvLyBWQXV0b0NvbXBsZXRlXHJcbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgIGF1dG9jb21wbGV0ZTogQm9vbGVhbixcclxuICAgIC8qKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgY29tYm9ib3g6IEJvb2xlYW4sXHJcbiAgICBtdWx0aXBsZTogQm9vbGVhbixcclxuICAgIC8qKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgdGFnczogQm9vbGVhbixcclxuICAgIC8vIFZPdmVyZmxvd0J0blxyXG4gICAgLyoqIEBkZXByZWNhdGVkICovXHJcbiAgICBlZGl0YWJsZTogQm9vbGVhbixcclxuICAgIC8qKiBAZGVwcmVjYXRlZCAqL1xyXG4gICAgb3ZlcmZsb3c6IEJvb2xlYW4sXHJcbiAgICAvKiogQGRlcHJlY2F0ZWQgKi9cclxuICAgIHNlZ21lbnRlZDogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCwgeyBwcm9wcywgZGF0YSwgc2xvdHMsIHBhcmVudCB9KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LXN0YXRlbWVudHNcclxuICAgIGRlZHVwZU1vZGVsTGlzdGVuZXJzKGRhdGEpXHJcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJlYnVpbGRTbG90cyhzbG90cygpLCBoKVxyXG5cclxuICAgIGlmIChwcm9wcy5hdXRvY29tcGxldGUpIHtcclxuICAgICAgZGVwcmVjYXRlKCc8di1zZWxlY3QgYXV0b2NvbXBsZXRlPicsICc8di1hdXRvY29tcGxldGU+Jywgd3JhcHBlciwgcGFyZW50KVxyXG4gICAgfVxyXG4gICAgaWYgKHByb3BzLmNvbWJvYm94KSB7XHJcbiAgICAgIGRlcHJlY2F0ZSgnPHYtc2VsZWN0IGNvbWJvYm94PicsICc8di1jb21ib2JveD4nLCB3cmFwcGVyLCBwYXJlbnQpXHJcbiAgICB9XHJcbiAgICBpZiAocHJvcHMudGFncykge1xyXG4gICAgICBkZXByZWNhdGUoJzx2LXNlbGVjdCB0YWdzPicsICc8di1jb21ib2JveCBtdWx0aXBsZT4nLCB3cmFwcGVyLCBwYXJlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHByb3BzLm92ZXJmbG93KSB7XHJcbiAgICAgIGRlcHJlY2F0ZSgnPHYtc2VsZWN0IG92ZXJmbG93PicsICc8di1vdmVyZmxvdy1idG4+Jywgd3JhcHBlciwgcGFyZW50KVxyXG4gICAgfVxyXG4gICAgaWYgKHByb3BzLnNlZ21lbnRlZCkge1xyXG4gICAgICBkZXByZWNhdGUoJzx2LXNlbGVjdCBzZWdtZW50ZWQ+JywgJzx2LW92ZXJmbG93LWJ0biBzZWdtZW50ZWQ+Jywgd3JhcHBlciwgcGFyZW50KVxyXG4gICAgfVxyXG4gICAgaWYgKHByb3BzLmVkaXRhYmxlKSB7XHJcbiAgICAgIGRlcHJlY2F0ZSgnPHYtc2VsZWN0IGVkaXRhYmxlPicsICc8di1vdmVyZmxvdy1idG4gZWRpdGFibGU+Jywgd3JhcHBlciwgcGFyZW50KVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuYXR0cnMgPSBkYXRhLmF0dHJzIHx8IHt9XHJcblxyXG4gICAgaWYgKHByb3BzLmNvbWJvYm94IHx8IHByb3BzLnRhZ3MpIHtcclxuICAgICAgZGF0YS5hdHRycy5tdWx0aXBsZSA9IHByb3BzLnRhZ3NcclxuICAgICAgcmV0dXJuIGgoVkNvbWJvYm94LCBkYXRhLCBjaGlsZHJlbilcclxuICAgIH0gZWxzZSBpZiAocHJvcHMuYXV0b2NvbXBsZXRlKSB7XHJcbiAgICAgIGRhdGEuYXR0cnMubXVsdGlwbGUgPSBwcm9wcy5tdWx0aXBsZVxyXG4gICAgICByZXR1cm4gaChWQXV0b2NvbXBsZXRlLCBkYXRhLCBjaGlsZHJlbilcclxuICAgIH0gZWxzZSBpZiAocHJvcHMub3ZlcmZsb3cgfHwgcHJvcHMuc2VnbWVudGVkIHx8IHByb3BzLmVkaXRhYmxlKSB7XHJcbiAgICAgIGRhdGEuYXR0cnMuc2VnbWVudGVkID0gcHJvcHMuc2VnbWVudGVkXHJcbiAgICAgIGRhdGEuYXR0cnMuZWRpdGFibGUgPSBwcm9wcy5lZGl0YWJsZVxyXG4gICAgICByZXR1cm4gaChWT3ZlcmZsb3dCdG4sIGRhdGEsIGNoaWxkcmVuKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGF0YS5hdHRycy5tdWx0aXBsZSA9IHByb3BzLm11bHRpcGxlXHJcbiAgICAgIHJldHVybiBoKFZTZWxlY3QsIGRhdGEsIGNoaWxkcmVuKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgd3JhcHBlciBhcyBWU2VsZWN0IH1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHdyYXBwZXJcclxuIl19