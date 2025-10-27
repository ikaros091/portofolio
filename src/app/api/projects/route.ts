import { NextResponse } from 'next/server';
import ProjectModel from '@/src/db/models/projectModel';

export async function GET() {
  try {
    const projects = await ProjectModel.collection().find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: projects,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch projects',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
