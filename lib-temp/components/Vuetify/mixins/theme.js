/* eslint-disable no-multi-spaces */
const THEME_DEFAULTS = {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00' // orange.darken1
};
export default function theme(theme = {}) {
    if (theme === false)
        return false;
    return {
        ...THEME_DEFAULTS,
        ...theme
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WdWV0aWZ5L21peGlucy90aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxvQ0FBb0M7QUFDcEMsTUFBTSxjQUFjLEdBQUc7SUFDckIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsU0FBUyxFQUFFLFNBQVM7SUFDcEIsTUFBTSxFQUFFLFNBQVM7SUFDakIsS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsU0FBUztJQUNsQixPQUFPLEVBQUUsU0FBUyxDQUFJLGlCQUFpQjtDQUN4QyxDQUFBO0FBRUQsTUFBTSxDQUFDLE9BQU8sVUFBVSxLQUFLLENBQUUsUUFBb0MsRUFBRTtJQUNuRSxJQUFJLEtBQUssS0FBSyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUE7SUFFakMsT0FBTztRQUNMLEdBQUcsY0FBYztRQUNqQixHQUFHLEtBQUs7S0FDVCxDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFZ1ZXRpZnlVc2VPcHRpb25zLCBWdWV0aWZ5VGhlbWUgfSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUgbm8tbXVsdGktc3BhY2VzICovXHJcbmNvbnN0IFRIRU1FX0RFRkFVTFRTID0ge1xyXG4gIHByaW1hcnk6ICcjMTk3NkQyJywgICAvLyBibHVlLmRhcmtlbjJcclxuICBzZWNvbmRhcnk6ICcjNDI0MjQyJywgLy8gZ3JleS5kYXJrZW4zXHJcbiAgYWNjZW50OiAnIzgyQjFGRicsICAgIC8vIGJsdWUuYWNjZW50MVxyXG4gIGVycm9yOiAnI0ZGNTI1MicsICAgICAvLyByZWQuYWNjZW50MlxyXG4gIGluZm86ICcjMjE5NkYzJywgICAgICAvLyBibHVlLmJhc2VcclxuICBzdWNjZXNzOiAnIzRDQUY1MCcsICAgLy8gZ3JlZW4uYmFzZVxyXG4gIHdhcm5pbmc6ICcjRkI4QzAwJyAgICAvLyBvcmFuZ2UuZGFya2VuMVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0aGVtZSAodGhlbWU6IFZ1ZXRpZnlVc2VPcHRpb25zWyd0aGVtZSddID0ge30pOiBWdWV0aWZ5VGhlbWUgfCBmYWxzZSB7XHJcbiAgaWYgKHRoZW1lID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAuLi5USEVNRV9ERUZBVUxUUyxcclxuICAgIC4uLnRoZW1lXHJcbiAgfVxyXG59XHJcbiJdfQ==