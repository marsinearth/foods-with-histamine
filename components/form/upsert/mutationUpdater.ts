import type { upsertMutation$data } from '@/relay/__generated__/upsertMutation.graphql';
import type { upsertQuery$data } from '@/relay/__generated__/upsertQuery.graphql';
import { ConnectionHandler, type RecordSourceSelectorProxy } from 'relay-runtime';

export const upsertMutationUpdater =
  (search_filter: upsertQuery$data['search_filter']) =>
  (store: RecordSourceSelectorProxy<upsertMutation$data>, res?: upsertMutation$data | null) => {
    const { insert_ingredients_one } = res ?? {};
    if (insert_ingredients_one?.id) {
      const updatedIngredientRecord = store.get(insert_ingredients_one.id);
      if (updatedIngredientRecord && search_filter?.current_connection_id) {
        const { search_term, category_filter, current_connection_id } = search_filter ?? {};
        if (current_connection_id) {
          const currentConnectionRecord = store.get(current_connection_id);
          if (currentConnectionRecord) {
            const newIngredientsEdge = ConnectionHandler.createEdge(
              store,
              currentConnectionRecord,
              updatedIngredientRecord,
              'ingredientsEdge'
            );

            if (newIngredientsEdge) {
              // console.log({ newIngredientsEdge });
              const { name, categoryId, note } = insert_ingredients_one;
              if (
                (!search_term && !category_filter?.length) ||
                (search_term && (name.includes(search_term) || note?.includes(search_term))) ||
                (!!category_filter?.length && category_filter?.some(cId => cId === categoryId))
              ) {
                // when search_term exists and name or note includes it, or category_filter contains categoryId or there is no search_term and category_filter
                ConnectionHandler.insertEdgeBefore(currentConnectionRecord, newIngredientsEdge);
              }
            }
          }
        }
      }
    }
  };
