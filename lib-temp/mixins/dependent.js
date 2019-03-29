import mixins from '../util/mixins';
function searchChildren(children) {
    const results = [];
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.isActive && child.isDependent) {
            results.push(child);
        }
        else {
            results.push(...searchChildren(child.$children));
        }
    }
    return results;
}
/* @vue/component */
export default mixins().extend({
    name: 'dependent',
    data() {
        return {
            closeDependents: true,
            isActive: false,
            isDependent: true
        };
    },
    watch: {
        isActive(val) {
            if (val)
                return;
            const openDependents = this.getOpenDependents();
            for (let index = 0; index < openDependents.length; index++) {
                openDependents[index].isActive = false;
            }
        }
    },
    methods: {
        getOpenDependents() {
            if (this.closeDependents)
                return searchChildren(this.$children);
            return [];
        },
        getOpenDependentElements() {
            const result = [];
            const openDependents = this.getOpenDependents();
            for (let index = 0; index < openDependents.length; index++) {
                result.push(...openDependents[index].getClickableDependentElements());
            }
            return result;
        },
        getClickableDependentElements() {
            const result = [this.$el];
            if (this.$refs.content)
                result.push(this.$refs.content);
            if (this.overlay)
                result.push(this.overlay);
            result.push(...this.getOpenDependentElements());
            return result;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9kZXBlbmRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxNQUFNLE1BQU0sZ0JBQWdCLENBQUE7QUFlbkMsU0FBUyxjQUFjLENBQUUsUUFBZTtJQUN0QyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUE7SUFDbEIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDcEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBc0IsQ0FBQTtRQUNsRCxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ3BCO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1NBQ2pEO0tBQ0Y7SUFFRCxPQUFPLE9BQU8sQ0FBQTtBQUNoQixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksRUFBRSxXQUFXO0lBRWpCLElBQUk7UUFDRixPQUFPO1lBQ0wsZUFBZSxFQUFFLElBQUk7WUFDckIsUUFBUSxFQUFFLEtBQUs7WUFDZixXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLFFBQVEsQ0FBRSxHQUFHO1lBQ1gsSUFBSSxHQUFHO2dCQUFFLE9BQU07WUFFZixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUMvQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUQsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7YUFDdkM7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxpQkFBaUI7WUFDZixJQUFJLElBQUksQ0FBQyxlQUFlO2dCQUFFLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUUvRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFDRCx3QkFBd0I7WUFDdEIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBRS9DLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQTthQUN0RTtZQUVELE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUNELDZCQUE2QjtZQUMzQixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDdkQsSUFBSSxJQUFJLENBQUMsT0FBTztnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQTtZQUUvQyxPQUFPLE1BQU0sQ0FBQTtRQUNmLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xyXG5cclxuaW1wb3J0IG1peGlucyBmcm9tICcuLi91dGlsL21peGlucydcclxuXHJcbmludGVyZmFjZSBvcHRpb25zIGV4dGVuZHMgVnVlIHtcclxuICAkZWw6IEhUTUxFbGVtZW50XHJcbiAgJHJlZnM6IHtcclxuICAgIGNvbnRlbnQ6IEhUTUxFbGVtZW50XHJcbiAgfVxyXG4gIG92ZXJsYXk/OiBIVE1MRWxlbWVudFxyXG59XHJcblxyXG5pbnRlcmZhY2UgRGVwZW5kZW50SW5zdGFuY2UgZXh0ZW5kcyBWdWUge1xyXG4gIGlzQWN0aXZlPzogYm9vbGVhblxyXG4gIGlzRGVwZW5kZW50PzogYm9vbGVhblxyXG59XHJcblxyXG5mdW5jdGlvbiBzZWFyY2hDaGlsZHJlbiAoY2hpbGRyZW46IFZ1ZVtdKTogRGVwZW5kZW50SW5zdGFuY2VbXSB7XHJcbiAgY29uc3QgcmVzdWx0cyA9IFtdXHJcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGNoaWxkcmVuLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpbmRleF0gYXMgRGVwZW5kZW50SW5zdGFuY2VcclxuICAgIGlmIChjaGlsZC5pc0FjdGl2ZSAmJiBjaGlsZC5pc0RlcGVuZGVudCkge1xyXG4gICAgICByZXN1bHRzLnB1c2goY2hpbGQpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHRzLnB1c2goLi4uc2VhcmNoQ2hpbGRyZW4oY2hpbGQuJGNoaWxkcmVuKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHRzXHJcbn1cclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IG1peGluczxvcHRpb25zPigpLmV4dGVuZCh7XHJcbiAgbmFtZTogJ2RlcGVuZGVudCcsXHJcblxyXG4gIGRhdGEgKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY2xvc2VEZXBlbmRlbnRzOiB0cnVlLFxyXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgIGlzRGVwZW5kZW50OiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgd2F0Y2g6IHtcclxuICAgIGlzQWN0aXZlICh2YWwpIHtcclxuICAgICAgaWYgKHZhbCkgcmV0dXJuXHJcblxyXG4gICAgICBjb25zdCBvcGVuRGVwZW5kZW50cyA9IHRoaXMuZ2V0T3BlbkRlcGVuZGVudHMoKVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3BlbkRlcGVuZGVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgb3BlbkRlcGVuZGVudHNbaW5kZXhdLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldE9wZW5EZXBlbmRlbnRzICgpOiBhbnlbXSB7XHJcbiAgICAgIGlmICh0aGlzLmNsb3NlRGVwZW5kZW50cykgcmV0dXJuIHNlYXJjaENoaWxkcmVuKHRoaXMuJGNoaWxkcmVuKVxyXG5cclxuICAgICAgcmV0dXJuIFtdXHJcbiAgICB9LFxyXG4gICAgZ2V0T3BlbkRlcGVuZGVudEVsZW1lbnRzICgpOiBIVE1MRWxlbWVudFtdIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gW11cclxuICAgICAgY29uc3Qgb3BlbkRlcGVuZGVudHMgPSB0aGlzLmdldE9wZW5EZXBlbmRlbnRzKClcclxuXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcGVuRGVwZW5kZW50cy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICByZXN1bHQucHVzaCguLi5vcGVuRGVwZW5kZW50c1tpbmRleF0uZ2V0Q2xpY2thYmxlRGVwZW5kZW50RWxlbWVudHMoKSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfSxcclxuICAgIGdldENsaWNrYWJsZURlcGVuZGVudEVsZW1lbnRzICgpOiBIVE1MRWxlbWVudFtdIHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gW3RoaXMuJGVsXVxyXG4gICAgICBpZiAodGhpcy4kcmVmcy5jb250ZW50KSByZXN1bHQucHVzaCh0aGlzLiRyZWZzLmNvbnRlbnQpXHJcbiAgICAgIGlmICh0aGlzLm92ZXJsYXkpIHJlc3VsdC5wdXNoKHRoaXMub3ZlcmxheSlcclxuICAgICAgcmVzdWx0LnB1c2goLi4udGhpcy5nZXRPcGVuRGVwZW5kZW50RWxlbWVudHMoKSlcclxuXHJcbiAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdfQ==