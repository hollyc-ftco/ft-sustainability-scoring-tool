import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";

const priorityScores = {
  1: { label: "Mandatory", score: 1, color: "bg-red-100 text-red-800 border-red-200" },
  2: { label: "Best Practice", score: 0.6, color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Stretch Goal", score: 0.3, color: "bg-green-100 text-green-800 border-green-200" }
};

const sdgItems = [
  {
    id: "consider_sdgs",
    item: "Consider SDGs",
    description: "Consider SDG goals within project design",
    actions: "Fill in sustainability checklist. Identify actions against each relevant SDG.",
    priority: 2
  },
  {
    id: "sdg_9",
    item: "SDG 9",
    description: "Consider SDG 9, focusing on reliable, resilient and sustainable infrastructure.",
    actions: "Quality, reliable, sustainable and resilient new infrastructure. Existing infrastructure retrofitted.",
    priority: 1
  },
  {
    id: "sdg_11",
    item: "SDG 11",
    description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
    actions: "Ensure access to housing and services for all. Provide access to safe, affordable, accessible and sustainable transport systems for all. Inclusive and sustainable urbanization. Protect the cultural and natural heritage. Pay attention to air quality and waste management. Provide access to green spaces for all.",
    priority: 3
  },
  {
    id: "sdg_12",
    item: "SDG 12",
    description: "Consider SDG 12, focusing on waste reduction and implementing sustainable practices.",
    actions: "Implement sustainable management and the efficient use of natural resources. Reduce waste by recycling and reusing.",
    priority: 2
  }
];

export default function ManagementGovernance() {
  const [responses, setResponses] = useState({});

  const handleCheckboxChange = (itemId, checked) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const calculateScore = (itemId, priority) => {
    if (responses[itemId]) {
      return priorityScores[priority].score;
    }
    return 0;
  };

  const calculateTotal = () => {
    const sumActualScores = sdgItems.reduce((total, item) => {
      return total + calculateScore(item.id, item.priority);
    }, 0);
    
    const sumPriorityScores = sdgItems.reduce((total, item) => {
      return total + priorityScores[item.priority].score;
    }, 0);
    
    if (sumPriorityScores === 0) return "0.00";
    
    return ((sumActualScores / sumPriorityScores) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Sustainable Development Goals (SDGs) Alignment</CardTitle>
            <Badge className="bg-emerald-600 text-white text-lg py-2 px-4">
              Total: {calculateTotal()}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Priority Scoring System</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 border border-red-200">
                      Mandatory (Priority 1)
                    </Badge>
                    <span className="text-gray-700">Score: 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                      Best Practice (Priority 2)
                    </Badge>
                    <span className="text-gray-700">Score: 0.6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 border border-green-200">
                      Stretch Goal (Priority 3)
                    </Badge>
                    <span className="text-gray-700">Score: 0.3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-32">Item</TableHead>
                  <TableHead className="w-1/4">Description</TableHead>
                  <TableHead className="w-1/3">Actions</TableHead>
                  <TableHead className="text-center w-32">Priority</TableHead>
                  <TableHead className="text-center w-24">Yes/No</TableHead>
                  <TableHead className="text-center w-24">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sdgItems.map((item) => {
                  const score = calculateScore(item.id, item.priority);
                  const priorityInfo = priorityScores[item.priority];
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-emerald-50/30">
                      <TableCell className="font-semibold text-emerald-700">
                        {item.item}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {item.actions}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${priorityInfo.color} border`}>
                          {item.priority} - {priorityInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={responses[item.id] || false}
                            onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
                            className="border-emerald-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={score > 0 ? "default" : "outline"}
                          className={score > 0 ? "bg-emerald-600 text-white" : "border-gray-300 text-gray-500"}
                        >
                          {score.toFixed(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-emerald-50 font-semibold">
                  <TableCell colSpan={5} className="text-right text-lg">
                    TOTAL
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-600 text-white text-lg py-1 px-3">
                      {calculateTotal()}%
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}