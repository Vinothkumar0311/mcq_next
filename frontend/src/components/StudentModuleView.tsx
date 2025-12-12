import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Clock, Download, ExternalLink, FileText, 
  CheckCircle, PlayCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Topic {
  id: number;
  title: string;
  resourceLink?: string;
  documentPath?: string;
  order: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration: number;
  status: string;
  topics: Topic[];
}

interface StudentModuleViewProps {
  courseId: number;
}

const StudentModuleView = ({ courseId }: StudentModuleViewProps) => {
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/modules/course/${courseId}`);
      // Only show published modules to students
      const publishedModules = response.data.data.filter((module: Module) => module.status === 'published');
      setModules(publishedModules);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load course modules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDocument = async (moduleId: number, documentPath: string) => {
    try {
      const filename = documentPath.split('/').pop();
      const response = await axios.get(`http://localhost:5000${documentPath}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-purple-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No modules available</h3>
        <p className="text-sm text-muted-foreground">Check back later for course content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Course Modules</h1>
        <p className="text-purple-100">
          {modules.length} module{modules.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="grid gap-6">
        {modules.map((module, index) => (
          <Card key={module.id} className="rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleModuleExpansion(module.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">{module.title}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className="bg-green-100 text-green-700">
                        Published
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.duration} minutes
                      </span>
                      <span className="text-sm text-gray-500">
                        {module.topics?.length || 0} topics
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-purple-600 text-white hover:bg-purple-700 border-none"
                >
                  {expandedModule === module.id ? 'Collapse' : 'View Topics'}
                  <PlayCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>

            {expandedModule === module.id && (
              <CardContent className="pt-0">
                <div className="border-t pt-6">
                  {module.description && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                  )}

                  {module.topics && module.topics.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">Topics & Resources</h4>
                      <div className="space-y-4">
                        {module.topics
                          .sort((a, b) => a.order - b.order)
                          .map((topic, topicIndex) => (
                            <Card key={topic.id} className="border border-gray-200 bg-gray-50">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="text-xs">
                                        Topic {topicIndex + 1}
                                      </Badge>
                                      <h5 className="font-medium text-gray-800">{topic.title}</h5>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mt-3">
                                      {topic.resourceLink && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => window.open(topic.resourceLink, '_blank')}
                                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                        >
                                          <ExternalLink className="h-4 w-4 mr-1" />
                                          Resource Link
                                        </Button>
                                      )}
                                      
                                      {topic.documentPath && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDownloadDocument(module.id, topic.documentPath!)}
                                          className="text-green-600 border-green-300 hover:bg-green-50"
                                        >
                                          <Download className="h-4 w-4 mr-1" />
                                          Download Document
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 ml-4">
                                    {topic.resourceLink && (
                                      <div className="w-2 h-2 bg-blue-400 rounded-full" title="Has resource link"></div>
                                    )}
                                    {topic.documentPath && (
                                      <div className="w-2 h-2 bg-green-400 rounded-full" title="Has document"></div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {(!module.topics || module.topics.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No topics available for this module</p>
                    </div>
                  )}

                  <div className="flex justify-center mt-6 pt-4 border-t">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Start Module Assessment
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentModuleView;