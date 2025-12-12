// // // import { useState, useEffect } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Textarea } from "@/components/ui/textarea";
// // // import { Switch } from "@/components/ui/switch";
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // // import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// // // import { useToast } from "@/hooks/use-toast";
// // // import {
// // //   ArrowLeft, Plus, Save, Upload, Download, TestTube,
// // //   FileText, Code, Clock, Target, Settings, HelpCircle
// // // } from "lucide-react";
// // // import AdminLayout from "@/components/AdminLayout";
// // // import { useNavigate, useParams } from "react-router-dom";

// // // interface TestSection {
// // //   id: number;
// // //   name: string;
// // //   type: 'mcq' | 'coding';
// // //   duration: number;
// // //   marksPerQuestion: number;
// // //   instructions?: string;
// // //   questionCount: number;
// // //   randomizeQuestions: boolean;
// // // }

// // // interface Test {
// // //   id: number;
// // //   moduleId: number;
// // //   name: string;
// // //   description: string;
// // //   instructions: string;
// // //   duration: number;
// // //   randomizeQuestions: boolean;
// // //   status: 'draft' | 'published';
// // //   sections: TestSection[];
// // // }

// // // const TestCreate = () => {
// // //   const { toast } = useToast();
// // //   const navigate = useNavigate();
// // //   const { moduleId } = useParams();
// // //   const [module, setModule] = useState<any>(null);
// // //   const [loading, setLoading] = useState(false);

// // //   const [testForm, setTestForm] = useState({
// // //     name: '',
// // //     description: '',
// // //     instructions: '',
// // //     duration: 60,
// // //     randomizeQuestions: true
// // //   });

// // //   const [sections, setSections] = useState<TestSection[]>([]);
// // //   const [sectionForm, setSectionForm] = useState({
// // //     name: '',
// // //     type: 'mcq' as 'mcq' | 'coding',
// // //     duration: 30,
// // //     marksPerQuestion: 1,
// // //     instructions: '',
// // //     randomizeQuestions: true
// // //   });

// // //   useEffect(() => {
// // //     loadModule();
// // //   }, [moduleId]);

// // //   const loadModule = () => {
// // //     try {
// // //       const modules = JSON.parse(localStorage.getItem('modules') || '[]');
// // //       const foundModule = modules.find((m: any) => m.id === parseInt(moduleId!));
// // //       setModule(foundModule);

// // //       if (foundModule) {
// // //         setTestForm(prev => ({
// // //           ...prev,
// // //           name: `${foundModule.title} Assessment`
// // //         }));
// // //       }
// // //     } catch (error) {
// // //       console.error('Error loading module:', error);
// // //     }
// // //   };

// // //   const handleSectionSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     if (!sectionForm.name.trim()) {
// // //       toast({
// // //         title: "Validation Error",
// // //         description: "Section name is required",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     const newSection: TestSection = {
// // //       id: Date.now(),
// // //       name: sectionForm.name,
// // //       type: sectionForm.type,
// // //       duration: sectionForm.duration,
// // //       marksPerQuestion: sectionForm.marksPerQuestion,
// // //       instructions: sectionForm.instructions,
// // //       questionCount: 0,
// // //       randomizeQuestions: sectionForm.randomizeQuestions
// // //     };

// // //     setSections([...sections, newSection]);
// // //     setSectionForm({
// // //       name: '',
// // //       type: 'mcq',
// // //       duration: 30,
// // //       marksPerQuestion: 1,
// // //       instructions: '',
// // //       randomizeQuestions: true
// // //     });

// // //     toast({ title: "✅ Section added successfully" });
// // //   };

// // //   const handleSaveTest = () => {
// // //     if (!testForm.name.trim()) {
// // //       toast({
// // //         title: "Validation Error",
// // //         description: "Test name is required",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     if (sections.length === 0) {
// // //       toast({
// // //         title: "Validation Error",
// // //         description: "At least one section is required",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       const test: Test = {
// // //         id: Date.now(),
// // //         moduleId: parseInt(moduleId!),
// // //         name: testForm.name,
// // //         description: testForm.description,
// // //         instructions: testForm.instructions,
// // //         duration: testForm.duration,
// // //         randomizeQuestions: testForm.randomizeQuestions,
// // //         status: 'draft',
// // //         sections: sections
// // //       };

// // //       // Save to localStorage
// // //       const tests = JSON.parse(localStorage.getItem('tests') || '[]');
// // //       tests.push(test);
// // //       localStorage.setItem('tests', JSON.stringify(tests));

// // //       // Update module with test ID
// // //       const modules = JSON.parse(localStorage.getItem('modules') || '[]');
// // //       const updatedModules = modules.map((m: any) =>
// // //         m.id === parseInt(moduleId!) ? { ...m, testId: test.id } : m
// // //       );
// // //       localStorage.setItem('modules', JSON.stringify(updatedModules));

// // //       toast({ title: "✅ Test created successfully!" });

// // //       // Navigate back to module management
// // //       const courseId = module?.courseId;
// // //       if (courseId) {
// // //         navigate(`/admin/courses/${courseId}/modules`);
// // //       } else {
// // //         navigate(-1);
// // //       }
// // //     } catch (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Failed to save test",
// // //         variant: "destructive",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const downloadTemplate = (type: 'mcq' | 'coding') => {
// // //     const templates = {
// // //       mcq: `question_text,option_A,option_B,option_C,option_D,correct_option,marks,negative_marks,explanation,tags
// // // What is a loop in C?,A repeating condition,A static variable,A constant,A pointer,A,1,0,Used for repeating tasks,"loops, control flow"`,
// // //       coding: `problem_title,description,allowed_languages,sample_input,sample_output,hidden_testcases,points,time_limit_sec,memory_limit_mb,tags
// // // Sum of Numbers,Write a program to sum numbers,"C, C++, Python",5,15,10::55|20::210|5::15,10,2,256,"loops, math"`
// // //     };

// // //     const blob = new Blob([templates[type]], { type: 'text/csv' });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement('a');
// // //     a.href = url;
// // //     a.download = `${type}_template.csv`;
// // //     a.click();
// // //     URL.revokeObjectURL(url);
// // //   };

// // //   if (!module) {
// // //     return (
// // //       <AdminLayout>
// // //         <div className="p-6">
// // //           <div className="text-center py-12">
// // //             <h2 className="text-xl font-semibold text-gray-900">Module not found</h2>
// // //             <Button
// // //               onClick={() => navigate(-1)}
// // //               className="mt-4"
// // //             >
// // //               Go Back
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </AdminLayout>
// // //     );
// // //   }

// // //   return (
// // //     <AdminLayout>
// // //       <div className="p-6 space-y-6">
// // //         {/* Header with Purple Gradient */}
// // //         <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
// // //           <div className="flex items-center gap-4">
// // //             <Button
// // //               variant="outline"
// // //               onClick={() => navigate(-1)}
// // //               className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
// // //             >
// // //               <ArrowLeft className="h-4 w-4 mr-2" />
// // //               Back to Module
// // //             </Button>
// // //             <div>
// // //               <h1 className="text-3xl font-bold mb-1">
// // //                 Create Test
// // //               </h1>
// // //               <p className="text-purple-100">
// // //                 Building assessment for: {module.title}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Two-Column Layout */}
// // //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //           {/* Left Section: Basic Info & Sections */}
// // //           <div className="space-y-6">
// // //             {/* Basic Information */}
// // //             <Card className="rounded-2xl shadow-md border border-gray-100">
// // //               <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
// // //                 <CardTitle className="text-purple-700 flex items-center gap-2">
// // //                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
// // //                     <TestTube className="w-4 h-4 text-purple-600" />
// // //                   </div>
// // //                   Basic Info
// // //                 </CardTitle>
// // //               </CardHeader>
// // //               <CardContent className="p-6 space-y-4">
// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   <div className="space-y-2">
// // //                     <Label htmlFor="testName" className="font-medium text-gray-700">Test Name *</Label>
// // //                     <Input
// // //                       id="testName"
// // //                       value={testForm.name}
// // //                       onChange={(e) => setTestForm({...testForm, name: e.target.value})}
// // //                       placeholder="e.g., Loops Assessment"
// // //                       required
// // //                       className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// // //                     />
// // //                   </div>
// // //                   <div className="space-y-2">
// // //                     <Label htmlFor="duration" className="font-medium text-gray-700">Duration (minutes)</Label>
// // //                     <Input
// // //                       id="duration"
// // //                       type="number"
// // //                       min="1"
// // //                       value={testForm.duration}
// // //                       onChange={(e) => setTestForm({...testForm, duration: parseInt(e.target.value) || 60})}
// // //                       className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="space-y-2">
// // //                   <Label htmlFor="description" className="font-medium text-gray-700">Description</Label>
// // //                   <Textarea
// // //                     id="description"
// // //                     value={testForm.description}
// // //                     onChange={(e) => setTestForm({...testForm, description: e.target.value})}
// // //                     placeholder="Purpose of the test"
// // //                     rows={3}
// // //                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// // //                   />
// // //                 </div>

// // //                 <div className="flex items-center space-x-2">
// // //                   <Switch
// // //                     id="randomizeTest"
// // //                     checked={testForm.randomizeQuestions}
// // //                     onCheckedChange={(checked) => setTestForm({...testForm, randomizeQuestions: checked})}
// // //                   />
// // //                   <Label htmlFor="randomizeTest" className="font-medium text-gray-700">Randomize Questions</Label>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>

// // //             {/* Add Sections */}
// // //             <Accordion type="single" collapsible defaultValue="add-sections">
// // //               <AccordionItem value="add-sections">
// // //                 <Card className="rounded-2xl shadow-md border border-gray-100">
// // //                   <AccordionTrigger className="px-6 py-4 hover:no-underline">
// // //                     <CardTitle className="text-blue-700 flex items-center gap-2">
// // //                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
// // //                         <Plus className="w-4 h-4 text-blue-600" />
// // //                       </div>
// // //                       Add Sections
// // //                     </CardTitle>
// // //                   </AccordionTrigger>
// // //                   <AccordionContent>
// // //                     <CardContent className="px-6 pb-6">
// // //                       <form onSubmit={handleSectionSubmit} className="space-y-4">
// // //                         <div className="grid grid-cols-2 gap-4">
// // //                           <div className="space-y-2">
// // //                             <Label htmlFor="sectionName" className="font-medium text-gray-700">Section Name *</Label>
// // //                             <Input
// // //                               id="sectionName"
// // //                               value={sectionForm.name}
// // //                               onChange={(e) => setSectionForm({...sectionForm, name: e.target.value})}
// // //                               placeholder="e.g., MCQ Section"
// // //                               required
// // //                               className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// // //                             />
// // //                           </div>
// // //                           <div className="space-y-2">
// // //                             <Label className="font-medium text-gray-700">Section Type</Label>
// // //                             <Select
// // //                               value={sectionForm.type}
// // //                               onValueChange={(value: 'mcq' | 'coding') => setSectionForm({...sectionForm, type: value})}
// // //                             >
// // //                               <SelectTrigger className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]">
// // //                                 <SelectValue />
// // //                               </SelectTrigger>
// // //                               <SelectContent>
// // //                                 <SelectItem value="mcq">MCQ</SelectItem>
// // //                                 <SelectItem value="coding">Coding</SelectItem>
// // //                               </SelectContent>
// // //                             </Select>
// // //                           </div>
// // //                           <div className="space-y-2">
// // //                             <Label htmlFor="sectionDuration" className="font-medium text-gray-700">Duration (minutes)</Label>
// // //                             <Input
// // //                               id="sectionDuration"
// // //                               type="number"
// // //                               min="1"
// // //                               value={sectionForm.duration}
// // //                               onChange={(e) => setSectionForm({...sectionForm, duration: parseInt(e.target.value) || 30})}
// // //                               className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// // //                             />
// // //                           </div>
// // //                           <div className="space-y-2">
// // //                             <Label htmlFor="marksPerQuestion" className="font-medium text-gray-700">Marks per Question</Label>
// // //                             <Input
// // //                               id="marksPerQuestion"
// // //                               type="number"
// // //                               min="1"
// // //                               value={sectionForm.marksPerQuestion}
// // //                               onChange={(e) => setSectionForm({...sectionForm, marksPerQuestion: parseInt(e.target.value) || 1})}
// // //                               className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// // //                             />
// // //                           </div>
// // //                         </div>

// // //                         <div className="flex items-center space-x-2">
// // //                           <Switch
// // //                             id="randomizeSection"
// // //                             checked={sectionForm.randomizeQuestions}
// // //                             onCheckedChange={(checked) => setSectionForm({...sectionForm, randomizeQuestions: checked})}
// // //                           />
// // //                           <Label htmlFor="randomizeSection" className="font-medium text-gray-700">Randomize Questions in Section</Label>
// // //                         </div>

// // //                         <Button
// // //                           type="submit"
// // //                           className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
// // //                         >
// // //                           <Plus className="h-4 w-4 mr-2" />
// // //                           Add Section
// // //                         </Button>
// // //                       </form>
// // //                     </CardContent>
// // //                   </AccordionContent>
// // //                 </Card>
// // //               </AccordionItem>
// // //             </Accordion>

// // //             {/* Sections List */}
// // //             {sections.length > 0 && (
// // //               <Card className="rounded-2xl shadow-md border border-gray-100">
// // //                 <CardHeader>
// // //                   <CardTitle className="text-gray-800">Test Sections ({sections.length})</CardTitle>
// // //                 </CardHeader>
// // //                 <CardContent className="space-y-4">
// // //                   {sections.map((section, index) => (
// // //                     <div key={section.id} className="border rounded-lg p-4">
// // //                       <div className="flex items-center justify-between">
// // //                         <div className="flex items-center gap-4">
// // //                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
// // //                             {index + 1}
// // //                           </div>
// // //                           <div>
// // //                             <h4 className="font-semibold">{section.name}</h4>
// // //                             <div className="flex items-center gap-4 text-sm text-gray-500">
// // //                               <span className="flex items-center gap-1">
// // //                                 {section.type === 'mcq' ? <FileText className="h-3 w-3" /> : <Code className="h-3 w-3" />}
// // //                                 {section.type.toUpperCase()}
// // //                               </span>
// // //                               <span className="flex items-center gap-1">
// // //                                 <Clock className="h-3 w-3" />
// // //                                 {section.duration} min
// // //                               </span>
// // //                               <span>{section.marksPerQuestion} marks each</span>
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </CardContent>
// // //               </Card>
// // //             )}
// // //           </div>

// // //           {/* Right Section: Excel Upload & Templates */}
// // //           <div className="space-y-6">
// // //             <Card className="rounded-2xl shadow-md border border-gray-100">
// // //               <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
// // //                 <CardTitle className="text-green-700 flex items-center gap-2">
// // //                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
// // //                     <Upload className="w-4 h-4 text-green-600" />
// // //                   </div>
// // //                   Excel Upload & Templates
// // //                 </CardTitle>
// // //               </CardHeader>
// // //               <CardContent className="p-6 space-y-6">
// // //                 <div className="text-center">
// // //                   <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
// // //                   <h3 className="text-lg font-semibold mb-2">Upload Questions</h3>
// // //                   <p className="text-gray-500 mb-4">
// // //                     Upload questions for each section using Excel templates
// // //                   </p>
// // //                 </div>

// // //                 <div className="space-y-3">
// // //                   <Button
// // //                     variant="outline"
// // //                     onClick={() => downloadTemplate('mcq')}
// // //                     className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg h-12"
// // //                   >
// // //                     <Download className="h-4 w-4 mr-2" />
// // //                     Download MCQ Template
// // //                   </Button>
// // //                   <Button
// // //                     variant="outline"
// // //                     onClick={() => downloadTemplate('coding')}
// // //                     className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg h-12"
// // //                   >
// // //                     <Download className="h-4 w-4 mr-2" />
// // //                     Download Coding Template
// // //                   </Button>
// // //                 </div>

// // //                 {/* Quick Guide */}
// // //                 <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
// // //                   <CardContent className="p-4">
// // //                     <div className="flex items-start gap-3">
// // //                       <div className="bg-blue-100 p-2 rounded-lg">
// // //                         <HelpCircle className="w-4 h-4 text-blue-600" />
// // //                       </div>
// // //                       <div>
// // //                         <p className="font-semibold text-blue-800 mb-2">Upload Steps:</p>
// // //                         <div className="space-y-1 text-sm text-blue-700">
// // //                           <div className="flex items-center gap-2">
// // //                             <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
// // //                             Download appropriate template
// // //                           </div>
// // //                           <div className="flex items-center gap-2">
// // //                             <span className="w-2 h-2 bg-green-400 rounded-full"></span>
// // //                             Fill in your questions
// // //                           </div>
// // //                           <div className="flex items-center gap-2">
// // //                             <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
// // //                             Upload completed file
// // //                           </div>
// // //                           <div className="flex items-center gap-2">
// // //                             <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
// // //                             Review and publish test
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
// // //               </CardContent>
// // //             </Card>

// // //             {/* Save Test */}
// // //             <Card className="rounded-2xl shadow-md border border-green-200">
// // //               <CardContent className="p-6">
// // //                 <div className="text-center space-y-4">
// // //                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
// // //                     <Save className="w-8 h-8 text-green-600" />
// // //                   </div>
// // //                   <div>
// // //                     <h3 className="text-lg font-semibold text-gray-800">Ready to Save?</h3>
// // //                     <p className="text-gray-500 text-sm">
// // //                       Test will be saved as draft. You can add questions and publish later.
// // //                     </p>
// // //                   </div>
// // //                   <Button
// // //                     onClick={handleSaveTest}
// // //                     disabled={loading || !testForm.name.trim() || sections.length === 0}
// // //                     className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8"
// // //                   >
// // //                     <Save className="h-4 w-4 mr-2" />
// // //                     {loading ? 'Saving...' : 'Save Test'}
// // //                   </Button>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </AdminLayout>
// // //   );
// // // };

// // // export default TestCreate;

// // import { useState, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Switch } from "@/components/ui/switch";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// // import { useToast } from "@/hooks/use-toast";
// // import {
// //   ArrowLeft, Plus, Save, Upload, Download, TestTube,
// //   FileText, Code, Clock, Target, Settings, HelpCircle
// // } from "lucide-react";
// // import AdminLayout from "@/components/AdminLayout";
// // import { useNavigate, useParams } from "react-router-dom";
// // // --- API IMPORTS ---
// // import { getModuleById } from "@/api/moduleApi"; // Assumed import
// // import { createTest } from "@/api/testApi"; // Assumed import

// // interface TestSection {
// //   id: number;
// //   name: string;
// //   type: 'mcq' | 'coding';
// //   duration: number;
// //   marksPerQuestion: number;
// //   instructions?: string;
// //   questionCount: number;
// //   randomizeQuestions: boolean;
// // }

// // // Interface for Test (data we send to create one)
// // interface TestCreateData {
// //   name: string;
// //   description: string;
// //   instructions: string;
// //   duration: number;
// //   randomizeQuestions: boolean;
// //   sections: TestSection[];
// // }

// // const TestCreate = () => {
// //   const { toast } = useToast();
// //   const navigate = useNavigate();
// //   const { moduleId } = useParams();
// //   const [module, setModule] = useState<any>(null);
// //   const [loading, setLoading] = useState(false);

// //   const [testForm, setTestForm] = useState({
// //     name: '',
// //     description: '',
// //     instructions: '', // Added instructions to form state
// //     duration: 60,
// //     randomizeQuestions: true
// //   });

// //   const [sections, setSections] = useState<TestSection[]>([]);
// //   const [sectionForm, setSectionForm] = useState({
// //     name: '',
// //     type: 'mcq' as 'mcq' | 'coding',
// //     duration: 30,
// //     marksPerQuestion: 1,
// //     instructions: '',
// //     randomizeQuestions: true
// //   });

// //   useEffect(() => {
// //     if (moduleId) {
// //       loadModule();
// //     }
// //   }, [moduleId]);

// //   // --- API: Load Module Data ---
// //   const loadModule = async () => {
// //     try {
// //       const data = await getModuleById(parseInt(moduleId!));
// //       setModule(data);

// //       if (data) {
// //         setTestForm(prev => ({
// //           ...prev,
// //           name: `${data.title} Assessment`
// //         }));
// //       }
// //     } catch (error) {
// //       console.error('Error loading module:', error);
// //       toast({
// //         title: "Error",
// //         description: "Module not found",
// //         variant: "destructive"
// //       });
// //     }
// //   };

// //   const handleSectionSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!sectionForm.name.trim()) {
// //       toast({
// //         title: "Validation Error",
// //         description: "Section name is required",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     const newSection: TestSection = {
// //       id: Date.now(), // This ID is temporary for the UI
// //       name: sectionForm.name,
// //       type: sectionForm.type,
// //       duration: sectionForm.duration,
// //       marksPerQuestion: sectionForm.marksPerQuestion,
// //       instructions: sectionForm.instructions,
// //       questionCount: 0,
// //       randomizeQuestions: sectionForm.randomizeQuestions
// //     };

// //     setSections([...sections, newSection]);
// //     setSectionForm({
// //       name: '',
// //       type: 'mcq',
// //       duration: 30,
// //       marksPerQuestion: 1,
// //       instructions: '',
// //       randomizeQuestions: true
// //     });

// //     toast({ title: "✅ Section added successfully" });
// //   };

// //   // --- API: Save Test ---
// //   const handleSaveTest = async () => {
// //     if (!testForm.name.trim()) {
// //       toast({
// //         title: "Validation Error",
// //         description: "Test name is required",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (sections.length === 0) {
// //       toast({
// //         title: "Validation Error",
// //         description: "At least one section is required",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const testData: TestCreateData = {
// //         name: testForm.name,
// //         description: testForm.description,
// //         instructions: testForm.instructions, // Make sure to add this to your form
// //         duration: testForm.duration,
// //         randomizeQuestions: testForm.randomizeQuestions,
// //         status: 'draft',
// //         sections: sections
// //       };

// //       // API Call to create the test
// //       await createTest(parseInt(moduleId!), testData);

// //       toast({ title: "✅ Test created successfully!" });

// //       // Navigate back to module management
// //       const courseId = module?.courseId;
// //       if (courseId) {
// //         navigate(`/admin/courses/${courseId}/modules`);
// //       } else {
// //         navigate(-1);
// //       }
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to save test",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ... (downloadTemplate function remains the same) ...
// //   const downloadTemplate = (type: 'mcq' | 'coding') => {
// //     const templates = {
// //       mcq: `question_text,option_A,option_B,option_C,option_D,correct_option,marks,negative_marks,explanation,tags
// // What is a loop in C?,A repeating condition,A static variable,A constant,A pointer,A,1,0,Used for repeating tasks,"loops, control flow"`,
// //       coding: `problem_title,description,allowed_languages,sample_input,sample_output,hidden_testcases,points,time_limit_sec,memory_limit_mb,tags
// // Sum of Numbers,Write a program to sum numbers,"C, C++, Python",5,15,10::55|20::210|5::15,10,2,256,"loops, math"`
// //     };

// //     const blob = new Blob([templates[type]], { type: 'text/csv' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `${type}_template.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   if (!module) {
// //     return (
// //       <AdminLayout>
// //         <div className="p-6">
// //           <div className="text-center py-12">
// //             <h2 className="text-xl font-semibold text-gray-900">Module not found</h2>
// //             <p className="text-gray-500 mb-4">Could not load module data.</p>
// //             <Button
// //               onClick={() => navigate(-1)}
// //               className="mt-4"
// //             >
// //               Go Back
// //             </Button>
// //           </div>
// //         </div>
// //       </AdminLayout>
// //     );
// //   }

// //   // --- JSX (UI) remains mostly the same ---
// //   // ... (Return the same JSX as in your original file) ...
// //   // Note: I added 'instructions' to the Test Form,
// //   // so you should add a Textarea for it in the "Basic Info" Card
// //   return (
// //     <AdminLayout>
// //       <div className="p-6 space-y-6">
// //         {/* Header with Purple Gradient */}
// //         <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
// //           {/* ... (header JSX) ... */}
// //           <div className="flex items-center gap-4">
// //             <Button
// //               variant="outline"
// //               onClick={() => navigate(-1)}
// //               className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
// //             >
// //               <ArrowLeft className="h-4 w-4 mr-2" />
// //               Back to Module
// //             </Button>
// //             <div>
// //               <h1 className="text-3xl font-bold mb-1">
// //                 Create Test
// //               </h1>
// //               <p className="text-purple-100">
// //                 Building assessment for: {module.title}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Two-Column Layout */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Left Section: Basic Info & Sections */}
// //           <div className="space-y-6">
// //             {/* Basic Information */}
// //             <Card className="rounded-2xl shadow-md border border-gray-100">
// //               <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
// //                 {/* ... (card header) ... */}
// //                 <CardTitle className="text-purple-700 flex items-center gap-2">
// //                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
// //                     <TestTube className="w-4 h-4 text-purple-600" />
// //                   </div>
// //                   Basic Info
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className="p-6 space-y-4">
// //                 <div className="grid grid-cols-2 gap-4">
// //                   {/* ... (Test Name) ... */}
// //                   <div className="space-y-2">
// //                     <Label htmlFor="testName" className="font-medium text-gray-700">Test Name *</Label>
// //                     <Input
// //                       id="testName"
// //                       value={testForm.name}
// //                       onChange={(e) => setTestForm({...testForm, name: e.target.value})}
// //                       placeholder="e.g., Loops Assessment"
// //                       required
// //                       className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// //                     />
// //                   </div>
// //                   {/* ... (Duration) ... */}
// //                   <div className="space-y-2">
// //                     <Label htmlFor="duration" className="font-medium text-gray-700">Duration (minutes)</Label>
// //                     <Input
// //                       id="duration"
// //                       type="number"
// //                       min="1"
// //                       value={testForm.duration}
// //                       onChange={(e) => setTestForm({...testForm, duration: parseInt(e.target.value) || 60})}
// //                       className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* ... (Description) ... */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="description" className="font-medium text-gray-700">Description</Label>
// //                   <Textarea
// //                     id="description"
// //                     value={testForm.description}
// //                     onChange={(e) => setTestForm({...testForm, description: e.target.value})}
// //                     placeholder="Purpose of the test"
// //                     rows={3}
// //                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// //                   />
// //                 </div>

// //                 {/* ADDED: Instructions Textarea */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="instructions" className="font-medium text-gray-700">Instructions</Label>
// //                   <Textarea
// //                     id="instructions"
// //                     value={testForm.instructions}
// //                     onChange={(e) => setTestForm({...testForm, instructions: e.target.value})}
// //                     placeholder="Guidelines for students"
// //                     rows={3}
// //                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
// //                   />
// //                 </div>

// //                 {/* ... (Randomize) ... */}
// //                 <div className="flex items-center space-x-2">
// //                   <Switch
// //                     id="randomizeTest"
// //                     checked={testForm.randomizeQuestions}
// //                     onCheckedChange={(checked) => setTestForm({...testForm, randomizeQuestions: checked})}
// //                   />
// //                   <Label htmlFor="randomizeTest" className="font-medium text-gray-700">Randomize Questions</Label>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Add Sections (Accordion) */}
// //             {/* ... (This JSX is fine) ... */}
// //             <Accordion type="single" collapsible defaultValue="add-sections">
// //               <AccordionItem value="add-sections">
// //                 <Card className="rounded-2xl shadow-md border border-gray-100">
// //                   <AccordionTrigger className="px-6 py-4 hover:no-underline">
// //                     <CardTitle className="text-blue-700 flex items-center gap-2">
// //                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
// //                         <Plus className="w-4 h-4 text-blue-600" />
// //                       </div>
// //                       Add Sections
// //                     </CardTitle>
// //                   </AccordionTrigger>
// //                   <AccordionContent>
// //                     <CardContent className="px-6 pb-6">
// //                       <form onSubmit={handleSectionSubmit} className="space-y-4">
// //                         {/* ... (Section form fields) ... */}
// //                         <div className="grid grid-cols-2 gap-4">
// //                           {/* ... (section name, type, duration, marks) ... */}
// //                         </div>
// //                         <div className="flex items-center space-x-2">
// //                           {/* ... (randomize section) ... */}
// //                         </div>
// //                         <Button
// //                           type="submit"
// //                           className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
// //                         >
// //                           <Plus className="h-4 w-4 mr-2" />
// //                           Add Section
// //                         </Button>
// //                       </form>
// //                     </CardContent>
// //                   </AccordionContent>
// //                 </Card>
// //               </AccordionItem>
// //             </Accordion>

// //             {/* Sections List */}
// //             {/* ... (This JSX is fine) ... */}
// //             {sections.length > 0 && (
// //               <Card className="rounded-2xl shadow-md border border-gray-100">
// //                 <CardHeader>
// //                   <CardTitle className="text-gray-800">Test Sections ({sections.length})</CardTitle>
// //                 </CardHeader>
// //                 <CardContent className="space-y-4">
// //                   {sections.map((section, index) => (
// //                     // ... (section item JSX) ...
// //                     <div key={section.id} className="border rounded-lg p-4">
// //                       <div className="flex items-center justify-between">
// //                         <div className="flex items-center gap-4">
// //                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
// //                             {index + 1}
// //                           </div>
// //                           <div>
// //                             <h4 className="font-semibold">{section.name}</h4>
// //                             <div className="flex items-center gap-4 text-sm text-gray-500">
// //                               <span className="flex items-center gap-1">
// //                                 {section.type === 'mcq' ? <FileText className="h-3 w-3" /> : <Code className="h-3 w-3" />}
// //                                 {section.type.toUpperCase()}
// //                               </span>
// //                               <span className="flex items-center gap-1">
// //                                 <Clock className="h-3 w-3" />
// //                                 {section.duration} min
// //                               </span>
// //                               <span>{section.marksPerQuestion} marks each</span>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </CardContent>
// //               </Card>
// //             )}
// //           </div>

// //           {/* Right Section: Excel Upload & Templates */}
// //           {/* ... (This JSX is fine) ... */}
// //           <div className="space-y-6">
// //             <Card className="rounded-2xl shadow-md border border-gray-100">
// //               {/* ... (Excel Upload & Templates Card) ... */}
// //             </Card>

// //             {/* Save Test */}
// //             <Card className="rounded-2xl shadow-md border border-green-200">
// //               <CardContent className="p-6">
// //                 <div className="text-center space-y-4">
// //                   {/* ... (Save Test Card content) ... */}
// //                   <Button
// //                     onClick={handleSaveTest}
// //                     disabled={loading || !testForm.name.trim() || sections.length === 0}
// //                     className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8"
// //                   >
// //                     <Save className="h-4 w-4 mr-2" />
// //                     {loading ? 'Saving...' : 'Save Test'}
// //                   </Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>
// //     </AdminLayout>
// //   );
// // };

// // export default TestCreate;

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { useToast } from "@/hooks/use-toast";
// import {
//   ArrowLeft,
//   Plus,
//   Save,
//   Upload,
//   Download,
//   TestTube,
//   FileText,
//   Code,
//   Clock,
//   HelpCircle,
// } from "lucide-react";
// import AdminLayout from "@/components/AdminLayout";
// import { useNavigate, useParams } from "react-router-dom";
// // --- API IMPORTS ---
// import { getModuleById } from "@/api/moduleApi"; // Assumed import
// import { createTest } from "@/api/testApi"; // Assumed import

// interface TestSection {
//   id: number; // Temporary UI-only ID
//   name: string;
//   type: "mcq" | "coding";
//   duration: number;
//   marksPerQuestion: number;
//   instructions?: string;
//   questionCount: number;
//   randomizeQuestions: boolean;
// }

// // Interface for Test (data we send to create one)
// interface TestCreateData {
//   name: string;
//   description: string;
//   instructions: string;
//   duration: number;
//   randomizeQuestions: boolean;
//   type: "mcq" | "coding";
//   sections: TestSection[];
// }

// const TestCreate = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { moduleId } = useParams();
//   const [module, setModule] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const [testForm, setTestForm] = useState({
//     name: "",
//     description: "",
//     instructions: "", // Added instructions to form state
//     duration: 60,
//     randomizeQuestions: true,
//   });

//   const [sections, setSections] = useState<TestSection[]>([]);
//   const [sectionForm, setSectionForm] = useState({
//     name: "",
//     type: "mcq" as "mcq" | "coding",
//     duration: 30,
//     marksPerQuestion: 1,
//     instructions: "",
//     randomizeQuestions: true,
//   });

//   useEffect(() => {
//     if (moduleId) {
//       loadModule();
//     }
//   }, [moduleId]);

//   // --- API: Load Module Data ---
//   const loadModule = async () => {
//     try {
//       const data = await getModuleById(parseInt(moduleId!));
//       setModule(data);

//       if (data) {
//         setTestForm((prev) => ({
//           ...prev,
//           name: `${data.title} Assessment`,
//         }));
//       }
//     } catch (error) {
//       console.error("Error loading module:", error);
//       toast({
//         title: "Error",
//         description: "Module not found",
//         variant: "destructive",
//       });
//       // Optionally navigate back if module not found
//       // navigate(-1);
//     }
//   };

//   const fileInputRef = useRef<HTMLInputElement>(null); // Ref to clear file input

//   // --- Handler for File Selection in "Add Section" Form ---
//   const handleFormFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     setSectionForm((prev) => ({ ...prev, file }));
//   };

//   const handleSectionSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!sectionForm.name.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Section name is required",
//         variant: "destructive",
//       });
//       return;
//     }

//     const newSection: TestSection = {
//       id: Date.now(),
//       name: sectionForm.name,
//       type: sectionForm.type,
//       duration: sectionForm.duration,
//       marksPerQuestion: sectionForm.marksPerQuestion,
//       instructions: sectionForm.instructions,
//       questionCount: 0, // Default value
//       randomizeQuestions: sectionForm.randomizeQuestions,
//     };

//     setSections([...sections, newSection]);
//     setSectionForm({
//       name: "",
//       type: "mcq",
//       duration: 30,
//       marksPerQuestion: 1,
//       instructions: "",
//       randomizeQuestions: true,
//     });
//     if (fileInputRef.current) fileInputRef.current.value = "";

//     toast({ title: "✅ Section added successfully" });
//   };

//   // --- API: Save Test ---
//   const handleSaveTest = async () => {
//     if (!testForm.name.trim()) {
//       toast({
//         title: "Validation Error",
//         description: "Test name is required",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (sections.length === 0) {
//       toast({
//         title: "Validation Error",
//         description: "At least one section is required",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Auto-detect type if missing
//     const resolvedType = testForm.type || sections[0]?.type;

//     if (!resolvedType) {
//       toast({
//         title: "Validation Error",
//         description: "Test type is required",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const testData: TestCreateData = {
//         name: testForm.name,
//         description: testForm.description,
//         instructions: testForm.instructions,
//         duration: testForm.duration,
//         randomizeQuestions: testForm.randomizeQuestions,
//         type: resolvedType,
//         sections: sections,
//       };

//       // API Call to create the test
//       await createTest(parseInt(moduleId!), testData);

//       toast({ title: "✅ Test created successfully!" });

//       // Navigate back to module management
//       const courseId = module?.courseId;
//       if (courseId) {
//         navigate(`/admin/courses/${courseId}/modules`);
//       } else {
//         navigate(-1);
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save test",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadTemplate = (type: "mcq" | "coding") => {
//     const templates = {
//       mcq: `question_text,option_A,option_B,option_C,option_D,correct_option,marks,negative_marks,explanation,tags
// What is a loop in C?,A repeating condition,A static variable,A constant,A pointer,A,1,0,Used for repeating tasks,"loops, control flow"`,
//       coding: `problem_title,description,allowed_languages,sample_input,sample_output,hidden_testcases,points,time_limit_sec,memory_limit_mb,tags
// Sum of Numbers,Write a program to sum numbers,"C, C++, Python",5,15,10::55|20::210|5::15,10,2,256,"loops, math"`,
//     };

//     const blob = new Blob([templates[type]], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${type}_template.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (!module) {
//     return (
//       <AdminLayout>
//         <div className="p-6">
//           <div className="text-center py-12">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Module not found
//             </h2>
//             <p className="text-gray-500 mb-4">Could not load module data.</p>
//             <Button onClick={() => navigate(-1)} className="mt-4">
//               Go Back
//             </Button>
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
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               onClick={() => navigate(-1)}
//               className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Module
//             </Button>
//             <div>
//               <h1 className="text-3xl font-bold mb-1">Create Test</h1>
//               <p className="text-purple-100">
//                 Building assessment for: {module.title}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Two-Column Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Section: Basic Info & Sections */}
//           <div className="space-y-6">
//             {/* Basic Information */}
//             <Card className="rounded-2xl shadow-md border border-gray-100">
//               <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
//                 <CardTitle className="text-purple-700 flex items-center gap-2">
//                   <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
//                     <TestTube className="w-4 h-4 text-purple-600" />
//                   </div>
//                   Basic Info
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="testName"
//                       className="font-medium text-gray-700"
//                     >
//                       Test Name *
//                     </Label>
//                     <Input
//                       id="testName"
//                       value={testForm.name}
//                       onChange={(e) =>
//                         setTestForm({ ...testForm, name: e.target.value })
//                       }
//                       placeholder="e.g., Loops Assessment"
//                       required
//                       className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="duration"
//                       className="font-medium text-gray-700"
//                     >
//                       Duration (minutes)
//                     </Label>
//                     <Input
//                       id="duration"
//                       type="number"
//                       min="1"
//                       value={testForm.duration}
//                       onChange={(e) =>
//                         setTestForm({
//                           ...testForm,
//                           duration: parseInt(e.target.value) || 60,
//                         })
//                       }
//                       className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="description"
//                     className="font-medium text-gray-700"
//                   >
//                     Description
//                   </Label>
//                   <Textarea
//                     id="description"
//                     value={testForm.description}
//                     onChange={(e) =>
//                       setTestForm({ ...testForm, description: e.target.value })
//                     }
//                     placeholder="Purpose of the test"
//                     rows={3}
//                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                   />
//                 </div>

//                 {/* ADDED: Instructions Textarea */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="instructions"
//                     className="font-medium text-gray-700"
//                   >
//                     Instructions
//                   </Label>
//                   <Textarea
//                     id="instructions"
//                     value={testForm.instructions}
//                     onChange={(e) =>
//                       setTestForm({ ...testForm, instructions: e.target.value })
//                     }
//                     placeholder="Guidelines for students"
//                     rows={3}
//                     className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                   />
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="randomizeTest"
//                     checked={testForm.randomizeQuestions}
//                     onCheckedChange={(checked) =>
//                       setTestForm({ ...testForm, randomizeQuestions: checked })
//                     }
//                   />
//                   <Label
//                     htmlFor="randomizeTest"
//                     className="font-medium text-gray-700"
//                   >
//                     Randomize Questions
//                   </Label>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Add Sections */}
//             <Accordion type="single" collapsible defaultValue="add-sections">
//               <AccordionItem value="add-sections">
//                 <Card className="rounded-2xl shadow-md border border-gray-100">
//                   <AccordionTrigger className="px-6 py-4 hover:no-underline">
//                     <CardTitle className="text-blue-700 flex items-center gap-2">
//                       <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                         <Plus className="w-4 h-4 text-blue-600" />
//                       </div>
//                       Add Sections
//                     </CardTitle>
//                   </AccordionTrigger>
//                   <AccordionContent>
//                     <CardContent className="px-6 pb-6">
//                       <form
//                         onSubmit={handleSectionSubmit}
//                         className="space-y-4"
//                       >
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="sectionName"
//                               className="font-medium text-gray-700"
//                             >
//                               Section Name *
//                             </Label>
//                             <Input
//                               id="sectionName"
//                               value={sectionForm.name}
//                               onChange={(e) =>
//                                 setSectionForm({
//                                   ...sectionForm,
//                                   name: e.target.value,
//                                 })
//                               }
//                               placeholder="e.g., MCQ Section"
//                               required
//                               className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label className="font-medium text-gray-700">
//                               Section Type
//                             </Label>
//                             <Select
//                               value={sectionForm.type}
//                               onValueChange={(value: "mcq" | "coding") =>
//                                 setSectionForm({ ...sectionForm, type: value })
//                               }
//                             >
//                               <SelectTrigger className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="mcq">MCQ</SelectItem>
//                                 <SelectItem value="coding">Coding</SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="sectionDuration"
//                               className="font-medium text-gray-700"
//                             >
//                               Duration (minutes)
//                             </Label>
//                             <Input
//                               id="sectionDuration"
//                               type="number"
//                               min="1"
//                               value={sectionForm.duration}
//                               onChange={(e) =>
//                                 setSectionForm({
//                                   ...sectionForm,
//                                   duration: parseInt(e.target.value) || 30,
//                                 })
//                               }
//                               className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label
//                               htmlFor="marksPerQuestion"
//                               className="font-medium text-gray-700"
//                             >
//                               Marks per Question
//                             </Label>
//                             <Input
//                               id="marksPerQuestion"
//                               type="number"
//                               min="1"
//                               value={sectionForm.marksPerQuestion}
//                               onChange={(e) =>
//                                 setSectionForm({
//                                   ...sectionForm,
//                                   marksPerQuestion:
//                                     parseInt(e.target.value) || 1,
//                                 })
//                               }
//                               className="rounded-lg border border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center space-x-2">
//                           <Switch
//                             id="randomizeSection"
//                             checked={sectionForm.randomizeQuestions}
//                             onCheckedChange={(checked) =>
//                               setSectionForm({
//                                 ...sectionForm,
//                                 randomizeQuestions: checked,
//                               })
//                             }
//                           />
//                           <Label
//                             htmlFor="randomizeSection"
//                             className="font-medium text-gray-700"
//                           >
//                             Randomize Questions in Section
//                           </Label>
//                         </div>

//                         <Button
//                           type="submit"
//                           className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg"
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Add Section
//                         </Button>
//                       </form>
//                     </CardContent>
//                   </AccordionContent>
//                 </Card>
//               </AccordionItem>
//             </Accordion>

//             {/* Sections List */}
//             {sections.length > 0 && (
//               <Card className="rounded-2xl shadow-md border border-gray-100">
//                 <CardHeader>
//                   <CardTitle className="text-gray-800">
//                     Test Sections ({sections.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {sections.map((section, index) => (
//                     <div key={section.id} className="border rounded-lg p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
//                             {index + 1}
//                           </div>
//                           <div>
//                             <h4 className="font-semibold">{section.name}</h4>
//                             <div className="flex items-center gap-4 text-sm text-gray-500">
//                               <span className="flex items-center gap-1">
//                                 {section.type === "mcq" ? (
//                                   <FileText className="h-3 w-3" />
//                                 ) : (
//                                   <Code className="h-3 w-3" />
//                                 )}
//                                 {section.type.toUpperCase()}
//                               </span>
//                               <span className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 {section.duration} min
//                               </span>
//                               <span>{section.marksPerQuestion} marks each</span>
//                             </div>
//                             <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
//                               <Label className="flex items-center gap-2 text-gray-700">
//                                 <Upload className="w-4 h-4" /> Upload Questions
//                                 (Optional)
//                               </Label>
//                               <Input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept=".csv,.xlsx,.xls"
//                                 onChange={handleFormFileChange}
//                                 className="bg-white cursor-pointer"
//                               />
//                               <p className="text-xs text-gray-500">
//                                 Supported formats: .csv, .xlsx
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Section: Excel Upload & Templates */}
//           <div className="space-y-6">
//             <Card className="rounded-2xl shadow-md border border-gray-100">
//               <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
//                 <CardTitle className="text-green-700 flex items-center gap-2">
//                   <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                     <Upload className="w-4 h-4 text-green-600" />
//                   </div>
//                   Excel Upload & Templates
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6 space-y-6">
//                 <div className="text-center">
//                   <Upload className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">
//                     Upload Questions
//                   </h3>
//                   <p className="text-gray-500 mb-4">
//                     Upload questions for each section using Excel templates
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <Button
//                     variant="outline"
//                     onClick={() => downloadTemplate("mcq")}
//                     className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg h-12"
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Download MCQ Template
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => downloadTemplate("coding")}
//                     className="w-full bg-white border border-gray-300 hover:bg-gray-50 rounded-lg h-12"
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Download Coding Template
//                   </Button>
//                 </div>

//                 {/* Quick Guide */}
//                 <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
//                   <CardContent className="p-4">
//                     <div className="flex items-start gap-3">
//                       <div className="bg-blue-100 p-2 rounded-lg">
//                         <HelpCircle className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-blue-800 mb-2">
//                           Upload Steps:
//                         </p>
//                         <div className="space-y-1 text-sm text-blue-700">
//                           <div className="flex items-center gap-2">
//                             <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
//                             Download appropriate template
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="w-2 h-2 bg-green-400 rounded-full"></span>
//                             Fill in your questions
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
//                             Upload completed file
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
//                             Review and publish test
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </CardContent>
//             </Card>

//             {/* Save Test */}
//             <Card className="rounded-2xl shadow-md border border-green-200">
//               <CardContent className="p-6">
//                 <div className="text-center space-y-4">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//                     <Save className="w-8 h-8 text-green-600" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       Ready to Save?
//                     </h3>
//                     <p className="text-gray-500 text-sm">
//                       Test will be saved as draft. You can add questions and
//                       publish later.
//                     </p>
//                   </div>
//                   <Button
//                     onClick={handleSaveTest}
//                     disabled={
//                       loading || !testForm.name.trim() || sections.length === 0
//                     }
//                     className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-8"
//                   >
//                     <Save className="h-4 w-4 mr-2" />
//                     {loading ? "Saving..." : "Save Test"}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

// export default TestCreate;


import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Save,
  Upload,
  Download,
  TestTube,
  FileText,
  Code,
  Clock,
  HelpCircle,
  X,
  Paperclip,
  Trash2,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";

// --- API IMPORTS (Mocked for context) ---
import { getModuleById } from "@/api/moduleApi";
import { createTest } from "@/api/testApi";

// --- Interfaces ---

interface TestSection {
  id: number; // Temporary UI-only ID
  name: string;
  type: "mcq" | "coding";
  duration: number;
  marksPerQuestion: number;
  instructions?: string;
  questionCount: number;
  randomizeQuestions: boolean;
  file?: File | null; // Added File property
}

interface SectionFormState {
  name: string;
  type: "mcq" | "coding";
  duration: number;
  marksPerQuestion: number;
  instructions: string;
  randomizeQuestions: boolean;
  file: File | null;
}

const TestCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Test Basic Info State
  const [testForm, setTestForm] = useState({
    name: "",
    description: "",
    instructions: "",
    duration: 60,
    type: "mcq" as "mcq" | "coding" | "mixed", // Added Global Type
    randomizeQuestions: true,
  });

  // Section Creation State
  const [sections, setSections] = useState<TestSection[]>([]);
  const [sectionForm, setSectionForm] = useState<SectionFormState>({
    name: "",
    type: "mcq",
    duration: 30,
    marksPerQuestion: 1,
    instructions: "",
    randomizeQuestions: true,
    file: null,
  });

  useEffect(() => {
    if (moduleId) {
      loadModule();
    }
  }, [moduleId]);

  // --- API: Load Module Data ---
  const loadModule = async () => {
    try {
      const data = await getModuleById(parseInt(moduleId!));
      setModule(data);
      if (data) {
        setTestForm((prev) => ({
          ...prev,
          name: `${data.title} Assessment`,
        }));
      }
    } catch (error) {
      console.error("Error loading module:", error);
      toast({
        title: "Error",
        description: "Module not found",
        variant: "destructive",
      });
    }
  };

  // --- Handlers ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSectionForm((prev) => ({ ...prev, file }));
  };

  const removeFile = () => {
    setSectionForm((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveSection = (id: number) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.name.trim()) {
      toast({ title: "Error", description: "Section name is required", variant: "destructive" });
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
      randomizeQuestions: sectionForm.randomizeQuestions,
      file: sectionForm.file, // Attach the file
    };

    setSections([...sections, newSection]);
    
    // Reset Form
    setSectionForm({
      name: "",
      type: "mcq",
      duration: 30,
      marksPerQuestion: 1,
      instructions: "",
      randomizeQuestions: true,
      file: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";

    toast({ title: "✅ Section added successfully" });
  };

  // --- API: Save Test ---
  const handleSaveTest = async () => {
    if (!testForm.name.trim()) {
      toast({ title: "Error", description: "Test name is required", variant: "destructive" });
      return;
    }
    if (sections.length === 0) {
      toast({ title: "Error", description: "At least one section is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // IMPORTANT: Because we are uploading files, we usually need FormData.
      // Check your backend API requirement. If it accepts JSON with file streams, usage varies.
      // Below is the standard approach for sending Mixed Data (JSON + Files).
      
      const formData = new FormData();
      formData.append("name", testForm.name);
      formData.append("description", testForm.description);
      formData.append("instructions", testForm.instructions);
      formData.append("duration", testForm.duration.toString());
      formData.append("type", testForm.type);
      formData.append("randomizeQuestions", String(testForm.randomizeQuestions));
      
      // Append Sections Meta Data
      // Note: You might need to stringify the array of objects minus the file objects
      const sectionsMeta = sections.map(({ file, ...rest }) => rest); 
      formData.append("sections", JSON.stringify(sectionsMeta));

      // Append Files uniquely mapped to sections
      // The backend must match these files to the sections by index or ID
      sections.forEach((section, index) => {
        if (section.file) {
          // Example: sections[0].file
          formData.append(`files_section_${index}`, section.file);
        }
      });

      // CALL API
      // Assuming createTest accepts (moduleId, FormData)
      await createTest(parseInt(moduleId!), formData);

      toast({ title: "✅ Test created successfully!" });

      const courseId = module?.courseId;
      if (courseId) {
        navigate(`/admin/courses/${courseId}/modules`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save test. Please check connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (type: "mcq" | "coding") => {
    const templates = {
      mcq: `question_text,option_A,option_B,option_C,option_D,correct_option,marks,negative_marks,explanation,tags\nWhat is a loop?,Repeating logic,A variable,A class,None,A,1,0,Basic concept,"loops"`,
      coding: `problem_title,description,allowed_languages,sample_input,sample_output,hidden_testcases,points,time_limit_sec,memory_limit_mb,tags\nSum Two,Add a+b,"c,cpp,py",2 3,5,10 10::20|5 5::10,10,1,256,"math"`,
    };

    const blob = new Blob([templates[type]], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!module) return null; // Or a loading spinner

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 p-2 h-auto"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create Assessment</h1>
              <p className="text-purple-100 opacity-90">
                Module: {module.title}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- LEFT COLUMN: Test Details & Sections --- */}
          <div className="space-y-6">
            
            {/* 1. Basic Info */}
            <Card className="rounded-xl shadow-sm border-t-4 border-t-purple-600">
              <CardHeader className="bg-gray-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <TestTube className="w-5 h-5 text-purple-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Test Name <span className="text-red-500">*</span></Label>
                  <Input
                    value={testForm.name}
                    onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                    placeholder="e.g., Final Assessment"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label>Test Type</Label>
                    <Select
                      value={testForm.type}
                      onValueChange={(val: any) => setTestForm({...testForm, type: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">MCQ Only</SelectItem>
                        <SelectItem value="coding">Coding Only</SelectItem>
                        <SelectItem value="mixed">Mixed (MCQ + Coding)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (mins)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={testForm.duration}
                      onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={testForm.description}
                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea
                    value={testForm.instructions}
                    onChange={(e) => setTestForm({ ...testForm, instructions: e.target.value })}
                    placeholder="Rules for the students..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="randomizeTest"
                    checked={testForm.randomizeQuestions}
                    onCheckedChange={(c) => setTestForm({ ...testForm, randomizeQuestions: c })}
                  />
                  <Label htmlFor="randomizeTest">Randomize Questions Order</Label>
                </div>
              </CardContent>
            </Card>

            {/* 2. Add Sections */}
            <Accordion type="single" collapsible defaultValue="add-sections">
              <AccordionItem value="add-sections" className="border-none">
                <Card className="rounded-xl shadow-sm border-t-4 border-t-blue-600">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline bg-gray-50/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Plus className="w-5 h-5 text-blue-600" />
                      Add New Section
                    </CardTitle>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-2">
                      <form onSubmit={handleSectionSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Section Name *</Label>
                            <Input
                              value={sectionForm.name}
                              onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                              placeholder="e.g., Logical Reasoning"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={sectionForm.type}
                              onValueChange={(val: "mcq" | "coding") => setSectionForm({ ...sectionForm, type: val })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mcq">MCQ</SelectItem>
                                <SelectItem value="coding">Coding</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                            <Label>Section Duration (min)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={sectionForm.duration}
                              onChange={(e) => setSectionForm({ ...sectionForm, duration: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Marks per Question</Label>
                            <Input
                              type="number"
                              min="1"
                              value={sectionForm.marksPerQuestion}
                              onChange={(e) => setSectionForm({ ...sectionForm, marksPerQuestion: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>

                        {/* File Upload inside Creation Form */}
                        <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-dashed border-blue-200">
                          <Label className="flex items-center gap-2 text-blue-800">
                            <Upload className="w-4 h-4" /> 
                            Upload Questions (Optional)
                          </Label>
                          
                          {!sectionForm.file ? (
                            <div className="flex flex-col gap-1">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.xlsx"
                                    onChange={handleFileChange}
                                    className="bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <span className="text-xs text-gray-500 pl-1">.csv or .xlsx files</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-white p-2 rounded border border-blue-200">
                                <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-gray-700 truncate max-w-[200px]">{sectionForm.file.name}</span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                           <Switch
                            checked={sectionForm.randomizeQuestions}
                            onCheckedChange={(c) => setSectionForm({ ...sectionForm, randomizeQuestions: c })}
                          />
                          <Label>Randomize Questions in Section</Label>
                        </div>

                        <Button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                          <Plus className="h-4 w-4 mr-2" /> Add Section to Test
                        </Button>
                      </form>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* 3. List of Added Sections */}
            {sections.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 pl-1">Added Sections ({sections.length})</h3>
                {sections.map((section, index) => (
                  <Card key={section.id} className="overflow-hidden border-l-4 border-l-gray-400 hover:border-l-purple-500 transition-all">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{section.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                              {section.type === "mcq" ? <FileText size={12} /> : <Code size={12} />}
                              {section.type.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {section.duration}m
                            </span>
                            <span>{section.marksPerQuestion} pts/q</span>
                          </div>
                          {/* File Indicator */}
                          {section.file && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1 font-medium">
                                <Paperclip size={10} /> File attached: {section.file.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveSection(section.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Actions & Help --- */}
          <div className="space-y-6">
            {/* Downloads */}
            <Card className="rounded-xl shadow-sm border-t-4 border-t-green-600">
              <CardHeader className="bg-gray-50/50 pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Download className="w-5 h-5 text-green-600" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-gray-500 mb-2">Download templates to prepare your questions before uploading.</p>
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate("mcq")}
                  className="w-full justify-start h-12"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  Download MCQ Template (.csv)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate("coding")}
                  className="w-full justify-start h-12"
                >
                  <Code className="h-4 w-4 mr-2 text-purple-500" />
                  Download Coding Template (.csv)
                </Button>
              </CardContent>
            </Card>

            {/* Guide */}
            <Card className="rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Quick Guide</h4>
                    <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
                       <li>Fill out the <b>Basic Info</b> for the overall test.</li>
                       <li>Use <b>Add Section</b> to create parts (e.g., Aptitude, Coding).</li>
                       <li>You can upload a filled template <b>while creating a section</b>.</li>
                       <li>Click <b>Save Test</b> to finalize.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Action */}
            <Card className="rounded-xl shadow-md border-2 border-green-100">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Save className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Ready to Publish?</h3>
                        <p className="text-sm text-gray-500">Ensure you have added at least one section.</p>
                    </div>
                    <Button
                        onClick={handleSaveTest}
                        disabled={loading || sections.length === 0 || !testForm.name}
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 shadow-lg shadow-green-200"
                    >
                        {loading ? "Creating Test..." : "Create & Save Test"}
                    </Button>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestCreate;