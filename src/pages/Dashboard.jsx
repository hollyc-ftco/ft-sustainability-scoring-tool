import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Award, FileText, ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
    initialData: [],
  });

  // Calculate metrics
  const totalProjects = projects.length;
  
  const averageScore = totalProjects > 0 
    ? (projects.reduce((sum, p) => sum + (p.total_score || 0), 0) / totalProjects).toFixed(1)
    : 0;

  const outstandingCount = projects.filter(p => (p.total_score || 0) >= 85).length;
  const excellentCount = projects.filter(p => (p.total_score || 0) >= 70 && (p.total_score || 0) < 85).length;
  const goodCount = projects.filter(p => (p.total_score || 0) >= 55 && (p.total_score || 0) < 70).length;

  // Get recent projects (last 5)
  const recentProjects = projects.slice(0, 5);

  // Stage distribution
  const stageDistribution = {
    Tender: projects.filter(p => p.project_stage === 'Tender').length,
    Active: projects.filter(p => p.project_stage === 'Active').length,
    Complete: projects.filter(p => p.project_stage === 'Complete').length,
  };

  const getRatingBadge = (score) => {
    if (score >= 85) return <Badge className="bg-green-100 text-green-800 border border-green-200">Outstanding</Badge>;
    if (score >= 70) return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Excellent</Badge>;
    if (score >= 55) return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">Good</Badge>;
    if (score >= 40) return <Badge className="bg-orange-100 text-orange-800 border border-orange-200">Pass</Badge>;
    return <Badge className="bg-red-100 text-red-800 border border-red-200">Unclassified</Badge>;
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

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to FT Sustainability Scoring Tool</p>
        </div>

        {isLoading ? (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Loading dashboard data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{totalProjects}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalProjects === 0 ? 'No projects yet' : 'Assessed projects'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-teal-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {totalProjects > 0 ? `${averageScore}%` : '-'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Across all projects</p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{outstandingCount}</div>
                  <p className="text-xs text-gray-500 mt-1">85-100 points</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Top Performers</CardTitle>
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{excellentCount + outstandingCount}</div>
                  <p className="text-xs text-gray-500 mt-1">Excellent & Outstanding</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Distribution */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <CardTitle className="text-xl">Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Outstanding (85-100)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{outstandingCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">Excellent (70-85)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{excellentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">Good (55-70)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{goodCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">Pass (40-55)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {projects.filter(p => (p.total_score || 0) >= 40 && (p.total_score || 0) < 55).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-700">Unclassified (&lt;40)</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {projects.filter(p => (p.total_score || 0) < 40).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <CardTitle className="text-xl">Project Stages</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">Tender</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{stageDistribution.Tender}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Active</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{stageDistribution.Active}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm text-gray-700">Complete</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{stageDistribution.Complete}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            {totalProjects > 0 ? (
              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Recent Assessments</CardTitle>
                    <Link to={createPageUrl("Records")}>
                      <Button variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Reference</TableHead>
                          <TableHead className="font-semibold">Project Name</TableHead>
                          <TableHead className="font-semibold text-center">Stage</TableHead>
                          <TableHead className="font-semibold text-center">Score</TableHead>
                          <TableHead className="font-semibold text-center">Rating</TableHead>
                          <TableHead className="font-semibold text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentProjects.map((project) => (
                          <TableRow key={project.id} className="hover:bg-emerald-50/30 transition-colors">
                            <TableCell className="font-medium text-emerald-700">
                              {project.reference || "N/A"}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {project.project_name}
                            </TableCell>
                            <TableCell className="text-center">
                              {getStageBadge(project.project_stage)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-emerald-600 text-white">
                                {project.total_score?.toFixed(1) || "0.0"}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {getRatingBadge(project.total_score || 0)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Link to={`${createPageUrl("ProjectView")}?id=${project.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-200 hover:bg-blue-50 text-blue-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Get Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Use the <span className="font-semibold text-emerald-600">Scoring Tool</span> to view the sustainability framework and begin assessing your projects.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-emerald-800">
                      The FT Sustainability Scoring Tool evaluates projects across 8 key categories, ensuring comprehensive sustainability assessment.
                    </p>
                  </div>
                  <Link to={createPageUrl("ScoringTool")}>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Start Your First Assessment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}