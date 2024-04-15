import type {
  category_update_column,
  ingredients_insert_input,
  upsertMutation,
} from '@/relay/__generated__/upsertMutation.graphql';
import type { upsertQuery } from '@/relay/__generated__/upsertQuery.graphql';
import { extractUUID } from '@/utils/extractUUID';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eraser } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';
import { useMutation, usePreloadedQuery, type PreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import { Button, Form, H3, Spinner, XStack } from 'tamagui';
import TamaguiSelect from '../Select';
import TamaguiTextArea from '../TextArea';
import TamaguiTextInput from '../TextInput';
import { upsertMutationUpdater } from './mutationUpdater';
import { upsertFormSchema, type UpsertFormValues } from './upsertSchema';

type UpsertFormProps = {
  foundItem: PreloadedQuery<upsertQuery>;
};

export const FoundItemQuery = graphql`
  query upsertQuery($id: ID!, $skip: Boolean!) {
    node(id: $id) @skip(if: $skip) {
      ... on ingredients {
        id
        name
        categoryId
        note
        histamine
        histamine_severity_num
      }
    }
    category_connection {
      edges {
        node {
          id
          name
        }
      }
    }
    search_filter {
      search_term
      histamine_severity_order_by
      category_filter
      current_connection_id
    }
  }
`;

const UpsertMutation = graphql`
  mutation upsertMutation(
    $object: ingredients_insert_input!
    $on_conflict: ingredients_on_conflict
  ) {
    insert_ingredients_one(object: $object, on_conflict: $on_conflict) {
      id
      name
      categoryId
      category {
        name
      }
      note
      histamine
      histamine_severity_num
    }
  }
`;

const SEVERITY_OPTIONS = [
  {
    name: '과도',
    value: '4',
  },
  {
    name: '높음',
    value: '3',
  },
  {
    name: '중간',
    value: '2',
  },
  {
    name: '낮음',
    value: '1',
  },
];

const upsertFormDefaultValues: UpsertFormValues = {
  name: '',
  histamine_severity_num: '3',
  categoryId: '',
};

export default function UpsertForm({ foundItem }: UpsertFormProps) {
  const { node, category_connection, search_filter } = usePreloadedQuery(FoundItemQuery, foundItem);
  const [commitUpsertMutation, isInFlight] = useMutation<upsertMutation>(UpsertMutation);

  const updateValues = node
    ? ({
        ...node,
        histamine: !!node?.histamine ? String(node.histamine) : undefined,
        histamine_severity_num: !!node?.histamine_severity_num
          ? String(node.histamine_severity_num)
          : undefined,
      } as UpsertFormValues)
    : undefined;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<UpsertFormValues>({
    resolver: zodResolver(upsertFormSchema),
    defaultValues: upsertFormDefaultValues,
    values: updateValues as UpsertFormValues | undefined,
  });

  const categoryOptions = useMemo(() => {
    const { edges = [] } = category_connection ?? {};
    return edges.map(({ node: { id, name } }) => ({
      name,
      value: extractUUID(id),
    }));
  }, [category_connection]);

  const onReset = () => {
    reset(upsertFormDefaultValues, { keepDefaultValues: true });
  };

  const onSubmit: SubmitHandler<UpsertFormValues> = data => {
    // console.log({ data });
    let update_columns;
    const { histamine, histamine_severity_num, name, note, categoryId } = data ?? {};
    const object: ingredients_insert_input = {
      // sanitize data
      name: name.trim(),
      note: note?.trim(),
      categoryId,
      histamine: histamine ? Number(histamine) : undefined,
      histamine_severity_num: histamine_severity_num ? Number(histamine_severity_num) : undefined,
    };
    if (node?.id) {
      // when node.id exists, it becomes update
      update_columns = Object.keys(data) as category_update_column[];
      object.id = extractUUID(node.id);
    }

    commitUpsertMutation({
      variables: {
        object,
        on_conflict: { constraint: 'ingredients_pkey', update_columns },
      },
      updater: !node ? upsertMutationUpdater(search_filter) : undefined,
      onCompleted: ({ insert_ingredients_one }, err) => {
        const { name } = insert_ingredients_one ?? {};
        let message = '';
        let duration = 30000;
        if (err) {
          message = `에러 발생: ${err?.[0]?.message}`;
        } else if (name) {
          message = `${name} ${!!node?.id ? '수정이' : '추가가'} 완료 되었습니다.`;
          duration = Toast.durations.SHORT;
          onReset();
        }
        // display complete toast whether it's an error
        Toast.show(message, {
          duration,
          shadow: true,
          animation: true,
          position: Toast.positions.CENTER,
          hideOnPress: true,
          onShow: () => {
            // go back to list
            router.push('/(tabs)');
          },
        });
      },
      onError: err => {
        Toast.show(`에러 발생: ${err.message}`, {
          duration: 30000,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      },
    });
  };

  const disabled = !isValid || !isDirty || isInFlight;

  return (
    <Form
      alignItems="center"
      gap="$3"
      padding="$3"
      borderRadius="$4"
      onSubmit={handleSubmit(onSubmit)}
      style={styles.formContainer}
    >
      <H3>{!!node ? `수정 항목: ${node.name}` : '새 항목 추가'}</H3>
      <XStack gap="$2">
        <TamaguiSelect<UpsertFormValues>
          name="categoryId"
          control={control}
          options={categoryOptions}
          optionsLabel="분류 선택"
          placeholder="종류"
        />
        <TamaguiTextInput<UpsertFormValues>
          name="name"
          control={control}
          inputProps={{
            size: '$6',
            flexDirection: 'row',
            placeholder: '음식 이름',
            style: {
              width: '65%',
            },
          }}
        />
      </XStack>
      <XStack gap="$2">
        <TamaguiSelect<UpsertFormValues>
          name="histamine_severity_num"
          control={control}
          options={SEVERITY_OPTIONS}
          optionsLabel="함량 정도"
          placeholder="정도"
        />
        <TamaguiTextInput<UpsertFormValues>
          name="histamine"
          control={control}
          inputProps={{
            size: '$6',
            keyboardType: 'numeric',
            flexDirection: 'row',
            placeholder: '히스타민 수치',
            style: {
              width: '65%',
            },
          }}
        />
      </XStack>
      <TamaguiTextArea<UpsertFormValues>
        name="note"
        control={control}
        inputProps={{
          placeholder: '메모',
          style: {
            width: '100%',
            height: '25%',
          },
        }}
      />
      <XStack gap="$2">
        <Button
          width="$4"
          theme="red_active"
          size="$6"
          icon={<Eraser size="$2" />}
          onPress={onReset}
        />
        <Form.Trigger asChild disabled={disabled} theme={disabled ? 'gray_active' : 'blue_active'}>
          <Button
            flexGrow={1}
            size="$6"
            iconAfter={isSubmitting || isInFlight ? () => <Spinner /> : undefined}
          >
            제출
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
