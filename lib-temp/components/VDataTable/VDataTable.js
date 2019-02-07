import '../../stylus/components/_tables.styl';
import '../../stylus/components/_data-table.styl';
import DataIterable from '../../mixins/data-iterable';
import Head from './mixins/head';
import Body from './mixins/body';
import Foot from './mixins/foot';
import Progress from './mixins/progress';
import { createSimpleFunctional, getObjectValueByPath } from '../../util/helpers';
// Importing does not work properly
const VTableOverflow = createSimpleFunctional('v-table__overflow');
/* @vue/component */
export default {
    name: 'v-data-table',
    mixins: [DataIterable, Head, Body, Foot, Progress],
    props: {
        headers: {
            type: Array,
            default: () => []
        },
        headersLength: {
            type: Number
        },
        headerText: {
            type: String,
            default: 'text'
        },
        headerKey: {
            type: String,
            default: null
        },
        hideHeaders: Boolean,
        rowsPerPageText: {
            type: String,
            default: '$vuetify.dataTable.rowsPerPageText'
        },
        customFilter: {
            type: Function,
            default: (items, search, filter, headers) => {
                search = search.toString().toLowerCase();
                if (search.trim() === '')
                    return items;
                const props = headers.map(h => h.value);
                return items.filter(item => props.some(prop => filter(getObjectValueByPath(item, prop, item[prop]), search)));
            }
        }
    },
    data() {
        return {
            actionsClasses: 'v-datatable__actions',
            actionsRangeControlsClasses: 'v-datatable__actions__range-controls',
            actionsSelectClasses: 'v-datatable__actions__select',
            actionsPaginationClasses: 'v-datatable__actions__pagination'
        };
    },
    computed: {
        classes() {
            return {
                'v-datatable v-table': true,
                'v-datatable--select-all': this.selectAll !== false,
                ...this.themeClasses
            };
        },
        filteredItems() {
            return this.filteredItemsImpl(this.headers);
        },
        headerColumns() {
            return this.headersLength || this.headers.length + (this.selectAll !== false);
        }
    },
    created() {
        const firstSortable = this.headers.find(h => (!('sortable' in h) || h.sortable));
        this.defaultPagination.sortBy = !this.disableInitialSort && firstSortable
            ? firstSortable.value
            : null;
        this.initPagination();
    },
    methods: {
        hasTag(elements, tag) {
            return Array.isArray(elements) && elements.find(e => e.tag === tag);
        },
        genTR(children, data = {}) {
            return this.$createElement('tr', data, children);
        }
    },
    render(h) {
        const tableOverflow = h(VTableOverflow, {}, [
            h('table', {
                'class': this.classes
            }, [
                this.genTHead(),
                this.genTBody(),
                this.genTFoot()
            ])
        ]);
        return h('div', [
            tableOverflow,
            this.genActionsFooter()
        ]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGFUYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvVkRhdGFUYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHNDQUFzQyxDQUFBO0FBQzdDLE9BQU8sMENBQTBDLENBQUE7QUFFakQsT0FBTyxZQUFZLE1BQU0sNEJBQTRCLENBQUE7QUFFckQsT0FBTyxJQUFJLE1BQU0sZUFBZSxDQUFBO0FBQ2hDLE9BQU8sSUFBSSxNQUFNLGVBQWUsQ0FBQTtBQUNoQyxPQUFPLElBQUksTUFBTSxlQUFlLENBQUE7QUFDaEMsT0FBTyxRQUFRLE1BQU0sbUJBQW1CLENBQUE7QUFFeEMsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixvQkFBb0IsRUFDckIsTUFBTSxvQkFBb0IsQ0FBQTtBQUUzQixtQ0FBbUM7QUFDbkMsTUFBTSxjQUFjLEdBQUcsc0JBQXNCLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUVsRSxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxjQUFjO0lBRXBCLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7SUFFbEQsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtTQUNsQjtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxNQUFNO1NBQ2I7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxNQUFNO1NBQ2hCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsV0FBVyxFQUFFLE9BQU87UUFDcEIsZUFBZSxFQUFFO1lBQ2YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVB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USxFQUFFO2dCQUNmLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLFFBQVEsRUFBRTthQUNoQixDQUFDO1NBQ0gsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsYUFBYTtZQUNiLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtTQUN4QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3RhYmxlcy5zdHlsJ1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19kYXRhLXRhYmxlLnN0eWwnXHJcblxyXG5pbXBvcnQgRGF0YUl0ZXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9kYXRhLWl0ZXJhYmxlJ1xyXG5cclxuaW1wb3J0IEhlYWQgZnJvbSAnLi9taXhpbnMvaGVhZCdcclxuaW1wb3J0IEJvZHkgZnJvbSAnLi9taXhpbnMvYm9keSdcclxuaW1wb3J0IEZvb3QgZnJvbSAnLi9taXhpbnMvZm9vdCdcclxuaW1wb3J0IFByb2dyZXNzIGZyb20gJy4vbWl4aW5zL3Byb2dyZXNzJ1xyXG5cclxuaW1wb3J0IHtcclxuICBjcmVhdGVTaW1wbGVGdW5jdGlvbmFsLFxyXG4gIGdldE9iamVjdFZhbHVlQnlQYXRoXHJcbn0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5cclxuLy8gSW1wb3J0aW5nIGRvZXMgbm90IHdvcmsgcHJvcGVybHlcclxuY29uc3QgVlRhYmxlT3ZlcmZsb3cgPSBjcmVhdGVTaW1wbGVGdW5jdGlvbmFsKCd2LXRhYmxlX19vdmVyZmxvdycpXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZGF0YS10YWJsZScsXHJcblxyXG4gIG1peGluczogW0RhdGFJdGVyYWJsZSwgSGVhZCwgQm9keSwgRm9vdCwgUHJvZ3Jlc3NdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICB0eXBlOiBBcnJheSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gW11cclxuICAgIH0sXHJcbiAgICBoZWFkZXJzTGVuZ3RoOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlclxyXG4gICAgfSxcclxuICAgIGhlYWRlclRleHQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAndGV4dCdcclxuICAgIH0sXHJcbiAgICBoZWFkZXJLZXk6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgaGlkZUhlYWRlcnM6IEJvb2xlYW4sXHJcbiAgICByb3dzUGVyUGFnZVRleHQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuZGF0YVRhYmxlLnJvd3NQZXJQYWdlVGV4dCdcclxuICAgIH0sXHJcbiAgICBjdXN0b21GaWx0ZXI6IHtcclxuICAgICAgdHlwZTogRnVuY3Rpb24sXHJcbiAgICAgIGRlZmF1bHQ6IChpdGVtcywgc2VhcmNoLCBmaWx0ZXIsIGhlYWRlcnMpID0+IHtcclxuICAgICAgICBzZWFyY2ggPSBzZWFyY2gudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgaWYgKHNlYXJjaC50cmltKCkgPT09ICcnKSByZXR1cm4gaXRlbXNcclxuXHJcbiAgICAgICAgY29uc3QgcHJvcHMgPSBoZWFkZXJzLm1hcChoID0+IGgudmFsdWUpXHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtcy5maWx0ZXIoaXRlbSA9PiBwcm9wcy5zb21lKHByb3AgPT4gZmlsdGVyKGdldE9iamVjdFZhbHVlQnlQYXRoKGl0ZW0sIHByb3AsIGl0ZW1bcHJvcF0pLCBzZWFyY2gpKSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWN0aW9uc0NsYXNzZXM6ICd2LWRhdGF0YWJsZV9fYWN0aW9ucycsXHJcbiAgICAgIGFjdGlvbnNSYW5nZUNvbnRyb2xzQ2xhc3NlczogJ3YtZGF0YXRhYmxlX19hY3Rpb25zX19yYW5nZS1jb250cm9scycsXHJcbiAgICAgIGFjdGlvbnNTZWxlY3RDbGFzc2VzOiAndi1kYXRhdGFibGVfX2FjdGlvbnNfX3NlbGVjdCcsXHJcbiAgICAgIGFjdGlvbnNQYWdpbmF0aW9uQ2xhc3NlczogJ3YtZGF0YXRhYmxlX19hY3Rpb25zX19wYWdpbmF0aW9uJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1kYXRhdGFibGUgdi10YWJsZSc6IHRydWUsXHJcbiAgICAgICAgJ3YtZGF0YXRhYmxlLS1zZWxlY3QtYWxsJzogdGhpcy5zZWxlY3RBbGwgIT09IGZhbHNlLFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmaWx0ZXJlZEl0ZW1zICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyZWRJdGVtc0ltcGwodGhpcy5oZWFkZXJzKVxyXG4gICAgfSxcclxuICAgIGhlYWRlckNvbHVtbnMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oZWFkZXJzTGVuZ3RoIHx8IHRoaXMuaGVhZGVycy5sZW5ndGggKyAodGhpcy5zZWxlY3RBbGwgIT09IGZhbHNlKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWQgKCkge1xyXG4gICAgY29uc3QgZmlyc3RTb3J0YWJsZSA9IHRoaXMuaGVhZGVycy5maW5kKGggPT4gKFxyXG4gICAgICAhKCdzb3J0YWJsZScgaW4gaCkgfHwgaC5zb3J0YWJsZSlcclxuICAgIClcclxuXHJcbiAgICB0aGlzLmRlZmF1bHRQYWdpbmF0aW9uLnNvcnRCeSA9ICF0aGlzLmRpc2FibGVJbml0aWFsU29ydCAmJiBmaXJzdFNvcnRhYmxlXHJcbiAgICAgID8gZmlyc3RTb3J0YWJsZS52YWx1ZVxyXG4gICAgICA6IG51bGxcclxuXHJcbiAgICB0aGlzLmluaXRQYWdpbmF0aW9uKClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBoYXNUYWcgKGVsZW1lbnRzLCB0YWcpIHtcclxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZWxlbWVudHMpICYmIGVsZW1lbnRzLmZpbmQoZSA9PiBlLnRhZyA9PT0gdGFnKVxyXG4gICAgfSxcclxuICAgIGdlblRSIChjaGlsZHJlbiwgZGF0YSA9IHt9KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cicsIGRhdGEsIGNoaWxkcmVuKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgY29uc3QgdGFibGVPdmVyZmxvdyA9IGgoVlRhYmxlT3ZlcmZsb3csIHt9LCBbXHJcbiAgICAgIGgoJ3RhYmxlJywge1xyXG4gICAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3Nlc1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5USGVhZCgpLFxyXG4gICAgICAgIHRoaXMuZ2VuVEJvZHkoKSxcclxuICAgICAgICB0aGlzLmdlblRGb290KClcclxuICAgICAgXSlcclxuICAgIF0pXHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIFtcclxuICAgICAgdGFibGVPdmVyZmxvdyxcclxuICAgICAgdGhpcy5nZW5BY3Rpb25zRm9vdGVyKClcclxuICAgIF0pXHJcbiAgfVxyXG59XHJcbiJdfQ==