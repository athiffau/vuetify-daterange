import VBtn from '../components/VBtn';
import VIcon from '../components/VIcon';
import VSelect from '../components/VSelect';
import Filterable from './filterable';
import Themeable from './themeable';
import Loadable from './loadable';
import { getObjectValueByPath, isObject } from '../util/helpers';
import { consoleWarn } from '../util/console';
/**
 * DataIterable
 *
 * @mixin
 *
 * Base behavior for data table and data iterator
 * providing selection, pagination, sorting and filtering.
 *
 */
/* @vue/component */
export default {
    name: 'data-iterable',
    mixins: [Filterable, Loadable, Themeable],
    props: {
        expand: Boolean,
        hideActions: Boolean,
        disableInitialSort: Boolean,
        mustSort: Boolean,
        noResultsText: {
            type: String,
            default: '$vuetify.dataIterator.noResultsText'
        },
        nextIcon: {
            type: String,
            default: '$vuetify.icons.next'
        },
        prevIcon: {
            type: String,
            default: '$vuetify.icons.prev'
        },
        rowsPerPageItems: {
            type: Array,
            default() {
                return [
                    5,
                    10,
                    25,
                    {
                        text: '$vuetify.dataIterator.rowsPerPageAll',
                        value: -1
                    }
                ];
            }
        },
        rowsPerPageText: {
            type: String,
            default: '$vuetify.dataIterator.rowsPerPageText'
        },
        selectAll: [Boolean, String],
        search: {
            required: false
        },
        filter: {
            type: Function,
            default: (val, search) => {
                return val != null &&
                    typeof val !== 'boolean' &&
                    val.toString().toLowerCase().indexOf(search) !== -1;
            }
        },
        customFilter: {
            type: Function,
            default: (items, search, filter) => {
                search = search.toString().toLowerCase();
                if (search.trim() === '')
                    return items;
                return items.filter(i => (Object.keys(i).some(j => filter(i[j], search))));
            }
        },
        customSort: {
            type: Function,
            default: (items, index, isDescending) => {
                if (index === null)
                    return items;
                return items.sort((a, b) => {
                    let sortA = getObjectValueByPath(a, index);
                    let sortB = getObjectValueByPath(b, index);
                    if (isDescending) {
                        [sortA, sortB] = [sortB, sortA];
                    }
                    // Check if both are numbers
                    if (!isNaN(sortA) && !isNaN(sortB)) {
                        return sortA - sortB;
                    }
                    // Check if both cannot be evaluated
                    if (sortA === null && sortB === null) {
                        return 0;
                    }
                    [sortA, sortB] = [sortA, sortB]
                        .map(s => ((s || '').toString().toLocaleLowerCase()));
                    if (sortA > sortB)
                        return 1;
                    if (sortA < sortB)
                        return -1;
                    return 0;
                });
            }
        },
        value: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            required: true,
            default: () => []
        },
        totalItems: {
            type: Number,
            default: null
        },
        itemKey: {
            type: String,
            default: 'id'
        },
        pagination: {
            type: Object,
            default: () => { }
        }
    },
    data: () => ({
        searchLength: 0,
        defaultPagination: {
            descending: false,
            page: 1,
            rowsPerPage: 5,
            sortBy: null,
            totalItems: 0
        },
        expanded: {},
        actionsClasses: 'v-data-iterator__actions',
        actionsRangeControlsClasses: 'v-data-iterator__actions__range-controls',
        actionsSelectClasses: 'v-data-iterator__actions__select',
        actionsPaginationClasses: 'v-data-iterator__actions__pagination'
    }),
    computed: {
        computedPagination() {
            return this.hasPagination
                ? this.pagination
                : this.defaultPagination;
        },
        computedRowsPerPageItems() {
            return this.rowsPerPageItems.map(item => {
                return isObject(item)
                    ? Object.assign({}, item, {
                        text: this.$vuetify.t(item.text)
                    })
                    : { value: item, text: Number(item).toLocaleString(this.$vuetify.lang.current) };
            });
        },
        hasPagination() {
            const pagination = this.pagination || {};
            return Object.keys(pagination).length > 0;
        },
        hasSelectAll() {
            return this.selectAll !== undefined && this.selectAll !== false;
        },
        itemsLength() {
            if (this.hasSearch)
                return this.searchLength;
            return this.totalItems || this.items.length;
        },
        indeterminate() {
            return this.hasSelectAll && this.someItems && !this.everyItem;
        },
        everyItem() {
            return this.filteredItems.length &&
                this.filteredItems.every(i => this.isSelected(i));
        },
        someItems() {
            return this.filteredItems.some(i => this.isSelected(i));
        },
        getPage() {
            const { rowsPerPage } = this.computedPagination;
            return rowsPerPage === Object(rowsPerPage)
                ? rowsPerPage.value
                : rowsPerPage;
        },
        pageStart() {
            return this.getPage === -1
                ? 0
                : (this.computedPagination.page - 1) * this.getPage;
        },
        pageStop() {
            return this.getPage === -1
                ? this.itemsLength
                : this.computedPagination.page * this.getPage;
        },
        filteredItems() {
            return this.filteredItemsImpl();
        },
        selected() {
            const selected = {};
            for (let index = 0; index < this.value.length; index++) {
                const key = getObjectValueByPath(this.value[index], this.itemKey);
                selected[key] = true;
            }
            return selected;
        },
        hasSearch() {
            return this.search != null;
        }
    },
    watch: {
        items() {
            if (this.pageStart >= this.itemsLength) {
                this.resetPagination();
            }
        },
        search() {
            this.$nextTick(() => {
                this.updatePagination({ page: 1, totalItems: this.itemsLength });
            });
        },
        'computedPagination.sortBy': 'resetPagination',
        'computedPagination.descending': 'resetPagination'
    },
    methods: {
        initPagination() {
            if (!this.rowsPerPageItems.length) {
                consoleWarn(`The prop 'rows-per-page-items' can not be empty`, this);
            }
            else {
                this.defaultPagination.rowsPerPage = this.rowsPerPageItems[0];
            }
            this.defaultPagination.totalItems = this.items.length;
            this.updatePagination(Object.assign({}, this.defaultPagination, this.pagination));
        },
        updatePagination(val) {
            const pagination = this.hasPagination
                ? this.pagination
                : this.defaultPagination;
            const updatedPagination = Object.assign({}, pagination, val);
            this.$emit('update:pagination', updatedPagination);
            if (!this.hasPagination) {
                this.defaultPagination = updatedPagination;
            }
        },
        isSelected(item) {
            return this.selected[getObjectValueByPath(item, this.itemKey)];
        },
        isExpanded(item) {
            return this.expanded[getObjectValueByPath(item, this.itemKey)];
        },
        filteredItemsImpl(...additionalFilterArgs) {
            if (this.totalItems)
                return this.items;
            let items = this.items.slice();
            if (this.hasSearch) {
                items = this.customFilter(items, this.search, this.filter, ...additionalFilterArgs);
                this.searchLength = items.length;
            }
            items = this.customSort(items, this.computedPagination.sortBy, this.computedPagination.descending);
            return this.hideActions &&
                !this.hasPagination
                ? items
                : items.slice(this.pageStart, this.pageStop);
        },
        resetPagination() {
            this.computedPagination.page !== 1 &&
                this.updatePagination({ page: 1 });
        },
        sort(index) {
            const { sortBy, descending } = this.computedPagination;
            if (sortBy === null) {
                this.updatePagination({ sortBy: index, descending: false });
            }
            else if (sortBy === index && !descending) {
                this.updatePagination({ descending: true });
            }
            else if (sortBy !== index) {
                this.updatePagination({ sortBy: index, descending: false });
            }
            else if (!this.mustSort) {
                this.updatePagination({ sortBy: null, descending: null });
            }
            else {
                this.updatePagination({ sortBy: index, descending: false });
            }
        },
        toggle(value) {
            const selected = Object.assign({}, this.selected);
            for (let index = 0; index < this.filteredItems.length; index++) {
                const key = getObjectValueByPath(this.filteredItems[index], this.itemKey);
                selected[key] = value;
            }
            this.$emit('input', this.items.filter(i => {
                const key = getObjectValueByPath(i, this.itemKey);
                return selected[key];
            }));
        },
        createProps(item, index) {
            const props = { item, index };
            const keyProp = this.itemKey;
            const itemKey = getObjectValueByPath(item, keyProp);
            Object.defineProperty(props, 'selected', {
                get: () => this.selected[itemKey],
                set: value => {
                    if (itemKey == null) {
                        consoleWarn(`"${keyProp}" attribute must be defined for item`, this);
                    }
                    let selected = this.value.slice();
                    if (value)
                        selected.push(item);
                    else
                        selected = selected.filter(i => getObjectValueByPath(i, keyProp) !== itemKey);
                    this.$emit('input', selected);
                }
            });
            Object.defineProperty(props, 'expanded', {
                get: () => this.expanded[itemKey],
                set: value => {
                    if (itemKey == null) {
                        consoleWarn(`"${keyProp}" attribute must be defined for item`, this);
                    }
                    if (!this.expand) {
                        for (const key in this.expanded) {
                            this.expanded.hasOwnProperty(key) && this.$set(this.expanded, key, false);
                        }
                    }
                    this.$set(this.expanded, itemKey, value);
                }
            });
            return props;
        },
        genItems() {
            if (!this.itemsLength && !this.items.length) {
                const noData = this.$slots['no-data'] || this.$vuetify.t(this.noDataText);
                return [this.genEmptyItems(noData)];
            }
            if (!this.filteredItems.length) {
                const noResults = this.$slots['no-results'] || this.$vuetify.t(this.noResultsText);
                return [this.genEmptyItems(noResults)];
            }
            return this.genFilteredItems();
        },
        genPrevIcon() {
            return this.$createElement(VBtn, {
                props: {
                    disabled: this.computedPagination.page === 1,
                    icon: true,
                    flat: true
                },
                on: {
                    click: () => {
                        const page = this.computedPagination.page;
                        this.updatePagination({ page: page - 1 });
                    }
                },
                attrs: {
                    'aria-label': this.$vuetify.t('$vuetify.dataIterator.prevPage')
                }
            }, [this.$createElement(VIcon, this.$vuetify.rtl ? this.nextIcon : this.prevIcon)]);
        },
        genNextIcon() {
            const pagination = this.computedPagination;
            const disabled = pagination.rowsPerPage < 0 ||
                pagination.page * pagination.rowsPerPage >= this.itemsLength ||
                this.pageStop < 0;
            return this.$createElement(VBtn, {
                props: {
                    disabled,
                    icon: true,
                    flat: true
                },
                on: {
                    click: () => {
                        const page = this.computedPagination.page;
                        this.updatePagination({ page: page + 1 });
                    }
                },
                attrs: {
                    'aria-label': this.$vuetify.t('$vuetify.dataIterator.nextPage')
                }
            }, [this.$createElement(VIcon, this.$vuetify.rtl ? this.prevIcon : this.nextIcon)]);
        },
        genSelect() {
            return this.$createElement('div', {
                'class': this.actionsSelectClasses
            }, [
                this.$vuetify.t(this.rowsPerPageText),
                this.$createElement(VSelect, {
                    attrs: {
                        'aria-label': this.$vuetify.t(this.rowsPerPageText)
                    },
                    props: {
                        items: this.computedRowsPerPageItems,
                        value: this.computedPagination.rowsPerPage,
                        hideDetails: true,
                        menuProps: {
                            auto: true,
                            dark: this.dark,
                            light: this.light,
                            minWidth: '75px'
                        }
                    },
                    on: {
                        input: val => {
                            this.updatePagination({
                                page: 1,
                                rowsPerPage: val
                            });
                        }
                    }
                })
            ]);
        },
        genPagination() {
            let pagination = '–';
            if (this.itemsLength) {
                const stop = this.itemsLength < this.pageStop || this.pageStop < 0
                    ? this.itemsLength
                    : this.pageStop;
                pagination = this.$scopedSlots.pageText
                    ? this.$scopedSlots.pageText({
                        pageStart: this.pageStart + 1,
                        pageStop: stop,
                        itemsLength: this.itemsLength
                    })
                    : this.$vuetify.t('$vuetify.dataIterator.pageText', ...([this.pageStart + 1, stop, this.itemsLength].map(n => Number(n).toLocaleString(this.$vuetify.lang.current))));
            }
            return this.$createElement('div', {
                'class': this.actionsPaginationClasses
            }, [pagination]);
        },
        genActions() {
            const rangeControls = this.$createElement('div', {
                'class': this.actionsRangeControlsClasses
            }, [
                this.genPagination(),
                this.genPrevIcon(),
                this.genNextIcon()
            ]);
            return [this.$createElement('div', {
                    'class': this.actionsClasses
                }, [
                    this.$slots['actions-prepend'] ? this.$createElement('div', {}, this.$slots['actions-prepend']) : null,
                    this.rowsPerPageItems.length > 1 ? this.genSelect() : null,
                    rangeControls,
                    this.$slots['actions-append'] ? this.$createElement('div', {}, this.$slots['actions-append']) : null
                ])];
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1pdGVyYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvZGF0YS1pdGVyYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSxvQkFBb0IsQ0FBQTtBQUNyQyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQTtBQUN2QyxPQUFPLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQTtBQUUzQyxPQUFPLFVBQVUsTUFBTSxjQUFjLENBQUE7QUFDckMsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBQ25DLE9BQU8sUUFBUSxNQUFNLFlBQVksQ0FBQTtBQUVqQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRTdDOzs7Ozs7OztHQVFHO0FBQ0gsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsZUFBZTtJQUVyQixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztJQUV6QyxLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsT0FBTztRQUNmLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLGtCQUFrQixFQUFFLE9BQU87UUFDM0IsUUFBUSxFQUFFLE9BQU87UUFDakIsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUNBQXFDO1NBQy9DO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPO2dCQUNMLE9BQU87b0JBQ0wsQ0FBQztvQkFDRCxFQUFFO29C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biBmcm9tICcuLi9jb21wb25lbnRzL1ZCdG4nXHJcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9jb21wb25lbnRzL1ZJY29uJ1xyXG5pbXBvcnQgVlNlbGVjdCBmcm9tICcuLi9jb21wb25lbnRzL1ZTZWxlY3QnXHJcblxyXG5pbXBvcnQgRmlsdGVyYWJsZSBmcm9tICcuL2ZpbHRlcmFibGUnXHJcbmltcG9ydCBUaGVtZWFibGUgZnJvbSAnLi90aGVtZWFibGUnXHJcbmltcG9ydCBMb2FkYWJsZSBmcm9tICcuL2xvYWRhYmxlJ1xyXG5cclxuaW1wb3J0IHsgZ2V0T2JqZWN0VmFsdWVCeVBhdGgsIGlzT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8qKlxyXG4gKiBEYXRhSXRlcmFibGVcclxuICpcclxuICogQG1peGluXHJcbiAqXHJcbiAqIEJhc2UgYmVoYXZpb3IgZm9yIGRhdGEgdGFibGUgYW5kIGRhdGEgaXRlcmF0b3JcclxuICogcHJvdmlkaW5nIHNlbGVjdGlvbiwgcGFnaW5hdGlvbiwgc29ydGluZyBhbmQgZmlsdGVyaW5nLlxyXG4gKlxyXG4gKi9cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICdkYXRhLWl0ZXJhYmxlJyxcclxuXHJcbiAgbWl4aW5zOiBbRmlsdGVyYWJsZSwgTG9hZGFibGUsIFRoZW1lYWJsZV0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBleHBhbmQ6IEJvb2xlYW4sXHJcbiAgICBoaWRlQWN0aW9uczogQm9vbGVhbixcclxuICAgIGRpc2FibGVJbml0aWFsU29ydDogQm9vbGVhbixcclxuICAgIG11c3RTb3J0OiBCb29sZWFuLFxyXG4gICAgbm9SZXN1bHRzVGV4dDoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRhSXRlcmF0b3Iubm9SZXN1bHRzVGV4dCdcclxuICAgIH0sXHJcbiAgICBuZXh0SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5uZXh0J1xyXG4gICAgfSxcclxuICAgIHByZXZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnByZXYnXHJcbiAgICB9LFxyXG4gICAgcm93c1BlclBhZ2VJdGVtczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIDUsXHJcbiAgICAgICAgICAxMCxcclxuICAgICAgICAgIDI1LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB0ZXh0OiAnJHZ1ZXRpZnkuZGF0YUl0ZXJhdG9yLnJvd3NQZXJQYWdlQWxsJyxcclxuICAgICAgICAgICAgdmFsdWU6IC0xXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcm93c1BlclBhZ2VUZXh0OiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5LmRhdGFJdGVyYXRvci5yb3dzUGVyUGFnZVRleHQnXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0QWxsOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgIHNlYXJjaDoge1xyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgdHlwZTogRnVuY3Rpb24sXHJcbiAgICAgIGRlZmF1bHQ6ICh2YWwsIHNlYXJjaCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB2YWwgIT0gbnVsbCAmJlxyXG4gICAgICAgICAgdHlwZW9mIHZhbCAhPT0gJ2Jvb2xlYW4nICYmXHJcbiAgICAgICAgICB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSAhPT0gLTFcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGN1c3RvbUZpbHRlcjoge1xyXG4gICAgICB0eXBlOiBGdW5jdGlvbixcclxuICAgICAgZGVmYXVsdDogKGl0ZW1zLCBzZWFyY2gsIGZpbHRlcikgPT4ge1xyXG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaC50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcclxuICAgICAgICBpZiAoc2VhcmNoLnRyaW0oKSA9PT0gJycpIHJldHVybiBpdGVtc1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbXMuZmlsdGVyKGkgPT4gKFxyXG4gICAgICAgICAgT2JqZWN0LmtleXMoaSkuc29tZShqID0+IGZpbHRlcihpW2pdLCBzZWFyY2gpKVxyXG4gICAgICAgICkpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjdXN0b21Tb3J0OiB7XHJcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxyXG4gICAgICBkZWZhdWx0OiAoaXRlbXMsIGluZGV4LCBpc0Rlc2NlbmRpbmcpID0+IHtcclxuICAgICAgICBpZiAoaW5kZXggPT09IG51bGwpIHJldHVybiBpdGVtc1xyXG5cclxuICAgICAgICByZXR1cm4gaXRlbXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgbGV0IHNvcnRBID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoYSwgaW5kZXgpXHJcbiAgICAgICAgICBsZXQgc29ydEIgPSBnZXRPYmplY3RWYWx1ZUJ5UGF0aChiLCBpbmRleClcclxuXHJcbiAgICAgICAgICBpZiAoaXNEZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgICAgIFtzb3J0QSwgc29ydEJdID0gW3NvcnRCLCBzb3J0QV1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBDaGVjayBpZiBib3RoIGFyZSBudW1iZXJzXHJcbiAgICAgICAgICBpZiAoIWlzTmFOKHNvcnRBKSAmJiAhaXNOYU4oc29ydEIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzb3J0QSAtIHNvcnRCXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYm90aCBjYW5ub3QgYmUgZXZhbHVhdGVkXHJcbiAgICAgICAgICBpZiAoc29ydEEgPT09IG51bGwgJiYgc29ydEIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDBcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBbc29ydEEsIHNvcnRCXSA9IFtzb3J0QSwgc29ydEJdXHJcbiAgICAgICAgICAgIC5tYXAocyA9PiAoXHJcbiAgICAgICAgICAgICAgKHMgfHwgJycpLnRvU3RyaW5nKCkudG9Mb2NhbGVMb3dlckNhc2UoKVxyXG4gICAgICAgICAgICApKVxyXG5cclxuICAgICAgICAgIGlmIChzb3J0QSA+IHNvcnRCKSByZXR1cm4gMVxyXG4gICAgICAgICAgaWYgKHNvcnRBIDwgc29ydEIpIHJldHVybiAtMVxyXG5cclxuICAgICAgICAgIHJldHVybiAwXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHZhbHVlOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXVxyXG4gICAgfSxcclxuICAgIGl0ZW1zOiB7XHJcbiAgICAgIHR5cGU6IEFycmF5LFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gW11cclxuICAgIH0sXHJcbiAgICB0b3RhbEl0ZW1zOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGl0ZW1LZXk6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnaWQnXHJcbiAgICB9LFxyXG4gICAgcGFnaW5hdGlvbjoge1xyXG4gICAgICB0eXBlOiBPYmplY3QsXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IHt9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YTogKCkgPT4gKHtcclxuICAgIHNlYXJjaExlbmd0aDogMCxcclxuICAgIGRlZmF1bHRQYWdpbmF0aW9uOiB7XHJcbiAgICAgIGRlc2NlbmRpbmc6IGZhbHNlLFxyXG4gICAgICBwYWdlOiAxLFxyXG4gICAgICByb3dzUGVyUGFnZTogNSxcclxuICAgICAgc29ydEJ5OiBudWxsLFxyXG4gICAgICB0b3RhbEl0ZW1zOiAwXHJcbiAgICB9LFxyXG4gICAgZXhwYW5kZWQ6IHt9LFxyXG4gICAgYWN0aW9uc0NsYXNzZXM6ICd2LWRhdGEtaXRlcmF0b3JfX2FjdGlvbnMnLFxyXG4gICAgYWN0aW9uc1JhbmdlQ29udHJvbHNDbGFzc2VzOiAndi1kYXRhLWl0ZXJhdG9yX19hY3Rpb25zX19yYW5nZS1jb250cm9scycsXHJcbiAgICBhY3Rpb25zU2VsZWN0Q2xhc3NlczogJ3YtZGF0YS1pdGVyYXRvcl9fYWN0aW9uc19fc2VsZWN0JyxcclxuICAgIGFjdGlvbnNQYWdpbmF0aW9uQ2xhc3NlczogJ3YtZGF0YS1pdGVyYXRvcl9fYWN0aW9uc19fcGFnaW5hdGlvbidcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvbXB1dGVkUGFnaW5hdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc1BhZ2luYXRpb25cclxuICAgICAgICA/IHRoaXMucGFnaW5hdGlvblxyXG4gICAgICAgIDogdGhpcy5kZWZhdWx0UGFnaW5hdGlvblxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkUm93c1BlclBhZ2VJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvd3NQZXJQYWdlSXRlbXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgIHJldHVybiBpc09iamVjdChpdGVtKVxyXG4gICAgICAgICAgPyBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7XHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMuJHZ1ZXRpZnkudChpdGVtLnRleHQpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgOiB7IHZhbHVlOiBpdGVtLCB0ZXh0OiBOdW1iZXIoaXRlbSkudG9Mb2NhbGVTdHJpbmcodGhpcy4kdnVldGlmeS5sYW5nLmN1cnJlbnQpIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBoYXNQYWdpbmF0aW9uICgpIHtcclxuICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IHRoaXMucGFnaW5hdGlvbiB8fCB7fVxyXG5cclxuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHBhZ2luYXRpb24pLmxlbmd0aCA+IDBcclxuICAgIH0sXHJcbiAgICBoYXNTZWxlY3RBbGwgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RBbGwgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlbGVjdEFsbCAhPT0gZmFsc2VcclxuICAgIH0sXHJcbiAgICBpdGVtc0xlbmd0aCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc1NlYXJjaCkgcmV0dXJuIHRoaXMuc2VhcmNoTGVuZ3RoXHJcbiAgICAgIHJldHVybiB0aGlzLnRvdGFsSXRlbXMgfHwgdGhpcy5pdGVtcy5sZW5ndGhcclxuICAgIH0sXHJcbiAgICBpbmRldGVybWluYXRlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGFzU2VsZWN0QWxsICYmIHRoaXMuc29tZUl0ZW1zICYmICF0aGlzLmV2ZXJ5SXRlbVxyXG4gICAgfSxcclxuICAgIGV2ZXJ5SXRlbSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcmVkSXRlbXMubGVuZ3RoICYmXHJcbiAgICAgICAgdGhpcy5maWx0ZXJlZEl0ZW1zLmV2ZXJ5KGkgPT4gdGhpcy5pc1NlbGVjdGVkKGkpKVxyXG4gICAgfSxcclxuICAgIHNvbWVJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcmVkSXRlbXMuc29tZShpID0+IHRoaXMuaXNTZWxlY3RlZChpKSlcclxuICAgIH0sXHJcbiAgICBnZXRQYWdlICgpIHtcclxuICAgICAgY29uc3QgeyByb3dzUGVyUGFnZSB9ID0gdGhpcy5jb21wdXRlZFBhZ2luYXRpb25cclxuXHJcbiAgICAgIHJldHVybiByb3dzUGVyUGFnZSA9PT0gT2JqZWN0KHJvd3NQZXJQYWdlKVxyXG4gICAgICAgID8gcm93c1BlclBhZ2UudmFsdWVcclxuICAgICAgICA6IHJvd3NQZXJQYWdlXHJcbiAgICB9LFxyXG4gICAgcGFnZVN0YXJ0ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZSA9PT0gLTFcclxuICAgICAgICA/IDBcclxuICAgICAgICA6ICh0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5wYWdlIC0gMSkgKiB0aGlzLmdldFBhZ2VcclxuICAgIH0sXHJcbiAgICBwYWdlU3RvcCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFBhZ2UgPT09IC0xXHJcbiAgICAgICAgPyB0aGlzLml0ZW1zTGVuZ3RoXHJcbiAgICAgICAgOiB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5wYWdlICogdGhpcy5nZXRQYWdlXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyZWRJdGVtcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcmVkSXRlbXNJbXBsKClcclxuICAgIH0sXHJcbiAgICBzZWxlY3RlZCAoKSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0ge31cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy52YWx1ZVtpbmRleF0sIHRoaXMuaXRlbUtleSlcclxuICAgICAgICBzZWxlY3RlZFtrZXldID0gdHJ1ZVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RlZFxyXG4gICAgfSxcclxuICAgIGhhc1NlYXJjaCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNlYXJjaCAhPSBudWxsXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGl0ZW1zICgpIHtcclxuICAgICAgaWYgKHRoaXMucGFnZVN0YXJ0ID49IHRoaXMuaXRlbXNMZW5ndGgpIHtcclxuICAgICAgICB0aGlzLnJlc2V0UGFnaW5hdGlvbigpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZWFyY2ggKCkge1xyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgcGFnZTogMSwgdG90YWxJdGVtczogdGhpcy5pdGVtc0xlbmd0aCB9KVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgICdjb21wdXRlZFBhZ2luYXRpb24uc29ydEJ5JzogJ3Jlc2V0UGFnaW5hdGlvbicsXHJcbiAgICAnY29tcHV0ZWRQYWdpbmF0aW9uLmRlc2NlbmRpbmcnOiAncmVzZXRQYWdpbmF0aW9uJ1xyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGluaXRQYWdpbmF0aW9uICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnJvd3NQZXJQYWdlSXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc29sZVdhcm4oYFRoZSBwcm9wICdyb3dzLXBlci1wYWdlLWl0ZW1zJyBjYW4gbm90IGJlIGVtcHR5YCwgdGhpcylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmRlZmF1bHRQYWdpbmF0aW9uLnJvd3NQZXJQYWdlID0gdGhpcy5yb3dzUGVyUGFnZUl0ZW1zWzBdXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGVmYXVsdFBhZ2luYXRpb24udG90YWxJdGVtcyA9IHRoaXMuaXRlbXMubGVuZ3RoXHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0UGFnaW5hdGlvbiwgdGhpcy5wYWdpbmF0aW9uKVxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUGFnaW5hdGlvbiAodmFsKSB7XHJcbiAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSB0aGlzLmhhc1BhZ2luYXRpb25cclxuICAgICAgICA/IHRoaXMucGFnaW5hdGlvblxyXG4gICAgICAgIDogdGhpcy5kZWZhdWx0UGFnaW5hdGlvblxyXG4gICAgICBjb25zdCB1cGRhdGVkUGFnaW5hdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHBhZ2luYXRpb24sIHZhbClcclxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnBhZ2luYXRpb24nLCB1cGRhdGVkUGFnaW5hdGlvbilcclxuXHJcbiAgICAgIGlmICghdGhpcy5oYXNQYWdpbmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0UGFnaW5hdGlvbiA9IHVwZGF0ZWRQYWdpbmF0aW9uXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc1NlbGVjdGVkIChpdGVtKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkW2dldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUtleSldXHJcbiAgICB9LFxyXG4gICAgaXNFeHBhbmRlZCAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5leHBhbmRlZFtnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCB0aGlzLml0ZW1LZXkpXVxyXG4gICAgfSxcclxuICAgIGZpbHRlcmVkSXRlbXNJbXBsICguLi5hZGRpdGlvbmFsRmlsdGVyQXJncykge1xyXG4gICAgICBpZiAodGhpcy50b3RhbEl0ZW1zKSByZXR1cm4gdGhpcy5pdGVtc1xyXG5cclxuICAgICAgbGV0IGl0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSgpXHJcblxyXG4gICAgICBpZiAodGhpcy5oYXNTZWFyY2gpIHtcclxuICAgICAgICBpdGVtcyA9IHRoaXMuY3VzdG9tRmlsdGVyKGl0ZW1zLCB0aGlzLnNlYXJjaCwgdGhpcy5maWx0ZXIsIC4uLmFkZGl0aW9uYWxGaWx0ZXJBcmdzKVxyXG4gICAgICAgIHRoaXMuc2VhcmNoTGVuZ3RoID0gaXRlbXMubGVuZ3RoXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGl0ZW1zID0gdGhpcy5jdXN0b21Tb3J0KFxyXG4gICAgICAgIGl0ZW1zLFxyXG4gICAgICAgIHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uLnNvcnRCeSxcclxuICAgICAgICB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5kZXNjZW5kaW5nXHJcbiAgICAgIClcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmhpZGVBY3Rpb25zICYmXHJcbiAgICAgICAgIXRoaXMuaGFzUGFnaW5hdGlvblxyXG4gICAgICAgID8gaXRlbXNcclxuICAgICAgICA6IGl0ZW1zLnNsaWNlKHRoaXMucGFnZVN0YXJ0LCB0aGlzLnBhZ2VTdG9wKVxyXG4gICAgfSxcclxuICAgIHJlc2V0UGFnaW5hdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uLnBhZ2UgIT09IDEgJiZcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBwYWdlOiAxIH0pXHJcbiAgICB9LFxyXG4gICAgc29ydCAoaW5kZXgpIHtcclxuICAgICAgY29uc3QgeyBzb3J0QnksIGRlc2NlbmRpbmcgfSA9IHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uXHJcbiAgICAgIGlmIChzb3J0QnkgPT09IG51bGwpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBzb3J0Qnk6IGluZGV4LCBkZXNjZW5kaW5nOiBmYWxzZSB9KVxyXG4gICAgICB9IGVsc2UgaWYgKHNvcnRCeSA9PT0gaW5kZXggJiYgIWRlc2NlbmRpbmcpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBkZXNjZW5kaW5nOiB0cnVlIH0pXHJcbiAgICAgIH0gZWxzZSBpZiAoc29ydEJ5ICE9PSBpbmRleCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbih7IHNvcnRCeTogaW5kZXgsIGRlc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMubXVzdFNvcnQpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBzb3J0Qnk6IG51bGwsIGRlc2NlbmRpbmc6IG51bGwgfSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBzb3J0Qnk6IGluZGV4LCBkZXNjZW5kaW5nOiBmYWxzZSB9KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlICh2YWx1ZSkge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZCA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmZpbHRlcmVkSXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgY29uc3Qga2V5ID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgodGhpcy5maWx0ZXJlZEl0ZW1zW2luZGV4XSwgdGhpcy5pdGVtS2V5KVxyXG4gICAgICAgIHNlbGVjdGVkW2tleV0gPSB2YWx1ZVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaXRlbXMuZmlsdGVyKGkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGdldE9iamVjdFZhbHVlQnlQYXRoKGksIHRoaXMuaXRlbUtleSlcclxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRba2V5XVxyXG4gICAgICB9KSlcclxuICAgIH0sXHJcbiAgICBjcmVhdGVQcm9wcyAoaXRlbSwgaW5kZXgpIHtcclxuICAgICAgY29uc3QgcHJvcHMgPSB7IGl0ZW0sIGluZGV4IH1cclxuICAgICAgY29uc3Qga2V5UHJvcCA9IHRoaXMuaXRlbUtleVxyXG4gICAgICBjb25zdCBpdGVtS2V5ID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaXRlbSwga2V5UHJvcClcclxuXHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ3NlbGVjdGVkJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gdGhpcy5zZWxlY3RlZFtpdGVtS2V5XSxcclxuICAgICAgICBzZXQ6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtS2V5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZVdhcm4oYFwiJHtrZXlQcm9wfVwiIGF0dHJpYnV0ZSBtdXN0IGJlIGRlZmluZWQgZm9yIGl0ZW1gLCB0aGlzKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMudmFsdWUuc2xpY2UoKVxyXG4gICAgICAgICAgaWYgKHZhbHVlKSBzZWxlY3RlZC5wdXNoKGl0ZW0pXHJcbiAgICAgICAgICBlbHNlIHNlbGVjdGVkID0gc2VsZWN0ZWQuZmlsdGVyKGkgPT4gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaSwga2V5UHJvcCkgIT09IGl0ZW1LZXkpXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHNlbGVjdGVkKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9wcywgJ2V4cGFuZGVkJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gdGhpcy5leHBhbmRlZFtpdGVtS2V5XSxcclxuICAgICAgICBzZXQ6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtS2V5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZVdhcm4oYFwiJHtrZXlQcm9wfVwiIGF0dHJpYnV0ZSBtdXN0IGJlIGRlZmluZWQgZm9yIGl0ZW1gLCB0aGlzKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICghdGhpcy5leHBhbmQpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5leHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuZXhwYW5kZWQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiB0aGlzLiRzZXQodGhpcy5leHBhbmRlZCwga2V5LCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy4kc2V0KHRoaXMuZXhwYW5kZWQsIGl0ZW1LZXksIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIHJldHVybiBwcm9wc1xyXG4gICAgfSxcclxuICAgIGdlbkl0ZW1zICgpIHtcclxuICAgICAgaWYgKCF0aGlzLml0ZW1zTGVuZ3RoICYmICF0aGlzLml0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IG5vRGF0YSA9IHRoaXMuJHNsb3RzWyduby1kYXRhJ10gfHwgdGhpcy4kdnVldGlmeS50KHRoaXMubm9EYXRhVGV4dClcclxuICAgICAgICByZXR1cm4gW3RoaXMuZ2VuRW1wdHlJdGVtcyhub0RhdGEpXVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuZmlsdGVyZWRJdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBub1Jlc3VsdHMgPSB0aGlzLiRzbG90c1snbm8tcmVzdWx0cyddIHx8IHRoaXMuJHZ1ZXRpZnkudCh0aGlzLm5vUmVzdWx0c1RleHQpXHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmdlbkVtcHR5SXRlbXMobm9SZXN1bHRzKV1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuRmlsdGVyZWRJdGVtcygpXHJcbiAgICB9LFxyXG4gICAgZ2VuUHJldkljb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQnRuLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5wYWdlID09PSAxLFxyXG4gICAgICAgICAgaWNvbjogdHJ1ZSxcclxuICAgICAgICAgIGZsYXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYWdlID0gdGhpcy5jb21wdXRlZFBhZ2luYXRpb24ucGFnZVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBwYWdlOiBwYWdlIC0gMSB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy4kdnVldGlmeS50KCckdnVldGlmeS5kYXRhSXRlcmF0b3IucHJldlBhZ2UnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHRoaXMuJHZ1ZXRpZnkucnRsID8gdGhpcy5uZXh0SWNvbiA6IHRoaXMucHJldkljb24pXSlcclxuICAgIH0sXHJcbiAgICBnZW5OZXh0SWNvbiAoKSB7XHJcbiAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvblxyXG4gICAgICBjb25zdCBkaXNhYmxlZCA9IHBhZ2luYXRpb24ucm93c1BlclBhZ2UgPCAwIHx8XHJcbiAgICAgICAgcGFnaW5hdGlvbi5wYWdlICogcGFnaW5hdGlvbi5yb3dzUGVyUGFnZSA+PSB0aGlzLml0ZW1zTGVuZ3RoIHx8XHJcbiAgICAgICAgdGhpcy5wYWdlU3RvcCA8IDBcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZCdG4sIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgZGlzYWJsZWQsXHJcbiAgICAgICAgICBpY29uOiB0cnVlLFxyXG4gICAgICAgICAgZmxhdDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5wYWdlXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbih7IHBhZ2U6IHBhZ2UgKyAxIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgJ2FyaWEtbGFiZWwnOiB0aGlzLiR2dWV0aWZ5LnQoJyR2dWV0aWZ5LmRhdGFJdGVyYXRvci5uZXh0UGFnZScpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBbdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgdGhpcy4kdnVldGlmeS5ydGwgPyB0aGlzLnByZXZJY29uIDogdGhpcy5uZXh0SWNvbildKVxyXG4gICAgfSxcclxuICAgIGdlblNlbGVjdCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogdGhpcy5hY3Rpb25zU2VsZWN0Q2xhc3Nlc1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy4kdnVldGlmeS50KHRoaXMucm93c1BlclBhZ2VUZXh0KSxcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZTZWxlY3QsIHtcclxuICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy4kdnVldGlmeS50KHRoaXMucm93c1BlclBhZ2VUZXh0KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGl0ZW1zOiB0aGlzLmNvbXB1dGVkUm93c1BlclBhZ2VJdGVtcyxcclxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uLnJvd3NQZXJQYWdlLFxyXG4gICAgICAgICAgICBoaWRlRGV0YWlsczogdHJ1ZSxcclxuICAgICAgICAgICAgbWVudVByb3BzOiB7XHJcbiAgICAgICAgICAgICAgYXV0bzogdHJ1ZSxcclxuICAgICAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXHJcbiAgICAgICAgICAgICAgbWluV2lkdGg6ICc3NXB4J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IHtcclxuICAgICAgICAgICAgaW5wdXQ6IHZhbCA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHtcclxuICAgICAgICAgICAgICAgIHBhZ2U6IDEsXHJcbiAgICAgICAgICAgICAgICByb3dzUGVyUGFnZTogdmFsXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuUGFnaW5hdGlvbiAoKSB7XHJcbiAgICAgIGxldCBwYWdpbmF0aW9uID0gJ+KAkydcclxuXHJcbiAgICAgIGlmICh0aGlzLml0ZW1zTGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RvcCA9IHRoaXMuaXRlbXNMZW5ndGggPCB0aGlzLnBhZ2VTdG9wIHx8IHRoaXMucGFnZVN0b3AgPCAwXHJcbiAgICAgICAgICA/IHRoaXMuaXRlbXNMZW5ndGhcclxuICAgICAgICAgIDogdGhpcy5wYWdlU3RvcFxyXG5cclxuICAgICAgICBwYWdpbmF0aW9uID0gdGhpcy4kc2NvcGVkU2xvdHMucGFnZVRleHRcclxuICAgICAgICAgID8gdGhpcy4kc2NvcGVkU2xvdHMucGFnZVRleHQoe1xyXG4gICAgICAgICAgICBwYWdlU3RhcnQ6IHRoaXMucGFnZVN0YXJ0ICsgMSxcclxuICAgICAgICAgICAgcGFnZVN0b3A6IHN0b3AsXHJcbiAgICAgICAgICAgIGl0ZW1zTGVuZ3RoOiB0aGlzLml0ZW1zTGVuZ3RoXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgOiB0aGlzLiR2dWV0aWZ5LnQoJyR2dWV0aWZ5LmRhdGFJdGVyYXRvci5wYWdlVGV4dCcsXHJcbiAgICAgICAgICAgIC4uLihbdGhpcy5wYWdlU3RhcnQgKyAxLCBzdG9wLCB0aGlzLml0ZW1zTGVuZ3RoXS5tYXAobiA9PiBOdW1iZXIobikudG9Mb2NhbGVTdHJpbmcodGhpcy4kdnVldGlmeS5sYW5nLmN1cnJlbnQpKSkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogdGhpcy5hY3Rpb25zUGFnaW5hdGlvbkNsYXNzZXNcclxuICAgICAgfSwgW3BhZ2luYXRpb25dKVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGlvbnMgKCkge1xyXG4gICAgICBjb25zdCByYW5nZUNvbnRyb2xzID0gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICdjbGFzcyc6IHRoaXMuYWN0aW9uc1JhbmdlQ29udHJvbHNDbGFzc2VzXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlblBhZ2luYXRpb24oKSxcclxuICAgICAgICB0aGlzLmdlblByZXZJY29uKCksXHJcbiAgICAgICAgdGhpcy5nZW5OZXh0SWNvbigpXHJcbiAgICAgIF0pXHJcblxyXG4gICAgICByZXR1cm4gW3RoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAnY2xhc3MnOiB0aGlzLmFjdGlvbnNDbGFzc2VzXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLiRzbG90c1snYWN0aW9ucy1wcmVwZW5kJ10gPyB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7fSwgdGhpcy4kc2xvdHNbJ2FjdGlvbnMtcHJlcGVuZCddKSA6IG51bGwsXHJcbiAgICAgICAgdGhpcy5yb3dzUGVyUGFnZUl0ZW1zLmxlbmd0aCA+IDEgPyB0aGlzLmdlblNlbGVjdCgpIDogbnVsbCxcclxuICAgICAgICByYW5nZUNvbnRyb2xzLFxyXG4gICAgICAgIHRoaXMuJHNsb3RzWydhY3Rpb25zLWFwcGVuZCddID8gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge30sIHRoaXMuJHNsb3RzWydhY3Rpb25zLWFwcGVuZCddKSA6IG51bGxcclxuICAgICAgXSldXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==