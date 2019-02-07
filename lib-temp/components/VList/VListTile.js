// Mixins
import Colorable from '../../mixins/colorable';
import Routable from '../../mixins/routable';
import Toggleable from '../../mixins/toggleable';
import Themeable from '../../mixins/themeable';
// Directives
import Ripple from '../../directives/ripple';
// Types
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Routable, Toggleable, Themeable).extend({
    name: 'v-list-tile',
    directives: {
        Ripple
    },
    inheritAttrs: false,
    props: {
        activeClass: {
            type: String,
            default: 'primary--text'
        },
        avatar: Boolean,
        inactive: Boolean,
        tag: String
    },
    data: () => ({
        proxyClass: 'v-list__tile--active'
    }),
    computed: {
        listClasses() {
            return this.disabled
                ? { 'v-list--disabled': true }
                : undefined;
        },
        classes() {
            return {
                'v-list__tile': true,
                'v-list__tile--link': this.isLink && !this.inactive,
                'v-list__tile--avatar': this.avatar,
                'v-list__tile--disabled': this.disabled,
                'v-list__tile--active': !this.to && this.isActive,
                ...this.themeClasses,
                [this.activeClass]: this.isActive
            };
        },
        isLink() {
            const hasClick = this.$listeners && (this.$listeners.click || this.$listeners['!click']);
            return Boolean(this.href ||
                this.to ||
                hasClick);
        }
    },
    render(h) {
        const isRouteLink = !this.inactive && this.isLink;
        const { tag, data } = isRouteLink ? this.generateRouteLink(this.classes) : {
            tag: this.tag || 'div',
            data: {
                class: this.classes
            }
        };
        data.attrs = Object.assign({}, data.attrs, this.$attrs);
        return h('div', this.setTextColor(!this.disabled && this.color, {
            class: this.listClasses,
            attrs: {
                disabled: this.disabled,
                role: 'listitem'
            }
        }), [h(tag, data, this.$slots.default)]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RUaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkxpc3QvVkxpc3RUaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBR3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFFBQVEsRUFDUixVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGFBQWE7SUFFbkIsVUFBVSxFQUFFO1FBQ1YsTUFBTTtLQUNQO0lBRUQsWUFBWSxFQUFFLEtBQUs7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFO1lBQ1gsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsZUFBZTtTQUN6QjtRQUNELE1BQU0sRUFBRSxPQUFPO1FBQ2YsUUFBUSxFQUFFLE9BQU87UUFDakIsR0FBRyxFQUFFLE1BQU07S0FDWjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsVUFBVSxFQUFFLHNCQUFzQjtLQUNuQyxDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsV0FBVztZQUNULE9BQU8sSUFBSSxDQUFDLFFBQVE7Z0JBQ2xCLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRTtnQkFDOUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtRQUNmLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTztnQkFDTCxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUNuRCxzQkFBc0IsRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZDLHNCQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFDakQsR0FBRyxJQUFJLENBQUMsWUFBWTtnQkFDcEIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDbEMsQ0FBQTtRQUNILENBQUM7UUFDRCxNQUFNO1lBQ0osTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtZQUV4RixPQUFPLE9BQU8sQ0FDWixJQUFJLENBQUMsSUFBSTtnQkFDVCxJQUFJLENBQUMsRUFBRTtnQkFDUCxRQUFRLENBQ1QsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDakQsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUs7WUFDdEIsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTzthQUNwQjtTQUNGLENBQUE7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXZELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzlELEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVztZQUN2QixLQUFLLEVBQUU7Z0JBQ0wsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixJQUFJLEVBQUUsVUFBVTthQUNqQjtTQUNGLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzFDLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgUm91dGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3JvdXRhYmxlJ1xyXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgUmlwcGxlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFJvdXRhYmxlLFxyXG4gIFRvZ2dsZWFibGUsXHJcbiAgVGhlbWVhYmxlXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1saXN0LXRpbGUnLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7XHJcbiAgICBSaXBwbGVcclxuICB9LFxyXG5cclxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWN0aXZlQ2xhc3M6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeS0tdGV4dCdcclxuICAgIH0sXHJcbiAgICBhdmF0YXI6IEJvb2xlYW4sXHJcbiAgICBpbmFjdGl2ZTogQm9vbGVhbixcclxuICAgIHRhZzogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIHByb3h5Q2xhc3M6ICd2LWxpc3RfX3RpbGUtLWFjdGl2ZSdcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGxpc3RDbGFzc2VzICgpOiBvYmplY3QgfCB1bmRlZmluZWQge1xyXG4gICAgICByZXR1cm4gdGhpcy5kaXNhYmxlZFxyXG4gICAgICAgID8geyAndi1saXN0LS1kaXNhYmxlZCc6IHRydWUgfVxyXG4gICAgICAgIDogdW5kZWZpbmVkXHJcbiAgICB9LFxyXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1saXN0X190aWxlJzogdHJ1ZSxcclxuICAgICAgICAndi1saXN0X190aWxlLS1saW5rJzogdGhpcy5pc0xpbmsgJiYgIXRoaXMuaW5hY3RpdmUsXHJcbiAgICAgICAgJ3YtbGlzdF9fdGlsZS0tYXZhdGFyJzogdGhpcy5hdmF0YXIsXHJcbiAgICAgICAgJ3YtbGlzdF9fdGlsZS0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICd2LWxpc3RfX3RpbGUtLWFjdGl2ZSc6ICF0aGlzLnRvICYmIHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXMsXHJcbiAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0xpbmsgKCk6IGJvb2xlYW4ge1xyXG4gICAgICBjb25zdCBoYXNDbGljayA9IHRoaXMuJGxpc3RlbmVycyAmJiAodGhpcy4kbGlzdGVuZXJzLmNsaWNrIHx8IHRoaXMuJGxpc3RlbmVyc1snIWNsaWNrJ10pXHJcblxyXG4gICAgICByZXR1cm4gQm9vbGVhbihcclxuICAgICAgICB0aGlzLmhyZWYgfHxcclxuICAgICAgICB0aGlzLnRvIHx8XHJcbiAgICAgICAgaGFzQ2xpY2tcclxuICAgICAgKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGlzUm91dGVMaW5rID0gIXRoaXMuaW5hY3RpdmUgJiYgdGhpcy5pc0xpbmtcclxuICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSBpc1JvdXRlTGluayA/IHRoaXMuZ2VuZXJhdGVSb3V0ZUxpbmsodGhpcy5jbGFzc2VzKSA6IHtcclxuICAgICAgdGFnOiB0aGlzLnRhZyB8fCAnZGl2JyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRhdGEuYXR0cnMgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLmF0dHJzLCB0aGlzLiRhdHRycylcclxuXHJcbiAgICByZXR1cm4gaCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5jb2xvciwge1xyXG4gICAgICBjbGFzczogdGhpcy5saXN0Q2xhc3NlcyxcclxuICAgICAgYXR0cnM6IHtcclxuICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICByb2xlOiAnbGlzdGl0ZW0nXHJcbiAgICAgIH1cclxuICAgIH0pLCBbaCh0YWcsIGRhdGEsIHRoaXMuJHNsb3RzLmRlZmF1bHQpXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==