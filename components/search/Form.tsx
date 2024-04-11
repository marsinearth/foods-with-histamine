import type { FormQuery } from '@/relay/__generated__/FormQuery.graphql';
import { extractUUID } from '@/utils/extractUUID';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eraser } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { Suspense, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { PreloadedQuery, usePreloadedQuery, useRelayEnvironment } from 'react-relay';
import { commitLocalUpdate, Environment, graphql } from 'relay-runtime';
import { Button, Form, Spinner, XStack } from 'tamagui';
import LoadingView from '../LoadingView';
import { searchFormSchema, type SearchFormValues } from './searchSchema';
import TamaguiSelect from './Select';
import TamaguiTextInput from './TextInput';

type SearchFormProps = {
  categoryQueryReference: PreloadedQuery<FormQuery>;
};

const HISTAMINE_SEVERITY_ORDER_BY_OPTIONS = [
  {
    name: '히스타민 낮은 순',
    value: 'asc',
  },
  {
    name: '히스타민 높은 순',
    value: 'desc',
  },
];

export const CategoryListQuery = graphql`
  query FormQuery {
    search_filter {
      search_term
      histamine_severity_order_by
      category_filter
    }
    category_connection(first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const upsertSearchFilterCommit = (environment: Environment, data: SearchFormValues) => {
  commitLocalUpdate(environment, store => {
    const queryClientRoot = store.getRoot();
    if (queryClientRoot) {
      const searchFilterRecord = queryClientRoot.getOrCreateLinkedRecord(
        'search_filter',
        'SearchFilter'
      );
      if (searchFilterRecord) {
        const { search_term, histamine_severity_order_by, category_filter } = data;
        searchFilterRecord.setValue(search_term, 'search_term');
        searchFilterRecord.setValue(histamine_severity_order_by, 'histamine_severity_order_by');
        searchFilterRecord.setValue(category_filter, 'category_filter');
        queryClientRoot.setLinkedRecord(searchFilterRecord, 'search_filter');
      }
    }
  });
};

const searchFormDefaultValues: SearchFormValues = {
  search_term: '',
  histamine_severity_order_by: 'asc',
  category_filter: [],
};

export default function SearchForm({ categoryQueryReference }: SearchFormProps) {
  const environment = useRelayEnvironment();
  const formData = usePreloadedQuery<FormQuery>(CategoryListQuery, categoryQueryReference);
  const { category_connection, search_filter } = formData ?? {};
  const { canGoBack, back } = router;

  const {
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: searchFormDefaultValues,
    values: search_filter as SearchFormValues,
  });

  const selectedCategories = watch('category_filter');

  const onSubmit: SubmitHandler<SearchFormValues> = data => {
    if (canGoBack()) {
      back();
    }
    upsertSearchFilterCommit(environment, data);
  };

  const onReset = () => {
    reset(searchFormDefaultValues);
  };

  const categoryOptions = useMemo(() => {
    const { edges = [] } = category_connection ?? {};
    return edges.map(({ node: { id, name } }) => ({
      name,
      value: extractUUID(id),
    }));
  }, [category_connection]);

  return (
    <Form
      flexDirection="column"
      alignItems="center"
      gap="$3"
      padding="$3"
      borderRadius="$4"
      onSubmit={handleSubmit(onSubmit)}
      style={styles.formContainer}
    >
      <TamaguiTextInput<SearchFormValues>
        name="search_term"
        control={control}
        inputProps={{
          size: '$6',
          flexDirection: 'row',
          placeholder: '검색어 입력(음식명, 메모)',
          style: {
            width: '100%',
          },
        }}
      />
      <TamaguiSelect<SearchFormValues>
        name="histamine_severity_order_by"
        control={control}
        options={HISTAMINE_SEVERITY_ORDER_BY_OPTIONS}
        optionsLabel="히스타민 함량 정렬"
        placeholder="정렬"
      />

      <XStack gap="$2">
        <Suspense fallback={<LoadingView label="분류 목록 로딩중..." />}>
          {Array.from({ length: 3 }).map((_, i) => (
            <TamaguiSelect<SearchFormValues>
              key={i}
              name={`category_filter.${i}`}
              control={control}
              options={categoryOptions}
              optionsLabel="분류 선택"
              placeholder={`종류${i + 1}`}
              defaultValue=""
              disabledValues={[...selectedCategories]}
            />
          ))}
        </Suspense>
      </XStack>

      <XStack gap="$2" marginTop="$4">
        <Button
          width="$4"
          theme="red_active"
          size="$6"
          icon={<Eraser size="$2" />}
          onPress={onReset}
        />
        <Form.Trigger asChild disabled={!isValid} theme={!isValid ? 'gray_alt1' : 'blue_active'}>
          <Button flexGrow={1} size="$6" iconAfter={isSubmitting ? () => <Spinner /> : undefined}>
            Submit
          </Button>
        </Form.Trigger>
      </XStack>
    </Form>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
});
