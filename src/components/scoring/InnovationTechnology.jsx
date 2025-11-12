
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
        id: "digital_twin",
        item: "Digital Twin Integration",
        description: "Use real-time data and modelling to improve asset performance.",
        actions: "Link BIM with IoT sensors to track conditions; simulate asset use scenarios; apply to predictive maintenance and performance optimisation.",
        defaultPriority: 3
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
        defaultPriority: 2
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
        id: "prefabrication",
        item: "Prefabrication",
        description: "Implement modern construction techniques in design phase, including modular design, pre-cast solutions or 3D-printed sections to reduce waste, energy consumption and site pollution.",
        actions: "Design components for modular/precast/off-site fabrication. Conduct DFMA (Design for Manufacture and Assembly) reviews. Minimise on-site wet trades and emissions.",
        defaultPriority: 2
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
        defaultPriority: 3
      },
      {
        id: "self_healing_concrete",
        item: "Self-healing concrete",
        description: "Explore the options and assess the feasibility of using self-healing concrete to promote structure lifespans.",
        actions: "Specify self-healing mixes for key durability zones (e.g., basements, retaining walls). Collaborate with research institutions for pilot trials. Monitor performance over life-cycle.",
        defaultPriority: 3
      },
      {
        id: "robotics",
        item: "Robotics",
        description: "Explore options to implement robots in the construction stage, substituting humans in carrying out repetitive or hazardous tasks.",
        actions: "Use robots for repetitive or hazardous tasks (rebar tying, inspection, concrete printing). Evaluate cost-benefit and safety improvements. Integrate with BIM for task automation.",
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
  }, [responses, priorities, section.items, sectionId, onDataChange]);

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
    return 0;
  };

  const calculateTotal = () => {
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

export default function InnovationTechnology({ data, onDataChange }) {
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
