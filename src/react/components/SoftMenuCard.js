import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Icon from '@controleonline/../../src/components/HomeIcon';

export default function SoftMenuCard({styles, label, icon, onPress}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      style={styles.cardOuter} onPress={onPress}>
      {({hovered, focused, pressed}) => {
        const highlighted = hovered || focused;
        return (
          <View style={[styles.card, highlighted && styles.cardHighlighted,
            pressed && styles.cardPressed]}>
            <View style={[styles.cardIcon,
              {backgroundColor: styles.palette.segmentTone.background}]}>
              <Icon name={icon || 'circle'} size={styles.iconSize}
                color={styles.palette.segmentTone.foreground} />
            </View>
            <Text style={styles.cardLabel}>{label}</Text>
            {styles.showChevron && <Icon name="chevron-right" size={14}
              color={highlighted ? styles.palette.segmentTone.foreground : styles.palette.muted}
              style={[styles.cardChevron, highlighted && styles.cardChevronHighlighted]} />}
          </View>
        );
      }}
    </Pressable>
  );
}
