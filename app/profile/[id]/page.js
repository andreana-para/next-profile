import Link from "next/link"
import styles from "./profile.module.css"
import prisma from "@/lib/prisma";

export const runtime = 'nodejs'

async function fetchProfileData(id){
    const profile = prisma.profiles.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if(!profile){
        throw new Error("Profile not found")
    }
    return profile;
}

export default async function ({ params }) {
    const { id } = await params;

    // const response = await fetch(
    //     `https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${id}`, 
    //     {
    //     next: { revalidate: 60 },
    // })
    const profile = await fetchProfileData(id)

    return (profile ? (
        <div className={styles.page}>
            <h1 className={styles.name}>Profile of {profile.name} </h1>
            <img src={profile.image_url} alt={profile.name} className={styles.image}/>
            <p className={styles.title}>{profile.title}</p>
            <p className={styles.email}>{profile.email}</p>
            <p className={styles.bio}>{profile.bio}</p>
            <Link href={`/profile/${id}/edit`} className="button">Edit Profile</Link>
        </div>
    ) : (<div>loading...</div>)
        
    )
}