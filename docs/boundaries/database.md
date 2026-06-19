# Database boundaries

Database reads and writes cross a trust boundary. The database row
shape and the application object shape can drift over time.
Contracts keep that drift visible.

At a read boundary, describe the row your code actually needs
and assert each loaded record before using it.
At a write boundary, describe the record plus any write envelope
and parse input before storing it.

Use `parse()` or `safeParse()` when the source might be null,
a legacy column shape, or a bulk result set.

## Read boundary

```js
const DbPost = sigil.exact({
  id: Number,
  title: String,
  authorId: String,
  tags: Array,
});

const rawRow = result.rows[0];
const post = DbPost.assert(rawRow);
```

## Write boundary

```js
const CreatePost = sigil.exact({
  table: 'posts',
  row: {
    title: String,
    body: String,
    authorId: String,
  },
});

const insert = CreatePost.parse({
  table: 'posts',
  row: payload,
});
```

Database boundaries are useful for:

- ORM hydration checks
- query result assertions
- insert or update envelopes
- multi-tenant row scoping
- migration validation scripts
