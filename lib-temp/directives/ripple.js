import { consoleWarn } from '../util/console';
function transform(el, value) {
    el.style['transform'] = value;
    el.style['webkitTransform'] = value;
}
function opacity(el, value) {
    el.style['opacity'] = value.toString();
}
function isTouchEvent(e) {
    return e.constructor.name === 'TouchEvent';
}
const calculate = (e, el, value = {}) => {
    const offset = el.getBoundingClientRect();
    const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
    const localX = target.clientX - offset.left;
    const localY = target.clientY - offset.top;
    let radius = 0;
    let scale = 0.3;
    if (el._ripple && el._ripple.circle) {
        scale = 0.15;
        radius = el.clientWidth / 2;
        radius = value.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
    }
    else {
        radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
    }
    const centerX = `${(el.clientWidth - (radius * 2)) / 2}px`;
    const centerY = `${(el.clientHeight - (radius * 2)) / 2}px`;
    const x = value.center ? centerX : `${localX - radius}px`;
    const y = value.center ? centerY : `${localY - radius}px`;
    return { radius, scale, x, y, centerX, centerY };
};
const ripple = {
    /* eslint-disable max-statements */
    show(e, el, value = {}) {
        if (!el._ripple || !el._ripple.enabled) {
            return;
        }
        const container = document.createElement('span');
        const animation = document.createElement('span');
        container.appendChild(animation);
        container.className = 'v-ripple__container';
        if (value.class) {
            container.className += ` ${value.class}`;
        }
        const { radius, scale, x, y, centerX, centerY } = calculate(e, el, value);
        const size = `${radius * 2}px`;
        animation.className = 'v-ripple__animation';
        animation.style.width = size;
        animation.style.height = size;
        el.appendChild(container);
        const computed = window.getComputedStyle(el);
        if (computed && computed.position === 'static') {
            el.style.position = 'relative';
            el.dataset.previousPosition = 'static';
        }
        animation.classList.add('v-ripple__animation--enter');
        animation.classList.add('v-ripple__animation--visible');
        transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
        opacity(animation, 0);
        animation.dataset.activated = String(performance.now());
        setTimeout(() => {
            animation.classList.remove('v-ripple__animation--enter');
            animation.classList.add('v-ripple__animation--in');
            transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
            opacity(animation, 0.25);
        }, 0);
    },
    hide(el) {
        if (!el || !el._ripple || !el._ripple.enabled)
            return;
        const ripples = el.getElementsByClassName('v-ripple__animation');
        if (ripples.length === 0)
            return;
        const animation = ripples[ripples.length - 1];
        if (animation.dataset.isHiding)
            return;
        else
            animation.dataset.isHiding = 'true';
        const diff = performance.now() - Number(animation.dataset.activated);
        const delay = Math.max(250 - diff, 0);
        setTimeout(() => {
            animation.classList.remove('v-ripple__animation--in');
            animation.classList.add('v-ripple__animation--out');
            opacity(animation, 0);
            setTimeout(() => {
                const ripples = el.getElementsByClassName('v-ripple__animation');
                if (ripples.length === 1 && el.dataset.previousPosition) {
                    el.style.position = el.dataset.previousPosition;
                    delete el.dataset.previousPosition;
                }
                animation.parentNode && el.removeChild(animation.parentNode);
            }, 300);
        }, delay);
    }
};
function isRippleEnabled(value) {
    return typeof value === 'undefined' || !!value;
}
function rippleShow(e) {
    const value = {};
    const element = e.currentTarget;
    if (!element || !element._ripple || element._ripple.touched)
        return;
    if (isTouchEvent(e)) {
        element._ripple.touched = true;
    }
    value.center = element._ripple.centered;
    if (element._ripple.class) {
        value.class = element._ripple.class;
    }
    ripple.show(e, element, value);
}
function rippleHide(e) {
    const element = e.currentTarget;
    if (!element)
        return;
    window.setTimeout(() => {
        if (element._ripple) {
            element._ripple.touched = false;
        }
    });
    ripple.hide(element);
}
function updateRipple(el, binding, wasEnabled) {
    const enabled = isRippleEnabled(binding.value);
    if (!enabled) {
        ripple.hide(el);
    }
    el._ripple = el._ripple || {};
    el._ripple.enabled = enabled;
    const value = binding.value || {};
    if (value.center) {
        el._ripple.centered = true;
    }
    if (value.class) {
        el._ripple.class = binding.value.class;
    }
    if (value.circle) {
        el._ripple.circle = value.circle;
    }
    if (enabled && !wasEnabled) {
        el.addEventListener('touchstart', rippleShow, { passive: true });
        el.addEventListener('touchend', rippleHide, { passive: true });
        el.addEventListener('touchcancel', rippleHide);
        el.addEventListener('mousedown', rippleShow);
        el.addEventListener('mouseup', rippleHide);
        el.addEventListener('mouseleave', rippleHide);
        // Anchor tags can be dragged, causes other hides to fail - #1537
        el.addEventListener('dragstart', rippleHide, { passive: true });
    }
    else if (!enabled && wasEnabled) {
        removeListeners(el);
    }
}
function removeListeners(el) {
    el.removeEventListener('mousedown', rippleShow);
    el.removeEventListener('touchstart', rippleHide);
    el.removeEventListener('touchend', rippleHide);
    el.removeEventListener('touchcancel', rippleHide);
    el.removeEventListener('mouseup', rippleHide);
    el.removeEventListener('mouseleave', rippleHide);
    el.removeEventListener('dragstart', rippleHide);
}
function directive(el, binding, node) {
    updateRipple(el, binding, false);
    // warn if an inline element is used, waiting for el to be in the DOM first
    node.context && node.context.$nextTick(() => {
        const computed = window.getComputedStyle(el);
        if (computed && computed.display === 'inline') {
            const context = node.fnOptions ? [node.fnOptions, node.context] : [node.componentInstance];
            consoleWarn('v-ripple can only be used on block-level elements', ...context);
        }
    });
}
function unbind(el) {
    delete el._ripple;
    removeListeners(el);
}
function update(el, binding) {
    if (binding.value === binding.oldValue) {
        return;
    }
    const wasEnabled = isRippleEnabled(binding.oldValue);
    updateRipple(el, binding, wasEnabled);
}
export default {
    bind: directive,
    unbind,
    update
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpcmVjdGl2ZXMvcmlwcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTtBQUU3QyxTQUFTLFNBQVMsQ0FBRSxFQUFlLEVBQUUsS0FBYTtJQUNoRCxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtJQUM3QixFQUFFLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsS0FBSyxDQUFBO0FBQ3JDLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBRSxFQUFlLEVBQUUsS0FBYTtJQUM5QyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUN4QyxDQUFDO0FBUUQsU0FBUyxZQUFZLENBQUUsQ0FBMEI7SUFDL0MsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUE7QUFDNUMsQ0FBQztBQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBMEIsRUFBRSxFQUFlLEVBQUUsUUFBdUIsRUFBRSxFQUFFLEVBQUU7SUFDM0YsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUE7SUFDekMsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDcEUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQzNDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQTtJQUUxQyxJQUFJLE1B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LE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUVoQywyRUFBMkU7SUFDM0UsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDMUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzVDLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQzdDLE1BQU0sT0FBTyxHQUFJLElBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUUsSUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7WUFDNUcsV0FBVyxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUE7U0FDN0U7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBRSxFQUFlO0lBQzlCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQTtJQUNqQixlQUFlLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDckIsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFFLEVBQWUsRUFBRSxPQUF1QjtJQUN2RCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUN0QyxPQUFNO0tBQ1A7SUFFRCxNQUFNLFVBQVUsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BELFlBQVksQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFBO0FBQ3ZDLENBQUM7QUFFRCxlQUFlO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFDZixNQUFNO0lBQ04sTUFBTTtDQUNQLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWTm9kZSwgVk5vZGVEaXJlY3RpdmUgfSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IGNvbnNvbGVXYXJuIH0gZnJvbSAnLi4vdXRpbC9jb25zb2xlJ1xyXG5cclxuZnVuY3Rpb24gdHJhbnNmb3JtIChlbDogSFRNTEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpIHtcclxuICBlbC5zdHlsZVsndHJhbnNmb3JtJ10gPSB2YWx1ZVxyXG4gIGVsLnN0eWxlWyd3ZWJraXRUcmFuc2Zvcm0nXSA9IHZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9wYWNpdHkgKGVsOiBIVE1MRWxlbWVudCwgdmFsdWU6IG51bWJlcikge1xyXG4gIGVsLnN0eWxlWydvcGFjaXR5J10gPSB2YWx1ZS50b1N0cmluZygpXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmlwcGxlT3B0aW9ucyB7XHJcbiAgY2xhc3M/OiBzdHJpbmdcclxuICBjZW50ZXI/OiBib29sZWFuXHJcbiAgY2lyY2xlPzogYm9vbGVhblxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1RvdWNoRXZlbnQgKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogZSBpcyBUb3VjaEV2ZW50IHtcclxuICByZXR1cm4gZS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnVG91Y2hFdmVudCdcclxufVxyXG5cclxuY29uc3QgY2FsY3VsYXRlID0gKGU6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBlbDogSFRNTEVsZW1lbnQsIHZhbHVlOiBSaXBwbGVPcHRpb25zID0ge30pID0+IHtcclxuICBjb25zdCBvZmZzZXQgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gIGNvbnN0IHRhcmdldCA9IGlzVG91Y2hFdmVudChlKSA/IGUudG91Y2hlc1tlLnRvdWNoZXMubGVuZ3RoIC0gMV0gOiBlXHJcbiAgY29uc3QgbG9jYWxYID0gdGFyZ2V0LmNsaWVudFggLSBvZmZzZXQubGVmdFxyXG4gIGNvbnN0IGxvY2FsWSA9IHRhcmdldC5jbGllbnRZIC0gb2Zmc2V0LnRvcFxyXG5cclxuICBsZXQgcmFkaXVzID0gMFxyXG4gIGxldCBzY2FsZSA9IDAuM1xyXG4gIGlmIChlbC5fcmlwcGxlICYmIGVsLl9yaXBwbGUuY2lyY2xlKSB7XHJcbiAgICBzY2FsZSA9IDAuMTVcclxuICAgIHJhZGl1cyA9IGVsLmNsaWVudFdpZHRoIC8gMlxyXG4gICAgcmFkaXVzID0gdmFsdWUuY2VudGVyID8gcmFkaXVzIDogcmFkaXVzICsgTWF0aC5zcXJ0KChsb2NhbFggLSByYWRpdXMpICoqIDIgKyAobG9jYWxZIC0gcmFkaXVzKSAqKiAyKSAvIDRcclxuICB9IGVsc2Uge1xyXG4gICAgcmFkaXVzID0gTWF0aC5zcXJ0KGVsLmNsaWVudFdpZHRoICoqIDIgKyBlbC5jbGllbnRIZWlnaHQgKiogMikgLyAyXHJcbiAgfVxyXG5cclxuICBjb25zdCBjZW50ZXJYID0gYCR7KGVsLmNsaWVudFdpZHRoIC0gKHJhZGl1cyAqIDIpKSAvIDJ9cHhgXHJcbiAgY29uc3QgY2VudGVyWSA9IGAkeyhlbC5jbGllbnRIZWlnaHQgLSAocmFkaXVzICogMikpIC8gMn1weGBcclxuXHJcbiAgY29uc3QgeCA9IHZhbHVlLmNlbnRlciA/IGNlbnRlclggOiBgJHtsb2NhbFggLSByYWRpdXN9cHhgXHJcbiAgY29uc3QgeSA9IHZhbHVlLmNlbnRlciA/IGNlbnRlclkgOiBgJHtsb2NhbFkgLSByYWRpdXN9cHhgXHJcblxyXG4gIHJldHVybiB7IHJhZGl1cywgc2NhbGUsIHgsIHksIGNlbnRlclgsIGNlbnRlclkgfVxyXG59XHJcblxyXG5jb25zdCByaXBwbGUgPSB7XHJcbiAgLyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMgKi9cclxuICBzaG93IChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgZWw6IEhUTUxFbGVtZW50LCB2YWx1ZTogUmlwcGxlT3B0aW9ucyA9IHt9KSB7XHJcbiAgICBpZiAoIWVsLl9yaXBwbGUgfHwgIWVsLl9yaXBwbGUuZW5hYmxlZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIGNvbnN0IGFuaW1hdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG5cclxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhbmltYXRpb24pXHJcbiAgICBjb250YWluZXIuY2xhc3NOYW1lID0gJ3YtcmlwcGxlX19jb250YWluZXInXHJcblxyXG4gICAgaWYgKHZhbHVlLmNsYXNzKSB7XHJcbiAgICAgIGNvbnRhaW5lci5jbGFzc05hbWUgKz0gYCAke3ZhbHVlLmNsYXNzfWBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IHJhZGl1cywgc2NhbGUsIHgsIHksIGNlbnRlclgsIGNlbnRlclkgfSA9IGNhbGN1bGF0ZShlLCBlbCwgdmFsdWUpXHJcblxyXG4gICAgY29uc3Qgc2l6ZSA9IGAke3JhZGl1cyAqIDJ9cHhgXHJcbiAgICBhbmltYXRpb24uY2xhc3NOYW1lID0gJ3YtcmlwcGxlX19hbmltYXRpb24nXHJcbiAgICBhbmltYXRpb24uc3R5bGUud2lkdGggPSBzaXplXHJcbiAgICBhbmltYXRpb24uc3R5bGUuaGVpZ2h0ID0gc2l6ZVxyXG5cclxuICAgIGVsLmFwcGVuZENoaWxkKGNvbnRhaW5lcilcclxuXHJcbiAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxyXG4gICAgaWYgKGNvbXB1dGVkICYmIGNvbXB1dGVkLnBvc2l0aW9uID09PSAnc3RhdGljJykge1xyXG4gICAgICBlbC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcclxuICAgICAgZWwuZGF0YXNldC5wcmV2aW91c1Bvc2l0aW9uID0gJ3N0YXRpYydcclxuICAgIH1cclxuXHJcbiAgICBhbmltYXRpb24uY2xhc3NMaXN0LmFkZCgndi1yaXBwbGVfX2FuaW1hdGlvbi0tZW50ZXInKVxyXG4gICAgYW5pbWF0aW9uLmNsYXNzTGlzdC5hZGQoJ3YtcmlwcGxlX19hbmltYXRpb24tLXZpc2libGUnKVxyXG4gICAgdHJhbnNmb3JtKGFuaW1hdGlvbiwgYHRyYW5zbGF0ZSgke3h9LCAke3l9KSBzY2FsZTNkKCR7c2NhbGV9LCR7c2NhbGV9LCR7c2NhbGV9KWApXHJcbiAgICBvcGFjaXR5KGFuaW1hdGlvbiwgMClcclxuICAgIGFuaW1hdGlvbi5kYXRhc2V0LmFjdGl2YXRlZCA9IFN0cmluZyhwZXJmb3JtYW5jZS5ub3coKSlcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgYW5pbWF0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ3YtcmlwcGxlX19hbmltYXRpb24tLWVudGVyJylcclxuICAgICAgYW5pbWF0aW9uLmNsYXNzTGlzdC5hZGQoJ3YtcmlwcGxlX19hbmltYXRpb24tLWluJylcclxuICAgICAgdHJhbnNmb3JtKGFuaW1hdGlvbiwgYHRyYW5zbGF0ZSgke2NlbnRlclh9LCAke2NlbnRlcll9KSBzY2FsZTNkKDEsMSwxKWApXHJcbiAgICAgIG9wYWNpdHkoYW5pbWF0aW9uLCAwLjI1KVxyXG4gICAgfSwgMClcclxuICB9LFxyXG5cclxuICBoaWRlIChlbDogSFRNTEVsZW1lbnQgfCBudWxsKSB7XHJcbiAgICBpZiAoIWVsIHx8ICFlbC5fcmlwcGxlIHx8ICFlbC5fcmlwcGxlLmVuYWJsZWQpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHJpcHBsZXMgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2LXJpcHBsZV9fYW5pbWF0aW9uJylcclxuXHJcbiAgICBpZiAocmlwcGxlcy5sZW5ndGggPT09IDApIHJldHVyblxyXG4gICAgY29uc3QgYW5pbWF0aW9uID0gcmlwcGxlc1tyaXBwbGVzLmxlbmd0aCAtIDFdXHJcblxyXG4gICAgaWYgKGFuaW1hdGlvbi5kYXRhc2V0LmlzSGlkaW5nKSByZXR1cm5cclxuICAgIGVsc2UgYW5pbWF0aW9uLmRhdGFzZXQuaXNIaWRpbmcgPSAndHJ1ZSdcclxuXHJcbiAgICBjb25zdCBkaWZmID0gcGVyZm9ybWFuY2Uubm93KCkgLSBOdW1iZXIoYW5pbWF0aW9uLmRhdGFzZXQuYWN0aXZhdGVkKVxyXG4gICAgY29uc3QgZGVsYXkgPSBNYXRoLm1heCgyNTAgLSBkaWZmLCAwKVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBhbmltYXRpb24uY2xhc3NMaXN0LnJlbW92ZSgndi1yaXBwbGVfX2FuaW1hdGlvbi0taW4nKVxyXG4gICAgICBhbmltYXRpb24uY2xhc3NMaXN0LmFkZCgndi1yaXBwbGVfX2FuaW1hdGlvbi0tb3V0JylcclxuICAgICAgb3BhY2l0eShhbmltYXRpb24sIDApXHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBjb25zdCByaXBwbGVzID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndi1yaXBwbGVfX2FuaW1hdGlvbicpXHJcbiAgICAgICAgaWYgKHJpcHBsZXMubGVuZ3RoID09PSAxICYmIGVsLmRhdGFzZXQucHJldmlvdXNQb3NpdGlvbikge1xyXG4gICAgICAgICAgZWwuc3R5bGUucG9zaXRpb24gPSBlbC5kYXRhc2V0LnByZXZpb3VzUG9zaXRpb25cclxuICAgICAgICAgIGRlbGV0ZSBlbC5kYXRhc2V0LnByZXZpb3VzUG9zaXRpb25cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGFuaW1hdGlvbi5wYXJlbnROb2RlICYmIGVsLnJlbW92ZUNoaWxkKGFuaW1hdGlvbi5wYXJlbnROb2RlKVxyXG4gICAgICB9LCAzMDApXHJcbiAgICB9LCBkZWxheSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUmlwcGxlRW5hYmxlZCAodmFsdWU6IGFueSk6IHZhbHVlIGlzIHRydWUge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8ICEhdmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gcmlwcGxlU2hvdyAoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcclxuICBjb25zdCB2YWx1ZTogUmlwcGxlT3B0aW9ucyA9IHt9XHJcbiAgY29uc3QgZWxlbWVudCA9IGUuY3VycmVudFRhcmdldCBhcyBIVE1MRWxlbWVudFxyXG4gIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5fcmlwcGxlIHx8IGVsZW1lbnQuX3JpcHBsZS50b3VjaGVkKSByZXR1cm5cclxuICBpZiAoaXNUb3VjaEV2ZW50KGUpKSB7XHJcbiAgICBlbGVtZW50Ll9yaXBwbGUudG91Y2hlZCA9IHRydWVcclxuICB9XHJcbiAgdmFsdWUuY2VudGVyID0gZWxlbWVudC5fcmlwcGxlLmNlbnRlcmVkXHJcbiAgaWYgKGVsZW1lbnQuX3JpcHBsZS5jbGFzcykge1xyXG4gICAgdmFsdWUuY2xhc3MgPSBlbGVtZW50Ll9yaXBwbGUuY2xhc3NcclxuICB9XHJcbiAgcmlwcGxlLnNob3coZSwgZWxlbWVudCwgdmFsdWUpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJpcHBsZUhpZGUgKGU6IEV2ZW50KSB7XHJcbiAgY29uc3QgZWxlbWVudCA9IGUuY3VycmVudFRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGxcclxuICBpZiAoIWVsZW1lbnQpIHJldHVyblxyXG5cclxuICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBpZiAoZWxlbWVudC5fcmlwcGxlKSB7XHJcbiAgICAgIGVsZW1lbnQuX3JpcHBsZS50b3VjaGVkID0gZmFsc2VcclxuICAgIH1cclxuICB9KVxyXG4gIHJpcHBsZS5oaWRlKGVsZW1lbnQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJpcHBsZSAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBWTm9kZURpcmVjdGl2ZSwgd2FzRW5hYmxlZDogYm9vbGVhbikge1xyXG4gIGNvbnN0IGVuYWJsZWQgPSBpc1JpcHBsZUVuYWJsZWQoYmluZGluZy52YWx1ZSlcclxuICBpZiAoIWVuYWJsZWQpIHtcclxuICAgIHJpcHBsZS5oaWRlKGVsKVxyXG4gIH1cclxuICBlbC5fcmlwcGxlID0gZWwuX3JpcHBsZSB8fCB7fVxyXG4gIGVsLl9yaXBwbGUuZW5hYmxlZCA9IGVuYWJsZWRcclxuICBjb25zdCB2YWx1ZSA9IGJpbmRpbmcudmFsdWUgfHwge31cclxuICBpZiAodmFsdWUuY2VudGVyKSB7XHJcbiAgICBlbC5fcmlwcGxlLmNlbnRlcmVkID0gdHJ1ZVxyXG4gIH1cclxuICBpZiAodmFsdWUuY2xhc3MpIHtcclxuICAgIGVsLl9yaXBwbGUuY2xhc3MgPSBiaW5kaW5nLnZhbHVlLmNsYXNzXHJcbiAgfVxyXG4gIGlmICh2YWx1ZS5jaXJjbGUpIHtcclxuICAgIGVsLl9yaXBwbGUuY2lyY2xlID0gdmFsdWUuY2lyY2xlXHJcbiAgfVxyXG4gIGlmIChlbmFibGVkICYmICF3YXNFbmFibGVkKSB7XHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgcmlwcGxlU2hvdywgeyBwYXNzaXZlOiB0cnVlIH0pXHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHJpcHBsZUhpZGUsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxyXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCByaXBwbGVIaWRlKVxyXG5cclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHJpcHBsZVNob3cpXHJcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgcmlwcGxlSGlkZSlcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCByaXBwbGVIaWRlKVxyXG4gICAgLy8gQW5jaG9yIHRhZ3MgY2FuIGJlIGRyYWdnZWQsIGNhdXNlcyBvdGhlciBoaWRlcyB0byBmYWlsIC0gIzE1MzdcclxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIHJpcHBsZUhpZGUsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxyXG4gIH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgd2FzRW5hYmxlZCkge1xyXG4gICAgcmVtb3ZlTGlzdGVuZXJzKGVsKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzIChlbDogSFRNTEVsZW1lbnQpIHtcclxuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCByaXBwbGVTaG93KVxyXG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCByaXBwbGVIaWRlKVxyXG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgcmlwcGxlSGlkZSlcclxuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIHJpcHBsZUhpZGUpXHJcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHJpcHBsZUhpZGUpXHJcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHJpcHBsZUhpZGUpXHJcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgcmlwcGxlSGlkZSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGlyZWN0aXZlIChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IFZOb2RlRGlyZWN0aXZlLCBub2RlOiBWTm9kZSkge1xyXG4gIHVwZGF0ZVJpcHBsZShlbCwgYmluZGluZywgZmFsc2UpXHJcblxyXG4gIC8vIHdhcm4gaWYgYW4gaW5saW5lIGVsZW1lbnQgaXMgdXNlZCwgd2FpdGluZyBmb3IgZWwgdG8gYmUgaW4gdGhlIERPTSBmaXJzdFxyXG4gIG5vZGUuY29udGV4dCAmJiBub2RlLmNvbnRleHQuJG5leHRUaWNrKCgpID0+IHtcclxuICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXHJcbiAgICBpZiAoY29tcHV0ZWQgJiYgY29tcHV0ZWQuZGlzcGxheSA9PT0gJ2lubGluZScpIHtcclxuICAgICAgY29uc3QgY29udGV4dCA9IChub2RlIGFzIGFueSkuZm5PcHRpb25zID8gWyhub2RlIGFzIGFueSkuZm5PcHRpb25zLCBub2RlLmNvbnRleHRdIDogW25vZGUuY29tcG9uZW50SW5zdGFuY2VdXHJcbiAgICAgIGNvbnNvbGVXYXJuKCd2LXJpcHBsZSBjYW4gb25seSBiZSB1c2VkIG9uIGJsb2NrLWxldmVsIGVsZW1lbnRzJywgLi4uY29udGV4dClcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiB1bmJpbmQgKGVsOiBIVE1MRWxlbWVudCkge1xyXG4gIGRlbGV0ZSBlbC5fcmlwcGxlXHJcbiAgcmVtb3ZlTGlzdGVuZXJzKGVsKVxyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGUgKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogVk5vZGVEaXJlY3RpdmUpIHtcclxuICBpZiAoYmluZGluZy52YWx1ZSA9PT0gYmluZGluZy5vbGRWYWx1ZSkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG5cclxuICBjb25zdCB3YXNFbmFibGVkID0gaXNSaXBwbGVFbmFibGVkKGJpbmRpbmcub2xkVmFsdWUpXHJcbiAgdXBkYXRlUmlwcGxlKGVsLCBiaW5kaW5nLCB3YXNFbmFibGVkKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgYmluZDogZGlyZWN0aXZlLFxyXG4gIHVuYmluZCxcclxuICB1cGRhdGVcclxufVxyXG4iXX0=