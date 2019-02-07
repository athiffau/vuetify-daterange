import Bootable from './bootable';
import { consoleWarn } from '../util/console';
function validateAttachTarget(val) {
    const type = typeof val;
    if (type === 'boolean' || type === 'string')
        return true;
    return val.nodeType === Node.ELEMENT_NODE;
}
/* @vue/component */
export default {
    name: 'detachable',
    mixins: [Bootable],
    props: {
        attach: {
            type: null,
            default: false,
            validator: validateAttachTarget
        },
        contentClass: {
            default: ''
        }
    },
    data: () => ({
        hasDetached: false
    }),
    watch: {
        attach() {
            this.hasDetached = false;
            this.initDetach();
        },
        hasContent: 'initDetach'
    },
    beforeMount() {
        this.$nextTick(() => {
            if (this.activatorNode) {
                const activator = Array.isArray(this.activatorNode) ? this.activatorNode : [this.activatorNode];
                activator.forEach(node => {
                    node.elm && this.$el.parentNode.insertBefore(node.elm, this.$el);
                });
            }
        });
    },
    mounted() {
        !this.lazy && this.initDetach();
    },
    deactivated() {
        this.isActive = false;
    },
    beforeDestroy() {
        if (!this.$refs.content)
            return;
        // IE11 Fix
        try {
            this.$refs.content.parentNode.removeChild(this.$refs.content);
        }
        catch (e) {
            console.log(e);
        }
    },
    methods: {
        getScopeIdAttrs() {
            const scopeId = this.$vnode && this.$vnode.context.$options._scopeId;
            return scopeId && {
                [scopeId]: ''
            };
        },
        initDetach() {
            if (this._isDestroyed ||
                !this.$refs.content ||
                this.hasDetached ||
                // Leave menu in place if attached
                // and dev has not changed target
                this.attach === '' || // If used as a boolean prop (<v-menu attach>)
                this.attach === true || // If bound to a boolean (<v-menu :attach="true">)
                this.attach === 'attach' // If bound as boolean prop in pug (v-menu(attach))
            )
                return;
            let target;
            if (this.attach === false) {
                // Default, detach to app
                target = document.querySelector('[data-app]');
            }
            else if (typeof this.attach === 'string') {
                // CSS selector
                target = document.querySelector(this.attach);
            }
            else {
                // DOM Element
                target = this.attach;
            }
            if (!target) {
                consoleWarn(`Unable to locate target ${this.attach || '[data-app]'}`, this);
                return;
            }
            target.insertBefore(this.$refs.content, target.firstChild);
            this.hasDetached = true;
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWNoYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9taXhpbnMvZGV0YWNoYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLFFBQVEsTUFBTSxZQUFZLENBQUE7QUFDakMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFBO0FBRTdDLFNBQVMsb0JBQW9CLENBQUUsR0FBRztJQUNoQyxNQUFNLElBQUksR0FBRyxPQUFPLEdBQUcsQ0FBQTtJQUV2QixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLFFBQVE7UUFBRSxPQUFPLElBQUksQ0FBQTtJQUV4RCxPQUFPLEdBQUcsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQTtBQUMzQyxDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixJQUFJLEVBQUUsWUFBWTtJQUVsQixNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFFbEIsS0FBSyxFQUFFO1FBQ0wsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsS0FBSztZQUNkLFNBQVMsRUFBRSxvQkFBb0I7U0FDaEM7UUFDRCxZQUFZLEVBQUU7WUFDWixPQUFPLEVBQUUsRUFBRTtTQUNaO0tBQ0Y7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFdBQVcsRUFBRSxLQUFLO0tBQ25CLENBQUM7SUFFRixLQUFLLEVBQUU7UUFDTCxNQUFNO1lBQ0osSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7WUFDeEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ25CLENBQUM7UUFDRCxVQUFVLEVBQUUsWUFBWTtLQUN6QjtJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLE1BQU0sU0FBUyxHQUFHLEtBQUss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eyBjb25zb2xlV2FybiB9IGZyb20gJy4uL3V0aWwvY29uc29sZSdcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlQXR0YWNoVGFyZ2V0ICh2YWwpIHtcclxuICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbFxyXG5cclxuICBpZiAodHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGUgPT09ICdzdHJpbmcnKSByZXR1cm4gdHJ1ZVxyXG5cclxuICByZXR1cm4gdmFsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERVxyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgbmFtZTogJ2RldGFjaGFibGUnLFxyXG5cclxuICBtaXhpbnM6IFtCb290YWJsZV0sXHJcblxyXG4gIHByb3BzOiB7XHJcbiAgICBhdHRhY2g6IHtcclxuICAgICAgdHlwZTogbnVsbCxcclxuICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgIHZhbGlkYXRvcjogdmFsaWRhdGVBdHRhY2hUYXJnZXRcclxuICAgIH0sXHJcbiAgICBjb250ZW50Q2xhc3M6IHtcclxuICAgICAgZGVmYXVsdDogJydcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgaGFzRGV0YWNoZWQ6IGZhbHNlXHJcbiAgfSksXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBhdHRhY2ggKCkge1xyXG4gICAgICB0aGlzLmhhc0RldGFjaGVkID0gZmFsc2VcclxuICAgICAgdGhpcy5pbml0RGV0YWNoKClcclxuICAgIH0sXHJcbiAgICBoYXNDb250ZW50OiAnaW5pdERldGFjaCdcclxuICB9LFxyXG5cclxuICBiZWZvcmVNb3VudCAoKSB7XHJcbiAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmFjdGl2YXRvck5vZGUpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmF0b3IgPSBBcnJheS5pc0FycmF5KHRoaXMuYWN0aXZhdG9yTm9kZSkgPyB0aGlzLmFjdGl2YXRvck5vZGUgOiBbdGhpcy5hY3RpdmF0b3JOb2RlXVxyXG4gICAgICAgIGFjdGl2YXRvci5mb3JFYWNoKG5vZGUgPT4ge1xyXG4gICAgICAgICAgbm9kZS5lbG0gJiYgdGhpcy4kZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobm9kZS5lbG0sIHRoaXMuJGVsKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICAhdGhpcy5sYXp5ICYmIHRoaXMuaW5pdERldGFjaCgpXHJcbiAgfSxcclxuXHJcbiAgZGVhY3RpdmF0ZWQgKCkge1xyXG4gICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICBpZiAoIXRoaXMuJHJlZnMuY29udGVudCkgcmV0dXJuXHJcblxyXG4gICAgLy8gSUUxMSBGaXhcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMuJHJlZnMuY29udGVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuJHJlZnMuY29udGVudClcclxuICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS5sb2coZSkgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldFNjb3BlSWRBdHRycyAoKSB7XHJcbiAgICAgIGNvbnN0IHNjb3BlSWQgPSB0aGlzLiR2bm9kZSAmJiB0aGlzLiR2bm9kZS5jb250ZXh0LiRvcHRpb25zLl9zY29wZUlkXHJcbiAgICAgIHJldHVybiBzY29wZUlkICYmIHtcclxuICAgICAgICBbc2NvcGVJZF06ICcnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpbml0RGV0YWNoICgpIHtcclxuICAgICAgaWYgKHRoaXMuX2lzRGVzdHJveWVkIHx8XHJcbiAgICAgICAgIXRoaXMuJHJlZnMuY29udGVudCB8fFxyXG4gICAgICAgIHRoaXMuaGFzRGV0YWNoZWQgfHxcclxuICAgICAgICAvLyBMZWF2ZSBtZW51IGluIHBsYWNlIGlmIGF0dGFjaGVkXHJcbiAgICAgICAgLy8gYW5kIGRldiBoYXMgbm90IGNoYW5nZWQgdGFyZ2V0XHJcbiAgICAgICAgdGhpcy5hdHRhY2ggPT09ICcnIHx8IC8vIElmIHVzZWQgYXMgYSBib29sZWFuIHByb3AgKDx2LW1lbnUgYXR0YWNoPilcclxuICAgICAgICB0aGlzLmF0dGFjaCA9PT0gdHJ1ZSB8fCAvLyBJZiBib3VuZCB0byBhIGJvb2xlYW4gKDx2LW1lbnUgOmF0dGFjaD1cInRydWVcIj4pXHJcbiAgICAgICAgdGhpcy5hdHRhY2ggPT09ICdhdHRhY2gnIC8vIElmIGJvdW5kIGFzIGJvb2xlYW4gcHJvcCBpbiBwdWcgKHYtbWVudShhdHRhY2gpKVxyXG4gICAgICApIHJldHVyblxyXG5cclxuICAgICAgbGV0IHRhcmdldFxyXG4gICAgICBpZiAodGhpcy5hdHRhY2ggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgLy8gRGVmYXVsdCwgZGV0YWNoIHRvIGFwcFxyXG4gICAgICAgIHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwcF0nKVxyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmF0dGFjaCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAvLyBDU1Mgc2VsZWN0b3JcclxuICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuYXR0YWNoKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIERPTSBFbGVtZW50XHJcbiAgICAgICAgdGFyZ2V0ID0gdGhpcy5hdHRhY2hcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0YXJnZXQpIHtcclxuICAgICAgICBjb25zb2xlV2FybihgVW5hYmxlIHRvIGxvY2F0ZSB0YXJnZXQgJHt0aGlzLmF0dGFjaCB8fCAnW2RhdGEtYXBwXSd9YCwgdGhpcylcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdGFyZ2V0Lmluc2VydEJlZm9yZShcclxuICAgICAgICB0aGlzLiRyZWZzLmNvbnRlbnQsXHJcbiAgICAgICAgdGFyZ2V0LmZpcnN0Q2hpbGRcclxuICAgICAgKVxyXG5cclxuICAgICAgdGhpcy5oYXNEZXRhY2hlZCA9IHRydWVcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19