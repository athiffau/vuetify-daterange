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
            style: this.styles,
            on: this.$listeners
        };
        return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNoZWV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlNoZWV0L1ZTaGVldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxxQ0FBcUMsQ0FBQTtBQUU1QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsVUFBVTtBQUNWLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFNBQVM7SUFFZixLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsZUFBZSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUMxQixHQUFHLElBQUksQ0FBQyxZQUFZO2dCQUNwQixHQUFHLElBQUksQ0FBQyxnQkFBZ0I7YUFDekIsQ0FBQTtRQUNILENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7UUFDOUIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxNQUFNLElBQUksR0FBRztZQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTztZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FDTixJQUFJLENBQUMsR0FBRyxFQUNSLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FDcEIsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fc2hlZXQuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ29sb3JhYmxlIGZyb20gJy4uLy4uL21peGlucy9jb2xvcmFibGUnXHJcbmltcG9ydCBFbGV2YXRhYmxlIGZyb20gJy4uLy4uL21peGlucy9lbGV2YXRhYmxlJ1xyXG5pbXBvcnQgTWVhc3VyYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvbWVhc3VyYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gSGVscGVyc1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnMoXHJcbiAgQ29sb3JhYmxlLFxyXG4gIEVsZXZhdGFibGUsXHJcbiAgTWVhc3VyYWJsZSxcclxuICBUaGVtZWFibGVcclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXNoZWV0JyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHRhZzoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdkaXYnXHJcbiAgICB9LFxyXG4gICAgdGlsZTogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgICd2LXNoZWV0JzogdHJ1ZSxcclxuICAgICAgICAndi1zaGVldC0tdGlsZSc6IHRoaXMudGlsZSxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3NlcyxcclxuICAgICAgICAuLi50aGlzLmVsZXZhdGlvbkNsYXNzZXNcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0eWxlcyAoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHRoaXMubWVhc3VyYWJsZVN0eWxlc1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXMsXHJcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcclxuICAgICAgb246IHRoaXMuJGxpc3RlbmVyc1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBoKFxyXG4gICAgICB0aGlzLnRhZyxcclxuICAgICAgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwgZGF0YSksXHJcbiAgICAgIHRoaXMuJHNsb3RzLmRlZmF1bHRcclxuICAgIClcclxuICB9XHJcbn0pXHJcbiJdfQ==