module.exports = {
  // ...
  // Configuration options accepted by the `relay-compiler` command-line tool and `babel-plugin-relay`.
  src: '.',
  language: 'typescript',
  schema: 'relay/schema.graphql',
  schemaExtensions: ['relay'],
  artifactDirectory: 'relay/__generated__',
  excludes: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
};
