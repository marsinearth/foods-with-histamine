import { Info } from '@tamagui/lucide-icons';
import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { ListItem, Text, View } from 'tamagui';

import type { FoodListFragment$data } from '@/relay/__generated__/FoodListFragment.graphql';
import type { FoodListItemFragment$key } from '@/relay/__generated__/FoodListItemFragment.graphql';
import { getCategoryIcon } from '@/utils/categoryIcon';

export type RenderItemType = FoodListFragment$data['ingredients_connection']['edges'][number];

type RenderListItemProps = RenderItemType & {
  selectedId: string;
  setSelectedId: Dispatch<SetStateAction<string>>;
};

type SeverityTagProps = {
  severity: number;
  histamine: number;
};

type SubTitleRenderProps = SeverityTagProps & {
  note?: string | null;
};

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

function SeverityTag({ severity, histamine }: SeverityTagProps) {
  const [label, backgroundColor] = useMemo(() => {
    switch (severity) {
      case 4:
        return ['higher', 'firebrick'];
      case 2:
        return ['medium', 'goldenrod'];
      case 1:
        return ['low', 'limegreen'];
      default:
        return ['high', 'tomato'];
    }
  }, [severity]);

  return (
    <View style={{ ...styles.tag, backgroundColor }}>
      <Text fontSize="$1" fontWeight="900" color="white">
        {label}
        {histamine ? ` (${histamine}mg/kg)` : ''}
      </Text>
    </View>
  );
}

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

export default function RenderListItem({ node, selectedId, setSelectedId }: RenderListItemProps) {
  const ingredient = useFragment<FoodListItemFragment$key>(IngredientFragment, node);
  const { category, name, histamine, histamine_severity_num, note } = ingredient ?? {};
  const { name: categoryName = '' } = category ?? {};

  const selected = useMemo(() => selectedId === node.id, [node, selectedId]);

  const onPress = useCallback(() => {
    setSelectedId(selected ? '' : node.id);
  }, [setSelectedId, node, selected]);

  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem
        icon={getCategoryIcon(categoryName)}
        iconAfter={note ? Info : undefined}
        title={name}
        subTitle={
          <SubTitleRender severity={histamine_severity_num} histamine={histamine} note={note} />
        }
        style={styles.listItem}
        theme={selected ? 'blue_active' : undefined}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
  },
  listItemSubtitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 16,
  },
  tag: {
    flexShrink: 0,
    minWidth: 35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
