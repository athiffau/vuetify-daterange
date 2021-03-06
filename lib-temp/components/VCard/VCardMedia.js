// Components
import VImg from '../VImg/VImg';
// Utils
import { deprecate } from '../../util/console';
/* istanbul ignore next */
/* @vue/component */
export default VImg.extend({
    name: 'v-card-media',
    mounted() {
        deprecate('v-card-media', this.src ? 'v-img' : 'v-responsive', this);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhcmRNZWRpYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZDYXJkL1ZDYXJkTWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYTtBQUNiLE9BQU8sSUFBSSxNQUFNLGNBQWMsQ0FBQTtBQUUvQixRQUFRO0FBQ1IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBRTlDLDBCQUEwQjtBQUMxQixvQkFBb0I7QUFDcEIsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3pCLElBQUksRUFBRSxjQUFjO0lBRXBCLE9BQU87UUFDTCxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ3RFLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb21wb25lbnRzXHJcbmltcG9ydCBWSW1nIGZyb20gJy4uL1ZJbWcvVkltZydcclxuXHJcbi8vIFV0aWxzXHJcbmltcG9ydCB7IGRlcHJlY2F0ZSB9IGZyb20gJy4uLy4uL3V0aWwvY29uc29sZSdcclxuXHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbi8qIEB2dWUvY29tcG9uZW50ICovXHJcbmV4cG9ydCBkZWZhdWx0IFZJbWcuZXh0ZW5kKHtcclxuICBuYW1lOiAndi1jYXJkLW1lZGlhJyxcclxuXHJcbiAgbW91bnRlZCAoKSB7XHJcbiAgICBkZXByZWNhdGUoJ3YtY2FyZC1tZWRpYScsIHRoaXMuc3JjID8gJ3YtaW1nJyA6ICd2LXJlc3BvbnNpdmUnLCB0aGlzKVxyXG4gIH1cclxufSlcclxuIl19