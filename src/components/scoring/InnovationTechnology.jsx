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
  1: { label: "Mandatory", score: 1, color: "bg-red-100 text-red-800 border-red-200" },
  2: { label: "Best Practice", score: 0.6, color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Stretch Goal", score: 0.3, color: "bg-green-100 text-green-800 border-green-200" }
};

// Mandatory items (Priority 1) = 40% of total score
// Best Practice (Priority 2) + Stretch Goal (Priority 3) = 60% of total score
const MANDATORY_WEIGHT = 40;
const NON_MANDATORY_WEIGHT = 60;

export const assessmentSections = {
  technology_integration: {
    title: "Technology Integration",
    items: [
      {
        id: "bim",
        item: "BIM",
        description: "Implement Building Information Modelling in design to improve predictability, visualisation, productivity, clash detection and communication within the project teams.",
        actions: "Implement Level 2 BIM or higher for all design and coordination stages. Use BIM for clash detection, material quantification, and 4D/5D modelling. Train staff in common BIM authoring and viewing tools.",
        defaultPriority: 2
      },
      {
        id: "technology_integration",
        item: "Technology Integration",
        description: "Consideration given to technology integration in project design.",
        actions: "Consider the use of technological integrations in the project delivery at kick-off stage.",
        defaultPriority: 1
      },
      {
        id: "digital_twin",
        item: "Digital Twin Integration",
        description: "Use real-time data and modelling to improve asset performance.",
        actions: "Link BIM with IoT sensors to track conditions; simulate asset use scenarios; apply to predictive maintenance and performance optimisation.",
        defaultPriority: 2
      },
      {
        id: "carbon_dashboards",
        item: "Carbon & Resource Dashboards",
        description: "Implement live dashboards for project teams to track carbon, waste, and energy.",
        actions: "Link project management and site reporting to dashboards that visualise KPIs; display on screens in site cabins or client offices.",
        defaultPriority: 2
      },
      {
        id: "drones",
        item: "Drones",
        description: "Use, where appropriate, drones to conduct aerial surveys, mapping, site inspections, promoting safety and efficiency in projects.",
        actions: "Conduct drone surveys for pre-construction site mapping, progress tracking, and inspections. Use drones for topographic modelling and cut/fill analysis. Apply thermal or LIDAR drones for environmental monitoring.",
        defaultPriority: 2
      },
      {
        id: "artificial_intelligence",
        item: "Artificial Intelligence",
        description: "Provide training to utilise AI to undertake tasks including creating drawings, suggesting design options, analysing and filtering data. Follow the developments in AI technologies and identify new area it can be utilised in.",
        actions: "Integrate AI tools for generative design, cost estimation, and risk analysis. Automate data filtering and submittal reviews. Monitor AI developments and trial new tools annually.",
        defaultPriority: 3
      },
      {
        id: "sustainable_materials",
        item: "Sustainable materials",
        description: "Explore options to use classic and emerging sustainable building materials, including sustainable timber, green concrete & steel, ferrock, etc. Follow the developments and market availability of new sustainable materials.",
        actions: "Specify low-carbon or recycled materials (e.g. GGBS, green steel, hempcrete). Vet suppliers for sustainability credentials. Track material embodied carbon through LCA tools.",
        defaultPriority: 2
      },
      {
        id: "resource_management",
        item: "Resource and workforce management software",
        description: "Implement software and solutions for predictive tracking and forecasting for better communication within the team, and a better understanding of the project's life cycle.",
        actions: "Use tools like MS Project, Primavera, or AI-powered dashboards for resource optimisation. Implement real-time labour tracking and forecasting. Integrate time, cost, and material data for full life-cycle analysis.",
        defaultPriority: 2
      },
      {
        id: "xr_ar_vr",
        item: "XR, AR, VR",
        description: "Use, where appropriate, XR, AR, VR for smoother visualization, issue tracking and error prevention, ultimately improving workflow.",
        actions: "Use VR for stakeholder walkthroughs and safety inductions. Apply AR for construction verification and as-built reviews. Use XR headsets for immersive design coordination reviews.",
        defaultPriority: 2
      }
    ]
  },
  green_infrastructure: {
    title: "Green Infrastructure",
    items: [
      {
        id: "natural_areas",
        item: "Natural and semi-natural areas",
        description: "Protect, promote and create green areas with a healthy ecosystem both on large scale by preserving protected areas, river basins, pasture, low-intensity agricultural areas, etc.; and on the local scale by maintaining and creating biodiversity-rich parks, gardens, green roofs, meadows, hedgerows, etc.",
        actions: "Preserve or enhance wetlands, woodlands, and riparian habitats. Include native planting in landscape plans. Avoid fragmentation by minimising footprint on ecologically rich areas.",
        defaultPriority: 2
      },
      {
        id: "green_infrastructure_consideration",
        item: "Green Infrastructure",
        description: "Consideration given to green infrastructure in project design.",
        actions: "Consider the integration of Green Infrastructure into the project at all stages.",
        defaultPriority: 1
      },
      {
        id: "green_network",
        item: "Green infrastructure network",
        description: "Connect existing green infrastructure to promote a network of natural habitats by using corridors.",
        actions: "Create green corridors linking natural habitats across the site. Use green roofs, hedgerows, and planted verges as connectors. Map and align with regional green infrastructure strategies.",
        defaultPriority: 2
      },
      {
        id: "rehabilitation",
        item: "Rehabilitation",
        description: "Enhance and rehabilitate brownfield and derelict sites to promote biodiversity.",
        actions: "Identify brownfield/derelict areas suitable for ecological restoration. Remove contamination and invasive species. Replant with native species and create habitats (ponds, nesting boxes).",
        defaultPriority: 2
      },
      {
        id: "nature_based_solutions",
        item: "Nature-based solutions",
        description: "Substitute, where appropriate, traditional engineering systems and solutions to natural, green alternatives in drainage, flood management, landscaping, etc.",
        actions: "Use SuDS, vegetated swales, green embankments for flood control. Integrate permeable surfaces and green walls. Replace traditional hard drainage with constructed wetlands.",
        defaultPriority: 2
      },
      {
        id: "biomimicry",
        item: "Biomimicry-Inspired Solutions",
        description: "Use nature as mentor, model, and measure.",
        actions: "Apply biomimicry in drainage (e.g., beaver mimicry), ventilation (termite mound strategies), or material design (spider silk analogues).",
        defaultPriority: 3
      },
      {
        id: "living_infrastructure",
        item: "Living Infrastructure Trials",
        description: "Test regenerative systems in real-world project environments.",
        actions: "Trial living walls for air purification, or microbial paving materials that clean stormwater.",
        defaultPriority: 3
      }
    ]
  },
  construction_techniques: {
    title: "Construction Techniques",
    items: [
      {
        id: "innovation",
        item: "Innovation",
        description: "Implement modern construction techniques in design phase, including modular design, pre-cast solutions or 3D-printed sections to reduce waste, energy consumption and site pollution.",
        actions: "Design components for modular/precast/off-site fabrication. Conduct DFMA (Design for Manufacture and Assembly) reviews. Minimise on-site wet trades and emissions.",
        defaultPriority: 2
      },
      {
        id: "construction_techniques_consideration",
        item: "Construction Techniques",
        description: "Consider innovative and sustainable construction techniques at all project stages.",
        actions: "Consider innovative and sustainable construction techniques at all project stages.",
        defaultPriority: 1
      },
      {
        id: "hybrid_concrete",
        item: "Hybrid concrete construction",
        description: "Adopt, when appropriate, hybrid concrete construction in the design plan.",
        actions: "Combine precast and in-situ elements to reduce formwork and speed up works. Apply hybrid decks or frames for sustainability and resilience.",
        defaultPriority: 2
      },
      {
        id: "precast_foundation",
        item: "Precast concrete foundation",
        description: "Consider using precast concrete for foundations, and implement it in design, if appropriate.",
        actions: "Assess ground conditions and design for precast piles or pad foundations. Use precast systems to reduce waste and wet weather delays.",
        defaultPriority: 2
      },
      {
        id: "3d_printing",
        item: "3D printing",
        description: "Explore options to implement 3D-printed elements in structures.",
        actions: "Pilot 3D-printed formwork or structural elements in minor works. Monitor developments for large-scale printable components (e.g., walls, street furniture).",
        defaultPriority: 2
      },
      {
        id: "self_healing_concrete",
        item: "Self-healing concrete",
        description: "Explore the options and assess the feasibility of using self-healing concrete to promote structure lifespans.",
        actions: "Specify self-healing mixes for key durability zones (e.g., basements, retaining walls). Collaborate with research institutions for pilot trials. Monitor performance over life-cycle.",
        defaultPriority: 2
      },
      {
        id: "robotics",
        item: "Robotics",
        description: "Explore options to implement robots in the construction stage, substituting humans in carrying out repetitive or hazardous tasks.",
        actions: "Use robots for repetitive or hazardous tasks (rebar tying, inspection, concrete printing). Evaluate cost-benefit and safety improvements. Integrate with BIM for task automation.",
        defaultPriority: 2
      }
    ]
  }
};

function AssessmentSection({ section, sectionId, data, onDataChange, isAdmin, onEditItem, onAddItem, onDeleteItem }) {
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
                {isAdmin && <TableHead className="w-20">Edit</TableHead>}
                <TableHead className="w-32">Item</TableHead>
                <TableHead className="w-1/4">Description</TableHead>
                <TableHead className="w-1/3">Actions</TableHead>
                <TableHead className="text-center w-40">
                  <div className="flex items-center justify-center gap-1">
                    Priority
                    {!isAdmin && <Lock className="w-3 h-3 text-gray-400" />}
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
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditItem(sectionId, item)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteItem(sectionId, item.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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
                        {!isAdmin && <Lock className="w-3 h-3 text-gray-300" />}
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
              {isAdmin && (
                <TableRow className="bg-blue-50">
                  <TableCell colSpan={isAdmin ? 7 : 6}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddItem(sectionId)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Item
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="bg-emerald-50 font-semibold">
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-right text-lg">
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

export default function InnovationTechnology({ data, onDataChange, onNext }) {
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
          Next: Summary
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}