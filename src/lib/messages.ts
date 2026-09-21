import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { VIP_TOPIC } from "@/lib/mail-templates";
import { getDb } from "@/lib/mongo";

export const TOPICS = [
  "Fan support",
  "Press and partnerships",
  "Report an impersonator",
  "Something else",
  VIP_TOPIC,
] as const;

export type MessageStatus = "new" | "read" | "replied" | "archived";
export const STATUSES: MessageStatus[] = ["new", "read", "replied", "archived"];

type Reply = { body: string; sentAt: Date; resendId?: string };

type MessageDoc = {
  name: string;
  email: string;
  topic: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
  replies: Reply[];
};

/** Plain, serialisable shape handed to admin pages. */
export type Message = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  replies: { body: string; sentAt: string }[];
};

async function collection() {
  return (await getDb()).collection<MessageDoc>("messages");
}

function toMessage(d: WithId<MessageDoc>): Message {
  return {
    id: d._id.toHexString(),
    name: d.name,
    email: d.email,
    topic: d.topic,
    message: d.message,
    status: d.status,
    createdAt: d.createdAt.toISOString(),
    replies: d.replies.map((r) => ({ body: r.body, sentAt: r.sentAt.toISOString() })),
  };
}

const toObjectId = (id: string) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

export async function createMessage(
  input: Pick<MessageDoc, "name" | "email" | "topic" | "message">,
) {
  const col = await collection();
  const doc: MessageDoc = { ...input, status: "new", createdAt: new Date(), replies: [] };
  const { insertedId } = await col.insertOne(doc);
  return insertedId.toHexString();
}

export async function listMessages(status?: MessageStatus) {
  const col = await collection();
  // The default inbox hides archived messages
  const filter = status ? { status } : { status: { $ne: "archived" as const } };
  const docs = await col.find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map(toMessage);
}

export async function countByStatus() {
  const col = await collection();
  const rows = await col
    .aggregate<{ _id: MessageStatus; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }])
    .toArray();
  const counts: Record<MessageStatus, number> = { new: 0, read: 0, replied: 0, archived: 0 };
  for (const r of rows) counts[r._id] = r.n;
  return counts;
}

export async function getMessage(id: string) {
  const oid = toObjectId(id);
  if (!oid) return null;
  const doc = await (await collection()).findOne({ _id: oid });
  return doc ? toMessage(doc) : null;
}

export async function setStatus(id: string, status: MessageStatus) {
  const oid = toObjectId(id);
  if (!oid) return;
  await (await collection()).updateOne({ _id: oid }, { $set: { status } });
}

/** Opening a new message marks it read; other states are left alone. */
export async function markRead(id: string) {
  const oid = toObjectId(id);
  if (!oid) return;
  await (await collection()).updateOne({ _id: oid, status: "new" }, { $set: { status: "read" } });
}

export async function addReply(id: string, body: string, resendId?: string) {
  const oid = toObjectId(id);
  if (!oid) return;
  await (
    await collection()
  ).updateOne(
    { _id: oid },
    { $push: { replies: { body, sentAt: new Date(), resendId } }, $set: { status: "replied" } },
  );
}
