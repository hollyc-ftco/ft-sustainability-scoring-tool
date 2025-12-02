import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingScale from "../components/scoring/RatingScale";
import CategoryBreakdown from "../components/scoring/CategoryBreakdown";
import AssessmentForm from "../components/scoring/AssessmentForm";
import ManagementGovernance from "../components/scoring/ManagementGovernance";
import EnergyCarbonManagement from "../components/scoring/EnergyCarbonManagement";
import WaterManagement from "../components/scoring/WaterManagement";
import MaterialsResourceEfficiency from "../components/scoring/MaterialsResourceEfficiency";
import BiodiversityEcosystem from "../components/scoring/BiodiversityEcosystem";
import TransportMobility from "../components/scoring/TransportMobility";
import SocialImpactWellbeing from "../components/scoring/SocialImpactWellbeing";
import InnovationTechnology from "../components/scoring/InnovationTechnology";

export default function ScoringTool() {
  const [activeAssessmentTab, setActiveAssessmentTab] = useState("summary");
  
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

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scoring Tool</h1>
          <p className="text-gray-600 text-lg">Sustainability Assessment Framework</p>
        </div>

        <Tabs defaultValue="information" className="space-y-6">
          <TabsList className="bg-white border border-emerald-100">
            <TabsTrigger value="information" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Information
            </TabsTrigger>
            <TabsTrigger value="assessment" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
              Assessment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="information" className="space-y-6">
            <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Rating System</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingScale />
              </CardContent>
            </Card>

            <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Categories & Weights</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryBreakdown />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment">
            <Tabs value={activeAssessmentTab} onValueChange={setActiveAssessmentTab} className="space-y-6">
              <TabsList className="bg-white border border-emerald-100 flex-wrap h-auto p-1 gap-1">
                <TabsTrigger value="summary" className="data-[state=active]:bg-gray-600 data-[state=active]:text-white">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="management" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Management and Governance
                </TabsTrigger>
                <TabsTrigger value="energy" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Energy & Carbon Management
                </TabsTrigger>
                <TabsTrigger value="water" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Water Management
                </TabsTrigger>
                <TabsTrigger value="materials" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Materials & Resource Efficiency
                </TabsTrigger>
                <TabsTrigger value="biodiversity" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Biodiversity & Ecosystem
                </TabsTrigger>
                <TabsTrigger value="transport" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Transport & Mobility
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Social Impact & Wellbeing
                </TabsTrigger>
                <TabsTrigger value="innovation" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  Innovation & Technology
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <AssessmentForm 
                  managementGovernanceData={managementGovernanceData}
                  energyCarbonData={energyCarbonData}
                  waterManagementData={waterManagementData}
                  materialsResourceData={materialsResourceData}
                  biodiversityEcosystemData={biodiversityEcosystemData}
                  transportMobilityData={transportMobilityData}
                  socialImpactData={socialImpactData}
                  innovationTechnologyData={innovationTechnologyData}
                />
              </TabsContent>

              <TabsContent value="management">
                <ManagementGovernance 
                  data={managementGovernanceData}
                  onDataChange={setManagementGovernanceData}
                  onNext={() => setActiveAssessmentTab("energy")}
                />
              </TabsContent>

              <TabsContent value="energy">
                <EnergyCarbonManagement 
                  data={energyCarbonData}
                  onDataChange={setEnergyCarbonData}
                  onNext={() => setActiveAssessmentTab("water")}
                />
              </TabsContent>

              <TabsContent value="water">
                <WaterManagement 
                  data={waterManagementData}
                  onDataChange={setWaterManagementData}
                  onNext={() => setActiveAssessmentTab("materials")}
                />
              </TabsContent>

              <TabsContent value="materials">
                <MaterialsResourceEfficiency 
                  data={materialsResourceData}
                  onDataChange={setMaterialsResourceData}
                  onNext={() => setActiveAssessmentTab("biodiversity")}
                />
              </TabsContent>

              <TabsContent value="biodiversity">
                <BiodiversityEcosystem 
                  data={biodiversityEcosystemData}
                  onDataChange={setBiodiversityEcosystemData}
                  onNext={() => setActiveAssessmentTab("transport")}
                />
              </TabsContent>

              <TabsContent value="transport">
                <TransportMobility 
                  data={transportMobilityData}
                  onDataChange={setTransportMobilityData}
                  onNext={() => setActiveAssessmentTab("social")}
                />
              </TabsContent>

              <TabsContent value="social">
                <SocialImpactWellbeing 
                  data={socialImpactData}
                  onDataChange={setSocialImpactData}
                  onNext={() => setActiveAssessmentTab("innovation")}
                />
              </TabsContent>

              <TabsContent value="innovation">
                <InnovationTechnology 
                  data={innovationTechnologyData}
                  onDataChange={setInnovationTechnologyData}
                  onNext={() => setActiveAssessmentTab("summary")}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}