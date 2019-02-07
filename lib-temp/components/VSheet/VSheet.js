// Styles
import '../../stylus/components/_sheet.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Elevatable from '../../mixins/elevatable';
import Measurable from '../../mixins/measurable';
import Themeable from '../../mixins/themeable';
// Helpers
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Elevatable, Measurable, Themeable).extend({
    name: 'v-sheet',
    props: {
        tag: {
            type: String,
            default: 'div'
        },
        tile: Boolean
    },
    computed: {
        classes() {
            return {
                'v-sheet': true,
                'v-sheet--tile': this.tile,
                ...this.themeClasses,
                ...this.elevationClasses
            };
        },
        styles() {
            return this.measurableStyles;
        }
    },
    render(h) {
        const data = {
            class: this.classes,
            style: this.styles
        };
        return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNoZWV0L1ZTaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUU1QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsVUFBVTtBQUNWLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFNBQVM7SUFFZixLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUMxQixHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUNwQixHQUFHLElBQUksQ0FBQyxnQkFBZ0I7YUFDekIsQ0FBQTtRQUNILENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7UUFDOUIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDbkIsQ0FBQTtRQUVELE9BQU8sQ0FBQyxDQUNOLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUNwQixDQUFBO0lBQ0gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19zaGVldC5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IEVsZXZhdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2VsZXZhdGFibGUnXHJcbmltcG9ydCBNZWFzdXJhYmxlIGZyb20gJy4uLy4uL21peGlucy9tZWFzdXJhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vLyBIZWxwZXJzXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBDb2xvcmFibGUsXHJcbiAgRWxldmF0YWJsZSxcclxuICBNZWFzdXJhYmxlLFxyXG4gIFRoZW1lYWJsZVxyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3Ytc2hlZXQnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgdGFnOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ2RpdidcclxuICAgIH0sXHJcbiAgICB0aWxlOiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3Ytc2hlZXQnOiB0cnVlLFxyXG4gICAgICAgICd2LXNoZWV0LS10aWxlJzogdGhpcy50aWxlLFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzLFxyXG4gICAgICAgIC4uLnRoaXMuZWxldmF0aW9uQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3R5bGVzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4gdGhpcy5tZWFzdXJhYmxlU3R5bGVzXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgY2xhc3M6IHRoaXMuY2xhc3NlcyxcclxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoXHJcbiAgICAgIHRoaXMudGFnLFxyXG4gICAgICB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCBkYXRhKSxcclxuICAgICAgdGhpcy4kc2xvdHMuZGVmYXVsdFxyXG4gICAgKVxyXG4gIH1cclxufSlcclxuIl19