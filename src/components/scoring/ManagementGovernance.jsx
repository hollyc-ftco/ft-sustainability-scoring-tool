
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
  sdg_alignment: {
    title: "Sustainable Development Goals (SDGs) Alignment",
    items: [
      {
        id: "consider_sdgs",
        item: "Consider SDGs",
        description: "Consider SDG goals within project design",
        actions: "Fill in sustainability checklist. Identify actions against each relevant SDG.",
        defaultPriority: 2
      },
      {
        id: "sdg_9",
        item: "SDG 9",
        description: "Consider SDG 9, focusing on reliable, resilient and sustainable infrastructure.",
        actions: "Quality, reliable, sustainable and resilient new infrastructure. Existing infrastructure retrofitted.",
        defaultPriority: 1
      },
      {
        id: "sdg_11",
        item: "SDG 11",
        description: "Consider SDG 11, focusing on inclusive, safe, resilient and sustainable urban development.",
        actions: "Ensure access to housing and services for all. Provide access to safe, affordable, accessible and sustainable transport systems for all. Inclusive and sustainable urbanization. Protect the cultural and natural heritage. Pay attention to air quality and waste management. Provide access to green spaces for all.",
        defaultPriority: 3
      },
      {
        id: "sdg_12",
        item: "SDG 12",
        description: "Consider SDG 12, focusing on waste reduction and implementing sustainable practices.",
        actions: "Implement sustainable management and the efficient use of natural resources. Reduce waste by recycling and reusing.",
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
        actions: "Prepare EIAs. Align with ISO 14001. List environmental impacts and benefits: soil contamination, biodiversity effects, habitat destruction/creation, noise pollution, emissions, etc.",
        defaultPriority: 1
      },
      {
        id: "implement_enhancements",
        item: "Implement environmental enhancements",
        description: "Deliver environmental enhancements, mitigation and compensation.",
        actions: "Reduce emissions, water use, waste. Avoid soil and water contamination. Adopt appropriate waste management practices. Avoid disruptions in biodiversity. Plant vegetation, prioritising native species. Implement green, natural solutions: SuDS, ponds, planted verges, green spaces. Provide additional ways to promote biodiversity: insect hotels, bee pastures, nesting boxes, etc.",
        defaultPriority: 2
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
        defaultPriority: 1
      },
      {
        id: "coordination",
        item: "Co-ordination of environmental and social aspects",
        description: "A member of the project team was appointed as responsible for co-ordinating the management of the environmental and social aspects of the project.",
        actions: "For large projects have an individual whose sole responsibility is environmental and social co-ordiantion. For smaller projects designate an individual whose responsibilities will include environmental and social co-ordination.",
        defaultPriority: 2
      },
      {
        id: "sustainability_mechanisms",
        item: "Sustainability management mechanisms",
        description: "Appropriate mechanics were put in place to manage the project's environmental and social risks, impacts and opportunities.",
        actions: "Prepare Project Environmental Managment Plans focusing on sustainable supply-chain, ethical sourcing, waste managment, energy management, water management, ethical labour practices, work-life balance, community engagement.",
        defaultPriority: 1
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
        actions: "Include and emphasise environmental and soical impacts management results in contracts, reports, project team meetings, project reviews.",
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
        defaultPriority: 2
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
        description: "Regularly monitor and evaluate the effectiveness of the stakeholder engagement strategies. Use feedback from stakeholers to continuously improve approach.",
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
        description: "Ensure that if the project is requiring consent arising from from the NPF, it is subject to relevant environmental assessment reuirements, including SEA, EIA, SFRA and AA.",
        actions: "Conduct screening report based on project type, scale and location. Complete the relevant Enviromental assessments outlined in the description",
        defaultPriority: 1
      },
      {
        id: "population_increase",
        item: "Population increase",
        description: "Ensure that the proposed population growth of 950k by 2040 has been taken into account in planning. Take into account the differing growth rates between the regions.",
        actions: "Identify location of project and corresponding population change estimates. Adapt to a growing population: more traffic, more residents, more businesses. Promote urbanization.",
        defaultPriority: 2
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
        actions: "Provide accessibility, wide pavements, tactile covers, community spaces, proximity to amenities",
        defaultPriority: 2
      },
      {
        id: "reducing_carbon",
        item: "Reducing carbon footprint",
        description: "Integrate climate action into planning.",
        actions: "Reduce energy consumption, use renewable energy, prioritise local suppliers & workforce, reuse & recycle, sustainable material use, carbon offsetting",
        defaultPriority: 1
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
      // Only include items that are not marked as "Not Applicable"
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
  }, [responses, priorities]);

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
                          <SelectItem value="no">No</SelectItem> {/* Added "No" option */}
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

export default function ManagementGovernance({ data, onDataChange }) {
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
