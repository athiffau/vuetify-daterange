import Routable from '../../mixins/routable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Routable).extend({
    name: 'v-breadcrumbs-item',
    props: {
        // In a breadcrumb, the currently
        // active item should be dimmed
        activeClass: {
            type: String,
            default: 'v-breadcrumbs__item--disabled'
        }
    },
    computed: {
        classes() {
            return {
                'v-breadcrumbs__item': true,
                [this.activeClass]: this.disabled
            };
        }
    },
    render(h) {
        const { tag, data } = this.generateRouteLink(this.classes);
        return h('li', [
            h(tag, data, this.$slots.default)
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJyZWFkY3J1bWJzSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCcmVhZGNydW1icy9WQnJlYWRjcnVtYnNJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBRTVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBR3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDckMsSUFBSSxFQUFFLG9CQUFvQjtJQUUxQixLQUFLLEVBQUU7UUFDTCxpQ0FBaUM7UUFDakMsK0JBQStCO1FBQy9CLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLCtCQUErQjtTQUN6QztLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wscUJBQXFCLEVBQUUsSUFBSTtnQkFDM0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEMsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTFELE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNiLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1NBQ2xDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xyXG5cclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoUm91dGFibGUpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtYnJlYWRjcnVtYnMtaXRlbScsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICAvLyBJbiBhIGJyZWFkY3J1bWIsIHRoZSBjdXJyZW50bHlcclxuICAgIC8vIGFjdGl2ZSBpdGVtIHNob3VsZCBiZSBkaW1tZWRcclxuICAgIGFjdGl2ZUNsYXNzOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3YtYnJlYWRjcnVtYnNfX2l0ZW0tLWRpc2FibGVkJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LWJyZWFkY3J1bWJzX19pdGVtJzogdHJ1ZSxcclxuICAgICAgICBbdGhpcy5hY3RpdmVDbGFzc106IHRoaXMuZGlzYWJsZWRcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKHRoaXMuY2xhc3NlcylcclxuXHJcbiAgICByZXR1cm4gaCgnbGknLCBbXHJcbiAgICAgIGgodGFnLCBkYXRhLCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==