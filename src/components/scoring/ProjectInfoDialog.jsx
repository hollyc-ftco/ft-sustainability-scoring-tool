import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

export default function ProjectInfoDialog({ open, onOpenChange, onStartAssessment }) {
  const [projectNumber, setProjectNumber] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [department, setDepartment] = useState("");
  const [createdByName, setCreatedByName] = useState("");
  const [projectStage, setProjectStage] = useState("Tender");
  const [validationError, setValidationError] = useState("");

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  // Auto-fill project details when project number changes
  useEffect(() => {
    if (projectNumber && allProjects.length > 0) {
      const existingProject = allProjects.find(
        p => p.project_number === projectNumber
      );
      
      if (existingProject) {
        if (existingProject.project_name && !projectName) {
          setProjectName(existingProject.project_name);
        }
        if (existingProject.project_owner && !projectOwner) {
          setProjectOwner(existingProject.project_owner);
        }
        if (existingProject.department && !department) {
          setDepartment(existingProject.department);
        }
      }
    }
  }, [projectNumber, allProjects]);

  const canSelectActive = () => {
    if (!projectNumber) return false;
    const tenderAssessment = allProjects.find(
      p => p.project_number === projectNumber && p.project_stage === "Tender"
    );
    return !!tenderAssessment;
  };

  const tenderExists = () => {
    if (!projectNumber) return false;
    return allProjects.some(
      p => p.project_number === projectNumber && p.project_stage === "Tender"
    );
  };

  const completeExists = () => {
    if (!projectNumber) return false;
    return allProjects.some(
      p => p.project_number === projectNumber && p.project_stage === "Complete"
    );
  };

  const generateReference = (stage) => {
    if (!projectNumber) return "";
    
    const stagePrefix = stage === "Active" ? "A" : stage === "Tender" ? "T" : "C";
    
    const existingAssessments = allProjects.filter(
      p => p.project_number === projectNumber && p.project_stage === stage
    );
    
    const nextNumber = existingAssessments.length + 1;
    const formattedNumber = String(nextNumber).padStart(3, '0');
    
    return `${projectNumber}_${stagePrefix}_${formattedNumber}`;
  };

  const handleProjectStageChange = (value) => {
    setValidationError("");
    
    if (value === "Tender" && tenderExists()) {
      setValidationError("Only one Tender assessment is allowed per project number.");
      return;
    }
    
    if (value === "Complete" && completeExists()) {
      setValidationError("Only one Complete assessment is allowed per project number.");
      return;
    }
    
    setProjectStage(value);
  };

  const handleStart = () => {
    if (!projectNumber || !projectName || !projectOwner) {
      setValidationError("Please enter project number, project name and owner");
      return;
    }

    if (projectStage === "Tender" && tenderExists()) {
      setValidationError("Only one Tender assessment is allowed per project number.");
      return;
    }

    if (projectStage === "Complete" && completeExists()) {
      setValidationError("Only one Complete assessment is allowed per project number.");
      return;
    }

    onStartAssessment({
      projectNumber,
      projectName,
      projectOwner,
      department,
      createdByName,
      projectStage,
      reference: generateReference(projectStage)
    });
    
    // Reset form
    setProjectNumber("");
    setProjectName("");
    setProjectOwner("");
    setDepartment("");
    setCreatedByName("");
    setProjectStage("Tender");
    setValidationError("");
  };

  const handleClose = () => {
    setProjectNumber("");
    setProjectName("");
    setProjectOwner("");
    setDepartment("");
    setCreatedByName("");
    setProjectStage("Tender");
    setValidationError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Start New Assessment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {validationError}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dialogProjectNumber">Project Number *</Label>
              <Input
                id="dialogProjectNumber"
                placeholder="Enter project number"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialogProjectStage">Project Stage *</Label>
              <Select value={projectStage} onValueChange={handleProjectStageChange}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select project stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tender">Tender</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                </SelectContent>
              </Select>
              {projectNumber && (
                <p className="text-xs text-blue-600 mt-1">
                  Reference: {generateReference(projectStage)}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dialogProjectName">Project Name *</Label>
            <Input
              id="dialogProjectName"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dialogProjectOwner">Project Owner *</Label>
            <Input
              id="dialogProjectOwner"
              placeholder="Enter project owner"
              value={projectOwner}
              onChange={(e) => setProjectOwner(e.target.value)}
              className="border-emerald-200 focus:border-emerald-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dialogDepartment">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Circular Economy & Environment">Circular Economy & Environment</SelectItem>
                  <SelectItem value="Energy and Planning">Energy and Planning</SelectItem>
                  <SelectItem value="Sustainable Infrastructure">Sustainable Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialogCreatedBy">Created By</Label>
              <Input
                id="dialogCreatedBy"
                placeholder="Enter your name"
                value={createdByName}
                onChange={(e) => setCreatedByName(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStart}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}