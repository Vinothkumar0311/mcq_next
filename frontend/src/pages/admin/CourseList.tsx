// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";
// import { Plus, BookOpen, Users, Clock, Edit, Trash2, Eye, Settings } from "lucide-react";
// import AdminLayout from "@/components/AdminLayout";
// import { useNavigate } from "react-router-dom";

// interface Course {
//   id: number;
//   name: string;
//   description: string;
//   tags: string[];
//   image?: string;
//   published: boolean;
//   moduleCount: number;
//   studentCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// const COURSES_STORAGE_KEY = 'courses';

// const CourseList = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [editingCourse, setEditingCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     tags: '',
//     image: ''
//   });

//   useEffect(() => {
//     loadCoursesFromStorage();
//     setPageLoading(false);
//   }, []);

//   const loadCoursesFromStorage = () => {
//     try {
//       const stored = localStorage.getItem(COURSES_STORAGE_KEY);
//       if (stored) {
//         setCourses(JSON.parse(stored));
//       }
//     } catch (error) {
//       console.error('Error loading courses:', error);
//     }
//   };

//   const saveCoursesToStorage = (coursesData: Course[]) => {
//     try {
//       localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(coursesData));
//     } catch (error) {
//       console.error('Error saving courses:', error);
//     }
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
//       let updatedCourses: Course[];
      
//       if (editingCourse) {
//         updatedCourses = courses.map(course => 
//           course.id === editingCourse.id 
//             ? { 
//                 ...course, 
//                 ...formData,
//                 tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
//                 updatedAt: new Date().toISOString()
//               }
//             : course
//         );
//         toast({ title: "Success", description: "Course updated successfully" });
//       } else {
//         const newCourse: Course = {
//           id: Date.now(),
//           name: formData.name,
//           description: formData.description,
//           tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
//           image: formData.image,
//           published: false,
//           moduleCount: 0,
//           studentCount: 0,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         };
//         updatedCourses = [...courses, newCourse];
//         toast({ title: "Success", description: "Course created successfully" });
//       }
      
//       setCourses(updatedCourses);
//       saveCoursesToStorage(updatedCourses);
//       resetForm();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save course",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({ name: '', description: '', tags: '', image: '' });
//     setShowCreateForm(false);
//     setEditingCourse(null);
//   };

//   const handleEdit = (course: Course) => {
//     setFormData({
//       name: course.name,
//       description: course.description,
//       tags: course.tags.join(', '),
//       image: course.image || ''
//     });
//     setEditingCourse(course);
//     setShowCreateForm(true);
//   };

//   const handleDelete = (id: number) => {
//     if (!confirm('Are you sure you want to delete this course?')) return;
    
//     const updatedCourses = courses.filter(course => course.id !== id);
//     setCourses(updatedCourses);
//     saveCoursesToStorage(updatedCourses);
//     toast({ title: "Success", description: "Course deleted successfully" });
//   };

//   const togglePublished = (id: number) => {
//     const updatedCourses = courses.map(course => 
//       course.id === id 
//         ? { ...course, published: !course.published, updatedAt: new Date().toISOString() }
//         : course
//     );
//     setCourses(updatedCourses);
//     saveCoursesToStorage(updatedCourses);
//     toast({ 
//       title: "Success", 
//       description: `Course ${updatedCourses.find(c => c.id === id)?.published ? 'published' : 'unpublished'} successfully` 
//     });
//   };

//   if (pageLoading) {
//     return (
//       <AdminLayout>
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
//             <p className="text-muted-foreground">Loading courses...</p>
//           </div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div className="p-6 space-y-6">
//         {/* Header with Purple Gradient */}
//         <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold mb-1">
//                 Course Management
//               </h1>
//               <p className="text-purple-100">
//                 Create and manage learning courses for students
//               </p>
//             </div>
//             <Button 
//               onClick={() => navigate('/admin/courses/create')}
//               className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm rounded-lg"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Create Course
//             </Button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="border-purple-200">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <BookOpen className="h-8 w-8 text-purple-600" />
//                 <div>
//                   <p className="text-2xl font-bold">{courses.length}</p>
//                   <p className="text-sm text-muted-foreground">Total Courses</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-green-200">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <Eye className="h-8 w-8 text-green-600" />
//                 <div>
//                   <p className="text-2xl font-bold">{courses.filter(c => c.published).length}</p>
//                   <p className="text-sm text-muted-foreground">Published</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-blue-200">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <Users className="h-8 w-8 text-blue-600" />
//                 <div>
//                   <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.studentCount, 0)}</p>
//                   <p className="text-sm text-muted-foreground">Total Students</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-orange-200">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <Clock className="h-8 w-8 text-orange-600" />
//                 <div>
//                   <p className="text-2xl font-bold">{courses.filter(c => !c.published).length}</p>
//                   <p className="text-sm text-muted-foreground">Draft</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Create/Edit Form */}
//         {showCreateForm && (
//           <Card className="border-2 border-purple-200">
//             <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
//               <CardTitle className="text-purple-700">
//                 {editingCourse ? 'Edit Course' : 'Create New Course'}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Course Name *</Label>
//                     <Input
//                       id="name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({...formData, name: e.target.value})}
//                       placeholder="e.g., JavaScript Fundamentals"
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="tags">Tags</Label>
//                     <Input
//                       id="tags"
//                       value={formData.tags}
//                       onChange={(e) => setFormData({...formData, tags: e.target.value})}
//                       placeholder="javascript, programming, web development"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     placeholder="Brief overview of course content and objectives"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="image">Course Image URL (Optional)</Label>
//                   <Input
//                     id="image"
//                     value={formData.image}
//                     onChange={(e) => setFormData({...formData, image: e.target.value})}
//                     placeholder="https://example.com/image.jpg"
//                   />
//                 </div>
//                 <div className="flex gap-2">
//                   <Button 
//                     type="submit" 
//                     disabled={loading}
//                     className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
//                   >
//                     {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Save Course'}
//                   </Button>
//                   <Button type="button" variant="outline" onClick={resetForm}>
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* Courses Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course) => (
//             <Card key={course.id} className="rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:border-purple-400 hover:shadow-purple-200">
//               {course.image && (
//                 <div className="mb-4">
//                   <img 
//                     src={course.image} 
//                     alt={course.name}
//                     className="w-full h-32 object-cover rounded-lg"
//                     onError={(e) => {
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                 </div>
//               )}
//               <CardHeader className="pb-3 px-0">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <CardTitle className="text-lg font-semibold text-[#111827] line-clamp-2">{course.name}</CardTitle>
//                     <div className="flex items-center gap-2 mt-2">
//                       <Badge 
//                         variant={course.published ? "default" : "secondary"}
//                         className={course.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
//                       >
//                         {course.published ? "Published" : "Draft"}
//                       </Badge>
//                       <span className="text-sm text-gray-500">
//                         {course.moduleCount} modules
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4 px-0">
//                 <p className="text-sm text-gray-500 line-clamp-3">
//                   {course.description || "No description available"}
//                 </p>
                
//                 {course.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1">
//                     {course.tags.slice(0, 3).map((tag, index) => (
//                       <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-600">
//                         {tag}
//                       </Badge>
//                     ))}
//                     {course.tags.length > 3 && (
//                       <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
//                         +{course.tags.length - 3}
//                       </Badge>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex items-center justify-between pt-2 border-t">
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span className="flex items-center gap-1">
//                       <Users className="h-4 w-4" />
//                       {course.studentCount} students
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/admin/courses/${course.id}/modules`)}
//                       className="bg-[#7C3AED] text-white hover:bg-[#6D28D9] border-none rounded-lg"
//                     >
//                       Manage
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => togglePublished(course.id)}
//                       className={course.published ? "bg-red-600 text-white hover:bg-red-700 border-none rounded-lg" : "bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"}
//                     >
//                       {course.published ? 'Unpublish' : 'Publish'}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDelete(course.id)}
//                       className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 rounded-lg"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {courses.length === 0 && (
//           <div className="text-center py-12">
//             <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
//               <BookOpen className="h-12 w-12 text-purple-500" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
//             <p className="text-sm text-muted-foreground mb-4">Create your first course to get started</p>
//             <Button 
//               onClick={() => setShowCreateForm(true)}
//               className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Create Course
//             </Button>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default CourseList;


import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, BookOpen, Users, Clock, Edit, Trash2, Eye, Settings } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { courseApi } from "@/api/courseApi";
import axios from "axios";

interface Course {
  id: number;
  name: string;
  description: string;
  tags: string[];
  image?: string;
  published: boolean;
  moduleCount: number;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

// Removed: const COURSES_STORAGE_KEY = 'courses';

const CourseList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false); // For form submission
  const [pageLoading, setPageLoading] = useState(true); // For initial page load
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCourses(); // Changed from loadCoursesFromStorage
  }, []);

  // Updated to use courseApi
  const loadCourses = async () => {
    setPageLoading(true);
    try {
      const res = await courseApi.getCourses();
      setCourses(res.data || res); // handle success:true case
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setPageLoading(false);
    }
  };

  // Removed: saveCoursesToStorage function

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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('tags', formData.tags);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      if (editingCourse) {
        await axios.put(`http://localhost:5000/api/courses/${editingCourse.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: "Success", description: "Course updated successfully" });
      } else {
        await axios.post('http://localhost:5000/api/courses', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast({ title: "Success", description: "Course created successfully" });
      }
      
      loadCourses();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload JPG, PNG, or WEBP files only",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({...formData, image: e.target?.result as string});
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', tags: '', image: '' });
    setSelectedFile(null);
    setShowCreateForm(false);
    setEditingCourse(null);
  };

  const handleEdit = (course: Course) => {
    setFormData({
      name: course.name,
      description: course.description,
      tags: course.tags.join(', '),
      image: course.image || ''
    });
    setEditingCourse(course);
    setShowCreateForm(true);
  };

  // Updated to use courseApi
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await courseApi.deleteCourse(id);
      toast({ title: "Success", description: "Course deleted successfully" });
      loadCourses(); // Refresh list from API
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  // Updated to use courseApi
  const togglePublished = async (id: number) => {
    try {
      await courseApi.togglePublished(id);
      toast({ title: "Success", description: "Course status updated" });
      loadCourses(); // Refresh list from API
    } catch {
      toast({
        title: "Error",
        description: "Failed to toggle publish status",
        variant: "destructive",
      });
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header with Purple Gradient */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Course Management
              </h1>
              <p className="text-purple-100">
                Create and manage learning courses for students
              </p>
            </div>
            <Button 
              onClick={() => navigate('/admin/courses/create')} // This button now seems redundant if showCreateForm is used
                                                               // But keeping as-is from your code. You might want to change this to:
                                                               // onClick={() => setShowCreateForm(true)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.filter(c => c.published).length}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.reduce((sum, c) => sum + c.studentCount, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.filter(c => !c.published).length}</p>
                  <p className="text-sm text-muted-foreground">Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardTitle className="text-purple-700">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Course Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., JavaScript Fundamentals"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="javascript, programming, web development"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief overview of course content and objectives"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-gray-700">Course Image (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                    {!formData.image ? (
                      <div>
                        <p className="text-gray-600 mb-2">Upload course image</p>
                        <p className="text-sm text-gray-500 mb-4">JPG, PNG, WEBP up to 5MB</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-purple-600 text-white hover:bg-purple-700 border-none"
                        >
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
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({...formData, image: ''});
                            setSelectedFile(null);
                          }}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Save Course'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:border-purple-400 hover:shadow-purple-200">
              {course.image && (
                <div className="mb-4">
                  <img 
                    src={course.image.startsWith('/uploads/') ? `http://localhost:5000${course.image}` : course.image} 
                    alt={course.name}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader className="pb-3 px-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-[#111827] line-clamp-2">{course.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={course.published ? "default" : "secondary"}
                        className={course.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                      >
                        {course.published ? "Published" : "Draft"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {course.moduleCount} modules
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-0">
                <p className="text-sm text-gray-500 line-clamp-3">
                  {course.description || "No description available"}
                </p>
                
                {course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-600">
                        {tag}
                      </Badge>
                    ))}
                    {course.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                        +{course.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.studentCount} students
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Added Edit Button to trigger the form */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/courses/${course.id}/modules`)}
                      className="bg-[#7C3AED] text-white hover:bg-[#6D28D9] border-none rounded-lg"
                    >
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(course.id)}
                      className={course.published ? "bg-red-600 text-white hover:bg-red-700 border-none rounded-lg" : "bg-white border border-gray-300 hover:bg-gray-100 rounded-lg"}
                    >
                      {course.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && !pageLoading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first course to get started</p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CourseList;