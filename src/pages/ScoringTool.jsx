import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingScale from "../components/scoring/RatingScale";
import CategoryBreakdown from "../components/scoring/CategoryBreakdown";
import AssessmentForm from "../components/scoring/AssessmentForm";

export default function ScoringTool() {
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
            <AssessmentForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}