export default function isDateAllowed(date, min, max, allowedFn) {
    return (!allowedFn || allowedFn(date)) &&
        (!min || date >= min) &&
        (!max || date <= max);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNEYXRlQWxsb3dlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRlUGlja2VyL3V0aWwvaXNEYXRlQWxsb3dlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsT0FBTyxVQUFVLGFBQWEsQ0FBRSxJQUFZLEVBQUUsR0FBVyxFQUFFLEdBQVcsRUFBRSxTQUEwQztJQUN2SCxPQUFPLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztRQUNyQixDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQTtBQUN6QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgQWxsb3dlZERhdGVGdW5jdGlvbiA9IChkYXRlOiBzdHJpbmcpID0+IGJvb2xlYW5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzRGF0ZUFsbG93ZWQgKGRhdGU6IHN0cmluZywgbWluOiBzdHJpbmcsIG1heDogc3RyaW5nLCBhbGxvd2VkRm46IEFsbG93ZWREYXRlRnVuY3Rpb24gfCB1bmRlZmluZWQpIHtcclxuICByZXR1cm4gKCFhbGxvd2VkRm4gfHwgYWxsb3dlZEZuKGRhdGUpKSAmJlxyXG4gICAgKCFtaW4gfHwgZGF0ZSA+PSBtaW4pICYmXHJcbiAgICAoIW1heCB8fCBkYXRlIDw9IG1heClcclxufVxyXG4iXX0=