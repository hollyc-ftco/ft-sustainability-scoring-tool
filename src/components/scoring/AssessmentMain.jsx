import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FileText, Award, Star, CheckCircle, AlertCircle, XCircle, Plus } from "lucide-react";

const getRatingBadge = (score) => {
  if (score >= 85) return { name: "Outstanding", color: "bg-green-100 text-green-800 border-green-200", icon: Award };
  if (score >= 70) return { name: "Excellent", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Star };
  if (score >= 55) return { name: "Good", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: CheckCircle };
  if (score >= 40) return { name: "Pass", color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertCircle };
  return { name: "Unclassified", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle };
};

export default function AssessmentMain() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Project Assessments</CardTitle>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No projects yet</p>
              <p className="text-gray-400 text-sm">Create your first sustainability assessment using the category tabs above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Project Name</TableHead>
                    <TableHead>Project Owner</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => {
                    const rating = getRatingBadge(project.total_score || 0);
                    const RatingIcon = rating.icon;
                    
                    return (
                      <TableRow key={project.id} className="hover:bg-emerald-50/30">
                        <TableCell className="font-medium">{project.project_name}</TableCell>
                        <TableCell>{project.project_owner}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                            {project.total_score?.toFixed(2) || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${rating.color} border`}>
                            <RatingIcon className="w-3 h-3 mr-1" />
                            {rating.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            project.status === 'completed' ? 'border-green-200 text-green-700' :
                            project.status === 'in_progress' ? 'border-blue-200 text-blue-700' :
                            'border-gray-200 text-gray-700'
                          }>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(project.created_date), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {projects.length > 0 
                    ? (projects.reduce((sum, p) => sum + (p.total_score || 0), 0) / projects.length).toFixed(1)
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Management & Governance</span>
                <span className="font-semibold">10%</span>
              </div>
              <div className="flex justify-between">
                <span>Energy & Carbon</span>
                <span className="font-semibold">20%</span>
              </div>
              <div className="flex justify-between">
                <span>Water Management</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between">
                <span>Materials & Resources</span>
                <span className="font-semibold">10%</span>
              </div>
              <div className="flex justify-between">
                <span>Biodiversity</span>
                <span className="font-semibold">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Outstanding", count: projects.filter(p => p.total_score >= 85).length, color: "text-green-700" },
                { name: "Excellent", count: projects.filter(p => p.total_score >= 70 && p.total_score < 85).length, color: "text-blue-700" },
                { name: "Good", count: projects.filter(p => p.total_score >= 55 && p.total_score < 70).length, color: "text-yellow-700" },
                { name: "Pass", count: projects.filter(p => p.total_score >= 40 && p.total_score < 55).length, color: "text-orange-700" },
                { name: "Unclassified", count: projects.filter(p => p.total_score < 40).length, color: "text-red-700" }
              ].map((rating) => (
                <div key={rating.name} className="flex items-center justify-between">
                  <span className="text-sm">{rating.name}</span>
                  <span className={`font-bold ${rating.color}`}>{rating.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}