import '../../stylus/components/_responsive.styl';
// Mixins
import Measurable from '../../mixins/measurable';
// Utils
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Measurable).extend({
    name: 'v-responsive',
    props: {
        aspectRatio: [String, Number]
    },
    computed: {
        computedAspectRatio() {
            return Number(this.aspectRatio);
        },
        aspectStyle() {
            return this.computedAspectRatio
                ? { paddingBottom: (1 / this.computedAspectRatio) * 100 + '%' }
                : undefined;
        },
        __cachedSizer() {
            if (!this.aspectStyle)
                return [];
            return this.$createElement('div', {
                style: this.aspectStyle,
                staticClass: 'v-responsive__sizer'
            });
        }
    },
    methods: {
        genContent() {
            return this.$createElement('div', {
                staticClass: 'v-responsive__content'
            }, this.$slots.default);
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'v-responsive',
            style: this.measurableStyles,
            on: this.$listeners
        }, [
            this.__cachedSizer,
            this.genContent()
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJlc3BvbnNpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WUmVzcG9uc2l2ZS9WUmVzcG9uc2l2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLDBDQUEwQyxDQUFBO0FBRWpELFNBQVM7QUFDVCxPQUFPLFVBQW9DLE1BQU0seUJBQXlCLENBQUE7QUFLMUUsUUFBUTtBQUNSLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdkMsSUFBSSxFQUFFLGNBQWM7SUFFcEIsS0FBSyxFQUFFO1FBQ0wsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBeUI7S0FDdEQ7SUFFRCxRQUFRLEVBQUU7UUFDUixtQkFBbUI7WUFDakIsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2pDLENBQUM7UUFDRCxXQUFXO1lBQ1QsT0FBTyxJQUFJLENBQUMsbUJBQW1CO2dCQUM3QixDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRTtnQkFDL0QsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtRQUNmLENBQUM7UUFDRCxhQUFhO1lBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUFFLE9BQU8sRUFBRSxDQUFBO1lBRWhDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDdkIsV0FBVyxFQUFFLHFCQUFxQjthQUNuQyxDQUFDLENBQUE7UUFDSixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLHVCQUF1QjthQUNyQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekIsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsY0FBYztZQUMzQixLQUFLLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUM1QixFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDcEIsRUFBRTtZQUNELElBQUksQ0FBQyxhQUFhO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUU7U0FDbEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3Jlc3BvbnNpdmUuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgTWVhc3VyYWJsZSwgeyBOdW1iZXJPck51bWJlclN0cmluZyB9IGZyb20gJy4uLy4uL21peGlucy9tZWFzdXJhYmxlJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKE1lYXN1cmFibGUpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtcmVzcG9uc2l2ZScsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhc3BlY3RSYXRpbzogW1N0cmluZywgTnVtYmVyXSBhcyBOdW1iZXJPck51bWJlclN0cmluZ1xyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjb21wdXRlZEFzcGVjdFJhdGlvICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gTnVtYmVyKHRoaXMuYXNwZWN0UmF0aW8pXHJcbiAgICB9LFxyXG4gICAgYXNwZWN0U3R5bGUgKCk6IG9iamVjdCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbXB1dGVkQXNwZWN0UmF0aW9cclxuICAgICAgICA/IHsgcGFkZGluZ0JvdHRvbTogKDEgLyB0aGlzLmNvbXB1dGVkQXNwZWN0UmF0aW8pICogMTAwICsgJyUnIH1cclxuICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgfSxcclxuICAgIF9fY2FjaGVkU2l6ZXIgKCk6IFZOb2RlIHwgW10ge1xyXG4gICAgICBpZiAoIXRoaXMuYXNwZWN0U3R5bGUpIHJldHVybiBbXVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdHlsZTogdGhpcy5hc3BlY3RTdHlsZSxcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcmVzcG9uc2l2ZV9fc2l6ZXInXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuQ29udGVudCAoKTogVk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1yZXNwb25zaXZlX19jb250ZW50J1xyXG4gICAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1yZXNwb25zaXZlJyxcclxuICAgICAgc3R5bGU6IHRoaXMubWVhc3VyYWJsZVN0eWxlcyxcclxuICAgICAgb246IHRoaXMuJGxpc3RlbmVyc1xyXG4gICAgfSwgW1xyXG4gICAgICB0aGlzLl9fY2FjaGVkU2l6ZXIsXHJcbiAgICAgIHRoaXMuZ2VuQ29udGVudCgpXHJcbiAgICBdKVxyXG4gIH1cclxufSlcclxuIl19