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
    // Note that, because we're in the capture phase, this callback will occur before
    // the bubbling click event on any outside elements.
    !elements.some(el => el.contains(e.target)) && setTimeout(() => {
        isActive(e) && binding.value && binding.value(e);
    }, 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2stb3V0c2lkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXJlY3RpdmVzL2NsaWNrLW91dHNpZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWUEsU0FBUyxnQkFBZ0I7SUFDdkIsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUUsQ0FBZSxFQUFFLEVBQWUsRUFBRSxPQUE4QjtJQUNsRixrQ0FBa0M7SUFDbEMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUVqQyx1REFBdUQ7SUFDdkQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLENBQUE7SUFFcEUsdURBQXVEO0lBQ3ZELHlEQUF5RDtJQUN6RCw2REFBNkQ7SUFDN0QsaUNBQWlDO0lBQ2pDLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUs7UUFBRSxPQUFNO0lBRXZDLDhEQUE4RDtJQUM5RCwyQ0FBMkM7SUFDM0MsNENBQTRDO0lBQzVDLCtEQUErRDtJQUMvRCxzQkFBc0I7SUFDdEIsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3BDLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDdEMsT0FBTTtJQUVSLG1FQUFtRTtJQUNuRSx3REFBd0Q7SUFDeEQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUN2RCx1RUFBdUU7SUFDdkUsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVqQixxRkFBcUY7SUFDckYsbUZBQW1GO0lBQ25GLHdEQUF3RDtJQUN4RCxpRkFBaUY7SUFDakYsb0RBQW9EO0lBQ3BELENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQWMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNyRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2xELENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUNQLENBQUM7QUFFRCxlQUFlO0lBQ2IsOEJBQThCO0lBQzlCLGdDQUFnQztJQUNoQyxnQ0FBZ0M7SUFDaEMsa0NBQWtDO0lBQ2xDLGlCQUFpQjtJQUNqQixRQUFRLENBQUUsRUFBZSxFQUFFLE9BQThCO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBaUIsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDdkUsa0RBQWtEO1FBQ2xELG1EQUFtRDtRQUNuRCwrQ0FBK0M7UUFDL0MsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7WUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQSxDQUFDLDhCQUE4QjtRQUM5QyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM1QyxFQUFFLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQTtJQUM1QixDQUFDO0lBRUQsTUFBTSxDQUFFLEVBQWU7UUFDckIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhO1lBQUUsT0FBTTtRQUU3QixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztZQUM5QyxRQUFRLENBQUMsSUFBSSxDQUFBLENBQUMsOEJBQThCO1FBQzlDLEdBQUcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDL0QsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFBO0lBQ3pCLENBQUM7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVk5vZGVEaXJlY3RpdmUgfSBmcm9tICd2dWUvdHlwZXMvdm5vZGUnXHJcblxyXG5pbnRlcmZhY2UgQ2xpY2tPdXRzaWRlQmluZGluZ0FyZ3Mge1xyXG4gIGNsb3NlQ29uZGl0aW9uYWw/OiAoZTogRXZlbnQpID0+IGJvb2xlYW5cclxuICBpbmNsdWRlPzogKCkgPT4gSFRNTEVsZW1lbnRbXVxyXG59XHJcblxyXG5pbnRlcmZhY2UgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlIGV4dGVuZHMgVk5vZGVEaXJlY3RpdmUge1xyXG4gIHZhbHVlPzogKGU6IEV2ZW50KSA9PiB2b2lkXHJcbiAgYXJncz86IENsaWNrT3V0c2lkZUJpbmRpbmdBcmdzXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlQ29uZGl0aW9uYWwgKCkge1xyXG4gIHJldHVybiBmYWxzZVxyXG59XHJcblxyXG5mdW5jdGlvbiBkaXJlY3RpdmUgKGU6IFBvaW50ZXJFdmVudCwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBDbGlja091dHNpZGVEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAvLyBBcmdzIG1heSBub3QgYWx3YXlzIGJlIHN1cHBsaWVkXHJcbiAgYmluZGluZy5hcmdzID0gYmluZGluZy5hcmdzIHx8IHt9XHJcblxyXG4gIC8vIElmIG5vIGNsb3NlQ29uZGl0aW9uYWwgd2FzIHN1cHBsaWVkIGFzc2lnbiBhIGRlZmF1bHRcclxuICBjb25zdCBpc0FjdGl2ZSA9IChiaW5kaW5nLmFyZ3MuY2xvc2VDb25kaXRpb25hbCB8fCBjbG9zZUNvbmRpdGlvbmFsKVxyXG5cclxuICAvLyBUaGUgaW5jbHVkZSBlbGVtZW50IGNhbGxiYWNrcyBiZWxvdyBjYW4gYmUgZXhwZW5zaXZlXHJcbiAgLy8gc28gd2Ugc2hvdWxkIGF2b2lkIGNhbGxpbmcgdGhlbSB3aGVuIHdlJ3JlIG5vdCBhY3RpdmUuXHJcbiAgLy8gRXhwbGljaXRseSBjaGVjayBmb3IgZmFsc2UgdG8gYWxsb3cgZmFsbGJhY2sgY29tcGF0aWJpbGl0eVxyXG4gIC8vIHdpdGggbm9uLXRvZ2dsZWFibGUgY29tcG9uZW50c1xyXG4gIGlmICghZSB8fCBpc0FjdGl2ZShlKSA9PT0gZmFsc2UpIHJldHVyblxyXG5cclxuICAvLyBJZiBjbGljayB3YXMgdHJpZ2dlcmVkIHByb2dyYW1tYXRpY2FseSAoZG9tRWwuY2xpY2soKSkgdGhlblxyXG4gIC8vIGl0IHNob3VsZG4ndCBiZSB0cmVhdGVkIGFzIGNsaWNrLW91dHNpZGVcclxuICAvLyBDaHJvbWUvRmlyZWZveCBzdXBwb3J0IGlzVHJ1c3RlZCBwcm9wZXJ0eVxyXG4gIC8vIElFL0VkZ2Ugc3VwcG9ydCBwb2ludGVyVHlwZSBwcm9wZXJ0eSAoZW1wdHkgaWYgbm90IHRyaWdnZXJlZFxyXG4gIC8vIGJ5IHBvaW50aW5nIGRldmljZSlcclxuICBpZiAoKCdpc1RydXN0ZWQnIGluIGUgJiYgIWUuaXNUcnVzdGVkKSB8fFxyXG4gICAgKCdwb2ludGVyVHlwZScgaW4gZSAmJiAhZS5wb2ludGVyVHlwZSlcclxuICApIHJldHVyblxyXG5cclxuICAvLyBDaGVjayBpZiBhZGRpdGlvbmFsIGVsZW1lbnRzIHdlcmUgcGFzc2VkIHRvIGJlIGluY2x1ZGVkIGluIGNoZWNrXHJcbiAgLy8gKGNsaWNrIG11c3QgYmUgb3V0c2lkZSBhbGwgaW5jbHVkZWQgZWxlbWVudHMsIGlmIGFueSlcclxuICBjb25zdCBlbGVtZW50cyA9IChiaW5kaW5nLmFyZ3MuaW5jbHVkZSB8fCAoKCkgPT4gW10pKSgpXHJcbiAgLy8gQWRkIHRoZSByb290IGVsZW1lbnQgZm9yIHRoZSBjb21wb25lbnQgdGhpcyBkaXJlY3RpdmUgd2FzIGRlZmluZWQgb25cclxuICBlbGVtZW50cy5wdXNoKGVsKVxyXG5cclxuICAvLyBDaGVjayBpZiBpdCdzIGEgY2xpY2sgb3V0c2lkZSBvdXIgZWxlbWVudHMsIGFuZCB0aGVuIGlmIG91ciBjYWxsYmFjayByZXR1cm5zIHRydWUuXHJcbiAgLy8gTm9uLXRvZ2dsZWFibGUgY29tcG9uZW50cyBzaG91bGQgdGFrZSBhY3Rpb24gaW4gdGhlaXIgY2FsbGJhY2sgYW5kIHJldHVybiBmYWxzeS5cclxuICAvLyBUb2dnbGVhYmxlIGNhbiByZXR1cm4gdHJ1ZSBpZiBpdCB3YW50cyB0byBkZWFjdGl2YXRlLlxyXG4gIC8vIE5vdGUgdGhhdCwgYmVjYXVzZSB3ZSdyZSBpbiB0aGUgY2FwdHVyZSBwaGFzZSwgdGhpcyBjYWxsYmFjayB3aWxsIG9jY3VyIGJlZm9yZVxyXG4gIC8vIHRoZSBidWJibGluZyBjbGljayBldmVudCBvbiBhbnkgb3V0c2lkZSBlbGVtZW50cy5cclxuICAhZWxlbWVudHMuc29tZShlbCA9PiBlbC5jb250YWlucyhlLnRhcmdldCBhcyBOb2RlKSkgJiYgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBpc0FjdGl2ZShlKSAmJiBiaW5kaW5nLnZhbHVlICYmIGJpbmRpbmcudmFsdWUoZSlcclxuICB9LCAwKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgLy8gW2RhdGEtYXBwXSBtYXkgbm90IGJlIGZvdW5kXHJcbiAgLy8gaWYgdXNpbmcgYmluZCwgaW5zZXJ0ZWQgbWFrZXNcclxuICAvLyBzdXJlIHRoYXQgdGhlIHJvb3QgZWxlbWVudCBpc1xyXG4gIC8vIGF2YWlsYWJsZSwgaU9TIGRvZXMgbm90IHN1cHBvcnRcclxuICAvLyBjbGlja3Mgb24gYm9keVxyXG4gIGluc2VydGVkIChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IENsaWNrT3V0c2lkZURpcmVjdGl2ZSkge1xyXG4gICAgY29uc3Qgb25DbGljayA9IChlOiBFdmVudCkgPT4gZGlyZWN0aXZlKGUgYXMgUG9pbnRlckV2ZW50LCBlbCwgYmluZGluZylcclxuICAgIC8vIGlPUyBkb2VzIG5vdCByZWNvZ25pemUgY2xpY2sgZXZlbnRzIG9uIGRvY3VtZW50XHJcbiAgICAvLyBvciBib2R5LCB0aGlzIGlzIHRoZSBlbnRpcmUgcHVycG9zZSBvZiB0aGUgdi1hcHBcclxuICAgIC8vIGNvbXBvbmVudCBhbmQgW2RhdGEtYXBwXSwgc3RvcCByZW1vdmluZyB0aGlzXHJcbiAgICBjb25zdCBhcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hcHBdJykgfHxcclxuICAgICAgZG9jdW1lbnQuYm9keSAvLyBUaGlzIGlzIG9ubHkgZm9yIHVuaXQgdGVzdHNcclxuICAgIGFwcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIHRydWUpXHJcbiAgICBlbC5fY2xpY2tPdXRzaWRlID0gb25DbGlja1xyXG4gIH0sXHJcblxyXG4gIHVuYmluZCAoZWw6IEhUTUxFbGVtZW50KSB7XHJcbiAgICBpZiAoIWVsLl9jbGlja091dHNpZGUpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IGFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwcF0nKSB8fFxyXG4gICAgICBkb2N1bWVudC5ib2R5IC8vIFRoaXMgaXMgb25seSBmb3IgdW5pdCB0ZXN0c1xyXG4gICAgYXBwICYmIGFwcC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGVsLl9jbGlja091dHNpZGUsIHRydWUpXHJcbiAgICBkZWxldGUgZWwuX2NsaWNrT3V0c2lkZVxyXG4gIH1cclxufVxyXG4iXX0=