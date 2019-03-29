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
            else {
                this.isMenuActive = false;
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
            const index = this.allItems.findIndex(item => this.getText(item).toLowerCase().startsWith(this.keyboardLookupPrefix));
            const item = this.allItems[index];
            if (index !== -1) {
                this.setValue(this.returnObject ? item : this.getValue(item));
                setTimeout(() => this.setMenuIndex(index));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTZWxlY3QvVlNlbGVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywyQ0FBMkMsQ0FBQTtBQUNsRCxPQUFPLHNDQUFzQyxDQUFBO0FBRTdDLGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFDNUIsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLE9BQU8sV0FBVyxNQUFNLGVBQWUsQ0FBQTtBQUV2QyxhQUFhO0FBQ2IsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFFakQsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBRWhELGFBQWE7QUFDYixPQUFPLFlBQVksTUFBTSxnQ0FBZ0MsQ0FBQTtBQUV6RCxVQUFVO0FBQ1YsT0FBTyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUM1RSxPQUFPLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTlELE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHO0lBQzlCLFlBQVksRUFBRSxLQUFLO0lBQ25CLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsU0FBUyxFQUFFLEdBQUc7Q0FDZixDQUFBO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQixJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUU7UUFDVixZQUFZO0tBQ2I7SUFFRCxNQUFNLEVBQUU7UUFDTixVQUFVO1FBQ1YsVUFBVTtLQUNYO0lBRUQsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFP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Q0FBQTtRQUN4RCxDQUFDO1FBQ0QsZ0JBQWdCO1lBQ2QsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFBO1lBQ3hCLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUE7WUFFdEIsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FDckIsQ0FBQyxDQUFBO2dCQUVGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUNkLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO2lCQUN6QzthQUNGO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDcEMsQ0FBQztRQUNELFFBQVEsQ0FBRSxLQUFLO1lBQ2IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUNuQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtZQUMxQixLQUFLLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ25ELENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL190ZXh0LWZpZWxkcy5zdHlsJ1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19zZWxlY3Quc3R5bCdcclxuXHJcbi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZDaGlwIGZyb20gJy4uL1ZDaGlwJ1xyXG5pbXBvcnQgVk1lbnUgZnJvbSAnLi4vVk1lbnUnXHJcbmltcG9ydCBWU2VsZWN0TGlzdCBmcm9tICcuL1ZTZWxlY3RMaXN0J1xyXG5cclxuLy8gRXh0ZW5zaW9uc1xyXG5pbXBvcnQgVlRleHRGaWVsZCBmcm9tICcuLi9WVGV4dEZpZWxkL1ZUZXh0RmllbGQnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IENvbXBhcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbXBhcmFibGUnXHJcbmltcG9ydCBGaWx0ZXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9maWx0ZXJhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgQ2xpY2tPdXRzaWRlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvY2xpY2stb3V0c2lkZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgY2FtZWxpemUsIGdldFByb3BlcnR5RnJvbUl0ZW0sIGtleUNvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IsIGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmF1bHRNZW51UHJvcHMgPSB7XHJcbiAgY2xvc2VPbkNsaWNrOiBmYWxzZSxcclxuICBjbG9zZU9uQ29udGVudENsaWNrOiBmYWxzZSxcclxuICBvcGVuT25DbGljazogZmFsc2UsXHJcbiAgbWF4SGVpZ2h0OiAzMDBcclxufVxyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgVlRleHRGaWVsZC5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXNlbGVjdCcsXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHtcclxuICAgIENsaWNrT3V0c2lkZVxyXG4gIH0sXHJcblxyXG4gIG1peGluczogW1xyXG4gICAgQ29tcGFyYWJsZSxcclxuICAgIEZpbHRlcmFibGVcclxuICBdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYXBwZW5kSWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5kcm9wZG93bidcclxuICAgIH0sXHJcbiAgICBhcHBlbmRJY29uQ2I6IEZ1bmN0aW9uLFxyXG4gICAgYXR0YWNoOiB7XHJcbiAgICAgIHR5cGU6IG51bGwsXHJcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgYnJvd3NlckF1dG9jb21wbGV0ZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdvbidcclxuICAgIH0sXHJcbiAgICBjYWNoZUl0ZW1zOiBCb29sZWFuLFxyXG4gICAgY2hpcHM6IEJvb2xlYW4sXHJcbiAgICBjbGVhcmFibGU6IEJvb2xlYW4sXHJcbiAgICBkZWxldGFibGVDaGlwczogQm9vbGVhbixcclxuICAgIGRlbnNlOiBCb29sZWFuLFxyXG4gICAgaGlkZVNlbGVjdGVkOiBCb29sZWFuLFxyXG4gICAgaXRlbXM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdXHJcbiAgICB9LFxyXG4gICAgaXRlbUF2YXRhcjoge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dLFxyXG4gICAgICBkZWZhdWx0OiAnYXZhdGFyJ1xyXG4gICAgfSxcclxuICAgIGl0ZW1EaXNhYmxlZDoge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheSwgRnVuY3Rpb25dLFxyXG4gICAgICBkZWZhdWx0OiAnZGlzYWJsZWQnXHJcbiAgICB9LFxyXG4gICAgaXRlbVRleHQ6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIEZ1bmN0aW9uXSxcclxuICAgICAgZGVmYXVsdDogJ3RleHQnXHJcbiAgICB9LFxyXG4gICAgaXRlbVZhbHVlOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5LCBGdW5jdGlvbl0sXHJcbiAgICAgIGRlZmF1bHQ6ICd2YWx1ZSdcclxuICAgIH0sXHJcbiAgICBtZW51UHJvcHM6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXksIE9iamVjdF0sXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IGRlZmF1bHRNZW51UHJvcHNcclxuICAgIH0sXHJcbiAgICBtdWx0aXBsZTogQm9vbGVhbixcclxuICAgIG9wZW5PbkNsZWFyOiBCb29sZWFuLFxyXG4gICAgcmV0dXJuT2JqZWN0OiBCb29sZWFuLFxyXG4gICAgc2VhcmNoSW5wdXQ6IHtcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIHNtYWxsQ2hpcHM6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhOiB2bSA9PiAoe1xyXG4gICAgYXR0cnNJbnB1dDogeyByb2xlOiAnY29tYm9ib3gnIH0sXHJcbiAgICBjYWNoZWRJdGVtczogdm0uY2FjaGVJdGVtcyA/IHZtLml0ZW1zIDogW10sXHJcbiAgICBjb250ZW50OiBudWxsLFxyXG4gICAgaXNCb290ZWQ6IGZhbHNlLFxyXG4gICAgaXNNZW51QWN0aXZlOiBmYWxzZSxcclxuICAgIGxhc3RJdGVtOiAyMCxcclxuICAgIC8vIEFzIGxvbmcgYXMgYSB2YWx1ZSBpcyBkZWZpbmVkLCBzaG93IGl0XHJcbiAgICAvLyBPdGhlcndpc2UsIGNoZWNrIGlmIG11bHRpcGxlXHJcbiAgICAvLyB0byBkZXRlcm1pbmUgd2hpY2ggZGVmYXVsdCB0byBwcm92aWRlXHJcbiAgICBsYXp5VmFsdWU6IHZtLnZhbHVlICE9PSB1bmRlZmluZWRcclxuICAgICAgPyB2bS52YWx1ZVxyXG4gICAgICA6IHZtLm11bHRpcGxlID8gW10gOiB1bmRlZmluZWQsXHJcbiAgICBzZWxlY3RlZEluZGV4OiAtMSxcclxuICAgIHNlbGVjdGVkSXRlbXM6IFtdLFxyXG4gICAga2V5Ym9hcmRMb29rdXBQcmVmaXg6ICcnLFxyXG4gICAga2V5Ym9hcmRMb29rdXBMYXN0VGltZTogMFxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgLyogQWxsIGl0ZW1zIHRoYXQgdGhlIHNlbGVjdCBoYXMgKi9cclxuICAgIGFsbEl0ZW1zICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyRHVwbGljYXRlcyh0aGlzLmNhY2hlZEl0ZW1zLmNvbmNhdCh0aGlzLml0ZW1zKSlcclxuICAgIH0sXHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIFZUZXh0RmllbGQub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcyksIHtcclxuICAgICAgICAndi1zZWxlY3QnOiB0cnVlLFxyXG4gICAgICAgICd2LXNlbGVjdC0tY2hpcHMnOiB0aGlzLmhhc0NoaXBzLFxyXG4gICAgICAgICd2LXNlbGVjdC0tY2hpcHMtLXNtYWxsJzogdGhpcy5zbWFsbENoaXBzLFxyXG4gICAgICAgICd2LXNlbGVjdC0taXMtbWVudS1hY3RpdmUnOiB0aGlzLmlzTWVudUFjdGl2ZVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIC8qIFVzZWQgYnkgb3RoZXIgY29tcG9uZW50cyB0byBvdmVyd3JpdGUgKi9cclxuICAgIGNvbXB1dGVkSXRlbXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hbGxJdGVtc1xyXG4gICAgfSxcclxuICAgIGNvdW50ZXJWYWx1ZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlXHJcbiAgICAgICAgPyB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoXHJcbiAgICAgICAgOiAodGhpcy5nZXRUZXh0KHRoaXMuc2VsZWN0ZWRJdGVtc1swXSkgfHwgJycpLnRvU3RyaW5nKCkubGVuZ3RoXHJcbiAgICB9LFxyXG4gICAgZGlyZWN0aXZlcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlzRm9jdXNlZCA/IFt7XHJcbiAgICAgICAgbmFtZTogJ2NsaWNrLW91dHNpZGUnLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmJsdXIsXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgY2xvc2VDb25kaXRpb25hbDogdGhpcy5jbG9zZUNvbmRpdGlvbmFsXHJcbiAgICAgICAgfVxyXG4gICAgICB9XSA6IHVuZGVmaW5lZFxyXG4gICAgfSxcclxuICAgIGR5bmFtaWNIZWlnaHQgKCkge1xyXG4gICAgICByZXR1cm4gJ2F1dG8nXHJcbiAgICB9LFxyXG4gICAgaGFzQ2hpcHMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGlwcyB8fCB0aGlzLnNtYWxsQ2hpcHNcclxuICAgIH0sXHJcbiAgICBoYXNTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5oYXNDaGlwcyB8fCB0aGlzLiRzY29wZWRTbG90cy5zZWxlY3Rpb24pXHJcbiAgICB9LFxyXG4gICAgaXNEaXJ0eSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMFxyXG4gICAgfSxcclxuICAgIGxpc3REYXRhICgpIHtcclxuICAgICAgY29uc3Qgc2NvcGVJZCA9IHRoaXMuJHZub2RlICYmIHRoaXMuJHZub2RlLmNvbnRleHQuJG9wdGlvbnMuX3Njb3BlSWRcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBhdHRyczogc2NvcGVJZCA/IHtcclxuICAgICAgICAgIFtzY29wZUlkXTogdHJ1ZVxyXG4gICAgICAgIH0gOiBudWxsLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhY3Rpb246IHRoaXMubXVsdGlwbGUgJiYgIXRoaXMuaXNIaWRpbmdTZWxlY3RlZCxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxyXG4gICAgICAgICAgZGVuc2U6IHRoaXMuZGVuc2UsXHJcbiAgICAgICAgICBoaWRlU2VsZWN0ZWQ6IHRoaXMuaGlkZVNlbGVjdGVkLFxyXG4gICAgICAgICAgaXRlbXM6IHRoaXMudmlydHVhbGl6ZWRJdGVtcyxcclxuICAgICAgICAgIG5vRGF0YVRleHQ6IHRoaXMuJHZ1ZXRpZnkudCh0aGlzLm5vRGF0YVRleHQpLFxyXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtczogdGhpcy5zZWxlY3RlZEl0ZW1zLFxyXG4gICAgICAgICAgaXRlbUF2YXRhcjogdGhpcy5pdGVtQXZhdGFyLFxyXG4gICAgICAgICAgaXRlbURpc2FibGVkOiB0aGlzLml0ZW1EaXNhYmxlZCxcclxuICAgICAgICAgIGl0ZW1WYWx1ZTogdGhpcy5pdGVtVmFsdWUsXHJcbiAgICAgICAgICBpdGVtVGV4dDogdGhpcy5pdGVtVGV4dFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIHNlbGVjdDogdGhpcy5zZWxlY3RJdGVtXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY29wZWRTbG90czoge1xyXG4gICAgICAgICAgaXRlbTogdGhpcy4kc2NvcGVkU2xvdHMuaXRlbVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0YXRpY0xpc3QgKCkge1xyXG4gICAgICBpZiAodGhpcy4kc2xvdHNbJ25vLWRhdGEnXSB8fCB0aGlzLiRzbG90c1sncHJlcGVuZC1pdGVtJ10gfHwgdGhpcy4kc2xvdHNbJ2FwcGVuZC1pdGVtJ10pIHtcclxuICAgICAgICBjb25zb2xlRXJyb3IoJ2Fzc2VydDogc3RhdGljTGlzdCBzaG91bGQgbm90IGJlIGNhbGxlZCBpZiBzbG90cyBhcmUgdXNlZCcpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZTZWxlY3RMaXN0LCB0aGlzLmxpc3REYXRhKVxyXG4gICAgfSxcclxuICAgIHZpcnR1YWxpemVkSXRlbXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kX21lbnVQcm9wcy5hdXRvXHJcbiAgICAgICAgPyB0aGlzLmNvbXB1dGVkSXRlbXNcclxuICAgICAgICA6IHRoaXMuY29tcHV0ZWRJdGVtcy5zbGljZSgwLCB0aGlzLmxhc3RJdGVtKVxyXG4gICAgfSxcclxuICAgIG1lbnVDYW5TaG93ICgpIHsgcmV0dXJuIHRydWUgfSxcclxuICAgICRfbWVudVByb3BzICgpIHtcclxuICAgICAgbGV0IG5vcm1hbGlzZWRQcm9wc1xyXG5cclxuICAgICAgbm9ybWFsaXNlZFByb3BzID0gdHlwZW9mIHRoaXMubWVudVByb3BzID09PSAnc3RyaW5nJ1xyXG4gICAgICAgID8gdGhpcy5tZW51UHJvcHMuc3BsaXQoJywnKVxyXG4gICAgICAgIDogdGhpcy5tZW51UHJvcHNcclxuXHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG5vcm1hbGlzZWRQcm9wcykpIHtcclxuICAgICAgICBub3JtYWxpc2VkUHJvcHMgPSBub3JtYWxpc2VkUHJvcHMucmVkdWNlKChhY2MsIHApID0+IHtcclxuICAgICAgICAgIGFjY1twLnRyaW0oKV0gPSB0cnVlXHJcbiAgICAgICAgICByZXR1cm4gYWNjXHJcbiAgICAgICAgfSwge30pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4uZGVmYXVsdE1lbnVQcm9wcyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5tZW51Q2FuU2hvdyAmJiB0aGlzLmlzTWVudUFjdGl2ZSxcclxuICAgICAgICBudWRnZUJvdHRvbTogdGhpcy5udWRnZUJvdHRvbVxyXG4gICAgICAgICAgPyB0aGlzLm51ZGdlQm90dG9tXHJcbiAgICAgICAgICA6IG5vcm1hbGlzZWRQcm9wcy5vZmZzZXRZID8gMSA6IDAsIC8vIGNvbnZlcnQgdG8gaW50XHJcbiAgICAgICAgLi4ubm9ybWFsaXNlZFByb3BzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaW50ZXJuYWxWYWx1ZSAodmFsKSB7XHJcbiAgICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gdmFsXHJcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWRJdGVtcygpXHJcbiAgICB9LFxyXG4gICAgaXNCb290ZWQgKCkge1xyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGVudCAmJiB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICAgICAgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMub25TY3JvbGwsIGZhbHNlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBpc01lbnVBY3RpdmUgKHZhbCkge1xyXG4gICAgICBpZiAoIXZhbCkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLmlzQm9vdGVkID0gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGl0ZW1zOiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgaGFuZGxlciAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVJdGVtcykge1xyXG4gICAgICAgICAgdGhpcy5jYWNoZWRJdGVtcyA9IHRoaXMuZmlsdGVyRHVwbGljYXRlcyh0aGlzLmNhY2hlZEl0ZW1zLmNvbmNhdCh2YWwpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEl0ZW1zKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy4kcmVmcy5tZW51ICYmIHRoaXMuJHJlZnMubWVudS4kcmVmcy5jb250ZW50XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLyoqIEBwdWJsaWMgKi9cclxuICAgIGJsdXIgKGUpIHtcclxuICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IGZhbHNlXHJcbiAgICAgIHRoaXMuJHJlZnMuaW5wdXQgJiYgdGhpcy4kcmVmcy5pbnB1dC5ibHVyKClcclxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcclxuICAgICAgdGhpcy5vbkJsdXIoZSlcclxuICAgIH0sXHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgYWN0aXZhdGVNZW51ICgpIHtcclxuICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSB0cnVlXHJcbiAgICB9LFxyXG4gICAgY2xlYXJhYmxlQ2FsbGJhY2sgKCkge1xyXG4gICAgICB0aGlzLnNldFZhbHVlKHRoaXMubXVsdGlwbGUgPyBbXSA6IHVuZGVmaW5lZClcclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4gdGhpcy4kcmVmcy5pbnB1dC5mb2N1cygpKVxyXG5cclxuICAgICAgaWYgKHRoaXMub3Blbk9uQ2xlYXIpIHRoaXMuaXNNZW51QWN0aXZlID0gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGNsb3NlQ29uZGl0aW9uYWwgKGUpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICAvLyBDbGljayBvcmlnaW5hdGVzIGZyb20gb3V0c2lkZSB0aGUgbWVudSBjb250ZW50XHJcbiAgICAgICAgISF0aGlzLmNvbnRlbnQgJiZcclxuICAgICAgICAhdGhpcy5jb250ZW50LmNvbnRhaW5zKGUudGFyZ2V0KSAmJlxyXG5cclxuICAgICAgICAvLyBDbGljayBvcmlnaW5hdGVzIGZyb20gb3V0c2lkZSB0aGUgZWxlbWVudFxyXG4gICAgICAgICEhdGhpcy4kZWwgJiZcclxuICAgICAgICAhdGhpcy4kZWwuY29udGFpbnMoZS50YXJnZXQpICYmXHJcbiAgICAgICAgZS50YXJnZXQgIT09IHRoaXMuJGVsXHJcbiAgICAgIClcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJEdXBsaWNhdGVzIChhcnIpIHtcclxuICAgICAgY29uc3QgdW5pcXVlVmFsdWVzID0gbmV3IE1hcCgpXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhcnIubGVuZ3RoOyArK2luZGV4KSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGFycltpbmRleF1cclxuICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmdldFZhbHVlKGl0ZW0pXHJcblxyXG4gICAgICAgIC8vIFRPRE86IGNvbXBhcmF0b3JcclxuICAgICAgICAhdW5pcXVlVmFsdWVzLmhhcyh2YWwpICYmIHVuaXF1ZVZhbHVlcy5zZXQodmFsLCBpdGVtKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKHVuaXF1ZVZhbHVlcy52YWx1ZXMoKSlcclxuICAgIH0sXHJcbiAgICBmaW5kRXhpc3RpbmdJbmRleCAoaXRlbSkge1xyXG4gICAgICBjb25zdCBpdGVtVmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW0pXHJcblxyXG4gICAgICByZXR1cm4gKHRoaXMuaW50ZXJuYWxWYWx1ZSB8fCBbXSkuZmluZEluZGV4KGkgPT4gdGhpcy52YWx1ZUNvbXBhcmF0b3IodGhpcy5nZXRWYWx1ZShpKSwgaXRlbVZhbHVlKSlcclxuICAgIH0sXHJcbiAgICBnZW5DaGlwU2VsZWN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICBjb25zdCBpc0Rpc2FibGVkID0gKFxyXG4gICAgICAgIHRoaXMuZGlzYWJsZWQgfHxcclxuICAgICAgICB0aGlzLnJlYWRvbmx5IHx8XHJcbiAgICAgICAgdGhpcy5nZXREaXNhYmxlZChpdGVtKVxyXG4gICAgICApXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQ2hpcCwge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1jaGlwLS1zZWxlY3QtbXVsdGknLFxyXG4gICAgICAgIGF0dHJzOiB7IHRhYmluZGV4OiAtMSB9LFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBjbG9zZTogdGhpcy5kZWxldGFibGVDaGlwcyAmJiAhaXNEaXNhYmxlZCxcclxuICAgICAgICAgIGRpc2FibGVkOiBpc0Rpc2FibGVkLFxyXG4gICAgICAgICAgc2VsZWN0ZWQ6IGluZGV4ID09PSB0aGlzLnNlbGVjdGVkSW5kZXgsXHJcbiAgICAgICAgICBzbWFsbDogdGhpcy5zbWFsbENoaXBzXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2s6IGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNEaXNhYmxlZCkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGlucHV0OiAoKSA9PiB0aGlzLm9uQ2hpcElucHV0KGl0ZW0pXHJcbiAgICAgICAgfSxcclxuICAgICAgICBrZXk6IHRoaXMuZ2V0VmFsdWUoaXRlbSlcclxuICAgICAgfSwgdGhpcy5nZXRUZXh0KGl0ZW0pKVxyXG4gICAgfSxcclxuICAgIGdlbkNvbW1hU2VsZWN0aW9uIChpdGVtLCBpbmRleCwgbGFzdCkge1xyXG4gICAgICAvLyBJdGVtIG1heSBiZSBhbiBvYmplY3RcclxuICAgICAgLy8gVE9ETzogUmVtb3ZlIEpTT04uc3RyaW5naWZ5XHJcbiAgICAgIGNvbnN0IGtleSA9IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0VmFsdWUoaXRlbSkpXHJcbiAgICAgIGNvbnN0IGNvbG9yID0gaW5kZXggPT09IHRoaXMuc2VsZWN0ZWRJbmRleCAmJiB0aGlzLmNvbG9yXHJcbiAgICAgIGNvbnN0IGlzRGlzYWJsZWQgPSAoXHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZCB8fFxyXG4gICAgICAgIHRoaXMuZ2V0RGlzYWJsZWQoaXRlbSlcclxuICAgICAgKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHRoaXMuc2V0VGV4dENvbG9yKGNvbG9yLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXNlbGVjdF9fc2VsZWN0aW9uIHYtc2VsZWN0X19zZWxlY3Rpb24tLWNvbW1hJyxcclxuICAgICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgICAndi1zZWxlY3RfX3NlbGVjdGlvbi0tZGlzYWJsZWQnOiBpc0Rpc2FibGVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBrZXlcclxuICAgICAgfSksIGAke3RoaXMuZ2V0VGV4dChpdGVtKX0ke2xhc3QgPyAnJyA6ICcsICd9YClcclxuICAgIH0sXHJcbiAgICBnZW5EZWZhdWx0U2xvdCAoKSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbnMgPSB0aGlzLmdlblNlbGVjdGlvbnMoKVxyXG4gICAgICBjb25zdCBpbnB1dCA9IHRoaXMuZ2VuSW5wdXQoKVxyXG5cclxuICAgICAgLy8gSWYgdGhlIHJldHVybiBpcyBhbiBlbXB0eSBhcnJheVxyXG4gICAgICAvLyBwdXNoIHRoZSBpbnB1dFxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3Rpb25zKSkge1xyXG4gICAgICAgIHNlbGVjdGlvbnMucHVzaChpbnB1dClcclxuICAgICAgLy8gT3RoZXJ3aXNlIHB1c2ggaXQgaW50byBjaGlsZHJlblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGVjdGlvbnMuY2hpbGRyZW4gPSBzZWxlY3Rpb25zLmNoaWxkcmVuIHx8IFtdXHJcbiAgICAgICAgc2VsZWN0aW9ucy5jaGlsZHJlbi5wdXNoKGlucHV0KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1zZWxlY3RfX3Nsb3QnLFxyXG4gICAgICAgICAgZGlyZWN0aXZlczogdGhpcy5kaXJlY3RpdmVzXHJcbiAgICAgICAgfSwgW1xyXG4gICAgICAgICAgdGhpcy5nZW5MYWJlbCgpLFxyXG4gICAgICAgICAgdGhpcy5wcmVmaXggPyB0aGlzLmdlbkFmZml4KCdwcmVmaXgnKSA6IG51bGwsXHJcbiAgICAgICAgICBzZWxlY3Rpb25zLFxyXG4gICAgICAgICAgdGhpcy5zdWZmaXggPyB0aGlzLmdlbkFmZml4KCdzdWZmaXgnKSA6IG51bGwsXHJcbiAgICAgICAgICB0aGlzLmdlbkNsZWFySWNvbigpLFxyXG4gICAgICAgICAgdGhpcy5nZW5JY29uU2xvdCgpXHJcbiAgICAgICAgXSksXHJcbiAgICAgICAgdGhpcy5nZW5NZW51KCksXHJcbiAgICAgICAgdGhpcy5nZW5Qcm9ncmVzcygpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBnZW5JbnB1dCAoKSB7XHJcbiAgICAgIGNvbnN0IGlucHV0ID0gVlRleHRGaWVsZC5vcHRpb25zLm1ldGhvZHMuZ2VuSW5wdXQuY2FsbCh0aGlzKVxyXG5cclxuICAgICAgaW5wdXQuZGF0YS5kb21Qcm9wcy52YWx1ZSA9IG51bGxcclxuICAgICAgaW5wdXQuZGF0YS5hdHRycy5yZWFkb25seSA9IHRydWVcclxuICAgICAgaW5wdXQuZGF0YS5hdHRyc1snYXJpYS1yZWFkb25seSddID0gU3RyaW5nKHRoaXMucmVhZG9ubHkpXHJcbiAgICAgIGlucHV0LmRhdGEub24ua2V5cHJlc3MgPSB0aGlzLm9uS2V5UHJlc3NcclxuXHJcbiAgICAgIHJldHVybiBpbnB1dFxyXG4gICAgfSxcclxuICAgIGdlbkxpc3QgKCkge1xyXG4gICAgICAvLyBJZiB0aGVyZSdzIG5vIHNsb3RzLCB3ZSBjYW4gdXNlIGEgY2FjaGVkIFZOb2RlIHRvIGltcHJvdmUgcGVyZm9ybWFuY2VcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzWyduby1kYXRhJ10gfHwgdGhpcy4kc2xvdHNbJ3ByZXBlbmQtaXRlbSddIHx8IHRoaXMuJHNsb3RzWydhcHBlbmQtaXRlbSddKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuTGlzdFdpdGhTbG90KClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdGF0aWNMaXN0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZW5MaXN0V2l0aFNsb3QgKCkge1xyXG4gICAgICBjb25zdCBzbG90cyA9IFsncHJlcGVuZC1pdGVtJywgJ25vLWRhdGEnLCAnYXBwZW5kLWl0ZW0nXVxyXG4gICAgICAgIC5maWx0ZXIoc2xvdE5hbWUgPT4gdGhpcy4kc2xvdHNbc2xvdE5hbWVdKVxyXG4gICAgICAgIC5tYXAoc2xvdE5hbWUgPT4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnLCB7XHJcbiAgICAgICAgICBzbG90OiBzbG90TmFtZVxyXG4gICAgICAgIH0sIHRoaXMuJHNsb3RzW3Nsb3ROYW1lXSkpXHJcbiAgICAgIC8vIFJlcXVpcmVzIGRlc3RydWN0dXJpbmcgZHVlIHRvIFZ1ZVxyXG4gICAgICAvLyBtb2RpZnlpbmcgdGhlIGBvbmAgcHJvcGVydHkgd2hlbiBwYXNzZWRcclxuICAgICAgLy8gYXMgYSByZWZlcmVuY2VkIG9iamVjdFxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWU2VsZWN0TGlzdCwge1xyXG4gICAgICAgIC4uLnRoaXMubGlzdERhdGFcclxuICAgICAgfSwgc2xvdHMpXHJcbiAgICB9LFxyXG4gICAgZ2VuTWVudSAoKSB7XHJcbiAgICAgIGNvbnN0IHByb3BzID0gdGhpcy4kX21lbnVQcm9wc1xyXG4gICAgICBwcm9wcy5hY3RpdmF0b3IgPSB0aGlzLiRyZWZzWydpbnB1dC1zbG90J11cclxuXHJcbiAgICAgIC8vIERlcHJlY2F0ZSB1c2luZyBtZW51IHByb3BzIGRpcmVjdGx5XHJcbiAgICAgIC8vIFRPRE86IHJlbW92ZSAoMi4wKVxyXG4gICAgICBjb25zdCBpbmhlcml0ZWRQcm9wcyA9IE9iamVjdC5rZXlzKFZNZW51Lm9wdGlvbnMucHJvcHMpXHJcblxyXG4gICAgICBjb25zdCBkZXByZWNhdGVkUHJvcHMgPSBPYmplY3Qua2V5cyh0aGlzLiRhdHRycykucmVkdWNlKChhY2MsIGF0dHIpID0+IHtcclxuICAgICAgICBpZiAoaW5oZXJpdGVkUHJvcHMuaW5jbHVkZXMoY2FtZWxpemUoYXR0cikpKSBhY2MucHVzaChhdHRyKVxyXG4gICAgICAgIHJldHVybiBhY2NcclxuICAgICAgfSwgW10pXHJcblxyXG4gICAgICBmb3IgKGNvbnN0IHByb3Agb2YgZGVwcmVjYXRlZFByb3BzKSB7XHJcbiAgICAgICAgcHJvcHNbY2FtZWxpemUocHJvcCldID0gdGhpcy4kYXR0cnNbcHJvcF1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgICBpZiAoZGVwcmVjYXRlZFByb3BzLmxlbmd0aCkge1xyXG4gICAgICAgICAgY29uc3QgbXVsdGlwbGUgPSBkZXByZWNhdGVkUHJvcHMubGVuZ3RoID4gMVxyXG4gICAgICAgICAgbGV0IHJlcGxhY2VtZW50ID0gZGVwcmVjYXRlZFByb3BzLnJlZHVjZSgoYWNjLCBwKSA9PiB7XHJcbiAgICAgICAgICAgIGFjY1tjYW1lbGl6ZShwKV0gPSB0aGlzLiRhdHRyc1twXVxyXG4gICAgICAgICAgICByZXR1cm4gYWNjXHJcbiAgICAgICAgICB9LCB7fSlcclxuICAgICAgICAgIGNvbnN0IHByb3BzID0gZGVwcmVjYXRlZFByb3BzLm1hcChwID0+IGAnJHtwfSdgKS5qb2luKCcsICcpXHJcbiAgICAgICAgICBjb25zdCBzZXBhcmF0b3IgPSBtdWx0aXBsZSA/ICdcXG4nIDogJ1xcJydcclxuXHJcbiAgICAgICAgICBjb25zdCBvbmx5Qm9vbHMgPSBPYmplY3Qua2V5cyhyZXBsYWNlbWVudCkuZXZlcnkocHJvcCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BUeXBlID0gVk1lbnUub3B0aW9ucy5wcm9wc1twcm9wXVxyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJlcGxhY2VtZW50W3Byb3BdXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSB8fCAoKHByb3BUeXBlLnR5cGUgfHwgcHJvcFR5cGUpID09PSBCb29sZWFuICYmIHZhbHVlID09PSAnJylcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgaWYgKG9ubHlCb29scykge1xyXG4gICAgICAgICAgICByZXBsYWNlbWVudCA9IE9iamVjdC5rZXlzKHJlcGxhY2VtZW50KS5qb2luKCcsICcpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXBsYWNlbWVudCA9IEpTT04uc3RyaW5naWZ5KHJlcGxhY2VtZW50LCBudWxsLCBtdWx0aXBsZSA/IDIgOiAwKVxyXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cIihbXihcIilcIl0rKVwiOi9nLCAnJDE6JylcclxuICAgICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgJ1xcJycpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY29uc29sZVdhcm4oXHJcbiAgICAgICAgICAgIGAke3Byb3BzfSAke211bHRpcGxlID8gJ2FyZScgOiAnaXMnfSBkZXByZWNhdGVkLCB1c2UgYCArXHJcbiAgICAgICAgICAgIGAke3NlcGFyYXRvcn0ke29ubHlCb29scyA/ICcnIDogJzonfW1lbnUtcHJvcHM9XCIke3JlcGxhY2VtZW50fVwiJHtzZXBhcmF0b3J9IGluc3RlYWRgLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBdHRhY2ggdG8gcm9vdCBlbCBzbyB0aGF0XHJcbiAgICAgIC8vIG1lbnUgY292ZXJzIHByZXBlbmQvYXBwZW5kIGljb25zXHJcbiAgICAgIGlmIChcclxuICAgICAgICAvLyBUT0RPOiBtYWtlIHRoaXMgYSBjb21wdXRlZCBwcm9wZXJ0eSBvciBoZWxwZXIgb3Igc29tZXRoaW5nXHJcbiAgICAgICAgdGhpcy5hdHRhY2ggPT09ICcnIHx8IC8vIElmIHVzZWQgYXMgYSBib29sZWFuIHByb3AgKDx2LW1lbnUgYXR0YWNoPilcclxuICAgICAgICB0aGlzLmF0dGFjaCA9PT0gdHJ1ZSB8fCAvLyBJZiBib3VuZCB0byBhIGJvb2xlYW4gKDx2LW1lbnUgOmF0dGFjaD1cInRydWVcIj4pXHJcbiAgICAgICAgdGhpcy5hdHRhY2ggPT09ICdhdHRhY2gnIC8vIElmIGJvdW5kIGFzIGJvb2xlYW4gcHJvcCBpbiBwdWcgKHYtbWVudShhdHRhY2gpKVxyXG4gICAgICApIHtcclxuICAgICAgICBwcm9wcy5hdHRhY2ggPSB0aGlzLiRlbFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHByb3BzLmF0dGFjaCA9IHRoaXMuYXR0YWNoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZNZW51LCB7XHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGlucHV0OiB2YWwgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHZhbFxyXG4gICAgICAgICAgICB0aGlzLmlzRm9jdXNlZCA9IHZhbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAnbWVudSdcclxuICAgICAgfSwgW3RoaXMuZ2VuTGlzdCgpXSlcclxuICAgIH0sXHJcbiAgICBnZW5TZWxlY3Rpb25zICgpIHtcclxuICAgICAgbGV0IGxlbmd0aCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGhcclxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBuZXcgQXJyYXkobGVuZ3RoKVxyXG5cclxuICAgICAgbGV0IGdlblNlbGVjdGlvblxyXG4gICAgICBpZiAodGhpcy4kc2NvcGVkU2xvdHMuc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgZ2VuU2VsZWN0aW9uID0gdGhpcy5nZW5TbG90U2VsZWN0aW9uXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5oYXNDaGlwcykge1xyXG4gICAgICAgIGdlblNlbGVjdGlvbiA9IHRoaXMuZ2VuQ2hpcFNlbGVjdGlvblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGdlblNlbGVjdGlvbiA9IHRoaXMuZ2VuQ29tbWFTZWxlY3Rpb25cclxuICAgICAgfVxyXG5cclxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XHJcbiAgICAgICAgY2hpbGRyZW5bbGVuZ3RoXSA9IGdlblNlbGVjdGlvbihcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1tsZW5ndGhdLFxyXG4gICAgICAgICAgbGVuZ3RoLFxyXG4gICAgICAgICAgbGVuZ3RoID09PSBjaGlsZHJlbi5sZW5ndGggLSAxXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1zZWxlY3RfX3NlbGVjdGlvbnMnXHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIGdlblNsb3RTZWxlY3Rpb24gKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRzY29wZWRTbG90cy5zZWxlY3Rpb24oe1xyXG4gICAgICAgIHBhcmVudDogdGhpcyxcclxuICAgICAgICBpdGVtLFxyXG4gICAgICAgIGluZGV4LFxyXG4gICAgICAgIHNlbGVjdGVkOiBpbmRleCA9PT0gdGhpcy5zZWxlY3RlZEluZGV4LFxyXG4gICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkIHx8IHRoaXMucmVhZG9ubHlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZXRNZW51SW5kZXggKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kcmVmcy5tZW51ID8gdGhpcy4kcmVmcy5tZW51Lmxpc3RJbmRleCA6IC0xXHJcbiAgICB9LFxyXG4gICAgZ2V0RGlzYWJsZWQgKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIGdldFByb3BlcnR5RnJvbUl0ZW0oaXRlbSwgdGhpcy5pdGVtRGlzYWJsZWQsIGZhbHNlKVxyXG4gICAgfSxcclxuICAgIGdldFRleHQgKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIGdldFByb3BlcnR5RnJvbUl0ZW0oaXRlbSwgdGhpcy5pdGVtVGV4dCwgaXRlbSlcclxuICAgIH0sXHJcbiAgICBnZXRWYWx1ZSAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gZ2V0UHJvcGVydHlGcm9tSXRlbShpdGVtLCB0aGlzLml0ZW1WYWx1ZSwgdGhpcy5nZXRUZXh0KGl0ZW0pKVxyXG4gICAgfSxcclxuICAgIG9uQmx1ciAoZSkge1xyXG4gICAgICB0aGlzLiRlbWl0KCdibHVyJywgZSlcclxuICAgIH0sXHJcbiAgICBvbkNoaXBJbnB1dCAoaXRlbSkge1xyXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkgdGhpcy5zZWxlY3RJdGVtKGl0ZW0pXHJcbiAgICAgIGVsc2UgdGhpcy5zZXRWYWx1ZShudWxsKVxyXG4gICAgICAvLyBJZiBhbGwgaXRlbXMgaGF2ZSBiZWVuIGRlbGV0ZWQsXHJcbiAgICAgIC8vIG9wZW4gYHYtbWVudWBcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gLTFcclxuICAgIH0sXHJcbiAgICBvbkNsaWNrICgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNEaXNhYmxlZCkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuXHJcbiAgICAgIGlmICghdGhpcy5pc0ZvY3VzZWQpIHtcclxuICAgICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWVcclxuICAgICAgICB0aGlzLiRlbWl0KCdmb2N1cycpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkVudGVyRG93biAoKSB7XHJcbiAgICAgIHRoaXMub25CbHVyKClcclxuICAgIH0sXHJcbiAgICBvbkVzY0Rvd24gKGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGlmICh0aGlzLmlzTWVudUFjdGl2ZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbktleVByZXNzIChlKSB7XHJcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IEtFWUJPQVJEX0xPT0tVUF9USFJFU0hPTEQgPSAxMDAwIC8vIG1pbGxpc2Vjb25kc1xyXG4gICAgICBjb25zdCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKVxyXG4gICAgICBpZiAobm93IC0gdGhpcy5rZXlib2FyZExvb2t1cExhc3RUaW1lID4gS0VZQk9BUkRfTE9PS1VQX1RIUkVTSE9MRCkge1xyXG4gICAgICAgIHRoaXMua2V5Ym9hcmRMb29rdXBQcmVmaXggPSAnJ1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMua2V5Ym9hcmRMb29rdXBQcmVmaXggKz0gZS5rZXkudG9Mb3dlckNhc2UoKVxyXG4gICAgICB0aGlzLmtleWJvYXJkTG9va3VwTGFzdFRpbWUgPSBub3dcclxuXHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hbGxJdGVtcy5maW5kSW5kZXgoaXRlbSA9PiB0aGlzLmdldFRleHQoaXRlbSkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHRoaXMua2V5Ym9hcmRMb29rdXBQcmVmaXgpKVxyXG4gICAgICBjb25zdCBpdGVtID0gdGhpcy5hbGxJdGVtc1tpbmRleF1cclxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5yZXR1cm5PYmplY3QgPyBpdGVtIDogdGhpcy5nZXRWYWx1ZShpdGVtKSlcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0TWVudUluZGV4KGluZGV4KSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uS2V5RG93biAoZSkge1xyXG4gICAgICBjb25zdCBrZXlDb2RlID0gZS5rZXlDb2RlXHJcblxyXG4gICAgICAvLyBJZiBlbnRlciwgc3BhY2UsIHVwLCBvciBkb3duIGlzIHByZXNzZWQsIG9wZW4gbWVudVxyXG4gICAgICBpZiAoIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuaXNNZW51QWN0aXZlICYmIFtcclxuICAgICAgICBrZXlDb2Rlcy5lbnRlcixcclxuICAgICAgICBrZXlDb2Rlcy5zcGFjZSxcclxuICAgICAgICBrZXlDb2Rlcy51cCwga2V5Q29kZXMuZG93blxyXG4gICAgICBdLmluY2x1ZGVzKGtleUNvZGUpKSB0aGlzLmFjdGl2YXRlTWVudSgpXHJcblxyXG4gICAgICBpZiAodGhpcy5pc01lbnVBY3RpdmUgJiYgdGhpcy4kcmVmcy5tZW51KSB0aGlzLiRyZWZzLm1lbnUuY2hhbmdlTGlzdEluZGV4KGUpXHJcblxyXG4gICAgICAvLyBUaGlzIHNob3VsZCBkbyBzb21ldGhpbmcgZGlmZmVyZW50XHJcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lbnRlcikgcmV0dXJuIHRoaXMub25FbnRlckRvd24oZSlcclxuXHJcbiAgICAgIC8vIElmIGVzY2FwZSBkZWFjdGl2YXRlIHRoZSBtZW51XHJcbiAgICAgIGlmIChrZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MpIHJldHVybiB0aGlzLm9uRXNjRG93bihlKVxyXG5cclxuICAgICAgLy8gSWYgdGFiIC0gc2VsZWN0IGl0ZW0gb3IgY2xvc2UgbWVudVxyXG4gICAgICBpZiAoa2V5Q29kZSA9PT0ga2V5Q29kZXMudGFiKSByZXR1cm4gdGhpcy5vblRhYkRvd24oZSlcclxuICAgIH0sXHJcbiAgICBvbk1vdXNlVXAgKGUpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzTW91c2VEb3duKSB7XHJcbiAgICAgICAgY29uc3QgYXBwZW5kSW5uZXIgPSB0aGlzLiRyZWZzWydhcHBlbmQtaW5uZXInXVxyXG5cclxuICAgICAgICAvLyBJZiBhcHBlbmQgaW5uZXIgaXMgcHJlc2VudFxyXG4gICAgICAgIC8vIGFuZCB0aGUgdGFyZ2V0IGlzIGl0c2VsZlxyXG4gICAgICAgIC8vIG9yIGluc2lkZSwgdG9nZ2xlIG1lbnVcclxuICAgICAgICBpZiAodGhpcy5pc01lbnVBY3RpdmUgJiZcclxuICAgICAgICAgIGFwcGVuZElubmVyICYmXHJcbiAgICAgICAgICAoYXBwZW5kSW5uZXIgPT09IGUudGFyZ2V0IHx8XHJcbiAgICAgICAgICBhcHBlbmRJbm5lci5jb250YWlucyhlLnRhcmdldCkpXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiAodGhpcy5pc01lbnVBY3RpdmUgPSAhdGhpcy5pc01lbnVBY3RpdmUpKVxyXG4gICAgICAgIC8vIElmIHVzZXIgaXMgY2xpY2tpbmcgaW4gdGhlIGNvbnRhaW5lclxyXG4gICAgICAgIC8vIGFuZCBmaWVsZCBpcyBlbmNsb3NlZCwgYWN0aXZhdGUgaXRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNFbmNsb3NlZCAmJiAhdGhpcy5pc0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLm9uTW91c2VVcC5jYWxsKHRoaXMsIGUpXHJcbiAgICB9LFxyXG4gICAgb25TY3JvbGwgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuaXNNZW51QWN0aXZlKSB7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+ICh0aGlzLmNvbnRlbnQuc2Nyb2xsVG9wID0gMCkpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGFzdEl0ZW0gPj0gdGhpcy5jb21wdXRlZEl0ZW1zLmxlbmd0aCkgcmV0dXJuXHJcblxyXG4gICAgICAgIGNvbnN0IHNob3dNb3JlSXRlbXMgPSAoXHJcbiAgICAgICAgICB0aGlzLmNvbnRlbnQuc2Nyb2xsSGVpZ2h0IC1cclxuICAgICAgICAgICh0aGlzLmNvbnRlbnQuc2Nyb2xsVG9wICtcclxuICAgICAgICAgIHRoaXMuY29udGVudC5jbGllbnRIZWlnaHQpXHJcbiAgICAgICAgKSA8IDIwMFxyXG5cclxuICAgICAgICBpZiAoc2hvd01vcmVJdGVtcykge1xyXG4gICAgICAgICAgdGhpcy5sYXN0SXRlbSArPSAyMFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uVGFiRG93biAoZSkge1xyXG4gICAgICBjb25zdCBtZW51SW5kZXggPSB0aGlzLmdldE1lbnVJbmRleCgpXHJcblxyXG4gICAgICBjb25zdCBsaXN0VGlsZSA9IHRoaXMuJHJlZnMubWVudS50aWxlc1ttZW51SW5kZXhdXHJcblxyXG4gICAgICAvLyBBbiBpdGVtIHRoYXQgaXMgc2VsZWN0ZWQgYnlcclxuICAgICAgLy8gbWVudS1pbmRleCBzaG91bGQgdG9nZ2xlZFxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbGlzdFRpbGUgJiZcclxuICAgICAgICBsaXN0VGlsZS5jbGFzc05hbWUuaW5kZXhPZigndi1saXN0X190aWxlLS1oaWdobGlnaHRlZCcpID4gLTEgJiZcclxuICAgICAgICB0aGlzLmlzTWVudUFjdGl2ZSAmJlxyXG4gICAgICAgIG1lbnVJbmRleCA+IC0xXHJcbiAgICAgICkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgICAgbGlzdFRpbGUuY2xpY2soKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIElmIHdlIG1ha2UgaXQgaGVyZSxcclxuICAgICAgICAvLyB0aGUgdXNlciBoYXMgbm8gc2VsZWN0ZWQgaW5kZXhlc1xyXG4gICAgICAgIC8vIGFuZCBpcyBwcm9iYWJseSB0YWJiaW5nIG91dFxyXG4gICAgICAgIHRoaXMuYmx1cihlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VsZWN0SXRlbSAoaXRlbSkge1xyXG4gICAgICBpZiAoIXRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMucmV0dXJuT2JqZWN0ID8gaXRlbSA6IHRoaXMuZ2V0VmFsdWUoaXRlbSkpXHJcbiAgICAgICAgdGhpcy5pc01lbnVBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSAodGhpcy5pbnRlcm5hbFZhbHVlIHx8IFtdKS5zbGljZSgpXHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuZmluZEV4aXN0aW5nSW5kZXgoaXRlbSlcclxuXHJcbiAgICAgICAgaSAhPT0gLTEgPyBpbnRlcm5hbFZhbHVlLnNwbGljZShpLCAxKSA6IGludGVybmFsVmFsdWUucHVzaChpdGVtKVxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoaW50ZXJuYWxWYWx1ZS5tYXAoaSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5yZXR1cm5PYmplY3QgPyBpIDogdGhpcy5nZXRWYWx1ZShpKVxyXG4gICAgICAgIH0pKVxyXG5cclxuICAgICAgICAvLyBXaGVuIHNlbGVjdGluZyBtdWx0aXBsZVxyXG4gICAgICAgIC8vIGFkanVzdCBtZW51IGFmdGVyIGVhY2hcclxuICAgICAgICAvLyBzZWxlY3Rpb25cclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLiRyZWZzLm1lbnUgJiZcclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5tZW51LnVwZGF0ZURpbWVuc2lvbnMoKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXRNZW51SW5kZXggKGluZGV4KSB7XHJcbiAgICAgIHRoaXMuJHJlZnMubWVudSAmJiAodGhpcy4kcmVmcy5tZW51Lmxpc3RJbmRleCA9IGluZGV4KVxyXG4gICAgfSxcclxuICAgIHNldFNlbGVjdGVkSXRlbXMgKCkge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gW11cclxuICAgICAgY29uc3QgdmFsdWVzID0gIXRoaXMubXVsdGlwbGUgfHwgIUFycmF5LmlzQXJyYXkodGhpcy5pbnRlcm5hbFZhbHVlKVxyXG4gICAgICAgID8gW3RoaXMuaW50ZXJuYWxWYWx1ZV1cclxuICAgICAgICA6IHRoaXMuaW50ZXJuYWxWYWx1ZVxyXG5cclxuICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYWxsSXRlbXMuZmluZEluZGV4KHYgPT4gdGhpcy52YWx1ZUNvbXBhcmF0b3IoXHJcbiAgICAgICAgICB0aGlzLmdldFZhbHVlKHYpLFxyXG4gICAgICAgICAgdGhpcy5nZXRWYWx1ZSh2YWx1ZSlcclxuICAgICAgICApKVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgc2VsZWN0ZWRJdGVtcy5wdXNoKHRoaXMuYWxsSXRlbXNbaW5kZXhdKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gc2VsZWN0ZWRJdGVtc1xyXG4gICAgfSxcclxuICAgIHNldFZhbHVlICh2YWx1ZSkge1xyXG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuaW50ZXJuYWxWYWx1ZVxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWx1ZVxyXG4gICAgICB2YWx1ZSAhPT0gb2xkVmFsdWUgJiYgdGhpcy4kZW1pdCgnY2hhbmdlJywgdmFsdWUpXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=