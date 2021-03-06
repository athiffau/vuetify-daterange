import '../../stylus/components/_avatars.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable).extend({
    name: 'v-avatar',
    functional: true,
    props: {
        // TODO: inherit these
        color: String,
        size: {
            type: [Number, String],
            default: 48
        },
        tile: Boolean
    },
    render(h, { data, props, children }) {
        data.staticClass = (`v-avatar ${data.staticClass || ''}`).trim();
        if (props.tile)
            data.staticClass += ' v-avatar--tile';
        const size = convertToUnit(props.size);
        data.style = {
            height: size,
            width: size,
            ...data.style
        };
        return h('div', Colorable.options.methods.setBackgroundColor(props.color, data), children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkF2YXRhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZBdmF0YXIvVkF2YXRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHVDQUF1QyxDQUFBO0FBRTlDLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFJbEQsT0FBTyxNQUFNLE1BQU0sbUJBQW1CLENBQUE7QUFFdEMsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxJQUFJLEVBQUUsVUFBVTtJQUVoQixVQUFVLEVBQUUsSUFBSTtJQUVoQixLQUFLLEVBQUU7UUFDTCxzQkFBc0I7UUFDdEIsS0FBSyxFQUFFLE1BQU07UUFFYixJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxJQUFJLEVBQUUsT0FBTztLQUNkO0lBRUQsTUFBTSxDQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxZQUFZLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUVoRSxJQUFJLEtBQUssQ0FBQyxJQUFJO1lBQUUsSUFBSSxDQUFDLFdBQVcsSUFBSSxpQkFBaUIsQ0FBQTtRQUVyRCxNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUssRUFBRSxJQUFJO1lBQ1gsR0FBRyxJQUFJLENBQUMsS0FBSztTQUNkLENBQUE7UUFFRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUM1RixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fYXZhdGFycy5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKENvbG9yYWJsZSkuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1hdmF0YXInLFxyXG5cclxuICBmdW5jdGlvbmFsOiB0cnVlLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgLy8gVE9ETzogaW5oZXJpdCB0aGVzZVxyXG4gICAgY29sb3I6IFN0cmluZyxcclxuXHJcbiAgICBzaXplOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDQ4XHJcbiAgICB9LFxyXG4gICAgdGlsZTogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCwgeyBkYXRhLCBwcm9wcywgY2hpbGRyZW4gfSk6IFZOb2RlIHtcclxuICAgIGRhdGEuc3RhdGljQ2xhc3MgPSAoYHYtYXZhdGFyICR7ZGF0YS5zdGF0aWNDbGFzcyB8fCAnJ31gKS50cmltKClcclxuXHJcbiAgICBpZiAocHJvcHMudGlsZSkgZGF0YS5zdGF0aWNDbGFzcyArPSAnIHYtYXZhdGFyLS10aWxlJ1xyXG5cclxuICAgIGNvbnN0IHNpemUgPSBjb252ZXJ0VG9Vbml0KHByb3BzLnNpemUpXHJcbiAgICBkYXRhLnN0eWxlID0ge1xyXG4gICAgICBoZWlnaHQ6IHNpemUsXHJcbiAgICAgIHdpZHRoOiBzaXplLFxyXG4gICAgICAuLi5kYXRhLnN0eWxlXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIENvbG9yYWJsZS5vcHRpb25zLm1ldGhvZHMuc2V0QmFja2dyb3VuZENvbG9yKHByb3BzLmNvbG9yLCBkYXRhKSwgY2hpbGRyZW4pXHJcbiAgfVxyXG59KVxyXG4iXX0=