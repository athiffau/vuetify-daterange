/**
 * Tabs watchers
 *
 * @mixin
 */
/* @vue/component */
export default {
    watch: {
        activeTab(val, oldVal) {
            this.setOverflow();
            if (!val)
                return;
            this.tabItems && this.tabItems(this.getValue(val, this.items.indexOf(val)));
            // Do nothing for first tab
            // is handled from isBooted
            // watcher
            if (oldVal == null)
                return;
            this.updateTabsView();
        },
        alignWithTitle: 'callSlider',
        centered: 'callSlider',
        fixedTabs: 'callSlider',
        hasArrows(val) {
            if (!val)
                this.scrollOffset = 0;
        },
        /* @deprecate */
        internalValue(val) {
            /* istanbul ignore else */
            if (!this.$listeners['input'])
                return;
            this.$emit('input', val);
        },
        lazyValue: 'updateTabs',
        right: 'callSlider',
        '$vuetify.application.left': 'onResize',
        '$vuetify.application.right': 'onResize',
        scrollOffset(val) {
            this.$refs.container.style.transform = `translateX(${-val}px)`;
            if (this.hasArrows) {
                this.prevIconVisible = this.checkPrevIcon();
                this.nextIconVisible = this.checkNextIcon();
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy13YXRjaGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUYWJzL21peGlucy90YWJzLXdhdGNoZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLEtBQUssRUFBRTtRQUNMLFNBQVMsQ0FBRSxHQUFHLEVBQUUsTUFBTTtZQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7WUFFbEIsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTTtZQUVoQixJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQzVDLENBQUE7WUFFRCwyQkFBMkI7WUFDM0IsMkJBQTJCO1lBQzNCLFVBQVU7WUFDVixJQUFJLE1BQU0sSUFBSSxJQUFJO2dCQUFFLE9BQU07WUFFMUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxjQUFjLEVBQUUsWUFBWTtRQUM1QixRQUFRLEVBQUUsWUFBWTtRQUN0QixTQUFTLEVBQUUsWUFBWTtRQUN2QixTQUFTLENBQUUsR0FBRztZQUNaLElBQUksQ0FBQyxHQUFHO2dCQUFFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFBO1FBQ2pDLENBQUM7UUFDRCxnQkFBZ0I7UUFDaEIsYUFBYSxDQUFFLEdBQUc7WUFDaEIsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFBRSxPQUFNO1lBRXJDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxTQUFTLEVBQUUsWUFBWTtRQUN2QixLQUFLLEVBQUUsWUFBWTtRQUNuQiwyQkFBMkIsRUFBRSxVQUFVO1FBQ3ZDLDRCQUE0QixFQUFFLFVBQVU7UUFDeEMsWUFBWSxDQUFFLEdBQUc7WUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQTtZQUM5RCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO2dCQUMzQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTthQUM1QztRQUNILENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVGFicyB3YXRjaGVyc1xyXG4gKlxyXG4gKiBAbWl4aW5cclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICB3YXRjaDoge1xyXG4gICAgYWN0aXZlVGFiICh2YWwsIG9sZFZhbCkge1xyXG4gICAgICB0aGlzLnNldE92ZXJmbG93KClcclxuXHJcbiAgICAgIGlmICghdmFsKSByZXR1cm5cclxuXHJcbiAgICAgIHRoaXMudGFiSXRlbXMgJiYgdGhpcy50YWJJdGVtcyhcclxuICAgICAgICB0aGlzLmdldFZhbHVlKHZhbCwgdGhpcy5pdGVtcy5pbmRleE9mKHZhbCkpXHJcbiAgICAgIClcclxuXHJcbiAgICAgIC8vIERvIG5vdGhpbmcgZm9yIGZpcnN0IHRhYlxyXG4gICAgICAvLyBpcyBoYW5kbGVkIGZyb20gaXNCb290ZWRcclxuICAgICAgLy8gd2F0Y2hlclxyXG4gICAgICBpZiAob2xkVmFsID09IG51bGwpIHJldHVyblxyXG5cclxuICAgICAgdGhpcy51cGRhdGVUYWJzVmlldygpXHJcbiAgICB9LFxyXG4gICAgYWxpZ25XaXRoVGl0bGU6ICdjYWxsU2xpZGVyJyxcclxuICAgIGNlbnRlcmVkOiAnY2FsbFNsaWRlcicsXHJcbiAgICBmaXhlZFRhYnM6ICdjYWxsU2xpZGVyJyxcclxuICAgIGhhc0Fycm93cyAodmFsKSB7XHJcbiAgICAgIGlmICghdmFsKSB0aGlzLnNjcm9sbE9mZnNldCA9IDBcclxuICAgIH0sXHJcbiAgICAvKiBAZGVwcmVjYXRlICovXHJcbiAgICBpbnRlcm5hbFZhbHVlICh2YWwpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgaWYgKCF0aGlzLiRsaXN0ZW5lcnNbJ2lucHV0J10pIHJldHVyblxyXG5cclxuICAgICAgdGhpcy4kZW1pdCgnaW5wdXQnLCB2YWwpXHJcbiAgICB9LFxyXG4gICAgbGF6eVZhbHVlOiAndXBkYXRlVGFicycsXHJcbiAgICByaWdodDogJ2NhbGxTbGlkZXInLFxyXG4gICAgJyR2dWV0aWZ5LmFwcGxpY2F0aW9uLmxlZnQnOiAnb25SZXNpemUnLFxyXG4gICAgJyR2dWV0aWZ5LmFwcGxpY2F0aW9uLnJpZ2h0JzogJ29uUmVzaXplJyxcclxuICAgIHNjcm9sbE9mZnNldCAodmFsKSB7XHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LXZhbH1weClgXHJcbiAgICAgIGlmICh0aGlzLmhhc0Fycm93cykge1xyXG4gICAgICAgIHRoaXMucHJldkljb25WaXNpYmxlID0gdGhpcy5jaGVja1ByZXZJY29uKClcclxuICAgICAgICB0aGlzLm5leHRJY29uVmlzaWJsZSA9IHRoaXMuY2hlY2tOZXh0SWNvbigpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19