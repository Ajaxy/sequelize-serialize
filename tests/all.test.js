const { createModel, DUMMY_VALUES } = require('./init');
const serialize = require('../lib/index');

describe('Serializers', () => {
  it('Filters out properties not defined in schema', () => {
    const TestModel = createModel();

    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        b: {
          type: 'string',
        },
      },
    };

    const instance = new TestModel(DUMMY_VALUES);
    expect(serialize(instance, schema))
      .toEqual({ a: 'x', b: 777 });
  });

  it('Includes `belongsTo`', () => {
    const ModelA = createModel();
    const ModelB = createModel();
    ModelB.belongsTo(ModelA);

    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        modelA: {
          type: 'object',
          properties: {
            b: {
              type: 'integer',
            },
            c: {
              type: 'boolean',
            },
          },
        },
      },
    };

    const instanceA = new ModelA(DUMMY_VALUES);
    const instanceB = new ModelB(DUMMY_VALUES);
    instanceB.modelA = instanceA;

    expect(serialize(instanceB, schema))
      .toEqual({ a: 'x', modelA: { b: 777, c: true } });
  });

  it('Includes `hasMany`', () => {
    const ModelA = createModel();
    const ModelB = createModel();
    ModelA.hasMany(ModelB);

    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        modelsB: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              b: {
                type: 'integer',
              },
              c: {
                type: 'boolean',
              },
            },
          },
        },
      },
    };

    const instanceA = new ModelA(DUMMY_VALUES);
    const instanceB1 = new ModelB(DUMMY_VALUES);
    const instanceB2 = new ModelB(DUMMY_VALUES);
    instanceA.modelsB = [instanceB1, instanceB2];

    expect(serialize(instanceA, schema))
      .toEqual({ a: 'x', modelsB: [{ b: 777, c: true }, { b: 777, c: true }] });
  });

  it('Serialize optional arrays with schema', () => {
    const ModelA = createModel();
    const ModelB = createModel();
    ModelA.hasMany(ModelB);

    const schema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
        },
        modelsB: {
          anyOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  b: {
                    type: 'integer',
                  },
                  c: {
                    type: 'boolean',
                  },
                },
              },
            },
            {
              type: 'null',
            },
          ],
        },
      },
    };

    const instanceA = new ModelA(DUMMY_VALUES);
    const instanceB1 = new ModelB(DUMMY_VALUES);
    const instanceB2 = new ModelB(DUMMY_VALUES);
    instanceA.modelsB = [instanceB1, instanceB2];

    expect(serialize(instanceA, schema))
      .toEqual({ a: 'x', modelsB: [{ b: 777, c: true }, { b: 777, c: true }] });
  });
});
