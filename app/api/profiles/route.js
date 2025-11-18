import prisma from "@/lib/prisma";
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function POST(request){
    try{
        const formData = await request.formData();
        const name = formData.get('name');
        const title = formData.get('title');
        const email = formData.get('email');
        const bio = formData.get('bio');
        const img = formData.get('img');

        if(!name || name.trim() === ""){
            return Response.json({error: "Name is required"}, {status: 400})
        } else if (!title || title.trim() === ""){
            return Response.json({error: "Title is required"}, {status: 400})
        } else if (!email || email.trim() === ""){
            return Response.json({error: "Email is required"}, {status: 400})
        } else if (!bio || bio.trim() === ""){
            return Response.json({error: "Bio is required"}, {status: 400})
        } else if (!img){

            return Response.json({error: "Image is required"}, {status: 400})
        } else if (img.size > 1024 *  1024) {
            return Response.json({error: "Image size must be less than 1MB"}, {status: 400})
        }

        const blob = await put(img.name, img, {
            access:'public'
        })

        const profile = await prisma.profiles.create({
            data: {
                name: name.trim(),
                title: title.trim(),
                email: email.trim(),
                bio: bio.trim(),
                image_url: blob.url }
        })
        return Response.json({data: profile}, {status: 201})
    } catch(error) {
        console.log(error)
        if(error.code === "P2002"){
            return Response.json({error:"Email already exists"}, {status: 400})
        }
        return Response.json({error: "Something went wrong"}, {status: 500})
    }
}