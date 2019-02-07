function closeConditional() {
    return false;
}
function directive(e, el, binding) {
    // Args may not always be supplied
    binding.args = binding.args || {};
    // If no closeConditional was supplied assign a default
    const isActive = (binding.args.closeConditional || closeConditional);
    // The include element callbacks below can be expensive
    // so we should avoid calling them when we're not active.
    // Explicitly check for false to allow fallback compatibility
    // with non-toggleable components
    if (!e || isActive(e) === false)
        return;
    // If click was triggered programmaticaly (domEl.click()) then
    // it shouldn't be treated as click-outside
    // Chrome/Firefox support isTrusted property
    // IE/Edge support pointerType property (empty if not triggered
    // by pointing device)
    if (('isTrusted' in e && !e.isTrusted) ||
        ('pointerType' in e && !e.pointerType))
        return;
    // Check if additional elements were passed to be included in check
    // (click must be outside all included elements, if any)
    const elements = (binding.args.include || (() => []))();
    // Add the root element for the component this directive was defined on
    elements.push(el);
    // Check if it's a click outside our elements, and then if our callback returns true.
    // Non-toggleable components should take action in their callback and return falsy.
    // Toggleable can return true if it wants to deactivate.
    // Note that, because we're in the capture phase, this callback will occure before
    // the bubbling click event on any outside elements.
    !clickedInEls(e, elements) && setTimeout(() => {
        isActive(e) && binding.value && binding.value(e);
    }, 0);
}
function clickedInEls(e, elements) {
    // Get position of click
    const { clientX: x, clientY: y } = e;
    // Loop over all included elements to see if click was in any of them
    for (const el of elements) {
        if (clickedInEl(el, x, y))
            return true;
    }
    return false;
}
function clickedInEl(el, x, y) {
    // Get bounding rect for element
    // (we're in capturing event and we want to check for multiple elements,
    //  so can't use target.)
    const b = el.getBoundingClientRect();
    // Check if the click was in the element's bounding rect
    return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
}
export default {
    // [data-app] may not be found
    // if using bind, inserted makes
    // sure that the root element is
    // available, iOS does not support
    // clicks on body
    inserted(el, binding) {
        const onClick = (e) => directive(e, el, binding);
        // iOS does not recognize click events on document
        // or body, this is the entire purpose of the v-app
        // component and [data-app], stop removing this
        const app = document.querySelector('[data-app]') ||
            document.body; // This is only for unit tests
        app.addEventListener('click', onClick, true);
        el._clickOutside = onClick;
    },
    unbind(el) {
        if (!el._clickOutside)
            return;
        const app = document.querySelector('[data-app]') ||
            document.body; // This is only for unit tests
        app && app.removeEventListener('click', el._clickOutside, true);
        delete el._clickOutside;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2stb3V0c2lkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWUEsU0FBUyxnQkFBZ0I7SUFDdkIsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUUsQ0FBZSxFQUFFLEVBQWUsRUFBRSxPQUE4QjtJQUNsRixrQ0FBa0M7SUFDbEMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUVqQyx1REFBdUQ7SUFDdkQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLENBQUE7SUFFcEUsdURBQXVEO0lBQ3ZELHlEQUF5RDtJQUN6RCw2REFBNkQ7SUFDN0QsaUNBQWlDO0lBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUs7UUFBRSxPQUFNO0lBRXZDLDhEQUE4RDtJQUM5RCwyQ0FBMkM7SUFDM0MsNENBQTRDO0lBQzVDLCtEQUErRDtJQUMvRCxzQkFBc0I7SUFDdEIsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3BDLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDdEMsT0FBTTtJQUVSLG1FQUFtRTtJQUNuRSx3REFBd0Q7SUFDeEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUN2RCx1RUFBdUU7SUFDdkUsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVqQixxRkFBcUY7SUFDckYsbUZBQW1GO0lBQ25GLHdEQUF3RDtJQUN4RCxrRkFBa0Y7SUFDbEYsb0RBQW9EO0lBQ3BELENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQzVDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEQsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQ1AsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFFLENBQWUsRUFBRSxRQUF1QjtJQUM3RCx3QkFBd0I7SUFDeEIsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNwQyxxRUFBcUU7SUFDckUsS0FBSyxNQUFNLEVBQUUsSUFBSSxRQUFRLEVBQUU7UUFDekIsSUFBSSxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQTtLQUN2QztJQUVELE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFFLEVBQWUsRUFBRSxDQUFTLEVBQUUsQ0FBUztJQUN6RCxnQ0FBZ0M7SUFDaEMsd0VBQXdFO0lBQ3hFLHlCQUF5QjtJQUN6QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtJQUNwQyx3REFBd0Q7SUFFeEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQTtBQUNuRSxDQUFDO0FBRUQsZUFBZTtJQUNiLDhCQUE4QjtJQUM5QixnQ0FBZ0M7SUFDaEMsZ0NBQWdDO0lBQ2hDLGtDQUFrQztJQUNsQyxpQkFBaUI7SUFDakIsUUFBUSxDQUFFLEVBQWUsRUFBRSxPQUE4QjtRQUN2RCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQVEsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQWlCLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZFLGtEQUFrRDtRQUNsRCxtREFBbUQ7UUFDbkQsK0NBQStDO1FBQy9DLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO1lBQzlDLFFBQVEsQ0FBQyxJQUFJLENBQUEsQ0FBQyw4QkFBOEI7UUFDOUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDNUMsRUFBRSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUE7SUFDNUIsQ0FBQztJQUVELE1BQU0sQ0FBRSxFQUFlO1FBQ3JCLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYTtZQUFFLE9BQU07UUFFN0IsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7WUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQSxDQUFDLDhCQUE4QjtRQUM5QyxHQUFHLElBQUksR0FBRyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQy9ELE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQTtJQUN6QixDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZOb2RlRGlyZWN0aXZlIH0gZnJvbSAndnVlL3R5cGVzL3Zub2RlJ1xyXG5cclxuaW50ZXJmYWNlIENsaWNrT3V0c2lkZUJpbmRpbmdBcmdzIHtcclxuICBjbG9zZUNvbmRpdGlvbmFsPzogKGU6IEV2ZW50KSA9PiBib29sZWFuXHJcbiAgaW5jbHVkZT86ICgpID0+IEhUTUxFbGVtZW50W11cclxufVxyXG5cclxuaW50ZXJmYWNlIENsaWNrT3V0c2lkZURpcmVjdGl2ZSBleHRlbmRzIFZOb2RlRGlyZWN0aXZlIHtcclxuICB2YWx1ZT86IChlOiBFdmVudCkgPT4gdm9pZFxyXG4gIGFyZ3M/OiBDbGlja091dHNpZGVCaW5kaW5nQXJnc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZUNvbmRpdGlvbmFsICgpIHtcclxuICByZXR1cm4gZmFsc2VcclxufVxyXG5cclxuZnVuY3Rpb24gZGlyZWN0aXZlIChlOiBQb2ludGVyRXZlbnQsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogQ2xpY2tPdXRzaWRlRGlyZWN0aXZlKTogdm9pZCB7XHJcbiAgLy8gQXJncyBtYXkgbm90IGFsd2F5cyBiZSBzdXBwbGllZFxyXG4gIGJpbmRpbmcuYXJncyA9IGJpbmRpbmcuYXJncyB8fCB7fVxyXG5cclxuICAvLyBJZiBubyBjbG9zZUNvbmRpdGlvbmFsIHdhcyBzdXBwbGllZCBhc3NpZ24gYSBkZWZhdWx0XHJcbiAgY29uc3QgaXNBY3RpdmUgPSAoYmluZGluZy5hcmdzLmNsb3NlQ29uZGl0aW9uYWwgfHwgY2xvc2VDb25kaXRpb25hbClcclxuXHJcbiAgLy8gVGhlIGluY2x1ZGUgZWxlbWVudCBjYWxsYmFja3MgYmVsb3cgY2FuIGJlIGV4cGVuc2l2ZVxyXG4gIC8vIHNvIHdlIHNob3VsZCBhdm9pZCBjYWxsaW5nIHRoZW0gd2hlbiB3ZSdyZSBub3QgYWN0aXZlLlxyXG4gIC8vIEV4cGxpY2l0bHkgY2hlY2sgZm9yIGZhbHNlIHRvIGFsbG93IGZhbGxiYWNrIGNvbXBhdGliaWxpdHlcclxuICAvLyB3aXRoIG5vbi10b2dnbGVhYmxlIGNvbXBvbmVudHNcclxuICBpZiAoIWUgfHwgaXNBY3RpdmUoZSkgPT09IGZhbHNlKSByZXR1cm5cclxuXHJcbiAgLy8gSWYgY2xpY2sgd2FzIHRyaWdnZXJlZCBwcm9ncmFtbWF0aWNhbHkgKGRvbUVsLmNsaWNrKCkpIHRoZW5cclxuICAvLyBpdCBzaG91bGRuJ3QgYmUgdHJlYXRlZCBhcyBjbGljay1vdXRzaWRlXHJcbiAgLy8gQ2hyb21lL0ZpcmVmb3ggc3VwcG9ydCBpc1RydXN0ZWQgcHJvcGVydHlcclxuICAvLyBJRS9FZGdlIHN1cHBvcnQgcG9pbnRlclR5cGUgcHJvcGVydHkgKGVtcHR5IGlmIG5vdCB0cmlnZ2VyZWRcclxuICAvLyBieSBwb2ludGluZyBkZXZpY2UpXHJcbiAgaWYgKCgnaXNUcnVzdGVkJyBpbiBlICYmICFlLmlzVHJ1c3RlZCkgfHxcclxuICAgICgncG9pbnRlclR5cGUnIGluIGUgJiYgIWUucG9pbnRlclR5cGUpXHJcbiAgKSByZXR1cm5cclxuXHJcbiAgLy8gQ2hlY2sgaWYgYWRkaXRpb25hbCBlbGVtZW50cyB3ZXJlIHBhc3NlZCB0byBiZSBpbmNsdWRlZCBpbiBjaGVja1xyXG4gIC8vIChjbGljayBtdXN0IGJlIG91dHNpZGUgYWxsIGluY2x1ZGVkIGVsZW1lbnRzLCBpZiBhbnkpXHJcbiAgY29uc3QgZWxlbWVudHMgPSAoYmluZGluZy5hcmdzLmluY2x1ZGUgfHwgKCgpID0+IFtdKSkoKVxyXG4gIC8vIEFkZCB0aGUgcm9vdCBlbGVtZW50IGZvciB0aGUgY29tcG9uZW50IHRoaXMgZGlyZWN0aXZlIHdhcyBkZWZpbmVkIG9uXHJcbiAgZWxlbWVudHMucHVzaChlbClcclxuXHJcbiAgLy8gQ2hlY2sgaWYgaXQncyBhIGNsaWNrIG91dHNpZGUgb3VyIGVsZW1lbnRzLCBhbmQgdGhlbiBpZiBvdXIgY2FsbGJhY2sgcmV0dXJucyB0cnVlLlxyXG4gIC8vIE5vbi10b2dnbGVhYmxlIGNvbXBvbmVudHMgc2hvdWxkIHRha2UgYWN0aW9uIGluIHRoZWlyIGNhbGxiYWNrIGFuZCByZXR1cm4gZmFsc3kuXHJcbiAgLy8gVG9nZ2xlYWJsZSBjYW4gcmV0dXJuIHRydWUgaWYgaXQgd2FudHMgdG8gZGVhY3RpdmF0ZS5cclxuICAvLyBOb3RlIHRoYXQsIGJlY2F1c2Ugd2UncmUgaW4gdGhlIGNhcHR1cmUgcGhhc2UsIHRoaXMgY2FsbGJhY2sgd2lsbCBvY2N1cmUgYmVmb3JlXHJcbiAgLy8gdGhlIGJ1YmJsaW5nIGNsaWNrIGV2ZW50IG9uIGFueSBvdXRzaWRlIGVsZW1lbnRzLlxyXG4gICFjbGlja2VkSW5FbHMoZSwgZWxlbWVudHMpICYmIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgaXNBY3RpdmUoZSkgJiYgYmluZGluZy52YWx1ZSAmJiBiaW5kaW5nLnZhbHVlKGUpXHJcbiAgfSwgMClcclxufVxyXG5cclxuZnVuY3Rpb24gY2xpY2tlZEluRWxzIChlOiBQb2ludGVyRXZlbnQsIGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdKTogYm9vbGVhbiB7XHJcbiAgLy8gR2V0IHBvc2l0aW9uIG9mIGNsaWNrXHJcbiAgY29uc3QgeyBjbGllbnRYOiB4LCBjbGllbnRZOiB5IH0gPSBlXHJcbiAgLy8gTG9vcCBvdmVyIGFsbCBpbmNsdWRlZCBlbGVtZW50cyB0byBzZWUgaWYgY2xpY2sgd2FzIGluIGFueSBvZiB0aGVtXHJcbiAgZm9yIChjb25zdCBlbCBvZiBlbGVtZW50cykge1xyXG4gICAgaWYgKGNsaWNrZWRJbkVsKGVsLCB4LCB5KSkgcmV0dXJuIHRydWVcclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGlja2VkSW5FbCAoZWw6IEhUTUxFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gIC8vIEdldCBib3VuZGluZyByZWN0IGZvciBlbGVtZW50XHJcbiAgLy8gKHdlJ3JlIGluIGNhcHR1cmluZyBldmVudCBhbmQgd2Ugd2FudCB0byBjaGVjayBmb3IgbXVsdGlwbGUgZWxlbWVudHMsXHJcbiAgLy8gIHNvIGNhbid0IHVzZSB0YXJnZXQuKVxyXG4gIGNvbnN0IGIgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gIC8vIENoZWNrIGlmIHRoZSBjbGljayB3YXMgaW4gdGhlIGVsZW1lbnQncyBib3VuZGluZyByZWN0XHJcblxyXG4gIHJldHVybiB4ID49IGIubGVmdCAmJiB4IDw9IGIucmlnaHQgJiYgeSA+PSBiLnRvcCAmJiB5IDw9IGIuYm90dG9tXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAvLyBbZGF0YS1hcHBdIG1heSBub3QgYmUgZm91bmRcclxuICAvLyBpZiB1c2luZyBiaW5kLCBpbnNlcnRlZCBtYWtlc1xyXG4gIC8vIHN1cmUgdGhhdCB0aGUgcm9vdCBlbGVtZW50IGlzXHJcbiAgLy8gYXZhaWxhYmxlLCBpT1MgZG9lcyBub3Qgc3VwcG9ydFxyXG4gIC8vIGNsaWNrcyBvbiBib2R5XHJcbiAgaW5zZXJ0ZWQgKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogQ2xpY2tPdXRzaWRlRGlyZWN0aXZlKSB7XHJcbiAgICBjb25zdCBvbkNsaWNrID0gKGU6IEV2ZW50KSA9PiBkaXJlY3RpdmUoZSBhcyBQb2ludGVyRXZlbnQsIGVsLCBiaW5kaW5nKVxyXG4gICAgLy8gaU9TIGRvZXMgbm90IHJlY29nbml6ZSBjbGljayBldmVudHMgb24gZG9jdW1lbnRcclxuICAgIC8vIG9yIGJvZHksIHRoaXMgaXMgdGhlIGVudGlyZSBwdXJwb3NlIG9mIHRoZSB2LWFwcFxyXG4gICAgLy8gY29tcG9uZW50IGFuZCBbZGF0YS1hcHBdLCBzdG9wIHJlbW92aW5nIHRoaXNcclxuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwcF0nKSB8fFxyXG4gICAgICBkb2N1bWVudC5ib2R5IC8vIFRoaXMgaXMgb25seSBmb3IgdW5pdCB0ZXN0c1xyXG4gICAgYXBwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgdHJ1ZSlcclxuICAgIGVsLl9jbGlja091dHNpZGUgPSBvbkNsaWNrXHJcbiAgfSxcclxuXHJcbiAgdW5iaW5kIChlbDogSFRNTEVsZW1lbnQpIHtcclxuICAgIGlmICghZWwuX2NsaWNrT3V0c2lkZSkgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgYXBwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBwXScpIHx8XHJcbiAgICAgIGRvY3VtZW50LmJvZHkgLy8gVGhpcyBpcyBvbmx5IGZvciB1bml0IHRlc3RzXHJcbiAgICBhcHAgJiYgYXBwLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZWwuX2NsaWNrT3V0c2lkZSwgdHJ1ZSlcclxuICAgIGRlbGV0ZSBlbC5fY2xpY2tPdXRzaWRlXHJcbiAgfVxyXG59XHJcbiJdfQ==