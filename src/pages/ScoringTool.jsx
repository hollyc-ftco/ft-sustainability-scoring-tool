import React, { useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingScale from "../components/scoring/RatingScale";
import CategoryBreakdown from "../components/scoring/CategoryBreakdown";
import AssessmentForm from "../components/scoring/AssessmentForm";
import ManagementGovernance, { assessmentSections as mgSections } from "../components/scoring/ManagementGovernance";
import EnergyCarbonManagement, { assessmentSections as ecSections } from "../components/scoring/EnergyCarbonManagement";
import WaterManagement, { assessmentSections as wmSections } from "../components/scoring/WaterManagement";
import MaterialsResourceEfficiency, { assessmentSections as mrSections } from "../components/scoring/MaterialsResourceEfficiency";
import BiodiversityEcosystem, { assessmentSections as beSections } from "../components/scoring/BiodiversityEcosystem";
import TransportMobility, { assessmentSections as tmSections } from "../components/scoring/TransportMobility";
import SocialImpactWellbeing, { assessmentSections as siSections } from "../components/scoring/SocialImpactWellbeing";
import InnovationTechnology, { assessmentSections as itSections } from "../components/scoring/InnovationTechnology";
import MandatoryCheckDialog from "../components/scoring/MandatoryCheckDialog";

export default function ScoringTool() {
  const [activeAssessmentTab, setActiveAssessmentTab] = useState("summary");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);
  
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

  const [mandatoryDialogOpen, setMandatoryDialogOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [dialogData, setDialogData] = useState({ missingMandatory: [], currentScore: 0, sectionName: "" });
  const [sectionReasons, setSectionReasons] = useState({});

  const checkMandatoryRequirements = useCallback((data, sections, sectionName) => {
    const missingMandatory = [];
    let totalScore = 0;
    let sectionCount = 0;

    Object.entries(sections).forEach(([sectionId, section]) => {
      const responses = data.responses[sectionId] || {};
      const priorities = data.priorities[sectionId] || {};
      const sectionScore = data.scores[sectionId] || 0;
      
      totalScore += sectionScore;
      sectionCount++;

      section.items.forEach(item => {
        const priority = priorities[item.id] || item.defaultPriority;
        const response = responses[item.id];
        
        if (priority === 1 && response !== "yes" && response !== "not_applicable") {
          missingMandatory.push(item.item);
        }
      });
    });

    const avgScore = sectionCount > 0 ? totalScore / sectionCount : 0;
    return { missingMandatory, avgScore };
  }, []);

  const handleNavigationWithCheck = useCallback((currentData, sections, sectionName, nextTab) => {
    const { missingMandatory, avgScore } = checkMandatoryRequirements(currentData, sections, sectionName);
    
    if (missingMandatory.length > 0 || avgScore < 40) {
      setDialogData({ missingMandatory, currentScore: avgScore, sectionName });
      setPendingNavigation(nextTab);
      setMandatoryDialogOpen(true);
    } else {
      setActiveAssessmentTab(nextTab);
    }
  }, [checkMandatoryRequirements]);

  const handleDialogConfirm = (reason) => {
    if (reason) {
      setSectionReasons(prev => ({
        ...prev,
        [dialogData.sectionName]: reason
      }));
    }
    setMandatoryDialogOpen(false);
    if (pendingNavigation) {
      setActiveAssessmentTab(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleDialogCancel = () => {
    setMandatoryDialogOpen(false);
    setPendingNavigation(null);
  };

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
                <TabsTrigger value="summary" className="bg-gray-100 text-gray-700 data-[state=active]:bg-gray-600 data-[state=active]:text-white">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="management" className="bg-purple-100 text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Management and Governance
                </TabsTrigger>
                <TabsTrigger value="energy" className="bg-orange-100 text-orange-700 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Energy & Carbon Management
                </TabsTrigger>
                <TabsTrigger value="water" className="bg-blue-100 text-blue-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                  Water Management
                </TabsTrigger>
                <TabsTrigger value="materials" className="bg-amber-100 text-amber-700 data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                  Materials & Resource Efficiency
                </TabsTrigger>
                <TabsTrigger value="biodiversity" className="bg-green-100 text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Biodiversity & Ecosystem
                </TabsTrigger>
                <TabsTrigger value="transport" className="bg-red-100 text-red-700 data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Transport & Mobility
                </TabsTrigger>
                <TabsTrigger value="social" className="bg-pink-100 text-pink-700 data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Social Impact & Wellbeing
                </TabsTrigger>
                <TabsTrigger value="innovation" className="bg-cyan-100 text-cyan-700 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
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
                  onNext={() => handleNavigationWithCheck(managementGovernanceData, mgSections, "Management & Governance", "energy")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="energy">
                <EnergyCarbonManagement 
                  data={energyCarbonData}
                  onDataChange={setEnergyCarbonData}
                  onNext={() => handleNavigationWithCheck(energyCarbonData, ecSections, "Energy & Carbon Management", "water")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="water">
                <WaterManagement 
                  data={waterManagementData}
                  onDataChange={setWaterManagementData}
                  onNext={() => handleNavigationWithCheck(waterManagementData, wmSections, "Water Management", "materials")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="materials">
                <MaterialsResourceEfficiency 
                  data={materialsResourceData}
                  onDataChange={setMaterialsResourceData}
                  onNext={() => handleNavigationWithCheck(materialsResourceData, mrSections, "Materials & Resource Efficiency", "biodiversity")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="biodiversity">
                <BiodiversityEcosystem 
                  data={biodiversityEcosystemData}
                  onDataChange={setBiodiversityEcosystemData}
                  onNext={() => handleNavigationWithCheck(biodiversityEcosystemData, beSections, "Biodiversity & Ecosystem", "transport")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="transport">
                <TransportMobility 
                  data={transportMobilityData}
                  onDataChange={setTransportMobilityData}
                  onNext={() => handleNavigationWithCheck(transportMobilityData, tmSections, "Transport & Mobility", "social")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="social">
                <SocialImpactWellbeing 
                  data={socialImpactData}
                  onDataChange={setSocialImpactData}
                  onNext={() => handleNavigationWithCheck(socialImpactData, siSections, "Social Impact & Wellbeing", "innovation")}
                  isAdmin={isAdmin}
                />
              </TabsContent>

              <TabsContent value="innovation">
                <InnovationTechnology 
                  data={innovationTechnologyData}
                  onDataChange={setInnovationTechnologyData}
                  onNext={() => handleNavigationWithCheck(innovationTechnologyData, itSections, "Innovation & Technology", "summary")}
                  isAdmin={isAdmin}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <MandatoryCheckDialog
          open={mandatoryDialogOpen}
          onOpenChange={setMandatoryDialogOpen}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
          missingMandatory={dialogData.missingMandatory}
          currentScore={dialogData.currentScore}
          sectionName={dialogData.sectionName}
        />
      </div>
    </div>
  );
}