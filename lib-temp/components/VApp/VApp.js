import '../../stylus/components/_app.styl';
// Component level mixins
import AppTheme from './mixins/app-theme';
import Themeable from '../../mixins/themeable';
// Directives
import Resize from '../../directives/resize';
/* @vue/component */
export default {
    name: 'v-app',
    directives: {
        Resize
    },
    mixins: [
        AppTheme,
        Themeable
    ],
    props: {
        id: {
            type: String,
            default: 'app'
        },
        dark: Boolean
    },
    computed: {
        classes() {
            return {
                'application--is-rtl': this.$vuetify.rtl,
                ...this.themeClasses
            };
        }
    },
    watch: {
        dark() {
            this.$vuetify.dark = this.dark;
        }
    },
    mounted() {
        this.$vuetify.dark = this.dark;
    },
    render(h) {
        const data = {
            staticClass: 'application',
            'class': this.classes,
            attrs: { 'data-app': true },
            domProps: { id: this.id }
        };
        const wrapper = h('div', { staticClass: 'application--wrap' }, this.$slots.default);
        return h('div', data, [wrapper]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBcHAvVkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLG1DQUFtQyxDQUFBO0FBRTFDLHlCQUF5QjtBQUN6QixPQUFPLFFBQVEsTUFBTSxvQkFBb0IsQ0FBQTtBQUV6QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0seUJBQXlCLENBQUE7QUFFNUMsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsT0FBTztJQUViLFVBQVUsRUFBRTtRQUNWLE1BQU07S0FDUDtJQUVELE1BQU0sRUFBRTtRQUNOLFFBQVE7UUFDUixTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxFQUFFLEVBQUU7WUFDRixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHO2dCQUN4QyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxJQUFJO1lBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtRQUNoQyxDQUFDO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtJQUNoQyxDQUFDO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLFdBQVcsRUFBRSxhQUFhO1lBQzFCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO1lBQzNCLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO1NBQzFCLENBQUE7UUFFRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVuRixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2FwcC5zdHlsJ1xyXG5cclxuLy8gQ29tcG9uZW50IGxldmVsIG1peGluc1xyXG5pbXBvcnQgQXBwVGhlbWUgZnJvbSAnLi9taXhpbnMvYXBwLXRoZW1lJ1xyXG5cclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgUmVzaXplIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmVzaXplJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LWFwcCcsXHJcblxyXG4gIGRpcmVjdGl2ZXM6IHtcclxuICAgIFJlc2l6ZVxyXG4gIH0sXHJcblxyXG4gIG1peGluczogW1xyXG4gICAgQXBwVGhlbWUsXHJcbiAgICBUaGVtZWFibGVcclxuICBdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgaWQ6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnYXBwJ1xyXG4gICAgfSxcclxuICAgIGRhcms6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ2FwcGxpY2F0aW9uLS1pcy1ydGwnOiB0aGlzLiR2dWV0aWZ5LnJ0bCxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGRhcmsgKCkge1xyXG4gICAgICB0aGlzLiR2dWV0aWZ5LmRhcmsgPSB0aGlzLmRhcmtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtb3VudGVkICgpIHtcclxuICAgIHRoaXMuJHZ1ZXRpZnkuZGFyayA9IHRoaXMuZGFya1xyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICdhcHBsaWNhdGlvbicsXHJcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgYXR0cnM6IHsgJ2RhdGEtYXBwJzogdHJ1ZSB9LFxyXG4gICAgICBkb21Qcm9wczogeyBpZDogdGhpcy5pZCB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IGgoJ2RpdicsIHsgc3RhdGljQ2xhc3M6ICdhcHBsaWNhdGlvbi0td3JhcCcgfSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuXHJcbiAgICByZXR1cm4gaCgnZGl2JywgZGF0YSwgW3dyYXBwZXJdKVxyXG4gIH1cclxufVxyXG4iXX0=