// Styles
import '../../stylus/components/_cards.styl';
// Extensions
import VSheet from '../VSheet';
// Mixins
import Routable from '../../mixins/routable';
// Helpers
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Routable, VSheet).extend({
    name: 'v-card',
    props: {
        flat: Boolean,
        hover: Boolean,
        img: String,
        raised: Boolean
    },
    computed: {
        classes() {
            return {
                'v-card': true,
                'v-card--flat': this.flat,
                'v-card--hover': this.hover,
                ...VSheet.options.computed.classes.call(this)
            };
        },
        styles() {
            const style = {
                ...VSheet.options.computed.styles.call(this)
            };
            if (this.img) {
                style.background = `url("${this.img}") center center / cover no-repeat`;
            }
            return style;
        }
    },
    render(h) {
        const { tag, data } = this.generateRouteLink(this.classes);
        data.style = this.styles;
        return h(tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FyZC9WQ2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUU1QyxhQUFhO0FBQ2IsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFBO0FBRTlCLFNBQVM7QUFDVCxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUU1QyxVQUFVO0FBQ1YsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUNuQixRQUFRLEVBQ1IsTUFBTSxDQUNQLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFFBQVE7SUFFZCxLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxPQUFPO1FBQ2QsR0FBRyxFQUFFLE1BQU07UUFDWCxNQUFNLEVBQUUsT0FBTztLQUNoQjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLFFBQVEsRUFBRSxJQUFJO2dCQUNkLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDekIsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUMzQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzlDLENBQUE7UUFDSCxDQUFDO1FBQ0QsTUFBTTtZQUNKLE1BQU0sS0FBSyxHQUFHO2dCQUNaLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDN0MsQ0FBQTtZQUVELElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDWixLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsSUFBSSxDQUFDLEdBQUcsb0NBQW9DLENBQUE7YUFDeEU7WUFFRCxPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTFELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUV4QixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2NhcmRzLnN0eWwnXHJcblxyXG4vLyBFeHRlbnNpb25zXHJcbmltcG9ydCBWU2hlZXQgZnJvbSAnLi4vVlNoZWV0J1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBSb3V0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcm91dGFibGUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBSb3V0YWJsZSxcclxuICBWU2hlZXRcclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWNhcmQnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZmxhdDogQm9vbGVhbixcclxuICAgIGhvdmVyOiBCb29sZWFuLFxyXG4gICAgaW1nOiBTdHJpbmcsXHJcbiAgICByYWlzZWQ6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICAndi1jYXJkJzogdHJ1ZSxcclxuICAgICAgICAndi1jYXJkLS1mbGF0JzogdGhpcy5mbGF0LFxyXG4gICAgICAgICd2LWNhcmQtLWhvdmVyJzogdGhpcy5ob3ZlcixcclxuICAgICAgICAuLi5WU2hlZXQub3B0aW9ucy5jb21wdXRlZC5jbGFzc2VzLmNhbGwodGhpcylcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcclxuICAgICAgY29uc3Qgc3R5bGUgPSB7XHJcbiAgICAgICAgLi4uVlNoZWV0Lm9wdGlvbnMuY29tcHV0ZWQuc3R5bGVzLmNhbGwodGhpcylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuaW1nKSB7XHJcbiAgICAgICAgc3R5bGUuYmFja2dyb3VuZCA9IGB1cmwoXCIke3RoaXMuaW1nfVwiKSBjZW50ZXIgY2VudGVyIC8gY292ZXIgbm8tcmVwZWF0YFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3R5bGVcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCB7IHRhZywgZGF0YSB9ID0gdGhpcy5nZW5lcmF0ZVJvdXRlTGluayh0aGlzLmNsYXNzZXMpXHJcblxyXG4gICAgZGF0YS5zdHlsZSA9IHRoaXMuc3R5bGVzXHJcblxyXG4gICAgcmV0dXJuIGgodGFnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSwgdGhpcy4kc2xvdHMuZGVmYXVsdClcclxuICB9XHJcbn0pXHJcbiJdfQ==