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
                titleDate: this.titleDateFormat || (this.multiple ? this.defaultTitleMultipleDateFormatter : this.defaultTitleDateFormatter)
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
        }
    },
    watch: {
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
                this.tableDate = `${value}-${pad(this.tableMonth + 1)}`;
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
                    nextIcon: this.nextIcon,
                    color: this.color,
                    dark: this.dark,
                    disabled: this.disabled,
                    format: this.headerDateFormat,
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
                    light: this.light,
                    locale: this.locale,
                    min: this.min,
                    max: this.max,
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
                    'click:date': (value) => this.$emit('click:date', value),
                    'dblclick:date': (value) => this.$emit('dblclick:date', value)
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
            if (this.lastValue) {
                const array = this.lastValue.split('-');
                this.inputYear = parseInt(array[0], 10);
                this.inputMonth = parseInt(array[1], 10) - 1;
                if (this.type === 'date') {
                    this.inputDay = parseInt(array[2], 10);
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN6RCxPQUFPLGFBQXNDLE1BQU0sc0JBQXNCLENBQUE7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBa0J0QyxnRkFBZ0Y7QUFDaEYsa0RBQWtEO0FBQ2xELFNBQVMsa0JBQWtCLENBQUUsVUFBa0IsRUFBRSxJQUErQjtJQUM5RSxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDekQsT0FBTyxHQUFHLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMs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QUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO2FBQ3BEO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXHJcbmltcG9ydCBWRGF0ZVBpY2tlclRpdGxlIGZyb20gJy4vVkRhdGVQaWNrZXJUaXRsZSdcclxuaW1wb3J0IFZEYXRlUGlja2VySGVhZGVyIGZyb20gJy4vVkRhdGVQaWNrZXJIZWFkZXInXHJcbmltcG9ydCBWRGF0ZVBpY2tlckRhdGVUYWJsZSBmcm9tICcuL1ZEYXRlUGlja2VyRGF0ZVRhYmxlJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJNb250aFRhYmxlIGZyb20gJy4vVkRhdGVQaWNrZXJNb250aFRhYmxlJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJZZWFycyBmcm9tICcuL1ZEYXRlUGlja2VyWWVhcnMnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IFBpY2tlciBmcm9tICcuLi8uLi9taXhpbnMvcGlja2VyJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsgcGFkLCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIgfSBmcm9tICcuL3V0aWwnXHJcbmltcG9ydCBpc0RhdGVBbGxvd2VkLCB7IEFsbG93ZWREYXRlRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNEYXRlQWxsb3dlZCdcclxuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcbmltcG9ydCB7IERhdGVQaWNrZXJGb3JtYXR0ZXIgfSBmcm9tICcuL3V0aWwvY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyJ1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbmV4cG9ydCB0eXBlIERhdGVFdmVudENvbG9yVmFsdWUgPSBzdHJpbmcgfCBzdHJpbmdbXVxyXG5leHBvcnQgdHlwZSBEYXRlRXZlbnRzID0gc3RyaW5nW10gfCAoKGRhdGU6IHN0cmluZykgPT4gYm9vbGVhbiB8IERhdGVFdmVudENvbG9yVmFsdWUpIHwgUmVjb3JkPHN0cmluZywgRGF0ZUV2ZW50Q29sb3JWYWx1ZT5cclxuZXhwb3J0IHR5cGUgRGF0ZUV2ZW50Q29sb3JzID0gRGF0ZUV2ZW50Q29sb3JWYWx1ZSB8IFJlY29yZDxzdHJpbmcsIERhdGVFdmVudENvbG9yVmFsdWU+IHwgKChkYXRlOiBzdHJpbmcpID0+IERhdGVFdmVudENvbG9yVmFsdWUpXHJcbnR5cGUgRGF0ZVBpY2tlclZhbHVlID0gc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWRcclxudHlwZSBEYXRlUGlja2VyVHlwZSA9ICdkYXRlJyB8ICdtb250aCdcclxudHlwZSBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXIgPSAoZGF0ZTogc3RyaW5nW10pID0+IHN0cmluZ1xyXG5pbnRlcmZhY2UgRm9ybWF0dGVycyB7XHJcbiAgeWVhcjogRGF0ZVBpY2tlckZvcm1hdHRlclxyXG4gIHRpdGxlRGF0ZTogRGF0ZVBpY2tlckZvcm1hdHRlciB8IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlclxyXG59XHJcblxyXG4vLyBBZGRzIGxlYWRpbmcgemVybyB0byBtb250aC9kYXkgaWYgbmVjZXNzYXJ5LCByZXR1cm5zICdZWVlZJyBpZiB0eXBlID0gJ3llYXInLFxyXG4vLyAnWVlZWS1NTScgaWYgJ21vbnRoJyBhbmQgJ1lZWVktTU0tREQnIGlmICdkYXRlJ1xyXG5mdW5jdGlvbiBzYW5pdGl6ZURhdGVTdHJpbmcgKGRhdGVTdHJpbmc6IHN0cmluZywgdHlwZTogJ2RhdGUnIHwgJ21vbnRoJyB8ICd5ZWFyJyk6IHN0cmluZyB7XHJcbiAgY29uc3QgW3llYXIsIG1vbnRoID0gMSwgZGF0ZSA9IDFdID0gZGF0ZVN0cmluZy5zcGxpdCgnLScpXHJcbiAgcmV0dXJuIGAke3llYXJ9LSR7cGFkKG1vbnRoKX0tJHtwYWQoZGF0ZSl9YC5zdWJzdHIoMCwgeyBkYXRlOiAxMCwgbW9udGg6IDcsIHllYXI6IDQgfVt0eXBlXSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIFBpY2tlclxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtZGF0ZS1waWNrZXInLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPEFsbG93ZWREYXRlRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyB0aGUgZGF5IGluIGRhdGUgcGlja2VyIHRhYmxlXHJcbiAgICBkYXlGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8QWxsb3dlZERhdGVGdW5jdGlvbiB8IHVuZGVmaW5lZD4sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGV2ZW50czoge1xyXG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3RdLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVFdmVudHM+LFxyXG4gICAgZXZlbnRDb2xvcjoge1xyXG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3QsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICd3YXJuaW5nJ1xyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlRXZlbnRDb2xvcnM+LFxyXG4gICAgZmlyc3REYXlPZldlZWs6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHRhYmxlRGF0ZSBpbiB0aGUgZGF5L21vbnRoIHRhYmxlIGhlYWRlclxyXG4gICAgaGVhZGVyRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIGxvY2FsZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdlbi11cydcclxuICAgIH0sXHJcbiAgICBtYXg6IFN0cmluZyxcclxuICAgIG1pbjogU3RyaW5nLFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyBtb250aCBpbiB0aGUgbW9udGhzIHRhYmxlXHJcbiAgICBtb250aEZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIG11bHRpcGxlOiBCb29sZWFuLFxyXG4gICAgbmV4dEljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMubmV4dCdcclxuICAgIH0sXHJcbiAgICBwaWNrZXJEYXRlOiBTdHJpbmcsXHJcbiAgICBwcmV2SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5wcmV2J1xyXG4gICAgfSxcclxuICAgIHJlYWN0aXZlOiBCb29sZWFuLFxyXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXHJcbiAgICBzY3JvbGxhYmxlOiBCb29sZWFuLFxyXG4gICAgc2hvd0N1cnJlbnQ6IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBzaG93V2VlazogQm9vbGVhbixcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUgaW4gdGhlIHBpY2tlciB0aXRsZVxyXG4gICAgdGl0bGVEYXRlRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdkYXRlJyxcclxuICAgICAgdmFsaWRhdG9yOiAodHlwZTogYW55KSA9PiBbJ2RhdGUnLCAnbW9udGgnXS5pbmNsdWRlcyh0eXBlKSAvLyBUT0RPOiB5ZWFyXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJUeXBlPixcclxuICAgIHZhbHVlOiBbQXJyYXksIFN0cmluZ10gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVmFsdWU+LFxyXG4gICAgd2Vla2RheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHllYXIgaW4gdGFibGUgaGVhZGVyIGFuZCBwaWNrdXAgdGl0bGVcclxuICAgIHllYXJGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICB5ZWFySWNvbjogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhY3RpdmVQaWNrZXI6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICBpbnB1dERheTogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpbnB1dE1vbnRoOiBudWxsIGFzIG51bWJlciB8IG51bGwsXHJcbiAgICAgIGlucHV0WWVhcjogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpc1JldmVyc2luZzogZmFsc2UsXHJcbiAgICAgIG5vdyxcclxuICAgICAgLy8gdGFibGVEYXRlIGlzIGEgc3RyaW5nIGluICdZWVlZJyAvICdZWVlZLU0nIGZvcm1hdCAobGVhZGluZyB6ZXJvIGZvciBtb250aCBpcyBub3QgcmVxdWlyZWQpXHJcbiAgICAgIHRhYmxlRGF0ZTogKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5waWNrZXJEYXRlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJEYXRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gKHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSlbKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAtIDFdIDogdGhpcy52YWx1ZSkgfHxcclxuICAgICAgICAgIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke25vdy5nZXRNb250aCgpICsgMX1gXHJcbiAgICAgICAgcmV0dXJuIHNhbml0aXplRGF0ZVN0cmluZyhkYXRlIGFzIHN0cmluZywgdGhpcy50eXBlID09PSAnZGF0ZScgPyAnbW9udGgnIDogJ3llYXInKVxyXG4gICAgICB9KSgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGxhc3RWYWx1ZSAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pWyh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggLSAxXSA6ICh0aGlzLnZhbHVlIGFzIHN0cmluZyB8IG51bGwpXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWRNb250aHMgKCk6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgaWYgKCF0aGlzLnZhbHVlIHx8ICF0aGlzLnZhbHVlLmxlbmd0aCB8fCB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLm1hcCh2YWwgPT4gdmFsLnN1YnN0cigwLCA3KSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgYXMgc3RyaW5nKS5zdWJzdHIoMCwgNylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGN1cnJlbnQgKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICBpZiAodGhpcy5zaG93Q3VycmVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiBzYW5pdGl6ZURhdGVTdHJpbmcoYCR7dGhpcy5ub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm5vdy5nZXRNb250aCgpICsgMX0tJHt0aGlzLm5vdy5nZXREYXRlKCl9YCwgdGhpcy50eXBlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zaG93Q3VycmVudCB8fCBudWxsXHJcbiAgICB9LFxyXG4gICAgaW5wdXREYXRlICgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnZGF0ZSdcclxuICAgICAgICA/IGAke3RoaXMuaW5wdXRZZWFyfS0ke3BhZCh0aGlzLmlucHV0TW9udGghICsgMSl9LSR7cGFkKHRoaXMuaW5wdXREYXkhKX1gXHJcbiAgICAgICAgOiBgJHt0aGlzLmlucHV0WWVhcn0tJHtwYWQodGhpcy5pbnB1dE1vbnRoISArIDEpfWBcclxuICAgIH0sXHJcbiAgICB0YWJsZU1vbnRoICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMV0pIC0gMVxyXG4gICAgfSxcclxuICAgIHRhYmxlWWVhciAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE51bWJlcigodGhpcy5waWNrZXJEYXRlIHx8IHRoaXMudGFibGVEYXRlKS5zcGxpdCgnLScpWzBdKVxyXG4gICAgfSxcclxuICAgIG1pbk1vbnRoICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAnbW9udGgnKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtYXhNb250aCAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1heCA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1heCwgJ21vbnRoJykgOiBudWxsXHJcbiAgICB9LFxyXG4gICAgbWluWWVhciAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1pbiA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1pbiwgJ3llYXInKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtYXhZZWFyICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAneWVhcicpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIGZvcm1hdHRlcnMgKCk6IEZvcm1hdHRlcnMge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHRoaXMueWVhckZvcm1hdCB8fCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSwgeyBsZW5ndGg6IDQgfSksXHJcbiAgICAgICAgdGl0bGVEYXRlOiB0aGlzLnRpdGxlRGF0ZUZvcm1hdCB8fCAodGhpcy5tdWx0aXBsZSA/IHRoaXMuZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyIDogdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXIge1xyXG4gICAgICBpZiAoKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICByZXR1cm4gZGF0ZXMgPT4gZGF0ZXMubGVuZ3RoID8gdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKGRhdGVzWzBdKSA6ICcwIHNlbGVjdGVkJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGF0ZXMgPT4gYCR7ZGF0ZXMubGVuZ3RofSBzZWxlY3RlZGBcclxuICAgIH0sXHJcbiAgICBkZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyRm9ybWF0dGVyIHtcclxuICAgICAgY29uc3QgdGl0bGVGb3JtYXRzID0ge1xyXG4gICAgICAgIHllYXI6IHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSxcclxuICAgICAgICBtb250aDogeyBtb250aDogJ2xvbmcnLCB0aW1lWm9uZTogJ1VUQycgfSxcclxuICAgICAgICBkYXRlOiB7IHdlZWtkYXk6ICdzaG9ydCcsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJywgdGltZVpvbmU6ICdVVEMnIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdGl0bGVEYXRlRm9ybWF0dGVyID0gY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMubG9jYWxlLCB0aXRsZUZvcm1hdHNbdGhpcy50eXBlXSwge1xyXG4gICAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICAgIGxlbmd0aDogeyBkYXRlOiAxMCwgbW9udGg6IDcsIHllYXI6IDQgfVt0aGlzLnR5cGVdXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBjb25zdCBsYW5kc2NhcGVGb3JtYXR0ZXIgPSAoZGF0ZTogc3RyaW5nKSA9PiB0aXRsZURhdGVGb3JtYXR0ZXIoZGF0ZSlcclxuICAgICAgICAucmVwbGFjZSgvKFteXFxkXFxzXSkoW1xcZF0pL2csIChtYXRjaCwgbm9uRGlnaXQsIGRpZ2l0KSA9PiBgJHtub25EaWdpdH0gJHtkaWdpdH1gKVxyXG4gICAgICAgIC5yZXBsYWNlKCcsICcsICcsPGJyPicpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5sYW5kc2NhcGUgPyBsYW5kc2NhcGVGb3JtYXR0ZXIgOiB0aXRsZURhdGVGb3JtYXR0ZXJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgdGFibGVEYXRlICh2YWw6IHN0cmluZywgcHJldjogc3RyaW5nKSB7XHJcbiAgICAgIC8vIE1ha2UgYSBJU08gODYwMSBzdHJpbmdzIGZyb20gdmFsIGFuZCBwcmV2IGZvciBjb21wYXJpc2lvbiwgb3RoZXJ3aXNlIGl0IHdpbGwgaW5jb3JyZWN0bHlcclxuICAgICAgLy8gY29tcGFyZSBmb3IgZXhhbXBsZSAnMjAwMC05JyBhbmQgJzIwMDAtMTAnXHJcbiAgICAgIGNvbnN0IHNhbml0aXplVHlwZSA9IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/ICd5ZWFyJyA6ICdtb250aCdcclxuICAgICAgdGhpcy5pc1JldmVyc2luZyA9IHNhbml0aXplRGF0ZVN0cmluZyh2YWwsIHNhbml0aXplVHlwZSkgPCBzYW5pdGl6ZURhdGVTdHJpbmcocHJldiwgc2FuaXRpemVUeXBlKVxyXG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6cGlja2VyRGF0ZScsIHZhbClcclxuICAgIH0sXHJcbiAgICBwaWNrZXJEYXRlICh2YWw6IHN0cmluZyB8IG51bGwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gdmFsXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sYXN0VmFsdWUgJiYgdGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ21vbnRoJylcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhc3RWYWx1ZSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ3llYXInKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdmFsdWUgKG5ld1ZhbHVlOiBEYXRlUGlja2VyVmFsdWUsIG9sZFZhbHVlOiBEYXRlUGlja2VyVmFsdWUpIHtcclxuICAgICAgdGhpcy5jaGVja011bHRpcGxlUHJvcCgpXHJcbiAgICAgIHRoaXMuc2V0SW5wdXREYXRlKClcclxuXHJcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnZhbHVlICYmICF0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm11bHRpcGxlICYmICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggJiYgIShvbGRWYWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoICYmICF0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHR5cGUgKHR5cGU6IERhdGVQaWNrZXJUeXBlKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gdHlwZS50b1VwcGVyQ2FzZSgpXHJcblxyXG4gICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9ICh0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pIDogW3RoaXMudmFsdWUgYXMgc3RyaW5nXSlcclxuICAgICAgICAgIC5tYXAoKHZhbDogc3RyaW5nKSA9PiBzYW5pdGl6ZURhdGVTdHJpbmcodmFsLCB0eXBlKSlcclxuICAgICAgICAgIC5maWx0ZXIodGhpcy5pc0RhdGVBbGxvd2VkKVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5tdWx0aXBsZSA/IG91dHB1dCA6IG91dHB1dFswXSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWQgKCkge1xyXG4gICAgdGhpcy5jaGVja011bHRpcGxlUHJvcCgpXHJcblxyXG4gICAgaWYgKHRoaXMucGlja2VyRGF0ZSAhPT0gdGhpcy50YWJsZURhdGUpIHtcclxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnBpY2tlckRhdGUnLCB0aGlzLnRhYmxlRGF0ZSlcclxuICAgIH1cclxuICAgIHRoaXMuc2V0SW5wdXREYXRlKClcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBlbWl0SW5wdXQgKG5ld0lucHV0OiBzdHJpbmcpIHtcclxuICAgICAgY29uc3Qgb3V0cHV0ID0gdGhpcy5tdWx0aXBsZVxyXG4gICAgICAgID8gKFxyXG4gICAgICAgICAgKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmluZGV4T2YobmV3SW5wdXQpID09PSAtMVxyXG4gICAgICAgICAgICA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5jb25jYXQoW25ld0lucHV0XSlcclxuICAgICAgICAgICAgOiAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkuZmlsdGVyKHggPT4geCAhPT0gbmV3SW5wdXQpXHJcbiAgICAgICAgKVxyXG4gICAgICAgIDogbmV3SW5wdXRcclxuXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0Jywgb3V0cHV0KVxyXG4gICAgICB0aGlzLm11bHRpcGxlIHx8IHRoaXMuJGVtaXQoJ2NoYW5nZScsIG5ld0lucHV0KVxyXG4gICAgfSxcclxuICAgIGNoZWNrTXVsdGlwbGVQcm9wICgpIHtcclxuICAgICAgaWYgKHRoaXMudmFsdWUgPT0gbnVsbCkgcmV0dXJuXHJcbiAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IHRoaXMudmFsdWUuY29uc3RydWN0b3IubmFtZVxyXG4gICAgICBjb25zdCBleHBlY3RlZCA9IHRoaXMubXVsdGlwbGUgPyAnQXJyYXknIDogJ1N0cmluZydcclxuICAgICAgaWYgKHZhbHVlVHlwZSAhPT0gZXhwZWN0ZWQpIHtcclxuICAgICAgICBjb25zb2xlV2FybihgVmFsdWUgbXVzdCBiZSAke3RoaXMubXVsdGlwbGUgPyAnYW4nIDogJ2EnfSAke2V4cGVjdGVkfSwgZ290ICR7dmFsdWVUeXBlfWAsIHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0RhdGVBbGxvd2VkICh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybiBpc0RhdGVBbGxvd2VkKHZhbHVlLCB0aGlzLm1pbiwgdGhpcy5tYXgsIHRoaXMuYWxsb3dlZERhdGVzKVxyXG4gICAgfSxcclxuICAgIHllYXJDbGljayAodmFsdWU6IG51bWJlcikge1xyXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHZhbHVlXHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IGAke3ZhbHVlfWBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IGAke3ZhbHVlfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPSAnTU9OVEgnXHJcbiAgICAgIGlmICh0aGlzLnJlYWN0aXZlICYmICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuaXNEYXRlQWxsb3dlZCh0aGlzLmlucHV0RGF0ZSkpIHtcclxuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaW5wdXREYXRlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbW9udGhDbGljayAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMF0sIDEwKVxyXG4gICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzFdLCAxMCkgLSAxXHJcbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gdmFsdWVcclxuICAgICAgICB0aGlzLmFjdGl2ZVBpY2tlciA9ICdEQVRFJ1xyXG4gICAgICAgIGlmICh0aGlzLnJlYWN0aXZlICYmICF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuaXNEYXRlQWxsb3dlZCh0aGlzLmlucHV0RGF0ZSkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5pbnB1dERhdGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZW1pdElucHV0KHRoaXMuaW5wdXREYXRlKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGF0ZUNsaWNrICh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVswXSwgMTApXHJcbiAgICAgIHRoaXMuaW5wdXRNb250aCA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMV0sIDEwKSAtIDFcclxuICAgICAgdGhpcy5pbnB1dERheSA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMl0sIDEwKVxyXG4gICAgICB0aGlzLmVtaXRJbnB1dCh0aGlzLmlucHV0RGF0ZSlcclxuICAgIH0sXHJcbiAgICBnZW5QaWNrZXJUaXRsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyVGl0bGUsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgZGF0ZTogdGhpcy52YWx1ZSA/ICh0aGlzLmZvcm1hdHRlcnMudGl0bGVEYXRlIGFzICh2YWx1ZTogYW55KSA9PiBzdHJpbmcpKHRoaXMudmFsdWUpIDogJycsXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxyXG4gICAgICAgICAgc2VsZWN0aW5nWWVhcjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdZRUFSJyxcclxuICAgICAgICAgIHllYXI6IHRoaXMuZm9ybWF0dGVycy55ZWFyKHRoaXMudmFsdWUgPyBgJHt0aGlzLmlucHV0WWVhcn1gIDogdGhpcy50YWJsZURhdGUpLFxyXG4gICAgICAgICAgeWVhckljb246IHRoaXMueWVhckljb24sXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tdWx0aXBsZSA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKVswXSA6IHRoaXMudmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsb3Q6ICd0aXRsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICd1cGRhdGU6c2VsZWN0aW5nWWVhcic6ICh2YWx1ZTogYm9vbGVhbikgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSB2YWx1ZSA/ICdZRUFSJyA6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblRhYmxlSGVhZGVyICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJIZWFkZXIsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmV4dEljb246IHRoaXMubmV4dEljb24sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmhlYWRlckRhdGVGb3JtYXQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLm1pbk1vbnRoIDogdGhpcy5taW5ZZWFyLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5tYXhNb250aCA6IHRoaXMubWF4WWVhcixcclxuICAgICAgICAgIHByZXZJY29uOiB0aGlzLnByZXZJY29uLFxyXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9LSR7cGFkKHRoaXMudGFibGVNb250aCArIDEpfWAgOiBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfWBcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICB0b2dnbGU6ICgpID0+IHRoaXMuYWN0aXZlUGlja2VyID0gKHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyAnTU9OVEgnIDogJ1lFQVInKSxcclxuICAgICAgICAgIGlucHV0OiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5EYXRlVGFibGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlckRhdGVUYWJsZSwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd2VkRGF0ZXM6IHRoaXMuYWxsb3dlZERhdGVzLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBjdXJyZW50OiB0aGlzLmN1cnJlbnQsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIGV2ZW50czogdGhpcy5ldmVudHMsXHJcbiAgICAgICAgICBldmVudENvbG9yOiB0aGlzLmV2ZW50Q29sb3IsXHJcbiAgICAgICAgICBmaXJzdERheU9mV2VlazogdGhpcy5maXJzdERheU9mV2VlayxcclxuICAgICAgICAgIGZvcm1hdDogdGhpcy5kYXlGb3JtYXQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLm1heCxcclxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxyXG4gICAgICAgICAgc2Nyb2xsYWJsZTogdGhpcy5zY3JvbGxhYmxlLFxyXG4gICAgICAgICAgc2hvd1dlZWs6IHRoaXMuc2hvd1dlZWssXHJcbiAgICAgICAgICB0YWJsZURhdGU6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9LSR7cGFkKHRoaXMudGFibGVNb250aCArIDEpfWAsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgICAgIHdlZWtkYXlGb3JtYXQ6IHRoaXMud2Vla2RheUZvcm1hdFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAndGFibGUnLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy5kYXRlQ2xpY2ssXHJcbiAgICAgICAgICB0YWJsZURhdGU6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlLFxyXG4gICAgICAgICAgJ2NsaWNrOmRhdGUnOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy4kZW1pdCgnY2xpY2s6ZGF0ZScsIHZhbHVlKSxcclxuICAgICAgICAgICdkYmxjbGljazpkYXRlJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2RibGNsaWNrOmRhdGUnLCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuTW9udGhUYWJsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyTW9udGhUYWJsZSwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd2VkRGF0ZXM6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuYWxsb3dlZERhdGVzIDogbnVsbCxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxyXG4gICAgICAgICAgY3VycmVudDogdGhpcy5jdXJyZW50ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuY3VycmVudCwgJ21vbnRoJykgOiBudWxsLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBldmVudHM6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuZXZlbnRzIDogbnVsbCxcclxuICAgICAgICAgIGV2ZW50Q29sb3I6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuZXZlbnRDb2xvciA6IG51bGwsXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMubW9udGhGb3JtYXQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluTW9udGgsXHJcbiAgICAgICAgICBtYXg6IHRoaXMubWF4TW9udGgsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcsXHJcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5zZWxlY3RlZE1vbnRocyxcclxuICAgICAgICAgIHRhYmxlRGF0ZTogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX1gXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICd0YWJsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGlucHV0OiB0aGlzLm1vbnRoQ2xpY2ssXHJcbiAgICAgICAgICB0YWJsZURhdGU6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlLFxyXG4gICAgICAgICAgJ2NsaWNrOm1vbnRoJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2NsaWNrOm1vbnRoJywgdmFsdWUpLFxyXG4gICAgICAgICAgJ2RibGNsaWNrOm1vbnRoJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2RibGNsaWNrOm1vbnRoJywgdmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblllYXJzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJZZWFycywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGZvcm1hdDogdGhpcy55ZWFyRm9ybWF0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5taW5ZZWFyLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLm1heFllYXIsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy50YWJsZVllYXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy55ZWFyQ2xpY2tcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuUGlja2VyQm9keSAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdZRUFSJyA/IFtcclxuICAgICAgICB0aGlzLmdlblllYXJzKClcclxuICAgICAgXSA6IFtcclxuICAgICAgICB0aGlzLmdlblRhYmxlSGVhZGVyKCksXHJcbiAgICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMuZ2VuRGF0ZVRhYmxlKCkgOiB0aGlzLmdlbk1vbnRoVGFibGUoKVxyXG4gICAgICBdXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIGtleTogdGhpcy5hY3RpdmVQaWNrZXJcclxuICAgICAgfSwgY2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgc2V0SW5wdXREYXRlICgpIHtcclxuICAgICAgaWYgKHRoaXMubGFzdFZhbHVlKSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLmxhc3RWYWx1ZS5zcGxpdCgnLScpXHJcbiAgICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludChhcnJheVswXSwgMTApXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQoYXJyYXlbMV0sIDEwKSAtIDFcclxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICAgIHRoaXMuaW5wdXREYXkgPSBwYXJzZUludChhcnJheVsyXSwgMTApXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5wdXRZZWFyID0gdGhpcy5pbnB1dFllYXIgfHwgdGhpcy5ub3cuZ2V0RnVsbFllYXIoKVxyXG4gICAgICAgIHRoaXMuaW5wdXRNb250aCA9IHRoaXMuaW5wdXRNb250aCA9PSBudWxsID8gdGhpcy5pbnB1dE1vbnRoIDogdGhpcy5ub3cuZ2V0TW9udGgoKVxyXG4gICAgICAgIHRoaXMuaW5wdXREYXkgPSB0aGlzLmlucHV0RGF5IHx8IHRoaXMubm93LmdldERhdGUoKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyICgpOiBWTm9kZSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZW5QaWNrZXIoJ3YtcGlja2VyLS1kYXRlJylcclxuICB9XHJcbn0pXHJcbiJdfQ==