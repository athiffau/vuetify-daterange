import { consoleWarn } from '../../../util/console';
import VCheckbox from '../../VCheckbox';
import VIcon from '../../VIcon';
/* @vue/component */
export default {
    props: {
        sortIcon: {
            type: String,
            default: '$vuetify.icons.sort'
        }
    },
    methods: {
        genTHead() {
            if (this.hideHeaders)
                return; // Exit Early since no headers are needed.
            let children = [];
            if (this.$scopedSlots.headers) {
                const row = this.$scopedSlots.headers({
                    headers: this.headers,
                    indeterminate: this.indeterminate,
                    all: this.everyItem
                });
                children = [this.hasTag(row, 'th') ? this.genTR(row) : row, this.genTProgress()];
            }
            else {
                const row = this.headers.map((o, i) => this.genHeader(o, this.headerKey ? o[this.headerKey] : i));
                const checkbox = this.$createElement(VCheckbox, {
                    props: {
                        dark: this.dark,
                        light: this.light,
                        color: this.selectAll === true ? '' : this.selectAll,
                        hideDetails: true,
                        inputValue: this.everyItem,
                        indeterminate: this.indeterminate
                    },
                    on: { change: this.toggle }
                });
                this.hasSelectAll && row.unshift(this.$createElement('th', [checkbox]));
                children = [this.genTR(row), this.genTProgress()];
            }
            return this.$createElement('thead', [children]);
        },
        genHeader(header, key) {
            const array = [
                this.$scopedSlots.headerCell
                    ? this.$scopedSlots.headerCell({ header })
                    : header[this.headerText]
            ];
            return this.$createElement('th', ...this.genHeaderData(header, array, key));
        },
        genHeaderData(header, children, key) {
            const classes = ['column'];
            const data = {
                key,
                attrs: {
                    role: 'columnheader',
                    scope: 'col',
                    width: header.width || null,
                    'aria-label': header[this.headerText] || '',
                    'aria-sort': 'none'
                }
            };
            if (header.sortable == null || header.sortable) {
                this.genHeaderSortingData(header, children, data, classes);
            }
            else {
                data.attrs['aria-label'] += ': Not sorted.'; // TODO: Localization
            }
            classes.push(`text-xs-${header.align || 'left'}`);
            if (Array.isArray(header.class)) {
                classes.push(...header.class);
            }
            else if (header.class) {
                classes.push(header.class);
            }
            data.class = classes;
            return [data, children];
        },
        genHeaderSortingData(header, children, data, classes) {
            if (!('value' in header)) {
                consoleWarn('Headers must have a value property that corresponds to a value in the v-model array', this);
            }
            data.attrs.tabIndex = 0;
            data.on = {
                click: () => {
                    this.expanded = {};
                    this.sort(header.value);
                },
                keydown: e => {
                    // check for space
                    if (e.keyCode === 32) {
                        e.preventDefault();
                        this.sort(header.value);
                    }
                }
            };
            classes.push('sortable');
            const icon = this.$createElement(VIcon, {
                props: {
                    small: true
                }
            }, this.sortIcon);
            if (!header.align || header.align === 'left') {
                children.push(icon);
            }
            else {
                children.unshift(icon);
            }
            const pagination = this.computedPagination;
            const beingSorted = pagination.sortBy === header.value;
            if (beingSorted) {
                classes.push('active');
                if (pagination.descending) {
                    classes.push('desc');
                    data.attrs['aria-sort'] = 'descending';
                    data.attrs['aria-label'] += ': Sorted descending. Activate to remove sorting.'; // TODO: Localization
                }
                else {
                    classes.push('asc');
                    data.attrs['aria-sort'] = 'ascending';
                    data.attrs['aria-label'] += ': Sorted ascending. Activate to sort descending.'; // TODO: Localization
                }
            }
            else {
                data.attrs['aria-label'] += ': Not sorted. Activate to sort ascending.'; // TODO: Localization
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRhVGFibGUvbWl4aW5zL2hlYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFBO0FBRW5ELE9BQU8sU0FBUyxNQUFNLGlCQUFpQixDQUFBO0FBQ3ZDLE9BQU8sS0FBSyxNQUFNLGFBQWEsQ0FBQTtBQUUvQixvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLEtBQUssRUFBRTtRQUNMLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLHFCQUFxQjtTQUMvQjtLQUNGO0lBRUQsT0FBTyxFQUFFO1FBQ1AsUUFBUTtZQUNOLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQUUsT0FBTSxDQUFDLDBDQUEwQztZQUV2RSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUE7WUFFakIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtnQkFDN0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7b0JBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztvQkFDckIsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO29CQUNqQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVM7aUJBQ3BCLENBQUMsQ0FBQTtnQkFFRixRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBO2FBQ2pGO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENB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Y29uc29sZSdcclxuXHJcbmltcG9ydCBWQ2hlY2tib3ggZnJvbSAnLi4vLi4vVkNoZWNrYm94J1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vLi4vVkljb24nXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgcHJvcHM6IHtcclxuICAgIHNvcnRJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnNvcnQnXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuVEhlYWQgKCkge1xyXG4gICAgICBpZiAodGhpcy5oaWRlSGVhZGVycykgcmV0dXJuIC8vIEV4aXQgRWFybHkgc2luY2Ugbm8gaGVhZGVycyBhcmUgbmVlZGVkLlxyXG5cclxuICAgICAgbGV0IGNoaWxkcmVuID0gW11cclxuXHJcbiAgICAgIGlmICh0aGlzLiRzY29wZWRTbG90cy5oZWFkZXJzKSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy4kc2NvcGVkU2xvdHMuaGVhZGVycyh7XHJcbiAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXHJcbiAgICAgICAgICBpbmRldGVybWluYXRlOiB0aGlzLmluZGV0ZXJtaW5hdGUsXHJcbiAgICAgICAgICBhbGw6IHRoaXMuZXZlcnlJdGVtXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgY2hpbGRyZW4gPSBbdGhpcy5oYXNUYWcocm93LCAndGgnKSA/IHRoaXMuZ2VuVFIocm93KSA6IHJvdywgdGhpcy5nZW5UUHJvZ3Jlc3MoKV1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmhlYWRlcnMubWFwKChvLCBpKSA9PiB0aGlzLmdlbkhlYWRlcihvLCB0aGlzLmhlYWRlcktleSA/IG9bdGhpcy5oZWFkZXJLZXldIDogaSkpXHJcbiAgICAgICAgY29uc3QgY2hlY2tib3ggPSB0aGlzLiRjcmVhdGVFbGVtZW50KFZDaGVja2JveCwge1xyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgICAgY29sb3I6IHRoaXMuc2VsZWN0QWxsID09PSB0cnVlID8gJycgOiB0aGlzLnNlbGVjdEFsbCxcclxuICAgICAgICAgICAgaGlkZURldGFpbHM6IHRydWUsXHJcbiAgICAgICAgICAgIGlucHV0VmFsdWU6IHRoaXMuZXZlcnlJdGVtLFxyXG4gICAgICAgICAgICBpbmRldGVybWluYXRlOiB0aGlzLmluZGV0ZXJtaW5hdGVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogeyBjaGFuZ2U6IHRoaXMudG9nZ2xlIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLmhhc1NlbGVjdEFsbCAmJiByb3cudW5zaGlmdCh0aGlzLiRjcmVhdGVFbGVtZW50KCd0aCcsIFtjaGVja2JveF0pKVxyXG5cclxuICAgICAgICBjaGlsZHJlbiA9IFt0aGlzLmdlblRSKHJvdyksIHRoaXMuZ2VuVFByb2dyZXNzKCldXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0aGVhZCcsIFtjaGlsZHJlbl0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZGVyIChoZWFkZXIsIGtleSkge1xyXG4gICAgICBjb25zdCBhcnJheSA9IFtcclxuICAgICAgICB0aGlzLiRzY29wZWRTbG90cy5oZWFkZXJDZWxsXHJcbiAgICAgICAgICA/IHRoaXMuJHNjb3BlZFNsb3RzLmhlYWRlckNlbGwoeyBoZWFkZXIgfSlcclxuICAgICAgICAgIDogaGVhZGVyW3RoaXMuaGVhZGVyVGV4dF1cclxuICAgICAgXVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3RoJywgLi4udGhpcy5nZW5IZWFkZXJEYXRhKGhlYWRlciwgYXJyYXksIGtleSkpXHJcbiAgICB9LFxyXG4gICAgZ2VuSGVhZGVyRGF0YSAoaGVhZGVyLCBjaGlsZHJlbiwga2V5KSB7XHJcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSBbJ2NvbHVtbiddXHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAga2V5LFxyXG4gICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICByb2xlOiAnY29sdW1uaGVhZGVyJyxcclxuICAgICAgICAgIHNjb3BlOiAnY29sJyxcclxuICAgICAgICAgIHdpZHRoOiBoZWFkZXIud2lkdGggfHwgbnVsbCxcclxuICAgICAgICAgICdhcmlhLWxhYmVsJzogaGVhZGVyW3RoaXMuaGVhZGVyVGV4dF0gfHwgJycsXHJcbiAgICAgICAgICAnYXJpYS1zb3J0JzogJ25vbmUnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaGVhZGVyLnNvcnRhYmxlID09IG51bGwgfHwgaGVhZGVyLnNvcnRhYmxlKSB7XHJcbiAgICAgICAgdGhpcy5nZW5IZWFkZXJTb3J0aW5nRGF0YShoZWFkZXIsIGNoaWxkcmVuLCBkYXRhLCBjbGFzc2VzKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRhdGEuYXR0cnNbJ2FyaWEtbGFiZWwnXSArPSAnOiBOb3Qgc29ydGVkLicgLy8gVE9ETzogTG9jYWxpemF0aW9uXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNsYXNzZXMucHVzaChgdGV4dC14cy0ke2hlYWRlci5hbGlnbiB8fCAnbGVmdCd9YClcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaGVhZGVyLmNsYXNzKSkge1xyXG4gICAgICAgIGNsYXNzZXMucHVzaCguLi5oZWFkZXIuY2xhc3MpXHJcbiAgICAgIH0gZWxzZSBpZiAoaGVhZGVyLmNsYXNzKSB7XHJcbiAgICAgICAgY2xhc3Nlcy5wdXNoKGhlYWRlci5jbGFzcylcclxuICAgICAgfVxyXG4gICAgICBkYXRhLmNsYXNzID0gY2xhc3Nlc1xyXG5cclxuICAgICAgcmV0dXJuIFtkYXRhLCBjaGlsZHJlbl1cclxuICAgIH0sXHJcbiAgICBnZW5IZWFkZXJTb3J0aW5nRGF0YSAoaGVhZGVyLCBjaGlsZHJlbiwgZGF0YSwgY2xhc3Nlcykge1xyXG4gICAgICBpZiAoISgndmFsdWUnIGluIGhlYWRlcikpIHtcclxuICAgICAgICBjb25zb2xlV2FybignSGVhZGVycyBtdXN0IGhhdmUgYSB2YWx1ZSBwcm9wZXJ0eSB0aGF0IGNvcnJlc3BvbmRzIHRvIGEgdmFsdWUgaW4gdGhlIHYtbW9kZWwgYXJyYXknLCB0aGlzKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhLmF0dHJzLnRhYkluZGV4ID0gMFxyXG4gICAgICBkYXRhLm9uID0ge1xyXG4gICAgICAgIGNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmV4cGFuZGVkID0ge31cclxuICAgICAgICAgIHRoaXMuc29ydChoZWFkZXIudmFsdWUpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBrZXlkb3duOiBlID0+IHtcclxuICAgICAgICAgIC8vIGNoZWNrIGZvciBzcGFjZVxyXG4gICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMzIpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIHRoaXMuc29ydChoZWFkZXIudmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGFzc2VzLnB1c2goJ3NvcnRhYmxlJylcclxuICAgICAgY29uc3QgaWNvbiA9IHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgc21hbGw6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMuc29ydEljb24pXHJcbiAgICAgIGlmICghaGVhZGVyLmFsaWduIHx8IGhlYWRlci5hbGlnbiA9PT0gJ2xlZnQnKSB7XHJcbiAgICAgICAgY2hpbGRyZW4ucHVzaChpY29uKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNoaWxkcmVuLnVuc2hpZnQoaWNvbilcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IHRoaXMuY29tcHV0ZWRQYWdpbmF0aW9uXHJcbiAgICAgIGNvbnN0IGJlaW5nU29ydGVkID0gcGFnaW5hdGlvbi5zb3J0QnkgPT09IGhlYWRlci52YWx1ZVxyXG4gICAgICBpZiAoYmVpbmdTb3J0ZWQpIHtcclxuICAgICAgICBjbGFzc2VzLnB1c2goJ2FjdGl2ZScpXHJcbiAgICAgICAgaWYgKHBhZ2luYXRpb24uZGVzY2VuZGluZykge1xyXG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCdkZXNjJylcclxuICAgICAgICAgIGRhdGEuYXR0cnNbJ2FyaWEtc29ydCddID0gJ2Rlc2NlbmRpbmcnXHJcbiAgICAgICAgICBkYXRhLmF0dHJzWydhcmlhLWxhYmVsJ10gKz0gJzogU29ydGVkIGRlc2NlbmRpbmcuIEFjdGl2YXRlIHRvIHJlbW92ZSBzb3J0aW5nLicgLy8gVE9ETzogTG9jYWxpemF0aW9uXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNsYXNzZXMucHVzaCgnYXNjJylcclxuICAgICAgICAgIGRhdGEuYXR0cnNbJ2FyaWEtc29ydCddID0gJ2FzY2VuZGluZydcclxuICAgICAgICAgIGRhdGEuYXR0cnNbJ2FyaWEtbGFiZWwnXSArPSAnOiBTb3J0ZWQgYXNjZW5kaW5nLiBBY3RpdmF0ZSB0byBzb3J0IGRlc2NlbmRpbmcuJyAvLyBUT0RPOiBMb2NhbGl6YXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YS5hdHRyc1snYXJpYS1sYWJlbCddICs9ICc6IE5vdCBzb3J0ZWQuIEFjdGl2YXRlIHRvIHNvcnQgYXNjZW5kaW5nLicgLy8gVE9ETzogTG9jYWxpemF0aW9uXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19