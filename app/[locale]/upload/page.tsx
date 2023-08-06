'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { toastSuccess, toastError } from '@/utils/toasts';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'participant';
}


export default function UploadPage() {
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const t = useTranslations('Upload');

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;

       const fileReader = new FileReader();
       fileReader.onload = async (e) => {
         const fileData = e.target?.result;
         const jsonData = JSON.parse(fileData as string);
         
          const dataToSend = {
            fileContent: jsonData,
            fileName: file.name,
          };

         if (file) {
           await fetch('/api/upload', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(dataToSend),
           })
             .then((response) => response.json())
             .catch((error) => console.error(error));
         } else {
           console.log('File upload failed.');
           toastError('File upload failed.')
         }

         toastSuccess('File uploaded successfully');
       };
    fileReader.readAsText(file);
  };


  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFile(fileList[0]);
    }
  };

   if (status === 'loading') {
     return (
       <div className="flex items-center justify-center min-h-screen bg-purple-600">
         <p>Loading...</p>
       </div>
     );
   }
  const user = session?.user as User & { role: string };

  if (status === 'authenticated' && user?.role === 'admin') {
        return (
          <div className="flex items-center justify-center min-h-screen bg-purple-600">
            <div className="flex flex-col items-center w-full px-4 sm:w-3/4 md:w-1/2 lg:w-1/3">
              <h3 className="mb-4">{t('title')}</h3>
              <form
                className="w-full p-10 bg-white rounded-lg shadow-lg"
                onSubmit={submit}
              >
                <div className="mb-4">
                  <input
                    className="box-border w-full max-w-full px-3 py-2 text-black border rounded-md"
                    type="file"
                    accept=".json"
                    onChange={onFileChange}
                  />
                </div>
                <button
                  className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-700"
                  type="submit"
                >
                  Upload
                </button>
              </form>
            </div>
          </div>
        );
  }
    return redirect('/');
}
