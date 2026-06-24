import { Router } from "express";
import { z } from "zod";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();

const configuration = {
  mpesaPaybillNumber: "400200"
};

const statements = [
  { transactionId: "ARM-782911", amount: 2500, date: "2026-06-01", vendorId: "VEN-204", userId: "USR-9001" },
  { transactionId: "ARM-782912", amount: 1800, date: "2026-06-02", vendorId: "VEN-204", userId: "USR-9002" },
  { transactionId: "ARM-782913", amount: 3200, date: "2026-06-03", vendorId: "VEN-441", userId: "USR-9003" }
];

const profiles = [
  { id: "USR-9001", name: "Grace Wanjiku", vendorId: "VEN-204", dateSubscribed: "2026-04-18", status: "active" },
  { id: "USR-9002", name: "Brian Otieno", vendorId: "VEN-204", dateSubscribed: "2026-05-03", status: "inactive" },
  { id: "USR-9003", name: "Amina Yusuf", vendorId: "VEN-441", dateSubscribed: "2026-05-24", status: "active" }
];

const configSchema = z.object({
  mpesaPaybillNumber: z.string().min(3).max(12)
});

const profileActionSchema = z.object({
  status: z.enum(["active", "inactive"])
});

const paymentSchema = z.object({
  accountId: z.string().min(3),
  mpesaNumber: z.string().regex(/^07\d{8}$/)
});

router.use(requireAuth);

router.get("/summary", (req, res) => {
  const role = req.auth?.role;
  const scopedStatements = role === "admin" ? statements : statements.filter((item) => item.vendorId === "VEN-204");
  const scopedProfiles = role === "admin" ? profiles : profiles.filter((item) => item.vendorId === "VEN-204");

  return res.json({
    configuration,
    statements: scopedStatements,
    profiles: scopedProfiles,
    manualPayment: {
      paybillNumber: configuration.mpesaPaybillNumber,
      accountId: role === "user" ? "USR-9001" : "VEN-204"
    }
  });
});

router.put("/configuration", allowRoles("admin"), (req, res) => {
  const parsed = configSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Enter a valid M-Pesa Paybill number." });
  }

  if (configuration.mpesaPaybillNumber === parsed.data.mpesaPaybillNumber) {
    return res.json({ message: "Configuration is already up to date.", configuration });
  }

  configuration.mpesaPaybillNumber = parsed.data.mpesaPaybillNumber;
  return res.json({ message: "Billing configuration updated successfully.", configuration });
});

router.patch("/profiles/:id/status", allowRoles("admin", "vendor"), (req, res) => {
  const parsed = profileActionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid profile status." });
  }

  const profile = profiles.find((item) => item.id === req.params.id);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found." });
  }

  profile.status = parsed.data.status;
  return res.json({ message: `Profile ${parsed.data.status === "active" ? "activated" : "blocked"} successfully.`, profile });
});

router.post("/payments/stk-push", allowRoles("vendor", "user"), (req, res) => {
  const parsed = paymentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Enter a valid 10-digit M-Pesa number starting with 07." });
  }

  return res.status(202).json({
    message: "M-Pesa STK push request sent successfully.",
    checkoutRequestId: `ARM-STK-${Date.now()}`
  });
});

export default router;
