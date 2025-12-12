import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Maximize2, Loader2, AlertCircle, BarChart3, X } from 'lucide-react';
import { Icon } from "@iconify/react";

interface ChartData {
  salesTrend: { year: string; sales: number }[];
  companies: { name: string; sales: number; color: string }[];
  region: { name: string; value: number; color: string }[];
  brand: { brand: string; sales: number }[];
}

interface SalesChartsProps {
  chartData: ChartData;
  dashboardData?: any;
  isLoading?: boolean;
  error?: string | null;
}

const SalesCharts: React.FC<SalesChartsProps> = ({ chartData, dashboardData, isLoading, error }) => {
  const [selectedMaxView, setSelectedMaxView] = useState<string | null>(null);

  // Color palettes for charts - Modern and attractive combinations
  const companyColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];
  const regionColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];
  const areaColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#fcd34d', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8'];
  const warehouseColors = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'];
  const salesmanColors = ['#f59e0b', '#fb923c', '#fbbf24', '#facc15', '#fde047', '#fef08a'];

  // Transform API data for charts
  const companyData = dashboardData?.charts?.company_sales?.map((item: any, idx: number) => ({
    name: item.company_name,
    value: item.value || 0,
    color: companyColors[idx % companyColors.length]
  })) || [];

  const regionData = dashboardData?.charts?.region_sales?.map((item: any, idx: number) => ({
    name: item.region_name,
    value: item.value || 0,
    color: regionColors[idx % regionColors.length]
  })) || [];

  const areaData = dashboardData?.charts?.area_sales_bar?.map((item: any, idx: number) => ({
    name: item.area_name,
    value: item.value || 0,
    color: areaColors[idx % areaColors.length]
  })) || [];

  const warehouseData = dashboardData?.charts?.warehouse_sales_bar?.map((item: any, idx: number) => ({
    name: item.warehouse_name,
    value: item.value || 0,
    color: warehouseColors[idx % warehouseColors.length]
  })) || [];

  const salesmanData = dashboardData?.charts?.salesman_sales_bar?.map((item: any, idx: number) => ({
    name: item.salesman_name,
    value: item.value || 0,
    color: salesmanColors[idx % salesmanColors.length]
  })) || [];

  // Region-specific charts
  const regionContributionData = dashboardData?.charts?.region_contribution_top_item?.map((item: any, idx: number) => ({
    regionName: item.region_name,
    itemName: item.item_name,
    value: item.value || 0,
    color: regionColors[idx % regionColors.length]
  })) || [];

  const regionVisitedCustomerData = dashboardData?.charts?.region_visited_customer_trend || [];

  // Area-specific charts
  const areaContributionData = dashboardData?.charts?.area_contribution_top_item?.map((item: any, idx: number) => ({
    areaName: item.area_name,
    itemName: item.item_name,
    value: item.value || 0,
    color: areaColors[idx % areaColors.length]
  })) || [];

  const areaVisitedCustomerData = dashboardData?.charts?.area_visited_customer_trend || [];

  // Company sales trend data - sorted chronologically
  const companySalesTrend = dashboardData?.charts?.company_sales_trend 
    ? [...dashboardData.charts.company_sales_trend].sort((a: any, b: any) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const aMonth = monthOrder.indexOf(a.period.split('-')[0]);
        const bMonth = monthOrder.indexOf(b.period.split('-')[0]);
        return aMonth - bMonth;
      })
    : [];

  // Region sales trend data
  const regionSalesTrend = dashboardData?.charts?.region_sales_trend 
    ? [...dashboardData.charts.region_sales_trend].sort((a: any, b: any) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const aMonth = monthOrder.indexOf(a.period.split('-')[0]);
        const bMonth = monthOrder.indexOf(b.period.split('-')[0]);
        return aMonth - bMonth;
      })
    : [];

  // Area sales trend data
  const areaSalesTrend = dashboardData?.charts?.area_sales_trend 
    ? [...dashboardData.charts.area_sales_trend].sort((a: any, b: any) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const aMonth = monthOrder.indexOf(a.period.split('-')[0]);
        const bMonth = monthOrder.indexOf(b.period.split('-')[0]);
        return aMonth - bMonth;
      })
    : [];

  // Top salesmen data from tables (take top 10)
  const topSalesmenData = dashboardData?.tables?.top_salesmen?.slice(0, 10).map((item: any, idx: number) => ({
    name: item.salesman,
    value: item.value || 0,
    color: salesmanColors[idx % salesmanColors.length]
  })) || [];

  // Top warehouses data from tables (take top 10)
  const topWarehousesData = dashboardData?.tables?.top_warehouses?.slice(0, 10).map((item: any, idx: number) => ({
    name: item['?column?'] || item.warehouse_name,
    value: item.value || 0,
    color: warehouseColors[idx % warehouseColors.length]
  })) || [];

  // Get the data level from API response
  const dataLevel = dashboardData?.level || 'company';

  // Debug: Check sales trend data
  console.log('📊 Company Sales Trend Data:', companySalesTrend);
  console.log('📊 Region Sales Trend Data:', regionSalesTrend);
  console.log('📊 Area Sales Trend Data:', areaSalesTrend);
  console.log('📊 Data Level:', dataLevel);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 mt-5">
        <Icon icon="eos-icons:loading" width="48" height="48" className="text-blue-600 mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading dashboard data...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-20 mt-5">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-lg font-medium text-gray-700">Failed to load dashboard</p>
        <p className="text-sm text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!dashboardData || !dashboardData.charts) {
    return (
      <div className="flex flex-col justify-center items-center py-20 mt-5">
        <BarChart3 size={48} className="text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">No data available</p>
        <p className="text-sm text-gray-500 mt-2">Select filters and date range, then click the Dashboard button</p>
      </div>
    );
  }

  const totalCompany = companyData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalRegion = regionData.reduce((sum: number, item: any) => sum + item.value, 0);

  // Table data transformations
  const topSalesmenTable = dashboardData?.tables?.top_salesmen?.slice(0, 10) || [];
  const topWarehousesTable = dashboardData?.tables?.top_warehouses?.slice(0, 10) || [];
  const topCustomersTable = dashboardData?.tables?.top_customers?.slice(0, 10).map((customer: any) => ({
    name: customer.customer_name,
    contact: customer.contact,
    warehouse: customer.warehouse_name,
    value: customer.value
  })) || [];
  const topItemsTable = dashboardData?.tables?.top_items?.slice(0, 10).map((item: any) => ({
    name: item.item_name,
    value: item.value
  })) || [];

  // Pie chart data transformations
  const topSalesmenChartData = topSalesmenTable.slice(0, 10).map((salesman: any, idx: number) => ({
    name: salesman.salesman,
    value: salesman.value || 0,
    color: salesmanColors[idx % salesmanColors.length]
  }));

  const topWarehousesChartData = topWarehousesTable.slice(0, 10).map((warehouse: any, idx: number) => ({
    name: warehouse['?column?'] || warehouse.warehouse_name,
    value: warehouse.value || 0,
    color: warehouseColors[idx % warehouseColors.length]
  }));

  const topCustomersChartData = topCustomersTable.slice(0, 10).map((customer: any, idx: number) => ({
    name: customer.name,
    value: customer.value || 0,
    color: ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa', '#f472b6', '#fb7185', '#fdba74', '#fde047'][idx % 10]
  }));

  const topItemsChartData = topItemsTable.slice(0, 10).map((item: any, idx: number) => ({
    name: item.name,
    value: item.value || 0,
    color: ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308', '#f59e0b', '#f97316', '#ef4444', '#ec4899'][idx % 10]
  }));

  const totalSalesmen = topSalesmenChartData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalWarehouses = topWarehousesChartData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalCustomers = topCustomersChartData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalItems = topItemsChartData.reduce((sum: number, item: any) => sum + item.value, 0);

  // Maximized Modal Component
  const MaximizedView = () => {
    if (!selectedMaxView) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[95vh] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedMaxView === 'company' && 'Company Sales Details'}
              {selectedMaxView === 'region' && 'Region Sales Details'}
              {selectedMaxView === 'area' && 'Area Sales Details'}
              {selectedMaxView === 'trend' && 'Sales Trend Details'}
              {selectedMaxView === 'salesmen' && 'Top Salesmen Details'}
              {selectedMaxView === 'warehouses' && 'Top Warehouses Details'}
              {selectedMaxView === 'customers' && 'Top Customers Details'}
              {selectedMaxView === 'items' && 'Top Items Details'}
            </h2>
            <button 
              onClick={() => setSelectedMaxView(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Company View */}
            {selectedMaxView === 'company' && companyData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Sales Distribution</h3>
                  <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={companyData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${((value / totalCompany) * 100).toFixed(1)}%`}
                          labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                          {companyData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Sales Table</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Company Name</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-700">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyData.map((company: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4 text-gray-800 font-medium">{company.name}</td>
                          <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                            ${company.value?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            {((company.value / totalCompany) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Region View */}
            {selectedMaxView === 'region' && regionData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Region Sales Distribution</h3>
                  <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={100}
                          outerRadius={180}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${((value / totalRegion) * 100).toFixed(1)}%`}
                          labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                          {regionData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Region Sales Table</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Region Name</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-700">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regionData.map((region: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4 text-gray-800 font-medium">{region.name}</td>
                          <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                            ${region.value?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            {((region.value / totalRegion) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Area View */}
            {selectedMaxView === 'area' && areaData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Area Sales Distribution</h3>
                  <div className="w-full h-[600px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={areaData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 13 }}
                          angle={-45}
                          textAnchor="end"
                          height={120}
                        />
                        <YAxis 
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="value" barSize={30} radius={[8, 8, 0, 0]}>
                          {areaData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Area Sales Table</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Area Name</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaData.map((area: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                          <td className="px-6 py-4 text-gray-800 font-medium">{area.name}</td>
                          <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                            ${area.value?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Trend View */}
            {selectedMaxView === 'trend' && (companySalesTrend.length > 0 || regionSalesTrend.length > 0 || areaSalesTrend.length > 0) && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {dataLevel === 'company' ? 'Company Sales Trend' : 
                     dataLevel === 'region' ? 'Region Sales Trend' : 
                     'Area Sales Trend'}
                  </h3>
                  <div className="w-full h-[600px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={
                        dataLevel === 'company' ? companySalesTrend :
                        dataLevel === 'region' ? regionSalesTrend :
                        areaSalesTrend
                      }>
                        <defs>
                          <linearGradient id="trendGradientMax" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="period"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                          tick={{ fontSize: 13 }}
                        />
                        <Tooltip 
                          formatter={(value: any) => `$${value.toLocaleString()}`}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Area 
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          fill="url(#trendGradientMax)"
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, fill: '#6d28d9' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Trend Data Table</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">Period</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dataLevel === 'company' ? companySalesTrend :
                        dataLevel === 'region' ? regionSalesTrend :
                        areaSalesTrend).map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-800 font-medium">{item.period}</td>
                          <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                            ${item.value?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Salesmen View */}
            {selectedMaxView === 'salesmen' && topSalesmenChartData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Salesmen Distribution</h3>
                  <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topSalesmenChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${((value / totalSalesmen) * 100).toFixed(1)}%`}
                          labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                          {topSalesmenChartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Salesmen Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Salesman Name</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSalesmenChartData.map((salesman: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-gray-800 font-medium">{salesman.name}</td>
                            <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                              ${salesman.value?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                              {((salesman.value / totalSalesmen) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Warehouses View */}
            {selectedMaxView === 'warehouses' && topWarehousesChartData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Warehouses Distribution</h3>
                  <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topWarehousesChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${((value / totalWarehouses) * 100).toFixed(1)}%`}
                          labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                          {topWarehousesChartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Warehouses Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Warehouse Name</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topWarehousesChartData.map((warehouse: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-gray-800 font-medium">{warehouse.name}</td>
                            <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                              ${warehouse.value?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                              {((warehouse.value / totalWarehouses) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Customers View */}
            {selectedMaxView === 'customers' && topCustomersChartData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Customers Distribution</h3>
                  <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topCustomersChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${((value / totalCustomers) * 100).toFixed(1)}%`}
                          labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                          {topCustomersChartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Customers Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Customer Name</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Sales Value</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomersChartData.map((customer: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-gray-800 font-medium">{customer.name}</td>
                            <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                              ${customer.value?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                              {((customer.value / totalCustomers) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Items View */}
            {selectedMaxView === 'items' && topItemsChartData.length > 0 && (
              <>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Items Distribution</h3>
                  <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topItemsChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${((value / totalItems) * 100).toFixed(1)}%`}
                          labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                          {topItemsChartData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 border rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Items Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Rank</th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700">Item Name</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Quantity</th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topItemsChartData.map((item: any, index: number) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-gray-800 font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-right text-gray-800 font-semibold">
                              {item.value?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                              {((item.value / totalItems) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5 space-y-6">
      {/* Maximized View Modal */}
      <MaximizedView />

      {/* Row 1: Company Pie Chart + Region Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Sales - Pie Chart */}
        {companyData.length > 0 && (
          <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Company Sales</h3>
              <button 
                onClick={() => setSelectedMaxView('company')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ value }) => `${((value / totalCompany) * 100).toFixed(1)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {companyData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {companyData.map((company: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }}></div>
                  <span className="text-xs text-gray-600">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Region Sales - Donut Chart */}
        {regionData.length > 0 && (
          <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Region Sales</h3>
              <button 
                onClick={() => setSelectedMaxView('region')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${((value / totalRegion) * 100).toFixed(1)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {regionData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Area Bar Graph (Full Width) */}
      {areaData.length > 0 && (
        <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Area Sales</h3>
            <button 
              onClick={() => setSelectedMaxView('area')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Bar dataKey="value" barSize={20} radius={[2, 3, 0, 0]}>
                  {areaData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Row 3: Trend Line Graph (Full Width) */}
      {(companySalesTrend.length > 0 || regionSalesTrend.length > 0 || areaSalesTrend.length > 0) && (
        <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {dataLevel === 'company' ? 'Company Sales Trend' : 
               dataLevel === 'region' ? 'Region Sales Trend' : 
               'Area Sales Trend'}
            </h3>
            <button 
              onClick={() => setSelectedMaxView('trend')}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={
                dataLevel === 'company' ? companySalesTrend :
                dataLevel === 'region' ? regionSalesTrend :
                areaSalesTrend
              }>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: any) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `${label}`}
                />
                <Area 
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#trendGradient)"
                  dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, fill: '#6d28d9' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Row 4: Top Salesman + Top Warehouse Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Salesman Pie Chart */}
        {topSalesmenChartData.length > 0 && (
          <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Salesmen</h3>
              <button 
                onClick={() => setSelectedMaxView('salesmen')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topSalesmenChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ value }) => `${((value / totalSalesmen) * 100).toFixed(1)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {topSalesmenChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2 max-h-20 overflow-y-auto">
              {topSalesmenChartData.map((salesman: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: salesman.color }}></div>
                  <span className="text-xs text-gray-600 truncate max-w-[100px]">{salesman.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Warehouse Pie Chart */}
        {topWarehousesChartData.length > 0 && (
          <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Warehouses</h3>
              <button 
                onClick={() => setSelectedMaxView('warehouses')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topWarehousesChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ value }) => `${((value / totalWarehouses) * 100).toFixed(1)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {topWarehousesChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2 max-h-20 overflow-y-auto">
              {topWarehousesChartData.map((warehouse: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: warehouse.color }}></div>
                  <span className="text-xs text-gray-600 truncate max-w-[100px]">{warehouse.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 5: Top Customer + Top Item Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customer Pie Chart */}
        {topCustomersChartData.length > 0 && (
          <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Customers</h3>
              <button 
                onClick={() => setSelectedMaxView('customers')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCustomersChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ value }) => `${((value / totalCustomers) * 100).toFixed(1)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {topCustomersChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2 max-h-20 overflow-y-auto">
              {topCustomersChartData.map((customer: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: customer.color }}></div>
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">{customer.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Item Pie Chart */}
        {topItemsChartData.length > 0 && (
          <div className="bg-white p-5 border rounded-lg shadow-sm border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Items</h3>
              <button 
                onClick={() => setSelectedMaxView('items')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topItemsChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ value }) => `${((value / totalItems) * 100).toFixed(1)}%`}
                    labelLine={{ stroke: '#888', strokeWidth: 1 }}
                  >
                    {topItemsChartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2 max-h-20 overflow-y-auto">
              {topItemsChartData.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCharts;
