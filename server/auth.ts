import { supabase } from "../client/src/lib/supabase";
import { db } from "../db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@db/schema";

export async function createUser(name: string, email: string, password: string): Promise<User> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  const [user] = await db
    .insert(users)
    .values({ 
      id: authData.user?.id,
      name,
      email 
    })
    .returning();

  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user || null;
}

export async function verifyToken(token: string): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser(token);
  
  if (!authUser) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);
    
  return user || null;
}
