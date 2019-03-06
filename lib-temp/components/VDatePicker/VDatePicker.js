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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0ZVBpY2tlci9WRGF0ZVBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxhQUFhO0FBQ2IsT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGlCQUFpQixNQUFNLHFCQUFxQixDQUFBO0FBQ25ELE9BQU8sb0JBQW9CLE1BQU0sd0JBQXdCLENBQUE7QUFDekQsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQTtBQUMzRCxPQUFPLGdCQUFnQixNQUFNLG9CQUFvQixDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLE1BQU0sTUFBTSxxQkFBcUIsQ0FBQTtBQUV4QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUN6RCxPQUFPLGFBQXNDLE1BQU0sc0JBQXNCLENBQUE7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBbUJ0QyxnRkFBZ0Y7QUFDaEYsa0RBQWtEO0FBQ2xELFNBQVMsa0JBQWtCLENBQUUsVUFBa0IsRUFBRSxJQUErQjtJQUM5RSxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDekQsT0FBTyxHQUFHLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUM5RixDQUFDO0FBRUQsZUFBZSxNQUFNLENBQ25CLE1BQU07QUFDUixvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsZUFBZTtJQUVyQixLQUFLLEVBQUU7UUFDTCxlQUFlLEVBQUU7WUFDZixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxZQUFZLEVBQUUsUUFBMEQ7UUFDeEUsbURBQW1EO1FBQ25ELFNBQVMsRUFBRSxRQUEwRDtRQUNyRSxRQUFRLEVBQUUsT0FBTztRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztZQUMvQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtTQUNnQjtRQUNyQyxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdkMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFNBQVM7U0FDZ0I7UUFDMUMsY0FBYyxFQUFFO1lBQ2QsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0Qsa0VBQWtFO1FBQ2xFLGdCQUFnQixFQUFFLFFBQTBEO1FBQzVFLFlBQVksRUFBRTtZQUNaLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELFNBQVMsRUFBRSxNQUFNO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLE9BQU87U0FDakI7UUFDRCxHQUFHLEVBQUUsTUFBTTtRQUNYLEdBQUcsRUFBRSxNQUFNO1FBQ1gsZ0RBQWdEO1FBQ2hELFdBQVcsRUFBRSxRQUEwRDtRQUN2RSxRQUFRLEVBQUUsT0FBTztRQUNqQixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxxQkFBcUI7U0FDL0I7UUFDRCxVQUFVLEVBQUUsTUFBTTtRQUNsQixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxxQkFBcUI7U0FDL0I7UUFDRCxLQUFLLEVBQUUsT0FBTztRQUNkLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDdkIsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGtFQUFrRTtRQUNsRSxlQUFlLEVBQUUsUUFBd0Y7UUFDekcsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsTUFBTTtZQUNmLFNBQVMsRUFBRSxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWE7U0FDakM7UUFDekMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBbUM7UUFDeEQsYUFBYSxFQUFFLFFBQTBEO1FBQ3pFLGdFQUFnRTtRQUNoRSxVQUFVLEVBQUUsUUFBMEQ7UUFDdEUsUUFBUSxFQUFFLE1BQU07S0FDakI7SUFFRCxJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtRQUN0QixPQUFPO1lBQ0wsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JDLFFBQVEsRUFBRSxJQUFxQjtZQUMvQixVQUFVLEVBQUUsSUFBcUI7WUFDakMsU0FBUyxFQUFFLElBQXFCO1lBQ2hDLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxFQUFFO1lBQ1osR0FBRztZQUNILDZGQUE2RjtZQUM3RixTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2YsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNuQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7aUJBQ3ZCO2dCQUVELE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLEtBQWtCLENBQUUsSUFBSSxDQUFDLEtBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUN2RyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUE7Z0JBQzlDLE9BQU8sa0JBQWtCLENBQUMsSUFBYyxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3BGLENBQUMsQ0FBQyxFQUFFO1NBQ0wsQ0FBQTtJQUNILENBQUM7SUFFRCxRQUFRLEVBQUU7UUFDUixTQUFTO1lBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxJQUFJLENBQUMsS0FBa0IsQ0FBRSxJQUFJLENBQUMsS0FBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxLQUF1QixDQUFBO1FBQ3RILENBQUM7UUFDRCxjQUFjO1lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDOUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBO2FBQ2xCO2lCQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDeEIsT0FBUSxJQUFJLENBQUMsS0FBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQzdEO2lCQUFNO2dCQUNMLE9BQVEsSUFBSSxDQUFDLEtBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUMzQztRQUNILENBQUM7UUFDRCxPQUFPO1lBQ0wsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDN0IsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNuSDtZQUVELE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUE7UUFDakMsQ0FBQztRQUNELFNBQVM7WUFDUCxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTtnQkFDekIsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVMsQ0FBQyxFQUFFO2dCQUN6RSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDdEQsQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN0RSxDQUFDO1FBQ0QsU0FBUztZQUNQLE9BQU8sTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbEUsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUNoRSxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1FBQ2hFLENBQUM7UUFDRCxPQUFPO1lBQ0wsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDL0QsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUMvRCxDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUN0SCxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDO2dCQUM1SCxjQUFjLEVBQUUsSUFBSSxDQUFDLDBCQUEwQjthQUNoRCxDQUFBO1FBQ0gsQ0FBQztRQUNELGlDQUFpQztZQUMvQixJQUFLLElBQUksQ0FBQyxLQUFrQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZDLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQTthQUN2RjtZQUVELE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLFdBQVcsQ0FBQTtRQUM1QyxDQUFDO1FBQ0QseUJBQXlCO1lBQ3ZCLE1BQU0sWUFBWSxHQUFHO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7Z0JBQzFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtnQkFDekMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTthQUM1RSxDQUFBO1lBRUQsTUFBTSxrQkFBa0IsR0FBRywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzNGLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNuRCxDQUFDLENBQUE7WUFFRixNQUFNLGtCQUFrQixHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7aUJBQ2xFLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLEVBQUUsQ0FBQztpQkFDL0UsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUV6QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQTtRQUNqRSxDQUFDO1FBQ0QsMEJBQTBCO1lBQ3hCLE1BQU0sbUJBQW1CLEdBQUcsMkJBQTJCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hILEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxDQUFDO2FBQ1YsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxtQkFBbUIsQ0FBQTtRQUM1QixDQUFDO0tBQ0Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxZQUFZLENBQUUsR0FBVztZQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUMvQixDQUFDO1FBQ0QsU0FBUyxDQUFFLEdBQVcsRUFBRSxJQUFZO1lBQ2xDLDJGQUEyRjtZQUMzRiw2Q0FBNkM7WUFDN0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1lBQzdELElBQUksQ0FBQyxXQUFXLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxHQUFHLGtCQUFrQixDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQTtZQUNqRyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ3RDLENBQUM7UUFDRCxVQUFVLENBQUUsR0FBa0I7WUFDNUIsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUE7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTthQUNwQjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTthQUM3RDtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQTthQUM1RDtRQUNILENBQUM7UUFDRCxLQUFLLENBQUUsUUFBeUIsRUFBRSxRQUF5QjtZQUN6RCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN4QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7WUFFbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUM5RjtpQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUssSUFBSSxDQUFDLEtBQWtCLENBQUMsTUFBTSxJQUFJLENBQUUsUUFBcUIsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNqSCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtnQkFDekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQzlGO1FBQ0gsQ0FBQztRQUNELElBQUksQ0FBRSxJQUFvQjtZQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUV0QyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ25DLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsSUFBSSxDQUFDLEtBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQWUsQ0FBQyxDQUFDO3FCQUMvRSxHQUFHLENBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztxQkFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUN4RDtRQUNILENBQUM7UUFDRCxRQUFRLENBQUUsS0FBYSxFQUFFLElBQVk7WUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDaEMsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBRXhCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxPQUFPLEVBQUU7UUFDUCxTQUFTLENBQUUsUUFBZ0I7WUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVE7Z0JBQzFCLENBQUMsQ0FBQyxDQUNDLElBQUksQ0FBQyxLQUFrQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQy9DLENBQUMsQ0FBRSxJQUFJLENBQUMsS0FBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDN0MsQ0FBQyxDQUFFLElBQUksQ0FBQyxLQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FDekQ7Z0JBQ0QsQ0FBQyxDQUFDLFFBQVEsQ0FBQTtZQUVaLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQzNCLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDakQsQ0FBQztRQUNELGlCQUFpQjtZQUNmLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJO2dCQUFFLE9BQU07WUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO1lBQzdDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBO1lBQ25ELElBQUksU0FBUyxLQUFLLFFBQVEsRUFBRTtnQkFDMUIsV0FBVyxDQUFDLGlCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxRQUFRLFNBQVMsU0FBUyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7YUFDL0Y7UUFDSCxDQUFDO1FBQ0QsYUFBYSxDQUFFLEtBQWE7WUFDMUIsT0FBTyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDcEUsQ0FBQztRQUNELFNBQVMsQ0FBRSxLQUFhO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFBO1lBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQTthQUM1QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUE7YUFDeEQ7WUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQTtZQUMzQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDM0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQ3BDO1FBQ0gsQ0FBQztRQUNELFVBQVUsQ0FBRSxLQUFhO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDdkQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFBO2dCQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDM0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2lCQUNwQzthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO2FBQy9CO1FBQ0gsQ0FBQztRQUNELFNBQVMsQ0FBRSxLQUFhO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDdkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNoQyxDQUFDO1FBQ0QsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDM0MsS0FBSyxFQUFFO29CQUNMLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtvQkFDckMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBb0MsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3pGLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksS0FBSyxNQUFNO29CQUMzQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQzdFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxLQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSztpQkFDaEU7Z0JBQ0QsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsRUFBRSxFQUFFO29CQUNGLHNCQUFzQixFQUFFLENBQUMsS0FBYyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtpQkFDekc7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDNUMsS0FBSyxFQUFFO29CQUNMLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtvQkFDckMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsZ0JBQWdCO29CQUM3QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNuQixHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO29CQUNoRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPO29CQUNoRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7aUJBQzVIO2dCQUNELEVBQUUsRUFBRTtvQkFDRixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDbkYsS0FBSyxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUs7aUJBQ2pEO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFlBQVk7WUFDVixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQW9CLEVBQUU7Z0JBQy9DLEtBQUssRUFBRTtvQkFDTCxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQy9CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNyQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtvQkFDM0IsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO29CQUNuQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3RCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDekIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7b0JBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3ZCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtvQkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDbEUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7aUJBQ2xDO2dCQUNELEdBQUcsRUFBRSxPQUFPO2dCQUNaLEVBQUUsRUFBRTtvQkFDRixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVM7b0JBQ3JCLFNBQVMsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLO29CQUNwRCxLQUFLLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSztvQkFDL0MsWUFBWSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUM7b0JBQ2hFLGVBQWUsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDO29CQUN0RSxXQUFXLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQztpQkFDL0Q7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsYUFBYTtZQUNYLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRTtnQkFDaEQsS0FBSyxFQUFFO29CQUNMLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDOUQsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDeEUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJO29CQUNsRCxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUk7b0JBQzFELE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVztvQkFDeEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDbEIsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUNsQixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU87b0JBQ2hELFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtvQkFDM0IsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjO29CQUMxQixPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDaEUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7aUJBQ3ZDO2dCQUNELEdBQUcsRUFBRSxPQUFPO2dCQUNaLEVBQUUsRUFBRTtvQkFDRixLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVU7b0JBQ3RCLFNBQVMsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLO29CQUNwRCxhQUFhLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQztvQkFDbEUsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDO2lCQUN6RTthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxRQUFRO1lBQ04sT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFO2dCQUMzQyxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVU7b0JBQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtvQkFDbkIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNqQixHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUztpQkFDdEI7Z0JBQ0QsRUFBRSxFQUFFO29CQUNGLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUztpQkFDdEI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsYUFBYTtZQUNYLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFFBQVEsRUFBRTthQUNoQixDQUFDLENBQUMsQ0FBQztnQkFDRixJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUNyQixJQUFJLENBQUMsWUFBWSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQzFFLENBQUE7WUFFRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDdkIsRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUNkLENBQUM7UUFDRCxZQUFZO1lBQ1YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUVsRSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUN2QyxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQ3ZDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzVDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtpQkFDdkM7YUFDRjtpQkFBTSxJQUFJLE1BQU0sSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQy9ELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtnQkFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUM5QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtnQkFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtnQkFDakYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7YUFDcEQ7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDekMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZEYXRlUGlja2VyVGl0bGUgZnJvbSAnLi9WRGF0ZVBpY2tlclRpdGxlJ1xyXG5pbXBvcnQgVkRhdGVQaWNrZXJIZWFkZXIgZnJvbSAnLi9WRGF0ZVBpY2tlckhlYWRlcidcclxuaW1wb3J0IFZEYXRlUGlja2VyRGF0ZVRhYmxlIGZyb20gJy4vVkRhdGVQaWNrZXJEYXRlVGFibGUnXHJcbmltcG9ydCBWRGF0ZVBpY2tlck1vbnRoVGFibGUgZnJvbSAnLi9WRGF0ZVBpY2tlck1vbnRoVGFibGUnXHJcbmltcG9ydCBWRGF0ZVBpY2tlclllYXJzIGZyb20gJy4vVkRhdGVQaWNrZXJZZWFycydcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgUGlja2VyIGZyb20gJy4uLy4uL21peGlucy9waWNrZXInXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBwYWQsIGNyZWF0ZU5hdGl2ZUxvY2FsZUZvcm1hdHRlciB9IGZyb20gJy4vdXRpbCdcclxuaW1wb3J0IGlzRGF0ZUFsbG93ZWQsIHsgQWxsb3dlZERhdGVGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0RhdGVBbGxvd2VkJ1xyXG5pbXBvcnQgeyBjb25zb2xlV2FybiB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuaW1wb3J0IHsgRGF0ZVBpY2tlckZvcm1hdHRlciB9IGZyb20gJy4vdXRpbC9jcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXInXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuZXhwb3J0IHR5cGUgRGF0ZUV2ZW50Q29sb3JWYWx1ZSA9IHN0cmluZyB8IHN0cmluZ1tdXHJcbmV4cG9ydCB0eXBlIERhdGVFdmVudHMgPSBzdHJpbmdbXSB8ICgoZGF0ZTogc3RyaW5nKSA9PiBib29sZWFuIHwgRGF0ZUV2ZW50Q29sb3JWYWx1ZSkgfCBSZWNvcmQ8c3RyaW5nLCBEYXRlRXZlbnRDb2xvclZhbHVlPlxyXG5leHBvcnQgdHlwZSBEYXRlRXZlbnRDb2xvcnMgPSBEYXRlRXZlbnRDb2xvclZhbHVlIHwgUmVjb3JkPHN0cmluZywgRGF0ZUV2ZW50Q29sb3JWYWx1ZT4gfCAoKGRhdGU6IHN0cmluZykgPT4gRGF0ZUV2ZW50Q29sb3JWYWx1ZSlcclxudHlwZSBEYXRlUGlja2VyVmFsdWUgPSBzdHJpbmcgfCBzdHJpbmdbXSB8IHVuZGVmaW5lZFxyXG50eXBlIERhdGVQaWNrZXJUeXBlID0gJ2RhdGUnIHwgJ21vbnRoJ1xyXG50eXBlIERhdGVQaWNrZXJNdWx0aXBsZUZvcm1hdHRlciA9IChkYXRlOiBzdHJpbmdbXSkgPT4gc3RyaW5nXHJcbmludGVyZmFjZSBGb3JtYXR0ZXJzIHtcclxuICB5ZWFyOiBEYXRlUGlja2VyRm9ybWF0dGVyXHJcbiAgdGl0bGVEYXRlOiBEYXRlUGlja2VyRm9ybWF0dGVyIHwgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyXHJcbiAgdGl0bGVNb250aFllYXI6IERhdGVQaWNrZXJGb3JtYXR0ZXJcclxufVxyXG5cclxuLy8gQWRkcyBsZWFkaW5nIHplcm8gdG8gbW9udGgvZGF5IGlmIG5lY2Vzc2FyeSwgcmV0dXJucyAnWVlZWScgaWYgdHlwZSA9ICd5ZWFyJyxcclxuLy8gJ1lZWVktTU0nIGlmICdtb250aCcgYW5kICdZWVlZLU1NLUREJyBpZiAnZGF0ZSdcclxuZnVuY3Rpb24gc2FuaXRpemVEYXRlU3RyaW5nIChkYXRlU3RyaW5nOiBzdHJpbmcsIHR5cGU6ICdkYXRlJyB8ICdtb250aCcgfCAneWVhcicpOiBzdHJpbmcge1xyXG4gIGNvbnN0IFt5ZWFyLCBtb250aCA9IDEsIGRhdGUgPSAxXSA9IGRhdGVTdHJpbmcuc3BsaXQoJy0nKVxyXG4gIHJldHVybiBgJHt5ZWFyfS0ke3BhZChtb250aCl9LSR7cGFkKGRhdGUpfWAuc3Vic3RyKDAsIHsgZGF0ZTogMTAsIG1vbnRoOiA3LCB5ZWFyOiA0IH1bdHlwZV0pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBQaWNrZXJcclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFsbG93RGF0ZUNoYW5nZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgYWxsb3dlZERhdGVzOiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPEFsbG93ZWREYXRlRnVuY3Rpb24gfCB1bmRlZmluZWQ+LFxyXG4gICAgLy8gRnVuY3Rpb24gZm9ybWF0dGluZyB0aGUgZGF5IGluIGRhdGUgcGlja2VyIHRhYmxlXHJcbiAgICBkYXlGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8QWxsb3dlZERhdGVGdW5jdGlvbiB8IHVuZGVmaW5lZD4sXHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGV2ZW50czoge1xyXG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3RdLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPERhdGVFdmVudHM+LFxyXG4gICAgZXZlbnRDb2xvcjoge1xyXG4gICAgICB0eXBlOiBbQXJyYXksIEZ1bmN0aW9uLCBPYmplY3QsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+ICd3YXJuaW5nJ1xyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlRXZlbnRDb2xvcnM+LFxyXG4gICAgZmlyc3REYXlPZldlZWs6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIC8vIEZ1bmN0aW9uIGZvcm1hdHRpbmcgdGhlIHRhYmxlRGF0ZSBpbiB0aGUgZGF5L21vbnRoIHRhYmxlIGhlYWRlclxyXG4gICAgaGVhZGVyRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIGhpZGVEaXNhYmxlZDoge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfSxcclxuICAgIGhvdmVyTGluazogU3RyaW5nLFxyXG4gICAgbG9jYWxlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2VuLXVzJ1xyXG4gICAgfSxcclxuICAgIG1heDogU3RyaW5nLFxyXG4gICAgbWluOiBTdHJpbmcsXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIG1vbnRoIGluIHRoZSBtb250aHMgdGFibGVcclxuICAgIG1vbnRoRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXHJcbiAgICBuZXh0SWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5uZXh0J1xyXG4gICAgfSxcclxuICAgIHBpY2tlckRhdGU6IFN0cmluZyxcclxuICAgIHByZXZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLnByZXYnXHJcbiAgICB9LFxyXG4gICAgcmFuZ2U6IEJvb2xlYW4sXHJcbiAgICByZWFjdGl2ZTogQm9vbGVhbixcclxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxyXG4gICAgc2Nyb2xsYWJsZTogQm9vbGVhbixcclxuICAgIHNob3dDdXJyZW50OiB7XHJcbiAgICAgIHR5cGU6IFtCb29sZWFuLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgc2hvd1dlZWs6IEJvb2xlYW4sXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIGN1cnJlbnRseSBzZWxlY3RlZCBkYXRlIGluIHRoZSBwaWNrZXIgdGl0bGVcclxuICAgIHRpdGxlRGF0ZUZvcm1hdDogRnVuY3Rpb24gYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyRm9ybWF0dGVyIHwgRGF0ZVBpY2tlck11bHRpcGxlRm9ybWF0dGVyIHwgdW5kZWZpbmVkPixcclxuICAgIHR5cGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnZGF0ZScsXHJcbiAgICAgIHZhbGlkYXRvcjogKHR5cGU6IGFueSkgPT4gWydkYXRlJywgJ21vbnRoJ10uaW5jbHVkZXModHlwZSkgLy8gVE9ETzogeWVhclxyXG4gICAgfSBhcyBhbnkgYXMgUHJvcFZhbGlkYXRvcjxEYXRlUGlja2VyVHlwZT4sXHJcbiAgICB2YWx1ZTogW0FycmF5LCBTdHJpbmddIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlclZhbHVlPixcclxuICAgIHdlZWtkYXlGb3JtYXQ6IEZ1bmN0aW9uIGFzIFByb3BWYWxpZGF0b3I8RGF0ZVBpY2tlckZvcm1hdHRlciB8IHVuZGVmaW5lZD4sXHJcbiAgICAvLyBGdW5jdGlvbiBmb3JtYXR0aW5nIHRoZSB5ZWFyIGluIHRhYmxlIGhlYWRlciBhbmQgcGlja3VwIHRpdGxlXHJcbiAgICB5ZWFyRm9ybWF0OiBGdW5jdGlvbiBhcyBQcm9wVmFsaWRhdG9yPERhdGVQaWNrZXJGb3JtYXR0ZXIgfCB1bmRlZmluZWQ+LFxyXG4gICAgeWVhckljb246IFN0cmluZ1xyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWN0aXZlUGlja2VyOiB0aGlzLnR5cGUudG9VcHBlckNhc2UoKSxcclxuICAgICAgaW5wdXREYXk6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcclxuICAgICAgaW5wdXRNb250aDogbnVsbCBhcyBudW1iZXIgfCBudWxsLFxyXG4gICAgICBpbnB1dFllYXI6IG51bGwgYXMgbnVtYmVyIHwgbnVsbCxcclxuICAgICAgaXNSZXZlcnNpbmc6IGZhbHNlLFxyXG4gICAgICBob3ZlcmluZzogJycsXHJcbiAgICAgIG5vdyxcclxuICAgICAgLy8gdGFibGVEYXRlIGlzIGEgc3RyaW5nIGluICdZWVlZJyAvICdZWVlZLU0nIGZvcm1hdCAobGVhZGluZyB6ZXJvIGZvciBtb250aCBpcyBub3QgcmVxdWlyZWQpXHJcbiAgICAgIHRhYmxlRGF0ZTogKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5waWNrZXJEYXRlKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5waWNrZXJEYXRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gKHRoaXMubXVsdGlwbGUgPyAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSlbKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCAtIDFdIDogdGhpcy52YWx1ZSkgfHxcclxuICAgICAgICAgIGAke25vdy5nZXRGdWxsWWVhcigpfS0ke25vdy5nZXRNb250aCgpICsgMX1gXHJcbiAgICAgICAgcmV0dXJuIHNhbml0aXplRGF0ZVN0cmluZyhkYXRlIGFzIHN0cmluZywgdGhpcy50eXBlID09PSAnZGF0ZScgPyAnbW9udGgnIDogJ3llYXInKVxyXG4gICAgICB9KSgpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGxhc3RWYWx1ZSAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pWyh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggLSAxXSA6ICh0aGlzLnZhbHVlIGFzIHN0cmluZyB8IG51bGwpXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0ZWRNb250aHMgKCk6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgaWYgKCF0aGlzLnZhbHVlIHx8ICF0aGlzLnZhbHVlLmxlbmd0aCB8fCB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLm1hcCh2YWwgPT4gdmFsLnN1YnN0cigwLCA3KSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgYXMgc3RyaW5nKS5zdWJzdHIoMCwgNylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGN1cnJlbnQgKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICBpZiAodGhpcy5zaG93Q3VycmVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiBzYW5pdGl6ZURhdGVTdHJpbmcoYCR7dGhpcy5ub3cuZ2V0RnVsbFllYXIoKX0tJHt0aGlzLm5vdy5nZXRNb250aCgpICsgMX0tJHt0aGlzLm5vdy5nZXREYXRlKCl9YCwgdGhpcy50eXBlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zaG93Q3VycmVudCB8fCBudWxsXHJcbiAgICB9LFxyXG4gICAgaW5wdXREYXRlICgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy50eXBlID09PSAnZGF0ZSdcclxuICAgICAgICA/IGAke3RoaXMuaW5wdXRZZWFyfS0ke3BhZCh0aGlzLmlucHV0TW9udGghICsgMSl9LSR7cGFkKHRoaXMuaW5wdXREYXkhKX1gXHJcbiAgICAgICAgOiBgJHt0aGlzLmlucHV0WWVhcn0tJHtwYWQodGhpcy5pbnB1dE1vbnRoISArIDEpfWBcclxuICAgIH0sXHJcbiAgICB0YWJsZU1vbnRoICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKCh0aGlzLnBpY2tlckRhdGUgfHwgdGhpcy50YWJsZURhdGUpLnNwbGl0KCctJylbMV0pIC0gMVxyXG4gICAgfSxcclxuICAgIHRhYmxlWWVhciAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE51bWJlcigodGhpcy5waWNrZXJEYXRlIHx8IHRoaXMudGFibGVEYXRlKS5zcGxpdCgnLScpWzBdKVxyXG4gICAgfSxcclxuICAgIG1pbk1vbnRoICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWluID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWluLCAnbW9udGgnKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtYXhNb250aCAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1heCA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1heCwgJ21vbnRoJykgOiBudWxsXHJcbiAgICB9LFxyXG4gICAgbWluWWVhciAoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1pbiA/IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLm1pbiwgJ3llYXInKSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBtYXhZZWFyICgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMubWF4LCAneWVhcicpIDogbnVsbFxyXG4gICAgfSxcclxuICAgIGZvcm1hdHRlcnMgKCk6IEZvcm1hdHRlcnMge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHllYXI6IHRoaXMueWVhckZvcm1hdCB8fCBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSwgeyBsZW5ndGg6IDQgfSksXHJcbiAgICAgICAgdGl0bGVEYXRlOiB0aGlzLnRpdGxlRGF0ZUZvcm1hdCB8fCAodGhpcy5tdWx0aXBsZSA/IHRoaXMuZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyIDogdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKSxcclxuICAgICAgICB0aXRsZU1vbnRoWWVhcjogdGhpcy5kZWZhdWx0UmFuZ2VUaXRsZUZvcm1hdHRlclxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVmYXVsdFRpdGxlTXVsdGlwbGVEYXRlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyTXVsdGlwbGVGb3JtYXR0ZXIge1xyXG4gICAgICBpZiAoKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICByZXR1cm4gZGF0ZXMgPT4gZGF0ZXMubGVuZ3RoID8gdGhpcy5kZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyKGRhdGVzWzBdKSA6ICcwIHNlbGVjdGVkJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGF0ZXMgPT4gYCR7ZGF0ZXMubGVuZ3RofSBzZWxlY3RlZGBcclxuICAgIH0sXHJcbiAgICBkZWZhdWx0VGl0bGVEYXRlRm9ybWF0dGVyICgpOiBEYXRlUGlja2VyRm9ybWF0dGVyIHtcclxuICAgICAgY29uc3QgdGl0bGVGb3JtYXRzID0ge1xyXG4gICAgICAgIHllYXI6IHsgeWVhcjogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSxcclxuICAgICAgICBtb250aDogeyBtb250aDogJ2xvbmcnLCB0aW1lWm9uZTogJ1VUQycgfSxcclxuICAgICAgICBkYXRlOiB7IHdlZWtkYXk6ICdzaG9ydCcsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJywgdGltZVpvbmU6ICdVVEMnIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdGl0bGVEYXRlRm9ybWF0dGVyID0gY3JlYXRlTmF0aXZlTG9jYWxlRm9ybWF0dGVyKHRoaXMubG9jYWxlLCB0aXRsZUZvcm1hdHNbdGhpcy50eXBlXSwge1xyXG4gICAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICAgIGxlbmd0aDogeyBkYXRlOiAxMCwgbW9udGg6IDcsIHllYXI6IDQgfVt0aGlzLnR5cGVdXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBjb25zdCBsYW5kc2NhcGVGb3JtYXR0ZXIgPSAoZGF0ZTogc3RyaW5nKSA9PiB0aXRsZURhdGVGb3JtYXR0ZXIoZGF0ZSlcclxuICAgICAgICAucmVwbGFjZSgvKFteXFxkXFxzXSkoW1xcZF0pL2csIChtYXRjaCwgbm9uRGlnaXQsIGRpZ2l0KSA9PiBgJHtub25EaWdpdH0gJHtkaWdpdH1gKVxyXG4gICAgICAgIC5yZXBsYWNlKCcsICcsICcsPGJyPicpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5sYW5kc2NhcGUgPyBsYW5kc2NhcGVGb3JtYXR0ZXIgOiB0aXRsZURhdGVGb3JtYXR0ZXJcclxuICAgIH0sXHJcbiAgICBkZWZhdWx0UmFuZ2VUaXRsZUZvcm1hdHRlciAoKTogRGF0ZVBpY2tlckZvcm1hdHRlciB7XHJcbiAgICAgIGNvbnN0IHRpdGxlUmFuZ2VGb3JtYXR0ZXIgPSBjcmVhdGVOYXRpdmVMb2NhbGVGb3JtYXR0ZXIodGhpcy5sb2NhbGUsIHsgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnLCB0aW1lWm9uZTogJ1VUQycgfSwge1xyXG4gICAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICAgIGxlbmd0aDogNlxyXG4gICAgICB9KVxyXG4gICAgICByZXR1cm4gdGl0bGVSYW5nZUZvcm1hdHRlclxyXG4gICAgfVxyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIGFjdGl2ZVBpY2tlciAodmFsOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy4kZW1pdCgncGlja2VyVHlwZScsIHZhbClcclxuICAgIH0sXHJcbiAgICB0YWJsZURhdGUgKHZhbDogc3RyaW5nLCBwcmV2OiBzdHJpbmcpIHtcclxuICAgICAgLy8gTWFrZSBhIElTTyA4NjAxIHN0cmluZ3MgZnJvbSB2YWwgYW5kIHByZXYgZm9yIGNvbXBhcmlzaW9uLCBvdGhlcndpc2UgaXQgd2lsbCBpbmNvcnJlY3RseVxyXG4gICAgICAvLyBjb21wYXJlIGZvciBleGFtcGxlICcyMDAwLTknIGFuZCAnMjAwMC0xMCdcclxuICAgICAgY29uc3Qgc2FuaXRpemVUeXBlID0gdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJ1xyXG4gICAgICB0aGlzLmlzUmV2ZXJzaW5nID0gc2FuaXRpemVEYXRlU3RyaW5nKHZhbCwgc2FuaXRpemVUeXBlKSA8IHNhbml0aXplRGF0ZVN0cmluZyhwcmV2LCBzYW5pdGl6ZVR5cGUpXHJcbiAgICAgIHRoaXMuJGVtaXQoJ3VwZGF0ZTpwaWNrZXJEYXRlJywgdmFsKVxyXG4gICAgfSxcclxuICAgIHBpY2tlckRhdGUgKHZhbDogc3RyaW5nIHwgbnVsbCkge1xyXG4gICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSB2YWxcclxuICAgICAgICB0aGlzLnNldElucHV0RGF0ZSgpXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5sYXN0VmFsdWUgJiYgdGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ21vbnRoJylcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhc3RWYWx1ZSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmxhc3RWYWx1ZSwgJ3llYXInKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdmFsdWUgKG5ld1ZhbHVlOiBEYXRlUGlja2VyVmFsdWUsIG9sZFZhbHVlOiBEYXRlUGlja2VyVmFsdWUpIHtcclxuICAgICAgdGhpcy5jaGVja011bHRpcGxlUHJvcCgpXHJcbiAgICAgIHRoaXMuc2V0SW5wdXREYXRlKClcclxuXHJcbiAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLnZhbHVlICYmICF0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm11bHRpcGxlICYmICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5sZW5ndGggJiYgIShvbGRWYWx1ZSBhcyBzdHJpbmdbXSkubGVuZ3RoICYmICF0aGlzLnBpY2tlckRhdGUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgUmVwbGFjaW5nIHRhYmxlRGF0ZSB3aXRoICR7dGhpcy5pbnB1dERhdGV9YClcclxuICAgICAgICB0aGlzLnRhYmxlRGF0ZSA9IHNhbml0aXplRGF0ZVN0cmluZyh0aGlzLmlucHV0RGF0ZSwgdGhpcy50eXBlID09PSAnbW9udGgnID8gJ3llYXInIDogJ21vbnRoJylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHR5cGUgKHR5cGU6IERhdGVQaWNrZXJUeXBlKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gdHlwZS50b1VwcGVyQ2FzZSgpXHJcblxyXG4gICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9ICh0aGlzLm11bHRpcGxlID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pIDogW3RoaXMudmFsdWUgYXMgc3RyaW5nXSlcclxuICAgICAgICAgIC5tYXAoKHZhbDogc3RyaW5nKSA9PiBzYW5pdGl6ZURhdGVTdHJpbmcodmFsLCB0eXBlKSlcclxuICAgICAgICAgIC5maWx0ZXIodGhpcy5pc0RhdGVBbGxvd2VkKVxyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5tdWx0aXBsZSA/IG91dHB1dCA6IG91dHB1dFswXSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhvdmVyaW5nICh2YWx1ZTogU3RyaW5nLCBwcmV2OiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy4kZW1pdCgnaG92ZXJMaW5rJywgdmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlZCAoKSB7XHJcbiAgICB0aGlzLmNoZWNrTXVsdGlwbGVQcm9wKClcclxuXHJcbiAgICBpZiAodGhpcy5waWNrZXJEYXRlICE9PSB0aGlzLnRhYmxlRGF0ZSkge1xyXG4gICAgICB0aGlzLiRlbWl0KCd1cGRhdGU6cGlja2VyRGF0ZScsIHRoaXMudGFibGVEYXRlKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRJbnB1dERhdGUoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGVtaXRJbnB1dCAobmV3SW5wdXQ6IHN0cmluZykge1xyXG4gICAgICBjb25zdCBvdXRwdXQgPSB0aGlzLm11bHRpcGxlXHJcbiAgICAgICAgPyAoXHJcbiAgICAgICAgICAodGhpcy52YWx1ZSBhcyBzdHJpbmdbXSkuaW5kZXhPZihuZXdJbnB1dCkgPT09IC0xXHJcbiAgICAgICAgICAgID8gKHRoaXMudmFsdWUgYXMgc3RyaW5nW10pLmNvbmNhdChbbmV3SW5wdXRdKVxyXG4gICAgICAgICAgICA6ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKS5maWx0ZXIoeCA9PiB4ICE9PSBuZXdJbnB1dClcclxuICAgICAgICApXHJcbiAgICAgICAgOiBuZXdJbnB1dFxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCBvdXRwdXQpXHJcbiAgICAgIHRoaXMubXVsdGlwbGUgfHwgdGhpcy4kZW1pdCgnY2hhbmdlJywgbmV3SW5wdXQpXHJcbiAgICB9LFxyXG4gICAgY2hlY2tNdWx0aXBsZVByb3AgKCkge1xyXG4gICAgICBpZiAodGhpcy52YWx1ZSA9PSBudWxsKSByZXR1cm5cclxuICAgICAgY29uc3QgdmFsdWVUeXBlID0gdGhpcy52YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lXHJcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gdGhpcy5tdWx0aXBsZSA/ICdBcnJheScgOiAnU3RyaW5nJ1xyXG4gICAgICBpZiAodmFsdWVUeXBlICE9PSBleHBlY3RlZCkge1xyXG4gICAgICAgIGNvbnNvbGVXYXJuKGBWYWx1ZSBtdXN0IGJlICR7dGhpcy5tdWx0aXBsZSA/ICdhbicgOiAnYSd9ICR7ZXhwZWN0ZWR9LCBnb3QgJHt2YWx1ZVR5cGV9YCwgdGhpcylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzRGF0ZUFsbG93ZWQgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuIGlzRGF0ZUFsbG93ZWQodmFsdWUsIHRoaXMubWluLCB0aGlzLm1heCwgdGhpcy5hbGxvd2VkRGF0ZXMpXHJcbiAgICB9LFxyXG4gICAgeWVhckNsaWNrICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRZZWFyID0gdmFsdWVcclxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21vbnRoJykge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gYCR7dmFsdWV9YFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudGFibGVEYXRlID0gYCR7dmFsdWV9LSR7cGFkKHRoaXMudGFibGVNb250aCArIDEpfWBcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFjdGl2ZVBpY2tlciA9ICdNT05USCdcclxuICAgICAgaWYgKHRoaXMucmVhY3RpdmUgJiYgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5pc0RhdGVBbGxvd2VkKHRoaXMuaW5wdXREYXRlKSkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdGhpcy5pbnB1dERhdGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb250aENsaWNrICh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRZZWFyID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVswXSwgMTApXHJcbiAgICAgIHRoaXMuaW5wdXRNb250aCA9IHBhcnNlSW50KHZhbHVlLnNwbGl0KCctJylbMV0sIDEwKSAtIDFcclxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgdGhpcy50YWJsZURhdGUgPSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID0gJ0RBVEUnXHJcbiAgICAgICAgaWYgKHRoaXMucmVhY3RpdmUgJiYgIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5pc0RhdGVBbGxvd2VkKHRoaXMuaW5wdXREYXRlKSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLmlucHV0RGF0ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbWl0SW5wdXQodGhpcy5pbnB1dERhdGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkYXRlQ2xpY2sgKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludCh2YWx1ZS5zcGxpdCgnLScpWzBdLCAxMClcclxuICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVsxXSwgMTApIC0gMVxyXG4gICAgICB0aGlzLmlucHV0RGF5ID0gcGFyc2VJbnQodmFsdWUuc3BsaXQoJy0nKVsyXSwgMTApXHJcbiAgICAgIHRoaXMuZW1pdElucHV0KHRoaXMuaW5wdXREYXRlKVxyXG4gICAgfSxcclxuICAgIGdlblBpY2tlclRpdGxlICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJUaXRsZSwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd0RhdGVDaGFuZ2U6IHRoaXMuYWxsb3dEYXRlQ2hhbmdlLFxyXG4gICAgICAgICAgZGF0ZTogdGhpcy52YWx1ZSA/ICh0aGlzLmZvcm1hdHRlcnMudGl0bGVEYXRlIGFzICh2YWx1ZTogYW55KSA9PiBzdHJpbmcpKHRoaXMudmFsdWUpIDogJycsXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIHJlYWRvbmx5OiB0aGlzLnJlYWRvbmx5LFxyXG4gICAgICAgICAgc2VsZWN0aW5nWWVhcjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdZRUFSJyxcclxuICAgICAgICAgIHllYXI6IHRoaXMuZm9ybWF0dGVycy55ZWFyKHRoaXMudmFsdWUgPyBgJHt0aGlzLmlucHV0WWVhcn1gIDogdGhpcy50YWJsZURhdGUpLFxyXG4gICAgICAgICAgeWVhckljb246IHRoaXMueWVhckljb24sXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5tdWx0aXBsZSA/ICh0aGlzLnZhbHVlIGFzIHN0cmluZ1tdKVswXSA6IHRoaXMudmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNsb3Q6ICd0aXRsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgICd1cGRhdGU6c2VsZWN0aW5nWWVhcic6ICh2YWx1ZTogYm9vbGVhbikgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSB2YWx1ZSA/ICdZRUFSJyA6IHRoaXMudHlwZS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblRhYmxlSGVhZGVyICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkRhdGVQaWNrZXJIZWFkZXIsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgYWxsb3dEYXRlQ2hhbmdlOiB0aGlzLmFsbG93RGF0ZUNoYW5nZSxcclxuICAgICAgICAgIG5leHRJY29uOiB0aGlzLm5leHRJY29uLFxyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBkYXJrOiB0aGlzLmRhcmssXHJcbiAgICAgICAgICBkaXNhYmxlZDogdGhpcy5kaXNhYmxlZCxcclxuICAgICAgICAgIGZvcm1hdDogdGhpcy5oZWFkZXJEYXRlRm9ybWF0LFxyXG4gICAgICAgICAgaGlkZURpc2FibGVkOiB0aGlzLmhpZGVEaXNhYmxlZCxcclxuICAgICAgICAgIGxpZ2h0OiB0aGlzLmxpZ2h0LFxyXG4gICAgICAgICAgbG9jYWxlOiB0aGlzLmxvY2FsZSxcclxuICAgICAgICAgIG1pbjogdGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/IHRoaXMubWluTW9udGggOiB0aGlzLm1pblllYXIsXHJcbiAgICAgICAgICBtYXg6IHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLm1heE1vbnRoIDogdGhpcy5tYXhZZWFyLFxyXG4gICAgICAgICAgcHJldkljb246IHRoaXMucHJldkljb24sXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLmFjdGl2ZVBpY2tlciA9PT0gJ0RBVEUnID8gYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCA6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIHRvZ2dsZTogKCkgPT4gdGhpcy5hY3RpdmVQaWNrZXIgPSAodGhpcy5hY3RpdmVQaWNrZXIgPT09ICdEQVRFJyA/ICdNT05USCcgOiAnWUVBUicpLFxyXG4gICAgICAgICAgaW5wdXQ6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLnRhYmxlRGF0ZSA9IHZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbkRhdGVUYWJsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyRGF0ZVRhYmxlLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIGFsbG93ZWREYXRlczogdGhpcy5hbGxvd2VkRGF0ZXMsXHJcbiAgICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcclxuICAgICAgICAgIGN1cnJlbnQ6IHRoaXMuY3VycmVudCxcclxuICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgIGRpc2FibGVkOiB0aGlzLmRpc2FibGVkLFxyXG4gICAgICAgICAgZXZlbnRzOiB0aGlzLmV2ZW50cyxcclxuICAgICAgICAgIGV2ZW50Q29sb3I6IHRoaXMuZXZlbnRDb2xvcixcclxuICAgICAgICAgIGZpcnN0RGF5T2ZXZWVrOiB0aGlzLmZpcnN0RGF5T2ZXZWVrLFxyXG4gICAgICAgICAgZm9ybWF0OiB0aGlzLmRheUZvcm1hdCxcclxuICAgICAgICAgIGhvdmVyTGluazogdGhpcy5ob3ZlckxpbmssXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluLFxyXG4gICAgICAgICAgbWF4OiB0aGlzLm1heCxcclxuICAgICAgICAgIHJhbmdlOiB0aGlzLnJhbmdlLFxyXG4gICAgICAgICAgcmVhZG9ubHk6IHRoaXMucmVhZG9ubHksXHJcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXHJcbiAgICAgICAgICBzaG93V2VlazogdGhpcy5zaG93V2VlayxcclxuICAgICAgICAgIHRhYmxlRGF0ZTogYCR7cGFkKHRoaXMudGFibGVZZWFyLCA0KX0tJHtwYWQodGhpcy50YWJsZU1vbnRoICsgMSl9YCxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxyXG4gICAgICAgICAgd2Vla2RheUZvcm1hdDogdGhpcy53ZWVrZGF5Rm9ybWF0XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZWY6ICd0YWJsZScsXHJcbiAgICAgICAgb246IHtcclxuICAgICAgICAgIGlucHV0OiB0aGlzLmRhdGVDbGljayxcclxuICAgICAgICAgIHRhYmxlRGF0ZTogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMudGFibGVEYXRlID0gdmFsdWUsXHJcbiAgICAgICAgICBob3ZlcjogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuaG92ZXJpbmcgPSB2YWx1ZSxcclxuICAgICAgICAgICdjbGljazpkYXRlJzogKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMuJGVtaXQoJ2NsaWNrOmRhdGUnLCB2YWx1ZSksXHJcbiAgICAgICAgICAnZGJsY2xpY2s6ZGF0ZSc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdkYmxjbGljazpkYXRlJywgdmFsdWUpLFxyXG4gICAgICAgICAgJ2hvdmVyTGluayc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdob3ZlckxpbmsnLCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2VuTW9udGhUYWJsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyTW9udGhUYWJsZSwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBhbGxvd2VkRGF0ZXM6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuYWxsb3dlZERhdGVzIDogbnVsbCxcclxuICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbG9yLFxyXG4gICAgICAgICAgY3VycmVudDogdGhpcy5jdXJyZW50ID8gc2FuaXRpemVEYXRlU3RyaW5nKHRoaXMuY3VycmVudCwgJ21vbnRoJykgOiBudWxsLFxyXG4gICAgICAgICAgZGFyazogdGhpcy5kYXJrLFxyXG4gICAgICAgICAgZGlzYWJsZWQ6IHRoaXMuZGlzYWJsZWQsXHJcbiAgICAgICAgICBldmVudHM6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuZXZlbnRzIDogbnVsbCxcclxuICAgICAgICAgIGV2ZW50Q29sb3I6IHRoaXMudHlwZSA9PT0gJ21vbnRoJyA/IHRoaXMuZXZlbnRDb2xvciA6IG51bGwsXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMubW9udGhGb3JtYXQsXHJcbiAgICAgICAgICBsaWdodDogdGhpcy5saWdodCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluTW9udGgsXHJcbiAgICAgICAgICBtYXg6IHRoaXMubWF4TW9udGgsXHJcbiAgICAgICAgICByZWFkb25seTogdGhpcy5yZWFkb25seSAmJiB0aGlzLnR5cGUgPT09ICdtb250aCcsXHJcbiAgICAgICAgICBzY3JvbGxhYmxlOiB0aGlzLnNjcm9sbGFibGUsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5zZWxlY3RlZE1vbnRocyxcclxuICAgICAgICAgIHZpZXdpbmc6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9LSR7cGFkKHRoaXMudGFibGVNb250aCArIDEpfWAsXHJcbiAgICAgICAgICB0YWJsZURhdGU6IGAke3BhZCh0aGlzLnRhYmxlWWVhciwgNCl9YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAndGFibGUnLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBpbnB1dDogdGhpcy5tb250aENsaWNrLFxyXG4gICAgICAgICAgdGFibGVEYXRlOiAodmFsdWU6IHN0cmluZykgPT4gdGhpcy50YWJsZURhdGUgPSB2YWx1ZSxcclxuICAgICAgICAgICdjbGljazptb250aCc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdjbGljazptb250aCcsIHZhbHVlKSxcclxuICAgICAgICAgICdkYmxjbGljazptb250aCc6ICh2YWx1ZTogc3RyaW5nKSA9PiB0aGlzLiRlbWl0KCdkYmxjbGljazptb250aCcsIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5ZZWFycyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZEYXRlUGlja2VyWWVhcnMsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXHJcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMueWVhckZvcm1hdCxcclxuICAgICAgICAgIGxvY2FsZTogdGhpcy5sb2NhbGUsXHJcbiAgICAgICAgICBtaW46IHRoaXMubWluWWVhcixcclxuICAgICAgICAgIG1heDogdGhpcy5tYXhZZWFyLFxyXG4gICAgICAgICAgdmFsdWU6IHRoaXMudGFibGVZZWFyXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAgaW5wdXQ6IHRoaXMueWVhckNsaWNrXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlblBpY2tlckJvZHkgKCkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuYWN0aXZlUGlja2VyID09PSAnWUVBUicgPyBbXHJcbiAgICAgICAgdGhpcy5nZW5ZZWFycygpXHJcbiAgICAgIF0gOiBbXHJcbiAgICAgICAgdGhpcy5nZW5UYWJsZUhlYWRlcigpLFxyXG4gICAgICAgIHRoaXMuYWN0aXZlUGlja2VyID09PSAnREFURScgPyB0aGlzLmdlbkRhdGVUYWJsZSgpIDogdGhpcy5nZW5Nb250aFRhYmxlKClcclxuICAgICAgXVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBrZXk6IHRoaXMuYWN0aXZlUGlja2VyXHJcbiAgICAgIH0sIGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIHNldElucHV0RGF0ZSAoKSB7XHJcbiAgICAgIGNvbnN0IHBpY2tlciA9IHRoaXMucGlja2VyRGF0ZSA/IHRoaXMucGlja2VyRGF0ZS5zcGxpdCgnLScpIDogbnVsbFxyXG5cclxuICAgICAgaWYgKHRoaXMubGFzdFZhbHVlKSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXkgPSB0aGlzLmxhc3RWYWx1ZS5zcGxpdCgnLScpXHJcbiAgICAgICAgdGhpcy5pbnB1dFllYXIgPSBwYXJzZUludChhcnJheVswXSwgMTApXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQoYXJyYXlbMV0sIDEwKSAtIDFcclxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICAgIHRoaXMuaW5wdXREYXkgPSBwYXJzZUludChhcnJheVsyXSwgMTApXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHBpY2tlciAmJiBwYXJzZUludChwaWNrZXJbMF0sIDEwKSAhPT0gdGhpcy5pbnB1dFllYXIpIHtcclxuICAgICAgICB0aGlzLmlucHV0WWVhciA9IHBhcnNlSW50KHBpY2tlclswXSwgMTApXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gcGFyc2VJbnQocGlja2VyWzFdLCAxMCkgLSAxXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dFllYXIgPSB0aGlzLmlucHV0WWVhciB8fCB0aGlzLm5vdy5nZXRGdWxsWWVhcigpXHJcbiAgICAgICAgdGhpcy5pbnB1dE1vbnRoID0gdGhpcy5pbnB1dE1vbnRoID09IG51bGwgPyB0aGlzLmlucHV0TW9udGggOiB0aGlzLm5vdy5nZXRNb250aCgpXHJcbiAgICAgICAgdGhpcy5pbnB1dERheSA9IHRoaXMuaW5wdXREYXkgfHwgdGhpcy5ub3cuZ2V0RGF0ZSgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKCk6IFZOb2RlIHtcclxuICAgIHJldHVybiB0aGlzLmdlblBpY2tlcigndi1waWNrZXItLWRhdGUnKVxyXG4gIH1cclxufSlcclxuIl19