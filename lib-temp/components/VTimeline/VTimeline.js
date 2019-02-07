// Styles
import '../../stylus/components/_timeline.styl';
import mixins from '../../util/mixins';
// Mixins
import Themeable from '../../mixins/themeable';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-timeline',
    props: {
        alignTop: Boolean,
        dense: Boolean
    },
    computed: {
        classes() {
            return {
                'v-timeline--align-top': this.alignTop,
                'v-timeline--dense': this.dense,
                ...this.themeClasses
            };
        }
    },
    render(h) {
        return h('div', {
            staticClass: 'v-timeline',
            'class': this.classes
        }, this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRpbWVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlRpbWVsaW5lL1ZUaW1lbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyx3Q0FBd0MsQ0FBQTtBQUkvQyxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQUV0QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsZUFBZSxNQUFNLENBQ25CLFNBQVM7QUFDWCxvQkFBb0I7Q0FDbkIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUVsQixLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixLQUFLLEVBQUUsT0FBTztLQUNmO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3RDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUMvQixHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUNkLFdBQVcsRUFBRSxZQUFZO1lBQ3pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDekIsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL190aW1lbGluZS5zdHlsJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIFRoZW1lYWJsZVxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtdGltZWxpbmUnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgYWxpZ25Ub3A6IEJvb2xlYW4sXHJcbiAgICBkZW5zZTogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiB7fSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtdGltZWxpbmUtLWFsaWduLXRvcCc6IHRoaXMuYWxpZ25Ub3AsXHJcbiAgICAgICAgJ3YtdGltZWxpbmUtLWRlbnNlJzogdGhpcy5kZW5zZSxcclxuICAgICAgICAuLi50aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXRpbWVsaW5lJyxcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzc2VzXHJcbiAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gIH1cclxufSlcclxuIl19