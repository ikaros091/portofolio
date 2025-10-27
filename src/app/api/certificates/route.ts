import { NextResponse } from 'next/server';
import CertificateModel from '@/src/db/models/cetificateModel';

export async function GET() {
  try {
    const certificates = await CertificateModel.collection().find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: certificates,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch certificates',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
