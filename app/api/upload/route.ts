import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const folder: string = (data.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write the file
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/${folder}/${fileName}`;

    return NextResponse.json({
      message: "Upload successful",
      url: publicUrl,
      filename: fileName,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
