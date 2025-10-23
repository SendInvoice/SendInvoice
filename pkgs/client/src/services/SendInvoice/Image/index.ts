export class ImageClient {
  private baseUrl: URL;

  constructor(baseUrl: URL) {
    this.baseUrl = baseUrl;
  }

  async uploadImage(token: string, file: File): Promise<{ id: string; }> {
    const url = new URL(this.baseUrl);
    url.pathname = `/api/v1/image`;

    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status === 403) {
      throw new Error("Not authenticated");
    }

    throw new Error(
      `Failed to upload image: ${response.status} ${response.statusText}`,
    );
  }
}
