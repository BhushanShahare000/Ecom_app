"use client";

import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "@/app/lib/apollo";
import { ThemeProvider } from "@/app/context/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SessionProvider>
                <ApolloProvider client={client}>{children}</ApolloProvider>
            </SessionProvider>
        </ThemeProvider>
    );
}
