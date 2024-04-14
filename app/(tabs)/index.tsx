import FoodList, { FoodListDataQuery } from '@/components/FoodList';
import LoadingView from '@/components/LoadingView';
import type { FoodListQuery } from '@/relay/__generated__/FoodListQuery.graphql';
import { Suspense, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useQueryLoader } from 'react-relay';

export default function ListScreen() {
  const [queryReference, loadQuery] = useQueryLoader<FoodListQuery>(FoodListDataQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          marginVertical: 15,
          width: '100%',
        }}
      >
        <Suspense fallback={<LoadingView label="음식 리스트 불러오는 중..." />}>
          {!!queryReference && <FoodList queryReference={queryReference} />}
        </Suspense>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    width: '100%',
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
