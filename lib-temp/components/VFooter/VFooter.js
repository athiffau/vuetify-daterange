// Styles
import '../../stylus/components/_footer.styl';
// Mixins
import Applicationable from '../../mixins/applicationable';
import Colorable from '../../mixins/colorable';
import Themeable from '../../mixins/themeable';
/* @vue/component */
export default {
    name: 'v-footer',
    mixins: [
        Applicationable(null, [
            'height',
            'inset'
        ]),
        Colorable,
        Themeable
    ],
    props: {
        height: {
            default: 32,
            type: [Number, String]
        },
        inset: Boolean
    },
    computed: {
        applicationProperty() {
            return this.inset ? 'insetFooter' : 'footer';
        },
        computedMarginBottom() {
            if (!this.app)
                return;
            return this.$vuetify.application.bottom;
        },
        computedPaddingLeft() {
            return !this.app || !this.inset
                ? 0
                : this.$vuetify.application.left;
        },
        computedPaddingRight() {
            return !this.app || !this.inset
                ? 0
                : this.$vuetify.application.right;
        },
        styles() {
            const styles = {
                height: isNaN(this.height) ? this.height : `${this.height}px`
            };
            if (this.computedPaddingLeft) {
                styles.paddingLeft = `${this.computedPaddingLeft}px`;
            }
            if (this.computedPaddingRight) {
                styles.paddingRight = `${this.computedPaddingRight}px`;
            }
            if (this.computedMarginBottom) {
                styles.marginBottom = `${this.computedMarginBottom}px`;
            }
            return styles;
        }
    },
    methods: {
        /**
         * Update the application layout
         *
         * @return {number}
         */
        updateApplication() {
            const height = parseInt(this.height);
            return isNaN(height)
                ? this.$el ? this.$el.clientHeight : 0
                : height;
        }
    },
    render(h) {
        const data = this.setBackgroundColor(this.color, {
            staticClass: 'v-footer',
            'class': {
                'v-footer--absolute': this.absolute,
                'v-footer--fixed': !this.absolute && (this.app || this.fixed),
                'v-footer--inset': this.inset,
                ...this.themeClasses
            },
            style: this.styles,
            ref: 'content'
        });
        return h('footer', data, this.$slots.default);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkZvb3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZGb290ZXIvVkZvb3Rlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtBQUU3QyxTQUFTO0FBQ1QsT0FBTyxlQUFlLE1BQU0sOEJBQThCLENBQUE7QUFDMUQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsVUFBVTtJQUVoQixNQUFNLEVBQUU7UUFDTixlQUFlLENBQUMsSUFBSSxFQUFFO1lBQ3BCLFFBQVE7WUFDUixPQUFPO1NBQ1IsQ0FBQztRQUNGLFNBQVM7UUFDVCxTQUFTO0tBQ1Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxNQUFNLEVBQUU7WUFDTixPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7U0FDdkI7UUFDRCxLQUFLLEVBQUUsT0FBTztLQUNmO0lBRUQsUUFBUSxFQUFFO1FBQ1IsbUJBQW1CO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUE7UUFDOUMsQ0FBQztRQUNELG9CQUFvQjtZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTTtZQUVyQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQTtRQUN6QyxDQUFDO1FBQ0QsbUJBQW1CO1lBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDO2dCQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUE7UUFDcEMsQ0FBQztRQUNELG9CQUFvQjtZQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLO2dCQUM3QixDQUFDLENBQUMsQ0FBQztnQkFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFBO1FBQ3JDLENBQUM7UUFDRCxNQUFNO1lBQ0osTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSTthQUM5RCxDQUFBO1lBRUQsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxXQUFXLEdBQUcsR0FBRyxJQUFJLENBQUMsbUJBQW1CLElBQUksQ0FBQTthQUNyRDtZQUVELElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO2dCQUM3QixNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixJQUFJLENBQUE7YUFDdkQ7WUFFRCxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDN0IsTUFBTSxDQUFDLFlBQVksR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxDQUFBO2FBQ3ZEO1lBRUQsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUDs7OztXQUlHO1FBQ0gsaUJBQWlCO1lBQ2YsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVwQyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtRQUNaLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDL0MsV0FBVyxFQUFFLFVBQVU7WUFDdkIsT0FBTyxFQUFFO2dCQUNQLG9CQUFvQixFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUNuQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzdELGlCQUFpQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUM3QixHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCO1lBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ2xCLEdBQUcsRUFBRSxTQUFTO1NBQ2YsQ0FBQyxDQUFBO1FBRUYsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQy9DLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2Zvb3Rlci5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBBcHBsaWNhdGlvbmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2FwcGxpY2F0aW9uYWJsZSdcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgVGhlbWVhYmxlIGZyb20gJy4uLy4uL21peGlucy90aGVtZWFibGUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3YtZm9vdGVyJyxcclxuXHJcbiAgbWl4aW5zOiBbXHJcbiAgICBBcHBsaWNhdGlvbmFibGUobnVsbCwgW1xyXG4gICAgICAnaGVpZ2h0JyxcclxuICAgICAgJ2luc2V0J1xyXG4gICAgXSksXHJcbiAgICBDb2xvcmFibGUsXHJcbiAgICBUaGVtZWFibGVcclxuICBdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgaGVpZ2h0OiB7XHJcbiAgICAgIGRlZmF1bHQ6IDMyLFxyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddXHJcbiAgICB9LFxyXG4gICAgaW5zZXQ6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgYXBwbGljYXRpb25Qcm9wZXJ0eSAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmluc2V0ID8gJ2luc2V0Rm9vdGVyJyA6ICdmb290ZXInXHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZWRNYXJnaW5Cb3R0b20gKCkge1xyXG4gICAgICBpZiAoIXRoaXMuYXBwKSByZXR1cm5cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmJvdHRvbVxyXG4gICAgfSxcclxuICAgIGNvbXB1dGVkUGFkZGluZ0xlZnQgKCkge1xyXG4gICAgICByZXR1cm4gIXRoaXMuYXBwIHx8ICF0aGlzLmluc2V0XHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiB0aGlzLiR2dWV0aWZ5LmFwcGxpY2F0aW9uLmxlZnRcclxuICAgIH0sXHJcbiAgICBjb21wdXRlZFBhZGRpbmdSaWdodCAoKSB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5hcHAgfHwgIXRoaXMuaW5zZXRcclxuICAgICAgICA/IDBcclxuICAgICAgICA6IHRoaXMuJHZ1ZXRpZnkuYXBwbGljYXRpb24ucmlnaHRcclxuICAgIH0sXHJcbiAgICBzdHlsZXMgKCkge1xyXG4gICAgICBjb25zdCBzdHlsZXMgPSB7XHJcbiAgICAgICAgaGVpZ2h0OiBpc05hTih0aGlzLmhlaWdodCkgPyB0aGlzLmhlaWdodCA6IGAke3RoaXMuaGVpZ2h0fXB4YFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jb21wdXRlZFBhZGRpbmdMZWZ0KSB7XHJcbiAgICAgICAgc3R5bGVzLnBhZGRpbmdMZWZ0ID0gYCR7dGhpcy5jb21wdXRlZFBhZGRpbmdMZWZ0fXB4YFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jb21wdXRlZFBhZGRpbmdSaWdodCkge1xyXG4gICAgICAgIHN0eWxlcy5wYWRkaW5nUmlnaHQgPSBgJHt0aGlzLmNvbXB1dGVkUGFkZGluZ1JpZ2h0fXB4YFxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jb21wdXRlZE1hcmdpbkJvdHRvbSkge1xyXG4gICAgICAgIHN0eWxlcy5tYXJnaW5Cb3R0b20gPSBgJHt0aGlzLmNvbXB1dGVkTWFyZ2luQm90dG9tfXB4YFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc3R5bGVzXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIGFwcGxpY2F0aW9uIGxheW91dFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgdXBkYXRlQXBwbGljYXRpb24gKCkge1xyXG4gICAgICBjb25zdCBoZWlnaHQgPSBwYXJzZUludCh0aGlzLmhlaWdodClcclxuXHJcbiAgICAgIHJldHVybiBpc05hTihoZWlnaHQpXHJcbiAgICAgICAgPyB0aGlzLiRlbCA/IHRoaXMuJGVsLmNsaWVudEhlaWdodCA6IDBcclxuICAgICAgICA6IGhlaWdodFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWZvb3RlcicsXHJcbiAgICAgICdjbGFzcyc6IHtcclxuICAgICAgICAndi1mb290ZXItLWFic29sdXRlJzogdGhpcy5hYnNvbHV0ZSxcclxuICAgICAgICAndi1mb290ZXItLWZpeGVkJzogIXRoaXMuYWJzb2x1dGUgJiYgKHRoaXMuYXBwIHx8IHRoaXMuZml4ZWQpLFxyXG4gICAgICAgICd2LWZvb3Rlci0taW5zZXQnOiB0aGlzLmluc2V0LFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiB0aGlzLnN0eWxlcyxcclxuICAgICAgcmVmOiAnY29udGVudCdcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIGgoJ2Zvb3RlcicsIGRhdGEsIHRoaXMuJHNsb3RzLmRlZmF1bHQpXHJcbiAgfVxyXG59XHJcbiJdfQ==