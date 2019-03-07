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
            const keys = [];
            for (let i = 0; i < this.items.length; i++) {
                const item = this.items[i];
                keys.push(item.text);
                if (hasSlot)
                    items.push(this.$scopedSlots.item({ item }));
                else
                    items.push(this.$createElement(VBreadcrumbsItem, { key: keys.join('.'), props: item }, [item.text]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJyZWFkY3J1bWJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJyZWFkY3J1bWJzL1ZCcmVhZGNydW1icy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQU1sRCxhQUFhO0FBQ2IsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sR0FBRyxDQUFBO0FBRXpELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQzlDLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGVBQWUsTUFBTSxDQUNuQixTQUFTO0FBQ1Qsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGVBQWU7SUFFckIsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsR0FBRztTQUNiO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDSTtRQUN6QixLQUFLLEVBQUUsT0FBTztRQUNkLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLFVBQVUsRUFBRSxPQUFPO0tBQ3BCO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2xDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxhQUFhO2dCQUNwQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzlCLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckIsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxhQUFh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VUFBVSxFQUFFLENBQUMsQ0FBQTthQUM3RDtZQUVELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFM0UsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ2IsV0FBVyxFQUFFLGVBQWU7WUFDNUIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2JyZWFkY3J1bWJzLnN0eWwnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgeyBWQnJlYWRjcnVtYnNEaXZpZGVyLCBWQnJlYWRjcnVtYnNJdGVtIH0gZnJvbSAnLidcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBkZXByZWNhdGUgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgVGhlbWVhYmxlXHJcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWJyZWFkY3J1bWJzJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGRpdmlkZXI6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnLydcclxuICAgIH0sXHJcbiAgICBpdGVtczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKVxyXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPGFueVtdPixcclxuICAgIGxhcmdlOiBCb29sZWFuLFxyXG4gICAganVzdGlmeUNlbnRlcjogQm9vbGVhbixcclxuICAgIGp1c3RpZnlFbmQ6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1icmVhZGNydW1icy0tbGFyZ2UnOiB0aGlzLmxhcmdlLFxyXG4gICAgICAgICdqdXN0aWZ5LWNlbnRlcic6IHRoaXMuanVzdGlmeUNlbnRlcixcclxuICAgICAgICAnanVzdGlmeS1lbmQnOiB0aGlzLmp1c3RpZnlFbmQsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgaWYgKHRoaXMuanVzdGlmeUNlbnRlcikgZGVwcmVjYXRlKCdqdXN0aWZ5LWNlbnRlcicsICdjbGFzcz1cImp1c3RpZnktY2VudGVyXCInLCB0aGlzKVxyXG4gICAgaWYgKHRoaXMuanVzdGlmeUVuZCkgZGVwcmVjYXRlKCdqdXN0aWZ5LWVuZCcsICdjbGFzcz1cImp1c3RpZnktZW5kXCInLCB0aGlzKVxyXG4gICAgaWYgKHRoaXMuJHNsb3RzLmRlZmF1bHQpIGRlcHJlY2F0ZSgnZGVmYXVsdCBzbG90JywgJzppdGVtcyBhbmQgc2NvcGVkIHNsb3QgXCJpdGVtXCInLCB0aGlzKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIC8qIEBkZXByZWNhdGVkICovXHJcbiAgICBnZW5DaGlsZHJlbiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy4kc2xvdHMuZGVmYXVsdCkgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxyXG5cclxuICAgICAgbGV0IGNyZWF0ZURpdmlkZXJzID0gZmFsc2VcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLiRzbG90cy5kZWZhdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZWxtID0gdGhpcy4kc2xvdHMuZGVmYXVsdFtpXVxyXG5cclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAhZWxtLmNvbXBvbmVudE9wdGlvbnMgfHxcclxuICAgICAgICAgIGVsbS5jb21wb25lbnRPcHRpb25zLkN0b3Iub3B0aW9ucy5uYW1lICE9PSAndi1icmVhZGNydW1icy1pdGVtJ1xyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChlbG0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChjcmVhdGVEaXZpZGVycykge1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuRGl2aWRlcigpKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChlbG0pXHJcbiAgICAgICAgICBjcmVhdGVEaXZpZGVycyA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjaGlsZHJlblxyXG4gICAgfSxcclxuICAgIGdlbkRpdmlkZXIgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQnJlYWRjcnVtYnNEaXZpZGVyLCB0aGlzLiRzbG90cy5kaXZpZGVyID8gdGhpcy4kc2xvdHMuZGl2aWRlciA6IHRoaXMuZGl2aWRlcilcclxuICAgIH0sXHJcbiAgICBnZW5JdGVtcyAoKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW1zID0gW11cclxuICAgICAgY29uc3QgaGFzU2xvdCA9ICEhdGhpcy4kc2NvcGVkU2xvdHMuaXRlbVxyXG4gICAgICBjb25zdCBrZXlzID0gW11cclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW2ldXHJcblxyXG4gICAgICAgIGtleXMucHVzaChpdGVtLnRleHQpXHJcblxyXG4gICAgICAgIGlmIChoYXNTbG90KSBpdGVtcy5wdXNoKHRoaXMuJHNjb3BlZFNsb3RzLml0ZW0hKHsgaXRlbSB9KSlcclxuICAgICAgICBlbHNlIGl0ZW1zLnB1c2godGhpcy4kY3JlYXRlRWxlbWVudChWQnJlYWRjcnVtYnNJdGVtLCB7IGtleToga2V5cy5qb2luKCcuJyksIHByb3BzOiBpdGVtIH0sIFtpdGVtLnRleHRdKSlcclxuXHJcbiAgICAgICAgaWYgKGkgPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpIGl0ZW1zLnB1c2godGhpcy5nZW5EaXZpZGVyKCkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBpdGVtc1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy4kc2xvdHMuZGVmYXVsdCA/IHRoaXMuZ2VuQ2hpbGRyZW4oKSA6IHRoaXMuZ2VuSXRlbXMoKVxyXG5cclxuICAgIHJldHVybiBoKCd1bCcsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWJyZWFkY3J1bWJzJyxcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzc2VzXHJcbiAgICB9LCBjaGlsZHJlbilcclxuICB9XHJcbn0pXHJcbiJdfQ==