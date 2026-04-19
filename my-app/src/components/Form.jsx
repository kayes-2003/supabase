import { useState } from "react";
import supabase from "../supabase-client";

function Form({ metrics, onAdd }) {
    const [nameMode, setNameMode] = useState("existing"); // "existing" | "new"
    const [selectedName, setSelectedName] = useState(metrics?.[0]?.name || "");
    const [newName, setNewName] = useState("");
    const [value, setValue] = useState(0);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const name = nameMode === "new" ? newName.trim() : selectedName;

        if (!name) {
            setError("Please enter a name.");
            return;
        }
        if (!value || Number(value) <= 0) {
            setError("Please enter a valid amount greater than 0.");
            return;
        }

        const newDeal = { name, value: Number(value) };

        setIsPending(true);
        try {
            const { error: supabaseError } = await supabase
                .from("Sales_deals")
                .insert([newDeal]);

            if (supabaseError) throw supabaseError;

            // ✅ Update chart instantly
            onAdd?.(newDeal);

            // ✅ Reset form
            setNewName("");
            setValue(0);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error Adding Deal:", err.message);
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="add-form-container">
            {error && <p className="error-message">⚠️ {error}</p>}
            {success && <p className="success-message">✅ Deal added successfully!</p>}

            <form onSubmit={handleSubmit} aria-label="Add new sales deal">

                {/* Toggle: existing vs new name */}
                <div className="name-mode-toggle">
                    <label>
                        <input
                            type="radio"
                            name="nameMode"
                            value="existing"
                            checked={nameMode === "existing"}
                            onChange={() => setNameMode("existing")}
                            disabled={isPending}
                        />
                        {" "}Existing Person
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="nameMode"
                            value="new"
                            checked={nameMode === "new"}
                            onChange={() => setNameMode("new")}
                            disabled={isPending}
                        />
                        {" "}New Person
                    </label>
                </div>

                {/* Name input */}
                <label htmlFor="deal-name">
                    Name:
                    {nameMode === "existing" ? (
                        <select
                            id="deal-name"
                            value={selectedName}
                            onChange={(e) => setSelectedName(e.target.value)}
                            disabled={isPending || metrics.length === 0}
                        >
                            {metrics.length === 0
                                ? <option value="">No existing people</option>
                                : metrics.map((m) => (
                                    <option key={m.name} value={m.name}>{m.name}</option>
                                ))
                            }
                        </select>
                    ) : (
                        <input
                            id="deal-name"
                            type="text"
                            placeholder="Enter new person's name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            disabled={isPending}
                            required
                        />
                    )}
                </label>

                {/* Amount input */}
                <label htmlFor="deal-value">
                    Amount: $
                    <input
                        type="number"
                        id="deal-value"
                        name="value"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="amount-input"
                        min="1"
                        step="10"
                        aria-required="true"
                        aria-label="Deal amount in dollars"
                        disabled={isPending}
                    />
                </label>

                <button type="submit" disabled={isPending} aria-busy={isPending}>
                    {isPending ? "Adding..." : "Add Deal"}
                </button>
            </form>
        </div>
    );
}

export default Form;