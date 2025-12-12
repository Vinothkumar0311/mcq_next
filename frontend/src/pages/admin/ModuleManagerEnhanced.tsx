import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Plus, BookOpen, Settings, Upload, Download, 
  Edit, Trash2, Clock, Target, CheckCircle, X, Link, FileText,
  TestTube, HelpCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Interfaces
interface Topic {
  id?: number;
  title: string;
  resourceLink: string;
  documentPath?: string;
  order: number;
  file?: File;
}

interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string;
  duration: number;
  published: boolean;
  mcqPassCriteria: number;
  codingPassCriteria: number;
  questionsToDisplay: number;
  randomizeQuestions: boolean;
  status: 'draft' | 'published';
  testId?: number;
  topics?: Topic[];
  createdAt: string;
  updatedAt: string;
}

const COURSES_STORAGE_KEY = 'courses';

const ModuleManagerEnhanced = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    duration: 60,
    mcqPassCriteria: 90,
    codingPassCriteria: 100,
    questionsToDisplay: 10,
    randomizeQuestions: true,
    status: 'draft' as 'draft' | 'published'
  });

  const [topics, setTopics] = useState<Topic[]>([
    { title: '', resourceLink: '', order: 0 }
  ]);

  useEffect(() => {
    if (courseId) {
      loadCourseDetails();
      fetchModules();
    }
  }, [courseId]);

  const loadCourseDetails = () => {
    try {
      const courses = JSON.parse(localStorage.getItem(COURSES_STORAGE_KEY) || '[]');
      const foundCourse = courses.find((c: any) => c.id === parseInt(courseId!));
      if (foundCourse) {
        setCourse(foundCourse);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    }
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/modules/course/${courseId}`);
      setModules(response.data.data || []);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to load modules", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const addTopic = () => {
    setTopics([...topics, { 
      title: '', 
      resourceLink: '', 
      order: topics.length 
    }]);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      const newTopics = topics.filter((_, i) => i !== index);
      setTopics(newTopics.map((topic, i) => ({ ...topic, order: i })));
    }
  };

  const updateTopic = (index: number, field: keyof Topic, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    setTopics(newTopics);
  };

  const handleTopicFileUpload = (index: number, file: File) => {
    // Validate file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF, DOCX, PPT, images, and text files are allowed",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [index]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[index] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [index]: currentProgress + 10 };
      });
    }, 100);

    // Store file in topic
    const newTopics = [...topics];
    newTopics[index] = { ...newTopics[index], file };
    setTopics(newTopics);
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moduleForm.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    // Validate topics
    for (let i = 0; i < topics.length; i++) {
      if (!topics[i].title.trim()) {
        toast({
          title: "Validation Error",
          description: `Topic ${i + 1} title is required`,
          variant: "destructive",
        });
        return;
      }
      
      if (topics[i].resourceLink && !isValidUrl(topics[i].resourceLink)) {
        toast({
          title: "Validation Error",
          description: `Topic ${i + 1} resource link must be a valid URL`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add module data
      formData.append('moduleData', JSON.stringify({
        ...moduleForm,
        published: moduleForm.status === 'published'
      }));
      
      // Add topics data (without files)
      const topicsData = topics.map(({ file, ...topic }) => topic);
      formData.append('topicsData', JSON.stringify(topicsData));
      
      // Add files
      topics.forEach((topic, index) => {
        if (topic.file) {
          formData.append(`topicFile_${index}`, topic.file);
        }
      });

      if (editingModule) {
        // For updates, use regular endpoint (file handling would need separate implementation)
        await axios.put(`http://localhost:5000/modules/${editingModule.id}`, {
          ...moduleForm,
          published: moduleForm.status === 'published',
          topics: topicsData
        });
        toast({ title: "Success", description: "Module updated successfully" });
      } else {
        // Create with files
        await axios.post(`http://localhost:5000/modules/course/${courseId}/with-files`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast({ title: "Success", description: "Module created successfully" });
      }
      
      fetchModules();
      resetModuleForm();
    } catch (error) {
      console.error('Error saving module:', error);
      toast({
        title: "Error",
        description: "Failed to save module",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const resetModuleForm = () => {
    setModuleForm({
      title: '',
      description: '',
      duration: 60,
      mcqPassCriteria: 90,
      codingPassCriteria: 100,
      questionsToDisplay: 10,
      randomizeQuestions: true,
      status: 'draft'
    });
    setTopics([{ title: '', resourceLink: '', order: 0 }]);
    setUploadProgress({});
    setShowCreateForm(false);
    setEditingModule(null);
  };

  const handleEditModule = (module: Module) => {
    setModuleForm({
      title: module.title,
      description: module.description,
      duration: module.duration,
      mcqPassCriteria: module.mcqPassCriteria,
      codingPassCriteria: module.codingPassCriteria,
      questionsToDisplay: module.questionsToDisplay,
      randomizeQuestions: module.randomizeQuestions,
      status: module.status
    });
    
    // Load existing topics
    if (module.topics && module.topics.length > 0) {
      setTopics(module.topics.map(topic => ({
        ...topic,
        resourceLink: topic.resourceLink || ''
      })));
    } else {
      setTopics([{ title: '', resourceLink: '', order: 0 }]);
    }
    
    setEditingModule(module);
    setShowCreateForm(true);
  };

  const handleDeleteModule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/modules/${id}`);
      toast({ title: "Success", description: "Module deleted successfully" });
      fetchModules();
      
      if (selectedModule?.id === id) {
        setSelectedModule(null);
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete module", 
        variant: "destructive" 
      });
    }
  };

  if (!course) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">Loading course...</h2>
            <Button 
              onClick={() => navigate('/admin/courses')}
              className="mt-4"
            >
              Back to Courses
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
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
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">Enhanced Module Management</h1>
              <p className="text-purple-100">Managing: {course.name}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{modules.length}</p>
                  <p className="text-sm text-muted-foreground">Total Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{modules.filter(m => m.status === 'published').length}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{modules.reduce((sum, m) => sum + m.duration, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{modules.reduce((sum, m) => sum + (m.topics?.length || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Module Management */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Course Modules</h2>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Module
              </Button>
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && (
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle className="text-purple-700">
                    {editingModule ? 'Edit Module' : 'Create New Module'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleModuleSubmit} className="space-y-6">
                    {/* Basic Module Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Module Title *</Label>
                        <Input
                          id="title"
                          value={moduleForm.title}
                          onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                          placeholder="e.g., Introduction to Variables"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          value={moduleForm.duration}
                          onChange={(e) => setModuleForm({...moduleForm, duration: parseInt(e.target.value) || 60})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                        placeholder="What will students learn in this module?"
                        rows={3}
                      />
                    </div>

                    {/* Topics Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Topics</Label>
                        <Button
                          type="button"
                          onClick={addTopic}
                          variant="outline"
                          size="sm"
                          className="text-purple-600 border-purple-300 hover:bg-purple-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Topic
                        </Button>
                      </div>
                      
                      {topics.map((topic, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-medium text-gray-700">Topic {index + 1}</h4>
                              {topics.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeTopic(index)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor={`topic-title-${index}`}>Topic Title *</Label>
                                <Input
                                  id={`topic-title-${index}`}
                                  value={topic.title}
                                  onChange={(e) => updateTopic(index, 'title', e.target.value)}
                                  placeholder="e.g., Variables and Data Types"
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`topic-link-${index}`}>Resource Link (Optional)</Label>
                                <div className="relative">
                                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    id={`topic-link-${index}`}
                                    value={topic.resourceLink}
                                    onChange={(e) => updateTopic(index, 'resourceLink', e.target.value)}
                                    placeholder="https://example.com/resource"
                                    className="pl-10"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label>Document Upload (Optional)</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                  {!topic.file ? (
                                    <div>
                                      <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-600 mb-2">Upload document</p>
                                      <p className="text-xs text-gray-500 mb-3">PDF, DOCX, PPT, Images up to 10MB</p>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRefs.current[index]?.click()}
                                        className="bg-purple-600 text-white hover:bg-purple-700 border-none"
                                      >
                                        <Upload className="h-4 w-4 mr-1" />
                                        Choose File
                                      </Button>
                                      <input
                                        ref={(el) => fileInputRefs.current[index] = el}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp,.txt"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleTopicFileUpload(index, file);
                                        }}
                                        className="hidden"
                                      />
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <div className="flex items-center justify-center space-x-2">
                                        <FileText className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-700">{topic.file.name}</span>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const newTopics = [...topics];
                                            delete newTopics[index].file;
                                            setTopics(newTopics);
                                            setUploadProgress(prev => {
                                              const newProgress = { ...prev };
                                              delete newProgress[index];
                                              return newProgress;
                                            });
                                          }}
                                          className="text-red-600 border-red-300 hover:bg-red-50"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                                        <div className="mt-2">
                                          <Progress value={uploadProgress[index]} className="w-full" />
                                          <p className="text-xs text-gray-600 mt-1">Uploading... {uploadProgress[index]}%</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Module Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Module Status</Label>
                        <Select
                          value={moduleForm.status}
                          onValueChange={(value: 'draft' | 'published') => setModuleForm({...moduleForm, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="questionsDisplay">Questions to Display</Label>
                        <Input
                          id="questionsDisplay"
                          type="number"
                          min="1"
                          value={moduleForm.questionsToDisplay}
                          onChange={(e) => setModuleForm({...moduleForm, questionsToDisplay: parseInt(e.target.value) || 10})}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="randomize"
                        checked={moduleForm.randomizeQuestions}
                        onCheckedChange={(checked) => setModuleForm({...moduleForm, randomizeQuestions: checked})}
                      />
                      <Label htmlFor="randomize">Randomize Questions</Label>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {loading ? 'Saving...' : editingModule ? 'Update Module' : 'Create Module'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetModuleForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Module List */}
            <div className="space-y-4">
              {modules.map((module, index) => (
                <Card 
                  key={module.id} 
                  className={`rounded-2xl shadow-md p-4 border transition-all duration-300 cursor-pointer ${
                    selectedModule?.id === module.id 
                      ? 'border-purple-400 shadow-purple-200 bg-purple-50' 
                      : 'border-gray-100 hover:border-purple-200 hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedModule(module)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{module.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge 
                          variant={module.status === 'published' ? "default" : "secondary"}
                          className={module.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                        >
                          {module.status === 'published' ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration} min
                        </span>
                        <span className="text-sm text-gray-500">
                          {module.topics?.length || 0} topics
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModule(module);
                        }}
                        className="rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                        className="text-red-600 hover:text-red-700 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {modules.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-purple-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first module to get started</p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Module
                </Button>
              </div>
            )}
          </div>

          {/* Right: Selected Module Details */}
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-purple-600" />
                  </div>
                  Module Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedModule ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedModule.title}</h3>
                      <p className="text-gray-600 mb-4">{selectedModule.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">Duration</p>
                          <p className="text-lg font-semibold text-blue-800">{selectedModule.duration} min</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">Topics</p>
                          <p className="text-lg font-semibold text-green-800">{selectedModule.topics?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Topics List */}
                    {selectedModule.topics && selectedModule.topics.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Topics</h4>
                        <div className="space-y-3">
                          {selectedModule.topics.map((topic, index) => (
                            <Card key={topic.id || index} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-800">{topic.title}</h5>
                                    {topic.resourceLink && (
                                      <a 
                                        href={topic.resourceLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mt-1"
                                      >
                                        <Link className="h-3 w-3" />
                                        Resource Link
                                      </a>
                                    )}
                                    {topic.documentPath && (
                                      <div className="text-green-600 text-sm flex items-center gap-1 mt-1">
                                        <FileText className="h-3 w-3" />
                                        Document Available
                                      </div>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {index + 1}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        onClick={() => handleEditModule(selectedModule)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Module
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/admin/modules/${selectedModule.id}/questions`)}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Questions
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TestTube className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Module</h3>
                    <p className="text-sm">Choose a module from the left to view details and manage topics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ModuleManagerEnhanced;