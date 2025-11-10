import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Settings, Upload, Download, TestTube, 
  FileText, Code, Clock, Target, Eye, EyeOff, Edit, Trash2,
  Users, BarChart3, CheckCircle, AlertCircle
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";

interface TestSection {
  id: number;
  name: string;
  type: 'mcq' | 'coding';
  duration: number;
  marksPerQuestion: number;
  instructions?: string;
  questionCount: number;
  randomizeQuestions: boolean;
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
}

const TestManage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [module, setModule] = useState<any>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadModuleAndTest();
  }, [moduleId]);

  const loadModuleAndTest = () => {
    try {
      // Load module
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const foundModule = modules.find((m: any) => m.id === parseInt(moduleId!));
      setModule(foundModule);
      
      if (foundModule?.testId) {
        // Load test
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const foundTest = tests.find((t: Test) => t.id === foundModule.testId);
        setTest(foundTest);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleTestStatus = () => {
    if (!test) return;
    
    setLoading(true);
    try {
      const updatedTest = {
        ...test,
        status: test.status === 'published' ? 'draft' : 'published'
      };
      
      const tests = JSON.parse(localStorage.getItem('tests') || '[]');
      const updatedTests = tests.map((t: Test) => 
        t.id === test.id ? updatedTest : t
      );
      localStorage.setItem('tests', JSON.stringify(updatedTests));
      
      setTest(updatedTest);
      toast({ 
        title: "✅ Success", 
        description: `Test ${updatedTest.status === 'published' ? 'published' : 'unpublished'} successfully` 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update test status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = () => {
    if (!test || !confirm('Are you sure you want to delete this test?')) return;
    
    try {
      // Remove test
      const tests = JSON.parse(localStorage.getItem('tests') || '[]');
      const updatedTests = tests.filter((t: Test) => t.id !== test.id);
      localStorage.setItem('tests', JSON.stringify(updatedTests));
      
      // Remove test ID from module
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const updatedModules = modules.map((m: any) => 
        m.id === parseInt(moduleId!) ? { ...m, testId: undefined } : m
      );
      localStorage.setItem('modules', JSON.stringify(updatedModules));
      
      toast({ title: "✅ Test deleted successfully" });
      
      // Navigate back to module management
      const courseId = module?.courseId;
      if (courseId) {
        navigate(`/admin/courses/${courseId}/modules`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete test",
        variant: "destructive",
      });
    }
  };

  if (!module) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">Module not found</h2>
            <Button 
              onClick={() => navigate(-1)}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!test) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <TestTube className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No test found</h2>
            <p className="text-gray-500 mb-4">This module doesn't have a test yet.</p>
            <Button 
              onClick={() => navigate(`/admin/modules/${moduleId}/tests/create`)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
            >
              Create Test
            </Button>
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
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Module
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">
                Test Management
              </h1>
              <p className="text-purple-100">
                Managing: {test.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className={test.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
              >
                {test.status === 'published' ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl shadow-md p-4 border border-purple-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <TestTube className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{test.sections.length}</p>
                  <p className="text-sm text-gray-500">Sections</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-4 border border-blue-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{test.duration}</p>
                  <p className="text-sm text-gray-500">Minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-4 border border-green-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{test.sections.reduce((sum, s) => sum + s.questionCount, 0)}</p>
                  <p className="text-sm text-gray-500">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-4 border border-orange-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-500">Attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-blue-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
              <TestTube className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sections" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-white data-[state=active]:text-green-700">
              <Settings className="h-4 w-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Test Details */}
              <Card className="rounded-2xl shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-gray-800">Test Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-700">Name</p>
                    <p className="text-gray-600">{test.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Description</p>
                    <p className="text-gray-600">{test.description || 'No description'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Duration</p>
                    <p className="text-gray-600">{test.duration} minutes</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Randomize Questions</p>
                    <p className="text-gray-600">{test.randomizeQuestions ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Status</p>
                    <Badge className={test.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                      {test.status === 'published' ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="rounded-2xl shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-gray-800">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={toggleTestStatus}
                    disabled={loading}
                    className={test.status === 'published' 
                      ? "w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg" 
                      : "w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    }
                  >
                    {test.status === 'published' ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {test.status === 'published' ? 'Unpublish Test' : 'Publish Test'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Test Details
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={deleteTest}
                    className="w-full text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-gray-800">Test Sections ({test.sections.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {test.sections.map((section, index) => (
                  <Card key={section.id} className="border rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{section.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <Badge variant={section.type === 'mcq' ? 'default' : 'secondary'}>
                                {section.type === 'mcq' ? <FileText className="h-3 w-3 mr-1" /> : <Code className="h-3 w-3 mr-1" />}
                                {section.type.toUpperCase()}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {section.duration} min
                              </span>
                              <span>{section.marksPerQuestion} marks each</span>
                              <span>{section.questionCount} questions</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {section.questionCount > 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-gray-800">Question Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Questions</h3>
                  <p className="text-gray-500 mb-4">
                    Upload questions for each section using Excel templates
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" className="rounded-lg">
                      <Download className="h-4 w-4 mr-2" />
                      MCQ Template
                    </Button>
                    <Button variant="outline" className="rounded-lg">
                      <Download className="h-4 w-4 mr-2" />
                      Coding Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader>
                <CardTitle className="text-gray-800">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                  <p className="text-sm">Results will appear here once students start taking the test</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TestManage;