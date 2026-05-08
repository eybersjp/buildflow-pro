import type { Metadata } from 'next';

// ═══════════════════════════════════════════
// PAGE METADATA
// Replace with actual page details
// ═══════════════════════════════════════════
export const metadata: Metadata = {
  title: '[Page Title] | [App Name]',
  description: '[Page description for SEO]',
};

// ═══════════════════════════════════════════
// DATA FETCHING (Server Component)
// ═══════════════════════════════════════════
async function getData() {
  // TODO: Replace with actual data fetching
  // const { data, error } = await service.getItems({ tenantId });
  return { items: [] };
}

// ═══════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════
export default async function [PageName]Page() {
  const { items } = await getData();

  return (
    <main className="container mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">[Page Title]</h1>
          <p className="text-muted-foreground mt-1">[Page subtitle or description]</p>
        </div>
        {/* Primary Action */}
        <button
          id="create-[feature]-btn"
          className="btn btn-primary"
        >
          [Primary Action]
        </button>
      </div>

      {/* Loading State — use this pattern with Suspense */}
      {/* <[PageName]Skeleton /> */}

      {/* Empty State */}
      {items.length === 0 && (
        <div
          role="status"
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          {/* Empty state icon */}
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            {/* <IconName className="w-8 h-8 text-muted-foreground" /> */}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No [items] yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            [Description of what user can do to get started]
          </p>
          <button className="btn btn-primary">
            [Create First Item]
          </button>
        </div>
      )}

      {/* Data State */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id}>
              {/* <[Feature]Card item={item} /> */}
            </div>
          ))}
        </div>
      )}

      {/* Error State — wrap in ErrorBoundary in parent layout */}
    </main>
  );
}
