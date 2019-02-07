import '../../stylus/components/_selection-controls.styl';
import '../../stylus/components/_switch.styl';
// Mixins
import Selectable from '../../mixins/selectable';
// Directives
import Touch from '../../directives/touch';
// Components
import { VFabTransition } from '../transitions';
import VProgressCircular from '../VProgressCircular/VProgressCircular';
// Helpers
import { keyCodes } from '../../util/helpers';
/* @vue/component */
export default {
    name: 'v-switch',
    directives: { Touch },
    mixins: [
        Selectable
    ],
    props: {
        loading: {
            type: [Boolean, String],
            default: false
        }
    },
    computed: {
        classes() {
            return {
                'v-input--selection-controls v-input--switch': true
            };
        },
        switchData() {
            return this.setTextColor(this.loading ? undefined : this.computedColor, {
                class: this.themeClasses
            });
        }
    },
    methods: {
        genDefaultSlot() {
            return [
                this.genSwitch(),
                this.genLabel()
            ];
        },
        genSwitch() {
            return this.$createElement('div', {
                staticClass: 'v-input--selection-controls__input'
            }, [
                this.genInput('checkbox', this.$attrs),
                this.genRipple(this.setTextColor(this.computedColor, {
                    directives: [{
                            name: 'touch',
                            value: {
                                left: this.onSwipeLeft,
                                right: this.onSwipeRight
                            }
                        }]
                })),
                this.$createElement('div', {
                    staticClass: 'v-input--switch__track',
                    ...this.switchData
                }),
                this.$createElement('div', {
                    staticClass: 'v-input--switch__thumb',
                    ...this.switchData
                }, [this.genProgress()])
            ]);
        },
        genProgress() {
            return this.$createElement(VFabTransition, {}, [
                this.loading === false
                    ? null
                    : this.$slots.progress || this.$createElement(VProgressCircular, {
                        props: {
                            color: (this.loading === true || this.loading === '')
                                ? (this.color || 'primary')
                                : this.loading,
                            size: 16,
                            width: 2,
                            indeterminate: true
                        }
                    })
            ]);
        },
        onSwipeLeft() {
            if (this.isActive)
                this.onChange();
        },
        onSwipeRight() {
            if (!this.isActive)
                this.onChange();
        },
        onKeydown(e) {
            if ((e.keyCode === keyCodes.left && this.isActive) ||
                (e.keyCode === keyCodes.right && !this.isActive))
                this.onChange();
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlN3aXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTd2l0Y2gvVlN3aXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLGtEQUFrRCxDQUFBO0FBQ3pELE9BQU8sc0NBQXNDLENBQUE7QUFFN0MsU0FBUztBQUNULE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBRWhELGFBQWE7QUFDYixPQUFPLEtBQUssTUFBTSx3QkFBd0IsQ0FBQTtBQUUxQyxhQUFhO0FBQ2IsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBQy9DLE9BQU8saUJBQWlCLE1BQU0sd0NBQXdDLENBQUE7QUFFdEUsVUFBVTtBQUNWLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU3QyxvQkFBb0I7QUFDcEIsZUFBZTtJQUNiLElBQUksRUFBRSxVQUFVO0lBRWhCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRTtJQUVyQixNQUFNLEVBQUU7UUFDTixVQUFVO0tBQ1g7SUFFRCxLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUVELFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxPQUFPO2dCQUNMLDZDQUE2QyxFQUFFLElBQUk7YUFDcEQsQ0FBQTtRQUNILENBQUM7UUFDRCxVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEUsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQ3pCLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLGNBQWM7WUFDWixPQUFPO2dCQUNMLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxRQUFRLEVBQUU7YUFDaEIsQ0FBQTtRQUNILENBQUM7UUFDRCxTQUFTO1lBQ1AsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRTtnQkFDaEMsV0FBVyxFQUFFLG9DQUFvQzthQUNsRCxFQUFFO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUNuRCxVQUFVLEVBQUUsQ0FBQzs0QkFDWCxJQUFJLEVBQUUsT0FBTzs0QkFDYixLQUFLLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO2dDQUN0QixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVk7NkJBQ3pCO3lCQUNGLENBQUM7aUJBQ0gsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUN6QixXQUFXLEVBQUUsd0JBQXdCO29CQUNyQyxHQUFHLElBQUksQ0FBQyxVQUFVO2lCQUNuQixDQUFDO2dCQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUN6QixXQUFXLEVBQUUsd0JBQXdCO29CQUNyQyxHQUFHLElBQUksQ0FBQyxVQUFVO2lCQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDekIsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFdBQVc7WUFDVCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLEVBQUUsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLO29CQUNwQixDQUFDLENBQUMsSUFBSTtvQkFDTixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRTt3QkFDL0QsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dDQUNuRCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQztnQ0FDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPOzRCQUNoQixJQUFJLEVBQUUsRUFBRTs0QkFDUixLQUFLLEVBQUUsQ0FBQzs0QkFDUixhQUFhLEVBQUUsSUFBSTt5QkFDcEI7cUJBQ0YsQ0FBQzthQUNMLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxXQUFXO1lBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUTtnQkFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDcEMsQ0FBQztRQUNELFlBQVk7WUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3JDLENBQUM7UUFDRCxTQUFTLENBQUUsQ0FBQztZQUNWLElBQ0UsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNoRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDbkIsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3NlbGVjdGlvbi1jb250cm9scy5zdHlsJ1xyXG5pbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19zd2l0Y2guc3R5bCdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgU2VsZWN0YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvc2VsZWN0YWJsZSdcclxuXHJcbi8vIERpcmVjdGl2ZXNcclxuaW1wb3J0IFRvdWNoIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvdG91Y2gnXHJcblxyXG4vLyBDb21wb25lbnRzXHJcbmltcG9ydCB7IFZGYWJUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdHJhbnNpdGlvbnMnXHJcbmltcG9ydCBWUHJvZ3Jlc3NDaXJjdWxhciBmcm9tICcuLi9WUHJvZ3Jlc3NDaXJjdWxhci9WUHJvZ3Jlc3NDaXJjdWxhcidcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsga2V5Q29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ3Ytc3dpdGNoJyxcclxuXHJcbiAgZGlyZWN0aXZlczogeyBUb3VjaCB9LFxyXG5cclxuICBtaXhpbnM6IFtcclxuICAgIFNlbGVjdGFibGVcclxuICBdLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgbG9hZGluZzoge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgY2xhc3NlcyAoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9scyB2LWlucHV0LS1zd2l0Y2gnOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzd2l0Y2hEYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMubG9hZGluZyA/IHVuZGVmaW5lZCA6IHRoaXMuY29tcHV0ZWRDb2xvciwge1xyXG4gICAgICAgIGNsYXNzOiB0aGlzLnRoZW1lQ2xhc3Nlc1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdlbkRlZmF1bHRTbG90ICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB0aGlzLmdlblN3aXRjaCgpLFxyXG4gICAgICAgIHRoaXMuZ2VuTGFiZWwoKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgZ2VuU3dpdGNoICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtaW5wdXQtLXNlbGVjdGlvbi1jb250cm9sc19faW5wdXQnXHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbklucHV0KCdjaGVja2JveCcsIHRoaXMuJGF0dHJzKSxcclxuICAgICAgICB0aGlzLmdlblJpcHBsZSh0aGlzLnNldFRleHRDb2xvcih0aGlzLmNvbXB1dGVkQ29sb3IsIHtcclxuICAgICAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgICAgIG5hbWU6ICd0b3VjaCcsXHJcbiAgICAgICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgICAgbGVmdDogdGhpcy5vblN3aXBlTGVmdCxcclxuICAgICAgICAgICAgICByaWdodDogdGhpcy5vblN3aXBlUmlnaHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfV1cclxuICAgICAgICB9KSksXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgICAgc3RhdGljQ2xhc3M6ICd2LWlucHV0LS1zd2l0Y2hfX3RyYWNrJyxcclxuICAgICAgICAgIC4uLnRoaXMuc3dpdGNoRGF0YVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1pbnB1dC0tc3dpdGNoX190aHVtYicsXHJcbiAgICAgICAgICAuLi50aGlzLnN3aXRjaERhdGFcclxuICAgICAgICB9LCBbdGhpcy5nZW5Qcm9ncmVzcygpXSlcclxuICAgICAgXSlcclxuICAgIH0sXHJcbiAgICBnZW5Qcm9ncmVzcyAoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KFZGYWJUcmFuc2l0aW9uLCB7fSwgW1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9PT0gZmFsc2VcclxuICAgICAgICAgID8gbnVsbFxyXG4gICAgICAgICAgOiB0aGlzLiRzbG90cy5wcm9ncmVzcyB8fCB0aGlzLiRjcmVhdGVFbGVtZW50KFZQcm9ncmVzc0NpcmN1bGFyLCB7XHJcbiAgICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgICAgY29sb3I6ICh0aGlzLmxvYWRpbmcgPT09IHRydWUgfHwgdGhpcy5sb2FkaW5nID09PSAnJylcclxuICAgICAgICAgICAgICAgID8gKHRoaXMuY29sb3IgfHwgJ3ByaW1hcnknKVxyXG4gICAgICAgICAgICAgICAgOiB0aGlzLmxvYWRpbmcsXHJcbiAgICAgICAgICAgICAgc2l6ZTogMTYsXHJcbiAgICAgICAgICAgICAgd2lkdGg6IDIsXHJcbiAgICAgICAgICAgICAgaW5kZXRlcm1pbmF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIG9uU3dpcGVMZWZ0ICgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHRoaXMub25DaGFuZ2UoKVxyXG4gICAgfSxcclxuICAgIG9uU3dpcGVSaWdodCAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkgdGhpcy5vbkNoYW5nZSgpXHJcbiAgICB9LFxyXG4gICAgb25LZXlkb3duIChlKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5sZWZ0ICYmIHRoaXMuaXNBY3RpdmUpIHx8XHJcbiAgICAgICAgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMucmlnaHQgJiYgIXRoaXMuaXNBY3RpdmUpXHJcbiAgICAgICkgdGhpcy5vbkNoYW5nZSgpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==