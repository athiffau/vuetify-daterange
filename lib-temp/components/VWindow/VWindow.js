// Styles
import '../../stylus/components/_windows.styl';
// Components
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Directives
import Touch from '../../directives/touch';
/* @vue/component */
export default BaseItemGroup.extend({
    name: 'v-window',
    provide() {
        return {
            windowGroup: this
        };
    },
    directives: { Touch },
    props: {
        mandatory: {
            type: Boolean,
            default: true
        },
        reverse: {
            type: Boolean,
            default: undefined
        },
        touch: Object,
        touchless: Boolean,
        value: {
            required: false
        },
        vertical: Boolean
    },
    data() {
        return {
            internalHeight: undefined,
            isActive: false,
            isBooted: false,
            isReverse: false
        };
    },
    computed: {
        computedTransition() {
            if (!this.isBooted)
                return '';
            const axis = this.vertical ? 'y' : 'x';
            const direction = this.internalReverse === !this.$vuetify.rtl
                ? '-reverse'
                : '';
            return `v-window-${axis}${direction}-transition`;
        },
        internalIndex() {
            return this.items.findIndex((item, i) => {
                return this.internalValue === this.getValue(item, i);
            });
        },
        internalReverse() {
            if (this.reverse !== undefined)
                return this.reverse;
            return this.isReverse;
        }
    },
    watch: {
        internalIndex: 'updateReverse'
    },
    mounted() {
        this.$nextTick(() => (this.isBooted = true));
    },
    methods: {
        genContainer() {
            return this.$createElement('div', {
                staticClass: 'v-window__container',
                class: {
                    'v-window__container--is-active': this.isActive
                },
                style: {
                    height: this.internalHeight
                }
            }, this.$slots.default);
        },
        next() {
            this.isReverse = false;
            const nextIndex = (this.internalIndex + 1) % this.items.length;
            const item = this.items[nextIndex];
            this.internalValue = this.getValue(item, nextIndex);
        },
        prev() {
            this.isReverse = true;
            const lastIndex = (this.internalIndex + this.items.length - 1) % this.items.length;
            const item = this.items[lastIndex];
            this.internalValue = this.getValue(item, lastIndex);
        },
        updateReverse(val, oldVal) {
            this.isReverse = val < oldVal;
        }
    },
    render(h) {
        const data = {
            staticClass: 'v-window',
            directives: []
        };
        if (!this.touchless) {
            const value = this.touch || {
                left: this.next,
                right: this.prev
            };
            data.directives.push({
                name: 'touch',
                value
            });
        }
        return h('div', data, [this.genContainer()]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVldpbmRvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZXaW5kb3cvVldpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx1Q0FBdUMsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSx3QkFBd0IsQ0FBQTtBQUsxQyxvQkFBb0I7QUFDcEIsZUFBZSxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ2xDLElBQUksRUFBRSxVQUFVO0lBRWhCLE9BQU87UUFDTCxPQUFPO1lBQ0wsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQTtJQUNILENBQUM7SUFFRCxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUU7SUFFckIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsU0FBUztTQUNuQjtRQUNELEtBQUssRUFBRSxNQUFNO1FBQ2IsU0FBUyxFQUFFLE9BQU87UUFDbEIsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLEtBQUs7U0FDaEI7UUFDRCxRQUFRLEVBQUUsT0FBTztLQUNsQjtJQUVELElBQUk7UUFDRixPQUFPO1lBQ0wsY0FBYyxFQUFFLFNBQStCO1lBQy9DLFFBQVEsRUFBRSxLQUFLO1lBQ2YsUUFBUSxFQUFFLEtBQUs7WUFDZixTQUFTLEVBQUUsS0FBSztTQUNqQixDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLGtCQUFrQjtZQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsT0FBTyxFQUFFLENBQUE7WUFFN0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FB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Q2YsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2pCLENBQUE7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDbkIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSzthQUNOLENBQUMsQ0FBQTtTQUNIO1FBRUQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDOUMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL193aW5kb3dzLnN0eWwnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCB7IEJhc2VJdGVtR3JvdXAgfSBmcm9tICcuLi9WSXRlbUdyb3VwL1ZJdGVtR3JvdXAnXHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbmltcG9ydCBUb3VjaCBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3RvdWNoJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGlyZWN0aXZlIH0gZnJvbSAndnVlL3R5cGVzL3Zub2RlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgQmFzZUl0ZW1Hcm91cC5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXdpbmRvdycsXHJcblxyXG4gIHByb3ZpZGUgKCk6IG9iamVjdCB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB3aW5kb3dHcm91cDogdGhpc1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHsgVG91Y2ggfSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIG1hbmRhdG9yeToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgcmV2ZXJzZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICB0b3VjaDogT2JqZWN0LFxyXG4gICAgdG91Y2hsZXNzOiBCb29sZWFuLFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgdmVydGljYWw6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGludGVybmFsSGVpZ2h0OiB1bmRlZmluZWQgYXMgdW5kZWZpbmVkIHwgc3RyaW5nLFxyXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgIGlzQm9vdGVkOiBmYWxzZSxcclxuICAgICAgaXNSZXZlcnNlOiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZFRyYW5zaXRpb24gKCk6IHN0cmluZyB7XHJcbiAgICAgIGlmICghdGhpcy5pc0Jvb3RlZCkgcmV0dXJuICcnXHJcblxyXG4gICAgICBjb25zdCBheGlzID0gdGhpcy52ZXJ0aWNhbCA/ICd5JyA6ICd4J1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmludGVybmFsUmV2ZXJzZSA9PT0gIXRoaXMuJHZ1ZXRpZnkucnRsXHJcbiAgICAgICAgPyAnLXJldmVyc2UnXHJcbiAgICAgICAgOiAnJ1xyXG5cclxuICAgICAgcmV0dXJuIGB2LXdpbmRvdy0ke2F4aXN9JHtkaXJlY3Rpb259LXRyYW5zaXRpb25gXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxJbmRleCAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmluZEluZGV4KChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxWYWx1ZSA9PT0gdGhpcy5nZXRWYWx1ZShpdGVtLCBpKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGludGVybmFsUmV2ZXJzZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLnJldmVyc2UgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMucmV2ZXJzZVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuaXNSZXZlcnNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGludGVybmFsSW5kZXg6ICd1cGRhdGVSZXZlcnNlJ1xyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gKHRoaXMuaXNCb290ZWQgPSB0cnVlKSlcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5Db250YWluZXIgKCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytd2luZG93X19jb250YWluZXInLFxyXG4gICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICAndi13aW5kb3dfX2NvbnRhaW5lci0taXMtYWN0aXZlJzogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIGhlaWdodDogdGhpcy5pbnRlcm5hbEhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICAgIH0sXHJcbiAgICBuZXh0ICgpIHtcclxuICAgICAgdGhpcy5pc1JldmVyc2UgPSBmYWxzZVxyXG4gICAgICBjb25zdCBuZXh0SW5kZXggPSAodGhpcy5pbnRlcm5hbEluZGV4ICsgMSkgJSB0aGlzLml0ZW1zLmxlbmd0aFxyXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tuZXh0SW5kZXhdXHJcblxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIG5leHRJbmRleClcclxuICAgIH0sXHJcbiAgICBwcmV2ICgpIHtcclxuICAgICAgdGhpcy5pc1JldmVyc2UgPSB0cnVlXHJcbiAgICAgIGNvbnN0IGxhc3RJbmRleCA9ICh0aGlzLmludGVybmFsSW5kZXggKyB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpICUgdGhpcy5pdGVtcy5sZW5ndGhcclxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNbbGFzdEluZGV4XVxyXG5cclxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtLCBsYXN0SW5kZXgpXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmV2ZXJzZSAodmFsOiBudW1iZXIsIG9sZFZhbDogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuaXNSZXZlcnNlID0gdmFsIDwgb2xkVmFsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXdpbmRvdycsXHJcbiAgICAgIGRpcmVjdGl2ZXM6IFtdIGFzIFZOb2RlRGlyZWN0aXZlW11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMudG91Y2hsZXNzKSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy50b3VjaCB8fCB7XHJcbiAgICAgICAgbGVmdDogdGhpcy5uZXh0LFxyXG4gICAgICAgIHJpZ2h0OiB0aGlzLnByZXZcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YS5kaXJlY3RpdmVzLnB1c2goe1xyXG4gICAgICAgIG5hbWU6ICd0b3VjaCcsXHJcbiAgICAgICAgdmFsdWVcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW3RoaXMuZ2VuQ29udGFpbmVyKCldKVxyXG4gIH1cclxufSlcclxuIl19