import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const categories = [
  { id: "management_governance", name: "Management & Governance", weight: 10 },
  { id: "energy_carbon", name: "Energy & Carbon", weight: 20 },
  { id: "water_management", name: "Water Management", weight: 15 },
  { id: "materials_resources", name: "Materials & Resources", weight: 10 },
  { id: "biodiversity_ecosystem", name: "Biodiversity & Ecosystem", weight: 15 },
  { id: "transport_mobility", name: "Transport & Mobility", weight: 10 },
  { id: "social_impact", name: "Social Impact", weight: 10 },
  { id: "innovation_technology", name: "Innovation & Technology", weight: 10 }
];

export default function ProjectGraphs() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-red-600 mb-4">Project not found</p>
              <Link to={createPageUrl("Records")}>
                <Button variant="outline">Back to Records</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const calculateCategoryScore = (categoryData) => {
    if (!categoryData) return 0;
    const values = Object.values(categoryData);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    return (sum / values.length);
  };

  // Prepare data for charts
  const barChartData = categories.map(cat => ({
    name: cat.name,
    score: calculateCategoryScore(project[cat.id]),
    weight: cat.weight
  }));

  const radarChartData = categories.map(cat => ({
    category: cat.name.split(' ')[0],
    score: calculateCategoryScore(project[cat.id])
  }));

  const pieChartData = categories.map(cat => ({
    name: cat.name,
    value: cat.weight
  }));

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to={createPageUrl("Records")}>
            <Button variant="outline" className="mb-4 border-emerald-200 hover:bg-emerald-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Records
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessment Graphs</h1>
          <p className="text-gray-600 text-lg">Visual representation of {project.project_name}</p>
        </div>

        {/* Project Info Summary */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reference</p>
                <p className="text-2xl font-bold text-emerald-700">{project.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-4xl font-bold text-gray-900">{project.total_score?.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Category Scores */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl">Category Scores Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#10b981" name="Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <CardTitle className="text-xl">Performance Radar</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - Category Weights */}
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <CardTitle className="text-xl">Category Weights Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name.split(' ')[0]}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Scores Table */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl">Detailed Scores</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {categories.map((category, idx) => {
                const score = calculateCategoryScore(project[category.id]);
                return (
                  <div key={category.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-emerald-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS[idx] }}>
                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Weight: {category.weight}%</Badge>
                          <Badge className="bg-emerald-600 text-white">{score.toFixed(2)}%</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${score}%`, backgroundColor: COLORS[idx] }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}