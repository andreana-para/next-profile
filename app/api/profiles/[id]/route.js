import prisma from "@/lib/prisma";
import { put } from '@vercel/blob'

export const runtime = 'nodejs'

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const profileId = parseInt(id)
        if (isNaN(profileId)) {
            return Response.json({ error: "Invalid profile ID" }, { status: 400 });

        }
        const formData = await request.formData();
        const name = formData.get('name');
        const title = formData.get('title');
        const email = formData.get('email');
        const bio = formData.get('bio');
        const imgFile = formData.get('img');
        let imgURL = formData.get('existingImgURL')

        if (!name || name.trim() === "") {
            return Response.json({ error: "Name is required" }, { status: 400 })
        } else if (!title || title.trim() === "") {
            return Response.json({ error: "Title is required" }, { status: 400 })
        } else if (!email || email.trim() === "") {
            return Response.json({ error: "Email is required" }, { status: 400 })
        } else if (!bio || bio.trim() === "") {
            return Response.json({ error: "Bio is required" }, { status: 400 })
        } else if (!imgURL && imgFile && imgFile.size > 1024 * 1024) {
            return Response.json({ error: "Image size must be less than 1MB" }, { status: 400 })
        }

        if (imgFile) {
            const blob = await put(imgFile.name, imgFile, {
                access: 'public'
            });
            imgURL = blob.url
        }



        const update = await prisma.profiles.update({
            where: { id: profileId },
            data: {
                name: name.trim(),
                title: title.trim(),
                email: email.trim(),
                bio: bio.trim(),
                image_url: imgURL,
            }
        })
        return Response.json({ data: update }, { status: 200 });

    } catch (error) {
        if (error.code === 'P2002') {
            return Response.json({ error: "Email already exists" }, { status: 400 });
        }
        if (error.code === 'P2025') {
            return Response.json({error: 'Profile not found'}, {status: 404})
        }

        return Response.json({error: error.message}, {status: 500})
    }
}

export async function DELETE (request, { params }) {
    try {
        const { id} = await params;
        const profileId = parseInt(id);

        if(isNaN(profileId)) {
            return Response.json({error: "Invalid profile ID"}, {status: 400});
        }

        await prisma.profiles.delete({
            where: {id: profileId},
        });
        return Response.json({message: 'Profile deleted successfully'}, {status: 200})
    } catch (error) {
        console.error('Error deleting profile:', error);

        if (error.code === 'P2025' ){
            return Response.json({error: 'Profile not found'}, {status: 404})
        }

        return Response.json({error: "Failed to delete profile"}, {status: 500})
    }
}