// Return target's cumulative offset from the top
export function getOffset(target) {
    if (typeof target === 'number') {
        return target;
    }
    let el = $(target);
    if (!el) {
        throw typeof target === 'string'
            ? new Error(`Target element "${target}" not found.`)
            : new TypeError(`Target must be a Number/Selector/HTMLElement/VueComponent, received ${type(target)} instead.`);
    }
    let totalOffset = 0;
    while (el) {
        totalOffset += el.offsetTop;
        el = el.offsetParent;
    }
    return totalOffset;
}
export function getContainer(container) {
    const el = $(container);
    if (el)
        return el;
    throw typeof container === 'string'
        ? new Error(`Container element "${container}" not found.`)
        : new TypeError(`Container must be a Selector/HTMLElement/VueComponent, received ${type(container)} instead.`);
}
function type(el) {
    return el == null ? el : el.constructor.name;
}
function $(el) {
    if (typeof el === 'string') {
        return document.querySelector(el);
    }
    else if (el && el._isVue) {
        return el.$el;
    }
    else if (el instanceof HTMLElement) {
        return el;
    }
    else {
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Z1ZXRpZnkvZ29Uby91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLGlEQUFpRDtBQUNqRCxNQUFNLFVBQVUsU0FBUyxDQUFFLE1BQVc7SUFDcEMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDOUIsT0FBTyxNQUFNLENBQUE7S0FDZDtJQUVELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsQixJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ1AsTUFBTSxPQUFPLE1BQU0sS0FBSyxRQUFRO1lBQzlCLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsTUFBTSxjQUFjLENBQUM7WUFDcEQsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLHVFQUF1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQ2xIO0lBRUQsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBO0lBQ25CLE9BQU8sRUFBRSxFQUFFO1FBQ1QsV0FBVyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUE7UUFDM0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUEyQixDQUFBO0tBQ3BDO0lBRUQsT0FBTyxXQUFXLENBQUE7QUFDcEIsQ0FBQztBQUVELE1BQU0sVUFBVSxZQUFZLENBQUUsU0FBYztJQUMxQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7SUFFdkIsSUFBSSxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUE7SUFFakIsTUFBTSxPQUFPLFNBQVMsS0FBSyxRQUFRO1FBQ2pDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsU0FBUyxjQUFjLENBQUM7UUFDMUQsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLG1FQUFtRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2xILENBQUM7QUFFRCxTQUFTLElBQUksQ0FBRSxFQUFPO0lBQ3BCLE9BQU8sRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQTtBQUM5QyxDQUFDO0FBRUQsU0FBUyxDQUFDLENBQUUsRUFBTztJQUNqQixJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTtRQUMxQixPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQWMsRUFBRSxDQUFDLENBQUE7S0FDL0M7U0FBTSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFO1FBQzFCLE9BQVEsRUFBVSxDQUFDLEdBQWtCLENBQUE7S0FDdEM7U0FBTSxJQUFJLEVBQUUsWUFBWSxXQUFXLEVBQUU7UUFDcEMsT0FBTyxFQUFFLENBQUE7S0FDVjtTQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUE7S0FDWjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbi8vIFJldHVybiB0YXJnZXQncyBjdW11bGF0aXZlIG9mZnNldCBmcm9tIHRoZSB0b3BcclxuZXhwb3J0IGZ1bmN0aW9uIGdldE9mZnNldCAodGFyZ2V0OiBhbnkpOiBudW1iZXIge1xyXG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnbnVtYmVyJykge1xyXG4gICAgcmV0dXJuIHRhcmdldFxyXG4gIH1cclxuXHJcbiAgbGV0IGVsID0gJCh0YXJnZXQpXHJcbiAgaWYgKCFlbCkge1xyXG4gICAgdGhyb3cgdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZydcclxuICAgICAgPyBuZXcgRXJyb3IoYFRhcmdldCBlbGVtZW50IFwiJHt0YXJnZXR9XCIgbm90IGZvdW5kLmApXHJcbiAgICAgIDogbmV3IFR5cGVFcnJvcihgVGFyZ2V0IG11c3QgYmUgYSBOdW1iZXIvU2VsZWN0b3IvSFRNTEVsZW1lbnQvVnVlQ29tcG9uZW50LCByZWNlaXZlZCAke3R5cGUodGFyZ2V0KX0gaW5zdGVhZC5gKVxyXG4gIH1cclxuXHJcbiAgbGV0IHRvdGFsT2Zmc2V0ID0gMFxyXG4gIHdoaWxlIChlbCkge1xyXG4gICAgdG90YWxPZmZzZXQgKz0gZWwub2Zmc2V0VG9wXHJcbiAgICBlbCA9IGVsLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudFxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRvdGFsT2Zmc2V0XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250YWluZXIgKGNvbnRhaW5lcjogYW55KTogSFRNTEVsZW1lbnQge1xyXG4gIGNvbnN0IGVsID0gJChjb250YWluZXIpXHJcblxyXG4gIGlmIChlbCkgcmV0dXJuIGVsXHJcblxyXG4gIHRocm93IHR5cGVvZiBjb250YWluZXIgPT09ICdzdHJpbmcnXHJcbiAgICA/IG5ldyBFcnJvcihgQ29udGFpbmVyIGVsZW1lbnQgXCIke2NvbnRhaW5lcn1cIiBub3QgZm91bmQuYClcclxuICAgIDogbmV3IFR5cGVFcnJvcihgQ29udGFpbmVyIG11c3QgYmUgYSBTZWxlY3Rvci9IVE1MRWxlbWVudC9WdWVDb21wb25lbnQsIHJlY2VpdmVkICR7dHlwZShjb250YWluZXIpfSBpbnN0ZWFkLmApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHR5cGUgKGVsOiBhbnkpIHtcclxuICByZXR1cm4gZWwgPT0gbnVsbCA/IGVsIDogZWwuY29uc3RydWN0b3IubmFtZVxyXG59XHJcblxyXG5mdW5jdGlvbiAkIChlbDogYW55KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcclxuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KGVsKVxyXG4gIH0gZWxzZSBpZiAoZWwgJiYgZWwuX2lzVnVlKSB7XHJcbiAgICByZXR1cm4gKGVsIGFzIFZ1ZSkuJGVsIGFzIEhUTUxFbGVtZW50XHJcbiAgfSBlbHNlIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICByZXR1cm4gZWxcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcbn1cclxuIl19