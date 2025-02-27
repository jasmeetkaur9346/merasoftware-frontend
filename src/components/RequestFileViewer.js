import React from 'react';
import { FileText, Image, Download } from 'lucide-react';

const RequestFileViewer = ({ file }) => {
  const isImage = file.type.startsWith('image/');
  
  // फाइल डाउनलोड फंक्शन 
  const downloadFile = () => {
    // Base64 डेटा को बाइनरी में कन्वर्ट करें
    const byteCharacters = atob(file.content);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    // बाइनरी डेटा को ब्लॉब में कन्वर्ट करें
    const blob = new Blob(byteArrays, { type: file.type });
    
    // डाउनलोड लिंक बनाएं और क्लिक करें
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg mb-2">
      <div className="flex items-center">
        {isImage ? (
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden mr-3">
            <img 
              src={`data:${file.type};base64,${file.content}`}
              alt={file.originalName} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <FileText className="w-12 h-12 text-gray-400 mr-3" />
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.originalName}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB • {file.type.split('/')[1]}
          </p>
        </div>
        
        <button
          onClick={downloadFile}
          className="ml-2 text-blue-500 hover:text-blue-700"
          title="Download file"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
      
      {isImage && (
        <div className="mt-3 border rounded-lg overflow-hidden">
          <img 
            src={`data:${file.type};base64,${file.content}`}
            alt={file.originalName} 
            className="w-full object-contain max-h-64"
          />
        </div>
      )}
    </div>
  );
};

export default RequestFileViewer;