import Vue from 'vue';
import VProgressLinear from '../components/VProgressLinear';
/**
 * Loadable
 *
 * @mixin
 *
 * Used to add linear progress bar to components
 * Can use a default bar with a specific color
 * or designate a custom progress linear bar
 */
/* @vue/component */
export default Vue.extend().extend({
    name: 'loadable',
    props: {
        loading: {
            type: [Boolean, String],
            default: false
        }
    },
    methods: {
        genProgress() {
            if (this.loading === false)
                return null;
            return this.$slots.progress || this.$createElement(VProgressLinear, {
                props: {
                    color: (this.loading === true || this.loading === '')
                        ? (this.color || 'primary')
                        : this.loading,
                    height: 2,
                    indeterminate: true
                }
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL2xvYWRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQUNoQyxPQUFPLGVBQWUsTUFBTSwrQkFBK0IsQ0FBQTtBQU0zRDs7Ozs7Ozs7R0FRRztBQUNILG9CQUFvQjtBQUNwQixlQUFlLEdBQUcsQ0FBQyxNQUFNLEVBQWEsQ0FBQyxNQUFNLENBQUM7SUFDNUMsSUFBSSxFQUFFLFVBQVU7SUFFaEIsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUN2QixPQUFPLEVBQUUsS0FBSztTQUNmO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxXQUFXO1lBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFFdkMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtnQkFDbEUsS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDO3dCQUNuRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQzt3QkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO29CQUNoQixNQUFNLEVBQUUsQ0FBQztvQkFDVCxhQUFhLEVBQUUsSUFBSTtpQkFDcEI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgVlByb2dyZXNzTGluZWFyIGZyb20gJy4uL2NvbXBvbmVudHMvVlByb2dyZXNzTGluZWFyJ1xyXG5cclxuaW50ZXJmYWNlIGNvbG9yYWJsZSBleHRlbmRzIFZ1ZSB7XHJcbiAgY29sb3I/OiBzdHJpbmdcclxufVxyXG5cclxuLyoqXHJcbiAqIExvYWRhYmxlXHJcbiAqXHJcbiAqIEBtaXhpblxyXG4gKlxyXG4gKiBVc2VkIHRvIGFkZCBsaW5lYXIgcHJvZ3Jlc3MgYmFyIHRvIGNvbXBvbmVudHNcclxuICogQ2FuIHVzZSBhIGRlZmF1bHQgYmFyIHdpdGggYSBzcGVjaWZpYyBjb2xvclxyXG4gKiBvciBkZXNpZ25hdGUgYSBjdXN0b20gcHJvZ3Jlc3MgbGluZWFyIGJhclxyXG4gKi9cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVnVlLmV4dGVuZDxjb2xvcmFibGU+KCkuZXh0ZW5kKHtcclxuICBuYW1lOiAnbG9hZGFibGUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgbG9hZGluZzoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5Qcm9ncmVzcyAoKTogVk5vZGUgfCBWTm9kZVtdIHwgbnVsbCB7XHJcbiAgICAgIGlmICh0aGlzLmxvYWRpbmcgPT09IGZhbHNlKSByZXR1cm4gbnVsbFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJHNsb3RzLnByb2dyZXNzIHx8IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlByb2dyZXNzTGluZWFyLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGNvbG9yOiAodGhpcy5sb2FkaW5nID09PSB0cnVlIHx8IHRoaXMubG9hZGluZyA9PT0gJycpXHJcbiAgICAgICAgICAgID8gKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxyXG4gICAgICAgICAgICA6IHRoaXMubG9hZGluZyxcclxuICAgICAgICAgIGhlaWdodDogMixcclxuICAgICAgICAgIGluZGV0ZXJtaW5hdGU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=