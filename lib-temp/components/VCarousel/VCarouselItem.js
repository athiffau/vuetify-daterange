// Extensions
import VWindowItem from '../VWindow/VWindowItem';
// Components
import { VImg } from '../VImg';
/* @vue/component */
export default VWindowItem.extend({
    name: 'v-carousel-item',
    inheritAttrs: false,
    methods: {
        genDefaultSlot() {
            return [
                this.$createElement(VImg, {
                    staticClass: 'v-carousel__item',
                    props: {
                        ...this.$attrs,
                        height: this.windowGroup.internalHeight
                    },
                    on: this.$listeners
                }, this.$slots.default)
            ];
        },
        onBeforeEnter() { },
        onEnter() { },
        onAfterEnter() { },
        onBeforeLeave() { },
        onEnterCancelled() { }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcm91c2VsSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDYXJvdXNlbC9WQ2Fyb3VzZWxJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGFBQWE7QUFDYixPQUFPLFdBQVcsTUFBTSx3QkFBd0IsQ0FBQTtBQUVoRCxhQUFhO0FBQ2IsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUU5QixvQkFBb0I7QUFDcEIsZUFBZSxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2hDLElBQUksRUFBRSxpQkFBaUI7SUFFdkIsWUFBWSxFQUFFLEtBQUs7SUFFbkIsT0FBTyxFQUFFO1FBQ1AsY0FBYztZQUNaLE9BQU87Z0JBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUU7b0JBQ3hCLFdBQVcsRUFBRSxrQkFBa0I7b0JBQy9CLEtBQUssRUFBRTt3QkFDTCxHQUFHLElBQUksQ0FBQyxNQUFNO3dCQUNkLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWM7cUJBQ3hDO29CQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtpQkFDcEIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUN4QixDQUFBO1FBQ0gsQ0FBQztRQUNELGFBQWEsS0FBaUIsQ0FBQztRQUMvQixPQUFPLEtBQWlCLENBQUM7UUFDekIsWUFBWSxLQUFpQixDQUFDO1FBQzlCLGFBQWEsS0FBaUIsQ0FBQztRQUMvQixnQkFBZ0IsS0FBaUIsQ0FBQztLQUNuQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEV4dGVuc2lvbnNcclxuaW1wb3J0IFZXaW5kb3dJdGVtIGZyb20gJy4uL1ZXaW5kb3cvVldpbmRvd0l0ZW0nXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCB7IFZJbWcgfSBmcm9tICcuLi9WSW1nJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVldpbmRvd0l0ZW0uZXh0ZW5kKHtcclxuICBuYW1lOiAndi1jYXJvdXNlbC1pdGVtJyxcclxuXHJcbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuRGVmYXVsdFNsb3QgKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkltZywge1xyXG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNhcm91c2VsX19pdGVtJyxcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIC4uLnRoaXMuJGF0dHJzLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMud2luZG93R3JvdXAuaW50ZXJuYWxIZWlnaHRcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogdGhpcy4kbGlzdGVuZXJzXHJcbiAgICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIG9uQmVmb3JlRW50ZXIgKCkgeyAvKiBub29wICovIH0sXHJcbiAgICBvbkVudGVyICgpIHsgLyogbm9vcCAqLyB9LFxyXG4gICAgb25BZnRlckVudGVyICgpIHsgLyogbm9vcCAqLyB9LFxyXG4gICAgb25CZWZvcmVMZWF2ZSAoKSB7IC8qIG5vb3AgKi8gfSxcclxuICAgIG9uRW50ZXJDYW5jZWxsZWQgKCkgeyAvKiBub29wICovIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==