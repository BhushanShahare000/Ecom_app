import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import type { NextRequest } from "next/server";

export async function createContext({ req }: { req: NextRequest }) {
    // Get session using NextAuth (from cookies)
    const session = await getServerSession(authOptions);
    console.log("GraphQL Context - Session:", JSON.stringify(session, null, 2));
    if (!session) {
        console.log("GraphQL Context - No Session Found");
        // Log headers to see if cookies are present
        console.log("GraphQL Context - Cookies:", req.cookies.getAll());
    }
    return { prisma, session };
}
