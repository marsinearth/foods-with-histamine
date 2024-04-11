import type { FoodListFragment$key } from '@/relay/__generated__/FoodListFragment.graphql';
import type { FoodListQuery } from '@/relay/__generated__/FoodListQuery.graphql';
import type {
  FoodListRefetchQuery,
  ingredients_bool_exp,
  ingredients_order_by,
} from '@/relay/__generated__/FoodListRefetchQuery.graphql';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { usePaginationFragment, usePreloadedQuery, type PreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { Writeable } from 'zod';
import EmptyDataView from './EmptyData';
import RenderListItem, { type RenderItemType } from './FoodListItem';
import LoadingView from './LoadingView';

type FoodListProps = {
  queryReference: PreloadedQuery<FoodListQuery>;
};

export const FoodListDataQuery = graphql`
  query FoodListQuery {
    ...FoodListFragment
    search_filter {
      search_term
      histamine_severity_order_by
      category_filter
    }
  }
`;

const FoodListPaginationFragment = graphql`
  fragment FoodListFragment on query_root
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 30 }
    cursor: { type: "String" }
    order_by: { type: "[ingredients_order_by!]", defaultValue: [{ histamine_severity_num: asc }] }
    where: { type: "ingredients_bool_exp" }
  )
  @refetchable(queryName: "FoodListRefetchQuery") {
    ingredients_connection(first: $count, after: $cursor, order_by: $order_by, where: $where)
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

export default function FoodList({ queryReference }: FoodListProps) {
  const [selectedId, setSelectedId] = useState('');
  const foodListData = usePreloadedQuery<FoodListQuery>(FoodListDataQuery, queryReference);
  const { search_filter, ...queryRef } = foodListData ?? {};
  const { data, loadNext, isLoadingNext, hasNext, refetch } = usePaginationFragment<
    FoodListRefetchQuery,
    FoodListFragment$key
  >(FoodListPaginationFragment, queryRef);
  const { edges = [] } = data?.ingredients_connection ?? {};

  const onEndReached = () => {
    if (hasNext) {
      loadNext(30);
    }
  };

  useEffect(() => {
    // apply search_filter to the query
    if (search_filter) {
      const { search_term, histamine_severity_order_by, category_filter } = search_filter;
      const result: { order_by: ingredients_order_by[]; where: ingredients_bool_exp } = {
        order_by: [{ histamine_severity_num: histamine_severity_order_by ?? 'asc' }],
        where: { _and: [] },
      };
      const categories = category_filter?.reduce((acc, categoryId) => {
        if (categoryId) {
          acc.push(categoryId);
        }
        return acc;
      }, []);
      // for typescript satisfaction
      const and = result.where._and as NonNullable<Writeable<ingredients_bool_exp['_and']>>;

      if (search_term) {
        and.push({
          _or: [{ name: { _ilike: `%${search_term}%` } }, { note: { _ilike: `%${search_term}%` } }],
        });
      }
      if (categories?.length) {
        and.push({ category: { id: { _in: categories } } });
      }

      refetch(result);
    }
  }, [refetch, search_filter]);

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
      initialNumToRender={30}
      ListEmptyComponent={<EmptyDataView />}
      ListFooterComponent={!hasNext ? null : <LoadingView label="추가 음식 로딩중..." />}
    />
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'column',
    width: '95%',
  },
  footer: {
    paddingVertical: 48,
  },
});
