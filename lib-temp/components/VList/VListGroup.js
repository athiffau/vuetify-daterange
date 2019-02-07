// Components
import VIcon from '../VIcon';
// Mixins
import Bootable from '../../mixins/bootable';
import Toggleable from '../../mixins/toggleable';
import { inject as RegistrableInject } from '../../mixins/registrable';
// Transitions
import { VExpandTransition } from '../transitions';
// Utils
import mixins from '../../util/mixins';
export default mixins(Bootable, RegistrableInject('list', 'v-list-group', 'v-list'), Toggleable
/* @vue/component */
).extend({
    name: 'v-list-group',
    inject: ['listClick'],
    props: {
        activeClass: {
            type: String,
            default: 'primary--text'
        },
        appendIcon: {
            type: String,
            default: '$vuetify.icons.expand'
        },
        disabled: Boolean,
        group: String,
        noAction: Boolean,
        prependIcon: String,
        subGroup: Boolean
    },
    data: () => ({
        groups: []
    }),
    computed: {
        groupClasses() {
            return {
                'v-list__group--active': this.isActive,
                'v-list__group--disabled': this.disabled
            };
        },
        headerClasses() {
            return {
                'v-list__group__header--active': this.isActive,
                'v-list__group__header--sub-group': this.subGroup
            };
        },
        itemsClasses() {
            return {
                'v-list__group__items--no-action': this.noAction
            };
        }
    },
    watch: {
        isActive(val) {
            if (!this.subGroup && val) {
                this.listClick(this._uid);
            }
        },
        $route(to) {
            const isActive = this.matchRoute(to.path);
            if (this.group) {
                if (isActive && this.isActive !== isActive) {
                    this.listClick(this._uid);
                }
                this.isActive = isActive;
            }
        }
    },
    mounted() {
        this.list.register(this);
        if (this.group &&
            this.$route &&
            this.value == null) {
            this.isActive = this.matchRoute(this.$route.path);
        }
    },
    beforeDestroy() {
        this.list.unregister(this._uid);
    },
    methods: {
        click(e) {
            if (this.disabled)
                return;
            this.$emit('click', e);
            this.isActive = !this.isActive;
        },
        genIcon(icon) {
            return this.$createElement(VIcon, icon);
        },
        genAppendIcon() {
            const icon = !this.subGroup ? this.appendIcon : false;
            if (!icon && !this.$slots.appendIcon)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-list__group__header__append-icon'
            }, [
                this.$slots.appendIcon || this.genIcon(icon)
            ]);
        },
        genGroup() {
            return this.$createElement('div', {
                staticClass: 'v-list__group__header',
                class: this.headerClasses,
                on: {
                    ...this.$listeners,
                    click: this.click
                },
                ref: 'item'
            }, [
                this.genPrependIcon(),
                this.$slots.activator,
                this.genAppendIcon()
            ]);
        },
        genItems() {
            return this.$createElement('div', {
                staticClass: 'v-list__group__items',
                class: this.itemsClasses,
                directives: [{
                        name: 'show',
                        value: this.isActive
                    }],
                ref: 'group'
            }, this.showLazyContent(this.$slots.default));
        },
        genPrependIcon() {
            const icon = this.prependIcon
                ? this.prependIcon
                : this.subGroup
                    ? '$vuetify.icons.subgroup'
                    : false;
            if (!icon && !this.$slots.prependIcon)
                return null;
            return this.$createElement('div', {
                staticClass: 'v-list__group__header__prepend-icon',
                'class': {
                    [this.activeClass]: this.isActive
                }
            }, [
                this.$slots.prependIcon || this.genIcon(icon)
            ]);
        },
        toggle(uid) {
            this.isActive = this._uid === uid;
        },
        matchRoute(to) {
            if (!this.group)
                return false;
            return to.match(this.group) !== null;
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'v-list__group',
            class: this.groupClasses
        }, [
            this.genGroup(),
            h(VExpandTransition, [this.genItems()])
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkxpc3RHcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZMaXN0L1ZMaXN0R3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUc1QixTQUFTO0FBQ1QsT0FBTyxRQUFRLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxFQUFlLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBR25GLGNBQWM7QUFDZCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVsRCxRQUFRO0FBQ1IsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBYXRELGVBQWUsTUFBTSxDQVNuQixRQUFRLEVBQ1IsaUJBQWlCLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLENBQUMsRUFDbkQsVUFBVTtBQUNWLG9CQUFvQjtDQUNyQixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxjQUFjO0lBRXBCLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUVyQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxlQUFlO1NBQ3pCO1FBQ0QsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsdUJBQXVCO1NBQ2pDO1FBQ0QsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFLE1BQU07UUFDYixRQUFRLEVBQUUsT0FBTztRQUNqQixXQUFXLEVBQUUsTUFBTTtRQUNuQixRQUFRLEVBQUUsT0FBTztLQUNsQjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxFQUFFLEVBQUU7S0FDWCxDQUFDO0lBRUYsUUFBUSxFQUFF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QUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2FBQzlDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxNQUFNLENBQUUsR0FBVztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFBO1FBQ25DLENBQUM7UUFDRCxVQUFVLENBQUUsRUFBVTtZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxLQUFLLENBQUE7WUFDN0IsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLENBQUE7UUFDdEMsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsZUFBZTtZQUM1QixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDekIsRUFBRTtZQUNELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN4QyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXHJcbmltcG9ydCBWTGlzdCBmcm9tICcuL1ZMaXN0J1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYm9vdGFibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5pbXBvcnQgeyBSZWdpc3RyYWJsZSwgaW5qZWN0IGFzIFJlZ2lzdHJhYmxlSW5qZWN0IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3JlZ2lzdHJhYmxlJ1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJ3Z1ZS1yb3V0ZXInXHJcblxyXG4vLyBUcmFuc2l0aW9uc1xyXG5pbXBvcnQgeyBWRXhwYW5kVHJhbnNpdGlvbiB9IGZyb20gJy4uL3RyYW5zaXRpb25zJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IG1peGlucywgeyBFeHRyYWN0VnVlIH0gZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxudHlwZSBWTGlzdEluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWTGlzdD5cclxuXHJcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcclxuICBsaXN0OiBWTGlzdEluc3RhbmNlXHJcbiAgbGlzdENsaWNrOiBGdW5jdGlvblxyXG4gICRyb3V0ZTogUm91dGVcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zPG9wdGlvbnMgJlxyXG4vKiBlc2xpbnQtZGlzYWJsZSBpbmRlbnQgKi9cclxuICBFeHRyYWN0VnVlPFtcclxuICAgIHR5cGVvZiBCb290YWJsZSxcclxuICAgIHR5cGVvZiBUb2dnbGVhYmxlLFxyXG4gICAgUmVnaXN0cmFibGU8J2xpc3QnPlxyXG4gIF0+XHJcbi8qIGVzbGludC1lbmFibGUgaW5kZW50ICovXHJcbj4oXHJcbiAgQm9vdGFibGUsXHJcbiAgUmVnaXN0cmFibGVJbmplY3QoJ2xpc3QnLCAndi1saXN0LWdyb3VwJywgJ3YtbGlzdCcpLFxyXG4gIFRvZ2dsZWFibGVcclxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtbGlzdC1ncm91cCcsXHJcblxyXG4gIGluamVjdDogWydsaXN0Q2xpY2snXSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFjdGl2ZUNsYXNzOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnktLXRleHQnXHJcbiAgICB9LFxyXG4gICAgYXBwZW5kSWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5leHBhbmQnXHJcbiAgICB9LFxyXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgICBncm91cDogU3RyaW5nLFxyXG4gICAgbm9BY3Rpb246IEJvb2xlYW4sXHJcbiAgICBwcmVwZW5kSWNvbjogU3RyaW5nLFxyXG4gICAgc3ViR3JvdXA6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgZ3JvdXBzOiBbXVxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgZ3JvdXBDbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LWxpc3RfX2dyb3VwLS1hY3RpdmUnOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgICd2LWxpc3RfX2dyb3VwLS1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWRcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhlYWRlckNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtbGlzdF9fZ3JvdXBfX2hlYWRlci0tYWN0aXZlJzogdGhpcy5pc0FjdGl2ZSxcclxuICAgICAgICAndi1saXN0X19ncm91cF9faGVhZGVyLS1zdWItZ3JvdXAnOiB0aGlzLnN1Ykdyb3VwXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpdGVtc0NsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtbGlzdF9fZ3JvdXBfX2l0ZW1zLS1uby1hY3Rpb24nOiB0aGlzLm5vQWN0aW9uXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaXNBY3RpdmUgKHZhbCkge1xyXG4gICAgICBpZiAoIXRoaXMuc3ViR3JvdXAgJiYgdmFsKSB7XHJcbiAgICAgICAgdGhpcy5saXN0Q2xpY2sodGhpcy5fdWlkKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgJHJvdXRlICh0bykge1xyXG4gICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMubWF0Y2hSb3V0ZSh0by5wYXRoKVxyXG5cclxuICAgICAgaWYgKHRoaXMuZ3JvdXApIHtcclxuICAgICAgICBpZiAoaXNBY3RpdmUgJiYgdGhpcy5pc0FjdGl2ZSAhPT0gaXNBY3RpdmUpIHtcclxuICAgICAgICAgIHRoaXMubGlzdENsaWNrKHRoaXMuX3VpZClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBpc0FjdGl2ZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLmxpc3QucmVnaXN0ZXIodGhpcylcclxuXHJcbiAgICBpZiAodGhpcy5ncm91cCAmJlxyXG4gICAgICB0aGlzLiRyb3V0ZSAmJlxyXG4gICAgICB0aGlzLnZhbHVlID09IG51bGxcclxuICAgICkge1xyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy5tYXRjaFJvdXRlKHRoaXMuJHJvdXRlLnBhdGgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICB0aGlzLmxpc3QudW5yZWdpc3Rlcih0aGlzLl91aWQpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgY2xpY2sgKGU6IEV2ZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrJywgZSlcclxuXHJcbiAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZVxyXG4gICAgfSxcclxuICAgIGdlbkljb24gKGljb246IHN0cmluZyB8IGZhbHNlKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgaWNvbilcclxuICAgIH0sXHJcbiAgICBnZW5BcHBlbmRJY29uICgpIHtcclxuICAgICAgY29uc3QgaWNvbiA9ICF0aGlzLnN1Ykdyb3VwID8gdGhpcy5hcHBlbmRJY29uIDogZmFsc2VcclxuXHJcbiAgICAgIGlmICghaWNvbiAmJiAhdGhpcy4kc2xvdHMuYXBwZW5kSWNvbikgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWxpc3RfX2dyb3VwX19oZWFkZXJfX2FwcGVuZC1pY29uJ1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy4kc2xvdHMuYXBwZW5kSWNvbiB8fCB0aGlzLmdlbkljb24oaWNvbilcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Hcm91cCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWxpc3RfX2dyb3VwX19oZWFkZXInLFxyXG4gICAgICAgIGNsYXNzOiB0aGlzLmhlYWRlckNsYXNzZXMsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIC4uLnRoaXMuJGxpc3RlbmVycyxcclxuICAgICAgICAgIGNsaWNrOiB0aGlzLmNsaWNrXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICdpdGVtJ1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5QcmVwZW5kSWNvbigpLFxyXG4gICAgICAgIHRoaXMuJHNsb3RzLmFjdGl2YXRvcixcclxuICAgICAgICB0aGlzLmdlbkFwcGVuZEljb24oKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkl0ZW1zICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtbGlzdF9fZ3JvdXBfX2l0ZW1zJyxcclxuICAgICAgICBjbGFzczogdGhpcy5pdGVtc0NsYXNzZXMsXHJcbiAgICAgICAgZGlyZWN0aXZlczogW3tcclxuICAgICAgICAgIG5hbWU6ICdzaG93JyxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgfV0sXHJcbiAgICAgICAgcmVmOiAnZ3JvdXAnXHJcbiAgICAgIH0sIHRoaXMuc2hvd0xhenlDb250ZW50KHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG4gICAgfSxcclxuICAgIGdlblByZXBlbmRJY29uICgpIHtcclxuICAgICAgY29uc3QgaWNvbiA9IHRoaXMucHJlcGVuZEljb25cclxuICAgICAgICA/IHRoaXMucHJlcGVuZEljb25cclxuICAgICAgICA6IHRoaXMuc3ViR3JvdXBcclxuICAgICAgICAgID8gJyR2dWV0aWZ5Lmljb25zLnN1Ymdyb3VwJ1xyXG4gICAgICAgICAgOiBmYWxzZVxyXG5cclxuICAgICAgaWYgKCFpY29uICYmICF0aGlzLiRzbG90cy5wcmVwZW5kSWNvbikgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWxpc3RfX2dyb3VwX19oZWFkZXJfX3ByZXBlbmQtaWNvbicsXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgW3RoaXMuYWN0aXZlQ2xhc3NdOiB0aGlzLmlzQWN0aXZlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy4kc2xvdHMucHJlcGVuZEljb24gfHwgdGhpcy5nZW5JY29uKGljb24pXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlICh1aWQ6IG51bWJlcikge1xyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gdGhpcy5fdWlkID09PSB1aWRcclxuICAgIH0sXHJcbiAgICBtYXRjaFJvdXRlICh0bzogc3RyaW5nKSB7XHJcbiAgICAgIGlmICghdGhpcy5ncm91cCkgcmV0dXJuIGZhbHNlXHJcbiAgICAgIHJldHVybiB0by5tYXRjaCh0aGlzLmdyb3VwKSAhPT0gbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1saXN0X19ncm91cCcsXHJcbiAgICAgIGNsYXNzOiB0aGlzLmdyb3VwQ2xhc3Nlc1xyXG4gICAgfSwgW1xyXG4gICAgICB0aGlzLmdlbkdyb3VwKCksXHJcbiAgICAgIGgoVkV4cGFuZFRyYW5zaXRpb24sIFt0aGlzLmdlbkl0ZW1zKCldKVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==