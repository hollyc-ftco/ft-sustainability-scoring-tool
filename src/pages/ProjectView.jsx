import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

const getRating = (score) => {
  if (score >= 85) {
    return {
      name: "Outstanding",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      icon: Award,
    };
  } else if (score >= 70) {
    return {
      name: "Excellent",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      icon: Star,
    };
  } else if (score >= 55) {
    return {
      name: "Good",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      icon: CheckCircle,
    };
  } else if (score >= 40) {
    return {
      name: "Pass",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      icon: AlertCircle,
    };
  } else {
    return {
      name: "Unclassified",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      icon: XCircle,
    };
  }
};

const categories = [
  { id: "management_governance", name: "Management and Governance", weight: 10 },
  { id: "energy_carbon", name: "Energy and Carbon Management", weight: 20 },
  { id: "water_management", name: "Water Management", weight: 15 },
  { id: "materials_resources", name: "Materials and Resource Efficiency", weight: 10 },
  { id: "biodiversity_ecosystem", name: "Biodiversity and Ecosystem Services", weight: 15 },
  { id: "transport_mobility", name: "Transport and Mobility", weight: 10 },
  { id: "social_impact", name: "Social Impact and Community Well-being", weight: 10 },
  { id: "innovation_technology", name: "Innovation and Technology", weight: 10 }
];

export default function ProjectView() {
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
          <p className="text-gray-600">Loading project...</p>
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

  const rating = getRating(project.total_score || 0);
  const RatingIcon = rating.icon;

  const calculateCategoryScore = (categoryData) => {
    if (!categoryData) return 0;
    const values = Object.values(categoryData);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    return (sum / values.length).toFixed(2);
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Assessment</h1>
          <p className="text-gray-600 text-lg">Detailed view of project sustainability assessment</p>
        </div>

        {/* Project Information */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reference</p>
                <p className="font-semibold text-emerald-700 text-lg">{project.reference || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Project Number</p>
                <p className="font-semibold text-gray-900">{project.project_number || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Project Name</p>
                <p className="font-semibold text-gray-900">{project.project_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Project Owner</p>
                <p className="font-semibold text-gray-900">{project.project_owner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Project Stage</p>
                <Badge className={`${
                  project.project_stage === "Tender" ? "bg-blue-100 text-blue-800" :
                  project.project_stage === "Active" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {project.project_stage || "Not specified"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(project.created_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className={`${
                  project.status === "draft" ? "bg-gray-100 text-gray-800" :
                  project.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                  "bg-emerald-100 text-emerald-800"
                }`}>
                  {project.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Rating */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className={`${rating.bgColor} rounded-xl p-6 border-2`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${rating.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <RatingIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overall Rating</p>
                    <h3 className={`text-3xl font-bold ${rating.textColor}`}>{rating.name}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Score</p>
                  <p className="text-5xl font-bold text-gray-900">{project.total_score?.toFixed(2) || "0.00"}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Scores */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl">Category Scores</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryData = project[category.id];
                const categoryScore = calculateCategoryScore(categoryData);
                
                return (
                  <div key={category.id} className="border border-emerald-100 rounded-xl p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className="font-semibold text-gray-900">{category.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            Weight: {category.weight}%
                          </Badge>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-lg py-1 px-3">
                        {categoryScore}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${categoryScore}%` }}
                      />
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