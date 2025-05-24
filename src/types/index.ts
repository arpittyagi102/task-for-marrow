import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  _id?: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Todo {
  _id?: ObjectId;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  tags: string[];
  assignedUsers: string[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: keyof Todo;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  priority?: Todo["priority"];
  completed?: boolean;
  tags?: string[];
  assignedUsers?: string[];
}

export interface TodoQueryParams extends PaginationParams, FilterParams {}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
