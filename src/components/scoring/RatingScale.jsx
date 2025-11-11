import React from "react";
import { Badge } from "@/components/ui/badge";
import { Award, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ratings = [
  {
    name: "Outstanding",
    points: "85 - 100",
    description: "Exemplary level of sustainability performance, pushing industry boundaries.",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-800",
    icon: Award,
  },
  {
    name: "Excellent",
    points: "70 - 84",
    description: "Highly sustainable, with advanced practices and results in most areas.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-800",
    icon: Star,
  },
  {
    name: "Good",
    points: "55 - 69",
    description: "Above average sustainability, meeting key performance criteria.",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800",
    icon: CheckCircle,
  },
  {
    name: "Pass",
    points: "40 - 54",
    description: "Meets minimum sustainability requirements but with room for improvement.",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-800",
    icon: AlertCircle,
  },
  {
    name: "Unclassified",
    points: "< 40",
    description: "Does not meet the minimum standards for sustainability.",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    icon: XCircle,
  },
];

export default function RatingScale() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12"></TableHead>
            <TableHead className="w-40">Rating</TableHead>
            <TableHead className="w-32">Points Range</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((rating, index) => {
            const Icon = rating.icon;
            return (
              <TableRow key={index} className={`${rating.bgColor} hover:opacity-80 transition-opacity`}>
                <TableCell>
                  <div className={`w-8 h-8 bg-gradient-to-br ${rating.color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-bold ${rating.textColor}`}>{rating.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${rating.bgColor} ${rating.textColor} border-2`}>
                    {rating.points}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  {rating.description}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}