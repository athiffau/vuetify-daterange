import VTabsItems from '../VTabsItems';
import VTabsSlider from '../VTabsSlider';
import VIcon from '../../VIcon';
/**
 * Tabs generators
 *
 * @mixin
 */
/* @vue/component */
export default {
    methods: {
        genBar(items) {
            return this.$createElement('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-tabs__bar',
                'class': this.themeClasses,
                ref: 'bar'
            }), [
                this.genTransition('prev'),
                this.genWrapper(this.genContainer(items)),
                this.genTransition('next')
            ]);
        },
        genContainer(items) {
            return this.$createElement('div', {
                staticClass: 'v-tabs__container',
                class: {
                    'v-tabs__container--align-with-title': this.alignWithTitle,
                    'v-tabs__container--centered': this.centered,
                    'v-tabs__container--fixed-tabs': this.fixedTabs,
                    'v-tabs__container--grow': this.grow,
                    'v-tabs__container--icons-and-text': this.iconsAndText,
                    'v-tabs__container--overflow': this.isOverflowing,
                    'v-tabs__container--right': this.right
                },
                style: this.containerStyles,
                ref: 'container'
            }, items);
        },
        genIcon(direction) {
            if (!this.hasArrows ||
                !this[`${direction}IconVisible`])
                return null;
            return this.$createElement(VIcon, {
                staticClass: `v-tabs__icon v-tabs__icon--${direction}`,
                props: {
                    disabled: !this[`${direction}IconVisible`]
                },
                on: {
                    click: () => this.scrollTo(direction)
                }
            }, this[`${direction}Icon`]);
        },
        genItems(items, item) {
            if (items.length > 0)
                return items;
            if (!item.length)
                return null;
            return this.$createElement(VTabsItems, item);
        },
        genTransition(direction) {
            return this.$createElement('transition', {
                props: { name: 'fade-transition' }
            }, [this.genIcon(direction)]);
        },
        genWrapper(items) {
            return this.$createElement('div', {
                staticClass: 'v-tabs__wrapper',
                class: {
                    'v-tabs__wrapper--show-arrows': this.hasArrows
                },
                ref: 'wrapper',
                directives: [{
                        name: 'touch',
                        value: {
                            start: e => this.overflowCheck(e, this.onTouchStart),
                            move: e => this.overflowCheck(e, this.onTouchMove),
                            end: e => this.overflowCheck(e, this.onTouchEnd)
                        }
                    }]
            }, [items]);
        },
        genSlider(items) {
            if (!items.length) {
                items = [this.$createElement(VTabsSlider, {
                        props: { color: this.sliderColor }
                    })];
            }
            return this.$createElement('div', {
                staticClass: 'v-tabs__slider-wrapper',
                style: this.sliderStyles
            }, items);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1nZW5lcmF0b3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlRhYnMvbWl4aW5zL3RhYnMtZ2VuZXJhdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFVBQVUsTUFBTSxlQUFlLENBQUE7QUFDdEMsT0FBTyxXQUFXLE1BQU0sZ0JBQWdCLENBQUE7QUFDeEMsT0FBTyxLQUFLLE1BQU0sYUFBYSxDQUFBO0FBRS9COzs7O0dBSUc7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLE9BQU8sRUFBRTtRQUNQLE1BQU0sQ0FBRSxLQUFLO1lBQ1gsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDcEUsV0FBVyxFQUFFLGFBQWE7Z0JBQzFCLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDMUIsR0FBRyxFQUFFLEtBQUs7YUFDWCxDQUFDLEVBQUU7Z0JBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxVQUFVLENBQ2IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FDekI7Z0JBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7YUFDM0IsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFlBQVksQ0FBRSxLQUFLO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLFdBQVcsRUFBRSxtQkFBbUI7Z0JBQ2hDLEtBQUssRUFBRTtvQkFDTCxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsY0FBYztvQkFDMUQsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQzVDLCtCQUErQixFQUFFLElBQUksQ0FBQyxTQUFTO29CQUMvQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDcEMsbUNB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WUFBWTthQUN6QixFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ1gsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWVGFic0l0ZW1zIGZyb20gJy4uL1ZUYWJzSXRlbXMnXHJcbmltcG9ydCBWVGFic1NsaWRlciBmcm9tICcuLi9WVGFic1NsaWRlcidcclxuaW1wb3J0IFZJY29uIGZyb20gJy4uLy4uL1ZJY29uJ1xyXG5cclxuLyoqXHJcbiAqIFRhYnMgZ2VuZXJhdG9yc1xyXG4gKlxyXG4gKiBAbWl4aW5cclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5CYXIgKGl0ZW1zKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmNvbG9yLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRhYnNfX2JhcicsXHJcbiAgICAgICAgJ2NsYXNzJzogdGhpcy50aGVtZUNsYXNzZXMsXHJcbiAgICAgICAgcmVmOiAnYmFyJ1xyXG4gICAgICB9KSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuVHJhbnNpdGlvbigncHJldicpLFxyXG4gICAgICAgIHRoaXMuZ2VuV3JhcHBlcihcclxuICAgICAgICAgIHRoaXMuZ2VuQ29udGFpbmVyKGl0ZW1zKVxyXG4gICAgICAgICksXHJcbiAgICAgICAgdGhpcy5nZW5UcmFuc2l0aW9uKCduZXh0JylcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Db250YWluZXIgKGl0ZW1zKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6ICd2LXRhYnNfX2NvbnRhaW5lcicsXHJcbiAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICd2LXRhYnNfX2NvbnRhaW5lci0tYWxpZ24td2l0aC10aXRsZSc6IHRoaXMuYWxpZ25XaXRoVGl0bGUsXHJcbiAgICAgICAgICAndi10YWJzX19jb250YWluZXItLWNlbnRlcmVkJzogdGhpcy5jZW50ZXJlZCxcclxuICAgICAgICAgICd2LXRhYnNfX2NvbnRhaW5lci0tZml4ZWQtdGFicyc6IHRoaXMuZml4ZWRUYWJzLFxyXG4gICAgICAgICAgJ3YtdGFic19fY29udGFpbmVyLS1ncm93JzogdGhpcy5ncm93LFxyXG4gICAgICAgICAgJ3YtdGFic19fY29udGFpbmVyLS1pY29ucy1hbmQtdGV4dCc6IHRoaXMuaWNvbnNBbmRUZXh0LFxyXG4gICAgICAgICAgJ3YtdGFic19fY29udGFpbmVyLS1vdmVyZmxvdyc6IHRoaXMuaXNPdmVyZmxvd2luZyxcclxuICAgICAgICAgICd2LXRhYnNfX2NvbnRhaW5lci0tcmlnaHQnOiB0aGlzLnJpZ2h0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHlsZTogdGhpcy5jb250YWluZXJTdHlsZXMsXHJcbiAgICAgICAgcmVmOiAnY29udGFpbmVyJ1xyXG4gICAgICB9LCBpdGVtcylcclxuICAgIH0sXHJcbiAgICBnZW5JY29uIChkaXJlY3Rpb24pIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc0Fycm93cyB8fFxyXG4gICAgICAgICF0aGlzW2Ake2RpcmVjdGlvbn1JY29uVmlzaWJsZWBdXHJcbiAgICAgICkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZJY29uLCB7XHJcbiAgICAgICAgc3RhdGljQ2xhc3M6IGB2LXRhYnNfX2ljb24gdi10YWJzX19pY29uLS0ke2RpcmVjdGlvbn1gLFxyXG4gICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICBkaXNhYmxlZDogIXRoaXNbYCR7ZGlyZWN0aW9ufUljb25WaXNpYmxlYF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5zY3JvbGxUbyhkaXJlY3Rpb24pXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCB0aGlzW2Ake2RpcmVjdGlvbn1JY29uYF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuSXRlbXMgKGl0ZW1zLCBpdGVtKSB7XHJcbiAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwKSByZXR1cm4gaXRlbXNcclxuICAgICAgaWYgKCFpdGVtLmxlbmd0aCkgcmV0dXJuIG51bGxcclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZUYWJzSXRlbXMsIGl0ZW0pXHJcbiAgICB9LFxyXG4gICAgZ2VuVHJhbnNpdGlvbiAoZGlyZWN0aW9uKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIHByb3BzOiB7IG5hbWU6ICdmYWRlLXRyYW5zaXRpb24nIH1cclxuICAgICAgfSwgW3RoaXMuZ2VuSWNvbihkaXJlY3Rpb24pXSlcclxuICAgIH0sXHJcbiAgICBnZW5XcmFwcGVyIChpdGVtcykge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10YWJzX193cmFwcGVyJyxcclxuICAgICAgICBjbGFzczoge1xyXG4gICAgICAgICAgJ3YtdGFic19fd3JhcHBlci0tc2hvdy1hcnJvd3MnOiB0aGlzLmhhc0Fycm93c1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAnd3JhcHBlcicsXHJcbiAgICAgICAgZGlyZWN0aXZlczogW3tcclxuICAgICAgICAgIG5hbWU6ICd0b3VjaCcsXHJcbiAgICAgICAgICB2YWx1ZToge1xyXG4gICAgICAgICAgICBzdGFydDogZSA9PiB0aGlzLm92ZXJmbG93Q2hlY2soZSwgdGhpcy5vblRvdWNoU3RhcnQpLFxyXG4gICAgICAgICAgICBtb3ZlOiBlID0+IHRoaXMub3ZlcmZsb3dDaGVjayhlLCB0aGlzLm9uVG91Y2hNb3ZlKSxcclxuICAgICAgICAgICAgZW5kOiBlID0+IHRoaXMub3ZlcmZsb3dDaGVjayhlLCB0aGlzLm9uVG91Y2hFbmQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfV1cclxuICAgICAgfSwgW2l0ZW1zXSlcclxuICAgIH0sXHJcbiAgICBnZW5TbGlkZXIgKGl0ZW1zKSB7XHJcbiAgICAgIGlmICghaXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgaXRlbXMgPSBbdGhpcy4kY3JlYXRlRWxlbWVudChWVGFic1NsaWRlciwge1xyXG4gICAgICAgICAgcHJvcHM6IHsgY29sb3I6IHRoaXMuc2xpZGVyQ29sb3IgfVxyXG4gICAgICAgIH0pXVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi10YWJzX19zbGlkZXItd3JhcHBlcicsXHJcbiAgICAgICAgc3R5bGU6IHRoaXMuc2xpZGVyU3R5bGVzXHJcbiAgICAgIH0sIGl0ZW1zKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=