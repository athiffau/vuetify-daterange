import '../../stylus/components/_date-picker-title.styl';
// Components
import VIcon from '../VIcon';
// Mixins
import PickerButton from '../../mixins/picker-button';
// Utils
import mixins from '../../util/mixins';
export default mixins(PickerButton
/* @vue/component */
).extend({
    name: 'v-date-picker-title',
    props: {
        date: {
            type: String,
            default: ''
        },
        disabled: Boolean,
        readonly: Boolean,
        selectingYear: Boolean,
        value: {
            type: String
        },
        year: {
            type: [Number, String],
            default: ''
        },
        yearIcon: {
            type: String
        }
    },
    data: () => ({
        isReversing: false
    }),
    computed: {
        computedTransition() {
            return this.isReversing ? 'picker-reverse-transition' : 'picker-transition';
        }
    },
    watch: {
        value(val, prev) {
            this.isReversing = val < prev;
        }
    },
    methods: {
        genYearIcon() {
            return this.$createElement(VIcon, {
                props: {
                    dark: true
                }
            }, this.yearIcon);
        },
        getYearBtn() {
            return this.genPickerButton('selectingYear', true, [
                String(this.year),
                this.yearIcon ? this.genYearIcon() : null
            ], false, 'v-date-picker-title__year');
        },
        genTitleText() {
            return this.$createElement('transition', {
                props: {
                    name: this.computedTransition
                }
            }, [
                this.$createElement('div', {
                    domProps: { innerHTML: this.date || '&nbsp;' },
                    key: this.value
                })
            ]);
        },
        genTitleDate() {
            return this.genPickerButton('selectingYear', false, [this.genTitleText()], false, 'v-date-picker-title__date');
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'v-date-picker-title',
            'class': {
                'v-date-picker-title--disabled': this.disabled
            }
        }, [
            this.getYearBtn(),
            this.genTitleDate()
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRhdGVQaWNrZXJUaXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRlUGlja2VyL1ZEYXRlUGlja2VyVGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxpREFBaUQsQ0FBQTtBQUV4RCxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFlBQVksTUFBTSw0QkFBNEIsQ0FBQTtBQUVyRCxRQUFRO0FBQ1IsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsZUFBZSxNQUFNLENBQ25CLFlBQVk7QUFDZCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUscUJBQXFCO0lBRTNCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLGFBQWEsRUFBRSxPQUFPO1FBQ3RCLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1NBQ2I7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtTQUNiO0tBQ0Y7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFdBQVcsRUFBRSxLQUFLO0tBQ25CLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixrQkFBa0I7WUFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUE7UUFDN0UsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsS0FBSyxDQUFFLEdBQVcsRUFBRSxJQUFZO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtRQUMvQixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJO2lCQUNYO2FBQ0YsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDbkIsQ0FBQztRQUNELFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRTtnQkFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTthQUMxQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO1FBQ3hDLENBQUM7UUFDRCxZQUFZO1lBQ1YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRTtnQkFDdkMsS0FBSyxFQUFFO29CQUNMLElBQUksRUFBRSxJQUFJLENBQUMsa0JBQWtCO2lCQUM5QjthQUNGLEVBQUU7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7b0JBQ3pCLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtvQkFDOUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLO2lCQUNoQixDQUFDO2FBQ0gsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFlBQVk7WUFDVixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO1FBQ2hILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxPQUFPLEVBQUU7Z0JBQ1AsK0JBQStCLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDL0M7U0FDRixFQUFFO1lBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ3BCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19kYXRlLXBpY2tlci10aXRsZS5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgVkljb24gZnJvbSAnLi4vVkljb24nXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IFBpY2tlckJ1dHRvbiBmcm9tICcuLi8uLi9taXhpbnMvcGlja2VyLWJ1dHRvbidcclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBQaWNrZXJCdXR0b25cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWRhdGUtcGlja2VyLXRpdGxlJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGRhdGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJ1xyXG4gICAgfSxcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXHJcbiAgICBzZWxlY3RpbmdZZWFyOiBCb29sZWFuLFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICB9LFxyXG4gICAgeWVhcjoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAnJ1xyXG4gICAgfSxcclxuICAgIHllYXJJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBpc1JldmVyc2luZzogZmFsc2VcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvbXB1dGVkVHJhbnNpdGlvbiAoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaXNSZXZlcnNpbmcgPyAncGlja2VyLXJldmVyc2UtdHJhbnNpdGlvbicgOiAncGlja2VyLXRyYW5zaXRpb24nXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIHZhbHVlICh2YWw6IHN0cmluZywgcHJldjogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMuaXNSZXZlcnNpbmcgPSB2YWwgPCBwcmV2XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuWWVhckljb24gKCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoVkljb24sIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgZGFyazogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgdGhpcy55ZWFySWNvbilcclxuICAgIH0sXHJcbiAgICBnZXRZZWFyQnRuICgpOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdlblBpY2tlckJ1dHRvbignc2VsZWN0aW5nWWVhcicsIHRydWUsIFtcclxuICAgICAgICBTdHJpbmcodGhpcy55ZWFyKSxcclxuICAgICAgICB0aGlzLnllYXJJY29uID8gdGhpcy5nZW5ZZWFySWNvbigpIDogbnVsbFxyXG4gICAgICBdLCBmYWxzZSwgJ3YtZGF0ZS1waWNrZXItdGl0bGVfX3llYXInKVxyXG4gICAgfSxcclxuICAgIGdlblRpdGxlVGV4dCAoKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndHJhbnNpdGlvbicsIHtcclxuICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgbmFtZTogdGhpcy5jb21wdXRlZFRyYW5zaXRpb25cclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgICBkb21Qcm9wczogeyBpbm5lckhUTUw6IHRoaXMuZGF0ZSB8fCAnJm5ic3A7JyB9LFxyXG4gICAgICAgICAga2V5OiB0aGlzLnZhbHVlXHJcbiAgICAgICAgfSlcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5UaXRsZURhdGUgKCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuUGlja2VyQnV0dG9uKCdzZWxlY3RpbmdZZWFyJywgZmFsc2UsIFt0aGlzLmdlblRpdGxlVGV4dCgpXSwgZmFsc2UsICd2LWRhdGUtcGlja2VyLXRpdGxlX19kYXRlJylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICByZXR1cm4gaCgnZGl2Jywge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtZGF0ZS1waWNrZXItdGl0bGUnLFxyXG4gICAgICAnY2xhc3MnOiB7XHJcbiAgICAgICAgJ3YtZGF0ZS1waWNrZXItdGl0bGUtLWRpc2FibGVkJzogdGhpcy5kaXNhYmxlZFxyXG4gICAgICB9XHJcbiAgICB9LCBbXHJcbiAgICAgIHRoaXMuZ2V0WWVhckJ0bigpLFxyXG4gICAgICB0aGlzLmdlblRpdGxlRGF0ZSgpXHJcbiAgICBdKVxyXG4gIH1cclxufSlcclxuIl19