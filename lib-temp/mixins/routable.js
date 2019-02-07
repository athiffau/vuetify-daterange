import Vue from 'vue';
import Ripple from '../directives/ripple';
export default Vue.extend({
    name: 'routable',
    directives: {
        Ripple
    },
    props: {
        activeClass: String,
        append: Boolean,
        disabled: Boolean,
        exact: {
            type: Boolean,
            default: undefined
        },
        exactActiveClass: String,
        href: [String, Object],
        to: [String, Object],
        nuxt: Boolean,
        replace: Boolean,
        ripple: [Boolean, Object],
        tag: String,
        target: String
    },
    computed: {
        computedRipple() {
            return (this.ripple && !this.disabled) ? this.ripple : false;
        }
    },
    methods: {
        click(e) {
            this.$emit('click', e);
        },
        generateRouteLink(classes) {
            let exact = this.exact;
            let tag;
            const data = {
                attrs: { disabled: this.disabled },
                class: classes,
                props: {},
                directives: [{
                        name: 'ripple',
                        value: this.computedRipple
                    }],
                [this.to ? 'nativeOn' : 'on']: {
                    ...this.$listeners,
                    click: this.click
                }
            };
            if (typeof this.exact === 'undefined') {
                exact = this.to === '/' ||
                    (this.to === Object(this.to) && this.to.path === '/');
            }
            if (this.to) {
                // Add a special activeClass hook
                // for component level styles
                let activeClass = this.activeClass;
                let exactActiveClass = this.exactActiveClass || activeClass;
                // TODO: apply only in VListTile
                if (this.proxyClass) {
                    activeClass += ' ' + this.proxyClass;
                    exactActiveClass += ' ' + this.proxyClass;
                }
                tag = this.nuxt ? 'nuxt-link' : 'router-link';
                Object.assign(data.props, {
                    to: this.to,
                    exact,
                    activeClass,
                    exactActiveClass,
                    append: this.append,
                    replace: this.replace
                });
            }
            else {
                tag = (this.href && 'a') || this.tag || 'a';
                if (tag === 'a' && this.href)
                    data.attrs.href = this.href;
            }
            if (this.target)
                data.attrs.target = this.target;
            return { tag, data };
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL3JvdXRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBa0IsTUFBTSxLQUFLLENBQUE7QUFHcEMsT0FBTyxNQUF5QixNQUFNLHNCQUFzQixDQUFBO0FBRTVELGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUU7UUFDVixNQUFNO0tBQ1A7SUFFRCxLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsTUFBTTtRQUNuQixNQUFNLEVBQUUsT0FBTztRQUNmLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLFNBQVM7U0FDbUI7UUFDdkMsZ0JBQWdCLEVBQUUsTUFBTTtRQUN4QixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1FBQ3RCLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDcEIsSUFBSSxFQUFFLE9BQU87UUFDYixPQUFPLEVBQUUsT0FBTztRQUNoQixNQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1FBQ3pCLEdBQUcsRUFBRSxNQUFNO1FBQ1gsTUFBTSxFQUFFLE1BQU07S0FDZjtJQUVELFFBQVEsRUFBRTtRQUNSLGNBQWM7WUFDWixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQzlELENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLEtBQUssQ0FBRSxDQUFhO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3hCLENBQUM7UUFDRCxpQkFBaUIsQ0FBRSxPQUFZO1lBQzdCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7WUFDdEIsSUFBSSxHQUFHLENBQUE7WUFFUCxNQUFNLElBQUksR0FBYztnQkFDdEIsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xDLEtBQUssRUFBRSxPQUFPO2dCQUNkLEtBQUssRUFBRSxFQUFFO2dCQUNULFVBQVUsRUFBRSxDQUFDO3dCQUNYLElBQUksRUFBRSxRQUFRO3dCQUNkLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYztxQkFDM0IsQ0FBQztnQkFDRixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzdCLEdBQUcsSUFBSSxDQUFDLFVBQVU7b0JBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztpQkFDbEI7YUFDRixDQUFBO1lBRUQsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFO2dCQUNyQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHO29CQUNyQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQTthQUN4RDtZQUVELElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtnQkFDWCxpQ0FBaUM7Z0JBQ2pDLDZCQUE2QjtnQkFDN0IsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQTtnQkFDbEMsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksV0FBVyxDQUFBO2dCQUUzRCxnQ0FBZ0M7Z0JBQ2hDLElBQUssSUFBWSxDQUFDLFVBQVUsRUFBRTtvQkFDNUIsV0FBVyxJQUFJLEdBQUcsR0FBSSxJQUFZLENBQUMsVUFBVSxDQUFBO29CQUM3QyxnQkFBZ0IsSUFBSSxHQUFHLEdBQUksSUFBWSxDQUFDLFVBQVUsQ0FBQTtpQkFDbkQ7Z0JBRUQsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFBO2dCQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ3hCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDWCxLQUFLO29CQUNMLFdBQVc7b0JBQ1gsZ0JBQWdCO29CQUNoQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztpQkFDdEIsQ0FBQyxDQUFBO2FBQ0g7aUJBQU07Z0JBQ0wsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQTtnQkFFM0MsSUFBSSxHQUFHLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJO29CQUFFLElBQUksQ0FBQyxLQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7YUFDM0Q7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUFFLElBQUksQ0FBQyxLQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7WUFFakQsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQTtRQUN0QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlLCB7IFZOb2RlRGF0YSB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xyXG5cclxuaW1wb3J0IFJpcHBsZSwgeyBSaXBwbGVPcHRpb25zIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yaXBwbGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcclxuICBuYW1lOiAncm91dGFibGUnLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7XHJcbiAgICBSaXBwbGVcclxuICB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWN0aXZlQ2xhc3M6IFN0cmluZyxcclxuICAgIGFwcGVuZDogQm9vbGVhbixcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgZXhhY3Q6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8Ym9vbGVhbiB8IHVuZGVmaW5lZD4sXHJcbiAgICBleGFjdEFjdGl2ZUNsYXNzOiBTdHJpbmcsXHJcbiAgICBocmVmOiBbU3RyaW5nLCBPYmplY3RdLFxyXG4gICAgdG86IFtTdHJpbmcsIE9iamVjdF0sXHJcbiAgICBudXh0OiBCb29sZWFuLFxyXG4gICAgcmVwbGFjZTogQm9vbGVhbixcclxuICAgIHJpcHBsZTogW0Jvb2xlYW4sIE9iamVjdF0sXHJcbiAgICB0YWc6IFN0cmluZyxcclxuICAgIHRhcmdldDogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvbXB1dGVkUmlwcGxlICgpOiBSaXBwbGVPcHRpb25zIHwgYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAodGhpcy5yaXBwbGUgJiYgIXRoaXMuZGlzYWJsZWQpID8gdGhpcy5yaXBwbGUgOiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNsaWNrIChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcclxuICAgIH0sXHJcbiAgICBnZW5lcmF0ZVJvdXRlTGluayAoY2xhc3NlczogYW55KSB7XHJcbiAgICAgIGxldCBleGFjdCA9IHRoaXMuZXhhY3RcclxuICAgICAgbGV0IHRhZ1xyXG5cclxuICAgICAgY29uc3QgZGF0YTogVk5vZGVEYXRhID0ge1xyXG4gICAgICAgIGF0dHJzOiB7IGRpc2FibGVkOiB0aGlzLmRpc2FibGVkIH0sXHJcbiAgICAgICAgY2xhc3M6IGNsYXNzZXMsXHJcbiAgICAgICAgcHJvcHM6IHt9LFxyXG4gICAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgICBuYW1lOiAncmlwcGxlJyxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmNvbXB1dGVkUmlwcGxlXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgW3RoaXMudG8gPyAnbmF0aXZlT24nIDogJ29uJ106IHtcclxuICAgICAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcclxuICAgICAgICAgIGNsaWNrOiB0aGlzLmNsaWNrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHRoaXMuZXhhY3QgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgZXhhY3QgPSB0aGlzLnRvID09PSAnLycgfHxcclxuICAgICAgICAgICh0aGlzLnRvID09PSBPYmplY3QodGhpcy50bykgJiYgdGhpcy50by5wYXRoID09PSAnLycpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnRvKSB7XHJcbiAgICAgICAgLy8gQWRkIGEgc3BlY2lhbCBhY3RpdmVDbGFzcyBob29rXHJcbiAgICAgICAgLy8gZm9yIGNvbXBvbmVudCBsZXZlbCBzdHlsZXNcclxuICAgICAgICBsZXQgYWN0aXZlQ2xhc3MgPSB0aGlzLmFjdGl2ZUNsYXNzXHJcbiAgICAgICAgbGV0IGV4YWN0QWN0aXZlQ2xhc3MgPSB0aGlzLmV4YWN0QWN0aXZlQ2xhc3MgfHwgYWN0aXZlQ2xhc3NcclxuXHJcbiAgICAgICAgLy8gVE9ETzogYXBwbHkgb25seSBpbiBWTGlzdFRpbGVcclxuICAgICAgICBpZiAoKHRoaXMgYXMgYW55KS5wcm94eUNsYXNzKSB7XHJcbiAgICAgICAgICBhY3RpdmVDbGFzcyArPSAnICcgKyAodGhpcyBhcyBhbnkpLnByb3h5Q2xhc3NcclxuICAgICAgICAgIGV4YWN0QWN0aXZlQ2xhc3MgKz0gJyAnICsgKHRoaXMgYXMgYW55KS5wcm94eUNsYXNzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YWcgPSB0aGlzLm51eHQgPyAnbnV4dC1saW5rJyA6ICdyb3V0ZXItbGluaydcclxuICAgICAgICBPYmplY3QuYXNzaWduKGRhdGEucHJvcHMsIHtcclxuICAgICAgICAgIHRvOiB0aGlzLnRvLFxyXG4gICAgICAgICAgZXhhY3QsXHJcbiAgICAgICAgICBhY3RpdmVDbGFzcyxcclxuICAgICAgICAgIGV4YWN0QWN0aXZlQ2xhc3MsXHJcbiAgICAgICAgICBhcHBlbmQ6IHRoaXMuYXBwZW5kLFxyXG4gICAgICAgICAgcmVwbGFjZTogdGhpcy5yZXBsYWNlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0YWcgPSAodGhpcy5ocmVmICYmICdhJykgfHwgdGhpcy50YWcgfHwgJ2EnXHJcblxyXG4gICAgICAgIGlmICh0YWcgPT09ICdhJyAmJiB0aGlzLmhyZWYpIGRhdGEuYXR0cnMhLmhyZWYgPSB0aGlzLmhyZWZcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMudGFyZ2V0KSBkYXRhLmF0dHJzIS50YXJnZXQgPSB0aGlzLnRhcmdldFxyXG5cclxuICAgICAgcmV0dXJuIHsgdGFnLCBkYXRhIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==