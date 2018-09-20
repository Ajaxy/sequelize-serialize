function serialize(resource, schema, options = {}) {
  if (Array.isArray(resource) && !resource.length) {
    return [];
  }

  if (Array.isArray(resource)) {
    return resource.map(member => serialize(member, schema, options));
  }

  const { decorateFn } = options;
  const decorated = decorateFn ? decorateFn(resource) : resource;
  const serialized = {};

  Object.keys(schema.properties).forEach((propertyName) => {
    const propertyDef = schema.properties[propertyName];
    let value = decorated[propertyName];

    if (typeof value === 'function') {
      value = decorated[propertyName]();
    }

    const objectDef = findObjectDef(propertyDef);

    serialized[propertyName] = objectDef && isObjectLike(value)
      ? serialize(value, objectDef, options)
      : toJSON(value);
  });

  return serialized;
}

function findObjectDef(propertyDef) {
  const { type, anyOf } = propertyDef;

  if (type === 'object') {
    return propertyDef;
  }

  if (anyOf) {
    return anyOf.find(def => def.type === 'object');
  }

  return null;
}

function isObjectLike(value) {
  return typeof value === 'object' && value !== null;
}

function toJSON(value) {
  return value && typeof value.toJSON === 'function' ? value.toJSON() : value;
}

module.exports = serialize;
