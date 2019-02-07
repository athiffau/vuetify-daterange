// Styles
import '../../stylus/components/_tabs.styl';
// Extensions
import { BaseItemGroup } from '../VItemGroup/VItemGroup';
// Component level mixins
import TabsComputed from './mixins/tabs-computed';
import TabsGenerators from './mixins/tabs-generators';
import TabsProps from './mixins/tabs-props';
import TabsTouch from './mixins/tabs-touch';
import TabsWatchers from './mixins/tabs-watchers';
// Mixins
import Colorable from '../../mixins/colorable';
import SSRBootable from '../../mixins/ssr-bootable';
import Themeable from '../../mixins/themeable';
// Directives
import Resize from '../../directives/resize';
import Touch from '../../directives/touch';
import { deprecate } from '../../util/console';
// Utils
import ThemeProvider from '../../util/ThemeProvider';
/* @vue/component */
export default BaseItemGroup.extend({
    name: 'v-tabs',
    directives: {
        Resize,
        Touch
    },
    mixins: [
        Colorable,
        SSRBootable,
        TabsComputed,
        TabsProps,
        TabsGenerators,
        TabsTouch,
        TabsWatchers,
        Themeable
    ],
    provide() {
        return {
            tabGroup: this,
            tabProxy: this.tabProxy,
            registerItems: this.registerItems,
            unregisterItems: this.unregisterItems
        };
    },
    data() {
        return {
            bar: [],
            content: [],
            isOverflowing: false,
            nextIconVisible: false,
            prevIconVisible: false,
            resizeTimeout: null,
            scrollOffset: 0,
            sliderWidth: null,
            sliderLeft: null,
            startX: 0,
            tabItems: null,
            transitionTime: 300,
            widths: {
                bar: 0,
                container: 0,
                wrapper: 0
            }
        };
    },
    watch: {
        items: 'onResize',
        tabs: 'onResize'
    },
    mounted() {
        this.init();
    },
    methods: {
        checkIcons() {
            this.prevIconVisible = this.checkPrevIcon();
            this.nextIconVisible = this.checkNextIcon();
        },
        checkPrevIcon() {
            return this.scrollOffset > 0;
        },
        checkNextIcon() {
            // Check one scroll ahead to know the width of right-most item
            return this.widths.container > this.scrollOffset + this.widths.wrapper;
        },
        callSlider() {
            if (this.hideSlider || !this.activeTab)
                return false;
            // Give screen time to paint
            const activeTab = this.activeTab;
            this.$nextTick(() => {
                /* istanbul ignore if */
                if (!activeTab || !activeTab.$el)
                    return;
                this.sliderWidth = activeTab.$el.scrollWidth;
                this.sliderLeft = activeTab.$el.offsetLeft;
            });
        },
        // Do not process
        // until DOM is
        // painted
        init() {
            /* istanbul ignore next */
            if (this.$listeners['input']) {
                deprecate('@input', '@change', this);
            }
        },
        /**
         * When v-navigation-drawer changes the
         * width of the container, call resize
         * after the transition is complete
         */
        onResize() {
            if (this._isDestroyed)
                return;
            this.setWidths();
            const delay = this.isBooted ? this.transitionTime : 0;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(this.updateTabsView, delay);
        },
        overflowCheck(e, fn) {
            this.isOverflowing && fn(e);
        },
        scrollTo(direction) {
            this.scrollOffset = this.newOffset(direction);
        },
        setOverflow() {
            this.isOverflowing = this.widths.bar < this.widths.container;
        },
        setWidths() {
            const bar = this.$refs.bar ? this.$refs.bar.clientWidth : 0;
            const container = this.$refs.container ? this.$refs.container.clientWidth : 0;
            const wrapper = this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 0;
            this.widths = { bar, container, wrapper };
            this.setOverflow();
        },
        parseNodes() {
            const item = [];
            const items = [];
            const slider = [];
            const tab = [];
            const length = (this.$slots.default || []).length;
            for (let i = 0; i < length; i++) {
                const vnode = this.$slots.default[i];
                if (vnode.componentOptions) {
                    switch (vnode.componentOptions.Ctor.options.name) {
                        case 'v-tabs-slider':
                            slider.push(vnode);
                            break;
                        case 'v-tabs-items':
                            items.push(vnode);
                            break;
                        case 'v-tab-item':
                            item.push(vnode);
                            break;
                        // case 'v-tab' - intentionally omitted
                        default: tab.push(vnode);
                    }
                }
                else {
                    tab.push(vnode);
                }
            }
            return { tab, slider, items, item };
        },
        registerItems(fn) {
            this.tabItems = fn;
            fn(this.internalValue);
        },
        unregisterItems() {
            this.tabItems = null;
        },
        updateTabsView() {
            this.callSlider();
            this.scrollIntoView();
            this.checkIcons();
        },
        scrollIntoView() {
            /* istanbul ignore next */
            if (!this.activeTab)
                return;
            if (!this.isOverflowing)
                return (this.scrollOffset = 0);
            const totalWidth = this.widths.wrapper + this.scrollOffset;
            const { clientWidth, offsetLeft } = this.activeTab.$el;
            const itemOffset = clientWidth + offsetLeft;
            let additionalOffset = clientWidth * 0.3;
            if (this.activeTab === this.items[this.items.length - 1]) {
                additionalOffset = 0; // don't add an offset if selecting the last tab
            }
            /* istanbul ignore else */
            if (offsetLeft < this.scrollOffset) {
                this.scrollOffset = Math.max(offsetLeft - additionalOffset, 0);
            }
            else if (totalWidth < itemOffset) {
                this.scrollOffset -= totalWidth - itemOffset - additionalOffset;
            }
        },
        tabProxy(val) {
            this.internalValue = val;
        }
    },
    render(h) {
        const { tab, slider, items, item } = this.parseNodes();
        return h('div', {
            staticClass: 'v-tabs',
            directives: [{
                    name: 'resize',
                    modifiers: { quiet: true },
                    value: this.onResize
                }]
        }, [
            this.genBar([this.hideSlider ? null : this.genSlider(slider), tab]),
            h(ThemeProvider, {
                props: { dark: this.theme.isDark, light: !this.theme.isDark }
            }, [
                this.genItems(items, item)
            ])
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVlRhYnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WVGFicy9WVGFicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxvQ0FBb0MsQ0FBQTtBQUUzQyxhQUFhO0FBQ2IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFBO0FBRXhELHlCQUF5QjtBQUN6QixPQUFPLFlBQVksTUFBTSx3QkFBd0IsQ0FBQTtBQUNqRCxPQUFPLGNBQWMsTUFBTSwwQkFBMEIsQ0FBQTtBQUNyRCxPQUFPLFNBQVMsTUFBTSxxQkFBcUIsQ0FBQTtBQUMzQyxPQUFPLFNBQVMsTUFBTSxxQkFBcUIsQ0FBQTtBQUMzQyxPQUFPLFlBQVksTUFBTSx3QkFBd0IsQ0FBQTtBQUVqRCxTQUFTO0FBQ1QsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFDOUMsT0FBTyxXQUFXLE1BQU0sMkJBQTJCLENBQUE7QUFDbkQsT0FBTyxTQUFTLE1BQU0sd0JBQXdCLENBQUE7QUFFOUMsYUFBYTtBQUNiLE9BQU8sTUFBTSxNQUFNLHlCQUF5QixDQUFBO0FBQzVDLE9BQU8sS0FBSyxNQUFNLHdCQUF3QixDQUFBO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUU5QyxRQUFRO0FBQ1IsT0FBTyxhQUFhLE1BQU0sMEJBQTBCLENBQUE7QUFFcEQsb0JBQW9CO0FBQ3BCLGVBQWUsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNsQyxJQUFJLEVBQUUsUUFBUTtJQUVkLFVBQVUsRUFBRTtRQUNWLE1BQU07UUFDTixLQUFLO0tBQ047SUFFRCxNQUFNLEVBQUU7UUFDTixTQUFTO1FBQ1QsV0FBVztRQUNYLFlBQVk7UUFDWixTQUFTO1FBQ1QsY0FBYztRQUNkLFNBQVM7UUFDVCxZQUFZO1FBQ1osU0FBUztLQUNWO0lBRUQsT0FBTztRQUNMLE9BQU87WUFDTCxRQUFRLEVBQUUsSUFB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QUFHLEdBQUcsQ0FBQTtRQUMxQixDQUFDO0tBQ0Y7SUFFRCxNQUFNLENBQUUsQ0FBQztRQUNQLE1BQU0sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7UUFFdEQsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsV0FBVyxFQUFFLFFBQVE7WUFDckIsVUFBVSxFQUFFLENBQUM7b0JBQ1gsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtvQkFDMUIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO2lCQUNyQixDQUFDO1NBQ0gsRUFBRTtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDLGFBQWEsRUFBRTtnQkFDZixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7YUFDOUQsRUFBRTtnQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7YUFDM0IsQ0FBQztTQUNILENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTdHlsZXNcclxuaW1wb3J0ICcuLi8uLi9zdHlsdXMvY29tcG9uZW50cy9fdGFicy5zdHlsJ1xyXG5cclxuLy8gRXh0ZW5zaW9uc1xyXG5pbXBvcnQgeyBCYXNlSXRlbUdyb3VwIH0gZnJvbSAnLi4vVkl0ZW1Hcm91cC9WSXRlbUdyb3VwJ1xyXG5cclxuLy8gQ29tcG9uZW50IGxldmVsIG1peGluc1xyXG5pbXBvcnQgVGFic0NvbXB1dGVkIGZyb20gJy4vbWl4aW5zL3RhYnMtY29tcHV0ZWQnXHJcbmltcG9ydCBUYWJzR2VuZXJhdG9ycyBmcm9tICcuL21peGlucy90YWJzLWdlbmVyYXRvcnMnXHJcbmltcG9ydCBUYWJzUHJvcHMgZnJvbSAnLi9taXhpbnMvdGFicy1wcm9wcydcclxuaW1wb3J0IFRhYnNUb3VjaCBmcm9tICcuL21peGlucy90YWJzLXRvdWNoJ1xyXG5pbXBvcnQgVGFic1dhdGNoZXJzIGZyb20gJy4vbWl4aW5zL3RhYnMtd2F0Y2hlcnMnXHJcblxyXG4vLyBNaXhpbnNcclxuaW1wb3J0IENvbG9yYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvY29sb3JhYmxlJ1xyXG5pbXBvcnQgU1NSQm9vdGFibGUgZnJvbSAnLi4vLi4vbWl4aW5zL3Nzci1ib290YWJsZSdcclxuaW1wb3J0IFRoZW1lYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvdGhlbWVhYmxlJ1xyXG5cclxuLy8gRGlyZWN0aXZlc1xyXG5pbXBvcnQgUmVzaXplIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmVzaXplJ1xyXG5pbXBvcnQgVG91Y2ggZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy90b3VjaCdcclxuaW1wb3J0IHsgZGVwcmVjYXRlIH0gZnJvbSAnLi4vLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuLy8gVXRpbHNcclxuaW1wb3J0IFRoZW1lUHJvdmlkZXIgZnJvbSAnLi4vLi4vdXRpbC9UaGVtZVByb3ZpZGVyJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgQmFzZUl0ZW1Hcm91cC5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LXRhYnMnLFxyXG5cclxuICBkaXJlY3RpdmVzOiB7XHJcbiAgICBSZXNpemUsXHJcbiAgICBUb3VjaFxyXG4gIH0sXHJcblxyXG4gIG1peGluczogW1xyXG4gICAgQ29sb3JhYmxlLFxyXG4gICAgU1NSQm9vdGFibGUsXHJcbiAgICBUYWJzQ29tcHV0ZWQsXHJcbiAgICBUYWJzUHJvcHMsXHJcbiAgICBUYWJzR2VuZXJhdG9ycyxcclxuICAgIFRhYnNUb3VjaCxcclxuICAgIFRhYnNXYXRjaGVycyxcclxuICAgIFRoZW1lYWJsZVxyXG4gIF0sXHJcblxyXG4gIHByb3ZpZGUgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGFiR3JvdXA6IHRoaXMsXHJcbiAgICAgIHRhYlByb3h5OiB0aGlzLnRhYlByb3h5LFxyXG4gICAgICByZWdpc3Rlckl0ZW1zOiB0aGlzLnJlZ2lzdGVySXRlbXMsXHJcbiAgICAgIHVucmVnaXN0ZXJJdGVtczogdGhpcy51bnJlZ2lzdGVySXRlbXNcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJhcjogW10sXHJcbiAgICAgIGNvbnRlbnQ6IFtdLFxyXG4gICAgICBpc092ZXJmbG93aW5nOiBmYWxzZSxcclxuICAgICAgbmV4dEljb25WaXNpYmxlOiBmYWxzZSxcclxuICAgICAgcHJldkljb25WaXNpYmxlOiBmYWxzZSxcclxuICAgICAgcmVzaXplVGltZW91dDogbnVsbCxcclxuICAgICAgc2Nyb2xsT2Zmc2V0OiAwLFxyXG4gICAgICBzbGlkZXJXaWR0aDogbnVsbCxcclxuICAgICAgc2xpZGVyTGVmdDogbnVsbCxcclxuICAgICAgc3RhcnRYOiAwLFxyXG4gICAgICB0YWJJdGVtczogbnVsbCxcclxuICAgICAgdHJhbnNpdGlvblRpbWU6IDMwMCxcclxuICAgICAgd2lkdGhzOiB7XHJcbiAgICAgICAgYmFyOiAwLFxyXG4gICAgICAgIGNvbnRhaW5lcjogMCxcclxuICAgICAgICB3cmFwcGVyOiAwXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaXRlbXM6ICdvblJlc2l6ZScsXHJcbiAgICB0YWJzOiAnb25SZXNpemUnXHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICB0aGlzLmluaXQoKVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNoZWNrSWNvbnMgKCkge1xyXG4gICAgICB0aGlzLnByZXZJY29uVmlzaWJsZSA9IHRoaXMuY2hlY2tQcmV2SWNvbigpXHJcbiAgICAgIHRoaXMubmV4dEljb25WaXNpYmxlID0gdGhpcy5jaGVja05leHRJY29uKClcclxuICAgIH0sXHJcbiAgICBjaGVja1ByZXZJY29uICgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsT2Zmc2V0ID4gMFxyXG4gICAgfSxcclxuICAgIGNoZWNrTmV4dEljb24gKCkge1xyXG4gICAgICAvLyBDaGVjayBvbmUgc2Nyb2xsIGFoZWFkIHRvIGtub3cgdGhlIHdpZHRoIG9mIHJpZ2h0LW1vc3QgaXRlbVxyXG4gICAgICByZXR1cm4gdGhpcy53aWR0aHMuY29udGFpbmVyID4gdGhpcy5zY3JvbGxPZmZzZXQgKyB0aGlzLndpZHRocy53cmFwcGVyXHJcbiAgICB9LFxyXG4gICAgY2FsbFNsaWRlciAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmhpZGVTbGlkZXIgfHwgIXRoaXMuYWN0aXZlVGFiKSByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIC8vIEdpdmUgc2NyZWVuIHRpbWUgdG8gcGFpbnRcclxuICAgICAgY29uc3QgYWN0aXZlVGFiID0gdGhpcy5hY3RpdmVUYWJcclxuXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICBpZiAoIWFjdGl2ZVRhYiB8fCAhYWN0aXZlVGFiLiRlbCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5zbGlkZXJXaWR0aCA9IGFjdGl2ZVRhYi4kZWwuc2Nyb2xsV2lkdGhcclxuICAgICAgICB0aGlzLnNsaWRlckxlZnQgPSBhY3RpdmVUYWIuJGVsLm9mZnNldExlZnRcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICAvLyBEbyBub3QgcHJvY2Vzc1xyXG4gICAgLy8gdW50aWwgRE9NIGlzXHJcbiAgICAvLyBwYWludGVkXHJcbiAgICBpbml0ICgpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snaW5wdXQnXSkge1xyXG4gICAgICAgIGRlcHJlY2F0ZSgnQGlucHV0JywgJ0BjaGFuZ2UnLCB0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIHYtbmF2aWdhdGlvbi1kcmF3ZXIgY2hhbmdlcyB0aGVcclxuICAgICAqIHdpZHRoIG9mIHRoZSBjb250YWluZXIsIGNhbGwgcmVzaXplXHJcbiAgICAgKiBhZnRlciB0aGUgdHJhbnNpdGlvbiBpcyBjb21wbGV0ZVxyXG4gICAgICovXHJcbiAgICBvblJlc2l6ZSAoKSB7XHJcbiAgICAgIGlmICh0aGlzLl9pc0Rlc3Ryb3llZCkgcmV0dXJuXHJcblxyXG4gICAgICB0aGlzLnNldFdpZHRocygpXHJcblxyXG4gICAgICBjb25zdCBkZWxheSA9IHRoaXMuaXNCb290ZWQgPyB0aGlzLnRyYW5zaXRpb25UaW1lIDogMFxyXG5cclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dClcclxuICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZVRhYnNWaWV3LCBkZWxheSlcclxuICAgIH0sXHJcbiAgICBvdmVyZmxvd0NoZWNrIChlLCBmbikge1xyXG4gICAgICB0aGlzLmlzT3ZlcmZsb3dpbmcgJiYgZm4oZSlcclxuICAgIH0sXHJcbiAgICBzY3JvbGxUbyAoZGlyZWN0aW9uKSB7XHJcbiAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0ID0gdGhpcy5uZXdPZmZzZXQoZGlyZWN0aW9uKVxyXG4gICAgfSxcclxuICAgIHNldE92ZXJmbG93ICgpIHtcclxuICAgICAgdGhpcy5pc092ZXJmbG93aW5nID0gdGhpcy53aWR0aHMuYmFyIDwgdGhpcy53aWR0aHMuY29udGFpbmVyXHJcbiAgICB9LFxyXG4gICAgc2V0V2lkdGhzICgpIHtcclxuICAgICAgY29uc3QgYmFyID0gdGhpcy4kcmVmcy5iYXIgPyB0aGlzLiRyZWZzLmJhci5jbGllbnRXaWR0aCA6IDBcclxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy4kcmVmcy5jb250YWluZXIgPyB0aGlzLiRyZWZzLmNvbnRhaW5lci5jbGllbnRXaWR0aCA6IDBcclxuICAgICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuJHJlZnMud3JhcHBlciA/IHRoaXMuJHJlZnMud3JhcHBlci5jbGllbnRXaWR0aCA6IDBcclxuXHJcbiAgICAgIHRoaXMud2lkdGhzID0geyBiYXIsIGNvbnRhaW5lciwgd3JhcHBlciB9XHJcblxyXG4gICAgICB0aGlzLnNldE92ZXJmbG93KClcclxuICAgIH0sXHJcbiAgICBwYXJzZU5vZGVzICgpIHtcclxuICAgICAgY29uc3QgaXRlbSA9IFtdXHJcbiAgICAgIGNvbnN0IGl0ZW1zID0gW11cclxuICAgICAgY29uc3Qgc2xpZGVyID0gW11cclxuICAgICAgY29uc3QgdGFiID0gW11cclxuICAgICAgY29uc3QgbGVuZ3RoID0gKHRoaXMuJHNsb3RzLmRlZmF1bHQgfHwgW10pLmxlbmd0aFxyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHZub2RlID0gdGhpcy4kc2xvdHMuZGVmYXVsdFtpXVxyXG5cclxuICAgICAgICBpZiAodm5vZGUuY29tcG9uZW50T3B0aW9ucykge1xyXG4gICAgICAgICAgc3dpdGNoICh2bm9kZS5jb21wb25lbnRPcHRpb25zLkN0b3Iub3B0aW9ucy5uYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3YtdGFicy1zbGlkZXInOiBzbGlkZXIucHVzaCh2bm9kZSlcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlICd2LXRhYnMtaXRlbXMnOiBpdGVtcy5wdXNoKHZub2RlKVxyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgJ3YtdGFiLWl0ZW0nOiBpdGVtLnB1c2godm5vZGUpXHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgLy8gY2FzZSAndi10YWInIC0gaW50ZW50aW9uYWxseSBvbWl0dGVkXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRhYi5wdXNoKHZub2RlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0YWIucHVzaCh2bm9kZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7IHRhYiwgc2xpZGVyLCBpdGVtcywgaXRlbSB9XHJcbiAgICB9LFxyXG4gICAgcmVnaXN0ZXJJdGVtcyAoZm4pIHtcclxuICAgICAgdGhpcy50YWJJdGVtcyA9IGZuXHJcbiAgICAgIGZuKHRoaXMuaW50ZXJuYWxWYWx1ZSlcclxuICAgIH0sXHJcbiAgICB1bnJlZ2lzdGVySXRlbXMgKCkge1xyXG4gICAgICB0aGlzLnRhYkl0ZW1zID0gbnVsbFxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVRhYnNWaWV3ICgpIHtcclxuICAgICAgdGhpcy5jYWxsU2xpZGVyKClcclxuICAgICAgdGhpcy5zY3JvbGxJbnRvVmlldygpXHJcbiAgICAgIHRoaXMuY2hlY2tJY29ucygpXHJcbiAgICB9LFxyXG4gICAgc2Nyb2xsSW50b1ZpZXcgKCkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG4gICAgICBpZiAoIXRoaXMuYWN0aXZlVGFiKSByZXR1cm5cclxuICAgICAgaWYgKCF0aGlzLmlzT3ZlcmZsb3dpbmcpIHJldHVybiAodGhpcy5zY3JvbGxPZmZzZXQgPSAwKVxyXG5cclxuICAgICAgY29uc3QgdG90YWxXaWR0aCA9IHRoaXMud2lkdGhzLndyYXBwZXIgKyB0aGlzLnNjcm9sbE9mZnNldFxyXG4gICAgICBjb25zdCB7IGNsaWVudFdpZHRoLCBvZmZzZXRMZWZ0IH0gPSB0aGlzLmFjdGl2ZVRhYi4kZWxcclxuICAgICAgY29uc3QgaXRlbU9mZnNldCA9IGNsaWVudFdpZHRoICsgb2Zmc2V0TGVmdFxyXG4gICAgICBsZXQgYWRkaXRpb25hbE9mZnNldCA9IGNsaWVudFdpZHRoICogMC4zXHJcblxyXG4gICAgICBpZiAodGhpcy5hY3RpdmVUYWIgPT09IHRoaXMuaXRlbXNbdGhpcy5pdGVtcy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgIGFkZGl0aW9uYWxPZmZzZXQgPSAwIC8vIGRvbid0IGFkZCBhbiBvZmZzZXQgaWYgc2VsZWN0aW5nIHRoZSBsYXN0IHRhYlxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICBpZiAob2Zmc2V0TGVmdCA8IHRoaXMuc2Nyb2xsT2Zmc2V0KSB7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxPZmZzZXQgPSBNYXRoLm1heChvZmZzZXRMZWZ0IC0gYWRkaXRpb25hbE9mZnNldCwgMClcclxuICAgICAgfSBlbHNlIGlmICh0b3RhbFdpZHRoIDwgaXRlbU9mZnNldCkge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsT2Zmc2V0IC09IHRvdGFsV2lkdGggLSBpdGVtT2Zmc2V0IC0gYWRkaXRpb25hbE9mZnNldFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdGFiUHJveHkgKHZhbCkge1xyXG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB2YWxcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpIHtcclxuICAgIGNvbnN0IHsgdGFiLCBzbGlkZXIsIGl0ZW1zLCBpdGVtIH0gPSB0aGlzLnBhcnNlTm9kZXMoKVxyXG5cclxuICAgIHJldHVybiBoKCdkaXYnLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi10YWJzJyxcclxuICAgICAgZGlyZWN0aXZlczogW3tcclxuICAgICAgICBuYW1lOiAncmVzaXplJyxcclxuICAgICAgICBtb2RpZmllcnM6IHsgcXVpZXQ6IHRydWUgfSxcclxuICAgICAgICB2YWx1ZTogdGhpcy5vblJlc2l6ZVxyXG4gICAgICB9XVxyXG4gICAgfSwgW1xyXG4gICAgICB0aGlzLmdlbkJhcihbdGhpcy5oaWRlU2xpZGVyID8gbnVsbCA6IHRoaXMuZ2VuU2xpZGVyKHNsaWRlciksIHRhYl0pLFxyXG4gICAgICBoKFRoZW1lUHJvdmlkZXIsIHtcclxuICAgICAgICBwcm9wczogeyBkYXJrOiB0aGlzLnRoZW1lLmlzRGFyaywgbGlnaHQ6ICF0aGlzLnRoZW1lLmlzRGFyayB9XHJcbiAgICAgIH0sIFtcclxuICAgICAgICB0aGlzLmdlbkl0ZW1zKGl0ZW1zLCBpdGVtKVxyXG4gICAgICBdKVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==