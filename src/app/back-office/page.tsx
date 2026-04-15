"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Receipt,
  TrendingDown,
  TrendingUp,
  Plus,
  Repeat,
  CalendarClock,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/stat-card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  demoRecurringExpenses,
  demoOneTimeExpenses,
  demoPayments,
  demoVehicles,
  expenseCategoryLabels,
  type ExpenseCategory,
  type Frequency,
  type RecurringExpense,
  type OneTimeExpense,
} from "@/lib/demo-data";

type TabId = "recurring" | "expenses" | "pnl";

const frequencyLabels: Record<Frequency, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const categoryColors: Record<ExpenseCategory, string> = {
  insurance: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  rent: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  software: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400",
  fuel: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  maintenance: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  parking: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
  marketing: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
  payroll: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  utilities: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  supplies: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  legal: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
  other: "bg-muted text-muted-foreground",
};

function CategoryBadge({ category }: { category: ExpenseCategory }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", categoryColors[category])}>
      {expenseCategoryLabels[category]}
    </span>
  );
}

function monthlyNormalize(r: RecurringExpense): number {
  switch (r.frequency) {
    case "weekly": return r.amount * 4.33;
    case "monthly": return r.amount;
    case "quarterly": return r.amount / 3;
    case "yearly": return r.amount / 12;
  }
}

// ---------------------------------------------------------------------------
// Recurring Expense Dialog
// ---------------------------------------------------------------------------

interface RecurringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  expense?: RecurringExpense | null;
  onSave: (exp: RecurringExpense) => void;
  onDelete?: (id: string) => void;
}

function RecurringExpenseDialog({ open, onOpenChange, mode, expense, onSave, onDelete }: RecurringDialogProps) {
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("software");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [nextDue, setNextDue] = useState("");
  const [active, setActive] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && expense) {
      setName(expense.name);
      setVendor(expense.vendor);
      setCategory(expense.category);
      setAmount(String(expense.amount));
      setFrequency(expense.frequency);
      setNextDue(expense.next_due);
      setActive(expense.active);
      setNotes(expense.notes ?? "");
    } else {
      setName("");
      setVendor("");
      setCategory("software");
      setAmount("");
      setFrequency("monthly");
      setNextDue(new Date().toISOString().split("T")[0]);
      setActive(true);
      setNotes("");
    }
  }, [open, mode, expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: RecurringExpense = {
      id: mode === "edit" && expense ? expense.id : `re${Date.now()}`,
      name: name.trim(),
      vendor: vendor.trim(),
      category,
      amount: Number(amount) || 0,
      frequency,
      next_due: nextDue,
      active,
      notes: notes.trim() || null,
    };
    onSave(saved);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Recurring Expense" : "Add Recurring Expense"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update this recurring bill." : "Set up a new recurring expense (rent, insurance, subscriptions...)."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="re_name">Name *</Label>
            <Input id="re_name" required placeholder="e.g. Fleet Insurance" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="re_vendor">Vendor *</Label>
            <Input id="re_vendor" required placeholder="e.g. Progressive Commercial" value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="re_cat">Category *</Label>
              <select
                id="re_cat"
                required
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                {Object.entries(expenseCategoryLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="re_amount">Amount ($) *</Label>
              <Input id="re_amount" type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="re_freq">Frequency *</Label>
              <select
                id="re_freq"
                required
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
              >
                {Object.entries(frequencyLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="re_next">Next Due *</Label>
              <Input id="re_next" type="date" required value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="re_active"
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary/20"
            />
            <Label htmlFor="re_active" className="text-sm font-normal cursor-pointer">
              Active (included in monthly total)
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="re_notes">Notes</Label>
            <Textarea id="re_notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <DialogFooter className="flex flex-row justify-between gap-2 pt-2">
            {mode === "edit" && onDelete && expense ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("Delete this recurring expense?")) {
                    onDelete(expense.id);
                    onOpenChange(false);
                  }
                }}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                {mode === "edit" ? "Save Changes" : "Add Expense"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// One-Time Expense Dialog
// ---------------------------------------------------------------------------

interface OneTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  expense?: OneTimeExpense | null;
  onSave: (exp: OneTimeExpense) => void;
  onDelete?: (id: string) => void;
}

function OneTimeExpenseDialog({ open, onOpenChange, mode, expense, onSave, onDelete }: OneTimeDialogProps) {
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("other");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && expense) {
      setDescription(expense.description);
      setVendor(expense.vendor ?? "");
      setCategory(expense.category);
      setAmount(String(expense.amount));
      setExpenseDate(expense.expense_date);
      setVehicleId(expense.vehicle_id ?? "");
      setNotes(expense.notes ?? "");
    } else {
      setDescription("");
      setVendor("");
      setCategory("other");
      setAmount("");
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setVehicleId("");
      setNotes("");
    }
  }, [open, mode, expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved: OneTimeExpense = {
      id: mode === "edit" && expense ? expense.id : `ex${Date.now()}`,
      description: description.trim(),
      vendor: vendor.trim() || null,
      category,
      amount: Number(amount) || 0,
      expense_date: expenseDate,
      vehicle_id: vehicleId || null,
      notes: notes.trim() || null,
    };
    onSave(saved);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Expense" : "Log Expense"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update this expense record." : "Record a one-time business expense."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="ot_desc">Description *</Label>
            <Input id="ot_desc" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ot_vendor">Vendor</Label>
              <Input id="ot_vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ot_amount">Amount ($) *</Label>
              <Input id="ot_amount" type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ot_cat">Category *</Label>
              <select
                id="ot_cat"
                required
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              >
                {Object.entries(expenseCategoryLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ot_date">Date *</Label>
              <Input id="ot_date" type="date" required value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ot_vehicle">Related Vehicle</Label>
            <select
              id="ot_vehicle"
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">None (general business expense)</option>
              {demoVehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} — {v.license_plate}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ot_notes">Notes</Label>
            <Textarea id="ot_notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <DialogFooter className="flex flex-row justify-between gap-2 pt-2">
            {mode === "edit" && onDelete && expense ? (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("Delete this expense?")) {
                    onDelete(expense.id);
                    onOpenChange(false);
                  }
                }}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                {mode === "edit" ? "Save Changes" : "Log Expense"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Main Back Office Page
// ---------------------------------------------------------------------------

export default function BackOfficePage() {
  const [activeTab, setActiveTab] = useState<TabId>("recurring");

  const [recurring, setRecurring] = useState<RecurringExpense[]>(demoRecurringExpenses);
  const [expenses, setExpenses] = useState<OneTimeExpense[]>(demoOneTimeExpenses);

  const [recurringSearch, setRecurringSearch] = useState("");
  const [expenseSearch, setExpenseSearch] = useState("");

  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [recurringDialogMode, setRecurringDialogMode] = useState<"add" | "edit">("add");
  const [editingRecurring, setEditingRecurring] = useState<RecurringExpense | null>(null);

  const [oneTimeDialogOpen, setOneTimeDialogOpen] = useState(false);
  const [oneTimeDialogMode, setOneTimeDialogMode] = useState<"add" | "edit">("add");
  const [editingOneTime, setEditingOneTime] = useState<OneTimeExpense | null>(null);

  // ---------- KPI calcs ----------

  const monthlyRecurring = useMemo(
    () => recurring.filter((r) => r.active).reduce((sum, r) => sum + monthlyNormalize(r), 0),
    [recurring]
  );

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const revenueThisMonth = demoPayments
    .filter((p) => p.payment_date.startsWith(currentMonthKey))
    .reduce((sum, p) => sum + p.amount, 0);

  const oneTimeThisMonth = expenses
    .filter((e) => e.expense_date.startsWith(currentMonthKey))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpensesThisMonth = monthlyRecurring + oneTimeThisMonth;
  const netProfit = revenueThisMonth - totalExpensesThisMonth;
  const profitMargin = revenueThisMonth > 0 ? (netProfit / revenueThisMonth) * 100 : 0;

  const categoryBreakdown = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    recurring
      .filter((r) => r.active)
      .forEach((r) => map.set(r.category, (map.get(r.category) ?? 0) + monthlyNormalize(r)));
    expenses
      .filter((e) => e.expense_date.startsWith(currentMonthKey))
      .forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [recurring, expenses, currentMonthKey]);

  const upcomingDue = useMemo(() => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 14);
    return recurring
      .filter((r) => r.active && new Date(r.next_due) <= soon)
      .sort((a, b) => a.next_due.localeCompare(b.next_due));
  }, [recurring]);

  // ---------- filters ----------

  const filteredRecurring = recurring.filter((r) => {
    if (!recurringSearch) return true;
    const q = recurringSearch.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.vendor.toLowerCase().includes(q);
  });

  const filteredExpenses = expenses
    .slice()
    .sort((a, b) => b.expense_date.localeCompare(a.expense_date))
    .filter((e) => {
      if (!expenseSearch) return true;
      const q = expenseSearch.toLowerCase();
      return e.description.toLowerCase().includes(q) || (e.vendor ?? "").toLowerCase().includes(q);
    });

  // ---------- handlers ----------

  const openAddRecurring = () => {
    setRecurringDialogMode("add");
    setEditingRecurring(null);
    setRecurringDialogOpen(true);
  };
  const openEditRecurring = (exp: RecurringExpense) => {
    setRecurringDialogMode("edit");
    setEditingRecurring(exp);
    setRecurringDialogOpen(true);
  };
  const saveRecurring = (exp: RecurringExpense) => {
    setRecurring((prev) => {
      const idx = prev.findIndex((r) => r.id === exp.id);
      return idx >= 0 ? prev.map((r) => (r.id === exp.id ? exp : r)) : [exp, ...prev];
    });
  };
  const deleteRecurring = (id: string) => {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  };

  const openAddOneTime = () => {
    setOneTimeDialogMode("add");
    setEditingOneTime(null);
    setOneTimeDialogOpen(true);
  };
  const openEditOneTime = (exp: OneTimeExpense) => {
    setOneTimeDialogMode("edit");
    setEditingOneTime(exp);
    setOneTimeDialogOpen(true);
  };
  const saveOneTime = (exp: OneTimeExpense) => {
    setExpenses((prev) => {
      const idx = prev.findIndex((e) => e.id === exp.id);
      return idx >= 0 ? prev.map((e) => (e.id === exp.id ? exp : e)) : [exp, ...prev];
    });
  };
  const deleteOneTime = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "recurring", label: "Recurring Expenses", count: recurring.filter((r) => r.active).length },
    { id: "expenses", label: "Expense Log", count: expenses.length },
    { id: "pnl", label: "P&L Overview" },
  ];

  const getVehicleLabel = (vId: string | null) => {
    if (!vId) return null;
    const v = demoVehicles.find((x) => x.id === vId);
    return v ? `${v.year} ${v.make} ${v.model}` : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Back Office</h1>
          <p className="text-sm text-muted-foreground">
            Track recurring bills, expenses, and business health at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openAddOneTime}>
            <Plus className="mr-2 h-4 w-4" /> Log Expense
          </Button>
          <Button onClick={openAddRecurring} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
            <Repeat className="mr-2 h-4 w-4" /> Add Recurring
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Recurring"
          value={formatCurrency(monthlyRecurring)}
          change={`${recurring.filter((r) => r.active).length} active bills`}
          changeType="neutral"
          icon={Repeat}
          iconColor="text-purple-600"
          iconBg="bg-purple-50 dark:bg-purple-950"
        />
        <StatCard
          title="Total Expenses (Month)"
          value={formatCurrency(totalExpensesThisMonth)}
          change={`${formatCurrency(oneTimeThisMonth)} one-time`}
          changeType="negative"
          icon={TrendingDown}
          iconColor="text-red-600"
          iconBg="bg-red-50 dark:bg-red-950"
        />
        <StatCard
          title="Net Profit (Month)"
          value={formatCurrency(netProfit)}
          change={netProfit >= 0 ? "Profitable" : "At a loss"}
          changeType={netProfit >= 0 ? "positive" : "negative"}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950"
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          change={profitMargin >= 20 ? "Healthy" : profitMargin >= 0 ? "Thin margin" : "Negative"}
          changeType={profitMargin >= 20 ? "positive" : profitMargin >= 0 ? "neutral" : "negative"}
          icon={Building2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50 dark:bg-blue-950"
        />
      </div>

      {/* Upcoming Due + Category Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-amber-600" /> Upcoming (next 14 days)
            </CardTitle>
            <CardDescription className="text-xs">Recurring bills about to hit</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDue.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nothing due in the next two weeks.</p>
            ) : (
              <div className="space-y-2">
                {upcomingDue.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openEditRecurring(r)}
                    className="w-full flex items-center justify-between gap-3 rounded-lg border p-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{r.vendor} &middot; due {formatDate(r.next_due)}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-red-500 shrink-0">{formatCurrency(r.amount)}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spending by Category</CardTitle>
            <CardDescription className="text-xs">This month, recurring + one-time</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No expenses yet.</p>
            ) : (
              <div className="space-y-3">
                {categoryBreakdown.map(([cat, amount]) => {
                  const pct = totalExpensesThisMonth > 0 ? (amount / totalExpensesThisMonth) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <CategoryBadge category={cat} />
                          <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                        </div>
                        <span className="font-medium">{formatCurrency(amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex gap-0 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* RECURRING TAB */}
      {activeTab === "recurring" && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">Recurring Bills</CardTitle>
                <CardDescription className="text-xs">Click any row to edit.</CardDescription>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
                  className="pl-9"
                  value={recurringSearch}
                  onChange={(e) => setRecurringSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Name</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Category</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Frequency</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Next Due</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Amount</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecurring.map((r) => (
                  <TableRow
                    key={r.id}
                    onClick={() => openEditRecurring(r)}
                    className={cn("cursor-pointer hover:bg-muted/50 transition-colors", !r.active && "opacity-50")}
                  >
                    <TableCell>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.vendor}</p>
                    </TableCell>
                    <TableCell><CategoryBadge category={r.category} /></TableCell>
                    <TableCell className="text-sm">{frequencyLabels[r.frequency]}</TableCell>
                    <TableCell className="text-sm">{formatDate(r.next_due)}</TableCell>
                    <TableCell className="text-sm font-medium text-right text-red-500">{formatCurrency(r.amount)}</TableCell>
                    <TableCell>
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecurring.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No recurring expenses. Click &quot;Add Recurring&quot; to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* EXPENSES TAB */}
      {activeTab === "expenses" && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">Expense Log</CardTitle>
                <CardDescription className="text-xs">One-time business expenses. Click any row to edit.</CardDescription>
              </div>
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-9"
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Description</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Category</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Date</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Vehicle</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((e) => (
                  <TableRow
                    key={e.id}
                    onClick={() => openEditOneTime(e)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <p className="text-sm font-medium">{e.description}</p>
                      {e.vendor && <p className="text-xs text-muted-foreground">{e.vendor}</p>}
                    </TableCell>
                    <TableCell><CategoryBadge category={e.category} /></TableCell>
                    <TableCell className="text-sm">{formatDate(e.expense_date)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getVehicleLabel(e.vehicle_id) ?? "—"}</TableCell>
                    <TableCell className="text-sm font-medium text-right text-red-500">{formatCurrency(e.amount)}</TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No expenses logged yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* P&L TAB */}
      {activeTab === "pnl" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profit &amp; Loss — This Month</CardTitle>
            <CardDescription className="text-xs">Quick snapshot of the current month&apos;s financials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Rental Revenue</span>
                <span className="text-sm font-semibold text-emerald-600">{formatCurrency(revenueThisMonth)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground pl-4">Recurring bills (prorated)</span>
                <span className="text-sm text-red-500">−{formatCurrency(monthlyRecurring)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground pl-4">One-time expenses</span>
                <span className="text-sm text-red-500">−{formatCurrency(oneTimeThisMonth)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm font-medium">Total Expenses</span>
                <span className="text-sm font-semibold text-red-500">−{formatCurrency(totalExpensesThisMonth)}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-base font-semibold">Net Profit</span>
                <span className={cn("text-lg font-bold", netProfit >= 0 ? "text-emerald-600" : "text-red-500")}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-muted-foreground">Profit Margin</span>
                <span className={cn("text-xs font-medium", profitMargin >= 20 ? "text-emerald-600" : profitMargin >= 0 ? "text-muted-foreground" : "text-red-500")}>
                  {profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <RecurringExpenseDialog
        open={recurringDialogOpen}
        onOpenChange={setRecurringDialogOpen}
        mode={recurringDialogMode}
        expense={editingRecurring}
        onSave={saveRecurring}
        onDelete={deleteRecurring}
      />
      <OneTimeExpenseDialog
        open={oneTimeDialogOpen}
        onOpenChange={setOneTimeDialogOpen}
        mode={oneTimeDialogMode}
        expense={editingOneTime}
        onSave={saveOneTime}
        onDelete={deleteOneTime}
      />
    </div>
  );
}
