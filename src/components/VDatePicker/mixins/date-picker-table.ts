import '../../../stylus/components/_date-picker-table.styl'

// Directives
import Touch, { TouchWrapper } from '../../../directives/touch'

// Mixins
import Colorable from '../../../mixins/colorable'
import Themeable from '../../../mixins/themeable'

// Utils
import isDateAllowed, { AllowedDateFunction } from '../util/isDateAllowed'
import isDateInRange, { isHoverAfterStartDate } from '../util/isDateInRange'
import mixins from '../../../util/mixins'

// Types
import { VNodeChildren } from 'vue'
import { PropValidator } from 'vue/types/options'
import { DatePickerFormatter } from '../util/createNativeLocaleFormatter'
import { DateEvents, DateEventColors, DateEventColorValue } from '../VDatePicker'
// import { emit } from 'cluster';

type CalculateTableDateFunction = (v: number) => string

export default mixins(
  Colorable,
  Themeable
/* @vue/component */
).extend({
  directives: { Touch },

  props: {
    allowedDates: Function as PropValidator<AllowedDateFunction | undefined>,
    current: String,
    disabled: Boolean,
    format: Function as PropValidator<DatePickerFormatter | undefined>,
    events: {
      type: [Array, Function, Object],
      default: () => null
    } as any as PropValidator<DateEvents>,
    eventColor: {
      type: [Array, Function, Object, String],
      default: () => 'warning'
    } as any as PropValidator<DateEventColors>,
    hover: {
      type: String,
      default: ''
    },
    hoverLink: {
      type: String,
      default: ''
    },
    locale: {
      type: String,
      default: 'en-us'
    },
    min: String,
    max: String,
    range: Boolean,
    readonly: Boolean,
    scrollable: Boolean,
    tableDate: {
      type: String,
      required: true
    },
    value: [String, Array]
  },

  data: () => ({
    isReversing: false,
    hovering: ''
  }),

  computed: {
    computedTransition (): string {
      return (this.isReversing === !this.$vuetify.rtl) ? 'tab-reverse-transition' : 'tab-transition'
    },
    displayedMonth (): number {
      return Number(this.tableDate.split('-')[1]) - 1
    },
    displayedYear (): number {
      return Number(this.tableDate.split('-')[0])
    }
  },

  watch: {
    tableDate (newVal: string, oldVal: string) {
      this.isReversing = newVal < oldVal
    },
    hovering (value) {
      this.$emit('hover', value)
    }
  },

  methods: {
    genButtonClasses (
      isAllowed: boolean,
      isFloating: boolean,
      isSelected: boolean,
      isCurrent: boolean,
      isRange: boolean,
      isHover: boolean,
      isRangeStart: boolean,
      isRangeEnd: boolean
    ) {
      return {
        'v-btn--range': isRange,
        'v-btn--range-hover': isRange && isHover,
        'v-btn--range-start': isRange && isRangeStart,
        'v-btn--range-end': isRange && isRangeEnd,
        'v-btn--active': isSelected,
        'v-btn--flat': !isSelected,
        'v-btn--icon': isSelected && isAllowed && isFloating,
        'v-btn--floating': isFloating,
        'v-btn--depressed': !isFloating && isSelected,
        'v-btn--disabled': !isAllowed || (this.disabled && isSelected),
        'v-btn--outline': isCurrent && !isSelected,
        ...this.themeClasses
      }
    },
    genButtonEvents (value: string, isAllowed: boolean, mouseEventType: string) {
      if (this.disabled) return undefined

      return {
        click: () => {
          isAllowed && !this.readonly && this.$emit('input', value)
          this.$emit(`click:${mouseEventType}`, value)
        },
        dblclick: () => this.$emit(`dblclick:${mouseEventType}`, value),
        mouseover: () => {
          this.hovering = value
        },
        mouseleave: () => {
          this.hovering = ''
        }
      }
    },
    genButton (value: string, isFloating: boolean, mouseEventType: string, formatter: DatePickerFormatter) {
      const isAllowed = isDateAllowed(value, this.min, this.max, this.allowedDates)
      const isSelected = value === this.value || (Array.isArray(this.value) && this.value.indexOf(value) !== -1)
      const isCurrent = value === this.current
      const isHover = value === this.hovering
      const isRange = this.range
      const isRangeStart = isRange && value === this.value[0]
      const isRangeEnd = isRange && value === this.value[1]
      const setColor = isSelected || isRange ? this.setBackgroundColor : this.setTextColor

      //  AT -> Added support for date-range
      //  const color = (isSelected || isCurrent) && (this.color || 'accent')
      const color = this.getFinalColor(value, (isSelected || isCurrent) && (this.color || 'accent'))

      return this.$createElement('button', setColor(color, {
        staticClass: 'v-btn',
        'class': this.genButtonClasses(isAllowed, isFloating, isSelected, isCurrent, isRange, isHover, isRangeStart, isRangeEnd),
        attrs: {
          type: 'button'
        },
        props: {
          isHovering: false
        },
        domProps: {
          disabled: this.disabled || !isAllowed
        },
        on: this.genButtonEvents(value, isAllowed, mouseEventType)
      }), [
        this.$createElement('div', {
          staticClass: 'v-btn__content'
        }, [formatter(value)]),
        this.genEvents(value)
      ])
    },
    getFinalColor (date: string, color: string | false) {
      const colorInRange = Array.isArray(this.value) && isDateInRange(date, this.value)
      const colorInRangeHover = Array.isArray(this.value) && (this.value.length === 1) && (typeof this.value[0] === 'string') && isHoverAfterStartDate(date, this.value[0], this.hover ? this.hover : this.hoverLink)
      const colorRangeNode = Array.isArray(this.value) && (this.value.indexOf(date) === 0 || date === this.value[this.value.length - 1])
      return colorRangeNode ? 'accent darken-4' : colorInRange ? 'accent darken-2' : colorInRangeHover ? 'accent darken-3' : color
    },
    getEventColors (date: string) {
      const arrayize = (v: string | string[]) => Array.isArray(v) ? v : [v]
      let eventData: boolean | DateEventColorValue
      let eventColors: string[] = []

      if (Array.isArray(this.events)) {
        eventData = this.events.includes(date)
      } else if (this.events instanceof Function) {
        eventData = this.events(date) || false
      } else if (this.events) {
        eventData = this.events[date] || false
      } else {
        eventData = false
      }

      if (!eventData) {
        return []
      } else if (eventData !== true) {
        eventColors = arrayize(eventData)
      } else if (typeof this.eventColor === 'string') {
        eventColors = [this.eventColor]
      } else if (typeof this.eventColor === 'function') {
        eventColors = arrayize(this.eventColor(date))
      } else if (Array.isArray(this.eventColor)) {
        eventColors = this.eventColor
      } else {
        eventColors = arrayize(this.eventColor[date])
      }

      return eventColors.filter(v => v)
    },
    genEvents (date: string) {
      const eventColors = this.getEventColors(date)

      return eventColors.length ? this.$createElement('div', {
        staticClass: 'v-date-picker-table__events'
      }, eventColors.map(color => this.$createElement('div', this.setBackgroundColor(color)))) : null
    },
    wheel (e: WheelEvent, calculateTableDate: CalculateTableDateFunction) {
      e.preventDefault()
      this.$emit('tableDate', calculateTableDate(e.deltaY))
    },
    touch (value: number, calculateTableDate: CalculateTableDateFunction) {
      this.$emit('tableDate', calculateTableDate(value))
    },
    genTable (staticClass: string, children: VNodeChildren, calculateTableDate: CalculateTableDateFunction) {
      const transition = this.$createElement('transition', {
        props: { name: this.computedTransition }
      }, [this.$createElement('table', { key: this.tableDate }, children)])

      const touchDirective = {
        name: 'touch',
        value: {
          left: (e: TouchWrapper) => (e.offsetX < -15) && this.touch(1, calculateTableDate),
          right: (e: TouchWrapper) => (e.offsetX > 15) && this.touch(-1, calculateTableDate)
        }
      }

      return this.$createElement('div', {
        staticClass,
        class: {
          'v-date-picker-table--disabled': this.disabled,
          ...this.themeClasses
        },
        on: (!this.disabled && this.scrollable) ? {
          wheel: (e: WheelEvent) => this.wheel(e, calculateTableDate)
        } : undefined,
        directives: [touchDirective]
      }, [transition])
    }
  }
})
