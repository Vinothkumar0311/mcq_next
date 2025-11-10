import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Users, TestTube, Calendar, TrendingUp, 
  Plus, Eye, Clock, Award 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

interface DashboardStats {
  totalCourses: number;
  totalModules: number;
  publishedTests: number;
  activeSlots: number;
  totalStudents: number;
  completedTests: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalModules: 0,
    publishedTests: 0,
    activeSlots: 0,
    totalStudents: 0,
    completedTests: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = () => {
    try {
      // Load from localStorage
      const courses = JSON.parse(localStorage.getItem('courses') || '[]');
      const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const slots = JSON.parse(localStorage.getItem('slots') || '[]');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const publishedCourses = courses.filter((c: any) => c.published);
      const publishedModules = modules.filter((m: any) => m.published);
      const activeSlots = slots.filter((s: any) => 
        new Date(s.date) >= new Date() && s.allowBooking === 'Yes'
      );

      setStats({
        totalCourses: courses.length,
        totalModules: modules.length,
        publishedTests: publishedModules.length,
        activeSlots: activeSlots.length,
        totalStudents: users.length,
        completedTests: 0 // Would come from test results
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const quickActions = [
    {
      title: "Create Course",
      description: "Start building a new course",
      icon: Plus,
      action: () => navigate('/admin/courses/create'),
      color: "bg-blue-500"
    },
    {
      title: "View Courses",
      description: "Manage existing courses",
      icon: Eye,
      action: () => navigate('/admin/courses'),
      color: "bg-green-500"
    },
    {
      title: "Create Slot",
      description: "Schedule assessment slots",
      icon: Calendar,
      action: () => navigate('/admin/slot-booking'),
      color: "bg-purple-500"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your assessment platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalCourses}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 rounded-full p-3">
                  <TestTube className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{stats.totalModules}</p>
                  <p className="text-sm text-muted-foreground">Total Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{stats.publishedTests}</p>
                  <p className="text-sm text-muted-foreground">Published Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{stats.activeSlots}</p>
                  <p className="text-sm text-muted-foreground">Active Slots</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 rounded-full p-3">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-indigo-600">{stats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 rounded-full p-3">
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-teal-600">{stats.completedTests}</p>
                  <p className="text-sm text-muted-foreground">Completed Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                  onClick={action.action}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${action.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 rounded-full p-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Course Management System Ready</p>
                  <p className="text-sm text-muted-foreground">
                    Platform is ready for course creation and management
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">Just now</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="bg-green-100 rounded-full p-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Slot Booking System Active</p>
                  <p className="text-sm text-muted-foreground">
                    Students can now book assessment slots
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">2 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;