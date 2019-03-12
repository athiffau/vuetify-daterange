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
        range: Boolean,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN6RCxPQUFPLGFBQXNDLE1BQU0sc0JBQXNCLENBQUE7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUN6RCxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQW1CdEMsZ0ZBQWdGO0FBQ2hGLGtEQUFrRDtBQUNsRCxTQUFTLGtCQUFrQixDQUFFLFVBQWtCLEVBQUUsSUFBK0I7SUFDOUUsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3pELE9BQU8sR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVB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Q3BEO1FBQ0gsQ0FBQztLQUNGO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXHJcbmltcG9ydCBWRGF0ZVBpY2tlclRpdGxlIGZyb20gJy4vVkRhdGVQaWNrZXJUaXRsZSdcclxuaW1wb3J0IFZEYXRlUGlja2VySGVhZGVyIGZyb20gJy4vVkRhdGVQaWNrZXJIZWFkZXInXHJcbmltcG9ydCBWRGF0ZVBpY2tlckRhdGVUYWJsZSBmcm9tICcuL1ZEYXRlUGlja2VyRGF0ZVRhYmxlJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJNb250aFRhYmxlIGZyb20gJy4vVkRhdGVQaWNrZXJNb250aFRhYmxlJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJZZWFycyBmcm9tICcuL1ZEYXRlUGlja2VyWWVhcnMnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IFBpY2tlciBmcm9tICcuLi8uLi9taXhpbnMvcGlja2VyJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsgcGFkLCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIgfSBmcm9tICcuL3V0aWwnXHJcbmltcG9ydCBpc0RhdGVBbGxvd2VkLCB7IEFsbG93ZWREYXRlRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNEYXRlQWxsb3dlZCdcclxuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcbmltcG9ydCB7IGRheXNJbk1vbnRoIH0gZnJvbSAnLi4vVkNhbGVuZGFyL3V0aWwvdGltZXN0YW1wJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgUHJvcFZhbGlkYXRvciB9IGZyb20gJ3Z1ZS90eXBlcy9vcHRpb25zJ1xyXG5pbXBvcnQgeyBEYXRlUGlja2VyRm9ybWF0dGVyIH0gZnJvbSAnLi91dGlsL2NyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcidcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG5leHBvcnQgdHlwZSBEYXRlRXZlbnRDb2xvclZhbHVlID0gc3RyaW5nIHwgc3RyaW5nW11cclxuZXhwb3J0IHR5cGUgRGF0ZUV2ZW50cyA9IHN0cmluZ1tdIHwgKChkYXRlOiBzdHJpbmcpID0+IGJvb2xlYW4gfCBEYXRlRXZlbnRDb2xvclZhbHVlKSB8IFJlY29yZDxzdHJpbmcsIERhdGVFdmVudENvbG9yVmFsdWU+XHJcbmV4cG9ydCB0eXBlIERhdGVFdmVudENvbG9ycyA9IERhdGVFdmVudENvbG9yVmFsdWUgfCBSZWNvcmQ8c3RyaW5nLCBEYXRlRXZlbnRDb2xvclZhbHVlPiB8ICgoZGF0ZTogc3RyaW5nKSA9PiBEYXRlRXZlbnRDb2xvclZhbHVlKVxyXG50eXBlIERhdGVQaWNrZXJWYWx1ZSA9IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkXHJcbnR5cGUgRGF0ZVBpY2tlclR5cGUgPSAnZGF0ZScgfCAnbW9udGgnXHJcbnR5cGUgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyID0gKGRhdGU6IHN0cmluZ1tdKSA9PiBzdHJpbmdcclxuaW50ZXJmYWNlIEZvcm1hdHRlcnMge1xyXG4gIHllYXI6IERhdGVQaWNrZXJGb3JtYXR0ZXJcclxuICB0aXRsZURhdGU6IERhdGVQaWNrZXJGb3JtYXR0ZXIgfCBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXJcclxuICB0aXRsZU1vbnRoWWVhcjogRGF0ZVBpY2tlckZvcm1hdHRlclxyXG59XHJcblxyXG4vLyBBZGRzIGxlYWRpbmcgemVybyB0byBtb250aC9kYXkgaWYgbmVjZXNzYXJ5LCByZXR1cm5zICdZWVlZJyBpZiB0eXBlID0gJ3llYXInLFxyXG4vLyAnWVlZWS1NTScgaWYgJ21vbnRoJyBhbmQgJ1lZWVktTU0tREQnIGlmICdkYXRlJ1xyXG5mdW5jdGlvbiBzYW5pdGl6ZURhdGVTdHJpbmcgKGRhdGVTdHJpbmc6IHN0cmluZywgdHlwZTogJ2RhdGUnIHwgJ21vbnRoJyB8ICd5ZWFyJyk6IHN0cmluZyB7XHJcbiAgY29uc3QgW3llYXIsIG1vbnRoID0gMSwgZGF0ZSA9IDFdID0gZGF0ZVN0cmluZy5zcGxpdCgnLScpXHJcbiAgcmV0dXJuIGAke3llYXJ9LSR7cGFkKG1vbnRoKX0tJHtwYWQoZGF0ZSl9YC5zdWJzdHIoMCwgeyBkYXRlOiAxMCwgbW9udGg6IDcsIHllYXI6IDQgfVt0eXBlXSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIFBpY2tlclxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtZGF0ZS1waWNrZXInLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWxsb3dEYXRlQ2hhbmdlOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBhbGxvd2VkRGF0ZXM6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8QWxsb3dlZERhdGVGdW5jdGlvbiB8IHVuZGVmaW5lZD4sXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIHRoZSBkYXkgaW4gZGF0ZSBwaWNrZXIgdGFibGVcclxuICAgIGRheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxBbGxvd2VkRGF0ZUZ1bmN0aW9uIHwgdW5kZWZpbmVkPixcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgZXZlbnRzOiB7XHJcbiAgICAgIHR5cGU6IFtBcnJheSwgRnVuY3Rpb24sIE9iamVjdF0sXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IG51bGxcclxuICAgIH0gYXMgYW55IGFzIFByb3BWYWxpZGF0b3I8RGF0ZUV2ZW50cz4sXHJcbiAgICBldmVudENvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFtBcnJheSwgRnVuY3Rpb24sIE9iamVjdCwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gJ3dhcm5pbmcnXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVFdmVudENvbG9ycz4sXHJcbiAgICBmaXJzdERheU9mV2Vlazoge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBOdW1iZXJdLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9LFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyB0aGUgdGFibGVEYXRlIGluIHRoZSBkYXkvbW9udGggdGFibGUgaGVhZGVyXHJcbiAgICBoZWFkZXJEYXRlRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgaGlkZURpc2FibGVkOiB7XHJcbiAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgaG92ZXJMaW5rOiBTdHJpbmcsXHJcbiAgICBsb2NhbGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnZW4tdXMnXHJcbiAgICB9LFxyXG4gICAgbWF4OiBTdHJpbmcsXHJcbiAgICBtaW46IFN0cmluZyxcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgbW9udGggaW4gdGhlIG1vbnRocyB0YWJsZVxyXG4gICAgbW9udGhGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICBtdWx0aXBsZTogQm9vbGVhbixcclxuICAgIG5leHRJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLm5leHQnXHJcbiAgICB9LFxyXG4gICAgcGlja2VyRGF0ZTogU3RyaW5nLFxyXG4gICAgcHJldkljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMucHJldidcclxuICAgIH0sXHJcbiAgICByYW5nZTogQm9vbGVhbixcclxuICAgIHJlYWN0aXZlOiBCb29sZWFuLFxyXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXHJcbiAgICBzY3JvbGxhYmxlOiBCb29sZWFuLFxyXG4gICAgc2hvd0N1cnJlbnQ6IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIH0sXHJcbiAgICBzaG93V2VlazogQm9vbGVhbixcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgY3VycmVudGx5IHNlbGVjdGVkIGRhdGUgaW4gdGhlIHBpY2tlciB0aXRsZVxyXG4gICAgdGl0bGVEYXRlRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdkYXRlJyxcclxuICAgICAgdmFsaWRhdG9yOiAodHlwZTogYW55KSA9PiBbJ2RhdGUnLCAnbW9udGgnXS5pbmNsdWRlcyh0eXBlKSAvLyBUT0RPOiB5ZWFyXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJUeXBlPixcclxuICAgIHZhbHVlOiBbQXJyYXksIFN0cmluZ10gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVmFsdWU+LFxyXG4gICAgd2Vla2RheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHllYXIgaW4gdGFibGUgaGVhZGVyIGFuZCBwaWNrdXAgdGl0bGVcclxuICAgIHllYXJGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICB5ZWFySWNvbjogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhY3RpdmVQaWNrZXI6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICBpbnB1dERheTogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpbnB1dE1vbnRoOiBudWxsIGFzIG51bWJlciB8IG51bGwsXHJcbiAgICAgIGlucHV0WWVhcjogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpc1JldmVyc2luZzogZmFsc2UsXHJcbiAgICAgIGhvdmVyaW5nOiAnJyxcclxuICAgICAgbm93LFxyXG4gICAgICAvLyB0YWJsZURhdGUgaXMgYSBzdHJpbmcgaW4gJ1lZWVknIC8gJ1lZWVktTScgZm9ybWF0IChsZWFkaW5nIHplcm8gZm9yIG1vbnRoIGlzIG5vdCByZXF1aXJlZClcclxuICAgICAgdGFibGVEYXRlOiAoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnBpY2tlckRhdGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGUgPSAodGhpcy5tdWx0aXBsZSA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKVsodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoIC0gMV0gOiB0aGlzLnZhbHVlKSB8fFxyXG4gICAgICAgICAgYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7bm93LmdldE1vbnRoKCkgKyAxfWBcclxuICAgICAgICByZXR1cm4gc2FuaXRpemVEYXRlU3RyaW5nKGRhdGUgYXMgc3RyaW5nLCB0aGlzLnR5cGUgPT09ICdkYXRlJyA/ICdtb250aCcgOiAneWVhcicpXHJcbiAgICAgIH0pKClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgbGFzdFZhbHVlICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSlbKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAtIDFdIDogKHRoaXMudmFsdWUgYXMgc3RyaW5nIHwgbnVsbClcclxuICAgIH0sXHJcbiAgICBzZWxlY3RlZE1vbnRocyAoKTogc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWQge1xyXG4gICAgICBpZiAoIXRoaXMudmFsdWUgfHwgIXRoaXMudmFsdWUubGVuZ3RoIHx8IHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkubWFwKHZhbCA9PiB2YWwuc3Vic3RyKDAsIDcpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAodGhpcy52YWx1ZSBhcyBzdHJpbmcpLnN1YnN0cigwLCA3KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3VycmVudCAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIGlmICh0aGlzLnNob3dDdXJyZW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHNhbml0aXplRGF0ZVN0cmluZyhgJHt0aGlzLm5vdy5nZXRGdWxsWWVhcigpfS0ke3RoaXMubm93LmdldE1vbnRoKCkgKyAxfS0ke3RoaXMubm93LmdldERhdGUoKX1gLCB0aGlzLnR5cGUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnNob3dDdXJyZW50IHx8IG51bGxcclxuICAgIH0sXHJcbiAgICBpbnB1dERhdGUgKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdkYXRlJ1xyXG4gICAgICAgID8gYCR7dGhpcy5pbnB1dFllYXJ9LSR7cGFkKHRoaXMuaW5wdXRNb250aCEgKyAxKX0tJHtwYWQodGhpcy5pbnB1dERheSEpfWBcclxuICAgICAgICA6IGAke3RoaXMuaW5wdXRZZWFyfS0ke3BhZCh0aGlzLmlucHV0TW9udGghICsgMSl9YFxyXG4gICAgfSxcclxuICAgIHRhYmxlTW9udGggKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBOdW1iZXIoKHRoaXMucGlja2VyRGF0ZSB8fCB0aGlzLnRhYmxlRGF0ZSkuc3BsaXQoJy0nKVsxXSkgLSAxXHJcbiAgICB9LFxyXG4gICAgdGFibGVZZWFyICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMF0pXHJcbiAgICB9LFxyXG4gICAgbWluTW9udGggKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICByZXR1cm4gdGhpcy5taW4gPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5taW4sICdtb250aCcpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIG1heE1vbnRoICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAnbW9udGgnKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtaW5ZZWFyICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAneWVhcicpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIG1heFllYXIgKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICByZXR1cm4gdGhpcy5tYXggPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5tYXgsICd5ZWFyJykgOiBudWxsXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0dGVycyAoKTogRm9ybWF0dGVycyB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogdGhpcy55ZWFyRm9ybWF0IHx8IGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcih0aGlzLmxvY2FsZSwgeyB5ZWFyOiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LCB7IGxlbmd0aDogNCB9KSxcclxuICAgICAgICB0aXRsZURhdGU6IHRoaXMudGl0bGVEYXRlRm9ybWF0IHx8ICh0aGlzLm11bHRpcGxlID8gdGhpcy5kZWZhdWx0VGl0bGVNdWx0aXBsZURhdGVGb3JtYXR0ZXIgOiB0aGlzLmRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIpLFxyXG4gICAgICAgIHRpdGxlTW9udGhZZWFyOiB0aGlzLmRlZmF1bHRSYW5nZVRpdGxlRm9ybWF0dGVyXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkZWZhdWx0VGl0bGVNdWx0aXBsZURhdGVGb3JtYXR0ZXIgKCk6IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciB7XHJcbiAgICAgIGlmICgodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoIDwgMikge1xyXG4gICAgICAgIHJldHVybiBkYXRlcyA9PiBkYXRlcy5sZW5ndGggPyB0aGlzLmRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIoZGF0ZXNbMF0pIDogJzAgc2VsZWN0ZWQnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBkYXRlcyA9PiBgJHtkYXRlcy5sZW5ndGh9IHNlbGVjdGVkYFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIgKCk6IERhdGVQaWNrZXJGb3JtYXR0ZXIge1xyXG4gICAgICBjb25zdCB0aXRsZUZvcm1hdHMgPSB7XHJcbiAgICAgICAgeWVhcjogeyB5ZWFyOiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LFxyXG4gICAgICAgIG1vbnRoOiB7IG1vbnRoOiAnbG9uZycsIHRpbWVab25lOiAnVVRDJyB9LFxyXG4gICAgICAgIGRhdGU6IHsgd2Vla2RheTogJ3Nob3J0JywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB0aXRsZURhdGVGb3JtYXR0ZXIgPSBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHRpdGxlRm9ybWF0c1t0aGlzLnR5cGVdLCB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgbGVuZ3RoOiB7IGRhdGU6IDEwLCBtb250aDogNywgeWVhcjogNCB9W3RoaXMudHlwZV1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGNvbnN0IGxhbmRzY2FwZUZvcm1hdHRlciA9IChkYXRlOiBzdHJpbmcpID0+IHRpdGxlRGF0ZUZvcm1hdHRlcihkYXRlKVxyXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXGRcXHNdKShbXFxkXSkvZywgKG1hdGNoLCBub25EaWdpdCwgZGlnaXQpID0+IGAke25vbkRpZ2l0fSAke2RpZ2l0fWApXHJcbiAgICAgICAgLnJlcGxhY2UoJywgJywgJyw8YnI+JylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmxhbmRzY2FwZSA/IGxhbmRzY2FwZUZvcm1hdHRlciA6IHRpdGxlRGF0ZUZvcm1hdHRlclxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRSYW5nZVRpdGxlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyRm9ybWF0dGVyIHtcclxuICAgICAgY29uc3QgdGl0bGVSYW5nZUZvcm1hdHRlciA9IGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcih0aGlzLmxvY2FsZSwgeyBtb250aDogJ3Nob3J0JywgZGF5OiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LCB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgbGVuZ3RoOiA2XHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0aXRsZVJhbmdlRm9ybWF0dGVyXHJcbiAgICB9XHJcbiAgfSxcclxuICB3YXRjaDoge1xyXG4gICAgYWN0aXZlUGlja2VyICh2YWw6IHN0cmluZykge1xyXG4gICAgICB0aGlzLiRlbWl0KCdwaWNrZXJUeXBlJywgdmFsKVxyXG4gICAgfSxcclxuICAgIHRhYmxlRGF0ZSAodmFsOiBzdHJpbmcsIHByZXY6IHN0cmluZykge1xyXG4gICAgICAvLyBNYWtlIGEgSVNPIDg2MDEgc3RyaW5ncyBmcm9tIHZhbCBhbmQgcHJldiBmb3IgY29tcGFyaXNpb24sIG90aGVyd2lzZSBpdCB3aWxsIGluY29ycmVjdGx5XHJcbiAgICAgIC8vIGNvbXBhcmUgZm9yIGV4YW1wbGUgJzIwMDAtOScgYW5kICcyMDAwLTEwJ1xyXG4gICAgICBjb25zdCBzYW5pdGl6ZVR5cGUgPSB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnXHJcbiAgICAgIHRoaXMuaXNSZXZlcnNpbmcgPSBzYW5pdGl6ZURhdGVTdHJpbmcodmFsLCBzYW5pdGl6ZVR5cGUpIDwgc2FuaXRpemVEYXRlU3RyaW5nKHByZXYsIHNhbml0aXplVHlwZSlcclxuICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOnBpY2tlckRhdGUnLCB2YWwpXHJcbiAgICB9LFxyXG4gICAgcGlja2VyRGF0ZSAodmFsOiBzdHJpbmcgfCBudWxsKSB7XHJcbiAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHZhbFxyXG4gICAgICAgIHRoaXMuc2V0SW5wdXREYXRlKClcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhc3RWYWx1ZSAmJiB0aGlzLnR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubGFzdFZhbHVlLCAnbW9udGgnKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGFzdFZhbHVlICYmIHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubGFzdFZhbHVlLCAneWVhcicpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2YWx1ZSAobmV3VmFsdWU6IERhdGVQaWNrZXJWYWx1ZSwgb2xkVmFsdWU6IERhdGVQaWNrZXJWYWx1ZSkge1xyXG4gICAgICB0aGlzLmNoZWNrTXVsdGlwbGVQcm9wKClcclxuICAgICAgdGhpcy5zZXRJbnB1dERhdGUoKVxyXG5cclxuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIHRoaXMudmFsdWUgJiYgIXRoaXMucGlja2VyRGF0ZSkge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuaW5wdXREYXRlLCB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXVsdGlwbGUgJiYgKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAmJiAhKG9sZFZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggJiYgIXRoaXMucGlja2VyRGF0ZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBSZXBsYWNpbmcgdGFibGVEYXRlIHdpdGggJHt0aGlzLmlucHV0RGF0ZX1gKVxyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuaW5wdXREYXRlLCB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdHlwZSAodHlwZTogRGF0ZVBpY2tlclR5cGUpIHtcclxuICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPSB0eXBlLnRvVXBwZXJDYXNlKClcclxuXHJcbiAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gKHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkgOiBbdGhpcy52YWx1ZSBhcyBzdHJpbmddKVxyXG4gICAgICAgICAgLm1hcCgodmFsOiBzdHJpbmcpID0+IHNhbml0aXplRGF0ZVN0cmluZyh2YWwsIHR5cGUpKVxyXG4gICAgICAgICAgLmZpbHRlcih0aGlzLmlzRGF0ZUFsbG93ZWQpXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLm11bHRpcGxlID8gb3V0cHV0IDogb3V0cHV0WzBdKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaG92ZXJpbmcgKHZhbHVlOiBTdHJpbmcsIHByZXY6IHN0cmluZykge1xyXG4gICAgICB0aGlzLiRlbWl0KCdob3ZlckxpbmsnLCB2YWx1ZSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjcmVhdGVkICgpIHtcclxuICAgIHRoaXMuY2hlY2tNdWx0aXBsZVByb3AoKVxyXG5cclxuICAgIGlmICh0aGlzLnBpY2tlckRhdGUgIT09IHRoaXMudGFibGVEYXRlKSB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpwaWNrZXJEYXRlJywgdGhpcy50YWJsZURhdGUpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNldElucHV0RGF0ZSgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZW1pdElucHV0IChuZXdJbnB1dDogc3RyaW5nKSB7XHJcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRoaXMubXVsdGlwbGVcclxuICAgICAgICA/IChcclxuICAgICAgICAgICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5pbmRleE9mKG5ld0lucHV0KSA9PT0gLTFcclxuICAgICAgICAgICAgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkuY29uY2F0KFtuZXdJbnB1dF0pXHJcbiAgICAgICAgICAgIDogKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmZpbHRlcih4ID0+IHggIT09IG5ld0lucHV0KVxyXG4gICAgICAgIClcclxuICAgICAgICA6IG5ld0lucHV0XHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG91dHB1dClcclxuICAgICAgdGhpcy5tdWx0aXBsZSB8fCB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdJbnB1dClcclxuICAgIH0sXHJcbiAgICBjaGVja011bHRpcGxlUHJvcCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnZhbHVlID09IG51bGwpIHJldHVyblxyXG4gICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0aGlzLnZhbHVlLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSB0aGlzLm11bHRpcGxlID8gJ0FycmF5JyA6ICdTdHJpbmcnXHJcbiAgICAgIGlmICh2YWx1ZVR5cGUgIT09IGV4cGVjdGVkKSB7XHJcbiAgICAgICAgY29uc29sZVdhcm4oYFZhbHVlIG11c3QgYmUgJHt0aGlzLm11bHRpcGxlID8gJ2FuJyA6ICdhJ30gJHtleHBlY3RlZH0sIGdvdCAke3ZhbHVlVHlwZX1gLCB0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNEYXRlQWxsb3dlZCAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICByZXR1cm4gaXNEYXRlQWxsb3dlZCh2YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCB0aGlzLmFsbG93ZWREYXRlcylcclxuICAgIH0sXHJcbiAgICB5ZWFyQ2xpY2sgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgdGhpcy5pbnB1dFllYXIgPSB2YWx1ZVxyXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbW9udGgnKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSBgJHt2YWx1ZX1gXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSBgJHt2YWx1ZX0tJHtwYWQoKHRoaXMudGFibGVNb250aCB8fCAwKSArIDEpfWBcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFjdGl2ZVBpY2tlciA9ICdNT05USCdcclxuICAgICAgaWYgKHRoaXMucmVhY3RpdmUgJiYgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5pc0RhdGVBbGxvd2VkKHRoaXMuaW5wdXREYXRlKSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5pbnB1dERhdGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb250aENsaWNrICh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVswXSwgMTApXHJcbiAgICAgIHRoaXMuaW5wdXRNb250aCA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMV0sIDEwKSAtIDFcclxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXREYXkpIHtcclxuICAgICAgICAgIHRoaXMuaW5wdXREYXkgPSBNYXRoLm1pbih0aGlzLmlucHV0RGF5LCBkYXlzSW5Nb250aCh0aGlzLmlucHV0WWVhciwgdGhpcy5pbnB1dE1vbnRoICsgMSkpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPSAnREFURSdcclxuICAgICAgICBpZiAodGhpcy5yZWFjdGl2ZSAmJiAhdGhpcy5yZWFkb25seSAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLmlzRGF0ZUFsbG93ZWQodGhpcy5pbnB1dERhdGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaW5wdXREYXRlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVtaXRJbnB1dCh0aGlzLmlucHV0RGF0ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRhdGVDbGljayAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMF0sIDEwKVxyXG4gICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzFdLCAxMCkgLSAxXHJcbiAgICAgIHRoaXMuaW5wdXREYXkgPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzJdLCAxMClcclxuICAgICAgdGhpcy5lbWl0SW5wdXQodGhpcy5pbnB1dERhdGUpXHJcbiAgICB9LFxyXG4gICAgZ2VuUGlja2VyVGl0bGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlclRpdGxlLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFsbG93RGF0ZUNoYW5nZTogdGhpcy5hbGxvd0RhdGVDaGFuZ2UsXHJcbiAgICAgICAgICBkYXRlOiB0aGlzLnZhbHVlID8gKHRoaXMuZm9ybWF0dGVycy50aXRsZURhdGUgYXMgKHZhbHVlOiBhbnkpID0+IHN0cmluZykodGhpcy52YWx1ZSkgOiAnJyxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXHJcbiAgICAgICAgICBzZWxlY3RpbmdZZWFyOiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ1lFQVInLFxyXG4gICAgICAgICAgeWVhcjogdGhpcy5mb3JtYXR0ZXJzLnllYXIodGhpcy52YWx1ZSA/IGAke3RoaXMuaW5wdXRZZWFyfWAgOiB0aGlzLnRhYmxlRGF0ZSksXHJcbiAgICAgICAgICB5ZWFySWNvbjogdGhpcy55ZWFySWNvbixcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pWzBdIDogdGhpcy52YWx1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2xvdDogJ3RpdGxlJyxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgJ3VwZGF0ZTpzZWxlY3RpbmdZZWFyJzogKHZhbHVlOiBib29sZWFuKSA9PiB0aGlzLmFjdGl2ZVBpY2tlciA9IHZhbHVlID8gJ1lFQVInIDogdGhpcy50eXBlLnRvVXBwZXJDYXNlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuVGFibGVIZWFkZXIgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlckhlYWRlciwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd0RhdGVDaGFuZ2U6IHRoaXMuYWxsb3dEYXRlQ2hhbmdlLFxyXG4gICAgICAgICAgbmV4dEljb246IHRoaXMubmV4dEljb24sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmhlYWRlckRhdGVGb3JtYXQsXHJcbiAgICAgICAgICBoaWRlRGlzYWJsZWQ6IHRoaXMuaGlkZURpc2FibGVkLFxyXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXHJcbiAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxyXG4gICAgICAgICAgbWluOiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5taW5Nb250aCA6IHRoaXMubWluWWVhcixcclxuICAgICAgICAgIG1heDogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMubWF4TW9udGggOiB0aGlzLm1heFllYXIsXHJcbiAgICAgICAgICBwcmV2SWNvbjogdGhpcy5wcmV2SWNvbixcclxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gIDogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX1gXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgdG9nZ2xlOiAoKSA9PiB0aGlzLmFjdGl2ZVBpY2tlciA9ICh0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gJ01PTlRIJyA6ICdZRUFSJyksXHJcbiAgICAgICAgICBpbnB1dDogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMudGFibGVEYXRlID0gdmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuRGF0ZVRhYmxlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJEYXRlVGFibGUsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgYWxsb3dlZERhdGVzOiB0aGlzLmFsbG93ZWREYXRlcyxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxyXG4gICAgICAgICAgY3VycmVudDogdGhpcy5jdXJyZW50LFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBldmVudHM6IHRoaXMuZXZlbnRzLFxyXG4gICAgICAgICAgZXZlbnRDb2xvcjogdGhpcy5ldmVudENvbG9yLFxyXG4gICAgICAgICAgZmlyc3REYXlPZldlZWs6IHRoaXMuZmlyc3REYXlPZldlZWssXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMuZGF5Rm9ybWF0LFxyXG4gICAgICAgICAgaG92ZXJMaW5rOiB0aGlzLmhvdmVyTGluayxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5taW4sXHJcbiAgICAgICAgICBtYXg6IHRoaXMubWF4LFxyXG4gICAgICAgICAgcmFuZ2U6IHRoaXMucmFuZ2UsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHNjcm9sbGFibGU6IHRoaXMuc2Nyb2xsYWJsZSxcclxuICAgICAgICAgIHNob3dXZWVrOiB0aGlzLnNob3dXZWVrLFxyXG4gICAgICAgICAgdGFibGVEYXRlOiBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gLFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgICAgICB3ZWVrZGF5Rm9ybWF0OiB0aGlzLndlZWtkYXlGb3JtYXRcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlZjogJ3RhYmxlJyxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgaW5wdXQ6IHRoaXMuZGF0ZUNsaWNrLFxyXG4gICAgICAgICAgdGFibGVEYXRlOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcclxuICAgICAgICAgIGhvdmVyOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy5ob3ZlcmluZyA9IHZhbHVlLFxyXG4gICAgICAgICAgJ2NsaWNrOmRhdGUnOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy4kZW1pdCgnY2xpY2s6ZGF0ZScsIHZhbHVlKSxcclxuICAgICAgICAgICdkYmxjbGljazpkYXRlJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2RibGNsaWNrOmRhdGUnLCB2YWx1ZSksXHJcbiAgICAgICAgICAnaG92ZXJMaW5rJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2hvdmVyTGluaycsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5Nb250aFRhYmxlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJNb250aFRhYmxlLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFsbG93ZWREYXRlczogdGhpcy50eXBlID09PSAnbW9udGgnID8gdGhpcy5hbGxvd2VkRGF0ZXMgOiBudWxsLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBjdXJyZW50OiB0aGlzLmN1cnJlbnQgPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5jdXJyZW50LCAnbW9udGgnKSA6IG51bGwsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIGV2ZW50czogdGhpcy50eXBlID09PSAnbW9udGgnID8gdGhpcy5ldmVudHMgOiBudWxsLFxyXG4gICAgICAgICAgZXZlbnRDb2xvcjogdGhpcy50eXBlID09PSAnbW9udGgnID8gdGhpcy5ldmVudENvbG9yIDogbnVsbCxcclxuICAgICAgICAgIGZvcm1hdDogdGhpcy5tb250aEZvcm1hdCxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5taW5Nb250aCxcclxuICAgICAgICAgIG1heDogdGhpcy5tYXhNb250aCxcclxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5ICYmIHRoaXMudHlwZSA9PT0gJ21vbnRoJyxcclxuICAgICAgICAgIHNjcm9sbGFibGU6IHRoaXMuc2Nyb2xsYWJsZSxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLnNlbGVjdGVkTW9udGhzLFxyXG4gICAgICAgICAgdmlld2luZzogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCxcclxuICAgICAgICAgIHRhYmxlRGF0ZTogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX1gXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICd0YWJsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGlucHV0OiB0aGlzLm1vbnRoQ2xpY2ssXHJcbiAgICAgICAgICB0YWJsZURhdGU6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlLFxyXG4gICAgICAgICAgJ2NsaWNrOm1vbnRoJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2NsaWNrOm1vbnRoJywgdmFsdWUpLFxyXG4gICAgICAgICAgJ2RibGNsaWNrOm1vbnRoJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2RibGNsaWNrOm1vbnRoJywgdmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblllYXJzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJZZWFycywge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGZvcm1hdDogdGhpcy55ZWFyRm9ybWF0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5taW5ZZWFyLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLm1heFllYXIsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy50YWJsZVllYXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy55ZWFyQ2xpY2tcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuUGlja2VyQm9keSAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdZRUFSJyA/IFtcclxuICAgICAgICB0aGlzLmdlblllYXJzKClcclxuICAgICAgXSA6IFtcclxuICAgICAgICB0aGlzLmdlblRhYmxlSGVhZGVyKCksXHJcbiAgICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMuZ2VuRGF0ZVRhYmxlKCkgOiB0aGlzLmdlbk1vbnRoVGFibGUoKVxyXG4gICAgICBdXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIGtleTogdGhpcy5hY3RpdmVQaWNrZXJcclxuICAgICAgfSwgY2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgc2V0SW5wdXREYXRlICgpIHtcclxuICAgICAgY29uc3QgcGlja2VyID0gdGhpcy5waWNrZXJEYXRlID8gdGhpcy5waWNrZXJEYXRlLnNwbGl0KCctJykgOiBudWxsXHJcblxyXG4gICAgICBpZiAodGhpcy5sYXN0VmFsdWUpIHtcclxuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMubGFzdFZhbHVlLnNwbGl0KCctJylcclxuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KGFycmF5WzBdLCAxMClcclxuICAgICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludChhcnJheVsxXSwgMTApIC0gMVxyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICAgICAgdGhpcy5pbnB1dERheSA9IHBhcnNlSW50KGFycmF5WzJdLCAxMClcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAocGlja2VyICYmIHBhcnNlSW50KHBpY2tlclswXSwgMTApICE9PSB0aGlzLmlucHV0WWVhcikge1xyXG4gICAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQocGlja2VyWzBdLCAxMClcclxuICAgICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludChwaWNrZXJbMV0sIDEwKSAtIDFcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHRoaXMuaW5wdXRZZWFyIHx8IHRoaXMubm93LmdldEZ1bGxZZWFyKClcclxuICAgICAgICB0aGlzLmlucHV0TW9udGggPSB0aGlzLmlucHV0TW9udGggPT0gbnVsbCA/IHRoaXMuaW5wdXRNb250aCA6IHRoaXMubm93LmdldE1vbnRoKClcclxuICAgICAgICB0aGlzLmlucHV0RGF5ID0gdGhpcy5pbnB1dERheSB8fCB0aGlzLm5vdy5nZXREYXRlKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoKTogVk5vZGUge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2VuUGlja2VyKCd2LXBpY2tlci0tZGF0ZScpXHJcbiAgfVxyXG59KVxyXG4iXX0=