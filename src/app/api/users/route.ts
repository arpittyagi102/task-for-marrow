import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { User } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const usersCollection = await getDatabase("users");
    const users = await usersCollection.find().toArray();
    return successResponse(users);
  } catch (error) {
    console.error("Error while getting users:", error);
    return errorResponse("Failed to fetch users", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const usersCollection = await getDatabase("users");
    const data = await request.json();

    // Validate required fields
    if (!data.username?.trim() || !data.email?.trim()) {
      return errorResponse("Username and email are required");
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) {
      return errorResponse("User with this username or email already exists");
    }

    const newUser: User = {
      username: data.username.trim(),
      email: data.email.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    return successResponse(
      { ...newUser, _id: result.insertedId },
      "User created successfully"
    );
  } catch (error) {
    console.error("Error while creating user:", error);
    return errorResponse("Failed to create user", 500);
  }
}
