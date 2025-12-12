import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Plus, FileText, Code, Edit, Trash2, Upload, Download,
  X, TestTube, BookOpen
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Test {
  id: number;
  name: string;
  type: 'mcq' | 'coding';
  tags: string[];
  difficulty?: string;
  description?: string;
  status: string;
  mcqQuestions?: any[];
  codingProblems?: any[];
}

interface MCQQuestion {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
}

interface CodingProblem {
  name: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  tags: string[];
  sampleInput: string;
  sampleOutput: string;
  hiddenTests: { input: string; output: string }[];
}

const ModuleTestManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [activeTab, setActiveTab] = useState<'mcq' | 'coding'>('mcq');
  
  const [testForm, setTestForm] = useState({
    name: '',
    type: 'mcq' as 'mcq' | 'coding',
    tags: '',
    difficulty: '',
    description: ''
  });

  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([
    { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A' }
  ]);

  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([
    {
      name: '',
      description: '',
      inputFormat: '',
      outputFormat: '',
      constraints: '',
      tags: [],
      sampleInput: '',
      sampleOutput: '',
      hiddenTests: [{ input: '', output: '' }]
    }
  ]);

  useEffect(() => {
    fetchTests();
  }, [moduleId]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/modules/${moduleId}/tests`);
      setTests(response.data.data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testForm.name.trim()) {
      toast({ title: "Error", description: "Test name is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:5000/api/modules/${moduleId}/tests`, {
        ...testForm,
        tags: testForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      
      const newTest = response.data.data;
      
      // Add questions/problems based on type
      if (testForm.type === 'mcq' && mcqQuestions.some(q => q.question.trim())) {
        const validQuestions = mcqQuestions.filter(q => q.question.trim());
        await axios.post(`http://localhost:5000/api/tests/${newTest.id}/mcq/questions`, {
          questions: validQuestions
        });
      } else if (testForm.type === 'coding' && codingProblems.some(p => p.name.trim())) {
        const validProblems = codingProblems.filter(p => p.name.trim()).map(p => ({
          ...p,
          tags: typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : p.tags
        }));
        await axios.post(`http://localhost:5000/api/tests/${newTest.id}/coding/problems`, {
          problems: validProblems
        });
      }
      
      toast({ title: "Success", description: "Test created successfully" });
      fetchTests();
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create test", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTestForm({ name: '', type: 'mcq', tags: '', difficulty: '', description: '' });
    setMcqQuestions([{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A' }]);
    setCodingProblems([{
      name: '', description: '', inputFormat: '', outputFormat: '', constraints: '',
      tags: [], sampleInput: '', sampleOutput: '', hiddenTests: [{ input: '', output: '' }]
    }]);
    setShowCreateForm(false);
  };

  const addMcqQuestion = () => {
    setMcqQuestions([...mcqQuestions, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A' }]);
  };

  const removeMcqQuestion = (index: number) => {
    if (mcqQuestions.length > 1) {
      setMcqQuestions(mcqQuestions.filter((_, i) => i !== index));
    }
  };

  const updateMcqQuestion = (index: number, field: keyof MCQQuestion, value: string) => {
    const updated = [...mcqQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setMcqQuestions(updated);
  };

  const addCodingProblem = () => {
    setCodingProblems([...codingProblems, {
      name: '', description: '', inputFormat: '', outputFormat: '', constraints: '',
      tags: [], sampleInput: '', sampleOutput: '', hiddenTests: [{ input: '', output: '' }]
    }]);
  };

  const removeCodingProblem = (index: number) => {
    if (codingProblems.length > 1) {
      setCodingProblems(codingProblems.filter((_, i) => i !== index));
    }
  };

  const updateCodingProblem = (index: number, field: keyof CodingProblem, value: any) => {
    const updated = [...codingProblems];
    updated[index] = { ...updated[index], [field]: value };
    setCodingProblems(updated);
  };

  const addHiddenTest = (problemIndex: number) => {
    const updated = [...codingProblems];
    updated[problemIndex].hiddenTests.push({ input: '', output: '' });
    setCodingProblems(updated);
  };

  const removeHiddenTest = (problemIndex: number, testIndex: number) => {
    const updated = [...codingProblems];
    if (updated[problemIndex].hiddenTests.length > 1) {
      updated[problemIndex].hiddenTests.splice(testIndex, 1);
      setCodingProblems(updated);
    }
  };

  const updateHiddenTest = (problemIndex: number, testIndex: number, field: 'input' | 'output', value: string) => {
    const updated = [...codingProblems];
    updated[problemIndex].hiddenTests[testIndex][field] = value;
    setCodingProblems(updated);
  };

  const handleBulkUpload = async (testId: number, type: 'mcq' | 'coding') => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({ title: "Error", description: "Please select a file", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/tests/${testId}/bulk-upload/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast({ title: "Success", description: "Bulk upload completed" });
      fetchTests();
    } catch (error) {
      toast({ title: "Error", description: "Bulk upload failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async (type: 'mcq' | 'coding') => {
    try {
      const response = await axios.get(`http://localhost:5000/api/templates/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-template.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: `${type.toUpperCase()} template downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to download ${type} template`,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/courses/${courseId}/modules`)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-1">Test Management</h1>
              <p className="text-purple-100">Create and manage MCQ & Coding tests</p>
            </div>
          </div>
        </div>

        {/* Test List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tests ({tests.length})</h2>
              <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </div>

            {tests.map((test) => (
              <Card key={test.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {test.type === 'mcq' ? <FileText className="h-5 w-5 text-blue-600" /> : <Code className="h-5 w-5 text-green-600" />}
                        <h3 className="font-semibold text-lg">{test.name}</h3>
                        <Badge variant={test.type === 'mcq' ? 'default' : 'secondary'}>
                          {test.type.toUpperCase()}
                        </Badge>
                      </div>
                      {test.description && <p className="text-gray-600 text-sm mb-2">{test.description}</p>}
                      <div className="flex items-center gap-2">
                        {test.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                        <span className="text-sm text-gray-500">
                          {test.type === 'mcq' ? `${test.mcqQuestions?.length || 0} questions` : `${test.codingProblems?.length || 0} problems`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {tests.length === 0 && (
              <div className="text-center py-12">
                <TestTube className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests created</h3>
                <p className="text-gray-500 mb-4">Create your first test to get started</p>
                <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test
                </Button>
              </div>
            )}
          </div>

          {/* Create Test Form */}
          {showCreateForm && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Create New Test
                    <Button variant="outline" size="sm" onClick={resetForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTest} className="space-y-4">
                    <div>
                      <Label>Test Name *</Label>
                      <Input
                        value={testForm.name}
                        onChange={(e) => setTestForm({...testForm, name: e.target.value})}
                        placeholder="e.g., JavaScript Quiz"
                        required
                      />
                    </div>

                    <div>
                      <Label>Test Type *</Label>
                      <Select value={testForm.type} onValueChange={(value: 'mcq' | 'coding') => setTestForm({...testForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ Test</SelectItem>
                          <SelectItem value="coding">Coding Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <Input
                        value={testForm.tags}
                        onChange={(e) => setTestForm({...testForm, tags: e.target.value})}
                        placeholder="javascript, arrays, loops"
                      />
                    </div>

                    <div>
                      <Label>Difficulty</Label>
                      <Select value={testForm.difficulty} onValueChange={(value) => setTestForm({...testForm, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={testForm.description}
                        onChange={(e) => setTestForm({...testForm, description: e.target.value})}
                        placeholder="Test description..."
                        rows={3}
                      />
                    </div>

                    {/* MCQ Questions */}
                    {testForm.type === 'mcq' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>MCQ Questions</Label>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => downloadTemplate('mcq')}>
                              <Download className="h-4 w-4 mr-1" />
                              Template
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={addMcqQuestion}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Question
                            </Button>
                          </div>
                        </div>

                        {mcqQuestions.map((q, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Question {index + 1}</Label>
                                {mcqQuestions.length > 1 && (
                                  <Button type="button" variant="outline" size="sm" onClick={() => removeMcqQuestion(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                value={q.question}
                                onChange={(e) => updateMcqQuestion(index, 'question', e.target.value)}
                                placeholder="Enter question..."
                                rows={2}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={q.optionA}
                                  onChange={(e) => updateMcqQuestion(index, 'optionA', e.target.value)}
                                  placeholder="Option A"
                                />
                                <Input
                                  value={q.optionB}
                                  onChange={(e) => updateMcqQuestion(index, 'optionB', e.target.value)}
                                  placeholder="Option B"
                                />
                                <Input
                                  value={q.optionC}
                                  onChange={(e) => updateMcqQuestion(index, 'optionC', e.target.value)}
                                  placeholder="Option C"
                                />
                                <Input
                                  value={q.optionD}
                                  onChange={(e) => updateMcqQuestion(index, 'optionD', e.target.value)}
                                  placeholder="Option D"
                                />
                              </div>
                              <Select value={q.correct} onValueChange={(value) => updateMcqQuestion(index, 'correct', value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="D">D</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Coding Problems */}
                    {testForm.type === 'coding' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Coding Problems</Label>
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => downloadTemplate('coding')}>
                              <Download className="h-4 w-4 mr-1" />
                              Template
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={addCodingProblem}>
                              <Plus className="h-4 w-4 mr-1" />
                              Add Problem
                            </Button>
                          </div>
                        </div>

                        {codingProblems.map((p, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Problem {index + 1}</Label>
                                {codingProblems.length > 1 && (
                                  <Button type="button" variant="outline" size="sm" onClick={() => removeCodingProblem(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <Input
                                value={p.name}
                                onChange={(e) => updateCodingProblem(index, 'name', e.target.value)}
                                placeholder="Problem name"
                              />
                              <Textarea
                                value={p.description}
                                onChange={(e) => updateCodingProblem(index, 'description', e.target.value)}
                                placeholder="Problem description..."
                                rows={3}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Textarea
                                  value={p.inputFormat}
                                  onChange={(e) => updateCodingProblem(index, 'inputFormat', e.target.value)}
                                  placeholder="Input format..."
                                  rows={2}
                                />
                                <Textarea
                                  value={p.outputFormat}
                                  onChange={(e) => updateCodingProblem(index, 'outputFormat', e.target.value)}
                                  placeholder="Output format..."
                                  rows={2}
                                />
                              </div>
                              <Textarea
                                value={p.constraints}
                                onChange={(e) => updateCodingProblem(index, 'constraints', e.target.value)}
                                placeholder="Constraints..."
                                rows={2}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Textarea
                                  value={p.sampleInput}
                                  onChange={(e) => updateCodingProblem(index, 'sampleInput', e.target.value)}
                                  placeholder="Sample input..."
                                  rows={2}
                                />
                                <Textarea
                                  value={p.sampleOutput}
                                  onChange={(e) => updateCodingProblem(index, 'sampleOutput', e.target.value)}
                                  placeholder="Sample output..."
                                  rows={2}
                                />
                              </div>
                              
                              {/* Hidden Test Cases */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-sm">Hidden Test Cases</Label>
                                  <Button type="button" variant="outline" size="sm" onClick={() => addHiddenTest(index)}>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </Button>
                                </div>
                                {p.hiddenTests.map((test, testIndex) => (
                                  <div key={testIndex} className="grid grid-cols-2 gap-2 mb-2">
                                    <Input
                                      value={test.input}
                                      onChange={(e) => updateHiddenTest(index, testIndex, 'input', e.target.value)}
                                      placeholder="Hidden input"
                                    />
                                    <div className="flex gap-1">
                                      <Input
                                        value={test.output}
                                        onChange={(e) => updateHiddenTest(index, testIndex, 'output', e.target.value)}
                                        placeholder="Hidden output"
                                      />
                                      {p.hiddenTests.length > 1 && (
                                        <Button type="button" variant="outline" size="sm" onClick={() => removeHiddenTest(index, testIndex)}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                        {loading ? 'Creating...' : 'Create Test'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
      />
    </AdminLayout>
  );
};

export default ModuleTestManager;