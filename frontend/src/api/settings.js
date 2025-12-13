export async function getSettings(){
    const res = await fetch("/api/settings", {
        method: "GET",
        credentials: "include",
    });

    if(!res.ok) throw new Error("Failed to load settings");
    return res.json()
}



export async function patchSettings(payload){
    const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if(!res.ok) throw new Error("Failed to save settings");
    return res.json();
}

export async function uploadAvatar(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/settings/upload-avatar", {
        method: "POST",
        credentials: "include",
        body: form,
    });

    if(!res.ok) throw new Error("Failed to upload avatar");
    return res.json();
}