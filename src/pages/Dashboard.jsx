import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Award, FileText } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome to FT Sustainability Scoring Tool</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">No projects yet</p>
            </CardContent>
          </Card>

          <Card className="border-teal-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">-</div>
              <p className="text-xs text-gray-500 mt-1">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">85-100 points</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Improvement</CardTitle>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">-</div>
              <p className="text-xs text-gray-500 mt-1">Month over month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Use the <span className="font-semibold text-emerald-600">Scoring Tool</span> to view the sustainability framework and begin assessing your projects.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-800">
                The FT Sustainability Scoring Tool evaluates projects across 8 key categories, ensuring comprehensive sustainability assessment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}