import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const managementGovernance = {
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
};

export default function ManagementGovernance() {
  const queryClient = useQueryClient();
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [scores, setScores] = useState({});

  const saveProjectMutation = useMutation({
    mutationFn: (projectData) => base44.entities.Project.create(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      alert("Management and Governance assessment saved successfully!");
      setProjectName("");
      setProjectOwner("");
      setScores({});
    }
  });

  const handleScoreChange = (subCategoryId, value) => {
    setScores(prev => ({
      ...prev,
      [subCategoryId]: parseFloat(value) || 0
    }));
  };

  const calculateCategoryScore = () => {
    let totalScore = 0;
    
    managementGovernance.subCategories.forEach(sub => {
      const score = scores[sub.id] || 0;
      const subCategoryScore = (score * sub.weight) / 100;
      totalScore += subCategoryScore;
    });
    
    return totalScore;
  };

  const handleSave = () => {
    if (!projectName || !projectOwner) {
      alert("Please enter project name and owner");
      return;
    }

    const categoryScore = calculateCategoryScore();
    const weightedScore = (categoryScore * managementGovernance.weight) / 100;

    const projectData = {
      project_name: projectName,
      project_owner: projectOwner,
      status: "in_progress",
      total_score: weightedScore,
      management_governance: scores
    };

    saveProjectMutation.mutate(projectData);
  };

  const categoryScore = calculateCategoryScore();

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Project Information</CardTitle>
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

      <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold">{managementGovernance.weight}%</span>
              </div>
              <CardTitle className="text-xl">{managementGovernance.name}</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200 text-base py-1 px-3">
                Category Score: {categoryScore.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-1/4">Sub-category</TableHead>
                  <TableHead className="w-2/5">Description</TableHead>
                  <TableHead className="text-center">Sub-Category Weighting %</TableHead>
                  <TableHead className="text-center">Score %</TableHead>
                  <TableHead className="text-center">Sub-category Score %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managementGovernance.subCategories.map((sub) => {
                  const score = scores[sub.id] || 0;
                  const subCategoryScore = (score * sub.weight) / 100;
                  
                  return (
                    <TableRow key={sub.id} className="hover:bg-emerald-50/30">
                      <TableCell className="font-medium">{sub.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{sub.description}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                          {sub.weight}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={score || ""}
                          onChange={(e) => handleScoreChange(sub.id, e.target.value)}
                          className="w-24 mx-auto text-center border-emerald-200 focus:border-emerald-500"
                          placeholder="0"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                          {subCategoryScore.toFixed(2)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-emerald-50 font-semibold">
                  <TableCell colSpan={4} className="text-right">Total Category Score</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-600 text-white text-base py-1 px-3">
                      {categoryScore.toFixed(2)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
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
    </div>
  );
}