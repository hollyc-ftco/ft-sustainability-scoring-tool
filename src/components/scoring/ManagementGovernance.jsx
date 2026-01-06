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
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, Lock, Pencil, Plus, Trash2 } from "lucide-react";
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
  sdg_alignment: {
    title: "Sustainable Development Goals (SDGs) Alignment",
    items: [
      {
        id: "consider_sdgs",
        item: "Consider SDGs",
        description: "Consider SDG goals within project design",
        actions: "Fill in sustainability checklist. Identify actions against each relevant SDG.",
        defaultPriority: 1
      },
      {
        id: "sdg_9_innovation",
        item: "SDG 9",
        description: "Consider SDG 9, focusing on reliable, resilient and sustainable infrastructure.",
        actions: "Include innovation and resilience in project kick-off meeting.",
        defaultPriority: 1
      },
      {
        id: "sdg_9_frameworks",
        item: "SDG 9",
        description: "Consider SDG 9, focusing on reliable, resilient and sustainable infrastructure.",
        actions: "Consider the use of Irish specific frameworks for innovation such as BREEAM Infrastructure, TII sustainability toolkit etc.",
        defaultPriority: 2
      },
      {
        id: "sdg_9_bim",
        item: "SDG 9",
        description: "Consider SDG 9, focusing on reliable, resilient and sustainable infrastructure.",
        actions: "Comply with BIM requirements.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_nature",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Consider Nature-based solutions and Biodiversity Net Gain at kick-off stage.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_pollinator",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Check alignment with NPWS All-Ireland Pollinator Plan at Kick-off stage.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_natura",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Ensure compliance with Natura 2000 assessment processes.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_suds",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Consider SUDS and/or flood resilience at kick-off stage.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_archaeology",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Where appropriate consider archaeological heritage at kick-off stage.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_landscape",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Where appropriate consider landscape visual impact/design at kick-off stage.",
        defaultPriority: 2
      },
      {
        id: "sdg_11_safety",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Consider safety & social equity in design at kick-off stage.",
        defaultPriority: 2
      },
      {
        id: "sdg_12_resources",
        item: "SDG 12",
        description: "Consider SDG 12, focusing on waste reduction and implementing sustainable practices.",
        actions: "Consider sustainable management and the efficient use of natural resources at Kick-off stage. Reduce waste by recycling and reusing.",
        defaultPriority: 2
      },
      {
        id: "sdg_12_kpis",
        item: "SDG 12",
        description: "Consider SDG 12, focusing on waste reduction and implementing sustainable practices.",
        actions: "Set up system of Project KPIs for waste and materials (e.g. % reduction in virgin materials, % reuse on site, embodied carbon savings).",
        defaultPriority: 2
      },
      {
        id: "sdg_12_circular",
        item: "SDG 12",
        description: "Consider SDG 12, focusing on waste reduction and implementing sustainable practices.",
        actions: "Consider circular economy at kick-off stage (e.g. deconstruction plans, modular construction, use of reclaimed materials).",
        defaultPriority: 2
      },
      {
        id: "sdg_12_carbon",
        item: "SDG 12",
        description: "Consider SDG 12, focusing on waste reduction and implementing sustainable practices.",
        actions: "Consider Carbon Accounting and/or life cycle assessment (LCA) at Kick-off stage.",
        defaultPriority: 2
      }
    ]
  },
  environmental_systems: {
    title: "Environmental Management Systems",
    items: [
      {
        id: "env_impacts_assessment",
        item: "Environmental impacts and benefits assessment",
        description: "Undertake an environmental impacts and benefits assessment of the project on a wider scope than the project owner's interests.",
        actions: "Prepare EIAs or most appropriate environmental assessment. Align with ISO 14001. List environmental impacts and benefits: soil contamination, biodiversity effects, habitat destruction/creation, noise pollution, emissions, etc.",
        defaultPriority: 1
      },
      {
        id: "implement_enhancements",
        item: "Implement environmental enhancements",
        description: "Deliver environmental enhancements, mitigation and compensation.",
        actions: "Reduce emissions, water use, waste. Avoid soil and water contamination. Adopt appropriate waste management practices. Avoid disruptions in biodiversity. Plant vegetation, prioritising native species. Implement green, natural solutions: SuDS, ponds, planted verges, green spaces. Provide additional ways to promote biodiversity: insect hotels, bee pastures, nesting boxes, etc.",
        defaultPriority: 1
      },
      {
        id: "support_benefits_contracts",
        item: "Support environmental benefits in contracts",
        description: "Include actions to support the results of the environmental impacts and benefits assessments within relevant contract documentation.",
        actions: "Include and emphasise EIA results in contracts. Attempt to influence the project proceed in the most sustainable way. Prioritise contractors with a focus on sustainability.",
        defaultPriority: 2
      },
      {
        id: "env_social_assessment",
        item: "Environmental and social aspects assessment",
        description: "Consider and assess the environmental and social aspects of the project.",
        actions: "Prepare ESIAs. Record the results and prepare mitigation options. Consider biodiversity, soil & water quality, ecosystem services, natural processes. Consider public health & wellbeing, cultural & natural heritage, social equity.",
        defaultPriority: 2
      },
      {
        id: "coordination",
        item: "Coordination of environmental and social aspects",
        description: "A member of the project team was appointed as responsible for coordinating the management of the environmental and social aspects of the project.",
        actions: "For large projects have an individual whose sole responsibility is environmental and social co-ordination. For smaller projects designate an individual whose responsibilities will include environmental and social co-ordination.",
        defaultPriority: 2
      },
      {
        id: "sustainability_mechanisms",
        item: "Sustainability management mechanisms",
        description: "Appropriate mechanics were put in place to manage the project's environmental and social risks, impacts and opportunities.",
        actions: "Prepare Project Environmental Management Plans focusing on sustainable supply-chain, ethical sourcing, waste management, energy management, water management, ethical labour practices, work-life balance, community engagement.",
        defaultPriority: 2
      },
      {
        id: "implementation_mechanisms",
        item: "Implementation of mechanisms",
        description: "Regular checks have been made to ensure that the sustainability management mechanisms have been implemented.",
        actions: "Regular reviews. Internal environmental audits for larger projects.",
        defaultPriority: 2
      },
      {
        id: "results_mechanisms",
        item: "Results of mechanisms",
        description: "The results of the implementation of the sustainability management mechanisms have been assessed.",
        actions: "Posterior review and assessment. Record results and draw conclusions.",
        defaultPriority: 2
      },
      {
        id: "sustainability_training",
        item: "Sustainability training",
        description: "At each project stage, there has been a programme of training on environmental and social issues relevant to the project delivered at an appropriate level for those engaged in the project.",
        actions: "Formal 3rd party courses, project team meetings, site inductions.",
        defaultPriority: 2
      },
      {
        id: "project_communications",
        item: "Project team communications",
        description: "At each project stage, all those directly engaged in the project have been informed of the environmental impacts and opportunities, and associated social issues, of their part or stage of the project.",
        actions: "Include and emphasise environmental and social impacts management results in contracts, reports, project team meetings, project reviews.",
        defaultPriority: 2
      },
      {
        id: "regenerative_charter",
        item: "Regenerative Design Charter",
        description: "Adopt a shared project vision that commits to regeneration.",
        actions: "Co-develop charter with stakeholders; revisit at key stages.",
        defaultPriority: 3
      },
      {
        id: "living_system_kpis",
        item: "Living System KPIs",
        description: "Include living indicators beyond compliance metrics.",
        actions: "Monitor soil health, ecological function, joy/beauty, or sense of belonging post-completion.",
        defaultPriority: 3
      }
    ]
  },
  stakeholder_engagement: {
    title: "Stakeholder Engagement",
    items: [
      {
        id: "identify_prioritise",
        item: "Identify and prioritise stakeholders",
        description: "Map out potential stakeholders and prioritise them based on influence, interest and impact on sustainability objectives.",
        actions: "Identify interests, influences and impacts of stakeholder. Identify relationships.",
        defaultPriority: 1
      },
      {
        id: "communication",
        item: "Communication",
        description: "Establish clear, consistent and transparent communication with stakeholders and ensure that the sustainability goals are communicated frequently. Engage early in the design and decision-making process and schedule regular meetings.",
        actions: "Regular reports/presentations/briefings/meetings. Receive and analyse feedback.",
        defaultPriority: 1
      },
      {
        id: "engagement_approaches",
        item: "Engagement approaches",
        description: "Tailor engagement approaches to suit the specific needs of specific stakeholders.",
        actions: "Base engagement approach on interest: financial, environmental, legislational, community, policies, etc.",
        defaultPriority: 2
      },
      {
        id: "collaboration",
        item: "Collaboration",
        description: "Build collaborative relationships with the stakeholders to co-create solutions and drive joint sustainability initiatives.",
        actions: "Focus on shared objectives to work on together. Involve stakeholders in decision-making.",
        defaultPriority: 2
      },
      {
        id: "monitor_engagement",
        item: "Monitor engagement",
        description: "Regularly monitor and evaluate the effectiveness of the stakeholder engagement strategies. Use feedback from stakeholders to continuously improve approach.",
        actions: "Use feedback from stakeholders. Analyse results. Adjust engagement practices if necessary.",
        defaultPriority: 2
      }
    ]
  },
  policy_planning: {
    title: "Policy and Planning",
    items: [
      {
        id: "npf_requirements",
        item: "NPF environmental assessment requirements",
        description: "Ensure that if the project is requiring consent arising from the NPF, it is subject to relevant environmental assessment requirements, including SEA, EIA, SFRA and AA.",
        actions: "Conduct screening report based on project type, scale and location. Complete the relevant Environmental assessments outlined in the description.",
        defaultPriority: 1
      },
      {
        id: "population_increase",
        item: "Population increase",
        description: "Ensure that the proposed population growth of 950k by 2040 has been taken into account in planning. Take into account the differing growth rates between the regions.",
        actions: "Identify location of project and corresponding population change estimates. Adapt to a growing population: more traffic, more residents, more businesses. Promote urbanization.",
        defaultPriority: 1
      },
      {
        id: "compact_growth",
        item: "Compact, smart, sustainable growth",
        description: "Consider reducing urban sprawl and focus on urbanisation.",
        actions: "Prioritise developments close to town/city centres. Consider transportation hubs. Promote a high-density population.",
        defaultPriority: 2
      },
      {
        id: "regional_planning",
        item: "Regional planning",
        description: "Does the project align with the appropriate regional development plans?",
        actions: "Check appropriate documentation.",
        defaultPriority: 2
      },
      {
        id: "communities",
        item: "Communities",
        description: "Does the project offer inclusiveness for people of age and people with disability?",
        actions: "Provide accessibility, wide pavements, tactile covers, community spaces, proximity to amenities.",
        defaultPriority: 2
      },
      {
        id: "reducing_carbon",
        item: "Reducing carbon footprint",
        description: "Integrate climate action into planning.",
        actions: "Reduce energy consumption, use renewable energy, prioritise local suppliers & workforce, reuse & recycle, sustainable material use, carbon offsetting.",
        defaultPriority: 2
      },
      {
        id: "waste_management",
        item: "Waste management",
        description: "Sustainably manage waste generation. Prioritise prevention, reuse, recycling and recovery.",
        actions: "Promote and implement Lean principles. Develop Waste Management Plan. Reuse materials that were used in excavation, construction etc.",
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

  // Update state when data prop changes (for loading existing assessments)
  useEffect(() => {
    if (data.responses[sectionId]) {
      setResponses(data.responses[sectionId]);
    }
    if (data.priorities[sectionId]) {
      setPriorities(data.priorities[sectionId]);
    }
  }, [data.responses, data.priorities, sectionId]);

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
    } else {
      // If no mandatory items, redistribute weight to non-mandatory
      totalScore += 0;
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
                const priority = priorities[item.id];
                const response = responses[item.id] || "";
                
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
                        <Badge className={`${priorityScores[priority].color} border text-xs`}>
                          {priority} - {priorityScores[priority].label}
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

export default function ManagementGovernance({ data, onDataChange, onNext, isAdmin = false, customSections, onUpdateSections }) {
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
          Next: Energy & Carbon Management
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