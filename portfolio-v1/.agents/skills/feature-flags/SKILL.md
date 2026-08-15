---
name: feature-flags
description: Implement feature flags for gradual rollouts and A/B testing.
---

# Feature Flags Skill

Implement feature flags for controlled feature rollouts, A/B testing, and environment-based configuration.

## When to use this skill

- Gradual feature rollouts
- A/B testing new features
- Environment-based configuration
- Kill switches for problematic features
- Beta feature management

## Workflow

1. **Define flags** — Create feature flag configuration
2. **Implement checks** — Add flag evaluation in code
3. **Set up targeting** — Define user segments
4. **Monitor usage** — Track flag impact
5. **Clean up** — Remove flags after full rollout

## Implementation Pattern

```typescript
// lib/features.ts
export const FEATURE_FLAGS = {
  NEW_DASHBOARD: {
    enabled: true,
    percentage: 50, // 50% of users
    allowedUsers: ['admin@example.com'],
  },
  BETA_FEATURES: {
    enabled: process.env.NODE_ENV === 'development',
    percentage: 100,
  },
} as const;

export function isFeatureEnabled(
  flag: keyof typeof FEATURE_FLAGS,
  userId?: string
): boolean {
  const config = FEATURE_FLAGS[flag];
  if (!config.enabled) return false;

  if (config.allowedUsers?.includes(userId || '')) return true;

  if (config.percentage === 100) return true;

  // Deterministic percentage based on userId
  if (userId) {
    const hash = hashString(userId);
    return (hash % 100) < config.percentage;
  }

  return false;
}
```

## React Component Usage

```tsx
// components/FeatureGate.tsx
interface FeatureGateProps {
  feature: keyof typeof FEATURE_FLAGS;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const enabled = isFeatureEnabled(feature);

  if (!enabled && fallback) {
    return <>{fallback}</>;
  }

  return enabled ? <>{children}</> : null;
}

// Usage
<FeatureGate feature="NEW_DASHBOARD" fallback={<OldDashboard />}>
  <NewDashboard />
</FeatureGate>
```

## Checklist

- [ ] Feature flags defined in config
- [ ] Flag evaluation implemented
- [ ] User targeting configured
- [ ] Monitoring and analytics added
- [ ] Rollback plan documented
- [ ] Cleanup schedule set
