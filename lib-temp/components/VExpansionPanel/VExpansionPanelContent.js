import { VExpandTransition } from '../transitions';
import Bootable from '../../mixins/bootable';
import Toggleable from '../../mixins/toggleable';
import Rippleable from '../../mixins/rippleable';
import { inject as RegistrableInject } from '../../mixins/registrable';
import VIcon from '../VIcon';
import mixins from '../../util/mixins';
import { consoleWarn } from '../../util/console';
export default mixins(Bootable, Toggleable, Rippleable, RegistrableInject('expansionPanel', 'v-expansion-panel-content', 'v-expansion-panel')
/* @vue/component */
).extend({
    name: 'v-expansion-panel-content',
    props: {
        disabled: Boolean,
        readonly: Boolean,
        expandIcon: {
            type: String,
            default: '$vuetify.icons.expand'
        },
        hideActions: Boolean,
        ripple: {
            type: [Boolean, Object],
            default: false
        }
    },
    data: () => ({
        height: 'auto'
    }),
    computed: {
        containerClasses() {
            return {
                'v-expansion-panel__container--active': this.isActive,
                'v-expansion-panel__container--disabled': this.isDisabled
            };
        },
        isDisabled() {
            return this.expansionPanel.disabled || this.disabled;
        },
        isReadonly() {
            return this.expansionPanel.readonly || this.readonly;
        }
    },
    beforeMount() {
        this.expansionPanel.register(this);
        // Can be removed once fully deprecated
        if (typeof this.value !== 'undefined')
            consoleWarn('v-model has been deprecated', this);
    },
    beforeDestroy() {
        this.expansionPanel.unregister(this);
    },
    methods: {
        onKeydown(e) {
            // Ensure element is the activeElement
            if (e.keyCode === 13 &&
                this.$el === document.activeElement)
                this.expansionPanel.panelClick(this._uid);
        },
        onHeaderClick() {
            this.isReadonly || this.expansionPanel.panelClick(this._uid);
        },
        genBody() {
            return this.$createElement('div', {
                ref: 'body',
                class: 'v-expansion-panel__body',
                directives: [{
                        name: 'show',
                        value: this.isActive
                    }]
            }, this.showLazyContent(this.$slots.default));
        },
        genHeader() {
            const children = [...(this.$slots.header || [])];
            if (!this.hideActions)
                children.push(this.genIcon());
            return this.$createElement('div', {
                staticClass: 'v-expansion-panel__header',
                directives: [{
                        name: 'ripple',
                        value: this.ripple
                    }],
                on: {
                    click: this.onHeaderClick
                }
            }, children);
        },
        genIcon() {
            const icon = this.$slots.actions ||
                [this.$createElement(VIcon, this.expandIcon)];
            return this.$createElement('transition', {
                attrs: { name: 'fade-transition' }
            }, [
                this.$createElement('div', {
                    staticClass: 'v-expansion-panel__header__icon',
                    directives: [{
                            name: 'show',
                            value: !this.isDisabled
                        }]
                }, icon)
            ]);
        },
        toggle(active) {
            if (active)
                this.isBooted = true;
            this.$nextTick(() => (this.isActive = active));
        }
    },
    render(h) {
        return h('li', {
            staticClass: 'v-expansion-panel__container',
            class: this.containerClasses,
            attrs: {
                tabindex: this.isReadonly || this.isDisabled ? null : 0,
                'aria-expanded': Boolean(this.isActive)
            },
            on: {
                keydown: this.onKeydown
            }
        }, [
            this.$slots.header && this.genHeader(),
            h(VExpandTransition, [this.genBody()])
        ]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkV4cGFuc2lvblBhbmVsQ29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZFeHBhbnNpb25QYW5lbC9WRXhwYW5zaW9uUGFuZWxDb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFBO0FBRWxELE9BQU8sUUFBUSxNQUFNLHVCQUF1QixDQUFBO0FBQzVDLE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sVUFBVSxNQUFNLHlCQUF5QixDQUFBO0FBQ2hELE9BQU8sRUFBZSxNQUFNLElBQUksaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQTtBQUVuRixPQUFPLEtBQUssTUFBTSxVQUFVLENBQUE7QUFHNUIsT0FBTyxNQUFzQixNQUFNLG1CQUFtQixDQUFBO0FBR3RELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQVFoRCxlQUFlLE1BQU0sQ0FVbkIsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLENBQUM7QUFDckYsb0JBQW9CO0NBQ3JCLENBQUMsTUFBTSxDQUFDO0lBQ1AsSUFBSSxFQUFFLDJCQUEyQjtJQUVqQyxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsT0FBTztRQUNqQixRQUFRLEVBQUUsT0FBTztRQUNqQixVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLE9BQU8sRUFBRSx1QkFBdUI7U0FDakM7UUFDRCxXQUFXLEVBQUUsT0FBTztRQUNwQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLO1NBQ2Y7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsTUFB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ekIsV0FBVyxFQUFFLGlDQUFpQztvQkFDOUMsVUFBVSxFQUFFLENBQUM7NEJBQ1gsSUFBSSxFQUFFLE1BQU07NEJBQ1osS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVU7eUJBQ3hCLENBQUM7aUJBQ0gsRUFBRSxJQUFJLENBQUM7YUFDVCxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsTUFBTSxDQUFFLE1BQWU7WUFDckIsSUFBSSxNQUFNO2dCQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1lBRWhDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFDaEQsQ0FBQztLQUNGO0lBRUQsTUFBTSxDQUFFLENBQUM7UUFDUCxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUU7WUFDYixXQUFXLEVBQUUsOEJBQThCO1lBQzNDLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQzVCLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELGVBQWUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUN4QztZQUNELEVBQUUsRUFBRTtnQkFDRixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVM7YUFDeEI7U0FDRixFQUFFO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN2QyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVkV4cGFuZFRyYW5zaXRpb24gfSBmcm9tICcuLi90cmFuc2l0aW9ucydcclxuXHJcbmltcG9ydCBCb290YWJsZSBmcm9tICcuLi8uLi9taXhpbnMvYm9vdGFibGUnXHJcbmltcG9ydCBUb2dnbGVhYmxlIGZyb20gJy4uLy4uL21peGlucy90b2dnbGVhYmxlJ1xyXG5pbXBvcnQgUmlwcGxlYWJsZSBmcm9tICcuLi8uLi9taXhpbnMvcmlwcGxlYWJsZSdcclxuaW1wb3J0IHsgUmVnaXN0cmFibGUsIGluamVjdCBhcyBSZWdpc3RyYWJsZUluamVjdCB9IGZyb20gJy4uLy4uL21peGlucy9yZWdpc3RyYWJsZSdcclxuXHJcbmltcG9ydCBWSWNvbiBmcm9tICcuLi9WSWNvbidcclxuaW1wb3J0IFZFeHBhbnNpb25QYW5lbCBmcm9tICcuL1ZFeHBhbnNpb25QYW5lbCdcclxuXHJcbmltcG9ydCBtaXhpbnMsIHsgRXh0cmFjdFZ1ZSB9IGZyb20gJy4uLy4uL3V0aWwvbWl4aW5zJ1xyXG5pbXBvcnQgVnVlLCB7IFZOb2RlIH0gZnJvbSAndnVlJ1xyXG5cclxuaW1wb3J0IHsgY29uc29sZVdhcm4gfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXHJcblxyXG50eXBlIFZFeHBhbnNpb25QYW5lbEluc3RhbmNlID0gSW5zdGFuY2VUeXBlPHR5cGVvZiBWRXhwYW5zaW9uUGFuZWw+XHJcblxyXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIFZ1ZSB7XHJcbiAgZXhwYW5zaW9uUGFuZWw6IFZFeHBhbnNpb25QYW5lbEluc3RhbmNlXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zICZcclxuLyogZXNsaW50LWRpc2FibGUgaW5kZW50ICovXHJcbiAgRXh0cmFjdFZ1ZTxbXHJcbiAgICB0eXBlb2YgQm9vdGFibGUsXHJcbiAgICB0eXBlb2YgVG9nZ2xlYWJsZSxcclxuICAgIHR5cGVvZiBSaXBwbGVhYmxlLFxyXG4gICAgUmVnaXN0cmFibGU8J2V4cGFuc2lvblBhbmVsJz5cclxuICBdPlxyXG4vKiBlc2xpbnQtZW5hYmxlIGluZGVudCAqL1xyXG4+KFxyXG4gIEJvb3RhYmxlLFxyXG4gIFRvZ2dsZWFibGUsXHJcbiAgUmlwcGxlYWJsZSxcclxuICBSZWdpc3RyYWJsZUluamVjdCgnZXhwYW5zaW9uUGFuZWwnLCAndi1leHBhbnNpb24tcGFuZWwtY29udGVudCcsICd2LWV4cGFuc2lvbi1wYW5lbCcpXHJcbiAgLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuKS5leHRlbmQoe1xyXG4gIG5hbWU6ICd2LWV4cGFuc2lvbi1wYW5lbC1jb250ZW50JyxcclxuXHJcbiAgcHJvcHM6IHtcclxuICAgIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gICAgcmVhZG9ubHk6IEJvb2xlYW4sXHJcbiAgICBleHBhbmRJY29uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJyR2dWV0aWZ5Lmljb25zLmV4cGFuZCdcclxuICAgIH0sXHJcbiAgICBoaWRlQWN0aW9uczogQm9vbGVhbixcclxuICAgIHJpcHBsZToge1xyXG4gICAgICB0eXBlOiBbQm9vbGVhbiwgT2JqZWN0XSxcclxuICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgaGVpZ2h0OiAnYXV0bydcclxuICB9KSxcclxuXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGNvbnRhaW5lckNsYXNzZXMgKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVsX19jb250YWluZXItLWFjdGl2ZSc6IHRoaXMuaXNBY3RpdmUsXHJcbiAgICAgICAgJ3YtZXhwYW5zaW9uLXBhbmVsX19jb250YWluZXItLWRpc2FibGVkJzogdGhpcy5pc0Rpc2FibGVkXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0Rpc2FibGVkICgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uUGFuZWwuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlZFxyXG4gICAgfSxcclxuICAgIGlzUmVhZG9ubHkgKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5leHBhbnNpb25QYW5lbC5yZWFkb25seSB8fCB0aGlzLnJlYWRvbmx5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlTW91bnQgKCkge1xyXG4gICAgdGhpcy5leHBhbnNpb25QYW5lbC5yZWdpc3Rlcih0aGlzKVxyXG5cclxuICAgIC8vIENhbiBiZSByZW1vdmVkIG9uY2UgZnVsbHkgZGVwcmVjYXRlZFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlICE9PSAndW5kZWZpbmVkJykgY29uc29sZVdhcm4oJ3YtbW9kZWwgaGFzIGJlZW4gZGVwcmVjYXRlZCcsIHRoaXMpXHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICB0aGlzLmV4cGFuc2lvblBhbmVsLnVucmVnaXN0ZXIodGhpcylcclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBvbktleWRvd24gKGU6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgLy8gRW5zdXJlIGVsZW1lbnQgaXMgdGhlIGFjdGl2ZUVsZW1lbnRcclxuICAgICAgaWYgKFxyXG4gICAgICAgIGUua2V5Q29kZSA9PT0gMTMgJiZcclxuICAgICAgICB0aGlzLiRlbCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxyXG4gICAgICApIHRoaXMuZXhwYW5zaW9uUGFuZWwucGFuZWxDbGljayh0aGlzLl91aWQpXHJcbiAgICB9LFxyXG4gICAgb25IZWFkZXJDbGljayAoKSB7XHJcbiAgICAgIHRoaXMuaXNSZWFkb25seSB8fCB0aGlzLmV4cGFuc2lvblBhbmVsLnBhbmVsQ2xpY2sodGhpcy5fdWlkKVxyXG4gICAgfSxcclxuICAgIGdlbkJvZHkgKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy4kY3JlYXRlRWxlbWVudCgnZGl2Jywge1xyXG4gICAgICAgIHJlZjogJ2JvZHknLFxyXG4gICAgICAgIGNsYXNzOiAndi1leHBhbnNpb24tcGFuZWxfX2JvZHknLFxyXG4gICAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgICBuYW1lOiAnc2hvdycsXHJcbiAgICAgICAgICB2YWx1ZTogdGhpcy5pc0FjdGl2ZVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH0sIHRoaXMuc2hvd0xhenlDb250ZW50KHRoaXMuJHNsb3RzLmRlZmF1bHQpKVxyXG4gICAgfSxcclxuICAgIGdlbkhlYWRlciAoKSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gWy4uLih0aGlzLiRzbG90cy5oZWFkZXIgfHwgW10pXVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmhpZGVBY3Rpb25zKSBjaGlsZHJlbi5wdXNoKHRoaXMuZ2VuSWNvbigpKVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICBzdGF0aWNDbGFzczogJ3YtZXhwYW5zaW9uLXBhbmVsX19oZWFkZXInLFxyXG4gICAgICAgIGRpcmVjdGl2ZXM6IFt7XHJcbiAgICAgICAgICBuYW1lOiAncmlwcGxlJyxcclxuICAgICAgICAgIHZhbHVlOiB0aGlzLnJpcHBsZVxyXG4gICAgICAgIH1dLFxyXG4gICAgICAgIG9uOiB7XHJcbiAgICAgICAgICBjbGljazogdGhpcy5vbkhlYWRlckNsaWNrXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCBjaGlsZHJlbilcclxuICAgIH0sXHJcbiAgICBnZW5JY29uICgpIHtcclxuICAgICAgY29uc3QgaWNvbiA9IHRoaXMuJHNsb3RzLmFjdGlvbnMgfHxcclxuICAgICAgICBbdGhpcy4kY3JlYXRlRWxlbWVudChWSWNvbiwgdGhpcy5leHBhbmRJY29uKV1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLiRjcmVhdGVFbGVtZW50KCd0cmFuc2l0aW9uJywge1xyXG4gICAgICAgIGF0dHJzOiB7IG5hbWU6ICdmYWRlLXRyYW5zaXRpb24nIH1cclxuICAgICAgfSwgW1xyXG4gICAgICAgIHRoaXMuJGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcclxuICAgICAgICAgIHN0YXRpY0NsYXNzOiAndi1leHBhbnNpb24tcGFuZWxfX2hlYWRlcl9faWNvbicsXHJcbiAgICAgICAgICBkaXJlY3RpdmVzOiBbe1xyXG4gICAgICAgICAgICBuYW1lOiAnc2hvdycsXHJcbiAgICAgICAgICAgIHZhbHVlOiAhdGhpcy5pc0Rpc2FibGVkXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIH0sIGljb24pXHJcbiAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlIChhY3RpdmU6IGJvb2xlYW4pIHtcclxuICAgICAgaWYgKGFjdGl2ZSkgdGhpcy5pc0Jvb3RlZCA9IHRydWVcclxuXHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+ICh0aGlzLmlzQWN0aXZlID0gYWN0aXZlKSlcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW5kZXIgKGgpOiBWTm9kZSB7XHJcbiAgICByZXR1cm4gaCgnbGknLCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1leHBhbnNpb24tcGFuZWxfX2NvbnRhaW5lcicsXHJcbiAgICAgIGNsYXNzOiB0aGlzLmNvbnRhaW5lckNsYXNzZXMsXHJcbiAgICAgIGF0dHJzOiB7XHJcbiAgICAgICAgdGFiaW5kZXg6IHRoaXMuaXNSZWFkb25seSB8fCB0aGlzLmlzRGlzYWJsZWQgPyBudWxsIDogMCxcclxuICAgICAgICAnYXJpYS1leHBhbmRlZCc6IEJvb2xlYW4odGhpcy5pc0FjdGl2ZSlcclxuICAgICAgfSxcclxuICAgICAgb246IHtcclxuICAgICAgICBrZXlkb3duOiB0aGlzLm9uS2V5ZG93blxyXG4gICAgICB9XHJcbiAgICB9LCBbXHJcbiAgICAgIHRoaXMuJHNsb3RzLmhlYWRlciAmJiB0aGlzLmdlbkhlYWRlcigpLFxyXG4gICAgICBoKFZFeHBhbmRUcmFuc2l0aW9uLCBbdGhpcy5nZW5Cb2R5KCldKVxyXG4gICAgXSlcclxuICB9XHJcbn0pXHJcbiJdfQ==