# Animation & Gesture Reference

## useAnimatedTile sketch

```ts
const translateX = useSharedValue(0);
const translateY = useSharedValue(0);
const scale = useSharedValue(1);

const animateMove = (dx: number, dy: number) => {
  'worklet';
  translateX.value = withTiming(dx, { duration: SLIDE_DURATION_MS });
  translateY.value = withTiming(dy, { duration: SLIDE_DURATION_MS });
};

const animateMerge = () => {
  'worklet';
  scale.value = withSequence(
    withTiming(MERGE_SCALE, { duration: MERGE_DURATION_MS / 2 }),
    withSpring(1),
  );
};
```

## useSwipeGesture sketch

```ts
Gesture.Pan()
  .minDistance(SWIPE_MIN_DISTANCE)
  .minVelocity(SWIPE_VELOCITY_THRESHOLD)
  .onEnd((e) => {
    'worklet';
    // prefer velocity when |v| high; else translation
    // resolve UP|DOWN|LEFT|RIGHT
    runOnJS(onSwipe)(dir);
  });
```

Constants: `SWIPE_MIN_DISTANCE = 20`, `SWIPE_VELOCITY_THRESHOLD = 200`.
