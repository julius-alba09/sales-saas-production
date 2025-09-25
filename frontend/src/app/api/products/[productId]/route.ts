import { Database } from '@/types/supabase'
import { productSchema } from '@/lib/validation'
import { withValidation, withRoleAuth, executeQuery, successResponse, logSecurityEvent, APIError } from '@/lib/api-utils'

interface RouteParams {
  params: { productId: string }
}

// GET /api/products/[productId] - Get specific product
export const GET = withRoleAuth(
  ['owner', 'admin', 'member', 'viewer'],
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      const product = await executeQuery(
        () => supabase
          .from('products')
          .select('*')
          .eq('id', params.productId)
          .eq('workspace_id', workspaceMember.workspace.id)
          .single(),
        'Product not found'
      )

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'PRODUCT_ACCESSED',
        resource: `/api/products/${params.productId}`,
        metadata: { productId: params.productId, productName: product.name },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse(product)
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'PRODUCT_ACCESS_ERROR',
        resource: `/api/products/${params.productId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)

// PUT /api/products/[productId] - Update product
export const PUT = withValidation(
  productSchema.partial(), // Allow partial updates
  withRoleAuth(
    ['owner', 'admin'],
    async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
      const updateData = await req.json()
      
      try {
        // Check if product exists and belongs to workspace
        await executeQuery(
          () => supabase
            .from('products')
            .select('id, name')
            .eq('id', params.productId)
            .eq('workspace_id', workspaceMember.workspace.id)
            .single(),
          'Product not found'
        )

        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update({
            ...updateData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.productId)
          .eq('workspace_id', workspaceMember.workspace.id)
          .select('*')
          .single()

        if (error) {
          throw new Error('Failed to update product')
        }

        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'PRODUCT_UPDATED',
          resource: `/api/products/${params.productId}`,
          metadata: { 
            productId: params.productId,
            productName: updatedProduct.name,
            changes: Object.keys(updateData)
          },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        })

        return successResponse(updatedProduct, 'Product updated successfully')
      } catch (error) {
        logSecurityEvent({
          userId: user.id,
          workspaceId: workspaceMember.workspace.id,
          action: 'PRODUCT_UPDATE_ERROR',
          resource: `/api/products/${params.productId}`,
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
          ip: req.ip,
          userAgent: req.headers.get('user-agent') || undefined,
        }, 'error')
        throw error
      }
    }
  )
)

// DELETE /api/products/[productId] - Delete product
export const DELETE = withRoleAuth(
  ['owner', 'admin'],
  async (req, user, workspaceMember, supabase, { params }: RouteParams) => {
    try {
      // Check if product exists and belongs to workspace
      const product = await executeQuery(
        () => supabase
          .from('products')
          .select('id, name, is_active')
          .eq('id', params.productId)
          .eq('workspace_id', workspaceMember.workspace.id)
          .single(),
        'Product not found'
      )

      // Soft delete - mark as inactive instead of hard delete
      const { error } = await supabase
        .from('products')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.productId)
        .eq('workspace_id', workspaceMember.workspace.id)

      if (error) {
        throw new Error('Failed to delete product')
      }

      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'PRODUCT_DELETED',
        resource: `/api/products/${params.productId}`,
        metadata: { 
          productId: params.productId,
          productName: product.name
        },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return successResponse(null, 'Product deleted successfully')
    } catch (error) {
      logSecurityEvent({
        userId: user.id,
        workspaceId: workspaceMember.workspace.id,
        action: 'PRODUCT_DELETE_ERROR',
        resource: `/api/products/${params.productId}`,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        ip: req.ip,
        userAgent: req.headers.get('user-agent') || undefined,
      }, 'error')
      throw error
    }
  }
)