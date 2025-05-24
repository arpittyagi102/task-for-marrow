import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todosCollection = await getDatabase("todos");
    const data = await request.json();

    if (!data.content?.trim()) {
      return errorResponse("Note content is required");
    }

    // Validate the todo exists
    const existingTodo = await todosCollection.findOne({
      _id: new ObjectId(params.id),
    });
    if (!existingTodo) {
      return errorResponse("Todo not found", 404);
    }

    const newNote = {
      _id: new ObjectId(),
      content: data.content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await todosCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $push: { notes: newNote },
        $set: { updatedAt: new Date() },
      }
    );

    if (result.matchedCount === 0) {
      return errorResponse("Todo not found", 404);
    }

    const updatedTodo = await todosCollection.findOne({
      _id: new ObjectId(params.id),
    });
    return successResponse(updatedTodo, "Note added successfully");
  } catch (error) {
    console.error("Error while adding note:", error);
    return errorResponse("Failed to add note", 500);
  }
}