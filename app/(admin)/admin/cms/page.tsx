"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit, Plus, ArrowLeft, Save, FileText, Bold, Italic, List, ListOrdered, Heading1, Heading2, Link } from "lucide-react";
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface CMSContent {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
  lastUpdatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const CMS_TYPES = [
  { key: "privacy-policy", label: "Privacy Policy", icon: FileText },
  { key: "terms-of-service", label: "Terms of Service", icon: FileText },
  { key: "about-us", label: "About Us", icon: FileText },
  { key: "contact-info", label: "Contact Info", icon: FileText },
  { key: "refund-policy", label: "Refund Policy", icon: FileText },
  { key: "shipping-policy", label: "Shipping Policy", icon: FileText },
  { key: "cookie-policy", label: "Cookie Policy", icon: FileText },
];

export default function CMSPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [contents, setContents] = useState<CMSContent[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentContent, setCurrentContent] = useState<{
    _id?: string;
    type: string;
    title: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
  }>({
    type: "",
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch all CMS content at once
  const loadAllContents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/cms/admin');
      if (data.success && data.data) {
        setContents(data.data);
      }
    } catch (error: any) {
      toast.error("Error loading content");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!currentContent.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!currentContent.content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    setSaving(true);
    try {
      const contentData = {
        title: currentContent.title,
        content: currentContent.content,
        metaTitle: currentContent.metaTitle,
        metaDescription: currentContent.metaDescription,
      };

      if (currentContent._id) {
        // Update existing content
        await api.put(`/api/cms/admin/${currentContent.type}`, contentData);
      } else {
        // Create new content
        await api.post(`/api/cms/admin/${currentContent.type}`, contentData);
      }
      
      toast.success("Content saved successfully!");
      setIsEditing(false);
      loadAllContents();
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Error saving content";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (type: string) => {
    const content = contents.find(c => c.slug === type);
    
    if (content) {
      setCurrentContent({
        _id: content._id,
        type: content.slug,
        title: content.title,
        content: content.content,
        metaTitle: content.metaTitle || "",
        metaDescription: content.metaDescription || "",
      });
    } else {
      setCurrentContent({
        type,
        title: CMS_TYPES.find(t => t.key === type)?.label || "",
        content: `<h1>${CMS_TYPES.find(t => t.key === type)?.label}</h1>\n<p>Start writing your content here...</p>`,
        metaTitle: CMS_TYPES.find(t => t.key === type)?.label || "",
        metaDescription: "",
      });
    }
    setIsEditing(true);
  };

  // Text formatting functions
  const formatText = (tag: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let formattedText = selectedText;
    
    switch(tag) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'h1':
        formattedText = `<h1>${selectedText}</h1>`;
        break;
      case 'h2':
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case 'ul':
        formattedText = `<ul><li>${selectedText}</li></ul>`;
        break;
      case 'ol':
        formattedText = `<ol><li>${selectedText}</li></ol>`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
        } else {
          return;
        }
        break;
    }
    
    const newContent = beforeText + formattedText + afterText;
    setCurrentContent(prev => ({ ...prev, content: newContent }));
    
    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  useEffect(() => {
    loadAllContents();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isEditing) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar setIsSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        {CMS_TYPES.find(t => t.key === currentContent.type)?.label}
                      </h1>
                      <p className="text-sm text-gray-500">Edit your content</p>
                    </div>
                  </div>
                  <button
                    onClick={saveContent}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Editor */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-5 md:p-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Page Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentContent.title}
                        onChange={(e) => setCurrentContent({ ...currentContent, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter page title"
                      />
                    </div>
                  </div>

                  {/* Content Editor Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 p-5 md:p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Content Editor</h3>
                        <p className="text-sm text-gray-500">Use HTML tags for formatting</p>
                      </div>
                      
                      {/* Formatting Toolbar */}
                      <div className="flex flex-wrap gap-2 mt-4 p-3 bg-gray-50 rounded-lg">
                        <button
                          type="button"
                          onClick={() => formatText('h1')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Heading 1"
                        >
                          <Heading1 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('h2')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Heading 2"
                        >
                          <Heading2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          type="button"
                          onClick={() => formatText('bold')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Bold"
                        >
                          <Bold className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('italic')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Italic"
                        >
                          <Italic className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <button
                          type="button"
                          onClick={() => formatText('ul')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Bullet List"
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('ol')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Numbered List"
                        >
                          <ListOrdered className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => formatText('link')}
                          className="p-2 hover:bg-gray-200 rounded transition-colors"
                          title="Insert Link"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 md:p-6">
                      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                        <textarea
                          ref={textareaRef}
                          value={currentContent.content}
                          onChange={(e) => setCurrentContent({ ...currentContent, content: e.target.value })}
                          className="w-full h-96 p-4 focus:outline-none resize-none font-mono text-sm"
                          placeholder="Write your content here... Use HTML tags for formatting."
                        />
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        <p>Tips: Select text and use formatting buttons above. You can also write HTML directly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Sidebar */}
                <div className="space-y-6">
                  {/* SEO Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 md:p-6 space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={currentContent.metaTitle}
                          onChange={(e) => setCurrentContent({ ...currentContent, metaTitle: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Title for search engines (50-60 chars)"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {currentContent.metaTitle.length} characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meta Description
                        </label>
                        <textarea
                          value={currentContent.metaDescription}
                          onChange={(e) => setCurrentContent({ ...currentContent, metaDescription: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          placeholder="Description for search results (150-160 chars)"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {currentContent.metaDescription.length} characters
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 p-5 md:p-6">
                      <h3 className="text-lg font-semibold text-gray-900">Page Status</h3>
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${currentContent._id ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                          <span className={`font-medium ${currentContent._id ? 'text-green-700' : 'text-yellow-700'}`}>
                            {currentContent._id ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {currentContent._id && (
                          <span className="text-sm text-gray-500">
                            Last saved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar setIsSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Content Management</h1>
                  <p className="text-gray-600 mt-2">Manage your website's static pages and policies</p>
                </div>
                <button
                  onClick={loadAllContents}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      Refreshing...
                    </span>
                  ) : "Refresh"}
                </button>
              </div>
            </div>

            {/* CMS Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CMS_TYPES.map((type) => {
                const Icon = type.icon;
                const content = contents.find(c => c.slug === type.key);
                const isPublished = !!content;
                
                return (
                  <div 
                    key={type.key}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                            <Icon className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{type.label}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                {isPublished ? 'Published' : 'Not Created'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {content && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1 truncate">Title: {content.title}</p>
                          {content.updatedAt && (
                            <p className="text-xs text-gray-500">
                              Updated: {formatDate(content.updatedAt)}
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => handleEdit(type.key)}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                        style={{
                          background: isPublished 
                            ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' 
                            : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: 'white'
                        }}
                      >
                        {isPublished ? (
                          <>
                            <Edit className="w-4 h-4" />
                            Edit Page
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Create Page
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}