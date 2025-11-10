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
  ArrowLeft, Plus, Save, Upload, Download, TestTube, 
  FileText, Code, Clock, Target, Eye, Settings
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

const TestBuilder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [testForm, setTestForm] = useState({
    name: '',
    description: '',
    instructions: '',
    duration: 60,
    randomizeQuestions: true
  });

  const [sections, setSections] = useState<TestSection[]>([]);
  const [editingSection, setEditingSection] = useState<TestSection | null>(null);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    type: 'mcq' as 'mcq' | 'coding',
    duration: 30,
    marksPerQuestion: 1,
    instructions: '',
    randomizeQuestions: true
  });

  const steps = [
    { id: 1, title: "Basic Info", description: "Test details and settings" },
    { id: 2, title: "Sections", description: "Add MCQ and Coding sections" },
    { id: 3, title: "Upload", description: "Upload questions via Excel" },
    { id: 4, title: "Review", description: "Review and publish" }
  ];

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Test name is required",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
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
    
    toast({ title: "Success", description: "Section added successfully" });
  };

  const handleSaveTest = () => {
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

      toast({ title: "Success", description: "Test saved successfully" });
      navigate(`/admin/tests/${test.id}/edit`);
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

  return (
    <AdminLayout>
      <div className="space-y-6">
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
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="p-0 h-auto font-normal"
          >
            Modules
          </Button>
          <span>/</span>
          <span className="font-medium text-foreground">Create Test</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Module
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Test
            </h1>
            <p className="text-muted-foreground">
              Build assessment for module - Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {step.id}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testName">Test Name *</Label>
                    <Input
                      id="testName"
                      value={testForm.name}
                      onChange={(e) => setTestForm({...testForm, name: e.target.value})}
                      placeholder="e.g., Loops Assessment"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Test Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={testForm.duration}
                      onChange={(e) => setTestForm({...testForm, duration: parseInt(e.target.value) || 60})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Test Description</Label>
                  <Textarea
                    id="description"
                    value={testForm.description}
                    onChange={(e) => setTestForm({...testForm, description: e.target.value})}
                    placeholder="Purpose of the test"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Test Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={testForm.instructions}
                    onChange={(e) => setTestForm({...testForm, instructions: e.target.value})}
                    placeholder="Guidelines for students"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="randomizeTest"
                    checked={testForm.randomizeQuestions}
                    onCheckedChange={(checked) => setTestForm({...testForm, randomizeQuestions: checked})}
                  />
                  <Label htmlFor="randomizeTest">Randomize Questions</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Continue to Sections
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSectionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sectionName">Section Name *</Label>
                      <Input
                        id="sectionName"
                        value={sectionForm.name}
                        onChange={(e) => setSectionForm({...sectionForm, name: e.target.value})}
                        placeholder="e.g., MCQ Section"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Section Type</Label>
                      <Select
                        value={sectionForm.type}
                        onValueChange={(value: 'mcq' | 'coding') => setSectionForm({...sectionForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="coding">Coding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sectionDuration">Duration (minutes)</Label>
                      <Input
                        id="sectionDuration"
                        type="number"
                        min="1"
                        value={sectionForm.duration}
                        onChange={(e) => setSectionForm({...sectionForm, duration: parseInt(e.target.value) || 30})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marksPerQuestion">Marks per Correct Answer</Label>
                      <Input
                        id="marksPerQuestion"
                        type="number"
                        min="1"
                        value={sectionForm.marksPerQuestion}
                        onChange={(e) => setSectionForm({...sectionForm, marksPerQuestion: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sectionInstructions">Section Instructions</Label>
                    <Textarea
                      id="sectionInstructions"
                      value={sectionForm.instructions}
                      onChange={(e) => setSectionForm({...sectionForm, instructions: e.target.value})}
                      placeholder="Optional instructions for this section"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="randomizeSection"
                      checked={sectionForm.randomizeQuestions}
                      onCheckedChange={(checked) => setSectionForm({...sectionForm, randomizeQuestions: checked})}
                    />
                    <Label htmlFor="randomizeSection">Randomize Questions in Section</Label>
                  </div>

                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sections List */}
            {sections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Sections ({sections.length})</CardTitle>
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
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge variant={section.type === 'mcq' ? 'default' : 'secondary'}>
                                {section.type === 'mcq' ? <FileText className="h-3 w-3 mr-1" /> : <Code className="h-3 w-3 mr-1" />}
                                {section.type.toUpperCase()}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {section.duration} min
                              </span>
                              <span>{section.marksPerQuestion} marks each</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadTemplate(section.type)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Template
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)}
                disabled={sections.length === 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Continue to Upload
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Excel Files</h3>
                <p className="text-muted-foreground mb-4">
                  Upload questions for each section using the provided templates
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => downloadTemplate('mcq')}>
                    <Download className="h-4 w-4 mr-2" />
                    MCQ Template
                  </Button>
                  <Button variant="outline" onClick={() => downloadTemplate('coding')}>
                    <Download className="h-4 w-4 mr-2" />
                    Coding Template
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Continue to Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Test Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {testForm.name}</p>
                    <p><strong>Duration:</strong> {testForm.duration} minutes</p>
                    <p><strong>Randomize:</strong> {testForm.randomizeQuestions ? 'Yes' : 'No'}</p>
                    <p><strong>Sections:</strong> {sections.length}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sections Summary</h3>
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <div key={section.id} className="text-sm border rounded p-2">
                        <p><strong>{index + 1}. {section.name}</strong></p>
                        <p>Type: {section.type.toUpperCase()} • Duration: {section.duration}min</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSaveTest}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestBuilder;