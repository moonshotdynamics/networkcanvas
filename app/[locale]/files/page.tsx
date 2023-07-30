'use client'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type File = {
  id: string;
  json: string;
  name: string;
};

export default function FilesPage() {
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const t = useTranslations('FilesPage');

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch('/api/upload', { method: 'GET' });
      const files: File[] = await response.json();
      setFiles(files);
    };

    fetchFiles();
  }, []);

  const downloadFile = async (file: File) => {
    try {
      const blob = new Blob([file.json], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${file.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
    }
  };

    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen bg-purple-600">
          <p>Loading...</p>
        </div>
      );
    }

  if (status !== 'authenticated' || typeof session === 'boolean') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <h1 className="mb-4 text-3xl text-white">{t('title')}</h1>
        <a
          href="/login"
          className="px-6 py-3 text-white transition-all duration-200 ease-in-out rounded-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600"
        >
          Sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-500 dark:bg-purple-700">
      <h1 className="mb-8 text-white underline">{t("uploadedFiles")}</h1>
      {files.map((file) => (
        <div
          key={file.id}
          className="w-full p-2 m-2 text-center bg-white rounded dark:bg-gray-800 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
          role="button"
          onClick={() => downloadFile(file)}
        >
          <p className="text-purple-500 dark:text-purple-300">
            File number: {file.name}
          </p>
        </div>
      ))}
    </div>
  );
}

