import styles from "./page.module.css"
import Link from "next/link"
import Card from "@/components/Card"
import prisma from "@/lib/prisma";

export const runtime = "nodejs"

async function getTitles() {
    const profiles = await prisma.profiles.findMany({
        distinct: ["title"],
        select: {title: true}
    });
    return profiles ? profiles.map((p) => p.title): [];
} 

async function getProfiles(title, search) {
    const profiles = await prisma.profiles.findMany({
        where: {
            ...(title && { title: {contains: title, mode: "insensitive"} }),
            ...(search && {name: {contains: search, mode: "insentitive"}}),
        },
    });
    return profiles;
}

export default async function Home({ searchParams }) {
    const { title, search } = await searchParams;
    
    const [titles, profiles] = await Promise.all([
        getTitles(),
        getProfiles(title, search)
    ])
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Profiles</h1>
                {/* filters
                fetched cards */}
                <form method="GET" action="/">
                    <div className="filter-container">
                        <div className="select-filter">
                            <label htmlFor="select">Select a title:</label>
                            <select id="select" defaultValue={title} name="title">
                                <option defaultValue="">ALL</option> {
                                    titles.map(title => <option key={title} defaultValue={title} > {title} </option>)
                                }
                            </select>
                        </div>
                        <div className="search-box-container">
                            <label htmlFor="search">Search by name:</label>
                            <input id={styles.search} defaultValue={search} name="search" />
                            <br></br><br></br>
                        </div>
                        <button type="submit">Apply</button>
                        <Link href="/">Clear</Link>
                    </div>
                </form>

                <div className="cards">
                    {profiles?profiles.map((profile) => (
                        <Link key={profile.id} href ={`/profile/${profile.id}`}>
                        <Card
                            key={profile.id}
                            name={profile.name}
                            title={profile.title}
                            email={profile.email}
                            img={profile.image_url}
                        />
                        </Link>
                    )):<div>loading...</div>}
                </div>
            </main>
        </div>
    );
}