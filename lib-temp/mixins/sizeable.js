import Vue from 'vue';
export default Vue.extend({
    name: 'sizeable',
    props: {
        large: Boolean,
        medium: Boolean,
        size: {
            type: [Number, String]
        },
        small: Boolean,
        xLarge: Boolean
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZWFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL3NpemVhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxNQUFNLEVBQUUsT0FBTztRQUNmLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDdkI7UUFDRCxLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxPQUFPO0tBQ2hCO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcclxuICBuYW1lOiAnc2l6ZWFibGUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgbGFyZ2U6IEJvb2xlYW4sXHJcbiAgICBtZWRpdW06IEJvb2xlYW4sXHJcbiAgICBzaXplOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ11cclxuICAgIH0sXHJcbiAgICBzbWFsbDogQm9vbGVhbixcclxuICAgIHhMYXJnZTogQm9vbGVhblxyXG4gIH1cclxufSlcclxuIl19