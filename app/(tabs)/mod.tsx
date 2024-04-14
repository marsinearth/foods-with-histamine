import UpsertForm, { FoundItemQuery } from '@/components/form/upsert';
import LoadingView from '@/components/LoadingView';
import type { upsertQuery } from '@/relay/__generated__/upsertQuery.graphql';
import { useLocalSearchParams } from 'expo-router';
import { Suspense, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useQueryLoader } from 'react-relay';

export default function ModScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [foundItemQueryReference, loadQuery] = useQueryLoader<upsertQuery>(FoundItemQuery);

  // to make view keyboard hide onBlur
  const handleUnhandledTouches = () => {
    Keyboard.dismiss();
    return false;
  };

  useEffect(() => {
    loadQuery({ id: id || '', skip: !id });
  }, [loadQuery, id]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      onStartShouldSetResponder={handleUnhandledTouches}
    >
      <Suspense fallback={<LoadingView />}>
        {!!foundItemQueryReference && <UpsertForm foundItem={foundItemQueryReference} />}
      </Suspense>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
