import '../../stylus/components/_jumbotrons.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Routable from '../../mixins/routable';
import Themeable from '../../mixins/themeable';
// Utils
import { deprecate } from '../../util/console';
/* @vue/component */
export default {
    name: 'v-jumbotron',
    mixins: [
        Colorable,
        Routable,
        Themeable
    ],
    props: {
        gradient: String,
        height: {
            type: [Number, String],
            default: '400px'
        },
        src: String,
        tag: {
            type: String,
            default: 'div'
        }
    },
    computed: {
        backgroundStyles() {
            const styles = {};
            if (this.gradient) {
                styles.background = `linear-gradient(${this.gradient})`;
            }
            return styles;
        },
        classes() {
            return this.themeClasses;
        },
        styles() {
            return {
                height: this.height
            };
        }
    },
    mounted() {
        deprecate('v-jumbotron', this.src ? 'v-img' : 'v-responsive', this);
    },
    methods: {
        genBackground() {
            return this.$createElement('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-jumbotron__background',
                style: this.backgroundStyles
            }));
        },
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-jumbotron__content'
            }, this.$slots.default);
        },
        genImage() {
            if (!this.src)
                return null;
            if (this.$slots.img)
                return this.$slots.img({ src: this.src });
            return this.$createElement('img', {
                staticClass: 'v-jumbotron__image',
                attrs: { src: this.src }
            });
        },
        genWrapper() {
            return this.$createElement('div', {
                staticClass: 'v-jumbotron__wrapper'
            }, [
                this.genImage(),
                this.genBackground(),
                this.genContent()
            ]);
        }
    },
    render(h) {
        const { tag, data } = this.generateRouteLink(this.classes);
        data.staticClass = 'v-jumbotron';
        data.style = this.styles;
        return h(tag, data, [this.genWrapper()]);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkp1bWJvdHJvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZKdW1ib3Ryb24vVkp1bWJvdHJvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDBDQUEwQyxDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTlDLG9CQUFvQjtBQUNwQixlQUFlO0lBQ2IsSUFBSSxFQUFFLGFBQWE7SUFFbkIsTUFBTSxFQUFFO1FBQ04sU0FBUztRQUNULFFBQVE7UUFDUixTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsTUFBTTtRQUNoQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxPQUFPO1NBQ2pCO1FBQ0QsR0FBRyxFQUFFLE1BQU07UUFDWCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLGdCQUFnQjtZQUNkLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtZQUVqQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsbUJBQW1CLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQTthQUN4RDtZQUVELE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUNELE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUE7UUFDMUIsQ0FBQztRQUNELE1BQU07WUFDSixPQUFPO2dCQUNMLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTthQUNwQixDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBRUQsT0FBTztRQUNMLFNBQVMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDckUsQ0FBQztJQUVELE9BQU8sRUFBRTtRQUNQLGFBQWE7WUFDWCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNwRSxXQUFXLEVBQUUseUJBQXlCO2dCQUN0QyxLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjthQUM3QixDQUFDLENBQUMsQ0FBQTtRQUNMLENBQUM7UUFDRCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLHNCQUFzQjthQUNwQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekIsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTyxJQUFJLENBQUE7WUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7Z0JBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtZQUU5RCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxXQUFXLEVBQUUsb0JBQW9CO2dCQUNqQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTthQUN6QixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsVUFBVTtZQUNSLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxzQkFBc0I7YUFDcEMsRUFBRTtnQkFDRCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUU7YUFDbEIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUE7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBRXhCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzFDLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fanVtYm90cm9ucy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IFJvdXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9yb3V0YWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IHsgZGVwcmVjYXRlIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIG5hbWU6ICd2LWp1bWJvdHJvbicsXHJcblxyXG4gIG1peGluczogW1xyXG4gICAgQ29sb3JhYmxlLFxyXG4gICAgUm91dGFibGUsXHJcbiAgICBUaGVtZWFibGVcclxuICBdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZ3JhZGllbnQ6IFN0cmluZyxcclxuICAgIGhlaWdodDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAnNDAwcHgnXHJcbiAgICB9LFxyXG4gICAgc3JjOiBTdHJpbmcsXHJcbiAgICB0YWc6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnZGl2J1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBiYWNrZ3JvdW5kU3R5bGVzICgpIHtcclxuICAgICAgY29uc3Qgc3R5bGVzID0ge31cclxuXHJcbiAgICAgIGlmICh0aGlzLmdyYWRpZW50KSB7XHJcbiAgICAgICAgc3R5bGVzLmJhY2tncm91bmQgPSBgbGluZWFyLWdyYWRpZW50KCR7dGhpcy5ncmFkaWVudH0pYFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3R5bGVzXHJcbiAgICB9LFxyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICBkZXByZWNhdGUoJ3YtanVtYm90cm9uJywgdGhpcy5zcmMgPyAndi1pbWcnIDogJ3YtcmVzcG9uc2l2ZScsIHRoaXMpXHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQmFja2dyb3VuZCAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWp1bWJvdHJvbl9fYmFja2dyb3VuZCcsXHJcbiAgICAgICAgc3R5bGU6IHRoaXMuYmFja2dyb3VuZFN0eWxlc1xyXG4gICAgICB9KSlcclxuICAgIH0sXHJcbiAgICBnZW5Db250ZW50ICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtanVtYm90cm9uX19jb250ZW50J1xyXG4gICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gICAgfSxcclxuICAgIGdlbkltYWdlICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnNyYykgcmV0dXJuIG51bGxcclxuICAgICAgaWYgKHRoaXMuJHNsb3RzLmltZykgcmV0dXJuIHRoaXMuJHNsb3RzLmltZyh7IHNyYzogdGhpcy5zcmMgfSlcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdpbWcnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWp1bWJvdHJvbl9faW1hZ2UnLFxyXG4gICAgICAgIGF0dHJzOiB7IHNyYzogdGhpcy5zcmMgfVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGdlbldyYXBwZXIgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1qdW1ib3Ryb25fX3dyYXBwZXInXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbkltYWdlKCksXHJcbiAgICAgICAgdGhpcy5nZW5CYWNrZ3JvdW5kKCksXHJcbiAgICAgICAgdGhpcy5nZW5Db250ZW50KClcclxuICAgICAgXSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IHsgdGFnLCBkYXRhIH0gPSB0aGlzLmdlbmVyYXRlUm91dGVMaW5rKHRoaXMuY2xhc3NlcylcclxuICAgIGRhdGEuc3RhdGljQ2xhc3MgPSAndi1qdW1ib3Ryb24nXHJcbiAgICBkYXRhLnN0eWxlID0gdGhpcy5zdHlsZXNcclxuXHJcbiAgICByZXR1cm4gaCh0YWcsIGRhdGEsIFt0aGlzLmdlbldyYXBwZXIoKV0pXHJcbiAgfVxyXG59XHJcbiJdfQ==