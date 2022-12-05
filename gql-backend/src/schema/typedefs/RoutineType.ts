import {
    GraphQLEnumType,
    GraphQLID,
    GraphQLInputObjectType, GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from "graphql";
import ScenarioType from "./ScenarioType";

const RoutineType = new GraphQLObjectType({
    name: 'Routine',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        author: { type: GraphQLNonNull(GraphQLString) },
        scenarios: { type: GraphQLList(ScenarioType) },
    }),
});

const RoutineFilterInput = new GraphQLInputObjectType({
    name: 'RoutineFilterInput',
    fields: () => ({
        name: { type: GraphQLString },
        author: { type: GraphQLString },
    })
});

const RoutineInputType = new GraphQLInputObjectType({
    name: 'RoutineInput',
    fields: () => ({
        name: { type: GraphQLString },
        author: { type: GraphQLString },
    }),
})

export { RoutineType, RoutineInputType, RoutineFilterInput };
