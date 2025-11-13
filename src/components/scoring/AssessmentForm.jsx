import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Save, Calculator, Printer, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function AssessmentForm({ managementGovernanceData, energyCarbonData, waterManagementData, materialsResourceData, biodiversityEcosystemData, transportMobilityData, socialImpactData, innovationTechnologyData }) {
  const queryClient = useQueryClient();
  const [projectNumber, setProjectNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [createdByName, setCreatedByName] = useState("");
  const [projectStage, setProjectStage] = useState("Tender");
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Fetch all projects to check for existing assessments
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  // Generate reference number
  const generateReference = (stage) => {
    if (!projectNumber) return "";
    
    const stagePrefix = stage === "Active" ? "A" : stage === "Tender" ? "T" : "C";
    
    // Count existing assessments for this project number and stage
    const existingAssessments = allProjects.filter(
      p => p.project_number === projectNumber && p.project_stage === stage
    );
    
    const nextNumber = existingAssessments.length + 1;
    const formattedNumber = String(nextNumber).padStart(3, '0');
    
    return `${projectNumber}_${stagePrefix}_${formattedNumber}`;
  };

  // Check if Active stage is allowed
  const canSelectActive = () => {
    if (!projectNumber) return false;
    const tenderAssessment = allProjects.find(
      p => p.project_number === projectNumber && p.project_stage === "Tender"
    );
    return !!tenderAssessment;
  };

  // Check if Tender already exists for this project number
  const tenderExists = () => {
    if (!projectNumber) return false;
    return allProjects.some(
      p => p.project_number === projectNumber && p.project_stage === "Tender"
    );
  };

  // Handle project stage change with validation
  const handleProjectStageChange = (value) => {
    setValidationError("");
    
    if (value === "Active" && !canSelectActive()) {
      setValidationError("Active stage is only allowed if there is an existing Tender assessment for this project number.");
      return;
    }
    
    if (value === "Tender" && tenderExists()) {
      setValidationError("Only one Tender assessment is allowed per project number.");
      return;
    }
    
    setProjectStage(value);
  };

  // Auto-populate scores from Management and Governance tab
  useEffect(() => {
    if (managementGovernanceData && managementGovernanceData.scores) {
      setScores(prev => ({
        ...prev,
        management_governance: {
          sdg_alignment: managementGovernanceData.scores.sdg_alignment || 0,
          environmental_systems: managementGovernanceData.scores.environmental_systems || 0,
          stakeholder_engagement: managementGovernanceData.scores.stakeholder_engagement || 0,
          policy_planning: managementGovernanceData.scores.policy_planning || 0
        }
      }));
    }
  }, [managementGovernanceData]);

  // Auto-populate scores from Energy & Carbon Management tab
  useEffect(() => {
    if (energyCarbonData && energyCarbonData.scores) {
      setScores(prev => ({
        ...prev,
        energy_carbon: {
          energy_reduction: energyCarbonData.scores.energy_reduction || 0,
          carbon_emissions: energyCarbonData.scores.carbon_emissions || 0,
          renewable_energy: energyCarbonData.scores.renewable_energy || 0,
          carbon_offsetting: energyCarbonData.scores.carbon_offsetting || 0
        }
      }));
    }
  }, [energyCarbonData]);

  // Auto-populate scores from Water Management tab
  useEffect(() => {
    if (waterManagementData && waterManagementData.scores) {
      setScores(prev => ({
        ...prev,
        water_management: {
          water_efficiency: waterManagementData.scores.water_efficiency || 0,
          flood_risk: waterManagementData.scores.flood_risk || 0,
          water_quality: waterManagementData.scores.water_quality || 0,
          sustainable_drainage: waterManagementData.scores.suds || 0
        }
      }));
    }
  }, [waterManagementData]);

  // Auto-populate scores from Materials & Resource Efficiency tab
  useEffect(() => {
    if (materialsResourceData && materialsResourceData.scores) {
      setScores(prev => ({
        ...prev,
        materials_resources: {
          material_selection: materialsResourceData.scores.material_selection || 0,
          circular_economy: materialsResourceData.scores.circular_economy || 0,
          waste_management: materialsResourceData.scores.waste_management || 0,
          embodied_carbon: materialsResourceData.scores.embodied_carbon || 0
        }
      }));
    }
  }, [materialsResourceData]);

  // Auto-populate scores from Biodiversity & Ecosystem tab
  useEffect(() => {
    if (biodiversityEcosystemData && biodiversityEcosystemData.scores) {
      setScores(prev => ({
        ...prev,
        biodiversity_ecosystem: {
          biodiversity_preservation: biodiversityEcosystemData.scores.biodiversity_preservation || 0,
          ecological_connectivity: biodiversityEcosystemData.scores.ecological_connectivity || 0,
          native_species: biodiversityEcosystemData.scores.native_species_planting || 0,
          sustainable_land: biodiversityEcosystemData.scores.sustainable_land_use || 0
        }
      }));
    }
  }, [biodiversityEcosystemData]);

  // Auto-populate scores from Transport & Mobility tab
  useEffect(() => {
    if (transportMobilityData && transportMobilityData.scores) {
      setScores(prev => ({
        ...prev,
        transport_mobility: {
          transport_options: transportMobilityData.scores.transport_options || 0,
          mobility_all: transportMobilityData.scores.mobility_all || 0,
          transport_carbon: transportMobilityData.scores.construction_logistics || 0
        }
      }));
    }
  }, [transportMobilityData]);

  // Auto-populate scores from Social Impact & Wellbeing tab
  useEffect(() => {
    if (socialImpactData && socialImpactData.scores) {
      setScores(prev => ({
        ...prev,
        social_impact: {
          health_wellbeing: socialImpactData.scores.health_wellbeing || 0,
          community_engagement: socialImpactData.scores.community_engagement || 0,
          cultural_heritage: socialImpactData.scores.cultural_heritage || 0,
          job_creation: socialImpactData.scores.job_creation || 0
        }
      }));
    }
  }, [socialImpactData]);

  // Auto-populate scores from Innovation & Technology tab
  useEffect(() => {
    if (innovationTechnologyData && innovationTechnologyData.scores) {
      setScores(prev => ({
        ...prev,
        innovation_technology: {
          technology_integration: innovationTechnologyData.scores.technology_integration || 0,
          green_infrastructure: innovationTechnologyData.scores.green_infrastructure || 0,
          construction_techniques: innovationTechnologyData.scores.construction_techniques || 0
        }
      }));
    }
  }, [innovationTechnologyData]);

  const saveProjectMutation = useMutation({
    mutationFn: (projectData) => base44.entities.Project.create(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert("Project assessment saved successfully!");
    }
  });

  const handleScoreChange = (categoryId, subCategoryId, value) => {
    // Don't allow manual changes to auto-populated categories
    if (categoryId === 'management_governance' || categoryId === 'energy_carbon' || 
        categoryId === 'water_management' || categoryId === 'materials_resources' ||
        categoryId === 'biodiversity_ecosystem' || categoryId === 'transport_mobility' ||
        categoryId === 'social_impact' || categoryId === 'innovation_technology') {
      return;
    }
    
    setScores(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [subCategoryId]: parseFloat(value) || 0
      }
    }));
  };

  const handleCommentChange = (categoryId, value) => {
    setComments(prev => ({
      ...prev,
      [categoryId]: value
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
    if (!projectNumber || !projectName || !projectOwner) {
      alert("Please enter project number, project name and owner");
      return;
    }

    // Validate project stage
    if (projectStage === "Active" && !canSelectActive()) {
      alert("Active stage is only allowed if there is an existing Tender assessment for this project number.");
      return;
    }

    if (projectStage === "Tender" && tenderExists()) {
      alert("Only one Tender assessment is allowed per project number.");
      return;
    }

    // Generate reference
    const reference = generateReference(projectStage);

    const projectData = {
      reference: reference,
      project_number: projectNumber,
      project_name: projectName,
      project_owner: projectOwner,
      created_by_name: createdByName,
      project_stage: projectStage,
      status: "completed",
      total_score: parseFloat(calculateTotalScore()),
      category_comments: comments,
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
      setProjectNumber("");
      setProjectName("");
      setProjectOwner("");
      setCreatedByName("");
      setProjectStage("Tender");
      setScores({});
      setComments({});
      setShowSummary(false);
      setValidationError("");
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
          {validationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {validationError}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectNumber">Project Number</Label>
              <Input
                id="projectNumber"
                placeholder="Enter project number"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectStage">Project Stage</Label>
              <Select value={projectStage} onValueChange={handleProjectStageChange}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select project stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tender">Tender</SelectItem>
                  <SelectItem 
                    value="Active"
                    disabled={!canSelectActive()}
                  >
                    Active {!canSelectActive() && "(Requires Tender assessment)"}
                  </SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
              {projectStage === "Tender" && tenderExists() && (
                <p className="text-xs text-amber-600 mt-1">
                  Warning: A Tender assessment already exists for this project number
                </p>
              )}
              {projectNumber && (
                <p className="text-xs text-blue-600 mt-1">
                  Reference: {generateReference(projectStage)}
                </p>
              )}
            </div>
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="createdByName">Created By</Label>
              <Input
                id="createdByName"
                placeholder="Enter your name"
                value={createdByName}
                onChange={(e) => setCreatedByName(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {assessmentCategories.map((category) => (
        <div key={category.id}>
          <CategoryAssessment
            category={category}
            scores={scores[category.id] || {}}
            onScoreChange={(subCategoryId, value) => 
              handleScoreChange(category.id, subCategoryId, value)
            }
            categoryScore={calculateCategoryScore(category)}
            isReadOnly={category.id === 'management_governance' || category.id === 'energy_carbon' || 
                        category.id === 'water_management' || category.id === 'materials_resources' ||
                        category.id === 'biodiversity_ecosystem' || category.id === 'transport_mobility' ||
                        category.id === 'social_impact' || category.id === 'innovation_technology'}
          />
          
          {/* Comment box for category */}
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mt-2">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor={`comment-${category.id}`} className="text-sm font-medium text-gray-700">
                  Comments for {category.name}
                </Label>
                <Textarea
                  id={`comment-${category.id}`}
                  placeholder="Add any comments or notes for this category..."
                  value={comments[category.id] || ""}
                  onChange={(e) => handleCommentChange(category.id, e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
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
          projectNumber={projectNumber}
          projectName={projectName}
          projectOwner={projectOwner}
          createdByName={createdByName}
          projectStage={projectStage}
          comments={comments}
        />
      )}
    </div>
  );
}