import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Award, BarChart3 } from "lucide-react";

export default function Reports() {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600 text-lg">Comprehensive sustainability reporting and analytics</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span>Summary Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Generate comprehensive summary reports for all assessments</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span>Trend Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Track performance trends across multiple projects and stages</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span>Certification Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Export reports formatted for sustainability certifications</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span>Category Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Deep dive into specific category performance and insights</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100 bg-white/60 backdrop-blur-sm mt-8">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <CardTitle className="text-2xl">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Reporting Features</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're working on advanced reporting capabilities including automated report generation, 
              comparative analysis, benchmark tracking, and export to various formats (PDF, Excel, etc.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}