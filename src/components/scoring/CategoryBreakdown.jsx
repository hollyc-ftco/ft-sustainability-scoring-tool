import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Management and Governance",
    weight: 10,
    subCategories: [
      { name: "Sustainable Development Goals (SDGs) Alignment", weight: 20 },
      { name: "Environmental Management Systems", weight: 30 },
      { name: "Stakeholder Engagement", weight: 30 },
      { name: "Policy and Planning", weight: 20 },
    ],
  },
  {
    name: "Energy and Carbon Management",
    weight: 20,
    subCategories: [
      { name: "Energy Use Reduction", weight: 25 },
      { name: "Carbon Emissions", weight: 20 },
      { name: "Renewable Energy Integration", weight: 25 },
      { name: "Carbon Offsetting", weight: 30 },
    ],
  },
  {
    name: "Water Management",
    weight: 15,
    subCategories: [
      { name: "Water Efficiency", weight: 25 },
      { name: "Flood Risk Management", weight: 20 },
      { name: "Water Quality", weight: 25 },
      { name: "Sustainable Drainage Systems (SuDS)", weight: 30 },
    ],
  },
  {
    name: "Materials and Resource Efficiency",
    weight: 10,
    subCategories: [
      { name: "Material Selection", weight: 25 },
      { name: "Circular Economy", weight: 25 },
      { name: "Waste management", weight: 10 },
      { name: "Embodied Carbon", weight: 40 },
    ],
  },
  {
    name: "Biodiversity and Ecosystem Services",
    weight: 15,
    subCategories: [
      { name: "Biodiversity Preservation", weight: 15 },
      { name: "Ecological Connectivity", weight: 45 },
      { name: "Native Species Planting", weight: 30 },
      { name: "Sustainable Land Use", weight: 10 },
    ],
  },
  {
    name: "Transport and Mobility",
    weight: 10,
    subCategories: [
      { name: "Sustainable Transport Options", weight: 40 },
      { name: "Mobility for All", weight: 50 },
      { name: "Transportation Carbon Impact", weight: 10 },
    ],
  },
  {
    name: "Social Impact and Community Well-being",
    weight: 10,
    subCategories: [
      { name: "Health and Wellbeing", weight: 25 },
      { name: "Community Engagement", weight: 25 },
      { name: "Cultural Heritage Preservation", weight: 25 },
      { name: "Job Creation and Social Equity", weight: 25 },
    ],
  },
  {
    name: "Innovation and Technology",
    weight: 10,
    subCategories: [
      { name: "Technology Integration", weight: 33.33 },
      { name: "Green Infrastructure", weight: 33.33 },
      { name: "Construction Techniques", weight: 33.33 },
    ],
  },
];

const getColorClass = (weight) => {
  if (weight >= 20) return "from-emerald-500 to-teal-600";
  if (weight >= 15) return "from-blue-500 to-cyan-600";
  return "from-purple-500 to-indigo-600";
};

export default function CategoryBreakdown() {
  return (
    <div className="space-y-6">
      {categories.map((category, index) => (
        <div
          key={index}
          className="border-2 border-emerald-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-emerald-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${getColorClass(category.weight)} rounded-lg flex items-center justify-center shadow-md`}>
                  <span className="text-white font-bold text-sm">{category.weight}%</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200">
                Weight: {category.weight}%
              </Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Sub-Category</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Weight (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.subCategories.map((sub, subIndex) => (
                  <TableRow key={subIndex} className="hover:bg-emerald-50/50 transition-colors">
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-emerald-600" />
                        {sub.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                        {sub.weight}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
}