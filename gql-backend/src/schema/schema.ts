import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { RoutineFilterInput, RoutineInputType, RoutineType } from "./typedefs/RoutineType";
import ScenarioType from "./typedefs/ScenarioType";

export const Schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            routines: {
                type: new GraphQLList(RoutineType),
                args: {
                    first: { type: GraphQLInt },
                    offset: { type: GraphQLInt },
                    filter: { type: RoutineFilterInput },
                },
                resolve: async (parent, { first, offset, filter }, ctx) => {
                    if (filter) {
                        const result = await ctx.prisma.routine.findMany({
                            where: {
                                OR: [
                                    { name: { contains: filter.name } },
                                    { author: { contains: filter.author } },
                                ],
                            },
                            include: {
                                scenarios: true,
                            },
                            take: first,
                            skip: offset,
                        });

                        return result;
                    } else {
                        return ctx.prisma.routine.findMany({
                            include: {
                                scenarios: true,
                            },
                            take: first ?? undefined,
                            skip: offset ?? undefined,
                        });
                    }
                }
            },
            routine: {
                type: RoutineType,
                args: {
                    id: { type: GraphQLID }
                },
                resolve: (parent, { id }, ctx) => {
                    return ctx.prisma.routine.findFirst({
                        where: {
                            id: Number(id)
                        },
                        include: {
                            scenarios: true
                        }
                    })
                }
            },
            findRoutine: {
                type: GraphQLList(RoutineType),
                args: {
                    searchQuery: { type: GraphQLString }
                },
                resolve: (parent, { searchQuery }, ctx) => {
                    if (searchQuery === '') {
                        return ctx.prisma.routine.findMany({});
                    }

                    return ctx.prisma.routine.findMany({
                        where: {
                            name: {
                                contains: searchQuery
                            }
                        }
                    });
                }
            },
            routinesWithCount: {
                type: new GraphQLObjectType({
                    name: 'RoutinesWithCount',
                    fields: {
                        routines: { type: new GraphQLList(RoutineType) },
                        count: { type: GraphQLInt }
                    },
                }),
                args: {
                    input: { type: RoutineInputType },
                    first: { type: GraphQLInt },
                    offset: { type: GraphQLInt },
                    filter: { type: RoutineFilterInput },
                },
                resolve: async (parent, { input, first, offset, filter }, ctx) => {
                    if (filter) {
                        const routines = await ctx.prisma.routine.findMany({
                            where: {
                                OR: [
                                    { name: { contains: filter.name } },
                                    { author: { contains: filter.author } },
                                ],
                            },
                            include: {
                                scenarios: true,
                            }
                        });

                        const count = routines.length;

                        return {
                            routines: routines.slice(offset, offset + first),
                            count
                        }
                    } else {
                        const routines = await ctx.prisma.routine.findMany({
                            include: {
                                scenarios: true,
                            },
                            take: first ?? undefined,
                            skip: offset ?? undefined,
                        });

                        const count = routines.length;

                        return {
                            routines,
                            count
                        }
                    }
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            createRoutine: {
                type: RoutineType,
                args: {
                    name: { type: GraphQLString },
                    description: { type: GraphQLString },
                },
                resolve: (parent, { name, description }, ctx) => {
                    return ctx.prisma.routine.create({
                        data: {
                            name,
                            description,
                            author: "anonymous"
                        }
                    })
                }
            },
            updateRoutine: {
                type: RoutineType,
                args: {
                    id: { type: GraphQLID },
                    name: { type: GraphQLString },
                    description: { type: GraphQLString },
                },
                resolve: (parent, { id, name, description }, ctx) => {
                    return ctx.prisma.routine.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            name,
                            description
                        }
                    });
                }
            },
            deleteRoutine: {
                type: RoutineType,
                args: {
                    id: { type: GraphQLID }
                },
                resolve: (parent, { id }, ctx) => {
                    return ctx.prisma.routine.delete({
                        where: {
                            id: Number(id)
                        }
                    });
                }
            },
            addScenario: {
                type: ScenarioType,
                args: {
                    name: { type: GraphQLString },
                    playCount: { type: GraphQLInt },
                    routineId: { type: GraphQLInt }
                },
                resolve: (parent, { name, playCount, routineId }, ctx) => {
                    const newScenario = {
                        name: name,
                        playCount: playCount,
                        routineId: routineId
                    };

                    return ctx.prisma.scenario.create({
                        data: newScenario
                    })
                }
            },
            updateScenario: {
                type: ScenarioType,
                args: {
                    id: { type: GraphQLID },
                    name: { type: GraphQLString },
                    playCount: { type: GraphQLInt },
                },
                resolve: (parent, { id, name, playCount, routineId }, ctx) => {
                    const updatedScenario = {
                        name: name,
                        playCount: playCount,
                    };

                    return ctx.prisma.scenario.update({
                        where: {
                            id: Number(id)
                        },
                        data: updatedScenario
                    })
                }
            },
            deleteScenario: {
                type: ScenarioType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (parent, { id }, ctx) => {
                    return ctx.prisma.scenario.deleteMany({
                        where: {
                            id: id
                        }
                    });
                }
            }
        }
    }),
    subscription: new GraphQLObjectType({
        name: 'Subscription',
        fields: {
            routineAdded: {
                type: RoutineType,
                subscribe: (parent, args, ctx) => {
                    return ctx.pubsub.asyncIterator('routineAdded');
                }
            },
            scenarioAdded: {
                type: ScenarioType,
                subscribe: (parent, args, ctx) => {
                    return ctx.pubsub.asyncIterator('scenarioAdded');
                }
            }
        }
    }),
})
