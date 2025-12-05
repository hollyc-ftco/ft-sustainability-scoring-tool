import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminItemEditor({ 
  open, 
  onOpenChange, 
  item, 
  onSave,
  isNew = false 
}) {
  const [formData, setFormData] = useState(item || {
    id: "",
    item: "",
    description: "",
    actions: "",
    defaultPriority: 2
  });

  React.useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: "",
        item: "",
        description: "",
        actions: "",
        defaultPriority: 2
      });
    }
  }, [item, open]);

  const handleSave = () => {
    const savedItem = {
      ...formData,
      id: formData.id || formData.item.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    };
    onSave(savedItem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Item" : "Edit Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item Name</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              placeholder="Enter item name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actions">Actions</Label>
            <Textarea
              id="actions"
              value={formData.actions}
              onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
              placeholder="Enter recommended actions"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={String(formData.defaultPriority)}
              onValueChange={(value) => setFormData({ ...formData, defaultPriority: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Mandatory</SelectItem>
                <SelectItem value="2">2 - Best Practice</SelectItem>
                <SelectItem value="3">3 - Stretch Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            {isNew ? "Add Item" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}