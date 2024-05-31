import React, { useMemo } from 'react';

import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

const ModalBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], 'clamp'),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: 'rgba(0, 0, 0, .5)',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
};

export default ModalBackdrop;
