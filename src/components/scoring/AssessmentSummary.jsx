import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const getRating = (score) => {
  if (score >= 85) {
    return {
      name: "Outstanding",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      icon: Award,
    };
  } else if (score >= 70) {
    return {
      name: "Excellent",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      icon: Star,
    };
  } else if (score >= 55) {
    return {
      name: "Good",
      color: "from-yellow-500 to-amber-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      icon: CheckCircle,
    };
  } else if (score >= 40) {
    return {
      name: "Pass",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
      icon: AlertCircle,
    };
  } else {
    return {
      name: "Unclassified",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      icon: XCircle,
    };
  }
};

export default function AssessmentSummary({ 
  categories, 
  scores, 
  calculateCategoryScore, 
  totalScore,
  projectNumber,
  projectName, 
  projectOwner,
  projectStage
}) {
  const rating = getRating(parseFloat(totalScore));
  const RatingIcon = rating.icon;

  return (
    <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm print:shadow-none">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <CardTitle className="text-2xl">Assessment Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 mb-1">Project Number</p>
              <p className="font-semibold text-gray-900">{projectNumber || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Project Name</p>
              <p className="font-semibold text-gray-900">{projectName || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Project Owner</p>
              <p className="font-semibold text-gray-900">{projectOwner || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Project Stage</p>
              <Badge className={`${
                projectStage === "Tender" ? "bg-blue-100 text-blue-800" :
                projectStage === "Active" ? "bg-green-100 text-green-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {projectStage || "Not specified"}
              </Badge>
            </div>
          </div>

          {/* Overall Rating */}
          <div className={`${rating.bgColor} rounded-xl p-6 border-2 border-${rating.textColor.replace('text-', '')}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${rating.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <RatingIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Overall Rating</p>
                  <h3 className={`text-3xl font-bold ${rating.textColor}`}>{rating.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Score</p>
                <p className="text-5xl font-bold text-gray-900">{totalScore}%</p>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Category Scores</h4>
            {categories.map((category) => {
              const categoryScore = calculateCategoryScore(category);
              const percentage = categoryScore.toFixed(2);
              
              return (
                <div key={category.id} className="border border-emerald-100 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="font-semibold text-gray-900">{category.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          Weight: {category.weight}%
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-lg py-1 px-3">
                      {percentage}%
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}