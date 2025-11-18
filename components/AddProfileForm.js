'use client'

import { useState, useRef, useLayoutEffect } from 'react';
import { useRouter } from "next/navigation";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+./g, "");
const trimCollapse = (s) => String(s ?? "").trim().replace(/\s+/g, "");

export default function AddProfileForm({initialData={}}) {

    const router = useRouter();
    const nameRef = useRef(null)
    const [values, setValues] = useState({
        name: initialData.name || "",
        title: initialData.title || "",
        email: initialData.email || "",
        bio: initialData.bio || "",
        img: null,
        existingImgURL: initialData.image_url || "",
    })

    const {name, title, email, bio, img, existingImgURL} = values

    const [success, setSuccess] = useState("")

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [errors, setErrors] = useState("")
    
    useLayoutEffect(()=>{
        console.log(nameRef)
        nameRef.current.focus()
    }, [])

    //const { addProfiles } = useContext(ProfilesContext);

    const onChange = (event) => {
        if(event.target.name === "image"){
            const file = event.target.files[0]
            console.log("img" + file)
            
            //const isFileok = file && file && file.size
            if (file && file.size < 1024*1024) {
                setErrors ("");
                console.log("small img" + file)
                setValues((prev) => ({...prev, img: file}));
            } else {
                setErrors ("File needs to be less than 1MB.");
                setValues((prev) => ({...prev, img: null}));
            }
            //const isFileOK = file && file.size < 1024*1024
            //dispatch({type: "SET_IMG", payload: isFileOK ? file : null})
        } else {
            setValues( (prev) => ({
                ...prev, 
                [event.target.name]: event.target.value
            }));
            //const {name, value} = event.target;
            //dispatch({type: "SET_VALUES", payload: {name, value} })
        }
        console.log(values)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        //dispatch({type: "START_SUBMITTING"})
        try {
            const formData = new FormData()
            formData.append("name", stripTags(trimCollapse(name)))
            formData.append("title", stripTags(trimCollapse(title)))
            formData.append("email", stripTags(trimCollapse(email)))
            formData.append("bio", stripTags(bio))

            if(img) {
                formData.append("img", img);

            }
            if(existingImgURL){
                formData.append("existingImgURL", existingImgURL)
            }
            const method = initialData.id ? "PUT" : "POST";
            const fetchURL = initialData.id ? `/api/profiles/${initialData.id}` : "/api/profiles";

            const response = await fetch(fetchURL, {
                method: method,
                body: formData,
            });
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error||"Failed to submit form")
            }
            const successMessage = initialData.id ? "Profile updated successfully!" : "Profile added successfully!";
            setSuccess(successMessage);
            if(!initialData.id){
                setValues({
                    name: "",
                    title: "",
                    email: "",
                    bio: "",
                    img: null,
                }); 

                const fileInput = document.getElementById("img");
                if (fileInput) fileInput.value = "";
            }
            const redirect = initialData.id ? `/profile/${initialData.id}` : "/";

            const cleanedValues = {
                name: stripTags(trimCollapse(name)),
                title: stripTags(trimCollapse(title)),
                email: stripTags(trimCollapse(email)),
                bio: stripTags(bio.trim()),
                img: img ? URL.createObjectURL(img) : "",
            };
            //addProfiles(cleanedValues);
            
            setTimeout(()=> {
                setSuccess("")
                router.push(redirect)
            }, 1000)
            //e.currentTarget.reset();
            //navigate("/")
        } catch(error) {
            setErrors(error.message)

            //dispatch({type: "HAS_ERROR"})
        } finally {
            setIsSubmitting(false);
            //dispatch({type: "FINISH_SUBMIT"})
        }

    };

    return (
        <div>
            <h2>Add Profile</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor = "name">Name:</label>
                <input ref = {nameRef} type = "text" name = "name" id = "name" required value = {name} onChange = {onChange} />
                <label htmlFor = "title">Title:</label>
                <input type = "text" name = "title" id = "title" required value = {title} onChange = {onChange}/>
                <label htmlFor = "email">Email:</label>
                <input type = "text" name = "email" id = "email" required value = {email} onChange = {onChange}/>
                <label htmlFor = "bio">Bio:</label>
                <textarea name = "bio" id = "bio" placeholder = "Add bio..." required value = {bio} onChange = {onChange}></textarea>
                <label htmlFor = "image">Image:</label>
                <input type = "file" name = "image" id = "image" onChange = {onChange}/>
                <br></br>
                {initialData.id && <p>Current image will be kept ig no new image is uploaded</p>}
                {errors && <p >{errors}</p>}
                <button 
                    type="submit" 
                    disabled={isSubmitting || 
                        !stripTags(trimCollapse(name)) || 
                        !stripTags(trimCollapse(title)) ||
                        !stripTags(trimCollapse(email)) ||
                        !stripTags(bio).trim() ||
                        (!img && !existingImgURL)
                    }
                    >{initialData.id ? "Update Profile" : "Add Profile"}</button>
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    )
}