// Styles
import '../../stylus/components/_textarea.styl';
// Extensions
import VTextField from '../VTextField/VTextField';
import { consoleInfo } from '../../util/console';
/* @vue/component */
export default {
    name: 'v-textarea',
    extends: VTextField,
    props: {
        autoGrow: Boolean,
        noResize: Boolean,
        outline: Boolean,
        rowHeight: {
            type: [Number, String],
            default: 24,
            validator: v => !isNaN(parseFloat(v))
        },
        rows: {
            type: [Number, String],
            default: 5,
            validator: v => !isNaN(parseInt(v, 10))
        }
    },
    computed: {
        classes() {
            return {
                'v-textarea': true,
                'v-textarea--auto-grow': this.autoGrow,
                'v-textarea--no-resize': this.noResizeHandle,
                ...VTextField.options.computed.classes.call(this, null)
            };
        },
        dynamicHeight() {
            return this.autoGrow
                ? this.inputHeight
                : 'auto';
        },
        isEnclosed() {
            return this.textarea ||
                VTextField.options.computed.isEnclosed.call(this);
        },
        noResizeHandle() {
            return this.noResize || this.autoGrow;
        }
    },
    watch: {
        lazyValue() {
            !this.internalChange && this.autoGrow && this.$nextTick(this.calculateInputHeight);
        }
    },
    mounted() {
        setTimeout(() => {
            this.autoGrow && this.calculateInputHeight();
        }, 0);
        // TODO: remove (2.0)
        if (this.autoGrow && this.noResize) {
            consoleInfo('"no-resize" is now implied when using "auto-grow", and can be removed', this);
        }
    },
    methods: {
        calculateInputHeight() {
            const input = this.$refs.input;
            if (input) {
                input.style.height = 0;
                const height = input.scrollHeight;
                const minHeight = parseInt(this.rows, 10) * parseFloat(this.rowHeight);
                // This has to be done ASAP, waiting for Vue
                // to update the DOM causes ugly layout jumping
                input.style.height = Math.max(minHeight, height) + 'px';
            }
        },
        genInput() {
            const input = VTextField.options.methods.genInput.call(this);
            input.tag = 'textarea';
            delete input.data.attrs.type;
            input.data.attrs.rows = this.rows;
            return input;
        },
        onInput(e) {
            VTextField.options.methods.onInput.call(this, e);
            this.autoGrow && this.calculateInputHeight();
        },
        onKeyDown(e) {
            // Prevents closing of a
            // dialog when pressing
            // enter
            if (this.isFocused &&
                e.keyCode === 13) {
                e.stopPropagation();
            }
            this.internalChange = true;
            this.$emit('keydown', e);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRleHRhcmVhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlRleHRhcmVhL1ZUZXh0YXJlYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUUvQyxhQUFhO0FBQ2IsT0FBTyxVQUFVLE1BQU0sMEJBQTBCLENBQUE7QUFFakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRWhELG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLFlBQVk7SUFFbEIsT0FBTyxFQUFFLFVBQVU7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsUUFBUSxFQUFFLE9BQU87UUFDakIsT0FBTyxFQUFFLE9BQU87UUFDaEIsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsRUFBRTtZQUNYLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7WUFDVixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3hDO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxZQUFZLEVBQUUsSUFBSTtnQkFDbEIsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3RDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxjQUFjO2dCQUM1QyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FB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QUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDMUIsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL190ZXh0YXJlYS5zdHlsJ1xyXG5cclxuLy8gRXh0ZW5zaW9uc1xyXG5pbXBvcnQgVlRleHRGaWVsZCBmcm9tICcuLi9WVGV4dEZpZWxkL1ZUZXh0RmllbGQnXHJcblxyXG5pbXBvcnQgeyBjb25zb2xlSW5mbyB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAndi10ZXh0YXJlYScsXHJcblxyXG4gIGV4dGVuZHM6IFZUZXh0RmllbGQsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhdXRvR3JvdzogQm9vbGVhbixcclxuICAgIG5vUmVzaXplOiBCb29sZWFuLFxyXG4gICAgb3V0bGluZTogQm9vbGVhbixcclxuICAgIHJvd0hlaWdodDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAyNCxcclxuICAgICAgdmFsaWRhdG9yOiB2ID0+ICFpc05hTihwYXJzZUZsb2F0KHYpKVxyXG4gICAgfSxcclxuICAgIHJvd3M6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogNSxcclxuICAgICAgdmFsaWRhdG9yOiB2ID0+ICFpc05hTihwYXJzZUludCh2LCAxMCkpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXRleHRhcmVhJzogdHJ1ZSxcclxuICAgICAgICAndi10ZXh0YXJlYS0tYXV0by1ncm93JzogdGhpcy5hdXRvR3JvdyxcclxuICAgICAgICAndi10ZXh0YXJlYS0tbm8tcmVzaXplJzogdGhpcy5ub1Jlc2l6ZUhhbmRsZSxcclxuICAgICAgICAuLi5WVGV4dEZpZWxkLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMsIG51bGwpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkeW5hbWljSGVpZ2h0ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXV0b0dyb3dcclxuICAgICAgICA/IHRoaXMuaW5wdXRIZWlnaHRcclxuICAgICAgICA6ICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIGlzRW5jbG9zZWQgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50ZXh0YXJlYSB8fFxyXG4gICAgICAgIFZUZXh0RmllbGQub3B0aW9ucy5jb21wdXRlZC5pc0VuY2xvc2VkLmNhbGwodGhpcylcclxuICAgIH0sXHJcbiAgICBub1Jlc2l6ZUhhbmRsZSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5vUmVzaXplIHx8IHRoaXMuYXV0b0dyb3dcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgbGF6eVZhbHVlICgpIHtcclxuICAgICAgIXRoaXMuaW50ZXJuYWxDaGFuZ2UgJiYgdGhpcy5hdXRvR3JvdyAmJiB0aGlzLiRuZXh0VGljayh0aGlzLmNhbGN1bGF0ZUlucHV0SGVpZ2h0KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuYXV0b0dyb3cgJiYgdGhpcy5jYWxjdWxhdGVJbnB1dEhlaWdodCgpXHJcbiAgICB9LCAwKVxyXG5cclxuICAgIC8vIFRPRE86IHJlbW92ZSAoMi4wKVxyXG4gICAgaWYgKHRoaXMuYXV0b0dyb3cgJiYgdGhpcy5ub1Jlc2l6ZSkge1xyXG4gICAgICBjb25zb2xlSW5mbygnXCJuby1yZXNpemVcIiBpcyBub3cgaW1wbGllZCB3aGVuIHVzaW5nIFwiYXV0by1ncm93XCIsIGFuZCBjYW4gYmUgcmVtb3ZlZCcsIHRoaXMpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgY2FsY3VsYXRlSW5wdXRIZWlnaHQgKCkge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IHRoaXMuJHJlZnMuaW5wdXRcclxuICAgICAgaWYgKGlucHV0KSB7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuaGVpZ2h0ID0gMFxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IGlucHV0LnNjcm9sbEhlaWdodFxyXG4gICAgICAgIGNvbnN0IG1pbkhlaWdodCA9IHBhcnNlSW50KHRoaXMucm93cywgMTApICogcGFyc2VGbG9hdCh0aGlzLnJvd0hlaWdodClcclxuICAgICAgICAvLyBUaGlzIGhhcyB0byBiZSBkb25lIEFTQVAsIHdhaXRpbmcgZm9yIFZ1ZVxyXG4gICAgICAgIC8vIHRvIHVwZGF0ZSB0aGUgRE9NIGNhdXNlcyB1Z2x5IGxheW91dCBqdW1waW5nXHJcbiAgICAgICAgaW5wdXQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5tYXgobWluSGVpZ2h0LCBoZWlnaHQpICsgJ3B4J1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2VuSW5wdXQgKCkge1xyXG4gICAgICBjb25zdCBpbnB1dCA9IFZUZXh0RmllbGQub3B0aW9ucy5tZXRob2RzLmdlbklucHV0LmNhbGwodGhpcylcclxuXHJcbiAgICAgIGlucHV0LnRhZyA9ICd0ZXh0YXJlYSdcclxuICAgICAgZGVsZXRlIGlucHV0LmRhdGEuYXR0cnMudHlwZVxyXG4gICAgICBpbnB1dC5kYXRhLmF0dHJzLnJvd3MgPSB0aGlzLnJvd3NcclxuXHJcbiAgICAgIHJldHVybiBpbnB1dFxyXG4gICAgfSxcclxuICAgIG9uSW5wdXQgKGUpIHtcclxuICAgICAgVlRleHRGaWVsZC5vcHRpb25zLm1ldGhvZHMub25JbnB1dC5jYWxsKHRoaXMsIGUpXHJcbiAgICAgIHRoaXMuYXV0b0dyb3cgJiYgdGhpcy5jYWxjdWxhdGVJbnB1dEhlaWdodCgpXHJcbiAgICB9LFxyXG4gICAgb25LZXlEb3duIChlKSB7XHJcbiAgICAgIC8vIFByZXZlbnRzIGNsb3Npbmcgb2YgYVxyXG4gICAgICAvLyBkaWFsb2cgd2hlbiBwcmVzc2luZ1xyXG4gICAgICAvLyBlbnRlclxyXG4gICAgICBpZiAodGhpcy5pc0ZvY3VzZWQgJiZcclxuICAgICAgICBlLmtleUNvZGUgPT09IDEzXHJcbiAgICAgICkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbnRlcm5hbENoYW5nZSA9IHRydWVcclxuICAgICAgdGhpcy4kZW1pdCgna2V5ZG93bicsIGUpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==