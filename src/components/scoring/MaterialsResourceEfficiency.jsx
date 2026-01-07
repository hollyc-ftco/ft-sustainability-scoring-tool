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
  material_selection: {
    title: "Material Selection",
    items: [
      {
        id: "project_resources_strategy",
        item: "Project resources strategy",
        description: "Prepare and implement a project resources strategy in line with guidance and covering aspects including energy, water, materials sourcing, reuse & recycling and wastes management.",
        actions: "Monitor and report on waste generation and resource. Targets for material reuse and recycling during design and construction. Use WRAP's Net Waste Tool or similar for baseline and tracking.",
        defaultPriority: 2
      },
      {
        id: "supporting_resource_efficiency",
        item: "Supporting resource efficiency objectives in contracts",
        description: "Include resource efficiency objectives and targets within contract documentation.",
        actions: "Include specific waste reduction and recycling targets in all contractors agreements. Make resource efficiency a key criteria when appointing contractors.",
        defaultPriority: 2
      },
      {
        id: "embodied_carbon_materials_basic",
        item: "Embodied Carbon of Materials",
        description: "Measure and reduce embodied carbon associated with material production and transport.",
        actions: "Conduct basic life cycle assessment / consider low-carbon materials. Identify opportunities and discuss with client.",
        defaultPriority: 1
      },
      {
        id: "embodied_carbon_materials_lca",
        item: "Embodied Carbon of Materials",
        description: "Measure and reduce embodied carbon associated with material production and transport.",
        actions: "Conduct Life Cycle Assessment (LCA); select low-carbon materials; apply PAS 2080 methodology; use recycled/reused components.",
        defaultPriority: 2
      },
      {
        id: "policies_targets_efficiency",
        item: "Policies and targets for resource efficiency",
        description: "Use materials effectively, reduce waste, use water efficiently, use energy efficiently, reduce carbon emissions.",
        actions: "Material waste and water use targets.",
        defaultPriority: 2
      },
      {
        id: "material_efficiency_plan",
        item: "Material resource efficiency plan",
        description: "Implement a plan that identifies opportunities for improving material resource efficiency and reducing waste via reuse & recovery, off-site construction, materials optimisation, waste efficient procurement and deconstruction & flexibility.",
        actions: "Optimise design to minimise material use. Include waste-efficient procurement practices",
        defaultPriority: 2
      },
      {
        id: "fitness_purpose",
        item: "Fitness for purpose",
        description: "Materials selection should consider materials that require minimum maintenance, and which can accommodate future adaptation, which can significantly reduce its environmental impact during its lifetime.",
        actions: "Choose materials based on maintenance over their life and quality. Avoid materials that need frequent replacement or repair.",
        defaultPriority: 2
      },
      {
        id: "locally_sourced_recycled",
        item: "Locally sourced and recycled materials",
        description: "Consider, research and implement locally available material sources, including recycled materials.",
        actions: "Prioritise materials that are manufactured or sourced within a defined radius. Aim for >25% recycled content by weight where feasible.",
        defaultPriority: 2
      },
      {
        id: "responsible_sourcing",
        item: "Responsible sourcing",
        description: "Consider the chain of custody of the material and the environmental credentials of the product supplier, including certifications for timber and other environmental certifications.",
        actions: "Require Environmental certifications. Check chain of custody for critical materials to ensure sustainability. Apply BES 6001 or ISO 20400 in supply chain management.",
        defaultPriority: 2
      },
      {
        id: "fabrication_process",
        item: "Fabrication process",
        description: "Consideration should be given to how the structure will be constructed to ensure that construction waste is minimised.",
        actions: "Low-waste fabrication process.",
        defaultPriority: 3
      }
    ]
  },
  waste_management: {
    title: "Waste Management",
    items: [
      {
        id: "duty_care",
        item: "Duty of care",
        description: "All waste on site has been managed to meet duty of care requirements.",
        actions: "Licensed waste contractors",
        defaultPriority: 1
      },
      {
        id: "permitting_waste",
        item: "Permitting for waste treated or used on site",
        description: "Permits, licenses and exemptions have been obtained for waste that has been treated on site or for waste transported to site.",
        actions: "Secure permits that support sustainable on-site treatment or reuse of waste. Design processes to reuse materials on-site where possible",
        defaultPriority: 2
      },
      {
        id: "hazardous_waste",
        item: "Hazardous waste",
        description: "Hazardous waste has been appropriately segregated and stored on site, and taken to a suitable facility. The construction site has been registered as a hazardous waste producer where appropriate.",
        actions: "Storage hazardous waste securely to prevent leaks and environmental harm. Prioritise treatment methods rather than disposal",
        defaultPriority: 1
      },
      {
        id: "site_waste_planning",
        item: "Site waste management planning",
        description: "A site waste management plan has been prepared. Targets and key performance indicators for waste reduction and recovery have been met.",
        actions: "Targets for recycling, reuse and waste prevention. Circular economy measures.",
        defaultPriority: 2
      },
      {
        id: "clearance_vegetation",
        item: "Clearance and disposal of existing vegetation",
        description: "The most environmentally beneficial ways of dealing with clearance and disposal of existing vegetation have been explored and implemented.",
        actions: "Avoid unnecessary clearance to preserve biodiversity. Local composting over landfill disposal",
        defaultPriority: 2
      },
      {
        id: "transfer_station_performance",
        item: "Transfer station/ recycling centre performance",
        description: "If transfer stations or recycling facilities have been used, the recycling rate of the facilities had been considered.",
        actions: "Facilities with third-party sustainability certifications. Recycling performance monitoring",
        defaultPriority: 2
      },
      {
        id: "inert_waste_diverted",
        item: "Inert waste diverted from landfill",
        description: "A percentage of inert waste material has been segregated in accordance with the site waste management plan and diverted from landfill.",
        actions: "Implement waste segregation systems on site",
        defaultPriority: 2
      },
      {
        id: "non_hazardous_diverted",
        item: "Non-hazardous waste diverted from landfill",
        description: "A percentage of non-hazardous waste material has been segregated in accordance with the site waste management plan and diverted from landfill.",
        actions: "Implement waste segregation systems on site",
        defaultPriority: 2
      }
    ]
  },
  circular_economy: {
    title: "Circular Economy",
    items: [
      {
        id: "business_models_circular",
        item: "Business models for a circular economy",
        description: "The principles of a circular economy are considered and implemented via appropriate business models, including on-demand, dematerialization, product life cycle extension/reuse, recovery of secondary raw materials/by-products, product as a service/ product-service system, sharing economy and collaborative consumption.",
        actions: "Circular Economy requirements in tender documents.",
        defaultPriority: 2
      },
      {
        id: "waste_hierarchy",
        item: "Waste Hierarchy",
        description: "The carrying out of material/waste management in line with the 'Waste Hierarchy' has been promoted during the design process. Opportunities for waste prevention and material reuse have been explored and availed of, where feasible. Waste reuse, recovery and recycling have been promoted. Disposal of waste to landfill has been avoided, wherever possible.",
        actions: "Consideration of circular economy principles in design.",
        defaultPriority: 2
      },
      {
        id: "circular_design_principles",
        item: "Circular Economy Design Principles",
        description: "Integrate design strategies to retain material value and enable reuse, remanufacture, and recycling.",
        actions: "Consideration of circular economy principles in design. e.g. Avoid composite or difficult-to-dismantle materials; specify reusable formwork or modular elements; prepare deconstruction plan.",
        defaultPriority: 1
      },
      {
        id: "design_deconstruction",
        item: "Design for Deconstruction",
        description: "Enable safe disassembly of materials and reuse at end of asset life.",
        actions: "Label reusable components; document material passports; design joints to be reversible (bolted vs. welded).",
        defaultPriority: 2
      },
      {
        id: "durability_maintenance",
        item: "Durability and low maintenance",
        description: "Durability and low maintenance of structures and components have been considered in design and specification.",
        actions: "Durability requirements. Design components with easy maintenance.",
        defaultPriority: 2
      },
      {
        id: "long_term_maintenance",
        item: "Long-term planned maintenance",
        description: "Long-term planned maintenance has been considered properly in the design process.",
        actions: "Long-term maintenance plan, Regular reviews on maintenance practices",
        defaultPriority: 2
      },
      {
        id: "future_disassembly",
        item: "Future disassembly/ deconstruction",
        description: "A percentage of components used can be easily separated on disassembly/ de-construction into material types suitable for recycling or reuse.",
        actions: "Labelling for materials and components for future identification and sorting, Disassembly strategy.",
        defaultPriority: 2
      },
      {
        id: "materials_register",
        item: "Materials register",
        description: "A materials register has been provided to the client at hand-over that identifies main material types to facilitate recycling during disassembly or de-construction.",
        actions: "Materials register at construction stage, register updates during project.",
        defaultPriority: 2
      },
      {
        id: "retention_existing",
        item: "Retention of existing materials and structures",
        description: "A percentage of any existing materials and structures, such as roads, tanks and pipework have been retained and used within the project as opposed to being demolished or disposed of.",
        actions: "Assessment of all existing structures and materials for reuse, record retained elements.",
        defaultPriority: 2
      },
      {
        id: "onsite_demolition",
        item: "On-site use of demolition arisings",
        description: "A percentage of useable material from demolition or de-construction on site has been incorporated into the project.",
        actions: "Waste transport plans",
        defaultPriority: 2
      },
      {
        id: "cut_fill_optimisation",
        item: "Cut and fill optimisation",
        description: "An assessment has been made at design stage to ensure optimisation of cut and fill to reduce the quantity of excavated material taken off site.",
        actions: "Avoid over-excavation, reuse of excavated material",
        defaultPriority: 2
      },
      {
        id: "soil_management",
        item: "Soil management",
        description: "A soil management plan has been prepared and implemented.",
        actions: "Stockpile topsoil separately, reuse of topsoil",
        defaultPriority: 2
      },
      {
        id: "reuse_topsoil",
        item: "Re-use of topsoil",
        description: "Top-soil has been re used beneficially as topsoil on site or on a different site within a reasonable distance.",
        actions: "Strip and stockpile topsoil to preserve quality",
        defaultPriority: 2
      },
      {
        id: "reclaimed_materials",
        item: "Reclaimed or recycled materials",
        description: "A percentage of materials (excluding bulk fill and sub-base) for use in the permanent works has been specified and made from reclaimed or recycled material.",
        actions: "Include reclaimed material targets in procurement documents.",
        defaultPriority: 2
      },
      {
        id: "reclaimed_bulk_fill",
        item: "Reclaimed or recycled bulk fill and sub-base",
        description: "A percentage of bulk fill and sub-base material specified in the project is made from previously used material.",
        actions: "Use recycled aggregates for bulk fill applications",
        defaultPriority: 2
      },
      {
        id: "beneficial_excavated",
        item: "Beneficial re-use of excavated material",
        description: "A percentage of excavated material has been beneficially re-used on-site.",
        actions: "Reuse excavated material for landscaping or fill",
        defaultPriority: 2
      },
      {
        id: "surplus_materials",
        item: "Surplus materials",
        description: "An assessment has been undertaken and implemented to reduce the amount of surplus materials ordered.",
        actions: "Store surplus materials for reuse, Improve material ordering accuracy.",
        defaultPriority: 2
      },
      {
        id: "materials_storage",
        item: "Materials storage",
        description: "Materials have been stored appropriately to avoid wastage.",
        actions: "Store materials in weather protected areas to avoid spoilage and waste, rotate stock",
        defaultPriority: 2
      },
      {
        id: "beneficial_surplus",
        item: "Beneficial use of surplus materials",
        description: "A percentage of surplus materials have been beneficially re-used or stored for re-use.",
        actions: "Catalogue surplus materials and identify reuse opportunities, document surplus materials for sustainability reporting",
        defaultPriority: 2
      }
    ]
  },
  embodied_carbon: {
    title: "Embodied Carbon",
    items: [
      {
        id: "embodied_carbon_consideration",
        item: "Embodied Carbon",
        description: "Embodied Carbon has been considered at all project stages with reduction measures identified and where possible implemented.",
        actions: "Consideration of embodied carbon in design, identification of potential measures to reduce embodied carbon.",
        defaultPriority: 1
      },
      {
        id: "whole_life_assessment",
        item: "Whole life carbon assessment",
        description: "A whole life carbon assessment has been filled out in the design stage and conclusions have been drawn.",
        actions: "LCA's for carbon assessment.",
        defaultPriority: 2
      },
      {
        id: "carbon_management",
        item: "Carbon management",
        description: "A carbon management approach has been adopted during the strategy, design or construction of the project that conforms with PAS 2080.",
        actions: "Carbon reduction targets, Carbon management plan.",
        defaultPriority: 2
      },
      {
        id: "certification_carbon",
        item: "Certification of carbon management",
        description: "The carbon management process adopted during the strategy, design and construction of the project has been independently third-party certified as fully conforming with PAS 2080.",
        actions: "Maintain records of carbon reduction for certifications.",
        defaultPriority: 2
      },
      {
        id: "achieving_targets",
        item: "Achieving carbon reduction targets",
        description: "The project has achieved its carbon emission reduction targets identified in the carbon management process.",
        actions: "Track and report performance against set targets.",
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

  // Initialize state only once when component mounts or section changes
  useEffect(() => {
    if (data.responses[sectionId] && Object.keys(data.responses[sectionId]).length > 0) {
      setResponses(data.responses[sectionId]);
    } else {
      const initial = {};
      section.items.forEach(item => {
        initial[item.id] = "no";
      });
      setResponses(initial);
    }
  }, [sectionId]);

  useEffect(() => {
    if (data.priorities[sectionId] && Object.keys(data.priorities[sectionId]).length > 0) {
      setPriorities(data.priorities[sectionId]);
    } else {
      const initial = {};
      section.items.forEach(item => {
        initial[item.id] = item.defaultPriority;
      });
      setPriorities(initial);
    }
  }, [sectionId]);

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
                        className={
                          response === "yes" 
                            ? "bg-emerald-600 text-white" 
                            : response === "not_applicable" 
                              ? "border-gray-300 text-gray-400" 
                              : "border-gray-300 text-gray-500"
                        }
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

export default function MaterialsResourceEfficiency({ data, onDataChange, onNext, isAdmin = false, customSections, onUpdateSections }) {
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
          Next: Biodiversity & Ecosystem
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