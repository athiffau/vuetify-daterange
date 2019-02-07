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
            result.push(...this.getOpenDependentElements());
            return result;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21peGlucy9kZXBlbmRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxNQUFNLE1BQU0sZ0JBQWdCLENBQUE7QUFjbkMsU0FBUyxjQUFjLENBQUUsUUFBZTtJQUN0QyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUE7SUFDbEIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDcEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBc0IsQ0FBQTtRQUNsRCxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ3BCO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO1NBQ2pEO0tBQ0Y7SUFFRCxPQUFPLE9BQU8sQ0FBQTtBQUNoQixDQUFDO0FBRUQsb0JBQW9CO0FBQ3BCLGVBQWUsTUFBTSxFQUFXLENBQUMsTUFBTSxDQUFDO0lBQ3RDLElBQUksRUFBRSxXQUFXO0lBRWpCLElBQUk7UUFDRixPQUFPO1lBQ0wsZUFBZSxFQUFFLElBQUk7WUFDckIsUUFBUSxFQUFFLEtBQUs7WUFDZixXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssRUFBRTtRQUNMLFFBQVEsQ0FBRSxHQUFHO1lBQ1gsSUFBSSxHQUFHO2dCQUFFLE9BQU07WUFFZixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUMvQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDMUQsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7YUFDdkM7UUFDSCxDQUFDO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxpQkFBaUI7WUFDZixJQUFJLElBQUksQ0FBQyxlQUFlO2dCQUFFLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUUvRCxPQUFPLEVBQUUsQ0FBQTtRQUNYLENBQUM7UUFDRCx3QkFBd0I7WUFDdEIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBRS9DLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLDZCQUE2QixFQUFFLENBQUMsQ0FBQTthQUN0RTtZQUVELE9BQU8sTUFBTSxDQUFBO1FBQ2YsQ0FBQztRQUNELDZCQUE2QjtZQUMzQixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN6QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLENBQUE7WUFFL0MsT0FBTyxNQUFNLENBQUE7UUFDZixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcclxuXHJcbmltcG9ydCBtaXhpbnMgZnJvbSAnLi4vdXRpbC9taXhpbnMnXHJcblxyXG5pbnRlcmZhY2Ugb3B0aW9ucyBleHRlbmRzIFZ1ZSB7XHJcbiAgJGVsOiBIVE1MRWxlbWVudFxyXG4gICRyZWZzOiB7XHJcbiAgICBjb250ZW50OiBIVE1MRWxlbWVudFxyXG4gIH1cclxufVxyXG5cclxuaW50ZXJmYWNlIERlcGVuZGVudEluc3RhbmNlIGV4dGVuZHMgVnVlIHtcclxuICBpc0FjdGl2ZT86IGJvb2xlYW5cclxuICBpc0RlcGVuZGVudD86IGJvb2xlYW5cclxufVxyXG5cclxuZnVuY3Rpb24gc2VhcmNoQ2hpbGRyZW4gKGNoaWxkcmVuOiBWdWVbXSk6IERlcGVuZGVudEluc3RhbmNlW10ge1xyXG4gIGNvbnN0IHJlc3VsdHMgPSBbXVxyXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjaGlsZHJlbi5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baW5kZXhdIGFzIERlcGVuZGVudEluc3RhbmNlXHJcbiAgICBpZiAoY2hpbGQuaXNBY3RpdmUgJiYgY2hpbGQuaXNEZXBlbmRlbnQpIHtcclxuICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0cy5wdXNoKC4uLnNlYXJjaENoaWxkcmVuKGNoaWxkLiRjaGlsZHJlbikpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0c1xyXG59XHJcblxyXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xyXG5leHBvcnQgZGVmYXVsdCBtaXhpbnM8b3B0aW9ucz4oKS5leHRlbmQoe1xyXG4gIG5hbWU6ICdkZXBlbmRlbnQnLFxyXG5cclxuICBkYXRhICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGNsb3NlRGVwZW5kZW50czogdHJ1ZSxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgICBpc0RlcGVuZGVudDogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0FjdGl2ZSAodmFsKSB7XHJcbiAgICAgIGlmICh2YWwpIHJldHVyblxyXG5cclxuICAgICAgY29uc3Qgb3BlbkRlcGVuZGVudHMgPSB0aGlzLmdldE9wZW5EZXBlbmRlbnRzKClcclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wZW5EZXBlbmRlbnRzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIG9wZW5EZXBlbmRlbnRzW2luZGV4XS5pc0FjdGl2ZSA9IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRPcGVuRGVwZW5kZW50cyAoKTogYW55W10ge1xyXG4gICAgICBpZiAodGhpcy5jbG9zZURlcGVuZGVudHMpIHJldHVybiBzZWFyY2hDaGlsZHJlbih0aGlzLiRjaGlsZHJlbilcclxuXHJcbiAgICAgIHJldHVybiBbXVxyXG4gICAgfSxcclxuICAgIGdldE9wZW5EZXBlbmRlbnRFbGVtZW50cyAoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdXHJcbiAgICAgIGNvbnN0IG9wZW5EZXBlbmRlbnRzID0gdGhpcy5nZXRPcGVuRGVwZW5kZW50cygpXHJcblxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3BlbkRlcGVuZGVudHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goLi4ub3BlbkRlcGVuZGVudHNbaW5kZXhdLmdldENsaWNrYWJsZURlcGVuZGVudEVsZW1lbnRzKCkpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXN1bHRcclxuICAgIH0sXHJcbiAgICBnZXRDbGlja2FibGVEZXBlbmRlbnRFbGVtZW50cyAoKTogSFRNTEVsZW1lbnRbXSB7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IFt0aGlzLiRlbF1cclxuICAgICAgaWYgKHRoaXMuJHJlZnMuY29udGVudCkgcmVzdWx0LnB1c2godGhpcy4kcmVmcy5jb250ZW50KVxyXG4gICAgICByZXN1bHQucHVzaCguLi50aGlzLmdldE9wZW5EZXBlbmRlbnRFbGVtZW50cygpKVxyXG5cclxuICAgICAgcmV0dXJuIHJlc3VsdFxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl19