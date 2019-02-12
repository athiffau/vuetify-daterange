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
        transitions: {
            type: Boolean,
            default: true
        },
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
                console.log(`Replace date with ${this.lastValue}`);
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
                    transitions: this.transitions,
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
                    transitions: this.transitions,
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
                    hover: this.hovering,
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
                    transitions: this.transitions,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN6RCxPQUFPLGFBQXNDLE1BQU0sc0JBQXNCLENBQUE7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBbUJ0QyxnRkFBZ0Y7QUFDaEYsa0RBQWtEO0FBQ2xELFNBQVMsa0JBQWtCLENBQUUsVUFBa0IsRUFBRSxJQUErQjtJQUM5RSxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDekQsT0FBTyxHQUFHLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMs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LEVBQUUsQ0FBQTtnQkFDakYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7YUFDcEQ7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDekMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZEYXRlUGlja2VyVGl0bGUgZnJvbSAnLi9WRGF0ZVBpY2tlclRpdGxlJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJIZWFkZXIgZnJvbSAnLi9WRGF0ZVBpY2tlckhlYWRlcidcclxuaW1wb3J0IFZEYXRlUGlja2VyRGF0ZVRhYmxlIGZyb20gJy4vVkRhdGVQaWNrZXJEYXRlVGFibGUnXHJcbmltcG9ydCBWRGF0ZVBpY2tlck1vbnRoVGFibGUgZnJvbSAnLi9WRGF0ZVBpY2tlck1vbnRoVGFibGUnXHJcbmltcG9ydCBWRGF0ZVBpY2tlclllYXJzIGZyb20gJy4vVkRhdGVQaWNrZXJZZWFycydcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgUGlja2VyIGZyb20gJy4uLy4uL21peGlucy9waWNrZXInXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBwYWQsIGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlciB9IGZyb20gJy4vdXRpbCdcclxuaW1wb3J0IGlzRGF0ZUFsbG93ZWQsIHsgQWxsb3dlZERhdGVGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0RhdGVBbGxvd2VkJ1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuaW1wb3J0IHsgRGF0ZVBpY2tlckZvcm1hdHRlciB9IGZyb20gJy4vdXRpbC9jcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXInXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuZXhwb3J0IHR5cGUgRGF0ZUV2ZW50Q29sb3JWYWx1ZSA9IHN0cmluZyB8IHN0cmluZ1tdXHJcbmV4cG9ydCB0eXBlIERhdGVFdmVudHMgPSBzdHJpbmdbXSB8ICgoZGF0ZTogc3RyaW5nKSA9PiBib29sZWFuIHwgRGF0ZUV2ZW50Q29sb3JWYWx1ZSkgfCBSZWNvcmQ8c3RyaW5nLCBEYXRlRXZlbnRDb2xvclZhbHVlPlxyXG5leHBvcnQgdHlwZSBEYXRlRXZlbnRDb2xvcnMgPSBEYXRlRXZlbnRDb2xvclZhbHVlIHwgUmVjb3JkPHN0cmluZywgRGF0ZUV2ZW50Q29sb3JWYWx1ZT4gfCAoKGRhdGU6IHN0cmluZykgPT4gRGF0ZUV2ZW50Q29sb3JWYWx1ZSlcclxudHlwZSBEYXRlUGlja2VyVmFsdWUgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZFxyXG50eXBlIERhdGVQaWNrZXJUeXBlID0gJ2RhdGUnIHwgJ21vbnRoJ1xyXG50eXBlIERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciA9IChkYXRlOiBzdHJpbmdbXSkgPT4gc3RyaW5nXHJcbmludGVyZmFjZSBGb3JtYXR0ZXJzIHtcclxuICB5ZWFyOiBEYXRlUGlja2VyRm9ybWF0dGVyXHJcbiAgdGl0bGVEYXRlOiBEYXRlUGlja2VyRm9ybWF0dGVyIHwgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyXHJcbiAgdGl0bGVNb250aFllYXI6IERhdGVQaWNrZXJGb3JtYXR0ZXJcclxufVxyXG5cclxuLy8gQWRkcyBsZWFkaW5nIHplcm8gdG8gbW9udGgvZGF5IGlmIG5lY2Vzc2FyeSwgcmV0dXJucyAnWVlZWScgaWYgdHlwZSA9ICd5ZWFyJyxcclxuLy8gJ1lZWVktTU0nIGlmICdtb250aCcgYW5kICdZWVlZLU1NLUREJyBpZiAnZGF0ZSdcclxuZnVuY3Rpb24gc2FuaXRpemVEYXRlU3RyaW5nIChkYXRlU3RyaW5nOiBzdHJpbmcsIHR5cGU6ICdkYXRlJyB8ICdtb250aCcgfCAneWVhcicpOiBzdHJpbmcge1xyXG4gIGNvbnN0IFt5ZWFyLCBtb250aCA9IDEsIGRhdGUgPSAxXSA9IGRhdGVTdHJpbmcuc3BsaXQoJy0nKVxyXG4gIHJldHVybiBgJHt5ZWFyfS0ke3BhZChtb250aCl9LSR7cGFkKGRhdGUpfWAuc3Vic3RyKDAsIHsgZGF0ZTogMTAsIG1vbnRoOiA3LCB5ZWFyOiA0IH1bdHlwZV0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBQaWNrZXJcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsbG93ZWREYXRlczogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxBbGxvd2VkRGF0ZUZ1bmN0aW9uIHwgdW5kZWZpbmVkPixcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIGRheSBpbiBkYXRlIHBpY2tlciB0YWJsZVxyXG4gICAgZGF5Rm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPEFsbG93ZWREYXRlRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxyXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgICBldmVudHM6IHtcclxuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0XSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gbnVsbFxyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlRXZlbnRzPixcclxuICAgIGV2ZW50Q29sb3I6IHtcclxuICAgICAgdHlwZTogW0FycmF5LCBGdW5jdGlvbiwgT2JqZWN0LCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiAnd2FybmluZydcclxuICAgIH0gYXMgYW55IGFzIFByb3BWYWxpZGF0b3I8RGF0ZUV2ZW50Q29sb3JzPixcclxuICAgIGZpcnN0RGF5T2ZXZWVrOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH0sXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIHRoZSB0YWJsZURhdGUgaW4gdGhlIGRheS9tb250aCB0YWJsZSBoZWFkZXJcclxuICAgIGhlYWRlckRhdGVGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICBob3Zlckxpbms6IFN0cmluZyxcclxuICAgIGxvY2FsZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdlbi11cydcclxuICAgIH0sXHJcbiAgICBtYXg6IFN0cmluZyxcclxuICAgIG1pbjogU3RyaW5nLFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyBtb250aCBpbiB0aGUgbW9udGhzIHRhYmxlXHJcbiAgICBtb250aEZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIG11bHRpcGxlOiBCb29sZWFuLFxyXG4gICAgbmV4dEljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMubmV4dCdcclxuICAgIH0sXHJcbiAgICBwaWNrZXJEYXRlOiBTdHJpbmcsXHJcbiAgICBwcmV2SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5wcmV2J1xyXG4gICAgfSxcclxuICAgIHJhbmdlOiBCb29sZWFuLFxyXG4gICAgcmVhY3RpdmU6IEJvb2xlYW4sXHJcbiAgICByZWFkb25seTogQm9vbGVhbixcclxuICAgIHNjcm9sbGFibGU6IEJvb2xlYW4sXHJcbiAgICBzaG93Q3VycmVudDoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHNob3dXZWVrOiBCb29sZWFuLFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyBjdXJyZW50bHkgc2VsZWN0ZWQgZGF0ZSBpbiB0aGUgcGlja2VyIHRpdGxlXHJcbiAgICB0aXRsZURhdGVGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICB0cmFuc2l0aW9uczoge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdkYXRlJyxcclxuICAgICAgdmFsaWRhdG9yOiAodHlwZTogYW55KSA9PiBbJ2RhdGUnLCAnbW9udGgnXS5pbmNsdWRlcyh0eXBlKSAvLyBUT0RPOiB5ZWFyXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJUeXBlPixcclxuICAgIHZhbHVlOiBbQXJyYXksIFN0cmluZ10gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVmFsdWU+LFxyXG4gICAgd2Vla2RheUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHllYXIgaW4gdGFibGUgaGVhZGVyIGFuZCBwaWNrdXAgdGl0bGVcclxuICAgIHllYXJGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICB5ZWFySWNvbjogU3RyaW5nXHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhY3RpdmVQaWNrZXI6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpLFxyXG4gICAgICBpbnB1dERheTogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpbnB1dE1vbnRoOiBudWxsIGFzIG51bWJlciB8IG51bGwsXHJcbiAgICAgIGlucHV0WWVhcjogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpc1JldmVyc2luZzogZmFsc2UsXHJcbiAgICAgIGhvdmVyaW5nOiAnJyxcclxuICAgICAgbm93LFxyXG4gICAgICAvLyB0YWJsZURhdGUgaXMgYSBzdHJpbmcgaW4gJ1lZWVknIC8gJ1lZWVktTScgZm9ybWF0IChsZWFkaW5nIHplcm8gZm9yIG1vbnRoIGlzIG5vdCByZXF1aXJlZClcclxuICAgICAgdGFibGVEYXRlOiAoKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnBpY2tlckRhdGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGUgPSAodGhpcy5tdWx0aXBsZSA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKVsodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoIC0gMV0gOiB0aGlzLnZhbHVlKSB8fFxyXG4gICAgICAgICAgYCR7bm93LmdldEZ1bGxZZWFyKCl9LSR7bm93LmdldE1vbnRoKCkgKyAxfWBcclxuICAgICAgICByZXR1cm4gc2FuaXRpemVEYXRlU3RyaW5nKGRhdGUgYXMgc3RyaW5nLCB0aGlzLnR5cGUgPT09ICdkYXRlJyA/ICdtb250aCcgOiAneWVhcicpXHJcbiAgICAgIH0pKClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgbGFzdFZhbHVlICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSlbKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAtIDFdIDogKHRoaXMudmFsdWUgYXMgc3RyaW5nIHwgbnVsbClcclxuICAgIH0sXHJcbiAgICBzZWxlY3RlZE1vbnRocyAoKTogc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWQge1xyXG4gICAgICBpZiAoIXRoaXMudmFsdWUgfHwgIXRoaXMudmFsdWUubGVuZ3RoIHx8IHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkubWFwKHZhbCA9PiB2YWwuc3Vic3RyKDAsIDcpKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAodGhpcy52YWx1ZSBhcyBzdHJpbmcpLnN1YnN0cigwLCA3KVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3VycmVudCAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIGlmICh0aGlzLnNob3dDdXJyZW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHNhbml0aXplRGF0ZVN0cmluZyhgJHt0aGlzLm5vdy5nZXRGdWxsWWVhcigpfS0ke3RoaXMubm93LmdldE1vbnRoKCkgKyAxfS0ke3RoaXMubm93LmdldERhdGUoKX1gLCB0aGlzLnR5cGUpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnNob3dDdXJyZW50IHx8IG51bGxcclxuICAgIH0sXHJcbiAgICBpbnB1dERhdGUgKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdkYXRlJ1xyXG4gICAgICAgID8gYCR7dGhpcy5pbnB1dFllYXJ9LSR7cGFkKHRoaXMuaW5wdXRNb250aCEgKyAxKX0tJHtwYWQodGhpcy5pbnB1dERheSEpfWBcclxuICAgICAgICA6IGAke3RoaXMuaW5wdXRZZWFyfS0ke3BhZCh0aGlzLmlucHV0TW9udGghICsgMSl9YFxyXG4gICAgfSxcclxuICAgIHRhYmxlTW9udGggKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBOdW1iZXIoKHRoaXMucGlja2VyRGF0ZSB8fCB0aGlzLnRhYmxlRGF0ZSkuc3BsaXQoJy0nKVsxXSkgLSAxXHJcbiAgICB9LFxyXG4gICAgdGFibGVZZWFyICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMF0pXHJcbiAgICB9LFxyXG4gICAgbWluTW9udGggKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICByZXR1cm4gdGhpcy5taW4gPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5taW4sICdtb250aCcpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIG1heE1vbnRoICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAnbW9udGgnKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtaW5ZZWFyICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAneWVhcicpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIG1heFllYXIgKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICByZXR1cm4gdGhpcy5tYXggPyBzYW5pdGl6ZURhdGVTdHJpbmcodGhpcy5tYXgsICd5ZWFyJykgOiBudWxsXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0dGVycyAoKTogRm9ybWF0dGVycyB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgeWVhcjogdGhpcy55ZWFyRm9ybWF0IHx8IGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcih0aGlzLmxvY2FsZSwgeyB5ZWFyOiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LCB7IGxlbmd0aDogNCB9KSxcclxuICAgICAgICB0aXRsZURhdGU6IHRoaXMudGl0bGVEYXRlRm9ybWF0IHx8ICh0aGlzLm11bHRpcGxlID8gdGhpcy5kZWZhdWx0VGl0bGVNdWx0aXBsZURhdGVGb3JtYXR0ZXIgOiB0aGlzLmRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIpLFxyXG4gICAgICAgIHRpdGxlTW9udGhZZWFyOiB0aGlzLmRlZmF1bHRSYW5nZVRpdGxlRm9ybWF0dGVyXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkZWZhdWx0VGl0bGVNdWx0aXBsZURhdGVGb3JtYXR0ZXIgKCk6IERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciB7XHJcbiAgICAgIGlmICgodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoIDwgMikge1xyXG4gICAgICAgIHJldHVybiBkYXRlcyA9PiBkYXRlcy5sZW5ndGggPyB0aGlzLmRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIoZGF0ZXNbMF0pIDogJzAgc2VsZWN0ZWQnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBkYXRlcyA9PiBgJHtkYXRlcy5sZW5ndGh9IHNlbGVjdGVkYFxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRUaXRsZURhdGVGb3JtYXR0ZXIgKCk6IERhdGVQaWNrZXJGb3JtYXR0ZXIge1xyXG4gICAgICBjb25zdCB0aXRsZUZvcm1hdHMgPSB7XHJcbiAgICAgICAgeWVhcjogeyB5ZWFyOiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LFxyXG4gICAgICAgIG1vbnRoOiB7IG1vbnRoOiAnbG9uZycsIHRpbWVab25lOiAnVVRDJyB9LFxyXG4gICAgICAgIGRhdGU6IHsgd2Vla2RheTogJ3Nob3J0JywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB0aXRsZURhdGVGb3JtYXR0ZXIgPSBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHRpdGxlRm9ybWF0c1t0aGlzLnR5cGVdLCB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgbGVuZ3RoOiB7IGRhdGU6IDEwLCBtb250aDogNywgeWVhcjogNCB9W3RoaXMudHlwZV1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGNvbnN0IGxhbmRzY2FwZUZvcm1hdHRlciA9IChkYXRlOiBzdHJpbmcpID0+IHRpdGxlRGF0ZUZvcm1hdHRlcihkYXRlKVxyXG4gICAgICAgIC5yZXBsYWNlKC8oW15cXGRcXHNdKShbXFxkXSkvZywgKG1hdGNoLCBub25EaWdpdCwgZGlnaXQpID0+IGAke25vbkRpZ2l0fSAke2RpZ2l0fWApXHJcbiAgICAgICAgLnJlcGxhY2UoJywgJywgJyw8YnI+JylcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmxhbmRzY2FwZSA/IGxhbmRzY2FwZUZvcm1hdHRlciA6IHRpdGxlRGF0ZUZvcm1hdHRlclxyXG4gICAgfSxcclxuICAgIGRlZmF1bHRSYW5nZVRpdGxlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyRm9ybWF0dGVyIHtcclxuICAgICAgY29uc3QgdGl0bGVSYW5nZUZvcm1hdHRlciA9IGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlcih0aGlzLmxvY2FsZSwgeyBtb250aDogJ3Nob3J0JywgZGF5OiAnbnVtZXJpYycsIHRpbWVab25lOiAnVVRDJyB9LCB7XHJcbiAgICAgICAgc3RhcnQ6IDAsXHJcbiAgICAgICAgbGVuZ3RoOiA2XHJcbiAgICAgIH0pXHJcbiAgICAgIHJldHVybiB0aXRsZVJhbmdlRm9ybWF0dGVyXHJcbiAgICB9XHJcbiAgfSxcclxuICB3YXRjaDoge1xyXG4gICAgdGFibGVEYXRlICh2YWw6IHN0cmluZywgcHJldjogc3RyaW5nKSB7XHJcbiAgICAgIC8vIE1ha2UgYSBJU08gODYwMSBzdHJpbmdzIGZyb20gdmFsIGFuZCBwcmV2IGZvciBjb21wYXJpc2lvbiwgb3RoZXJ3aXNlIGl0IHdpbGwgaW5jb3JyZWN0bHlcclxuICAgICAgLy8gY29tcGFyZSBmb3IgZXhhbXBsZSAnMjAwMC05JyBhbmQgJzIwMDAtMTAnXHJcbiAgICAgIGNvbnN0IHNhbml0aXplVHlwZSA9IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/ICd5ZWFyJyA6ICdtb250aCdcclxuICAgICAgdGhpcy5pc1JldmVyc2luZyA9IHNhbml0aXplRGF0ZVN0cmluZyh2YWwsIHNhbml0aXplVHlwZSkgPCBzYW5pdGl6ZURhdGVTdHJpbmcocHJldiwgc2FuaXRpemVUeXBlKVxyXG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6cGlja2VyRGF0ZScsIHZhbClcclxuICAgIH0sXHJcbiAgICBwaWNrZXJEYXRlICh2YWw6IHN0cmluZyB8IG51bGwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gdmFsXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sYXN0VmFsdWUgJiYgdGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgUmVwbGFjZSBkYXRlIHdpdGggJHt0aGlzLmxhc3RWYWx1ZX1gKVxyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubGFzdFZhbHVlLCAnbW9udGgnKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubGFzdFZhbHVlICYmIHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubGFzdFZhbHVlLCAneWVhcicpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2YWx1ZSAobmV3VmFsdWU6IERhdGVQaWNrZXJWYWx1ZSwgb2xkVmFsdWU6IERhdGVQaWNrZXJWYWx1ZSkge1xyXG4gICAgICB0aGlzLmNoZWNrTXVsdGlwbGVQcm9wKClcclxuICAgICAgdGhpcy5zZXRJbnB1dERhdGUoKVxyXG5cclxuICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIHRoaXMudmFsdWUgJiYgIXRoaXMucGlja2VyRGF0ZSkge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuaW5wdXREYXRlLCB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnKVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXVsdGlwbGUgJiYgKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAmJiAhKG9sZFZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggJiYgIXRoaXMucGlja2VyRGF0ZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBSZXBsYWNpbmcgdGFibGVEYXRlIHdpdGggJHt0aGlzLmlucHV0RGF0ZX1gKVxyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuaW5wdXREYXRlLCB0aGlzLnR5cGUgPT09ICdtb250aCcgPyAneWVhcicgOiAnbW9udGgnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdHlwZSAodHlwZTogRGF0ZVBpY2tlclR5cGUpIHtcclxuICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPSB0eXBlLnRvVXBwZXJDYXNlKClcclxuXHJcbiAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gKHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkgOiBbdGhpcy52YWx1ZSBhcyBzdHJpbmddKVxyXG4gICAgICAgICAgLm1hcCgodmFsOiBzdHJpbmcpID0+IHNhbml0aXplRGF0ZVN0cmluZyh2YWwsIHR5cGUpKVxyXG4gICAgICAgICAgLmZpbHRlcih0aGlzLmlzRGF0ZUFsbG93ZWQpXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLm11bHRpcGxlID8gb3V0cHV0IDogb3V0cHV0WzBdKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaG92ZXJpbmcgKHZhbHVlOiBTdHJpbmcsIHByZXY6IHN0cmluZykge1xyXG4gICAgICB0aGlzLiRlbWl0KCdob3ZlckxpbmsnLCB2YWx1ZSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjcmVhdGVkICgpIHtcclxuICAgIHRoaXMuY2hlY2tNdWx0aXBsZVByb3AoKVxyXG5cclxuICAgIGlmICh0aGlzLnBpY2tlckRhdGUgIT09IHRoaXMudGFibGVEYXRlKSB7XHJcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpwaWNrZXJEYXRlJywgdGhpcy50YWJsZURhdGUpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNldElucHV0RGF0ZSgpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZW1pdElucHV0IChuZXdJbnB1dDogc3RyaW5nKSB7XHJcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRoaXMubXVsdGlwbGVcclxuICAgICAgICA/IChcclxuICAgICAgICAgICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5pbmRleE9mKG5ld0lucHV0KSA9PT0gLTFcclxuICAgICAgICAgICAgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkuY29uY2F0KFtuZXdJbnB1dF0pXHJcbiAgICAgICAgICAgIDogKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmZpbHRlcih4ID0+IHggIT09IG5ld0lucHV0KVxyXG4gICAgICAgIClcclxuICAgICAgICA6IG5ld0lucHV0XHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG91dHB1dClcclxuICAgICAgdGhpcy5tdWx0aXBsZSB8fCB0aGlzLiRlbWl0KCdjaGFuZ2UnLCBuZXdJbnB1dClcclxuICAgIH0sXHJcbiAgICBjaGVja011bHRpcGxlUHJvcCAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnZhbHVlID09IG51bGwpIHJldHVyblxyXG4gICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0aGlzLnZhbHVlLmNvbnN0cnVjdG9yLm5hbWVcclxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSB0aGlzLm11bHRpcGxlID8gJ0FycmF5JyA6ICdTdHJpbmcnXHJcbiAgICAgIGlmICh2YWx1ZVR5cGUgIT09IGV4cGVjdGVkKSB7XHJcbiAgICAgICAgY29uc29sZVdhcm4oYFZhbHVlIG11c3QgYmUgJHt0aGlzLm11bHRpcGxlID8gJ2FuJyA6ICdhJ30gJHtleHBlY3RlZH0sIGdvdCAke3ZhbHVlVHlwZX1gLCB0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXNEYXRlQWxsb3dlZCAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICByZXR1cm4gaXNEYXRlQWxsb3dlZCh2YWx1ZSwgdGhpcy5taW4sIHRoaXMubWF4LCB0aGlzLmFsbG93ZWREYXRlcylcclxuICAgIH0sXHJcbiAgICB5ZWFyQ2xpY2sgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgdGhpcy5pbnB1dFllYXIgPSB2YWx1ZVxyXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnbW9udGgnKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSBgJHt2YWx1ZX1gXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSBgJHt2YWx1ZX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YFxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gJ01PTlRIJ1xyXG4gICAgICBpZiAodGhpcy5yZWFjdGl2ZSAmJiAhdGhpcy5yZWFkb25seSAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLmlzRGF0ZUFsbG93ZWQodGhpcy5pbnB1dERhdGUpKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLmlucHV0RGF0ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIG1vbnRoQ2xpY2sgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzBdLCAxMClcclxuICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVsxXSwgMTApIC0gMVxyXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlXHJcbiAgICAgICAgdGhpcy5hY3RpdmVQaWNrZXIgPSAnREFURSdcclxuICAgICAgICBpZiAodGhpcy5yZWFjdGl2ZSAmJiAhdGhpcy5yZWFkb25seSAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLmlzRGF0ZUFsbG93ZWQodGhpcy5pbnB1dERhdGUpKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIHRoaXMuaW5wdXREYXRlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmVtaXRJbnB1dCh0aGlzLmlucHV0RGF0ZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGRhdGVDbGljayAodmFsdWU6IHN0cmluZykge1xyXG4gICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMF0sIDEwKVxyXG4gICAgICB0aGlzLmlucHV0TW9udGggPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzFdLCAxMCkgLSAxXHJcbiAgICAgIHRoaXMuaW5wdXREYXkgPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzJdLCAxMClcclxuICAgICAgdGhpcy5lbWl0SW5wdXQodGhpcy5pbnB1dERhdGUpXHJcbiAgICB9LFxyXG4gICAgZ2VuUGlja2VyVGl0bGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlclRpdGxlLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGRhdGU6IHRoaXMudmFsdWUgPyAodGhpcy5mb3JtYXR0ZXJzLnRpdGxlRGF0ZSBhcyAodmFsdWU6IGFueSkgPT4gc3RyaW5nKSh0aGlzLnZhbHVlKSA6ICcnLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHNlbGVjdGluZ1llYXI6IHRoaXMuYWN0aXZlUGlja2VyID09PSAnWUVBUicsXHJcbiAgICAgICAgICB0cmFuc2l0aW9uczogdGhpcy50cmFuc2l0aW9ucyxcclxuICAgICAgICAgIHllYXI6IHRoaXMuZm9ybWF0dGVycy55ZWFyKHRoaXMudmFsdWUgPyBgJHt0aGlzLmlucHV0WWVhcn1gIDogdGhpcy50YWJsZURhdGUpLFxyXG4gICAgICAgICAgeWVhckljb246IHRoaXMueWVhckljb24sXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tdWx0aXBsZSA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKVswXSA6IHRoaXMudmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsb3Q6ICd0aXRsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICd1cGRhdGU6c2VsZWN0aW5nWWVhcic6ICh2YWx1ZTogYm9vbGVhbikgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSB2YWx1ZSA/ICdZRUFSJyA6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblRhYmxlSGVhZGVyICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJIZWFkZXIsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmV4dEljb246IHRoaXMubmV4dEljb24sXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmhlYWRlckRhdGVGb3JtYXQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLm1pbk1vbnRoIDogdGhpcy5taW5ZZWFyLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gdGhpcy5tYXhNb250aCA6IHRoaXMubWF4WWVhcixcclxuICAgICAgICAgIHByZXZJY29uOiB0aGlzLnByZXZJY29uLFxyXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXHJcbiAgICAgICAgICB0cmFuc2l0aW9uczogdGhpcy50cmFuc2l0aW9ucyxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCA6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIHRvZ2dsZTogKCkgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSAodGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/ICdNT05USCcgOiAnWUVBUicpLFxyXG4gICAgICAgICAgaW5wdXQ6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbkRhdGVUYWJsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyRGF0ZVRhYmxlLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFsbG93ZWREYXRlczogdGhpcy5hbGxvd2VkRGF0ZXMsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZXZlbnRzOiB0aGlzLmV2ZW50cyxcclxuICAgICAgICAgIGV2ZW50Q29sb3I6IHRoaXMuZXZlbnRDb2xvcixcclxuICAgICAgICAgIGZpcnN0RGF5T2ZXZWVrOiB0aGlzLmZpcnN0RGF5T2ZXZWVrLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmRheUZvcm1hdCxcclxuICAgICAgICAgIGhvdmVyOiB0aGlzLmhvdmVyaW5nLFxyXG4gICAgICAgICAgaG92ZXJMaW5rOiB0aGlzLmhvdmVyTGluayxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5taW4sXHJcbiAgICAgICAgICBtYXg6IHRoaXMubWF4LFxyXG4gICAgICAgICAgcmFuZ2U6IHRoaXMucmFuZ2UsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHNjcm9sbGFibGU6IHRoaXMuc2Nyb2xsYWJsZSxcclxuICAgICAgICAgIHNob3dXZWVrOiB0aGlzLnNob3dXZWVrLFxyXG4gICAgICAgICAgdGFibGVEYXRlOiBgJHtwYWQodGhpcy50YWJsZVllYXIsIDQpfS0ke3BhZCh0aGlzLnRhYmxlTW9udGggKyAxKX1gLFxyXG4gICAgICAgICAgdHJhbnNpdGlvbnM6IHRoaXMudHJhbnNpdGlvbnMsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgICAgIHdlZWtkYXlGb3JtYXQ6IHRoaXMud2Vla2RheUZvcm1hdFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAndGFibGUnLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy5kYXRlQ2xpY2ssXHJcbiAgICAgICAgICB0YWJsZURhdGU6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlLFxyXG4gICAgICAgICAgaG92ZXI6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLmhvdmVyaW5nID0gdmFsdWUsXHJcbiAgICAgICAgICAnY2xpY2s6ZGF0ZSc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdjbGljazpkYXRlJywgdmFsdWUpLFxyXG4gICAgICAgICAgJ2RibGNsaWNrOmRhdGUnOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy4kZW1pdCgnZGJsY2xpY2s6ZGF0ZScsIHZhbHVlKSxcclxuICAgICAgICAgICdob3ZlckxpbmsnOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy4kZW1pdCgnaG92ZXJMaW5rJywgdmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbk1vbnRoVGFibGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWRGF0ZVBpY2tlck1vbnRoVGFibGUsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgYWxsb3dlZERhdGVzOiB0aGlzLnR5cGUgPT09ICdtb250aCcgPyB0aGlzLmFsbG93ZWREYXRlcyA6IG51bGwsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmN1cnJlbnQsICdtb250aCcpIDogbnVsbCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZXZlbnRzOiB0aGlzLnR5cGUgPT09ICdtb250aCcgPyB0aGlzLmV2ZW50cyA6IG51bGwsXHJcbiAgICAgICAgICBldmVudENvbG9yOiB0aGlzLnR5cGUgPT09ICdtb250aCcgPyB0aGlzLmV2ZW50Q29sb3IgOiBudWxsLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLm1vbnRoRm9ybWF0LFxyXG4gICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXHJcbiAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxyXG4gICAgICAgICAgbWluOiB0aGlzLm1pbk1vbnRoLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLm1heE1vbnRoLFxyXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHkgJiYgdGhpcy50eXBlID09PSAnbW9udGgnLFxyXG4gICAgICAgICAgc2Nyb2xsYWJsZTogdGhpcy5zY3JvbGxhYmxlLFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMuc2VsZWN0ZWRNb250aHMsXHJcbiAgICAgICAgICB0YWJsZURhdGU6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAndGFibGUnLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy5tb250aENsaWNrLFxyXG4gICAgICAgICAgdGFibGVEYXRlOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcclxuICAgICAgICAgICdjbGljazptb250aCc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdjbGljazptb250aCcsIHZhbHVlKSxcclxuICAgICAgICAgICdkYmxjbGljazptb250aCc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdkYmxjbGljazptb250aCcsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5ZZWFycyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyWWVhcnMsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMueWVhckZvcm1hdCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluWWVhcixcclxuICAgICAgICAgIG1heDogdGhpcy5tYXhZZWFyLFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMudGFibGVZZWFyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgaW5wdXQ6IHRoaXMueWVhckNsaWNrXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblBpY2tlckJvZHkgKCkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuYWN0aXZlUGlja2VyID09PSAnWUVBUicgPyBbXHJcbiAgICAgICAgdGhpcy5nZW5ZZWFycygpXHJcbiAgICAgIF0gOiBbXHJcbiAgICAgICAgdGhpcy5nZW5UYWJsZUhlYWRlcigpLFxyXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLmdlbkRhdGVUYWJsZSgpIDogdGhpcy5nZW5Nb250aFRhYmxlKClcclxuICAgICAgXVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBrZXk6IHRoaXMuYWN0aXZlUGlja2VyXHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIHNldElucHV0RGF0ZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmxhc3RWYWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gdGhpcy5sYXN0VmFsdWUuc3BsaXQoJy0nKVxyXG4gICAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQoYXJyYXlbMF0sIDEwKVxyXG4gICAgICAgIHRoaXMuaW5wdXRNb250aCA9IHBhcnNlSW50KGFycmF5WzFdLCAxMCkgLSAxXHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgICB0aGlzLmlucHV0RGF5ID0gcGFyc2VJbnQoYXJyYXlbMl0sIDEwKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHRoaXMuaW5wdXRZZWFyIHx8IHRoaXMubm93LmdldEZ1bGxZZWFyKClcclxuICAgICAgICB0aGlzLmlucHV0TW9udGggPSB0aGlzLmlucHV0TW9udGggPT0gbnVsbCA/IHRoaXMuaW5wdXRNb250aCA6IHRoaXMubm93LmdldE1vbnRoKClcclxuICAgICAgICB0aGlzLmlucHV0RGF5ID0gdGhpcy5pbnB1dERheSB8fCB0aGlzLm5vdy5nZXREYXRlKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoKTogVk5vZGUge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2VuUGlja2VyKCd2LXBpY2tlci0tZGF0ZScpXHJcbiAgfVxyXG59KVxyXG4iXX0=