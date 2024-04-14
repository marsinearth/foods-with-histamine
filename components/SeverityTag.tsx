import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'tamagui';

export type SeverityTagProps = {
  severity?: number;
  histamine: number;
};

export default function SeverityTag({ severity, histamine }: SeverityTagProps) {
  const [label, backgroundColor] = useMemo(() => {
    switch (severity) {
      case 4:
        return ['과도', 'firebrick'];
      case 2:
        return ['중간', 'goldenrod'];
      case 1:
        return ['낮음', 'limegreen'];
      default:
        return ['높음', 'tomato'];
    }
  }, [severity]);

  return (
    <View style={{ ...styles.tag, backgroundColor }}>
      <Text fontSize="$1" fontWeight="900" color="white">
        {label}
        {histamine ? ` (${histamine.toLocaleString()}mg/kg)` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexShrink: 0,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
