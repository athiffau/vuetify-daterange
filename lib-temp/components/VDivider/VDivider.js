// Styles
import '../../stylus/components/_dividers.styl';
// Mixins
import Themeable from '../../mixins/themeable';
export default Themeable.extend({
    name: 'v-divider',
    props: {
        inset: Boolean,
        vertical: Boolean
    },
    render(h) {
        return h('hr', {
            class: {
                'v-divider': true,
                'v-divider--inset': this.inset,
                'v-divider--vertical': this.vertical,
                ...this.themeClasses
            },
            attrs: this.$attrs,
            on: this.$listeners
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkRpdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WRGl2aWRlci9WRGl2aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUsvQyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsZUFBZSxTQUFTLENBQUMsTUFBTSxDQUFDO0lBQzlCLElBQUksRUFBRSxXQUFXO0lBRWpCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLE9BQU87S0FDbEI7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRTtZQUNiLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsSUFBSTtnQkFDakIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQzlCLHFCQUFxQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUNwQyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCO1lBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2RpdmlkZXJzLnN0eWwnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUaGVtZWFibGUuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1kaXZpZGVyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGluc2V0OiBCb29sZWFuLFxyXG4gICAgdmVydGljYWw6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICByZXR1cm4gaCgnaHInLCB7XHJcbiAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgJ3YtZGl2aWRlcic6IHRydWUsXHJcbiAgICAgICAgJ3YtZGl2aWRlci0taW5zZXQnOiB0aGlzLmluc2V0LFxyXG4gICAgICAgICd2LWRpdmlkZXItLXZlcnRpY2FsJzogdGhpcy52ZXJ0aWNhbCxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9LFxyXG4gICAgICBhdHRyczogdGhpcy4kYXR0cnMsXHJcbiAgICAgIG9uOiB0aGlzLiRsaXN0ZW5lcnNcclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iXX0=