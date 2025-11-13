
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ManagementGovernance from "../components/scoring/ManagementGovernance";
import EnergyCarbonManagement from "../components/scoring/EnergyCarbonManagement";
import WaterManagement from "../components/scoring/WaterManagement";
import MaterialsResourceEfficiency from "../components/scoring/MaterialsResourceEfficiency";
import BiodiversityEcosystem from "../components/scoring/BiodiversityEcosystem";
import TransportMobility from "../components/scoring/TransportMobility";
import SocialImpactWellbeing from "../components/scoring/SocialImpactWellbeing";
import InnovationTechnology from "../components/scoring/InnovationTechnology";

export default function EditProject() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const queryClient = useQueryClient();

  const [projectNumber, setProjectNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [department, setDepartment] = useState(""); // Added state for Department
  const [createdByName, setCreatedByName] = useState("");
  const [projectStage, setProjectStage] = useState("Tender");

  const [managementGovernanceData, setManagementGovernanceData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [energyCarbonData, setEnergyCarbonData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [waterManagementData, setWaterManagementData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [materialsResourceData, setMaterialsResourceData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [biodiversityEcosystemData, setBiodiversityEcosystemData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [transportMobilityData, setTransportMobilityData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [socialImpactData, setSocialImpactData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });
  const [innovationTechnologyData, setInnovationTechnologyData] = useState({
    responses: {},
    priorities: {},
    scores: {}
  });

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  // Load project data into state when fetched
  useEffect(() => {
    if (project) {
      setProjectNumber(project.project_number || "");
      setProjectName(project.project_name || "");
      setProjectOwner(project.project_owner || "");
      setDepartment(project.department || ""); // Load department
      setCreatedByName(project.created_by_name || "");
      setProjectStage(project.project_stage || "Tender");
      
      // Note: You would need to store the detailed responses/priorities data in the Project entity
      // to fully restore the assessment state. For now, we'll only load the scores.
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert("Project updated successfully!");
    }
  });

  const handleSave = () => {
    if (!projectNumber || !projectName || !projectOwner) {
      alert("Please enter project number, project name and owner");
      return;
    }

    // Calculate scores from all tabs
    const scores = {
      management_governance: {
        sdg_alignment: managementGovernanceData.scores.sdg_alignment || 0,
        environmental_systems: managementGovernanceData.scores.environmental_systems || 0,
        stakeholder_engagement: managementGovernanceData.scores.stakeholder_engagement || 0,
        policy_planning: managementGovernanceData.scores.policy_planning || 0
      },
      energy_carbon: {
        energy_reduction: energyCarbonData.scores.energy_reduction || 0,
        carbon_emissions: energyCarbonData.scores.carbon_emissions || 0,
        renewable_energy: energyCarbonData.scores.renewable_energy || 0,
        carbon_offsetting: energyCarbonData.scores.carbon_offsetting || 0
      },
      water_management: {
        water_efficiency: waterManagementData.scores.water_efficiency || 0,
        flood_risk: waterManagementData.scores.flood_risk || 0,
        water_quality: waterManagementData.scores.water_quality || 0,
        sustainable_drainage: waterManagementData.scores.suds || 0
      },
      materials_resources: {
        material_selection: materialsResourceData.scores.material_selection || 0,
        circular_economy: materialsResourceData.scores.circular_economy || 0,
        waste_management: materialsResourceData.scores.waste_management || 0,
        embodied_carbon: materialsResourceData.scores.embodied_carbon || 0
      },
      biodiversity_ecosystem: {
        biodiversity_preservation: biodiversityEcosystemData.scores.biodiversity_preservation || 0,
        ecological_connectivity: biodiversityEcosystemData.scores.ecological_connectivity || 0,
        native_species: biodiversityEcosystemData.scores.native_species_planting || 0,
        sustainable_land: biodiversityEcosystemData.scores.sustainable_land_use || 0
      },
      transport_mobility: {
        transport_options: transportMobilityData.scores.transport_options || 0,
        mobility_all: transportMobilityData.scores.mobility_all || 0,
        transport_carbon: transportMobilityData.scores.construction_logistics || 0
      },
      social_impact: {
        health_wellbeing: socialImpactData.scores.health_wellbeing || 0,
        community_engagement: socialImpactData.scores.community_engagement || 0,
        cultural_heritage: socialImpactData.scores.cultural_heritage || 0,
        job_creation: socialImpactData.scores.job_creation || 0
      },
      innovation_technology: {
        technology_integration: innovationTechnologyData.scores.technology_integration || 0,
        green_infrastructure: innovationTechnologyData.scores.green_infrastructure || 0,
        construction_techniques: innovationTechnologyData.scores.construction_techniques || 0
      }
    };

    // Calculate total score
    const categoryWeights = {
      management_governance: 10,
      energy_carbon: 20,
      water_management: 15,
      materials_resources: 10,
      biodiversity_ecosystem: 15,
      transport_mobility: 10,
      social_impact: 10,
      innovation_technology: 10
    };

    let totalScore = 0;
    Object.entries(scores).forEach(([categoryId, categoryScores]) => {
      const categoryAvg = Object.values(categoryScores).reduce((sum, val) => sum + val, 0) / Object.values(categoryScores).length;
      totalScore += (categoryAvg * categoryWeights[categoryId]) / 100;
    });

    const projectData = {
      project_number: projectNumber,
      project_name: projectName,
      project_owner: projectOwner,
      department: department, // Included department in projectData
      created_by_name: createdByName,
      project_stage: projectStage,
      total_score: totalScore,
      ...scores
    };

    updateProjectMutation.mutate({ id: projectId, data: projectData });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <p className="text-gray-600">Loading project...</p>
          </div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Assessment</h1>
          <p className="text-gray-600 text-lg">Modify project sustainability assessment</p>
        </div>

        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mb-6">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl">Project Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference (Auto-generated)</Label>
                <Input
                  id="reference"
                  value={project.reference || ""}
                  disabled
                  className="border-emerald-200 bg-gray-50"
                />
              </div>
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
              {/* Department Select Input */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Circular Economy & Environment">Circular Economy & Environment</SelectItem>
                    <SelectItem value="Energy and Planning">Energy and Planning</SelectItem>
                    <SelectItem value="Sustainable Infrastructure">Sustainable Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdByName">Created By</Label>
                <Input
                  id="createdByName"
                  placeholder="Enter creator name"
                  value={createdByName}
                  onChange={(e) => setCreatedByName(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectStage">Project Stage</Label>
                <Select value={projectStage} onValueChange={setProjectStage}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select project stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tender">Tender</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="management" className="space-y-6">
          <TabsList className="bg-white border border-emerald-100 flex-wrap">
            <TabsTrigger value="management" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Management & Governance
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Energy & Carbon
            </TabsTrigger>
            <TabsTrigger value="water" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Water Management
            </TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Materials & Resources
            </TabsTrigger>
            <TabsTrigger value="biodiversity" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Biodiversity & Ecosystem
            </TabsTrigger>
            <TabsTrigger value="transport" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Transport & Mobility
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Social Impact
            </TabsTrigger>
            <TabsTrigger value="innovation" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Innovation & Technology
            </TabsTrigger>
          </TabsList>

          <TabsContent value="management">
            <ManagementGovernance 
              data={managementGovernanceData}
              onDataChange={setManagementGovernanceData}
            />
          </TabsContent>

          <TabsContent value="energy">
            <EnergyCarbonManagement 
              data={energyCarbonData}
              onDataChange={setEnergyCarbonData}
            />
          </TabsContent>

          <TabsContent value="water">
            <WaterManagement 
              data={waterManagementData}
              onDataChange={setWaterManagementData}
            />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialsResourceEfficiency 
              data={materialsResourceData}
              onDataChange={setMaterialsResourceData}
            />
          </TabsContent>

          <TabsContent value="biodiversity">
            <BiodiversityEcosystem 
              data={biodiversityEcosystemData}
              onDataChange={setBiodiversityEcosystemData}
            />
          </TabsContent>

          <TabsContent value="transport">
            <TransportMobility 
              data={transportMobilityData}
              onDataChange={setTransportMobilityData}
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialImpactWellbeing 
              data={socialImpactData}
              onDataChange={setSocialImpactData}
            />
          </TabsContent>

          <TabsContent value="innovation">
            <InnovationTechnology 
              data={innovationTechnologyData}
              onDataChange={setInnovationTechnologyData}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 justify-end sticky bottom-6 z-10 mt-6">
          <Link to={createPageUrl("Records")}>
            <Button variant="outline" className="border-emerald-200">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={updateProjectMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            size="lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
