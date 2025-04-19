export async function fetchMedia(id: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/media/${id}?`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Media: ${id}`);
      }
      const data = await response.json();
      return await data;
    } catch (error) {
      console.error("Error fetching global:", error);
      return null;
    }
}
  