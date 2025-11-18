"use client"
import { useState } from 'react'
import { useRouter } from "next/navigation"

export default function DeleteButton({profileId}) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState("");
    const router = useRouter();
    const handleDelete = async () => {
        setIsDeleting(true)
        setError("")

        try{
            const response = await fetch(`/api/profiles/${profileId}`,{
                method: "DELETE",
            });

            if(!response.ok) {
                throw new Error("Failed to delete profile");
            }

            router.push("/")
        } catch (error) {
            setError(error.message)
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
        <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Profile"}
        </button>
        {error && <p>{error}</p>}
        </>
    )
}