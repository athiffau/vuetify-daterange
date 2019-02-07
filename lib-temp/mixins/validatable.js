// Mixins
import Colorable from './colorable';
import { inject as RegistrableInject } from './registrable';
// Utilities
import { deepEqual } from '../util/helpers';
import { consoleError } from '../util/console';
import mixins from '../util/mixins';
/* @vue/component */
export default mixins(Colorable, RegistrableInject('form')).extend({
    name: 'validatable',
    props: {
        disabled: Boolean,
        error: Boolean,
        errorCount: {
            type: [Number, String],
            default: 1
        },
        errorMessages: {
            type: [String, Array],
            default: () => []
        },
        messages: {
            type: [String, Array],
            default: () => []
        },
        readonly: Boolean,
        rules: {
            type: Array,
            default: () => []
        },
        success: Boolean,
        successMessages: {
            type: [String, Array],
            default: () => []
        },
        validateOnBlur: Boolean,
        value: { required: false }
    },
    data() {
        return {
            errorBucket: [],
            hasColor: false,
            hasFocused: false,
            hasInput: false,
            isFocused: false,
            isResetting: false,
            lazyValue: this.value,
            valid: false
        };
    },
    computed: {
        hasError() {
            return (this.internalErrorMessages.length > 0 ||
                this.errorBucket.length > 0 ||
                this.error);
        },
        // TODO: Add logic that allows the user to enable based
        // upon a good validation
        hasSuccess() {
            return (this.internalSuccessMessages.length > 0 ||
                this.success);
        },
        externalError() {
            return this.internalErrorMessages.length > 0 || this.error;
        },
        hasMessages() {
            return this.validationTarget.length > 0;
        },
        hasState() {
            return (this.hasSuccess ||
                (this.shouldValidate && this.hasError));
        },
        internalErrorMessages() {
            return this.genInternalMessages(this.errorMessages);
        },
        internalMessages() {
            return this.genInternalMessages(this.messages);
        },
        internalSuccessMessages() {
            return this.genInternalMessages(this.successMessages);
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('input', val);
            }
        },
        shouldValidate() {
            if (this.externalError)
                return true;
            if (this.isResetting)
                return false;
            return this.validateOnBlur
                ? this.hasFocused && !this.isFocused
                : (this.hasInput || this.hasFocused);
        },
        validations() {
            return this.validationTarget.slice(0, Number(this.errorCount));
        },
        validationState() {
            if (this.hasError && this.shouldValidate)
                return 'error';
            if (this.hasSuccess)
                return 'success';
            if (this.hasColor)
                return this.color;
            return undefined;
        },
        validationTarget() {
            if (this.internalErrorMessages.length > 0) {
                return this.internalErrorMessages;
            }
            else if (this.successMessages.length > 0) {
                return this.internalSuccessMessages;
            }
            else if (this.messages.length > 0) {
                return this.internalMessages;
            }
            else if (this.shouldValidate) {
                return this.errorBucket;
            }
            else
                return [];
        }
    },
    watch: {
        rules: {
            handler(newVal, oldVal) {
                if (deepEqual(newVal, oldVal))
                    return;
                this.validate();
            },
            deep: true
        },
        internalValue() {
            // If it's the first time we're setting input,
            // mark it with hasInput
            this.hasInput = true;
            this.validateOnBlur || this.$nextTick(this.validate);
        },
        isFocused(val) {
            // Should not check validation
            // if disabled or readonly
            if (!val &&
                !this.disabled &&
                !this.readonly) {
                this.hasFocused = true;
                this.validateOnBlur && this.validate();
            }
        },
        isResetting() {
            setTimeout(() => {
                this.hasInput = false;
                this.hasFocused = false;
                this.isResetting = false;
                this.validate();
            }, 0);
        },
        hasError(val) {
            if (this.shouldValidate) {
                this.$emit('update:error', val);
            }
        },
        value(val) {
            this.lazyValue = val;
        }
    },
    beforeMount() {
        this.validate();
    },
    created() {
        this.form && this.form.register(this);
    },
    beforeDestroy() {
        this.form && this.form.unregister(this);
    },
    methods: {
        genInternalMessages(messages) {
            if (!messages)
                return [];
            else if (Array.isArray(messages))
                return messages;
            else
                return [messages];
        },
        /** @public */
        reset() {
            this.isResetting = true;
            this.internalValue = Array.isArray(this.internalValue)
                ? []
                : undefined;
        },
        /** @public */
        resetValidation() {
            this.isResetting = true;
        },
        /** @public */
        validate(force = false, value) {
            const errorBucket = [];
            value = value || this.internalValue;
            if (force)
                this.hasInput = this.hasFocused = true;
            for (let index = 0; index < this.rules.length; index++) {
                const rule = this.rules[index];
                const valid = typeof rule === 'function' ? rule(value) : rule;
                if (typeof valid === 'string') {
                    errorBucket.push(valid);
                }
                else if (typeof valid !== 'boolean') {
                    consoleError(`Rules should return a string or boolean, received '${typeof valid}' instead`, this);
                }
            }
            this.errorBucket = errorBucket;
            this.valid = errorBucket.length === 0;
            return this.valid;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWl4aW5zL3ZhbGlkYXRhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUE7QUFDbkMsT0FBTyxFQUFFLE1BQU0sSUFBSSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUUzRCxZQUFZO0FBQ1osT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQUM5QyxPQUFPLE1BQU0sTUFBTSxnQkFBZ0IsQ0FBQTtBQVFuQyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQ25CLFNBQVMsRUFDVCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FDMUIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsYUFBYTtJQUVuQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUUsT0FBTztRQUNkLFVBQVUsRUFBRTtZQUNWLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7WUFDckIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7U0FDZTtRQUNsQyxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1NBQ2U7UUFDbEMsUUFBUSxFQUFFLE9BQU87UUFDakIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtTQUN1QjtRQUMxQyxPQUFPLEVBQUUsT0FB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QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7aUJBQ3hCO3FCQUFNLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxFQUFFO29CQUNyQyxZQUFZLENBQUMsc0RBQXNELE9BQU8sS0FBSyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUE7aUJBQ2xHO2FBQ0Y7WUFFRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtZQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBO1lBRXJDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUNuQixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuL2NvbG9yYWJsZSdcclxuaW1wb3J0IHsgaW5qZWN0IGFzIFJlZ2lzdHJhYmxlSW5qZWN0IH0gZnJvbSAnLi9yZWdpc3RyYWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgeyBkZWVwRXF1YWwgfSBmcm9tICcuLi91dGlsL2hlbHBlcnMnXHJcbmltcG9ydCB7IGNvbnNvbGVFcnJvciB9IGZyb20gJy4uL3V0aWwvY29uc29sZSdcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuZXhwb3J0IHR5cGUgVnVldGlmeVJ1bGVWYWxpZGF0b3IgPSAodmFsdWU6IGFueSkgPT4gc3RyaW5nIHwgZmFsc2VcclxuZXhwb3J0IHR5cGUgVnVldGlmeU1lc3NhZ2UgPSBzdHJpbmcgfCBzdHJpbmdbXVxyXG5leHBvcnQgdHlwZSBWdWV0aWZ5UnVsZVZhbGlkYXRpb25zID0gKFZ1ZXRpZnlSdWxlVmFsaWRhdG9yIHwgc3RyaW5nKVtdXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgQ29sb3JhYmxlLFxyXG4gIFJlZ2lzdHJhYmxlSW5qZWN0KCdmb3JtJylcclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2YWxpZGF0YWJsZScsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBkaXNhYmxlZDogQm9vbGVhbixcclxuICAgIGVycm9yOiBCb29sZWFuLFxyXG4gICAgZXJyb3JDb3VudDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAxXHJcbiAgICB9LFxyXG4gICAgZXJyb3JNZXNzYWdlczoge1xyXG4gICAgICB0eXBlOiBbU3RyaW5nLCBBcnJheV0sXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdXHJcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8VnVldGlmeU1lc3NhZ2U+LFxyXG4gICAgbWVzc2FnZXM6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgQXJyYXldLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBbXVxyXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPFZ1ZXRpZnlNZXNzYWdlPixcclxuICAgIHJlYWRvbmx5OiBCb29sZWFuLFxyXG4gICAgcnVsZXM6IHtcclxuICAgICAgdHlwZTogQXJyYXksXHJcbiAgICAgIGRlZmF1bHQ6ICgpID0+IFtdXHJcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8VnVldGlmeVJ1bGVWYWxpZGF0aW9ucz4sXHJcbiAgICBzdWNjZXNzOiBCb29sZWFuLFxyXG4gICAgc3VjY2Vzc01lc3NhZ2VzOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIEFycmF5XSxcclxuICAgICAgZGVmYXVsdDogKCkgPT4gW11cclxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjxWdWV0aWZ5TWVzc2FnZT4sXHJcbiAgICB2YWxpZGF0ZU9uQmx1cjogQm9vbGVhbixcclxuICAgIHZhbHVlOiB7IHJlcXVpcmVkOiBmYWxzZSB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBlcnJvckJ1Y2tldDogW10gYXMgc3RyaW5nW10sXHJcbiAgICAgIGhhc0NvbG9yOiBmYWxzZSxcclxuICAgICAgaGFzRm9jdXNlZDogZmFsc2UsXHJcbiAgICAgIGhhc0lucHV0OiBmYWxzZSxcclxuICAgICAgaXNGb2N1c2VkOiBmYWxzZSxcclxuICAgICAgaXNSZXNldHRpbmc6IGZhbHNlLFxyXG4gICAgICBsYXp5VmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgIHZhbGlkOiBmYWxzZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBoYXNFcnJvciAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgdGhpcy5pbnRlcm5hbEVycm9yTWVzc2FnZXMubGVuZ3RoID4gMCB8fFxyXG4gICAgICAgIHRoaXMuZXJyb3JCdWNrZXQubGVuZ3RoID4gMCB8fFxyXG4gICAgICAgIHRoaXMuZXJyb3JcclxuICAgICAgKVxyXG4gICAgfSxcclxuICAgIC8vIFRPRE86IEFkZCBsb2dpYyB0aGF0IGFsbG93cyB0aGUgdXNlciB0byBlbmFibGUgYmFzZWRcclxuICAgIC8vIHVwb24gYSBnb29kIHZhbGlkYXRpb25cclxuICAgIGhhc1N1Y2Nlc3MgKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxTdWNjZXNzTWVzc2FnZXMubGVuZ3RoID4gMCB8fFxyXG4gICAgICAgIHRoaXMuc3VjY2Vzc1xyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgZXh0ZXJuYWxFcnJvciAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsRXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwIHx8IHRoaXMuZXJyb3JcclxuICAgIH0sXHJcbiAgICBoYXNNZXNzYWdlcyAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRpb25UYXJnZXQubGVuZ3RoID4gMFxyXG4gICAgfSxcclxuICAgIGhhc1N0YXRlICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB0aGlzLmhhc1N1Y2Nlc3MgfHxcclxuICAgICAgICAodGhpcy5zaG91bGRWYWxpZGF0ZSAmJiB0aGlzLmhhc0Vycm9yKVxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxFcnJvck1lc3NhZ2VzICgpOiBWdWV0aWZ5UnVsZVZhbGlkYXRpb25zIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuSW50ZXJuYWxNZXNzYWdlcyh0aGlzLmVycm9yTWVzc2FnZXMpXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxNZXNzYWdlcyAoKTogVnVldGlmeVJ1bGVWYWxpZGF0aW9ucyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdlbkludGVybmFsTWVzc2FnZXModGhpcy5tZXNzYWdlcylcclxuICAgIH0sXHJcbiAgICBpbnRlcm5hbFN1Y2Nlc3NNZXNzYWdlcyAoKTogVnVldGlmeVJ1bGVWYWxpZGF0aW9ucyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdlbkludGVybmFsTWVzc2FnZXModGhpcy5zdWNjZXNzTWVzc2FnZXMpXHJcbiAgICB9LFxyXG4gICAgaW50ZXJuYWxWYWx1ZToge1xyXG4gICAgICBnZXQgKCk6IHVua25vd24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxhenlWYWx1ZVxyXG4gICAgICB9LFxyXG4gICAgICBzZXQgKHZhbDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcclxuXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG91bGRWYWxpZGF0ZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLmV4dGVybmFsRXJyb3IpIHJldHVybiB0cnVlXHJcbiAgICAgIGlmICh0aGlzLmlzUmVzZXR0aW5nKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlT25CbHVyXHJcbiAgICAgICAgPyB0aGlzLmhhc0ZvY3VzZWQgJiYgIXRoaXMuaXNGb2N1c2VkXHJcbiAgICAgICAgOiAodGhpcy5oYXNJbnB1dCB8fCB0aGlzLmhhc0ZvY3VzZWQpXHJcbiAgICB9LFxyXG4gICAgdmFsaWRhdGlvbnMgKCk6IFZ1ZXRpZnlSdWxlVmFsaWRhdGlvbnMge1xyXG4gICAgICByZXR1cm4gdGhpcy52YWxpZGF0aW9uVGFyZ2V0LnNsaWNlKDAsIE51bWJlcih0aGlzLmVycm9yQ291bnQpKVxyXG4gICAgfSxcclxuICAgIHZhbGlkYXRpb25TdGF0ZSAoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICAgICAgaWYgKHRoaXMuaGFzRXJyb3IgJiYgdGhpcy5zaG91bGRWYWxpZGF0ZSkgcmV0dXJuICdlcnJvcidcclxuICAgICAgaWYgKHRoaXMuaGFzU3VjY2VzcykgcmV0dXJuICdzdWNjZXNzJ1xyXG4gICAgICBpZiAodGhpcy5oYXNDb2xvcikgcmV0dXJuIHRoaXMuY29sb3JcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgfSxcclxuICAgIHZhbGlkYXRpb25UYXJnZXQgKCk6IFZ1ZXRpZnlSdWxlVmFsaWRhdGlvbnMge1xyXG4gICAgICBpZiAodGhpcy5pbnRlcm5hbEVycm9yTWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsRXJyb3JNZXNzYWdlc1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3VjY2Vzc01lc3NhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN1Y2Nlc3NNZXNzYWdlc1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMubWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsTWVzc2FnZXNcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNob3VsZFZhbGlkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JCdWNrZXRcclxuICAgICAgfSBlbHNlIHJldHVybiBbXVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBydWxlczoge1xyXG4gICAgICBoYW5kbGVyIChuZXdWYWwsIG9sZFZhbCkge1xyXG4gICAgICAgIGlmIChkZWVwRXF1YWwobmV3VmFsLCBvbGRWYWwpKSByZXR1cm5cclxuICAgICAgICB0aGlzLnZhbGlkYXRlKClcclxuICAgICAgfSxcclxuICAgICAgZGVlcDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGludGVybmFsVmFsdWUgKCkge1xyXG4gICAgICAvLyBJZiBpdCdzIHRoZSBmaXJzdCB0aW1lIHdlJ3JlIHNldHRpbmcgaW5wdXQsXHJcbiAgICAgIC8vIG1hcmsgaXQgd2l0aCBoYXNJbnB1dFxyXG4gICAgICB0aGlzLmhhc0lucHV0ID0gdHJ1ZVxyXG4gICAgICB0aGlzLnZhbGlkYXRlT25CbHVyIHx8IHRoaXMuJG5leHRUaWNrKHRoaXMudmFsaWRhdGUpXHJcbiAgICB9LFxyXG4gICAgaXNGb2N1c2VkICh2YWwpIHtcclxuICAgICAgLy8gU2hvdWxkIG5vdCBjaGVjayB2YWxpZGF0aW9uXHJcbiAgICAgIC8vIGlmIGRpc2FibGVkIG9yIHJlYWRvbmx5XHJcbiAgICAgIGlmIChcclxuICAgICAgICAhdmFsICYmXHJcbiAgICAgICAgIXRoaXMuZGlzYWJsZWQgJiZcclxuICAgICAgICAhdGhpcy5yZWFkb25seVxyXG4gICAgICApIHtcclxuICAgICAgICB0aGlzLmhhc0ZvY3VzZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZU9uQmx1ciAmJiB0aGlzLnZhbGlkYXRlKClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzUmVzZXR0aW5nICgpIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5oYXNJbnB1dCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5oYXNGb2N1c2VkID0gZmFsc2VcclxuICAgICAgICB0aGlzLmlzUmVzZXR0aW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnZhbGlkYXRlKClcclxuICAgICAgfSwgMClcclxuICAgIH0sXHJcbiAgICBoYXNFcnJvciAodmFsKSB7XHJcbiAgICAgIGlmICh0aGlzLnNob3VsZFZhbGlkYXRlKSB7XHJcbiAgICAgICAgdGhpcy4kZW1pdCgndXBkYXRlOmVycm9yJywgdmFsKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdmFsdWUgKHZhbCkge1xyXG4gICAgICB0aGlzLmxhenlWYWx1ZSA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZU1vdW50ICgpIHtcclxuICAgIHRoaXMudmFsaWRhdGUoKVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWQgKCkge1xyXG4gICAgdGhpcy5mb3JtICYmIHRoaXMuZm9ybS5yZWdpc3Rlcih0aGlzKVxyXG4gIH0sXHJcblxyXG4gIGJlZm9yZURlc3Ryb3kgKCkge1xyXG4gICAgdGhpcy5mb3JtICYmIHRoaXMuZm9ybS51bnJlZ2lzdGVyKHRoaXMpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuSW50ZXJuYWxNZXNzYWdlcyAobWVzc2FnZXM6IFZ1ZXRpZnlNZXNzYWdlKTogVnVldGlmeVJ1bGVWYWxpZGF0aW9ucyB7XHJcbiAgICAgIGlmICghbWVzc2FnZXMpIHJldHVybiBbXVxyXG4gICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkgcmV0dXJuIG1lc3NhZ2VzXHJcbiAgICAgIGVsc2UgcmV0dXJuIFttZXNzYWdlc11cclxuICAgIH0sXHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgcmVzZXQgKCkge1xyXG4gICAgICB0aGlzLmlzUmVzZXR0aW5nID0gdHJ1ZVxyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBBcnJheS5pc0FycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSlcclxuICAgICAgICA/IFtdXHJcbiAgICAgICAgOiB1bmRlZmluZWRcclxuICAgIH0sXHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgcmVzZXRWYWxpZGF0aW9uICgpIHtcclxuICAgICAgdGhpcy5pc1Jlc2V0dGluZyA9IHRydWVcclxuICAgIH0sXHJcbiAgICAvKiogQHB1YmxpYyAqL1xyXG4gICAgdmFsaWRhdGUgKGZvcmNlID0gZmFsc2UsIHZhbHVlPzogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IGVycm9yQnVja2V0ID0gW11cclxuICAgICAgdmFsdWUgPSB2YWx1ZSB8fCB0aGlzLmludGVybmFsVmFsdWVcclxuXHJcbiAgICAgIGlmIChmb3JjZSkgdGhpcy5oYXNJbnB1dCA9IHRoaXMuaGFzRm9jdXNlZCA9IHRydWVcclxuXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJ1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIGNvbnN0IHJ1bGUgPSB0aGlzLnJ1bGVzW2luZGV4XVxyXG4gICAgICAgIGNvbnN0IHZhbGlkID0gdHlwZW9mIHJ1bGUgPT09ICdmdW5jdGlvbicgPyBydWxlKHZhbHVlKSA6IHJ1bGVcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGVycm9yQnVja2V0LnB1c2godmFsaWQpXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsaWQgIT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgY29uc29sZUVycm9yKGBSdWxlcyBzaG91bGQgcmV0dXJuIGEgc3RyaW5nIG9yIGJvb2xlYW4sIHJlY2VpdmVkICcke3R5cGVvZiB2YWxpZH0nIGluc3RlYWRgLCB0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5lcnJvckJ1Y2tldCA9IGVycm9yQnVja2V0XHJcbiAgICAgIHRoaXMudmFsaWQgPSBlcnJvckJ1Y2tldC5sZW5ndGggPT09IDBcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLnZhbGlkXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXX0=