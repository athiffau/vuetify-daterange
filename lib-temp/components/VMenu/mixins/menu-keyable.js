/**
 * Menu keyable
 *
 * @mixin
 *
 * Primarily used to support VSelect
 * Handles opening and closing of VMenu from keystrokes
 * Will conditionally highlight VListTiles for VSelect
 */
// Utils
import { keyCodes } from '../../../util/helpers';
/* @vue/component */
export default {
    props: {
        disableKeys: Boolean
    },
    data: () => ({
        listIndex: -1,
        tiles: []
    }),
    watch: {
        isActive(val) {
            if (!val)
                this.listIndex = -1;
        },
        listIndex(next, prev) {
            if (next in this.tiles) {
                const tile = this.tiles[next];
                tile.classList.add('v-list__tile--highlighted');
                this.$refs.content.scrollTop = tile.offsetTop - tile.clientHeight;
            }
            prev in this.tiles &&
                this.tiles[prev].classList.remove('v-list__tile--highlighted');
        }
    },
    methods: {
        onKeyDown(e) {
            if (e.keyCode === keyCodes.esc) {
                // Wait for dependent elements to close first
                setTimeout(() => { this.isActive = false; });
                const activator = this.getActivator();
                this.$nextTick(() => activator && activator.focus());
            }
            else if (e.keyCode === keyCodes.tab) {
                setTimeout(() => {
                    if (!this.$refs.content.contains(document.activeElement)) {
                        this.isActive = false;
                    }
                });
            }
            else {
                this.changeListIndex(e);
            }
        },
        changeListIndex(e) {
            // For infinite scroll and autocomplete, re-evaluate children
            this.getTiles();
            if (e.keyCode === keyCodes.down && this.listIndex < this.tiles.length - 1) {
                this.listIndex++;
                // Allow user to set listIndex to -1 so
                // that the list can be un-highlighted
            }
            else if (e.keyCode === keyCodes.up && this.listIndex > -1) {
                this.listIndex--;
            }
            else if (e.keyCode === keyCodes.enter && this.listIndex !== -1) {
                this.tiles[this.listIndex].click();
            }
            else {
                return;
            }
            // One of the conditions was met, prevent default action (#2988)
            e.preventDefault();
        },
        getTiles() {
            this.tiles = this.$refs.content.querySelectorAll('.v-list__tile');
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1rZXlhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lbnUvbWl4aW5zL21lbnUta2V5YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILFFBQVE7QUFDUixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUE7QUFFaEQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsT0FBTztLQUNyQjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNiLEtBQUssRUFBRSxFQUFFO0tBQ1YsQ0FBQztJQUVGLEtBQUssRUFBRTtRQUNMLFFBQVEsQ0FBRSxHQUFHO1lBQ1gsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMvQixDQUFDO1FBQ0QsU0FBUyxDQUFFLElBQUksRUFBRSxJQUFJO1lBQ25CLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUE7Z0JBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUE7YUFDbEU7WUFFRCxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1FBQ2xFLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFNBQVMsQ0FBRSxDQUFDO1lBQ1YsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQzlCLDZDQUE2QztnQkFDN0MsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtnQkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7YUFDckQ7aUJBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7d0JBQ3hELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO3FCQUN0QjtnQkFDSCxDQUFDLENBQUMsQ0FBQTthQUNIO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDeEI7UUFDSCxDQUFDO1FBQ0QsZUFBZSxDQUFFLENBQUM7WUFDaEIsNkRBQTZEO1lBQzdELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtZQUVmLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN6RSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7Z0JBQ2hCLHVDQUF1QztnQkFDdkMsc0NBQXNDO2FBQ3ZDO2lCQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQzNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTthQUNqQjtpQkFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTthQUNuQztpQkFBTTtnQkFBRSxPQUFNO2FBQUU7WUFDakIsZ0VBQWdFO1lBQ2hFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtRQUNwQixDQUFDO1FBQ0QsUUFBUTtZQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDbkUsQ0FBQztLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBNZW51IGtleWFibGVcclxuICpcclxuICogQG1peGluXHJcbiAqXHJcbiAqIFByaW1hcmlseSB1c2VkIHRvIHN1cHBvcnQgVlNlbGVjdFxyXG4gKiBIYW5kbGVzIG9wZW5pbmcgYW5kIGNsb3Npbmcgb2YgVk1lbnUgZnJvbSBrZXlzdHJva2VzXHJcbiAqIFdpbGwgY29uZGl0aW9uYWxseSBoaWdobGlnaHQgVkxpc3RUaWxlcyBmb3IgVlNlbGVjdFxyXG4gKi9cclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCB7IGtleUNvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9oZWxwZXJzJ1xyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHByb3BzOiB7XHJcbiAgICBkaXNhYmxlS2V5czogQm9vbGVhblxyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBsaXN0SW5kZXg6IC0xLFxyXG4gICAgdGlsZXM6IFtdXHJcbiAgfSksXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICBpc0FjdGl2ZSAodmFsKSB7XHJcbiAgICAgIGlmICghdmFsKSB0aGlzLmxpc3RJbmRleCA9IC0xXHJcbiAgICB9LFxyXG4gICAgbGlzdEluZGV4IChuZXh0LCBwcmV2KSB7XHJcbiAgICAgIGlmIChuZXh0IGluIHRoaXMudGlsZXMpIHtcclxuICAgICAgICBjb25zdCB0aWxlID0gdGhpcy50aWxlc1tuZXh0XVxyXG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZCgndi1saXN0X190aWxlLS1oaWdobGlnaHRlZCcpXHJcbiAgICAgICAgdGhpcy4kcmVmcy5jb250ZW50LnNjcm9sbFRvcCA9IHRpbGUub2Zmc2V0VG9wIC0gdGlsZS5jbGllbnRIZWlnaHRcclxuICAgICAgfVxyXG5cclxuICAgICAgcHJldiBpbiB0aGlzLnRpbGVzICYmXHJcbiAgICAgICAgdGhpcy50aWxlc1twcmV2XS5jbGFzc0xpc3QucmVtb3ZlKCd2LWxpc3RfX3RpbGUtLWhpZ2hsaWdodGVkJylcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBtZXRob2RzOiB7XHJcbiAgICBvbktleURvd24gKGUpIHtcclxuICAgICAgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMuZXNjKSB7XHJcbiAgICAgICAgLy8gV2FpdCBmb3IgZGVwZW5kZW50IGVsZW1lbnRzIHRvIGNsb3NlIGZpcnN0XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuaXNBY3RpdmUgPSBmYWxzZSB9KVxyXG4gICAgICAgIGNvbnN0IGFjdGl2YXRvciA9IHRoaXMuZ2V0QWN0aXZhdG9yKClcclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiBhY3RpdmF0b3IgJiYgYWN0aXZhdG9yLmZvY3VzKCkpXHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy50YWIpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIGlmICghdGhpcy4kcmVmcy5jb250ZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VMaXN0SW5kZXgoZSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNoYW5nZUxpc3RJbmRleCAoZSkge1xyXG4gICAgICAvLyBGb3IgaW5maW5pdGUgc2Nyb2xsIGFuZCBhdXRvY29tcGxldGUsIHJlLWV2YWx1YXRlIGNoaWxkcmVuXHJcbiAgICAgIHRoaXMuZ2V0VGlsZXMoKVxyXG5cclxuICAgICAgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMuZG93biAmJiB0aGlzLmxpc3RJbmRleCA8IHRoaXMudGlsZXMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIHRoaXMubGlzdEluZGV4KytcclxuICAgICAgICAvLyBBbGxvdyB1c2VyIHRvIHNldCBsaXN0SW5kZXggdG8gLTEgc29cclxuICAgICAgICAvLyB0aGF0IHRoZSBsaXN0IGNhbiBiZSB1bi1oaWdobGlnaHRlZFxyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMudXAgJiYgdGhpcy5saXN0SW5kZXggPiAtMSkge1xyXG4gICAgICAgIHRoaXMubGlzdEluZGV4LS1cclxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVudGVyICYmIHRoaXMubGlzdEluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMudGlsZXNbdGhpcy5saXN0SW5kZXhdLmNsaWNrKClcclxuICAgICAgfSBlbHNlIHsgcmV0dXJuIH1cclxuICAgICAgLy8gT25lIG9mIHRoZSBjb25kaXRpb25zIHdhcyBtZXQsIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24gKCMyOTg4KVxyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH0sXHJcbiAgICBnZXRUaWxlcyAoKSB7XHJcbiAgICAgIHRoaXMudGlsZXMgPSB0aGlzLiRyZWZzLmNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnLnYtbGlzdF9fdGlsZScpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==