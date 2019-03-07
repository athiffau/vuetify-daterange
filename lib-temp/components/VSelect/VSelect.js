// Styles
import '../../stylus/components/_text-fields.styl';
import '../../stylus/components/_select.styl';
// Components
import VChip from '../VChip';
import VMenu from '../VMenu';
import VSelectList from './VSelectList';
// Extensions
import VTextField from '../VTextField/VTextField';
// Mixins
import Comparable from '../../mixins/comparable';
import Filterable from '../../mixins/filterable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import { camelize, getPropertyFromItem, keyCodes } from '../../util/helpers';
import { consoleError, consoleWarn } from '../../util/console';
export const defaultMenuProps = {
    closeOnClick: false,
    closeOnContentClick: false,
    openOnClick: false,
    maxHeight: 300
};
/* @vue/component */
export default VTextField.extend({
    name: 'v-select',
    directives: {
        ClickOutside
    },
    mixins: [
        Comparable,
        Filterable
    ],
    props: {
        appendIcon: {
            type: String,
            default: '$vuetify.icons.dropdown'
        },
        appendIconCb: Function,
        attach: {
            type: null,
            default: false
        },
        browserAutocomplete: {
            type: String,
            default: 'on'
        },
        cacheItems: Boolean,
        chips: Boolean,
        clearable: Boolean,
        deletableChips: Boolean,
        dense: Boolean,
        hideSelected: Boolean,
        items: {
            type: Array,
            default: () => []
        },
        itemAvatar: {
            type: [String, Array, Function],
            default: 'avatar'
        },
        itemDisabled: {
            type: [String, Array, Function],
            default: 'disabled'
        },
        itemText: {
            type: [String, Array, Function],
            default: 'text'
        },
        itemValue: {
            type: [String, Array, Function],
            default: 'value'
        },
        menuProps: {
            type: [String, Array, Object],
            default: () => defaultMenuProps
        },
        multiple: Boolean,
        openOnClear: Boolean,
        returnObject: Boolean,
        searchInput: {
            default: null
        },
        smallChips: Boolean
    },
    data: vm => ({
        attrsInput: { role: 'combobox' },
        cachedItems: vm.cacheItems ? vm.items : [],
        content: null,
        isBooted: false,
        isMenuActive: false,
        lastItem: 20,
        // As long as a value is defined, show it
        // Otherwise, check if multiple
        // to determine which default to provide
        lazyValue: vm.value !== undefined
            ? vm.value
            : vm.multiple ? [] : undefined,
        selectedIndex: -1,
        selectedItems: [],
        keyboardLookupPrefix: '',
        keyboardLookupLastTime: 0
    }),
    computed: {
        /* All items that the select has */
        allItems() {
            return this.filterDuplicates(this.cachedItems.concat(this.items));
        },
        classes() {
            return Object.assign({}, VTextField.options.computed.classes.call(this), {
                'v-select': true,
                'v-select--chips': this.hasChips,
                'v-select--chips--small': this.smallChips,
                'v-select--is-menu-active': this.isMenuActive
            });
        },
        /* Used by other components to overwrite */
        computedItems() {
            return this.allItems;
        },
        counterValue() {
            return this.multiple
                ? this.selectedItems.length
                : (this.getText(this.selectedItems[0]) || '').toString().length;
        },
        directives() {
            return this.isFocused ? [{
                    name: 'click-outside',
                    value: this.blur,
                    args: {
                        closeConditional: this.closeConditional
                    }
                }] : undefined;
        },
        dynamicHeight() {
            return 'auto';
        },
        hasChips() {
            return this.chips || this.smallChips;
        },
        hasSlot() {
            return Boolean(this.hasChips || this.$scopedSlots.selection);
        },
        isDirty() {
            return this.selectedItems.length > 0;
        },
        listData() {
            const scopeId = this.$vnode && this.$vnode.context.$options._scopeId;
            return {
                attrs: scopeId ? {
                    [scopeId]: true
                } : null,
                props: {
                    action: this.multiple && !this.isHidingSelected,
                    color: this.color,
                    dense: this.dense,
                    hideSelected: this.hideSelected,
                    items: this.virtualizedItems,
                    noDataText: this.$vuetify.t(this.noDataText),
                    selectedItems: this.selectedItems,
                    itemAvatar: this.itemAvatar,
                    itemDisabled: this.itemDisabled,
                    itemValue: this.itemValue,
                    itemText: this.itemText
                },
                on: {
                    select: this.selectItem
                },
                scopedSlots: {
                    item: this.$scopedSlots.item
                }
            };
        },
        staticList() {
            if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
                consoleError('assert: staticList should not be called if slots are used');
            }
            return this.$createElement(VSelectList, this.listData);
        },
        virtualizedItems() {
            return this.$_menuProps.auto
                ? this.computedItems
                : this.computedItems.slice(0, this.lastItem);
        },
        menuCanShow() { return true; },
        $_menuProps() {
            let normalisedProps;
            normalisedProps = typeof this.menuProps === 'string'
                ? this.menuProps.split(',')
                : this.menuProps;
            if (Array.isArray(normalisedProps)) {
                normalisedProps = normalisedProps.reduce((acc, p) => {
                    acc[p.trim()] = true;
                    return acc;
                }, {});
            }
            return {
                ...defaultMenuProps,
                value: this.menuCanShow && this.isMenuActive,
                nudgeBottom: this.nudgeBottom
                    ? this.nudgeBottom
                    : normalisedProps.offsetY ? 1 : 0,
                ...normalisedProps
            };
        }
    },
    watch: {
        internalValue(val) {
            this.initialValue = val;
            this.setSelectedItems();
        },
        isBooted() {
            this.$nextTick(() => {
                if (this.content && this.content.addEventListener) {
                    this.content.addEventListener('scroll', this.onScroll, false);
                }
            });
        },
        isMenuActive(val) {
            if (!val)
                return;
            this.isBooted = true;
        },
        items: {
            immediate: true,
            handler(val) {
                if (this.cacheItems) {
                    this.cachedItems = this.filterDuplicates(this.cachedItems.concat(val));
                }
                this.setSelectedItems();
            }
        }
    },
    mounted() {
        this.content = this.$refs.menu && this.$refs.menu.$refs.content;
    },
    methods: {
        /** @public */
        blur(e) {
            this.isMenuActive = false;
            this.isFocused = false;
            this.$refs.input && this.$refs.input.blur();
            this.selectedIndex = -1;
            this.onBlur(e);
        },
        /** @public */
        activateMenu() {
            this.isMenuActive = true;
        },
        clearableCallback() {
            this.setValue(this.multiple ? [] : undefined);
            this.$nextTick(() => this.$refs.input.focus());
            if (this.openOnClear)
                this.isMenuActive = true;
        },
        closeConditional(e) {
            return (
            // Click originates from outside the menu content
            !!this.content &&
                !this.content.contains(e.target) &&
                // Click originates from outside the element
                !!this.$el &&
                !this.$el.contains(e.target) &&
                e.target !== this.$el);
        },
        filterDuplicates(arr) {
            const uniqueValues = new Map();
            for (let index = 0; index < arr.length; ++index) {
                const item = arr[index];
                const val = this.getValue(item);
                // TODO: comparator
                !uniqueValues.has(val) && uniqueValues.set(val, item);
            }
            return Array.from(uniqueValues.values());
        },
        findExistingIndex(item) {
            const itemValue = this.getValue(item);
            return (this.internalValue || []).findIndex(i => this.valueComparator(this.getValue(i), itemValue));
        },
        genChipSelection(item, index) {
            const isDisabled = (this.disabled ||
                this.readonly ||
                this.getDisabled(item));
            return this.$createElement(VChip, {
                staticClass: 'v-chip--select-multi',
                attrs: { tabindex: -1 },
                props: {
                    close: this.deletableChips && !isDisabled,
                    disabled: isDisabled,
                    selected: index === this.selectedIndex,
                    small: this.smallChips
                },
                on: {
                    click: e => {
                        if (isDisabled)
                            return;
                        e.stopPropagation();
                        this.selectedIndex = index;
                    },
                    input: () => this.onChipInput(item)
                },
                key: this.getValue(item)
            }, this.getText(item));
        },
        genCommaSelection(item, index, last) {
            // Item may be an object
            // TODO: Remove JSON.stringify
            const key = JSON.stringify(this.getValue(item));
            const color = index === this.selectedIndex && this.color;
            const isDisabled = (this.disabled ||
                this.getDisabled(item));
            return this.$createElement('div', this.setTextColor(color, {
                staticClass: 'v-select__selection v-select__selection--comma',
                'class': {
                    'v-select__selection--disabled': isDisabled
                },
                key
            }), `${this.getText(item)}${last ? '' : ', '}`);
        },
        genDefaultSlot() {
            const selections = this.genSelections();
            const input = this.genInput();
            // If the return is an empty array
            // push the input
            if (Array.isArray(selections)) {
                selections.push(input);
                // Otherwise push it into children
            }
            else {
                selections.children = selections.children || [];
                selections.children.push(input);
            }
            return [
                this.$createElement('div', {
                    staticClass: 'v-select__slot',
                    directives: this.directives
                }, [
                    this.genLabel(),
                    this.prefix ? this.genAffix('prefix') : null,
                    selections,
                    this.suffix ? this.genAffix('suffix') : null,
                    this.genClearIcon(),
                    this.genIconSlot()
                ]),
                this.genMenu(),
                this.genProgress()
            ];
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            input.data.domProps.value = null;
            input.data.attrs.readonly = true;
            input.data.attrs['aria-readonly'] = String(this.readonly);
            input.data.on.keypress = this.onKeyPress;
            return input;
        },
        genList() {
            // If there's no slots, we can use a cached VNode to improve performance
            if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
                return this.genListWithSlot();
            }
            else {
                return this.staticList;
            }
        },
        genListWithSlot() {
            const slots = ['prepend-item', 'no-data', 'append-item']
                .filter(slotName => this.$slots[slotName])
                .map(slotName => this.$createElement('template', {
                slot: slotName
            }, this.$slots[slotName]));
            // Requires destructuring due to Vue
            // modifying the `on` property when passed
            // as a referenced object
            return this.$createElement(VSelectList, {
                ...this.listData
            }, slots);
        },
        genMenu() {
            const props = this.$_menuProps;
            props.activator = this.$refs['input-slot'];
            // Deprecate using menu props directly
            // TODO: remove (2.0)
            const inheritedProps = Object.keys(VMenu.options.props);
            const deprecatedProps = Object.keys(this.$attrs).reduce((acc, attr) => {
                if (inheritedProps.includes(camelize(attr)))
                    acc.push(attr);
                return acc;
            }, []);
            for (const prop of deprecatedProps) {
                props[camelize(prop)] = this.$attrs[prop];
            }
            if (process.env.NODE_ENV !== 'production') {
                if (deprecatedProps.length) {
                    const multiple = deprecatedProps.length > 1;
                    let replacement = deprecatedProps.reduce((acc, p) => {
                        acc[camelize(p)] = this.$attrs[p];
                        return acc;
                    }, {});
                    const props = deprecatedProps.map(p => `'${p}'`).join(', ');
                    const separator = multiple ? '\n' : '\'';
                    const onlyBools = Object.keys(replacement).every(prop => {
                        const propType = VMenu.options.props[prop];
                        const value = replacement[prop];
                        return value === true || ((propType.type || propType) === Boolean && value === '');
                    });
                    if (onlyBools) {
                        replacement = Object.keys(replacement).join(', ');
                    }
                    else {
                        replacement = JSON.stringify(replacement, null, multiple ? 2 : 0)
                            .replace(/"([^(")"]+)":/g, '$1:')
                            .replace(/"/g, '\'');
                    }
                    consoleWarn(`${props} ${multiple ? 'are' : 'is'} deprecated, use ` +
                        `${separator}${onlyBools ? '' : ':'}menu-props="${replacement}"${separator} instead`, this);
                }
            }
            // Attach to root el so that
            // menu covers prepend/append icons
            if (
            // TODO: make this a computed property or helper or something
            this.attach === '' || // If used as a boolean prop (<v-menu attach>)
                this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
                this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
            ) {
                props.attach = this.$el;
            }
            else {
                props.attach = this.attach;
            }
            return this.$createElement(VMenu, {
                props,
                on: {
                    input: val => {
                        this.isMenuActive = val;
                        this.isFocused = val;
                    }
                },
                ref: 'menu'
            }, [this.genList()]);
        },
        genSelections() {
            let length = this.selectedItems.length;
            const children = new Array(length);
            let genSelection;
            if (this.$scopedSlots.selection) {
                genSelection = this.genSlotSelection;
            }
            else if (this.hasChips) {
                genSelection = this.genChipSelection;
            }
            else {
                genSelection = this.genCommaSelection;
            }
            while (length--) {
                children[length] = genSelection(this.selectedItems[length], length, length === children.length - 1);
            }
            return this.$createElement('div', {
                staticClass: 'v-select__selections'
            }, children);
        },
        genSlotSelection(item, index) {
            return this.$scopedSlots.selection({
                parent: this,
                item,
                index,
                selected: index === this.selectedIndex,
                disabled: this.disabled || this.readonly
            });
        },
        getMenuIndex() {
            return this.$refs.menu ? this.$refs.menu.listIndex : -1;
        },
        getDisabled(item) {
            return getPropertyFromItem(item, this.itemDisabled, false);
        },
        getText(item) {
            return getPropertyFromItem(item, this.itemText, item);
        },
        getValue(item) {
            return getPropertyFromItem(item, this.itemValue, this.getText(item));
        },
        onBlur(e) {
            this.$emit('blur', e);
        },
        onChipInput(item) {
            if (this.multiple)
                this.selectItem(item);
            else
                this.setValue(null);
            // If all items have been deleted,
            // open `v-menu`
            if (this.selectedItems.length === 0) {
                this.isMenuActive = true;
            }
            this.selectedIndex = -1;
        },
        onClick() {
            if (this.isDisabled)
                return;
            this.isMenuActive = true;
            if (!this.isFocused) {
                this.isFocused = true;
                this.$emit('focus');
            }
        },
        onEnterDown() {
            this.onBlur();
        },
        onEscDown(e) {
            e.preventDefault();
            if (this.isMenuActive) {
                e.stopPropagation();
                this.isMenuActive = false;
            }
        },
        onKeyPress(e) {
            if (this.multiple)
                return;
            const KEYBOARD_LOOKUP_THRESHOLD = 1000; // milliseconds
            const now = performance.now();
            if (now - this.keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
                this.keyboardLookupPrefix = '';
            }
            this.keyboardLookupPrefix += e.key.toLowerCase();
            this.keyboardLookupLastTime = now;
            const item = this.allItems.find(item => this.getText(item).toLowerCase().startsWith(this.keyboardLookupPrefix));
            if (item !== undefined) {
                this.setValue(this.returnObject ? item : this.getValue(item));
            }
        },
        onKeyDown(e) {
            const keyCode = e.keyCode;
            // If enter, space, up, or down is pressed, open menu
            if (!this.readonly && !this.isMenuActive && [
                keyCodes.enter,
                keyCodes.space,
                keyCodes.up, keyCodes.down
            ].includes(keyCode))
                this.activateMenu();
            if (this.isMenuActive && this.$refs.menu)
                this.$refs.menu.changeListIndex(e);
            // This should do something different
            if (keyCode === keyCodes.enter)
                return this.onEnterDown(e);
            // If escape deactivate the menu
            if (keyCode === keyCodes.esc)
                return this.onEscDown(e);
            // If tab - select item or close menu
            if (keyCode === keyCodes.tab)
                return this.onTabDown(e);
        },
        onMouseUp(e) {
            if (this.hasMouseDown) {
                const appendInner = this.$refs['append-inner'];
                // If append inner is present
                // and the target is itself
                // or inside, toggle menu
                if (this.isMenuActive &&
                    appendInner &&
                    (appendInner === e.target ||
                        appendInner.contains(e.target))) {
                    this.$nextTick(() => (this.isMenuActive = !this.isMenuActive));
                    // If user is clicking in the container
                    // and field is enclosed, activate it
                }
                else if (this.isEnclosed && !this.isDisabled) {
                    this.isMenuActive = true;
                }
            }
            VTextField.options.methods.onMouseUp.call(this, e);
        },
        onScroll() {
            if (!this.isMenuActive) {
                requestAnimationFrame(() => (this.content.scrollTop = 0));
            }
            else {
                if (this.lastItem >= this.computedItems.length)
                    return;
                const showMoreItems = (this.content.scrollHeight -
                    (this.content.scrollTop +
                        this.content.clientHeight)) < 200;
                if (showMoreItems) {
                    this.lastItem += 20;
                }
            }
        },
        onTabDown(e) {
            const menuIndex = this.getMenuIndex();
            const listTile = this.$refs.menu.tiles[menuIndex];
            // An item that is selected by
            // menu-index should toggled
            if (listTile &&
                listTile.className.indexOf('v-list__tile--highlighted') > -1 &&
                this.isMenuActive &&
                menuIndex > -1) {
                e.preventDefault();
                e.stopPropagation();
                listTile.click();
            }
            else {
                // If we make it here,
                // the user has no selected indexes
                // and is probably tabbing out
                this.blur(e);
            }
        },
        selectItem(item) {
            if (!this.multiple) {
                this.setValue(this.returnObject ? item : this.getValue(item));
                this.isMenuActive = false;
            }
            else {
                const internalValue = (this.internalValue || []).slice();
                const i = this.findExistingIndex(item);
                i !== -1 ? internalValue.splice(i, 1) : internalValue.push(item);
                this.setValue(internalValue.map(i => {
                    return this.returnObject ? i : this.getValue(i);
                }));
                // When selecting multiple
                // adjust menu after each
                // selection
                this.$nextTick(() => {
                    this.$refs.menu &&
                        this.$refs.menu.updateDimensions();
                });
            }
        },
        setMenuIndex(index) {
            this.$refs.menu && (this.$refs.menu.listIndex = index);
        },
        setSelectedItems() {
            const selectedItems = [];
            const values = !this.multiple || !Array.isArray(this.internalValue)
                ? [this.internalValue]
                : this.internalValue;
            for (const value of values) {
                const index = this.allItems.findIndex(v => this.valueComparator(this.getValue(v), this.getValue(value)));
                if (index > -1) {
                    selectedItems.push(this.allItems[index]);
                }
            }
            this.selectedItems = selectedItems;
        },
        setValue(value) {
            const oldValue = this.internalValue;
            this.internalValue = value;
            value !== oldValue && this.$emit('change', value);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTZWxlY3QvVlNlbGVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQUNsRCxPQUFPLHNDQUFzQyxDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQTtBQUV2QyxhQUFhO0FBQ2IsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFFakQsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBRWhELGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUV6RCxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTlELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLFlBQVksRUFBRSxLQUFLO0lBQ25CLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsU0FBUyxFQUFFLEdBQUc7Q0FDZixDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUU7UUFDVixZQUFZO0tBQ2I7SUFFRCxNQUFNLEVBQUU7UUFDTixVQUFVO1FBQ1YsVUFBVTtLQUNYO0lBRUQsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFP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YUFBYSxDQUFDO2dCQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUV0QixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNyQixDQUFDLENBQUE7Z0JBRUYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ2QsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7aUJBQ3pDO2FBQ0Y7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQTtRQUNwQyxDQUFDO1FBQ0QsUUFBUSxDQUFFLEtBQUs7WUFDYixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFBO1lBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFBO1lBQzFCLEtBQUssS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDbkQsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3RleHQtZmllbGRzLnN0eWwnXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3NlbGVjdC5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkNoaXAgZnJvbSAnLi4vVkNoaXAnXHJcbmltcG9ydCBWTWVudSBmcm9tICcuLi9WTWVudSdcclxuaW1wb3J0IFZTZWxlY3RMaXN0IGZyb20gJy4vVlNlbGVjdExpc3QnXHJcblxyXG4vLyBFeHRlbnNpb25zXHJcbmltcG9ydCBWVGV4dEZpZWxkIGZyb20gJy4uL1ZUZXh0RmllbGQvVlRleHRGaWVsZCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29tcGFyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29tcGFyYWJsZSdcclxuaW1wb3J0IEZpbHRlcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2ZpbHRlcmFibGUnXHJcblxyXG4vLyBEaXJlY3RpdmVzXHJcbmltcG9ydCBDbGlja091dHNpZGUgZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9jbGljay1vdXRzaWRlJ1xyXG5cclxuLy8gSGVscGVyc1xyXG5pbXBvcnQgeyBjYW1lbGl6ZSwgZ2V0UHJvcGVydHlGcm9tSXRlbSwga2V5Q29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcbmltcG9ydCB7IGNvbnNvbGVFcnJvciwgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcblxyXG5leHBvcnQgY29uc3QgZGVmYXVsdE1lbnVQcm9wcyA9IHtcclxuICBjbG9zZU9uQ2xpY2s6IGZhbHNlLFxyXG4gIGNsb3NlT25Db250ZW50Q2xpY2s6IGZhbHNlLFxyXG4gIG9wZW5PbkNsaWNrOiBmYWxzZSxcclxuICBtYXhIZWlnaHQ6IDMwMFxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWVGV4dEZpZWxkLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3Ytc2VsZWN0JyxcclxuXHJcbiAgZGlyZWN0aXZlczoge1xyXG4gICAgQ2xpY2tPdXRzaWRlXHJcbiAgfSxcclxuXHJcbiAgbWl4aW5zOiBbXHJcbiAgICBDb21wYXJhYmxlLFxyXG4gICAgRmlsdGVyYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhcHBlbmRJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmRyb3Bkb3duJ1xyXG4gICAgfSxcclxuICAgIGFwcGVuZEljb25DYjogRnVuY3Rpb24sXHJcbiAgICBhdHRhY2g6IHtcclxuICAgICAgdHlwZTogbnVsbCxcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBicm93c2VyQXV0b2NvbXBsZXRlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ29uJ1xyXG4gICAgfSxcclxuICAgIGNhY2hlSXRlbXM6IEJvb2xlYW4sXHJcbiAgICBjaGlwczogQm9vbGVhbixcclxuICAgIGNsZWFyYWJsZTogQm9vbGVhbixcclxuICAgIGRlbGV0YWJsZUNoaXBzOiBCb29sZWFuLFxyXG4gICAgZGVuc2U6IEJvb2xlYW4sXHJcbiAgICBoaWRlU2VsZWN0ZWQ6IEJvb2xlYW4sXHJcbiAgICBpdGVtczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gW11cclxuICAgIH0sXHJcbiAgICBpdGVtQXZhdGFyOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBGdW5jdGlvbl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdhdmF0YXInXHJcbiAgICB9LFxyXG4gICAgaXRlbURpc2FibGVkOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBGdW5jdGlvbl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdkaXNhYmxlZCdcclxuICAgIH0sXHJcbiAgICBpdGVtVGV4dDoge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dLFxyXG4gICAgICBkZWZhdWx0OiAndGV4dCdcclxuICAgIH0sXHJcbiAgICBpdGVtVmFsdWU6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSxcclxuICAgICAgZGVmYXVsdDogJ3ZhbHVlJ1xyXG4gICAgfSxcclxuICAgIG1lbnVQcm9wczoge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgT2JqZWN0XSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gZGVmYXVsdE1lbnVQcm9wc1xyXG4gICAgfSxcclxuICAgIG11bHRpcGxlOiBCb29sZWFuLFxyXG4gICAgb3Blbk9uQ2xlYXI6IEJvb2xlYW4sXHJcbiAgICByZXR1cm5PYmplY3Q6IEJvb2xlYW4sXHJcbiAgICBzZWFyY2hJbnB1dDoge1xyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgc21hbGxDaGlwczogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGRhdGE6IHZtID0+ICh7XHJcbiAgICBhdHRyc0lucHV0OiB7IHJvbGU6ICdjb21ib2JveCcgfSxcclxuICAgIGNhY2hlZEl0ZW1zOiB2bS5jYWNoZUl0ZW1zID8gdm0uaXRlbXMgOiBbXSxcclxuICAgIGNvbnRlbnQ6IG51bGwsXHJcbiAgICBpc0Jvb3RlZDogZmFsc2UsXHJcbiAgICBpc01lbnVBY3RpdmU6IGZhbHNlLFxyXG4gICAgbGFzdEl0ZW06IDIwLFxyXG4gICAgLy8gQXMgbG9uZyBhcyBhIHZhbHVlIGlzIGRlZmluZWQsIHNob3cgaXRcclxuICAgIC8vIE90aGVyd2lzZSwgY2hlY2sgaWYgbXVsdGlwbGVcclxuICAgIC8vIHRvIGRldGVybWluZSB3aGljaCBkZWZhdWx0IHRvIHByb3ZpZGVcclxuICAgIGxhenlWYWx1ZTogdm0udmFsdWUgIT09IHVuZGVmaW5lZFxyXG4gICAgICA/IHZtLnZhbHVlXHJcbiAgICAgIDogdm0ubXVsdGlwbGUgPyBbXSA6IHVuZGVmaW5lZCxcclxuICAgIHNlbGVjdGVkSW5kZXg6IC0xLFxyXG4gICAgc2VsZWN0ZWRJdGVtczogW10sXHJcbiAgICBrZXlib2FyZExvb2t1cFByZWZpeDogJycsXHJcbiAgICBrZXlib2FyZExvb2t1cExhc3RUaW1lOiAwXHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAvKiBBbGwgaXRlbXMgdGhhdCB0aGUgc2VsZWN0IGhhcyAqL1xyXG4gICAgYWxsSXRlbXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJEdXBsaWNhdGVzKHRoaXMuY2FjaGVkSXRlbXMuY29uY2F0KHRoaXMuaXRlbXMpKVxyXG4gICAgfSxcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgVlRleHRGaWVsZC5vcHRpb25zLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSwge1xyXG4gICAgICAgICd2LXNlbGVjdCc6IHRydWUsXHJcbiAgICAgICAgJ3Ytc2VsZWN0LS1jaGlwcyc6IHRoaXMuaGFzQ2hpcHMsXHJcbiAgICAgICAgJ3Ytc2VsZWN0LS1jaGlwcy0tc21hbGwnOiB0aGlzLnNtYWxsQ2hpcHMsXHJcbiAgICAgICAgJ3Ytc2VsZWN0LS1pcy1tZW51LWFjdGl2ZSc6IHRoaXMuaXNNZW51QWN0aXZlXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgLyogVXNlZCBieSBvdGhlciBjb21wb25lbnRzIHRvIG92ZXJ3cml0ZSAqL1xyXG4gICAgY29tcHV0ZWRJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmFsbEl0ZW1zXHJcbiAgICB9LFxyXG4gICAgY291bnRlclZhbHVlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbGVcclxuICAgICAgICA/IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGhcclxuICAgICAgICA6ICh0aGlzLmdldFRleHQodGhpcy5zZWxlY3RlZEl0ZW1zWzBdKSB8fCAnJykudG9TdHJpbmcoKS5sZW5ndGhcclxuICAgIH0sXHJcbiAgICBkaXJlY3RpdmVzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNGb2N1c2VkID8gW3tcclxuICAgICAgICBuYW1lOiAnY2xpY2stb3V0c2lkZScsXHJcbiAgICAgICAgdmFsdWU6IHRoaXMuYmx1cixcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICBjbG9zZUNvbmRpdGlvbmFsOiB0aGlzLmNsb3NlQ29uZGl0aW9uYWxcclxuICAgICAgICB9XHJcbiAgICAgIH1dIDogdW5kZWZpbmVkXHJcbiAgICB9LFxyXG4gICAgZHluYW1pY0hlaWdodCAoKSB7XHJcbiAgICAgIHJldHVybiAnYXV0bydcclxuICAgIH0sXHJcbiAgICBoYXNDaGlwcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoaXBzIHx8IHRoaXMuc21hbGxDaGlwc1xyXG4gICAgfSxcclxuICAgIGhhc1Nsb3QgKCkge1xyXG4gICAgICByZXR1cm4gQm9vbGVhbih0aGlzLmhhc0NoaXBzIHx8IHRoaXMuJHNjb3BlZFNsb3RzLnNlbGVjdGlvbilcclxuICAgIH0sXHJcbiAgICBpc0RpcnR5ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwXHJcbiAgICB9LFxyXG4gICAgbGlzdERhdGEgKCkge1xyXG4gICAgICBjb25zdCBzY29wZUlkID0gdGhpcy4kdm5vZGUgJiYgdGhpcy4kdm5vZGUuY29udGV4dC4kb3B0aW9ucy5fc2NvcGVJZFxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGF0dHJzOiBzY29wZUlkID8ge1xyXG4gICAgICAgICAgW3Njb3BlSWRdOiB0cnVlXHJcbiAgICAgICAgfSA6IG51bGwsXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFjdGlvbjogdGhpcy5tdWx0aXBsZSAmJiAhdGhpcy5pc0hpZGluZ1NlbGVjdGVkLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBkZW5zZTogdGhpcy5kZW5zZSxcclxuICAgICAgICAgIGhpZGVTZWxlY3RlZDogdGhpcy5oaWRlU2VsZWN0ZWQsXHJcbiAgICAgICAgICBpdGVtczogdGhpcy52aXJ0dWFsaXplZEl0ZW1zLFxyXG4gICAgICAgICAgbm9EYXRhVGV4dDogdGhpcy4kdnVldGlmeS50KHRoaXMubm9EYXRhVGV4dCksXHJcbiAgICAgICAgICBzZWxlY3RlZEl0ZW1zOiB0aGlzLnNlbGVjdGVkSXRlbXMsXHJcbiAgICAgICAgICBpdGVtQXZhdGFyOiB0aGlzLml0ZW1BdmF0YXIsXHJcbiAgICAgICAgICBpdGVtRGlzYWJsZWQ6IHRoaXMuaXRlbURpc2FibGVkLFxyXG4gICAgICAgICAgaXRlbVZhbHVlOiB0aGlzLml0ZW1WYWx1ZSxcclxuICAgICAgICAgIGl0ZW1UZXh0OiB0aGlzLml0ZW1UZXh0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgc2VsZWN0OiB0aGlzLnNlbGVjdEl0ZW1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjb3BlZFNsb3RzOiB7XHJcbiAgICAgICAgICBpdGVtOiB0aGlzLiRzY29wZWRTbG90cy5pdGVtXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3RhdGljTGlzdCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLiRzbG90c1snbm8tZGF0YSddIHx8IHRoaXMuJHNsb3RzWydwcmVwZW5kLWl0ZW0nXSB8fCB0aGlzLiRzbG90c1snYXBwZW5kLWl0ZW0nXSkge1xyXG4gICAgICAgIGNvbnNvbGVFcnJvcignYXNzZXJ0OiBzdGF0aWNMaXN0IHNob3VsZCBub3QgYmUgY2FsbGVkIGlmIHNsb3RzIGFyZSB1c2VkJylcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlNlbGVjdExpc3QsIHRoaXMubGlzdERhdGEpXHJcbiAgICB9LFxyXG4gICAgdmlydHVhbGl6ZWRJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRfbWVudVByb3BzLmF1dG9cclxuICAgICAgICA/IHRoaXMuY29tcHV0ZWRJdGVtc1xyXG4gICAgICAgIDogdGhpcy5jb21wdXRlZEl0ZW1zLnNsaWNlKDAsIHRoaXMubGFzdEl0ZW0pXHJcbiAgICB9LFxyXG4gICAgbWVudUNhblNob3cgKCkgeyByZXR1cm4gdHJ1ZSB9LFxyXG4gICAgJF9tZW51UHJvcHMgKCkge1xyXG4gICAgICBsZXQgbm9ybWFsaXNlZFByb3BzXHJcblxyXG4gICAgICBub3JtYWxpc2VkUHJvcHMgPSB0eXBlb2YgdGhpcy5tZW51UHJvcHMgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgPyB0aGlzLm1lbnVQcm9wcy5zcGxpdCgnLCcpXHJcbiAgICAgICAgOiB0aGlzLm1lbnVQcm9wc1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobm9ybWFsaXNlZFByb3BzKSkge1xyXG4gICAgICAgIG5vcm1hbGlzZWRQcm9wcyA9IG5vcm1hbGlzZWRQcm9wcy5yZWR1Y2UoKGFjYywgcCkgPT4ge1xyXG4gICAgICAgICAgYWNjW3AudHJpbSgpXSA9IHRydWVcclxuICAgICAgICAgIHJldHVybiBhY2NcclxuICAgICAgICB9LCB7fSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAuLi5kZWZhdWx0TWVudVByb3BzLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLm1lbnVDYW5TaG93ICYmIHRoaXMuaXNNZW51QWN0aXZlLFxyXG4gICAgICAgIG51ZGdlQm90dG9tOiB0aGlzLm51ZGdlQm90dG9tXHJcbiAgICAgICAgICA/IHRoaXMubnVkZ2VCb3R0b21cclxuICAgICAgICAgIDogbm9ybWFsaXNlZFByb3BzLm9mZnNldFkgPyAxIDogMCwgLy8gY29udmVydCB0byBpbnRcclxuICAgICAgICAuLi5ub3JtYWxpc2VkUHJvcHNcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbnRlcm5hbFZhbHVlICh2YWwpIHtcclxuICAgICAgdGhpcy5pbml0aWFsVmFsdWUgPSB2YWxcclxuICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW1zKClcclxuICAgIH0sXHJcbiAgICBpc0Jvb3RlZCAoKSB7XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jb250ZW50ICYmIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5vblNjcm9sbCwgZmFsc2UpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGlzTWVudUFjdGl2ZSAodmFsKSB7XHJcbiAgICAgIGlmICghdmFsKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuaXNCb290ZWQgPSB0cnVlXHJcbiAgICB9LFxyXG4gICAgaXRlbXM6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZUl0ZW1zKSB7XHJcbiAgICAgICAgICB0aGlzLmNhY2hlZEl0ZW1zID0gdGhpcy5maWx0ZXJEdXBsaWNhdGVzKHRoaXMuY2FjaGVkSXRlbXMuY29uY2F0KHZhbCkpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbXMoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLiRyZWZzLm1lbnUgJiYgdGhpcy4kcmVmcy5tZW51LiRyZWZzLmNvbnRlbnRcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgYmx1ciAoZSkge1xyXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIHRoaXMuaXNGb2N1c2VkID0gZmFsc2VcclxuICAgICAgdGhpcy4kcmVmcy5pbnB1dCAmJiB0aGlzLiRyZWZzLmlucHV0LmJsdXIoKVxyXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxyXG4gICAgICB0aGlzLm9uQmx1cihlKVxyXG4gICAgfSxcclxuICAgIC8qKiBAcHVibGljICovXHJcbiAgICBhY3RpdmF0ZU1lbnUgKCkge1xyXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuICAgIH0sXHJcbiAgICBjbGVhcmFibGVDYWxsYmFjayAoKSB7XHJcbiAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5tdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkKVxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLiRyZWZzLmlucHV0LmZvY3VzKCkpXHJcblxyXG4gICAgICBpZiAodGhpcy5vcGVuT25DbGVhcikgdGhpcy5pc01lbnVBY3RpdmUgPSB0cnVlXHJcbiAgICB9LFxyXG4gICAgY2xvc2VDb25kaXRpb25hbCAoZSkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIC8vIENsaWNrIG9yaWdpbmF0ZXMgZnJvbSBvdXRzaWRlIHRoZSBtZW51IGNvbnRlbnRcclxuICAgICAgICAhIXRoaXMuY29udGVudCAmJlxyXG4gICAgICAgICF0aGlzLmNvbnRlbnQuY29udGFpbnMoZS50YXJnZXQpICYmXHJcblxyXG4gICAgICAgIC8vIENsaWNrIG9yaWdpbmF0ZXMgZnJvbSBvdXRzaWRlIHRoZSBlbGVtZW50XHJcbiAgICAgICAgISF0aGlzLiRlbCAmJlxyXG4gICAgICAgICF0aGlzLiRlbC5jb250YWlucyhlLnRhcmdldCkgJiZcclxuICAgICAgICBlLnRhcmdldCAhPT0gdGhpcy4kZWxcclxuICAgICAgKVxyXG4gICAgfSxcclxuICAgIGZpbHRlckR1cGxpY2F0ZXMgKGFycikge1xyXG4gICAgICBjb25zdCB1bmlxdWVWYWx1ZXMgPSBuZXcgTWFwKClcclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGFyci5sZW5ndGg7ICsraW5kZXgpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gYXJyW2luZGV4XVxyXG4gICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0VmFsdWUoaXRlbSlcclxuXHJcbiAgICAgICAgLy8gVE9ETzogY29tcGFyYXRvclxyXG4gICAgICAgICF1bmlxdWVWYWx1ZXMuaGFzKHZhbCkgJiYgdW5pcXVlVmFsdWVzLnNldCh2YWwsIGl0ZW0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIEFycmF5LmZyb20odW5pcXVlVmFsdWVzLnZhbHVlcygpKVxyXG4gICAgfSxcclxuICAgIGZpbmRFeGlzdGluZ0luZGV4IChpdGVtKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbSlcclxuXHJcbiAgICAgIHJldHVybiAodGhpcy5pbnRlcm5hbFZhbHVlIHx8IFtdKS5maW5kSW5kZXgoaSA9PiB0aGlzLnZhbHVlQ29tcGFyYXRvcih0aGlzLmdldFZhbHVlKGkpLCBpdGVtVmFsdWUpKVxyXG4gICAgfSxcclxuICAgIGdlbkNoaXBTZWxlY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoXHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZCB8fFxyXG4gICAgICAgIHRoaXMucmVhZG9ubHkgfHxcclxuICAgICAgICB0aGlzLmdldERpc2FibGVkKGl0ZW0pXHJcbiAgICAgIClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZDaGlwLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWNoaXAtLXNlbGVjdC1tdWx0aScsXHJcbiAgICAgICAgYXR0cnM6IHsgdGFiaW5kZXg6IC0xIH0sXHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGNsb3NlOiB0aGlzLmRlbGV0YWJsZUNoaXBzICYmICFpc0Rpc2FibGVkLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IGlzRGlzYWJsZWQsXHJcbiAgICAgICAgICBzZWxlY3RlZDogaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCxcclxuICAgICAgICAgIHNtYWxsOiB0aGlzLnNtYWxsQ2hpcHNcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc0Rpc2FibGVkKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaW5wdXQ6ICgpID0+IHRoaXMub25DaGlwSW5wdXQoaXRlbSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGtleTogdGhpcy5nZXRWYWx1ZShpdGVtKVxyXG4gICAgICB9LCB0aGlzLmdldFRleHQoaXRlbSkpXHJcbiAgICB9LFxyXG4gICAgZ2VuQ29tbWFTZWxlY3Rpb24gKGl0ZW0sIGluZGV4LCBsYXN0KSB7XHJcbiAgICAgIC8vIEl0ZW0gbWF5IGJlIGFuIG9iamVjdFxyXG4gICAgICAvLyBUT0RPOiBSZW1vdmUgSlNPTi5zdHJpbmdpZnlcclxuICAgICAgY29uc3Qga2V5ID0gSlNPTi5zdHJpbmdpZnkodGhpcy5nZXRWYWx1ZShpdGVtKSlcclxuICAgICAgY29uc3QgY29sb3IgPSBpbmRleCA9PT0gdGhpcy5zZWxlY3RlZEluZGV4ICYmIHRoaXMuY29sb3JcclxuICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IChcclxuICAgICAgICB0aGlzLmRpc2FibGVkIHx8XHJcbiAgICAgICAgdGhpcy5nZXREaXNhYmxlZChpdGVtKVxyXG4gICAgICApXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2JywgdGhpcy5zZXRUZXh0Q29sb3IoY29sb3IsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2VsZWN0X19zZWxlY3Rpb24gdi1zZWxlY3RfX3NlbGVjdGlvbi0tY29tbWEnLFxyXG4gICAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAgICd2LXNlbGVjdF9fc2VsZWN0aW9uLS1kaXNhYmxlZCc6IGlzRGlzYWJsZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGtleVxyXG4gICAgICB9KSwgYCR7dGhpcy5nZXRUZXh0KGl0ZW0pfSR7bGFzdCA/ICcnIDogJywgJ31gKVxyXG4gICAgfSxcclxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcclxuICAgICAgY29uc3Qgc2VsZWN0aW9ucyA9IHRoaXMuZ2VuU2VsZWN0aW9ucygpXHJcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5nZW5JbnB1dCgpXHJcblxyXG4gICAgICAvLyBJZiB0aGUgcmV0dXJuIGlzIGFuIGVtcHR5IGFycmF5XHJcbiAgICAgIC8vIHB1c2ggdGhlIGlucHV0XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGVjdGlvbnMpKSB7XHJcbiAgICAgICAgc2VsZWN0aW9ucy5wdXNoKGlucHV0KVxyXG4gICAgICAvLyBPdGhlcndpc2UgcHVzaCBpdCBpbnRvIGNoaWxkcmVuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZWN0aW9ucy5jaGlsZHJlbiA9IHNlbGVjdGlvbnMuY2hpbGRyZW4gfHwgW11cclxuICAgICAgICBzZWxlY3Rpb25zLmNoaWxkcmVuLnB1c2goaW5wdXQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNlbGVjdF9fc2xvdCcsXHJcbiAgICAgICAgICBkaXJlY3RpdmVzOiB0aGlzLmRpcmVjdGl2ZXNcclxuICAgICAgICB9LCBbXHJcbiAgICAgICAgICB0aGlzLmdlbkxhYmVsKCksXHJcbiAgICAgICAgICB0aGlzLnByZWZpeCA/IHRoaXMuZ2VuQWZmaXgoJ3ByZWZpeCcpIDogbnVsbCxcclxuICAgICAgICAgIHNlbGVjdGlvbnMsXHJcbiAgICAgICAgICB0aGlzLnN1ZmZpeCA/IHRoaXMuZ2VuQWZmaXgoJ3N1ZmZpeCcpIDogbnVsbCxcclxuICAgICAgICAgIHRoaXMuZ2VuQ2xlYXJJY29uKCksXHJcbiAgICAgICAgICB0aGlzLmdlbkljb25TbG90KClcclxuICAgICAgICBdKSxcclxuICAgICAgICB0aGlzLmdlbk1lbnUoKSxcclxuICAgICAgICB0aGlzLmdlblByb2dyZXNzKClcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGdlbklucHV0ICgpIHtcclxuICAgICAgY29uc3QgaW5wdXQgPSBWVGV4dEZpZWxkLm9wdGlvbnMubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMpXHJcblxyXG4gICAgICBpbnB1dC5kYXRhLmRvbVByb3BzLnZhbHVlID0gbnVsbFxyXG4gICAgICBpbnB1dC5kYXRhLmF0dHJzLnJlYWRvbmx5ID0gdHJ1ZVxyXG4gICAgICBpbnB1dC5kYXRhLmF0dHJzWydhcmlhLXJlYWRvbmx5J10gPSBTdHJpbmcodGhpcy5yZWFkb25seSlcclxuICAgICAgaW5wdXQuZGF0YS5vbi5rZXlwcmVzcyA9IHRoaXMub25LZXlQcmVzc1xyXG5cclxuICAgICAgcmV0dXJuIGlucHV0XHJcbiAgICB9LFxyXG4gICAgZ2VuTGlzdCAoKSB7XHJcbiAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gc2xvdHMsIHdlIGNhbiB1c2UgYSBjYWNoZWQgVk5vZGUgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxyXG4gICAgICBpZiAodGhpcy4kc2xvdHNbJ25vLWRhdGEnXSB8fCB0aGlzLiRzbG90c1sncHJlcGVuZC1pdGVtJ10gfHwgdGhpcy4kc2xvdHNbJ2FwcGVuZC1pdGVtJ10pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZW5MaXN0V2l0aFNsb3QoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRpY0xpc3RcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdlbkxpc3RXaXRoU2xvdCAoKSB7XHJcbiAgICAgIGNvbnN0IHNsb3RzID0gWydwcmVwZW5kLWl0ZW0nLCAnbm8tZGF0YScsICdhcHBlbmQtaXRlbSddXHJcbiAgICAgICAgLmZpbHRlcihzbG90TmFtZSA9PiB0aGlzLiRzbG90c1tzbG90TmFtZV0pXHJcbiAgICAgICAgLm1hcChzbG90TmFtZSA9PiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScsIHtcclxuICAgICAgICAgIHNsb3Q6IHNsb3ROYW1lXHJcbiAgICAgICAgfSwgdGhpcy4kc2xvdHNbc2xvdE5hbWVdKSlcclxuICAgICAgLy8gUmVxdWlyZXMgZGVzdHJ1Y3R1cmluZyBkdWUgdG8gVnVlXHJcbiAgICAgIC8vIG1vZGlmeWluZyB0aGUgYG9uYCBwcm9wZXJ0eSB3aGVuIHBhc3NlZFxyXG4gICAgICAvLyBhcyBhIHJlZmVyZW5jZWQgb2JqZWN0XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZTZWxlY3RMaXN0LCB7XHJcbiAgICAgICAgLi4udGhpcy5saXN0RGF0YVxyXG4gICAgICB9LCBzbG90cylcclxuICAgIH0sXHJcbiAgICBnZW5NZW51ICgpIHtcclxuICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLiRfbWVudVByb3BzXHJcbiAgICAgIHByb3BzLmFjdGl2YXRvciA9IHRoaXMuJHJlZnNbJ2lucHV0LXNsb3QnXVxyXG5cclxuICAgICAgLy8gRGVwcmVjYXRlIHVzaW5nIG1lbnUgcHJvcHMgZGlyZWN0bHlcclxuICAgICAgLy8gVE9ETzogcmVtb3ZlICgyLjApXHJcbiAgICAgIGNvbnN0IGluaGVyaXRlZFByb3BzID0gT2JqZWN0LmtleXMoVk1lbnUub3B0aW9ucy5wcm9wcylcclxuXHJcbiAgICAgIGNvbnN0IGRlcHJlY2F0ZWRQcm9wcyA9IE9iamVjdC5rZXlzKHRoaXMuJGF0dHJzKS5yZWR1Y2UoKGFjYywgYXR0cikgPT4ge1xyXG4gICAgICAgIGlmIChpbmhlcml0ZWRQcm9wcy5pbmNsdWRlcyhjYW1lbGl6ZShhdHRyKSkpIGFjYy5wdXNoKGF0dHIpXHJcbiAgICAgICAgcmV0dXJuIGFjY1xyXG4gICAgICB9LCBbXSlcclxuXHJcbiAgICAgIGZvciAoY29uc3QgcHJvcCBvZiBkZXByZWNhdGVkUHJvcHMpIHtcclxuICAgICAgICBwcm9wc1tjYW1lbGl6ZShwcm9wKV0gPSB0aGlzLiRhdHRyc1twcm9wXVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgICAgIGlmIChkZXByZWNhdGVkUHJvcHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICBjb25zdCBtdWx0aXBsZSA9IGRlcHJlY2F0ZWRQcm9wcy5sZW5ndGggPiAxXHJcbiAgICAgICAgICBsZXQgcmVwbGFjZW1lbnQgPSBkZXByZWNhdGVkUHJvcHMucmVkdWNlKChhY2MsIHApID0+IHtcclxuICAgICAgICAgICAgYWNjW2NhbWVsaXplKHApXSA9IHRoaXMuJGF0dHJzW3BdXHJcbiAgICAgICAgICAgIHJldHVybiBhY2NcclxuICAgICAgICAgIH0sIHt9KVxyXG4gICAgICAgICAgY29uc3QgcHJvcHMgPSBkZXByZWNhdGVkUHJvcHMubWFwKHAgPT4gYCcke3B9J2ApLmpvaW4oJywgJylcclxuICAgICAgICAgIGNvbnN0IHNlcGFyYXRvciA9IG11bHRpcGxlID8gJ1xcbicgOiAnXFwnJ1xyXG5cclxuICAgICAgICAgIGNvbnN0IG9ubHlCb29scyA9IE9iamVjdC5rZXlzKHJlcGxhY2VtZW50KS5ldmVyeShwcm9wID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvcFR5cGUgPSBWTWVudS5vcHRpb25zLnByb3BzW3Byb3BdXHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcmVwbGFjZW1lbnRbcHJvcF1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8ICgocHJvcFR5cGUudHlwZSB8fCBwcm9wVHlwZSkgPT09IEJvb2xlYW4gJiYgdmFsdWUgPT09ICcnKVxyXG4gICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICBpZiAob25seUJvb2xzKSB7XHJcbiAgICAgICAgICAgIHJlcGxhY2VtZW50ID0gT2JqZWN0LmtleXMocmVwbGFjZW1lbnQpLmpvaW4oJywgJylcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcGxhY2VtZW50ID0gSlNPTi5zdHJpbmdpZnkocmVwbGFjZW1lbnQsIG51bGwsIG11bHRpcGxlID8gMiA6IDApXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiKFteKFwiKVwiXSspXCI6L2csICckMTonKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFwnJylcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zb2xlV2FybihcclxuICAgICAgICAgICAgYCR7cHJvcHN9ICR7bXVsdGlwbGUgPyAnYXJlJyA6ICdpcyd9IGRlcHJlY2F0ZWQsIHVzZSBgICtcclxuICAgICAgICAgICAgYCR7c2VwYXJhdG9yfSR7b25seUJvb2xzID8gJycgOiAnOid9bWVudS1wcm9wcz1cIiR7cmVwbGFjZW1lbnR9XCIke3NlcGFyYXRvcn0gaW5zdGVhZGAsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEF0dGFjaCB0byByb290IGVsIHNvIHRoYXRcclxuICAgICAgLy8gbWVudSBjb3ZlcnMgcHJlcGVuZC9hcHBlbmQgaWNvbnNcclxuICAgICAgaWYgKFxyXG4gICAgICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhIGNvbXB1dGVkIHByb3BlcnR5IG9yIGhlbHBlciBvciBzb21ldGhpbmdcclxuICAgICAgICB0aGlzLmF0dGFjaCA9PT0gJycgfHwgLy8gSWYgdXNlZCBhcyBhIGJvb2xlYW4gcHJvcCAoPHYtbWVudSBhdHRhY2g+KVxyXG4gICAgICAgIHRoaXMuYXR0YWNoID09PSB0cnVlIHx8IC8vIElmIGJvdW5kIHRvIGEgYm9vbGVhbiAoPHYtbWVudSA6YXR0YWNoPVwidHJ1ZVwiPilcclxuICAgICAgICB0aGlzLmF0dGFjaCA9PT0gJ2F0dGFjaCcgLy8gSWYgYm91bmQgYXMgYm9vbGVhbiBwcm9wIGluIHB1ZyAodi1tZW51KGF0dGFjaCkpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHByb3BzLmF0dGFjaCA9IHRoaXMuJGVsXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcHJvcHMuYXR0YWNoID0gdGhpcy5hdHRhY2hcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVk1lbnUsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgaW5wdXQ6IHZhbCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdmFsXHJcbiAgICAgICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdmFsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICdtZW51J1xyXG4gICAgICB9LCBbdGhpcy5nZW5MaXN0KCldKVxyXG4gICAgfSxcclxuICAgIGdlblNlbGVjdGlvbnMgKCkge1xyXG4gICAgICBsZXQgbGVuZ3RoID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IG5ldyBBcnJheShsZW5ndGgpXHJcblxyXG4gICAgICBsZXQgZ2VuU2VsZWN0aW9uXHJcbiAgICAgIGlmICh0aGlzLiRzY29wZWRTbG90cy5zZWxlY3Rpb24pIHtcclxuICAgICAgICBnZW5TZWxlY3Rpb24gPSB0aGlzLmdlblNsb3RTZWxlY3Rpb25cclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc0NoaXBzKSB7XHJcbiAgICAgICAgZ2VuU2VsZWN0aW9uID0gdGhpcy5nZW5DaGlwU2VsZWN0aW9uXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZ2VuU2VsZWN0aW9uID0gdGhpcy5nZW5Db21tYVNlbGVjdGlvblxyXG4gICAgICB9XHJcblxyXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcclxuICAgICAgICBjaGlsZHJlbltsZW5ndGhdID0gZ2VuU2VsZWN0aW9uKFxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zW2xlbmd0aF0sXHJcbiAgICAgICAgICBsZW5ndGgsXHJcbiAgICAgICAgICBsZW5ndGggPT09IGNoaWxkcmVuLmxlbmd0aCAtIDFcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNlbGVjdF9fc2VsZWN0aW9ucydcclxuICAgICAgfSwgY2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgZ2VuU2xvdFNlbGVjdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJHNjb3BlZFNsb3RzLnNlbGVjdGlvbih7XHJcbiAgICAgICAgcGFyZW50OiB0aGlzLFxyXG4gICAgICAgIGl0ZW0sXHJcbiAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgc2VsZWN0ZWQ6IGluZGV4ID09PSB0aGlzLnNlbGVjdGVkSW5kZXgsXHJcbiAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5yZWFkb25seVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdldE1lbnVJbmRleCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRyZWZzLm1lbnUgPyB0aGlzLiRyZWZzLm1lbnUubGlzdEluZGV4IDogLTFcclxuICAgIH0sXHJcbiAgICBnZXREaXNhYmxlZCAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1EaXNhYmxlZCwgZmFsc2UpXHJcbiAgICB9LFxyXG4gICAgZ2V0VGV4dCAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1UZXh0LCBpdGVtKVxyXG4gICAgfSxcclxuICAgIGdldFZhbHVlIChpdGVtKSB7XHJcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eUZyb21JdGVtKGl0ZW0sIHRoaXMuaXRlbVZhbHVlLCB0aGlzLmdldFRleHQoaXRlbSkpXHJcbiAgICB9LFxyXG4gICAgb25CbHVyIChlKSB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ2JsdXInLCBlKVxyXG4gICAgfSxcclxuICAgIG9uQ2hpcElucHV0IChpdGVtKSB7XHJcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB0aGlzLnNlbGVjdEl0ZW0oaXRlbSlcclxuICAgICAgZWxzZSB0aGlzLnNldFZhbHVlKG51bGwpXHJcblxyXG4gICAgICAvLyBJZiBhbGwgaXRlbXMgaGF2ZSBiZWVuIGRlbGV0ZWQsXHJcbiAgICAgIC8vIG9wZW4gYHYtbWVudWBcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMVxyXG4gICAgfSxcclxuICAgIG9uQ2xpY2sgKCkge1xyXG4gICAgICBpZiAodGhpcy5pc0Rpc2FibGVkKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmlzRm9jdXNlZCkge1xyXG4gICAgICAgIHRoaXMuaXNGb2N1c2VkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2ZvY3VzJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uRW50ZXJEb3duICgpIHtcclxuICAgICAgdGhpcy5vbkJsdXIoKVxyXG4gICAgfSxcclxuICAgIG9uRXNjRG93biAoZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uS2V5UHJlc3MgKGUpIHtcclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgS0VZQk9BUkRfTE9PS1VQX1RIUkVTSE9MRCA9IDEwMDAgLy8gbWlsbGlzZWNvbmRzXHJcbiAgICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpXHJcbiAgICAgIGlmIChub3cgLSB0aGlzLmtleWJvYXJkTG9va3VwTGFzdFRpbWUgPiBLRVlCT0FSRF9MT09LVVBfVEhSRVNIT0xEKSB7XHJcbiAgICAgICAgdGhpcy5rZXlib2FyZExvb2t1cFByZWZpeCA9ICcnXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5rZXlib2FyZExvb2t1cFByZWZpeCArPSBlLmtleS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIHRoaXMua2V5Ym9hcmRMb29rdXBMYXN0VGltZSA9IG5vd1xyXG5cclxuICAgICAgY29uc3QgaXRlbSA9IHRoaXMuYWxsSXRlbXMuZmluZChpdGVtID0+IHRoaXMuZ2V0VGV4dChpdGVtKS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgodGhpcy5rZXlib2FyZExvb2t1cFByZWZpeCkpXHJcbiAgICAgIGlmIChpdGVtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMucmV0dXJuT2JqZWN0ID8gaXRlbSA6IHRoaXMuZ2V0VmFsdWUoaXRlbSkpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbktleURvd24gKGUpIHtcclxuICAgICAgY29uc3Qga2V5Q29kZSA9IGUua2V5Q29kZVxyXG5cclxuICAgICAgLy8gSWYgZW50ZXIsIHNwYWNlLCB1cCwgb3IgZG93biBpcyBwcmVzc2VkLCBvcGVuIG1lbnVcclxuICAgICAgaWYgKCF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLmlzTWVudUFjdGl2ZSAmJiBbXHJcbiAgICAgICAga2V5Q29kZXMuZW50ZXIsXHJcbiAgICAgICAga2V5Q29kZXMuc3BhY2UsXHJcbiAgICAgICAga2V5Q29kZXMudXAsIGtleUNvZGVzLmRvd25cclxuICAgICAgXS5pbmNsdWRlcyhrZXlDb2RlKSkgdGhpcy5hY3RpdmF0ZU1lbnUoKVxyXG5cclxuICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlICYmIHRoaXMuJHJlZnMubWVudSkgdGhpcy4kcmVmcy5tZW51LmNoYW5nZUxpc3RJbmRleChlKVxyXG5cclxuICAgICAgLy8gVGhpcyBzaG91bGQgZG8gc29tZXRoaW5nIGRpZmZlcmVudFxyXG4gICAgICBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMuZW50ZXIpIHJldHVybiB0aGlzLm9uRW50ZXJEb3duKGUpXHJcblxyXG4gICAgICAvLyBJZiBlc2NhcGUgZGVhY3RpdmF0ZSB0aGUgbWVudVxyXG4gICAgICBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMuZXNjKSByZXR1cm4gdGhpcy5vbkVzY0Rvd24oZSlcclxuXHJcbiAgICAgIC8vIElmIHRhYiAtIHNlbGVjdCBpdGVtIG9yIGNsb3NlIG1lbnVcclxuICAgICAgaWYgKGtleUNvZGUgPT09IGtleUNvZGVzLnRhYikgcmV0dXJuIHRoaXMub25UYWJEb3duKGUpXHJcbiAgICB9LFxyXG4gICAgb25Nb3VzZVVwIChlKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc01vdXNlRG93bikge1xyXG4gICAgICAgIGNvbnN0IGFwcGVuZElubmVyID0gdGhpcy4kcmVmc1snYXBwZW5kLWlubmVyJ11cclxuXHJcbiAgICAgICAgLy8gSWYgYXBwZW5kIGlubmVyIGlzIHByZXNlbnRcclxuICAgICAgICAvLyBhbmQgdGhlIHRhcmdldCBpcyBpdHNlbGZcclxuICAgICAgICAvLyBvciBpbnNpZGUsIHRvZ2dsZSBtZW51XHJcbiAgICAgICAgaWYgKHRoaXMuaXNNZW51QWN0aXZlICYmXHJcbiAgICAgICAgICBhcHBlbmRJbm5lciAmJlxyXG4gICAgICAgICAgKGFwcGVuZElubmVyID09PSBlLnRhcmdldCB8fFxyXG4gICAgICAgICAgYXBwZW5kSW5uZXIuY29udGFpbnMoZS50YXJnZXQpKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gKHRoaXMuaXNNZW51QWN0aXZlID0gIXRoaXMuaXNNZW51QWN0aXZlKSlcclxuICAgICAgICAvLyBJZiB1c2VyIGlzIGNsaWNraW5nIGluIHRoZSBjb250YWluZXJcclxuICAgICAgICAvLyBhbmQgZmllbGQgaXMgZW5jbG9zZWQsIGFjdGl2YXRlIGl0XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzRW5jbG9zZWQgJiYgIXRoaXMuaXNEaXNhYmxlZCkge1xyXG4gICAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBWVGV4dEZpZWxkLm9wdGlvbnMubWV0aG9kcy5vbk1vdXNlVXAuY2FsbCh0aGlzLCBlKVxyXG4gICAgfSxcclxuICAgIG9uU2Nyb2xsICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmlzTWVudUFjdGl2ZSkge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiAodGhpcy5jb250ZW50LnNjcm9sbFRvcCA9IDApKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmxhc3RJdGVtID49IHRoaXMuY29tcHV0ZWRJdGVtcy5sZW5ndGgpIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCBzaG93TW9yZUl0ZW1zID0gKFxyXG4gICAgICAgICAgdGhpcy5jb250ZW50LnNjcm9sbEhlaWdodCAtXHJcbiAgICAgICAgICAodGhpcy5jb250ZW50LnNjcm9sbFRvcCArXHJcbiAgICAgICAgICB0aGlzLmNvbnRlbnQuY2xpZW50SGVpZ2h0KVxyXG4gICAgICAgICkgPCAyMDBcclxuXHJcbiAgICAgICAgaWYgKHNob3dNb3JlSXRlbXMpIHtcclxuICAgICAgICAgIHRoaXMubGFzdEl0ZW0gKz0gMjBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvblRhYkRvd24gKGUpIHtcclxuICAgICAgY29uc3QgbWVudUluZGV4ID0gdGhpcy5nZXRNZW51SW5kZXgoKVxyXG5cclxuICAgICAgY29uc3QgbGlzdFRpbGUgPSB0aGlzLiRyZWZzLm1lbnUudGlsZXNbbWVudUluZGV4XVxyXG5cclxuICAgICAgLy8gQW4gaXRlbSB0aGF0IGlzIHNlbGVjdGVkIGJ5XHJcbiAgICAgIC8vIG1lbnUtaW5kZXggc2hvdWxkIHRvZ2dsZWRcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGxpc3RUaWxlICYmXHJcbiAgICAgICAgbGlzdFRpbGUuY2xhc3NOYW1lLmluZGV4T2YoJ3YtbGlzdF9fdGlsZS0taGlnaGxpZ2h0ZWQnKSA+IC0xICYmXHJcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgJiZcclxuICAgICAgICBtZW51SW5kZXggPiAtMVxyXG4gICAgICApIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgIGxpc3RUaWxlLmNsaWNrKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJZiB3ZSBtYWtlIGl0IGhlcmUsXHJcbiAgICAgICAgLy8gdGhlIHVzZXIgaGFzIG5vIHNlbGVjdGVkIGluZGV4ZXNcclxuICAgICAgICAvLyBhbmQgaXMgcHJvYmFibHkgdGFiYmluZyBvdXRcclxuICAgICAgICB0aGlzLmJsdXIoZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNlbGVjdEl0ZW0gKGl0ZW0pIHtcclxuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnJldHVybk9iamVjdCA/IGl0ZW0gOiB0aGlzLmdldFZhbHVlKGl0ZW0pKVxyXG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gZmFsc2VcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBpbnRlcm5hbFZhbHVlID0gKHRoaXMuaW50ZXJuYWxWYWx1ZSB8fCBbXSkuc2xpY2UoKVxyXG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLmZpbmRFeGlzdGluZ0luZGV4KGl0ZW0pXHJcblxyXG4gICAgICAgIGkgIT09IC0xID8gaW50ZXJuYWxWYWx1ZS5zcGxpY2UoaSwgMSkgOiBpbnRlcm5hbFZhbHVlLnB1c2goaXRlbSlcclxuICAgICAgICB0aGlzLnNldFZhbHVlKGludGVybmFsVmFsdWUubWFwKGkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMucmV0dXJuT2JqZWN0ID8gaSA6IHRoaXMuZ2V0VmFsdWUoaSlcclxuICAgICAgICB9KSlcclxuXHJcbiAgICAgICAgLy8gV2hlbiBzZWxlY3RpbmcgbXVsdGlwbGVcclxuICAgICAgICAvLyBhZGp1c3QgbWVudSBhZnRlciBlYWNoXHJcbiAgICAgICAgLy8gc2VsZWN0aW9uXHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy4kcmVmcy5tZW51ICYmXHJcbiAgICAgICAgICAgIHRoaXMuJHJlZnMubWVudS51cGRhdGVEaW1lbnNpb25zKClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0TWVudUluZGV4IChpbmRleCkge1xyXG4gICAgICB0aGlzLiRyZWZzLm1lbnUgJiYgKHRoaXMuJHJlZnMubWVudS5saXN0SW5kZXggPSBpbmRleClcclxuICAgIH0sXHJcbiAgICBzZXRTZWxlY3RlZEl0ZW1zICgpIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IFtdXHJcbiAgICAgIGNvbnN0IHZhbHVlcyA9ICF0aGlzLm11bHRpcGxlIHx8ICFBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSlcclxuICAgICAgICA/IFt0aGlzLmludGVybmFsVmFsdWVdXHJcbiAgICAgICAgOiB0aGlzLmludGVybmFsVmFsdWVcclxuXHJcbiAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdmFsdWVzKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmFsbEl0ZW1zLmZpbmRJbmRleCh2ID0+IHRoaXMudmFsdWVDb21wYXJhdG9yKFxyXG4gICAgICAgICAgdGhpcy5nZXRWYWx1ZSh2KSxcclxuICAgICAgICAgIHRoaXMuZ2V0VmFsdWUodmFsdWUpXHJcbiAgICAgICAgKSlcclxuXHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgIHNlbGVjdGVkSXRlbXMucHVzaCh0aGlzLmFsbEl0ZW1zW2luZGV4XSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHNlbGVjdGVkSXRlbXNcclxuICAgIH0sXHJcbiAgICBzZXRWYWx1ZSAodmFsdWUpIHtcclxuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWVcclxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdmFsdWVcclxuICAgICAgdmFsdWUgIT09IG9sZFZhbHVlICYmIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19