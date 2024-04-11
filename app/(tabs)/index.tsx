import { Suspense, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useQueryLoader } from 'react-relay';

import FoodList, { FoodListDataQuery } from '@/components/FoodList';
import LoadingView from '@/components/LoadingView';
import type { FoodListQuery } from '@/relay/__generated__/FoodListQuery.graphql';

export default function ListScreen() {
  const [queryReference, loadQuery] = useQueryLoader<FoodListQuery>(FoodListDataQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <Suspense fallback={<LoadingView label="음식 리스트 로딩중..." />}>
        {!!queryReference && <FoodList queryReference={queryReference} />}
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
