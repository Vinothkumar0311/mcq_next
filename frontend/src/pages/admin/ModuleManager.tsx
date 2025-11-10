import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Plus, BookOpen, Settings, Upload, Download, 
  Edit, Trash2, Eye, EyeOff, Clock, Target,
  FileText, CheckCircle, TestTube, HelpCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

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
  resources: Resource[];
  testId?: number;
  createdAt: string;
  updatedAt: string;
}

interface Test {
  id: number;
  moduleId: number;
  name: string;
  description: string;
  instructions: string;
  duration: number;
  randomizeQuestions: boolean;
  status: 'draft' | 'published';
  sections: TestSection[];
  createdAt: string;
  updatedAt: string;
}

interface TestSection {
  id: number;
  testId: number;
  name: string;
  type: 'mcq' | 'coding';
  duration: number;
  marksPerQuestion: number;
  instructions?: string;
  questionCount: number;
}



const MODULES_STORAGE_KEY = 'modules';
const COURSES_STORAGE_KEY = 'courses';

const ModuleManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeTab, setActiveTab] = useState("mcq");
  
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



  useEffect(() => {
    loadCourseAndModules();
  }, [courseId]);

  const loadCourseAndModules = () => {
    try {
      // Load course
      const courses = JSON.parse(localStorage.getItem(COURSES_STORAGE_KEY) || '[]');
      const foundCourse = courses.find((c: any) => c.id === parseInt(courseId!));
      setCourse(foundCourse);

      // Load modules
      const allModules = JSON.parse(localStorage.getItem(MODULES_STORAGE_KEY) || '[]');
      const courseModules = allModules.filter((m: Module) => m.courseId === parseInt(courseId!));
      setModules(courseModules);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveModulesToStorage = (modulesData: Module[]) => {
    try {
      const allModules = JSON.parse(localStorage.getItem(MODULES_STORAGE_KEY) || '[]');
      const otherModules = allModules.filter((m: Module) => m.courseId !== parseInt(courseId!));
      const updatedModules = [...otherModules, ...modulesData];
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(updatedModules));
    } catch (error) {
      console.error('Error saving modules:', error);
    }
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let updatedModules: Module[];
      
      if (editingModule) {
        updatedModules = modules.map(module => 
          module.id === editingModule.id 
            ? { 
                ...module, 
                ...moduleForm,
                updatedAt: new Date().toISOString()
              }
            : module
        );
        toast({ title: "Success", description: "Module updated successfully" });
      } else {
        const newModule: Module = {
          id: Date.now(),
          courseId: parseInt(courseId!),
          title: moduleForm.title,
          description: moduleForm.description,
          duration: moduleForm.duration,
          published: moduleForm.status === 'published',
          mcqPassCriteria: moduleForm.mcqPassCriteria,
          codingPassCriteria: moduleForm.codingPassCriteria,
          questionsToDisplay: moduleForm.questionsToDisplay,
          randomizeQuestions: moduleForm.randomizeQuestions,
          status: moduleForm.status,
          resources: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedModules = [...modules, newModule];
        toast({ title: "Success", description: "Module created successfully" });
      }
      
      setModules(updatedModules);
      saveModulesToStorage(updatedModules);
      resetModuleForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save module",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    setEditingModule(module);
    setShowCreateForm(true);
  };

  const handleDeleteModule = (id: number) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    
    const updatedModules = modules.filter(module => module.id !== id);
    setModules(updatedModules);
    saveModulesToStorage(updatedModules);
    toast({ title: "Success", description: "Module deleted successfully" });
  };

  const toggleModulePublished = (id: number) => {
    const updatedModules = modules.map(module => 
      module.id === id 
        ? { ...module, published: !module.published, updatedAt: new Date().toISOString() }
        : module
    );
    setModules(updatedModules);
    saveModulesToStorage(updatedModules);
    toast({ 
      title: "Success", 
      description: `Module ${updatedModules.find(m => m.id === id)?.published ? 'published' : 'unpublished'} successfully` 
    });
  };

  if (!course) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
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
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="p-0 h-auto font-normal"
          >
            Dashboard
          </Button>
          <span>/</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/courses')}
            className="p-0 h-auto font-normal"
          >
            Courses
          </Button>
          <span>/</span>
          <span className="font-medium text-foreground">{course.name}</span>
        </div>

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
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">
                Module Management
              </h1>
              <p className="text-purple-100">
                Managing: {course.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={course.published ? "default" : "secondary"}
                className={course.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
              >
                {course.published ? "Published" : "Draft"}
              </Badge>
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
                  <p className="text-2xl font-bold">{modules.filter(m => m.published).length}</p>
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
                  <p className="text-2xl font-bold">{modules.reduce((sum, m) => sum + m.topics.length, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Topics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section: Module Cards */}
          <div className="space-y-4">

            {/* Create Module Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Course Modules</h2>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Module
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
                  <form onSubmit={handleModuleSubmit} className="space-y-4">
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
                      <Label htmlFor="description">Description/Objective</Label>
                      <Textarea
                        id="description"
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                        placeholder="What will students learn in this module?"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mcqPass">MCQ Pass Criteria (%)</Label>
                        <Input
                          id="mcqPass"
                          type="number"
                          min="0"
                          max="100"
                          value={moduleForm.mcqPassCriteria}
                          onChange={(e) => setModuleForm({...moduleForm, mcqPassCriteria: parseInt(e.target.value) || 90})}
                        />
                        <p className="text-xs text-muted-foreground">Default: 90%</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="codingPass">Coding Pass Criteria (%)</Label>
                        <Input
                          id="codingPass"
                          type="number"
                          min="0"
                          max="100"
                          value={moduleForm.codingPassCriteria}
                          onChange={(e) => setModuleForm({...moduleForm, codingPassCriteria: parseInt(e.target.value) || 100})}
                        />
                        <p className="text-xs text-muted-foreground">Default: 100%</p>
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
                        <p className="text-xs text-muted-foreground">e.g., 5 out of uploaded 100</p>
                      </div>
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
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="randomize"
                        checked={moduleForm.randomizeQuestions}
                        onCheckedChange={(checked) => setModuleForm({...moduleForm, randomizeQuestions: checked})}
                      />
                      <Label htmlFor="randomize">Randomize Questions (Shuffle)</Label>
                    </div>

                    <div className="flex gap-2">
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

            {/* Module Cards */}
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
                          {module.questionsToDisplay} questions
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
                  {selectedModule?.id === module.id && (
                    <Badge className="mt-2 bg-purple-100 text-purple-700">
                      Selected
                    </Badge>
                  )}
                </Card>
              ))}
            </div>

            {modules.length === 0 && (
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

          {/* Right Section: Question Management */}
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-purple-600" />
                  </div>
                  Question Management
                  {selectedModule && (
                    <Badge className="bg-purple-100 text-purple-700 ml-2">
                      {selectedModule.questionsToDisplay} questions
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedModule ? (
                  <div className="space-y-6">
                    {/* Question Type Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="mcq" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          MCQ Questions
                        </TabsTrigger>
                        <TabsTrigger value="coding" className="flex items-center gap-2">
                          <TestTube className="h-4 w-4" />
                          Coding Questions
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="mcq" className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg h-12">
                            <Plus className="w-4 h-4 mr-2" />
                            Manual Entry
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-12">
                            <Upload className="w-4 h-4 mr-2" />
                            Excel Upload
                          </Button>
                          <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50 rounded-lg h-12">
                            <Download className="w-4 h-4 mr-2" />
                            Question Template
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="coding" className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg h-12">
                            <Plus className="w-4 h-4 mr-2" />
                            Manual Entry
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-12">
                            <Upload className="w-4 h-4 mr-2" />
                            Excel Upload
                          </Button>
                          <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50 rounded-lg h-12">
                            <Download className="w-4 h-4 mr-2" />
                            Question Template
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Quick Guide */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <HelpCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-800 mb-2">Quick Guide:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                Manual entry for single questions
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Excel upload for bulk import
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                Download template first
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                Switch between MCQ and Coding
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Test Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      {!selectedModule.testId ? (
                        <Button 
                          onClick={() => navigate(`/admin/modules/${selectedModule.id}/tests/create`)}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Test
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/admin/modules/${selectedModule.id}/tests/manage`)}
                          className="border-gray-300 hover:bg-gray-50 rounded-lg"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Test
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TestTube className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Module</h3>
                    <p className="text-sm">Choose a module from the left to manage questions and tests</p>
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

export default ModuleManager;