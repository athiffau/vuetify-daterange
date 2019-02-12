import { upperFirst } from '../../util/helpers';
export default function (expandedParentClass = '', x = false) {
    const sizeProperty = x ? 'width' : 'height';
    return {
        beforeEnter(el) {
            el._parent = el.parentNode;
            el._initialStyle = {
                transition: el.style.transition,
                visibility: el.style.visibility,
                overflow: el.style.overflow,
                [sizeProperty]: el.style[sizeProperty]
            };
        },
        enter(el) {
            const initialStyle = el._initialStyle;
            el.style.setProperty('transition', 'none', 'important');
            el.style.visibility = 'hidden';
            const size = `${el['offset' + upperFirst(sizeProperty)]}px`;
            el.style.visibility = initialStyle.visibility;
            el.style.overflow = 'hidden';
            el.style[sizeProperty] = 0;
            void el.offsetHeight; // force reflow
            el.style.transition = initialStyle.transition;
            expandedParentClass && el._parent && el._parent.classList.add(expandedParentClass);
            requestAnimationFrame(() => {
                el.style[sizeProperty] = size;
            });
        },
        afterEnter: resetStyles,
        enterCancelled: resetStyles,
        leave(el) {
            el._initialStyle = {
                overflow: el.style.overflow,
                [sizeProperty]: el.style[sizeProperty]
            };
            el.style.overflow = 'hidden';
            el.style[sizeProperty] = `${el['offset' + upperFirst(sizeProperty)]}px`;
            void el.offsetHeight; // force reflow
            requestAnimationFrame(() => el.style[sizeProperty] = 0);
        },
        afterLeave,
        leaveCancelled: afterLeave
    };
    function afterLeave(el) {
        expandedParentClass && el._parent && el._parent.classList.remove(expandedParentClass);
        resetStyles(el);
    }
    function resetStyles(el) {
        el.style.overflow = el._initialStyle.overflow;
        el.style[sizeProperty] = el._initialStyle[sizeProperty];
        delete el._initialStyle;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kLXRyYW5zaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy90cmFuc2l0aW9ucy9leHBhbmQtdHJhbnNpdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFFL0MsTUFBTSxDQUFDLE9BQU8sV0FBVyxtQkFBbUIsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUs7SUFDMUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQTtJQUUzQyxPQUFPO1FBQ0wsV0FBVyxDQUFFLEVBQUU7WUFDYixFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUE7WUFDMUIsRUFBRSxDQUFDLGFBQWEsR0FBRztnQkFDakIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDL0IsVUFBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDL0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDM0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQzthQUN2QyxDQUFBO1FBQ0gsQ0FBQztRQUVELEtBQUssQ0FBRSxFQUFFO1lBQ1AsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQTtZQUNyQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1lBQ3ZELEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQTtZQUM5QixNQUFNLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUMzRCxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFBO1lBQzdDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtZQUM1QixFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUMxQixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUEsQ0FBQyxlQUFlO1lBQ3BDLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUE7WUFFN0MsbUJBQW1CLElBQUksRUFBRSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtZQUVsRixxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pCLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFBO1lBQy9CLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUVELFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLGNBQWMsRUFBRSxXQUFXO1FBRTNCLEtBQUssQ0FBRSxFQUFFO1lBQ1AsRUFBRSxDQUFDLGFBQWEsR0FBRztnQkFDakIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDM0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQzthQUN2QyxDQUFBO1lBRUQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1lBQzVCLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUE7WUFDdkUsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFBLENBQUMsZUFBZTtZQUVwQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3pELENBQUM7UUFFRCxVQUFVO1FBQ1YsY0FBYyxFQUFFLFVBQVU7S0FDM0IsQ0FBQTtJQUVELFNBQVMsVUFBVSxDQUFFLEVBQUU7UUFDckIsbUJBQW1CLElBQUksRUFBRSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUNyRixXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDakIsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFFLEVBQUU7UUFDdEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUE7UUFDN0MsRUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ3ZELE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQTtJQUN6QixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVwcGVyRmlyc3QgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoZXhwYW5kZWRQYXJlbnRDbGFzcyA9ICcnLCB4ID0gZmFsc2UpIHtcclxuICBjb25zdCBzaXplUHJvcGVydHkgPSB4ID8gJ3dpZHRoJyA6ICdoZWlnaHQnXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBiZWZvcmVFbnRlciAoZWwpIHtcclxuICAgICAgZWwuX3BhcmVudCA9IGVsLnBhcmVudE5vZGVcclxuICAgICAgZWwuX2luaXRpYWxTdHlsZSA9IHtcclxuICAgICAgICB0cmFuc2l0aW9uOiBlbC5zdHlsZS50cmFuc2l0aW9uLFxyXG4gICAgICAgIHZpc2liaWxpdHk6IGVsLnN0eWxlLnZpc2liaWxpdHksXHJcbiAgICAgICAgb3ZlcmZsb3c6IGVsLnN0eWxlLm92ZXJmbG93LFxyXG4gICAgICAgIFtzaXplUHJvcGVydHldOiBlbC5zdHlsZVtzaXplUHJvcGVydHldXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZW50ZXIgKGVsKSB7XHJcbiAgICAgIGNvbnN0IGluaXRpYWxTdHlsZSA9IGVsLl9pbml0aWFsU3R5bGVcclxuICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zaXRpb24nLCAnbm9uZScsICdpbXBvcnRhbnQnKVxyXG4gICAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbidcclxuICAgICAgY29uc3Qgc2l6ZSA9IGAke2VsWydvZmZzZXQnICsgdXBwZXJGaXJzdChzaXplUHJvcGVydHkpXX1weGBcclxuICAgICAgZWwuc3R5bGUudmlzaWJpbGl0eSA9IGluaXRpYWxTdHlsZS52aXNpYmlsaXR5XHJcbiAgICAgIGVsLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbidcclxuICAgICAgZWwuc3R5bGVbc2l6ZVByb3BlcnR5XSA9IDBcclxuICAgICAgdm9pZCBlbC5vZmZzZXRIZWlnaHQgLy8gZm9yY2UgcmVmbG93XHJcbiAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb24gPSBpbml0aWFsU3R5bGUudHJhbnNpdGlvblxyXG5cclxuICAgICAgZXhwYW5kZWRQYXJlbnRDbGFzcyAmJiBlbC5fcGFyZW50ICYmIGVsLl9wYXJlbnQuY2xhc3NMaXN0LmFkZChleHBhbmRlZFBhcmVudENsYXNzKVxyXG5cclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICBlbC5zdHlsZVtzaXplUHJvcGVydHldID0gc2l6ZVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBhZnRlckVudGVyOiByZXNldFN0eWxlcyxcclxuICAgIGVudGVyQ2FuY2VsbGVkOiByZXNldFN0eWxlcyxcclxuXHJcbiAgICBsZWF2ZSAoZWwpIHtcclxuICAgICAgZWwuX2luaXRpYWxTdHlsZSA9IHtcclxuICAgICAgICBvdmVyZmxvdzogZWwuc3R5bGUub3ZlcmZsb3csXHJcbiAgICAgICAgW3NpemVQcm9wZXJ0eV06IGVsLnN0eWxlW3NpemVQcm9wZXJ0eV1cclxuICAgICAgfVxyXG5cclxuICAgICAgZWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gICAgICBlbC5zdHlsZVtzaXplUHJvcGVydHldID0gYCR7ZWxbJ29mZnNldCcgKyB1cHBlckZpcnN0KHNpemVQcm9wZXJ0eSldfXB4YFxyXG4gICAgICB2b2lkIGVsLm9mZnNldEhlaWdodCAvLyBmb3JjZSByZWZsb3dcclxuXHJcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBlbC5zdHlsZVtzaXplUHJvcGVydHldID0gMClcclxuICAgIH0sXHJcblxyXG4gICAgYWZ0ZXJMZWF2ZSxcclxuICAgIGxlYXZlQ2FuY2VsbGVkOiBhZnRlckxlYXZlXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhZnRlckxlYXZlIChlbCkge1xyXG4gICAgZXhwYW5kZWRQYXJlbnRDbGFzcyAmJiBlbC5fcGFyZW50ICYmIGVsLl9wYXJlbnQuY2xhc3NMaXN0LnJlbW92ZShleHBhbmRlZFBhcmVudENsYXNzKVxyXG4gICAgcmVzZXRTdHlsZXMoZWwpXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNldFN0eWxlcyAoZWwpIHtcclxuICAgIGVsLnN0eWxlLm92ZXJmbG93ID0gZWwuX2luaXRpYWxTdHlsZS5vdmVyZmxvd1xyXG4gICAgZWwuc3R5bGVbc2l6ZVByb3BlcnR5XSA9IGVsLl9pbml0aWFsU3R5bGVbc2l6ZVByb3BlcnR5XVxyXG4gICAgZGVsZXRlIGVsLl9pbml0aWFsU3R5bGVcclxuICB9XHJcbn1cclxuIl19