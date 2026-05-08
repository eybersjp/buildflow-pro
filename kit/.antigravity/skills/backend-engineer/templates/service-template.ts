import { z } from 'zod';
import { createServiceClient } from '@/lib/supabase/service';
import { logger } from '@/lib/logger';

// ═══════════════════════════════════════════
// INPUT VALIDATION SCHEMA
// ═══════════════════════════════════════════
export const create[Feature]Schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500).optional(),
  // Add more fields
});

export type Create[Feature]Input = z.infer<typeof create[Feature]Schema>;

// ═══════════════════════════════════════════
// SERVICE CONTEXT TYPE
// ═══════════════════════════════════════════
type ServiceContext = {
  tenantId: string;
  userId: string;
  userRole: string;
};

type ServiceResult<T> = {
  data: T | null;
  error: string | null;
};

// ═══════════════════════════════════════════
// CREATE FUNCTION
// ═══════════════════════════════════════════
export async function create[Feature](
  input: Create[Feature]Input,
  ctx: ServiceContext
): Promise<ServiceResult<[Feature]>> {
  // 1. Validate input
  const parsed = create[Feature]Schema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: 'Invalid input: ' + parsed.error.message };
  }

  // 2. Authorize
  const allowedRoles = ['admin', 'manager'];
  if (!allowedRoles.includes(ctx.userRole)) {
    logger.warn('[Feature].create.unauthorized', { userId: ctx.userId, role: ctx.userRole });
    return { data: null, error: 'Insufficient permissions' };
  }

  // 3. Execute
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('[feature]s')
      .insert({
        ...parsed.data,
        tenant_id: ctx.tenantId,
        created_by: ctx.userId,
      })
      .select()
      .single();

    if (error) throw error;

    // 4. Audit log
    await logAudit(ctx, '[feature]', data.id, 'create');

    logger.info('[Feature].created', { id: data.id, tenantId: ctx.tenantId });
    return { data, error: null };
  } catch (err) {
    logger.error('[Feature].create.failed', { err, ctx });
    return { data: null, error: 'Failed to create [feature]. Please try again.' };
  }
}

// ═══════════════════════════════════════════
// LIST FUNCTION
// ═══════════════════════════════════════════
export async function list[Feature]s(
  ctx: ServiceContext,
  options: { page?: number; pageSize?: number } = {}
): Promise<ServiceResult<[Feature][]>> {
  const { page = 1, pageSize = 50 } = options;

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('[feature]s')
      .select('*')
      .eq('tenant_id', ctx.tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;
    return { data: data ?? [], error: null };
  } catch (err) {
    logger.error('[Feature].list.failed', { err, ctx });
    return { data: null, error: 'Failed to load [feature]s.' };
  }
}

// ═══════════════════════════════════════════
// AUDIT HELPER
// ═══════════════════════════════════════════
async function logAudit(
  ctx: ServiceContext,
  entityType: string,
  entityId: string,
  action: string
) {
  const supabase = createServiceClient();
  await supabase.from('audit_log').insert({
    tenant_id: ctx.tenantId,
    actor_id: ctx.userId,
    entity_type: entityType,
    entity_id: entityId,
    action,
  });
}
