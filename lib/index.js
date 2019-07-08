function serialize(resource, schema, options = {}) {
  if (Array.isArray(resource) && !resource.length) {
    return [];
  }

  if (Array.isArray(resource)) {
    return resource.map(member => serialize(member, schema, options));
  }

  const { decorate } = options;
  const decorated = decorate ? decorate(resource) : resource;
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

  if (type === 'array') {
    return findObjectDef(propertyDef.items);
  }

  if (anyOf) {
    const schema = anyOf.find(def => ['object', 'array'].includes(def.type));
    return (schema && schema.items) || schema;
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
