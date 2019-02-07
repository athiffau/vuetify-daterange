import Vue from 'vue';
/* @vue/component */
export default Vue.extend({
    name: 'returnable',
    props: {
        returnValue: null
    },
    data: () => ({
        isActive: false,
        originalValue: null
    }),
    watch: {
        isActive(val) {
            if (val) {
                this.originalValue = this.returnValue;
            }
            else {
                this.$emit('update:returnValue', this.originalValue);
            }
        }
    },
    methods: {
        save(value) {
            this.originalValue = value;
            this.isActive = false;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvcmV0dXJuYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckIsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsSUFBVztLQUN6QjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixhQUFhLEVBQUUsSUFBVztLQUMzQixDQUFDO0lBRUYsS0FBSyxFQUFFO1FBQ0wsUUFBUSxDQUFFLEdBQUc7WUFDWCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7YUFDdEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7YUFDckQ7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxJQUFJLENBQUUsS0FBVTtZQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFBO1lBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3ZCLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3JldHVybmFibGUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgcmV0dXJuVmFsdWU6IG51bGwgYXMgYW55XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGlzQWN0aXZlOiBmYWxzZSxcclxuICAgIG9yaWdpbmFsVmFsdWU6IG51bGwgYXMgYW55XHJcbiAgfSksXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0FjdGl2ZSAodmFsKSB7XHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB0aGlzLnJldHVyblZhbHVlXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnJldHVyblZhbHVlJywgdGhpcy5vcmlnaW5hbFZhbHVlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgc2F2ZSAodmFsdWU6IGFueSkge1xyXG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB2YWx1ZVxyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==