// Styles
import '../../stylus/components/_autocompletes.styl';
// Extensions
import VSelect from '../VSelect/VSelect';
import VAutocomplete from '../VAutocomplete/VAutocomplete';
// Utils
import { keyCodes } from '../../util/helpers';
/* @vue/component */
export default {
    name: 'v-combobox',
    extends: VAutocomplete,
    props: {
        delimiters: {
            type: Array,
            default: () => ([])
        },
        returnObject: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        editingIndex: -1
    }),
    computed: {
        counterValue() {
            return this.multiple
                ? this.selectedItems.length
                : (this.internalSearch || '').toString().length;
        },
        hasSlot() {
            return VSelect.options.computed.hasSlot.call(this) || this.multiple;
        },
        isAnyValueAllowed() {
            return true;
        },
        menuCanShow() {
            if (!this.isFocused)
                return false;
            return this.hasDisplayedItems ||
                (!!this.$slots['no-data'] && !this.hideNoData);
        }
    },
    methods: {
        onFilteredItemsChanged() {
            // nop
        },
        onInternalSearchChanged(val) {
            if (val &&
                this.multiple &&
                this.delimiters.length) {
                const delimiter = this.delimiters.find(d => val.endsWith(d));
                if (delimiter != null) {
                    this.internalSearch = val.slice(0, val.length - delimiter.length);
                    this.updateTags();
                }
            }
            this.updateMenuDimensions();
        },
        genChipSelection(item, index) {
            const chip = VSelect.options.methods.genChipSelection.call(this, item, index);
            // Allow user to update an existing value
            if (this.multiple) {
                chip.componentOptions.listeners.dblclick = () => {
                    this.editingIndex = index;
                    this.internalSearch = this.getText(item);
                    this.selectedIndex = -1;
                };
            }
            return chip;
        },
        onChipInput(item) {
            VSelect.options.methods.onChipInput.call(this, item);
            this.editingIndex = -1;
        },
        // Requires a manual definition
        // to overwrite removal in v-autocomplete
        onEnterDown(e) {
            e.preventDefault();
            VSelect.options.methods.onEnterDown.call(this);
            // If has menu index, let v-select-list handle
            if (this.getMenuIndex() > -1)
                return;
            this.updateSelf();
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            VSelect.options.methods.onKeyDown.call(this, e);
            // If user is at selection index of 0
            // create a new tag
            if (this.multiple &&
                keyCode === keyCodes.left &&
                this.$refs.input.selectionStart === 0) {
                this.updateSelf();
            }
            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onTabDown(e) {
            // When adding tags, if searching and
            // there is not a filtered options,
            // add the value to the tags list
            if (this.multiple &&
                this.internalSearch &&
                this.getMenuIndex() === -1) {
                e.preventDefault();
                e.stopPropagation();
                return this.updateTags();
            }
            VAutocomplete.options.methods.onTabDown.call(this, e);
        },
        selectItem(item) {
            // Currently only supports items:<string[]>
            if (this.editingIndex > -1) {
                this.updateEditing();
            }
            else {
                VSelect.options.methods.selectItem.call(this, item);
            }
        },
        setSelectedItems() {
            if (this.internalValue == null ||
                this.internalValue === '') {
                this.selectedItems = [];
            }
            else {
                this.selectedItems = this.multiple ? this.internalValue : [this.internalValue];
            }
        },
        setValue(value = this.internalSearch) {
            VSelect.options.methods.setValue.call(this, value);
        },
        updateEditing() {
            const value = this.internalValue.slice();
            value[this.editingIndex] = this.internalSearch;
            this.setValue(value);
            this.editingIndex = -1;
        },
        updateCombobox() {
            const isUsingSlot = Boolean(this.$scopedSlots.selection) || this.hasChips;
            // If search is not dirty and is
            // using slot, do nothing
            if (isUsingSlot && !this.searchIsDirty)
                return;
            // The internal search is not matching
            // the internal value, update the input
            if (this.internalSearch !== this.getText(this.internalValue))
                this.setValue();
            // Reset search if using slot
            // to avoid a double input
            if (isUsingSlot)
                this.internalSearch = undefined;
        },
        updateSelf() {
            this.multiple ? this.updateTags() : this.updateCombobox();
        },
        updateTags() {
            const menuIndex = this.getMenuIndex();
            // If the user is not searching
            // and no menu item is selected
            // do nothing
            if (menuIndex < 0 &&
                !this.searchIsDirty)
                return;
            if (this.editingIndex > -1) {
                return this.updateEditing();
            }
            const index = this.selectedItems.indexOf(this.internalSearch);
            // If it already exists, do nothing
            // this might need to change to bring
            // the duplicated item to the last entered
            if (index > -1) {
                const internalValue = this.internalValue.slice();
                internalValue.splice(index, 1);
                this.setValue(internalValue);
            }
            // If menu index is greater than 1
            // the selection is handled elsewhere
            // TODO: find out where
            if (menuIndex > -1)
                return (this.internalSearch = null);
            this.selectItem(this.internalSearch);
            this.internalSearch = null;
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNvbWJvYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNvbWJvYm94L1ZDb21ib2JveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyw2Q0FBNkMsQ0FBQTtBQUVwRCxhQUFhO0FBQ2IsT0FBTyxPQUFPLE1BQU0sb0JBQW9CLENBQUE7QUFDeEMsT0FBTyxhQUFhLE1BQU0sZ0NBQWdDLENBQUE7QUFFMUQsUUFBUTtBQUNSLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU3QyxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxZQUFZO0lBRWxCLE9BQU8sRUFBRSxhQUFhO0lBRXRCLEtBQUssRUFBRTtRQUNMLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO0tBQ0Y7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFlBQVksRUFBRSxDQUFDLENBQUM7S0FDakIsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLFlBQVk7WUFDVixPQUFPLElBQUksQ0FBQyxRQUFRO2dCQUNsQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2dCQUMzQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQTtRQUNuRCxDQUFDO1FBQ0QsT0FBTztZQUNMLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQ3JFLENBQUM7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L3N0eWx1cy9jb21wb25lbnRzL19hdXRvY29tcGxldGVzLnN0eWwnXHJcblxyXG4vLyBFeHRlbnNpb25zXHJcbmltcG9ydCBWU2VsZWN0IGZyb20gJy4uL1ZTZWxlY3QvVlNlbGVjdCdcclxuaW1wb3J0IFZBdXRvY29tcGxldGUgZnJvbSAnLi4vVkF1dG9jb21wbGV0ZS9WQXV0b2NvbXBsZXRlJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtY29tYm9ib3gnLFxyXG5cclxuICBleHRlbmRzOiBWQXV0b2NvbXBsZXRlLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZGVsaW1pdGVyczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKVxyXG4gICAgfSxcclxuICAgIHJldHVybk9iamVjdDoge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIGVkaXRpbmdJbmRleDogLTFcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvdW50ZXJWYWx1ZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlXHJcbiAgICAgICAgPyB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoXHJcbiAgICAgICAgOiAodGhpcy5pbnRlcm5hbFNlYXJjaCB8fCAnJykudG9TdHJpbmcoKS5sZW5ndGhcclxuICAgIH0sXHJcbiAgICBoYXNTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIFZTZWxlY3Qub3B0aW9ucy5jb21wdXRlZC5oYXNTbG90LmNhbGwodGhpcykgfHwgdGhpcy5tdWx0aXBsZVxyXG4gICAgfSxcclxuICAgIGlzQW55VmFsdWVBbGxvd2VkICgpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICBtZW51Q2FuU2hvdyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc0ZvY3VzZWQpIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuaGFzRGlzcGxheWVkSXRlbXMgfHxcclxuICAgICAgICAoISF0aGlzLiRzbG90c1snbm8tZGF0YSddICYmICF0aGlzLmhpZGVOb0RhdGEpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgb25GaWx0ZXJlZEl0ZW1zQ2hhbmdlZCAoKSB7XHJcbiAgICAgIC8vIG5vcFxyXG4gICAgfSxcclxuICAgIG9uSW50ZXJuYWxTZWFyY2hDaGFuZ2VkICh2YWwpIHtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHZhbCAmJlxyXG4gICAgICAgIHRoaXMubXVsdGlwbGUgJiZcclxuICAgICAgICB0aGlzLmRlbGltaXRlcnMubGVuZ3RoXHJcbiAgICAgICkge1xyXG4gICAgICAgIGNvbnN0IGRlbGltaXRlciA9IHRoaXMuZGVsaW1pdGVycy5maW5kKGQgPT4gdmFsLmVuZHNXaXRoKGQpKVxyXG4gICAgICAgIGlmIChkZWxpbWl0ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IHZhbC5zbGljZSgwLCB2YWwubGVuZ3RoIC0gZGVsaW1pdGVyLmxlbmd0aClcclxuICAgICAgICAgIHRoaXMudXBkYXRlVGFncygpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZU1lbnVEaW1lbnNpb25zKClcclxuICAgIH0sXHJcbiAgICBnZW5DaGlwU2VsZWN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICBjb25zdCBjaGlwID0gVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMuZ2VuQ2hpcFNlbGVjdGlvbi5jYWxsKHRoaXMsIGl0ZW0sIGluZGV4KVxyXG5cclxuICAgICAgLy8gQWxsb3cgdXNlciB0byB1cGRhdGUgYW4gZXhpc3RpbmcgdmFsdWVcclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICBjaGlwLmNvbXBvbmVudE9wdGlvbnMubGlzdGVuZXJzLmRibGNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5lZGl0aW5nSW5kZXggPSBpbmRleFxyXG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IHRoaXMuZ2V0VGV4dChpdGVtKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjaGlwXHJcbiAgICB9LFxyXG4gICAgb25DaGlwSW5wdXQgKGl0ZW0pIHtcclxuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMub25DaGlwSW5wdXQuY2FsbCh0aGlzLCBpdGVtKVxyXG5cclxuICAgICAgdGhpcy5lZGl0aW5nSW5kZXggPSAtMVxyXG4gICAgfSxcclxuICAgIC8vIFJlcXVpcmVzIGEgbWFudWFsIGRlZmluaXRpb25cclxuICAgIC8vIHRvIG92ZXJ3cml0ZSByZW1vdmFsIGluIHYtYXV0b2NvbXBsZXRlXHJcbiAgICBvbkVudGVyRG93biAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgIFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLm9uRW50ZXJEb3duLmNhbGwodGhpcylcclxuXHJcbiAgICAgIC8vIElmIGhhcyBtZW51IGluZGV4LCBsZXQgdi1zZWxlY3QtbGlzdCBoYW5kbGVcclxuICAgICAgaWYgKHRoaXMuZ2V0TWVudUluZGV4KCkgPiAtMSkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVNlbGYoKVxyXG4gICAgfSxcclxuICAgIG9uS2V5RG93biAoZSkge1xyXG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXHJcblxyXG4gICAgICBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5vbktleURvd24uY2FsbCh0aGlzLCBlKVxyXG5cclxuICAgICAgLy8gSWYgdXNlciBpcyBhdCBzZWxlY3Rpb24gaW5kZXggb2YgMFxyXG4gICAgICAvLyBjcmVhdGUgYSBuZXcgdGFnXHJcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlICYmXHJcbiAgICAgICAga2V5Q29kZSA9PT0ga2V5Q29kZXMubGVmdCAmJlxyXG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuc2VsZWN0aW9uU3RhcnQgPT09IDBcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTZWxmKClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gVGhlIG9yZGVyaW5nIGlzIGltcG9ydGFudCBoZXJlXHJcbiAgICAgIC8vIGFsbG93cyBuZXcgdmFsdWUgdG8gYmUgdXBkYXRlZFxyXG4gICAgICAvLyBhbmQgdGhlbiBtb3ZlcyB0aGUgaW5kZXggdG8gdGhlXHJcbiAgICAgIC8vIHByb3BlciBsb2NhdGlvblxyXG4gICAgICB0aGlzLmNoYW5nZVNlbGVjdGVkSW5kZXgoa2V5Q29kZSlcclxuICAgIH0sXHJcbiAgICBvblRhYkRvd24gKGUpIHtcclxuICAgICAgLy8gV2hlbiBhZGRpbmcgdGFncywgaWYgc2VhcmNoaW5nIGFuZFxyXG4gICAgICAvLyB0aGVyZSBpcyBub3QgYSBmaWx0ZXJlZCBvcHRpb25zLFxyXG4gICAgICAvLyBhZGQgdGhlIHZhbHVlIHRvIHRoZSB0YWdzIGxpc3RcclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiZcclxuICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoICYmXHJcbiAgICAgICAgdGhpcy5nZXRNZW51SW5kZXgoKSA9PT0gLTFcclxuICAgICAgKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUYWdzKClcclxuICAgICAgfVxyXG5cclxuICAgICAgVkF1dG9jb21wbGV0ZS5vcHRpb25zLm1ldGhvZHMub25UYWJEb3duLmNhbGwodGhpcywgZSlcclxuICAgIH0sXHJcbiAgICBzZWxlY3RJdGVtIChpdGVtKSB7XHJcbiAgICAgIC8vIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIGl0ZW1zOjxzdHJpbmdbXT5cclxuICAgICAgaWYgKHRoaXMuZWRpdGluZ0luZGV4ID4gLTEpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUVkaXRpbmcoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLnNlbGVjdEl0ZW0uY2FsbCh0aGlzLCBpdGVtKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0U2VsZWN0ZWRJdGVtcyAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmludGVybmFsVmFsdWUgPT0gbnVsbCB8fFxyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9PT0gJydcclxuICAgICAgKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW11cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB0aGlzLm11bHRpcGxlID8gdGhpcy5pbnRlcm5hbFZhbHVlIDogW3RoaXMuaW50ZXJuYWxWYWx1ZV1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldFZhbHVlICh2YWx1ZSA9IHRoaXMuaW50ZXJuYWxTZWFyY2gpIHtcclxuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMuc2V0VmFsdWUuY2FsbCh0aGlzLCB2YWx1ZSlcclxuICAgIH0sXHJcbiAgICB1cGRhdGVFZGl0aW5nICgpIHtcclxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWUuc2xpY2UoKVxyXG4gICAgICB2YWx1ZVt0aGlzLmVkaXRpbmdJbmRleF0gPSB0aGlzLmludGVybmFsU2VhcmNoXHJcblxyXG4gICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKVxyXG5cclxuICAgICAgdGhpcy5lZGl0aW5nSW5kZXggPSAtMVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZUNvbWJvYm94ICgpIHtcclxuICAgICAgY29uc3QgaXNVc2luZ1Nsb3QgPSBCb29sZWFuKHRoaXMuJHNjb3BlZFNsb3RzLnNlbGVjdGlvbikgfHwgdGhpcy5oYXNDaGlwc1xyXG5cclxuICAgICAgLy8gSWYgc2VhcmNoIGlzIG5vdCBkaXJ0eSBhbmQgaXNcclxuICAgICAgLy8gdXNpbmcgc2xvdCwgZG8gbm90aGluZ1xyXG4gICAgICBpZiAoaXNVc2luZ1Nsb3QgJiYgIXRoaXMuc2VhcmNoSXNEaXJ0eSkgcmV0dXJuXHJcblxyXG4gICAgICAvLyBUaGUgaW50ZXJuYWwgc2VhcmNoIGlzIG5vdCBtYXRjaGluZ1xyXG4gICAgICAvLyB0aGUgaW50ZXJuYWwgdmFsdWUsIHVwZGF0ZSB0aGUgaW5wdXRcclxuICAgICAgaWYgKHRoaXMuaW50ZXJuYWxTZWFyY2ggIT09IHRoaXMuZ2V0VGV4dCh0aGlzLmludGVybmFsVmFsdWUpKSB0aGlzLnNldFZhbHVlKClcclxuXHJcbiAgICAgIC8vIFJlc2V0IHNlYXJjaCBpZiB1c2luZyBzbG90XHJcbiAgICAgIC8vIHRvIGF2b2lkIGEgZG91YmxlIGlucHV0XHJcbiAgICAgIGlmIChpc1VzaW5nU2xvdCkgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IHVuZGVmaW5lZFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVNlbGYgKCkge1xyXG4gICAgICB0aGlzLm11bHRpcGxlID8gdGhpcy51cGRhdGVUYWdzKCkgOiB0aGlzLnVwZGF0ZUNvbWJvYm94KClcclxuICAgIH0sXHJcbiAgICB1cGRhdGVUYWdzICgpIHtcclxuICAgICAgY29uc3QgbWVudUluZGV4ID0gdGhpcy5nZXRNZW51SW5kZXgoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIHVzZXIgaXMgbm90IHNlYXJjaGluZ1xyXG4gICAgICAvLyBhbmQgbm8gbWVudSBpdGVtIGlzIHNlbGVjdGVkXHJcbiAgICAgIC8vIGRvIG5vdGhpbmdcclxuICAgICAgaWYgKG1lbnVJbmRleCA8IDAgJiZcclxuICAgICAgICAhdGhpcy5zZWFyY2hJc0RpcnR5XHJcbiAgICAgICkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAodGhpcy5lZGl0aW5nSW5kZXggPiAtMSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUVkaXRpbmcoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5pbmRleE9mKHRoaXMuaW50ZXJuYWxTZWFyY2gpXHJcbiAgICAgIC8vIElmIGl0IGFscmVhZHkgZXhpc3RzLCBkbyBub3RoaW5nXHJcbiAgICAgIC8vIHRoaXMgbWlnaHQgbmVlZCB0byBjaGFuZ2UgdG8gYnJpbmdcclxuICAgICAgLy8gdGhlIGR1cGxpY2F0ZWQgaXRlbSB0byB0aGUgbGFzdCBlbnRlcmVkXHJcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgY29uc3QgaW50ZXJuYWxWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZS5zbGljZSgpXHJcbiAgICAgICAgaW50ZXJuYWxWYWx1ZS5zcGxpY2UoaW5kZXgsIDEpXHJcblxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoaW50ZXJuYWxWYWx1ZSlcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSWYgbWVudSBpbmRleCBpcyBncmVhdGVyIHRoYW4gMVxyXG4gICAgICAvLyB0aGUgc2VsZWN0aW9uIGlzIGhhbmRsZWQgZWxzZXdoZXJlXHJcbiAgICAgIC8vIFRPRE86IGZpbmQgb3V0IHdoZXJlXHJcbiAgICAgIGlmIChtZW51SW5kZXggPiAtMSkgcmV0dXJuICh0aGlzLmludGVybmFsU2VhcmNoID0gbnVsbClcclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0SXRlbSh0aGlzLmludGVybmFsU2VhcmNoKVxyXG4gICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gbnVsbFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=