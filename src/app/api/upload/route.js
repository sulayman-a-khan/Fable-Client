export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return Response.json({ success: false, message: 'No image file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json({ success: false, message: 'Only JPEG, PNG, and WebP images are allowed.' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json({ success: false, message: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      return Response.json({ success: false, message: 'Image upload service not configured.' }, { status: 503 });
    }

    // Upload to imgBB using FormData (multipart/form-data)
    const imgbbForm = new FormData();
    imgbbForm.append('key', apiKey);
    imgbbForm.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbForm,
      // Don't set Content-Type header manually when using FormData, fetch does it automatically with boundary
    });

    const data = await response.json();

    if (response.ok && data.success && data.data?.url) {
      return Response.json({
        success: true,
        imageUrl: data.data.url,
        displayUrl: data.data.display_url,
      });
    } else {
      console.error('ImgBB response error:', data);
      return Response.json({ success: false, message: data.error?.message || 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return Response.json({ success: false, message: 'An error occurred during upload.' }, { status: 500 });
  }
}
