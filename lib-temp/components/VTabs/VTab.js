// Mixins
import { factory as GroupableFactory } from '../../mixins/groupable';
import Routable from '../../mixins/routable';
import Themeable from '../../mixins/themeable';
// Utilities
import { getObjectValueByPath } from '../../util/helpers';
/* @vue/component */
export default {
    name: 'v-tab',
    mixins: [
        Routable,
        // Must be after routable
        // to overwrite activeClass
        GroupableFactory('tabGroup'),
        Themeable
    ],
    props: {
        ripple: {
            type: [Boolean, Object],
            default: true
        }
    },
    computed: {
        classes() {
            return {
                'v-tabs__item': true,
                'v-tabs__item--disabled': this.disabled,
                ...this.groupClasses
            };
        },
        value() {
            let to = this.to || this.href || '';
            if (this.$router &&
                this.to === Object(this.to)) {
                const resolve = this.$router.resolve(this.to, this.$route, this.append);
                to = resolve.href;
            }
            return to.replace('#', '');
        }
    },
    watch: {
        $route: 'onRouteChange'
    },
    mounted() {
        this.onRouteChange();
    },
    methods: {
        click(e) {
            // If user provides an
            // actual link, do not
            // prevent default
            if (this.href &&
                this.href.indexOf('#') > -1)
                e.preventDefault();
            this.$emit('click', e);
            this.to || this.toggle();
        },
        onRouteChange() {
            if (!this.to || !this.$refs.link)
                return;
            const path = `_vnode.data.class.${this.activeClass}`;
            this.$nextTick(() => {
                if (getObjectValueByPath(this.$refs.link, path)) {
                    this.toggle();
                }
            });
        }
    },
    render(h) {
        const link = this.generateRouteLink(this.classes);
        const { data } = link;
        // If disabled, use div as anchor tags do not support
        // being disabled
        const tag = this.disabled ? 'div' : link.tag;
        data.ref = 'link';
        return h('div', {
            staticClass: 'v-tabs__div'
        }, [h(tag, data, this.$slots.default)]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUYWJzL1ZUYWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUztBQUNULE9BQU8sRUFBRSxPQUFPLElBQUksZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNwRSxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFekQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsT0FBTztJQUViLE1BQU0sRUFBRTtRQUNOLFFBQVE7UUFDUix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLGdCQUFnQixDQUFDLFVBQVUsQ0FBQztRQUM1QixTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGNBQWMsRUFBRSxJQUFJO2dCQUNwQix3QkFBd0IsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkMsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztRQUNELEtBQUs7WUFDSCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO1lBRW5DLElBQUksSUFBSSxDQUFDLE9BQU87Z0JBQ2QsSUFBSSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUMzQjtnQkFDQSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDbEMsSUFBSSxDQUFDLEVBQUUsRUFDUCxJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxNQUFNLENBQ1osQ0FBQTtnQkFFRCxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQTthQUNsQjtZQUVELE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDNUIsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFLGVBQWU7S0FDeEI7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3RCLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxLQUFLLENBQUUsQ0FBQztZQUNOLHNCQUFzQjtZQUN0QixzQkFBc0I7WUFDdEIsa0JBQWtCO1lBQ2xCLElBQUksSUFBSSxDQUFDLElBQUk7Z0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQixDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7WUFFcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFdEIsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDMUIsQ0FBQztRQUNELGFBQWE7WUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtnQkFBRSxPQUFNO1lBRXhDLE1BQU0sSUFBSSxHQUFHLHFCQUFxQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7WUFFcEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xCLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQy9DLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtpQkFDZDtZQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2pELE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFFckIscURBQXFEO1FBQ3JELGlCQUFpQjtRQUNqQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUE7UUFFNUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUE7UUFFakIsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLGFBQWE7U0FDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWl4aW5zXHJcbmltcG9ydCB7IGZhY3RvcnkgYXMgR3JvdXBhYmxlRmFjdG9yeSB9IGZyb20gJy4uLy4uL21peGlucy9ncm91cGFibGUnXHJcbmltcG9ydCBSb3V0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91dGFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgeyBnZXRPYmplY3RWYWx1ZUJ5UGF0aCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAndi10YWInLFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIFJvdXRhYmxlLFxyXG4gICAgLy8gTXVzdCBiZSBhZnRlciByb3V0YWJsZVxyXG4gICAgLy8gdG8gb3ZlcndyaXRlIGFjdGl2ZUNsYXNzXHJcbiAgICBHcm91cGFibGVGYWN0b3J5KCd0YWJHcm91cCcpLFxyXG4gICAgVGhlbWVhYmxlXHJcbiAgXSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHJpcHBsZToge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi10YWJzX19pdGVtJzogdHJ1ZSxcclxuICAgICAgICAndi10YWJzX19pdGVtLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgLi4udGhpcy5ncm91cENsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHZhbHVlICgpIHtcclxuICAgICAgbGV0IHRvID0gdGhpcy50byB8fCB0aGlzLmhyZWYgfHwgJydcclxuXHJcbiAgICAgIGlmICh0aGlzLiRyb3V0ZXIgJiZcclxuICAgICAgICB0aGlzLnRvID09PSBPYmplY3QodGhpcy50bylcclxuICAgICAgKSB7XHJcbiAgICAgICAgY29uc3QgcmVzb2x2ZSA9IHRoaXMuJHJvdXRlci5yZXNvbHZlKFxyXG4gICAgICAgICAgdGhpcy50byxcclxuICAgICAgICAgIHRoaXMuJHJvdXRlLFxyXG4gICAgICAgICAgdGhpcy5hcHBlbmRcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIHRvID0gcmVzb2x2ZS5ocmVmXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0by5yZXBsYWNlKCcjJywgJycpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgICRyb3V0ZTogJ29uUm91dGVDaGFuZ2UnXHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLm9uUm91dGVDaGFuZ2UoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNsaWNrIChlKSB7XHJcbiAgICAgIC8vIElmIHVzZXIgcHJvdmlkZXMgYW5cclxuICAgICAgLy8gYWN0dWFsIGxpbmssIGRvIG5vdFxyXG4gICAgICAvLyBwcmV2ZW50IGRlZmF1bHRcclxuICAgICAgaWYgKHRoaXMuaHJlZiAmJlxyXG4gICAgICAgIHRoaXMuaHJlZi5pbmRleE9mKCcjJykgPiAtMVxyXG4gICAgICApIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnY2xpY2snLCBlKVxyXG5cclxuICAgICAgdGhpcy50byB8fCB0aGlzLnRvZ2dsZSgpXHJcbiAgICB9LFxyXG4gICAgb25Sb3V0ZUNoYW5nZSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy50byB8fCAhdGhpcy4kcmVmcy5saW5rKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHBhdGggPSBgX3Zub2RlLmRhdGEuY2xhc3MuJHt0aGlzLmFjdGl2ZUNsYXNzfWBcclxuXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy4kcmVmcy5saW5rLCBwYXRoKSkge1xyXG4gICAgICAgICAgdGhpcy50b2dnbGUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IGxpbmsgPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKHRoaXMuY2xhc3NlcylcclxuICAgIGNvbnN0IHsgZGF0YSB9ID0gbGlua1xyXG5cclxuICAgIC8vIElmIGRpc2FibGVkLCB1c2UgZGl2IGFzIGFuY2hvciB0YWdzIGRvIG5vdCBzdXBwb3J0XHJcbiAgICAvLyBiZWluZyBkaXNhYmxlZFxyXG4gICAgY29uc3QgdGFnID0gdGhpcy5kaXNhYmxlZCA/ICdkaXYnIDogbGluay50YWdcclxuXHJcbiAgICBkYXRhLnJlZiA9ICdsaW5rJ1xyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10YWJzX19kaXYnXHJcbiAgICB9LCBbaCh0YWcsIGRhdGEsIHRoaXMuJHNsb3RzLmRlZmF1bHQpXSlcclxuICB9XHJcbn1cclxuIl19