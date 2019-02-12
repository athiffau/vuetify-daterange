const delta = 0.20689655172413793; // 6÷29
const cielabForwardTransform = (t) => (t > delta ** 3
    ? Math.cbrt(t)
    : (t / (3 * delta ** 2)) + 4 / 29);
const cielabReverseTransform = (t) => (t > delta
    ? t ** 3
    : (3 * delta ** 2) * (t - 4 / 29));
export function fromXYZ(xyz) {
    const transform = cielabForwardTransform;
    const transformedY = transform(xyz[1]);
    return [
        116 * transformedY - 16,
        500 * (transform(xyz[0] / 0.95047) - transformedY),
        200 * (transformedY - transform(xyz[2] / 1.08883))
    ];
}
export function toXYZ(lab) {
    const transform = cielabReverseTransform;
    const Ln = (lab[0] + 16) / 116;
    return [
        transform(Ln + lab[1] / 500) * 0.95047,
        transform(Ln),
        transform(Ln - lab[2] / 200) * 1.08883
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtQ0lFTEFCLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvY29sb3IvdHJhbnNmb3JtQ0lFTEFCLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFBLENBQUMsT0FBTztBQUV6QyxNQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBUyxFQUFVLEVBQUUsQ0FBQyxDQUNwRCxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUM7SUFDWixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FDcEMsQ0FBQTtBQUVELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFTLEVBQVUsRUFBRSxDQUFDLENBQ3BELENBQUMsR0FBRyxLQUFLO0lBQ1AsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ1IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQ3BDLENBQUE7QUFFRCxNQUFNLFVBQVUsT0FBTyxDQUFFLEdBQVE7SUFDL0IsTUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUE7SUFDeEMsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRXRDLE9BQU87UUFDTCxHQUFHLEdBQUcsWUFBWSxHQUFHLEVBQUU7UUFDdkIsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxZQUFZLENBQUM7UUFDbEQsR0FBRyxHQUFHLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7S0FDbkQsQ0FBQTtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsS0FBSyxDQUFFLEdBQVE7SUFDN0IsTUFBTSxTQUFTLEdBQUcsc0JBQXNCLENBQUE7SUFDeEMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFBO0lBQzlCLE9BQU87UUFDTCxTQUFTLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPO1FBQ3RDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDYixTQUFTLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxPQUFPO0tBQ3ZDLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgWFlaLCBMQUIgfSBmcm9tICcuLi9jb2xvclV0aWxzJ1xyXG5cclxuY29uc3QgZGVsdGEgPSAwLjIwNjg5NjU1MTcyNDEzNzkzIC8vIDbDtzI5XHJcblxyXG5jb25zdCBjaWVsYWJGb3J3YXJkVHJhbnNmb3JtID0gKHQ6IG51bWJlcik6IG51bWJlciA9PiAoXHJcbiAgdCA+IGRlbHRhICoqIDNcclxuICAgID8gTWF0aC5jYnJ0KHQpXHJcbiAgICA6ICh0IC8gKDMgKiBkZWx0YSAqKiAyKSkgKyA0IC8gMjlcclxuKVxyXG5cclxuY29uc3QgY2llbGFiUmV2ZXJzZVRyYW5zZm9ybSA9ICh0OiBudW1iZXIpOiBudW1iZXIgPT4gKFxyXG4gIHQgPiBkZWx0YVxyXG4gICAgPyB0ICoqIDNcclxuICAgIDogKDMgKiBkZWx0YSAqKiAyKSAqICh0IC0gNCAvIDI5KVxyXG4pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZnJvbVhZWiAoeHl6OiBYWVopOiBMQUIge1xyXG4gIGNvbnN0IHRyYW5zZm9ybSA9IGNpZWxhYkZvcndhcmRUcmFuc2Zvcm1cclxuICBjb25zdCB0cmFuc2Zvcm1lZFkgPSB0cmFuc2Zvcm0oeHl6WzFdKVxyXG5cclxuICByZXR1cm4gW1xyXG4gICAgMTE2ICogdHJhbnNmb3JtZWRZIC0gMTYsXHJcbiAgICA1MDAgKiAodHJhbnNmb3JtKHh5elswXSAvIDAuOTUwNDcpIC0gdHJhbnNmb3JtZWRZKSxcclxuICAgIDIwMCAqICh0cmFuc2Zvcm1lZFkgLSB0cmFuc2Zvcm0oeHl6WzJdIC8gMS4wODg4MykpXHJcbiAgXVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9YWVogKGxhYjogTEFCKTogWFlaIHtcclxuICBjb25zdCB0cmFuc2Zvcm0gPSBjaWVsYWJSZXZlcnNlVHJhbnNmb3JtXHJcbiAgY29uc3QgTG4gPSAobGFiWzBdICsgMTYpIC8gMTE2XHJcbiAgcmV0dXJuIFtcclxuICAgIHRyYW5zZm9ybShMbiArIGxhYlsxXSAvIDUwMCkgKiAwLjk1MDQ3LFxyXG4gICAgdHJhbnNmb3JtKExuKSxcclxuICAgIHRyYW5zZm9ybShMbiAtIGxhYlsyXSAvIDIwMCkgKiAxLjA4ODgzXHJcbiAgXVxyXG59XHJcbiJdfQ==