/**
 * Maskable
 *
 * @mixin
 *
 * Creates an input mask that is
 * generated from a masked str
 *
 * Example: mask="#### #### #### ####"
 */
import { isMaskDelimiter, maskText, unmaskText } from '../util/mask';
/* @vue/component */
export default {
    name: 'maskable',
    props: {
        dontFillMaskBlanks: Boolean,
        mask: {
            type: [Object, String],
            default: null
        },
        returnMaskedValue: Boolean,
        value: { required: false }
    },
    data: vm => ({
        selection: 0,
        lazySelection: 0,
        lazyValue: vm.value,
        preDefined: {
            'credit-card': '#### - #### - #### - ####',
            'date': '##/##/####',
            'date-with-time': '##/##/#### ##:##',
            'phone': '(###) ### - ####',
            'social': '###-##-####',
            'time': '##:##',
            'time-with-seconds': '##:##:##'
        }
    }),
    computed: {
        masked() {
            const preDefined = this.preDefined[this.mask];
            const mask = preDefined || this.mask || '';
            return mask.split('');
        }
    },
    watch: {
        /**
         * Make sure the cursor is in the correct
         * location when the mask changes
         */
        mask() {
            if (!this.$refs.input)
                return;
            const oldValue = this.$refs.input.value;
            const newValue = this.maskText(unmaskText(this.lazyValue));
            let position = 0;
            let selection = this.selection;
            for (let index = 0; index < selection; index++) {
                isMaskDelimiter(oldValue[index]) || position++;
            }
            selection = 0;
            if (newValue) {
                for (let index = 0; index < newValue.length; index++) {
                    isMaskDelimiter(newValue[index]) || position--;
                    selection++;
                    if (position <= 0)
                        break;
                }
            }
            this.$nextTick(() => {
                this.$refs.input.value = newValue;
                this.setCaretPosition(selection);
            });
        }
    },
    beforeMount() {
        if (!this.mask ||
            this.value == null ||
            !this.returnMaskedValue)
            return;
        const value = this.maskText(this.value);
        // See if masked value does not
        // match the user given value
        if (value === this.value)
            return;
        this.$emit('input', value);
    },
    methods: {
        setCaretPosition(selection) {
            this.selection = selection;
            window.setTimeout(() => {
                this.$refs.input && this.$refs.input.setSelectionRange(this.selection, this.selection);
            }, 0);
        },
        updateRange() {
            /* istanbul ignore next */
            if (!this.$refs.input)
                return;
            const newValue = this.maskText(this.lazyValue);
            let selection = 0;
            this.$refs.input.value = newValue;
            if (newValue) {
                for (let index = 0; index < newValue.length; index++) {
                    if (this.lazySelection <= 0)
                        break;
                    isMaskDelimiter(newValue[index]) || this.lazySelection--;
                    selection++;
                }
            }
            this.setCaretPosition(selection);
            // this.$emit() must occur only when all internal values are correct
            this.$emit('input', this.returnMaskedValue ? this.$refs.input.value : this.lazyValue);
        },
        maskText(text) {
            return this.mask ? maskText(text, this.masked, this.dontFillMaskBlanks) : text;
        },
        unmaskText(text) {
            return this.mask && !this.returnMaskedValue ? unmaskText(text) : text;
        },
        // When the input changes and is
        // re-created, ensure that the
        // caret location is correct
        setSelectionRange() {
            this.$nextTick(this.updateRange);
        },
        resetSelections(input) {
            if (!input.selectionEnd)
                return;
            this.selection = input.selectionEnd;
            this.lazySelection = 0;
            for (let index = 0; index < this.selection; index++) {
                isMaskDelimiter(input.value[index]) || this.lazySelection++;
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFza2FibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL21hc2thYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7R0FTRztBQUVILE9BQU8sRUFDTCxlQUFlLEVBQ2YsUUFBUSxFQUNSLFVBQVUsRUFDWCxNQUFNLGNBQWMsQ0FBQTtBQUVyQixvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxVQUFVO0lBRWhCLEtBQUssRUFBRTtRQUNMLGtCQUFrQixFQUFFLE9BQU87UUFDM0IsSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsaUJBQWlCLEVBQUUsT0FBTztRQUMxQixLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0tBQzNCO0lBRUQsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNYLFNBQVMsRUFBRSxDQUFDO1FBQ1osYUFBYSxFQUFFLENBQUM7UUFDaEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxLQUFLO1FBQ25CLFVBQVUsRUFBRTtZQUNWLGFBQWEsRUFBRSwyQkFBMkI7WUFDMUMsTUFBTSxFQUFFLFlBQVk7WUFDcEIsZ0JBQWdCLEVBQUUsa0JBQWtCO1lBQ3BDLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsUUFBUSxFQUFFLGFBQWE7WUFDdkIsTUFBTSxFQUFFLE9BQU87WUFDZixtQkFBbUIsRUFBRSxVQUFVO1NBQ2hDO0tBQ0YsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLE1BQU07WUFDSixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM3QyxNQUFNLElBQUksR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7WUFFMUMsT0FBTyxJQUFJLENBQUMsS0FB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QUFBO1lBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFBO1lBRXRCLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNuRCxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTthQUM1RDtRQUNILENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogTWFza2FibGVcclxuICpcclxuICogQG1peGluXHJcbiAqXHJcbiAqIENyZWF0ZXMgYW4gaW5wdXQgbWFzayB0aGF0IGlzXHJcbiAqIGdlbmVyYXRlZCBmcm9tIGEgbWFza2VkIHN0clxyXG4gKlxyXG4gKiBFeGFtcGxlOiBtYXNrPVwiIyMjIyAjIyMjICMjIyMgIyMjI1wiXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICBpc01hc2tEZWxpbWl0ZXIsXHJcbiAgbWFza1RleHQsXHJcbiAgdW5tYXNrVGV4dFxyXG59IGZyb20gJy4uL3V0aWwvbWFzaydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAnbWFza2FibGUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZG9udEZpbGxNYXNrQmxhbmtzOiBCb29sZWFuLFxyXG4gICAgbWFzazoge1xyXG4gICAgICB0eXBlOiBbT2JqZWN0LCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiBudWxsXHJcbiAgICB9LFxyXG4gICAgcmV0dXJuTWFza2VkVmFsdWU6IEJvb2xlYW4sXHJcbiAgICB2YWx1ZTogeyByZXF1aXJlZDogZmFsc2UgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGE6IHZtID0+ICh7XHJcbiAgICBzZWxlY3Rpb246IDAsXHJcbiAgICBsYXp5U2VsZWN0aW9uOiAwLFxyXG4gICAgbGF6eVZhbHVlOiB2bS52YWx1ZSxcclxuICAgIHByZURlZmluZWQ6IHtcclxuICAgICAgJ2NyZWRpdC1jYXJkJzogJyMjIyMgLSAjIyMjIC0gIyMjIyAtICMjIyMnLFxyXG4gICAgICAnZGF0ZSc6ICcjIy8jIy8jIyMjJyxcclxuICAgICAgJ2RhdGUtd2l0aC10aW1lJzogJyMjLyMjLyMjIyMgIyM6IyMnLFxyXG4gICAgICAncGhvbmUnOiAnKCMjIykgIyMjIC0gIyMjIycsXHJcbiAgICAgICdzb2NpYWwnOiAnIyMjLSMjLSMjIyMnLFxyXG4gICAgICAndGltZSc6ICcjIzojIycsXHJcbiAgICAgICd0aW1lLXdpdGgtc2Vjb25kcyc6ICcjIzojIzojIydcclxuICAgIH1cclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIG1hc2tlZCAoKSB7XHJcbiAgICAgIGNvbnN0IHByZURlZmluZWQgPSB0aGlzLnByZURlZmluZWRbdGhpcy5tYXNrXVxyXG4gICAgICBjb25zdCBtYXNrID0gcHJlRGVmaW5lZCB8fCB0aGlzLm1hc2sgfHwgJydcclxuXHJcbiAgICAgIHJldHVybiBtYXNrLnNwbGl0KCcnKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICAvKipcclxuICAgICAqIE1ha2Ugc3VyZSB0aGUgY3Vyc29yIGlzIGluIHRoZSBjb3JyZWN0XHJcbiAgICAgKiBsb2NhdGlvbiB3aGVuIHRoZSBtYXNrIGNoYW5nZXNcclxuICAgICAqL1xyXG4gICAgbWFzayAoKSB7XHJcbiAgICAgIGlmICghdGhpcy4kcmVmcy5pbnB1dCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuJHJlZnMuaW5wdXQudmFsdWVcclxuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLm1hc2tUZXh0KHVubWFza1RleHQodGhpcy5sYXp5VmFsdWUpKVxyXG4gICAgICBsZXQgcG9zaXRpb24gPSAwXHJcbiAgICAgIGxldCBzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvblxyXG5cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNlbGVjdGlvbjsgaW5kZXgrKykge1xyXG4gICAgICAgIGlzTWFza0RlbGltaXRlcihvbGRWYWx1ZVtpbmRleF0pIHx8IHBvc2l0aW9uKytcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZWN0aW9uID0gMFxyXG4gICAgICBpZiAobmV3VmFsdWUpIHtcclxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbmV3VmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICBpc01hc2tEZWxpbWl0ZXIobmV3VmFsdWVbaW5kZXhdKSB8fCBwb3NpdGlvbi0tXHJcbiAgICAgICAgICBzZWxlY3Rpb24rK1xyXG4gICAgICAgICAgaWYgKHBvc2l0aW9uIDw9IDApIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgdGhpcy4kcmVmcy5pbnB1dC52YWx1ZSA9IG5ld1ZhbHVlXHJcbiAgICAgICAgdGhpcy5zZXRDYXJldFBvc2l0aW9uKHNlbGVjdGlvbilcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiZWZvcmVNb3VudCAoKSB7XHJcbiAgICBpZiAoIXRoaXMubWFzayB8fFxyXG4gICAgICB0aGlzLnZhbHVlID09IG51bGwgfHxcclxuICAgICAgIXRoaXMucmV0dXJuTWFza2VkVmFsdWVcclxuICAgICkgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLm1hc2tUZXh0KHRoaXMudmFsdWUpXHJcblxyXG4gICAgLy8gU2VlIGlmIG1hc2tlZCB2YWx1ZSBkb2VzIG5vdFxyXG4gICAgLy8gbWF0Y2ggdGhlIHVzZXIgZ2l2ZW4gdmFsdWVcclxuICAgIGlmICh2YWx1ZSA9PT0gdGhpcy52YWx1ZSkgcmV0dXJuXHJcblxyXG4gICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWx1ZSlcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBzZXRDYXJldFBvc2l0aW9uIChzZWxlY3Rpb24pIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb24gPSBzZWxlY3Rpb25cclxuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQgJiYgdGhpcy4kcmVmcy5pbnB1dC5zZXRTZWxlY3Rpb25SYW5nZSh0aGlzLnNlbGVjdGlvbiwgdGhpcy5zZWxlY3Rpb24pXHJcbiAgICAgIH0sIDApXHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmFuZ2UgKCkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICBpZiAoIXRoaXMuJHJlZnMuaW5wdXQpIHJldHVyblxyXG5cclxuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLm1hc2tUZXh0KHRoaXMubGF6eVZhbHVlKVxyXG4gICAgICBsZXQgc2VsZWN0aW9uID0gMFxyXG5cclxuICAgICAgdGhpcy4kcmVmcy5pbnB1dC52YWx1ZSA9IG5ld1ZhbHVlXHJcbiAgICAgIGlmIChuZXdWYWx1ZSkge1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBuZXdWYWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgIGlmICh0aGlzLmxhenlTZWxlY3Rpb24gPD0gMCkgYnJlYWtcclxuICAgICAgICAgIGlzTWFza0RlbGltaXRlcihuZXdWYWx1ZVtpbmRleF0pIHx8IHRoaXMubGF6eVNlbGVjdGlvbi0tXHJcbiAgICAgICAgICBzZWxlY3Rpb24rK1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRDYXJldFBvc2l0aW9uKHNlbGVjdGlvbilcclxuICAgICAgLy8gdGhpcy4kZW1pdCgpIG11c3Qgb2NjdXIgb25seSB3aGVuIGFsbCBpbnRlcm5hbCB2YWx1ZXMgYXJlIGNvcnJlY3RcclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB0aGlzLnJldHVybk1hc2tlZFZhbHVlID8gdGhpcy4kcmVmcy5pbnB1dC52YWx1ZSA6IHRoaXMubGF6eVZhbHVlKVxyXG4gICAgfSxcclxuICAgIG1hc2tUZXh0ICh0ZXh0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1hc2sgPyBtYXNrVGV4dCh0ZXh0LCB0aGlzLm1hc2tlZCwgdGhpcy5kb250RmlsbE1hc2tCbGFua3MpIDogdGV4dFxyXG4gICAgfSxcclxuICAgIHVubWFza1RleHQgKHRleHQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWFzayAmJiAhdGhpcy5yZXR1cm5NYXNrZWRWYWx1ZSA/IHVubWFza1RleHQodGV4dCkgOiB0ZXh0XHJcbiAgICB9LFxyXG4gICAgLy8gV2hlbiB0aGUgaW5wdXQgY2hhbmdlcyBhbmQgaXNcclxuICAgIC8vIHJlLWNyZWF0ZWQsIGVuc3VyZSB0aGF0IHRoZVxyXG4gICAgLy8gY2FyZXQgbG9jYXRpb24gaXMgY29ycmVjdFxyXG4gICAgc2V0U2VsZWN0aW9uUmFuZ2UgKCkge1xyXG4gICAgICB0aGlzLiRuZXh0VGljayh0aGlzLnVwZGF0ZVJhbmdlKVxyXG4gICAgfSxcclxuICAgIHJlc2V0U2VsZWN0aW9ucyAoaW5wdXQpIHtcclxuICAgICAgaWYgKCFpbnB1dC5zZWxlY3Rpb25FbmQpIHJldHVyblxyXG4gICAgICB0aGlzLnNlbGVjdGlvbiA9IGlucHV0LnNlbGVjdGlvbkVuZFxyXG4gICAgICB0aGlzLmxhenlTZWxlY3Rpb24gPSAwXHJcblxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5zZWxlY3Rpb247IGluZGV4KyspIHtcclxuICAgICAgICBpc01hc2tEZWxpbWl0ZXIoaW5wdXQudmFsdWVbaW5kZXhdKSB8fCB0aGlzLmxhenlTZWxlY3Rpb24rK1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==