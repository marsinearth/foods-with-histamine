import LoadingView from '@/components/LoadingView';
import SearchForm, { CategoryListQuery } from '@/components/search/Form';
import type { FormQuery } from '@/relay/__generated__/FormQuery.graphql';
import { Suspense, useEffect } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { useQueryLoader } from 'react-relay';
import { View } from 'tamagui';

export default function SearchPage() {
  const [categoryQueryReference, loadQuery] = useQueryLoader<FormQuery>(CategoryListQuery);
  // to make view keyboard hide onBlur
  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  return (
    <View style={styles.container} onStartShouldSetResponder={handleUnhandledTouches}>
      <Suspense fallback={<LoadingView label="분류 목록 로딩중..." />}>
        {!!categoryQueryReference && <SearchForm categoryQueryReference={categoryQueryReference} />}
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});
