import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info, ArrowRight, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminItemEditor from "./AdminItemEditor";

const priorityScores = {
  1: { label: "Mandatory", color: "bg-red-100 text-red-800 border-red-200" },
  2: { label: "Best Practice", color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Stretch Goal", color: "bg-green-100 text-green-800 border-green-200" }
};

// Mandatory items (Priority 1) = 40% of total score
// Best Practice (Priority 2) + Stretch Goal (Priority 3) = 60% of total score
const MANDATORY_WEIGHT = 40;
const NON_MANDATORY_WEIGHT = 60;

export const assessmentSections = {
  energy_reduction: {
    title: "Energy Use Reduction",
    items: [
      {
        id: "energy_carbon_operation",
        item: "Energy and carbon emissions reduction for operation",
        description: "Energy and carbon emissions reduction for operation",
        actions: "Incorporate renewable energy sources. Use high-efficiency lighting (LEDs) and low-energy HVAC systems. Implement passive design strategies. Install energy monitoring systems for ongoing performance tracking.",
        defaultPriority: 2
      },
      {
        id: "energy_construction_design",
        item: "Energy consumption during construction - consideration during design",
        description: "Energy consumption during construction - consideration during design",
        actions: "Develop a CEMP with reduction targets. Choose construction methods that minimise energy use on site. Include energy performance as a selection criterion in contractor procurement. Monitor site energy use with sub-meters and adjust practices accordingly.",
        defaultPriority: 1
      },
      {
        id: "construction_plant",
        item: "Construction plant",
        description: "Construction plant",
        actions: "Ensure regular maintenance on vehicles and minimise idling in the plant.",
        defaultPriority: 2
      }
    ]
  },
  carbon_emissions: {
    title: "Carbon Emissions",
    items: [
      {
        id: "whole_life_carbon",
        item: "Whole Life Carbon Assessment",
        description: "Whole Life Carbon Assessment",
        actions: "Conduct Life Cycle Assessment (LCA) using EN 15978 or similar; report embodied carbon using PAS 2080 framework; iterate design based on carbon hotspots.",
        defaultPriority: 2
      },
      {
        id: "carbon_benchmarking",
        item: "Carbon Benchmarking & Target-Setting",
        description: "Carbon Benchmarking & Target-Setting",
        actions: "Set carbon intensity targets (e.g. tCO₂e/km or per m²); use project carbon budgets and monitor performance through design and construction.",
        defaultPriority: 3
      },
      {
        id: "circular_energy_design",
        item: "Circular Energy Design",
        description: "Circular Energy Design",
        actions: "Allow for decentralised energy sources, energy sharing infrastructure (e.g. smart grids), or reuse of heat (e.g. from data centres).",
        defaultPriority: 2
      },
      {
        id: "renewable_low_carbon_options",
        item: "Renewable/low-carbon/zero-carbon energy options",
        description: "Renewable/low-carbon/zero-carbon energy options",
        actions: "Consideration given to inclusion of renewable / low-carbon / zero-carbon energy options and other carbon reduction measures in design. To be considered at kick-off meetings.",
        defaultPriority: 1
      },
      {
        id: "zero_carbon_roadmap",
        item: "Zero Carbon Roadmap",
        description: "Zero Carbon Roadmap",
        actions: "Develop project-specific net-zero pathways including residual carbon offsetting strategy; integrate with organisational carbon goals.",
        defaultPriority: 1
      },
      {
        id: "renewable_operational",
        item: "Renewable/low-carbon/zero-carbon energy options within operational phase",
        description: "Explore opportunities and implement measures to reduce the operational carbon footprint of the project.",
        actions: "Integrate solar panels, PV arrays ground-source heat pumps.",
        defaultPriority: 2
      },
      {
        id: "renewable_construction",
        item: "Renewable/low-carbon/zero-carbon energy options during construction",
        description: "Renewable/low-carbon/zero-carbon energy options during construction",
        actions: "Use battery powered or hybrid construction equipment. Source electricity from renewable providers.",
        defaultPriority: 3
      }
    ]
  },
  carbon_offsetting: {
    title: "Carbon Offsetting",
    items: [
      {
        id: "emissions_reduction_no_storage",
        item: "Emissions reduction without storage",
        description: "Emissions reduction without storage",
        actions: "Replace high-emission fuels with certified low-carbon alternatives. Implement low-emission zones for supplier deliveries.",
        defaultPriority: 3
      },
      {
        id: "emissions_reduction_short_storage",
        item: "Emissions reduction with short-term storage",
        description: "Emissions reduction with short-term storage",
        actions: "Employ temporary green infrastructure.",
        defaultPriority: 2
      },
      {
        id: "emissions_reduction_long_storage",
        item: "Emissions reduction with long-term storage",
        description: "Explore options for CCS through selecting suppliers.",
        actions: "Track carbon performance through Life cycle assessments.",
        defaultPriority: 3
      },
      {
        id: "carbon_removal_short_storage",
        item: "Carbon removal with short-term storage",
        description: "Carbon removal with short-term storage",
        actions: "Plant trees and shrubs to capture CO2. Improve soil in plant to store carbon.",
        defaultPriority: 2
      },
      {
        id: "carbon_removal_long_storage",
        item: "Carbon removal with long-term storage",
        description: "Carbon removal with long-term storage",
        actions: "Use natural materials to store Carbon. Implement reforestation projects with long-term protection.",
        defaultPriority: 3
      },
      {
        id: "net_positive_energy",
        item: "Net Positive Energy Infrastructure",
        description: "Net Positive Energy Infrastructure",
        actions: "Integrate solar/wind with battery storage and feed-in agreements.",
        defaultPriority: 2
      },
      {
        id: "carbon_sequestration",
        item: "Carbon Sequestration Integration",
        description: "Carbon Sequestration Integration",
        actions: "Biochar in soils, algae facades, afforestation, regenerative groundworks using composted soils.",
        defaultPriority: 3
      },
      {
        id: "carbon_offsetting_general",
        item: "Carbon Offsetting",
        description: "Carbon Offsetting",
        actions: "Identify opportunities for Carbon reduction / offsetting on project and discuss with client where potential identified.",
        defaultPriority: 1
      }
    ]
  }
};

function AssessmentSection({ section, sectionId, data, onDataChange }) {
  const [responses, setResponses] = useState(() => {
    if (data.responses[sectionId]) {
      return data.responses[sectionId];
    }
    // Default all responses to "no"
    const initial = {};
    section.items.forEach(item => {
      initial[item.id] = "no";
    });
    return initial;
  });
  const [priorities, setPriorities] = useState(() => {
    if (data.priorities[sectionId]) {
      return data.priorities[sectionId];
    }
    const initial = {};
    section.items.forEach(item => {
      initial[item.id] = item.defaultPriority;
    });
    return initial;
  });

  useEffect(() => {
    // Count mandatory and non-mandatory items (excluding N/A)
    let mandatoryTotal = 0;
    let mandatoryYes = 0;
    let nonMandatoryTotal = 0;
    let nonMandatoryYes = 0;
    
    section.items.forEach(item => {
      if (responses[item.id] !== "not_applicable") {
        if (priorities[item.id] === 1) {
          mandatoryTotal++;
          if (responses[item.id] === "yes") {
            mandatoryYes++;
          }
        } else {
          nonMandatoryTotal++;
          if (responses[item.id] === "yes") {
            nonMandatoryYes++;
          }
        }
      }
    });
    
    // Calculate score: Mandatory = 40%, Non-Mandatory = 60%
    let totalScore = 0;
    
    if (mandatoryTotal > 0) {
      totalScore += (mandatoryYes / mandatoryTotal) * MANDATORY_WEIGHT;
    }
    
    if (nonMandatoryTotal > 0) {
      totalScore += (nonMandatoryYes / nonMandatoryTotal) * NON_MANDATORY_WEIGHT;
    }
    
    // If only mandatory items exist (no non-mandatory), scale to 100%
    if (mandatoryTotal > 0 && nonMandatoryTotal === 0) {
      totalScore = (mandatoryYes / mandatoryTotal) * 100;
    }
    
    // If only non-mandatory items exist (no mandatory), scale to 100%
    if (mandatoryTotal === 0 && nonMandatoryTotal > 0) {
      totalScore = (nonMandatoryYes / nonMandatoryTotal) * 100;
    }

    onDataChange(prev => ({
      ...prev,
      responses: { ...prev.responses, [sectionId]: responses },
      priorities: { ...prev.priorities, [sectionId]: priorities },
      scores: { ...prev.scores, [sectionId]: totalScore }
    }));
  }, [responses, priorities, section.items, sectionId, onDataChange]);

  const handleResponseChange = (itemId, value) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const calculateTotal = () => {
    let mandatoryTotal = 0;
    let mandatoryYes = 0;
    let nonMandatoryTotal = 0;
    let nonMandatoryYes = 0;
    
    section.items.forEach(item => {
      if (responses[item.id] !== "not_applicable") {
        if (priorities[item.id] === 1) {
          mandatoryTotal++;
          if (responses[item.id] === "yes") {
            mandatoryYes++;
          }
        } else {
          nonMandatoryTotal++;
          if (responses[item.id] === "yes") {
            nonMandatoryYes++;
          }
        }
      }
    });
    
    let totalScore = 0;
    
    if (mandatoryTotal > 0 && nonMandatoryTotal > 0) {
      totalScore = (mandatoryYes / mandatoryTotal) * MANDATORY_WEIGHT + 
                   (nonMandatoryYes / nonMandatoryTotal) * NON_MANDATORY_WEIGHT;
    } else if (mandatoryTotal > 0) {
      totalScore = (mandatoryYes / mandatoryTotal) * 100;
    } else if (nonMandatoryTotal > 0) {
      totalScore = (nonMandatoryYes / nonMandatoryTotal) * 100;
    }
    
    return totalScore.toFixed(2);
  };

  return (
    <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{section.title}</CardTitle>
          <Badge className="bg-emerald-600 text-white text-lg py-2 px-4">
            Total: {calculateTotal()}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-32">Item</TableHead>
                <TableHead className="w-1/4">Description</TableHead>
                <TableHead className="w-1/3">Actions</TableHead>
                <TableHead className="text-center w-40">
                  <div className="flex items-center justify-center gap-1">
                    Priority
                    <Lock className="w-3 h-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="text-center w-32">Response</TableHead>
                <TableHead className="text-center w-24">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...section.items].sort((a, b) => a.defaultPriority - b.defaultPriority).map((item) => {
                const priority = priorities[item.id] || item.defaultPriority;
                const response = responses[item.id] || "";
                const priorityData = priorityScores[priority] || priorityScores[2];
                
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
                      <div className="flex items-center justify-center gap-1">
                        <Badge className={`${priorityData.color} border text-xs`}>
                          {priority} - {priorityData.label}
                        </Badge>
                        <Lock className="w-3 h-3 text-gray-300" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={response}
                        onValueChange={(value) => handleResponseChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full border-emerald-200">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="not_applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={response === "yes" ? "default" : "outline"}
                        className={response === "yes" ? "bg-emerald-600 text-white" : response === "not_applicable" ? "border-gray-300 text-gray-400" : "border-gray-300 text-gray-500"}
                      >
                        {response === "not_applicable" ? "N/A" : response === "yes" ? "✓" : "-"}
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
  );
}

export default function EnergyCarbonManagement({ data, onDataChange, onNext }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
            <p className="text-sm text-gray-700 mt-2">
              <strong>Note:</strong> Mandatory items (Priority 1) constitute 40% of the subcategory score. Best Practice and Stretch Goal items make up the remaining 60%. Items marked as "Not Applicable" are excluded from calculations. Priority values are locked.
            </p>
          </div>
        </div>
      </div>

      {Object.entries(assessmentSections).map(([sectionId, section]) => (
        <AssessmentSection 
          key={sectionId} 
          section={section} 
          sectionId={sectionId}
          data={data}
          onDataChange={onDataChange}
        />
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          Next: Water Management
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}