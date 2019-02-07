import Vue from 'vue';
/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */
/* @vue/component */
export default Vue.extend().extend({
    name: 'bootable',
    props: {
        lazy: Boolean
    },
    data: () => ({
        isBooted: false
    }),
    computed: {
        hasContent() {
            return this.isBooted || !this.lazy || this.isActive;
        }
    },
    watch: {
        isActive() {
            this.isBooted = true;
        }
    },
    methods: {
        showLazyContent(content) {
            return this.hasContent ? content : undefined;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL2Jvb3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQU1oQzs7Ozs7OztHQU9HO0FBQ0gsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sRUFBb0IsQ0FBQyxNQUFNLENBQUM7SUFDbkQsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE9BQU87S0FDZDtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDckQsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUTtZQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1FBQ3RCLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLGVBQWUsQ0FBRSxPQUFpQjtZQUNoQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO1FBQzlDLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUsIHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG5pbnRlcmZhY2UgVG9nZ2xlYWJsZSBleHRlbmRzIFZ1ZSB7XHJcbiAgaXNBY3RpdmU/OiBib29sZWFuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCb290YWJsZVxyXG4gKiBAbWl4aW5cclxuICpcclxuICogVXNlZCB0byBhZGQgbGF6eSBjb250ZW50IGZ1bmN0aW9uYWxpdHkgdG8gY29tcG9uZW50c1xyXG4gKiBMb29rcyBmb3IgY2hhbmdlIGluIFwiaXNBY3RpdmVcIiB0byBhdXRvbWF0aWNhbGx5IGJvb3RcclxuICogT3RoZXJ3aXNlIGNhbiBiZSBzZXQgbWFudWFsbHlcclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQ8VnVlICYgVG9nZ2xlYWJsZT4oKS5leHRlbmQoe1xyXG4gIG5hbWU6ICdib290YWJsZScsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBsYXp5OiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGlzQm9vdGVkOiBmYWxzZVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgaGFzQ29udGVudCAoKTogYm9vbGVhbiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzQm9vdGVkIHx8ICF0aGlzLmxhenkgfHwgdGhpcy5pc0FjdGl2ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0FjdGl2ZSAoKSB7XHJcbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgc2hvd0xhenlDb250ZW50IChjb250ZW50PzogVk5vZGVbXSk6IFZOb2RlW10gfCB1bmRlZmluZWQge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNDb250ZW50ID8gY29udGVudCA6IHVuZGVmaW5lZFxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19