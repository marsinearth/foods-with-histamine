import {
  Environment,
  GraphQLResponse,
  Network,
  RecordSource,
  Store,
  type RequestParameters,
  type Variables,
} from 'relay-runtime';

const API_ENDPOINT = process.env.EXPO_PUBLIC_API_URL ?? ''
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? ''

async function fetchQuery(
  request: RequestParameters,
  variables: Variables,
): Promise<GraphQLResponse> {
  const resp = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: "application/json",
      'X-Hasura-Admin-Secret': API_KEY ,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: request.text, // GraphQL text from input
      variables,
    }),
  });
  const json = await resp.json()

   // GraphQL returns exceptions (for example, a missing required variable) in the "errors"
  // property of the response. If any exceptions occurred when processing the request,
  // throw an error to indicate to the developer what went wrong.
  if (Array.isArray(json.errors)) {
    console.error(json.errors);
    throw new Error(
      `Error fetching GraphQL query '${
        request.name
      }' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
  }

  return json;
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);
const store = new Store(new RecordSource())

const environment = new Environment({
  network,
  store
  // ... other options
});

export default environment;