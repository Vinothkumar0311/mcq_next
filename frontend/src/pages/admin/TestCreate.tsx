import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Plus, Save, Upload, Download, TestTube, 
  FileText, Code, Clock, Target, Settings, HelpCircle
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

const TestCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [testForm, setTestForm] = useState({
    name: '',
    description: '',
    instructions: '',
    duration: 60,
    randomizeQuestions: true
  });

  const [sections, setSections] = useState<TestSection[]>([]);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    type: 'mcq' as 'mcq' | 'coding',
    duration: 30,
    marksPerQuestion: 1,
    instructions: '',
    randomizeQuestions: true
  });

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  const loadModule = () => {
    try {
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const foundModule = modules.find((m: any) => m.id === parseInt(moduleId!));
      setModule(foundModule);
      
      if (foundModule) {
        setTestForm(prev => ({
          ...prev,
          name: `${foundModule.title} Assessment`
        }));
      }
    } catch (error) {
      console.error('Error loading module:', error);
    }
  };

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Section name is required",
        variant: "destructive",
      });
      return;
    }

    const newSection: TestSection = {
      id: Date.now(),
      name: sectionForm.name,
      type: sectionForm.type,
      duration: sectionForm.duration,
      marksPerQuestion: sectionForm.marksPerQuestion,
      instructions: sectionForm.instructions,
      questionCount: 0,
      randomizeQuestions: sectionForm.randomizeQuestions
    };

    setSections([...sections, newSection]);
    setSectionForm({
      name: '',
      type: 'mcq',
      duration: 30,
      marksPerQuestion: 1,
      instructions: '',
      randomizeQuestions: true
    });
    
    toast({ title: "✅ Section added successfully" });
  };

  const handleSaveTest = () => {
    if (!testForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Test name is required",
        variant: "destructive",
      });
      return;
    }

    if (sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one section is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const test: Test = {
        id: Date.now(),
        moduleId: parseInt(moduleId!),
        name: testForm.name,
        description: testForm.description,
        instructions: testForm.instructions,
        duration: testForm.duration,
        randomizeQuestions: testForm.randomizeQuestions,
        status: 'draft',
        sections: sections
      };

      // Save to localStorage
      const tests = JSON.parse(localStorage.getItem('tests') || '[]');
      tests.push(test);
      localStorage.setItem('tests', JSON.stringify(tests));

      // Update module with test ID
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const updatedModules = modules.map((m: any) => 
        m.id === parseInt(moduleId!) ? { ...m, testId: test.id } : m
      );
      localStorage.setItem('modules', JSON.stringify(updatedModules));

      toast({ title: "✅ Test created successfully!" });
      
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
        description: "Failed to save test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (type: 'mcq' | 'coding') => {
    const templates = {
      mcq: `question_text,option_A,option_B,option_C,option_D,correct_option,marks,negative_marks,explanation,tags
What is a loop in C?,A repeating condition,A static variable,A constant,A pointer,A,1,0,Used for repeating tasks,"loops, control flow"`,
      coding: `problem_title,description,allowed_languages,sample_input,sample_output,hidden_testcases,points,time_limit_sec,memory_limit_mb,tags
Sum of Numbers,Write a program to sum numbers,"C, C++, Python",5,15,10::55|20::210|5::15,10,2,256,"loops, math"`
    };

    const blob = new Blob([templates[type]], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Create Test
              </h1>
              <p className="text-purple-100">
                Building assessment for: {module.title}
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section: Basic Info & Sections */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TestTube className="w-4 h-4 text-purple-600" />
                  </div>
                  Basic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testName" className="font-medium text-gray-700">Test Name *</Label>
                    <Input
                      id="testName"
                      value={testForm.name}
                      onChange={(e) => setTestForm({...testForm, name: e.target.value})}
                      placeholder="e.g., Loops Assessment"
                      required
                      className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="font-medium text-gray-700">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={testForm.duration}
                      onChange={(e) => setTestForm({...testForm, duration: parseInt(e.target.value) || 60})}
                      className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    value={testForm.description}
                    onChange={(e) => setTestForm({...testForm, description: e.target.value})}
                    placeholder="Purpose of the test"
                    rows={3}
                    className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="randomizeTest"
                    checked={testForm.randomizeQuestions}
                    onCheckedChange={(checked) => setTestForm({...testForm, randomizeQuestions: checked})}
                  />
                  <Label htmlFor="randomizeTest" className="font-medium text-gray-700">Randomize Questions</Label>
                </div>
              </CardContent>
            </Card>

            {/* Add Sections */}
            <Accordion type="single" collapsible defaultValue="add-sections">
              <AccordionItem value="add-sections">
                <Card className="rounded-2xl shadow-md border border-gray-100">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <CardTitle className="text-blue-700 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                      Add Sections
                    </CardTitle>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="px-6 pb-6">
                      <form onSubmit={handleSectionSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sectionName" className="font-medium text-gray-700">Section Name *</Label>
                            <Input
                              id="sectionName"
                              value={sectionForm.name}
                              onChange={(e) => setSectionForm({...sectionForm, name: e.target.value})}
                              placeholder="e.g., MCQ Section"
                              required
                              className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="font-medium text-gray-700">Section Type</Label>
                            <Select
                              value={sectionForm.type}
                              onValueChange={(value: 'mcq' | 'coding') => setSectionForm({...sectionForm, type: value})}
                            >
                              <SelectTrigger className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mcq">MCQ</SelectItem>
                                <SelectItem value="coding">Coding</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sectionDuration" className="font-medium text-gray-700">Duration (minutes)</Label>
                            <Input
                              id="sectionDuration"
                              type="number"
                              min="1"
                              value={sectionForm.duration}
                              onChange={(e) => setSectionForm({...sectionForm, duration: parseInt(e.target.value) || 30})}
                              className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="marksPerQuestion" className="font-medium text-gray-700">Marks per Question</Label>
                            <Input
                              id="marksPerQuestion"
                              type="number"
                              min="1"
                              value={sectionForm.marksPerQuestion}
                              onChange={(e) => setSectionForm({...sectionForm, marksPerQuestion: parseInt(e.target.value) || 1})}
                              className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="randomizeSection"
                            checked={sectionForm.randomizeQuestions}
                            onCheckedChange={(checked) => setSectionForm({...sectionForm, randomizeQuestions: checked})}
                          />
                          <Label htmlFor="randomizeSection" className="font-medium text-gray-700">Randomize Questions in Section</Label>
                        </div>

                        <Button 
                          type="submit"
                          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      </form>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* Sections List */}
            {sections.length > 0 && (
              <Card className="rounded-2xl shadow-md border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-gray-800">Test Sections ({sections.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{section.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                {section.type === 'mcq' ? <FileText className="h-3 w-3" /> : <Code className="h-3 w-3" />}
                                {section.type.toUpperCase()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {section.duration} min
                              </span>
                              <span>{section.marksPerQuestion} marks each</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Section: Excel Upload & Templates */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-md border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-green-600" />
                  </div>
                  Excel Upload & Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Questions</h3>
                  <p className="text-gray-500 mb-4">
                    Upload questions for each section using Excel templates
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate('mcq')}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg h-12"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download MCQ Template
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate('coding')}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg h-12"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Coding Template
                  </Button>
                </div>

                {/* Quick Guide */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 mb-2">Upload Steps:</p>
                        <div className="space-y-1 text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            Download appropriate template
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            Fill in your questions
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Upload completed file
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            Review and publish test
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Save Test */}
            <Card className="rounded-2xl shadow-md border border-green-200">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Save className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Ready to Save?</h3>
                    <p className="text-gray-500 text-sm">
                      Test will be saved as draft. You can add questions and publish later.
                    </p>
                  </div>
                  <Button 
                    onClick={handleSaveTest}
                    disabled={loading || !testForm.name.trim() || sections.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Test'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestCreate;