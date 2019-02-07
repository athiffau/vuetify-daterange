import { keys } from '../util/helpers';
const handleGesture = (wrapper) => {
    const { touchstartX, touchendX, touchstartY, touchendY } = wrapper;
    const dirRatio = 0.5;
    const minDistance = 16;
    wrapper.offsetX = touchendX - touchstartX;
    wrapper.offsetY = touchendY - touchstartY;
    if (Math.abs(wrapper.offsetY) < dirRatio * Math.abs(wrapper.offsetX)) {
        wrapper.left && (touchendX < touchstartX - minDistance) && wrapper.left(wrapper);
        wrapper.right && (touchendX > touchstartX + minDistance) && wrapper.right(wrapper);
    }
    if (Math.abs(wrapper.offsetX) < dirRatio * Math.abs(wrapper.offsetY)) {
        wrapper.up && (touchendY < touchstartY - minDistance) && wrapper.up(wrapper);
        wrapper.down && (touchendY > touchstartY + minDistance) && wrapper.down(wrapper);
    }
};
function touchstart(event, wrapper) {
    const touch = event.changedTouches[0];
    wrapper.touchstartX = touch.clientX;
    wrapper.touchstartY = touch.clientY;
    wrapper.start &&
        wrapper.start(Object.assign(event, wrapper));
}
function touchend(event, wrapper) {
    const touch = event.changedTouches[0];
    wrapper.touchendX = touch.clientX;
    wrapper.touchendY = touch.clientY;
    wrapper.end &&
        wrapper.end(Object.assign(event, wrapper));
    handleGesture(wrapper);
}
function touchmove(event, wrapper) {
    const touch = event.changedTouches[0];
    wrapper.touchmoveX = touch.clientX;
    wrapper.touchmoveY = touch.clientY;
    wrapper.move && wrapper.move(Object.assign(event, wrapper));
}
function createHandlers(value) {
    const wrapper = {
        touchstartX: 0,
        touchstartY: 0,
        touchendX: 0,
        touchendY: 0,
        touchmoveX: 0,
        touchmoveY: 0,
        offsetX: 0,
        offsetY: 0,
        left: value.left,
        right: value.right,
        up: value.up,
        down: value.down,
        start: value.start,
        move: value.move,
        end: value.end
    };
    return {
        touchstart: (e) => touchstart(e, wrapper),
        touchend: (e) => touchend(e, wrapper),
        touchmove: (e) => touchmove(e, wrapper)
    };
}
function inserted(el, binding, vnode) {
    const value = binding.value;
    const target = value.parent ? el.parentElement : el;
    const options = value.options || { passive: true };
    // Needed to pass unit tests
    if (!target)
        return;
    const handlers = createHandlers(binding.value);
    target._touchHandlers = Object(target._touchHandlers);
    target._touchHandlers[vnode.context._uid] = handlers;
    keys(handlers).forEach(eventName => {
        target.addEventListener(eventName, handlers[eventName], options);
    });
}
function unbind(el, binding, vnode) {
    const target = binding.value.parent ? el.parentElement : el;
    if (!target || !target._touchHandlers)
        return;
    const handlers = target._touchHandlers[vnode.context._uid];
    keys(handlers).forEach(eventName => {
        target.removeEventListener(eventName, handlers[eventName]);
    });
    delete target._touchHandlers[vnode.context._uid];
}
export default {
    inserted,
    unbind
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG91Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGlyZWN0aXZlcy90b3VjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFvQ3RDLE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBcUIsRUFBRSxFQUFFO0lBQzlDLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUE7SUFDbEUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFBO0lBQ3BCLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQTtJQUN0QixPQUFPLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxXQUFXLENBQUE7SUFDekMsT0FBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsV0FBVyxDQUFBO0lBRXpDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BFLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxHQUFHLFdBQVcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDaEYsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLEdBQUcsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNuRjtJQUVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3BFLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxH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UUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuRCxDQUFDO0FBRUQsZUFBZTtJQUNiLFFBQVE7SUFDUixNQUFNO0NBQ1AsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZOb2RlRGlyZWN0aXZlLCBWTm9kZSB9IGZyb20gJ3Z1ZS90eXBlcy92bm9kZSdcclxuaW1wb3J0IHsga2V5cyB9IGZyb20gJy4uL3V0aWwvaGVscGVycydcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG91Y2hTdG9yZWRIYW5kbGVycyB7XHJcbiAgdG91Y2hzdGFydDogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWRcclxuICB0b3VjaGVuZDogKGU6IFRvdWNoRXZlbnQpID0+IHZvaWRcclxuICB0b3VjaG1vdmU6IChlOiBUb3VjaEV2ZW50KSA9PiB2b2lkXHJcbn1cclxuXHJcbmludGVyZmFjZSBUb3VjaEhhbmRsZXJzIHtcclxuICBzdGFydD86ICh3cmFwcGVyRXZlbnQ6IFRvdWNoRXZlbnQgJiBUb3VjaFdyYXBwZXIpID0+IHZvaWRcclxuICBlbmQ/OiAod3JhcHBlckV2ZW50OiBUb3VjaEV2ZW50ICYgVG91Y2hXcmFwcGVyKSA9PiB2b2lkXHJcbiAgbW92ZT86ICh3cmFwcGVyRXZlbnQ6IFRvdWNoRXZlbnQgJiBUb3VjaFdyYXBwZXIpID0+IHZvaWRcclxuICBsZWZ0PzogKHdyYXBwZXI6IFRvdWNoV3JhcHBlcikgPT4gdm9pZFxyXG4gIHJpZ2h0PzogKHdyYXBwZXI6IFRvdWNoV3JhcHBlcikgPT4gdm9pZFxyXG4gIHVwPzogKHdyYXBwZXI6IFRvdWNoV3JhcHBlcikgPT4gdm9pZFxyXG4gIGRvd24/OiAod3JhcHBlcjogVG91Y2hXcmFwcGVyKSA9PiB2b2lkXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVG91Y2hXcmFwcGVyIGV4dGVuZHMgVG91Y2hIYW5kbGVycyB7XHJcbiAgdG91Y2hzdGFydFg6IG51bWJlclxyXG4gIHRvdWNoc3RhcnRZOiBudW1iZXJcclxuICB0b3VjaG1vdmVYOiBudW1iZXJcclxuICB0b3VjaG1vdmVZOiBudW1iZXJcclxuICB0b3VjaGVuZFg6IG51bWJlclxyXG4gIHRvdWNoZW5kWTogbnVtYmVyXHJcbiAgb2Zmc2V0WDogbnVtYmVyXHJcbiAgb2Zmc2V0WTogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBUb3VjaFZOb2RlRGlyZWN0aXZlIGV4dGVuZHMgVk5vZGVEaXJlY3RpdmUge1xyXG4gIHZhbHVlPzogVG91Y2hIYW5kbGVycyAmIHtcclxuICAgIHBhcmVudD86IGJvb2xlYW5cclxuICAgIG9wdGlvbnM/OiBBZGRFdmVudExpc3RlbmVyT3B0aW9uc1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgaGFuZGxlR2VzdHVyZSA9ICh3cmFwcGVyOiBUb3VjaFdyYXBwZXIpID0+IHtcclxuICBjb25zdCB7IHRvdWNoc3RhcnRYLCB0b3VjaGVuZFgsIHRvdWNoc3RhcnRZLCB0b3VjaGVuZFkgfSA9IHdyYXBwZXJcclxuICBjb25zdCBkaXJSYXRpbyA9IDAuNVxyXG4gIGNvbnN0IG1pbkRpc3RhbmNlID0gMTZcclxuICB3cmFwcGVyLm9mZnNldFggPSB0b3VjaGVuZFggLSB0b3VjaHN0YXJ0WFxyXG4gIHdyYXBwZXIub2Zmc2V0WSA9IHRvdWNoZW5kWSAtIHRvdWNoc3RhcnRZXHJcblxyXG4gIGlmIChNYXRoLmFicyh3cmFwcGVyLm9mZnNldFkpIDwgZGlyUmF0aW8gKiBNYXRoLmFicyh3cmFwcGVyLm9mZnNldFgpKSB7XHJcbiAgICB3cmFwcGVyLmxlZnQgJiYgKHRvdWNoZW5kWCA8IHRvdWNoc3RhcnRYIC0gbWluRGlzdGFuY2UpICYmIHdyYXBwZXIubGVmdCh3cmFwcGVyKVxyXG4gICAgd3JhcHBlci5yaWdodCAmJiAodG91Y2hlbmRYID4gdG91Y2hzdGFydFggKyBtaW5EaXN0YW5jZSkgJiYgd3JhcHBlci5yaWdodCh3cmFwcGVyKVxyXG4gIH1cclxuXHJcbiAgaWYgKE1hdGguYWJzKHdyYXBwZXIub2Zmc2V0WCkgPCBkaXJSYXRpbyAqIE1hdGguYWJzKHdyYXBwZXIub2Zmc2V0WSkpIHtcclxuICAgIHdyYXBwZXIudXAgJiYgKHRvdWNoZW5kWSA8IHRvdWNoc3RhcnRZIC0gbWluRGlzdGFuY2UpICYmIHdyYXBwZXIudXAod3JhcHBlcilcclxuICAgIHdyYXBwZXIuZG93biAmJiAodG91Y2hlbmRZID4gdG91Y2hzdGFydFkgKyBtaW5EaXN0YW5jZSkgJiYgd3JhcHBlci5kb3duKHdyYXBwZXIpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b3VjaHN0YXJ0IChldmVudDogVG91Y2hFdmVudCwgd3JhcHBlcjogVG91Y2hXcmFwcGVyKSB7XHJcbiAgY29uc3QgdG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXVxyXG4gIHdyYXBwZXIudG91Y2hzdGFydFggPSB0b3VjaC5jbGllbnRYXHJcbiAgd3JhcHBlci50b3VjaHN0YXJ0WSA9IHRvdWNoLmNsaWVudFlcclxuXHJcbiAgd3JhcHBlci5zdGFydCAmJlxyXG4gICAgd3JhcHBlci5zdGFydChPYmplY3QuYXNzaWduKGV2ZW50LCB3cmFwcGVyKSlcclxufVxyXG5cclxuZnVuY3Rpb24gdG91Y2hlbmQgKGV2ZW50OiBUb3VjaEV2ZW50LCB3cmFwcGVyOiBUb3VjaFdyYXBwZXIpIHtcclxuICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgd3JhcHBlci50b3VjaGVuZFggPSB0b3VjaC5jbGllbnRYXHJcbiAgd3JhcHBlci50b3VjaGVuZFkgPSB0b3VjaC5jbGllbnRZXHJcblxyXG4gIHdyYXBwZXIuZW5kICYmXHJcbiAgICB3cmFwcGVyLmVuZChPYmplY3QuYXNzaWduKGV2ZW50LCB3cmFwcGVyKSlcclxuXHJcbiAgaGFuZGxlR2VzdHVyZSh3cmFwcGVyKVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b3VjaG1vdmUgKGV2ZW50OiBUb3VjaEV2ZW50LCB3cmFwcGVyOiBUb3VjaFdyYXBwZXIpIHtcclxuICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgd3JhcHBlci50b3VjaG1vdmVYID0gdG91Y2guY2xpZW50WFxyXG4gIHdyYXBwZXIudG91Y2htb3ZlWSA9IHRvdWNoLmNsaWVudFlcclxuXHJcbiAgd3JhcHBlci5tb3ZlICYmIHdyYXBwZXIubW92ZShPYmplY3QuYXNzaWduKGV2ZW50LCB3cmFwcGVyKSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlSGFuZGxlcnMgKHZhbHVlOiBUb3VjaEhhbmRsZXJzKTogVG91Y2hTdG9yZWRIYW5kbGVycyB7XHJcbiAgY29uc3Qgd3JhcHBlciA9IHtcclxuICAgIHRvdWNoc3RhcnRYOiAwLFxyXG4gICAgdG91Y2hzdGFydFk6IDAsXHJcbiAgICB0b3VjaGVuZFg6IDAsXHJcbiAgICB0b3VjaGVuZFk6IDAsXHJcbiAgICB0b3VjaG1vdmVYOiAwLFxyXG4gICAgdG91Y2htb3ZlWTogMCxcclxuICAgIG9mZnNldFg6IDAsXHJcbiAgICBvZmZzZXRZOiAwLFxyXG4gICAgbGVmdDogdmFsdWUubGVmdCxcclxuICAgIHJpZ2h0OiB2YWx1ZS5yaWdodCxcclxuICAgIHVwOiB2YWx1ZS51cCxcclxuICAgIGRvd246IHZhbHVlLmRvd24sXHJcbiAgICBzdGFydDogdmFsdWUuc3RhcnQsXHJcbiAgICBtb3ZlOiB2YWx1ZS5tb3ZlLFxyXG4gICAgZW5kOiB2YWx1ZS5lbmRcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB0b3VjaHN0YXJ0OiAoZTogVG91Y2hFdmVudCkgPT4gdG91Y2hzdGFydChlLCB3cmFwcGVyKSxcclxuICAgIHRvdWNoZW5kOiAoZTogVG91Y2hFdmVudCkgPT4gdG91Y2hlbmQoZSwgd3JhcHBlciksXHJcbiAgICB0b3VjaG1vdmU6IChlOiBUb3VjaEV2ZW50KSA9PiB0b3VjaG1vdmUoZSwgd3JhcHBlcilcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc2VydGVkIChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IFRvdWNoVk5vZGVEaXJlY3RpdmUsIHZub2RlOiBWTm9kZSkge1xyXG4gIGNvbnN0IHZhbHVlID0gYmluZGluZy52YWx1ZSFcclxuICBjb25zdCB0YXJnZXQgPSB2YWx1ZS5wYXJlbnQgPyBlbC5wYXJlbnRFbGVtZW50IDogZWxcclxuICBjb25zdCBvcHRpb25zID0gdmFsdWUub3B0aW9ucyB8fCB7IHBhc3NpdmU6IHRydWUgfVxyXG5cclxuICAvLyBOZWVkZWQgdG8gcGFzcyB1bml0IHRlc3RzXHJcbiAgaWYgKCF0YXJnZXQpIHJldHVyblxyXG5cclxuICBjb25zdCBoYW5kbGVycyA9IGNyZWF0ZUhhbmRsZXJzKGJpbmRpbmcudmFsdWUhKVxyXG4gIHRhcmdldC5fdG91Y2hIYW5kbGVycyA9IE9iamVjdCh0YXJnZXQuX3RvdWNoSGFuZGxlcnMpXHJcbiAgdGFyZ2V0Ll90b3VjaEhhbmRsZXJzIVt2bm9kZS5jb250ZXh0IS5fdWlkXSA9IGhhbmRsZXJzXHJcblxyXG4gIGtleXMoaGFuZGxlcnMpLmZvckVhY2goZXZlbnROYW1lID0+IHtcclxuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcnNbZXZlbnROYW1lXSBhcyBFdmVudExpc3RlbmVyLCBvcHRpb25zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVuYmluZCAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBUb3VjaFZOb2RlRGlyZWN0aXZlLCB2bm9kZTogVk5vZGUpIHtcclxuICBjb25zdCB0YXJnZXQgPSBiaW5kaW5nLnZhbHVlIS5wYXJlbnQgPyBlbC5wYXJlbnRFbGVtZW50IDogZWxcclxuICBpZiAoIXRhcmdldCB8fCAhdGFyZ2V0Ll90b3VjaEhhbmRsZXJzKSByZXR1cm5cclxuXHJcbiAgY29uc3QgaGFuZGxlcnMgPSB0YXJnZXQuX3RvdWNoSGFuZGxlcnNbdm5vZGUuY29udGV4dCEuX3VpZF1cclxuICBrZXlzKGhhbmRsZXJzKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XHJcbiAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXJzW2V2ZW50TmFtZV0pXHJcbiAgfSlcclxuICBkZWxldGUgdGFyZ2V0Ll90b3VjaEhhbmRsZXJzW3Zub2RlLmNvbnRleHQhLl91aWRdXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBpbnNlcnRlZCxcclxuICB1bmJpbmRcclxufVxyXG4iXX0=