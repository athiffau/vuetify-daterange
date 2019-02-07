import ExpandTransitionGenerator from '../../transitions/expand-transition';
import { getObjectValueByPath } from '../../../util/helpers';
/* @vue/component */
export default {
    methods: {
        genTBody() {
            const children = this.genItems();
            return this.$createElement('tbody', children);
        },
        genExpandedRow(props) {
            const children = [];
            if (this.isExpanded(props.item)) {
                const expand = this.$createElement('div', {
                    class: 'v-datatable__expand-content',
                    key: getObjectValueByPath(props.item, this.itemKey)
                }, [this.$scopedSlots.expand(props)]);
                children.push(expand);
            }
            const transition = this.$createElement('transition-group', {
                class: 'v-datatable__expand-col',
                attrs: { colspan: this.headerColumns },
                props: {
                    tag: 'td'
                },
                on: ExpandTransitionGenerator('v-datatable__expand-col--expanded')
            }, children);
            return this.genTR([transition], { class: 'v-datatable__expand-row' });
        },
        genFilteredItems() {
            if (!this.$scopedSlots.items) {
                return null;
            }
            const rows = [];
            for (let index = 0, len = this.filteredItems.length; index < len; ++index) {
                const item = this.filteredItems[index];
                const props = this.createProps(item, index);
                const row = this.$scopedSlots.items(props);
                rows.push(this.hasTag(row, 'td')
                    ? this.genTR(row, {
                        key: this.itemKey ? getObjectValueByPath(props.item, this.itemKey) : index,
                        attrs: { active: this.isSelected(item) }
                    })
                    : row);
                if (this.$scopedSlots.expand) {
                    const expandRow = this.genExpandedRow(props);
                    rows.push(expandRow);
                }
            }
            return rows;
        },
        genEmptyItems(content) {
            if (this.hasTag(content, 'tr')) {
                return content;
            }
            else if (this.hasTag(content, 'td')) {
                return this.genTR(content);
            }
            else {
                return this.genTR([this.$createElement('td', {
                        class: {
                            'text-xs-center': typeof content === 'string'
                        },
                        attrs: { colspan: this.headerColumns }
                    }, content)]);
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvbWl4aW5zL2JvZHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyx5QkFBeUIsTUFBTSxxQ0FBcUMsQ0FBQTtBQUUzRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1RCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLE9BQU8sRUFBRTtRQUNQLFFBQVE7WUFDTixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7WUFFaEMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUMvQyxDQUFDO1FBQ0QsY0FBYyxDQUFFLEtBQUs7WUFDbkIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO1lBRW5CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUN4QyxLQUFLLEVBQUUsNkJBQTZCO29CQUNwQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO2lCQUNwRCxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUVyQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ3RCO1lBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDekQsS0FBSyxFQUFFLHlCQUF5QjtnQkFDaEMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RDLEtBQUssRUFBRTtvQkFDTCxHQUFHLEVBQUUsSUFBSTtpQkFDVjtnQkFDRCxFQUFFLEVBQUUseUJBQXlCLENBQUMsbUNBQW1DLENBQUM7YUFDbkUsRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUVaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQTtRQUN2RSxDQUFDO1FBQ0QsZ0JBQWdCO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFO2dCQUM1QixPQUFPLElBQUksQ0FBQTthQUNaO1lBRUQsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFBO1lBQ2YsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUU7Z0JBQ3pFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ3RDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO2dCQUMzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFFMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTt3QkFDaEIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLO3dCQUMxRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtxQkFDekMsQ0FBQztvQkFDRixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBRVIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtvQkFDNUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtpQkFDckI7YUFDRjtZQUVELE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUNELGFBQWEsQ0FBRSxPQUFPO1lBQ3BCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sT0FBTyxDQUFBO2FBQ2Y7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDckMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQzNCO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFO3dCQUMzQyxLQUFLLEVBQUU7NEJBQ0wsZ0JBQWdCLEVBQUUsT0FBTyxPQUFPLEtBQUssUUFBUTt5QkFDOUM7d0JBQ0QsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7cUJBQ3ZDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ2Q7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cGFuZFRyYW5zaXRpb25HZW5lcmF0b3IgZnJvbSAnLi4vLi4vdHJhbnNpdGlvbnMvZXhwYW5kLXRyYW5zaXRpb24nXHJcblxyXG5pbXBvcnQgeyBnZXRPYmplY3RWYWx1ZUJ5UGF0aCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5UQm9keSAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5nZW5JdGVtcygpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGJvZHknLCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICBnZW5FeHBhbmRlZFJvdyAocHJvcHMpIHtcclxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXVxyXG5cclxuICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZChwcm9wcy5pdGVtKSkge1xyXG4gICAgICAgIGNvbnN0IGV4cGFuZCA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAgIGNsYXNzOiAndi1kYXRhdGFibGVfX2V4cGFuZC1jb250ZW50JyxcclxuICAgICAgICAgIGtleTogZ2V0T2JqZWN0VmFsdWVCeVBhdGgocHJvcHMuaXRlbSwgdGhpcy5pdGVtS2V5KVxyXG4gICAgICAgIH0sIFt0aGlzLiRzY29wZWRTbG90cy5leHBhbmQocHJvcHMpXSlcclxuXHJcbiAgICAgICAgY2hpbGRyZW4ucHVzaChleHBhbmQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uLWdyb3VwJywge1xyXG4gICAgICAgIGNsYXNzOiAndi1kYXRhdGFibGVfX2V4cGFuZC1jb2wnLFxyXG4gICAgICAgIGF0dHJzOiB7IGNvbHNwYW46IHRoaXMuaGVhZGVyQ29sdW1ucyB9LFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICB0YWc6ICd0ZCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBFeHBhbmRUcmFuc2l0aW9uR2VuZXJhdG9yKCd2LWRhdGF0YWJsZV9fZXhwYW5kLWNvbC0tZXhwYW5kZWQnKVxyXG4gICAgICB9LCBjaGlsZHJlbilcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdlblRSKFt0cmFuc2l0aW9uXSwgeyBjbGFzczogJ3YtZGF0YXRhYmxlX19leHBhbmQtcm93JyB9KVxyXG4gICAgfSxcclxuICAgIGdlbkZpbHRlcmVkSXRlbXMgKCkge1xyXG4gICAgICBpZiAoIXRoaXMuJHNjb3BlZFNsb3RzLml0ZW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgcm93cyA9IFtdXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgbGVuID0gdGhpcy5maWx0ZXJlZEl0ZW1zLmxlbmd0aDsgaW5kZXggPCBsZW47ICsraW5kZXgpIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5maWx0ZXJlZEl0ZW1zW2luZGV4XVxyXG4gICAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jcmVhdGVQcm9wcyhpdGVtLCBpbmRleClcclxuICAgICAgICBjb25zdCByb3cgPSB0aGlzLiRzY29wZWRTbG90cy5pdGVtcyhwcm9wcylcclxuXHJcbiAgICAgICAgcm93cy5wdXNoKHRoaXMuaGFzVGFnKHJvdywgJ3RkJylcclxuICAgICAgICAgID8gdGhpcy5nZW5UUihyb3csIHtcclxuICAgICAgICAgICAga2V5OiB0aGlzLml0ZW1LZXkgPyBnZXRPYmplY3RWYWx1ZUJ5UGF0aChwcm9wcy5pdGVtLCB0aGlzLml0ZW1LZXkpIDogaW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzOiB7IGFjdGl2ZTogdGhpcy5pc1NlbGVjdGVkKGl0ZW0pIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICA6IHJvdylcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzLmV4cGFuZCkge1xyXG4gICAgICAgICAgY29uc3QgZXhwYW5kUm93ID0gdGhpcy5nZW5FeHBhbmRlZFJvdyhwcm9wcylcclxuICAgICAgICAgIHJvd3MucHVzaChleHBhbmRSb3cpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcm93c1xyXG4gICAgfSxcclxuICAgIGdlbkVtcHR5SXRlbXMgKGNvbnRlbnQpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzVGFnKGNvbnRlbnQsICd0cicpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1RhZyhjb250ZW50LCAndGQnKSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdlblRSKGNvbnRlbnQpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuVFIoW3RoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RkJywge1xyXG4gICAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICAgJ3RleHQteHMtY2VudGVyJzogdHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYXR0cnM6IHsgY29sc3BhbjogdGhpcy5oZWFkZXJDb2x1bW5zIH1cclxuICAgICAgICB9LCBjb250ZW50KV0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19