// app/utils/currentClassroom.ts
const STORAGE_KEY= "currentClassroom";

export function getCurrentClassroom(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) || ""
}

export function setCurrentClassroom(id: string) {
    if(typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, id);
}