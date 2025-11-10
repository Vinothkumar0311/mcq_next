import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Upload, Download, HelpCircle, CheckCircle, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import * as XLSX from 'xlsx';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const QuestionManagement = () => {
  const { moduleId } = useParams();
  const { toast } = useToast();
  const [module, setModule] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (moduleId) {
      fetchModuleConfig();
      fetchQuestions();
    }
  }, [moduleId]);

  const fetchModuleConfig = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/modules/${moduleId}`);
      setModule(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch module configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/modules/${moduleId}/questions`);
      setQuestions(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      });
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload Excel files (.xlsx or .xls) only",
        variant: "destructive",
      });
      return;
    }

    // Preview Excel data
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setPreviewData(jsonData.slice(0, 5)); // Show first 5 rows for preview
        
        if (jsonData.length > 0) {
          uploadQuestions(file);
        } else {
          toast({
            title: "Empty File",
            description: "The Excel file appears to be empty",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "File Error",
          description: "Failed to read Excel file",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadQuestions = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await axiosInstance.post(`/api/admin/modules/${moduleId}/questions/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      toast({
        title: "✅ Success",
        description: response.data.message,
      });
      
      fetchQuestions();
      
      // Reset after 2 seconds
      setTimeout(() => {
        setUploadProgress(0);
        setPreviewData([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (error: any) {
      clearInterval(interval);
      setUploadProgress(0);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload questions",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = (type: 'mcq' | 'coding') => {
    const templates = {
      mcq: {
        headers: ['question_text', 'option_A', 'option_B', 'option_C', 'option_D', 'correct_option', 'marks', 'negative_marks', 'explanation', 'tags', 'difficulty'],
        sample: [
          {
            question_text: 'What is a loop in programming?',
            option_A: 'A repeating condition',
            option_B: 'A static variable',
            option_C: 'A constant',
            option_D: 'A pointer',
            correct_option: 'A',
            marks: 1,
            negative_marks: 0,
            explanation: 'Loops are used for repeating tasks',
            tags: 'loops, control flow',
            difficulty: 'easy'
          }
        ]
      },
      coding: {
        headers: ['problem_title', 'description', 'allowed_languages', 'sample_input', 'sample_output', 'hidden_testcases', 'points', 'time_limit_sec', 'memory_limit_mb', 'tags', 'difficulty'],
        sample: [
          {
            problem_title: 'Sum of Numbers',
            description: 'Write a program to calculate sum of two numbers',
            allowed_languages: 'C, C++, Python',
            sample_input: '5 10',
            sample_output: '15',
            hidden_testcases: '1 2::3|10 20::30|5 5::10',
            points: 10,
            time_limit_sec: 2,
            memory_limit_mb: 256,
            tags: 'math, basic',
            difficulty: 'easy'
          }
        ]
      }
    };

    const template = templates[type];
    const ws = XLSX.utils.json_to_sheet(template.sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type.toUpperCase());
    XLSX.writeFile(wb, `${type}_template.xlsx`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2">Loading module...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Question Management</h1>
              <p className="text-purple-100 text-lg">
                Managing: {module?.title || 'Module'}
              </p>
            </div>
          </div>
        </div>

        {/* Test Configuration Display */}
        {module && (
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-purple-50 border-b border-purple-200">
              <CardTitle className="text-purple-700 text-lg">Test Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-sm flex flex-wrap justify-between items-center mb-3">
                <span className="text-blue-700">🔹 MCQ Pass: {module.passCriteriaMCQ}%</span>
                <span className="text-green-700">🟢 Coding Pass: {module.passCriteriaCoding}%</span>
                <span className="text-purple-700">🟣 Questions to Display: {module.questionsToDisplay}</span>
              </div>
              <div className="text-xs text-gray-600">
                Tests can include both MCQ and Coding questions. Criteria and question limits are configurable per module.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Actions */}
        <Card className="border-2 border-blue-200 shadow-md">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
              Create Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                className="bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-200 h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </Button>
              
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="questions-upload"
                />
                <label
                  htmlFor="questions-upload"
                  className="inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 h-12 w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Excel Upload
                </label>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
                
                {uploadProgress === 100 && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Upload completed successfully!</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate('mcq')}
                  className="border-2 border-blue-300 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200 h-12"
                >
                  <Download className="w-4 h-4 mr-2" />
                  MCQ Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate('coding')}
                  className="border-2 border-purple-300 hover:bg-purple-50 shadow-md hover:shadow-lg transition-all duration-200 h-12"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Coding Template
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
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
            </div>
            
            {/* Excel Preview */}
            {previewData.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 mb-2">Excel Preview (First 5 rows):</p>
                      <div className="bg-white rounded border max-h-40 overflow-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50">
                            <tr>
                              {previewData[0] && Object.keys(previewData[0]).map((key, index) => (
                                <th key={index} className="px-2 py-1 text-left border-b">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, index) => (
                              <tr key={index} className="border-b">
                                {Object.values(row).map((value: any, cellIndex) => (
                                  <td key={cellIndex} className="px-2 py-1 truncate max-w-32">
                                    {String(value).substring(0, 30)}{String(value).length > 30 ? '...' : ''}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Questions ({questions.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                  {questions.length} total
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  {questions.filter(q => q.type === 'mcq').length} MCQ
                </Badge>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  {questions.filter(q => q.type === 'coding').length} Coding
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No questions added yet</h3>
                <p className="text-sm">Upload questions using Excel templates or add them manually</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((q, index) => (
                  <div key={q.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-semibold">
                            {index + 1}
                          </span>
                          <Badge variant={q.type === 'mcq' ? 'default' : 'secondary'} className="text-xs">
                            {q.type?.toUpperCase() || 'MCQ'}
                          </Badge>
                          {q.difficulty && (
                            <Badge variant="outline" className="text-xs">
                              {q.difficulty}
                            </Badge>
                          )}
                        </div>
                        
                        {q.type === 'coding' ? (
                          <div>
                            <p className="font-medium text-sm mb-1">{q.title || q.question}</p>
                            <p className="text-xs text-gray-600 mb-2">{q.description}</p>
                            <div className="flex gap-2 text-xs">
                              <Badge variant="outline">Points: {q.points || q.marks || 1}</Badge>
                              {q.allowedLanguages && (
                                <Badge variant="outline">{q.allowedLanguages.join(', ')}</Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-sm mb-2">{q.question}</p>
                            <div className="grid grid-cols-2 gap-2 mb-2 text-xs text-gray-600">
                              <div>A) {q.option1}</div>
                              <div>B) {q.option2}</div>
                              {q.option3 && <div>C) {q.option3}</div>}
                              {q.option4 && <div>D) {q.option4}</div>}
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                Answer: {q.correctAnswer}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Marks: {q.marks || 1}
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        {q.tags && q.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {q.tags.map((tag: string, tagIndex: number) => (
                              <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default QuestionManagement;