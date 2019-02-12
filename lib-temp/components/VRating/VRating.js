// Styles
import '../../stylus/components/_rating.styl';
// Components
import VIcon from '../VIcon';
// Mixins
import Colorable from '../../mixins/colorable';
import Delayable from '../../mixins/delayable';
import Sizeable from '../../mixins/sizeable';
import Rippleable from '../../mixins/rippleable';
import Themeable from '../../mixins/themeable';
// Utilities
import { createRange } from '../../util/helpers';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Colorable, Delayable, Rippleable, Sizeable, Themeable).extend({
    name: 'v-rating',
    props: {
        backgroundColor: {
            type: String,
            default: 'accent'
        },
        color: {
            type: String,
            default: 'primary'
        },
        dense: Boolean,
        emptyIcon: {
            type: String,
            default: '$vuetify.icons.ratingEmpty'
        },
        fullIcon: {
            type: String,
            default: '$vuetify.icons.ratingFull'
        },
        halfIcon: {
            type: String,
            default: '$vuetify.icons.ratingHalf'
        },
        halfIncrements: Boolean,
        length: {
            type: [Number, String],
            default: 5
        },
        clearable: Boolean,
        readonly: Boolean,
        hover: Boolean,
        value: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            hoverIndex: -1,
            internalValue: this.value
        };
    },
    computed: {
        directives() {
            if (this.readonly || !this.ripple)
                return [];
            return [{
                    name: 'ripple',
                    value: { circle: true }
                }];
        },
        iconProps() {
            const { dark, medium, large, light, small, size, xLarge } = this.$props;
            return {
                dark,
                medium,
                large,
                light,
                size,
                small,
                xLarge
            };
        },
        isHovering() {
            return this.hover && this.hoverIndex >= 0;
        }
    },
    watch: {
        internalValue(val) {
            val !== this.value && this.$emit('input', val);
        },
        value(val) {
            this.internalValue = val;
        }
    },
    methods: {
        createClickFn(i) {
            return (e) => {
                if (this.readonly)
                    return;
                const newValue = this.genHoverIndex(e, i);
                if (this.clearable && this.internalValue === newValue) {
                    this.internalValue = 0;
                }
                else {
                    this.internalValue = newValue;
                }
            };
        },
        createProps(i) {
            const props = {
                index: i,
                value: this.internalValue,
                click: this.createClickFn(i),
                isFilled: Math.floor(this.internalValue) > i,
                isHovered: Math.floor(this.hoverIndex) > i
            };
            if (this.halfIncrements) {
                props.isHalfHovered = !props.isHovered && (this.hoverIndex - i) % 1 > 0;
                props.isHalfFilled = !props.isFilled && (this.internalValue - i) % 1 > 0;
            }
            return props;
        },
        genHoverIndex(e, i) {
            return i + (this.isHalfEvent(e) ? 0.5 : 1);
        },
        getIconName(props) {
            const isFull = this.isHovering ? props.isHovered : props.isFilled;
            const isHalf = this.isHovering ? props.isHalfHovered : props.isHalfFilled;
            return isFull ? this.fullIcon : isHalf ? this.halfIcon : this.emptyIcon;
        },
        getColor(props) {
            if (this.isHovering) {
                if (props.isHovered || props.isHalfHovered)
                    return this.color;
            }
            else {
                if (props.isFilled || props.isHalfFilled)
                    return this.color;
            }
            return this.backgroundColor;
        },
        isHalfEvent(e) {
            if (this.halfIncrements) {
                const rect = e.target && e.target.getBoundingClientRect();
                if (rect && (e.pageX - rect.left) < rect.width / 2)
                    return true;
            }
            return false;
        },
        onMouseEnter(e, i) {
            this.runDelay('open', () => {
                this.hoverIndex = this.genHoverIndex(e, i);
            });
        },
        onMouseLeave() {
            this.runDelay('close', () => (this.hoverIndex = -1));
        },
        genItem(i) {
            const props = this.createProps(i);
            if (this.$scopedSlots.item)
                return this.$scopedSlots.item(props);
            const listeners = {
                click: props.click
            };
            if (this.hover) {
                listeners.mouseenter = (e) => this.onMouseEnter(e, i);
                listeners.mouseleave = this.onMouseLeave;
                if (this.halfIncrements) {
                    listeners.mousemove = (e) => this.onMouseEnter(e, i);
                }
            }
            return this.$createElement(VIcon, this.setTextColor(this.getColor(props), {
                directives: this.directives,
                props: this.iconProps,
                on: listeners
            }), [this.getIconName(props)]);
        }
    },
    render(h) {
        const children = createRange(Number(this.length)).map(i => this.genItem(i));
        return h('div', {
            staticClass: 'v-rating',
            class: {
                'v-rating--readonly': this.readonly,
                'v-rating--dense': this.dense
            }
        }, children);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlJhdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZSYXRpbmcvVlJhdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtBQUU3QyxhQUFhO0FBQ2IsT0FBTyxLQUFLLE1BQU0sVUFBVSxDQUFBO0FBRTVCLFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUM5QyxPQUFPLFFBQVEsTUFBTSx1QkFBdUIsQ0FBQTtBQUM1QyxPQUFPLFVBQVUsTUFBTSx5QkFBeUIsQ0FBQTtBQUNoRCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxZQUFZO0FBQ1osT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2hELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBZXRDLG9CQUFvQjtBQUNwQixlQUFlLE1BQU0sQ0FDbkIsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFNBQVMsQ0FDVixDQUFDLE1BQU0sQ0FBQztJQUNQLElBQUksRUFBRSxVQUFVO0lBRWhCLEtBQUssRUFBRTtRQUNMLGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFFBQVE7U0FDbEI7UUFDRCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxTQUFTLEVBQUU7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSw0QkFBNEI7U0FDdEM7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSwyQkFBMkI7U0FDckM7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsTUFB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QztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19yYXRpbmcuc3R5bCdcclxuXHJcbi8vIENvbXBvbmVudHNcclxuaW1wb3J0IFZJY29uIGZyb20gJy4uL1ZJY29uJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuaW1wb3J0IERlbGF5YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvZGVsYXlhYmxlJ1xyXG5pbXBvcnQgU2l6ZWFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3NpemVhYmxlJ1xyXG5pbXBvcnQgUmlwcGxlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmlwcGxlYWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gVXRpbGl0aWVzXHJcbmltcG9ydCB7IGNyZWF0ZVJhbmdlIH0gZnJvbSAnLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUsIFZOb2RlRGlyZWN0aXZlLCBWTm9kZUNoaWxkcmVuIH0gZnJvbSAndnVlJ1xyXG5cclxudHlwZSBJdGVtU2xvdFByb3BzID0ge1xyXG4gIGluZGV4OiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyXHJcbiAgaXNGaWxsZWQ6IGJvb2xlYW5cclxuICBpc0hhbGZGaWxsZWQ/OiBib29sZWFuIHwgdW5kZWZpbmVkXHJcbiAgaXNIb3ZlcmVkOiBib29sZWFuXHJcbiAgaXNIYWxmSG92ZXJlZD86IGJvb2xlYW4gfCB1bmRlZmluZWRcclxuICBjbGljazogRnVuY3Rpb25cclxufVxyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIENvbG9yYWJsZSxcclxuICBEZWxheWFibGUsXHJcbiAgUmlwcGxlYWJsZSxcclxuICBTaXplYWJsZSxcclxuICBUaGVtZWFibGVcclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXJhdGluZycsXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnYWNjZW50J1xyXG4gICAgfSxcclxuICAgIGNvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ3ByaW1hcnknXHJcbiAgICB9LFxyXG4gICAgZGVuc2U6IEJvb2xlYW4sXHJcbiAgICBlbXB0eUljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMucmF0aW5nRW1wdHknXHJcbiAgICB9LFxyXG4gICAgZnVsbEljb246IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuaWNvbnMucmF0aW5nRnVsbCdcclxuICAgIH0sXHJcbiAgICBoYWxmSWNvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5pY29ucy5yYXRpbmdIYWxmJ1xyXG4gICAgfSxcclxuICAgIGhhbGZJbmNyZW1lbnRzOiBCb29sZWFuLFxyXG4gICAgbGVuZ3RoOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDVcclxuICAgIH0sXHJcbiAgICBjbGVhcmFibGU6IEJvb2xlYW4sXHJcbiAgICByZWFkb25seTogQm9vbGVhbixcclxuICAgIGhvdmVyOiBCb29sZWFuLFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGF0YSAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBob3ZlckluZGV4OiAtMSxcclxuICAgICAgaW50ZXJuYWxWYWx1ZTogdGhpcy52YWx1ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBkaXJlY3RpdmVzICgpOiBWTm9kZURpcmVjdGl2ZVtdIHtcclxuICAgICAgaWYgKHRoaXMucmVhZG9ubHkgfHwgIXRoaXMucmlwcGxlKSByZXR1cm4gW11cclxuXHJcbiAgICAgIHJldHVybiBbe1xyXG4gICAgICAgIG5hbWU6ICdyaXBwbGUnLFxyXG4gICAgICAgIHZhbHVlOiB7IGNpcmNsZTogdHJ1ZSB9XHJcbiAgICAgIH0gYXMgVk5vZGVEaXJlY3RpdmVdXHJcbiAgICB9LFxyXG4gICAgaWNvblByb3BzICgpOiBvYmplY3Qge1xyXG4gICAgICBjb25zdCB7XHJcbiAgICAgICAgZGFyayxcclxuICAgICAgICBtZWRpdW0sXHJcbiAgICAgICAgbGFyZ2UsXHJcbiAgICAgICAgbGlnaHQsXHJcbiAgICAgICAgc21hbGwsXHJcbiAgICAgICAgc2l6ZSxcclxuICAgICAgICB4TGFyZ2VcclxuICAgICAgfSA9IHRoaXMuJHByb3BzXHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGRhcmssXHJcbiAgICAgICAgbWVkaXVtLFxyXG4gICAgICAgIGxhcmdlLFxyXG4gICAgICAgIGxpZ2h0LFxyXG4gICAgICAgIHNpemUsXHJcbiAgICAgICAgc21hbGwsXHJcbiAgICAgICAgeExhcmdlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0hvdmVyaW5nICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaG92ZXIgJiYgdGhpcy5ob3ZlckluZGV4ID49IDBcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaW50ZXJuYWxWYWx1ZSAodmFsKSB7XHJcbiAgICAgIHZhbCAhPT0gdGhpcy52YWx1ZSAmJiB0aGlzLiRlbWl0KCdpbnB1dCcsIHZhbClcclxuICAgIH0sXHJcbiAgICB2YWx1ZSAodmFsKSB7XHJcbiAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IHZhbFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNyZWF0ZUNsaWNrRm4gKGk6IG51bWJlcik6IEZ1bmN0aW9uIHtcclxuICAgICAgcmV0dXJuIChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVhZG9ubHkpIHJldHVyblxyXG5cclxuICAgICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMuZ2VuSG92ZXJJbmRleChlLCBpKVxyXG4gICAgICAgIGlmICh0aGlzLmNsZWFyYWJsZSAmJiB0aGlzLmludGVybmFsVmFsdWUgPT09IG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSAwXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuaW50ZXJuYWxWYWx1ZSA9IG5ld1ZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlUHJvcHMgKGk6IG51bWJlcik6IEl0ZW1TbG90UHJvcHMge1xyXG4gICAgICBjb25zdCBwcm9wczogSXRlbVNsb3RQcm9wcyA9IHtcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICB2YWx1ZTogdGhpcy5pbnRlcm5hbFZhbHVlLFxyXG4gICAgICAgIGNsaWNrOiB0aGlzLmNyZWF0ZUNsaWNrRm4oaSksXHJcbiAgICAgICAgaXNGaWxsZWQ6IE1hdGguZmxvb3IodGhpcy5pbnRlcm5hbFZhbHVlKSA+IGksXHJcbiAgICAgICAgaXNIb3ZlcmVkOiBNYXRoLmZsb29yKHRoaXMuaG92ZXJJbmRleCkgPiBpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmhhbGZJbmNyZW1lbnRzKSB7XHJcbiAgICAgICAgcHJvcHMuaXNIYWxmSG92ZXJlZCA9ICFwcm9wcy5pc0hvdmVyZWQgJiYgKHRoaXMuaG92ZXJJbmRleCAtIGkpICUgMSA+IDBcclxuICAgICAgICBwcm9wcy5pc0hhbGZGaWxsZWQgPSAhcHJvcHMuaXNGaWxsZWQgJiYgKHRoaXMuaW50ZXJuYWxWYWx1ZSAtIGkpICUgMSA+IDBcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHByb3BzXHJcbiAgICB9LFxyXG4gICAgZ2VuSG92ZXJJbmRleCAoZTogTW91c2VFdmVudCwgaTogbnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiBpICsgKHRoaXMuaXNIYWxmRXZlbnQoZSkgPyAwLjUgOiAxKVxyXG4gICAgfSxcclxuICAgIGdldEljb25OYW1lIChwcm9wczogSXRlbVNsb3RQcm9wcyk6IHN0cmluZyB7XHJcbiAgICAgIGNvbnN0IGlzRnVsbCA9IHRoaXMuaXNIb3ZlcmluZyA/IHByb3BzLmlzSG92ZXJlZCA6IHByb3BzLmlzRmlsbGVkXHJcbiAgICAgIGNvbnN0IGlzSGFsZiA9IHRoaXMuaXNIb3ZlcmluZyA/IHByb3BzLmlzSGFsZkhvdmVyZWQgOiBwcm9wcy5pc0hhbGZGaWxsZWRcclxuXHJcbiAgICAgIHJldHVybiBpc0Z1bGwgPyB0aGlzLmZ1bGxJY29uIDogaXNIYWxmID8gdGhpcy5oYWxmSWNvbiA6IHRoaXMuZW1wdHlJY29uXHJcbiAgICB9LFxyXG4gICAgZ2V0Q29sb3IgKHByb3BzOiBJdGVtU2xvdFByb3BzKTogc3RyaW5nIHtcclxuICAgICAgaWYgKHRoaXMuaXNIb3ZlcmluZykge1xyXG4gICAgICAgIGlmIChwcm9wcy5pc0hvdmVyZWQgfHwgcHJvcHMuaXNIYWxmSG92ZXJlZCkgcmV0dXJuIHRoaXMuY29sb3JcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocHJvcHMuaXNGaWxsZWQgfHwgcHJvcHMuaXNIYWxmRmlsbGVkKSByZXR1cm4gdGhpcy5jb2xvclxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5iYWNrZ3JvdW5kQ29sb3JcclxuICAgIH0sXHJcbiAgICBpc0hhbGZFdmVudCAoZTogTW91c2VFdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5oYWxmSW5jcmVtZW50cykge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlLnRhcmdldCAmJiAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgaWYgKHJlY3QgJiYgKGUucGFnZVggLSByZWN0LmxlZnQpIDwgcmVjdC53aWR0aCAvIDIpIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSxcclxuICAgIG9uTW91c2VFbnRlciAoZTogTW91c2VFdmVudCwgaTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucnVuRGVsYXkoJ29wZW4nLCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ob3ZlckluZGV4ID0gdGhpcy5nZW5Ib3ZlckluZGV4KGUsIGkpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgb25Nb3VzZUxlYXZlICgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5ydW5EZWxheSgnY2xvc2UnLCAoKSA9PiAodGhpcy5ob3ZlckluZGV4ID0gLTEpKVxyXG4gICAgfSxcclxuICAgIGdlbkl0ZW0gKGk6IG51bWJlcik6IFZOb2RlIHwgVk5vZGVDaGlsZHJlbiB8IHN0cmluZyB7XHJcbiAgICAgIGNvbnN0IHByb3BzID0gdGhpcy5jcmVhdGVQcm9wcyhpKVxyXG5cclxuICAgICAgaWYgKHRoaXMuJHNjb3BlZFNsb3RzLml0ZW0pIHJldHVybiB0aGlzLiRzY29wZWRTbG90cy5pdGVtKHByb3BzKVxyXG5cclxuICAgICAgY29uc3QgbGlzdGVuZXJzOiBSZWNvcmQ8c3RyaW5nLCBGdW5jdGlvbj4gPSB7XHJcbiAgICAgICAgY2xpY2s6IHByb3BzLmNsaWNrXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmhvdmVyKSB7XHJcbiAgICAgICAgbGlzdGVuZXJzLm1vdXNlZW50ZXIgPSAoZTogTW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlRW50ZXIoZSwgaSlcclxuICAgICAgICBsaXN0ZW5lcnMubW91c2VsZWF2ZSA9IHRoaXMub25Nb3VzZUxlYXZlXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhhbGZJbmNyZW1lbnRzKSB7XHJcbiAgICAgICAgICBsaXN0ZW5lcnMubW91c2Vtb3ZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZUVudGVyKGUsIGkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgdGhpcy5zZXRUZXh0Q29sb3IodGhpcy5nZXRDb2xvcihwcm9wcyksIHtcclxuICAgICAgICBkaXJlY3RpdmVzOiB0aGlzLmRpcmVjdGl2ZXMsXHJcbiAgICAgICAgcHJvcHM6IHRoaXMuaWNvblByb3BzLFxyXG4gICAgICAgIG9uOiBsaXN0ZW5lcnNcclxuICAgICAgfSksIFt0aGlzLmdldEljb25OYW1lKHByb3BzKV0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgY29uc3QgY2hpbGRyZW4gPSBjcmVhdGVSYW5nZShOdW1iZXIodGhpcy5sZW5ndGgpKS5tYXAoaSA9PiB0aGlzLmdlbkl0ZW0oaSkpXHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXJhdGluZycsXHJcbiAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgJ3YtcmF0aW5nLS1yZWFkb25seSc6IHRoaXMucmVhZG9ubHksXHJcbiAgICAgICAgJ3YtcmF0aW5nLS1kZW5zZSc6IHRoaXMuZGVuc2VcclxuICAgICAgfVxyXG4gICAgfSwgY2hpbGRyZW4pXHJcbiAgfVxyXG59KVxyXG4iXX0=