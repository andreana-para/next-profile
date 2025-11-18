import AddProfileForm from "@/components/AddProfileForm";
import prisma from "@/lib/prisma";
import DeleteButton from "@/components/DeleteButton";

export const runtime = 'nodejs'

export default async function EditProfilePage({params}) {
    const {id} = await params;
    const profile = await prisma.profiles.findUnique({
        where: {
            id: parseInt(id),
        },

    });
    console.log(profile)
    return (
        <>
            <h1>Edit Profile</h1>
            <AddProfileForm initialData={profile}/>
            <DeleteButton profileId={profile.id} />
        </>
    );

}