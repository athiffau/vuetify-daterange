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
            const newItemKeys = new Set(this.items.map(item => getObjectValueByPath(item, this.itemKey)));
            const selection = this.value.filter(item => newItemKeys.has(getObjectValueByPath(item, this.itemKey)));
            if (selection.length !== this.value.length) {
                this.$emit('input', selection);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS1pdGVyYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvZGF0YS1pdGVyYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSxvQkFBb0IsQ0FBQTtBQUNyQyxPQUFPLEtBQUssTUFBTSxxQkFBcUIsQ0FBQTtBQUN2QyxPQUFPLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQTtBQUUzQyxPQUFPLFVBQVUsTUFBTSxjQUFjLENBQUE7QUFDckMsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBQ25DLE9BQU8sUUFBUSxNQUFNLFlBQVksQ0FBQTtBQUVqQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRTdDOzs7Ozs7OztHQVFHO0FBQ0gsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsZUFBZTtJQUVyQixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQztJQUV6QyxLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUUsT0FBTztRQUNmLFdBQVcsRUFBRSxPQUFPO1FBQ3BCLGtCQUFrQixFQUFFLE9BQU87UUFDM0IsUUFBUSxFQUFFLE9BQU87UUFDakIsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUNBQXFDO1NBQy9DO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUscUJBQXFCO1NBQy9CO1FBQ0QsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPO2dCQUNMLE9BQU87b0JBQ0wsQ0FBQztvQkFDRCxFQUFFO29C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QUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDdEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDMUQsYUFBYTtvQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtpQkFDckcsQ0FBQyxDQUFDLENBQUE7UUFDTCxDQUFDO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZCdG4gZnJvbSAnLi4vY29tcG9uZW50cy9WQnRuJ1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vY29tcG9uZW50cy9WSWNvbidcclxuaW1wb3J0IFZTZWxlY3QgZnJvbSAnLi4vY29tcG9uZW50cy9WU2VsZWN0J1xyXG5cclxuaW1wb3J0IEZpbHRlcmFibGUgZnJvbSAnLi9maWx0ZXJhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4vdGhlbWVhYmxlJ1xyXG5pbXBvcnQgTG9hZGFibGUgZnJvbSAnLi9sb2FkYWJsZSdcclxuXHJcbmltcG9ydCB7IGdldE9iamVjdFZhbHVlQnlQYXRoLCBpc09iamVjdCB9IGZyb20gJy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi91dGlsL2NvbnNvbGUnXHJcblxyXG4vKipcclxuICogRGF0YUl0ZXJhYmxlXHJcbiAqXHJcbiAqIEBtaXhpblxyXG4gKlxyXG4gKiBCYXNlIGJlaGF2aW9yIGZvciBkYXRhIHRhYmxlIGFuZCBkYXRhIGl0ZXJhdG9yXHJcbiAqIHByb3ZpZGluZyBzZWxlY3Rpb24sIHBhZ2luYXRpb24sIHNvcnRpbmcgYW5kIGZpbHRlcmluZy5cclxuICpcclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAnZGF0YS1pdGVyYWJsZScsXHJcblxyXG4gIG1peGluczogW0ZpbHRlcmFibGUsIExvYWRhYmxlLCBUaGVtZWFibGVdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZXhwYW5kOiBCb29sZWFuLFxyXG4gICAgaGlkZUFjdGlvbnM6IEJvb2xlYW4sXHJcbiAgICBkaXNhYmxlSW5pdGlhbFNvcnQ6IEJvb2xlYW4sXHJcbiAgICBtdXN0U29ydDogQm9vbGVhbixcclxuICAgIG5vUmVzdWx0c1RleHQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuZGF0YUl0ZXJhdG9yLm5vUmVzdWx0c1RleHQnXHJcbiAgICB9LFxyXG4gICAgbmV4dEljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMubmV4dCdcclxuICAgIH0sXHJcbiAgICBwcmV2SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5wcmV2J1xyXG4gICAgfSxcclxuICAgIHJvd3NQZXJQYWdlSXRlbXM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGRlZmF1bHQgKCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICA1LFxyXG4gICAgICAgICAgMTAsXHJcbiAgICAgICAgICAyNSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdGV4dDogJyR2dWV0aWZ5LmRhdGFJdGVyYXRvci5yb3dzUGVyUGFnZUFsbCcsXHJcbiAgICAgICAgICAgIHZhbHVlOiAtMVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJvd3NQZXJQYWdlVGV4dDoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5kYXRhSXRlcmF0b3Iucm93c1BlclBhZ2VUZXh0J1xyXG4gICAgfSxcclxuICAgIHNlbGVjdEFsbDogW0Jvb2xlYW4sIFN0cmluZ10sXHJcbiAgICBzZWFyY2g6IHtcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgIHR5cGU6IEZ1bmN0aW9uLFxyXG4gICAgICBkZWZhdWx0OiAodmFsLCBzZWFyY2gpID0+IHtcclxuICAgICAgICByZXR1cm4gdmFsICE9IG51bGwgJiZcclxuICAgICAgICAgIHR5cGVvZiB2YWwgIT09ICdib29sZWFuJyAmJlxyXG4gICAgICAgICAgdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgIT09IC0xXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjdXN0b21GaWx0ZXI6IHtcclxuICAgICAgdHlwZTogRnVuY3Rpb24sXHJcbiAgICAgIGRlZmF1bHQ6IChpdGVtcywgc2VhcmNoLCBmaWx0ZXIpID0+IHtcclxuICAgICAgICBzZWFyY2ggPSBzZWFyY2gudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgaWYgKHNlYXJjaC50cmltKCkgPT09ICcnKSByZXR1cm4gaXRlbXNcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zLmZpbHRlcihpID0+IChcclxuICAgICAgICAgIE9iamVjdC5rZXlzKGkpLnNvbWUoaiA9PiBmaWx0ZXIoaVtqXSwgc2VhcmNoKSlcclxuICAgICAgICApKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3VzdG9tU29ydDoge1xyXG4gICAgICB0eXBlOiBGdW5jdGlvbixcclxuICAgICAgZGVmYXVsdDogKGl0ZW1zLCBpbmRleCwgaXNEZXNjZW5kaW5nKSA9PiB7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSBudWxsKSByZXR1cm4gaXRlbXNcclxuXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgIGxldCBzb3J0QSA9IGdldE9iamVjdFZhbHVlQnlQYXRoKGEsIGluZGV4KVxyXG4gICAgICAgICAgbGV0IHNvcnRCID0gZ2V0T2JqZWN0VmFsdWVCeVBhdGgoYiwgaW5kZXgpXHJcblxyXG4gICAgICAgICAgaWYgKGlzRGVzY2VuZGluZykge1xyXG4gICAgICAgICAgICBbc29ydEEsIHNvcnRCXSA9IFtzb3J0Qiwgc29ydEFdXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgYm90aCBhcmUgbnVtYmVyc1xyXG4gICAgICAgICAgaWYgKCFpc05hTihzb3J0QSkgJiYgIWlzTmFOKHNvcnRCKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc29ydEEgLSBzb3J0QlxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIENoZWNrIGlmIGJvdGggY2Fubm90IGJlIGV2YWx1YXRlZFxyXG4gICAgICAgICAgaWYgKHNvcnRBID09PSBudWxsICYmIHNvcnRCID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgW3NvcnRBLCBzb3J0Ql0gPSBbc29ydEEsIHNvcnRCXVxyXG4gICAgICAgICAgICAubWFwKHMgPT4gKFxyXG4gICAgICAgICAgICAgIChzIHx8ICcnKS50b1N0cmluZygpLnRvTG9jYWxlTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgKSlcclxuXHJcbiAgICAgICAgICBpZiAoc29ydEEgPiBzb3J0QikgcmV0dXJuIDFcclxuICAgICAgICAgIGlmIChzb3J0QSA8IHNvcnRCKSByZXR1cm4gLTFcclxuXHJcbiAgICAgICAgICByZXR1cm4gMFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gW11cclxuICAgIH0sXHJcbiAgICBpdGVtczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdXHJcbiAgICB9LFxyXG4gICAgdG90YWxJdGVtczoge1xyXG4gICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICBpdGVtS2V5OiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2lkJ1xyXG4gICAgfSxcclxuICAgIHBhZ2luYXRpb246IHtcclxuICAgICAgdHlwZTogT2JqZWN0LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiB7fVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBzZWFyY2hMZW5ndGg6IDAsXHJcbiAgICBkZWZhdWx0UGFnaW5hdGlvbjoge1xyXG4gICAgICBkZXNjZW5kaW5nOiBmYWxzZSxcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgcm93c1BlclBhZ2U6IDUsXHJcbiAgICAgIHNvcnRCeTogbnVsbCxcclxuICAgICAgdG90YWxJdGVtczogMFxyXG4gICAgfSxcclxuICAgIGV4cGFuZGVkOiB7fSxcclxuICAgIGFjdGlvbnNDbGFzc2VzOiAndi1kYXRhLWl0ZXJhdG9yX19hY3Rpb25zJyxcclxuICAgIGFjdGlvbnNSYW5nZUNvbnRyb2xzQ2xhc3NlczogJ3YtZGF0YS1pdGVyYXRvcl9fYWN0aW9uc19fcmFuZ2UtY29udHJvbHMnLFxyXG4gICAgYWN0aW9uc1NlbGVjdENsYXNzZXM6ICd2LWRhdGEtaXRlcmF0b3JfX2FjdGlvbnNfX3NlbGVjdCcsXHJcbiAgICBhY3Rpb25zUGFnaW5hdGlvbkNsYXNzZXM6ICd2LWRhdGEtaXRlcmF0b3JfX2FjdGlvbnNfX3BhZ2luYXRpb24nXHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZFBhZ2luYXRpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYXNQYWdpbmF0aW9uXHJcbiAgICAgICAgPyB0aGlzLnBhZ2luYXRpb25cclxuICAgICAgICA6IHRoaXMuZGVmYXVsdFBhZ2luYXRpb25cclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFJvd3NQZXJQYWdlSXRlbXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3dzUGVyUGFnZUl0ZW1zLm1hcChpdGVtID0+IHtcclxuICAgICAgICByZXR1cm4gaXNPYmplY3QoaXRlbSlcclxuICAgICAgICAgID8gT2JqZWN0LmFzc2lnbih7fSwgaXRlbSwge1xyXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLiR2dWV0aWZ5LnQoaXRlbS50ZXh0KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIDogeyB2YWx1ZTogaXRlbSwgdGV4dDogTnVtYmVyKGl0ZW0pLnRvTG9jYWxlU3RyaW5nKHRoaXMuJHZ1ZXRpZnkubGFuZy5jdXJyZW50KSB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgaGFzUGFnaW5hdGlvbiAoKSB7XHJcbiAgICAgIGNvbnN0IHBhZ2luYXRpb24gPSB0aGlzLnBhZ2luYXRpb24gfHwge31cclxuXHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhwYWdpbmF0aW9uKS5sZW5ndGggPiAwXHJcbiAgICB9LFxyXG4gICAgaGFzU2VsZWN0QWxsICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsICE9PSB1bmRlZmluZWQgJiYgdGhpcy5zZWxlY3RBbGwgIT09IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgaXRlbXNMZW5ndGggKCkge1xyXG4gICAgICBpZiAodGhpcy5oYXNTZWFyY2gpIHJldHVybiB0aGlzLnNlYXJjaExlbmd0aFxyXG4gICAgICByZXR1cm4gdGhpcy50b3RhbEl0ZW1zIHx8IHRoaXMuaXRlbXMubGVuZ3RoXHJcbiAgICB9LFxyXG4gICAgaW5kZXRlcm1pbmF0ZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmhhc1NlbGVjdEFsbCAmJiB0aGlzLnNvbWVJdGVtcyAmJiAhdGhpcy5ldmVyeUl0ZW1cclxuICAgIH0sXHJcbiAgICBldmVyeUl0ZW0gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aCAmJlxyXG4gICAgICAgIHRoaXMuZmlsdGVyZWRJdGVtcy5ldmVyeShpID0+IHRoaXMuaXNTZWxlY3RlZChpKSlcclxuICAgIH0sXHJcbiAgICBzb21lSXRlbXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJlZEl0ZW1zLnNvbWUoaSA9PiB0aGlzLmlzU2VsZWN0ZWQoaSkpXHJcbiAgICB9LFxyXG4gICAgZ2V0UGFnZSAoKSB7XHJcbiAgICAgIGNvbnN0IHsgcm93c1BlclBhZ2UgfSA9IHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uXHJcblxyXG4gICAgICByZXR1cm4gcm93c1BlclBhZ2UgPT09IE9iamVjdChyb3dzUGVyUGFnZSlcclxuICAgICAgICA/IHJvd3NQZXJQYWdlLnZhbHVlXHJcbiAgICAgICAgOiByb3dzUGVyUGFnZVxyXG4gICAgfSxcclxuICAgIHBhZ2VTdGFydCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFBhZ2UgPT09IC0xXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiAodGhpcy5jb21wdXRlZFBhZ2luYXRpb24ucGFnZSAtIDEpICogdGhpcy5nZXRQYWdlXHJcbiAgICB9LFxyXG4gICAgcGFnZVN0b3AgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRQYWdlID09PSAtMVxyXG4gICAgICAgID8gdGhpcy5pdGVtc0xlbmd0aFxyXG4gICAgICAgIDogdGhpcy5jb21wdXRlZFBhZ2luYXRpb24ucGFnZSAqIHRoaXMuZ2V0UGFnZVxyXG4gICAgfSxcclxuICAgIGZpbHRlcmVkSXRlbXMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXJlZEl0ZW1zSW1wbCgpXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWQgKCkge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHt9XHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMudmFsdWVbaW5kZXhdLCB0aGlzLml0ZW1LZXkpXHJcbiAgICAgICAgc2VsZWN0ZWRba2V5XSA9IHRydWVcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2VsZWN0ZWRcclxuICAgIH0sXHJcbiAgICBoYXNTZWFyY2ggKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zZWFyY2ggIT0gbnVsbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpdGVtcyAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhZ2VTdGFydCA+PSB0aGlzLml0ZW1zTGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldFBhZ2luYXRpb24oKVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG5ld0l0ZW1LZXlzID0gbmV3IFNldCh0aGlzLml0ZW1zLm1hcChpdGVtID0+IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHRoaXMuaXRlbUtleSkpKVxyXG4gICAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLnZhbHVlLmZpbHRlcihpdGVtID0+IG5ld0l0ZW1LZXlzLmhhcyhnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCB0aGlzLml0ZW1LZXkpKSlcclxuXHJcbiAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoICE9PSB0aGlzLnZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0Jywgc2VsZWN0aW9uKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VhcmNoICgpIHtcclxuICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbih7IHBhZ2U6IDEsIHRvdGFsSXRlbXM6IHRoaXMuaXRlbXNMZW5ndGggfSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAnY29tcHV0ZWRQYWdpbmF0aW9uLnNvcnRCeSc6ICdyZXNldFBhZ2luYXRpb24nLFxyXG4gICAgJ2NvbXB1dGVkUGFnaW5hdGlvbi5kZXNjZW5kaW5nJzogJ3Jlc2V0UGFnaW5hdGlvbidcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBpbml0UGFnaW5hdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5yb3dzUGVyUGFnZUl0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnNvbGVXYXJuKGBUaGUgcHJvcCAncm93cy1wZXItcGFnZS1pdGVtcycgY2FuIG5vdCBiZSBlbXB0eWAsIHRoaXMpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0UGFnaW5hdGlvbi5yb3dzUGVyUGFnZSA9IHRoaXMucm93c1BlclBhZ2VJdGVtc1swXVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRlZmF1bHRQYWdpbmF0aW9uLnRvdGFsSXRlbXMgPSB0aGlzLml0ZW1zLmxlbmd0aFxyXG5cclxuICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKFxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdFBhZ2luYXRpb24sIHRoaXMucGFnaW5hdGlvbilcclxuICAgICAgKVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVBhZ2luYXRpb24gKHZhbCkge1xyXG4gICAgICBjb25zdCBwYWdpbmF0aW9uID0gdGhpcy5oYXNQYWdpbmF0aW9uXHJcbiAgICAgICAgPyB0aGlzLnBhZ2luYXRpb25cclxuICAgICAgICA6IHRoaXMuZGVmYXVsdFBhZ2luYXRpb25cclxuICAgICAgY29uc3QgdXBkYXRlZFBhZ2luYXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCBwYWdpbmF0aW9uLCB2YWwpXHJcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpwYWdpbmF0aW9uJywgdXBkYXRlZFBhZ2luYXRpb24pXHJcblxyXG4gICAgICBpZiAoIXRoaXMuaGFzUGFnaW5hdGlvbikge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFBhZ2luYXRpb24gPSB1cGRhdGVkUGFnaW5hdGlvblxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNTZWxlY3RlZCAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFtnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCB0aGlzLml0ZW1LZXkpXVxyXG4gICAgfSxcclxuICAgIGlzRXhwYW5kZWQgKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5kZWRbZ2V0T2JqZWN0VmFsdWVCeVBhdGgoaXRlbSwgdGhpcy5pdGVtS2V5KV1cclxuICAgIH0sXHJcbiAgICBmaWx0ZXJlZEl0ZW1zSW1wbCAoLi4uYWRkaXRpb25hbEZpbHRlckFyZ3MpIHtcclxuICAgICAgaWYgKHRoaXMudG90YWxJdGVtcykgcmV0dXJuIHRoaXMuaXRlbXNcclxuXHJcbiAgICAgIGxldCBpdGVtcyA9IHRoaXMuaXRlbXMuc2xpY2UoKVxyXG5cclxuICAgICAgaWYgKHRoaXMuaGFzU2VhcmNoKSB7XHJcbiAgICAgICAgaXRlbXMgPSB0aGlzLmN1c3RvbUZpbHRlcihpdGVtcywgdGhpcy5zZWFyY2gsIHRoaXMuZmlsdGVyLCAuLi5hZGRpdGlvbmFsRmlsdGVyQXJncylcclxuICAgICAgICB0aGlzLnNlYXJjaExlbmd0aCA9IGl0ZW1zLmxlbmd0aFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpdGVtcyA9IHRoaXMuY3VzdG9tU29ydChcclxuICAgICAgICBpdGVtcyxcclxuICAgICAgICB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5zb3J0QnksXHJcbiAgICAgICAgdGhpcy5jb21wdXRlZFBhZ2luYXRpb24uZGVzY2VuZGluZ1xyXG4gICAgICApXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5oaWRlQWN0aW9ucyAmJlxyXG4gICAgICAgICF0aGlzLmhhc1BhZ2luYXRpb25cclxuICAgICAgICA/IGl0ZW1zXHJcbiAgICAgICAgOiBpdGVtcy5zbGljZSh0aGlzLnBhZ2VTdGFydCwgdGhpcy5wYWdlU3RvcClcclxuICAgIH0sXHJcbiAgICByZXNldFBhZ2luYXRpb24gKCkge1xyXG4gICAgICB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5wYWdlICE9PSAxICYmXHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgcGFnZTogMSB9KVxyXG4gICAgfSxcclxuICAgIHNvcnQgKGluZGV4KSB7XHJcbiAgICAgIGNvbnN0IHsgc29ydEJ5LCBkZXNjZW5kaW5nIH0gPSB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvblxyXG4gICAgICBpZiAoc29ydEJ5ID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgc29ydEJ5OiBpbmRleCwgZGVzY2VuZGluZzogZmFsc2UgfSlcclxuICAgICAgfSBlbHNlIGlmIChzb3J0QnkgPT09IGluZGV4ICYmICFkZXNjZW5kaW5nKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgZGVzY2VuZGluZzogdHJ1ZSB9KVxyXG4gICAgICB9IGVsc2UgaWYgKHNvcnRCeSAhPT0gaW5kZXgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBzb3J0Qnk6IGluZGV4LCBkZXNjZW5kaW5nOiBmYWxzZSB9KVxyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLm11c3RTb3J0KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgc29ydEJ5OiBudWxsLCBkZXNjZW5kaW5nOiBudWxsIH0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgc29ydEJ5OiBpbmRleCwgZGVzY2VuZGluZzogZmFsc2UgfSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvZ2dsZSAodmFsdWUpIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnNlbGVjdGVkKVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IGdldE9iamVjdFZhbHVlQnlQYXRoKHRoaXMuZmlsdGVyZWRJdGVtc1tpbmRleF0sIHRoaXMuaXRlbUtleSlcclxuICAgICAgICBzZWxlY3RlZFtrZXldID0gdmFsdWVcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLml0ZW1zLmZpbHRlcihpID0+IHtcclxuICAgICAgICBjb25zdCBrZXkgPSBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpLCB0aGlzLml0ZW1LZXkpXHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkW2tleV1cclxuICAgICAgfSkpXHJcbiAgICB9LFxyXG4gICAgY3JlYXRlUHJvcHMgKGl0ZW0sIGluZGV4KSB7XHJcbiAgICAgIGNvbnN0IHByb3BzID0geyBpdGVtLCBpbmRleCB9XHJcbiAgICAgIGNvbnN0IGtleVByb3AgPSB0aGlzLml0ZW1LZXlcclxuICAgICAgY29uc3QgaXRlbUtleSA9IGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIGtleVByb3ApXHJcblxyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdzZWxlY3RlZCcsIHtcclxuICAgICAgICBnZXQ6ICgpID0+IHRoaXMuc2VsZWN0ZWRbaXRlbUtleV0sXHJcbiAgICAgICAgc2V0OiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbUtleSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGVXYXJuKGBcIiR7a2V5UHJvcH1cIiBhdHRyaWJ1dGUgbXVzdCBiZSBkZWZpbmVkIGZvciBpdGVtYCwgdGhpcylcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLnZhbHVlLnNsaWNlKClcclxuICAgICAgICAgIGlmICh2YWx1ZSkgc2VsZWN0ZWQucHVzaChpdGVtKVxyXG4gICAgICAgICAgZWxzZSBzZWxlY3RlZCA9IHNlbGVjdGVkLmZpbHRlcihpID0+IGdldE9iamVjdFZhbHVlQnlQYXRoKGksIGtleVByb3ApICE9PSBpdGVtS2V5KVxyXG4gICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBzZWxlY3RlZClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdleHBhbmRlZCcsIHtcclxuICAgICAgICBnZXQ6ICgpID0+IHRoaXMuZXhwYW5kZWRbaXRlbUtleV0sXHJcbiAgICAgICAgc2V0OiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbUtleSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGVXYXJuKGBcIiR7a2V5UHJvcH1cIiBhdHRyaWJ1dGUgbXVzdCBiZSBkZWZpbmVkIGZvciBpdGVtYCwgdGhpcylcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAoIXRoaXMuZXhwYW5kKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuZXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgICB0aGlzLmV4cGFuZGVkLmhhc093blByb3BlcnR5KGtleSkgJiYgdGhpcy4kc2V0KHRoaXMuZXhwYW5kZWQsIGtleSwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuJHNldCh0aGlzLmV4cGFuZGVkLCBpdGVtS2V5LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICByZXR1cm4gcHJvcHNcclxuICAgIH0sXHJcbiAgICBnZW5JdGVtcyAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pdGVtc0xlbmd0aCAmJiAhdGhpcy5pdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBub0RhdGEgPSB0aGlzLiRzbG90c1snbm8tZGF0YSddIHx8IHRoaXMuJHZ1ZXRpZnkudCh0aGlzLm5vRGF0YVRleHQpXHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmdlbkVtcHR5SXRlbXMobm9EYXRhKV1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmZpbHRlcmVkSXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3Qgbm9SZXN1bHRzID0gdGhpcy4kc2xvdHNbJ25vLXJlc3VsdHMnXSB8fCB0aGlzLiR2dWV0aWZ5LnQodGhpcy5ub1Jlc3VsdHNUZXh0KVxyXG4gICAgICAgIHJldHVybiBbdGhpcy5nZW5FbXB0eUl0ZW1zKG5vUmVzdWx0cyldXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdlbkZpbHRlcmVkSXRlbXMoKVxyXG4gICAgfSxcclxuICAgIGdlblByZXZJY29uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJ0biwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5jb21wdXRlZFBhZ2luYXRpb24ucGFnZSA9PT0gMSxcclxuICAgICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgICBmbGF0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgY2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFnZSA9IHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uLnBhZ2VcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKHsgcGFnZTogcGFnZSAtIDEgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAnYXJpYS1sYWJlbCc6IHRoaXMuJHZ1ZXRpZnkudCgnJHZ1ZXRpZnkuZGF0YUl0ZXJhdG9yLnByZXZQYWdlJylcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFt0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB0aGlzLiR2dWV0aWZ5LnJ0bCA/IHRoaXMubmV4dEljb24gOiB0aGlzLnByZXZJY29uKV0pXHJcbiAgICB9LFxyXG4gICAgZ2VuTmV4dEljb24gKCkge1xyXG4gICAgICBjb25zdCBwYWdpbmF0aW9uID0gdGhpcy5jb21wdXRlZFBhZ2luYXRpb25cclxuICAgICAgY29uc3QgZGlzYWJsZWQgPSBwYWdpbmF0aW9uLnJvd3NQZXJQYWdlIDwgMCB8fFxyXG4gICAgICAgIHBhZ2luYXRpb24ucGFnZSAqIHBhZ2luYXRpb24ucm93c1BlclBhZ2UgPj0gdGhpcy5pdGVtc0xlbmd0aCB8fFxyXG4gICAgICAgIHRoaXMucGFnZVN0b3AgPCAwXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWQnRuLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGRpc2FibGVkLFxyXG4gICAgICAgICAgaWNvbjogdHJ1ZSxcclxuICAgICAgICAgIGZsYXQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwYWdlID0gdGhpcy5jb21wdXRlZFBhZ2luYXRpb24ucGFnZVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oeyBwYWdlOiBwYWdlICsgMSB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICdhcmlhLWxhYmVsJzogdGhpcy4kdnVldGlmeS50KCckdnVldGlmeS5kYXRhSXRlcmF0b3IubmV4dFBhZ2UnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW3RoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHRoaXMuJHZ1ZXRpZnkucnRsID8gdGhpcy5wcmV2SWNvbiA6IHRoaXMubmV4dEljb24pXSlcclxuICAgIH0sXHJcbiAgICBnZW5TZWxlY3QgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICdjbGFzcyc6IHRoaXMuYWN0aW9uc1NlbGVjdENsYXNzZXNcclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuJHZ1ZXRpZnkudCh0aGlzLnJvd3NQZXJQYWdlVGV4dCksXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudChWU2VsZWN0LCB7XHJcbiAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICAnYXJpYS1sYWJlbCc6IHRoaXMuJHZ1ZXRpZnkudCh0aGlzLnJvd3NQZXJQYWdlVGV4dClcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICBpdGVtczogdGhpcy5jb21wdXRlZFJvd3NQZXJQYWdlSXRlbXMsXHJcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLmNvbXB1dGVkUGFnaW5hdGlvbi5yb3dzUGVyUGFnZSxcclxuICAgICAgICAgICAgaGlkZURldGFpbHM6IHRydWUsXHJcbiAgICAgICAgICAgIG1lbnVQcm9wczoge1xyXG4gICAgICAgICAgICAgIGF1dG86IHRydWUsXHJcbiAgICAgICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgICAgIG1pbldpZHRoOiAnNzVweCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiB7XHJcbiAgICAgICAgICAgIGlucHV0OiB2YWwgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbih7XHJcbiAgICAgICAgICAgICAgICBwYWdlOiAxLFxyXG4gICAgICAgICAgICAgICAgcm93c1BlclBhZ2U6IHZhbFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlblBhZ2luYXRpb24gKCkge1xyXG4gICAgICBsZXQgcGFnaW5hdGlvbiA9ICfigJMnXHJcblxyXG4gICAgICBpZiAodGhpcy5pdGVtc0xlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IHN0b3AgPSB0aGlzLml0ZW1zTGVuZ3RoIDwgdGhpcy5wYWdlU3RvcCB8fCB0aGlzLnBhZ2VTdG9wIDwgMFxyXG4gICAgICAgICAgPyB0aGlzLml0ZW1zTGVuZ3RoXHJcbiAgICAgICAgICA6IHRoaXMucGFnZVN0b3BcclxuXHJcbiAgICAgICAgcGFnaW5hdGlvbiA9IHRoaXMuJHNjb3BlZFNsb3RzLnBhZ2VUZXh0XHJcbiAgICAgICAgICA/IHRoaXMuJHNjb3BlZFNsb3RzLnBhZ2VUZXh0KHtcclxuICAgICAgICAgICAgcGFnZVN0YXJ0OiB0aGlzLnBhZ2VTdGFydCArIDEsXHJcbiAgICAgICAgICAgIHBhZ2VTdG9wOiBzdG9wLFxyXG4gICAgICAgICAgICBpdGVtc0xlbmd0aDogdGhpcy5pdGVtc0xlbmd0aFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIDogdGhpcy4kdnVldGlmeS50KCckdnVldGlmeS5kYXRhSXRlcmF0b3IucGFnZVRleHQnLFxyXG4gICAgICAgICAgICAuLi4oW3RoaXMucGFnZVN0YXJ0ICsgMSwgc3RvcCwgdGhpcy5pdGVtc0xlbmd0aF0ubWFwKG4gPT4gTnVtYmVyKG4pLnRvTG9jYWxlU3RyaW5nKHRoaXMuJHZ1ZXRpZnkubGFuZy5jdXJyZW50KSkpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICdjbGFzcyc6IHRoaXMuYWN0aW9uc1BhZ2luYXRpb25DbGFzc2VzXHJcbiAgICAgIH0sIFtwYWdpbmF0aW9uXSlcclxuICAgIH0sXHJcbiAgICBnZW5BY3Rpb25zICgpIHtcclxuICAgICAgY29uc3QgcmFuZ2VDb250cm9scyA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAnY2xhc3MnOiB0aGlzLmFjdGlvbnNSYW5nZUNvbnRyb2xzQ2xhc3Nlc1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5QYWdpbmF0aW9uKCksXHJcbiAgICAgICAgdGhpcy5nZW5QcmV2SWNvbigpLFxyXG4gICAgICAgIHRoaXMuZ2VuTmV4dEljb24oKVxyXG4gICAgICBdKVxyXG5cclxuICAgICAgcmV0dXJuIFt0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogdGhpcy5hY3Rpb25zQ2xhc3Nlc1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy4kc2xvdHNbJ2FjdGlvbnMtcHJlcGVuZCddID8gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge30sIHRoaXMuJHNsb3RzWydhY3Rpb25zLXByZXBlbmQnXSkgOiBudWxsLFxyXG4gICAgICAgIHRoaXMucm93c1BlclBhZ2VJdGVtcy5sZW5ndGggPiAxID8gdGhpcy5nZW5TZWxlY3QoKSA6IG51bGwsXHJcbiAgICAgICAgcmFuZ2VDb250cm9scyxcclxuICAgICAgICB0aGlzLiRzbG90c1snYWN0aW9ucy1hcHBlbmQnXSA/IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHt9LCB0aGlzLiRzbG90c1snYWN0aW9ucy1hcHBlbmQnXSkgOiBudWxsXHJcbiAgICAgIF0pXVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=