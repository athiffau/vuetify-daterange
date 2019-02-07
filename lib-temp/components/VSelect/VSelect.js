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
            value !== this.internalValue && this.$emit('change', value);
            this.internalValue = value;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTZWxlY3QvVlNlbGVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQUNsRCxPQUFPLHNDQUFzQyxDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQTtBQUV2QyxhQUFhO0FBQ2IsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFFakQsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBRWhELGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUV6RCxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTlELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLFlBQVksRUFBRSxLQUFLO0lBQ25CLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsU0FBUyxFQUFFLEdBQUc7Q0FDZixDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUU7UUFDVixZQUFZO0tBQ2I7SUFFRCxNQUFNLEVBQUU7UUFDTixVQUFVO1FBQ1YsVUFBVTtLQUNYO0lBRUQsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFP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YUFBYSxDQUFDO2dCQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUV0QixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUNyQixDQUFDLENBQUE7Z0JBRUYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ2QsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7aUJBQ3pDO2FBQ0Y7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQTtRQUNwQyxDQUFDO1FBQ0QsUUFBUSxDQUFFLEtBQUs7WUFDYixLQUFLLEtBQUssSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUMzRCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtRQUM1QixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fdGV4dC1maWVsZHMuc3R5bCdcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc2VsZWN0LnN0eWwnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWQ2hpcCBmcm9tICcuLi9WQ2hpcCdcclxuaW1wb3J0IFZNZW51IGZyb20gJy4uL1ZNZW51J1xyXG5pbXBvcnQgVlNlbGVjdExpc3QgZnJvbSAnLi9WU2VsZWN0TGlzdCdcclxuXHJcbi8vIEV4dGVuc2lvbnNcclxuaW1wb3J0IFZUZXh0RmllbGQgZnJvbSAnLi4vVlRleHRGaWVsZC9WVGV4dEZpZWxkJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb21wYXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb21wYXJhYmxlJ1xyXG5pbXBvcnQgRmlsdGVyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZmlsdGVyYWJsZSdcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IENsaWNrT3V0c2lkZSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCB7IGNhbWVsaXplLCBnZXRQcm9wZXJ0eUZyb21JdGVtLCBrZXlDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IHsgY29uc29sZUVycm9yLCBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0TWVudVByb3BzID0ge1xyXG4gIGNsb3NlT25DbGljazogZmFsc2UsXHJcbiAgY2xvc2VPbkNvbnRlbnRDbGljazogZmFsc2UsXHJcbiAgb3Blbk9uQ2xpY2s6IGZhbHNlLFxyXG4gIG1heEhlaWdodDogMzAwXHJcbn1cclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZUZXh0RmllbGQuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1zZWxlY3QnLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7XHJcbiAgICBDbGlja091dHNpZGVcclxuICB9LFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIENvbXBhcmFibGUsXHJcbiAgICBGaWx0ZXJhYmxlXHJcbiAgXSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFwcGVuZEljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMuZHJvcGRvd24nXHJcbiAgICB9LFxyXG4gICAgYXBwZW5kSWNvbkNiOiBGdW5jdGlvbixcclxuICAgIGF0dGFjaDoge1xyXG4gICAgICB0eXBlOiBudWxsLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIGJyb3dzZXJBdXRvY29tcGxldGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnb24nXHJcbiAgICB9LFxyXG4gICAgY2FjaGVJdGVtczogQm9vbGVhbixcclxuICAgIGNoaXBzOiBCb29sZWFuLFxyXG4gICAgY2xlYXJhYmxlOiBCb29sZWFuLFxyXG4gICAgZGVsZXRhYmxlQ2hpcHM6IEJvb2xlYW4sXHJcbiAgICBkZW5zZTogQm9vbGVhbixcclxuICAgIGhpZGVTZWxlY3RlZDogQm9vbGVhbixcclxuICAgIGl0ZW1zOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXVxyXG4gICAgfSxcclxuICAgIGl0ZW1BdmF0YXI6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSxcclxuICAgICAgZGVmYXVsdDogJ2F2YXRhcidcclxuICAgIH0sXHJcbiAgICBpdGVtRGlzYWJsZWQ6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSxcclxuICAgICAgZGVmYXVsdDogJ2Rpc2FibGVkJ1xyXG4gICAgfSxcclxuICAgIGl0ZW1UZXh0OiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBGdW5jdGlvbl0sXHJcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0J1xyXG4gICAgfSxcclxuICAgIGl0ZW1WYWx1ZToge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dLFxyXG4gICAgICBkZWZhdWx0OiAndmFsdWUnXHJcbiAgICB9LFxyXG4gICAgbWVudVByb3BzOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBPYmplY3RdLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBkZWZhdWx0TWVudVByb3BzXHJcbiAgICB9LFxyXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXHJcbiAgICBvcGVuT25DbGVhcjogQm9vbGVhbixcclxuICAgIHJldHVybk9iamVjdDogQm9vbGVhbixcclxuICAgIHNlYXJjaElucHV0OiB7XHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICBzbWFsbENoaXBzOiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgZGF0YTogdm0gPT4gKHtcclxuICAgIGF0dHJzSW5wdXQ6IHsgcm9sZTogJ2NvbWJvYm94JyB9LFxyXG4gICAgY2FjaGVkSXRlbXM6IHZtLmNhY2hlSXRlbXMgPyB2bS5pdGVtcyA6IFtdLFxyXG4gICAgY29udGVudDogbnVsbCxcclxuICAgIGlzQm9vdGVkOiBmYWxzZSxcclxuICAgIGlzTWVudUFjdGl2ZTogZmFsc2UsXHJcbiAgICBsYXN0SXRlbTogMjAsXHJcbiAgICAvLyBBcyBsb25nIGFzIGEgdmFsdWUgaXMgZGVmaW5lZCwgc2hvdyBpdFxyXG4gICAgLy8gT3RoZXJ3aXNlLCBjaGVjayBpZiBtdWx0aXBsZVxyXG4gICAgLy8gdG8gZGV0ZXJtaW5lIHdoaWNoIGRlZmF1bHQgdG8gcHJvdmlkZVxyXG4gICAgbGF6eVZhbHVlOiB2bS52YWx1ZSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgID8gdm0udmFsdWVcclxuICAgICAgOiB2bS5tdWx0aXBsZSA/IFtdIDogdW5kZWZpbmVkLFxyXG4gICAgc2VsZWN0ZWRJbmRleDogLTEsXHJcbiAgICBzZWxlY3RlZEl0ZW1zOiBbXSxcclxuICAgIGtleWJvYXJkTG9va3VwUHJlZml4OiAnJyxcclxuICAgIGtleWJvYXJkTG9va3VwTGFzdFRpbWU6IDBcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC8qIEFsbCBpdGVtcyB0aGF0IHRoZSBzZWxlY3QgaGFzICovXHJcbiAgICBhbGxJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlckR1cGxpY2F0ZXModGhpcy5jYWNoZWRJdGVtcy5jb25jYXQodGhpcy5pdGVtcykpXHJcbiAgICB9LFxyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBWVGV4dEZpZWxkLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLCB7XHJcbiAgICAgICAgJ3Ytc2VsZWN0JzogdHJ1ZSxcclxuICAgICAgICAndi1zZWxlY3QtLWNoaXBzJzogdGhpcy5oYXNDaGlwcyxcclxuICAgICAgICAndi1zZWxlY3QtLWNoaXBzLS1zbWFsbCc6IHRoaXMuc21hbGxDaGlwcyxcclxuICAgICAgICAndi1zZWxlY3QtLWlzLW1lbnUtYWN0aXZlJzogdGhpcy5pc01lbnVBY3RpdmVcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAvKiBVc2VkIGJ5IG90aGVyIGNvbXBvbmVudHMgdG8gb3ZlcndyaXRlICovXHJcbiAgICBjb21wdXRlZEl0ZW1zICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYWxsSXRlbXNcclxuICAgIH0sXHJcbiAgICBjb3VudGVyVmFsdWUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5tdWx0aXBsZVxyXG4gICAgICAgID8gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aFxyXG4gICAgICAgIDogKHRoaXMuZ2V0VGV4dCh0aGlzLnNlbGVjdGVkSXRlbXNbMF0pIHx8ICcnKS50b1N0cmluZygpLmxlbmd0aFxyXG4gICAgfSxcclxuICAgIGRpcmVjdGl2ZXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pc0ZvY3VzZWQgPyBbe1xyXG4gICAgICAgIG5hbWU6ICdjbGljay1vdXRzaWRlJyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5ibHVyLFxyXG4gICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgIGNsb3NlQ29uZGl0aW9uYWw6IHRoaXMuY2xvc2VDb25kaXRpb25hbFxyXG4gICAgICAgIH1cclxuICAgICAgfV0gOiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICBkeW5hbWljSGVpZ2h0ICgpIHtcclxuICAgICAgcmV0dXJuICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIGhhc0NoaXBzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hpcHMgfHwgdGhpcy5zbWFsbENoaXBzXHJcbiAgICB9LFxyXG4gICAgaGFzU2xvdCAoKSB7XHJcbiAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuaGFzQ2hpcHMgfHwgdGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uKVxyXG4gICAgfSxcclxuICAgIGlzRGlydHkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgIH0sXHJcbiAgICBsaXN0RGF0YSAoKSB7XHJcbiAgICAgIGNvbnN0IHNjb3BlSWQgPSB0aGlzLiR2bm9kZSAmJiB0aGlzLiR2bm9kZS5jb250ZXh0LiRvcHRpb25zLl9zY29wZUlkXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgYXR0cnM6IHNjb3BlSWQgPyB7XHJcbiAgICAgICAgICBbc2NvcGVJZF06IHRydWVcclxuICAgICAgICB9IDogbnVsbCxcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgYWN0aW9uOiB0aGlzLm11bHRpcGxlICYmICF0aGlzLmlzSGlkaW5nU2VsZWN0ZWQsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGRlbnNlOiB0aGlzLmRlbnNlLFxyXG4gICAgICAgICAgaGlkZVNlbGVjdGVkOiB0aGlzLmhpZGVTZWxlY3RlZCxcclxuICAgICAgICAgIGl0ZW1zOiB0aGlzLnZpcnR1YWxpemVkSXRlbXMsXHJcbiAgICAgICAgICBub0RhdGFUZXh0OiB0aGlzLiR2dWV0aWZ5LnQodGhpcy5ub0RhdGFUZXh0KSxcclxuICAgICAgICAgIHNlbGVjdGVkSXRlbXM6IHRoaXMuc2VsZWN0ZWRJdGVtcyxcclxuICAgICAgICAgIGl0ZW1BdmF0YXI6IHRoaXMuaXRlbUF2YXRhcixcclxuICAgICAgICAgIGl0ZW1EaXNhYmxlZDogdGhpcy5pdGVtRGlzYWJsZWQsXHJcbiAgICAgICAgICBpdGVtVmFsdWU6IHRoaXMuaXRlbVZhbHVlLFxyXG4gICAgICAgICAgaXRlbVRleHQ6IHRoaXMuaXRlbVRleHRcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBzZWxlY3Q6IHRoaXMuc2VsZWN0SXRlbVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2NvcGVkU2xvdHM6IHtcclxuICAgICAgICAgIGl0ZW06IHRoaXMuJHNjb3BlZFNsb3RzLml0ZW1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzdGF0aWNMaXN0ICgpIHtcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzWyduby1kYXRhJ10gfHwgdGhpcy4kc2xvdHNbJ3ByZXBlbmQtaXRlbSddIHx8IHRoaXMuJHNsb3RzWydhcHBlbmQtaXRlbSddKSB7XHJcbiAgICAgICAgY29uc29sZUVycm9yKCdhc3NlcnQ6IHN0YXRpY0xpc3Qgc2hvdWxkIG5vdCBiZSBjYWxsZWQgaWYgc2xvdHMgYXJlIHVzZWQnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWU2VsZWN0TGlzdCwgdGhpcy5saXN0RGF0YSlcclxuICAgIH0sXHJcbiAgICB2aXJ0dWFsaXplZEl0ZW1zICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJF9tZW51UHJvcHMuYXV0b1xyXG4gICAgICAgID8gdGhpcy5jb21wdXRlZEl0ZW1zXHJcbiAgICAgICAgOiB0aGlzLmNvbXB1dGVkSXRlbXMuc2xpY2UoMCwgdGhpcy5sYXN0SXRlbSlcclxuICAgIH0sXHJcbiAgICBtZW51Q2FuU2hvdyAoKSB7IHJldHVybiB0cnVlIH0sXHJcbiAgICAkX21lbnVQcm9wcyAoKSB7XHJcbiAgICAgIGxldCBub3JtYWxpc2VkUHJvcHNcclxuXHJcbiAgICAgIG5vcm1hbGlzZWRQcm9wcyA9IHR5cGVvZiB0aGlzLm1lbnVQcm9wcyA9PT0gJ3N0cmluZydcclxuICAgICAgICA/IHRoaXMubWVudVByb3BzLnNwbGl0KCcsJylcclxuICAgICAgICA6IHRoaXMubWVudVByb3BzXHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShub3JtYWxpc2VkUHJvcHMpKSB7XHJcbiAgICAgICAgbm9ybWFsaXNlZFByb3BzID0gbm9ybWFsaXNlZFByb3BzLnJlZHVjZSgoYWNjLCBwKSA9PiB7XHJcbiAgICAgICAgICBhY2NbcC50cmltKCldID0gdHJ1ZVxyXG4gICAgICAgICAgcmV0dXJuIGFjY1xyXG4gICAgICAgIH0sIHt9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLmRlZmF1bHRNZW51UHJvcHMsXHJcbiAgICAgICAgdmFsdWU6IHRoaXMubWVudUNhblNob3cgJiYgdGhpcy5pc01lbnVBY3RpdmUsXHJcbiAgICAgICAgbnVkZ2VCb3R0b206IHRoaXMubnVkZ2VCb3R0b21cclxuICAgICAgICAgID8gdGhpcy5udWRnZUJvdHRvbVxyXG4gICAgICAgICAgOiBub3JtYWxpc2VkUHJvcHMub2Zmc2V0WSA/IDEgOiAwLCAvLyBjb252ZXJ0IHRvIGludFxyXG4gICAgICAgIC4uLm5vcm1hbGlzZWRQcm9wc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGludGVybmFsVmFsdWUgKHZhbCkge1xyXG4gICAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IHZhbFxyXG4gICAgICB0aGlzLnNldFNlbGVjdGVkSXRlbXMoKVxyXG4gICAgfSxcclxuICAgIGlzQm9vdGVkICgpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQgJiYgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm9uU2Nyb2xsLCBmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgaXNNZW51QWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKCF2YWwpIHJldHVyblxyXG5cclxuICAgICAgdGhpcy5pc0Jvb3RlZCA9IHRydWVcclxuICAgIH0sXHJcbiAgICBpdGVtczoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGhhbmRsZXIgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlSXRlbXMpIHtcclxuICAgICAgICAgIHRoaXMuY2FjaGVkSXRlbXMgPSB0aGlzLmZpbHRlckR1cGxpY2F0ZXModGhpcy5jYWNoZWRJdGVtcy5jb25jYXQodmFsKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtcygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuY29udGVudCA9IHRoaXMuJHJlZnMubWVudSAmJiB0aGlzLiRyZWZzLm1lbnUuJHJlZnMuY29udGVudFxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIC8qKiBAcHVibGljICovXHJcbiAgICBibHVyIChlKSB7XHJcbiAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gZmFsc2VcclxuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZVxyXG4gICAgICB0aGlzLiRyZWZzLmlucHV0ICYmIHRoaXMuJHJlZnMuaW5wdXQuYmx1cigpXHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xXHJcbiAgICAgIHRoaXMub25CbHVyKGUpXHJcbiAgICB9LFxyXG4gICAgLyoqIEBwdWJsaWMgKi9cclxuICAgIGFjdGl2YXRlTWVudSAoKSB7XHJcbiAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNsZWFyYWJsZUNhbGxiYWNrICgpIHtcclxuICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLm11bHRpcGxlID8gW10gOiB1bmRlZmluZWQpXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKSlcclxuXHJcbiAgICAgIGlmICh0aGlzLm9wZW5PbkNsZWFyKSB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuICAgIH0sXHJcbiAgICBjbG9zZUNvbmRpdGlvbmFsIChlKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgLy8gQ2xpY2sgb3JpZ2luYXRlcyBmcm9tIG91dHNpZGUgdGhlIG1lbnUgY29udGVudFxyXG4gICAgICAgICEhdGhpcy5jb250ZW50ICYmXHJcbiAgICAgICAgIXRoaXMuY29udGVudC5jb250YWlucyhlLnRhcmdldCkgJiZcclxuXHJcbiAgICAgICAgLy8gQ2xpY2sgb3JpZ2luYXRlcyBmcm9tIG91dHNpZGUgdGhlIGVsZW1lbnRcclxuICAgICAgICAhIXRoaXMuJGVsICYmXHJcbiAgICAgICAgIXRoaXMuJGVsLmNvbnRhaW5zKGUudGFyZ2V0KSAmJlxyXG4gICAgICAgIGUudGFyZ2V0ICE9PSB0aGlzLiRlbFxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyRHVwbGljYXRlcyAoYXJyKSB7XHJcbiAgICAgIGNvbnN0IHVuaXF1ZVZhbHVlcyA9IG5ldyBNYXAoKVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYXJyLmxlbmd0aDsgKytpbmRleCkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBhcnJbaW5kZXhdXHJcbiAgICAgICAgY29uc3QgdmFsID0gdGhpcy5nZXRWYWx1ZShpdGVtKVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBjb21wYXJhdG9yXHJcbiAgICAgICAgIXVuaXF1ZVZhbHVlcy5oYXModmFsKSAmJiB1bmlxdWVWYWx1ZXMuc2V0KHZhbCwgaXRlbSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gQXJyYXkuZnJvbSh1bmlxdWVWYWx1ZXMudmFsdWVzKCkpXHJcbiAgICB9LFxyXG4gICAgZmluZEV4aXN0aW5nSW5kZXggKGl0ZW0pIHtcclxuICAgICAgY29uc3QgaXRlbVZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtKVxyXG5cclxuICAgICAgcmV0dXJuICh0aGlzLmludGVybmFsVmFsdWUgfHwgW10pLmZpbmRJbmRleChpID0+IHRoaXMudmFsdWVDb21wYXJhdG9yKHRoaXMuZ2V0VmFsdWUoaSksIGl0ZW1WYWx1ZSkpXHJcbiAgICB9LFxyXG4gICAgZ2VuQ2hpcFNlbGVjdGlvbiAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgY29uc3QgaXNEaXNhYmxlZCA9IChcclxuICAgICAgICB0aGlzLmRpc2FibGVkIHx8XHJcbiAgICAgICAgdGhpcy5yZWFkb25seSB8fFxyXG4gICAgICAgIHRoaXMuZ2V0RGlzYWJsZWQoaXRlbSlcclxuICAgICAgKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkNoaXAsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtY2hpcC0tc2VsZWN0LW11bHRpJyxcclxuICAgICAgICBhdHRyczogeyB0YWJpbmRleDogLTEgfSxcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY2xvc2U6IHRoaXMuZGVsZXRhYmxlQ2hpcHMgJiYgIWlzRGlzYWJsZWQsXHJcbiAgICAgICAgICBkaXNhYmxlZDogaXNEaXNhYmxlZCxcclxuICAgICAgICAgIHNlbGVjdGVkOiBpbmRleCA9PT0gdGhpcy5zZWxlY3RlZEluZGV4LFxyXG4gICAgICAgICAgc21hbGw6IHRoaXMuc21hbGxDaGlwc1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGNsaWNrOiBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzRGlzYWJsZWQpIHJldHVyblxyXG5cclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXhcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpbnB1dDogKCkgPT4gdGhpcy5vbkNoaXBJbnB1dChpdGVtKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAga2V5OiB0aGlzLmdldFZhbHVlKGl0ZW0pXHJcbiAgICAgIH0sIHRoaXMuZ2V0VGV4dChpdGVtKSlcclxuICAgIH0sXHJcbiAgICBnZW5Db21tYVNlbGVjdGlvbiAoaXRlbSwgaW5kZXgsIGxhc3QpIHtcclxuICAgICAgLy8gSXRlbSBtYXkgYmUgYW4gb2JqZWN0XHJcbiAgICAgIC8vIFRPRE86IFJlbW92ZSBKU09OLnN0cmluZ2lmeVxyXG4gICAgICBjb25zdCBrZXkgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFZhbHVlKGl0ZW0pKVxyXG4gICAgICBjb25zdCBjb2xvciA9IGluZGV4ID09PSB0aGlzLnNlbGVjdGVkSW5kZXggJiYgdGhpcy5jb2xvclxyXG4gICAgICBjb25zdCBpc0Rpc2FibGVkID0gKFxyXG4gICAgICAgIHRoaXMuZGlzYWJsZWQgfHxcclxuICAgICAgICB0aGlzLmdldERpc2FibGVkKGl0ZW0pXHJcbiAgICAgIClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldFRleHRDb2xvcihjb2xvciwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zZWxlY3RfX3NlbGVjdGlvbiB2LXNlbGVjdF9fc2VsZWN0aW9uLS1jb21tYScsXHJcbiAgICAgICAgJ2NsYXNzJzoge1xyXG4gICAgICAgICAgJ3Ytc2VsZWN0X19zZWxlY3Rpb24tLWRpc2FibGVkJzogaXNEaXNhYmxlZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAga2V5XHJcbiAgICAgIH0pLCBgJHt0aGlzLmdldFRleHQoaXRlbSl9JHtsYXN0ID8gJycgOiAnLCAnfWApXHJcbiAgICB9LFxyXG4gICAgZ2VuRGVmYXVsdFNsb3QgKCkge1xyXG4gICAgICBjb25zdCBzZWxlY3Rpb25zID0gdGhpcy5nZW5TZWxlY3Rpb25zKClcclxuICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmdlbklucHV0KClcclxuXHJcbiAgICAgIC8vIElmIHRoZSByZXR1cm4gaXMgYW4gZW1wdHkgYXJyYXlcclxuICAgICAgLy8gcHVzaCB0aGUgaW5wdXRcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0aW9ucykpIHtcclxuICAgICAgICBzZWxlY3Rpb25zLnB1c2goaW5wdXQpXHJcbiAgICAgIC8vIE90aGVyd2lzZSBwdXNoIGl0IGludG8gY2hpbGRyZW5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxlY3Rpb25zLmNoaWxkcmVuID0gc2VsZWN0aW9ucy5jaGlsZHJlbiB8fCBbXVxyXG4gICAgICAgIHNlbGVjdGlvbnMuY2hpbGRyZW4ucHVzaChpbnB1dClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2VsZWN0X19zbG90JyxcclxuICAgICAgICAgIGRpcmVjdGl2ZXM6IHRoaXMuZGlyZWN0aXZlc1xyXG4gICAgICAgIH0sIFtcclxuICAgICAgICAgIHRoaXMuZ2VuTGFiZWwoKSxcclxuICAgICAgICAgIHRoaXMucHJlZml4ID8gdGhpcy5nZW5BZmZpeCgncHJlZml4JykgOiBudWxsLFxyXG4gICAgICAgICAgc2VsZWN0aW9ucyxcclxuICAgICAgICAgIHRoaXMuc3VmZml4ID8gdGhpcy5nZW5BZmZpeCgnc3VmZml4JykgOiBudWxsLFxyXG4gICAgICAgICAgdGhpcy5nZW5DbGVhckljb24oKSxcclxuICAgICAgICAgIHRoaXMuZ2VuSWNvblNsb3QoKVxyXG4gICAgICAgIF0pLFxyXG4gICAgICAgIHRoaXMuZ2VuTWVudSgpLFxyXG4gICAgICAgIHRoaXMuZ2VuUHJvZ3Jlc3MoKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgZ2VuSW5wdXQgKCkge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLmdlbklucHV0LmNhbGwodGhpcylcclxuXHJcbiAgICAgIGlucHV0LmRhdGEuZG9tUHJvcHMudmFsdWUgPSBudWxsXHJcbiAgICAgIGlucHV0LmRhdGEuYXR0cnMucmVhZG9ubHkgPSB0cnVlXHJcbiAgICAgIGlucHV0LmRhdGEuYXR0cnNbJ2FyaWEtcmVhZG9ubHknXSA9IFN0cmluZyh0aGlzLnJlYWRvbmx5KVxyXG4gICAgICBpbnB1dC5kYXRhLm9uLmtleXByZXNzID0gdGhpcy5vbktleVByZXNzXHJcblxyXG4gICAgICByZXR1cm4gaW5wdXRcclxuICAgIH0sXHJcbiAgICBnZW5MaXN0ICgpIHtcclxuICAgICAgLy8gSWYgdGhlcmUncyBubyBzbG90cywgd2UgY2FuIHVzZSBhIGNhY2hlZCBWTm9kZSB0byBpbXByb3ZlIHBlcmZvcm1hbmNlXHJcbiAgICAgIGlmICh0aGlzLiRzbG90c1snbm8tZGF0YSddIHx8IHRoaXMuJHNsb3RzWydwcmVwZW5kLWl0ZW0nXSB8fCB0aGlzLiRzbG90c1snYXBwZW5kLWl0ZW0nXSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdlbkxpc3RXaXRoU2xvdCgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGljTGlzdFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2VuTGlzdFdpdGhTbG90ICgpIHtcclxuICAgICAgY29uc3Qgc2xvdHMgPSBbJ3ByZXBlbmQtaXRlbScsICduby1kYXRhJywgJ2FwcGVuZC1pdGVtJ11cclxuICAgICAgICAuZmlsdGVyKHNsb3ROYW1lID0+IHRoaXMuJHNsb3RzW3Nsb3ROYW1lXSlcclxuICAgICAgICAubWFwKHNsb3ROYW1lID0+IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJywge1xyXG4gICAgICAgICAgc2xvdDogc2xvdE5hbWVcclxuICAgICAgICB9LCB0aGlzLiRzbG90c1tzbG90TmFtZV0pKVxyXG4gICAgICAvLyBSZXF1aXJlcyBkZXN0cnVjdHVyaW5nIGR1ZSB0byBWdWVcclxuICAgICAgLy8gbW9kaWZ5aW5nIHRoZSBgb25gIHByb3BlcnR5IHdoZW4gcGFzc2VkXHJcbiAgICAgIC8vIGFzIGEgcmVmZXJlbmNlZCBvYmplY3RcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVlNlbGVjdExpc3QsIHtcclxuICAgICAgICAuLi50aGlzLmxpc3REYXRhXHJcbiAgICAgIH0sIHNsb3RzKVxyXG4gICAgfSxcclxuICAgIGdlbk1lbnUgKCkge1xyXG4gICAgICBjb25zdCBwcm9wcyA9IHRoaXMuJF9tZW51UHJvcHNcclxuICAgICAgcHJvcHMuYWN0aXZhdG9yID0gdGhpcy4kcmVmc1snaW5wdXQtc2xvdCddXHJcblxyXG4gICAgICAvLyBEZXByZWNhdGUgdXNpbmcgbWVudSBwcm9wcyBkaXJlY3RseVxyXG4gICAgICAvLyBUT0RPOiByZW1vdmUgKDIuMClcclxuICAgICAgY29uc3QgaW5oZXJpdGVkUHJvcHMgPSBPYmplY3Qua2V5cyhWTWVudS5vcHRpb25zLnByb3BzKVxyXG5cclxuICAgICAgY29uc3QgZGVwcmVjYXRlZFByb3BzID0gT2JqZWN0LmtleXModGhpcy4kYXR0cnMpLnJlZHVjZSgoYWNjLCBhdHRyKSA9PiB7XHJcbiAgICAgICAgaWYgKGluaGVyaXRlZFByb3BzLmluY2x1ZGVzKGNhbWVsaXplKGF0dHIpKSkgYWNjLnB1c2goYXR0cilcclxuICAgICAgICByZXR1cm4gYWNjXHJcbiAgICAgIH0sIFtdKVxyXG5cclxuICAgICAgZm9yIChjb25zdCBwcm9wIG9mIGRlcHJlY2F0ZWRQcm9wcykge1xyXG4gICAgICAgIHByb3BzW2NhbWVsaXplKHByb3ApXSA9IHRoaXMuJGF0dHJzW3Byb3BdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgICAgaWYgKGRlcHJlY2F0ZWRQcm9wcy5sZW5ndGgpIHtcclxuICAgICAgICAgIGNvbnN0IG11bHRpcGxlID0gZGVwcmVjYXRlZFByb3BzLmxlbmd0aCA+IDFcclxuICAgICAgICAgIGxldCByZXBsYWNlbWVudCA9IGRlcHJlY2F0ZWRQcm9wcy5yZWR1Y2UoKGFjYywgcCkgPT4ge1xyXG4gICAgICAgICAgICBhY2NbY2FtZWxpemUocCldID0gdGhpcy4kYXR0cnNbcF1cclxuICAgICAgICAgICAgcmV0dXJuIGFjY1xyXG4gICAgICAgICAgfSwge30pXHJcbiAgICAgICAgICBjb25zdCBwcm9wcyA9IGRlcHJlY2F0ZWRQcm9wcy5tYXAocCA9PiBgJyR7cH0nYCkuam9pbignLCAnKVxyXG4gICAgICAgICAgY29uc3Qgc2VwYXJhdG9yID0gbXVsdGlwbGUgPyAnXFxuJyA6ICdcXCcnXHJcblxyXG4gICAgICAgICAgY29uc3Qgb25seUJvb2xzID0gT2JqZWN0LmtleXMocmVwbGFjZW1lbnQpLmV2ZXJ5KHByb3AgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wVHlwZSA9IFZNZW51Lm9wdGlvbnMucHJvcHNbcHJvcF1cclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSByZXBsYWNlbWVudFtwcm9wXVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgKChwcm9wVHlwZS50eXBlIHx8IHByb3BUeXBlKSA9PT0gQm9vbGVhbiAmJiB2YWx1ZSA9PT0gJycpXHJcbiAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgIGlmIChvbmx5Qm9vbHMpIHtcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQgPSBPYmplY3Qua2V5cyhyZXBsYWNlbWVudCkuam9pbignLCAnKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQgPSBKU09OLnN0cmluZ2lmeShyZXBsYWNlbWVudCwgbnVsbCwgbXVsdGlwbGUgPyAyIDogMClcclxuICAgICAgICAgICAgICAucmVwbGFjZSgvXCIoW14oXCIpXCJdKylcIjovZywgJyQxOicpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICdcXCcnKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnNvbGVXYXJuKFxyXG4gICAgICAgICAgICBgJHtwcm9wc30gJHttdWx0aXBsZSA/ICdhcmUnIDogJ2lzJ30gZGVwcmVjYXRlZCwgdXNlIGAgK1xyXG4gICAgICAgICAgICBgJHtzZXBhcmF0b3J9JHtvbmx5Qm9vbHMgPyAnJyA6ICc6J31tZW51LXByb3BzPVwiJHtyZXBsYWNlbWVudH1cIiR7c2VwYXJhdG9yfSBpbnN0ZWFkYCxcclxuICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQXR0YWNoIHRvIHJvb3QgZWwgc28gdGhhdFxyXG4gICAgICAvLyBtZW51IGNvdmVycyBwcmVwZW5kL2FwcGVuZCBpY29uc1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGEgY29tcHV0ZWQgcHJvcGVydHkgb3IgaGVscGVyIG9yIHNvbWV0aGluZ1xyXG4gICAgICAgIHRoaXMuYXR0YWNoID09PSAnJyB8fCAvLyBJZiB1c2VkIGFzIGEgYm9vbGVhbiBwcm9wICg8di1tZW51IGF0dGFjaD4pXHJcbiAgICAgICAgdGhpcy5hdHRhY2ggPT09IHRydWUgfHwgLy8gSWYgYm91bmQgdG8gYSBib29sZWFuICg8di1tZW51IDphdHRhY2g9XCJ0cnVlXCI+KVxyXG4gICAgICAgIHRoaXMuYXR0YWNoID09PSAnYXR0YWNoJyAvLyBJZiBib3VuZCBhcyBib29sZWFuIHByb3AgaW4gcHVnICh2LW1lbnUoYXR0YWNoKSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgcHJvcHMuYXR0YWNoID0gdGhpcy4kZWxcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcm9wcy5hdHRhY2ggPSB0aGlzLmF0dGFjaFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWTWVudSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdmFsID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSB2YWxcclxuICAgICAgICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB2YWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZjogJ21lbnUnXHJcbiAgICAgIH0sIFt0aGlzLmdlbkxpc3QoKV0pXHJcbiAgICB9LFxyXG4gICAgZ2VuU2VsZWN0aW9ucyAoKSB7XHJcbiAgICAgIGxldCBsZW5ndGggPSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoXHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gbmV3IEFycmF5KGxlbmd0aClcclxuXHJcbiAgICAgIGxldCBnZW5TZWxlY3Rpb25cclxuICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzLnNlbGVjdGlvbikge1xyXG4gICAgICAgIGdlblNlbGVjdGlvbiA9IHRoaXMuZ2VuU2xvdFNlbGVjdGlvblxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ2hpcHMpIHtcclxuICAgICAgICBnZW5TZWxlY3Rpb24gPSB0aGlzLmdlbkNoaXBTZWxlY3Rpb25cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBnZW5TZWxlY3Rpb24gPSB0aGlzLmdlbkNvbW1hU2VsZWN0aW9uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xyXG4gICAgICAgIGNoaWxkcmVuW2xlbmd0aF0gPSBnZW5TZWxlY3Rpb24oXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNbbGVuZ3RoXSxcclxuICAgICAgICAgIGxlbmd0aCxcclxuICAgICAgICAgIGxlbmd0aCA9PT0gY2hpbGRyZW4ubGVuZ3RoIC0gMVxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3Ytc2VsZWN0X19zZWxlY3Rpb25zJ1xyXG4gICAgICB9LCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICBnZW5TbG90U2VsZWN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uKHtcclxuICAgICAgICBwYXJlbnQ6IHRoaXMsXHJcbiAgICAgICAgaXRlbSxcclxuICAgICAgICBpbmRleCxcclxuICAgICAgICBzZWxlY3RlZDogaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCxcclxuICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnJlYWRvbmx5XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2V0TWVudUluZGV4ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJHJlZnMubWVudSA/IHRoaXMuJHJlZnMubWVudS5saXN0SW5kZXggOiAtMVxyXG4gICAgfSxcclxuICAgIGdldERpc2FibGVkIChpdGVtKSB7XHJcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eUZyb21JdGVtKGl0ZW0sIHRoaXMuaXRlbURpc2FibGVkLCBmYWxzZSlcclxuICAgIH0sXHJcbiAgICBnZXRUZXh0IChpdGVtKSB7XHJcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eUZyb21JdGVtKGl0ZW0sIHRoaXMuaXRlbVRleHQsIGl0ZW0pXHJcbiAgICB9LFxyXG4gICAgZ2V0VmFsdWUgKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIGdldFByb3BlcnR5RnJvbUl0ZW0oaXRlbSwgdGhpcy5pdGVtVmFsdWUsIHRoaXMuZ2V0VGV4dChpdGVtKSlcclxuICAgIH0sXHJcbiAgICBvbkJsdXIgKGUpIHtcclxuICAgICAgdGhpcy4kZW1pdCgnYmx1cicsIGUpXHJcbiAgICB9LFxyXG4gICAgb25DaGlwSW5wdXQgKGl0ZW0pIHtcclxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHRoaXMuc2VsZWN0SXRlbShpdGVtKVxyXG4gICAgICBlbHNlIHRoaXMuc2V0VmFsdWUobnVsbClcclxuXHJcbiAgICAgIC8vIElmIGFsbCBpdGVtcyBoYXZlIGJlZW4gZGVsZXRlZCxcclxuICAgICAgLy8gb3BlbiBgdi1tZW51YFxyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xXHJcbiAgICB9LFxyXG4gICAgb25DbGljayAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzRGlzYWJsZWQpIHJldHVyblxyXG5cclxuICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSB0cnVlXHJcblxyXG4gICAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XHJcbiAgICAgICAgdGhpcy5pc0ZvY3VzZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnZm9jdXMnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25FbnRlckRvd24gKCkge1xyXG4gICAgICB0aGlzLm9uQmx1cigpXHJcbiAgICB9LFxyXG4gICAgb25Fc2NEb3duIChlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBpZiAodGhpcy5pc01lbnVBY3RpdmUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25LZXlQcmVzcyAoZSkge1xyXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBLRVlCT0FSRF9MT09LVVBfVEhSRVNIT0xEID0gMTAwMCAvLyBtaWxsaXNlY29uZHNcclxuICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KClcclxuICAgICAgaWYgKG5vdyAtIHRoaXMua2V5Ym9hcmRMb29rdXBMYXN0VGltZSA+IEtFWUJPQVJEX0xPT0tVUF9USFJFU0hPTEQpIHtcclxuICAgICAgICB0aGlzLmtleWJvYXJkTG9va3VwUHJlZml4ID0gJydcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmtleWJvYXJkTG9va3VwUHJlZml4ICs9IGUua2V5LnRvTG93ZXJDYXNlKClcclxuICAgICAgdGhpcy5rZXlib2FyZExvb2t1cExhc3RUaW1lID0gbm93XHJcblxyXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5hbGxJdGVtcy5maW5kKGl0ZW0gPT4gdGhpcy5nZXRUZXh0KGl0ZW0pLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCh0aGlzLmtleWJvYXJkTG9va3VwUHJlZml4KSlcclxuICAgICAgaWYgKGl0ZW0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5yZXR1cm5PYmplY3QgPyBpdGVtIDogdGhpcy5nZXRWYWx1ZShpdGVtKSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uS2V5RG93biAoZSkge1xyXG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXHJcblxyXG4gICAgICAvLyBJZiBlbnRlciwgc3BhY2UsIHVwLCBvciBkb3duIGlzIHByZXNzZWQsIG9wZW4gbWVudVxyXG4gICAgICBpZiAoIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuaXNNZW51QWN0aXZlICYmIFtcclxuICAgICAgICBrZXlDb2Rlcy5lbnRlcixcclxuICAgICAgICBrZXlDb2Rlcy5zcGFjZSxcclxuICAgICAgICBrZXlDb2Rlcy51cCwga2V5Q29kZXMuZG93blxyXG4gICAgICBdLmluY2x1ZGVzKGtleUNvZGUpKSB0aGlzLmFjdGl2YXRlTWVudSgpXHJcblxyXG4gICAgICBpZiAodGhpcy5pc01lbnVBY3RpdmUgJiYgdGhpcy4kcmVmcy5tZW51KSB0aGlzLiRyZWZzLm1lbnUuY2hhbmdlTGlzdEluZGV4KGUpXHJcblxyXG4gICAgICAvLyBUaGlzIHNob3VsZCBkbyBzb21ldGhpbmcgZGlmZmVyZW50XHJcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lbnRlcikgcmV0dXJuIHRoaXMub25FbnRlckRvd24oZSlcclxuXHJcbiAgICAgIC8vIElmIGVzY2FwZSBkZWFjdGl2YXRlIHRoZSBtZW51XHJcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MpIHJldHVybiB0aGlzLm9uRXNjRG93bihlKVxyXG5cclxuICAgICAgLy8gSWYgdGFiIC0gc2VsZWN0IGl0ZW0gb3IgY2xvc2UgbWVudVxyXG4gICAgICBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMudGFiKSByZXR1cm4gdGhpcy5vblRhYkRvd24oZSlcclxuICAgIH0sXHJcbiAgICBvbk1vdXNlVXAgKGUpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzTW91c2VEb3duKSB7XHJcbiAgICAgICAgY29uc3QgYXBwZW5kSW5uZXIgPSB0aGlzLiRyZWZzWydhcHBlbmQtaW5uZXInXVxyXG5cclxuICAgICAgICAvLyBJZiBhcHBlbmQgaW5uZXIgaXMgcHJlc2VudFxyXG4gICAgICAgIC8vIGFuZCB0aGUgdGFyZ2V0IGlzIGl0c2VsZlxyXG4gICAgICAgIC8vIG9yIGluc2lkZSwgdG9nZ2xlIG1lbnVcclxuICAgICAgICBpZiAodGhpcy5pc01lbnVBY3RpdmUgJiZcclxuICAgICAgICAgIGFwcGVuZElubmVyICYmXHJcbiAgICAgICAgICAoYXBwZW5kSW5uZXIgPT09IGUudGFyZ2V0IHx8XHJcbiAgICAgICAgICBhcHBlbmRJbm5lci5jb250YWlucyhlLnRhcmdldCkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiAodGhpcy5pc01lbnVBY3RpdmUgPSAhdGhpcy5pc01lbnVBY3RpdmUpKVxyXG4gICAgICAgIC8vIElmIHVzZXIgaXMgY2xpY2tpbmcgaW4gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgIC8vIGFuZCBmaWVsZCBpcyBlbmNsb3NlZCwgYWN0aXZhdGUgaXRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNFbmNsb3NlZCAmJiAhdGhpcy5pc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLm9uTW91c2VVcC5jYWxsKHRoaXMsIGUpXHJcbiAgICB9LFxyXG4gICAgb25TY3JvbGwgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNNZW51QWN0aXZlKSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+ICh0aGlzLmNvbnRlbnQuc2Nyb2xsVG9wID0gMCkpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdEl0ZW0gPj0gdGhpcy5jb21wdXRlZEl0ZW1zLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGNvbnN0IHNob3dNb3JlSXRlbXMgPSAoXHJcbiAgICAgICAgICB0aGlzLmNvbnRlbnQuc2Nyb2xsSGVpZ2h0IC1cclxuICAgICAgICAgICh0aGlzLmNvbnRlbnQuc2Nyb2xsVG9wICtcclxuICAgICAgICAgIHRoaXMuY29udGVudC5jbGllbnRIZWlnaHQpXHJcbiAgICAgICAgKSA8IDIwMFxyXG5cclxuICAgICAgICBpZiAoc2hvd01vcmVJdGVtcykge1xyXG4gICAgICAgICAgdGhpcy5sYXN0SXRlbSArPSAyMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uVGFiRG93biAoZSkge1xyXG4gICAgICBjb25zdCBtZW51SW5kZXggPSB0aGlzLmdldE1lbnVJbmRleCgpXHJcblxyXG4gICAgICBjb25zdCBsaXN0VGlsZSA9IHRoaXMuJHJlZnMubWVudS50aWxlc1ttZW51SW5kZXhdXHJcblxyXG4gICAgICAvLyBBbiBpdGVtIHRoYXQgaXMgc2VsZWN0ZWQgYnlcclxuICAgICAgLy8gbWVudS1pbmRleCBzaG91bGQgdG9nZ2xlZFxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbGlzdFRpbGUgJiZcclxuICAgICAgICBsaXN0VGlsZS5jbGFzc05hbWUuaW5kZXhPZigndi1saXN0X190aWxlLS1oaWdobGlnaHRlZCcpID4gLTEgJiZcclxuICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSAmJlxyXG4gICAgICAgIG1lbnVJbmRleCA+IC0xXHJcbiAgICAgICkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgbGlzdFRpbGUuY2xpY2soKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElmIHdlIG1ha2UgaXQgaGVyZSxcclxuICAgICAgICAvLyB0aGUgdXNlciBoYXMgbm8gc2VsZWN0ZWQgaW5kZXhlc1xyXG4gICAgICAgIC8vIGFuZCBpcyBwcm9iYWJseSB0YWJiaW5nIG91dFxyXG4gICAgICAgIHRoaXMuYmx1cihlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VsZWN0SXRlbSAoaXRlbSkge1xyXG4gICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMucmV0dXJuT2JqZWN0ID8gaXRlbSA6IHRoaXMuZ2V0VmFsdWUoaXRlbSkpXHJcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSAodGhpcy5pbnRlcm5hbFZhbHVlIHx8IFtdKS5zbGljZSgpXHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuZmluZEV4aXN0aW5nSW5kZXgoaXRlbSlcclxuXHJcbiAgICAgICAgaSAhPT0gLTEgPyBpbnRlcm5hbFZhbHVlLnNwbGljZShpLCAxKSA6IGludGVybmFsVmFsdWUucHVzaChpdGVtKVxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoaW50ZXJuYWxWYWx1ZS5tYXAoaSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5PYmplY3QgPyBpIDogdGhpcy5nZXRWYWx1ZShpKVxyXG4gICAgICAgIH0pKVxyXG5cclxuICAgICAgICAvLyBXaGVuIHNlbGVjdGluZyBtdWx0aXBsZVxyXG4gICAgICAgIC8vIGFkanVzdCBtZW51IGFmdGVyIGVhY2hcclxuICAgICAgICAvLyBzZWxlY3Rpb25cclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLiRyZWZzLm1lbnUgJiZcclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5tZW51LnVwZGF0ZURpbWVuc2lvbnMoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRNZW51SW5kZXggKGluZGV4KSB7XHJcbiAgICAgIHRoaXMuJHJlZnMubWVudSAmJiAodGhpcy4kcmVmcy5tZW51Lmxpc3RJbmRleCA9IGluZGV4KVxyXG4gICAgfSxcclxuICAgIHNldFNlbGVjdGVkSXRlbXMgKCkge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gW11cclxuICAgICAgY29uc3QgdmFsdWVzID0gIXRoaXMubXVsdGlwbGUgfHwgIUFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxyXG4gICAgICAgID8gW3RoaXMuaW50ZXJuYWxWYWx1ZV1cclxuICAgICAgICA6IHRoaXMuaW50ZXJuYWxWYWx1ZVxyXG5cclxuICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYWxsSXRlbXMuZmluZEluZGV4KHYgPT4gdGhpcy52YWx1ZUNvbXBhcmF0b3IoXHJcbiAgICAgICAgICB0aGlzLmdldFZhbHVlKHYpLFxyXG4gICAgICAgICAgdGhpcy5nZXRWYWx1ZSh2YWx1ZSlcclxuICAgICAgICApKVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcy5wdXNoKHRoaXMuYWxsSXRlbXNbaW5kZXhdKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gc2VsZWN0ZWRJdGVtc1xyXG4gICAgfSxcclxuICAgIHNldFZhbHVlICh2YWx1ZSkge1xyXG4gICAgICB2YWx1ZSAhPT0gdGhpcy5pbnRlcm5hbFZhbHVlICYmIHRoaXMuJGVtaXQoJ2NoYW5nZScsIHZhbHVlKVxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWx1ZVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19