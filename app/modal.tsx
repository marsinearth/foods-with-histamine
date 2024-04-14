import FoodDetail, { FoodDetailModalQuery } from '@/components/FoodDetail';
import LoadingView from '@/components/LoadingView';
import type { FoodDetailQuery } from '@/relay/__generated__/FoodDetailQuery.graphql';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useQueryLoader } from 'react-relay';
import { View } from 'tamagui';

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [queryReference, loadQuery] = useQueryLoader<FoodDetailQuery>(FoodDetailModalQuery);

  useEffect(() => {
    if (id) {
      loadQuery({ id });
    }
  }, [loadQuery, id]);

  return (
    <View style={styles.container}>
      <Suspense fallback={<LoadingView label="음식 상세정보 불러오는 중..." />}>
        {!!queryReference && <FoodDetail queryReference={queryReference} />}
      </Suspense>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
