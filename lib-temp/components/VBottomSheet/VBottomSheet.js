import '../../stylus/components/_bottom-sheets.styl';
import VDialog from '../VDialog/VDialog';
/* @vue/component */
export default {
    name: 'v-bottom-sheet',
    props: {
        disabled: Boolean,
        fullWidth: Boolean,
        hideOverlay: Boolean,
        inset: Boolean,
        lazy: Boolean,
        maxWidth: {
            type: [String, Number],
            default: 'auto'
        },
        persistent: Boolean,
        value: null
    },
    render(h) {
        const activator = h('template', {
            slot: 'activator'
        }, this.$slots.activator);
        const contentClass = [
            'v-bottom-sheet',
            this.inset ? 'v-bottom-sheet--inset' : ''
        ].join(' ');
        return h(VDialog, {
            attrs: {
                ...this.$props
            },
            on: {
                ...this.$listeners
            },
            props: {
                contentClass,
                noClickAnimation: true,
                transition: 'bottom-sheet-transition',
                value: this.value
            }
        }, [activator, this.$slots.default]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJvdHRvbVNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJvdHRvbVNoZWV0L1ZCb3R0b21TaGVldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDZDQUE2QyxDQUFBO0FBRXBELE9BQU8sT0FBTyxNQUFNLG9CQUFvQixDQUFBO0FBRXhDLG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLGdCQUFnQjtJQUV0QixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixTQUFTLEVBQUUsT0FBTztRQUNsQixXQUFXLEVBQUUsT0FBTztRQUNwQixLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxPQUFPO1FBQ2IsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQztZQUN0QixPQUFPLEVBQUUsTUFBTTtTQUNoQjtRQUNELFVBQVUsRUFBRSxPQUFPO1FBQ25CLEtBQUssRUFBRSxJQUFJO0tBQ1o7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUU7WUFDOUIsSUFBSSxFQUFFLFdBQVc7U0FDbEIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRXpCLE1BQU0sWUFBWSxHQUFHO1lBQ25CLGdCQUFnQjtZQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtTQUMxQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVYLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRTtZQUNoQixLQUFLLEVBQUU7Z0JBQ0wsR0FBRyxJQUFJLENBQUMsTUFBTTthQUNmO1lBQ0QsRUFBRSxFQUFFO2dCQUNGLEdBQUcsSUFBSSxDQUFDLFVBQVU7YUFDbkI7WUFDRCxLQUFLLEVBQUU7Z0JBQ0wsWUFBWTtnQkFDWixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixVQUFVLEVBQUUseUJBQXlCO2dCQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDbEI7U0FDRixFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2JvdHRvbS1zaGVldHMuc3R5bCdcclxuXHJcbmltcG9ydCBWRGlhbG9nIGZyb20gJy4uL1ZEaWFsb2cvVkRpYWxvZydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBuYW1lOiAndi1ib3R0b20tc2hlZXQnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgICBmdWxsV2lkdGg6IEJvb2xlYW4sXHJcbiAgICBoaWRlT3ZlcmxheTogQm9vbGVhbixcclxuICAgIGluc2V0OiBCb29sZWFuLFxyXG4gICAgbGF6eTogQm9vbGVhbixcclxuICAgIG1heFdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6ICdhdXRvJ1xyXG4gICAgfSxcclxuICAgIHBlcnNpc3RlbnQ6IEJvb2xlYW4sXHJcbiAgICB2YWx1ZTogbnVsbFxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgY29uc3QgYWN0aXZhdG9yID0gaCgndGVtcGxhdGUnLCB7XHJcbiAgICAgIHNsb3Q6ICdhY3RpdmF0b3InXHJcbiAgICB9LCB0aGlzLiRzbG90cy5hY3RpdmF0b3IpXHJcblxyXG4gICAgY29uc3QgY29udGVudENsYXNzID0gW1xyXG4gICAgICAndi1ib3R0b20tc2hlZXQnLFxyXG4gICAgICB0aGlzLmluc2V0ID8gJ3YtYm90dG9tLXNoZWV0LS1pbnNldCcgOiAnJ1xyXG4gICAgXS5qb2luKCcgJylcclxuXHJcbiAgICByZXR1cm4gaChWRGlhbG9nLCB7XHJcbiAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgLi4udGhpcy4kcHJvcHNcclxuICAgICAgfSxcclxuICAgICAgb246IHtcclxuICAgICAgICAuLi50aGlzLiRsaXN0ZW5lcnNcclxuICAgICAgfSxcclxuICAgICAgcHJvcHM6IHtcclxuICAgICAgICBjb250ZW50Q2xhc3MsXHJcbiAgICAgICAgbm9DbGlja0FuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgICB0cmFuc2l0aW9uOiAnYm90dG9tLXNoZWV0LXRyYW5zaXRpb24nLFxyXG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlXHJcbiAgICAgIH1cclxuICAgIH0sIFthY3RpdmF0b3IsIHRoaXMuJHNsb3RzLmRlZmF1bHRdKVxyXG4gIH1cclxufVxyXG4iXX0=