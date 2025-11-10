import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const getRating = (score) => {
  const numScore = parseFloat(score);
  if (numScore >= 85) return { name: "Outstanding", color: "from-green-500 to-emerald-600", bgColor: "bg-green-50", textColor: "text-green-800", icon: Award };
  if (numScore >= 70) return { name: "Excellent", color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-800", icon: Star };
  if (numScore >= 55) return { name: "Good", color: "from-yellow-500 to-amber-600", bgColor: "bg-yellow-50", textColor: "text-yellow-800", icon: CheckCircle };
  if (numScore >= 40) return { name: "Pass", color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50", textColor: "text-orange-800", icon: AlertCircle };
  return { name: "Unclassified", color: "from-red-500 to-red-600", bgColor: "bg-red-50", textColor: "text-red-800", icon: XCircle };
};

export default function AssessmentSummary({ categories, scores, calculateCategoryScore, totalScore }) {
  const rating = getRating(totalScore);
  const RatingIcon = rating.icon;

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl">
      <CardHeader className="border-b border-emerald-200">
        <CardTitle className="text-3xl text-center">Assessment Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className={`${rating.bgColor} border-2 ${rating.bgColor.replace('bg-', 'border-')} rounded-2xl p-8`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${rating.color} rounded-2xl flex items-center justify-center shadow-lg`}>
              <RatingIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Overall Rating</p>
              <h2 className={`text-4xl font-bold ${rating.textColor}`}>{rating.name}</h2>
            </div>
          </div>
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900 mb-2">{totalScore}</p>
            <p className="text-gray-600 font-medium">Total Score (out of 100)</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-xl mb-4">Category Breakdown</h3>
          {categories.map((category) => {
            const categoryScore = calculateCategoryScore(category);
            const weightedScore = (categoryScore * category.weight) / 100;
            
            return (
              <div key={category.id} className="bg-white rounded-xl p-4 border border-emerald-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{category.weight}%</span>
                    </div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                      Score: {categoryScore.toFixed(2)}%
                    </Badge>
                    <Badge className="bg-emerald-600 text-white">
                      Weighted: {weightedScore.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(categoryScore, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}