// Mixins
import Colorable from '../../mixins/colorable';
// Utilities
import mixins from '../../util/mixins';
import { genPoints } from './helpers/core';
import { genPath } from './helpers/path';
export default mixins(Colorable).extend({
    name: 'VSparkline',
    props: {
        autoDraw: Boolean,
        autoDrawDuration: {
            type: Number,
            default: 2000
        },
        autoDrawEasing: {
            type: String,
            default: 'ease'
        },
        autoLineWidth: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'primary'
        },
        fill: {
            type: Boolean,
            default: false
        },
        gradient: {
            type: Array,
            default: () => ([])
        },
        gradientDirection: {
            type: String,
            validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val),
            default: 'top'
        },
        height: {
            type: [String, Number],
            default: 75
        },
        labels: {
            type: Array,
            default: () => ([])
        },
        lineWidth: {
            type: [String, Number],
            default: 4
        },
        padding: {
            type: [String, Number],
            default: 8
        },
        smooth: {
            type: [Boolean, Number, String],
            default: false
        },
        showLabels: Boolean,
        type: {
            type: String,
            default: 'trend',
            validator: (val) => ['trend', 'bar'].includes(val)
        },
        value: {
            type: Array,
            default: () => ([])
        },
        width: {
            type: [Number, String],
            default: 300
        },
        labelSize: {
            type: [Number, String],
            default: 7
        }
    },
    data: () => ({
        lastLength: 0
    }),
    computed: {
        parsedPadding() {
            return Number(this.padding);
        },
        parsedWidth() {
            return Number(this.width);
        },
        totalBars() {
            return this.value.length;
        },
        _lineWidth() {
            if (this.autoLineWidth && this.type !== 'trend') {
                const totalPadding = this.parsedPadding * (this.totalBars + 1);
                return (this.parsedWidth - totalPadding) / this.totalBars;
            }
            else {
                return Number(this.lineWidth) || 4;
            }
        },
        boundary() {
            const height = Number(this.height);
            return {
                minX: this.parsedPadding,
                minY: this.parsedPadding,
                maxX: this.parsedWidth - this.parsedPadding,
                maxY: height - this.parsedPadding
            };
        },
        hasLabels() {
            return Boolean(this.showLabels ||
                this.labels.length > 0 ||
                this.$scopedSlots.label);
        },
        parsedLabels() {
            const labels = [];
            const points = this.points;
            const len = points.length;
            for (let i = 0; labels.length < len; i++) {
                const item = points[i];
                let value = this.labels[i];
                if (!value) {
                    value = item === Object(item)
                        ? item.value
                        : item;
                }
                labels.push({
                    ...item,
                    value: String(value)
                });
            }
            return labels;
        },
        points() {
            return genPoints(this.value.slice(), this.boundary, this.type);
        },
        textY() {
            return this.boundary.maxY + 6;
        }
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.$nextTick(() => {
                    if (!this.autoDraw || this.type === 'bar')
                        return;
                    const path = this.$refs.path;
                    const length = path.getTotalLength();
                    if (!this.fill) {
                        path.style.transition = 'none';
                        path.style.strokeDasharray = length + ' ' + length;
                        path.style.strokeDashoffset = Math.abs(length - (this.lastLength || 0)).toString();
                        path.getBoundingClientRect();
                        path.style.transition = `stroke-dashoffset ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
                        path.style.strokeDashoffset = '0';
                    }
                    else {
                        path.style.transformOrigin = 'bottom center';
                        path.style.transition = 'none';
                        path.style.transform = `scaleY(0)`;
                        path.getBoundingClientRect();
                        path.style.transition = `transform ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
                        path.style.transform = `scaleY(1)`;
                    }
                    this.lastLength = length;
                });
            }
        }
    },
    methods: {
        genGradient() {
            const gradientDirection = this.gradientDirection;
            const gradient = this.gradient.slice();
            // Pushes empty string to force
            // a fallback to currentColor
            if (!gradient.length)
                gradient.push('');
            const len = Math.max(gradient.length - 1, 1);
            const stops = gradient.reverse().map((color, index) => this.$createElement('stop', {
                attrs: {
                    offset: index / len,
                    'stop-color': color || this.color || 'currentColor'
                }
            }));
            return this.$createElement('defs', [
                this.$createElement('linearGradient', {
                    attrs: {
                        id: this._uid,
                        x1: +(gradientDirection === 'left'),
                        y1: +(gradientDirection === 'top'),
                        x2: +(gradientDirection === 'right'),
                        y2: +(gradientDirection === 'bottom')
                    }
                }, stops)
            ]);
        },
        genG(children) {
            return this.$createElement('g', {
                style: {
                    fontSize: '8',
                    textAnchor: 'middle',
                    dominantBaseline: 'mathematical',
                    fill: this.color || 'currentColor'
                }
            }, children);
        },
        genLabels() {
            if (!this.hasLabels)
                return undefined;
            return this.genG(this.parsedLabels.map(this.genText));
        },
        genPath() {
            const radius = this.smooth === true ? 8 : Number(this.smooth);
            return this.$createElement('path', {
                attrs: {
                    id: this._uid,
                    d: genPath(this.points.slice(), radius, this.fill, Number(this.height)),
                    fill: this.fill ? `url(#${this._uid})` : 'none',
                    stroke: this.fill ? 'none' : `url(#${this._uid})`
                },
                ref: 'path'
            });
        },
        genText(item, index) {
            const children = this.$scopedSlots.label
                ? this.$scopedSlots.label({ index, value: item.value })
                : item.value;
            return this.$createElement('text', {
                attrs: {
                    x: item.x,
                    y: this.textY
                }
            }, [children]);
        },
        genBar() {
            if (!this.value || this.totalBars < 2)
                return undefined;
            const { width, height, parsedPadding, _lineWidth } = this;
            const viewWidth = width || this.totalBars * parsedPadding * 2;
            const viewHeight = height || 75;
            const boundary = {
                minX: parsedPadding,
                minY: parsedPadding,
                maxX: Number(viewWidth) - parsedPadding,
                maxY: Number(viewHeight) - parsedPadding
            };
            const props = {
                ...this.$props
            };
            props.points = genPoints(this.value, boundary, this.type);
            const totalWidth = boundary.maxX / (props.points.length - 1);
            props.boundary = boundary;
            props.lineWidth = _lineWidth || (totalWidth - Number(parsedPadding || 5));
            props.offsetX = 0;
            if (!this.autoLineWidth) {
                props.offsetX = ((boundary.maxX / this.totalBars) / 2) - boundary.minX;
            }
            return this.$createElement('svg', {
                attrs: {
                    width: '100%',
                    height: '25%',
                    viewBox: `0 0 ${viewWidth} ${viewHeight}`
                }
            }, [
                this.genGradient(),
                this.genClipPath(props.offsetX, props.lineWidth, 'sparkline-bar-' + this._uid),
                this.hasLabels ? this.genBarLabels(props) : undefined,
                this.$createElement('g', {
                    attrs: {
                        transform: `scale(1,-1) translate(0,-${boundary.maxY})`,
                        'clip-path': `url(#sparkline-bar-${this._uid}-clip)`,
                        fill: `url(#${this._uid})`
                    }
                }, [
                    this.$createElement('rect', {
                        attrs: {
                            x: 0,
                            y: 0,
                            width: viewWidth,
                            height: viewHeight
                        }
                    })
                ])
            ]);
        },
        genClipPath(offsetX, lineWidth, id) {
            const { maxY } = this.boundary;
            const rounding = typeof this.smooth === 'number'
                ? this.smooth
                : this.smooth ? 2 : 0;
            return this.$createElement('clipPath', {
                attrs: {
                    id: `${id}-clip`
                }
            }, this.points.map(item => {
                return this.$createElement('rect', {
                    attrs: {
                        x: item.x + offsetX,
                        y: 0,
                        width: lineWidth,
                        height: Math.max(maxY - item.y, 0),
                        rx: rounding,
                        ry: rounding
                    }
                }, [
                    this.autoDraw ? this.$createElement('animate', {
                        attrs: {
                            attributeName: 'height',
                            from: 0,
                            to: maxY - item.y,
                            dur: `${this.autoDrawDuration}ms`,
                            fill: 'freeze'
                        }
                    }) : undefined
                ]);
            }));
        },
        genBarLabels(props) {
            const offsetX = props.offsetX || 0;
            const children = props.points.map(item => (this.$createElement('text', {
                attrs: {
                    x: item.x + offsetX + this._lineWidth / 2,
                    y: props.boundary.maxY + (Number(this.labelSize) || 7),
                    'font-size': Number(this.labelSize) || 7
                }
            }, item.value.toString())));
            return this.genG(children);
        },
        genTrend() {
            return this.$createElement('svg', this.setTextColor(this.color, {
                attrs: {
                    'stroke-width': this._lineWidth || 1,
                    width: '100%',
                    height: '25%',
                    viewBox: `0 0 ${this.width} ${this.height}`
                }
            }), [
                this.genGradient(),
                this.genLabels(),
                this.genPath()
            ]);
        }
    },
    render(h) {
        if (this.totalBars < 2)
            return undefined;
        return this.type === 'trend'
            ? this.genTrend()
            : this.genBar();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlNwYXJrbGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZTcGFya2xpbmUvVlNwYXJrbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsWUFBWTtBQUNaLE9BQU8sTUFBc0IsTUFBTSxtQkFBbUIsQ0FBQTtBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUE7QUFDMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBc0N4QyxlQUFlLE1BQU0sQ0FPbkIsU0FBUyxDQUNWLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLFlBQVk7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsZ0JBQWdCLEVBQUU7WUFDaEIsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsY0FBYyxFQUFFO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsTUFBTTtTQUNoQjtRQUNELGFBQWEsRUFBRTtZQUNiLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDbkI7UUFDRCxJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsS0FBdUI7WUFDN0IsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsaUJBQWlCLEVBQUU7WUFDakIsSUFBSSxFQUFFLE1BQW1EO1lBQ3pELFNBQVMsRUFBRSxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVB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LE9BQU87WUFDMUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWl4aW5zXHJcbmltcG9ydCBDb2xvcmFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL2NvbG9yYWJsZSdcclxuXHJcbi8vIFV0aWxpdGllc1xyXG5pbXBvcnQgbWl4aW5zLCB7IEV4dHJhY3RWdWUgfSBmcm9tICcuLi8uLi91dGlsL21peGlucydcclxuaW1wb3J0IHsgZ2VuUG9pbnRzIH0gZnJvbSAnLi9oZWxwZXJzL2NvcmUnXHJcbmltcG9ydCB7IGdlblBhdGggfSBmcm9tICcuL2hlbHBlcnMvcGF0aCdcclxuXHJcbi8vIFR5cGVzXHJcbmltcG9ydCBWdWUsIHsgVk5vZGUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFByb3AsIFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcclxuXHJcbmV4cG9ydCB0eXBlIFNwYXJrbGluZUl0ZW0gPSBudW1iZXIgfCB7IHZhbHVlOiBudW1iZXIgfVxyXG5cclxuZXhwb3J0IHR5cGUgU3BhcmtsaW5lVGV4dCA9IHtcclxuICB4OiBudW1iZXJcclxuICB2YWx1ZTogc3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQm91bmRhcnkge1xyXG4gIG1pblg6IG51bWJlclxyXG4gIG1pblk6IG51bWJlclxyXG4gIG1heFg6IG51bWJlclxyXG4gIG1heFk6IG51bWJlclxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50IHtcclxuICB4OiBudW1iZXJcclxuICB5OiBudW1iZXJcclxuICB2YWx1ZTogbnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQmFyVGV4dCB7XHJcbiAgcG9pbnRzOiBQb2ludFtdXHJcbiAgYm91bmRhcnk6IEJvdW5kYXJ5XHJcbiAgb2Zmc2V0WDogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcclxuICAkcmVmczoge1xyXG4gICAgcGF0aDogU1ZHUGF0aEVsZW1lbnRcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcclxuLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXHJcbiAgRXh0cmFjdFZ1ZTxbXHJcbiAgICB0eXBlb2YgQ29sb3JhYmxlXHJcbiAgXT5cclxuLyogZXNsaW50LWVuYWJsZSBpbmRlbnQgKi9cclxuPihcclxuICBDb2xvcmFibGVcclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICdWU3BhcmtsaW5lJyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGF1dG9EcmF3OiBCb29sZWFuLFxyXG4gICAgYXV0b0RyYXdEdXJhdGlvbjoge1xyXG4gICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgIGRlZmF1bHQ6IDIwMDBcclxuICAgIH0sXHJcbiAgICBhdXRvRHJhd0Vhc2luZzoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdlYXNlJ1xyXG4gICAgfSxcclxuICAgIGF1dG9MaW5lV2lkdGg6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBjb2xvcjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdwcmltYXJ5J1xyXG4gICAgfSxcclxuICAgIGZpbGw6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBncmFkaWVudDoge1xyXG4gICAgICB0eXBlOiBBcnJheSBhcyBQcm9wPHN0cmluZ1tdPixcclxuICAgICAgZGVmYXVsdDogKCkgPT4gKFtdKVxyXG4gICAgfSxcclxuICAgIGdyYWRpZW50RGlyZWN0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyBhcyBQcm9wPCd0b3AnIHwgJ2JvdHRvbScgfCAnbGVmdCcgfCAncmlnaHQnPixcclxuICAgICAgdmFsaWRhdG9yOiAodmFsOiBzdHJpbmcpID0+IFsndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0J10uaW5jbHVkZXModmFsKSxcclxuICAgICAgZGVmYXVsdDogJ3RvcCdcclxuICAgIH0sXHJcbiAgICBoZWlnaHQ6IHtcclxuICAgICAgdHlwZTogW1N0cmluZywgTnVtYmVyXSxcclxuICAgICAgZGVmYXVsdDogNzVcclxuICAgIH0sXHJcbiAgICBsYWJlbHM6IHtcclxuICAgICAgdHlwZTogQXJyYXkgYXMgUHJvcDxTcGFya2xpbmVJdGVtW10+LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pXHJcbiAgICB9LFxyXG4gICAgbGluZVdpZHRoOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6IDRcclxuICAgIH0sXHJcbiAgICBwYWRkaW5nOiB7XHJcbiAgICAgIHR5cGU6IFtTdHJpbmcsIE51bWJlcl0sXHJcbiAgICAgIGRlZmF1bHQ6IDhcclxuICAgIH0sXHJcbiAgICBzbW9vdGg6IHtcclxuICAgICAgdHlwZTogW0Jvb2xlYW4sIE51bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBzaG93TGFiZWxzOiBCb29sZWFuLFxyXG4gICAgdHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICd0cmVuZCcsXHJcbiAgICAgIHZhbGlkYXRvcjogKHZhbDogc3RyaW5nKSA9PiBbJ3RyZW5kJywgJ2JhciddLmluY2x1ZGVzKHZhbClcclxuICAgIH0gYXMgUHJvcFZhbGlkYXRvcjwndHJlbmQnIHwgJ2Jhcic+LFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogQXJyYXkgYXMgUHJvcDxTcGFya2xpbmVJdGVtW10+LFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiAoW10pXHJcbiAgICB9LFxyXG4gICAgd2lkdGg6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgICAgZGVmYXVsdDogMzAwXHJcbiAgICB9LFxyXG4gICAgbGFiZWxTaXplOiB7XHJcbiAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgIGRlZmF1bHQ6IDdcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgbGFzdExlbmd0aDogMFxyXG4gIH0pLFxyXG5cclxuICBjb21wdXRlZDoge1xyXG4gICAgcGFyc2VkUGFkZGluZyAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIE51bWJlcih0aGlzLnBhZGRpbmcpXHJcbiAgICB9LFxyXG4gICAgcGFyc2VkV2lkdGggKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBOdW1iZXIodGhpcy53aWR0aClcclxuICAgIH0sXHJcbiAgICB0b3RhbEJhcnMgKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLmxlbmd0aFxyXG4gICAgfSxcclxuICAgIF9saW5lV2lkdGggKCk6IG51bWJlciB7XHJcbiAgICAgIGlmICh0aGlzLmF1dG9MaW5lV2lkdGggJiYgdGhpcy50eXBlICE9PSAndHJlbmQnKSB7XHJcbiAgICAgICAgY29uc3QgdG90YWxQYWRkaW5nID0gdGhpcy5wYXJzZWRQYWRkaW5nICogKHRoaXMudG90YWxCYXJzICsgMSlcclxuICAgICAgICByZXR1cm4gKHRoaXMucGFyc2VkV2lkdGggLSB0b3RhbFBhZGRpbmcpIC8gdGhpcy50b3RhbEJhcnNcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMubGluZVdpZHRoKSB8fCA0XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBib3VuZGFyeSAoKTogQm91bmRhcnkge1xyXG4gICAgICBjb25zdCBoZWlnaHQgPSBOdW1iZXIodGhpcy5oZWlnaHQpXHJcblxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIG1pblg6IHRoaXMucGFyc2VkUGFkZGluZyxcclxuICAgICAgICBtaW5ZOiB0aGlzLnBhcnNlZFBhZGRpbmcsXHJcbiAgICAgICAgbWF4WDogdGhpcy5wYXJzZWRXaWR0aCAtIHRoaXMucGFyc2VkUGFkZGluZyxcclxuICAgICAgICBtYXhZOiBoZWlnaHQgLSB0aGlzLnBhcnNlZFBhZGRpbmdcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhc0xhYmVscyAoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBCb29sZWFuKFxyXG4gICAgICAgIHRoaXMuc2hvd0xhYmVscyB8fFxyXG4gICAgICAgIHRoaXMubGFiZWxzLmxlbmd0aCA+IDAgfHxcclxuICAgICAgICB0aGlzLiRzY29wZWRTbG90cy5sYWJlbFxyXG4gICAgICApXHJcbiAgICB9LFxyXG4gICAgcGFyc2VkTGFiZWxzICgpOiBTcGFya2xpbmVUZXh0W10ge1xyXG4gICAgICBjb25zdCBsYWJlbHMgPSBbXVxyXG4gICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnBvaW50c1xyXG4gICAgICBjb25zdCBsZW4gPSBwb2ludHMubGVuZ3RoXHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgbGFiZWxzLmxlbmd0aCA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHBvaW50c1tpXVxyXG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMubGFiZWxzW2ldXHJcblxyXG4gICAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICAgIHZhbHVlID0gaXRlbSA9PT0gT2JqZWN0KGl0ZW0pXHJcbiAgICAgICAgICAgID8gaXRlbS52YWx1ZVxyXG4gICAgICAgICAgICA6IGl0ZW1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhYmVscy5wdXNoKHtcclxuICAgICAgICAgIC4uLml0ZW0sXHJcbiAgICAgICAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBsYWJlbHNcclxuICAgIH0sXHJcbiAgICBwb2ludHMgKCk6IFBvaW50W10ge1xyXG4gICAgICByZXR1cm4gZ2VuUG9pbnRzKHRoaXMudmFsdWUuc2xpY2UoKSwgdGhpcy5ib3VuZGFyeSwgdGhpcy50eXBlKVxyXG4gICAgfSxcclxuICAgIHRleHRZICgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5ib3VuZGFyeS5tYXhZICsgNlxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICB2YWx1ZToge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGhhbmRsZXIgKCkge1xyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgIGlmICghdGhpcy5hdXRvRHJhdyB8fCB0aGlzLnR5cGUgPT09ICdiYXInKSByZXR1cm5cclxuXHJcbiAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy4kcmVmcy5wYXRoXHJcbiAgICAgICAgICBjb25zdCBsZW5ndGggPSBwYXRoLmdldFRvdGFsTGVuZ3RoKClcclxuXHJcbiAgICAgICAgICBpZiAoIXRoaXMuZmlsbCkge1xyXG4gICAgICAgICAgICBwYXRoLnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSdcclxuICAgICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBsZW5ndGggKyAnICcgKyBsZW5ndGhcclxuICAgICAgICAgICAgcGF0aC5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gTWF0aC5hYnMobGVuZ3RoIC0gKHRoaXMubGFzdExlbmd0aCB8fCAwKSkudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICBwYXRoLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgICAgIHBhdGguc3R5bGUudHJhbnNpdGlvbiA9IGBzdHJva2UtZGFzaG9mZnNldCAke3RoaXMuYXV0b0RyYXdEdXJhdGlvbn1tcyAke3RoaXMuYXV0b0RyYXdFYXNpbmd9YFxyXG4gICAgICAgICAgICBwYXRoLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSAnMCdcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhdGguc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJ2JvdHRvbSBjZW50ZXInXHJcbiAgICAgICAgICAgIHBhdGguc3R5bGUudHJhbnNpdGlvbiA9ICdub25lJ1xyXG4gICAgICAgICAgICBwYXRoLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZVkoMClgXHJcbiAgICAgICAgICAgIHBhdGguZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcclxuICAgICAgICAgICAgcGF0aC5zdHlsZS50cmFuc2l0aW9uID0gYHRyYW5zZm9ybSAke3RoaXMuYXV0b0RyYXdEdXJhdGlvbn1tcyAke3RoaXMuYXV0b0RyYXdFYXNpbmd9YFxyXG4gICAgICAgICAgICBwYXRoLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZVkoMSlgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmxhc3RMZW5ndGggPSBsZW5ndGhcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2VuR3JhZGllbnQgKCkge1xyXG4gICAgICBjb25zdCBncmFkaWVudERpcmVjdGlvbiA9IHRoaXMuZ3JhZGllbnREaXJlY3Rpb25cclxuICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLmdyYWRpZW50LnNsaWNlKClcclxuXHJcbiAgICAgIC8vIFB1c2hlcyBlbXB0eSBzdHJpbmcgdG8gZm9yY2VcclxuICAgICAgLy8gYSBmYWxsYmFjayB0byBjdXJyZW50Q29sb3JcclxuICAgICAgaWYgKCFncmFkaWVudC5sZW5ndGgpIGdyYWRpZW50LnB1c2goJycpXHJcblxyXG4gICAgICBjb25zdCBsZW4gPSBNYXRoLm1heChncmFkaWVudC5sZW5ndGggLSAxLCAxKVxyXG4gICAgICBjb25zdCBzdG9wcyA9IGdyYWRpZW50LnJldmVyc2UoKS5tYXAoKGNvbG9yLCBpbmRleCkgPT5cclxuICAgICAgICB0aGlzLiRjcmVhdGVFbGVtZW50KCdzdG9wJywge1xyXG4gICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgb2Zmc2V0OiBpbmRleCAvIGxlbixcclxuICAgICAgICAgICAgJ3N0b3AtY29sb3InOiBjb2xvciB8fCB0aGlzLmNvbG9yIHx8ICdjdXJyZW50Q29sb3InXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RlZnMnLCBbXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnbGluZWFyR3JhZGllbnQnLCB7XHJcbiAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5fdWlkLFxyXG4gICAgICAgICAgICB4MTogKyhncmFkaWVudERpcmVjdGlvbiA9PT0gJ2xlZnQnKSxcclxuICAgICAgICAgICAgeTE6ICsoZ3JhZGllbnREaXJlY3Rpb24gPT09ICd0b3AnKSxcclxuICAgICAgICAgICAgeDI6ICsoZ3JhZGllbnREaXJlY3Rpb24gPT09ICdyaWdodCcpLFxyXG4gICAgICAgICAgICB5MjogKyhncmFkaWVudERpcmVjdGlvbiA9PT0gJ2JvdHRvbScpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgc3RvcHMpXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgZ2VuRyAoY2hpbGRyZW46IFZOb2RlW10pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2cnLCB7XHJcbiAgICAgICAgc3R5bGU6IHtcclxuICAgICAgICAgIGZvbnRTaXplOiAnOCcsXHJcbiAgICAgICAgICB0ZXh0QW5jaG9yOiAnbWlkZGxlJyxcclxuICAgICAgICAgIGRvbWluYW50QmFzZWxpbmU6ICdtYXRoZW1hdGljYWwnLFxyXG4gICAgICAgICAgZmlsbDogdGhpcy5jb2xvciB8fCAnY3VycmVudENvbG9yJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgY2hpbGRyZW4pXHJcbiAgICB9LFxyXG4gICAgZ2VuTGFiZWxzICgpIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc0xhYmVscykgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2VuRyh0aGlzLnBhcnNlZExhYmVscy5tYXAodGhpcy5nZW5UZXh0KSlcclxuICAgIH0sXHJcbiAgICBnZW5QYXRoICgpIHtcclxuICAgICAgY29uc3QgcmFkaXVzID0gdGhpcy5zbW9vdGggPT09IHRydWUgPyA4IDogTnVtYmVyKHRoaXMuc21vb3RoKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3BhdGgnLCB7XHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIGlkOiB0aGlzLl91aWQsXHJcbiAgICAgICAgICBkOiBnZW5QYXRoKHRoaXMucG9pbnRzLnNsaWNlKCksIHJhZGl1cywgdGhpcy5maWxsLCBOdW1iZXIodGhpcy5oZWlnaHQpKSxcclxuICAgICAgICAgIGZpbGw6IHRoaXMuZmlsbCA/IGB1cmwoIyR7dGhpcy5fdWlkfSlgIDogJ25vbmUnLFxyXG4gICAgICAgICAgc3Ryb2tlOiB0aGlzLmZpbGwgPyAnbm9uZScgOiBgdXJsKCMke3RoaXMuX3VpZH0pYFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVmOiAncGF0aCdcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZW5UZXh0IChpdGVtOiBTcGFya2xpbmVUZXh0LCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy4kc2NvcGVkU2xvdHMubGFiZWxcclxuICAgICAgICA/IHRoaXMuJHNjb3BlZFNsb3RzLmxhYmVsKHsgaW5kZXgsIHZhbHVlOiBpdGVtLnZhbHVlIH0pXHJcbiAgICAgICAgOiBpdGVtLnZhbHVlXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgndGV4dCcsIHtcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgeDogaXRlbS54LFxyXG4gICAgICAgICAgeTogdGhpcy50ZXh0WVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgW2NoaWxkcmVuXSlcclxuICAgIH0sXHJcbiAgICBnZW5CYXIgKCkge1xyXG4gICAgICBpZiAoIXRoaXMudmFsdWUgfHwgdGhpcy50b3RhbEJhcnMgPCAyKSByZXR1cm4gdW5kZWZpbmVkIGFzIG5ldmVyXHJcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgcGFyc2VkUGFkZGluZywgX2xpbmVXaWR0aCB9ID0gdGhpc1xyXG4gICAgICBjb25zdCB2aWV3V2lkdGggPSB3aWR0aCB8fCB0aGlzLnRvdGFsQmFycyAqIHBhcnNlZFBhZGRpbmcgKiAyXHJcbiAgICAgIGNvbnN0IHZpZXdIZWlnaHQgPSBoZWlnaHQgfHwgNzVcclxuICAgICAgY29uc3QgYm91bmRhcnk6IEJvdW5kYXJ5ID0ge1xyXG4gICAgICAgIG1pblg6IHBhcnNlZFBhZGRpbmcsXHJcbiAgICAgICAgbWluWTogcGFyc2VkUGFkZGluZyxcclxuICAgICAgICBtYXhYOiBOdW1iZXIodmlld1dpZHRoKSAtIHBhcnNlZFBhZGRpbmcsXHJcbiAgICAgICAgbWF4WTogTnVtYmVyKHZpZXdIZWlnaHQpIC0gcGFyc2VkUGFkZGluZ1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IHByb3BzID0ge1xyXG4gICAgICAgIC4uLnRoaXMuJHByb3BzXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByb3BzLnBvaW50cyA9IGdlblBvaW50cyh0aGlzLnZhbHVlLCBib3VuZGFyeSwgdGhpcy50eXBlKVxyXG5cclxuICAgICAgY29uc3QgdG90YWxXaWR0aCA9IGJvdW5kYXJ5Lm1heFggLyAocHJvcHMucG9pbnRzLmxlbmd0aCAtIDEpXHJcblxyXG4gICAgICBwcm9wcy5ib3VuZGFyeSA9IGJvdW5kYXJ5XHJcbiAgICAgIHByb3BzLmxpbmVXaWR0aCA9IF9saW5lV2lkdGggfHwgKHRvdGFsV2lkdGggLSBOdW1iZXIocGFyc2VkUGFkZGluZyB8fCA1KSlcclxuICAgICAgcHJvcHMub2Zmc2V0WCA9IDBcclxuICAgICAgaWYgKCF0aGlzLmF1dG9MaW5lV2lkdGgpIHtcclxuICAgICAgICBwcm9wcy5vZmZzZXRYID0gKChib3VuZGFyeS5tYXhYIC8gdGhpcy50b3RhbEJhcnMpIC8gMikgLSBib3VuZGFyeS5taW5YXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCdzdmcnLCB7XHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICBoZWlnaHQ6ICcyNSUnLFxyXG4gICAgICAgICAgdmlld0JveDogYDAgMCAke3ZpZXdXaWR0aH0gJHt2aWV3SGVpZ2h0fWBcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbkdyYWRpZW50KCksXHJcbiAgICAgICAgdGhpcy5nZW5DbGlwUGF0aChwcm9wcy5vZmZzZXRYLCBwcm9wcy5saW5lV2lkdGgsICdzcGFya2xpbmUtYmFyLScgKyB0aGlzLl91aWQpLFxyXG4gICAgICAgIHRoaXMuaGFzTGFiZWxzID8gdGhpcy5nZW5CYXJMYWJlbHMocHJvcHMgYXMgQmFyVGV4dCkgOiB1bmRlZmluZWQgYXMgbmV2ZXIsXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgnZycsIHtcclxuICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEsLTEpIHRyYW5zbGF0ZSgwLC0ke2JvdW5kYXJ5Lm1heFl9KWAsXHJcbiAgICAgICAgICAgICdjbGlwLXBhdGgnOiBgdXJsKCNzcGFya2xpbmUtYmFyLSR7dGhpcy5fdWlkfS1jbGlwKWAsXHJcbiAgICAgICAgICAgIGZpbGw6IGB1cmwoIyR7dGhpcy5fdWlkfSlgXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgW1xyXG4gICAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgncmVjdCcsIHtcclxuICAgICAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICAgIHk6IDAsXHJcbiAgICAgICAgICAgICAgd2lkdGg6IHZpZXdXaWR0aCxcclxuICAgICAgICAgICAgICBoZWlnaHQ6IHZpZXdIZWlnaHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdKVxyXG4gICAgICBdKVxyXG4gICAgfSxcclxuICAgIGdlbkNsaXBQYXRoIChvZmZzZXRYOiBudW1iZXIsIGxpbmVXaWR0aDogbnVtYmVyLCBpZDogc3RyaW5nKSB7XHJcbiAgICAgIGNvbnN0IHsgbWF4WSB9ID0gdGhpcy5ib3VuZGFyeVxyXG4gICAgICBjb25zdCByb3VuZGluZyA9IHR5cGVvZiB0aGlzLnNtb290aCA9PT0gJ251bWJlcidcclxuICAgICAgICA/IHRoaXMuc21vb3RoXHJcbiAgICAgICAgOiB0aGlzLnNtb290aCA/IDIgOiAwXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnY2xpcFBhdGgnLCB7XHJcbiAgICAgICAgYXR0cnM6IHtcclxuICAgICAgICAgIGlkOiBgJHtpZH0tY2xpcGBcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMucG9pbnRzLm1hcChpdGVtID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgncmVjdCcsIHtcclxuICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgIHg6IGl0ZW0ueCArIG9mZnNldFgsXHJcbiAgICAgICAgICAgIHk6IDAsXHJcbiAgICAgICAgICAgIHdpZHRoOiBsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogTWF0aC5tYXgobWF4WSAtIGl0ZW0ueSwgMCksXHJcbiAgICAgICAgICAgIHJ4OiByb3VuZGluZyxcclxuICAgICAgICAgICAgcnk6IHJvdW5kaW5nXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgW1xyXG4gICAgICAgICAgdGhpcy5hdXRvRHJhdyA/IHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2FuaW1hdGUnLCB7XHJcbiAgICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZTogJ2hlaWdodCcsXHJcbiAgICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgICB0bzogbWF4WSAtIGl0ZW0ueSxcclxuICAgICAgICAgICAgICBkdXI6IGAke3RoaXMuYXV0b0RyYXdEdXJhdGlvbn1tc2AsXHJcbiAgICAgICAgICAgICAgZmlsbDogJ2ZyZWV6ZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSkgOiB1bmRlZmluZWQgYXMgbmV2ZXJcclxuICAgICAgICBdKVxyXG4gICAgICB9KSlcclxuICAgIH0sXHJcbiAgICBnZW5CYXJMYWJlbHMgKHByb3BzOiBCYXJUZXh0KTogVk5vZGUge1xyXG4gICAgICBjb25zdCBvZmZzZXRYID0gcHJvcHMub2Zmc2V0WCB8fCAwXHJcblxyXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IHByb3BzLnBvaW50cy5tYXAoaXRlbSA9PiAoXHJcbiAgICAgICAgdGhpcy4kY3JlYXRlRWxlbWVudCgndGV4dCcsIHtcclxuICAgICAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgICAgIHg6IGl0ZW0ueCArIG9mZnNldFggKyB0aGlzLl9saW5lV2lkdGggLyAyLFxyXG4gICAgICAgICAgICB5OiBwcm9wcy5ib3VuZGFyeS5tYXhZICsgKE51bWJlcih0aGlzLmxhYmVsU2l6ZSkgfHwgNyksXHJcbiAgICAgICAgICAgICdmb250LXNpemUnOiBOdW1iZXIodGhpcy5sYWJlbFNpemUpIHx8IDdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBpdGVtLnZhbHVlLnRvU3RyaW5nKCkpXHJcbiAgICAgICkpXHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZW5HKGNoaWxkcmVuKVxyXG4gICAgfSxcclxuICAgIGdlblRyZW5kICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ3N2ZycsIHRoaXMuc2V0VGV4dENvbG9yKHRoaXMuY29sb3IsIHtcclxuICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgJ3N0cm9rZS13aWR0aCc6IHRoaXMuX2xpbmVXaWR0aCB8fCAxLFxyXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgIGhlaWdodDogJzI1JScsXHJcbiAgICAgICAgICB2aWV3Qm94OiBgMCAwICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gXHJcbiAgICAgICAgfVxyXG4gICAgICB9KSwgW1xyXG4gICAgICAgIHRoaXMuZ2VuR3JhZGllbnQoKSxcclxuICAgICAgICB0aGlzLmdlbkxhYmVscygpLFxyXG4gICAgICAgIHRoaXMuZ2VuUGF0aCgpXHJcbiAgICAgIF0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcmVuZGVyIChoKTogVk5vZGUge1xyXG4gICAgaWYgKHRoaXMudG90YWxCYXJzIDwgMikgcmV0dXJuIHVuZGVmaW5lZCBhcyBuZXZlclxyXG5cclxuICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICd0cmVuZCdcclxuICAgICAgPyB0aGlzLmdlblRyZW5kKClcclxuICAgICAgOiB0aGlzLmdlbkJhcigpXHJcbiAgfVxyXG59KVxyXG4iXX0=