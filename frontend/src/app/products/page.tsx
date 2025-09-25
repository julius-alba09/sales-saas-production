'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Package,
  Star,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Copy,
  Archive
} from 'lucide-react'
import { Navigation } from '@/components/navigation/Navigation'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductModal } from '@/components/products/ProductModal'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  status: 'active' | 'inactive' | 'archived'
  commission: number
  created: string
  totalSales: number
  conversionRate: number
}

interface Offer {
  id: string
  productId: string
  productName: string
  name: string
  discount: number
  discountType: 'percentage' | 'fixed'
  validFrom: string
  validTo: string
  status: 'active' | 'inactive' | 'expired'
  used: number
  limit?: number
}

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'offers'>('products')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | Offer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - would come from API
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Coaching Package',
      description: 'Comprehensive business coaching with 1-on-1 sessions',
      price: 2500,
      category: 'A',
      status: 'active',
      commission: 15,
      created: '2024-01-15',
      totalSales: 45,
      conversionRate: 12.5
    },
    {
      id: '2', 
      name: 'Marketing Automation Suite',
      description: 'Complete marketing automation and funnel system',
      price: 1800,
      category: 'B',
      status: 'active',
      commission: 20,
      created: '2024-02-01',
      totalSales: 32,
      conversionRate: 8.2
    },
    {
      id: '3',
      name: 'Sales Training Course',
      description: 'Advanced sales techniques and closing strategies',
      price: 997,
      category: 'C',
      status: 'active',
      commission: 25,
      created: '2024-01-20',
      totalSales: 28,
      conversionRate: 15.8
    }
  ])

  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      productId: '1',
      productName: 'Premium Coaching Package',
      name: 'Early Bird Special',
      discount: 500,
      discountType: 'fixed',
      validFrom: '2024-03-01',
      validTo: '2024-03-31',
      status: 'active',
      used: 12,
      limit: 50
    },
    {
      id: '2',
      productId: '2',
      productName: 'Marketing Automation Suite', 
      name: '20% Launch Discount',
      discount: 20,
      discountType: 'percentage',
      validFrom: '2024-02-15',
      validTo: '2024-04-15',
      status: 'active',
      used: 8,
      limit: 100
    }
  ])

  const categoryColors = {
    A: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    B: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    C: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    D: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    E: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    archived: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOffers = offers.filter(offer =>
    offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.productName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = (productData: Omit<Product, 'id' | 'created' | 'totalSales' | 'conversionRate'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      created: new Date().toISOString().split('T')[0],
      totalSales: 0,
      conversionRate: 0
    }
    setProducts(prev => [...prev, newProduct])
  }

  const handleEditProduct = (id: string) => {
    const product = products.find(p => p.id === id)
    if (product) {
      setEditingItem(product)
      setShowAddModal(true)
    }
  }

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'created' | 'totalSales' | 'conversionRate'>) => {
    if (editingItem && 'totalSales' in editingItem) {
      setProducts(prev => prev.map(p => 
        p.id === editingItem.id 
          ? { ...editingItem, ...productData }
          : p
      ))
      setEditingItem(null)
    }
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Background */}
      <div className="absolute inset-0 top-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 dark:from-slate-950/50 dark:via-slate-900/30 dark:to-slate-800/50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Products & Offers</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your product catalog and promotional offers
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {activeTab === 'products' ? 'Product' : 'Offer'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <Breadcrumb />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Products</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active Offers</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {offers.filter(o => o.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Sales</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {products.reduce((sum, p) => sum + p.totalSales, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <MoreVertical className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Conversion</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {(products.reduce((sum, p) => sum + p.conversionRate, 0) / products.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-1 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'products'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'offers'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Offers
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Products Table */}
        {activeTab === 'products' && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Commission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{product.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{product.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[product.category]}`}>
                            Product {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">
                          {product.commission}%
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900 dark:text-slate-100">{product.totalSales} sales</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{product.conversionRate}% conv.</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[product.status]}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditProduct(product.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Offers Table */}
        {activeTab === 'offers' && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Offer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Discount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valid Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                    {filteredOffers.map((offer) => (
                      <motion.tr
                        key={offer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{offer.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900 dark:text-slate-100">{offer.productName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {offer.discountType === 'percentage' ? `${offer.discount}%` : `$${offer.discount}`}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900 dark:text-slate-100">
                            {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validTo).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900 dark:text-slate-100">
                            {offer.used}{offer.limit ? ` / ${offer.limit}` : ''}
                          </div>
                          {offer.limit && (
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${(offer.used / offer.limit) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[offer.status]}`}>
                            {offer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Archive className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingItem(null)
          }}
          product={editingItem && 'totalSales' in editingItem ? editingItem : null}
          onSave={editingItem && 'totalSales' in editingItem ? handleUpdateProduct : handleAddProduct}
        />
      </div>
    </div>
  )
}
