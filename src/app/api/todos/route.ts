import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  validateTodoInput,
  parseQueryParams,
} from "@/lib/api-utils";
import { Todo, TodoQueryParams } from "@/types";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const todosCollection = await getDatabase("todos");
    const params = parseQueryParams(request.nextUrl.searchParams);

    // Build filter
    const filter: any = {};
    if (params.priority) filter.priority = params.priority;
    if (params.completed !== undefined) filter.completed = params.completed;
    if (params.tags?.length) filter.tags = { $in: params.tags };
    if (params.assignedUsers?.length)
      filter.assignedUsers = { $in: params.assignedUsers };

    // Build sort
    const sort: any = {};
    if (params.sortBy) {
      sort[params.sortBy] = params.sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }

    // Get total count
    const total = await todosCollection.countDocuments(filter);

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const todos = await todosCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    return paginatedResponse(todos, total, params);
  } catch (error) {
    console.error("Error while fetching todos:", error);
    return errorResponse("Failed to fetch todos", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const todosCollection = await getDatabase("todos");
    const data = await request.json();

    const validatedData = validateTodoInput(data);
    const newTodo: Todo = {
      ...validatedData,
      notes: [],
    };

    const result = await todosCollection.insertOne(newTodo);
    return successResponse(
      { ...newTodo, _id: result.insertedId },
      "Todo created successfully"
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message);
    }
    console.error("Error while creating todo:", error);
    return errorResponse("Failed to create todo", 500);
  }
}
