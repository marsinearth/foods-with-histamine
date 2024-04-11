import { Info } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { usePreloadedQuery, type PreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import { Paragraph, Text, View, XStack, YStack } from 'tamagui';

import SeverityTag from './SeverityTag';

import type { FoodDetailQuery } from '@/relay/__generated__/FoodDetailQuery.graphql';
import { getCategoryIcon } from '@/utils/categoryIcon';

type FoodDetailProps = {
  queryReference: PreloadedQuery<FoodDetailQuery>;
};

export const FoodDetailModalQuery = graphql`
  query FoodDetailQuery($id: ID!) {
    node(id: $id) {
      ... on ingredients {
        category {
          name
        }
        name
        note
        histamine
        histamine_severity_num
      }
    }
  }
`;

export default function FoodDetail({ queryReference }: FoodDetailProps) {
  const navigation = useNavigation();
  const { node } = usePreloadedQuery(FoodDetailModalQuery, queryReference);
  const { name, category, histamine, histamine_severity_num: severity, note } = node ?? {};

  const { name: categoryName = '' } = category ?? {};

  useEffect(() => {
    // change modal title
    navigation.setOptions({ headerTitle: name });
  }, [navigation, name]);

  return (
    <YStack marginTop="$5" gap="$3">
      <XStack gap="$2" alignItems="center">
        <View>{getCategoryIcon(categoryName)}</View>
        <View>
          <Text>{categoryName}</Text>
        </View>
      </XStack>
      <XStack gap="$2" alignItems="center">
        <Text fontSize="$2">히스타민 함량:</Text>
        <SeverityTag severity={severity} histamine={histamine} />
      </XStack>
      <XStack gap="$2" alignItems="flex-start">
        <Info size="1" marginTop={3} />
        <Paragraph width="$20">{note}</Paragraph>
      </XStack>
    </YStack>
  );
}
