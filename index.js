const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./gql/schema');
const resolvers = require('./gql/resolver');
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect('mongodb+srv://MEAN_USER:1fbVQrEWTxcTRkqu@mycluster.qyn01.mongodb.net/instagram', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},
(err, _) => {
    if (err) {
        console.log("Error al iniciar DB");
    } else {
        console.log("Database listen!");
        server();
    }
});

function server() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => {
            const {headers} = req;
            const token = headers.authorization.split(' ')[1];
            if (token) {

                try {
                    console.log('executed!');
                    const user = jwt.verify(
                        token,
                        process.env.SECRET_KEY
                    );
    
                    return user;
                } catch(err) {
                    console.log(err);
                    throw new Error('Token inválido');
                }

            }
        }
    });

    apolloServer.listen({port: process.env.PORT || 4000}).then(({url}) => {
        console.log('Server listen on: ', url);
    })
}