import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Minus, BarChart3, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

// Subcategory details for each category
const subcategoryDetails = {
  management_governance: [
    { id: "sdg_alignment", name: "SDGs Alignment" },
    { id: "environmental_systems", name: "Environmental Systems" },
    { id: "stakeholder_engagement", name: "Stakeholder Engagement" },
    { id: "policy_planning", name: "Policy and Planning" }
  ],
  energy_carbon: [
    { id: "energy_reduction", name: "Energy Reduction" },
    { id: "carbon_emissions", name: "Carbon Emissions" },
    { id: "renewable_energy", name: "Renewable Energy" },
    { id: "carbon_offsetting", name: "Carbon Offsetting" }
  ],
  water_management: [
    { id: "water_efficiency", name: "Water Efficiency" },
    { id: "flood_risk", name: "Flood Risk" },
    { id: "water_quality", name: "Water Quality" },
    { id: "sustainable_drainage", name: "Sustainable Drainage" }
  ],
  materials_resources: [
    { id: "material_selection", name: "Material Selection" },
    { id: "circular_economy", name: "Circular Economy" },
    { id: "waste_management", name: "Waste Management" },
    { id: "embodied_carbon", name: "Embodied Carbon" }
  ],
  biodiversity_ecosystem: [
    { id: "biodiversity_preservation", name: "Biodiversity Preservation" },
    { id: "ecological_connectivity", name: "Ecological Connectivity" },
    { id: "native_species", name: "Native Species" },
    { id: "sustainable_land", name: "Sustainable Land" }
  ],
  transport_mobility: [
    { id: "transport_options", name: "Transport Options" },
    { id: "mobility_all", name: "Mobility for All" },
    { id: "transport_carbon", name: "Transport Carbon" }
  ],
  social_impact: [
    { id: "health_wellbeing", name: "Health & Wellbeing" },
    { id: "community_engagement", name: "Community Engagement" },
    { id: "cultural_heritage", name: "Cultural Heritage" },
    { id: "job_creation", name: "Job Creation" }
  ],
  innovation_technology: [
    { id: "technology_integration", name: "Technology Integration" },
    { id: "green_infrastructure", name: "Green Infrastructure" },
    { id: "construction_techniques", name: "Construction Techniques" }
  ]
};

export default function Reports() {
  const [selectedProjectNumber, setSelectedProjectNumber] = useState("");
  const [showDetailedItems, setShowDetailedItems] = useState(false);

  const { data: allProjects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  // Get unique project numbers
  const projectNumbers = [...new Set(allProjects.map(p => p.project_number).filter(Boolean))];

  // Filter assessments by selected project number
  const projectAssessments = selectedProjectNumber 
    ? allProjects.filter(p => p.project_number === selectedProjectNumber).sort((a, b) => {
        const stageOrder = { 'Tender': 1, 'Active': 2, 'Complete': 3 };
        return stageOrder[a.project_stage] - stageOrder[b.project_stage];
      })
    : [];

  const calculateCategoryScore = (categoryData) => {
    if (!categoryData) return 0;
    const values = Object.values(categoryData);
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    return parseFloat((sum / values.length).toFixed(1));
  };

  const getSubcategoryScore = (assessment, categoryId, subcategoryId) => {
    if (!assessment[categoryId]) return 0;
    return assessment[categoryId][subcategoryId] || 0;
  };

  // Prepare comparison data
  const comparisonData = categories.map(cat => {
    const dataPoint = { category: cat.name };
    projectAssessments.forEach(assessment => {
      dataPoint[assessment.project_stage] = calculateCategoryScore(assessment[cat.id]);
    });
    return dataPoint;
  });

  const getStageBadge = (stage) => {
    const stageColors = {
      Tender: "bg-blue-100 text-blue-800 border-blue-200",
      Active: "bg-green-100 text-green-800 border-green-200",
      Complete: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return (
      <Badge className={`${stageColors[stage] || "bg-gray-100 text-gray-800"} border`}>
        {stage}
      </Badge>
    );
  };

  const getChangeIndicator = (current, previous) => {
    if (!previous || current === previous) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
    if (current > previous) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-semibold">+{(current - previous).toFixed(1)}%</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="w-4 h-4" />
        <span className="text-xs font-semibold">{(current - previous).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Comparison Reports</h1>
          <p className="text-gray-600 text-lg">Compare assessments across different project stages</p>
        </div>

        {/* Project Selection */}
        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Select Project to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="projectNumber">Project Number</Label>
              <Select value={selectedProjectNumber} onValueChange={setSelectedProjectNumber}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select a project number" />
                </SelectTrigger>
                <SelectContent>
                  {projectNumbers.map((projectNum) => (
                    <SelectItem key={projectNum} value={projectNum}>
                      {projectNum}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Loading projects...</p>
            </CardContent>
          </Card>
        ) : !selectedProjectNumber ? (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Project</h3>
              <p className="text-gray-600">
                Choose a project number above to view and compare all its assessments
              </p>
            </CardContent>
          </Card>
        ) : projectAssessments.length === 0 ? (
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No assessments found for this project number</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Project Info */}
            <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <CardTitle className="text-2xl">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Project Number</p>
                    <p className="font-semibold text-gray-900 text-lg">{selectedProjectNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Project Name</p>
                    <p className="font-semibold text-gray-900">{projectAssessments[0]?.project_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Assessments</p>
                    <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
                      {projectAssessments.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {projectAssessments.map((assessment, index) => {
                const previousAssessment = index > 0 ? projectAssessments[index - 1] : null;
                const scoreDiff = previousAssessment 
                  ? assessment.total_score - previousAssessment.total_score 
                  : null;

                return (
                  <Card key={assessment.id} className="border-emerald-100 bg-white/60 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Stage</p>
                          {getStageBadge(assessment.project_stage)}
                        </div>
                        <Link to={`${createPageUrl("ProjectView")}?id=${assessment.id}`}>
                          <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600 mb-2">Total Score</p>
                        <p className="text-4xl font-bold text-gray-900">
                          {assessment.total_score?.toFixed(1)}%
                        </p>
                        {scoreDiff !== null && (
                          <div className="mt-2 flex items-center justify-center gap-2">
                            {getChangeIndicator(assessment.total_score, previousAssessment?.total_score)}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Reference:</span>
                          <span className="font-medium text-emerald-700">{assessment.reference}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{new Date(assessment.created_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Category Comparison Chart */}
            <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <CardTitle className="text-2xl">Category Score Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={150} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    {projectAssessments.map((assessment, index) => {
                      const colors = ['#3b82f6', '#10b981', '#6b7280'];
                      return (
                        <Bar 
                          key={assessment.id}
                          dataKey={assessment.project_stage} 
                          fill={colors[index % colors.length]} 
                          name={`${assessment.project_stage} (${assessment.total_score?.toFixed(1)}%)`}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Trend Line Chart */}
            {projectAssessments.length > 1 && (
              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <CardTitle className="text-2xl">Score Progression</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projectAssessments.map(a => ({
                      stage: a.project_stage,
                      score: a.total_score,
                      date: new Date(a.created_date).toLocaleDateString()
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Total Score (%)"
                        dot={{ fill: '#10b981', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Category Comparison Table */}
            <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Category Comparison</CardTitle>
                  <Button
                    onClick={() => setShowDetailedItems(!showDetailedItems)}
                    variant="outline"
                    className="border-emerald-200 hover:bg-emerald-50"
                  >
                    {showDetailedItems ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Subcategories
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Show Subcategories
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-emerald-200">
                        <th className="text-left p-3 font-semibold text-gray-900">Category</th>
                        <th className="text-center p-3 font-semibold text-gray-900">Weight</th>
                        {projectAssessments.map(assessment => (
                          <th key={assessment.id} className="text-center p-3">
                            <div className="flex flex-col items-center gap-2">
                              {getStageBadge(assessment.project_stage)}
                              <span className="text-xs text-gray-500">
                                {new Date(assessment.created_date).toLocaleDateString()}
                              </span>
                            </div>
                          </th>
                        ))}
                        {projectAssessments.length > 1 && (
                          <th className="text-center p-3 font-semibold text-gray-900">Change</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, catIndex) => {
                        const scores = projectAssessments.map(a => calculateCategoryScore(a[category.id]));
                        const firstScore = scores[0];
                        const lastScore = scores[scores.length - 1];
                        const subcategories = subcategoryDetails[category.id] || [];
                        
                        return (
                          <React.Fragment key={category.id}>
                            <tr className={`border-b border-emerald-100 ${catIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                              <td className="p-3 font-medium text-gray-900">{category.name}</td>
                              <td className="p-3 text-center">
                                <Badge variant="outline" className="text-xs">
                                  {category.weight}%
                                </Badge>
                              </td>
                              {scores.map((score, index) => (
                                <td key={index} className="p-3 text-center">
                                  <Badge className={`${score >= 70 ? 'bg-green-600' : score >= 50 ? 'bg-yellow-600' : 'bg-orange-600'} text-white`}>
                                    {score.toFixed(1)}%
                                  </Badge>
                                </td>
                              ))}
                              {projectAssessments.length > 1 && (
                                <td className="p-3 text-center">
                                  {getChangeIndicator(lastScore, firstScore)}
                                </td>
                              )}
                            </tr>
                            
                            {/* Subcategories - shown when expanded */}
                            {showDetailedItems && subcategories.map((subcategory, subIndex) => {
                              const subScores = projectAssessments.map(a => getSubcategoryScore(a, category.id, subcategory.id));
                              const firstSubScore = subScores[0];
                              const lastSubScore = subScores[subScores.length - 1];
                              
                              return (
                                <tr key={subcategory.id} className={`border-b border-gray-100 ${catIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                  <td className="p-3 pl-8 text-sm text-gray-700">
                                    <span className="text-gray-400 mr-2">└─</span>
                                    {subcategory.name}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className="text-xs text-gray-400">-</span>
                                  </td>
                                  {subScores.map((subScore, index) => (
                                    <td key={index} className="p-3 text-center">
                                      <Badge 
                                        variant="outline"
                                        className={`text-xs ${subScore >= 70 ? 'border-green-400 text-green-700' : subScore >= 50 ? 'border-yellow-400 text-yellow-700' : 'border-orange-400 text-orange-700'}`}
                                      >
                                        {subScore.toFixed(1)}%
                                      </Badge>
                                    </td>
                                  ))}
                                  {projectAssessments.length > 1 && (
                                    <td className="p-3 text-center text-xs">
                                      {getChangeIndicator(lastSubScore, firstSubScore)}
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                      <tr className="bg-emerald-50 font-bold border-t-2 border-emerald-300">
                        <td className="p-3 text-gray-900">TOTAL SCORE</td>
                        <td className="p-3 text-center">-</td>
                        {projectAssessments.map((assessment) => (
                          <td key={assessment.id} className="p-3 text-center">
                            <Badge className="bg-emerald-600 text-white text-lg px-3 py-1">
                              {assessment.total_score?.toFixed(1)}%
                            </Badge>
                          </td>
                        ))}
                        {projectAssessments.length > 1 && (
                          <td className="p-3 text-center">
                            {getChangeIndicator(
                              projectAssessments[projectAssessments.length - 1].total_score,
                              projectAssessments[0].total_score
                            )}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Comments Comparison */}
            {projectAssessments.some(a => a.category_comments && Object.values(a.category_comments).some(c => c)) && (
              <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mt-6">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                  <CardTitle className="text-2xl">Category Comments Comparison</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {categories.map(category => {
                      const hasComments = projectAssessments.some(
                        a => a.category_comments && a.category_comments[category.id]
                      );
                      
                      if (!hasComments) return null;

                      return (
                        <div key={category.id} className="border border-emerald-100 rounded-lg p-4 bg-white">
                          <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
                          <div className="space-y-3">
                            {projectAssessments.map(assessment => {
                              const comment = assessment.category_comments?.[category.id];
                              if (!comment) return null;
                              
                              return (
                                <div key={assessment.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getStageBadge(assessment.project_stage)}
                                    <span className="text-xs text-gray-500">
                                      {new Date(assessment.created_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-blue-900">{comment}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}