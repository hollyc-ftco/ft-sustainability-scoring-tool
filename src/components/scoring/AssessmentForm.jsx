
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Calculator, Printer, Plus } from "lucide-react";
import CategoryAssessment from "./CategoryAssessment";
import AssessmentSummary from "./AssessmentSummary";

const assessmentCategories = [
  {
    id: "management_governance",
    name: "Management and Governance",
    weight: 10,
    subCategories: [
      { 
        id: "sdg_alignment",
        name: "Sustainable Development Goals (SDGs) Alignment",
        description: "Alignment with UN SDGs, especially in areas like climate action (SDG 13), sustainable cities (SDG 11), and responsible consumption (SDG 12).",
        weight: 20
      },
      {
        id: "environmental_systems",
        name: "Environmental Management Systems",
        description: "Demonstrating a commitment to sustainability through certified environmental management systems (e.g., ISO 14001).",
        weight: 30
      },
      {
        id: "stakeholder_engagement",
        name: "Stakeholder Engagement",
        description: "Involvement of local communities, indigenous populations, and affected stakeholders in decision-making.",
        weight: 30
      },
      {
        id: "policy_planning",
        name: "Policy and Planning",
        description: "Integration of sustainability goals into the project's governance, including policies for waste management, emissions reduction, and resource efficiency.",
        weight: 20
      }
    ]
  },
  {
    id: "energy_carbon",
    name: "Energy and Carbon Management",
    weight: 20,
    subCategories: [
      { id: "energy_reduction", name: "Energy Use Reduction", description: "Measures to reduce overall energy consumption", weight: 25 },
      { id: "carbon_emissions", name: "Carbon Emissions", description: "Tracking and reducing carbon emissions", weight: 20 },
      { id: "renewable_energy", name: "Renewable Energy Integration", description: "Integration of renewable energy sources", weight: 25 },
      { id: "carbon_offsetting", name: "Carbon Offsetting", description: "Carbon offset programs and initiatives", weight: 30 }
    ]
  },
  {
    id: "water_management",
    name: "Water Management",
    weight: 15,
    subCategories: [
      { id: "water_efficiency", name: "Water Efficiency", description: "Water conservation and efficiency measures", weight: 25 },
      { id: "flood_risk", name: "Flood Risk Management", description: "Flood prevention and mitigation strategies", weight: 20 },
      { id: "water_quality", name: "Water Quality", description: "Water quality monitoring and improvement", weight: 25 },
      { id: "sustainable_drainage", name: "Sustainable Drainage Systems (SuDS)", description: "Implementation of sustainable drainage solutions", weight: 30 }
    ]
  },
  {
    id: "materials_resources",
    name: "Materials and Resource Efficiency",
    weight: 10,
    subCategories: [
      { id: "material_selection", name: "Material Selection", description: "Sustainable material sourcing and selection", weight: 25 },
      { id: "circular_economy", name: "Circular Economy", description: "Circular economy principles and practices", weight: 25 },
      { id: "waste_management", name: "Waste Management", description: "Waste reduction and management strategies", weight: 10 },
      { id: "embodied_carbon", name: "Embodied Carbon", description: "Assessment and reduction of embodied carbon", weight: 40 }
    ]
  },
  {
    id: "biodiversity_ecosystem",
    name: "Biodiversity and Ecosystem Services",
    weight: 15,
    subCategories: [
      { id: "biodiversity_preservation", name: "Biodiversity Preservation", description: "Protection and enhancement of biodiversity", weight: 15 },
      { id: "ecological_connectivity", name: "Ecological Connectivity", description: "Maintaining ecological corridors and connectivity", weight: 45 },
      { id: "native_species", name: "Native Species Planting", description: "Use of native plant species", weight: 30 },
      { id: "sustainable_land", name: "Sustainable Land Use", description: "Sustainable land management practices", weight: 10 }
    ]
  },
  {
    id: "transport_mobility",
    name: "Transport and Mobility",
    weight: 10,
    subCategories: [
      { id: "transport_options", name: "Sustainable Transport Options", description: "Provision of sustainable transport alternatives", weight: 40 },
      { id: "mobility_all", name: "Mobility for All", description: "Accessible transportation for all users", weight: 50 },
      { id: "transport_carbon", name: "Transportation Carbon Impact", description: "Reducing carbon impact of transportation", weight: 10 }
    ]
  },
  {
    id: "social_impact",
    name: "Social Impact and Community Well-being",
    weight: 10,
    subCategories: [
      { id: "health_wellbeing", name: "Health and Wellbeing", description: "Promoting health and wellbeing of community", weight: 25 },
      { id: "community_engagement", name: "Community Engagement", description: "Active engagement with local communities", weight: 25 },
      { id: "cultural_heritage", name: "Cultural Heritage Preservation", description: "Protection of cultural heritage sites", weight: 25 },
      { id: "job_creation", name: "Job Creation and Social Equity", description: "Creating jobs and promoting social equity", weight: 25 }
    ]
  },
  {
    id: "innovation_technology",
    name: "Innovation and Technology",
    weight: 10,
    subCategories: [
      { id: "technology_integration", name: "Technology Integration", description: "Integration of innovative technologies", weight: 33.33 },
      { id: "green_infrastructure", name: "Green Infrastructure", description: "Implementation of green infrastructure", weight: 33.33 },
      { id: "construction_techniques", name: "Construction Techniques", description: "Innovative construction methods", weight: 33.33 }
    ]
  }
];

export default function AssessmentForm() {
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [scores, setScores] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const saveProjectMutation = useMutation({
    mutationFn: (projectData) => base44.entities.Project.create(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert("Project assessment saved successfully!");
      // Removed state reset from here as it's now handled by `handleCreateNew` for explicit user action
    }
  });

  const handleScoreChange = (categoryId, subCategoryId, value) => {
    setScores(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [subCategoryId]: parseFloat(value) || 0
      }
    }));
  };

  const calculateCategoryScore = (category) => {
    const categoryScores = scores[category.id] || {};
    let totalScore = 0;
    
    category.subCategories.forEach(sub => {
      const score = categoryScores[sub.id] || 0;
      const subCategoryScore = (score * sub.weight) / 100;
      totalScore += subCategoryScore;
    });
    
    return totalScore;
  };

  const calculateTotalScore = () => {
    let total = 0;
    assessmentCategories.forEach(category => {
      const categoryScore = calculateCategoryScore(category);
      total += (categoryScore * category.weight) / 100;
    });
    return total.toFixed(2);
  };

  const handleCalculate = () => {
    setShowSummary(true);
  };

  const handleSave = () => {
    if (!projectName || !projectOwner) {
      alert("Please enter project name and owner");
      return;
    }

    const projectData = {
      project_name: projectName,
      project_owner: projectOwner,
      status: "completed",
      total_score: parseFloat(calculateTotalScore()),
      management_governance: scores.management_governance || {},
      energy_carbon: scores.energy_carbon || {},
      water_management: scores.water_management || {},
      materials_resources: scores.materials_resources || {},
      biodiversity_ecosystem: scores.biodiversity_ecosystem || {},
      transport_mobility: scores.transport_mobility || {},
      social_impact: scores.social_impact || {},
      innovation_technology: scores.innovation_technology || {}
    };

    saveProjectMutation.mutate(projectData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateNew = () => {
    if (confirm("Are you sure you want to create a new assessment? All current data will be cleared.")) {
      setProjectName("");
      setProjectOwner("");
      setScores({});
      setShowSummary(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Project Information</CardTitle>
          <div className="flex gap-3">
            <Button
              onClick={handleCreateNew}
              variant="outline"
              className="border-emerald-200 hover:bg-emerald-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
            {showSummary && (
              <Button
                onClick={handlePrint}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Summary
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectOwner">Project Owner</Label>
              <Input
                id="projectOwner"
                placeholder="Enter project owner"
                value={projectOwner}
                onChange={(e) => setProjectOwner(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {assessmentCategories.map((category) => (
        <CategoryAssessment
          key={category.id}
          category={category}
          scores={scores[category.id] || {}}
          onScoreChange={(subCategoryId, value) => 
            handleScoreChange(category.id, subCategoryId, value)
          }
          categoryScore={calculateCategoryScore(category)}
        />
      ))}

      <div className="flex gap-4 justify-end sticky bottom-6 z-10">
        <Button
          onClick={handleCalculate}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="lg"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Score
        </Button>
        <Button
          onClick={handleSave}
          disabled={saveProjectMutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg"
          size="lg"
        >
          <Save className="w-5 h-5 mr-2" />
          {saveProjectMutation.isPending ? "Saving..." : "Save Assessment"}
        </Button>
      </div>

      {showSummary && (
        <AssessmentSummary
          categories={assessmentCategories}
          scores={scores}
          calculateCategoryScore={calculateCategoryScore}
          totalScore={calculateTotalScore()}
          projectName={projectName}
          projectOwner={projectOwner}
        />
      )}
    </div>
  );
}
