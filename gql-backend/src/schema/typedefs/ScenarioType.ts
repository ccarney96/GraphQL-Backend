import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

const ScenarioType = new GraphQLObjectType({
    name: 'Scenario',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        playCount: { type: GraphQLNonNull(GraphQLInt) },
    })
});

export default ScenarioType;
