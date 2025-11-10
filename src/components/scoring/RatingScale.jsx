import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const ratings = [
  {
    name: "Outstanding",
    points: "85 - 100",
    description: "Exemplary level of sustainability performance, pushing industry boundaries.",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    icon: Award,
  },
  {
    name: "Excellent",
    points: "70 - 84",
    description: "Highly sustainable, with advanced practices and results in most areas.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    icon: Star,
  },
  {
    name: "Good",
    points: "55 - 69",
    description: "Above average sustainability, meeting key performance criteria.",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-800",
    icon: CheckCircle,
  },
  {
    name: "Pass",
    points: "40 - 54",
    description: "Meets minimum sustainability requirements but with room for improvement.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-800",
    icon: AlertCircle,
  },
  {
    name: "Unclassified",
    points: "< 40",
    description: "Does not meet the minimum standards for sustainability.",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    icon: XCircle,
  },
];

export default function RatingScale() {
  return (
    <div className="space-y-4">
      {ratings.map((rating, index) => {
        const Icon = rating.icon;
        return (
          <div
            key={index}
            className={`${rating.bgColor} ${rating.borderColor} border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${rating.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-bold ${rating.textColor}`}>{rating.name}</h3>
                  <Badge variant="secondary" className={`${rating.bgColor} ${rating.textColor} border ${rating.borderColor}`}>
                    {rating.points} points
                  </Badge>
                </div>
                <p className="text-gray-700">{rating.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}