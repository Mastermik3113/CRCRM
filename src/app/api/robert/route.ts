import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Robert — Car Rental CRM AI assistant.
 *
 * Uses Claude Sonnet 4.6 with tool calling against Supabase. All tools run
 * under the authenticated user's session (cookies), so they respect RLS.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Json = Record<string, unknown>;

async function sbClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // ignore
            }
          }
        },
      },
    }
  );
}

// ---------------------------------------------------------------------------
// Tool definitions (Anthropic tool-use schema)
// ---------------------------------------------------------------------------

const tools: Anthropic.Messages.Tool[] = [
  {
    name: "list_vehicles",
    description: "List vehicles in the fleet. Optionally filter by status.",
    input_schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["available", "rented", "maintenance", "out_of_service"],
        },
      },
    },
  },
  {
    name: "list_clients",
    description: "List clients in the CRM.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_rentals",
    description: "List rentals. Optionally filter by status.",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["reserved", "active", "completed", "cancelled"] },
      },
    },
  },
  {
    name: "list_payments",
    description: "List payments, newest first.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_recurring_expenses",
    description: "List recurring expenses (rent, insurance, subscriptions).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "get_business_summary",
    description:
      "Get an at-a-glance business summary: vehicle counts, active rentals, monthly revenue, monthly expenses, net profit.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "create_vehicle",
    description: "Add a new vehicle to the fleet. VIN and plate must be unique.",
    input_schema: {
      type: "object",
      properties: {
        make: { type: "string" },
        model: { type: "string" },
        year: { type: "integer" },
        vin: { type: "string" },
        license_plate: { type: "string" },
        color: { type: "string" },
        odometer: { type: "integer" },
        daily_rate: { type: "number" },
        weekly_rate: { type: "number" },
        monthly_rate: { type: "number" },
        status: { type: "string", enum: ["available", "rented", "maintenance", "out_of_service"] },
      },
      required: ["make", "model", "year", "vin", "license_plate"],
    },
  },
  {
    name: "create_client",
    description: "Add a new client.",
    input_schema: {
      type: "object",
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        address: { type: "string" },
        drivers_license_number: { type: "string" },
        lead_status: { type: "string", enum: ["inquiry", "contacted", "converted", "lost"] },
        lead_source: { type: "string", enum: ["whatsapp", "phone", "walkin", "other"] },
      },
      required: ["first_name", "last_name"],
    },
  },
  {
    name: "create_booking",
    description: "Create a rental booking. vehicle_id and client_id must reference existing records.",
    input_schema: {
      type: "object",
      properties: {
        vehicle_id: { type: "string" },
        client_id: { type: "string" },
        start_date: { type: "string", description: "YYYY-MM-DD" },
        end_date: { type: "string", description: "YYYY-MM-DD" },
        rate_type: { type: "string", enum: ["daily", "weekly", "monthly"] },
        rate_amount: { type: "number" },
        total_amount: { type: "number" },
        security_deposit_amount: { type: "number" },
        status: { type: "string", enum: ["reserved", "active", "completed", "cancelled"] },
      },
      required: ["vehicle_id", "client_id", "start_date", "end_date", "rate_type", "rate_amount", "total_amount"],
    },
  },
  {
    name: "log_payment",
    description: "Record a payment against a rental.",
    input_schema: {
      type: "object",
      properties: {
        rental_id: { type: "string" },
        amount: { type: "number" },
        payment_method: { type: "string", enum: ["cash", "zelle", "check"] },
        payment_date: { type: "string", description: "YYYY-MM-DD" },
        reference_number: { type: "string" },
      },
      required: ["rental_id", "amount", "payment_method", "payment_date"],
    },
  },
  {
    name: "log_service",
    description: "Log a service record for a vehicle (oil change, brakes, etc.).",
    input_schema: {
      type: "object",
      properties: {
        vehicle_id: { type: "string" },
        service_type: { type: "string" },
        description: { type: "string" },
        cost: { type: "number" },
        service_date: { type: "string", description: "YYYY-MM-DD" },
        next_service_date: { type: "string", description: "YYYY-MM-DD" },
        odometer_at_service: { type: "integer" },
      },
      required: ["vehicle_id", "service_type", "cost", "service_date"],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool executor
// ---------------------------------------------------------------------------

async function runTool(name: string, input: Json): Promise<Json> {
  const sb = await sbClient();

  switch (name) {
    case "list_vehicles": {
      let q = sb.from("vehicles").select("*").order("created_at", { ascending: false });
      if (typeof input.status === "string") q = q.eq("status", input.status);
      const { data, error } = await q;
      if (error) return { error: error.message };
      return { count: data?.length ?? 0, vehicles: data };
    }
    case "list_clients": {
      const { data, error } = await sb.from("clients").select("*").order("created_at", { ascending: false });
      if (error) return { error: error.message };
      return { count: data?.length ?? 0, clients: data };
    }
    case "list_rentals": {
      let q = sb.from("rentals").select("*").order("start_date", { ascending: false });
      if (typeof input.status === "string") q = q.eq("status", input.status);
      const { data, error } = await q;
      if (error) return { error: error.message };
      return { count: data?.length ?? 0, rentals: data };
    }
    case "list_payments": {
      const { data, error } = await sb.from("payments").select("*").order("payment_date", { ascending: false });
      if (error) return { error: error.message };
      return { count: data?.length ?? 0, payments: data };
    }
    case "list_recurring_expenses": {
      const { data, error } = await sb.from("recurring_expenses").select("*").order("next_due", { ascending: true });
      if (error) return { error: error.message };
      return { count: data?.length ?? 0, recurring: data };
    }
    case "get_business_summary": {
      const [vRes, rRes, pRes, reRes, eRes] = await Promise.all([
        sb.from("vehicles").select("*"),
        sb.from("rentals").select("*"),
        sb.from("payments").select("*"),
        sb.from("recurring_expenses").select("*"),
        sb.from("expenses").select("*"),
      ]);
      const vehicles = vRes.data ?? [];
      const rentals = rRes.data ?? [];
      const payments = pRes.data ?? [];
      const recurring = reRes.data ?? [];
      const expenses = eRes.data ?? [];

      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

      const monthlyRevenue = payments
        .filter((p) => p.payment_date.startsWith(month))
        .reduce((s, p) => s + Number(p.amount), 0);

      const monthlyRecurring = recurring
        .filter((r) => r.active)
        .reduce((s, r) => {
          const a = Number(r.amount);
          switch (r.frequency) {
            case "weekly": return s + a * 4.33;
            case "monthly": return s + a;
            case "quarterly": return s + a / 3;
            case "yearly": return s + a / 12;
            default: return s;
          }
        }, 0);

      const oneTime = expenses
        .filter((e) => e.expense_date.startsWith(month))
        .reduce((s, e) => s + Number(e.amount), 0);

      return {
        fleet: {
          total: vehicles.length,
          available: vehicles.filter((v) => v.status === "available").length,
          rented: vehicles.filter((v) => v.status === "rented").length,
          maintenance: vehicles.filter((v) => v.status === "maintenance").length,
        },
        rentals: {
          total: rentals.length,
          active: rentals.filter((r) => r.status === "active").length,
          reserved: rentals.filter((r) => r.status === "reserved").length,
        },
        finance_this_month: {
          revenue: monthlyRevenue,
          expenses_recurring: Math.round(monthlyRecurring * 100) / 100,
          expenses_one_time: oneTime,
          net_profit: Math.round((monthlyRevenue - monthlyRecurring - oneTime) * 100) / 100,
        },
      };
    }
    case "create_vehicle": {
      const payload = {
        make: String(input.make ?? ""),
        model: String(input.model ?? ""),
        year: Number(input.year ?? 0),
        vin: String(input.vin ?? ""),
        license_plate: String(input.license_plate ?? ""),
        color: input.color ? String(input.color) : null,
        odometer: input.odometer != null ? Number(input.odometer) : 0,
        daily_rate: input.daily_rate != null ? Number(input.daily_rate) : null,
        weekly_rate: input.weekly_rate != null ? Number(input.weekly_rate) : null,
        monthly_rate: input.monthly_rate != null ? Number(input.monthly_rate) : null,
        status: (input.status as string) ?? "available",
      };
      const { data, error } = await sb.from("vehicles").insert(payload).select("*").single();
      if (error) return { error: error.message };
      return { ok: true, vehicle: data };
    }
    case "create_client": {
      const payload = {
        first_name: String(input.first_name ?? ""),
        last_name: String(input.last_name ?? ""),
        email: input.email ? String(input.email) : null,
        phone: input.phone ? String(input.phone) : null,
        address: input.address ? String(input.address) : null,
        drivers_license_number: input.drivers_license_number ? String(input.drivers_license_number) : null,
        lead_status: (input.lead_status as string) ?? "inquiry",
        lead_source: (input.lead_source as string) ?? "other",
      };
      const { data, error } = await sb.from("clients").insert(payload).select("*").single();
      if (error) return { error: error.message };
      return { ok: true, client: data };
    }
    case "create_booking": {
      const payload = {
        vehicle_id: String(input.vehicle_id),
        client_id: String(input.client_id),
        start_date: String(input.start_date),
        end_date: String(input.end_date),
        rate_type: String(input.rate_type),
        rate_amount: Number(input.rate_amount),
        total_amount: Number(input.total_amount),
        security_deposit_amount: input.security_deposit_amount != null ? Number(input.security_deposit_amount) : 0,
        status: (input.status as string) ?? "reserved",
      };
      const { data, error } = await sb.from("rentals").insert(payload).select("*").single();
      if (error) return { error: error.message };
      return { ok: true, rental: data };
    }
    case "log_payment": {
      const payload = {
        rental_id: String(input.rental_id),
        amount: Number(input.amount),
        payment_method: String(input.payment_method),
        payment_date: String(input.payment_date),
        reference_number: input.reference_number ? String(input.reference_number) : null,
      };
      const { data, error } = await sb.from("payments").insert(payload).select("*").single();
      if (error) return { error: error.message };
      return { ok: true, payment: data };
    }
    case "log_service": {
      const payload = {
        vehicle_id: String(input.vehicle_id),
        service_type: String(input.service_type),
        description: input.description ? String(input.description) : null,
        cost: Number(input.cost),
        service_date: String(input.service_date),
        next_service_date: input.next_service_date ? String(input.next_service_date) : null,
        odometer_at_service: input.odometer_at_service != null ? Number(input.odometer_at_service) : null,
      };
      const { data, error } = await sb.from("service_logs").insert(payload).select("*").single();
      if (error) return { error: error.message };
      return { ok: true, service_log: data };
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are Robert, the professional AI assistant for Car Rental CRM — a back-office tool for a car rental business.

Your job is to help the operator manage their fleet, clients, bookings, payments, service logs, and recurring expenses. You have direct tool access to the live Supabase database. Every tool call reads or writes real data.

Rules:
- Be concise and professional. Short, direct answers.
- When the operator asks to add, create, or log something, use the matching tool.
- When they ask for numbers or status, prefer get_business_summary for the big picture, or a specific list_* tool for details.
- For create/log tools, confirm the result in one short sentence after the call.
- Dates must be ISO YYYY-MM-DD. If the user says "today" or "tomorrow", compute it.
- Never make up IDs. If you need a vehicle_id or client_id, call list_vehicles or list_clients first.
- Never invent data. If you don't know, use a tool or ask.
- Currency is USD unless the user says otherwise.`;

interface InboundMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Robert isn't configured. Add ANTHROPIC_API_KEY to your environment variables (Vercel → Project Settings → Environment Variables, then redeploy).",
      },
      { status: 503 }
    );
  }

  let body: { messages: InboundMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const history: Anthropic.Messages.MessageParam[] = (body.messages ?? []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    // Tool loop — up to 6 rounds
    for (let i = 0; i < 6; i++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        tools,
        messages: history,
      });

      // Append the full assistant turn (text + any tool_use blocks) to history
      history.push({ role: "assistant", content: response.content });

      if (response.stop_reason === "end_turn") {
        const textBlocks = response.content.filter(
          (b): b is Anthropic.Messages.TextBlock => b.type === "text"
        );
        return NextResponse.json({
          reply: textBlocks.map((b) => b.text).join("\n").trim(),
        });
      }

      if (response.stop_reason === "tool_use") {
        const toolUses = response.content.filter(
          (b): b is Anthropic.Messages.ToolUseBlock => b.type === "tool_use"
        );
        const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
        for (const tu of toolUses) {
          const result = await runTool(tu.name, (tu.input ?? {}) as Json);
          toolResults.push({
            type: "tool_result",
            tool_use_id: tu.id,
            content: JSON.stringify(result),
          });
        }
        history.push({ role: "user", content: toolResults });
        continue;
      }

      // Any other stop reason — give up with whatever text we have
      const textBlocks = response.content.filter(
        (b): b is Anthropic.Messages.TextBlock => b.type === "text"
      );
      return NextResponse.json({
        reply: textBlocks.map((b) => b.text).join("\n").trim() || "(no reply)",
      });
    }

    return NextResponse.json({ reply: "Hit tool-call limit without finishing. Try a simpler request." });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
