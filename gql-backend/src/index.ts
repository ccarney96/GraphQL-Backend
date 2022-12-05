import express from 'express';
import dotenv from 'dotenv';
import { Schema } from "./schema/schema";
import { PrismaClient } from "@prisma/client";

const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema: Schema,
    context: {
        prisma: new PrismaClient()
    },
    graphiql: true,
}));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/graphql`);
});
