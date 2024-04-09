import { Suspense } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Text } from 'tamagui';

import FoodList from '@/components/FoodList';
import type { TabsQuery } from '@/relay/__generated__/TabsQuery.graphql';

const FoodListDataQuery = graphql`
  query TabsQuery {
    ...FoodListFragment
  }
`;

export default function ListScreen() {
  const queryData = useLazyLoadQuery<TabsQuery>(FoodListDataQuery, {});

  return (
    <SafeAreaView style={styles.container}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <FoodList queryData={queryData} />
      </Suspense>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
    flexDirection: 'column',
    marginVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 15,
    marginBottom: 25,
    height: 1,
    width: '80%',
  },
});
