// Components
import VDatePickerTitle from './VDatePickerTitle';
import VDatePickerHeader from './VDatePickerHeader';
import VDatePickerDateTable from './VDatePickerDateTable';
import VDatePickerMonthTable from './VDatePickerMonthTable';
import VDatePickerYears from './VDatePickerYears';
// Mixins
import Picker from '../../mixins/picker';
// Utils
import { pad, createNativeLocaleFormatter } from './util';
import isDateAllowed from './util/isDateAllowed';
import { consoleWarn } from '../../util/console';
import { daysInMonth } from '../VCalendar/util/timestamp';
import mixins from '../../util/mixins';
// Adds leading zero to month/day if necessary, returns 'YYYY' if type = 'year',
// 'YYYY-MM' if 'month' and 'YYYY-MM-DD' if 'date'
function sanitizeDateString(dateString, type) {
    const [year, month = 1, date = 1] = dateString.split('-');
    return `${year}-${pad(month)}-${pad(date)}`.substr(0, { date: 10, month: 7, year: 4 }[type]);
}
export default mixins(Picker
/* @vue/component */
).extend({
    name: 'v-date-picker',
    props: {
        allowDateChange: {
            type: Boolean,
            default: true
        },
        allowedDates: Function,
        // Function formatting the day in date picker table
        dayFormat: Function,
        disabled: Boolean,
        events: {
            type: [Array, Function, Object],
            default: () => null
        },
        eventColor: {
            type: [Array, Function, Object, String],
            default: () => 'warning'
        },
        firstDayOfWeek: {
            type: [String, Number],
            default: 0
        },
        // Function formatting the tableDate in the day/month table header
        headerDateFormat: Function,
        hideDisabled: {
            type: Boolean,
            default: false
        },
        hoverLink: String,
        locale: {
            type: String,
            default: 'en-us'
        },
        max: String,
        min: String,
        // Function formatting month in the months table
        monthFormat: Function,
        multiple: Boolean,
        nextIcon: {
            type: String,
            default: '$vuetify.icons.next'
        },
        pickerDate: String,
        prevIcon: {
            type: String,
            default: '$vuetify.icons.prev'
        },
        range: {
            type: Boolean,
            default: false
        },
        reactive: Boolean,
        readonly: Boolean,
        scrollable: Boolean,
        showCurrent: {
            type: [Boolean, String],
            default: true
        },
        showWeek: Boolean,
        // Function formatting currently selected date in the picker title
        titleDateFormat: Function,
        type: {
            type: String,
            default: 'date',
            validator: (type) => ['date', 'month'].includes(type) // TODO: year
        },
        value: [Array, String],
        weekdayFormat: Function,
        // Function formatting the year in table header and pickup title
        yearFormat: Function,
        yearIcon: String
    },
    data() {
        const now = new Date();
        return {
            activePicker: this.type.toUpperCase(),
            inputDay: null,
            inputMonth: null,
            inputYear: null,
            isReversing: false,
            hovering: '',
            now,
            // tableDate is a string in 'YYYY' / 'YYYY-M' format (leading zero for month is not required)
            tableDate: (() => {
                if (this.pickerDate) {
                    return this.pickerDate;
                }
                const date = (this.multiple ? this.value[this.value.length - 1] : this.value) ||
                    `${now.getFullYear()}-${now.getMonth() + 1}`;
                return sanitizeDateString(date, this.type === 'date' ? 'month' : 'year');
            })()
        };
    },
    computed: {
        lastValue() {
            return this.multiple ? this.value[this.value.length - 1] : this.value;
        },
        selectedMonths() {
            if (!this.value || !this.value.length || this.type === 'month') {
                return this.value;
            }
            else if (this.multiple) {
                return this.value.map(val => val.substr(0, 7));
            }
            else {
                return this.value.substr(0, 7);
            }
        },
        current() {
            if (this.showCurrent === true) {
                return sanitizeDateString(`${this.now.getFullYear()}-${this.now.getMonth() + 1}-${this.now.getDate()}`, this.type);
            }
            return this.showCurrent || null;
        },
        inputDate() {
            return this.type === 'date'
                ? `${this.inputYear}-${pad(this.inputMonth + 1)}-${pad(this.inputDay)}`
                : `${this.inputYear}-${pad(this.inputMonth + 1)}`;
        },
        tableMonth() {
            return Number((this.pickerDate || this.tableDate).split('-')[1]) - 1;
        },
        tableYear() {
            return Number((this.pickerDate || this.tableDate).split('-')[0]);
        },
        minMonth() {
            return this.min ? sanitizeDateString(this.min, 'month') : null;
        },
        maxMonth() {
            return this.max ? sanitizeDateString(this.max, 'month') : null;
        },
        minYear() {
            return this.min ? sanitizeDateString(this.min, 'year') : null;
        },
        maxYear() {
            return this.max ? sanitizeDateString(this.max, 'year') : null;
        },
        formatters() {
            return {
                year: this.yearFormat || createNativeLocaleFormatter(this.locale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 }),
                titleDate: this.titleDateFormat || (this.multiple ? this.defaultTitleMultipleDateFormatter : this.defaultTitleDateFormatter),
                titleMonthYear: this.defaultRangeTitleFormatter
            };
        },
        defaultTitleMultipleDateFormatter() {
            if (this.value.length < 2) {
                return dates => dates.length ? this.defaultTitleDateFormatter(dates[0]) : '0 selected';
            }
            return dates => `${dates.length} selected`;
        },
        defaultTitleDateFormatter() {
            const titleFormats = {
                year: { year: 'numeric', timeZone: 'UTC' },
                month: { month: 'long', timeZone: 'UTC' },
                date: { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }
            };
            const titleDateFormatter = createNativeLocaleFormatter(this.locale, titleFormats[this.type], {
                start: 0,
                length: { date: 10, month: 7, year: 4 }[this.type]
            });
            const landscapeFormatter = (date) => titleDateFormatter(date)
                .replace(/([^\d\s])([\d])/g, (match, nonDigit, digit) => `${nonDigit} ${digit}`)
                .replace(', ', ',<br>');
            return this.landscape ? landscapeFormatter : titleDateFormatter;
        },
        defaultRangeTitleFormatter() {
            const titleRangeFormatter = createNativeLocaleFormatter(this.locale, { month: 'short', day: 'numeric', timeZone: 'UTC' }, {
                start: 0,
                length: 6
            });
            return titleRangeFormatter;
        }
    },
    watch: {
        activePicker(val) {
            this.$emit('pickerType', val);
        },
        tableDate(val, prev) {
            // Make a ISO 8601 strings from val and prev for comparision, otherwise it will incorrectly
            // compare for example '2000-9' and '2000-10'
            const sanitizeType = this.type === 'month' ? 'year' : 'month';
            this.isReversing = sanitizeDateString(val, sanitizeType) < sanitizeDateString(prev, sanitizeType);
            this.$emit('update:pickerDate', val);
        },
        pickerDate(val) {
            if (val) {
                this.tableDate = val;
                this.setInputDate();
            }
            else if (this.lastValue && this.type === 'date') {
                this.tableDate = sanitizeDateString(this.lastValue, 'month');
            }
            else if (this.lastValue && this.type === 'month') {
                this.tableDate = sanitizeDateString(this.lastValue, 'year');
            }
        },
        value(newValue, oldValue) {
            this.checkMultipleProp();
            this.setInputDate();
            if (!this.multiple && this.value && !this.pickerDate) {
                this.tableDate = sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month');
            }
            else if (this.multiple && this.value.length && !oldValue.length && !this.pickerDate) {
                console.log(`Replacing tableDate with ${this.inputDate}`);
                this.tableDate = sanitizeDateString(this.inputDate, this.type === 'month' ? 'year' : 'month');
            }
        },
        type(type) {
            this.activePicker = type.toUpperCase();
            if (this.value && this.value.length) {
                const output = (this.multiple ? this.value : [this.value])
                    .map((val) => sanitizeDateString(val, type))
                    .filter(this.isDateAllowed);
                this.$emit('input', this.multiple ? output : output[0]);
            }
        },
        hovering(value, prev) {
            this.$emit('hoverLink', value);
        }
    },
    created() {
        this.checkMultipleProp();
        if (this.pickerDate !== this.tableDate) {
            this.$emit('update:pickerDate', this.tableDate);
        }
        this.setInputDate();
    },
    methods: {
        emitInput(newInput) {
            const output = this.multiple
                ? (this.value.indexOf(newInput) === -1
                    ? this.value.concat([newInput])
                    : this.value.filter(x => x !== newInput))
                : newInput;
            this.$emit('input', output);
            this.multiple || this.$emit('change', newInput);
        },
        checkMultipleProp() {
            if (this.value == null)
                return;
            const valueType = this.value.constructor.name;
            const expected = this.multiple ? 'Array' : 'String';
            if (valueType !== expected) {
                consoleWarn(`Value must be ${this.multiple ? 'an' : 'a'} ${expected}, got ${valueType}`, this);
            }
        },
        isDateAllowed(value) {
            return isDateAllowed(value, this.min, this.max, this.allowedDates);
        },
        yearClick(value) {
            this.inputYear = value;
            if (this.type === 'month') {
                this.tableDate = `${value}`;
            }
            else {
                this.tableDate = `${value}-${pad((this.tableMonth || 0) + 1)}`;
            }
            this.activePicker = 'MONTH';
            if (this.reactive && !this.readonly && !this.multiple && this.isDateAllowed(this.inputDate)) {
                this.$emit('input', this.inputDate);
            }
        },
        monthClick(value) {
            this.inputYear = parseInt(value.split('-')[0], 10);
            this.inputMonth = parseInt(value.split('-')[1], 10) - 1;
            if (this.type === 'date') {
                if (this.inputDay) {
                    this.inputDay = Math.min(this.inputDay, daysInMonth(this.inputYear, this.inputMonth + 1));
                }
                this.tableDate = value;
                this.activePicker = 'DATE';
                if (this.reactive && !this.readonly && !this.multiple && this.isDateAllowed(this.inputDate)) {
                    this.$emit('input', this.inputDate);
                }
            }
            else {
                this.emitInput(this.inputDate);
            }
        },
        dateClick(value) {
            this.inputYear = parseInt(value.split('-')[0], 10);
            this.inputMonth = parseInt(value.split('-')[1], 10) - 1;
            this.inputDay = parseInt(value.split('-')[2], 10);
            this.emitInput(this.inputDate);
        },
        genPickerTitle() {
            return this.$createElement(VDatePickerTitle, {
                props: {
                    allowDateChange: this.allowDateChange,
                    date: this.value ? this.formatters.titleDate(this.value) : '',
                    disabled: this.disabled,
                    readonly: this.readonly,
                    selectingYear: this.activePicker === 'YEAR',
                    year: this.formatters.year(this.value ? `${this.inputYear}` : this.tableDate),
                    yearIcon: this.yearIcon,
                    value: this.multiple ? this.value[0] : this.value
                },
                slot: 'title',
                on: {
                    'update:selectingYear': (value) => this.activePicker = value ? 'YEAR' : this.type.toUpperCase()
                }
            });
        },
        genTableHeader() {
            return this.$createElement(VDatePickerHeader, {
                props: {
                    allowDateChange: this.allowDateChange,
                    nextIcon: this.nextIcon,
                    color: this.color,
                    dark: this.dark,
                    disabled: this.disabled,
                    format: this.headerDateFormat,
                    hideDisabled: this.hideDisabled,
                    light: this.light,
                    locale: this.locale,
                    min: this.activePicker === 'DATE' ? this.minMonth : this.minYear,
                    max: this.activePicker === 'DATE' ? this.maxMonth : this.maxYear,
                    prevIcon: this.prevIcon,
                    readonly: this.readonly,
                    value: this.activePicker === 'DATE' ? `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}` : `${pad(this.tableYear, 4)}`
                },
                on: {
                    toggle: () => this.activePicker = (this.activePicker === 'DATE' ? 'MONTH' : 'YEAR'),
                    input: (value) => this.tableDate = value
                }
            });
        },
        genDateTable() {
            return this.$createElement(VDatePickerDateTable, {
                props: {
                    allowedDates: this.allowedDates,
                    color: this.color,
                    current: this.current,
                    dark: this.dark,
                    disabled: this.disabled,
                    events: this.events,
                    eventColor: this.eventColor,
                    firstDayOfWeek: this.firstDayOfWeek,
                    format: this.dayFormat,
                    hoverLink: this.hoverLink,
                    light: this.light,
                    locale: this.locale,
                    min: this.min,
                    max: this.max,
                    range: this.range,
                    readonly: this.readonly,
                    scrollable: this.scrollable,
                    showWeek: this.showWeek,
                    tableDate: `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`,
                    value: this.value,
                    weekdayFormat: this.weekdayFormat
                },
                ref: 'table',
                on: {
                    input: this.dateClick,
                    tableDate: (value) => this.tableDate = value,
                    hover: (value) => this.hovering = value,
                    'click:date': (value) => this.$emit('click:date', value),
                    'dblclick:date': (value) => this.$emit('dblclick:date', value),
                    'hoverLink': (value) => this.$emit('hoverLink', value)
                }
            });
        },
        genMonthTable() {
            return this.$createElement(VDatePickerMonthTable, {
                props: {
                    allowedDates: this.type === 'month' ? this.allowedDates : null,
                    color: this.color,
                    current: this.current ? sanitizeDateString(this.current, 'month') : null,
                    dark: this.dark,
                    disabled: this.disabled,
                    events: this.type === 'month' ? this.events : null,
                    eventColor: this.type === 'month' ? this.eventColor : null,
                    format: this.monthFormat,
                    light: this.light,
                    locale: this.locale,
                    min: this.minMonth,
                    max: this.maxMonth,
                    readonly: this.readonly && this.type === 'month',
                    scrollable: this.scrollable,
                    value: this.selectedMonths,
                    viewing: `${pad(this.tableYear, 4)}-${pad(this.tableMonth + 1)}`,
                    tableDate: `${pad(this.tableYear, 4)}`
                },
                ref: 'table',
                on: {
                    input: this.monthClick,
                    tableDate: (value) => this.tableDate = value,
                    'click:month': (value) => this.$emit('click:month', value),
                    'dblclick:month': (value) => this.$emit('dblclick:month', value)
                }
            });
        },
        genYears() {
            return this.$createElement(VDatePickerYears, {
                props: {
                    color: this.color,
                    format: this.yearFormat,
                    locale: this.locale,
                    min: this.minYear,
                    max: this.maxYear,
                    value: this.tableYear
                },
                on: {
                    input: this.yearClick
                }
            });
        },
        genPickerBody() {
            const children = this.activePicker === 'YEAR' ? [
                this.genYears()
            ] : [
                this.genTableHeader(),
                this.activePicker === 'DATE' ? this.genDateTable() : this.genMonthTable()
            ];
            return this.$createElement('div', {
                key: this.activePicker
            }, children);
        },
        setInputDate() {
            const picker = this.pickerDate ? this.pickerDate.split('-') : null;
            if (this.lastValue) {
                const array = this.lastValue.split('-');
                this.inputYear = parseInt(array[0], 10);
                this.inputMonth = parseInt(array[1], 10) - 1;
                if (this.type === 'date') {
                    this.inputDay = parseInt(array[2], 10);
                }
            }
            else if (picker && parseInt(picker[0], 10) !== this.inputYear) {
                this.inputYear = parseInt(picker[0], 10);
                this.inputMonth = parseInt(picker[1], 10) - 1;
            }
            else {
                this.inputYear = this.inputYear || this.now.getFullYear();
                this.inputMonth = this.inputMonth == null ? this.inputMonth : this.now.getMonth();
                this.inputDay = this.inputDay || this.now.getDate();
            }
        }
    },
    render() {
        return this.genPicker('v-picker--date');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN6RCxPQUFPLGFBQXNDLE1BQU0sc0JBQXNCLENBQUE7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUN6RCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQW1CdEMsZ0ZBQWdGO0FBQ2hGLGtEQUFrRDtBQUNsRCxTQUFTLGtCQUFrQixDQUFFLFVBQWtCLEVBQUUsSUFBK0I7SUFDOUUsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3pELE9BQU8sR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVB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QUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTthQUNwRDtRQUNILENBQUM7S0FDRjtJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJUaXRsZSBmcm9tICcuL1ZEYXRlUGlja2VyVGl0bGUnXHJcbmltcG9ydCBWRGF0ZVBpY2tlckhlYWRlciBmcm9tICcuL1ZEYXRlUGlja2VySGVhZGVyJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJEYXRlVGFibGUgZnJvbSAnLi9WRGF0ZVBpY2tlckRhdGVUYWJsZSdcclxuaW1wb3J0IFZEYXRlUGlja2VyTW9udGhUYWJsZSBmcm9tICcuL1ZEYXRlUGlja2VyTW9udGhUYWJsZSdcclxuaW1wb3J0IFZEYXRlUGlja2VyWWVhcnMgZnJvbSAnLi9WRGF0ZVBpY2tlclllYXJzJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBQaWNrZXIgZnJvbSAnLi4vLi4vbWl4aW5zL3BpY2tlcidcclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCB7IHBhZCwgY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyIH0gZnJvbSAnLi91dGlsJ1xyXG5pbXBvcnQgaXNEYXRlQWxsb3dlZCwgeyBBbGxvd2VkRGF0ZUZ1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRGF0ZUFsbG93ZWQnXHJcbmltcG9ydCB7IGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5pbXBvcnQgeyBkYXlzSW5Nb250aCB9IGZyb20gJy4uL1ZDYWxlbmRhci91dGlsL3RpbWVzdGFtcCdcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuaW1wb3J0IHsgRGF0ZVBpY2tlckZvcm1hdHRlciB9IGZyb20gJy4vdXRpbC9jcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXInXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuZXhwb3J0IHR5cGUgRGF0ZUV2ZW50Q29sb3JWYWx1ZSA9IHN0cmluZyB8IHN0cmluZ1tdXHJcbmV4cG9ydCB0eXBlIERhdGVFdmVudHMgPSBzdHJpbmdbXSB8ICgoZGF0ZTogc3RyaW5nKSA9PiBib29sZWFuIHwgRGF0ZUV2ZW50Q29sb3JWYWx1ZSkgfCBSZWNvcmQ8c3RyaW5nLCBEYXRlRXZlbnRDb2xvclZhbHVlPlxyXG5leHBvcnQgdHlwZSBEYXRlRXZlbnRDb2xvcnMgPSBEYXRlRXZlbnRDb2xvclZhbHVlIHwgUmVjb3JkPHN0cmluZywgRGF0ZUV2ZW50Q29sb3JWYWx1ZT4gfCAoKGRhdGU6IHN0cmluZykgPT4gRGF0ZUV2ZW50Q29sb3JWYWx1ZSlcclxudHlwZSBEYXRlUGlja2VyVmFsdWUgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZFxyXG50eXBlIERhdGVQaWNrZXJUeXBlID0gJ2RhdGUnIHwgJ21vbnRoJ1xyXG50eXBlIERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciA9IChkYXRlOiBzdHJpbmdbXSkgPT4gc3RyaW5nXHJcbmludGVyZmFjZSBGb3JtYXR0ZXJzIHtcclxuICB5ZWFyOiBEYXRlUGlja2VyRm9ybWF0dGVyXHJcbiAgdGl0bGVEYXRlOiBEYXRlUGlja2VyRm9ybWF0dGVyIHwgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyXHJcbiAgdGl0bGVNb250aFllYXI6IERhdGVQaWNrZXJGb3JtYXR0ZXJcclxufVxyXG5cclxuLy8gQWRkcyBsZWFkaW5nIHplcm8gdG8gbW9udGgvZGF5IGlmIG5lY2Vzc2FyeSwgcmV0dXJucyAnWVlZWScgaWYgdHlwZSA9ICd5ZWFyJyxcclxuLy8gJ1lZWVktTU0nIGlmICdtb250aCcgYW5kICdZWVlZLU1NLUREJyBpZiAnZGF0ZSdcclxuZnVuY3Rpb24gc2FuaXRpemVEYXRlU3RyaW5nIChkYXRlU3RyaW5nOiBzdHJpbmcsIHR5cGU6ICdkYXRlJyB8ICdtb250aCcgfCAneWVhcicpOiBzdHJpbmcge1xyXG4gIGNvbnN0IFt5ZWFyLCBtb250aCA9IDEsIGRhdGUgPSAxXSA9IGRhdGVTdHJpbmcuc3BsaXQoJy0nKVxyXG4gIHJldHVybiBgJHt5ZWFyfS0ke3BhZChtb250aCl9LSR7cGFkKGRhdGUpfWAuc3Vic3RyKDAsIHsgZGF0ZTogMTAsIG1vbnRoOiA3LCB5ZWFyOiA0IH1bdHlwZV0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBQaWNrZXJcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsbG93RGF0ZUNoYW5nZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPEFsbG93ZWREYXRlRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyB0aGUgZGF5IGluIGRhdGUgcGlja2VyIHRhYmxlXHJcbiAgICBkYXlGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8QWxsb3dlZERhdGVGdW5jdGlvbiB8IHVuZGVmaW5lZD4sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGV2ZW50czoge1xyXG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3RdLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVFdmVudHM+LFxyXG4gICAgZXZlbnRDb2xvcjoge1xyXG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3QsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICd3YXJuaW5nJ1xyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlRXZlbnRDb2xvcnM+LFxyXG4gICAgZmlyc3REYXlPZldlZWs6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHRhYmxlRGF0ZSBpbiB0aGUgZGF5L21vbnRoIHRhYmxlIGhlYWRlclxyXG4gICAgaGVhZGVyRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIGhpZGVEaXNhYmxlZDoge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIGhvdmVyTGluazogU3RyaW5nLFxyXG4gICAgbG9jYWxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2VuLXVzJ1xyXG4gICAgfSxcclxuICAgIG1heDogU3RyaW5nLFxyXG4gICAgbWluOiBTdHJpbmcsXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIG1vbnRoIGluIHRoZSBtb250aHMgdGFibGVcclxuICAgIG1vbnRoRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXHJcbiAgICBuZXh0SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5uZXh0J1xyXG4gICAgfSxcclxuICAgIHBpY2tlckRhdGU6IFN0cmluZyxcclxuICAgIHByZXZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnByZXYnXHJcbiAgICB9LFxyXG4gICAgcmFuZ2U6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH0sXHJcbiAgICByZWFjdGl2ZTogQm9vbGVhbixcclxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxyXG4gICAgc2Nyb2xsYWJsZTogQm9vbGVhbixcclxuICAgIHNob3dDdXJyZW50OiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgc2hvd1dlZWs6IEJvb2xlYW4sXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlIGluIHRoZSBwaWNrZXIgdGl0bGVcclxuICAgIHRpdGxlRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIHR5cGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnZGF0ZScsXHJcbiAgICAgIHZhbGlkYXRvcjogKHR5cGU6IGFueSkgPT4gWydkYXRlJywgJ21vbnRoJ10uaW5jbHVkZXModHlwZSkgLy8gVE9ETzogeWVhclxyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVHlwZT4sXHJcbiAgICB2YWx1ZTogW0FycmF5LCBTdHJpbmddIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlclZhbHVlPixcclxuICAgIHdlZWtkYXlGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIHRoZSB5ZWFyIGluIHRhYmxlIGhlYWRlciBhbmQgcGlja3VwIHRpdGxlXHJcbiAgICB5ZWFyRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgeWVhckljb246IFN0cmluZ1xyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWN0aXZlUGlja2VyOiB0aGlzLnR5cGUudG9VcHBlckNhc2UoKSxcclxuICAgICAgaW5wdXREYXk6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcclxuICAgICAgaW5wdXRNb250aDogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpbnB1dFllYXI6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcclxuICAgICAgaXNSZXZlcnNpbmc6IGZhbHNlLFxyXG4gICAgICBob3ZlcmluZzogJycsXHJcbiAgICAgIG5vdyxcclxuICAgICAgLy8gdGFibGVEYXRlIGlzIGEgc3RyaW5nIGluICdZWVlZJyAvICdZWVlZLU0nIGZvcm1hdCAobGVhZGluZyB6ZXJvIGZvciBtb250aCBpcyBub3QgcmVxdWlyZWQpXHJcbiAgICAgIHRhYmxlRGF0ZTogKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5waWNrZXJEYXRlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJEYXRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gKHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSlbKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAtIDFdIDogdGhpcy52YWx1ZSkgfHxcclxuICAgICAgICAgIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke25vdy5nZXRNb250aCgpICsgMX1gXHJcbiAgICAgICAgcmV0dXJuIHNhbml0aXplRGF0ZVN0cmluZyhkYXRlIGFzIHN0cmluZywgdGhpcy50eXBlID09PSAnZGF0ZScgPyAnbW9udGgnIDogJ3llYXInKVxyXG4gICAgICB9KSgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGxhc3RWYWx1ZSAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pWyh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggLSAxXSA6ICh0aGlzLnZhbHVlIGFzIHN0cmluZyB8IG51bGwpXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWRNb250aHMgKCk6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgaWYgKCF0aGlzLnZhbHVlIHx8ICF0aGlzLnZhbHVlLmxlbmd0aCB8fCB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLm1hcCh2YWwgPT4gdmFsLnN1YnN0cigwLCA3KSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgYXMgc3RyaW5nKS5zdWJzdHIoMCwgNylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGN1cnJlbnQgKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICBpZiAodGhpcy5zaG93Q3VycmVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiBzYW5pdGl6ZURhdGVTdHJpbmcoYCR7dGhpcy5ub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm5vdy5nZXRNb250aCgpICsgMX0tJHt0aGlzLm5vdy5nZXREYXRlKCl9YCwgdGhpcy50eXBlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zaG93Q3VycmVudCB8fCBudWxsXHJcbiAgICB9LFxyXG4gICAgaW5wdXREYXRlICgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnZGF0ZSdcclxuICAgICAgICA/IGAke3RoaXMuaW5wdXRZZWFyfS0ke3BhZCh0aGlzLmlucHV0TW9udGghICsgMSl9LSR7cGFkKHRoaXMuaW5wdXREYXkhKX1gXHJcbiAgICAgICAgOiBgJHt0aGlzLmlucHV0WWVhcn0tJHtwYWQodGhpcy5pbnB1dE1vbnRoISArIDEpfWBcclxuICAgIH0sXHJcbiAgICB0YWJsZU1vbnRoICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMV0pIC0gMVxyXG4gICAgfSxcclxuICAgIHRhYmxlWWVhciAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE51bWJlcigodGhpcy5waWNrZXJEYXRlIHx8IHRoaXMudGFibGVEYXRlKS5zcGxpdCgnLScpWzBdKVxyXG4gICAgfSxcclxuICAgIG1pbk1vbnRoICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAnbW9udGgnKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtYXhNb250aCAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1heCA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1heCwgJ21vbnRoJykgOiBudWxsXHJcbiAgICB9LFxyXG4gICAgbWluWWVhciAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1pbiA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1pbiwgJ3llYXInKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtYXhZZWFyICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAneWVhcicpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIGZvcm1hdHRlcnMgKCk6IEZvcm1hdHRlcnMge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHRoaXMueWVhckZvcm1hdCB8fCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSwgeyBsZW5ndGg6IDQgfSksXHJcbiAgICAgICAgdGl0bGVEYXRlOiB0aGlzLnRpdGxlRGF0ZUZvcm1hdCB8fCAodGhpcy5tdWx0aXBsZSA/IHRoaXMuZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyIDogdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKSxcclxuICAgICAgICB0aXRsZU1vbnRoWWVhcjogdGhpcy5kZWZhdWx0UmFuZ2VUaXRsZUZvcm1hdHRlclxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXIge1xyXG4gICAgICBpZiAoKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICByZXR1cm4gZGF0ZXMgPT4gZGF0ZXMubGVuZ3RoID8gdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKGRhdGVzWzBdKSA6ICcwIHNlbGVjdGVkJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGF0ZXMgPT4gYCR7ZGF0ZXMubGVuZ3RofSBzZWxlY3RlZGBcclxuICAgIH0sXHJcbiAgICBkZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyRm9ybWF0dGVyIHtcclxuICAgICAgY29uc3QgdGl0bGVGb3JtYXRzID0ge1xyXG4gICAgICAgIHllYXI6IHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSxcclxuICAgICAgICBtb250aDogeyBtb250aDogJ2xvbmcnLCB0aW1lWm9uZTogJ1VUQycgfSxcclxuICAgICAgICBkYXRlOiB7IHdlZWtkYXk6ICdzaG9ydCcsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJywgdGltZVpvbmU6ICdVVEMnIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdGl0bGVEYXRlRm9ybWF0dGVyID0gY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMubG9jYWxlLCB0aXRsZUZvcm1hdHNbdGhpcy50eXBlXSwge1xyXG4gICAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICAgIGxlbmd0aDogeyBkYXRlOiAxMCwgbW9udGg6IDcsIHllYXI6IDQgfVt0aGlzLnR5cGVdXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBjb25zdCBsYW5kc2NhcGVGb3JtYXR0ZXIgPSAoZGF0ZTogc3RyaW5nKSA9PiB0aXRsZURhdGVGb3JtYXR0ZXIoZGF0ZSlcclxuICAgICAgICAucmVwbGFjZSgvKFteXFxkXFxzXSkoW1xcZF0pL2csIChtYXRjaCwgbm9uRGlnaXQsIGRpZ2l0KSA9PiBgJHtub25EaWdpdH0gJHtkaWdpdH1gKVxyXG4gICAgICAgIC5yZXBsYWNlKCcsICcsICcsPGJyPicpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5sYW5kc2NhcGUgPyBsYW5kc2NhcGVGb3JtYXR0ZXIgOiB0aXRsZURhdGVGb3JtYXR0ZXJcclxuICAgIH0sXHJcbiAgICBkZWZhdWx0UmFuZ2VUaXRsZUZvcm1hdHRlciAoKTogRGF0ZVBpY2tlckZvcm1hdHRlciB7XHJcbiAgICAgIGNvbnN0IHRpdGxlUmFuZ2VGb3JtYXR0ZXIgPSBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHsgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSwge1xyXG4gICAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICAgIGxlbmd0aDogNlxyXG4gICAgICB9KVxyXG4gICAgICByZXR1cm4gdGl0bGVSYW5nZUZvcm1hdHRlclxyXG4gICAgfVxyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIGFjdGl2ZVBpY2tlciAodmFsOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy4kZW1pdCgncGlja2VyVHlwZScsIHZhbClcclxuICAgIH0sXHJcbiAgICB0YWJsZURhdGUgKHZhbDogc3RyaW5nLCBwcmV2OiBzdHJpbmcpIHtcclxuICAgICAgLy8gTWFrZSBhIElTTyA4NjAxIHN0cmluZ3MgZnJvbSB2YWwgYW5kIHByZXYgZm9yIGNvbXBhcmlzaW9uLCBvdGhlcndpc2UgaXQgd2lsbCBpbmNvcnJlY3RseVxyXG4gICAgICAvLyBjb21wYXJlIGZvciBleGFtcGxlICcyMDAwLTknIGFuZCAnMjAwMC0xMCdcclxuICAgICAgY29uc3Qgc2FuaXRpemVUeXBlID0gdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJ1xyXG4gICAgICB0aGlzLmlzUmV2ZXJzaW5nID0gc2FuaXRpemVEYXRlU3RyaW5nKHZhbCwgc2FuaXRpemVUeXBlKSA8IHNhbml0aXplRGF0ZVN0cmluZyhwcmV2LCBzYW5pdGl6ZVR5cGUpXHJcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpwaWNrZXJEYXRlJywgdmFsKVxyXG4gICAgfSxcclxuICAgIHBpY2tlckRhdGUgKHZhbDogc3RyaW5nIHwgbnVsbCkge1xyXG4gICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSB2YWxcclxuICAgICAgICB0aGlzLnNldElucHV0RGF0ZSgpXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sYXN0VmFsdWUgJiYgdGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ21vbnRoJylcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhc3RWYWx1ZSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ3llYXInKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdmFsdWUgKG5ld1ZhbHVlOiBEYXRlUGlja2VyVmFsdWUsIG9sZFZhbHVlOiBEYXRlUGlja2VyVmFsdWUpIHtcclxuICAgICAgdGhpcy5jaGVja011bHRpcGxlUHJvcCgpXHJcbiAgICAgIHRoaXMuc2V0SW5wdXREYXRlKClcclxuXHJcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnZhbHVlICYmICF0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm11bHRpcGxlICYmICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggJiYgIShvbGRWYWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoICYmICF0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgUmVwbGFjaW5nIHRhYmxlRGF0ZSB3aXRoICR7dGhpcy5pbnB1dERhdGV9YClcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHR5cGUgKHR5cGU6IERhdGVQaWNrZXJUeXBlKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gdHlwZS50b1VwcGVyQ2FzZSgpXHJcblxyXG4gICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9ICh0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pIDogW3RoaXMudmFsdWUgYXMgc3RyaW5nXSlcclxuICAgICAgICAgIC5tYXAoKHZhbDogc3RyaW5nKSA9PiBzYW5pdGl6ZURhdGVTdHJpbmcodmFsLCB0eXBlKSlcclxuICAgICAgICAgIC5maWx0ZXIodGhpcy5pc0RhdGVBbGxvd2VkKVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5tdWx0aXBsZSA/IG91dHB1dCA6IG91dHB1dFswXSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhvdmVyaW5nICh2YWx1ZTogU3RyaW5nLCBwcmV2OiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy4kZW1pdCgnaG92ZXJMaW5rJywgdmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlZCAoKSB7XHJcbiAgICB0aGlzLmNoZWNrTXVsdGlwbGVQcm9wKClcclxuXHJcbiAgICBpZiAodGhpcy5waWNrZXJEYXRlICE9PSB0aGlzLnRhYmxlRGF0ZSkge1xyXG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6cGlja2VyRGF0ZScsIHRoaXMudGFibGVEYXRlKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRJbnB1dERhdGUoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGVtaXRJbnB1dCAobmV3SW5wdXQ6IHN0cmluZykge1xyXG4gICAgICBjb25zdCBvdXRwdXQgPSB0aGlzLm11bHRpcGxlXHJcbiAgICAgICAgPyAoXHJcbiAgICAgICAgICAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkuaW5kZXhPZihuZXdJbnB1dCkgPT09IC0xXHJcbiAgICAgICAgICAgID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmNvbmNhdChbbmV3SW5wdXRdKVxyXG4gICAgICAgICAgICA6ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5maWx0ZXIoeCA9PiB4ICE9PSBuZXdJbnB1dClcclxuICAgICAgICApXHJcbiAgICAgICAgOiBuZXdJbnB1dFxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBvdXRwdXQpXHJcbiAgICAgIHRoaXMubXVsdGlwbGUgfHwgdGhpcy4kZW1pdCgnY2hhbmdlJywgbmV3SW5wdXQpXHJcbiAgICB9LFxyXG4gICAgY2hlY2tNdWx0aXBsZVByb3AgKCkge1xyXG4gICAgICBpZiAodGhpcy52YWx1ZSA9PSBudWxsKSByZXR1cm5cclxuICAgICAgY29uc3QgdmFsdWVUeXBlID0gdGhpcy52YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gdGhpcy5tdWx0aXBsZSA/ICdBcnJheScgOiAnU3RyaW5nJ1xyXG4gICAgICBpZiAodmFsdWVUeXBlICE9PSBleHBlY3RlZCkge1xyXG4gICAgICAgIGNvbnNvbGVXYXJuKGBWYWx1ZSBtdXN0IGJlICR7dGhpcy5tdWx0aXBsZSA/ICdhbicgOiAnYSd9ICR7ZXhwZWN0ZWR9LCBnb3QgJHt2YWx1ZVR5cGV9YCwgdGhpcylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzRGF0ZUFsbG93ZWQgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuIGlzRGF0ZUFsbG93ZWQodmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgdGhpcy5hbGxvd2VkRGF0ZXMpXHJcbiAgICB9LFxyXG4gICAgeWVhckNsaWNrICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRZZWFyID0gdmFsdWVcclxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gYCR7dmFsdWV9YFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gYCR7dmFsdWV9LSR7cGFkKCh0aGlzLnRhYmxlTW9udGggfHwgMCkgKyAxKX1gXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPSAnTU9OVEgnXHJcbiAgICAgIGlmICh0aGlzLnJlYWN0aXZlICYmICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuaXNEYXRlQWxsb3dlZCh0aGlzLmlucHV0RGF0ZSkpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaW5wdXREYXRlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbW9udGhDbGljayAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMF0sIDEwKVxyXG4gICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzFdLCAxMCkgLSAxXHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0RGF5KSB7XHJcbiAgICAgICAgICB0aGlzLmlucHV0RGF5ID0gTWF0aC5taW4odGhpcy5pbnB1dERheSwgZGF5c0luTW9udGgodGhpcy5pbnB1dFllYXIsIHRoaXMuaW5wdXRNb250aCArIDEpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gJ0RBVEUnXHJcbiAgICAgICAgaWYgKHRoaXMucmVhY3RpdmUgJiYgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5pc0RhdGVBbGxvd2VkKHRoaXMuaW5wdXREYXRlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLmlucHV0RGF0ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbWl0SW5wdXQodGhpcy5pbnB1dERhdGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkYXRlQ2xpY2sgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzBdLCAxMClcclxuICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVsxXSwgMTApIC0gMVxyXG4gICAgICB0aGlzLmlucHV0RGF5ID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVsyXSwgMTApXHJcbiAgICAgIHRoaXMuZW1pdElucHV0KHRoaXMuaW5wdXREYXRlKVxyXG4gICAgfSxcclxuICAgIGdlblBpY2tlclRpdGxlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJUaXRsZSwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd0RhdGVDaGFuZ2U6IHRoaXMuYWxsb3dEYXRlQ2hhbmdlLFxyXG4gICAgICAgICAgZGF0ZTogdGhpcy52YWx1ZSA/ICh0aGlzLmZvcm1hdHRlcnMudGl0bGVEYXRlIGFzICh2YWx1ZTogYW55KSA9PiBzdHJpbmcpKHRoaXMudmFsdWUpIDogJycsXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxyXG4gICAgICAgICAgc2VsZWN0aW5nWWVhcjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdZRUFSJyxcclxuICAgICAgICAgIHllYXI6IHRoaXMuZm9ybWF0dGVycy55ZWFyKHRoaXMudmFsdWUgPyBgJHt0aGlzLmlucHV0WWVhcn1gIDogdGhpcy50YWJsZURhdGUpLFxyXG4gICAgICAgICAgeWVhckljb246IHRoaXMueWVhckljb24sXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tdWx0aXBsZSA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKVswXSA6IHRoaXMudmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsb3Q6ICd0aXRsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICd1cGRhdGU6c2VsZWN0aW5nWWVhcic6ICh2YWx1ZTogYm9vbGVhbikgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSB2YWx1ZSA/ICdZRUFSJyA6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblRhYmxlSGVhZGVyICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJIZWFkZXIsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgYWxsb3dEYXRlQ2hhbmdlOiB0aGlzLmFsbG93RGF0ZUNoYW5nZSxcclxuICAgICAgICAgIG5leHRJY29uOiB0aGlzLm5leHRJY29uLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIGZvcm1hdDogdGhpcy5oZWFkZXJEYXRlRm9ybWF0LFxyXG4gICAgICAgICAgaGlkZURpc2FibGVkOiB0aGlzLmhpZGVEaXNhYmxlZCxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMubWluTW9udGggOiB0aGlzLm1pblllYXIsXHJcbiAgICAgICAgICBtYXg6IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLm1heE1vbnRoIDogdGhpcy5tYXhZZWFyLFxyXG4gICAgICAgICAgcHJldkljb246IHRoaXMucHJldkljb24sXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCA6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIHRvZ2dsZTogKCkgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSAodGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/ICdNT05USCcgOiAnWUVBUicpLFxyXG4gICAgICAgICAgaW5wdXQ6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbkRhdGVUYWJsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyRGF0ZVRhYmxlLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFsbG93ZWREYXRlczogdGhpcy5hbGxvd2VkRGF0ZXMsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZXZlbnRzOiB0aGlzLmV2ZW50cyxcclxuICAgICAgICAgIGV2ZW50Q29sb3I6IHRoaXMuZXZlbnRDb2xvcixcclxuICAgICAgICAgIGZpcnN0RGF5T2ZXZWVrOiB0aGlzLmZpcnN0RGF5T2ZXZWVrLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmRheUZvcm1hdCxcclxuICAgICAgICAgIGhvdmVyTGluazogdGhpcy5ob3ZlckxpbmssXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLm1heCxcclxuICAgICAgICAgIHJhbmdlOiB0aGlzLnJhbmdlLFxyXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXHJcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXHJcbiAgICAgICAgICBzaG93V2VlazogdGhpcy5zaG93V2VlayxcclxuICAgICAgICAgIHRhYmxlRGF0ZTogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxyXG4gICAgICAgICAgd2Vla2RheUZvcm1hdDogdGhpcy53ZWVrZGF5Rm9ybWF0XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICd0YWJsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGlucHV0OiB0aGlzLmRhdGVDbGljayxcclxuICAgICAgICAgIHRhYmxlRGF0ZTogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMudGFibGVEYXRlID0gdmFsdWUsXHJcbiAgICAgICAgICBob3ZlcjogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuaG92ZXJpbmcgPSB2YWx1ZSxcclxuICAgICAgICAgICdjbGljazpkYXRlJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2NsaWNrOmRhdGUnLCB2YWx1ZSksXHJcbiAgICAgICAgICAnZGJsY2xpY2s6ZGF0ZSc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdkYmxjbGljazpkYXRlJywgdmFsdWUpLFxyXG4gICAgICAgICAgJ2hvdmVyTGluayc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdob3ZlckxpbmsnLCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuTW9udGhUYWJsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyTW9udGhUYWJsZSwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd2VkRGF0ZXM6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuYWxsb3dlZERhdGVzIDogbnVsbCxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxyXG4gICAgICAgICAgY3VycmVudDogdGhpcy5jdXJyZW50ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuY3VycmVudCwgJ21vbnRoJykgOiBudWxsLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBldmVudHM6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuZXZlbnRzIDogbnVsbCxcclxuICAgICAgICAgIGV2ZW50Q29sb3I6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuZXZlbnRDb2xvciA6IG51bGwsXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMubW9udGhGb3JtYXQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluTW9udGgsXHJcbiAgICAgICAgICBtYXg6IHRoaXMubWF4TW9udGgsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcsXHJcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5zZWxlY3RlZE1vbnRocyxcclxuICAgICAgICAgIHZpZXdpbmc6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9LSR7cGFkKHRoaXMudGFibGVNb250aCArIDEpfWAsXHJcbiAgICAgICAgICB0YWJsZURhdGU6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAndGFibGUnLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy5tb250aENsaWNrLFxyXG4gICAgICAgICAgdGFibGVEYXRlOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcclxuICAgICAgICAgICdjbGljazptb250aCc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdjbGljazptb250aCcsIHZhbHVlKSxcclxuICAgICAgICAgICdkYmxjbGljazptb250aCc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdkYmxjbGljazptb250aCcsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5ZZWFycyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyWWVhcnMsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMueWVhckZvcm1hdCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluWWVhcixcclxuICAgICAgICAgIG1heDogdGhpcy5tYXhZZWFyLFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMudGFibGVZZWFyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgaW5wdXQ6IHRoaXMueWVhckNsaWNrXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblBpY2tlckJvZHkgKCkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuYWN0aXZlUGlja2VyID09PSAnWUVBUicgPyBbXHJcbiAgICAgICAgdGhpcy5nZW5ZZWFycygpXHJcbiAgICAgIF0gOiBbXHJcbiAgICAgICAgdGhpcy5nZW5UYWJsZUhlYWRlcigpLFxyXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLmdlbkRhdGVUYWJsZSgpIDogdGhpcy5nZW5Nb250aFRhYmxlKClcclxuICAgICAgXVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBrZXk6IHRoaXMuYWN0aXZlUGlja2VyXHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIHNldElucHV0RGF0ZSAoKSB7XHJcbiAgICAgIGNvbnN0IHBpY2tlciA9IHRoaXMucGlja2VyRGF0ZSA/IHRoaXMucGlja2VyRGF0ZS5zcGxpdCgnLScpIDogbnVsbFxyXG5cclxuICAgICAgaWYgKHRoaXMubGFzdFZhbHVlKSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLmxhc3RWYWx1ZS5zcGxpdCgnLScpXHJcbiAgICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludChhcnJheVswXSwgMTApXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQoYXJyYXlbMV0sIDEwKSAtIDFcclxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICAgIHRoaXMuaW5wdXREYXkgPSBwYXJzZUludChhcnJheVsyXSwgMTApXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHBpY2tlciAmJiBwYXJzZUludChwaWNrZXJbMF0sIDEwKSAhPT0gdGhpcy5pbnB1dFllYXIpIHtcclxuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHBpY2tlclswXSwgMTApXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQocGlja2VyWzFdLCAxMCkgLSAxXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dFllYXIgPSB0aGlzLmlucHV0WWVhciB8fCB0aGlzLm5vdy5nZXRGdWxsWWVhcigpXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gdGhpcy5pbnB1dE1vbnRoID09IG51bGwgPyB0aGlzLmlucHV0TW9udGggOiB0aGlzLm5vdy5nZXRNb250aCgpXHJcbiAgICAgICAgdGhpcy5pbnB1dERheSA9IHRoaXMuaW5wdXREYXkgfHwgdGhpcy5ub3cuZ2V0RGF0ZSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKCk6IFZOb2RlIHtcclxuICAgIHJldHVybiB0aGlzLmdlblBpY2tlcigndi1waWNrZXItLWRhdGUnKVxyXG4gIH1cclxufSlcclxuIl19