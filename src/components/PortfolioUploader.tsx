import React, { useState, useRef, useCallback } from 'react';
import { UserService } from '../services/store';

interface PortfolioItem {
  id: string;
  type: 'image' | 'audio';
  url: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  uploadedAt: string;
}

interface PortfolioUploaderProps {
  userId: string;
  onUploadComplete?: (items: PortfolioItem[]) => void;
}

const PortfolioUploader: React.FC<PortfolioUploaderProps> = ({ userId, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedType, setSelectedType] = useState<'image' | 'audio'>('image');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Maximum file sizes
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

  // Supported formats
  const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFilesSelected = useCallback(async (files: FileList | null, type: 'image' | 'audio') => {
    if (!files || files.length === 0) return;

    const user = UserService.getCurrentUser();
    if (!user) {
      alert('الرجاء تسجيل الدخول أولاً');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const newItems: PortfolioItem[] = [];
    const totalFiles = files.length;
    let processedFiles = 0;

    for (const file of Array.from(files)) {
      // Validate file type
      const validTypes = type === 'image' ? IMAGE_TYPES : AUDIO_TYPES;
      if (!validTypes.includes(file.type)) {
        alert(`نوع الملف ${file.name} غير مدعوم`);
        continue;
      }

      // Validate file size
      const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;
      if (file.size > maxSize) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى ${formatFileSize(maxSize)}`);
        continue;
      }

      try {
        // Read file as data URL (simulating upload)
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Get audio duration if needed
        let duration: number | undefined;
        let thumbnail: string | undefined;

        if (type === 'audio') {
          duration = await getAudioDuration(dataUrl);
        } else {
          thumbnail = dataUrl; // For images, thumbnail is the same as url
        }

        const newItem: PortfolioItem = {
          id: Math.random().toString(36).substring(2, 11),
          type,
          url: dataUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          thumbnail,
          duration,
          uploadedAt: new Date().toISOString(),
        };

        newItems.push(newItem);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`حدث خطأ أثناء معالجة الملف ${file.name}`);
      }

      processedFiles++;
      setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
    }

    // Update portfolio
    const updatedPortfolio = [...portfolio, ...newItems];
    setPortfolio(updatedPortfolio);

    // Update user profile
    const currentPortfolio = user.portfolio || [];
    UserService.update(user.id, {
      portfolio: [...currentPortfolio, ...newItems.map(item => ({
        type: item.type,
        url: item.url,
        title: item.title,
      }))],
    });

    setIsUploading(false);
    onUploadComplete?.(newItems);
  }, [portfolio, onUploadComplete]);

  const getAudioDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = () => {
        resolve(0);
      };
    });
  };

  const removeItem = (id: string) => {
    const updatedPortfolio = portfolio.filter(item => item.id !== id);
    setPortfolio(updatedPortfolio);

    // Update user profile
    const user = UserService.getCurrentUser();
    if (user) {
      const currentPortfolio = user.portfolio || [];
      UserService.update(user.id, {
        portfolio: currentPortfolio.filter((_, index) =>
          portfolio.findIndex(p => p.id === id) !== index
        ),
      });
    }

    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const updateItemTitle = (id: string, title: string) => {
    const updatedPortfolio = portfolio.map(item =>
      item.id === id ? { ...item, title } : item
    );
    setPortfolio(updatedPortfolio);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    handleFilesSelected(files, selectedType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📁</span>
          معرض الأعمال
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('image')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'image'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🖼️ صور
          </button>
          <button
            onClick={() => setSelectedType('audio')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'audio'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎵 صوتيات
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => selectedType === 'image' ? imageInputRef.current?.click() : audioInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          isUploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-primary hover:bg-orange-50/50'
        }`}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium">جاري رفع الملفات...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-4">
              {selectedType === 'image' ? '🖼️' : '🎤'}
            </div>
            <p className="text-lg font-medium text-gray-700">
              اسحب الملفات هنا أو اضغط للاختيار
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedType === 'image' ? (
                <>
                  PNG, JPG, WebP (حد أقصى {formatFileSize(MAX_IMAGE_SIZE)} لكل ملف)
                </>
              ) : (
                <>
                  MP3, WAV, OGG, M4A (حد أقصى {formatFileSize(MAX_AUDIO_SIZE)} لكل ملف)
                </>
              )}
            </p>
          </>
        )}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept={IMAGE_TYPES.join(',')}
        multiple
        onChange={(e) => handleFilesSelected(e.target.files, 'image')}
        className="hidden"
      />
      <input
        ref={audioInputRef}
        type="file"
        accept={AUDIO_TYPES.join(',')}
        multiple
        onChange={(e) => handleFilesSelected(e.target.files, 'audio')}
        className="hidden"
      />

      {/* Portfolio Grid */}
      {portfolio.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold mb-4">
            الأعمال ({portfolio.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`relative group rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                {item.type === 'image' ? (
                  <div className="aspect-square">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    {item.duration && (
                      <span className="text-sm">{formatDuration(item.duration)}</span>
                    )}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className="p-2 bg-white rounded-full text-primary hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="p-2 bg-white rounded-full text-red-500 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Type Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.type === 'image' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                  }`}>
                    {item.type === 'image' ? '🖼️' : '🎵'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-l from-primary to-secondary p-4 text-white flex items-center justify-between">
              <h3 className="font-bold">{selectedItem.title}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  className="w-full rounded-xl"
                />
              ) : (
                <div className="bg-gray-50 rounded-xl p-4">
                  <audio
                    controls
                    className="w-full"
                    src={selectedItem.url}
                  >
                    متصفحك لا يدعم تشغيل الصوت
                  </audio>
                  {selectedItem.duration && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                      المدة: {formatDuration(selectedItem.duration)}
                    </p>
                  )}
                </div>
              )}

              {/* Edit Title */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">العنوان</label>
                <input
                  type="text"
                  value={selectedItem.title}
                  onChange={(e) => updateItemTitle(selectedItem.id, e.target.value)}
                  className="input-field"
                  placeholder="أدخل عنوان العمل"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 btn-outline py-3"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => {
                    removeItem(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="flex-1 btn-danger py-3"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {portfolio.length === 0 && !isUploading && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📁</span>
          </div>
          <p className="text-lg font-medium text-gray-600">لا توجد أعمال بعد</p>
          <p className="text-sm text-gray-400 mt-2">قم برفع صور أو صوتيات لعرضها في ملفك الشخصي</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioUploader;