// Styles
import '../../stylus/components/_overflow-buttons.styl';
// Extensions
import VSelect from '../VSelect/VSelect';
import VAutocomplete from '../VAutocomplete';
import VTextField from '../VTextField/VTextField';
import VBtn from '../VBtn';
import { consoleWarn } from '../../util/console';
/* @vue/component */
export default VAutocomplete.extend({
    name: 'v-overflow-btn',
    props: {
        segmented: Boolean,
        editable: Boolean,
        transition: VSelect.options.props.transition
    },
    computed: {
        classes() {
            return Object.assign(VAutocomplete.options.computed.classes.call(this), {
                'v-overflow-btn': true,
                'v-overflow-btn--segmented': this.segmented,
                'v-overflow-btn--editable': this.editable
            });
        },
        isAnyValueAllowed() {
            return this.editable ||
                VAutocomplete.options.computed.isAnyValueAllowed.call(this);
        },
        isSingle() {
            return true;
        },
        computedItems() {
            return this.segmented ? this.allItems : this.filteredItems;
        },
        $_menuProps() {
            const props = VAutocomplete.options.computed.$_menuProps.call(this);
            props.transition = props.transition || 'v-menu-transition';
            return props;
        }
    },
    methods: {
        genSelections() {
            return this.editable
                ? VAutocomplete.options.methods.genSelections.call(this)
                : VSelect.options.methods.genSelections.call(this); // Override v-autocomplete's override
        },
        genCommaSelection(item, index, last) {
            return this.segmented
                ? this.genSegmentedBtn(item)
                : VSelect.options.methods.genCommaSelection.call(this, item, index, last);
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            input.data.domProps.value = this.editable ? this.internalSearch : '';
            input.data.attrs.readonly = !this.isAnyValueAllowed;
            return input;
        },
        genLabel() {
            if (this.editable && this.isFocused)
                return null;
            const label = VTextField.options.methods.genLabel.call(this);
            if (!label)
                return label;
            // Reset previously set styles from parent
            label.data.style = {};
            return label;
        },
        genSegmentedBtn(item) {
            const itemValue = this.getValue(item);
            const itemObj = this.computedItems.find(i => this.getValue(i) === itemValue) || item;
            if (!itemObj.text || !itemObj.callback) {
                consoleWarn('When using \'segmented\' prop without a selection slot, items must contain both a text and callback property', this);
                return null;
            }
            return this.$createElement(VBtn, {
                props: { flat: true },
                on: {
                    click(e) {
                        e.stopPropagation();
                        itemObj.callback(e);
                    }
                }
            }, [itemObj.text]);
        },
        setSelectedItems() {
            if (this.internalValue == null) {
                this.selectedItems = [];
            }
            else {
                this.selectedItems = [this.internalValue];
            }
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVk92ZXJmbG93QnRuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk92ZXJmbG93QnRuL1ZPdmVyZmxvd0J0bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxnREFBZ0QsQ0FBQTtBQUV2RCxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFDeEMsT0FBTyxhQUFhLE1BQU0sa0JBQWtCLENBQUE7QUFDNUMsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFFakQsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFBO0FBRTFCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUVoRCxvQkFBb0I7QUFDcEIsZUFBZSxhQUFhLENBQUMsTUFBTSxDQUFDO0lBQ2xDLElBQUksRUFBRSxnQkFBZ0I7SUFFdEIsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFLE9BQU87UUFDakIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVU7S0FDN0M7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RFLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLDJCQUEyQixFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUMzQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsUUFBUTthQUMxQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsaUJBQWlCO1lBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUTtnQkFDbEIsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9ELENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO1FBQ0QsYUFBYTtZQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUM1RCxDQUFDO1FBQ0QsV0FBVztZQUNULE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbkUsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLG1CQUFtQixDQUFBO1lBQzFELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsYUFBYTtZQUNYLE9BQU8sSUFBSSxDQUFDLFFBQVE7Z0JBQ2xCLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDeEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxxQ0FBcUM7UUFDNUYsQ0FBQztRQUNELGlCQUFpQixDQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSTtZQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTO2dCQUNuQixDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7Z0JBQzVCLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDN0UsQ0FBQztRQUNELFFBQVE7WUFDTixNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBRTVELEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7WUFDcEUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFBO1lBRW5ELE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFFaEQsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUU1RCxJQUFJLENBQUMsS0FBSztnQkFBRSxPQUFPLEtBQUssQ0FBQTtZQUV4QiwwQ0FBMEM7WUFDMUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFBO1lBRXJCLE9BQU8sS0FBSyxDQUFBO1FBQ2QsQ0FBQztRQUNELGVBQWUsQ0FBRSxJQUFJO1lBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQTtZQUVwRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RDLFdBQVcsQ0FBQyw4R0FBOEcsRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDakksT0FBTyxJQUFJLENBQUE7YUFDWjtZQUVELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUU7Z0JBQy9CLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7Z0JBQ3JCLEVBQUUsRUFBRTtvQkFDRixLQUFLLENBQUUsQ0FBQzt3QkFDTixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7d0JBQ25CLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ3JCLENBQUM7aUJBQ0Y7YUFDRixFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFDcEIsQ0FBQztRQUNELGdCQUFnQjtZQUNkLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFBO2FBQ3hCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7YUFDMUM7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fb3ZlcmZsb3ctYnV0dG9ucy5zdHlsJ1xyXG5cclxuLy8gRXh0ZW5zaW9uc1xyXG5pbXBvcnQgVlNlbGVjdCBmcm9tICcuLi9WU2VsZWN0L1ZTZWxlY3QnXHJcbmltcG9ydCBWQXV0b2NvbXBsZXRlIGZyb20gJy4uL1ZBdXRvY29tcGxldGUnXHJcbmltcG9ydCBWVGV4dEZpZWxkIGZyb20gJy4uL1ZUZXh0RmllbGQvVlRleHRGaWVsZCdcclxuXHJcbmltcG9ydCBWQnRuIGZyb20gJy4uL1ZCdG4nXHJcblxyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZBdXRvY29tcGxldGUuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1vdmVyZmxvdy1idG4nLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgc2VnbWVudGVkOiBCb29sZWFuLFxyXG4gICAgZWRpdGFibGU6IEJvb2xlYW4sXHJcbiAgICB0cmFuc2l0aW9uOiBWU2VsZWN0Lm9wdGlvbnMucHJvcHMudHJhbnNpdGlvblxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oVkF1dG9jb21wbGV0ZS5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSwge1xyXG4gICAgICAgICd2LW92ZXJmbG93LWJ0bic6IHRydWUsXHJcbiAgICAgICAgJ3Ytb3ZlcmZsb3ctYnRuLS1zZWdtZW50ZWQnOiB0aGlzLnNlZ21lbnRlZCxcclxuICAgICAgICAndi1vdmVyZmxvdy1idG4tLWVkaXRhYmxlJzogdGhpcy5lZGl0YWJsZVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGlzQW55VmFsdWVBbGxvd2VkICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZWRpdGFibGUgfHxcclxuICAgICAgICBWQXV0b2NvbXBsZXRlLm9wdGlvbnMuY29tcHV0ZWQuaXNBbnlWYWx1ZUFsbG93ZWQuY2FsbCh0aGlzKVxyXG4gICAgfSxcclxuICAgIGlzU2luZ2xlICgpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICBjb21wdXRlZEl0ZW1zICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2VnbWVudGVkID8gdGhpcy5hbGxJdGVtcyA6IHRoaXMuZmlsdGVyZWRJdGVtc1xyXG4gICAgfSxcclxuICAgICRfbWVudVByb3BzICgpIHtcclxuICAgICAgY29uc3QgcHJvcHMgPSBWQXV0b2NvbXBsZXRlLm9wdGlvbnMuY29tcHV0ZWQuJF9tZW51UHJvcHMuY2FsbCh0aGlzKVxyXG4gICAgICBwcm9wcy50cmFuc2l0aW9uID0gcHJvcHMudHJhbnNpdGlvbiB8fCAndi1tZW51LXRyYW5zaXRpb24nXHJcbiAgICAgIHJldHVybiBwcm9wc1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlblNlbGVjdGlvbnMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5lZGl0YWJsZVxyXG4gICAgICAgID8gVkF1dG9jb21wbGV0ZS5vcHRpb25zLm1ldGhvZHMuZ2VuU2VsZWN0aW9ucy5jYWxsKHRoaXMpXHJcbiAgICAgICAgOiBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5nZW5TZWxlY3Rpb25zLmNhbGwodGhpcykgLy8gT3ZlcnJpZGUgdi1hdXRvY29tcGxldGUncyBvdmVycmlkZVxyXG4gICAgfSxcclxuICAgIGdlbkNvbW1hU2VsZWN0aW9uIChpdGVtLCBpbmRleCwgbGFzdCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zZWdtZW50ZWRcclxuICAgICAgICA/IHRoaXMuZ2VuU2VnbWVudGVkQnRuKGl0ZW0pXHJcbiAgICAgICAgOiBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5nZW5Db21tYVNlbGVjdGlvbi5jYWxsKHRoaXMsIGl0ZW0sIGluZGV4LCBsYXN0KVxyXG4gICAgfSxcclxuICAgIGdlbklucHV0ICgpIHtcclxuICAgICAgY29uc3QgaW5wdXQgPSBWVGV4dEZpZWxkLm9wdGlvbnMubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMpXHJcblxyXG4gICAgICBpbnB1dC5kYXRhLmRvbVByb3BzLnZhbHVlID0gdGhpcy5lZGl0YWJsZSA/IHRoaXMuaW50ZXJuYWxTZWFyY2ggOiAnJ1xyXG4gICAgICBpbnB1dC5kYXRhLmF0dHJzLnJlYWRvbmx5ID0gIXRoaXMuaXNBbnlWYWx1ZUFsbG93ZWRcclxuXHJcbiAgICAgIHJldHVybiBpbnB1dFxyXG4gICAgfSxcclxuICAgIGdlbkxhYmVsICgpIHtcclxuICAgICAgaWYgKHRoaXMuZWRpdGFibGUgJiYgdGhpcy5pc0ZvY3VzZWQpIHJldHVybiBudWxsXHJcblxyXG4gICAgICBjb25zdCBsYWJlbCA9IFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLmdlbkxhYmVsLmNhbGwodGhpcylcclxuXHJcbiAgICAgIGlmICghbGFiZWwpIHJldHVybiBsYWJlbFxyXG5cclxuICAgICAgLy8gUmVzZXQgcHJldmlvdXNseSBzZXQgc3R5bGVzIGZyb20gcGFyZW50XHJcbiAgICAgIGxhYmVsLmRhdGEuc3R5bGUgPSB7fVxyXG5cclxuICAgICAgcmV0dXJuIGxhYmVsXHJcbiAgICB9LFxyXG4gICAgZ2VuU2VnbWVudGVkQnRuIChpdGVtKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbSlcclxuICAgICAgY29uc3QgaXRlbU9iaiA9IHRoaXMuY29tcHV0ZWRJdGVtcy5maW5kKGkgPT4gdGhpcy5nZXRWYWx1ZShpKSA9PT0gaXRlbVZhbHVlKSB8fCBpdGVtXHJcblxyXG4gICAgICBpZiAoIWl0ZW1PYmoudGV4dCB8fCAhaXRlbU9iai5jYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnNvbGVXYXJuKCdXaGVuIHVzaW5nIFxcJ3NlZ21lbnRlZFxcJyBwcm9wIHdpdGhvdXQgYSBzZWxlY3Rpb24gc2xvdCwgaXRlbXMgbXVzdCBjb250YWluIGJvdGggYSB0ZXh0IGFuZCBjYWxsYmFjayBwcm9wZXJ0eScsIHRoaXMpXHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJ0biwge1xyXG4gICAgICAgIHByb3BzOiB7IGZsYXQ6IHRydWUgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2sgKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgICAgICBpdGVtT2JqLmNhbGxiYWNrKGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbaXRlbU9iai50ZXh0XSlcclxuICAgIH0sXHJcbiAgICBzZXRTZWxlY3RlZEl0ZW1zICgpIHtcclxuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW11cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbdGhpcy5pbnRlcm5hbFZhbHVlXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=