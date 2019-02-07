// Styles
import '../../stylus/components/_labels.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable, { functionalThemeClasses } from '../../mixins/themeable';
import mixins from '../../util/mixins';
// Helpers
import { convertToUnit } from '../../util/helpers';
/* @vue/component */
export default mixins(Themeable).extend({
    name: 'v-label',
    functional: true,
    props: {
        absolute: Boolean,
        color: {
            type: [Boolean, String],
            default: 'primary'
        },
        disabled: Boolean,
        focused: Boolean,
        for: String,
        left: {
            type: [Number, String],
            default: 0
        },
        right: {
            type: [Number, String],
            default: 'auto'
        },
        value: Boolean
    },
    render(h, ctx) {
        const { children, listeners, props } = ctx;
        const data = {
            staticClass: 'v-label',
            'class': {
                'v-label--active': props.value,
                'v-label--is-disabled': props.disabled,
                ...functionalThemeClasses(ctx)
            },
            attrs: {
                for: props.for,
                'aria-hidden': !props.for
            },
            on: listeners,
            style: {
                left: convertToUnit(props.left),
                right: convertToUnit(props.right),
                position: props.absolute ? 'absolute' : 'relative'
            }
        };
        return h('label', Colorable.options.methods.setTextColor(props.focused && props.color, data), children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxhYmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxhYmVsL1ZMYWJlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtBQUU3QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLEVBQUUsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdCQUF3QixDQUFBO0FBSTFFLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLFVBQVU7QUFDVixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFbEQsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxJQUFJLEVBQUUsU0FBUztJQUVmLFVBQVUsRUFBRSxJQUFJO0lBRWhCLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxRQUFRLEVBQUUsT0FBTztRQUNqQixPQUFPLEVBQUUsT0FBTztRQUNoQixHQUFHLEVBQUUsTUFBTTtRQUNYLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxLQUFLLEVBQUUsT0FBTztLQUNmO0lBRUQsTUFBTSxDQUFFLENBQUMsRUFBRSxHQUFrQjtRQUMzQixNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUE7UUFDMUMsTUFBTSxJQUFJLEdBQUc7WUFDWCxXQUFXLEVBQUUsU0FBUztZQUN0QixPQUFPLEVBQUU7Z0JBQ1AsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLEtBQUs7Z0JBQzlCLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN0QyxHQUFHLHNCQUFzQixDQUFDLEdBQUcsQ0FBQzthQUMvQjtZQUNELEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7Z0JBQ2QsYUFBYSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUc7YUFDMUI7WUFDRCxFQUFFLEVBQUUsU0FBUztZQUNiLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQy9CLEtBQUssRUFBRSxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDakMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVTthQUNuRDtTQUNGLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN6RyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2xhYmVscy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSwgeyBmdW5jdGlvbmFsVGhlbWVDbGFzc2VzIH0gZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlLCBSZW5kZXJDb250ZXh0IH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gSGVscGVyc1xyXG5pbXBvcnQgeyBjb252ZXJ0VG9Vbml0IH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFRoZW1lYWJsZSkuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1sYWJlbCcsXHJcblxyXG4gIGZ1bmN0aW9uYWw6IHRydWUsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhYnNvbHV0ZTogQm9vbGVhbixcclxuICAgIGNvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeSdcclxuICAgIH0sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGZvY3VzZWQ6IEJvb2xlYW4sXHJcbiAgICBmb3I6IFN0cmluZyxcclxuICAgIGxlZnQ6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIHJpZ2h0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIHZhbHVlOiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoLCBjdHg6IFJlbmRlckNvbnRleHQpOiBWTm9kZSB7XHJcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBsaXN0ZW5lcnMsIHByb3BzIH0gPSBjdHhcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1sYWJlbCcsXHJcbiAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAndi1sYWJlbC0tYWN0aXZlJzogcHJvcHMudmFsdWUsXHJcbiAgICAgICAgJ3YtbGFiZWwtLWlzLWRpc2FibGVkJzogcHJvcHMuZGlzYWJsZWQsXHJcbiAgICAgICAgLi4uZnVuY3Rpb25hbFRoZW1lQ2xhc3NlcyhjdHgpXHJcbiAgICAgIH0sXHJcbiAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgZm9yOiBwcm9wcy5mb3IsXHJcbiAgICAgICAgJ2FyaWEtaGlkZGVuJzogIXByb3BzLmZvclxyXG4gICAgICB9LFxyXG4gICAgICBvbjogbGlzdGVuZXJzLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGxlZnQ6IGNvbnZlcnRUb1VuaXQocHJvcHMubGVmdCksXHJcbiAgICAgICAgcmlnaHQ6IGNvbnZlcnRUb1VuaXQocHJvcHMucmlnaHQpLFxyXG4gICAgICAgIHBvc2l0aW9uOiBwcm9wcy5hYnNvbHV0ZSA/ICdhYnNvbHV0ZScgOiAncmVsYXRpdmUnXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaCgnbGFiZWwnLCBDb2xvcmFibGUub3B0aW9ucy5tZXRob2RzLnNldFRleHRDb2xvcihwcm9wcy5mb2N1c2VkICYmIHByb3BzLmNvbG9yLCBkYXRhKSwgY2hpbGRyZW4pXHJcbiAgfVxyXG59KVxyXG4iXX0=