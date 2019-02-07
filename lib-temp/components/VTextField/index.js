import VTextField from './VTextField';
import VTextarea from '../VTextarea/VTextarea';
import rebuildSlots from '../../util/rebuildFunctionalSlots';
import dedupeModelListeners from '../../util/dedupeModelListeners';
import { deprecate } from '../../util/console';
// TODO: remove this in v2.0
/* @vue/component */
const wrapper = {
    functional: true,
    $_wrapperFor: VTextField,
    props: {
        textarea: Boolean,
        multiLine: Boolean
    },
    render(h, { props, data, slots, parent }) {
        dedupeModelListeners(data);
        const children = rebuildSlots(slots(), h);
        if (props.textarea) {
            deprecate('<v-text-field textarea>', '<v-textarea outline>', wrapper, parent);
        }
        if (props.multiLine) {
            deprecate('<v-text-field multi-line>', '<v-textarea>', wrapper, parent);
        }
        if (props.textarea || props.multiLine) {
            data.attrs.outline = props.textarea;
            return h(VTextarea, data, children);
        }
        else {
            return h(VTextField, data, children);
        }
    }
};
export { wrapper as VTextField };
export default wrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGV4dEZpZWxkL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sVUFBVSxNQUFNLGNBQWMsQ0FBQTtBQUNyQyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFlBQVksTUFBTSxtQ0FBbUMsQ0FBQTtBQUM1RCxPQUFPLG9CQUFvQixNQUFNLGlDQUFpQyxDQUFBO0FBQ2xFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU5Qyw0QkFBNEI7QUFDNUIsb0JBQW9CO0FBQ3BCLE1BQU0sT0FBTyxHQUFHO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFFaEIsWUFBWSxFQUFFLFVBQVU7SUFFeEIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsU0FBUyxFQUFFLE9BQU87S0FDbkI7SUFFRCxNQUFNLENBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ3ZDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBRTFCLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUV6QyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsU0FBUyxDQUFDLHlCQUF5QixFQUFFLHNCQUFzQixFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUM5RTtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNuQixTQUFTLENBQUMsMkJBQTJCLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUN4RTtRQUVELElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUE7WUFDbkMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUNwQzthQUFNO1lBQ0wsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUNyQztJQUNILENBQUM7Q0FDRixDQUFBO0FBRUQsT0FBTyxFQUFFLE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQTtBQUNoQyxlQUFlLE9BQU8sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWVGV4dEZpZWxkIGZyb20gJy4vVlRleHRGaWVsZCdcclxuaW1wb3J0IFZUZXh0YXJlYSBmcm9tICcuLi9WVGV4dGFyZWEvVlRleHRhcmVhJ1xyXG5pbXBvcnQgcmVidWlsZFNsb3RzIGZyb20gJy4uLy4uL3V0aWwvcmVidWlsZEZ1bmN0aW9uYWxTbG90cydcclxuaW1wb3J0IGRlZHVwZU1vZGVsTGlzdGVuZXJzIGZyb20gJy4uLy4uL3V0aWwvZGVkdXBlTW9kZWxMaXN0ZW5lcnMnXHJcbmltcG9ydCB7IGRlcHJlY2F0ZSB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8vIFRPRE86IHJlbW92ZSB0aGlzIGluIHYyLjBcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuY29uc3Qgd3JhcHBlciA9IHtcclxuICBmdW5jdGlvbmFsOiB0cnVlLFxyXG5cclxuICAkX3dyYXBwZXJGb3I6IFZUZXh0RmllbGQsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICB0ZXh0YXJlYTogQm9vbGVhbixcclxuICAgIG11bHRpTGluZTogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCwgeyBwcm9wcywgZGF0YSwgc2xvdHMsIHBhcmVudCB9KSB7XHJcbiAgICBkZWR1cGVNb2RlbExpc3RlbmVycyhkYXRhKVxyXG5cclxuICAgIGNvbnN0IGNoaWxkcmVuID0gcmVidWlsZFNsb3RzKHNsb3RzKCksIGgpXHJcblxyXG4gICAgaWYgKHByb3BzLnRleHRhcmVhKSB7XHJcbiAgICAgIGRlcHJlY2F0ZSgnPHYtdGV4dC1maWVsZCB0ZXh0YXJlYT4nLCAnPHYtdGV4dGFyZWEgb3V0bGluZT4nLCB3cmFwcGVyLCBwYXJlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHByb3BzLm11bHRpTGluZSkge1xyXG4gICAgICBkZXByZWNhdGUoJzx2LXRleHQtZmllbGQgbXVsdGktbGluZT4nLCAnPHYtdGV4dGFyZWE+Jywgd3JhcHBlciwgcGFyZW50KVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcm9wcy50ZXh0YXJlYSB8fCBwcm9wcy5tdWx0aUxpbmUpIHtcclxuICAgICAgZGF0YS5hdHRycy5vdXRsaW5lID0gcHJvcHMudGV4dGFyZWFcclxuICAgICAgcmV0dXJuIGgoVlRleHRhcmVhLCBkYXRhLCBjaGlsZHJlbilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBoKFZUZXh0RmllbGQsIGRhdGEsIGNoaWxkcmVuKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgd3JhcHBlciBhcyBWVGV4dEZpZWxkIH1cclxuZXhwb3J0IGRlZmF1bHQgd3JhcHBlclxyXG4iXX0=