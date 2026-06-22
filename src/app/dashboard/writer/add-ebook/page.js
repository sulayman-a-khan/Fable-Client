'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiBookOpen, FiDollarSign, FiPlusCircle, FiArrowLeft, FiImage, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';

const GENRES = [
  'Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror',
  'Thriller', 'Non-Fiction', 'Biography', 'Self-Help', 'History', 'Poetry'
];

export default function AddEbookPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    price: '',
    description: '',
    coverImage: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [urlMode, setUrlMode] = useState(false); // Direct URL input toggle

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbKey) {
      toast.error('Image upload not configured. Please paste a URL instead.');
      setUrlMode(true);
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    const toastId = toast.loading('Uploading cover image...');

    try {
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: uploadData,
      });
      const data = await response.json();

      if (data.success && data.imageUrl) {
        setFormData((prev) => ({ ...prev, coverImage: data.imageUrl }));
        toast.success('Cover image uploaded successfully!', { id: toastId });
      } else {
        toast.error(data.message || 'Failed to upload image.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Try entering a URL directly.', { id: toastId });
      setUrlMode(true);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.genre || formData.price === '' || !formData.coverImage || !formData.description) {
      toast.error('Please fill out all fields.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Price must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/ebooks', {
        ...formData,
        price: priceNum
      });
      if (data.success) {
        toast.success('Ebook published successfully!');
        router.push('/dashboard/writer/ebooks');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to publish ebook.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
      >
        <FiArrowLeft />
        <span>Back to Ebooks</span>
      </button>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Publish Ebook</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload your original creation and launch it globally on Fable.</p>
      </div>

      <div className="card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
          {/* Cover image field */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Book Cover Image</label>

            {formData.coverImage ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  style={{ width: '80px', height: '112px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                />
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    <FiCheckCircle />
                    <span>Image Selected</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {!urlMode ? (
                  <div style={{
                    border: '2px dashed var(--glass-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }} className="upload-dropzone">
                    <input
                      type="file"
                      id="coverImageUpload"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="coverImageUpload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <FiUploadCloud style={{ fontSize: '3rem', color: 'var(--accent-secondary)' }} />
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Click to upload file</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PNG, JPEG or WebP up to 5MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      name="coverImage"
                      placeholder="Paste cover image https:// url..."
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                )}
                <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setUrlMode(!urlMode)}
                    style={{ background: 'transparent', color: 'var(--accent-primary-hover)', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    {urlMode ? 'Switch to file upload' : 'Or paste direct URL link instead'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">Ebook Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="The Chronicles of Fable"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Genre */}
            <div className="form-group">
              <label className="form-label" htmlFor="genre">Genre</label>
              <select
                id="genre"
                name="genre"
                required
                value={formData.genre}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="form-group" style={{ maxWidth: '300px' }}>
            <label className="form-label" htmlFor="price">Price (USD)</label>
            <div style={{ position: 'relative' }}>
              <FiDollarSign style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="number"
                step="0.01"
                min="0"
                id="price"
                name="price"
                required
                placeholder="9.99"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                style={{ paddingLeft: '2.8rem' }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Set to 0 to make this ebook free for everyone.
            </span>
          </div>

          {/* Full description / content */}
          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" htmlFor="description">Book Content / Description</label>
            <textarea
              id="description"
              name="description"
              required
              placeholder="Paste the full content or chapter-wise story here. This text will be accessible in Fable Reader after purchase."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              style={{ minHeight: '320px', fontFamily: 'Georgia, serif', fontSize: '1.05rem', lineHeight: '1.7' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || uploading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <FiPlusCircle />
            <span>{submitting ? 'Publishing Ebook...' : 'Publish Ebook'}</span>
          </button>
        </form>
      </div>

      <style jsx global>{`
        .upload-dropzone:hover {
          border-color: var(--accent-primary) !important;
          background: var(--bg-surface) !important;
        }
      `}</style>
    </div>
  );
}
