import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { errorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const todosCollection = await getDatabase("todos");
    const searchParams = request.nextUrl.searchParams;
    const user = searchParams.get("user");

    const filter: any = {};
    if (user && user !== "All Users") {
      filter.assignedUsers = user;
    }

    const todos = await todosCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Convert ObjectIds to strings for JSON serialization
    const serializedTodos = todos.map((todo) => ({
      ...todo,
      _id: todo._id.toString(),
      // @ts-ignore
      notes: todo.notes?.map((note) => ({
        ...note,
        _id: note._id.toString(),
      })),
    }));

    // Create the response with appropriate headers for file download
    return new Response(JSON.stringify(serializedTodos, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="todos-${user || "all"}-${
          new Date().toISOString().split("T")[0]
        }.json"`,
      },
    });
  } catch (error) {
    console.error("Error while exporting todos:", error);
    return errorResponse("Failed to export todos", 500);
  }
}
