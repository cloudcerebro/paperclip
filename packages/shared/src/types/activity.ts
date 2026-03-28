export interface ActivityEvent {
  id: string;
  companyId: string;
  actorType: "agent" | "user" | "system";
  actorId: string;
  actorName: string | null;
  action: string;
  entityType: string;
  entityId: string;
  agentId: string | null;
  runId: string | null;
  details: Record<string, unknown> | null;
  createdAt: Date;
}
