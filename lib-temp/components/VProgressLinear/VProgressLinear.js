import '../../stylus/components/_progress-linear.styl';
// Mixins
import Colorable from '../../mixins/colorable';
// Helpers
import { convertToUnit } from '../../util/helpers';
import mixins from '../../util/mixins';
import { VFadeTransition, VSlideXTransition } from '../transitions';
/* @vue/component */
export default mixins(Colorable).extend({
    name: 'v-progress-linear',
    props: {
        active: {
            type: Boolean,
            default: true
        },
        backgroundColor: {
            type: String,
            default: null
        },
        backgroundOpacity: {
            type: [Number, String],
            default: null
        },
        bufferValue: {
            type: [Number, String],
            default: 100
        },
        color: {
            type: String,
            default: 'primary'
        },
        height: {
            type: [Number, String],
            default: 7
        },
        indeterminate: Boolean,
        query: Boolean,
        value: {
            type: [Number, String],
            default: 0
        }
    },
    computed: {
        backgroundStyle() {
            const backgroundOpacity = this.backgroundOpacity == null
                ? (this.backgroundColor ? 1 : 0.3)
                : parseFloat(this.backgroundOpacity);
            return {
                height: this.active ? convertToUnit(this.height) : 0,
                opacity: backgroundOpacity,
                width: `${this.normalizedBufer}%`
            };
        },
        effectiveWidth() {
            if (!this.normalizedBufer) {
                return 0;
            }
            return +this.normalizedValue * 100 / +this.normalizedBufer;
        },
        normalizedBufer() {
            if (this.bufferValue < 0) {
                return 0;
            }
            if (this.bufferValue > 100) {
                return 100;
            }
            return parseFloat(this.bufferValue);
        },
        normalizedValue() {
            if (this.value < 0) {
                return 0;
            }
            if (this.value > 100) {
                return 100;
            }
            return parseFloat(this.value);
        },
        styles() {
            const styles = {};
            if (!this.active) {
                styles.height = 0;
            }
            if (!this.indeterminate && parseFloat(this.normalizedBufer) !== 100) {
                styles.width = `${this.normalizedBufer}%`;
            }
            return styles;
        }
    },
    methods: {
        genDeterminate(h) {
            return h('div', this.setBackgroundColor(this.color, {
                ref: 'front',
                staticClass: `v-progress-linear__bar__determinate`,
                style: {
                    width: `${this.effectiveWidth}%`
                }
            }));
        },
        genBar(h, name) {
            return h('div', this.setBackgroundColor(this.color, {
                staticClass: 'v-progress-linear__bar__indeterminate',
                class: {
                    [name]: true
                }
            }));
        },
        genIndeterminate(h) {
            return h('div', {
                ref: 'front',
                staticClass: 'v-progress-linear__bar__indeterminate',
                class: {
                    'v-progress-linear__bar__indeterminate--active': this.active
                }
            }, [
                this.genBar(h, 'long'),
                this.genBar(h, 'short')
            ]);
        }
    },
    render(h) {
        const fade = h(VFadeTransition, this.indeterminate ? [this.genIndeterminate(h)] : []);
        const slide = h(VSlideXTransition, this.indeterminate ? [] : [this.genDeterminate(h)]);
        const bar = h('div', {
            staticClass: 'v-progress-linear__bar',
            style: this.styles
        }, [fade, slide]);
        const background = h('div', this.setBackgroundColor(this.backgroundColor || this.color, {
            staticClass: 'v-progress-linear__background',
            style: this.backgroundStyle
        }));
        const content = this.$slots.default && h('div', {
            staticClass: 'v-progress-linear__content'
        }, this.$slots.default);
        return h('div', {
            staticClass: 'v-progress-linear',
            attrs: {
                'role': 'progressbar',
                'aria-valuemin': 0,
                'aria-valuemax': this.normalizedBufer,
                'aria-valuenow': this.indeterminate ? undefined : this.normalizedValue
            },
            class: {
                'v-progress-linear--query': this.query
            },
            style: {
                height: convertToUnit(this.height)
            },
            on: this.$listeners
        }, [
            background,
            bar,
            content
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlByb2dyZXNzTGluZWFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVlByb2dyZXNzTGluZWFyL1ZQcm9ncmVzc0xpbmVhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLCtDQUErQyxDQUFBO0FBRXRELFNBQVM7QUFDVCxPQUFPLFNBQVMsTUFBTSx3QkFBd0IsQ0FBQTtBQUU5QyxVQUFVO0FBQ1YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xELE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFBO0FBS3RDLE9BQU8sRUFDTCxlQUFlLEVBQ2YsaUJBQWlCLEVBQ2xCLE1BQU0sZ0JBQWdCLENBQUE7QUFFdkIsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN0QyxJQUFJLEVBQUUsbUJBQW1CO0lBRXpCLEtBQUssRUFBRTtRQUNMLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELGVBQWUsRUFBRTtZQUNmLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELGlCQUFpQixFQUFFO1lBQ2pCLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLElBQUk7U0FDZDtRQUNELFdBQVcsRUFBRTtZQUNYLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEdBQUc7U0FDYjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxhQUFhLEVBQUUs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RUFBRSxJQUFJLENBQUMsZUFBZTtTQUM1QixDQUFDLENBQUMsQ0FBQTtRQUVILE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDOUMsV0FBVyxFQUFFLDRCQUE0QjtTQUMxQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFdkIsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxLQUFLLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFLGFBQWE7Z0JBQ3JCLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixlQUFlLEVBQUUsSUFBSSxDQUFDLGVBQWU7Z0JBQ3JDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlO2FBQ3ZFO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLDBCQUEwQixFQUFFLElBQUksQ0FBQyxLQUFLO2FBQ3ZDO1lBQ0QsS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNuQztZQUNELEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUNwQixFQUFFO1lBQ0QsVUFBVTtZQUNWLEdBQUc7WUFDSCxPQUFPO1NBQ1IsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vLi4vc3R5bHVzL2NvbXBvbmVudHMvX3Byb2dyZXNzLWxpbmVhci5zdHlsJ1xyXG5cclxuLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuXHJcbi8vIEhlbHBlcnNcclxuaW1wb3J0IHsgY29udmVydFRvVW5pdCB9IGZyb20gJy4uLy4uL3V0aWwvaGVscGVycydcclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCB7IENyZWF0ZUVsZW1lbnQsIFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuaW1wb3J0IHtcclxuICBWRmFkZVRyYW5zaXRpb24sXHJcbiAgVlNsaWRlWFRyYW5zaXRpb25cclxufSBmcm9tICcuLi90cmFuc2l0aW9ucydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhDb2xvcmFibGUpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtcHJvZ3Jlc3MtbGluZWFyJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGFjdGl2ZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9LFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogbnVsbFxyXG4gICAgfSxcclxuICAgIGJhY2tncm91bmRPcGFjaXR5OiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IG51bGxcclxuICAgIH0sXHJcbiAgICBidWZmZXJWYWx1ZToge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiAxMDBcclxuICAgIH0sXHJcbiAgICBjb2xvcjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdwcmltYXJ5J1xyXG4gICAgfSxcclxuICAgIGhlaWdodDoge1xyXG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddLFxyXG4gICAgICBkZWZhdWx0OiA3XHJcbiAgICB9LFxyXG4gICAgaW5kZXRlcm1pbmF0ZTogQm9vbGVhbixcclxuICAgIHF1ZXJ5OiBCb29sZWFuLFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBiYWNrZ3JvdW5kU3R5bGUgKCk6IG9iamVjdCB7XHJcbiAgICAgIGNvbnN0IGJhY2tncm91bmRPcGFjaXR5ID0gdGhpcy5iYWNrZ3JvdW5kT3BhY2l0eSA9PSBudWxsXHJcbiAgICAgICAgPyAodGhpcy5iYWNrZ3JvdW5kQ29sb3IgPyAxIDogMC4zKVxyXG4gICAgICAgIDogcGFyc2VGbG9hdCh0aGlzLmJhY2tncm91bmRPcGFjaXR5KVxyXG5cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBoZWlnaHQ6IHRoaXMuYWN0aXZlID8gY29udmVydFRvVW5pdCh0aGlzLmhlaWdodCkgOiAwLFxyXG4gICAgICAgIG9wYWNpdHk6IGJhY2tncm91bmRPcGFjaXR5LFxyXG4gICAgICAgIHdpZHRoOiBgJHt0aGlzLm5vcm1hbGl6ZWRCdWZlcn0lYFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGVmZmVjdGl2ZVdpZHRoICgpOiBudW1iZXIge1xyXG4gICAgICBpZiAoIXRoaXMubm9ybWFsaXplZEJ1ZmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIDBcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuICt0aGlzLm5vcm1hbGl6ZWRWYWx1ZSAqIDEwMCAvICt0aGlzLm5vcm1hbGl6ZWRCdWZlclxyXG4gICAgfSxcclxuXHJcbiAgICBub3JtYWxpemVkQnVmZXIgKCk6IG51bWJlciB7XHJcbiAgICAgIGlmICh0aGlzLmJ1ZmZlclZhbHVlIDwgMCkge1xyXG4gICAgICAgIHJldHVybiAwXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmJ1ZmZlclZhbHVlID4gMTAwKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwMFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLmJ1ZmZlclZhbHVlKVxyXG4gICAgfSxcclxuXHJcbiAgICBub3JtYWxpemVkVmFsdWUgKCk6IG51bWJlciB7XHJcbiAgICAgIGlmICh0aGlzLnZhbHVlIDwgMCkge1xyXG4gICAgICAgIHJldHVybiAwXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnZhbHVlID4gMTAwKSB7XHJcbiAgICAgICAgcmV0dXJuIDEwMFxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh0aGlzLnZhbHVlKVxyXG4gICAgfSxcclxuXHJcbiAgICBzdHlsZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIGNvbnN0IHN0eWxlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuYWN0aXZlKSB7XHJcbiAgICAgICAgc3R5bGVzLmhlaWdodCA9IDBcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmluZGV0ZXJtaW5hdGUgJiYgcGFyc2VGbG9hdCh0aGlzLm5vcm1hbGl6ZWRCdWZlcikgIT09IDEwMCkge1xyXG4gICAgICAgIHN0eWxlcy53aWR0aCA9IGAke3RoaXMubm9ybWFsaXplZEJ1ZmVyfSVgXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzdHlsZXNcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZW5EZXRlcm1pbmF0ZSAoaDogQ3JlYXRlRWxlbWVudCk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcclxuICAgICAgICByZWY6ICdmcm9udCcsXHJcbiAgICAgICAgc3RhdGljQ2xhc3M6IGB2LXByb2dyZXNzLWxpbmVhcl9fYmFyX19kZXRlcm1pbmF0ZWAsXHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIHdpZHRoOiBgJHt0aGlzLmVmZmVjdGl2ZVdpZHRofSVgXHJcbiAgICAgICAgfVxyXG4gICAgICB9KSlcclxuICAgIH0sXHJcbiAgICBnZW5CYXIgKGg6IENyZWF0ZUVsZW1lbnQsIG5hbWU6IHN0cmluZyk6IFZOb2RlIHtcclxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHRoaXMuc2V0QmFja2dyb3VuZENvbG9yKHRoaXMuY29sb3IsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtcHJvZ3Jlc3MtbGluZWFyX19iYXJfX2luZGV0ZXJtaW5hdGUnLFxyXG4gICAgICAgIGNsYXNzOiB7XHJcbiAgICAgICAgICBbbmFtZV06IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pKVxyXG4gICAgfSxcclxuICAgIGdlbkluZGV0ZXJtaW5hdGUgKGg6IENyZWF0ZUVsZW1lbnQpOiBWTm9kZSB7XHJcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgICAgcmVmOiAnZnJvbnQnLFxyXG4gICAgICAgIHN0YXRpY0NsYXNzOiAndi1wcm9ncmVzcy1saW5lYXJfX2Jhcl9faW5kZXRlcm1pbmF0ZScsXHJcbiAgICAgICAgY2xhc3M6IHtcclxuICAgICAgICAgICd2LXByb2dyZXNzLWxpbmVhcl9fYmFyX19pbmRldGVybWluYXRlLS1hY3RpdmUnOiB0aGlzLmFjdGl2ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuQmFyKGgsICdsb25nJyksXHJcbiAgICAgICAgdGhpcy5nZW5CYXIoaCwgJ3Nob3J0JylcclxuICAgICAgXSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICBjb25zdCBmYWRlID0gaChWRmFkZVRyYW5zaXRpb24sIHRoaXMuaW5kZXRlcm1pbmF0ZSA/IFt0aGlzLmdlbkluZGV0ZXJtaW5hdGUoaCldIDogW10pXHJcbiAgICBjb25zdCBzbGlkZSA9IGgoVlNsaWRlWFRyYW5zaXRpb24sIHRoaXMuaW5kZXRlcm1pbmF0ZSA/IFtdIDogW3RoaXMuZ2VuRGV0ZXJtaW5hdGUoaCldKVxyXG5cclxuICAgIGNvbnN0IGJhciA9IGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9fYmFyJyxcclxuICAgICAgc3R5bGU6IHRoaXMuc3R5bGVzXHJcbiAgICB9LCBbZmFkZSwgc2xpZGVdKVxyXG5cclxuICAgIGNvbnN0IGJhY2tncm91bmQgPSBoKCdkaXYnLCB0aGlzLnNldEJhY2tncm91bmRDb2xvcih0aGlzLmJhY2tncm91bmRDb2xvciB8fCB0aGlzLmNvbG9yLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1wcm9ncmVzcy1saW5lYXJfX2JhY2tncm91bmQnLFxyXG4gICAgICBzdHlsZTogdGhpcy5iYWNrZ3JvdW5kU3R5bGVcclxuICAgIH0pKVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLiRzbG90cy5kZWZhdWx0ICYmIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcl9fY29udGVudCdcclxuICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXHJcblxyXG4gICAgcmV0dXJuIGgoJ2RpdicsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LXByb2dyZXNzLWxpbmVhcicsXHJcbiAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgJ3JvbGUnOiAncHJvZ3Jlc3NiYXInLFxyXG4gICAgICAgICdhcmlhLXZhbHVlbWluJzogMCxcclxuICAgICAgICAnYXJpYS12YWx1ZW1heCc6IHRoaXMubm9ybWFsaXplZEJ1ZmVyLFxyXG4gICAgICAgICdhcmlhLXZhbHVlbm93JzogdGhpcy5pbmRldGVybWluYXRlID8gdW5kZWZpbmVkIDogdGhpcy5ub3JtYWxpemVkVmFsdWVcclxuICAgICAgfSxcclxuICAgICAgY2xhc3M6IHtcclxuICAgICAgICAndi1wcm9ncmVzcy1saW5lYXItLXF1ZXJ5JzogdGhpcy5xdWVyeVxyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGhlaWdodDogY29udmVydFRvVW5pdCh0aGlzLmhlaWdodClcclxuICAgICAgfSxcclxuICAgICAgb246IHRoaXMuJGxpc3RlbmVyc1xyXG4gICAgfSwgW1xyXG4gICAgICBiYWNrZ3JvdW5kLFxyXG4gICAgICBiYXIsXHJcbiAgICAgIGNvbnRlbnRcclxuICAgIF0pXHJcbiAgfVxyXG59KVxyXG4iXX0=