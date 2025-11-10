import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Clock, CheckCircle, Lock, Play, Download, 
  ExternalLink, Target, Award, TrendingUp, Users, Calendar
} from "lucide-react";
import StudentLayout from "@/components/StudentLayout";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  name: string;
  description: string;
  tags: string[];
  image?: string;
  published: boolean;
  moduleCount: number;
  progress: number;
  completedModules: number;
  totalModules: number;
  totalDuration: number;
  enrolledAt?: string;
}

interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string;
  duration: number;
  published: boolean;
  status: 'locked' | 'available' | 'completed';
  score?: number;
  completedAt?: string;
}

const StudentCourses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');

  useEffect(() => {
    loadCoursesAndProgress();
  }, []);

  const handleEnrollCourse = (courseId: number) => {
    try {
      const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]');
      const studentId = 'current_student';
      
      if (!enrollments.find((e: any) => e.courseId === courseId && e.studentId === studentId)) {
        enrollments.push({
          id: Date.now(),
          studentId,
          courseId,
          enrolledAt: new Date().toISOString(),
          currentModuleIndex: 0,
          completedModules: []
        });
        localStorage.setItem('student_enrollments', JSON.stringify(enrollments));
        loadCoursesAndProgress();
        toast({ title: "Success", description: "Enrolled in course successfully" });
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const loadCoursesAndProgress = () => {
    try {
      const allCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      const publishedCourses = allCourses.filter((course: any) => course.published);
      
      const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]');
      const studentId = 'current_student';
      const studentEnrollments = enrollments.filter((e: any) => e.studentId === studentId);
      
      const enrolledCourseIds = studentEnrollments.map((e: any) => e.courseId);
      const enrolled = publishedCourses.filter((course: any) => enrolledCourseIds.includes(course.id));
      const available = publishedCourses.filter((course: any) => !enrolledCourseIds.includes(course.id));
      
      const enrolledWithProgress = enrolled.map((course: any) => {
        const enrollment = studentEnrollments.find((e: any) => e.courseId === course.id);
        const modules = JSON.parse(localStorage.getItem('modules') || '[]')
          .filter((m: any) => m.courseId === course.id && m.published);
        
        return {
          ...course,
          progress: modules.length > 0 ? (enrollment.completedModules.length / modules.length) * 100 : 0,
          completedModules: enrollment.completedModules.length,
          totalModules: modules.length,
          enrolledAt: enrollment.enrolledAt
        };
      });
      
      setAvailableCourses(available);
      setEnrolledCourses(enrolledWithProgress);
      
      if (enrolledWithProgress.length > 0 && !selectedCourse) {
        setSelectedCourse(enrolledWithProgress[0]);
        loadModulesForCourse(enrolledWithProgress[0].id);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModulesForCourse = (courseId: number) => {
    try {
      const allModules = JSON.parse(localStorage.getItem('modules') || '[]');
      const courseModules = allModules.filter((m: any) => m.courseId === courseId && m.published);
      
      const enrollments = JSON.parse(localStorage.getItem('student_enrollments') || '[]');
      const studentId = 'current_student';
      const enrollment = enrollments.find((e: any) => e.courseId === courseId && e.studentId === studentId);
      
      const modulesWithStatus = courseModules.map((module: any, index: number) => {
        let status: 'locked' | 'available' | 'completed' = 'locked';
        
        if (enrollment?.completedModules.includes(module.id)) {
          status = 'completed';
        } else if (index === 0 || enrollment?.completedModules.includes(courseModules[index - 1]?.id)) {
          status = 'available';
        }
        
        return {
          ...module,
          status,
          score: 85 // Mock score
        };
      });
      
      setModules(modulesWithStatus);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const handleStartModule = (moduleId: number) => {
    // Check if slot is required or direct test access
    const hasActiveSlot = true; // Would check actual slot booking
    if (hasActiveSlot) {
      navigate(`/student/tests/${moduleId}`);
    } else {
      toast({
        title: "Slot Required",
        description: "Please book a slot first to take this test",
        variant: "destructive",
      });
      navigate('/student/slot-booking');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'available':
        return <Play className="h-5 w-5 text-blue-600" />;
      case 'locked':
      default:
        return <Lock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'available':
        return 'border-blue-200 bg-blue-50';
      case 'locked':
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                🎓 My Courses
              </h1>
              <p className="text-purple-100 mt-2">
                Continue your learning journey
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              <p className="text-purple-100">Enrolled Courses</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="enrolled" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Enrolled ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="enroll" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Available ({availableCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enroll" className="space-y-6">
            {availableCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available Yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  New courses are being prepared for you. Check back soon or contact your administrator for more information.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Courses will appear here once they are published by administrators
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{course.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {course.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {course.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <Button 
                          onClick={() => handleEnrollCourse(course.id)}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6">
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Learning Journey</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't enrolled in any courses yet. Browse available courses and start learning today!
                </p>
                <Button 
                  onClick={() => setActiveTab('enroll')}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Browse Available Courses
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="border-2 hover:border-purple-200 transition-colors">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-purple-700">
                            {course.name}
                          </CardTitle>
                          <p className="text-muted-foreground mt-1">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <Progress value={course.progress} className="w-24 h-2" />
                              <span className="text-sm font-medium">{Math.round(course.progress)}%</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {course.completedModules}/{course.totalModules} modules
                            </span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setSelectedCourse(course);
                            loadModulesForCourse(course.id);
                          }}
                          variant="outline"
                        >
                          View Modules
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {selectedCourse?.id === course.id && (
                      <CardContent className="border-t">
                        <div className="pt-6">
                          <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Course Modules
                          </h4>
                          <Accordion type="single" collapsible>
                            {modules.map((module, index) => (
                              <AccordionItem key={module.id} value={module.id.toString()}>
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex items-center gap-4 flex-1 text-left">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{module.title}</h5>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getStatusIcon(module.status)}
                                        <span className="text-sm text-muted-foreground capitalize">
                                          {module.status === 'available' ? 'Ready' : module.status}
                                        </span>
                                        <span className="text-sm text-muted-foreground">•</span>
                                        <span className="text-sm text-muted-foreground">
                                          {module.duration} min
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="pl-12 space-y-4">
                                    <p className="text-muted-foreground">{module.description}</p>
                                    
                                    <div className="flex items-center gap-4">
                                      {module.status === 'available' && (
                                        <>
                                          <Button 
                                            onClick={() => navigate('/student/slot-booking')}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                          >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Book Slot
                                          </Button>
                                          <Button 
                                            variant="outline"
                                            onClick={() => handleStartModule(module.id)}
                                          >
                                            <Play className="h-4 w-4 mr-2" />
                                            Start Test
                                          </Button>
                                        </>
                                      )}
                                      {module.status === 'completed' && (
                                        <Badge variant="default" className="bg-green-600">
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Completed - {module.score}%
                                        </Badge>
                                      )}
                                      {module.status === 'locked' && (
                                        <Badge variant="secondary">
                                          <Lock className="h-4 w-4 mr-1" />
                                          Complete previous module to unlock
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentCourses;