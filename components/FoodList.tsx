import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { Separator } from 'tamagui';

import RenderListItem, { type RenderItemType } from './FoodListItem';

import type { FoodListFragment$key } from '@/relay/__generated__/FoodListFragment.graphql';
import type { FoodListRefetchQuery } from '@/relay/__generated__/FoodListRefetchQuery.graphql';

type FoodListProps = {
  queryData: FoodListFragment$key;
};

const FoodListPaginationFragment = graphql`
  fragment FoodListFragment on query_root
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 15 }
    cursor: { type: "String" }
    order_by: { type: "[ingredients_order_by!]", defaultValue: [{ histamine_severity_num: asc }] }
  )
  @refetchable(queryName: "FoodListRefetchQuery") {
    ingredients_connection(first: $count, after: $cursor, order_by: $order_by)
      @connection(key: "FoodListPaginationFragment_ingredients_connection") {
      edges {
        node {
          id
          ...FoodListItemFragment
        }
      }
    }
  }
`;

export default function FoodList({ queryData }: FoodListProps) {
  const [selectedId, setSelectedId] = useState<string>('');
  const { data, loadNext, isLoadingNext, hasNext } = usePaginationFragment<
    FoodListRefetchQuery,
    FoodListFragment$key
  >(FoodListPaginationFragment, queryData);
  const { edges = [] } = data?.ingredients_connection ?? {};

  const onEndReached = () => {
    if (hasNext) {
      loadNext(15);
    }
  };

  return (
    <FlatList<RenderItemType>
      data={edges}
      extraData={selectedId}
      keyExtractor={({ node }) => node.id}
      renderItem={({ item }) => (
        <RenderListItem {...item} selectedId={selectedId} setSelectedId={setSelectedId} />
      )}
      onEndReached={onEndReached}
      refreshing={isLoadingNext}
      onEndReachedThreshold={0.01}
      style={styles.chartContainer}
      initialNumToRender={15}
      ItemSeparatorComponent={() => <Separator style={{ marginHorizontal: 5 }} />}
      ListFooterComponent={!hasNext ? null : <ActivityIndicator size="large" color="pink" />}
      ListFooterComponentStyle={styles.footer}
    />
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'column',
    width: '90%',
  },
  footer: {
    paddingVertical: 48,
  },
});
