"use client";

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
    link: new HttpLink({
        uri: "/api/graphql",
        credentials: "include", // send cookies with every request
        fetch: fetch, // explicitly use native fetch
    }),
    cache: new InMemoryCache(),
});
