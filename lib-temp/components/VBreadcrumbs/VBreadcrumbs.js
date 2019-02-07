// Styles
import '../../stylus/components/_breadcrumbs.styl';
// Components
import { VBreadcrumbsDivider, VBreadcrumbsItem } from '.';
// Mixins
import Themeable from '../../mixins/themeable';
// Utils
import { deprecate } from '../../util/console';
import mixins from '../../util/mixins';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-breadcrumbs',
    props: {
        divider: {
            type: String,
            default: '/'
        },
        items: {
            type: Array,
            default: () => ([])
        },
        large: Boolean,
        justifyCenter: Boolean,
        justifyEnd: Boolean
    },
    computed: {
        classes() {
            return {
                'v-breadcrumbs--large': this.large,
                'justify-center': this.justifyCenter,
                'justify-end': this.justifyEnd,
                ...this.themeClasses
            };
        }
    },
    mounted() {
        if (this.justifyCenter)
            deprecate('justify-center', 'class="justify-center"', this);
        if (this.justifyEnd)
            deprecate('justify-end', 'class="justify-end"', this);
        if (this.$slots.default)
            deprecate('default slot', ':items and scoped slot "item"', this);
    },
    methods: {
        /* @deprecated */
        genChildren /* istanbul ignore next */() {
            if (!this.$slots.default)
                return undefined;
            const children = [];
            let createDividers = false;
            for (let i = 0; i < this.$slots.default.length; i++) {
                const elm = this.$slots.default[i];
                if (!elm.componentOptions ||
                    elm.componentOptions.Ctor.options.name !== 'v-breadcrumbs-item') {
                    children.push(elm);
                }
                else {
                    if (createDividers) {
                        children.push(this.genDivider());
                    }
                    children.push(elm);
                    createDividers = true;
                }
            }
            return children;
        },
        genDivider() {
            return this.$createElement(VBreadcrumbsDivider, this.$slots.divider ? this.$slots.divider : this.divider);
        },
        genItems() {
            const items = [];
            const hasSlot = !!this.$scopedSlots.item;
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                if (hasSlot)
                    items.push(this.$scopedSlots.item({ item }));
                else
                    items.push(this.$createElement(VBreadcrumbsItem, { key: item.text, props: item }, [item.text]));
                if (i < this.items.length - 1)
                    items.push(this.genDivider());
            }
            return items;
        }
    },
    render(h) {
        const children = this.$slots.default ? this.genChildren() : this.genItems();
        return h('ul', {
            staticClass: 'v-breadcrumbs',
            'class': this.classes
        }, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJyZWFkY3J1bWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJyZWFkY3J1bWJzL1ZCcmVhZGNydW1icy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQU1sRCxhQUFhO0FBQ2IsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sR0FBRyxDQUFBO0FBRXpELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzlDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGVBQWUsTUFBTSxDQUNuQixTQUFTO0FBQ1Qsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGVBQWU7SUFFckIsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDSTtRQUN6QixLQUFLLEVBQUUsT0FBTztRQUNkLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLFVBQVUsRUFBRSxPQUFPO0tBQ3BCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2xDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhO2dCQUNwQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzlCLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxhQUFh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QUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUUzRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDYixXQUFXLEVBQUUsZUFBZTtZQUM1QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNkLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fYnJlYWRjcnVtYnMuc3R5bCdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCB7IFZCcmVhZGNydW1ic0RpdmlkZXIsIFZCcmVhZGNydW1ic0l0ZW0gfSBmcm9tICcuJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3RoZW1lYWJsZSdcclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCB7IGRlcHJlY2F0ZSB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBUaGVtZWFibGVcclxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtYnJlYWRjcnVtYnMnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZGl2aWRlcjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICcvJ1xyXG4gICAgfSxcclxuICAgIGl0ZW1zOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pXHJcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8YW55W10+LFxyXG4gICAgbGFyZ2U6IEJvb2xlYW4sXHJcbiAgICBqdXN0aWZ5Q2VudGVyOiBCb29sZWFuLFxyXG4gICAganVzdGlmeUVuZDogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LWJyZWFkY3J1bWJzLS1sYXJnZSc6IHRoaXMubGFyZ2UsXHJcbiAgICAgICAgJ2p1c3RpZnktY2VudGVyJzogdGhpcy5qdXN0aWZ5Q2VudGVyLFxyXG4gICAgICAgICdqdXN0aWZ5LWVuZCc6IHRoaXMuanVzdGlmeUVuZCxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICBpZiAodGhpcy5qdXN0aWZ5Q2VudGVyKSBkZXByZWNhdGUoJ2p1c3RpZnktY2VudGVyJywgJ2NsYXNzPVwianVzdGlmeS1jZW50ZXJcIicsIHRoaXMpXHJcbiAgICBpZiAodGhpcy5qdXN0aWZ5RW5kKSBkZXByZWNhdGUoJ2p1c3RpZnktZW5kJywgJ2NsYXNzPVwianVzdGlmeS1lbmRcIicsIHRoaXMpXHJcbiAgICBpZiAodGhpcy4kc2xvdHMuZGVmYXVsdCkgZGVwcmVjYXRlKCdkZWZhdWx0IHNsb3QnLCAnOml0ZW1zIGFuZCBzY29wZWQgc2xvdCBcIml0ZW1cIicsIHRoaXMpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLyogQGRlcHJlY2F0ZWQgKi9cclxuICAgIGdlbkNoaWxkcmVuIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovICgpIHtcclxuICAgICAgaWYgKCF0aGlzLiRzbG90cy5kZWZhdWx0KSByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXHJcblxyXG4gICAgICBsZXQgY3JlYXRlRGl2aWRlcnMgPSBmYWxzZVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuJHNsb3RzLmRlZmF1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbG0gPSB0aGlzLiRzbG90cy5kZWZhdWx0W2ldXHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICFlbG0uY29tcG9uZW50T3B0aW9ucyB8fFxyXG4gICAgICAgICAgZWxtLmNvbXBvbmVudE9wdGlvbnMuQ3Rvci5vcHRpb25zLm5hbWUgIT09ICd2LWJyZWFkY3J1bWJzLWl0ZW0nXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGVsbSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGNyZWF0ZURpdmlkZXJzKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5nZW5EaXZpZGVyKCkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKGVsbSlcclxuICAgICAgICAgIGNyZWF0ZURpdmlkZXJzID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNoaWxkcmVuXHJcbiAgICB9LFxyXG4gICAgZ2VuRGl2aWRlciAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZCcmVhZGNydW1ic0RpdmlkZXIsIHRoaXMuJHNsb3RzLmRpdmlkZXIgPyB0aGlzLiRzbG90cy5kaXZpZGVyIDogdGhpcy5kaXZpZGVyKVxyXG4gICAgfSxcclxuICAgIGdlbkl0ZW1zICgpIHtcclxuICAgICAgY29uc3QgaXRlbXMgPSBbXVxyXG4gICAgICBjb25zdCBoYXNTbG90ID0gISF0aGlzLiRzY29wZWRTbG90cy5pdGVtXHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tpXVxyXG5cclxuICAgICAgICBpZiAoaGFzU2xvdCkgaXRlbXMucHVzaCh0aGlzLiRzY29wZWRTbG90cy5pdGVtISh7IGl0ZW0gfSkpXHJcbiAgICAgICAgZWxzZSBpdGVtcy5wdXNoKHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJyZWFkY3J1bWJzSXRlbSwgeyBrZXk6IGl0ZW0udGV4dCwgcHJvcHM6IGl0ZW0gfSwgW2l0ZW0udGV4dF0pKVxyXG5cclxuICAgICAgICBpZiAoaSA8IHRoaXMuaXRlbXMubGVuZ3RoIC0gMSkgaXRlbXMucHVzaCh0aGlzLmdlbkRpdmlkZXIoKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGl0ZW1zXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLiRzbG90cy5kZWZhdWx0ID8gdGhpcy5nZW5DaGlsZHJlbigpIDogdGhpcy5nZW5JdGVtcygpXHJcblxyXG4gICAgcmV0dXJuIGgoJ3VsJywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtYnJlYWRjcnVtYnMnLFxyXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzZXNcclxuICAgIH0sIGNoaWxkcmVuKVxyXG4gIH1cclxufSlcclxuIl19