// Styles
import '../../stylus/components/_subheaders.styl';
// Mixins
import Themeable from '../../mixins/themeable';
import mixins from '../../util/mixins';
export default mixins(Themeable
/* @vue/component */
).extend({
    name: 'v-subheader',
    props: {
        inset: Boolean
    },
    render(h) {
        return h('div', {
            staticClass: 'v-subheader',
            class: {
                'v-subheader--inset': this.inset,
                ...this.themeClasses
            },
            attrs: this.$attrs,
            on: this.$listeners
        }, this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN1YmhlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTdWJoZWFkZXIvVlN1YmhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTywwQ0FBMEMsQ0FBQTtBQUVqRCxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFLdEMsZUFBZSxNQUFNLENBQ25CLFNBQVM7QUFDVCxvQkFBb0I7Q0FDckIsQ0FBQyxNQUFNLENBQUM7SUFDUCxJQUFJLEVBQUUsYUFBYTtJQUVuQixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsT0FBTztLQUNmO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDZCxXQUFXLEVBQUUsYUFBYTtZQUMxQixLQUFLLEVBQUU7Z0JBQ0wsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2hDLEdBQUcsSUFBSSxDQUFDLFlBQVk7YUFDckI7WUFDRCxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbEIsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQ3BCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6QixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3N1YmhlYWRlcnMuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcblxyXG4vLyBUeXBlc1xyXG5pbXBvcnQgeyBWTm9kZSB9IGZyb20gJ3Z1ZSdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhcclxuICBUaGVtZWFibGVcclxuICAvKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3Ytc3ViaGVhZGVyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGluc2V0OiBCb29sZWFuXHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXN1YmhlYWRlcicsXHJcbiAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgJ3Ytc3ViaGVhZGVyLS1pbnNldCc6IHRoaXMuaW5zZXQsXHJcbiAgICAgICAgLi4udGhpcy50aGVtZUNsYXNzZXNcclxuICAgICAgfSxcclxuICAgICAgYXR0cnM6IHRoaXMuJGF0dHJzLFxyXG4gICAgICBvbjogdGhpcy4kbGlzdGVuZXJzXHJcbiAgICB9LCB0aGlzLiRzbG90cy5kZWZhdWx0KVxyXG4gIH1cclxufSlcclxuIl19