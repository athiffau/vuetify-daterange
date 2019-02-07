// Styles
import '../../stylus/components/_item-group.styl';
import Proxyable from '../../mixins/proxyable';
import Themeable from '../../mixins/themeable';
// Utilities
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export const BaseItemGroup = mixins(Proxyable, Themeable).extend({
    name: 'base-item-group',
    props: {
        activeClass: {
            type: String,
            default: 'v-item--active'
        },
        mandatory: Boolean,
        max: {
            type: [Number, String],
            default: null
        },
        multiple: Boolean
    },
    data() {
        return {
            // As long as a value is defined, show it
            // Otherwise, check if multiple
            // to determine which default to provide
            internalLazyValue: this.value !== undefined
                ? this.value
                : this.multiple ? [] : undefined,
            items: []
        };
    },
    computed: {
        classes() {
            return {
                ...this.themeClasses
            };
        },
        selectedItems() {
            return this.items.filter((item, index) => {
                return this.toggleMethod(this.getValue(item, index));
            });
        },
        selectedValues() {
            return Array.isArray(this.internalValue)
                ? this.internalValue
                : [this.internalValue];
        },
        toggleMethod() {
            if (!this.multiple) {
                return (v) => this.internalValue === v;
            }
            const internalValue = this.internalValue;
            if (Array.isArray(internalValue)) {
                return (v) => internalValue.includes(v);
            }
            return () => false;
        }
    },
    watch: {
        internalValue() {
            // https://github.com/vuetifyjs/vuetify/issues/5352
            this.$nextTick(this.updateItemsState);
        }
    },
    created() {
        if (this.multiple && !Array.isArray(this.internalValue)) {
            consoleWarn('Model must be bound to an array if the multiple property is true.', this);
        }
    },
    methods: {
        getValue(item, i) {
            return item.value == null || item.value === ''
                ? i
                : item.value;
        },
        onClick(item, index) {
            this.updateInternalValue(this.getValue(item, index));
        },
        register(item) {
            const index = this.items.push(item) - 1;
            item.$on('change', () => this.onClick(item, index));
            // If no value provided and mandatory,
            // assign first registered item
            if (this.mandatory && this.internalLazyValue == null) {
                this.updateMandatory();
            }
            this.updateItem(item, index);
        },
        unregister(item) {
            if (this._isDestroyed)
                return;
            const index = this.items.indexOf(item);
            const value = this.getValue(item, index);
            this.items.splice(index, 1);
            const valueIndex = this.selectedValues.indexOf(value);
            // Items is not selected, do nothing
            if (valueIndex < 0)
                return;
            // If not mandatory, use regular update process
            if (!this.mandatory) {
                return this.updateInternalValue(value);
            }
            // Remove the value
            if (this.multiple && Array.isArray(this.internalValue)) {
                this.internalValue = this.internalValue.filter(v => v !== value);
            }
            else {
                this.internalValue = undefined;
            }
            // If mandatory and we have no selection
            // add the last item as value
            /* istanbul ignore else */
            if (!this.selectedItems.length) {
                this.updateMandatory(true);
            }
        },
        updateItem(item, index) {
            const value = this.getValue(item, index);
            item.isActive = this.toggleMethod(value);
        },
        updateItemsState() {
            if (this.mandatory &&
                !this.selectedItems.length) {
                return this.updateMandatory();
            }
            // TODO: Make this smarter so it
            // doesn't have to iterate every
            // child in an update
            this.items.forEach(this.updateItem);
        },
        updateInternalValue(value) {
            this.multiple
                ? this.updateMultiple(value)
                : this.updateSingle(value);
        },
        updateMandatory(last) {
            if (!this.items.length)
                return;
            const index = last ? this.items.length - 1 : 0;
            this.updateInternalValue(this.getValue(this.items[index], index));
        },
        updateMultiple(value) {
            const defaultValue = Array.isArray(this.internalValue)
                ? this.internalValue
                : [];
            const internalValue = defaultValue.slice();
            const index = internalValue.findIndex(val => val === value);
            if (this.mandatory &&
                // Item already exists
                index > -1 &&
                // value would be reduced below min
                internalValue.length - 1 < 1)
                return;
            if (
            // Max is set
            this.max != null &&
                // Item doesn't exist
                index < 0 &&
                // value would be increased above max
                internalValue.length + 1 > this.max)
                return;
            index > -1
                ? internalValue.splice(index, 1)
                : internalValue.push(value);
            this.internalValue = internalValue;
        },
        updateSingle(value) {
            const isSame = value === this.internalValue;
            if (this.mandatory && isSame)
                return;
            this.internalValue = isSame ? undefined : value;
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'v-item-group',
            class: this.classes
        }, this.$slots.default);
    }
});
export default BaseItemGroup.extend({
    name: 'v-item-group',
    provide() {
        return {
            itemGroup: this
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkl0ZW1Hcm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZJdGVtR3JvdXAvVkl0ZW1Hcm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywwQ0FBMEMsQ0FBQTtBQUlqRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFDdEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBT2hELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQ2pDLFNBQVMsRUFDVCxTQUFTLENBQ1YsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsaUJBQWlCO0lBRXZCLEtBQUssRUFBRTtRQUNMLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLGdCQUFnQjtTQUMxQjtRQUNELFNBQVMsRUFBRSxPQUFPO1FBQ2xCLEdBQUcsRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFFBQVEsRUFBRSxPQUFPO0tBQ2xCO0lBRUQsSUFBSTtRQUNGLE9BQU87WUFDTCx5Q0FBeUM7WUFDekMsK0JBQStCO1lBQy9CLHdDQUF3QztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7Z0JBQ3pDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSztnQkFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2xDLEtBQUssRUFBRSxFQUF5QjtTQUNqQyxDQUFBO0lBQ0gsQ0FBQztJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87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QUVGLGVBQWUsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNsQyxJQUFJLEVBQUUsY0FBYztJQUVwQixPQUFPO1FBQ0wsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2l0ZW0tZ3JvdXAuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgR3JvdXBhYmxlIGZyb20gJy4uLy4uL21peGlucy9ncm91cGFibGUnXHJcbmltcG9ydCBQcm94eWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Byb3h5YWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbGl0aWVzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUvdHlwZXMnXHJcblxyXG50eXBlIEdyb3VwYWJsZUluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBHcm91cGFibGU+ICYgeyB2YWx1ZT86IGFueSB9XHJcblxyXG5leHBvcnQgY29uc3QgQmFzZUl0ZW1Hcm91cCA9IG1peGlucyhcclxuICBQcm94eWFibGUsXHJcbiAgVGhlbWVhYmxlXHJcbikuZXh0ZW5kKHtcclxuICBuYW1lOiAnYmFzZS1pdGVtLWdyb3VwJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFjdGl2ZUNsYXNzOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3YtaXRlbS0tYWN0aXZlJ1xyXG4gICAgfSxcclxuICAgIG1hbmRhdG9yeTogQm9vbGVhbixcclxuICAgIG1heDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgbXVsdGlwbGU6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC8vIEFzIGxvbmcgYXMgYSB2YWx1ZSBpcyBkZWZpbmVkLCBzaG93IGl0XHJcbiAgICAgIC8vIE90aGVyd2lzZSwgY2hlY2sgaWYgbXVsdGlwbGVcclxuICAgICAgLy8gdG8gZGV0ZXJtaW5lIHdoaWNoIGRlZmF1bHQgdG8gcHJvdmlkZVxyXG4gICAgICBpbnRlcm5hbExhenlWYWx1ZTogdGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyB0aGlzLnZhbHVlXHJcbiAgICAgICAgOiB0aGlzLm11bHRpcGxlID8gW10gOiB1bmRlZmluZWQsXHJcbiAgICAgIGl0ZW1zOiBbXSBhcyBHcm91cGFibGVJbnN0YW5jZVtdXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWRJdGVtcyAoKTogR3JvdXBhYmxlSW5zdGFuY2VbXSB7XHJcbiAgICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b2dnbGVNZXRob2QodGhpcy5nZXRWYWx1ZShpdGVtLCBpbmRleCkpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWRWYWx1ZXMgKCk6IGFueVtdIHtcclxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxyXG4gICAgICAgID8gdGhpcy5pbnRlcm5hbFZhbHVlXHJcbiAgICAgICAgOiBbdGhpcy5pbnRlcm5hbFZhbHVlXVxyXG4gICAgfSxcclxuICAgIHRvZ2dsZU1ldGhvZCAoKTogKHY6IGFueSkgPT4gYm9vbGVhbiB7XHJcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgIHJldHVybiAodjogYW55KSA9PiB0aGlzLmludGVybmFsVmFsdWUgPT09IHZcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaW50ZXJuYWxWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpbnRlcm5hbFZhbHVlKSkge1xyXG4gICAgICAgIHJldHVybiAodjogYW55KSA9PiBpbnRlcm5hbFZhbHVlLmluY2x1ZGVzKHYpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAoKSA9PiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbnRlcm5hbFZhbHVlICgpIHtcclxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy81MzUyXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMudXBkYXRlSXRlbXNTdGF0ZSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjcmVhdGVkICgpIHtcclxuICAgIGlmICh0aGlzLm11bHRpcGxlICYmICFBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSkpIHtcclxuICAgICAgY29uc29sZVdhcm4oJ01vZGVsIG11c3QgYmUgYm91bmQgdG8gYW4gYXJyYXkgaWYgdGhlIG11bHRpcGxlIHByb3BlcnR5IGlzIHRydWUuJywgdGhpcylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRWYWx1ZSAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UsIGk6IG51bWJlcik6IHVua25vd24ge1xyXG4gICAgICByZXR1cm4gaXRlbS52YWx1ZSA9PSBudWxsIHx8IGl0ZW0udmFsdWUgPT09ICcnXHJcbiAgICAgICAgPyBpXHJcbiAgICAgICAgOiBpdGVtLnZhbHVlXHJcbiAgICB9LFxyXG4gICAgb25DbGljayAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgdGhpcy51cGRhdGVJbnRlcm5hbFZhbHVlKFxyXG4gICAgICAgIHRoaXMuZ2V0VmFsdWUoaXRlbSwgaW5kZXgpXHJcbiAgICAgIClcclxuICAgIH0sXHJcbiAgICByZWdpc3RlciAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLml0ZW1zLnB1c2goaXRlbSkgLSAxXHJcblxyXG4gICAgICBpdGVtLiRvbignY2hhbmdlJywgKCkgPT4gdGhpcy5vbkNsaWNrKGl0ZW0sIGluZGV4KSlcclxuXHJcbiAgICAgIC8vIElmIG5vIHZhbHVlIHByb3ZpZGVkIGFuZCBtYW5kYXRvcnksXHJcbiAgICAgIC8vIGFzc2lnbiBmaXJzdCByZWdpc3RlcmVkIGl0ZW1cclxuICAgICAgaWYgKHRoaXMubWFuZGF0b3J5ICYmIHRoaXMuaW50ZXJuYWxMYXp5VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlTWFuZGF0b3J5KClcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGVJdGVtKGl0ZW0sIGluZGV4KVxyXG4gICAgfSxcclxuICAgIHVucmVnaXN0ZXIgKGl0ZW06IEdyb3VwYWJsZUluc3RhbmNlKSB7XHJcbiAgICAgIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKVxyXG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbSwgaW5kZXgpXHJcblxyXG4gICAgICB0aGlzLml0ZW1zLnNwbGljZShpbmRleCwgMSlcclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlSW5kZXggPSB0aGlzLnNlbGVjdGVkVmFsdWVzLmluZGV4T2YodmFsdWUpXHJcblxyXG4gICAgICAvLyBJdGVtcyBpcyBub3Qgc2VsZWN0ZWQsIGRvIG5vdGhpbmdcclxuICAgICAgaWYgKHZhbHVlSW5kZXggPCAwKSByZXR1cm5cclxuXHJcbiAgICAgIC8vIElmIG5vdCBtYW5kYXRvcnksIHVzZSByZWd1bGFyIHVwZGF0ZSBwcm9jZXNzXHJcbiAgICAgIGlmICghdGhpcy5tYW5kYXRvcnkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVJbnRlcm5hbFZhbHVlKHZhbHVlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBSZW1vdmUgdGhlIHZhbHVlXHJcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlICYmIEFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKSkge1xyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZS5maWx0ZXIodiA9PiB2ICE9PSB2YWx1ZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB1bmRlZmluZWRcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgbWFuZGF0b3J5IGFuZCB3ZSBoYXZlIG5vIHNlbGVjdGlvblxyXG4gICAgICAvLyBhZGQgdGhlIGxhc3QgaXRlbSBhcyB2YWx1ZVxyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1hbmRhdG9yeSh0cnVlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlSXRlbSAoaXRlbTogR3JvdXBhYmxlSW5zdGFuY2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIGluZGV4KVxyXG5cclxuICAgICAgaXRlbS5pc0FjdGl2ZSA9IHRoaXMudG9nZ2xlTWV0aG9kKHZhbHVlKVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUl0ZW1zU3RhdGUgKCkge1xyXG4gICAgICBpZiAodGhpcy5tYW5kYXRvcnkgJiZcclxuICAgICAgICAhdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVNYW5kYXRvcnkoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgc21hcnRlciBzbyBpdFxyXG4gICAgICAvLyBkb2Vzbid0IGhhdmUgdG8gaXRlcmF0ZSBldmVyeVxyXG4gICAgICAvLyBjaGlsZCBpbiBhbiB1cGRhdGVcclxuICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKHRoaXMudXBkYXRlSXRlbSlcclxuICAgIH0sXHJcbiAgICB1cGRhdGVJbnRlcm5hbFZhbHVlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgIHRoaXMubXVsdGlwbGVcclxuICAgICAgICA/IHRoaXMudXBkYXRlTXVsdGlwbGUodmFsdWUpXHJcbiAgICAgICAgOiB0aGlzLnVwZGF0ZVNpbmdsZSh2YWx1ZSlcclxuICAgIH0sXHJcbiAgICB1cGRhdGVNYW5kYXRvcnkgKGxhc3Q/OiBib29sZWFuKSB7XHJcbiAgICAgIGlmICghdGhpcy5pdGVtcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgaW5kZXggPSBsYXN0ID8gdGhpcy5pdGVtcy5sZW5ndGggLSAxIDogMFxyXG5cclxuICAgICAgdGhpcy51cGRhdGVJbnRlcm5hbFZhbHVlKFxyXG4gICAgICAgIHRoaXMuZ2V0VmFsdWUodGhpcy5pdGVtc1tpbmRleF0sIGluZGV4KVxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlTXVsdGlwbGUgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gQXJyYXkuaXNBcnJheSh0aGlzLmludGVybmFsVmFsdWUpXHJcbiAgICAgICAgPyB0aGlzLmludGVybmFsVmFsdWVcclxuICAgICAgICA6IFtdXHJcbiAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSBkZWZhdWx0VmFsdWUuc2xpY2UoKVxyXG4gICAgICBjb25zdCBpbmRleCA9IGludGVybmFsVmFsdWUuZmluZEluZGV4KHZhbCA9PiB2YWwgPT09IHZhbHVlKVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIHRoaXMubWFuZGF0b3J5ICYmXHJcbiAgICAgICAgLy8gSXRlbSBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgIGluZGV4ID4gLTEgJiZcclxuICAgICAgICAvLyB2YWx1ZSB3b3VsZCBiZSByZWR1Y2VkIGJlbG93IG1pblxyXG4gICAgICAgIGludGVybmFsVmFsdWUubGVuZ3RoIC0gMSA8IDFcclxuICAgICAgKSByZXR1cm5cclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICAvLyBNYXggaXMgc2V0XHJcbiAgICAgICAgdGhpcy5tYXggIT0gbnVsbCAmJlxyXG4gICAgICAgIC8vIEl0ZW0gZG9lc24ndCBleGlzdFxyXG4gICAgICAgIGluZGV4IDwgMCAmJlxyXG4gICAgICAgIC8vIHZhbHVlIHdvdWxkIGJlIGluY3JlYXNlZCBhYm92ZSBtYXhcclxuICAgICAgICBpbnRlcm5hbFZhbHVlLmxlbmd0aCArIDEgPiB0aGlzLm1heFxyXG4gICAgICApIHJldHVyblxyXG5cclxuICAgICAgaW5kZXggPiAtMVxyXG4gICAgICAgID8gaW50ZXJuYWxWYWx1ZS5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgICAgOiBpbnRlcm5hbFZhbHVlLnB1c2godmFsdWUpXHJcblxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBpbnRlcm5hbFZhbHVlXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlU2luZ2xlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgIGNvbnN0IGlzU2FtZSA9IHZhbHVlID09PSB0aGlzLmludGVybmFsVmFsdWVcclxuXHJcbiAgICAgIGlmICh0aGlzLm1hbmRhdG9yeSAmJiBpc1NhbWUpIHJldHVyblxyXG5cclxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gaXNTYW1lID8gdW5kZWZpbmVkIDogdmFsdWVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtaXRlbS1ncm91cCcsXHJcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXNcclxuICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXHJcbiAgfVxyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQmFzZUl0ZW1Hcm91cC5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWl0ZW0tZ3JvdXAnLFxyXG5cclxuICBwcm92aWRlICgpOiBvYmplY3Qge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXRlbUdyb3VwOiB0aGlzXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=