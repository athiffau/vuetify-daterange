// Styles
import '../../stylus/components/_badges.styl';
// Mixins
import Colorable from '../../mixins/colorable';
import Toggleable from '../../mixins/toggleable';
import { factory as PositionableFactory } from '../../mixins/positionable';
import Transitionable from '../../mixins/transitionable';
import mixins from '../../util/mixins';
export default mixins(Colorable, Toggleable, PositionableFactory(['left', 'bottom']), Transitionable
/* @vue/component */
).extend({
    name: 'v-badge',
    props: {
        color: {
            type: String,
            default: 'primary'
        },
        overlap: Boolean,
        transition: {
            type: String,
            default: 'fab-transition'
        },
        value: {
            default: true
        }
    },
    computed: {
        classes() {
            return {
                'v-badge--bottom': this.bottom,
                'v-badge--left': this.left,
                'v-badge--overlap': this.overlap
            };
        }
    },
    render(h) {
        const badge = this.$slots.badge && [h('span', this.setBackgroundColor(this.color, {
                staticClass: 'v-badge__badge',
                attrs: this.$attrs,
                directives: [{
                        name: 'show',
                        value: this.isActive
                    }]
            }), this.$slots.badge)];
        return h('span', {
            staticClass: 'v-badge',
            'class': this.classes
        }, [
            this.$slots.default,
            h('transition', {
                props: {
                    name: this.transition,
                    origin: this.origin,
                    mode: this.mode
                }
            }, badge)
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkJhZGdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkJhZGdlL1ZCYWRnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxzQ0FBc0MsQ0FBQTtBQUU3QyxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxVQUFVLE1BQU0seUJBQXlCLENBQUE7QUFDaEQsT0FBTyxFQUFFLE9BQU8sSUFBSSxtQkFBbUIsRUFBRSxNQUFNLDJCQUEyQixDQUFBO0FBQzFFLE9BQU8sY0FBYyxNQUFNLDZCQUE2QixDQUFBO0FBSXhELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBRXRDLGVBQWUsTUFBTSxDQUNuQixTQUFTLEVBQ1QsVUFBVSxFQUNWLG1CQUFtQixDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQ3ZDLGNBQWM7QUFDaEIsb0JBQW9CO0NBQ25CLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFNBQVM7SUFFZixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUU7WUFDTCxJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ25CO1FBQ0QsT0FBTyxFQUFFLE9BQU87UUFDaEIsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsZ0JBQWdCO1NBQzFCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFLElBQUk7U0FDZDtLQUNGO0lBRUQsUUFBUSxFQUFFO1FBQ1IsT0FBTztZQUNMLE9BQU87Z0JBQ0wsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQzlCLGVBQWUsRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDMUIsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDakMsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNoRixXQUFXLEVBQUUsZ0JBQWdCO2dCQUM3QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ2xCLFVBQVUsRUFBRSxDQUFDO3dCQUNYLElBQUksRUFBRSxNQUFNO3dCQUNaLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDckIsQ0FBQzthQUNILENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFFdkIsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ2YsV0FBVyxFQUFFLFNBQVM7WUFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLEVBQUU7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87WUFDbkIsQ0FBQyxDQUFDLFlBQVksRUFBRTtnQkFDZCxLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO29CQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtpQkFDaEI7YUFDRixFQUFFLEtBQUssQ0FBQztTQUNWLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fYmFkZ2VzLnN0eWwnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgVG9nZ2xlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdG9nZ2xlYWJsZSdcclxuaW1wb3J0IHsgZmFjdG9yeSBhcyBQb3NpdGlvbmFibGVGYWN0b3J5IH0gZnJvbSAnLi4vLi4vbWl4aW5zL3Bvc2l0aW9uYWJsZSdcclxuaW1wb3J0IFRyYW5zaXRpb25hYmxlIGZyb20gJy4uLy4uL21peGlucy90cmFuc2l0aW9uYWJsZSdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgbWl4aW5zIGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWl4aW5zKFxyXG4gIENvbG9yYWJsZSxcclxuICBUb2dnbGVhYmxlLFxyXG4gIFBvc2l0aW9uYWJsZUZhY3RvcnkoWydsZWZ0JywgJ2JvdHRvbSddKSxcclxuICBUcmFuc2l0aW9uYWJsZVxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG4pLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtYmFkZ2UnLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgY29sb3I6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAncHJpbWFyeSdcclxuICAgIH0sXHJcbiAgICBvdmVybGFwOiBCb29sZWFuLFxyXG4gICAgdHJhbnNpdGlvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdmYWItdHJhbnNpdGlvbidcclxuICAgIH0sXHJcbiAgICB2YWx1ZToge1xyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtYmFkZ2UtLWJvdHRvbSc6IHRoaXMuYm90dG9tLFxyXG4gICAgICAgICd2LWJhZGdlLS1sZWZ0JzogdGhpcy5sZWZ0LFxyXG4gICAgICAgICd2LWJhZGdlLS1vdmVybGFwJzogdGhpcy5vdmVybGFwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBiYWRnZSA9IHRoaXMuJHNsb3RzLmJhZGdlICYmIFtoKCdzcGFuJywgdGhpcy5zZXRCYWNrZ3JvdW5kQ29sb3IodGhpcy5jb2xvciwge1xyXG4gICAgICBzdGF0aWNDbGFzczogJ3YtYmFkZ2VfX2JhZGdlJyxcclxuICAgICAgYXR0cnM6IHRoaXMuJGF0dHJzLFxyXG4gICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgIG5hbWU6ICdzaG93JyxcclxuICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICB9XVxyXG4gICAgfSksIHRoaXMuJHNsb3RzLmJhZGdlKV1cclxuXHJcbiAgICByZXR1cm4gaCgnc3BhbicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWJhZGdlJyxcclxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzc2VzXHJcbiAgICB9LCBbXHJcbiAgICAgIHRoaXMuJHNsb3RzLmRlZmF1bHQsXHJcbiAgICAgIGgoJ3RyYW5zaXRpb24nLCB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNpdGlvbixcclxuICAgICAgICAgIG9yaWdpbjogdGhpcy5vcmlnaW4sXHJcbiAgICAgICAgICBtb2RlOiB0aGlzLm1vZGVcclxuICAgICAgICB9XHJcbiAgICAgIH0sIGJhZGdlKVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==