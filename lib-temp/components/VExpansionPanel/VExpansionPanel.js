import '../../stylus/components/_expansion-panel.styl';
import Themeable from '../../mixins/themeable';
import { provide as RegistrableProvide } from '../../mixins/registrable';
import mixins from '../../util/mixins';
/* @vue/component */
export default mixins(Themeable, RegistrableProvide('expansionPanel')).extend({
    name: 'v-expansion-panel',
    provide() {
        return {
            expansionPanel: this
        };
    },
    props: {
        disabled: Boolean,
        readonly: Boolean,
        expand: Boolean,
        focusable: Boolean,
        inset: Boolean,
        popout: Boolean,
        value: {
            type: [Number, Array],
            default: () => null
        }
    },
    data: () => ({
        items: [],
        open: []
    }),
    computed: {
        classes() {
            return {
                'v-expansion-panel--focusable': this.focusable,
                'v-expansion-panel--popout': this.popout,
                'v-expansion-panel--inset': this.inset,
                ...this.themeClasses
            };
        }
    },
    watch: {
        expand(v) {
            let openIndex = -1;
            if (!v) {
                // Close all panels unless only one is open
                const openCount = this.open.reduce((acc, val) => val ? acc + 1 : acc, 0);
                const open = Array(this.items.length).fill(false);
                if (openCount === 1) {
                    openIndex = this.open.indexOf(true);
                }
                if (openIndex > -1) {
                    open[openIndex] = true;
                }
                this.open = open;
            }
            this.$emit('input', v ? this.open : (openIndex > -1 ? openIndex : null));
        },
        value(v) {
            this.updateFromValue(v);
        }
    },
    mounted() {
        this.value !== null && this.updateFromValue(this.value);
    },
    methods: {
        updateFromValue(v) {
            if (Array.isArray(v) && !this.expand)
                return;
            let open = Array(this.items.length).fill(false);
            if (typeof v === 'number') {
                open[v] = true;
            }
            else if (v !== null) {
                open = v;
            }
            this.updatePanels(open);
        },
        updatePanels(open) {
            this.open = open;
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].toggle(open && open[i]);
            }
        },
        panelClick(uid) {
            const open = this.expand ? this.open.slice() : Array(this.items.length).fill(false);
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i]._uid === uid) {
                    open[i] = !this.open[i];
                    !this.expand && this.$emit('input', open[i] ? i : null);
                }
            }
            this.updatePanels(open);
            if (this.expand)
                this.$emit('input', open);
        },
        register(content) {
            const i = this.items.push(content) - 1;
            this.value !== null && this.updateFromValue(this.value);
            content.toggle(!!this.open[i]);
        },
        unregister(content) {
            const index = this.items.findIndex(i => i._uid === content._uid);
            this.items.splice(index, 1);
            this.open.splice(index, 1);
        }
    },
    render(h) {
        return h('ul', {
            staticClass: 'v-expansion-panel',
            class: this.classes
        }, this.$slots.default);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkV4cGFuc2lvblBhbmVsL1ZFeHBhbnNpb25QYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLCtDQUErQyxDQUFBO0FBSXRELE9BQU8sU0FBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzlDLE9BQU8sRUFBRSxPQUFPLElBQUksa0JBQWtCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUV4RSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQTtBQU10QyxvQkFBb0I7QUFDcEIsZUFBZSxNQUFNLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDNUUsSUFBSSxFQUFFLG1CQUFtQjtJQUV6QixPQUFPO1FBQ0wsT0FBTztZQUNMLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxFQUFFO1FBQ0wsUUFBUSxFQUFFLE9BQU87UUFDakIsUUFBUSxFQUFFLE9BQU87UUFDakIsTUFBTSxFQUFFLE9BQU87UUFDZixTQUFTLEVBQUUsT0FBTztRQUNsQixLQUFLLEVBQUUsT0FBTztRQUNkLE1BQU0sRUFBRSxPQUFPO1FBQ2YsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztZQUNyQixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSTtTQUN1QjtLQUM3QztJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsS0FBSyxFQUFFLEVBQXNDO1FBQzdDLElBQUksRUFBRSxFQUFlO0tBQ3RCLENBQUM7SUFFRixRQUFRLEVBQUU7UUFDUixPQUFPO1lBQ0wsT0FBTztnQkFDTCw4QkFBOEIsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDOUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ3hDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUN0QyxHQUFHLElBQUksQ0FBQyxZQUFZO2FBQ3JCLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxLQUFLLEVBQUU7UUFDTCxNQUFNLENBQUUsQ0FBVTtZQUNoQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUNsQixJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUNOLDJDQUEyQztnQkFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDeEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUVqRCxJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7b0JBQ25CLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtpQkFDcEM7Z0JBRUQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUE7aUJBQ3ZCO2dCQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO2FBQ2pCO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzFFLENBQUM7UUFDRCxLQUFLLENBQUUsQ0FBb0I7WUFDekIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN6QixDQUFDO0tBQ0Y7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDekQsQ0FBQztJQUVELE9BQU8sRUFBRTtRQUNQLGVBQWUsQ0FBRSxDQUFvQjtZQUNuQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxPQUFNO1lBRTVDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMvQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDekIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQTthQUNmO2lCQUFNLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDckIsSUFBSSxHQUFHLENBQUMsQ0FBQTthQUNUO1lBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN6QixDQUFDO1FBQ0QsWUFBWSxDQUFFLElBQWU7WUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7WUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDdEM7UUFDSCxDQUFDO1FBQ0QsVUFBVSxDQUFFLEdBQVc7WUFDckIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ25GLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ3ZCLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ3hEO2FBQ0Y7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU07Z0JBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDNUMsQ0FBQztRQUNELFFBQVEsQ0FBRSxPQUF1QztZQUMvQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDdEMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hDLENBQUM7UUFDRCxVQUFVLENBQUUsT0FBdUM7WUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzVCLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBRSxDQUFDO1FBQ1AsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ2IsV0FBVyxFQUFFLG1CQUFtQjtZQUNoQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDcEIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3pCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19leHBhbnNpb24tcGFuZWwuc3R5bCdcclxuXHJcbmltcG9ydCB7IFZFeHBhbnNpb25QYW5lbENvbnRlbnQgfSBmcm9tICcuJ1xyXG5cclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5pbXBvcnQgeyBwcm92aWRlIGFzIFJlZ2lzdHJhYmxlUHJvdmlkZSB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcclxuXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vLi4vdXRpbC9taXhpbnMnXHJcbmltcG9ydCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgeyBQcm9wVmFsaWRhdG9yIH0gZnJvbSAndnVlL3R5cGVzL29wdGlvbnMnXHJcblxyXG50eXBlIFZFeHBhbnNpb25QYW5lbENvbnRlbnRJbnN0YW5jZSA9IEluc3RhbmNlVHlwZTx0eXBlb2YgVkV4cGFuc2lvblBhbmVsQ29udGVudD5cclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGlucyhUaGVtZWFibGUsIFJlZ2lzdHJhYmxlUHJvdmlkZSgnZXhwYW5zaW9uUGFuZWwnKSkuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1leHBhbnNpb24tcGFuZWwnLFxyXG5cclxuICBwcm92aWRlICgpOiBvYmplY3Qge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZXhwYW5zaW9uUGFuZWw6IHRoaXNcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgZGlzYWJsZWQ6IEJvb2xlYW4sXHJcbiAgICByZWFkb25seTogQm9vbGVhbixcclxuICAgIGV4cGFuZDogQm9vbGVhbixcclxuICAgIGZvY3VzYWJsZTogQm9vbGVhbixcclxuICAgIGluc2V0OiBCb29sZWFuLFxyXG4gICAgcG9wb3V0OiBCb29sZWFuLFxyXG4gICAgdmFsdWU6IHtcclxuICAgICAgdHlwZTogW051bWJlciwgQXJyYXldLFxyXG4gICAgICBkZWZhdWx0OiAoKSA9PiBudWxsXHJcbiAgICB9IGFzIGFueSBhcyBQcm9wVmFsaWRhdG9yPG51bWJlciB8IG51bWJlcltdPlxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBpdGVtczogW10gYXMgVkV4cGFuc2lvblBhbmVsQ29udGVudEluc3RhbmNlW10sXHJcbiAgICBvcGVuOiBbXSBhcyBib29sZWFuW11cclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVsLS1mb2N1c2FibGUnOiB0aGlzLmZvY3VzYWJsZSxcclxuICAgICAgICAndi1leHBhbnNpb24tcGFuZWwtLXBvcG91dCc6IHRoaXMucG9wb3V0LFxyXG4gICAgICAgICd2LWV4cGFuc2lvbi1wYW5lbC0taW5zZXQnOiB0aGlzLmluc2V0LFxyXG4gICAgICAgIC4uLnRoaXMudGhlbWVDbGFzc2VzXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgZXhwYW5kICh2OiBib29sZWFuKSB7XHJcbiAgICAgIGxldCBvcGVuSW5kZXggPSAtMVxyXG4gICAgICBpZiAoIXYpIHtcclxuICAgICAgICAvLyBDbG9zZSBhbGwgcGFuZWxzIHVubGVzcyBvbmx5IG9uZSBpcyBvcGVuXHJcbiAgICAgICAgY29uc3Qgb3BlbkNvdW50ID0gdGhpcy5vcGVuLnJlZHVjZSgoYWNjLCB2YWwpID0+IHZhbCA/IGFjYyArIDEgOiBhY2MsIDApXHJcbiAgICAgICAgY29uc3Qgb3BlbiA9IEFycmF5KHRoaXMuaXRlbXMubGVuZ3RoKS5maWxsKGZhbHNlKVxyXG5cclxuICAgICAgICBpZiAob3BlbkNvdW50ID09PSAxKSB7XHJcbiAgICAgICAgICBvcGVuSW5kZXggPSB0aGlzLm9wZW4uaW5kZXhPZih0cnVlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wZW5JbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICBvcGVuW29wZW5JbmRleF0gPSB0cnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9wZW4gPSBvcGVuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuJGVtaXQoJ2lucHV0JywgdiA/IHRoaXMub3BlbiA6IChvcGVuSW5kZXggPiAtMSA/IG9wZW5JbmRleCA6IG51bGwpKVxyXG4gICAgfSxcclxuICAgIHZhbHVlICh2OiBudW1iZXIgfCBudW1iZXJbXSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUZyb21WYWx1ZSh2KVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQgKCkge1xyXG4gICAgdGhpcy52YWx1ZSAhPT0gbnVsbCAmJiB0aGlzLnVwZGF0ZUZyb21WYWx1ZSh0aGlzLnZhbHVlKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHVwZGF0ZUZyb21WYWx1ZSAodjogbnVtYmVyIHwgbnVtYmVyW10pIHtcclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikgJiYgIXRoaXMuZXhwYW5kKSByZXR1cm5cclxuXHJcbiAgICAgIGxldCBvcGVuID0gQXJyYXkodGhpcy5pdGVtcy5sZW5ndGgpLmZpbGwoZmFsc2UpXHJcbiAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICBvcGVuW3ZdID0gdHJ1ZVxyXG4gICAgICB9IGVsc2UgaWYgKHYgIT09IG51bGwpIHtcclxuICAgICAgICBvcGVuID0gdlxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVBhbmVscyhvcGVuKVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVBhbmVscyAob3BlbjogYm9vbGVhbltdKSB7XHJcbiAgICAgIHRoaXMub3BlbiA9IG9wZW5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtc1tpXS50b2dnbGUob3BlbiAmJiBvcGVuW2ldKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcGFuZWxDbGljayAodWlkOiBudW1iZXIpIHtcclxuICAgICAgY29uc3Qgb3BlbiA9IHRoaXMuZXhwYW5kID8gdGhpcy5vcGVuLnNsaWNlKCkgOiBBcnJheSh0aGlzLml0ZW1zLmxlbmd0aCkuZmlsbChmYWxzZSlcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbXNbaV0uX3VpZCA9PT0gdWlkKSB7XHJcbiAgICAgICAgICBvcGVuW2ldID0gIXRoaXMub3BlbltpXVxyXG4gICAgICAgICAgIXRoaXMuZXhwYW5kICYmIHRoaXMuJGVtaXQoJ2lucHV0Jywgb3BlbltpXSA/IGkgOiBudWxsKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGVQYW5lbHMob3BlbilcclxuICAgICAgaWYgKHRoaXMuZXhwYW5kKSB0aGlzLiRlbWl0KCdpbnB1dCcsIG9wZW4pXHJcbiAgICB9LFxyXG4gICAgcmVnaXN0ZXIgKGNvbnRlbnQ6IFZFeHBhbnNpb25QYW5lbENvbnRlbnRJbnN0YW5jZSkge1xyXG4gICAgICBjb25zdCBpID0gdGhpcy5pdGVtcy5wdXNoKGNvbnRlbnQpIC0gMVxyXG4gICAgICB0aGlzLnZhbHVlICE9PSBudWxsICYmIHRoaXMudXBkYXRlRnJvbVZhbHVlKHRoaXMudmFsdWUpXHJcbiAgICAgIGNvbnRlbnQudG9nZ2xlKCEhdGhpcy5vcGVuW2ldKVxyXG4gICAgfSxcclxuICAgIHVucmVnaXN0ZXIgKGNvbnRlbnQ6IFZFeHBhbnNpb25QYW5lbENvbnRlbnRJbnN0YW5jZSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaXRlbXMuZmluZEluZGV4KGkgPT4gaS5fdWlkID09PSBjb250ZW50Ll91aWQpXHJcbiAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICB0aGlzLm9wZW4uc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIHJldHVybiBoKCd1bCcsIHtcclxuICAgICAgc3RhdGljQ2xhc3M6ICd2LWV4cGFuc2lvbi1wYW5lbCcsXHJcbiAgICAgIGNsYXNzOiB0aGlzLmNsYXNzZXNcclxuICAgIH0sIHRoaXMuJHNsb3RzLmRlZmF1bHQpXHJcbiAgfVxyXG59KVxyXG4iXX0=