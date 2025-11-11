import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingScale from "../components/scoring/RatingScale";
import CategoryBreakdown from "../components/scoring/CategoryBreakdown";
import AssessmentForm from "../components/scoring/AssessmentForm";
import ManagementGovernance from "../components/scoring/ManagementGovernance";
import EnergyCarbonManagement from "../components/scoring/EnergyCarbonManagement";
import WaterManagement from "../components/scoring/WaterManagement";

export default function ScoringTool() {
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
            <Tabs defaultValue="summary" className="space-y-6">
              <TabsList className="bg-white border border-emerald-100 flex-wrap">
                <TabsTrigger value="summary" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="management" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                  Management and Governance
                </TabsTrigger>
                <TabsTrigger value="energy" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                  Energy & Carbon Management
                </TabsTrigger>
                <TabsTrigger value="water" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                  Water Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <AssessmentForm 
                  managementGovernanceData={managementGovernanceData}
                  energyCarbonData={energyCarbonData}
                  waterManagementData={waterManagementData}
                />
              </TabsContent>

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
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}