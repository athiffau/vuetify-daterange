import '../../stylus/components/_chips.styl';
import mixins from '../../util/mixins';
// Components
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
import Toggleable from '../../mixins/toggleable';
/* @vue/component */
export default mixins(Colorable, Themeable, Toggleable).extend({
    name: 'v-chip',
    props: {
        close: Boolean,
        disabled: Boolean,
        label: Boolean,
        outline: Boolean,
        // Used for selects/tagging
        selected: Boolean,
        small: Boolean,
        textColor: String,
        value: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        classes() {
            return {
                'v-chip--disabled': this.disabled,
                'v-chip--selected': this.selected && !this.disabled,
                'v-chip--label': this.label,
                'v-chip--outline': this.outline,
                'v-chip--small': this.small,
                'v-chip--removable': this.close,
                ...this.themeClasses
            };
        }
    },
    methods: {
        genClose(h) {
            const data = {
                staticClass: 'v-chip__close',
                on: {
                    click: (e) => {
                        e.stopPropagation();
                        this.$emit('input', false);
                    }
                }
            };
            return h('div', data, [
                h(VIcon, '$vuetify.icons.delete')
            ]);
        },
        genContent(h) {
            return h('span', {
                staticClass: 'v-chip__content'
            }, [
                this.$slots.default,
                this.close && this.genClose(h)
            ]);
        }
    },
    render(h) {
        const data = this.setBackgroundColor(this.color, {
            staticClass: 'v-chip',
            'class': this.classes,
            attrs: { tabindex: this.disabled ? -1 : 0 },
            directives: [{
                    name: 'show',
                    value: this.isActive
                }],
            on: this.$listeners
        });
        const color = this.textColor || (this.outline && this.color);
        return h('span', this.setTextColor(color, data), [this.genContent(h)]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoaXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2hpcC9WQ2hpcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFDQUFxQyxDQUFBO0FBSTVDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFFNUIsU0FBUztBQUNULE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBRWhELG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM3RCxJQUFJLEVBQUUsUUFBUTtJQUVkLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxPQUFPLEVBQUUsT0FBTztRQUNoQiwyQkFBMkI7UUFDM0IsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFLE9BQU87UUFDZCxTQUFTLEVBQUUsTUFBTTtRQUNqQixLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGtCQUFrQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUNqQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQ25ELGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQy9CLGVBQWUsRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDM0IsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQy9CLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFFBQVEsQ0FBRSxDQUFnQjtZQUN4QixNQUFNLElBQUksR0FBRztnQkFDWCxXQUFXLEVBQUUsZUFBZTtnQkFDNUIsRUFBRSxFQUFFO29CQUNGLEtBQUssRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO3dCQUNsQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7d0JBRW5CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO29CQUM1QixDQUFDO2lCQUNGO2FBQ0YsQ0FBQTtZQUVELE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7Z0JBQ3BCLENBQUMsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUM7YUFDbEMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFVBQVUsQ0FBRSxDQUFnQjtZQUMxQixPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsV0FBVyxFQUFFLGlCQUFpQjthQUMvQixFQUFFO2dCQUNELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztnQkFDbkIsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUMvQixDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQy9DLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUMzQyxVQUFVLEVBQUUsQ0FBQztvQkFDWCxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7aUJBQ3JCLENBQUM7WUFDRixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDcEIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzVELE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3hFLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19jaGlwcy5zdHlsJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgQ3JlYXRlRWxlbWVudCwgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuaW1wb3J0IFRvZ2dsZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RvZ2dsZWFibGUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoQ29sb3JhYmxlLCBUaGVtZWFibGUsIFRvZ2dsZWFibGUpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtY2hpcCcsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBjbG9zZTogQm9vbGVhbixcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgbGFiZWw6IEJvb2xlYW4sXHJcbiAgICBvdXRsaW5lOiBCb29sZWFuLFxyXG4gICAgLy8gVXNlZCBmb3Igc2VsZWN0cy90YWdnaW5nXHJcbiAgICBzZWxlY3RlZDogQm9vbGVhbixcclxuICAgIHNtYWxsOiBCb29sZWFuLFxyXG4gICAgdGV4dENvbG9yOiBTdHJpbmcsXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtY2hpcC0tZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICd2LWNoaXAtLXNlbGVjdGVkJzogdGhpcy5zZWxlY3RlZCAmJiAhdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAndi1jaGlwLS1sYWJlbCc6IHRoaXMubGFiZWwsXHJcbiAgICAgICAgJ3YtY2hpcC0tb3V0bGluZSc6IHRoaXMub3V0bGluZSxcclxuICAgICAgICAndi1jaGlwLS1zbWFsbCc6IHRoaXMuc21hbGwsXHJcbiAgICAgICAgJ3YtY2hpcC0tcmVtb3ZhYmxlJzogdGhpcy5jbG9zZSxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQ2xvc2UgKGg6IENyZWF0ZUVsZW1lbnQpOiBWTm9kZSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNoaXBfX2Nsb3NlJyxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2s6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIGZhbHNlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGEsIFtcclxuICAgICAgICBoKFZJY29uLCAnJHZ1ZXRpZnkuaWNvbnMuZGVsZXRlJylcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Db250ZW50IChoOiBDcmVhdGVFbGVtZW50KTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gaCgnc3BhbicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2hpcF9fY29udGVudCdcclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuJHNsb3RzLmRlZmF1bHQsXHJcbiAgICAgICAgdGhpcy5jbG9zZSAmJiB0aGlzLmdlbkNsb3NlKGgpXHJcbiAgICAgIF0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWNoaXAnLFxyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXMsXHJcbiAgICAgIGF0dHJzOiB7IHRhYmluZGV4OiB0aGlzLmRpc2FibGVkID8gLTEgOiAwIH0sXHJcbiAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgbmFtZTogJ3Nob3cnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgIH1dLFxyXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzXHJcbiAgICB9KVxyXG5cclxuICAgIGNvbnN0IGNvbG9yID0gdGhpcy50ZXh0Q29sb3IgfHwgKHRoaXMub3V0bGluZSAmJiB0aGlzLmNvbG9yKVxyXG4gICAgcmV0dXJuIGgoJ3NwYW4nLCB0aGlzLnNldFRleHRDb2xvcihjb2xvciwgZGF0YSksIFt0aGlzLmdlbkNvbnRlbnQoaCldKVxyXG4gIH1cclxufSlcclxuIl19