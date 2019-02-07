import '../../stylus/components/_system-bars.styl';
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
export default mixins(Applicationable('bar', [
    'height',
    'window'
]), Colorable, Themeable
/* @vue/component */
).extend({
    name: 'v-system-bar',
    props: {
        height: {
            type: [Number, String],
            validator: (v) => !isNaN(parseInt(v))
        },
        lightsOut: Boolean,
        status: Boolean,
        window: Boolean
    },
    computed: {
        classes() {
            return {
                'v-system-bar--lights-out': this.lightsOut,
                'v-system-bar--absolute': this.absolute,
                'v-system-bar--fixed': !this.absolute && (this.app || this.fixed),
                'v-system-bar--status': this.status,
                'v-system-bar--window': this.window,
                ...this.themeClasses
            };
        },
        computedHeight() {
            if (this.height)
                return parseInt(this.height);
            return this.window ? 32 : 24;
        }
    },
    methods: {
        /**
         * Update the application layout
         *
         * @return {number}
         */
        updateApplication() {
            return this.computedHeight;
        }
    },
    render(h) {
        const data = {
            staticClass: 'v-system-bar',
            'class': this.classes,
            style: {
                height: `${this.computedHeight}px`
            }
        };
        return h('div', this.setBackgroundColor(this.color, data), this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN5c3RlbUJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTeXN0ZW1CYXIvVlN5c3RlbUJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDJDQUEyQyxDQUFBO0FBRWxELE9BQU8sZUFBZSxNQUFNLDhCQUE4QixDQUFBO0FBQzFELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBSTlDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGVBQWUsTUFBTSxDQUNuQixlQUFlLENBQUMsS0FBSyxFQUFFO0lBQ3JCLFFBQVE7SUFDUixRQUFRO0NBQ1QsQ0FBQyxFQUNGLFNBQVMsRUFDVCxTQUFTO0FBQ1gsb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGNBQWM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixTQUFTLEVBQUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztRQUNELFNBQVMsRUFBRSxPQUFPO1FBQ2xCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLE9BQU87S0FDaEI7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCwwQkFBMEIsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDMUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDakUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25DLHNCQUFzQixFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO1FBQ0QsY0FBYztZQUNaLElBQUksSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBRTdDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDOUIsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1A7Ozs7V0FJRztRQUNILGlCQUFpQjtZQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQTtRQUM1QixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sSUFBSSxHQUFHO1lBQ1gsV0FBVyxFQUFFLGNBQWM7WUFDM0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLEtBQUssRUFBRTtnQkFDTCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJO2FBQ25DO1NBQ0YsQ0FBQTtRQUVELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2pGLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19zeXN0ZW0tYmFycy5zdHlsJ1xyXG5cclxuaW1wb3J0IEFwcGxpY2F0aW9uYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYXBwbGljYXRpb25hYmxlJ1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlL3R5cGVzJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIEFwcGxpY2F0aW9uYWJsZSgnYmFyJywgW1xyXG4gICAgJ2hlaWdodCcsXHJcbiAgICAnd2luZG93J1xyXG4gIF0pLFxyXG4gIENvbG9yYWJsZSxcclxuICBUaGVtZWFibGVcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXN5c3RlbS1iYXInLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgaGVpZ2h0OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIHZhbGlkYXRvcjogKHY6IGFueSkgPT4gIWlzTmFOKHBhcnNlSW50KHYpKVxyXG4gICAgfSxcclxuICAgIGxpZ2h0c091dDogQm9vbGVhbixcclxuICAgIHN0YXR1czogQm9vbGVhbixcclxuICAgIHdpbmRvdzogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXN5c3RlbS1iYXItLWxpZ2h0cy1vdXQnOiB0aGlzLmxpZ2h0c091dCxcclxuICAgICAgICAndi1zeXN0ZW0tYmFyLS1hYnNvbHV0ZSc6IHRoaXMuYWJzb2x1dGUsXHJcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0tZml4ZWQnOiAhdGhpcy5hYnNvbHV0ZSAmJiAodGhpcy5hcHAgfHwgdGhpcy5maXhlZCksXHJcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0tc3RhdHVzJzogdGhpcy5zdGF0dXMsXHJcbiAgICAgICAgJ3Ytc3lzdGVtLWJhci0td2luZG93JzogdGhpcy53aW5kb3csXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkSGVpZ2h0ICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAodGhpcy5oZWlnaHQpIHJldHVybiBwYXJzZUludCh0aGlzLmhlaWdodClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLndpbmRvdyA/IDMyIDogMjRcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgYXBwbGljYXRpb24gbGF5b3V0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICB1cGRhdGVBcHBsaWNhdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXB1dGVkSGVpZ2h0XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXN5c3RlbS1iYXInLFxyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXMsXHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgaGVpZ2h0OiBgJHt0aGlzLmNvbXB1dGVkSGVpZ2h0fXB4YFxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIGRhdGEpLCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gIH1cclxufSlcclxuIl19