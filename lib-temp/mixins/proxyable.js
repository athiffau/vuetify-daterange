import Vue from 'vue';
export function factory(prop = 'value', event = 'change') {
    return Vue.extend({
        name: 'proxyable',
        model: {
            prop,
            event
        },
        props: {
            [prop]: {
                required: false
            }
        },
        data() {
            return {
                internalLazyValue: this[prop]
            };
        },
        computed: {
            internalValue: {
                get() {
                    return this.internalLazyValue;
                },
                set(val) {
                    if (val === this.internalLazyValue)
                        return;
                    this.internalLazyValue = val;
                    this.$emit(event, val);
                }
            }
        },
        watch: {
            [prop](val) {
                this.internalLazyValue = val;
            }
        }
    });
}
/* eslint-disable-next-line no-redeclare */
const Proxyable = factory();
export default Proxyable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9wcm94eWFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUF1QixNQUFNLEtBQUssQ0FBQTtBQVN6QyxNQUFNLFVBQVUsT0FBTyxDQUNyQixJQUFJLEdBQUcsT0FBTyxFQUNkLEtBQUssR0FBRyxRQUFRO0lBRWhCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQixJQUFJLEVBQUUsV0FBVztRQUVqQixLQUFLLEVBQUU7WUFDTCxJQUFJO1lBQ0osS0FBSztTQUNOO1FBRUQsS0FBSyxFQUFFO1lBQ0wsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSzthQUNoQjtTQUNGO1FBRUQsSUFBSTtZQUNGLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBWTthQUN6QyxDQUFBO1FBQ0gsQ0FBQztRQUVELFFBQVEsRUFBRTtZQUNSLGFBQWEsRUFBRTtnQkFDYixHQUFHO29CQUNELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO2dCQUMvQixDQUFDO2dCQUNELEdBQUcsQ0FBRSxHQUFRO29CQUNYLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxpQkFBaUI7d0JBQUUsT0FBTTtvQkFFMUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQTtvQkFFNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7Z0JBQ3hCLENBQUM7YUFDRjtTQUNGO1FBRUQsS0FBSyxFQUFFO1lBQ0wsQ0FBQyxJQUFJLENBQUMsQ0FBRSxHQUFHO2dCQUNULElBQUksQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUE7WUFDOUIsQ0FBQztTQUNGO0tBQ0YsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELDJDQUEyQztBQUMzQyxNQUFNLFNBQVMsR0FBRyxPQUFPLEVBQUUsQ0FBQTtBQUUzQixlQUFlLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUsIHsgVnVlQ29uc3RydWN0b3IgfSBmcm9tICd2dWUnXHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cclxuZXhwb3J0IHR5cGUgUHJveHlhYmxlPFQgZXh0ZW5kcyBzdHJpbmcgPSAndmFsdWUnPiA9IFZ1ZUNvbnN0cnVjdG9yPFZ1ZSAmIHtcclxuICBpbnRlcm5hbExhenlWYWx1ZTogdW5rbm93blxyXG4gIGludGVybmFsVmFsdWU6IHVua25vd25cclxufSAmIFJlY29yZDxULCBhbnk+PlxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhY3Rvcnk8VCBleHRlbmRzIHN0cmluZyA9ICd2YWx1ZSc+IChwcm9wPzogVCwgZXZlbnQ/OiBzdHJpbmcpOiBQcm94eWFibGU8VD5cclxuZXhwb3J0IGZ1bmN0aW9uIGZhY3RvcnkgKFxyXG4gIHByb3AgPSAndmFsdWUnLFxyXG4gIGV2ZW50ID0gJ2NoYW5nZSdcclxuKSB7XHJcbiAgcmV0dXJuIFZ1ZS5leHRlbmQoe1xyXG4gICAgbmFtZTogJ3Byb3h5YWJsZScsXHJcblxyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcCxcclxuICAgICAgZXZlbnRcclxuICAgIH0sXHJcblxyXG4gICAgcHJvcHM6IHtcclxuICAgICAgW3Byb3BdOiB7XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZGF0YSAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaW50ZXJuYWxMYXp5VmFsdWU6IHRoaXNbcHJvcF0gYXMgdW5rbm93blxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIGludGVybmFsVmFsdWU6IHtcclxuICAgICAgICBnZXQgKCk6IHVua25vd24ge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxMYXp5VmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCAodmFsOiBhbnkpIHtcclxuICAgICAgICAgIGlmICh2YWwgPT09IHRoaXMuaW50ZXJuYWxMYXp5VmFsdWUpIHJldHVyblxyXG5cclxuICAgICAgICAgIHRoaXMuaW50ZXJuYWxMYXp5VmFsdWUgPSB2YWxcclxuXHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50LCB2YWwpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHdhdGNoOiB7XHJcbiAgICAgIFtwcm9wXSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5pbnRlcm5hbExhenlWYWx1ZSA9IHZhbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlZGVjbGFyZSAqL1xyXG5jb25zdCBQcm94eWFibGUgPSBmYWN0b3J5KClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb3h5YWJsZVxyXG4iXX0=