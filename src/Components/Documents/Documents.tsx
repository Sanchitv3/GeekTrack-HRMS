import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, addDoc, Firestore } from 'firebase/firestore';
import { db, storage } from '../../firebase';

interface Document {
  name: string;
  size: number;
  type: string;
  url?: string;
}

const Documents: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch documents from Firestore on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'documents'));
        const documents: Document[] = [];
        querySnapshot.forEach((doc) => {
          documents.push(doc.data() as Document);
        });
        setUploadedDocuments(documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles) {
      setLoading(true);
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const storageRef = ref(storage, `documents/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        const docData: Document = {
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        };

        // Save document metadata to Firestore
        await addDoc(collection(db, 'documents'), docData);

        return docData;
      });

      try {
        const newDocuments = await Promise.all(uploadPromises);
        setUploadedDocuments((prev) => [...prev, ...newDocuments]);
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='flex justify-center flex-col items-center gap-10'>
      <h1 className="text-3xl font-serif font-semibold tracking-wider text-center">
        Documents
      </h1>
      <div className='shadow-2xl flex w-[50%] p-10 justify-center items-center rounded-3xl gap-4'>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className='text-sm text-grey-500
              file:mr-5 file:py-6 file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:cursor-pointer hover:file:bg-amber-50
              hover:file:text-amber-700'
        />
        <button onClick={handleUpload} disabled={loading} className='p-4 bg-[#3B82F6] rounded-full font-bold text-white hover:opacity-80 hover:translate-y-1 duration-700'>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      
      {uploadedDocuments.length > 0 && (
        <div>
          <h3 className="text-3xl font-serif font-semibold tracking-wider text-center">
        Uploaded Documents
      </h3>
          <ul className='p-6'>
            {uploadedDocuments.map((doc, index) => (
              <li key={index} className='bg-slate-100 rounded-3xl p-4 m-2 flex justify-between items-center'>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className='p-4 bg-slate-900 text-white rounded-3xl hover:bg-red-700 duration-700'>
                  {doc.name}
                </a> ({(doc.size / 1024).toFixed(2)} KB) - {doc.type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Documents;
