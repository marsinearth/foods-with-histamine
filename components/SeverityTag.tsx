import { Text, View } from 'tamagui';

export type SeverityTagProps = {
  severity?: number;
  histamine: number;
};

const getTagInfo = (severity?: number) => {
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
};

export default function SeverityTag({ severity, histamine }: SeverityTagProps) {
  const [label, backgroundColor] = getTagInfo(severity);
  return (
    <View
      flexShrink={0}
      minWidth={35}
      justifyContent="center"
      alignItems="center"
      paddingHorizontal={6}
      paddingVertical={2}
      borderRadius={4}
      backgroundColor={backgroundColor}
    >
      <Text fontSize="$1" fontWeight="900" color="white">
        {label}
        {histamine ? ` (${histamine.toLocaleString()}mg/kg)` : ''}
      </Text>
    </View>
  );
}
