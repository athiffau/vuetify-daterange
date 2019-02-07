// Styles
import '../../stylus/components/_lists.styl';
// Mixins
import Themeable from '../../mixins/themeable';
import { provide as RegistrableProvide } from '../../mixins/registrable';
// Types
import mixins from '../../util/mixins';
export default mixins(RegistrableProvide('list'), Themeable
/* @vue/component */
).extend({
    name: 'v-list',
    provide() {
        return {
            listClick: this.listClick
        };
    },
    props: {
        dense: Boolean,
        expand: Boolean,
        subheader: Boolean,
        threeLine: Boolean,
        twoLine: Boolean
    },
    data: () => ({
        groups: []
    }),
    computed: {
        classes() {
            return {
                'v-list--dense': this.dense,
                'v-list--subheader': this.subheader,
                'v-list--two-line': this.twoLine,
                'v-list--three-line': this.threeLine,
                ...this.themeClasses
            };
        }
    },
    methods: {
        register(content) {
            this.groups.push(content);
        },
        unregister(content) {
            const index = this.groups.findIndex(g => g._uid === content._uid);
            if (index > -1)
                this.groups.splice(index, 1);
        },
        listClick(uid) {
            if (this.expand)
                return;
            for (const group of this.groups) {
                group.toggle(uid);
            }
        }
    },
    render(h) {
        const data = {
            staticClass: 'v-list',
            class: this.classes,
            attrs: {
                role: 'list'
            }
        };
        return h('div', data, [this.$slots.default]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WTGlzdC9WTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUc1QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxFQUFFLE9BQU8sSUFBSSxrQkFBa0IsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhFLFFBQVE7QUFDUixPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUt0QyxlQUFlLE1BQU0sQ0FDbkIsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEVBQzFCLFNBQVM7QUFDVCxvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsUUFBUTtJQUVkLE9BQU87UUFDTCxPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzFCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLE9BQU87UUFDZCxNQUFNLEVBQUUsT0FBTztRQUNmLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLFNBQVMsRUFBRSxPQUFPO1FBQ2xCLE9BQU8sRUFBRSxPQUFPO0tBQ2pCO0lBRUQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDWCxNQUFNLEVBQUUsRUFBMEI7S0FDbkMsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ25DLGtCQUFrQixFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNoQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDcEMsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsUUFBUSxDQUFFLE9BQTJCO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzNCLENBQUM7UUFDRCxVQUFVLENBQUUsT0FBMkI7WUFDckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUVqRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzlDLENBQUM7UUFDRCxTQUFTLENBQUUsR0FBVztZQUNwQixJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUFFLE9BQU07WUFFdkIsS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2FBQ2xCO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLE1BQU07YUFDYjtTQUNGLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQzlDLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fbGlzdHMuc3R5bCdcclxuaW1wb3J0IFZMaXN0R3JvdXAgZnJvbSAnLi9WTGlzdEdyb3VwJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuaW1wb3J0IHsgcHJvdmlkZSBhcyBSZWdpc3RyYWJsZVByb3ZpZGUgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbnR5cGUgVkxpc3RHcm91cEluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWTGlzdEdyb3VwPlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIFJlZ2lzdHJhYmxlUHJvdmlkZSgnbGlzdCcpLFxyXG4gIFRoZW1lYWJsZVxyXG4gIC8qIEB2dWUvY29tcG9uZW50ICovXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1saXN0JyxcclxuXHJcbiAgcHJvdmlkZSAoKTogb2JqZWN0IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxpc3RDbGljazogdGhpcy5saXN0Q2xpY2tcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZGVuc2U6IEJvb2xlYW4sXHJcbiAgICBleHBhbmQ6IEJvb2xlYW4sXHJcbiAgICBzdWJoZWFkZXI6IEJvb2xlYW4sXHJcbiAgICB0aHJlZUxpbmU6IEJvb2xlYW4sXHJcbiAgICB0d29MaW5lOiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGdyb3VwczogW10gYXMgVkxpc3RHcm91cEluc3RhbmNlW11cclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtbGlzdC0tZGVuc2UnOiB0aGlzLmRlbnNlLFxyXG4gICAgICAgICd2LWxpc3QtLXN1YmhlYWRlcic6IHRoaXMuc3ViaGVhZGVyLFxyXG4gICAgICAgICd2LWxpc3QtLXR3by1saW5lJzogdGhpcy50d29MaW5lLFxyXG4gICAgICAgICd2LWxpc3QtLXRocmVlLWxpbmUnOiB0aGlzLnRocmVlTGluZSxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVnaXN0ZXIgKGNvbnRlbnQ6IFZMaXN0R3JvdXBJbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLmdyb3Vwcy5wdXNoKGNvbnRlbnQpXHJcbiAgICB9LFxyXG4gICAgdW5yZWdpc3RlciAoY29udGVudDogVkxpc3RHcm91cEluc3RhbmNlKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5ncm91cHMuZmluZEluZGV4KGcgPT4gZy5fdWlkID09PSBjb250ZW50Ll91aWQpXHJcblxyXG4gICAgICBpZiAoaW5kZXggPiAtMSkgdGhpcy5ncm91cHMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgfSxcclxuICAgIGxpc3RDbGljayAodWlkOiBudW1iZXIpIHtcclxuICAgICAgaWYgKHRoaXMuZXhwYW5kKSByZXR1cm5cclxuXHJcbiAgICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgdGhpcy5ncm91cHMpIHtcclxuICAgICAgICBncm91cC50b2dnbGUodWlkKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWxpc3QnLFxyXG4gICAgICBjbGFzczogdGhpcy5jbGFzc2VzLFxyXG4gICAgICBhdHRyczoge1xyXG4gICAgICAgIHJvbGU6ICdsaXN0J1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIGRhdGEsIFt0aGlzLiRzbG90cy5kZWZhdWx0XSlcclxuICB9XHJcbn0pXHJcbiJdfQ==