import '../../stylus/components/_data-iterator.styl';
import DataIterable from '../../mixins/data-iterable';
/* @vue/component */
export default {
    name: 'v-data-iterator',
    mixins: [DataIterable],
    inheritAttrs: false,
    props: {
        contentTag: {
            type: String,
            default: 'div'
        },
        contentProps: {
            type: Object,
            required: false
        },
        contentClass: {
            type: String,
            required: false
        }
    },
    computed: {
        classes() {
            return {
                'v-data-iterator': true,
                'v-data-iterator--select-all': this.selectAll !== false,
                ...this.themeClasses
            };
        }
    },
    created() {
        this.initPagination();
    },
    methods: {
        genContent() {
            const children = this.genItems();
            const data = {
                'class': this.contentClass,
                attrs: this.$attrs,
                on: this.$listeners,
                props: this.contentProps
            };
            return this.$createElement(this.contentTag, data, children);
        },
        genEmptyItems(content) {
            return [this.$createElement('div', {
                    'class': 'text-xs-center',
                    style: 'width: 100%'
                }, content)];
        },
        genFilteredItems() {
            if (!this.$scopedSlots.item) {
                return null;
            }
            const items = [];
            for (let index = 0, len = this.filteredItems.length; index < len; ++index) {
                const item = this.filteredItems[index];
                const props = this.createProps(item, index);
                items.push(this.$scopedSlots.item(props));
            }
            return items;
        },
        genFooter() {
            const children = [];
            if (this.$slots.footer) {
                children.push(this.$slots.footer);
            }
            if (!this.hideActions) {
                children.push(this.genActions());
            }
            if (!children.length)
                return null;
            return this.$createElement('div', children);
        },
        genHeader() {
            const children = [];
            if (this.$slots.header) {
                children.push(this.$slots.header);
            }
            if (!children.length)
                return null;
            return this.$createElement('div', children);
        }
    },
    render(h) {
        return h('div', {
            'class': this.classes
        }, [
            this.genHeader(),
            this.genContent(),
            this.genFooter()
        ]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGFJdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhSXRlcmF0b3IvVkRhdGFJdGVyYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDZDQUE2QyxDQUFBO0FBRXBELE9BQU8sWUFBWSxNQUFNLDRCQUE0QixDQUFBO0FBRXJELG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLGlCQUFpQjtJQUV2QixNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFFdEIsWUFBWSxFQUFFLEtBQUs7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsS0FBSztTQUNoQjtRQUNELFlBQVksRUFBRTtZQUNaLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLEtBQUs7U0FDaEI7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLDZCQUE2QixFQUFFLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSztnQkFDdkQsR0FBRyxJQUFJLENBQUMsWUFBWTthQUNyQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtJQUN2QixDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVTtZQUNSLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUVoQyxNQUFNLElBQUksR0FBRztnQkFDWCxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQzFCLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO2dCQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDekIsQ0FBQTtZQUVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUM3RCxDQUFDO1FBQ0QsYUFBYSxDQUFFLE9BQU87WUFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUNqQyxPQUFPLEVBQUUsZ0JBQWdCO29CQUN6QixLQUFLLEVBQUUsYUFBYTtpQkFDckIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ2QsQ0FBQztRQUNELGdCQUFnQjtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUE7YUFDWjtZQUVELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQTtZQUNoQixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRTtnQkFDekUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7Z0JBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTthQUMxQztZQUVELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztRQUNELFNBQVM7WUFDUCxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7WUFFbkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ2xDO1lBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7YUFDakM7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFDakMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUM3QyxDQUFDO1FBQ0QsU0FBUztZQUNQLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtZQUVuQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDbEM7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFDakMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUM3QyxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixFQUFFO1lBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEVBQUU7U0FDakIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19kYXRhLWl0ZXJhdG9yLnN0eWwnXHJcblxyXG5pbXBvcnQgRGF0YUl0ZXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9kYXRhLWl0ZXJhYmxlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LWRhdGEtaXRlcmF0b3InLFxyXG5cclxuICBtaXhpbnM6IFtEYXRhSXRlcmFibGVdLFxyXG5cclxuICBpbmhlcml0QXR0cnM6IGZhbHNlLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY29udGVudFRhZzoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdkaXYnXHJcbiAgICB9LFxyXG4gICAgY29udGVudFByb3BzOiB7XHJcbiAgICAgIHR5cGU6IE9iamVjdCxcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgY29udGVudENsYXNzOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LWRhdGEtaXRlcmF0b3InOiB0cnVlLFxyXG4gICAgICAgICd2LWRhdGEtaXRlcmF0b3ItLXNlbGVjdC1hbGwnOiB0aGlzLnNlbGVjdEFsbCAhPT0gZmFsc2UsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWQgKCkge1xyXG4gICAgdGhpcy5pbml0UGFnaW5hdGlvbigpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQ29udGVudCAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5nZW5JdGVtcygpXHJcblxyXG4gICAgICBjb25zdCBkYXRhID0ge1xyXG4gICAgICAgICdjbGFzcyc6IHRoaXMuY29udGVudENsYXNzLFxyXG4gICAgICAgIGF0dHJzOiB0aGlzLiRhdHRycyxcclxuICAgICAgICBvbjogdGhpcy4kbGlzdGVuZXJzLFxyXG4gICAgICAgIHByb3BzOiB0aGlzLmNvbnRlbnRQcm9wc1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCh0aGlzLmNvbnRlbnRUYWcsIGRhdGEsIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIGdlbkVtcHR5SXRlbXMgKGNvbnRlbnQpIHtcclxuICAgICAgcmV0dXJuIFt0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogJ3RleHQteHMtY2VudGVyJyxcclxuICAgICAgICBzdHlsZTogJ3dpZHRoOiAxMDAlJ1xyXG4gICAgICB9LCBjb250ZW50KV1cclxuICAgIH0sXHJcbiAgICBnZW5GaWx0ZXJlZEl0ZW1zICgpIHtcclxuICAgICAgaWYgKCF0aGlzLiRzY29wZWRTbG90cy5pdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaXRlbXMgPSBbXVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDAsIGxlbiA9IHRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGg7IGluZGV4IDwgbGVuOyArK2luZGV4KSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZmlsdGVyZWRJdGVtc1tpbmRleF1cclxuICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMuY3JlYXRlUHJvcHMoaXRlbSwgaW5kZXgpXHJcbiAgICAgICAgaXRlbXMucHVzaCh0aGlzLiRzY29wZWRTbG90cy5pdGVtKHByb3BzKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGl0ZW1zXHJcbiAgICB9LFxyXG4gICAgZ2VuRm9vdGVyICgpIHtcclxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHNsb3RzLmZvb3Rlcikge1xyXG4gICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy4kc2xvdHMuZm9vdGVyKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuaGlkZUFjdGlvbnMpIHtcclxuICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuQWN0aW9ucygpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuIG51bGxcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIGdlbkhlYWRlciAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW11cclxuXHJcbiAgICAgIGlmICh0aGlzLiRzbG90cy5oZWFkZXIpIHtcclxuICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuJHNsb3RzLmhlYWRlcilcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjaGlsZHJlbi5sZW5ndGgpIHJldHVybiBudWxsXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCBjaGlsZHJlbilcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3Nlc1xyXG4gICAgfSwgW1xyXG4gICAgICB0aGlzLmdlbkhlYWRlcigpLFxyXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcclxuICAgICAgdGhpcy5nZW5Gb290ZXIoKVxyXG4gICAgXSlcclxuICB9XHJcbn1cclxuIl19