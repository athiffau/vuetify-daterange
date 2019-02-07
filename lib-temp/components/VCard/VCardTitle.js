// Types
import Vue from 'vue';
/* @vue/component */
export default Vue.extend({
    name: 'v-card-title',
    functional: true,
    props: {
        primaryTitle: Boolean
    },
    render(h, { data, props, children }) {
        data.staticClass = (`v-card__title ${data.staticClass || ''}`).trim();
        if (props.primaryTitle)
            data.staticClass += ' v-card__title--primary';
        return h('div', data, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcmRUaXRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDYXJkL1ZDYXJkVGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUTtBQUNSLE9BQU8sR0FBYyxNQUFNLEtBQUssQ0FBQTtBQUVoQyxvQkFBb0I7QUFDcEIsZUFBZSxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksRUFBRSxjQUFjO0lBRXBCLFVBQVUsRUFBRSxJQUFJO0lBRWhCLEtBQUssRUFBRTtRQUNMLFlBQVksRUFBRSxPQUFPO0tBQ3RCO0lBRUQsTUFBTSxDQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1FBRXJFLElBQUksS0FBSyxDQUFDLFlBQVk7WUFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLHlCQUF5QixDQUFBO1FBRXJFLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDakMsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFR5cGVzXHJcbmltcG9ydCBWdWUsIHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1jYXJkLXRpdGxlJyxcclxuXHJcbiAgZnVuY3Rpb25hbDogdHJ1ZSxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIHByaW1hcnlUaXRsZTogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCwgeyBkYXRhLCBwcm9wcywgY2hpbGRyZW4gfSk6IFZOb2RlIHtcclxuICAgIGRhdGEuc3RhdGljQ2xhc3MgPSAoYHYtY2FyZF9fdGl0bGUgJHtkYXRhLnN0YXRpY0NsYXNzIHx8ICcnfWApLnRyaW0oKVxyXG5cclxuICAgIGlmIChwcm9wcy5wcmltYXJ5VGl0bGUpIGRhdGEuc3RhdGljQ2xhc3MgKz0gJyB2LWNhcmRfX3RpdGxlLS1wcmltYXJ5J1xyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCBkYXRhLCBjaGlsZHJlbilcclxuICB9XHJcbn0pXHJcbiJdfQ==