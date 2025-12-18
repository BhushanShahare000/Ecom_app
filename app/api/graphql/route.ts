import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/app/graphql/schemas";
import { resolvers } from "@/app/graphql/resolvers";
import { getServerSession } from "next-auth/next"; // ✅ correct import for App Router
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import type { NextRequest } from "next/server";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// ✅ Custom context to work with NextRequest in App Router
const handler = startServerAndCreateNextHandler(server, {
    context: async (req: NextRequest) => {
        // Convert NextRequest to cookies header format for getServerSession
        const session = await getServerSession(authOptions);

        console.log("🔐 GraphQL Session:", JSON.stringify(session, null, 2));

        return { prisma, session };
    },
});

export async function GET(request: NextRequest) {
    return handler(request);
}

export async function POST(request: NextRequest) {
    return handler(request);
}
