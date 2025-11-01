import styles from "./profile.module.css"

export default async function ({ params }) {
    const { id } = await params;

    const response = await fetch(`https://web.ics.purdue.edu/~zong6/profile-app/fetch-data-with-id.php?id=${id}`, {
        next: { revalidate: 60 },
    })
    const profile = await response.json()

    return (profile ? (
        <div className={styles.page}>
            <h1 className={styles.name}>Profile of {profile.name} </h1>
            <img src={profile.image_url} alt={profile.name} className={styles.image}/>
            <p className={styles.title}>{profile.title}</p>
            <p className={styles.email}>{profile.email}</p>
            <p className={styles.bio}>{profile.bio}</p>
        </div>
    ) : (<div>loading...</div>)

    )
}