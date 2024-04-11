import { Paragraph, Spinner, View } from 'tamagui';

type LoadingViewprops = {
  label?: string;
};

export default function LoadingView({ label }: LoadingViewprops) {
  return (
    <View
      flex={1}
      flexDirection="column"
      paddingVertical={48}
      justifyContent="center"
      alignItems="center"
      gap="$4"
    >
      <Spinner size="large" color="$orange10" />
      <Paragraph>{label}</Paragraph>
    </View>
  );
}
