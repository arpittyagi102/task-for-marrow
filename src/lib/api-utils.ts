import { NextResponse } from "next/server";
import { ApiResponse, PaginatedResponse, TodoQueryParams, Todo } from "@/types";

export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    message,
  });
}

export function errorResponse(
  message: string,
  status: number = 400
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      data: null,
      error: message,
    },
    { status }
  );
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: TodoQueryParams
): NextResponse<PaginatedResponse<T[]>> {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}

export function validateTodoInput(data: any) {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push("Title is required");
  }

  if (data.priority && !["low", "medium", "high"].includes(data.priority)) {
    errors.push("Priority must be one of: low, medium, high");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    title: data.title?.trim(),
    description: data.description?.trim(),
    priority: data.priority || "medium",
    completed: data.completed || false,
    tags: Array.isArray(data.tags) ? data.tags : [],
    assignedUsers: Array.isArray(data.assignedUsers) ? data.assignedUsers : [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function parseQueryParams(
  searchParams: URLSearchParams
): TodoQueryParams {
  const params: TodoQueryParams = {};

  const page = searchParams.get("page");
  if (page) params.page = parseInt(page);

  const limit = searchParams.get("limit");
  if (limit) params.limit = parseInt(limit);

  const sortBy = searchParams.get("sortBy");
  if (sortBy) params.sortBy = sortBy as keyof Todo;

  const sortOrder = searchParams.get("sortOrder");
  if (sortOrder && ["asc", "desc"].includes(sortOrder)) {
    params.sortOrder = sortOrder as "asc" | "desc";
  }

  const priority = searchParams.get("priority");
  if (priority && ["low", "medium", "high"].includes(priority)) {
    params.priority = priority as Todo["priority"];
  }

  const completed = searchParams.get("completed");
  if (completed) params.completed = completed === "true";

  const tags = searchParams.get("tags");
  if (tags) params.tags = tags.split(",");

  const user = searchParams.get("user");
  if (user && user != "All Users") params.user = user;

  const search = searchParams.get("search");
  if (search) params.search = search;

  return params;
}
