import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Project from '@/models/project.model';
import { authOptions } from '../../auth/[...nextauth]/route';
 
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    const projectData = await request.json();

    // Explicitly handle createdBy
    const newProject = new Project({
      ...projectData,
      createdBy:session.user.name, // Ensure this is a valid MongoDB ObjectId
    });

    // Save project
    const savedProject = await newProject.save();

    return NextResponse.json(savedProject, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      
      // If it's a validation error, return more specific information
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: error.message 
          }, 
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create project' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // Fetch the projects where the user is the creator or part of the team
    const projects = await Project.find({
      $or: [
        { createdBy: session.user.name },
        { teamMembers: session.user.name },
      ],
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }

    // const projectId = context.params.id;
    const { id: projectId } = await context.params;
    const projectData = await request.json();

    const updatedProject = await Project.findByIdAndUpdate(
      projectId, 
      projectData, 
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: 'Failed to update project' }, 
      { status: 500 }
    );
  }
}