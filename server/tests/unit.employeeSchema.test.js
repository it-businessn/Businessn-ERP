/**
 * SCHEMA-CLEANUP: Employee fields nothing reads or writes were removed from the
 * schema; scripts/remove-unused-employee-fields.js clears stored values.
 */
const Employee = require("../models/Employee");
const { planCounts, unsetAll } = require("../scripts/remove-unused-employee-fields");

const { REMOVED_EMPLOYEE_FIELDS } = Employee;

test("SC-01 removed fields are not in the schema; fields still in use are", () => {
	for (const f of REMOVED_EMPLOYEE_FIELDS) expect(Employee.schema.path(f)).toBeUndefined();
	for (const f of ["email", "fullName", "position", "dateOfJoining", "isActive", "baseModule", "companyId"]) {
		expect(Employee.schema.path(f)).toBeDefined();
	}
});

test("SC-02 a save drops removed fields (e.g. employmentType sent by an old form)", () => {
	const doc = new Employee({ email: "a@example.test", employmentType: "Full time", otp: "123456" });
	expect(doc.toObject().employmentType).toBeUndefined();
	expect(doc.toObject().otp).toBeUndefined();
});

test("SC-03 the cleanup script counts and unsets exactly those fields", async () => {
	const collection = { countDocuments: jest.fn(async (q) => (Object.keys(q)[0] === "otp" ? 2 : 0)) };
	const counts = await planCounts(collection, REMOVED_EMPLOYEE_FIELDS);
	expect(counts.otp).toBe(2);
	expect(Object.keys(counts)).toEqual(REMOVED_EMPLOYEE_FIELDS);
	expect(unsetAll(["otp", "lastLogin"])).toEqual({ $unset: { otp: "", lastLogin: "" } });
});
