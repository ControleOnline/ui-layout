import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './HeaderCompanyBrand.styles';

/**
 * Centered company brand for Manager header: logo with company label underneath.
 */
export default function HeaderCompanyBrand({
  logoSource,
  label,
  labelColor,
  onPress,
  testID = 'header-company-brand',
}) {
  const content = (
    <View style={styles.wrap} testID={testID}>
      {logoSource ? (
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      {label ? (
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.label, labelColor ? { color: labelColor } : null]}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label || 'Home'}
      activeOpacity={0.82}
      style={styles.button}
      onPress={onPress}
      testID={`${testID}-button`}
    >
      {content}
    </TouchableOpacity>
  );
}
