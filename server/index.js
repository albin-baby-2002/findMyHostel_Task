const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { typeDefs } = require("./Graphql/schema.gql");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConnection");
const mongoose = require("mongoose");
const { resolvers } = require("./Graphql/resolvers.js");
const authChecker = require("./utils/authChecker.js");
const cookieParser = require("cookie-parser");

dotenv.config();
const PORT = process.env.PORT || 4000;
connectDB();

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  app.use(bodyParser.json());
 app.use(
   cors({
     origin: "http://localhost:5173",
     credentials: true, // should be lowercase
   })
 );
  app.use(cookieParser());

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const user = await authChecker(req);

        // if user have valid token user will have user data or null

        return { user, res };
      },
    })
  );

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

startServer();
