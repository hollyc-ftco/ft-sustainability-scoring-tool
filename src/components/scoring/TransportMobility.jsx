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
  transport_options: {
    title: "Sustainable Transport Options",
    items: [
      {
        id: "relationship_transport_network",
        item: "Relationship to the transport network",
        description: "In the case of a transport project, the project provides improved levels of service and extends to all modes in a way that delivers improved integration. In the case of a non-transport project, the site has been selected because the project does not require new transport infrastructure or mainly makes use of public transport systems.",
        actions: "Conduct transport integration assessment. Select sites with proximity to public transport. Optimise connectivity to reduce need for new road infrastructure. Use Accessibility & Integration Scoring (e.g. PTAL or similar). Map journey times to key services (schools, shops, jobs) by sustainable modes.",
        defaultPriority: 2
      },
      {
        id: "access_pedestrians_cyclists",
        item: "Access for pedestrians and cyclists",
        description: "There has been a consideration given to the ability of pedestrians and cyclists to pass through the site on dedicated paths and to establish links with existing and proposed routes to local services.",
        actions: "Design segregated pedestrian/cycle routes. Ensure safe crossings and continuity with local paths. Include secure cycle storage and rest facilities. Provide secure, covered cycle parking and showers at key access nodes. Ensure safe paths to nearby schools and community areas.",
        defaultPriority: 1
      },
      {
        id: "active_travel_prioritisation",
        item: "Active travel prioritisation",
        description: "In the case of a transport project, design has been carried out in accordance with the guidelines given by DMURS, prioritising pedestrians, cyclists and public transport over drivers.",
        actions: "Apply DMURS hierarchy (pedestrians > cyclists > public transport > cars). Minimise vehicle carriageway widths. Provide shared spaces and priority crossings. Ensure compliance with TII's Rural Cycleway Design guidance (for regional roads). Include raised crossings and reduced vehicle speeds (<30km/h) in shared zones.",
        defaultPriority: 1
      },
      {
        id: "need_additional_infrastructure",
        item: "Need for additional transport infrastructure",
        description: "The project does not require the provision of, or increase the need for additional transport infrastructure.",
        actions: "Undertake a transport needs analysis to justify existing capacity. Promote modal shift to reduce new infrastructure demand. Use mobility hubs or shared mobility options where feasible.",
        defaultPriority: 2
      },
      {
        id: "mode_shift_strategy",
        item: "Mode Shift Strategy",
        description: "Plan to reduce private vehicle use and increase active/public transport use.",
        actions: "Develop a mode shift plan targeting reduced car use; include incentives for walking/cycling; ensure PT stops are within 400m of site access.",
        defaultPriority: 2
      },
      {
        id: "transport_demand_management",
        item: "Transport Demand Management",
        description: "Minimise congestion and parking demand by managing transport demand.",
        actions: "Limit parking provision; prioritise shared mobility; implement workplace travel planning or congestion mitigation strategies.",
        defaultPriority: 2
      },
      {
        id: "low_emission_infrastructure",
        item: "Low/Zero Emission Transport Infrastructure",
        description: "Provide infrastructure for electric and low-emission transport.",
        actions: "Install EV charging points, bike storage, e-bike charging; allow for future expansion of EV capacity via passive provision.",
        defaultPriority: 2
      },
      {
        id: "enhanced_operational_outcomes",
        item: "Enhanced operational transport outcomes",
        description: "Designers have worked beyond the standards to deliver enhanced operational transport outcomes.",
        actions: "Use smart signals or traffic-calming measures to improve flow and safety. Implement real-time travel info systems. Design for reduced travel times and congestion.",
        defaultPriority: 2
      },
      {
        id: "resilience",
        item: "Resilience",
        description: "The resilience and recovery of the transport network has been considered during the design process.",
        actions: "Incorporate flood-resistant designs and diversion routes. Design with materials and layouts that recover quickly after disruption. Stress-test the network using climate scenarios. Perform risk assessments using TII climate adaptation datasets. Provide alternative access during high-risk events (e.g. flood bypass routes).",
        defaultPriority: 2
      },
      {
        id: "adaptability",
        item: "Adaptability",
        description: "The design delivers a transport network with improved ability to accommodate future change.",
        actions: "Allow for future expansion of cycle/public transport lanes. Integrate ducting/conduits for future smart infrastructure. Include modular/upgradeable infrastructure where feasible.",
        defaultPriority: 2
      },
      {
        id: "regenerative_corridors",
        item: "Regenerative Mobility Corridors",
        description: "Transport infrastructure that doubles as ecological and community revitalisation corridors.",
        actions: "Combine walking/cycling routes with pollinator strips, food forests, and natural play areas.",
        defaultPriority: 2
      },
      {
        id: "low_impact_access",
        item: "Low-Impact Access Integration",
        description: "Design for access that minimises ecosystem disturbance while enhancing human-nature connection.",
        actions: "Elevated walkways, boardwalks, and sensory nature trails that reduce habitat fragmentation.",
        defaultPriority: 2
      }
    ]
  },
  mobility_all: {
    title: "Mobility for All",
    items: [
      {
        id: "transport_effects_completed",
        item: "Transport effects of the completed project",
        description: "The project team has considered and incorporated measures that reduce relevant, transport related impacts of the completed project on the local community.",
        actions: "Assess and mitigate severance, noise, air quality and congestion. Provide improved signage, crossings, and drop-off zones. Use traffic modelling to assess community impacts.",
        defaultPriority: 1
      },
      {
        id: "community_consultation",
        item: "Community consultation on the design objectives",
        description: "The community affected by the project has been involved in specifying the design objectives.",
        actions: "Conduct public consultation events. Engage specific user groups (e.g. mobility-impaired, cyclists). Reflect outcomes in final design documentation.",
        defaultPriority: 2
      },
      {
        id: "performance_non_motorized",
        item: "Performance for non-motorized users",
        description: "The project team has provided measures that improve the level of performance for non-motorised users.",
        actions: "Include continuous, safe walking/cycling infrastructure. Prioritise pedestrian journey quality (shade, seating, crossings). Conduct walkability audits.",
        defaultPriority: 2
      },
      {
        id: "inclusion",
        item: "Inclusion",
        description: "Consideration was given to accommodating children, elderly people, people with disabilities, buggies, etc. to use the new infrastructure.",
        actions: "Design to universal accessibility standards (e.g. tactile paving, gradients). Provide rest points and visual cues. Ensure access to all transport modes for all users. Audit all infrastructure for compliance with universal design standards. Include tactile paving, audio signals, level access, and wide pathways.",
        defaultPriority: 2
      }
    ]
  },
  construction_logistics: {
    title: "Construction Logistics",
    items: [
      {
        id: "planning_construction_traffic",
        item: "Planning construction traffic movements",
        description: "Construction traffic movements have been considered by the project team prior to the construction stage commencing.",
        actions: "Consider Construction Traffic Management.",
        defaultPriority: 1
      },
      {
        id: "transport_effects_construction",
        item: "Transport effects of construction activities",
        description: "The project team has incorporated measures that deliver improved performance on ease of use of signs and other communications, reductions of available parking spaces, reduced congestion, reducing severance.",
        actions: "Use VMS signage and community noticeboards. Temporarily reallocate parking and pedestrian zones. Manage peak hour activity to reduce congestion.",
        defaultPriority: 2
      },
      {
        id: "movement_construction_materials",
        item: "Movement of construction materials",
        description: "The project team has considered possible use of other, more sustainable transport routes, such as rail and water for the movement of construction materials/waste.",
        actions: "Explore use of nearby rail/water freight options. Maximise backhauling and material consolidation. Reduce on-site storage by just-in-time deliveries.",
        defaultPriority: 2
      },
      {
        id: "workforce_travel_planning",
        item: "Workforce travel planning",
        description: "There is a travel plan aimed at an appropriate balance of effectiveness for the travellers, and at minimising adverse environmental and social impacts associated with the travel involved.",
        actions: "Develop workforce travel plan with carpooling, cycling incentives, shuttle services. Provide secure bike parking and facilities on-site. Encourage public transport through subsidised passes.",
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

export default function TransportMobility({ data, onDataChange, onNext, isAdmin = false, customSections, onUpdateSections }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const sections = customSections || assessmentSections;

  const handleEditItem = (sectionId, item) => {
    setEditingSectionId(sectionId);
    setEditingItem(item);
    setIsNewItem(false);
    setEditorOpen(true);
  };

  const handleAddItem = (sectionId) => {
    setEditingSectionId(sectionId);
    setEditingItem(null);
    setIsNewItem(true);
    setEditorOpen(true);
  };

  const handleDeleteItem = (sectionId, itemId) => {
    if (!onUpdateSections) return;
    const updatedSections = { ...sections };
    updatedSections[sectionId] = {
      ...updatedSections[sectionId],
      items: updatedSections[sectionId].items.filter(item => item.id !== itemId)
    };
    onUpdateSections(updatedSections);
  };

  const handleSaveItem = (savedItem) => {
    if (!onUpdateSections) return;
    const updatedSections = { ...sections };
    if (isNewItem) {
      updatedSections[editingSectionId] = {
        ...updatedSections[editingSectionId],
        items: [...updatedSections[editingSectionId].items, savedItem]
      };
    } else {
      updatedSections[editingSectionId] = {
        ...updatedSections[editingSectionId],
        items: updatedSections[editingSectionId].items.map(item => 
          item.id === savedItem.id ? savedItem : item
        )
      };
    }
    onUpdateSections(updatedSections);
  };

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
              <strong>Note:</strong> Mandatory items (Priority 1) constitute 40% of the subcategory score. Best Practice and Stretch Goal items make up the remaining 60%. Items marked as "Not Applicable" are excluded from calculations. {!isAdmin && "Priority values are locked."}
            </p>
          </div>
        </div>
      </div>

      {Object.entries(sections).map(([sectionId, section]) => (
        <AssessmentSection 
          key={sectionId} 
          section={section} 
          sectionId={sectionId}
          data={data}
          onDataChange={onDataChange}
          isAdmin={isAdmin}
          onEditItem={handleEditItem}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
        />
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          className="bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          Next: Social Impact & Wellbeing
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <AdminItemEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        item={editingItem}
        onSave={handleSaveItem}
        isNew={isNewItem}
      />
    </div>
  );
}