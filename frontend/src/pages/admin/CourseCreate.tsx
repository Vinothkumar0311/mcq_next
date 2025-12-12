  // import { useState, useRef } from "react";
  // import { Button } from "@/components/ui/button";
  // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  // import { Input } from "@/components/ui/input";
  // import { Label } from "@/components/ui/label";
  // import { Textarea } from "@/components/ui/textarea";
  // import { Progress } from "@/components/ui/progress";
  // import { useToast } from "@/hooks/use-toast";
  // import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from "lucide-react";
  // import AdminLayout from "@/components/AdminLayout";
  // import { useNavigate } from "react-router-dom";

  // const CourseCreate = () => {
  //   const { toast } = useToast();
  //   const navigate = useNavigate();
  //   const fileInputRef = useRef<HTMLInputElement>(null);
  //   const [loading, setLoading] = useState(false);
  //   const [uploadProgress, setUploadProgress] = useState(0);
  //   const [formData, setFormData] = useState({
  //     name: '',
  //     description: '',
  //     tags: '',
  //     image: ''
  //   });

  //   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;

  //     // Validate file type
  //     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  //     if (!validTypes.includes(file.type)) {
  //       toast({
  //         title: "Invalid File Type",
  //         description: "Please upload JPG, PNG, or WEBP files only",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     // Validate file size (5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       toast({
  //         title: "File Too Large",
  //         description: "Please upload an image smaller than 5MB",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     // Simulate upload progress
  //     setUploadProgress(0);
  //     const interval = setInterval(() => {
  //       setUploadProgress(prev => {
  //         if (prev >= 100) {
  //           clearInterval(interval);
  //           return 100;
  //         }
  //         return prev + 10;
  //       });
  //     }, 100);

  //     // Convert to base64 for preview
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setFormData({...formData, image: e.target?.result as string});
  //     };
  //     reader.readAsDataURL(file);
  //   };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!formData.name.trim()) {
  //       toast({
  //         title: "Validation Error",
  //         description: "Course name is required",
  //         variant: "destructive",
  //       });
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const courses = JSON.parse(localStorage.getItem('courses') || '[]');
  //       const newCourse = {
  //         id: Date.now(),
  //         name: formData.name.trim(),
  //         description: formData.description.trim(),
  //         tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
  //         image: formData.image.trim(),
  //         published: false,
  //         moduleCount: 0,
  //         studentCount: 0,
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString()
  //       };
        
  //       courses.push(newCourse);
  //       localStorage.setItem('courses', JSON.stringify(courses));
        
  //       toast({ 
  //         title: "✅ Course created successfully!", 
  //         description: `Redirecting to add modules for "${newCourse.name}"...` 
  //       });
        
  //       setTimeout(() => {
  //         navigate(`/admin/courses/${newCourse.id}/modules`);
  //       }, 1000);
  //     } catch (error) {
  //       console.error('Error creating course:', error);
  //       toast({
  //         title: "Error",
  //         description: "Failed to create course. Please try again.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   return (
  //     <AdminLayout>
  //       <div className="p-6 space-y-6">
  //         {/* Header with Purple Gradient */}
  //         <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
  //           <div className="flex items-center gap-4">
  //             <Button 
  //               variant="outline" 
  //               onClick={() => navigate('/admin/courses')}
  //               className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
  //             >
  //               <ArrowLeft className="h-4 w-4 mr-2" />
  //               Back to Courses
  //             </Button>
  //             <div>
  //               <h1 className="text-3xl font-bold mb-1">
  //                 Create New Course
  //               </h1>
  //               <p className="text-purple-100">
  //                 Set up a new learning course for students
  //               </p>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Main Form Card */}
  //         <Card className="rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
  //           <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
  //             <CardTitle className="text-purple-700 flex items-center gap-2">
  //               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
  //                 <ImageIcon className="w-4 h-4 text-purple-600" />
  //               </div>
  //               Course Information
  //             </CardTitle>
  //           </CardHeader>
  //           <CardContent className="p-6">
  //             <form onSubmit={handleSubmit} className="space-y-6">
  //               {/* Grid Layout for Fields */}
  //               <div className="grid grid-cols-2 gap-4">
  //                 <div className="space-y-2">
  //                   <Label htmlFor="name" className="font-medium text-gray-700">Course Name *</Label>
  //                   <Input
  //                     id="name"
  //                     value={formData.name}
  //                     onChange={(e) => setFormData({...formData, name: e.target.value})}
  //                     placeholder="e.g., JavaScript Fundamentals"
  //                     required
  //                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED] h-12"
  //                   />
  //                   {formData.name.trim() && (
  //                     <p className="text-sm text-green-600">✓ Course name looks good</p>
  //                   )}
  //                 </div>
  //                 <div className="space-y-2">
  //                   <Label htmlFor="tags" className="font-medium text-gray-700">Tags</Label>
  //                   <Input
  //                     id="tags"
  //                     value={formData.tags}
  //                     onChange={(e) => setFormData({...formData, tags: e.target.value})}
  //                     placeholder="javascript, programming, web development"
  //                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED] h-12"
  //                   />
  //                   {formData.tags.trim() && (
  //                     <div className="flex flex-wrap gap-1 mt-2">
  //                       {formData.tags.split(',').map((tag, index) => (
  //                         tag.trim() && (
  //                           <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
  //                             {tag.trim()}
  //                           </span>
  //                         )
  //                       ))}
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <Label htmlFor="description" className="font-medium text-gray-700">Course Description</Label>
  //                 <Textarea
  //                   id="description"
  //                   value={formData.description}
  //                   onChange={(e) => setFormData({...formData, description: e.target.value})}
  //                   placeholder="Brief overview of course content and objectives..."
  //                   rows={4}
  //                   className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED] resize-none"
  //                 />
  //               </div>

  //               {/* Image Upload Section */}
  //               <div className="space-y-2">
  //                 <Label className="font-medium text-gray-700">Course Image (Optional)</Label>
  //                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
  //                   {!formData.image ? (
  //                     <div>
  //                       <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
  //                       <p className="text-gray-600 mb-2">Upload course image</p>
  //                       <p className="text-sm text-gray-500 mb-4">JPG, PNG, WEBP up to 5MB</p>
  //                       <Button 
  //                         type="button" 
  //                         variant="outline" 
  //                         onClick={() => fileInputRef.current?.click()}
  //                         className="bg-[#7C3AED] text-white hover:bg-[#6D28D9] border-none"
  //                       >
  //                         <Upload className="h-4 w-4 mr-2" />
  //                         Choose File
  //                       </Button>
  //                       <input
  //                         ref={fileInputRef}
  //                         type="file"
  //                         accept=".jpg,.jpeg,.png,.webp"
  //                         onChange={handleImageUpload}
  //                         className="hidden"
  //                       />
  //                     </div>
  //                   ) : (
  //                     <div className="relative">
  //                       <img 
  //                         src={formData.image} 
  //                         alt="Course preview" 
  //                         className="w-full h-48 object-cover rounded-lg"
  //                       />
  //                       <Button
  //                         type="button"
  //                         variant="outline"
  //                         size="sm"
  //                         onClick={() => setFormData({...formData, image: ''})}
  //                         className="absolute top-2 right-2 bg-white/80 hover:bg-white"
  //                       >
  //                         <X className="h-4 w-4" />
  //                       </Button>
  //                     </div>
  //                   )}
  //                   {uploadProgress > 0 && uploadProgress < 100 && (
  //                     <div className="mt-4">
  //                       <Progress value={uploadProgress} className="w-full" />
  //                       <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>

  //               {/* Action Buttons */}
  //               <div className="flex gap-4 pt-4 border-t">
  //                 <Button 
  //                   type="submit" 
  //                   disabled={loading || !formData.name.trim()}
  //                   className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg px-8"
  //                 >
  //                   <Save className="h-4 w-4 mr-2" />
  //                   {loading ? 'Creating...' : 'Save Course'}
  //                 </Button>
  //                 <Button 
  //                   type="button" 
  //                   variant="outline" 
  //                   onClick={() => navigate('/admin/courses')}
  //                   className="bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"
  //                 >
  //                   Cancel
  //                 </Button>
  //               </div>
  //             </form>
  //           </CardContent>
  //         </Card>

  //         {/* Next Steps Card */}
  //         <Card className="rounded-2xl shadow-md border border-blue-200">
  //           <CardHeader>
  //             <CardTitle className="text-blue-700">Next Steps</CardTitle>
  //           </CardHeader>
  //           <CardContent>
  //             <div className="space-y-3">
  //               <div className="flex items-center gap-3">
  //                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
  //                   1
  //                 </div>
  //                 <span>Create course with basic information</span>
  //               </div>
  //               <div className="flex items-center gap-3">
  //                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
  //                   2
  //                 </div>
  //                 <span>Add modules with learning content and resources</span>
  //               </div>
  //               <div className="flex items-center gap-3">
  //                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
  //                   3
  //                 </div>
  //                 <span>Configure assessments and publish course</span>
  //               </div>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </AdminLayout>
  //   );
  // };

  // export default CourseCreate;

  import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { courseApi } from "@/api/courseApi";
import axios from "axios";

const CourseCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // <-- Kept from old code
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload JPG, PNG, or WEBP files only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Store the actual file for upload
    setSelectedFile(file);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({...formData, image: e.target?.result as string});
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Course name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('tags', formData.tags);
      
      // Add image file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
      
      // Send FormData directly to backend
      const response = await axios.post('http://localhost:5000/api/courses', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({ 
        title: "✅ Course created successfully!", 
      });
      
      navigate(`/admin/courses`);

    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Kept the entire advanced JSX from your old code ---
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header with Purple Gradient */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/courses')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Create New Course
              </h1>
              <p className="text-purple-100">
                Set up a new learning course for students
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="text-purple-700 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-purple-600" />
              </div>
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Layout for Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium text-gray-700">Course Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., JavaScript Fundamentals"
                    required
                    className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED] h-12"
                  />
                  {formData.name.trim() && (
                    <p className="text-sm text-green-600">✓ Course name looks good</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="font-medium text-gray-700">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="javascript, programming, web development"
                    className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED] h-12"
                  />
                  {formData.tags.trim() && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.split(',').map((tag, index) => (
                        tag.trim() && (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-medium text-gray-700">Course Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief overview of course content and objectives..."
                  rows={4}
                  className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED] resize-none"
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">Course Image (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  {!formData.image ? (
                    <div>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Upload course image</p>
                      <p className="text-sm text-gray-500 mb-4">JPG, PNG, WEBP up to 5MB</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#7C3AED] text-white hover:bg-[#6D28D9] border-none"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={formData.image} 
                        alt="Course preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({...formData, image: ''});
                          setSelectedFile(null);
                          setUploadProgress(0);
                        }}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  disabled={loading || !formData.name.trim()}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg px-8"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Creating...' : 'Save Course'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/admin/courses')}
                  className="bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card className="rounded-2xl shadow-md border border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                  1
                </div>
                <span>Create course with basic information</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  2
                </div>
                <span>Add modules with learning content and resources</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                  3
                </div>
                <span>Configure assessments and publish course</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CourseCreate;