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
  water_efficiency: {
    title: "Water Efficiency",
    items: [
      {
        id: "embodied_water",
        item: "Embodied water",
        description: "An assessment has been made at design stage considering the embodied water in the construction materials, and the outcomes of the assessment have been implemented.",
        actions: "Construction materials with low water use in production. Conduct Environmental Product Declarations (EPDs) review for water use. Prioritise locally sourced, low-water-intensity materials (e.g., recycled aggregates, FSC timber).",
        defaultPriority: 2
      },
      {
        id: "water_reuse_recycling",
        item: "Water Reuse and Recycling",
        description: "Encourage reuse of greywater and rainwater for non-potable purposes.",
        actions: "Install rainwater harvesting tanks; use recycled water for dust suppression, flushing, or irrigation. Integrate dual plumbing if appropriate.",
        defaultPriority: 2
      },
      {
        id: "water_quality_management",
        item: "Water Quality Management",
        description: "Address runoff pollution risk from the project to protect nearby watercourses and groundwater.",
        actions: "Design SuDS with treatment stages (e.g. swales, detention basins, reed beds). Include pollution control measures in CEMP.",
        defaultPriority: 2
      },
      {
        id: "water_efficiency_design",
        item: "Water Efficiency",
        description: "Consider water efficiency, embodied water and water saving design during design.",
        actions: "Consider water efficiency, embodied water and water saving design during design.",
        defaultPriority: 1
      },
      {
        id: "water_neutrality",
        item: "Water Neutrality Assessment",
        description: "Aim for no net increase in water demand over pre-development baseline.",
        actions: "Conduct pre- and post-development water balance assessment; offset water use through savings or reuse systems.",
        defaultPriority: 2
      },
      {
        id: "drought_resilience",
        item: "Drought Resilience",
        description: "Assess and plan for future water scarcity impacts on asset operation.",
        actions: "Use WRAP and UKWIR guidance to model future supply-demand risk; include high-resilience fixtures and landscaping choices.",
        defaultPriority: 2
      },
      {
        id: "water_consumption_operation",
        item: "Water consumption in operation",
        description: "The potential impacts on water resources of the operation and maintenance of the completed project have been considered and measures for water conservation and water use reduction have been included in the design and incorporated in the works.",
        actions: "Low-flow taps, dual-flush toilets, water-efficient appliances",
        defaultPriority: 2
      },
      {
        id: "water_consumption_construction_client",
        item: "Water consumption during construction - client requirement",
        description: "Requirements to measure, monitor and minimise the consumption of mains or abstracted water during construction have been included in the project brief and the procurement documentation.",
        actions: "Set targets for water use reduction, track and report water use on-site, water meters",
        defaultPriority: 2
      },
      {
        id: "water_consumption_construction_implementation",
        item: "Water consumption during construction - implementation of plans and policies",
        description: "Policies and targets for reducing water usage during construction have been adopted and implemented.",
        actions: "Water-saving devices on site supplies, train workers on water-saving practices",
        defaultPriority: 2
      },
      {
        id: "capturing_runoff",
        item: "Capturing run-off for beneficial use",
        description: "Provisions made for capturing run-off for beneficial use on the project or nearby and these provisions have been incorporated in the completed project.",
        actions: "SuDS, water retention ponds, rain gardens",
        defaultPriority: 2
      }
    ]
  },
  flood_risk: {
    title: "Flood Risk Management",
    items: [
      {
        id: "identify_resilience",
        item: "Identify resilience requirements",
        description: "Before the end of strategy stage, resilience requirements have been identified based on a current risk assessment for the project and consultation with relevant experts.",
        actions: "Minimum requirements. Flood risk assessment. Refer to floodinfo.ie. Business dependencies. Resilience requirements.",
        defaultPriority: 1
      },
      {
        id: "dependencies",
        item: "Dependencies",
        description: "Identify dependencies associated with the asset and its functions; and the criticality of the asset and its components. Communicate dependencies to relevant project team members.",
        actions: "Consider upstream, downstream, local and regional influences: discharge, flow speed, turbulence, flood risk, erosion, cross-section changes, infiltration & evaporation rate changes",
        defaultPriority: 2
      },
      {
        id: "identify_risks",
        item: "Identify risks",
        description: "Risks and impacts have been identified and assessed in accordance with the guidance. Communicate risks to relevant project team members.",
        actions: "Damage to property, businesses, individuals, infrastructure. Damage to ecosystem, soil properties.",
        defaultPriority: 1
      },
      {
        id: "resilience_plan",
        item: "Resilience plan",
        description: "Develop a resilience plan based on a current risk assessment. The plan has been distributed to relevant stakeholders; if needed, updated; implemented during design and construction.",
        actions: "Hard measures & soft measures. SuDS",
        defaultPriority: 2
      },
      {
        id: "flood_risk_assessment",
        item: "Flood risk assessment",
        description: "The run-off, flood risk and potential increased flood risk elsewhere as a result of the completed works have been assessed over their expected working life, and appropriate flood management measures have been included in the design.",
        actions: "Consider upstream, downstream, local and regional influences: discharge, flow speed, turbulence, flood risk, erosion, cross-section changes, infiltration & evaporation rate changes",
        defaultPriority: 2
      },
      {
        id: "flood_risk_enhancements",
        item: "Flood risk based enhancements",
        description: "The design team has considered opportunities for providing enhancements as part of the flood risk management measures and/or the merits of designing for a larger event or for greater flood resilience than required by planning regulations or guidance.",
        actions: "Hard measures & soft measures. SuDS",
        defaultPriority: 2
      },
      {
        id: "long_term_flood_resilience",
        item: "Long-term flood resilience and adaptation",
        description: "The project team has designed for long-term flood resilience and adaptation.",
        actions: "Adaptive drainage systems, flood-resistant materials for building components.",
        defaultPriority: 2
      },
      {
        id: "managing_runoff_source",
        item: "Managing run-off at source",
        description: "A percentage of total surface water run-off from the completed project has been managed through infiltration.",
        actions: "Green verges, infiltration beds, filter strips",
        defaultPriority: 2
      }
    ]
  },
  water_quality: {
    title: "Water Quality",
    items: [
      {
        id: "consultation_authorities",
        item: "Consultation with authorities",
        description: "Consultation has been undertaken with regulatory authorities about water issues related to the project, including the need for any consents, and the outcome has been communicated to project team members at each stage of the project.",
        actions: "NPWS. EPA. Uisce Eireann",
        defaultPriority: 1
      },
      {
        id: "preventing_pollution_operation",
        item: "Preventing pollution in operation",
        description: "Measures have been incorporated to prevent pollution of groundwater, freshwater or the sea during operation and maintenance.",
        actions: "Avoid pollutants and contaminants. Use filtration: engineered or natural, physical and chemical",
        defaultPriority: 2
      },
      {
        id: "control_impacts_completed",
        item: "Control of impacts on the water environment from the completed project",
        description: "A plan to control the impacts of the completed project on the water environment has been produced and necessary elements of the plan have been incorporated in the design.",
        actions: "Filtration systems",
        defaultPriority: 2
      },
      {
        id: "long_term_monitoring",
        item: "Long-term monitoring of impacts on the water environment",
        description: "Measures or equipment have been incorporated in the design that will allow long-term monitoring of the project's impact on aquatic environments.",
        actions: "Mounted water quality monitoring stations. Scheduled visits",
        defaultPriority: 2
      },
      {
        id: "control_impacts_construction",
        item: "Control of impacts on the water environment during construction",
        description: "A plan has been implemented to control the impacts of the project on the water environment during construction.",
        actions: "Waste management. Use of natural materials. Avoiding contaminating materials. Site inspector",
        defaultPriority: 2
      },
      {
        id: "preventing_pollution_construction",
        item: "Preventing pollution during construction",
        description: "Measures have been taken to prevent the pollution of groundwater, freshwater or the sea during construction.",
        actions: "Waste management plan. Use of natural materials. Avoiding contaminating materials",
        defaultPriority: 2
      },
      {
        id: "protecting_water_features",
        item: "Protecting existing water features during construction",
        description: "Existing water features have been protected from degradation and physical damage by construction plant and processes.",
        actions: "Avoid altering the flowchannel",
        defaultPriority: 2
      },
      {
        id: "monitoring_water_quality_construction",
        item: "Monitoring water quality during construction",
        description: "If the works could affect a body of ground or surface waters, the quality of the water body has been monitored before and during construction in accordance with the regime identified as appropriate in the risk assessment.",
        actions: "Regular water quality tests",
        defaultPriority: 2
      }
    ]
  },
  suds: {
    title: "Sustainable Drainage Systems (SuDS)",
    items: [
      {
        id: "quantity",
        item: "Quantity",
        description: "Manage flows and volumes to match the rainfall characteristics before development.",
        actions: "Assess infiltration areas, filtered/stored/conveyed volumes",
        defaultPriority: 1
      },
      {
        id: "amenity",
        item: "Amenity",
        description: "Drainage design to enhance people's quality of life through an integrated design that provides useful and attractive multi-functional spaces.",
        actions: "Multi-purpose detention basins (playground, sports field, park), rain gardens, planted infiltration strips, ponds",
        defaultPriority: 2
      },
      {
        id: "quality",
        item: "Quality",
        description: "Design preventing and treating pollution to ensure that clean water is available as soon as possible to provide amenity and biodiversity benefits within the development, as well as protecting watercourses, groundwater and the sea.",
        actions: "Filtration ponds, planting",
        defaultPriority: 2
      },
      {
        id: "biodiversity",
        item: "Biodiversity",
        description: "Maximising the potential for wildlife through design and management of SuDS.",
        actions: "Planting (prioritising native species)",
        defaultPriority: 2
      },
      {
        id: "suds_management_train",
        item: "SuDS management train",
        description: "Incorporate a SuDS management train during the design stage whereby surface water is managed locally in small sub-catchments rather than being conveyed to and managed in large systems further down the catchments.",
        actions: "Local systems: infiltration, runoff, storage, quality control",
        defaultPriority: 2
      },
      {
        id: "water_balance_restoration",
        item: "Water Balance Restoration",
        description: "Project enhances the site's long-term hydrological balance.",
        actions: "Re-wet peatlands, reconnect floodplains, or increase infiltration capacity above pre-development levels.",
        defaultPriority: 3
      },
      {
        id: "water_living_system",
        item: "Water as a Living System",
        description: "Recognise and restore the ecological, social, and spiritual role of water.",
        actions: "Design watercourses to be visible, biodiverse, and culturally celebrated (e.g., educational signage, ritual spaces).",
        defaultPriority: 3
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

export default function WaterManagement({ data, onDataChange, onNext }) {
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
          Next: Materials & Resource Efficiency
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}