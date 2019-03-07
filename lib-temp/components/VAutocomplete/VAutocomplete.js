// Styles
import '../../stylus/components/_autocompletes.styl';
// Extensions
import VSelect, { defaultMenuProps as VSelectMenuProps } from '../VSelect/VSelect';
import VTextField from '../VTextField/VTextField';
// Utils
import { keyCodes } from '../../util/helpers';
const defaultMenuProps = {
    ...VSelectMenuProps,
    offsetY: true,
    offsetOverflow: true,
    transition: false
};
/* @vue/component */
export default VSelect.extend({
    name: 'v-autocomplete',
    props: {
        allowOverflow: {
            type: Boolean,
            default: true
        },
        browserAutocomplete: {
            type: String,
            default: 'off'
        },
        filter: {
            type: Function,
            default: (item, queryText, itemText) => {
                return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1;
            }
        },
        hideNoData: Boolean,
        noFilter: Boolean,
        searchInput: {
            default: undefined
        },
        menuProps: {
            type: VSelect.options.props.menuProps.type,
            default: () => defaultMenuProps
        },
        autoSelectFirst: {
            type: Boolean,
            default: false
        }
    },
    data: vm => ({
        attrsInput: null,
        lazySearch: vm.searchInput
    }),
    computed: {
        classes() {
            return Object.assign({}, VSelect.options.computed.classes.call(this), {
                'v-autocomplete': true,
                'v-autocomplete--is-selecting-index': this.selectedIndex > -1
            });
        },
        computedItems() {
            return this.filteredItems;
        },
        selectedValues() {
            return this.selectedItems.map(item => this.getValue(item));
        },
        hasDisplayedItems() {
            return this.hideSelected
                ? this.filteredItems.some(item => !this.hasItem(item))
                : this.filteredItems.length > 0;
        },
        /**
         * The range of the current input text
         *
         * @return {Number}
         */
        currentRange() {
            if (this.selectedItem == null)
                return 0;
            return this.getText(this.selectedItem).toString().length;
        },
        filteredItems() {
            if (!this.isSearching || this.noFilter || this.internalSearch == null)
                return this.allItems;
            return this.allItems.filter(item => this.filter(item, this.internalSearch.toString(), this.getText(item).toString()));
        },
        internalSearch: {
            get() {
                return this.lazySearch;
            },
            set(val) {
                this.lazySearch = val;
                this.$emit('update:searchInput', val);
            }
        },
        isAnyValueAllowed() {
            return false;
        },
        isDirty() {
            return this.searchIsDirty || this.selectedItems.length > 0;
        },
        isSearching() {
            if (this.multiple)
                return this.searchIsDirty;
            return (this.searchIsDirty &&
                this.internalSearch !== this.getText(this.selectedItem));
        },
        menuCanShow() {
            if (!this.isFocused)
                return false;
            return this.hasDisplayedItems || !this.hideNoData;
        },
        $_menuProps() {
            const props = VSelect.options.computed.$_menuProps.call(this);
            props.contentClass = `v-autocomplete__content ${props.contentClass || ''}`.trim();
            return {
                ...defaultMenuProps,
                ...props
            };
        },
        searchIsDirty() {
            return this.internalSearch != null &&
                this.internalSearch !== '';
        },
        selectedItem() {
            if (this.multiple)
                return null;
            return this.selectedItems.find(i => {
                return this.valueComparator(this.getValue(i), this.getValue(this.internalValue));
            });
        },
        listData() {
            const data = VSelect.options.computed.listData.call(this);
            Object.assign(data.props, {
                items: this.virtualizedItems,
                noFilter: (this.noFilter ||
                    !this.isSearching ||
                    !this.filteredItems.length),
                searchInput: this.internalSearch
            });
            return data;
        }
    },
    watch: {
        filteredItems(val) {
            this.onFilteredItemsChanged(val);
        },
        internalValue() {
            this.setSearch();
        },
        isFocused(val) {
            if (val) {
                this.$refs.input &&
                    this.$refs.input.select();
            }
            else {
                this.updateSelf();
            }
        },
        isMenuActive(val) {
            if (val || !this.hasSlot)
                return;
            this.lazySearch = null;
        },
        items(val, oldVal) {
            // If we are focused, the menu
            // is not active, hide no data is enabled,
            // and items change
            // User is probably async loading
            // items, try to activate the menu
            if (!(oldVal && oldVal.length) &&
                this.hideNoData &&
                this.isFocused &&
                !this.isMenuActive &&
                val.length)
                this.activateMenu();
        },
        searchInput(val) {
            this.lazySearch = val;
        },
        internalSearch(val) {
            this.onInternalSearchChanged(val);
        },
        itemText() {
            this.updateSelf();
        }
    },
    created() {
        this.setSearch();
    },
    methods: {
        onFilteredItemsChanged(val) {
            this.setMenuIndex(-1);
            this.$nextTick(() => {
                this.setMenuIndex(val.length > 0 && (val.length === 1 || this.autoSelectFirst) ? 0 : -1);
            });
        },
        onInternalSearchChanged(val) {
            this.updateMenuDimensions();
        },
        updateMenuDimensions() {
            if (this.isMenuActive &&
                this.$refs.menu) {
                this.$refs.menu.updateDimensions();
            }
        },
        changeSelectedIndex(keyCode) {
            // Do not allow changing of selectedIndex
            // when search is dirty
            if (this.searchIsDirty)
                return;
            if (![
                keyCodes.backspace,
                keyCodes.left,
                keyCodes.right,
                keyCodes.delete
            ].includes(keyCode))
                return;
            const indexes = this.selectedItems.length - 1;
            if (keyCode === keyCodes.left) {
                this.selectedIndex = this.selectedIndex === -1
                    ? indexes
                    : this.selectedIndex - 1;
            }
            else if (keyCode === keyCodes.right) {
                this.selectedIndex = this.selectedIndex >= indexes
                    ? -1
                    : this.selectedIndex + 1;
            }
            else if (this.selectedIndex === -1) {
                this.selectedIndex = indexes;
                return;
            }
            const currentItem = this.selectedItems[this.selectedIndex];
            if ([
                keyCodes.backspace,
                keyCodes.delete
            ].includes(keyCode) &&
                !this.getDisabled(currentItem)) {
                const newIndex = this.selectedIndex === indexes
                    ? this.selectedIndex - 1
                    : this.selectedItems[this.selectedIndex + 1]
                        ? this.selectedIndex
                        : -1;
                if (newIndex === -1) {
                    this.setValue(this.multiple ? [] : undefined);
                }
                else {
                    this.selectItem(currentItem);
                }
                this.selectedIndex = newIndex;
            }
        },
        clearableCallback() {
            this.internalSearch = undefined;
            VSelect.options.methods.clearableCallback.call(this);
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            input.data.attrs.role = 'combobox';
            input.data.domProps.value = this.internalSearch;
            return input;
        },
        genSelections() {
            return this.hasSlot || this.multiple
                ? VSelect.options.methods.genSelections.call(this)
                : [];
        },
        onClick() {
            if (this.isDisabled)
                return;
            this.selectedIndex > -1
                ? (this.selectedIndex = -1)
                : this.onFocus();
            this.activateMenu();
        },
        onEnterDown() {
            // Avoid invoking this method
            // will cause updateSelf to
            // be called emptying search
        },
        onInput(e) {
            if (this.selectedIndex > -1)
                return;
            // If typing and menu is not currently active
            if (e.target.value) {
                this.activateMenu();
                if (!this.isAnyValueAllowed)
                    this.setMenuIndex(0);
            }
            this.mask && this.resetSelections(e.target);
            this.internalSearch = e.target.value;
            this.badInput = e.target.validity && e.target.validity.badInput;
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            VSelect.options.methods.onKeyDown.call(this, e);
            // The ordering is important here
            // allows new value to be updated
            // and then moves the index to the
            // proper location
            this.changeSelectedIndex(keyCode);
        },
        onTabDown(e) {
            VSelect.options.methods.onTabDown.call(this, e);
            this.updateSelf();
        },
        setSelectedItems() {
            VSelect.options.methods.setSelectedItems.call(this);
            // #4273 Don't replace if searching
            // #4403 Don't replace if focused
            if (!this.isFocused)
                this.setSearch();
        },
        setSearch() {
            // Wait for nextTick so selectedItem
            // has had time to update
            this.$nextTick(() => {
                this.internalSearch = (this.multiple &&
                    this.internalSearch &&
                    this.isMenuActive)
                    ? this.internalSearch
                    : (!this.selectedItems.length ||
                        this.multiple ||
                        this.hasSlot)
                        ? null
                        : this.getText(this.selectedItem);
            });
        },
        updateSelf() {
            this.updateAutocomplete();
        },
        updateAutocomplete() {
            if (!this.searchIsDirty &&
                !this.internalValue)
                return;
            if (!this.valueComparator(this.internalSearch, this.getValue(this.internalValue))) {
                this.setSearch();
            }
        },
        hasItem(item) {
            return this.selectedValues.indexOf(this.getValue(item)) > -1;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF1dG9jb21wbGV0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdXRvY29tcGxldGUvVkF1dG9jb21wbGV0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyw2Q0FBNkMsQ0FBQTtBQUVwRCxhQUFhO0FBQ2IsT0FBTyxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsSUFBSSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xGLE9BQU8sVUFBVSxNQUFNLDBCQUEwQixDQUFBO0FBRWpELFFBQVE7QUFDUixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFN0MsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixHQUFHLGdCQUFnQjtJQUNuQixPQUFPLEVBQUUsSUFBSTtJQUNiLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUE7QUFFRCxvQkFBb0I7QUFDcEIsZUFBZSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzVCLElBQUksRUFBRSxnQkFBZ0I7SUFFdEIsS0FBSyxFQUFFO1FBQ0wsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsbUJBQW1CLEVBQUU7WUFDbkIsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsS0FBSztTQUNmO1FBQ0QsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFO2dCQUNyQyxPQUFPLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1lBQ2pGLENBQUM7U0FDRjtRQUNELFVBQVUsRUFBRSxPQUFPO1FBQ25CLFFBQVEsRUFBRSxP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LENBQUMsSUFBSTt3QkFDTixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsVUFBVTtZQUNSLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO1FBQzNCLENBQUM7UUFDRCxrQkFBa0I7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhO2dCQUNyQixDQUFDLElBQUksQ0FBQyxhQUFhO2dCQUNuQixPQUFNO1lBRVIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQ3ZCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUNsQyxFQUFFO2dCQUNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTthQUNqQjtRQUNILENBQUM7UUFDRCxPQUFPLENBQUUsSUFBSTtZQUNYLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzlELENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19hdXRvY29tcGxldGVzLnN0eWwnXHJcblxyXG4vLyBFeHRlbnNpb25zXHJcbmltcG9ydCBWU2VsZWN0LCB7IGRlZmF1bHRNZW51UHJvcHMgYXMgVlNlbGVjdE1lbnVQcm9wcyB9IGZyb20gJy4uL1ZTZWxlY3QvVlNlbGVjdCdcclxuaW1wb3J0IFZUZXh0RmllbGQgZnJvbSAnLi4vVlRleHRGaWVsZC9WVGV4dEZpZWxkJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG5jb25zdCBkZWZhdWx0TWVudVByb3BzID0ge1xyXG4gIC4uLlZTZWxlY3RNZW51UHJvcHMsXHJcbiAgb2Zmc2V0WTogdHJ1ZSxcclxuICBvZmZzZXRPdmVyZmxvdzogdHJ1ZSxcclxuICB0cmFuc2l0aW9uOiBmYWxzZVxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWU2VsZWN0LmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtYXV0b2NvbXBsZXRlJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsbG93T3ZlcmZsb3c6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGJyb3dzZXJBdXRvY29tcGxldGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnb2ZmJ1xyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICB0eXBlOiBGdW5jdGlvbixcclxuICAgICAgZGVmYXVsdDogKGl0ZW0sIHF1ZXJ5VGV4dCwgaXRlbVRleHQpID0+IHtcclxuICAgICAgICByZXR1cm4gaXRlbVRleHQudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5VGV4dC50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+IC0xXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBoaWRlTm9EYXRhOiBCb29sZWFuLFxyXG4gICAgbm9GaWx0ZXI6IEJvb2xlYW4sXHJcbiAgICBzZWFyY2hJbnB1dDoge1xyXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICBtZW51UHJvcHM6IHtcclxuICAgICAgdHlwZTogVlNlbGVjdC5vcHRpb25zLnByb3BzLm1lbnVQcm9wcy50eXBlLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBkZWZhdWx0TWVudVByb3BzXHJcbiAgICB9LFxyXG4gICAgYXV0b1NlbGVjdEZpcnN0OiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogdm0gPT4gKHtcclxuICAgIGF0dHJzSW5wdXQ6IG51bGwsXHJcbiAgICBsYXp5U2VhcmNoOiB2bS5zZWFyY2hJbnB1dFxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBWU2VsZWN0Lm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLCB7XHJcbiAgICAgICAgJ3YtYXV0b2NvbXBsZXRlJzogdHJ1ZSxcclxuICAgICAgICAndi1hdXRvY29tcGxldGUtLWlzLXNlbGVjdGluZy1pbmRleCc6IHRoaXMuc2VsZWN0ZWRJbmRleCA+IC0xXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcmVkSXRlbXNcclxuICAgIH0sXHJcbiAgICBzZWxlY3RlZFZhbHVlcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubWFwKGl0ZW0gPT4gdGhpcy5nZXRWYWx1ZShpdGVtKSlcclxuICAgIH0sXHJcbiAgICBoYXNEaXNwbGF5ZWRJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhpZGVTZWxlY3RlZFxyXG4gICAgICAgID8gdGhpcy5maWx0ZXJlZEl0ZW1zLnNvbWUoaXRlbSA9PiAhdGhpcy5oYXNJdGVtKGl0ZW0pKVxyXG4gICAgICAgIDogdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFRoZSByYW5nZSBvZiB0aGUgY3VycmVudCBpbnB1dCB0ZXh0XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBjdXJyZW50UmFuZ2UgKCkge1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW0gPT0gbnVsbCkgcmV0dXJuIDBcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW0pLnRvU3RyaW5nKCkubGVuZ3RoXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyZWRJdGVtcyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc1NlYXJjaGluZyB8fCB0aGlzLm5vRmlsdGVyIHx8IHRoaXMuaW50ZXJuYWxTZWFyY2ggPT0gbnVsbCkgcmV0dXJuIHRoaXMuYWxsSXRlbXNcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmFsbEl0ZW1zLmZpbHRlcihpdGVtID0+IHRoaXMuZmlsdGVyKGl0ZW0sIHRoaXMuaW50ZXJuYWxTZWFyY2gudG9TdHJpbmcoKSwgdGhpcy5nZXRUZXh0KGl0ZW0pLnRvU3RyaW5nKCkpKVxyXG4gICAgfSxcclxuICAgIGludGVybmFsU2VhcmNoOiB7XHJcbiAgICAgIGdldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGF6eVNlYXJjaFxyXG4gICAgICB9LFxyXG4gICAgICBzZXQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMubGF6eVNlYXJjaCA9IHZhbFxyXG5cclxuICAgICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6c2VhcmNoSW5wdXQnLCB2YWwpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0FueVZhbHVlQWxsb3dlZCAoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSxcclxuICAgIGlzRGlydHkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2hJc0RpcnR5IHx8IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwXHJcbiAgICB9LFxyXG4gICAgaXNTZWFyY2hpbmcgKCkge1xyXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgcmV0dXJuIHRoaXMuc2VhcmNoSXNEaXJ0eVxyXG5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLnNlYXJjaElzRGlydHkgJiZcclxuICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoICE9PSB0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW0pXHJcbiAgICAgIClcclxuICAgIH0sXHJcbiAgICBtZW51Q2FuU2hvdyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc0ZvY3VzZWQpIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuaGFzRGlzcGxheWVkSXRlbXMgfHwgIXRoaXMuaGlkZU5vRGF0YVxyXG4gICAgfSxcclxuICAgICRfbWVudVByb3BzICgpIHtcclxuICAgICAgY29uc3QgcHJvcHMgPSBWU2VsZWN0Lm9wdGlvbnMuY29tcHV0ZWQuJF9tZW51UHJvcHMuY2FsbCh0aGlzKVxyXG4gICAgICBwcm9wcy5jb250ZW50Q2xhc3MgPSBgdi1hdXRvY29tcGxldGVfX2NvbnRlbnQgJHtwcm9wcy5jb250ZW50Q2xhc3MgfHwgJyd9YC50cmltKClcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5kZWZhdWx0TWVudVByb3BzLFxyXG4gICAgICAgIC4uLnByb3BzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZWFyY2hJc0RpcnR5ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTZWFyY2ggIT0gbnVsbCAmJlxyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxTZWFyY2ggIT09ICcnXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWRJdGVtICgpIHtcclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHJldHVybiBudWxsXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEl0ZW1zLmZpbmQoaSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVDb21wYXJhdG9yKHRoaXMuZ2V0VmFsdWUoaSksIHRoaXMuZ2V0VmFsdWUodGhpcy5pbnRlcm5hbFZhbHVlKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBsaXN0RGF0YSAoKSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSBWU2VsZWN0Lm9wdGlvbnMuY29tcHV0ZWQubGlzdERhdGEuY2FsbCh0aGlzKVxyXG5cclxuICAgICAgT2JqZWN0LmFzc2lnbihkYXRhLnByb3BzLCB7XHJcbiAgICAgICAgaXRlbXM6IHRoaXMudmlydHVhbGl6ZWRJdGVtcyxcclxuICAgICAgICBub0ZpbHRlcjogKFxyXG4gICAgICAgICAgdGhpcy5ub0ZpbHRlciB8fFxyXG4gICAgICAgICAgIXRoaXMuaXNTZWFyY2hpbmcgfHxcclxuICAgICAgICAgICF0aGlzLmZpbHRlcmVkSXRlbXMubGVuZ3RoXHJcbiAgICAgICAgKSxcclxuICAgICAgICBzZWFyY2hJbnB1dDogdGhpcy5pbnRlcm5hbFNlYXJjaFxyXG4gICAgICB9KVxyXG5cclxuICAgICAgcmV0dXJuIGRhdGFcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgZmlsdGVyZWRJdGVtcyAodmFsKSB7XHJcbiAgICAgIHRoaXMub25GaWx0ZXJlZEl0ZW1zQ2hhbmdlZCh2YWwpXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxWYWx1ZSAoKSB7XHJcbiAgICAgIHRoaXMuc2V0U2VhcmNoKClcclxuICAgIH0sXHJcbiAgICBpc0ZvY3VzZWQgKHZhbCkge1xyXG4gICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5pbnB1dCAmJlxyXG4gICAgICAgICAgdGhpcy4kcmVmcy5pbnB1dC5zZWxlY3QoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2VsZigpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc01lbnVBY3RpdmUgKHZhbCkge1xyXG4gICAgICBpZiAodmFsIHx8ICF0aGlzLmhhc1Nsb3QpIHJldHVyblxyXG5cclxuICAgICAgdGhpcy5sYXp5U2VhcmNoID0gbnVsbFxyXG4gICAgfSxcclxuICAgIGl0ZW1zICh2YWwsIG9sZFZhbCkge1xyXG4gICAgICAvLyBJZiB3ZSBhcmUgZm9jdXNlZCwgdGhlIG1lbnVcclxuICAgICAgLy8gaXMgbm90IGFjdGl2ZSwgaGlkZSBubyBkYXRhIGlzIGVuYWJsZWQsXHJcbiAgICAgIC8vIGFuZCBpdGVtcyBjaGFuZ2VcclxuICAgICAgLy8gVXNlciBpcyBwcm9iYWJseSBhc3luYyBsb2FkaW5nXHJcbiAgICAgIC8vIGl0ZW1zLCB0cnkgdG8gYWN0aXZhdGUgdGhlIG1lbnVcclxuICAgICAgaWYgKFxyXG4gICAgICAgICEob2xkVmFsICYmIG9sZFZhbC5sZW5ndGgpICYmXHJcbiAgICAgICAgdGhpcy5oaWRlTm9EYXRhICYmXHJcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWQgJiZcclxuICAgICAgICAhdGhpcy5pc01lbnVBY3RpdmUgJiZcclxuICAgICAgICB2YWwubGVuZ3RoXHJcbiAgICAgICkgdGhpcy5hY3RpdmF0ZU1lbnUoKVxyXG4gICAgfSxcclxuICAgIHNlYXJjaElucHV0ICh2YWwpIHtcclxuICAgICAgdGhpcy5sYXp5U2VhcmNoID0gdmFsXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxTZWFyY2ggKHZhbCkge1xyXG4gICAgICB0aGlzLm9uSW50ZXJuYWxTZWFyY2hDaGFuZ2VkKHZhbClcclxuICAgIH0sXHJcbiAgICBpdGVtVGV4dCAoKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlU2VsZigpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlZCAoKSB7XHJcbiAgICB0aGlzLnNldFNlYXJjaCgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgb25GaWx0ZXJlZEl0ZW1zQ2hhbmdlZCAodmFsKSB7XHJcbiAgICAgIHRoaXMuc2V0TWVudUluZGV4KC0xKVxyXG5cclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0TWVudUluZGV4KHZhbC5sZW5ndGggPiAwICYmICh2YWwubGVuZ3RoID09PSAxIHx8IHRoaXMuYXV0b1NlbGVjdEZpcnN0KSA/IDAgOiAtMSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBvbkludGVybmFsU2VhcmNoQ2hhbmdlZCAodmFsKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlTWVudURpbWVuc2lvbnMoKVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZU1lbnVEaW1lbnNpb25zICgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlICYmXHJcbiAgICAgICAgdGhpcy4kcmVmcy5tZW51XHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuJHJlZnMubWVudS51cGRhdGVEaW1lbnNpb25zKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNoYW5nZVNlbGVjdGVkSW5kZXggKGtleUNvZGUpIHtcclxuICAgICAgLy8gRG8gbm90IGFsbG93IGNoYW5naW5nIG9mIHNlbGVjdGVkSW5kZXhcclxuICAgICAgLy8gd2hlbiBzZWFyY2ggaXMgZGlydHlcclxuICAgICAgaWYgKHRoaXMuc2VhcmNoSXNEaXJ0eSkgcmV0dXJuXHJcblxyXG4gICAgICBpZiAoIVtcclxuICAgICAgICBrZXlDb2Rlcy5iYWNrc3BhY2UsXHJcbiAgICAgICAga2V5Q29kZXMubGVmdCxcclxuICAgICAgICBrZXlDb2Rlcy5yaWdodCxcclxuICAgICAgICBrZXlDb2Rlcy5kZWxldGVcclxuICAgICAgXS5pbmNsdWRlcyhrZXlDb2RlKSkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBpbmRleGVzID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCAtIDFcclxuXHJcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5sZWZ0KSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gdGhpcy5zZWxlY3RlZEluZGV4ID09PSAtMVxyXG4gICAgICAgICAgPyBpbmRleGVzXHJcbiAgICAgICAgICA6IHRoaXMuc2VsZWN0ZWRJbmRleCAtIDFcclxuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5yaWdodCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCA+PSBpbmRleGVzXHJcbiAgICAgICAgICA/IC0xXHJcbiAgICAgICAgICA6IHRoaXMuc2VsZWN0ZWRJbmRleCArIDFcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkSW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXhlc1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtc1t0aGlzLnNlbGVjdGVkSW5kZXhdXHJcblxyXG4gICAgICBpZiAoW1xyXG4gICAgICAgIGtleUNvZGVzLmJhY2tzcGFjZSxcclxuICAgICAgICBrZXlDb2Rlcy5kZWxldGVcclxuICAgICAgXS5pbmNsdWRlcyhrZXlDb2RlKSAmJlxyXG4gICAgICAgICF0aGlzLmdldERpc2FibGVkKGN1cnJlbnRJdGVtKVxyXG4gICAgICApIHtcclxuICAgICAgICBjb25zdCBuZXdJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gaW5kZXhlc1xyXG4gICAgICAgICAgPyB0aGlzLnNlbGVjdGVkSW5kZXggLSAxXHJcbiAgICAgICAgICA6IHRoaXMuc2VsZWN0ZWRJdGVtc1t0aGlzLnNlbGVjdGVkSW5kZXggKyAxXVxyXG4gICAgICAgICAgICA/IHRoaXMuc2VsZWN0ZWRJbmRleFxyXG4gICAgICAgICAgICA6IC0xXHJcblxyXG4gICAgICAgIGlmIChuZXdJbmRleCA9PT0gLTEpIHtcclxuICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5tdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oY3VycmVudEl0ZW0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBuZXdJbmRleFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY2xlYXJhYmxlQ2FsbGJhY2sgKCkge1xyXG4gICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gdW5kZWZpbmVkXHJcblxyXG4gICAgICBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5jbGVhcmFibGVDYWxsYmFjay5jYWxsKHRoaXMpXHJcbiAgICB9LFxyXG4gICAgZ2VuSW5wdXQgKCkge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLmdlbklucHV0LmNhbGwodGhpcylcclxuXHJcbiAgICAgIGlucHV0LmRhdGEuYXR0cnMucm9sZSA9ICdjb21ib2JveCdcclxuICAgICAgaW5wdXQuZGF0YS5kb21Qcm9wcy52YWx1ZSA9IHRoaXMuaW50ZXJuYWxTZWFyY2hcclxuXHJcbiAgICAgIHJldHVybiBpbnB1dFxyXG4gICAgfSxcclxuICAgIGdlblNlbGVjdGlvbnMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNTbG90IHx8IHRoaXMubXVsdGlwbGVcclxuICAgICAgICA/IFZTZWxlY3Qub3B0aW9ucy5tZXRob2RzLmdlblNlbGVjdGlvbnMuY2FsbCh0aGlzKVxyXG4gICAgICAgIDogW11cclxuICAgIH0sXHJcbiAgICBvbkNsaWNrICgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPiAtMVxyXG4gICAgICAgID8gKHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xKVxyXG4gICAgICAgIDogdGhpcy5vbkZvY3VzKClcclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGVNZW51KClcclxuICAgIH0sXHJcbiAgICBvbkVudGVyRG93biAoKSB7XHJcbiAgICAgIC8vIEF2b2lkIGludm9raW5nIHRoaXMgbWV0aG9kXHJcbiAgICAgIC8vIHdpbGwgY2F1c2UgdXBkYXRlU2VsZiB0b1xyXG4gICAgICAvLyBiZSBjYWxsZWQgZW1wdHlpbmcgc2VhcmNoXHJcbiAgICB9LFxyXG4gICAgb25JbnB1dCAoZSkge1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4ID4gLTEpIHJldHVyblxyXG5cclxuICAgICAgLy8gSWYgdHlwaW5nIGFuZCBtZW51IGlzIG5vdCBjdXJyZW50bHkgYWN0aXZlXHJcbiAgICAgIGlmIChlLnRhcmdldC52YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZhdGVNZW51KClcclxuICAgICAgICBpZiAoIXRoaXMuaXNBbnlWYWx1ZUFsbG93ZWQpIHRoaXMuc2V0TWVudUluZGV4KDApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubWFzayAmJiB0aGlzLnJlc2V0U2VsZWN0aW9ucyhlLnRhcmdldClcclxuICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCA9IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgIHRoaXMuYmFkSW5wdXQgPSBlLnRhcmdldC52YWxpZGl0eSAmJiBlLnRhcmdldC52YWxpZGl0eS5iYWRJbnB1dFxyXG4gICAgfSxcclxuICAgIG9uS2V5RG93biAoZSkge1xyXG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXHJcblxyXG4gICAgICBWU2VsZWN0Lm9wdGlvbnMubWV0aG9kcy5vbktleURvd24uY2FsbCh0aGlzLCBlKVxyXG5cclxuICAgICAgLy8gVGhlIG9yZGVyaW5nIGlzIGltcG9ydGFudCBoZXJlXHJcbiAgICAgIC8vIGFsbG93cyBuZXcgdmFsdWUgdG8gYmUgdXBkYXRlZFxyXG4gICAgICAvLyBhbmQgdGhlbiBtb3ZlcyB0aGUgaW5kZXggdG8gdGhlXHJcbiAgICAgIC8vIHByb3BlciBsb2NhdGlvblxyXG4gICAgICB0aGlzLmNoYW5nZVNlbGVjdGVkSW5kZXgoa2V5Q29kZSlcclxuICAgIH0sXHJcbiAgICBvblRhYkRvd24gKGUpIHtcclxuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMub25UYWJEb3duLmNhbGwodGhpcywgZSlcclxuICAgICAgdGhpcy51cGRhdGVTZWxmKClcclxuICAgIH0sXHJcbiAgICBzZXRTZWxlY3RlZEl0ZW1zICgpIHtcclxuICAgICAgVlNlbGVjdC5vcHRpb25zLm1ldGhvZHMuc2V0U2VsZWN0ZWRJdGVtcy5jYWxsKHRoaXMpXHJcblxyXG4gICAgICAvLyAjNDI3MyBEb24ndCByZXBsYWNlIGlmIHNlYXJjaGluZ1xyXG4gICAgICAvLyAjNDQwMyBEb24ndCByZXBsYWNlIGlmIGZvY3VzZWRcclxuICAgICAgaWYgKCF0aGlzLmlzRm9jdXNlZCkgdGhpcy5zZXRTZWFyY2goKVxyXG4gICAgfSxcclxuICAgIHNldFNlYXJjaCAoKSB7XHJcbiAgICAgIC8vIFdhaXQgZm9yIG5leHRUaWNrIHNvIHNlbGVjdGVkSXRlbVxyXG4gICAgICAvLyBoYXMgaGFkIHRpbWUgdG8gdXBkYXRlXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICB0aGlzLmludGVybmFsU2VhcmNoID0gKFxyXG4gICAgICAgICAgdGhpcy5tdWx0aXBsZSAmJlxyXG4gICAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCAmJlxyXG4gICAgICAgICAgdGhpcy5pc01lbnVBY3RpdmVcclxuICAgICAgICApXHJcbiAgICAgICAgICA/IHRoaXMuaW50ZXJuYWxTZWFyY2hcclxuICAgICAgICAgIDogKFxyXG4gICAgICAgICAgICAhdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCB8fFxyXG4gICAgICAgICAgICB0aGlzLm11bHRpcGxlIHx8XHJcbiAgICAgICAgICAgIHRoaXMuaGFzU2xvdFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgICA/IG51bGxcclxuICAgICAgICAgICAgOiB0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW0pXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlU2VsZiAoKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQXV0b2NvbXBsZXRlKClcclxuICAgIH0sXHJcbiAgICB1cGRhdGVBdXRvY29tcGxldGUgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuc2VhcmNoSXNEaXJ0eSAmJlxyXG4gICAgICAgICF0aGlzLmludGVybmFsVmFsdWVcclxuICAgICAgKSByZXR1cm5cclxuXHJcbiAgICAgIGlmICghdGhpcy52YWx1ZUNvbXBhcmF0b3IoXHJcbiAgICAgICAgdGhpcy5pbnRlcm5hbFNlYXJjaCxcclxuICAgICAgICB0aGlzLmdldFZhbHVlKHRoaXMuaW50ZXJuYWxWYWx1ZSlcclxuICAgICAgKSkge1xyXG4gICAgICAgIHRoaXMuc2V0U2VhcmNoKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhc0l0ZW0gKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRWYWx1ZXMuaW5kZXhPZih0aGlzLmdldFZhbHVlKGl0ZW0pKSA+IC0xXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=