import React, { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftIcon } from '../components/Icons';
import { addPost } from '../lib/db';

const AddPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Protect this route
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!imagePreview || !currentUser) {
        alert("Please select an image.");
        return;
    }

    setIsLoading(true);
    addPost({ image: imagePreview, caption, userId: currentUser.id });
    setIsLoading(false);
    navigate('/');
  };

  // Render a loading state or null while checking for user
  if (!currentUser) {
    return <div className="bg-white dark:bg-black min-h-full flex items-center justify-center"><p className="text-gray-500">Redirecting to login...</p></div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-full text-gray-900 dark:text-white">
      <header className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">New Post</h1>
        <button 
            onClick={handleSubmit}
            disabled={!imagePreview || isLoading}
            className="font-bold text-fuchsia-500 dark:text-fuchsia-400 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Posting...' : 'Share'}
        </button>
      </header>
      
      <div className="p-4 space-y-4">
        <div>
            {imagePreview ? (
                 <div className="relative">
                    <img src={imagePreview} alt="Selected preview" className="w-full h-auto max-h-[60vh] object-contain rounded-lg" />
                     <button onClick={() => { setImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                 </div>
            ) : (
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-600 dark:text-gray-500">PNG, JPG or GIF</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
            )}
        </div>

        <textarea
          className="w-full h-24 p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddPostPage;