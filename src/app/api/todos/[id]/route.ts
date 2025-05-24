import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  successResponse,
  errorResponse,
  validateTodoInput,
} from "@/lib/api-utils";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todosCollection = await getDatabase("todos");
    const todo = await todosCollection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!todo) {
      return errorResponse("Todo not found", 404);
    }

    return successResponse(todo);
  } catch (error) {
    console.error("Error while fetching todo:", error);
    return errorResponse("Failed to fetch todo", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todosCollection = await getDatabase("todos");
    const data = await request.json();

    // Validate the todo exists
    const existingTodo = await todosCollection.findOne({
      _id: new ObjectId(params.id),
    });
    if (!existingTodo) {
      return errorResponse("Todo not found", 404);
    }

    // Validate and prepare update data
    const validatedData = validateTodoInput(data);
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await todosCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return errorResponse("Todo not found", 404);
    }

    const updatedTodo = await todosCollection.findOne({
      _id: new ObjectId(params.id),
    });
    return successResponse(updatedTodo, "Todo updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    console.error("Error while updating todo:", error);
    return errorResponse("Failed to update todo", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todosCollection = await getDatabase("todos");
    const result = await todosCollection.deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return errorResponse("Todo not found", 404);
    }

    return successResponse(null, "Todo deleted successfully");
  } catch (error) {
    console.error("Error while deleting todo:", error);
    return errorResponse("Failed to delete todo", 500);
  }
}

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
        // @ts-ignore
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
