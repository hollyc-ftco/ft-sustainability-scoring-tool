import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, FileText, BarChart3, Pencil } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Records() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
    initialData: [],
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert("Project deleted successfully!");
    },
  });

  const handleDelete = (project) => {
    if (confirm(`Are you sure you want to delete "${project.project_name}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate(project.id);
    }
  };

  const getStageBadge = (stage) => {
    const stageColors = {
      Tender: "bg-blue-100 text-blue-800 border-blue-200",
      Active: "bg-green-100 text-green-800 border-green-200",
      Complete: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
      <Badge className={`${stageColors[stage] || "bg-gray-100 text-gray-800"} border`}>
        {stage || "N/A"}
      </Badge>
    );
  };

  const getRatingBadge = (score) => {
    if (score >= 85) return <Badge className="bg-green-100 text-green-800 border border-green-200">Outstanding</Badge>;
    if (score >= 70) return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Excellent</Badge>;
    if (score >= 55) return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Good</Badge>;
    if (score >= 40) return <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Pass</Badge>;
    return <Badge className="bg-red-100 text-red-800 border border-red-200">Unclassified</Badge>;
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Records</h1>
          <p className="text-gray-600 text-lg">View all saved project assessments</p>
        </div>

        {isLoading ? (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Loading records...</p>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Records Yet</h3>
              <p className="text-gray-600 mb-6">
                Start by creating and saving an assessment in the Scoring Tool
              </p>
              <Link to={createPageUrl("ScoringTool")}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Go to Scoring Tool
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                All Assessments ({projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Reference</TableHead>
                      <TableHead className="font-semibold">Project Name</TableHead>
                      <TableHead className="font-semibold">Project Owner</TableHead>
                      <TableHead className="font-semibold text-center">Stage</TableHead>
                      <TableHead className="font-semibold text-center">Total Score</TableHead>
                      <TableHead className="font-semibold text-center">Rating</TableHead>
                      <TableHead className="font-semibold text-center">Created Date</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-emerald-50/30 transition-colors">
                        <TableCell className="font-medium text-emerald-700">
                          {project.reference || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {project.project_name}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {project.project_owner}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStageBadge(project.project_stage)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-600 text-white">
                            {project.total_score?.toFixed(2) || "0.00"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {getRatingBadge(project.total_score || 0)}
                        </TableCell>
                        <TableCell className="text-center text-gray-600 text-sm">
                          {new Date(project.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Link to={`${createPageUrl("ProjectView")}?id=${project.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-200 hover:bg-blue-50 text-blue-700"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link to={`${createPageUrl("ProjectGraphs")}?id=${project.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-200 hover:bg-purple-50 text-purple-700"
                                title="View Graphs"
                              >
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link to={`${createPageUrl("EditProject")}?id=${project.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 hover:bg-red-50 text-red-700"
                              onClick={() => handleDelete(project)}
                              disabled={deleteProjectMutation.isPending}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}