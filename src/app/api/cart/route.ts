import { retrieveCart } from "@lib/data/cart"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const cart = await retrieveCart().catch(() => null)
    
    return NextResponse.json({ 
      cart,
      success: true 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { 
        cart: null, 
        success: false, 
        error: 'Failed to retrieve cart' 
      },
      { status: 500 }
    )
  }
}
