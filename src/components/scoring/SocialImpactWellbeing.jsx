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
  health_wellbeing: {
    title: "Health and Wellbeing",
    items: [
      {
        id: "social_impacts_assessment",
        item: "Social impacts and benefits assessment",
        description: "Undertake a social impacts and benefits assessment of the project on a wider scope than just the project owners' interests.",
        actions: "Conduct Social Impact Assessment (SIA) with wider stakeholder input; assess equity, inclusivity, and access to opportunities.",
        defaultPriority: 1
      },
      {
        id: "significant_social_benefits",
        item: "Significant social benefits",
        description: "The assessment demonstrates significant social benefits of the project to wider society on issues including renewal and revitalisation of the social fabric of the community, enhancement of community quality of life, developing local skills and capabilities, provision of amenity features or community resources, reduction of flood risk, improving air quality, reducing crime risks.",
        actions: "Design to improve air quality, accessibility, safety; integrate community facilities or green space; provide apprenticeships. Use recognised frameworks (e.g. UK Social Value Model, Ireland's Public Spending Code). Disaggregate benefits for vulnerable or underserved groups.",
        defaultPriority: 2
      },
      {
        id: "sroi",
        item: "Social Return on Investment (SROI)",
        description: "Quantify social, environmental, and economic value created.",
        actions: "Use SROI or cost–benefit analysis tools; assign monetary value to benefits like job creation, reduced pollution, improved wellbeing.",
        defaultPriority: 2
      },
      {
        id: "cultural_inclusion",
        item: "Cultural Inclusion & Local Identity",
        description: "Respect and reflect local identity and cultural heritage in design.",
        actions: "Engage local artists or historians; use regional materials or designs; integrate public art.",
        defaultPriority: 2
      },
      {
        id: "digital_inclusion",
        item: "Digital Inclusion",
        description: "Ensure that all community members can access digital resources and consultations.",
        actions: "Provide hard-copy alternatives for digital engagement; support digital upskilling for residents.",
        defaultPriority: 2
      },
      {
        id: "supporting_social_contracts",
        item: "Supporting social benefits in contracts",
        description: "Where appropriate, actions to support the results of the social impacts and benefits assessment have been included with relevant contract documentation.",
        actions: "Include social value deliverables (e.g. local employment, skills training) in contractor KPIs and tender documents.",
        defaultPriority: 2
      },
      {
        id: "wider_social_benefits",
        item: "Wider social benefits",
        description: "Consideration has been given to wider social benefits of the project during construction and operation and to the effects of the completed project on the human environment.",
        actions: "Evaluate indirect benefits to the human environment, such as reduced isolation, active travel encouragement, and access to services.",
        defaultPriority: 2
      },
      {
        id: "health_future_users",
        item: "Health and wellbeing of future users",
        description: "Potential impacts of the project on the health and wellbeing of any future occupants, users, neighbours or operational staff have been considered, and the design modified as a result.",
        actions: "Incorporate daylighting, ventilation, noise mitigation, green space, and active travel infrastructure.",
        defaultPriority: 2
      },
      {
        id: "community_diversity",
        item: "Community diversity",
        description: "The diversity of the local community has been considered and respected in the design solution to promote equal access for all and the specification achieved in the completed project.",
        actions: "Design to universal accessibility standards; ensure all communication and consultation is inclusive and culturally appropriate. Collaborate with representative local groups (youth clubs, disability orgs).",
        defaultPriority: 2
      },
      {
        id: "enhancement_functional",
        item: "Enhancement beyond functional requirements",
        description: "Consideration has been given to enhancing the project design features, user enjoyment and additional facilities for the benefit of users beyond functional requirements of the facility and this has been achieved in the construction phase.",
        actions: "Add public art, seating, shade, educational signage, or fitness routes beyond minimum design needs. Consider sensory gardens, exercise stations, or educational trails. Include cultural/seasonal programming potential in open spaces.",
        defaultPriority: 2
      },
      {
        id: "partnership_links",
        item: "Partnership links",
        description: "Partnership links have been pursued through design and implemented during construction.",
        actions: "Build partnerships with local health groups, schools, or NGOs; include them in consultation or programming.",
        defaultPriority: 2
      },
      {
        id: "social_impacts_construction",
        item: "Social impacts and benefits during construction",
        description: "The construction team has undertaken a social impacts and benefits assessment and used the results in the development and implementation of the construction management plan.",
        actions: "Develop a construction social value plan; support local events, apprenticeships, outreach, and communications.",
        defaultPriority: 2
      },
      {
        id: "health_generating",
        item: "Health-Generating Infrastructure",
        description: "Create assets that proactively support physical, emotional, and ecological health.",
        actions: "Include forest therapy trails, natural soundscapes, green microclimates, and access to fresh food.",
        defaultPriority: 2
      }
    ]
  },
  community_engagement: {
    title: "Community Engagement",
    items: [
      {
        id: "initial_consultation",
        item: "Initial community consultation",
        description: "A community consultation has been carried out and the results have been passed to appropriate members of the project team and, where applicable, the results fed back to consultees.",
        actions: "Conduct early-stage engagement workshops; document outcomes and feed into design brief.",
        defaultPriority: 1
      },
      {
        id: "further_consultation",
        item: "Further community consultation",
        description: "A community consultation has been carried out at the design and construction phases, with the results passed to appropriate members of the project team and, where applicable, the results fed back to the consultees.",
        actions: "Repeat consultations during design and construction; adjust design based on input and provide feedback loops.",
        defaultPriority: 2
      },
      {
        id: "stakeholder_consultation",
        item: "Stakeholder consultation effects during construction and operation",
        description: "Relevant stakeholders have been consulted regarding the effects on neighbours that are expected to occur during the construction and operational stages.",
        actions: "Engage residents and businesses on impacts like dust, noise, access; set up a project liaison group.",
        defaultPriority: 2
      },
      {
        id: "community_demographics",
        item: "Assessing community demographics",
        description: "Community demographics have been assessed to ensure that communications are appropriately targeted during community consultations and any ongoing community engagement.",
        actions: "Map key demographics and adapt consultation and design (e.g., translated materials, inclusive event locations).",
        defaultPriority: 2
      },
      {
        id: "responsibility_consultation",
        item: "Responsibility for ongoing community consultation",
        description: "A member of the project team was appointed as responsible for ongoing community consultation.",
        actions: "Assign a named Community Liaison Officer; include responsibilities in project execution plan.",
        defaultPriority: 2
      },
      {
        id: "community_engagement_programme",
        item: "Community engagement",
        description: "There has been a continuing community engagement programme covering all relevant project stages.",
        actions: "Develop and deliver a structured engagement plan with clear phases and methods.",
        defaultPriority: 2
      },
      {
        id: "recording_comments",
        item: "Recording community comments",
        description: "Comments from the local community were recorded.",
        actions: "Use a comment tracking system or CRM; summarise trends and concerns in project reports.",
        defaultPriority: 2
      },
      {
        id: "assessing_comments",
        item: "Assessing community comments",
        description: "The responses from the community engagement programme have been assessed and appropriate actions have been taken.",
        actions: "Apply comment analysis to revise plans; respond publicly to key concerns; track resolution rates.",
        defaultPriority: 2
      }
    ]
  },
  landscape_preservation: {
    title: "Landscape Preservation",
    items: [
      {
        id: "landscape_visual_factors",
        item: "Landscape and visual factors",
        description: "Landscape and visual factors have been considered by a suitably qualified landscape professional at each stage of the project, including the evaluation of scheme options.",
        actions: "Consider landscape and visual factors in design. Conduct visual impact assessment where appropriate; integrate into planning application.",
        defaultPriority: 1
      },
      {
        id: "landscape_character_impact",
        item: "Impact on landscape character",
        description: "The impact of the development on the area is neutral or positive.",
        actions: "Design to complement local patterns, forms, and land use; ensure net-neutral or enhancing impact.",
        defaultPriority: 2
      },
      {
        id: "landscape_policies",
        item: "Landscape development policies",
        description: "The landscape development policies meet, or go beyond, the aims of applicable landscape development or enhancement policies published by the relevant local, regional or national authority.",
        actions: "Align with and exceed local green infrastructure, biodiversity, and amenity policies.",
        defaultPriority: 2
      },
      {
        id: "local_landscape",
        item: "Local landscape character",
        description: "The project design fits the local landscape character in terms of landform & levels, materials, planting, style & detailing, scale and landscape pattern.",
        actions: "Select appropriate materials, slopes, plant species, and forms; include context-specific design language.",
        defaultPriority: 2
      },
      {
        id: "advance_works",
        item: "Advance landscape works",
        description: "Opportunities for advance landscape works have been considered.",
        actions: "Undertake early planting, boundary screening, and soil preparation before main works start.",
        defaultPriority: 2
      },
      {
        id: "species_selection",
        item: "Appropriateness of species selected",
        description: "Planting design has taken the appropriateness of species selection into account to include factors such as climate change adaptation, local provenance and soil stability.",
        actions: "Use native species; prioritise those resilient to climate change and beneficial for pollinators.",
        defaultPriority: 2
      },
      {
        id: "retention_vegetation",
        item: "Retention of existing vegetation",
        description: "Based on the assessment of the condition of existing vegetation, a percentage of vegetation of high or moderate quality has been retained.",
        actions: "Survey trees and habitats; retain and protect high-value elements; integrate into final layout.",
        defaultPriority: 2
      },
      {
        id: "non_vegetation",
        item: "Non-vegetation features",
        description: "The landscape and amenity value of other features (not vegetation) has been assessed and the retention valuable, distinctive or historic features has influenced design proposals.",
        actions: "Retain hedgerows, stone walls, ponds, etc., of heritage or visual value where possible.",
        defaultPriority: 2
      },
      {
        id: "landscape_proposals",
        item: "Landscape proposals",
        description: "A system has been implemented during construction that ensures that planning and third-party commitments were followed, best practice was applied for planting and soil conditions met the requirements for successful establishment of the landscape design.",
        actions: "Deliver a clear implementation plan aligned with third-party obligations; conduct establishment monitoring.",
        defaultPriority: 2
      },
      {
        id: "protection_vegetation",
        item: "Protection of existing vegetation during construction",
        description: "Plans have been made to protect retained vegetation during construction.",
        actions: "Fence root zones; use protective matting; include tree protection in CEMP.",
        defaultPriority: 2
      },
      {
        id: "long_term_management",
        item: "Long-term management plan",
        description: "A management plan has been developed that defines long-term landscape objectives, establishes recommendations for work required to ensure that objectives are achieved and sets a programme for ongoing monitoring and review to assess the effectiveness of maintenance operations.",
        actions: "Write a 5–10 year maintenance plan with inspections, replanting, and adaptive management triggers.",
        defaultPriority: 2
      },
      {
        id: "management_responsibility",
        item: "Responsibility for long-term management",
        description: "Responsibility for the implementation of the long-term management plan has been allocated to an appropriate organisation or individual, appropriate skills and resources have been committed and a programme of monitoring is in place beyond the normal planting establishment period.",
        actions: "Assign responsibility to a competent organisation (e.g. local authority, management company) with resourcing secured.",
        defaultPriority: 2
      }
    ]
  },
  cultural_heritage: {
    title: "Cultural Heritage Preservation",
    items: [
      {
        id: "baseline_studies",
        item: "Baseline studies and surveys",
        description: "A baseline historic environmental study or survey has been carried out at the project planning stage and has considered the full range of registered and non-registered historic environmental assets. These studies were submitted before the end of construction.",
        actions: "Commission archaeological and historical assessments at concept stage; submit before planning.",
        defaultPriority: 1
      },
      {
        id: "suitable_professionals",
        item: "Use of suitable professionals and standards",
        description: "The baseline survey has been prepared by a suitably qualified historic environment professional and has been prepared to a recognised standard appropriate to the scope and location of the project.",
        actions: "Ensure work is conducted by IAI- or ICOMOS-registered professionals to national standards.",
        defaultPriority: 2
      },
      {
        id: "registered_assets",
        item: "Integration of listed or registered heritage assets",
        description: "If listed or registered heritage assets have been identified within the development area, the project design has enabled their retention, restoration and successful re-use or integration into the development.",
        actions: "Retain and reuse where possible; incorporate into landscape or interpretation features.",
        defaultPriority: 1
      },
      {
        id: "non_registered_assets",
        item: "Integration of non-registered heritage assets",
        description: "The project design has enabled the retention, restoration and successful re-use or integration of non-registered assets into the development.",
        actions: "Record and retain local character features like mills, wells, or boundary stones where feasible.",
        defaultPriority: 2
      },
      {
        id: "setting_heritage",
        item: "Setting for listed or registered heritage assets",
        description: "The design has successfully addressed any setting issues and provided a neutral or enhanced setting for listed buildings, scheduled monuments or historic landscape areas.",
        actions: "Design to enhance views and context; avoid overshadowing or encroachment.",
        defaultPriority: 2
      },
      {
        id: "archaeological_surveys",
        item: "Surveys for archaeological remains",
        description: "If the potential for significant below-ground archaeological remains has been identified, the appropriate staged surveys have been undertaken to establish the extent and condition of these prior to the design being finalised and in time to influence designs.",
        actions: "Conduct staged geophysical and trenching surveys; influence layout to preserve in situ if required.",
        defaultPriority: 2
      },
      {
        id: "mitigation_strategy",
        item: "Mitigation strategy for archaeological investigation",
        description: "If the surveys have revealed the presence of significant archaeological remains, a mitigation strategy document has been prepared for archaeological investigation and agreed with the relevant development control archaeologist.",
        actions: "Submit a mitigation strategy (e.g., excavation, monitoring) agreed with local heritage body.",
        defaultPriority: 2
      },
      {
        id: "mitigation_design",
        item: "Mitigation design for loss of heritage assets",
        description: "If registered or non-registered historic environment assets have been demolished or removed, an appropriate mitigation design has been developed and agreed with the relevant conservation or heritage agency.",
        actions: "Use creative design (e.g. interpretive displays) if assets must be removed; document thoroughly.",
        defaultPriority: 2
      },
      {
        id: "mitigation_implementation",
        item: "Mitigation of impacts on archaeological remains",
        description: "The mitigation designs have been implemented, managed and monitored in accordance with a site management framework.",
        actions: "Implement agreed mitigation actions under supervision, update as required.",
        defaultPriority: 2
      },
      {
        id: "monitoring_works",
        item: "Monitoring mitigation works",
        description: "An appropriate historic environment professional has been appointed to manage and monitor the mitigation works.",
        actions: "Appoint heritage specialist to oversee implementation; maintain compliance reports.",
        defaultPriority: 2
      },
      {
        id: "appropriate_materials",
        item: "Use of appropriate materials",
        description: "Best practice and historically appropriate materials have been used in restoration or enhancement works.",
        actions: "Use traditional or sympathetic materials (lime mortar, native stone) in restoration.",
        defaultPriority: 2
      },
      {
        id: "specialist_skills",
        item: "Use of specialist skills",
        description: "The project has been able to contribute to maintaining key specialist conservation skills and creating sustainable heritage employment.",
        actions: "Provide opportunities for craft skill use and training; partner with heritage workshops or schools.",
        defaultPriority: 2
      },
      {
        id: "reporting_works",
        item: "Reporting mitigation works",
        description: "The final output from the mitigation works have been prepared and archives submitted.",
        actions: "Submit archive-ready documentation to local authority or national archive per guidance.",
        defaultPriority: 2
      },
      {
        id: "place_regeneration",
        item: "Place Regeneration and Identity",
        description: "Design infrastructure to reconnect people to place and culture.",
        actions: "Co-design with local communities, embed storytelling, celebrate local history through design elements.",
        defaultPriority: 3
      }
    ]
  },
  job_creation: {
    title: "Job Creation and Social Equity",
    items: [
      {
        id: "economic_assessment",
        item: "Economic impacts and benefits assessment",
        description: "An economic impacts and benefits assessment of the project has been undertaken on a wider scope than just the project owners' interests.",
        actions: "Carry out an economic impact assessment considering local employment, business, and supply chain effects.",
        defaultPriority: 1
      },
      {
        id: "economic_benefits",
        item: "Significant economic benefits",
        description: "The assessment demonstrates significant economic benefits of the project to wider society on issues including the promotion of other beneficial development, economic renewal and revitalisation of the community, creation of new construction and post-construction jobs and enhancements, reduction of travel times, increased export opportunities and efficiency improvements with wide application.",
        actions: "Design project to support tourism, local enterprise zones, skills-building; reduce transport or business costs.",
        defaultPriority: 2
      },
      {
        id: "economic_contracts",
        item: "Supporting economic benefits in contracts",
        description: "Actions to support the results of these economic impacts and assessments have been included within relevant contract documentation.",
        actions: "Include local hiring targets and SME participation goals in procurement requirements.",
        defaultPriority: 2
      },
      {
        id: "local_firms",
        item: "Involvement of local firms",
        description: "The client has specific plans to actively encourage local firms to quote for work competitively or otherwise. These plans have been implemented and achieved during construction.",
        actions: "Host tendering workshops; break packages into SME-accessible lots; use local supplier registers.",
        defaultPriority: 2
      },
      {
        id: "accessibility",
        item: "Accessibility",
        description: "Consider all individuals in the community, including people with disability, children and the elderly, when designing infrastructure.",
        actions: "Design to universal access principles (paths, signage, amenities); consult with disability groups.",
        defaultPriority: 2
      },
      {
        id: "community_services",
        item: "Community services",
        description: "Identify gaps in community services and consider how the design can help fill these needs. Consider both short-term and long-term solutions.",
        actions: "Map community service gaps (e.g., health, childcare, leisure) and consider project co-benefits or contributions.",
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
  }, [responses, priorities, sectionId, section.items, onDataChange]);

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

export default function SocialImpactWellbeing({ data, onDataChange, onNext }) {
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
          Next: Innovation & Technology
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}