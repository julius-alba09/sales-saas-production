import { Database } from '@/types/supabase'
import { productSchema } from '@/lib/validation'
import { withValidation, withRoleAuth, executeQuery, successResponse, logSecurityEvent, parsePaginationParams } from '@/lib/api-utils'

// GET /api/products - List products
export const GET = withRoleAuth(
  ['owner', 'admin', 'member', 'viewer'],
  async (req, user, workspaceMember, supabase) => {
    try {
      const { searchParams } = new URL(req.url)
      const pagination = parsePaginationParams(searchParams)
      const isActive = searchParams.get('active')
      const category = searchParams.get('category')
      const search = searchParams.get('search')
      
      // Build query
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('workspace_id', workspaceMember.workspace.id)
        .order(pagination.sortBy || 'created_at', { 
          ascending: pagination.sortOrder === 'asc' 
        })

      // Apply filters
      if (isActive !== null) {
        query = query.eq('is_active', isActive === 'true')
      }
      
      if (category) {
        query = query.eq('category', category)
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Apply pagination
      query = query.range(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit - 1
      )

      const { data: products, count, error } = await query

      if (error) {
        throw new Error('Failed to fetch products')
      }

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'PRODUCTS_ACCESSED',
        resource: '/api/products',
        metadata: { 
          productCount: products?.length,
          filters: { isActive, category, search }
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse({
        products,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / pagination.limit),
        }
      })
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'PRODUCTS_ACCESS_ERROR',
        resource: '/api/products',
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// POST /api/products - Create product
export const POST = withValidation(
  productSchema,
  withRoleAuth(
    ['owner', 'admin'], // Only owners and admins can create products
    async (req, user, workspaceMember, supabase) => {
      const productData = await req.json()
      
      try {
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            ...productData,
            workspace_id: workspaceMember.workspace.id,
            created_by: user.id,
          })
          .select('*')
          .single()

        if (error) {
          throw new Error('Failed to create product')
        }

        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'PRODUCT_CREATED',
          resource: '/api/products',
          metadata: { 
            productId: newProduct.id,
            productName: newProduct.name,
            price: newProduct.price
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        })

        return successResponse(newProduct, 'Product created successfully', 201)
      } catch (error) {
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'PRODUCT_CREATE_ERROR',
          resource: '/api/products',
          metadata: { 
            error: error instanceof Error ? error.message : 'Unknown error',
            productName: productData.name
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'error')
        throw error
      }
    }
  )
)