
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
import { Info } from "lucide-react";

const priorityScores = {
  1: { label: "Mandatory", score: 1, color: "bg-red-100 text-red-800 border-red-200" },
  2: { label: "Best Practice", score: 0.6, color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Stretch Goal", score: 0.3, color: "bg-green-100 text-green-800 border-green-200" }
};

export const assessmentSections = {
  transport_options: {
    title: "Sustainable Transport Options",
    items: [
      {
        id: "transport_integration",
        item: "Conduct transport integration assessment",
        description: "In the case of a transport project, the project provides improved levels of service and extends to all modes in a way that delivers improved integration. In the case of a non-transport project, the site has been selected because the project does not require new transport infrastructure or mainly makes use of public transport systems.",
        actions: "Select sites with proximity to public transport. Optimise connectivity to reduce need for new road infrastructure. Use Accessibility & Integration Scoring (e.g. PTAL or similar). Map journey times to key services (schools, shops, jobs) by sustainable modes.",
        defaultPriority: 1
      },
      {
        id: "pedestrian_cyclist_routes",
        item: "Design segregated pedestrian/cycle routes",
        description: "There has been a consideration given to the ability of pedestrians and cyclists to pass through the site on dedicated paths and to establish links with existing and proposed routes to local services.",
        actions: "Ensure safe crossings and continuity with local paths. Include secure cycle storage and rest facilities. Provide secure, covered cycle parking and showers at key access nodes. Ensure safe paths to nearby schools and community areas.",
        defaultPriority: 1
      },
      {
        id: "dmurs_hierarchy",
        item: "Apply DMURS hierarchy (pedestrians > cyclists > public transport > cars)",
        description: "In the case of a transport project, design has been carried out in accordance with the guidelines given by DMURS, prioritising pedestrians, cyclists and public transport over drivers.",
        actions: "Minimise vehicle carriageway widths. Provide shared spaces and priority crossings. Ensure compliance with TII's Rural Cycleway Design guidance (for regional roads). Include raised crossings and reduced vehicle speeds (<30km/h) in shared zones.",
        defaultPriority: 1
      },
      {
        id: "transport_needs_analysis",
        item: "Undertake a transport needs analysis to justify existing capacity",
        description: "The project does not require the provision of, or increase the need for additional transport infrastructure.",
        actions: "Promote modal shift to reduce new infrastructure demand. Use mobility hubs or shared mobility options where feasible",
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
        id: "smart_signals",
        item: "Use smart signals or traffic-calming measures to improve flow and safety",
        description: "Designers have worked beyond the standards to deliver enhanced operational transport outcomes.",
        actions: "Implement real-time travel info systems. Design for reduced travel times and congestion",
        defaultPriority: 2
      },
      {
        id: "flood_resistant_design",
        item: "Incorporate flood-resistant designs and diversion routes",
        description: "The resilience and recovery of the transport network has been considered during the design process.",
        actions: "Design with materials and layouts that recover quickly after disruption. Stress-test the network using climate scenarios. Perform risk assessments using TII climate adaptation datasets. Provide alternative access during high-risk events (e.g. flood bypass routes).",
        defaultPriority: 2
      },
      {
        id: "adaptability",
        item: "Allow for future expansion of cycle/public transport lanes",
        description: "The design delivers a transport network with improved ability to accommodate future change.",
        actions: "Integrate ducting/conduits for future smart infrastructure. Include modular/upgradeable infrastructure where feasible.",
        defaultPriority: 2
      },
      {
        id: "regenerative_corridors",
        item: "Regenerative Mobility Corridors",
        description: "Transport infrastructure that doubles as ecological and community revitalisation corridors.",
        actions: "Combine walking/cycling routes with pollinator strips, food forests, and natural play areas.",
        defaultPriority: 3
      },
      {
        id: "low_impact_access",
        item: "Low-Impact Access Integration",
        description: "Design for access that minimises ecosystem disturbance while enhancing human-nature connection.",
        actions: "Elevated walkways, boardwalks, and sensory nature trails that reduce habitat fragmentation.",
        defaultPriority: 3
      }
    ]
  },
  mobility_all: {
    title: "Mobility for All",
    items: [
      {
        id: "transport_effects_completed",
        item: "Assess and mitigate severance, noise, air quality and congestion",
        description: "The project team has considered and incorporated measures that reduce relevant, transport related impacts of the completed project on the local community.",
        actions: "Provide improved signage, crossings, and drop-off zones. Use traffic modelling to assess community impacts.",
        defaultPriority: 1
      },
      {
        id: "community_consultation",
        item: "Conduct public consultation events",
        description: "The community affected by the project has been involved in specifying the design objectives.",
        actions: "Engage specific user groups (e.g. mobility-impaired, cyclists). Reflect outcomes in final design documentation.",
        defaultPriority: 2
      },
      {
        id: "walking_cycling_infrastructure",
        item: "Include continuous, safe walking/cycling infrastructure",
        description: "The project team has provided measures that improve the level of performance for non-motorised users.",
        actions: "Prioritise pedestrian journey quality (shade, seating, crossings). Conduct walkability audits.",
        defaultPriority: 1
      },
      {
        id: "universal_accessibility",
        item: "Design to universal accessibility standards (e.g. tactile paving, gradients)",
        description: "Consideration was given to accommodating children, elderly people, people with disabilities, buggies, etc. to use the new infrastructure.",
        actions: "Provide rest points and visual cues. Ensure access to all transport modes for all users. Audit all infrastructure for compliance with universal design standards. Include tactile paving, audio signals, level access, and wide pathways.",
        defaultPriority: 1
      }
    ]
  },
  construction_logistics: {
    title: "Transportation Carbon Impact",
    items: [
      {
        id: "ctmp",
        item: "Develop Construction Traffic Management Plan (CTMP)",
        description: "Construction traffic movements have been reviewed by the project team prior to the construction stage commencing.",
        actions: "Schedule deliveries outside peak hours. Use route restrictions and monitoring systems",
        defaultPriority: 1
      },
      {
        id: "transport_effects_construction",
        item: "Use VMS signage and community noticeboards",
        description: "The project team has incorporated measures that deliver improved performance on ease of use of signs and other communications, reductions of available parking spaces, reduced congestion, reducing severance.",
        actions: "Temporarily reallocate parking and pedestrian zones. Manage peak hour activity to reduce congestion",
        defaultPriority: 2
      },
      {
        id: "vulnerable_road_users",
        item: "Implement CLOCS or equivalent standards",
        description: "The project team has incorporated measures that improve safety for vulnerable road users.",
        actions: "Use trained banksmen, 360-degree cameras, and vehicle signage. Design temporary crossings and protection zones",
        defaultPriority: 1
      },
      {
        id: "sustainable_transport_routes",
        item: "Explore use of nearby rail/water freight options",
        description: "The project team has considered possible use of other, more sustainable transport routes, such as rail and water for the movement of construction materials/ waste.",
        actions: "Maximise backhauling and material consolidation. Reduce on-site storage by just-in-time deliveries",
        defaultPriority: 2
      },
      {
        id: "workforce_travel_plan",
        item: "Develop workforce travel plan with carpooling, cycling incentives, shuttle services",
        description: "There is a travel plan aimed at an appropriate balance of effectiveness for the travellers, and at at minimising adverse environmental and social impacts associated with the travel involved.",
        actions: "Provide secure bike parking and facilities on-site. Encourage public transport through subsidised passes",
        defaultPriority: 2
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
    let sumActualScores = 0;
    let sumPriorityScores = 0;
    
    section.items.forEach(item => {
      if (responses[item.id] !== "not_applicable") {
        sumPriorityScores += priorityScores[priorities[item.id]].score;
        
        if (responses[item.id] === "yes") {
          sumActualScores += priorityScores[priorities[item.id]].score;
        }
      }
    });
    
    const totalScore = sumPriorityScores === 0 ? 0 : (sumActualScores / sumPriorityScores) * 100;

    onDataChange(prev => ({
      ...prev,
      responses: { ...prev.responses, [sectionId]: responses },
      priorities: { ...prev.priorities, [sectionId]: priorities },
      scores: { ...prev.scores, [sectionId]: totalScore }
    }));
  }, [responses, priorities, section.items, sectionId, onDataChange]); // Added dependencies to useEffect

  const handleResponseChange = (itemId, value) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handlePriorityChange = (itemId, priority) => {
    setPriorities(prev => ({
      ...prev,
      [itemId]: parseInt(priority)
    }));
  };

  const calculateScore = (itemId) => {
    if (responses[itemId] === "yes") {
      return priorityScores[priorities[itemId]].score;
    }
    // If response is "no" or empty, score is 0. If "not_applicable", it's handled by total calculation.
    return 0; 
  };

  const calculateTotal = () => {
    let sumActualScores = 0;
    let sumPriorityScores = 0;
    
    section.items.forEach(item => {
      if (responses[item.id] !== "not_applicable") { // Only consider items that are not "not_applicable" for the denominator
        sumPriorityScores += priorityScores[priorities[item.id]].score;
        
        if (responses[item.id] === "yes") { // Only count "yes" responses for the numerator
          sumActualScores += priorityScores[priorities[item.id]].score;
        }
      }
    });
    
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
                <TableHead className="text-center w-32">Response</TableHead>
                <TableHead className="text-center w-24">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {section.items.map((item) => {
                const score = calculateScore(item.id);
                const priority = priorities[item.id];
                const response = responses[item.id] || "";
                
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
                      <Select
                        value={response}
                        onValueChange={(value) => handleResponseChange(item.id, value)}
                      >
                        <SelectTrigger className="w-full border-emerald-200">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem> {/* Added 'No' option */}
                          <SelectItem value="not_applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={response === "yes" ? "default" : "outline"}
                        className={response === "yes" ? "bg-emerald-600 text-white" : response === "not_applicable" ? "border-gray-300 text-gray-400" : "border-gray-300 text-gray-500"}
                      >
                        {response === "not_applicable" ? "N/A" : score.toFixed(1)}
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

export default function TransportMobility({ data, onDataChange }) {
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
              <strong>Note:</strong> Items marked as "Not Applicable" are excluded from the total score calculation.
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
    </div>
  );
}
