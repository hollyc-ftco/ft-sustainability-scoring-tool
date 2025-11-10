import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";

export default function CategoryAssessment({ category, scores, onScoreChange, categoryScore, isReadOnly = false }) {
  const getColorClass = (weight) => {
    if (weight >= 20) return "from-emerald-500 to-teal-600";
    if (weight >= 15) return "from-blue-500 to-cyan-600";
    return "from-purple-500 to-indigo-600";
  };

  return (
    <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${getColorClass(category.weight)} rounded-xl flex items-center justify-center shadow-md`}>
              <span className="text-white font-bold">{category.weight}%</span>
            </div>
            <div>
              <CardTitle className="text-xl">{category.name}</CardTitle>
              {isReadOnly && (
                <div className="flex items-center gap-2 mt-1">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Auto-populated from Management and Governance tab</span>
                </div>
              )}
            </div>
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
                <TableHead className="w-1/3">Sub-category</TableHead>
                <TableHead className="w-1/3">Description</TableHead>
                <TableHead className="text-center">Weight (%)</TableHead>
                <TableHead className="text-center">Score (%)</TableHead>
                <TableHead className="text-center">Sub-category Score (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category.subCategories.map((sub) => {
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
                      {isReadOnly ? (
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                          {score.toFixed(2)}%
                        </Badge>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={score || ""}
                          onChange={(e) => onScoreChange(sub.id, e.target.value)}
                          className="w-24 mx-auto text-center border-emerald-200 focus:border-emerald-500"
                          placeholder="0"
                        />
                      )}
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
  );
}