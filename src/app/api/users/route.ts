import { getDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {  
  try {
      const usersCollection = await getDatabase("users");
      const allUsers = await usersCollection.find().toArray();

      return Response.json(allUsers, { status: 200 });
  } catch (error) {
      console.log("Error while getting users", error)
      return Response.json({ message:"Error while getting users", error: error }, { status: 500 });
  }
}