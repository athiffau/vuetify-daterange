// Styles
import '../../stylus/components/_forms.styl';
import { provide as RegistrableProvide } from '../../mixins/registrable';
/* @vue/component */
export default {
    name: 'v-form',
    mixins: [RegistrableProvide('form')],
    inheritAttrs: false,
    props: {
        value: Boolean,
        lazyValidation: Boolean
    },
    data() {
        return {
            inputs: [],
            watchers: [],
            errorBag: {}
        };
    },
    watch: {
        errorBag: {
            handler() {
                const errors = Object.values(this.errorBag).includes(true);
                this.$emit('input', !errors);
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        watchInput(input) {
            const watcher = input => {
                return input.$watch('hasError', val => {
                    this.$set(this.errorBag, input._uid, val);
                }, { immediate: true });
            };
            const watchers = {
                _uid: input._uid,
                valid: undefined,
                shouldValidate: undefined
            };
            if (this.lazyValidation) {
                // Only start watching inputs if we need to
                watchers.shouldValidate = input.$watch('shouldValidate', val => {
                    if (!val)
                        return;
                    // Only watch if we're not already doing it
                    if (this.errorBag.hasOwnProperty(input._uid))
                        return;
                    watchers.valid = watcher(input);
                });
            }
            else {
                watchers.valid = watcher(input);
            }
            return watchers;
        },
        /** @public */
        validate() {
            const errors = this.inputs.filter(input => !input.validate(true)).length;
            return !errors;
        },
        /** @public */
        reset() {
            for (let i = this.inputs.length; i--;) {
                this.inputs[i].reset();
            }
            if (this.lazyValidation) {
                // Account for timeout in validatable
                setTimeout(() => {
                    this.errorBag = {};
                }, 0);
            }
        },
        /** @public */
        resetValidation() {
            for (let i = this.inputs.length; i--;) {
                this.inputs[i].resetValidation();
            }
            if (this.lazyValidation) {
                // Account for timeout in validatable
                setTimeout(() => {
                    this.errorBag = {};
                }, 0);
            }
        },
        register(input) {
            const unwatch = this.watchInput(input);
            this.inputs.push(input);
            this.watchers.push(unwatch);
        },
        unregister(input) {
            const found = this.inputs.find(i => i._uid === input._uid);
            if (!found)
                return;
            const unwatch = this.watchers.find(i => i._uid === found._uid);
            unwatch.valid && unwatch.valid();
            unwatch.shouldValidate && unwatch.shouldValidate();
            this.watchers = this.watchers.filter(i => i._uid !== found._uid);
            this.inputs = this.inputs.filter(i => i._uid !== found._uid);
            this.$delete(this.errorBag, found._uid);
        }
    },
    render(h) {
        return h('form', {
            staticClass: 'v-form',
            attrs: Object.assign({
                novalidate: true
            }, this.$attrs),
            on: {
                submit: e => this.$emit('submit', e)
            }
        }, this.$slots.default);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRm9ybS9WRm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUU1QyxPQUFPLEVBQUUsT0FBTyxJQUFJLGtCQUFrQixFQUFFLE1BQU0sMEJBQTBCLENBQUE7QUFFeEUsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsUUFBUTtJQUVkLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBDLFlBQVksRUFBRSxLQUFLO0lBRW5CLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsY0FBYyxFQUFFLE9BQU87S0FDeEI7SUFFRCxJQUFJO1FBQ0YsT0FBTztZQUNMLE1BQU0sRUFBRSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEVBQUU7WUFDWixRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFO1lBQ1IsT0FBTztnQkFDTCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDOUIsQ0FBQztZQUNELElBQUksRUFBRSxJQUFJO1lBQ1YsU0FBUyxFQUFFLElBQUk7U0FDaEI7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFVBQVUsQ0FBRSxLQUFLO1lBQ2YsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEVBQUU7Z0JBQ3RCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFB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cy9jb21wb25lbnRzL19mb3Jtcy5zdHlsJ1xyXG5cclxuaW1wb3J0IHsgcHJvdmlkZSBhcyBSZWdpc3RyYWJsZVByb3ZpZGUgfSBmcm9tICcuLi8uLi9taXhpbnMvcmVnaXN0cmFibGUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZm9ybScsXHJcblxyXG4gIG1peGluczogW1JlZ2lzdHJhYmxlUHJvdmlkZSgnZm9ybScpXSxcclxuXHJcbiAgaW5oZXJpdEF0dHJzOiBmYWxzZSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHZhbHVlOiBCb29sZWFuLFxyXG4gICAgbGF6eVZhbGlkYXRpb246IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlucHV0czogW10sXHJcbiAgICAgIHdhdGNoZXJzOiBbXSxcclxuICAgICAgZXJyb3JCYWc6IHt9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGVycm9yQmFnOiB7XHJcbiAgICAgIGhhbmRsZXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGVycm9ycyA9IE9iamVjdC52YWx1ZXModGhpcy5lcnJvckJhZykuaW5jbHVkZXModHJ1ZSlcclxuICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsICFlcnJvcnMpXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHdhdGNoSW5wdXQgKGlucHV0KSB7XHJcbiAgICAgIGNvbnN0IHdhdGNoZXIgPSBpbnB1dCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0LiR3YXRjaCgnaGFzRXJyb3InLCB2YWwgPT4ge1xyXG4gICAgICAgICAgdGhpcy4kc2V0KHRoaXMuZXJyb3JCYWcsIGlucHV0Ll91aWQsIHZhbClcclxuICAgICAgICB9LCB7IGltbWVkaWF0ZTogdHJ1ZSB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB3YXRjaGVycyA9IHtcclxuICAgICAgICBfdWlkOiBpbnB1dC5fdWlkLFxyXG4gICAgICAgIHZhbGlkOiB1bmRlZmluZWQsXHJcbiAgICAgICAgc2hvdWxkVmFsaWRhdGU6IHVuZGVmaW5lZFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5sYXp5VmFsaWRhdGlvbikge1xyXG4gICAgICAgIC8vIE9ubHkgc3RhcnQgd2F0Y2hpbmcgaW5wdXRzIGlmIHdlIG5lZWQgdG9cclxuICAgICAgICB3YXRjaGVycy5zaG91bGRWYWxpZGF0ZSA9IGlucHV0LiR3YXRjaCgnc2hvdWxkVmFsaWRhdGUnLCB2YWwgPT4ge1xyXG4gICAgICAgICAgaWYgKCF2YWwpIHJldHVyblxyXG5cclxuICAgICAgICAgIC8vIE9ubHkgd2F0Y2ggaWYgd2UncmUgbm90IGFscmVhZHkgZG9pbmcgaXRcclxuICAgICAgICAgIGlmICh0aGlzLmVycm9yQmFnLmhhc093blByb3BlcnR5KGlucHV0Ll91aWQpKSByZXR1cm5cclxuXHJcbiAgICAgICAgICB3YXRjaGVycy52YWxpZCA9IHdhdGNoZXIoaW5wdXQpXHJcbiAgICAgICAgfSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3YXRjaGVycy52YWxpZCA9IHdhdGNoZXIoaW5wdXQpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB3YXRjaGVyc1xyXG4gICAgfSxcclxuICAgIC8qKiBAcHVibGljICovXHJcbiAgICB2YWxpZGF0ZSAoKSB7XHJcbiAgICAgIGNvbnN0IGVycm9ycyA9IHRoaXMuaW5wdXRzLmZpbHRlcihpbnB1dCA9PiAhaW5wdXQudmFsaWRhdGUodHJ1ZSkpLmxlbmd0aFxyXG4gICAgICByZXR1cm4gIWVycm9yc1xyXG4gICAgfSxcclxuICAgIC8qKiBAcHVibGljICovXHJcbiAgICByZXNldCAoKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLmlucHV0cy5sZW5ndGg7IGktLTspIHtcclxuICAgICAgICB0aGlzLmlucHV0c1tpXS5yZXNldCgpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMubGF6eVZhbGlkYXRpb24pIHtcclxuICAgICAgICAvLyBBY2NvdW50IGZvciB0aW1lb3V0IGluIHZhbGlkYXRhYmxlXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmVycm9yQmFnID0ge31cclxuICAgICAgICB9LCAwKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqIEBwdWJsaWMgKi9cclxuICAgIHJlc2V0VmFsaWRhdGlvbiAoKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLmlucHV0cy5sZW5ndGg7IGktLTspIHtcclxuICAgICAgICB0aGlzLmlucHV0c1tpXS5yZXNldFZhbGlkYXRpb24oKVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmxhenlWYWxpZGF0aW9uKSB7XHJcbiAgICAgICAgLy8gQWNjb3VudCBmb3IgdGltZW91dCBpbiB2YWxpZGF0YWJsZVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5lcnJvckJhZyA9IHt9XHJcbiAgICAgICAgfSwgMClcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlZ2lzdGVyIChpbnB1dCkge1xyXG4gICAgICBjb25zdCB1bndhdGNoID0gdGhpcy53YXRjaElucHV0KGlucHV0KVxyXG4gICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0KVxyXG4gICAgICB0aGlzLndhdGNoZXJzLnB1c2godW53YXRjaClcclxuICAgIH0sXHJcbiAgICB1bnJlZ2lzdGVyIChpbnB1dCkge1xyXG4gICAgICBjb25zdCBmb3VuZCA9IHRoaXMuaW5wdXRzLmZpbmQoaSA9PiBpLl91aWQgPT09IGlucHV0Ll91aWQpXHJcblxyXG4gICAgICBpZiAoIWZvdW5kKSByZXR1cm5cclxuXHJcbiAgICAgIGNvbnN0IHVud2F0Y2ggPSB0aGlzLndhdGNoZXJzLmZpbmQoaSA9PiBpLl91aWQgPT09IGZvdW5kLl91aWQpXHJcbiAgICAgIHVud2F0Y2gudmFsaWQgJiYgdW53YXRjaC52YWxpZCgpXHJcbiAgICAgIHVud2F0Y2guc2hvdWxkVmFsaWRhdGUgJiYgdW53YXRjaC5zaG91bGRWYWxpZGF0ZSgpXHJcblxyXG4gICAgICB0aGlzLndhdGNoZXJzID0gdGhpcy53YXRjaGVycy5maWx0ZXIoaSA9PiBpLl91aWQgIT09IGZvdW5kLl91aWQpXHJcbiAgICAgIHRoaXMuaW5wdXRzID0gdGhpcy5pbnB1dHMuZmlsdGVyKGkgPT4gaS5fdWlkICE9PSBmb3VuZC5fdWlkKVxyXG4gICAgICB0aGlzLiRkZWxldGUodGhpcy5lcnJvckJhZywgZm91bmQuX3VpZClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIHJldHVybiBoKCdmb3JtJywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtZm9ybScsXHJcbiAgICAgIGF0dHJzOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICBub3ZhbGlkYXRlOiB0cnVlXHJcbiAgICAgIH0sIHRoaXMuJGF0dHJzKSxcclxuICAgICAgb246IHtcclxuICAgICAgICBzdWJtaXQ6IGUgPT4gdGhpcy4kZW1pdCgnc3VibWl0JywgZSlcclxuICAgICAgfVxyXG4gICAgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICB9XHJcbn1cclxuIl19