// Mixins
import Colorable from './colorable';
// Utilities
import mixins from '../util/mixins';
/* @vue/component */
export default mixins(Colorable).extend({
    methods: {
        genPickerButton(prop, value, content, readonly = false, staticClass = '') {
            const active = this[prop] === value;
            const click = (event) => {
                event.stopPropagation();
                this.$emit(`update:${prop}`, value);
            };
            return this.$createElement('div', {
                staticClass: `v-picker__title__btn ${staticClass}`.trim(),
                'class': {
                    'v-picker__title__btn--active': active,
                    'v-picker__title__btn--readonly': readonly
                },
                on: (active || readonly) ? undefined : { click }
            }, Array.isArray(content) ? content : [content]);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLWJ1dHRvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvcGlja2VyLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBRW5DLFlBQVk7QUFDWixPQUFPLE1BQU0sTUFBTSxnQkFBZ0IsQ0FBQTtBQUtuQyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLE9BQU8sRUFBRTtRQUNQLGVBQWUsQ0FDYixJQUFZLEVBQ1osS0FBVSxFQUNWLE9BQXNCLEVBQ3RCLFFBQVEsR0FBRyxLQUFLLEVBQ2hCLFdBQVcsR0FBRyxFQUFFO1lBRWhCLE1BQU0sTUFBTSxHQUFJLElBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUE7WUFDNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtnQkFDN0IsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFBO2dCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDckMsQ0FBQyxDQUFBO1lBRUQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLHdCQUF3QixXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3pELE9BQU8sRUFBRTtvQkFDUCw4QkFBOEIsRUFBRSxNQUFNO29CQUN0QyxnQ0FBZ0MsRUFBRSxRQUFRO2lCQUMzQztnQkFDRCxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUU7YUFDakQsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNsRCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuL2NvbG9yYWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGVDaGlsZHJlbiB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBDb2xvcmFibGVcclxuKS5leHRlbmQoe1xyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlblBpY2tlckJ1dHRvbiAoXHJcbiAgICAgIHByb3A6IHN0cmluZyxcclxuICAgICAgdmFsdWU6IGFueSxcclxuICAgICAgY29udGVudDogVk5vZGVDaGlsZHJlbixcclxuICAgICAgcmVhZG9ubHkgPSBmYWxzZSxcclxuICAgICAgc3RhdGljQ2xhc3MgPSAnJ1xyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IGFjdGl2ZSA9ICh0aGlzIGFzIGFueSlbcHJvcF0gPT09IHZhbHVlXHJcbiAgICAgIGNvbnN0IGNsaWNrID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdGhpcy4kZW1pdChgdXBkYXRlOiR7cHJvcH1gLCB2YWx1ZSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogYHYtcGlja2VyX190aXRsZV9fYnRuICR7c3RhdGljQ2xhc3N9YC50cmltKCksXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgJ3YtcGlja2VyX190aXRsZV9fYnRuLS1hY3RpdmUnOiBhY3RpdmUsXHJcbiAgICAgICAgICAndi1waWNrZXJfX3RpdGxlX19idG4tLXJlYWRvbmx5JzogcmVhZG9ubHlcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiAoYWN0aXZlIHx8IHJlYWRvbmx5KSA/IHVuZGVmaW5lZCA6IHsgY2xpY2sgfVxyXG4gICAgICB9LCBBcnJheS5pc0FycmF5KGNvbnRlbnQpID8gY29udGVudCA6IFtjb250ZW50XSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==