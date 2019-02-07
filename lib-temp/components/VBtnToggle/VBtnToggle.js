// Styles
import '../../stylus/components/_button-toggle.styl';
// Mixins
import ButtonGroup from '../../mixins/button-group';
/* @vue/component */
export default ButtonGroup.extend({
    name: 'v-btn-toggle',
    props: {
        activeClass: {
            type: String,
            default: 'v-btn--active'
        }
    },
    computed: {
        classes() {
            return {
                ...ButtonGroup.options.computed.classes.call(this),
                'v-btn-toggle': true,
                'v-btn-toggle--only-child': this.selectedItems.length === 1,
                'v-btn-toggle--selected': this.selectedItems.length > 0
            };
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJ0blRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZCdG5Ub2dnbGUvVkJ0blRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyw2Q0FBNkMsQ0FBQTtBQUVwRCxTQUFTO0FBQ1QsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFFbkQsb0JBQW9CO0FBQ3BCLGVBQWUsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNoQyxJQUFJLEVBQUUsY0FBYztJQUVwQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUU7WUFDWCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxlQUFlO1NBQ3pCO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNsRCxjQUFjLEVBQUUsSUFBSTtnQkFDcEIsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFDM0Qsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQzthQUN4RCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU3R5bGVzXHJcbmltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX2J1dHRvbi10b2dnbGUuc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQnV0dG9uR3JvdXAgZnJvbSAnLi4vLi4vbWl4aW5zL2J1dHRvbi1ncm91cCdcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbkdyb3VwLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtYnRuLXRvZ2dsZScsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhY3RpdmVDbGFzczoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICd2LWJ0bi0tYWN0aXZlJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBjbGFzc2VzICgpOiBvYmplY3Qge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLkJ1dHRvbkdyb3VwLm9wdGlvbnMuY29tcHV0ZWQuY2xhc3Nlcy5jYWxsKHRoaXMpLFxyXG4gICAgICAgICd2LWJ0bi10b2dnbGUnOiB0cnVlLFxyXG4gICAgICAgICd2LWJ0bi10b2dnbGUtLW9ubHktY2hpbGQnOiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxLFxyXG4gICAgICAgICd2LWJ0bi10b2dnbGUtLXNlbGVjdGVkJzogdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA+IDBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19