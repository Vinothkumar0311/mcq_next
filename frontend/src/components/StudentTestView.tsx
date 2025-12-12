import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Code, Clock, Target, CheckCircle, 
  ArrowRight, ArrowLeft, Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface MCQQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  order: number;
}

interface CodingProblem {
  id: number;
  name: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  tags: string[];
  sampleInput: string;
  sampleOutput: string;
  order: number;
}

interface Test {
  id: number;
  name: string;
  type: 'mcq' | 'coding';
  tags: string[];
  difficulty?: string;
  description?: string;
  mcqQuestions?: MCQQuestion[];
  codingProblems?: CodingProblem[];
}

interface StudentTestViewProps {
  moduleId: number;
}

const StudentTestView = ({ moduleId }: StudentTestViewProps) => {
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [codeSubmissions, setCodeSubmissions] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    fetchTests();
  }, [moduleId]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/modules/${moduleId}/tests`);
      // Only show published tests to students
      const publishedTests = response.data.data.filter((test: Test) => test.status === 'published');
      setTests(publishedTests);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setCodeSubmissions({});
  };

  const handleMCQAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleCodeSubmission = (problemId: number, code: string) => {
    setCodeSubmissions(prev => ({ ...prev, [problemId]: code }));
  };

  const nextQuestion = () => {
    if (selectedTest) {
      const totalQuestions = selectedTest.type === 'mcq' 
        ? selectedTest.mcqQuestions?.length || 0
        : selectedTest.codingProblems?.length || 0;
      
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = () => {
    // Implementation for test submission
    toast({
      title: "Test Submitted",
      description: "Your answers have been recorded successfully",
    });
    setTestStarted(false);
    setSelectedTest(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (testStarted && selectedTest) {
    const isLastQuestion = selectedTest.type === 'mcq' 
      ? currentQuestion === (selectedTest.mcqQuestions?.length || 0) - 1
      : currentQuestion === (selectedTest.codingProblems?.length || 0) - 1;

    return (
      <div className="space-y-6">
        {/* Test Header */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{selectedTest.name}</h1>
              <p className="text-purple-100">
                Question {currentQuestion + 1} of {selectedTest.type === 'mcq' ? selectedTest.mcqQuestions?.length : selectedTest.codingProblems?.length}
              </p>
            </div>
            <Badge className="bg-white/20 text-white">
              {selectedTest.type.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Question Content */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-8">
            {selectedTest.type === 'mcq' && selectedTest.mcqQuestions && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedTest.mcqQuestions[currentQuestion]?.question}
                  </h2>
                  
                  <RadioGroup
                    value={answers[selectedTest.mcqQuestions[currentQuestion]?.id] || ''}
                    onValueChange={(value) => handleMCQAnswer(selectedTest.mcqQuestions![currentQuestion].id, value)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="A" id="optionA" />
                        <Label htmlFor="optionA" className="flex-1 cursor-pointer">
                          A. {selectedTest.mcqQuestions[currentQuestion]?.optionA}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="B" id="optionB" />
                        <Label htmlFor="optionB" className="flex-1 cursor-pointer">
                          B. {selectedTest.mcqQuestions[currentQuestion]?.optionB}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="C" id="optionC" />
                        <Label htmlFor="optionC" className="flex-1 cursor-pointer">
                          C. {selectedTest.mcqQuestions[currentQuestion]?.optionC}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="D" id="optionD" />
                        <Label htmlFor="optionD" className="flex-1 cursor-pointer">
                          D. {selectedTest.mcqQuestions[currentQuestion]?.optionD}
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {selectedTest.type === 'coding' && selectedTest.codingProblems && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedTest.codingProblems[currentQuestion]?.name}
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Problem Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedTest.codingProblems[currentQuestion]?.description}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Input Format</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                          {selectedTest.codingProblems[currentQuestion]?.inputFormat}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Output Format</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                          {selectedTest.codingProblems[currentQuestion]?.outputFormat}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Sample Test Case</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-sm font-medium">Input:</Label>
                            <pre className="bg-gray-100 p-2 rounded text-sm">
                              {selectedTest.codingProblems[currentQuestion]?.sampleInput}
                            </pre>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Output:</Label>
                            <pre className="bg-gray-100 p-2 rounded text-sm">
                              {selectedTest.codingProblems[currentQuestion]?.sampleOutput}
                            </pre>
                          </div>
                        </div>
                      </div>
                      
                      {selectedTest.codingProblems[currentQuestion]?.constraints && (
                        <div>
                          <h3 className="font-semibold mb-2">Constraints</h3>
                          <p className="text-gray-700 bg-yellow-50 p-3 rounded">
                            {selectedTest.codingProblems[currentQuestion]?.constraints}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Your Solution</h3>
                      <Textarea
                        value={codeSubmissions[selectedTest.codingProblems[currentQuestion]?.id] || ''}
                        onChange={(e) => handleCodeSubmission(selectedTest.codingProblems[currentQuestion].id, e.target.value)}
                        placeholder="Write your code here..."
                        className="font-mono text-sm"
                        rows={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Progress: {currentQuestion + 1} / {selectedTest.type === 'mcq' ? selectedTest.mcqQuestions?.length : selectedTest.codingProblems?.length}
          </div>
          
          {isLastQuestion ? (
            <Button onClick={submitTest} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Test
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Available Tests</h1>
        <p className="text-purple-100">
          {tests.length} test{tests.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="grid gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    {test.type === 'mcq' ? <FileText className="h-6 w-6 text-purple-600" /> : <Code className="h-6 w-6 text-purple-600" />}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">{test.name}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={test.type === 'mcq' ? 'default' : 'secondary'}>
                        {test.type.toUpperCase()}
                      </Badge>
                      {test.difficulty && (
                        <Badge variant="outline" className={
                          test.difficulty === 'easy' ? 'border-green-300 text-green-700' :
                          test.difficulty === 'medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-red-300 text-red-700'
                        }>
                          {test.difficulty}
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {test.type === 'mcq' ? `${test.mcqQuestions?.length || 0} questions` : `${test.codingProblems?.length || 0} problems`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => startTest(test)}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Test
                </Button>
              </div>
            </CardHeader>

            {test.description && (
              <CardContent className="pt-0">
                <p className="text-gray-600">{test.description}</p>
                {test.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {test.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Target className="h-12 w-12 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests available</h3>
          <p className="text-sm text-muted-foreground">Check back later for assessments</p>
        </div>
      )}
    </div>
  );
};

export default StudentTestView;