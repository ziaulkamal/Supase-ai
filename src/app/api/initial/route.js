import { getSettings } from "@/app/lib/supabase";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const setting = await getSettings();
        return NextResponse.json({setting});

    } catch (error) {
        console.error(error);
        return NextResponse.json(error);
    }
}