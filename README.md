# sequelize-serialize
[![NPM version](https://img.shields.io/npm/v/sequelize-serialize.svg)](https://npmjs.com/package/sequelize-serialize)

The way to serialize [Sequelize](sequelizejs.com) models using [JSON Schema](http://json-schema.org/).
Supports complex resources and associated models.

### Example

Let’s say we need to return all users with posts in the blog, including the comments to these posts:

```js
router.get('/blog/users', async (ctx) => {
  const users = await User.findAll({
    include: [{
      model: Post,
      required: true,
      include: [Comment]
    }]
  });

  ctx.body = serialize(users, schemas.UserWithPosts);
});
```

We can describe JSON fields for that with following schemas:
<details>
    <summary>Expand to check them here</summary>

```js
{
  "UserWithPosts": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "isAdmin": {
        "type": "boolean"
      },
      "age": {
        "type": "integer"
      },
      "posts": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/Post"
        }
      }
    },
    "required": [
      "name",
      "isAdmin",
      "posts"
    ]
  },

  "User": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "isAdmin": {
        "type": "boolean"
      },
      "age": {
        "type": "integer"
      }
    },
    "required": [
      "name",
      "isAdmin"
    ]
  },

  "Post": {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "comments": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/Comment"
        }
      }
    },
    "required": [
      "topic",
      "message"
    ]
  },

  "Comment": {
    "type": "object",
    "properties": {
      "authorId": {
        "type": "integer"
      },
      "message": {
        "type": "string"
      }
    },
    "required": [
      "authorId",
      "message"
    ]
  },
```
</details>

### Nulls

Supports `null` if schema is either:
```
type: ['..', 'null']
```
or
```
anyOf: [
  { type: '..' },
  { type: 'null' }
]
```

### See also

Check out [tinsypec](https://github.com/Ajaxy/tinyspec) for more smart JSON schema use cases.

