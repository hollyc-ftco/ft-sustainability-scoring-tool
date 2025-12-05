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
  biodiversity_preservation: {
    title: "Biodiversity Preservation",
    items: [
      {
        id: "surveys_protected_species",
        item: "Surveys for protected species",
        description: "Appropriate surveys for protected plant and animal species have been undertaken at each stage of the project, and plans for protecting them have been drawn up, approved, monitored and achieved.",
        actions: "Ecologist to conduct surveys, species protection plans. Include seasonal timing considerations in surveys (e.g. bats in summer, newts in spring). Commit to updating surveys if works are delayed (>12 months).",
        defaultPriority: 1
      },
      {
        id: "bng_assessment",
        item: "Biodiversity Net Gain Assessment",
        description: "Assess and commit to achieving biodiversity net gain (BNG) on the project site.",
        actions: "Use DEFRA Biodiversity Metric 4.0 or Irish equivalents; calculate pre- and post-development biodiversity units; set targets for net gain (e.g. +10%).",
        defaultPriority: 2
      },
      {
        id: "ecological_monitoring",
        item: "Ecological Monitoring Plan (Post-Construction)",
        description: "Ensure that biodiversity performance is maintained or improved after construction.",
        actions: "Specify monitoring intervals (e.g. 1, 3, 5 years); assign responsibility to ecologist; include trigger actions for deterioration.",
        defaultPriority: 2
      },
      {
        id: "landscape_integration",
        item: "Integration with Landscape Design",
        description: "Maximise ecological value through synergy between ecology and landscaping.",
        actions: "Select flora that supports native fauna; align planting with All-Ireland Pollinator Plan; integrate multi-benefit green infrastructure (e.g. swales, hedgerows).",
        defaultPriority: 1
      },
      {
        id: "biodiversity_training",
        item: "Biodiversity Training for Site Teams",
        description: "Raise awareness among construction workers about site-specific biodiversity risks.",
        actions: "Deliver toolbox talks and signage; include biodiversity protection in induction training.",
        defaultPriority: 2
      },
      {
        id: "species_enhancements",
        item: "Species-Specific Enhancements",
        description: "Target species of local concern through design measures.",
        actions: "Install specific features (e.g. swift bricks, amphibian tunnels, otter holts) based on ecological surveys.",
        defaultPriority: 2
      },
      {
        id: "invasive_species",
        item: "Injurious or invasive species",
        description: "If invasive animal or plant species or injurious weeds have been found on site, a method of statement for their control has been drawn up and approved at the start of the construction; and monitored and achieved during the construction.",
        actions: "Identify and map invasive species on site, Control plan for removal or containment.",
        defaultPriority: 1
      },
      {
        id: "survey_evaluation",
        item: "Survey and evaluation of ecological value",
        description: "Ecologist has been appointed to ensure involvement with decisions relating to general and detailed site configuration and to ensure that protection and enhancement opportunities can be realised. Before the completion of the Brief project stage, the ecologist has carried out a survey to determine the ecological baseline.",
        actions: "Integrate findings into design to enhance and protect biodiversity.",
        defaultPriority: 1
      },
      {
        id: "conservation_consultation",
        item: "Consultation with conservation organisations",
        description: "The client has consulted with relevant conservation organisations and communicated to relevant project team members during each project stage.",
        actions: "Engage with conservation groups during design and construction phases, document consultation outcomes.",
        defaultPriority: 2
      },
      {
        id: "high_ecological_value",
        item: "Land of high ecological value",
        description: "The project had not used land or seabed that has been identified as of high ecological value.",
        actions: "Avoid disturbance of identified high-value habitats or species areas, avoid mitigation.",
        defaultPriority: 2
      },
      {
        id: "ecological_works_plan",
        item: "Ecological works plan",
        description: "An ecological works plan has been drawn up and implemented during construction.",
        actions: "Develop plan specifying ecological protection and enhancement actions, monitor plan.",
        defaultPriority: 2
      },
      {
        id: "managing_negative_impacts",
        item: "Managing negative impacts on existing ecological value",
        description: "Negative impacts on existing ecological value from site preparation and construction works have been managed according to the mitigation hierarchy.",
        actions: "Design site access and working areas to avoid sensitive habitats, rehabilitate disturbed areas as soon as practicable. Apply mitigation hierarchy: avoid > minimise > restore > offset. Include temporary ecological buffers during construction.",
        defaultPriority: 2
      },
      {
        id: "monitoring_protection",
        item: "Monitoring protection, mitigation and compensation measures",
        description: "The implementation of recommendations for existing ecological features has been monitored throughout the course of the contract.",
        actions: "Appoint ecology team to oversee and document mitigation, regular site inspections.",
        defaultPriority: 2
      },
      {
        id: "success_measures",
        item: "Success of protection, mitigation and compensation measures",
        description: "Monitoring data shows that the implementation of the recommendations for existing ecological features has been successful.",
        actions: "Analyse monitoring data to check if ecological targets are met. Include quantitative success criteria (e.g. species richness, canopy cover). Compare against baseline or control areas.",
        defaultPriority: 2
      },
      {
        id: "change_ecological_value",
        item: "Change in ecological value",
        description: "The change in ecological value occurring as a result of the project has been calculated.",
        actions: "Calculate ecological value, compare pre and post project values to assess impact.",
        defaultPriority: 2
      },
      {
        id: "enhancing_features",
        item: "Enhancing existing ecological features",
        description: "Recommendations for enhancing the existing ecological features of the site have been identified and incorporated in the project.",
        actions: "Protect and enhance existing habitats, boost biodiversity.",
        defaultPriority: 2
      },
      {
        id: "new_habitat",
        item: "New wildlife habitat",
        description: "Recommendations or opportunities for creating new wildlife habitats have been identified and incorporated in the project.",
        actions: "Design habitats to suit local priority species.",
        defaultPriority: 2
      },
      {
        id: "special_structures",
        item: "Special structures or facilities for wildlife",
        description: "Recommendations or opportunities for installing special structures or facilities for encouraging or accommodating appropriate wildlife have been identified and incorporated in the project.",
        actions: "Bat boxes, bird boxes, green roofs.",
        defaultPriority: 2
      },
      {
        id: "water_environment",
        item: "Improving the water environment",
        description: "Opportunities to improve the local water environment have been considered, identified and, where appropriate, implemented.",
        actions: "Incorporate SuDS to improve water quality and reduce runoff, restore watercourses or wetland areas.",
        defaultPriority: 2
      },
      {
        id: "incorporating_water",
        item: "Incorporating existing water features",
        description: "Existing water features have been incorporated in the design.",
        actions: "Retain and protect streams, ponds or ditches in design layout, enhance existing water bodies for biodiversity.",
        defaultPriority: 2
      },
      {
        id: "ongoing_management",
        item: "Ongoing ecological management",
        description: "A landscape and ecology management plan has been developed that covers the first five years after the project completion and includes actions & responsibilities to give to relevant individuals, the ecological value of the site over the development life, guidance to trigger remedial actions to address previously unforeseen impacts, clearly defined roles and responsibilities.",
        actions: "Develop landscape and ecology management plans, assign responsibility. Include governance for adaptive management (e.g. what to do if targets aren't met). Integrate with post-construction landscape maintenance contracts.",
        defaultPriority: 2
      },
      {
        id: "monitoring_programme",
        item: "Programme for monitoring",
        description: "There is a program in place for monitoring the success or otherwise of any management, habitat creation or translocation and species conservation measures undertaken.",
        actions: "Programme designed by an ecologist for monitoring purposes.",
        defaultPriority: 2
      },
      {
        id: "net_positive",
        item: "Net Positive Biodiversity",
        description: "Aim to measurably improve local biodiversity and habitat quality beyond pre-development state.",
        actions: "Use DEFRA or equivalent Irish metrics to measure improvement; restore degraded habitats; support native species recovery programs.",
        defaultPriority: 3
      },
      {
        id: "ecological_succession",
        item: "Ecological Succession Support",
        description: "Design infrastructure to evolve and support changing ecosystems over time.",
        actions: "Include space for natural succession; phased planting to increase structural diversity.",
        defaultPriority: 3
      }
    ]
  },
  ecological_connectivity: {
    title: "Ecological Connectivity",
    items: [
      {
        id: "wide_area_survey",
        item: "Wide-area habitat survey",
        description: "Surveys focusing on habitats, migration routes and breeding routes of protected species has been undertaken over the wide area around the project. Establish principal animal movements.",
        actions: "Carry out appropriate surveys.",
        defaultPriority: 1
      },
      {
        id: "connectivity_infrastructure",
        item: "Connectivity infrastructure",
        description: "Provide for connectivity between habitats fragmented by new infrastructure, utilising ecological corridors.",
        actions: "Identify potential for connectivity infrastructure. Implement connectivity infrastructure on project.",
        defaultPriority: 2
      },
      {
        id: "existing_infrastructure",
        item: "Existing infrastructure",
        description: "Prioritise re-utilising land occupied by previous existing infrastructure to minimise strain on natural habitats, resulting from new developments.",
        actions: "Identify existing infrastructure which could be re-used. Keep new infrastructure to existing footprint where possible.",
        defaultPriority: 2
      },
      {
        id: "areas_high_value",
        item: "Areas of high value",
        description: "Avoid development through areas and locations of high ecological importance, including breeding and nesting grounds.",
        actions: "Appropriate ecological surveys. Identify high biodiversity value areas. Provide appropriate protections and measures to ensure no damage to high value biodiversity areas.",
        defaultPriority: 2
      },
      {
        id: "freshwater_systems",
        item: "Freshwater systems",
        description: "Conserve water flows and riparian communities.",
        actions: "Conduct hydrological and ecological baseline assessments. Avoid modification of natural watercourses (e.g. culverting). Maintain minimum ecological flow regimes. Implement pollution prevention measures. Enhance riparian zones with native planting. Use SuDS to regulate flow and quality.",
        defaultPriority: 2
      }
    ]
  },
  planting: {
    title: "Planting",
    items: [
      {
        id: "street_design",
        item: "Street design",
        description: "Provide for plant cover when designing infrastructure, including green verges, SuDS, green hedges. Prioritise natural designs and plants over engineered grey infrastructure solution like fencing or large paved areas and shoulders.",
        actions: "Include green verges, SuDS, and hedgerows in design. Replace fencing with natural barriers where feasible. Select climate-resilient, native species. Avoid excessive hard surfacing.",
        defaultPriority: 1
      },
      {
        id: "landscaping",
        item: "Landscaping",
        description: "Prioritise planting native plant species as part of floral landscaping, considering the objectives of planning; the adaptability, maintenance needs, characteristics of the plant species; its resistance to diseases, and its impacts on humans.",
        actions: "Specify native, non-invasive plant species. Select plants based on low maintenance and disease resistance. Incorporate flowering species for pollinators. Align with landscape character and planning policy.",
        defaultPriority: 1
      },
      {
        id: "bee_pastures",
        item: "Bee pastures",
        description: "Implement bee pasturage in larger scale infrastructure projects by planting diverse flowering plants to provide nourishment for bees.",
        actions: "Plant flowering meadows or strips along roadsides and open spaces. Include diverse, long-blooming species. Avoid pesticide and herbicide use in bee zones. Include signage and monitoring plans.",
        defaultPriority: 2
      }
    ]
  },
  sustainable_land_use: {
    title: "Sustainable Land Use",
    items: [
      {
        id: "land_use_strategy",
        item: "Land use strategy",
        description: "Project brief includes instructions to consider how to balance land use efficiency with other priorities.",
        actions: "Integrate land-use efficiency into the brief. Include multi-functionality (e.g. amenity, habitat, SuDS). Identify brownfield or previously developed land.",
        defaultPriority: 2
      },
      {
        id: "project_location_alternatives",
        item: "Project location alternatives",
        description: "The client has collected sufficient information to make decisions on the project's location.",
        actions: "Provide location assessment matrix. Compare ecological, social, and engineering constraints. Document reasons for chosen site.",
        defaultPriority: 2
      },
      {
        id: "consideration_alternatives",
        item: "Consideration of project location alternatives",
        description: "There was a process for considering the merits of the project location alternatives.",
        actions: "Carry out comparative sustainability and impact assessments. Engage stakeholders on preferred locations. Include in options appraisal.",
        defaultPriority: 2
      },
      {
        id: "site_suitability",
        item: "Site suitability",
        description: "Studies have been undertaken to confirm that the chosen site was suitable, evaluating the key risks and opportunities of the site.",
        actions: "Conduct site suitability study (ecology, flooding, geology). Document constraints and mitigation measures. Confirm land-use compatibility with planning zones.",
        defaultPriority: 1
      },
      {
        id: "land_use_efficiency",
        item: "Land use efficiency",
        description: "The land-take of different scheme designs, process designs and layouts of the planned works have been calculated, influencing the design process and the land-use efficiency of the final design.",
        actions: "Optimise layout to minimise land-take. Include vertical integration (e.g. stacking uses). Use compact construction footprints.",
        defaultPriority: 2
      },
      {
        id: "selecting_temporary_land",
        item: "Selecting temporary land",
        description: "A process of selecting temporary land has been employed.",
        actions: "Prioritise previously used or degraded land. Avoid sensitive or high ecological value areas. Include restoration plan in site use plan.",
        defaultPriority: 2
      },
      {
        id: "temporary_land_use",
        item: "Temporary land use",
        description: "The construction team has made effective use of land resources made available to them and minimised the long-term adverse impacts of the temporary greenfield land take during construction.",
        actions: "Minimise footprint and duration of temporary land-take. Prevent compaction and erosion. Restore to pre-construction state or better.",
        defaultPriority: 2
      },
      {
        id: "previous_use",
        item: "Previous use of the site",
        description: "The site has been previously used for built environment.",
        actions: "Prioritise brownfield sites. Document historical land use and contamination risks. Evaluate suitability for regeneration.",
        defaultPriority: 1
      },
      {
        id: "conservation_soils",
        item: "Conservation of soils and other on-site resources",
        description: "Site selection also took into consideration the conservation of topsoils, subsoil, seabed surface geology and conservation or use of on-site mineral resources.",
        actions: "Strip and store topsoil appropriately. Prevent erosion and compaction. Reuse soil and aggregate on-site where possible.",
        defaultPriority: 2
      },
      {
        id: "land_contamination",
        item: "Land contamination risk assessment",
        description: "A study focusing on issues related to soil, groundwater, gas, residual man-made structures and surrounding land uses was undertaken.",
        actions: "Conduct Phase I and II assessments. Develop remediation strategy if needed. Mitigate pathways for human/environmental exposure.",
        defaultPriority: 1
      },
      {
        id: "prevention_contamination",
        item: "Prevention of future contamination",
        description: "Pollution control measures are in place to prevent any future contamination occurring in relation to the site.",
        actions: "Include pollution control design (bunds, interceptors). Establish site-wide surface water and spill management. Monitor compliance post-construction.",
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

export default function BiodiversityEcosystem({ data, onDataChange, onNext }) {
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
          Next: Transport & Mobility
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}