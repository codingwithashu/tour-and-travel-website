import { createClient } from "../supabase/client"

export async function uploadToSupabase(files: File[]): Promise<string[]> {
    const supabase = createClient()
    const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName)

        return publicUrl
    })

    return Promise.all(uploadPromises)
}
