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
            setTimeout(() => {
                this.isActive = false;
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0dXJuYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvcmV0dXJuYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFckIsb0JBQW9CO0FBQ3BCLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN4QixJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsSUFBVztLQUN6QjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsUUFBUSxFQUFFLEtBQUs7UUFDZixhQUFhLEVBQUUsSUFBVztLQUMzQixDQUFDO0lBRUYsS0FBSyxFQUFFO1FBQ0wsUUFBUSxDQUFFLEdBQUc7WUFDWCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7YUFDdEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7YUFDckQ7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxJQUFJLENBQUUsS0FBVTtZQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFBO1lBQzFCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7WUFDdkIsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZS5leHRlbmQoe1xyXG4gIG5hbWU6ICdyZXR1cm5hYmxlJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHJldHVyblZhbHVlOiBudWxsIGFzIGFueVxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICBvcmlnaW5hbFZhbHVlOiBudWxsIGFzIGFueVxyXG4gIH0pLFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaXNBY3RpdmUgKHZhbCkge1xyXG4gICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy5yZXR1cm5WYWx1ZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpyZXR1cm5WYWx1ZScsIHRoaXMub3JpZ2luYWxWYWx1ZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHNhdmUgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdmFsdWVcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=