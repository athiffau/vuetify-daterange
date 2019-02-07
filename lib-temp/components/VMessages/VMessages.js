// Styles
import '../../stylus/components/_messages.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Themeable).extend({
    name: 'v-messages',
    props: {
        value: {
            type: Array,
            default: () => ([])
        }
    },
    methods: {
        genChildren() {
            return this.$createElement('transition-group', {
                staticClass: 'v-messages__wrapper',
                attrs: {
                    name: 'message-transition',
                    tag: 'div'
                }
            }, this.value.map(this.genMessage));
        },
        genMessage(message, key) {
            return this.$createElement('div', {
                staticClass: 'v-messages__message',
                key,
                domProps: {
                    innerHTML: message
                }
            });
        }
    },
    render(h) {
        return h('div', this.setTextColor(this.color, {
            staticClass: 'v-messages',
            class: this.themeClasses
        }), [this.genChildren()]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk1lc3NhZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lc3NhZ2VzL1ZNZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUUvQyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFLOUMsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDakQsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDTztLQUM3QjtJQUVELE9BQU8sRUFBRTtRQUNQLFdBQVc7WUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzdDLFdBQVcsRUFBRSxxQkFBcUI7Z0JBQ2xDLEtBQUssRUFBRTtvQkFDTCxJQUFJLEVBQUUsb0JBQW9CO29CQUMxQixHQUFHLEVBQUUsS0FBSztpQkFDWDthQUNGLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDckMsQ0FBQztRQUNELFVBQVUsQ0FBRSxPQUFlLEVBQUUsR0FBVztZQUN0QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUscUJBQXFCO2dCQUNsQyxHQUFHO2dCQUNILFFBQVEsRUFBRTtvQkFDUixTQUFTLEVBQUUsT0FBTztpQkFDbkI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDNUMsV0FBVyxFQUFFLFlBQVk7WUFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ3pCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDM0IsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19tZXNzYWdlcy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhDb2xvcmFibGUsIFRoZW1lYWJsZSkuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1tZXNzYWdlcycsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICB2YWx1ZToge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKVxyXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPHN0cmluZ1tdPlxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlbkNoaWxkcmVuICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RyYW5zaXRpb24tZ3JvdXAnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LW1lc3NhZ2VzX193cmFwcGVyJyxcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgbmFtZTogJ21lc3NhZ2UtdHJhbnNpdGlvbicsXHJcbiAgICAgICAgICB0YWc6ICdkaXYnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCB0aGlzLnZhbHVlLm1hcCh0aGlzLmdlbk1lc3NhZ2UpKVxyXG4gICAgfSxcclxuICAgIGdlbk1lc3NhZ2UgKG1lc3NhZ2U6IHN0cmluZywga2V5OiBudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtbWVzc2FnZXNfX21lc3NhZ2UnLFxyXG4gICAgICAgIGtleSxcclxuICAgICAgICBkb21Qcm9wczoge1xyXG4gICAgICAgICAgaW5uZXJIVE1MOiBtZXNzYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbG9yLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1tZXNzYWdlcycsXHJcbiAgICAgIGNsYXNzOiB0aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgfSksIFt0aGlzLmdlbkNoaWxkcmVuKCldKVxyXG4gIH1cclxufSlcclxuIl19