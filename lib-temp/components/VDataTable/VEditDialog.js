import '../../stylus/components/_small-dialog.styl';
// Mixins
import Returnable from '../../mixins/returnable';
import Themeable from '../../mixins/themeable';
// Utils
import { keyCodes } from '../../util/helpers';
import VBtn from '../VBtn';
import VMenu from '../VMenu';
/* @vue/component */
export default {
    name: 'v-edit-dialog',
    mixins: [Returnable, Themeable],
    props: {
        cancelText: {
            default: 'Cancel'
        },
        large: Boolean,
        lazy: Boolean,
        persistent: Boolean,
        saveText: {
            default: 'Save'
        },
        transition: {
            type: String,
            default: 'slide-x-reverse-transition'
        }
    },
    data() {
        return {
            isActive: false
        };
    },
    watch: {
        isActive(val) {
            if (val) {
                this.$emit('open');
                setTimeout(this.focus, 50); // Give DOM time to paint
            }
            else {
                this.$emit('close');
            }
        }
    },
    methods: {
        cancel() {
            this.isActive = false;
            this.$emit('cancel');
        },
        focus() {
            const input = this.$refs.content.querySelector('input');
            input && input.focus();
        },
        genButton(fn, text) {
            return this.$createElement(VBtn, {
                props: {
                    flat: true,
                    color: 'primary',
                    light: true
                },
                on: { click: fn }
            }, text);
        },
        genActions() {
            return this.$createElement('div', {
                'class': 'v-small-dialog__actions'
            }, [
                this.genButton(this.cancel, this.cancelText),
                this.genButton(() => {
                    this.save(this.returnValue);
                    this.$emit('save');
                }, this.saveText)
            ]);
        },
        genContent() {
            return this.$createElement('div', {
                on: {
                    keydown: e => {
                        const input = this.$refs.content.querySelector('input');
                        e.keyCode === keyCodes.esc && this.cancel();
                        if (e.keyCode === keyCodes.enter && input) {
                            this.save(input.value);
                            this.$emit('save');
                        }
                    }
                },
                ref: 'content'
            }, [this.$slots.input]);
        }
    },
    render(h) {
        return h(VMenu, {
            staticClass: 'v-small-dialog',
            class: this.themeClasses,
            props: {
                contentClass: 'v-small-dialog__content',
                transition: this.transition,
                origin: 'top right',
                right: true,
                value: this.isActive,
                closeOnClick: !this.persistent,
                closeOnContentClick: false,
                lazy: this.lazy,
                light: this.light,
                dark: this.dark
            },
            on: {
                input: val => (this.isActive = val)
            }
        }, [
            h('a', {
                slot: 'activator'
            }, this.$slots.default),
            this.genContent(),
            this.large ? this.genActions() : null
        ]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkVkaXREaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGF0YVRhYmxlL1ZFZGl0RGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sNENBQTRDLENBQUE7QUFFbkQsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBRTlDLFFBQVE7QUFDUixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFN0MsT0FBTyxJQUFJLE1BQU0sU0FBUyxDQUFBO0FBQzFCLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQTtBQUU1QixvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxlQUFlO0lBRXJCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUM7SUFFL0IsS0FBSyxFQUFFO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFLFFBQVE7U0FDbEI7UUFDRCxLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxPQUFPO1FBQ2IsVUFBVSxFQUFFLE9BQU87UUFDbkIsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLE1BQU07U0FDaEI7UUFDRCxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSw0QkFBNEI7U0FDdEM7S0FDRjtJQUVELElBQUk7UUFDRixPQUFPO1lBQ0wsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLEVBQUU7UUFDTCxRQUFRLENBQUUsR0FBRztZQUNYLElBQUksR0FBRyxFQUFFO2dCQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7Z0JBQ2xCLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBLENBQUMseUJBQXlCO2FBQ3JEO2lCQUFNO2dC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SSxDQUFDLElBQUk7YUFDaEI7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQzthQUNwQztTQUNGLEVBQUU7WUFDRCxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNMLElBQUksRUFBRSxXQUFXO2FBQ2xCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDdEMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19zbWFsbC1kaWFsb2cuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgUmV0dXJuYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmV0dXJuYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG5pbXBvcnQgVkJ0biBmcm9tICcuLi9WQnRuJ1xyXG5pbXBvcnQgVk1lbnUgZnJvbSAnLi4vVk1lbnUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZWRpdC1kaWFsb2cnLFxyXG5cclxuICBtaXhpbnM6IFtSZXR1cm5hYmxlLCBUaGVtZWFibGVdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY2FuY2VsVGV4dDoge1xyXG4gICAgICBkZWZhdWx0OiAnQ2FuY2VsJ1xyXG4gICAgfSxcclxuICAgIGxhcmdlOiBCb29sZWFuLFxyXG4gICAgbGF6eTogQm9vbGVhbixcclxuICAgIHBlcnNpc3RlbnQ6IEJvb2xlYW4sXHJcbiAgICBzYXZlVGV4dDoge1xyXG4gICAgICBkZWZhdWx0OiAnU2F2ZSdcclxuICAgIH0sXHJcbiAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3NsaWRlLXgtcmV2ZXJzZS10cmFuc2l0aW9uJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuJGVtaXQoJ29wZW4nKVxyXG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5mb2N1cywgNTApIC8vIEdpdmUgRE9NIHRpbWUgdG8gcGFpbnRcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRlbWl0KCdjbG9zZScpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBjYW5jZWwgKCkge1xyXG4gICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgdGhpcy4kZW1pdCgnY2FuY2VsJylcclxuICAgIH0sXHJcbiAgICBmb2N1cyAoKSB7XHJcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy4kcmVmcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcclxuICAgICAgaW5wdXQgJiYgaW5wdXQuZm9jdXMoKVxyXG4gICAgfSxcclxuICAgIGdlbkJ1dHRvbiAoZm4sIHRleHQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkJ0biwge1xyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBmbGF0OiB0cnVlLFxyXG4gICAgICAgICAgY29sb3I6ICdwcmltYXJ5JyxcclxuICAgICAgICAgIGxpZ2h0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogeyBjbGljazogZm4gfVxyXG4gICAgICB9LCB0ZXh0KVxyXG4gICAgfSxcclxuICAgIGdlbkFjdGlvbnMgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICdjbGFzcyc6ICd2LXNtYWxsLWRpYWxvZ19fYWN0aW9ucydcclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuQnV0dG9uKHRoaXMuY2FuY2VsLCB0aGlzLmNhbmNlbFRleHQpLFxyXG4gICAgICAgIHRoaXMuZ2VuQnV0dG9uKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2F2ZSh0aGlzLnJldHVyblZhbHVlKVxyXG4gICAgICAgICAgdGhpcy4kZW1pdCgnc2F2ZScpXHJcbiAgICAgICAgfSwgdGhpcy5zYXZlVGV4dClcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Db250ZW50ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBvbjoge1xyXG4gICAgICAgICAga2V5ZG93bjogZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy4kcmVmcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcclxuICAgICAgICAgICAgZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lc2MgJiYgdGhpcy5jYW5jZWwoKVxyXG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lbnRlciAmJiBpbnB1dCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2F2ZShpbnB1dC52YWx1ZSlcclxuICAgICAgICAgICAgICB0aGlzLiRlbWl0KCdzYXZlJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAnY29udGVudCdcclxuICAgICAgfSwgW3RoaXMuJHNsb3RzLmlucHV0XSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIHJldHVybiBoKFZNZW51LCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1zbWFsbC1kaWFsb2cnLFxyXG4gICAgICBjbGFzczogdGhpcy50aGVtZUNsYXNzZXMsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgY29udGVudENsYXNzOiAndi1zbWFsbC1kaWFsb2dfX2NvbnRlbnQnLFxyXG4gICAgICAgIHRyYW5zaXRpb246IHRoaXMudHJhbnNpdGlvbixcclxuICAgICAgICBvcmlnaW46ICd0b3AgcmlnaHQnLFxyXG4gICAgICAgIHJpZ2h0OiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLmlzQWN0aXZlLFxyXG4gICAgICAgIGNsb3NlT25DbGljazogIXRoaXMucGVyc2lzdGVudCxcclxuICAgICAgICBjbG9zZU9uQ29udGVudENsaWNrOiBmYWxzZSxcclxuICAgICAgICBsYXp5OiB0aGlzLmxhenksXHJcbiAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHQsXHJcbiAgICAgICAgZGFyazogdGhpcy5kYXJrXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiB7XHJcbiAgICAgICAgaW5wdXQ6IHZhbCA9PiAodGhpcy5pc0FjdGl2ZSA9IHZhbClcclxuICAgICAgfVxyXG4gICAgfSwgW1xyXG4gICAgICBoKCdhJywge1xyXG4gICAgICAgIHNsb3Q6ICdhY3RpdmF0b3InXHJcbiAgICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpLFxyXG4gICAgICB0aGlzLmdlbkNvbnRlbnQoKSxcclxuICAgICAgdGhpcy5sYXJnZSA/IHRoaXMuZ2VuQWN0aW9ucygpIDogbnVsbFxyXG4gICAgXSlcclxuICB9XHJcbn1cclxuIl19