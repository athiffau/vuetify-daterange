// Styles
import '../../stylus/components/_alerts.styl';
// Components
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Toggleable from '../../mixins/toggleable';
import Transitionable from '../../mixins/transitionable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Toggleable, Transitionable).extend({
    name: 'v-alert',
    props: {
        dismissible: Boolean,
        icon: String,
        outline: Boolean,
        type: {
            type: String,
            validator(val) {
                return [
                    'info',
                    'error',
                    'success',
                    'warning'
                ].includes(val);
            }
        }
    },
    computed: {
        computedColor() {
            return (this.type && !this.color) ? this.type : (this.color || 'error');
        },
        computedIcon() {
            if (this.icon || !this.type)
                return this.icon;
            switch (this.type) {
                case 'info': return '$vuetify.icons.info';
                case 'error': return '$vuetify.icons.error';
                case 'success': return '$vuetify.icons.success';
                case 'warning': return '$vuetify.icons.warning';
            }
        }
    },
    methods: {
        genIcon() {
            if (!this.computedIcon)
                return null;
            return this.$createElement(VIcon, {
                'class': 'v-alert__icon'
            }, this.computedIcon);
        },
        genDismissible() {
            if (!this.dismissible)
                return null;
            return this.$createElement('a', {
                'class': 'v-alert__dismissible',
                on: { click: () => { this.isActive = false; } }
            }, [
                this.$createElement(VIcon, {
                    props: {
                        right: true
                    }
                }, '$vuetify.icons.cancel')
            ]);
        }
    },
    render(h) {
        const children = [
            this.genIcon(),
            h('div', this.$slots.default),
            this.genDismissible()
        ];
        const setColor = this.outline ? this.setTextColor : this.setBackgroundColor;
        const alert = h('div', setColor(this.computedColor, {
            staticClass: 'v-alert',
            'class': {
                'v-alert--outline': this.outline
            },
            directives: [{
                    name: 'show',
                    value: this.isActive
                }],
            on: this.$listeners
        }), children);
        if (!this.transition)
            return alert;
        return h('transition', {
            props: {
                name: this.transition,
                origin: this.origin,
                mode: this.mode
            }
        }, [alert]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFsZXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkFsZXJ0L1ZBbGVydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtBQUU3QyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLGNBQWMsTUFBTSw2QkFBNkIsQ0FBQTtBQUl4RCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDbEUsSUFBSSxFQUFFLFNBQVM7SUFFZixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsT0FBTztRQUNwQixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osU0FBUyxDQUFFLEdBQVc7Z0JBQ3BCLE9BQU87b0JBQ0wsTUFBTTtvQkFDTixPQUFPO29CQUNQLFNBQVM7b0JBQ1QsU0FBUztpQkFDVixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNqQixDQUFDO1NBQ0Y7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLGFBQWE7WUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxDQUFBO1FBQ3pFLENBQUM7UUFDRCxZQUFZO1lBQ1YsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBO1lBRTdDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDakIsS0FBSyxNQUFNLENBQUMsQ0FBQyxPQUFPLHFCQUFxQixDQUFBO2dCQUN6QyxLQUFLLE9BQU8sQ0FBQyxDQUFDLE9BQU8sc0JBQXNCLENBQUE7Z0JBQzNDLEtBQUssU0FBUyxDQUFDLENBQUMsT0FBTyx3QkFBd0IsQ0FBQTtnQkFDL0MsS0FBSyxTQUFTLENBQUMsQ0FBQyxPQUFPLHdCQUF3QixDQUFBO2FBQ2hEO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsT0FBTztZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUVuQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxPQUFPLEVBQUUsZUFBZTthQUN6QixFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN2QixDQUFDO1FBRUQsY0FBYztZQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVztnQkFBRSxPQUFPLElBQUksQ0FBQTtZQUVsQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFO2dCQUM5QixPQUFPLEVBQUUsc0JBQXNCO2dCQUMvQixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUU7YUFDL0MsRUFBRTtnQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtvQkFDekIsS0FBSyxFQUFFO3dCQUNMLEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGLEVBQUUsdUJBQXVCLENBQUM7YUFDNUIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLFFBQVEsR0FBRztZQUNmLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQzdCLElBQUksQ0FBQyxjQUFjLEVBQUU7U0FDZixDQUFBO1FBQ1IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFBO1FBQzNFLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEQsV0FBVyxFQUFFLFNBQVM7WUFDdEIsT0FBTyxFQUFFO2dCQUNQLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ2pDO1lBQ0QsVUFBVSxFQUFFLENBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUNyQixDQUFDO1lBQ0YsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUViLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUFFLE9BQU8sS0FBSyxDQUFBO1FBRWxDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRTtZQUNyQixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTthQUNoQjtTQUNGLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ2IsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19hbGVydHMuc3R5bCdcclxuXHJcbi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXHJcbmltcG9ydCBUcmFuc2l0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdHJhbnNpdGlvbmFibGUnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZS90eXBlcydcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhDb2xvcmFibGUsIFRvZ2dsZWFibGUsIFRyYW5zaXRpb25hYmxlKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWFsZXJ0JyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGRpc21pc3NpYmxlOiBCb29sZWFuLFxyXG4gICAgaWNvbjogU3RyaW5nLFxyXG4gICAgb3V0bGluZTogQm9vbGVhbixcclxuICAgIHR5cGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB2YWxpZGF0b3IgKHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICdpbmZvJyxcclxuICAgICAgICAgICdlcnJvcicsXHJcbiAgICAgICAgICAnc3VjY2VzcycsXHJcbiAgICAgICAgICAnd2FybmluZydcclxuICAgICAgICBdLmluY2x1ZGVzKHZhbClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZENvbG9yICgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gKHRoaXMudHlwZSAmJiAhdGhpcy5jb2xvcikgPyB0aGlzLnR5cGUgOiAodGhpcy5jb2xvciB8fCAnZXJyb3InKVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkSWNvbiAoKTogc3RyaW5nIHwgdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmljb24gfHwgIXRoaXMudHlwZSkgcmV0dXJuIHRoaXMuaWNvblxyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdpbmZvJzogcmV0dXJuICckdnVldGlmeS5pY29ucy5pbmZvJ1xyXG4gICAgICAgIGNhc2UgJ2Vycm9yJzogcmV0dXJuICckdnVldGlmeS5pY29ucy5lcnJvcidcclxuICAgICAgICBjYXNlICdzdWNjZXNzJzogcmV0dXJuICckdnVldGlmeS5pY29ucy5zdWNjZXNzJ1xyXG4gICAgICAgIGNhc2UgJ3dhcm5pbmcnOiByZXR1cm4gJyR2dWV0aWZ5Lmljb25zLndhcm5pbmcnXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5JY29uICgpOiBWTm9kZSB8IG51bGwge1xyXG4gICAgICBpZiAoIXRoaXMuY29tcHV0ZWRJY29uKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcclxuICAgICAgICAnY2xhc3MnOiAndi1hbGVydF9faWNvbidcclxuICAgICAgfSwgdGhpcy5jb21wdXRlZEljb24pXHJcbiAgICB9LFxyXG5cclxuICAgIGdlbkRpc21pc3NpYmxlICgpOiBWTm9kZSB8IG51bGwge1xyXG4gICAgICBpZiAoIXRoaXMuZGlzbWlzc2libGUpIHJldHVybiBudWxsXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnYScsIHtcclxuICAgICAgICAnY2xhc3MnOiAndi1hbGVydF9fZGlzbWlzc2libGUnLFxyXG4gICAgICAgIG9uOiB7IGNsaWNrOiAoKSA9PiB7IHRoaXMuaXNBY3RpdmUgPSBmYWxzZSB9IH1cclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIHJpZ2h0OiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgJyR2dWV0aWZ5Lmljb25zLmNhbmNlbCcpXHJcbiAgICAgIF0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXHJcbiAgICAgIHRoaXMuZ2VuSWNvbigpLFxyXG4gICAgICBoKCdkaXYnLCB0aGlzLiRzbG90cy5kZWZhdWx0KSxcclxuICAgICAgdGhpcy5nZW5EaXNtaXNzaWJsZSgpXHJcbiAgICBdIGFzIGFueVxyXG4gICAgY29uc3Qgc2V0Q29sb3IgPSB0aGlzLm91dGxpbmUgPyB0aGlzLnNldFRleHRDb2xvciA6IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yXHJcbiAgICBjb25zdCBhbGVydCA9IGgoJ2RpdicsIHNldENvbG9yKHRoaXMuY29tcHV0ZWRDb2xvciwge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtYWxlcnQnLFxyXG4gICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgJ3YtYWxlcnQtLW91dGxpbmUnOiB0aGlzLm91dGxpbmVcclxuICAgICAgfSxcclxuICAgICAgZGlyZWN0aXZlczogW3tcclxuICAgICAgICBuYW1lOiAnc2hvdycsXHJcbiAgICAgICAgdmFsdWU6IHRoaXMuaXNBY3RpdmVcclxuICAgICAgfV0sXHJcbiAgICAgIG9uOiB0aGlzLiRsaXN0ZW5lcnNcclxuICAgIH0pLCBjaGlsZHJlbilcclxuXHJcbiAgICBpZiAoIXRoaXMudHJhbnNpdGlvbikgcmV0dXJuIGFsZXJ0XHJcblxyXG4gICAgcmV0dXJuIGgoJ3RyYW5zaXRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgbmFtZTogdGhpcy50cmFuc2l0aW9uLFxyXG4gICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgbW9kZTogdGhpcy5tb2RlXHJcbiAgICAgIH1cclxuICAgIH0sIFthbGVydF0pXHJcbiAgfVxyXG59KVxyXG4iXX0=