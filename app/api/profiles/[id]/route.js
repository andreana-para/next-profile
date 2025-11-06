let profiles = [
    { id: 1, name: "Ava Lee", major: "CS", year: 2, gpa: 3.6 },
    { id: 2, name: "Ben Park", major: "CGT", year: 3, gpa: 3.2 },
]

export async function GET(request) {
    const searchParams = request.nextURL.searchParams;
    const year = searchParams.get("year") || "";
    const name = searchParams.get("name") || "";
    const major = searchParams.get("major") || "";

    if (year) {
        profiles = profiles.filter(
            (profile) => profile.year.toString() === year
        );
    }

    if (name) {
        profiles = profiles.filter(
            (profile) = profile.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (major) {
        profiles = profiles.filter(
            (profile) = profile.major.toLowerCase() === major.toLowerCase()
        );
    }
    return Response.json({ data: profiles }, {status: 200 });
}

export async function POST(request) {
    const newProfile = await request.json();
    try{
        if(!newProfile.name || newProfile.name.trim() === ""){
            return Response.json({error: "Name is required"}, {status: 400});
        } else if(!newProfile.major || newProfile.major.trim() === ""){
            return Response.json({error: "Major is required"}, {status: 400});
        } else if(!newProfile.year || isNaN(newProfile.year) || (newProfile.year < 1 || newProfile.year > 4)){
            return Response.json({error: "Valid year is required"}, {status: 400});
        } else if(!newProfile.gpa || isNaN(newProfile.gpa) || (newProfile.gpa < 0 ||newProfile.gpa > 4)){
            return Response.json({error: "Valid GPA is required"}, {status: 400});
        }

        const newProfileData = {
            id: Date.now(),
            name: newProfile.name.trim(),
            major: newProfile.major.trim(),
            year: parseInt(newProfile.year),
            gpa: parseInt(newProfile.gpa)
        };
        profiles.push(newProfileData);
        return Response.json(newProfileData, { status: 201});
    }catch(error){
        return Response.json({error: "Invalid data format"}, {status: 400});
    }   
}

export async function DELETE(request) {
    const searchParams = request.nextURL.searchParams;
    const id = searchParams.get("id");
    profiles = profiles.filter((profile) => profile.id !== parseInt(id));
    return Response.json({ message: "Profile deleted" }, {status: 200 });
}

export async function PUT(request) {
    const searchParams = request.nextURL.searchParams;
    const id = searchParams.get("id");
    const updates = await request.json();

    const index = profiles.findIndex((profile) => profile.id === parseInt(id));

    if (index === -1) {
        return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const profile = profiles[index];

    if (updates.name !== undefined) {
        if (typeof updates.name !== "string" || updates.name.trim() === "") {
            return Response.json({ error: "Invalid name" }, { status: 400 });
        }
        profile.name = updates.name.trim();
    }

    if (updates.major !== undefined) {
        if (typeof updates.major !== "string" || updates.major.trim() === "") {
            return Response.json({ error: "Invalid major" }, { status: 400 });
        }
        profile.major = updates.major.trim();
    }

    if (updates.year !== undefined) {
        if (isNaN(updates.year) || updates.year < 1 || updates.year > 4) {
            return Response.json({ error: "Invalid year" }, { status: 400 });
        }
        profile.year = parseInt(updates.year);
    }

    if (updates.gpa !== undefined) {
        if (isNaN(updates.gpa) || updates.gpa < 0 || updates.gpa > 4) {
            return Response.json({ error: "Invalid GPA" }, { status: 400 });
        }
        profile.gpa = parseFloat(updates.gpa);
    }

    return Response.json(profile, { status: 200 });
}
