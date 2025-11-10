import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

const ModuleManagerSimple = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60
  });

  useEffect(() => {
    // Load course data
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const foundCourse = courses.find((c: any) => c.id === parseInt(courseId!));
    setCourse(foundCourse || { id: courseId, name: 'Course' });

    // Load modules
    const allModules = JSON.parse(localStorage.getItem('modules') || '[]');
    const courseModules = allModules.filter((m: any) => m.courseId === parseInt(courseId!));
    setModules(courseModules);
  }, [courseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    const newModule = {
      id: Date.now(),
      courseId: parseInt(courseId!),
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      published: false,
      createdAt: new Date().toISOString()
    };

    const updatedModules = [...modules, newModule];
    setModules(updatedModules);

    // Save to localStorage
    const allModules = JSON.parse(localStorage.getItem('modules') || '[]');
    const otherModules = allModules.filter((m: any) => m.courseId !== parseInt(courseId!));
    localStorage.setItem('modules', JSON.stringify([...otherModules, ...updatedModules]));

    toast({ title: "Success", description: "Module created successfully" });
    setFormData({ title: '', description: '', duration: 60 });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this module?')) return;
    
    const updatedModules = modules.filter(m => m.id !== id);
    setModules(updatedModules);
    
    const allModules = JSON.parse(localStorage.getItem('modules') || '[]');
    const otherModules = allModules.filter((m: any) => m.courseId !== parseInt(courseId!) || m.id !== id);
    localStorage.setItem('modules', JSON.stringify(otherModules));
    
    toast({ title: "Success", description: "Module deleted" });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/courses')}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-1">Module Management</h1>
              <p className="text-purple-100">Managing: {course?.name}</p>
            </div>
          </div>
        </div>

        {/* Create Module */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Course Modules</h2>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Create New Module</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Module Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Introduction to JavaScript"
                      required
                    />
                  </div>
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 60})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Module description..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                    Create Module
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Modules List */}
        <div className="space-y-4">
          {modules.map((module, index) => (
            <Card key={module.id} className="border hover:border-purple-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">Draft</Badge>
                        <span className="text-sm text-gray-500">{module.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/modules/${module.id}/tests/create`)}
                      className="bg-green-600 text-white hover:bg-green-700 border-none"
                    >
                      Add Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(module.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No modules yet</h3>
            <p className="text-gray-500 mb-4">Create your first module to get started</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ModuleManagerSimple;