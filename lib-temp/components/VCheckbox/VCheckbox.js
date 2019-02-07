// Styles
import '../../stylus/components/_selection-controls.styl';
// Components
import VIcon from '../VIcon';
// import { VFadeTransition } from '../transitions'
// Mixins
import Selectable from '../../mixins/selectable';
/* @vue/component */
export default {
    name: 'v-checkbox',
    mixins: [
        Selectable
    ],
    props: {
        indeterminate: Boolean,
        indeterminateIcon: {
            type: String,
            default: '$vuetify.icons.checkboxIndeterminate'
        },
        onIcon: {
            type: String,
            default: '$vuetify.icons.checkboxOn'
        },
        offIcon: {
            type: String,
            default: '$vuetify.icons.checkboxOff'
        }
    },
    data: vm => ({
        inputIndeterminate: vm.indeterminate
    }),
    computed: {
        classes() {
            return {
                'v-input--selection-controls': true,
                'v-input--checkbox': true
            };
        },
        computedIcon() {
            if (this.inputIndeterminate) {
                return this.indeterminateIcon;
            }
            else if (this.isActive) {
                return this.onIcon;
            }
            else {
                return this.offIcon;
            }
        }
    },
    watch: {
        indeterminate(val) {
            this.inputIndeterminate = val;
        }
    },
    methods: {
        genCheckbox() {
            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input'
            }, [
                this.genInput('checkbox', {
                    ...this.$attrs,
                    'aria-checked': this.inputIndeterminate
                        ? 'mixed'
                        : this.isActive.toString()
                }),
                this.genRipple(this.setTextColor(this.computedColor)),
                this.$createElement(VIcon, this.setTextColor(this.computedColor, {
                    props: {
                        dark: this.dark,
                        light: this.light
                    }
                }), this.computedIcon)
            ]);
        },
        genDefaultSlot() {
            return [
                this.genCheckbox(),
                this.genLabel()
            ];
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNoZWNrYm94LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNoZWNrYm94L1ZDaGVja2JveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxrREFBa0QsQ0FBQTtBQUV6RCxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBQzVCLG1EQUFtRDtBQUVuRCxTQUFTO0FBQ1QsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFFaEQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsWUFBWTtJQUVsQixNQUFNLEVBQUU7UUFDTixVQUFVO0tBQ1g7SUFFRCxLQUFLLEVBQUU7UUFDTCxhQUFhLEVBQUUsT0FBTztRQUN0QixpQkFBaUIsRUFBRTtZQUNqQixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxzQ0FBc0M7U0FDaEQ7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSwyQkFBMkI7U0FDckM7UUFDRCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSw0QkFBNEI7U0FDdEM7S0FDRjtJQUVELElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDWCxrQkFBa0IsRUFBRSxFQUFFLENBQUMsYUFBYTtLQUNyQyxDQUFDO0lBRUYsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsNkJBQTZCLEVBQUUsSUFBSTtnQkFDbkMsbUJBQW1CLEVBQUUsSUFBSTthQUMxQixDQUFBO1FBQ0gsQ0FBQztRQUNELFlBQVk7WUFDVixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7YUFDOUI7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN4QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7YUFDbkI7aUJBQU07Z0JBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO2FBQ3BCO1FBQ0gsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsYUFBYSxDQUFFLEdBQUc7WUFDaEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsQ0FBQTtRQUMvQixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLG9DQUFvQzthQUNsRCxFQUFFO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFO29CQUN4QixHQUFHLElBQUksQ0FBQyxNQUFNO29CQUNkLGNBQWMsRUFBRSxJQUFJLENBQUMsa0JBQWtCO3dCQUNyQyxDQUFDLENBQUMsT0FBTzt3QkFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7aUJBQzdCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUMvRCxLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3dCQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztxQkFDbEI7aUJBQ0YsQ0FBQyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDdkIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELGNBQWM7WUFDWixPQUFPO2dCQUNMLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLEVBQUU7YUFDaEIsQ0FBQTtRQUNILENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc2VsZWN0aW9uLWNvbnRyb2xzLnN0eWwnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcclxuLy8gaW1wb3J0IHsgVkZhZGVUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IFNlbGVjdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3NlbGVjdGFibGUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtY2hlY2tib3gnLFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIFNlbGVjdGFibGVcclxuICBdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgaW5kZXRlcm1pbmF0ZTogQm9vbGVhbixcclxuICAgIGluZGV0ZXJtaW5hdGVJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmNoZWNrYm94SW5kZXRlcm1pbmF0ZSdcclxuICAgIH0sXHJcbiAgICBvbkljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMuY2hlY2tib3hPbidcclxuICAgIH0sXHJcbiAgICBvZmZJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmNoZWNrYm94T2ZmJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRhdGE6IHZtID0+ICh7XHJcbiAgICBpbnB1dEluZGV0ZXJtaW5hdGU6IHZtLmluZGV0ZXJtaW5hdGVcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCkge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LWlucHV0LS1zZWxlY3Rpb24tY29udHJvbHMnOiB0cnVlLFxyXG4gICAgICAgICd2LWlucHV0LS1jaGVja2JveCc6IHRydWVcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkSWNvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0SW5kZXRlcm1pbmF0ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluZGV0ZXJtaW5hdGVJY29uXHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSWNvblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9mZkljb25cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpbmRldGVybWluYXRlICh2YWwpIHtcclxuICAgICAgdGhpcy5pbnB1dEluZGV0ZXJtaW5hdGUgPSB2YWxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5DaGVja2JveCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWlucHV0LS1zZWxlY3Rpb24tY29udHJvbHNfX2lucHV0J1xyXG4gICAgICB9LCBbXHJcbiAgICAgICAgdGhpcy5nZW5JbnB1dCgnY2hlY2tib3gnLCB7XHJcbiAgICAgICAgICAuLi50aGlzLiRhdHRycyxcclxuICAgICAgICAgICdhcmlhLWNoZWNrZWQnOiB0aGlzLmlucHV0SW5kZXRlcm1pbmF0ZVxyXG4gICAgICAgICAgICA/ICdtaXhlZCdcclxuICAgICAgICAgICAgOiB0aGlzLmlzQWN0aXZlLnRvU3RyaW5nKClcclxuICAgICAgICB9KSxcclxuICAgICAgICB0aGlzLmdlblJpcHBsZSh0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IpKSxcclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIHtcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIGRhcms6IHRoaXMuZGFyayxcclxuICAgICAgICAgICAgbGlnaHQ6IHRoaXMubGlnaHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KSwgdGhpcy5jb21wdXRlZEljb24pXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuRGVmYXVsdFNsb3QgKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHRoaXMuZ2VuQ2hlY2tib3goKSxcclxuICAgICAgICB0aGlzLmdlbkxhYmVsKClcclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=