/**
 * Tabs computed
 *
 * @mixin
 */
/* @vue/component */
export default {
    computed: {
        activeTab() {
            if (!this.selectedItems.length)
                return undefined;
            return this.selectedItems[0];
        },
        containerStyles() {
            return this.height ? {
                height: `${parseInt(this.height, 10)}px`
            } : null;
        },
        hasArrows() {
            return (this.showArrows || !this.isMobile) && this.isOverflowing;
        },
        isMobile() {
            return this.$vuetify.breakpoint.width < this.mobileBreakPoint;
        },
        sliderStyles() {
            return {
                left: `${this.sliderLeft}px`,
                transition: this.sliderLeft != null ? null : 'none',
                width: `${this.sliderWidth}px`
            };
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFicy1jb21wdXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZUYWJzL21peGlucy90YWJzLWNvbXB1dGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLFFBQVEsRUFBRTtRQUNSLFNBQVM7WUFDUCxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2dCQUFFLE9BQU8sU0FBUyxDQUFBO1lBRWhELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5QixDQUFDO1FBQ0QsZUFBZTtZQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJO2FBQ3pDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUNWLENBQUM7UUFDRCxTQUFTO1lBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUNsRSxDQUFDO1FBQ0QsUUFBUTtZQUNOLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtRQUMvRCxDQUFDO1FBQ0QsWUFBWTtZQUNWLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSTtnQkFDNUIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU07Z0JBQ25ELEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUk7YUFDL0IsQ0FBQTtRQUNILENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVGFicyBjb21wdXRlZFxyXG4gKlxyXG4gKiBAbWl4aW5cclxuICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjb21wdXRlZDoge1xyXG4gICAgYWN0aXZlVGFiICgpIHtcclxuICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoKSByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZEl0ZW1zWzBdXHJcbiAgICB9LFxyXG4gICAgY29udGFpbmVyU3R5bGVzICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaGVpZ2h0ID8ge1xyXG4gICAgICAgIGhlaWdodDogYCR7cGFyc2VJbnQodGhpcy5oZWlnaHQsIDEwKX1weGBcclxuICAgICAgfSA6IG51bGxcclxuICAgIH0sXHJcbiAgICBoYXNBcnJvd3MgKCkge1xyXG4gICAgICByZXR1cm4gKHRoaXMuc2hvd0Fycm93cyB8fCAhdGhpcy5pc01vYmlsZSkgJiYgdGhpcy5pc092ZXJmbG93aW5nXHJcbiAgICB9LFxyXG4gICAgaXNNb2JpbGUgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kdnVldGlmeS5icmVha3BvaW50LndpZHRoIDwgdGhpcy5tb2JpbGVCcmVha1BvaW50XHJcbiAgICB9LFxyXG4gICAgc2xpZGVyU3R5bGVzICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsZWZ0OiBgJHt0aGlzLnNsaWRlckxlZnR9cHhgLFxyXG4gICAgICAgIHRyYW5zaXRpb246IHRoaXMuc2xpZGVyTGVmdCAhPSBudWxsID8gbnVsbCA6ICdub25lJyxcclxuICAgICAgICB3aWR0aDogYCR7dGhpcy5zbGlkZXJXaWR0aH1weGBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=