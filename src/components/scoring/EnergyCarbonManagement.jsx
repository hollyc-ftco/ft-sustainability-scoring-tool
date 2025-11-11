import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Info } from "lucide-react";

const priorityScores = {
  1: { label: "Mandatory", score: 1, color: "bg-red-100 text-red-800 border-red-200" },
  2: { label: "Best Practice", score: 0.6, color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Stretch Goal", score: 0.3, color: "bg-green-100 text-green-800 border-green-200" }
};

export const assessmentSections = {
  energy_reduction: {
    title: "Energy Use Reduction",
    items: [
      {
        id: "energy_carbon_operation",
        item: "Energy and carbon emissions reduction for operation",
        description: "Has the design considered options for reducing both the carbon emissions and the energy consumption of the project during operation? Have measures been implemented to achieve reductions?",
        actions: "Incorporate renewable energy sources. Use high-efficiency lighting (LEDs) and low-energy HVAC systems. Implement passive design strategies. Install energy monitoring systems for ongoing performance tracking.",
        defaultPriority: 1
      },
      {
        id: "energy_construction_design",
        item: "Energy consumption during construction - consideration during design",
        description: "Identify opportunities and implement measures to reduce the energy consumption of the project during construction phase. Devise strategy to monitor these measures.",
        actions: "Develop a CEMP with reduction targets. Choose construction methods that minimise energy use on site. Include energy performance as a selection criterion in contractor procurement. Monitor site energy use with sub-meters and adjust practices accordingly.",
        defaultPriority: 2
      },
      {
        id: "construction_plant",
        item: "Construction plant",
        description: "The selection of the construction plant has been influenced by consideration of energy efficiency and carbon emissions. The equipment has been maintained to maximise fuel efficiency and minimise carbon emissions.",
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
        description: "Assess carbon across the full life cycle of the asset, including embodied, operational, maintenance and end-of-life emissions.",
        actions: "Conduct Life Cycle Assessment (LCA) using EN 15978 or similar; report embodied carbon using PAS 2080 framework; iterate design based on carbon hotspots.",
        defaultPriority: 1
      },
      {
        id: "carbon_benchmarking",
        item: "Carbon Benchmarking & Target-Setting",
        description: "Use baselines and targets to drive carbon reductions.",
        actions: "Set carbon intensity targets (e.g. tCO₂e/km or per m²); use project carbon budgets and monitor performance through design and construction.",
        defaultPriority: 2
      },
      {
        id: "circular_energy_design",
        item: "Circular Energy Design",
        description: "Design infrastructure to support future energy recovery or flexibility.",
        actions: "Allow for decentralised energy sources, energy sharing infrastructure (e.g. smart grids), or reuse of heat (e.g. from data centres).",
        defaultPriority: 3
      },
      {
        id: "zero_carbon_roadmap",
        item: "Zero Carbon Roadmap",
        description: "Plan for transition to net-zero.",
        actions: "Develop project-specific net-zero pathways including residual carbon offsetting strategy; integrate with organisational carbon goals.",
        defaultPriority: 2
      }
    ]
  },
  renewable_energy: {
    title: "Renewable Energy Integration",
    items: [
      {
        id: "renewable_operational",
        item: "Renewable/low-carbon/zero-carbon energy options within operational phase",
        description: "Explore opportunities and implement measures to reduce the operational carbon footprint of the project.",
        actions: "Integrate solar panels, PV arrays ground-source heat pumps.",
        defaultPriority: 1
      },
      {
        id: "renewable_construction",
        item: "Renewable/low-carbon/zero-carbon energy options during construction",
        description: "Energy from renewable/low-carbon/zero-carbon resources has been considered and a percentage of savings from the considerations has been implemented.",
        actions: "Use battery powered or hybrid construction equipment. Source electricity from renewable providers.",
        defaultPriority: 2
      }
    ]
  },
  carbon_offsetting: {
    title: "Carbon Offsetting",
    items: [
      {
        id: "emissions_reduction_no_storage",
        item: "Emissions reduction without storage",
        description: "Filter, capture or break down greenhouse gases when emitted, preventing them to reach the atmosphere.",
        actions: "Replace high-emission fuels with certified low-carbon alternatives. Implement low-emission zones for supplier deliveries.",
        defaultPriority: 2
      },
      {
        id: "emissions_reduction_short_storage",
        item: "Emissions reduction with short-term storage",
        description: "Avoid damage to ecosystems, minimise habitat destruction and tree-clearing.",
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
        description: "Consider and implement reforestation, soil carbon enhancement and ecosystem restoration practices as part of project scope.",
        actions: "Plant trees and shrubs to capture CO2. Improve soil in plant to store carbon.",
        defaultPriority: 2
      },
      {
        id: "carbon_removal_long_storage",
        item: "Carbon removal with long-term storage",
        description: "Explore options to implement long-term carbon storage through innovative technologies, including DACCS, BECCS, mineralisation, etc.",
        actions: "Use natural materials to store Carbon. Implement reforestation projects with long-term protection.",
        defaultPriority: 3
      },
      {
        id: "net_positive_energy",
        item: "Net Positive Energy Infrastructure",
        description: "Generate more renewable energy than the project consumes over its lifecycle.",
        actions: "Integrate solar/wind with battery storage and feed-in agreements.",
        defaultPriority: 3
      },
      {
        id: "carbon_sequestration",
        item: "Carbon Sequestration Integration",
        description: "Embed carbon-sequestering landscapes or structures into the project.",
        actions: "Biochar in soils, algae facades, afforestation, regenerative groundworks using composted soils.",
        defaultPriority: 3
      }
    ]
  }
};

function AssessmentSection({ section, sectionId, data, onDataChange }) {
  const [responses, setResponses] = useState(data.responses[sectionId] || {});
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
    const sumActualScores = section.items.reduce((total, item) => {
      const score = responses[item.id] ? priorityScores[priorities[item.id]].score : 0;
      return total + score;
    }, 0);
    
    const sumPriorityScores = section.items.reduce((total, item) => {
      return total + priorityScores[priorities[item.id]].score;
    }, 0);
    
    const totalScore = sumPriorityScores === 0 ? 0 : (sumActualScores / sumPriorityScores) * 100;

    onDataChange(prev => ({
      ...prev,
      responses: { ...prev.responses, [sectionId]: responses },
      priorities: { ...prev.priorities, [sectionId]: priorities },
      scores: { ...prev.scores, [sectionId]: totalScore }
    }));
  }, [responses, priorities]);

  const handleCheckboxChange = (itemId, checked) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: checked
    }));
  };

  const handlePriorityChange = (itemId, priority) => {
    setPriorities(prev => ({
      ...prev,
      [itemId]: parseInt(priority)
    }));
  };

  const calculateScore = (itemId) => {
    if (responses[itemId]) {
      return priorityScores[priorities[itemId]].score;
    }
    return 0;
  };

  const calculateTotal = () => {
    const sumActualScores = section.items.reduce((total, item) => {
      return total + calculateScore(item.id);
    }, 0);
    
    const sumPriorityScores = section.items.reduce((total, item) => {
      return total + priorityScores[priorities[item.id]].score;
    }, 0);
    
    if (sumPriorityScores === 0) return "0.00";
    
    return ((sumActualScores / sumPriorityScores) * 100).toFixed(2);
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
                <TableHead className="text-center w-40">Priority</TableHead>
                <TableHead className="text-center w-24">Yes/No</TableHead>
                <TableHead className="text-center w-24">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.items.map((item) => {
                const score = calculateScore(item.id);
                const priority = priorities[item.id];
                
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
                      <Select
                        value={priority.toString()}
                        onValueChange={(value) => handlePriorityChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full border-emerald-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs">
                                1 - Mandatory
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                                2 - Best Practice
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="3">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs">
                                3 - Stretch Goal
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
  );
}

export default function EnergyCarbonManagement({ data, onDataChange }) {
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
    </div>
  );
}