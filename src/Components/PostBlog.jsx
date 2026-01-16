import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postBlog } from '../ApiCall';
import { useNavigate } from 'react-router-dom';
import { callAI } from '../ApiCall';
import { toast } from 'sonner';
import { Skeleton, Spin } from 'antd';
import {
  RobotOutlined,
  FileTextOutlined,
  TagOutlined,
  EditOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
  BulbOutlined
} from '@ant-design/icons';

const PostBlog = () => {
    const [loading, setloading] = useState(true);
    const [ren, setren] = useState(true);
    const [form, setForm] = useState({
        category: '',
        title: '',
        content: ''
    });
    
    const handleFile = (e) => {
        setphoto(e.target.files[0]);
    };
    
    const [photo, setphoto] = useState(null);
    const [show, setshow] = useState(false);
    const [textPrompt, settextPrompt] = useState("");
    const navigate = useNavigate();
    const queryclient = useQueryClient();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const blogMutation = useMutation({
        mutationFn: () => {
            const newFormData = new FormData();
            newFormData.append("category", form.category);
            newFormData.append("title", form.title);
            newFormData.append("content", form.content);
            if (photo) {
                newFormData.append("photo", photo);
            }
            return postBlog(newFormData);
        },
        onSuccess: () => {
            toast.success("Blog Posted Successfully!");
            queryclient.invalidateQueries("AllBlogs");
            navigate("/");
        },
        onError: (error) => {
            toast.error("Failed to post blog. Please try again.");
            console.error("Posting error:", error);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        blogMutation.mutate();
    };

    const callGemini = async () => {
        if (!textPrompt.trim()) {
            toast.info("Please enter a prompt for AI generation");
            return;
        }
        
        setren(false);
        setshow(true);
        try {
            const data = await callAI(textPrompt);
            setren(true);
            setshow(false);
            setForm(prev => ({
                ...prev,
                content: data
            }));
            toast.success("AI content generated successfully!");
        } catch (error) {
            toast.error("Failed to generate content. Please try again.");
            console.error("AI generation error:", error);
            setren(true);
            setshow(false);
        }
    };

    useEffect(() => {
        if (!ren) {
            setForm(prev => ({
                ...prev,
                content: "AI is generating content for your blog... Please wait."
            }));
        }
    }, [ren]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
            
            
            <div className="pt-24 max-w-4xl mx-auto px-4 pb-12">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
                    >
                        <ArrowLeftOutlined className="mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                        <EditOutlined className="mr-3 text-blue-500" />
                        Create New Blog
                    </h1>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                <TagOutlined className="mr-2 text-blue-500" />
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="e.g. Technology, Travel, Food"
                                required
                            />
                        </div>

                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                <FileTextOutlined className="mr-2 text-blue-500" />
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Catchy title for your blog"
                                required
                            />
                        </div>

                        {/* Content Field */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                <EditOutlined className="mr-2 text-blue-500" />
                                Content
                            </label>
                            {show ? (
                                <div className="border border-slate-300 rounded-lg p-4">
                                    <Skeleton active paragraph={{ rows: 7 }} />
                                </div>
                            ) : (
                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    rows={7}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Write your blog content here..."
                                    required
                                />
                            )}
                        </div>

                        {/* AI Content Generation */}
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                            <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center">
                                <BulbOutlined className="mr-2 text-blue-500" />
                                AI Content Assistant
                            </h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Let AI help you generate content for your blog. Just provide a prompt below.
                            </p>
                            <textarea
                                type="text"
                                name="textPr"
                                onChange={(e) => settextPrompt(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-3"
                                placeholder="Example: Write a blog about the latest technology trends in 2023..."
                                rows={3}
                            />
                            <button
                                type="button"
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center gap-2"
                                onClick={callGemini}
                                disabled={show}
                            >
                                {show ? (
                                    <>
                                        <Spin size="small" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <RobotOutlined />
                                        Generate Content with AI
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                                <UploadOutlined className="mr-2 text-blue-500" />
                                Blog Image
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <div className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                                        <UploadOutlined />
                                        <span>{photo ? photo.name : "Choose an image"}</span>
                                    </div>
                                    <input
                                        type="file"
                                        name="imageFile"
                                        className="hidden"
                                        onChange={handleFile}
                                        accept="image/*"
                                    />
                                </label>
                                {photo && (
                                    <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800 text-sm"
                                        onClick={() => setphoto(null)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Supported formats: JPG, PNG, GIF</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3.5 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all font-medium text-lg shadow-md"
                            disabled={blogMutation.isLoading}
                        >
                            {blogMutation.isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spin size="small" />
                                    Publishing...
                                </div>
                            ) : (
                                'Publish Blog'
                            )}
                        </button>
                    </form>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-slate-100 p-5 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-800 mb-3 flex items-center">
                        <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2 text-sm">i</span>
                        Blogging Tips
                    </h3>
                    <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                        <li>Choose a specific category to reach the right audience</li>
                        <li>Write a compelling title to attract readers</li>
                        <li>Use the AI assistant if you need inspiration</li>
                        <li>Add relevant images to make your blog more engaging</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PostBlog;