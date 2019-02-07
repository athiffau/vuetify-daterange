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
                this.isActive = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1rZXlhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVk1lbnUvbWl4aW5zL21lbnUta2V5YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7R0FRRztBQUVILFFBQVE7QUFDUixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUE7QUFFaEQsb0JBQW9CO0FBQ3BCLGVBQWU7SUFDYixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsT0FBTztLQUNyQjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNiLEtBQUssRUFBRSxFQUFFO0tBQ1YsQ0FBQztJQUVGLEtBQUssRUFBRTtRQUNMLFFBQVEsQ0FBRSxHQUFHO1lBQ1gsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUMvQixDQUFDO1FBQ0QsU0FBUyxDQUFFLElBQUksRUFBRSxJQUFJO1lBQ25CLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUE7Z0JBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUE7YUFDbEU7WUFFRCxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO1FBQ2xFLENBQUM7S0FDRjtJQUVELE9BQU8sRUFBRTtRQUNQLFNBQVMsQ0FBRSxDQUFDO1lBQ1YsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO2FBQ3RCO2lCQUFNLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsR0FBRyxFQUFFO2dCQUNyQyxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO3dCQUN4RCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtxQkFDdEI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUE7YUFDSDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ3hCO1FBQ0gsQ0FBQztRQUNELGVBQWUsQ0FBRSxDQUFDO1lBQ2hCLDZEQUE2RDtZQUM3RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7WUFFZixJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDekUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUNoQix1Q0FBdUM7Z0JBQ3ZDLHNDQUFzQzthQUN2QztpQkFBTSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUMzRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7YUFDakI7aUJBQU0sSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDaEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7YUFDbkM7aUJBQU07Z0JBQUUsT0FBTTthQUFFO1lBQ2pCLGdFQUFnRTtZQUNoRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDcEIsQ0FBQztRQUNELFFBQVE7WUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFBO1FBQ25FLENBQUM7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogTWVudSBrZXlhYmxlXHJcbiAqXHJcbiAqIEBtaXhpblxyXG4gKlxyXG4gKiBQcmltYXJpbHkgdXNlZCB0byBzdXBwb3J0IFZTZWxlY3RcclxuICogSGFuZGxlcyBvcGVuaW5nIGFuZCBjbG9zaW5nIG9mIFZNZW51IGZyb20ga2V5c3Ryb2tlc1xyXG4gKiBXaWxsIGNvbmRpdGlvbmFsbHkgaGlnaGxpZ2h0IFZMaXN0VGlsZXMgZm9yIFZTZWxlY3RcclxuICovXHJcblxyXG4vLyBVdGlsc1xyXG5pbXBvcnQgeyBrZXlDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvaGVscGVycydcclxuXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBwcm9wczoge1xyXG4gICAgZGlzYWJsZUtleXM6IEJvb2xlYW5cclxuICB9LFxyXG5cclxuICBkYXRhOiAoKSA9PiAoe1xyXG4gICAgbGlzdEluZGV4OiAtMSxcclxuICAgIHRpbGVzOiBbXVxyXG4gIH0pLFxyXG5cclxuICB3YXRjaDoge1xyXG4gICAgaXNBY3RpdmUgKHZhbCkge1xyXG4gICAgICBpZiAoIXZhbCkgdGhpcy5saXN0SW5kZXggPSAtMVxyXG4gICAgfSxcclxuICAgIGxpc3RJbmRleCAobmV4dCwgcHJldikge1xyXG4gICAgICBpZiAobmV4dCBpbiB0aGlzLnRpbGVzKSB7XHJcbiAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMudGlsZXNbbmV4dF1cclxuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoJ3YtbGlzdF9fdGlsZS0taGlnaGxpZ2h0ZWQnKVxyXG4gICAgICAgIHRoaXMuJHJlZnMuY29udGVudC5zY3JvbGxUb3AgPSB0aWxlLm9mZnNldFRvcCAtIHRpbGUuY2xpZW50SGVpZ2h0XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByZXYgaW4gdGhpcy50aWxlcyAmJlxyXG4gICAgICAgIHRoaXMudGlsZXNbcHJldl0uY2xhc3NMaXN0LnJlbW92ZSgndi1saXN0X190aWxlLS1oaWdobGlnaHRlZCcpXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgb25LZXlEb3duIChlKSB7XHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmVzYykge1xyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZVxyXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0ga2V5Q29kZXMudGFiKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuJHJlZnMuY29udGVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2VcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlTGlzdEluZGV4KGUpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaGFuZ2VMaXN0SW5kZXggKGUpIHtcclxuICAgICAgLy8gRm9yIGluZmluaXRlIHNjcm9sbCBhbmQgYXV0b2NvbXBsZXRlLCByZS1ldmFsdWF0ZSBjaGlsZHJlblxyXG4gICAgICB0aGlzLmdldFRpbGVzKClcclxuXHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLmRvd24gJiYgdGhpcy5saXN0SW5kZXggPCB0aGlzLnRpbGVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICB0aGlzLmxpc3RJbmRleCsrXHJcbiAgICAgICAgLy8gQWxsb3cgdXNlciB0byBzZXQgbGlzdEluZGV4IHRvIC0xIHNvXHJcbiAgICAgICAgLy8gdGhhdCB0aGUgbGlzdCBjYW4gYmUgdW4taGlnaGxpZ2h0ZWRcclxuICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IGtleUNvZGVzLnVwICYmIHRoaXMubGlzdEluZGV4ID4gLTEpIHtcclxuICAgICAgICB0aGlzLmxpc3RJbmRleC0tXHJcbiAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSBrZXlDb2Rlcy5lbnRlciAmJiB0aGlzLmxpc3RJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLnRpbGVzW3RoaXMubGlzdEluZGV4XS5jbGljaygpXHJcbiAgICAgIH0gZWxzZSB7IHJldHVybiB9XHJcbiAgICAgIC8vIE9uZSBvZiB0aGUgY29uZGl0aW9ucyB3YXMgbWV0LCBwcmV2ZW50IGRlZmF1bHQgYWN0aW9uICgjMjk4OClcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICB9LFxyXG4gICAgZ2V0VGlsZXMgKCkge1xyXG4gICAgICB0aGlzLnRpbGVzID0gdGhpcy4kcmVmcy5jb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy52LWxpc3RfX3RpbGUnKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=