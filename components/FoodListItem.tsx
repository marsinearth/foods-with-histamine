import type { FoodListFragment$data } from '@/relay/__generated__/FoodListFragment.graphql';
import type { FoodListItemFragment$key } from '@/relay/__generated__/FoodListItemFragment.graphql';
import { getCategoryIcon } from '@/utils/categoryIcon';
import { Info } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { memo, useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { Animated, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { BorderlessButton, Swipeable } from 'react-native-gesture-handler';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { ListItem, Text, View } from 'tamagui';
import type { SeverityTagProps } from './SeverityTag';
import SeverityTag from './SeverityTag';

export type RenderItemType = FoodListFragment$data['ingredients_connection']['edges'][number];

type RenderListItemProps = RenderItemType & {
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
};

type SubTitleRenderProps = SeverityTagProps & {
  note?: string | null;
};

type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

const IngredientFragment = graphql`
  fragment FoodListItemFragment on ingredients {
    id
    category {
      name
    }
    name
    histamine
    histamine_severity_num
    note
  }
`;

function SubTitleRender({ severity, histamine, note }: SubTitleRenderProps) {
  return (
    <View style={styles.listItemSubtitle}>
      <SeverityTag severity={severity} histamine={histamine} />
      <View style={styles.noteContainer}>
        <Text fontSize="$2" numberOfLines={1} color="$color05" ellipse ellipsizeMode="tail">
          {note}
        </Text>
      </View>
    </View>
  );
}

const RenderListItem = ({ node, selectedId, setSelectedId }: RenderListItemProps) => {
  const ingredient = useFragment<FoodListItemFragment$key>(IngredientFragment, node);
  const { id, category, name, histamine, histamine_severity_num, note } = ingredient ?? {};
  const { name: categoryName = '' } = category ?? {};

  const selected = useMemo(() => selectedId === node.id, [node, selectedId]);

  const onPress = useCallback(() => {
    setSelectedId(selected ? '' : node.id);
  }, [setSelectedId, node, selected]);

  const onInfoPress = useCallback(() => {
    router.push({ pathname: '/modal', params: { id } });
  }, [id]);

  const renderRightActions = (
    _progess: AnimatedInterpolation,
    _dragX: AnimatedInterpolation,
    swipeable: Swipeable
  ) => {
    const onpress = () => {
      router.navigate({ pathname: '/mod', params: { id } });
      swipeable.close();
    };

    return (
      <BorderlessButton style={styles.borderlessButton} onPress={onpress}>
        <Text color="$gray10">수정</Text>
      </BorderlessButton>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress}>
        <ListItem
          icon={getCategoryIcon(categoryName)}
          iconAfter={
            note ? (
              <Pressable style={styles.listItemInfoIconContainer} onPress={onInfoPress}>
                {({ pressed }) => <Info size="$1.5" style={{ opacity: pressed ? 0.5 : 1 }} />}
              </Pressable>
            ) : undefined
          }
          title={name}
          subTitle={
            <SubTitleRender severity={histamine_severity_num} histamine={histamine} note={note} />
          }
          style={styles.listItem}
          backgroundColor={selected ? '$green5' : undefined}
        />
      </TouchableOpacity>
    </Swipeable>
  );
};

export default memo(RenderListItem);

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    paddingRight: 0,
    borderWidth: 1,
    marginTop: 2,
  },
  listItemSubtitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemInfoIconContainer: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  noteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 16,
  },
  borderlessButton: {
    width: 80,
    overflow: 'hidden',
    marginTop: 5,
    height: 60,
    paddingRight: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
